'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { validStatus, writeStatus } = require('./helpers');
const { INCIDENT_GUARDS, incidentDecisionScope, validateReviewIncidents } = require('./review-incidents');
const { loadAndValidateStatus, passClosesStage, run, validateRecordedEvidence, validateStatus } = require('./status-validator');

const REPORT = Buffer.from('# Independent review\r\n\r\nThe complete required scope was independently checked.\r\n');
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

function fixture(result = 'clean', bytes = REPORT) {
  const review = {
    stage: 'stage-02', pass: 1, result,
    report: 'analysis/reviews/stage-02-pass-001.md',
    reviewer: 'Independent reviewer', reviewer_id: 'reviewer-incident',
    session_id: 'incident-session-1', authored_artifacts: [],
    independence_record: 'analysis/reviews/independence.md',
    reviewed_at: '2026-07-28T10:02:00Z', scope: 'bounded-scope', waiver_ids: [],
    incident_assessment: {
      record: 'analysis/reviews/incident-assessment.md',
      report_sha256: digest(bytes), classification: 'non-material',
      guards: Object.fromEntries(Object.keys(INCIDENT_GUARDS).map((key) => [key, 'verified'])),
      owner_decision_id: 'incident-decision-1',
    },
  };
  const decision = {
    id: 'incident-decision-1', decision: 'approved', decided_by: 'project owner',
    decided_at: review.reviewed_at, scope: incidentDecisionScope(review),
    rationale: 'The owner approved the exact independently assessed narrow incident.',
    residual_risk: 'Diagnostic provenance remains unknown; independent evidence establishes no sensitive exposure.',
    record: review.incident_assessment.record,
  };
  const status = validStatus({ review_passes: [review], owner_decisions: [decision] });
  return { status, review, assessment: review.incident_assessment, decision };
}

function companion(review) {
  const assessment = review.incident_assessment;
  return '# Review incident assessment\n\n' + [
    ['Incident session', review.session_id],
    ['Incident report SHA-256', assessment.report_sha256.toLowerCase()],
    ['Incident classification', assessment.classification],
    ...Object.entries(INCIDENT_GUARDS).map(([guard, label]) => [label, assessment.guards[guard]]),
  ].map(([label, value]) => `- ${label}: ${value}\n`).join('') +
    '\nThe independent assessment records the evidence and remaining limitations.\n';
}

function fixtureRoot(t) {
  const workspace = path.resolve(__dirname, '../..');
  const root = fs.mkdtempSync(path.join(workspace, '.review-incidents-test-'));
  t.after(() => {
    assert.equal(path.dirname(fs.realpathSync(root)), fs.realpathSync(workspace));
    fs.rmSync(root, { recursive: true, force: true });
  });
  return root;
}

function materialize(root, review, bytes = REPORT, body = companion(review)) {
  fs.mkdirSync(path.join(root, 'analysis/reviews'), { recursive: true });
  fs.writeFileSync(path.join(root, review.report), bytes);
  fs.writeFileSync(path.join(root, review.independence_record),
    '# Independence evidence\n\nThe independent reviewer used a fresh eligible session.\n');
  fs.writeFileSync(path.join(root, review.incident_assessment.record), body);
}

test('narrow owner-approved incident passes status and evidence audits without rewriting the report', (t) => {
  const root = fixtureRoot(t);
  for (const result of ['clean', 'findings']) {
    const { status, review } = fixture(result);
    materialize(root, review);
    const file = writeStatus(root, status);
    assert.deepEqual(validateStatus(status), []);
    assert.deepEqual(validateRecordedEvidence(status, root), []);
    assert.deepEqual(loadAndValidateStatus(file), status);
    assert.equal(run({ file }).ok, true);
    assert.deepEqual(fs.readFileSync(path.join(root, review.report)), REPORT);
  }
});

test('scope contract is deterministic, delimiter-safe and binds each exact identity field', () => {
  const { review } = fixture();
  const expected = `review-incident:["stage-02",1,"incident-session-1","analysis/reviews/stage-02-pass-001.md","${digest(REPORT)}","bounded-scope"]`;
  assert.equal(incidentDecisionScope(review), expected);
  review.incident_assessment.report_sha256 = digest(REPORT).toUpperCase();
  assert.equal(incidentDecisionScope(review), expected);
  review.scope = 'a:b, "quoted" scope';
  review.session_id = 'reviewer:session';
  assert.deepEqual(JSON.parse(incidentDecisionScope(review).slice('review-incident:'.length)), [
    review.stage, review.pass, review.session_id, review.report, digest(REPORT), review.scope,
  ]);
});

test('absent incident metadata remains backward-compatible without new report markers', (t) => {
  const root = fixtureRoot(t);
  const { status, review } = fixture();
  materialize(root, review);
  delete review.incident_assessment;
  status.owner_decisions = [];
  assert.deepEqual(validateStatus(status), []);
  assert.deepEqual(validateRecordedEvidence(status, root), []);
  assert.equal(passClosesStage(review), true);
});

test('incident schema rejects missing fields, booleans, unknown keys and malformed hashes', () => {
  const mutations = [
    ({ review }) => { review.incident_assessment = null; },
    ...['record', 'report_sha256', 'classification', 'guards'].map((key) =>
      ({ assessment }) => { delete assessment[key]; }),
    ...Object.keys(INCIDENT_GUARDS).map((key) =>
      ({ assessment }) => { delete assessment.guards[key]; }),
    ...['', ' ', 'f'.repeat(63), 'f'.repeat(65), 'g'.repeat(64), true].map((value) =>
      ({ assessment }) => { assessment.report_sha256 = value; }),
    ({ assessment }) => { assessment.record = ' '; },
    ({ assessment }) => { assessment.owner_decision_id = ' '; },
    ({ assessment }) => { assessment.classification = 'harmless'; },
    ({ assessment }) => { assessment.guards.disclosure = true; },
    ({ assessment }) => { assessment.guards.disclosure = 'approved'; },
    ({ assessment }) => { assessment.guards.extra_guard = 'verified'; },
    ({ assessment }) => { assessment.approved = true; },
  ];
  for (const mutate of mutations) {
    const current = fixture();
    mutate(current);
    assert.notDeepEqual(validateStatus(current.status), []);
  }
});

test('clean/findings require a unique exact approved owner decision and non-stale time', () => {
  const mutations = [
    [({ assessment }) => { delete assessment.owner_decision_id; }, /requires owner_decision_id/],
    [({ status }) => { status.owner_decisions = []; }, /exactly one owner decision/],
    [({ assessment }) => { assessment.owner_decision_id = 'missing'; }, /exactly one owner decision/],
    [({ status, decision }) => { status.owner_decisions.push({ ...decision }); }, /exactly one owner decision/],
    [({ decision }) => { decision.decision = 'rejected'; }, /approved owner decision/],
    [({ decision }) => { decision.decision = 'deferred'; }, /approved owner decision/],
    [({ decision }) => { decision.decided_by = 'agent'; }, /decided_by/],
    [({ decision }) => { delete decision.residual_risk; }, /nonempty residual_risk/],
    [({ decision }) => { decision.residual_risk = ''; }, /nonempty residual_risk/],
    [({ decision }) => { decision.residual_risk = '   '; }, /nonempty residual_risk/],
    [({ decision }) => { decision.scope = 'bounded-scope'; }, /decision.scope/],
    [({ decision }) => { decision.record = 'analysis/reviews/other-assessment.md'; }, /decision.record/],
    [({ decision }) => { decision.decided_at = '2026-07-28T10:01:59Z'; }, /at or after reviewed_at/],
    [({ decision }) => { decision.decided_at = 'invalid-date'; }, /at or after reviewed_at/],
    [({ review }) => { review.stage = 'stage-07'; }, /decision.scope/],
    [({ review }) => { review.pass = 2; }, /decision.scope/],
    [({ review }) => { review.session_id = 'other-session'; }, /decision.scope/],
    [({ review }) => { review.report = 'analysis/reviews/stage-02-pass-002.md'; }, /decision.scope/],
    [({ review }) => { review.scope = 'other-scope'; }, /decision.scope/],
    [({ assessment }) => { assessment.report_sha256 = 'a'.repeat(64); }, /decision.scope/],
  ];
  for (const result of ['clean', 'findings']) {
    for (const [mutate, expected] of mutations) {
      const current = fixture(result);
      mutate(current);
      assert.match(validateReviewIncidents(current.status).join('\n'), expected);
      assert.notDeepEqual(validateStatus(current.status), []);
    }
    const { status, decision } = fixture(result);
    decision.decided_at = '2026-07-28T12:02:00+02:00';
    assert.deepEqual(validateStatus(status), []);
  }
});

test('every failed or unknown guard and material/unresolved classification rejects clean/findings', () => {
  for (const result of ['clean', 'findings']) {
    for (const guard of Object.keys(INCIDENT_GUARDS)) {
      for (const value of ['failed', 'unknown']) {
        const { status, assessment } = fixture(result);
        assessment.guards[guard] = value;
        assert.match(validateStatus(status).join('\n'), new RegExp(`guards.${guard}`));
      }
    }
    for (const classification of ['material', 'unresolved']) {
      const { status, assessment } = fixture(result);
      assessment.classification = classification;
      assert.match(validateStatus(status).join('\n'), /requires non-material/);
    }
  }
});

test('blocked/invalid can record unresolved or material incidents without approval and never close', (t) => {
  const root = fixtureRoot(t);
  for (const result of ['blocked', 'invalid']) {
    for (const classification of ['non-material', 'material', 'unresolved']) {
      const { status, review, assessment } = fixture(result);
      delete assessment.owner_decision_id;
      status.owner_decisions = [];
      assessment.classification = classification;
      assessment.guards.independence = 'failed';
      assessment.guards.disclosure = 'unknown';
      materialize(root, review);
      assert.deepEqual(validateStatus(status), []);
      assert.deepEqual(validateRecordedEvidence(status, root), []);
      assert.equal(passClosesStage(review), false);
      assert.equal(review.result, result);
    }
    const { status, review, decision } = fixture(result);
    decision.decision = 'rejected';
    assert.deepEqual(validateStatus(status), []);
    decision.record = 'different-record.md';
    assert.match(validateStatus(status).join('\n'), /decision.record/);
    decision.record = review.incident_assessment.record;
    decision.decision = 'approved';
    assert.deepEqual(validateStatus(status), []);
    assert.equal(passClosesStage(review), false);
  }
});

test('incident approval cannot cure authoring ineligibility or unchecked Stage 2 scope', () => {
  for (const result of ['clean', 'findings']) {
    const { status, review } = fixture(result);
    review.authored_artifacts = ['analysis/reviewed-artifact.md'];
    assert.match(validateStatus(status).join('\n'), /must be invalid/);
    review.authored_artifacts = [];
    review.unchecked_scopes = ['unverified required behavior'];
    assert.match(validateStatus(status).join('\n'), /unchecked_scopes cannot be clean or findings/);
  }
});

test('every incident assessment must be a separate companion, never the sealed report itself', () => {
  for (const result of ['clean', 'findings', 'blocked', 'invalid']) {
    const { status, review, assessment, decision } = fixture(result);
    assessment.record = decision.record = review.report;
    assert.match(validateStatus(status).join('\n'), /separate companion, not review.report/);
  }
});

test('an approved incident retains the existing rationale requirement', () => {
  const { status, decision } = fixture();
  delete decision.rationale;
  assert.notDeepEqual(validateStatus(status), []);
});

test('assessment records use the existing missing, template, directory and escaping-path checks', (t) => {
  const root = fixtureRoot(t);
  const { status, review, assessment, decision } = fixture();
  materialize(root, review);
  for (const record of ['analysis/reviews/missing.md', '../outside.md', 'analysis/reviews']) {
    assessment.record = record;
    decision.record = record;
    assert.notDeepEqual(validateRecordedEvidence(status, root), []);
  }
  assessment.record = decision.record = 'analysis/reviews/incident-assessment.md';
  for (const content of ['', '# Short', '# Assessment\n\n<exact scope> is not filled in.\n', '<!-- no visible evidence -->']) {
    fs.writeFileSync(path.join(root, assessment.record), content);
    assert.match(validateRecordedEvidence(status, root).join('\n'), /template-only/);
  }
});

test('every canonical companion declaration is required, unique and exactly bound', (t) => {
  const root = fixtureRoot(t);
  const { status, review, assessment } = fixture();
  materialize(root, review);
  const body = companion(review);
  for (const line of body.split('\n').filter((line) => line.startsWith('- Incident'))) {
    for (const content of [body.replace(line, ''), body.replace(line, line.replace(/: .*/, ': wrong')), body + '\n' + line]) {
      fs.writeFileSync(path.join(root, assessment.record), content);
      assert.match(validateRecordedEvidence(status, root).join('\n'), /exactly one visible plain Incident/);
    }
  }
});

test('quotes, code, comments, hidden markup and duplicate spoof markers cannot supply approval declarations', (t) => {
  const root = fixtureRoot(t);
  const { status, review, assessment } = fixture();
  materialize(root, review);
  const body = companion(review);
  const header = '# Assessment record\n\nThe diagnostic incident was independently assessed.\n\n';
  const variants = [
    body.split('\n').map((line) => '> ' + line).join('\n'),
    '```text\n' + body + '\n```', '~~~~\n' + body + '\n~~~~',
    '````text\n' + body + '\n```', '~~~\n' + body,
    body.split('\n').map((line) => '    ' + line).join('\n'),
    '<!--\n' + body + '\n-->', '<div hidden>\n' + body + '\n</div>',
    body.replace(/^- (Incident[^:]*): (.*)$/gm, '- `$1: $2`'),
    body.replace(/^- (Incident[^:]*): (.*)$/gm, '- $1: `$2`'),
    body.replace(/^- (Incident[^:]*): (.*)$/gm, '- $1: "$2"'),
    body.replace(/^- (Incident[^:]*): (.*)$/gm, '- <span hidden>$1: $2</span>'),
    body.replace('Incident session:', 'Incident <!-- comment -->session:'),
    body.replace('incident-session-1', '[incident-session-1](https://example.invalid)'),
    body + '\n- **Incident session:** wrong-session\n',
    body + '\n- Incident session: wrong-session `quoted\nvalue`\n',
    body + '\n- Incident session: wrong-session <!-- comment -->\n',
  ];
  for (const [index, content] of variants.entries()) {
    fs.writeFileSync(path.join(root, assessment.record), header + content);
    assert.match(validateRecordedEvidence(status, root).join('\n'), /exactly one visible plain Incident/, `spoof variant ${index}`);
  }
  fs.writeFileSync(path.join(root, assessment.record), body);
  assert.deepEqual(validateRecordedEvidence(status, root), []);
});

test('report hashing uses exact existing bytes, not text decoding, line normalization or another file', (t) => {
  const root = fixtureRoot(t);
  const bytes = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), REPORT, Buffer.from([0xff])]);
  const { status, review, assessment, decision } = fixture('clean', bytes);
  materialize(root, review, bytes);
  assert.deepEqual(validateRecordedEvidence(status, root), []);
  assessment.report_sha256 = assessment.report_sha256.toUpperCase();
  decision.scope = incidentDecisionScope(review);
  assert.deepEqual(validateStatus(status), []);
  assert.deepEqual(validateRecordedEvidence(status, root), []);
  for (const hash of [digest(bytes.toString('utf8')), digest(bytes.toString('utf8').replace(/\r\n/g, '\n')), digest(REPORT)]) {
    assessment.report_sha256 = hash;
    decision.scope = incidentDecisionScope(review);
    fs.writeFileSync(path.join(root, assessment.record), companion(review));
    assert.match(validateRecordedEvidence(status, root).join('\n'), /exact existing report bytes/);
  }
  assessment.report_sha256 = digest(bytes);
  decision.scope = incidentDecisionScope(review);
  fs.writeFileSync(path.join(root, assessment.record), companion(review));
  fs.appendFileSync(path.join(root, review.report), ' ');
  assert.match(validateRecordedEvidence(status, root).join('\n'), /exact existing report bytes/);
});

test('unresolved clean/findings fail the complete status audit and loader, not merely a helper', (t) => {
  const root = fixtureRoot(t);
  for (const result of ['clean', 'findings']) {
    const { status, review, assessment } = fixture(result);
    assessment.classification = 'unresolved';
    materialize(root, review);
    const file = writeStatus(root, status);
    assert.throws(() => loadAndValidateStatus(file), /requires non-material/);
    assert.equal(run({ file }).ok, false);
  }
});
