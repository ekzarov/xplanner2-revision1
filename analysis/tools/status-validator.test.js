'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {
  auditedScope,
  formalStageProgress,
  loadAndValidateStatus,
  passClosesStage,
  scopeAwareWaiver,
  validateRecordedEvidence,
  validateStatus,
} = require('./status-validator');

test('derives formal progress from the closed sequential stage prefix', () => {
  assert.deepEqual(formalStageProgress('bootstrap'), { completed: 0, total: 19, percent: 0 });
  assert.deepEqual(formalStageProgress('stage-02'), { completed: 1, total: 19, percent: 5 });
  assert.deepEqual(formalStageProgress('stage-19'), { completed: 18, total: 19, percent: 95 });
  assert.deepEqual(formalStageProgress('complete'), { completed: 19, total: 19, percent: 100 });
});

test('combined delivery still requires independent Stage 19 acceptance', () => {
  const status = completedStatus();
  status.review_passes = status.review_passes.filter(pass => pass.stage !== 'stage-19');
  assert.ok(validateStatus(status).some(error => error.includes('stage-19')));
});

test('process revision 1.5 rejects obsolete Stage 20 checkpoints', () => {
  const status = activeStatus();
  status.control.current_stage = 'stage-20';
  assert.ok(validateStatus(status).some(error => error.includes('current_stage')));
});
const {
  temporaryDirectory,
  sha256File,
  validStatus: baseValidStatus,
  validWaiver: baseValidWaiver,
  writeStatus,
} = require('./helpers');

function validStatus(overrides = {}) {
  const status = baseValidStatus(overrides);
  status.schema_version = '1.5.0';
  status.legacy_walkthrough = overrides.legacy_walkthrough || {
    outcome: 'pending',
    scope: status.project.id,
    record: null,
    decision_id: null,
    unresolved_blocked_scopes: [],
  };
  status.delivery.completed_slice_evidence =
    (overrides.delivery && overrides.delivery.completed_slice_evidence) || [];
  status.progress.agent_reviews = {
    total: status.review_passes.length,
    valid: status.review_passes.filter((entry) => ['clean', 'findings'].includes(entry.result)).length,
    blocked: status.review_passes.filter((entry) => entry.result === 'blocked').length,
    invalid: status.review_passes.filter((entry) => entry.result === 'invalid').length,
    active: 0,
  };
  return status;
}

function validWaiver(gate = 'prototyping_retroactive', scope = 'fixture-scope') {
  return baseValidWaiver(gate, scope);
}

function ownerApproval() {
  return {
    approved_by: 'project owner',
    approved_at: '2026-07-28T10:00:00Z',
    record: 'analysis/stages/owner-approval.md',
    scope: 'fixture-scope',
  };
}

function transition(from, to, minute, approval = null) {
  return {
    from,
    to,
    reason: `Move from ${from} to ${to}.`,
    changed_by: 'migration orchestrator',
    changed_at: `2026-07-28T10:${String(minute).padStart(2, '0')}:00Z`,
    gate_evidence: ['analysis/stages/gate-record.md'],
    owner_approval: approval,
  };
}

function reviewPass(stage, pass = 1, overrides = {}) {
  const reviewMinute = {
    'stage-02': '02:30',
    'stage-07': '07:30',
    'stage-10': '10:30',
    'stage-14': '14:10',
    'stage-16': '16:10',
    'stage-19': '19:10',
  }[stage] || '30:00';
  return {
    stage,
    pass,
    result: 'clean',
    report: `analysis/reviews/${stage}-pass-${String(pass).padStart(3, '0')}.md`,
    reviewer: `fresh ${stage} reviewer`,
    reviewer_id: `reviewer-${stage}`,
    session_id: `session-${stage}-${pass}`,
    authored_artifacts: [],
    independence_record: `analysis/reviews/${stage}-pass-${String(pass).padStart(3, '0')}-independence.md`,
    reviewed_at: `2026-07-28T10:${reviewMinute}Z`,
    scope: 'fixture-scope',
    waiver_ids: [],
    ...overrides,
  };
}

function activeStatus(overrides = {}) {
  return validStatus({
    control: {
      state: 'active',
      current_stage: 'stage-02',
      previous_stage: 'stage-01',
      stage_status: 'in_progress',
      next_action: 'Run independent Stage 2 control.',
    },
    constitution: {
      status: 'ratified',
      version: '1.0.0',
      ratified_by: 'project owner',
      ratified_at: '2026-07-28T10:00:00Z',
      ratification_record: 'analysis/stages/constitution-ratification.md',
    },
    bootstrap_gates: {
      initializer_self_test: 'passed',
      status_schema_validation: 'passed',
      command_contract_configured: 'passed',
      owner_stage_1_approval: 'approved',
    },
    transition_history: [
      transition('bootstrap', 'stage-01', 1, ownerApproval()),
      transition('stage-01', 'stage-02', 2),
    ],
    ...overrides,
  });
}

test('rejects a manually inflated formal progress percentage', () => {
  const status = activeStatus({
    progress: {
      summary: 'Parallel delivery exists but Stage 2 remains open.',
      completed_percent: 94,
      updated_at: '2026-07-28T10:03:00Z',
    },
  });
  const errors = validateStatus(status);
  assert(errors.some((error) => error.includes('derived formal progress 5')));
});

function completedStatus(overrides = {}) {
  const stages = [
    'stage-01', 'stage-02', 'stage-03', 'stage-04', 'stage-05', 'stage-06',
    'stage-07', 'stage-08', 'stage-09', 'stage-10', 'stage-11', 'stage-12',
    'stage-13', 'stage-14', 'stage-15', 'stage-16', 'stage-17', 'stage-18',
    'stage-19',
    'complete',
  ];
  const approvalPairs = new Set([
    'bootstrap:stage-01',
    'stage-03:stage-04',
    'stage-04:stage-05',
    'stage-05:stage-06',
    'stage-08:stage-09',
    'stage-11:stage-12',
    'stage-16:stage-17',
    'stage-17:stage-18',
    'stage-19:complete',
  ]);
  let from = 'bootstrap';
  const history = stages.map((to, index) => {
    const record = transition(
      from,
      to,
      index + 1,
      approvalPairs.has(`${from}:${to}`) ? ownerApproval() : null
    );
    if (to === 'complete') {
      record.gate_evidence = ['analysis/stages/stage-19/stage-19-acceptance-001.md'];
    }
    from = to;
    return record;
  });
  const review_passes = ['stage-02', 'stage-07', 'stage-10', 'stage-14', 'stage-16', 'stage-19']
    .map((stage) => reviewPass(stage));

  return validStatus({
    control: {
      state: 'complete',
      current_stage: 'complete',
      previous_stage: 'stage-19',
      stage_status: 'complete',
      next_action: 'Preserve the accepted migration evidence.',
    },
    constitution: {
      status: 'ratified',
      version: '1.0.0',
      ratified_by: 'project owner',
      ratified_at: '2026-07-28T10:00:00Z',
      ratification_record: 'analysis/stages/constitution-ratification.md',
    },
    bootstrap_gates: {
      initializer_self_test: 'passed',
      status_schema_validation: 'passed',
      command_contract_configured: 'passed',
      owner_stage_1_approval: 'approved',
    },
    transition_history: history,
    review_passes,
    legacy_walkthrough: {
      outcome: 'live-verified',
      scope: 'fixture-scope',
      record: 'analysis/stages/stage-03/stage-03-walkthrough.md',
      decision_id: null,
      unresolved_blocked_scopes: [],
    },
    delivery: {
      active_slice: null,
      slice_status: 'accepted',
      completed_slices: ['001-first-slice'],
      completed_slice_evidence: [{
        slice: '001-first-slice',
        spec: 'specs/001-first-slice/spec.md',
        plan: 'specs/001-first-slice/plan.md',
        tasks: 'specs/001-first-slice/tasks.md',
        delivery_record: 'analysis/stages/stage-18/001-first-slice-delivery.md',
        acceptance_record: 'analysis/stages/stage-19/001-first-slice-acceptance.md',
      }],
      reopened_slices: [],
      consolidated_backlog: 'analysis/stages/stage-19/consolidated-backlog.md',
      owner_walkthrough_reports: ['analysis/stages/stage-19/owner-walkthrough-001.md'],
      owner_walkthrough_decision_id: null,
    },
    progress: {
      summary: 'Migration accepted.',
      completed_percent: 100,
      updated_at: '2026-07-28T11:00:00Z',
    },
    ...overrides,
  });
}

function recordedEvidence(status) {
  const paths = new Set([
    status.constitution.ratification_record,
    status.legacy_walkthrough && status.legacy_walkthrough.record,
    status.delivery.consolidated_backlog,
  ]);
  for (const entry of status.transition_history) {
    entry.gate_evidence.forEach((value) => paths.add(value));
    if (entry.owner_approval) paths.add(entry.owner_approval.record);
  }
  for (const entry of status.review_passes) {
    paths.add(entry.report);
    paths.add(entry.independence_record);
    paths.add(entry.coverage_record);
  }
  for (const entry of status.owner_decisions) paths.add(entry.record);
  for (const report of status.delivery.owner_walkthrough_reports || []) paths.add(report);
  for (const blocker of status.blockers || []) {
    for (const evidence of blocker.evidence || []) paths.add(evidence);
  }
  for (const entry of status.delivery.completed_slice_evidence || []) {
    for (const key of ['spec', 'plan', 'tasks', 'delivery_record', 'acceptance_record']) {
      paths.add(entry[key]);
    }
  }
  return [...paths].filter(Boolean);
}

function materializeEvidence(root, status, overrides = {}) {
  for (const relative of recordedEvidence(status)) {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const pass = status.review_passes.find((entry) => entry.report === relative && entry.control_mode);
    const content = relative.endsWith('/tasks.md') || relative.endsWith('\\tasks.md')
      ? '# Tasks\n\n- [x] T001 completed behavior\n'
      : '# Recorded evidence\n\nThe governed activity completed with traceable results.\n' +
        (pass ? `- Control mode: ${pass.control_mode}\n` : '');
    fs.writeFileSync(file, overrides[relative] || content);
  }
}

test('validates the canonical external status schema and Stage 19 report naming', () => {
  const status = validStatus({
    review_passes: [reviewPass('stage-19', 2)],
  });
  assert.deepEqual(validateStatus(status), []);
});

function stage2Pass(pass, overrides = {}) {
  return reviewPass('stage-02', pass, {
    control_mode: 'full-blind',
    reviewed_at: `2026-07-28T10:02:${String(pass).padStart(2, '0')}Z`,
    ...overrides,
  });
}

function correctionPass(pass = 2, overrides = {}) {
  return stage2Pass(pass, {
    control_mode: 'correction-validation',
    baseline_pass: 1,
    previous_pass: pass - 1,
    coverage_record: `analysis/reviews/stage-02-pass-${String(pass).padStart(3, '0')}.md`,
    ...overrides,
  });
}

function correctionStatus(passes = [stage2Pass(1, { result: 'findings' }), correctionPass()]) {
  return activeStatus({ review_passes: passes });
}

test('Stage 2 required unchecked scope prevents closure in both modes and historical entries', () => {
  for (const mode of ['full-blind', 'correction-validation', undefined]) {
    for (const result of ['clean', 'findings', 'blocked', 'invalid']) {
      const pass = mode === 'correction-validation' ? correctionPass(2) : stage2Pass(2, { control_mode: mode });
      if (mode === undefined) delete pass.control_mode;
      Object.assign(pass, { result, unchecked_scopes: ['required static routes not inspected'] });
      const status = correctionStatus([stage2Pass(1), pass]);
      const errors = validateStatus(status);
      if (['clean', 'findings'].includes(result)) {
        assert.match(errors.join('\n'), /with unchecked_scopes cannot be clean or findings/);
      } else assert.deepEqual(errors, []);
    }
  }
  const completed = completedStatus();
  assert.deepEqual(validateStatus(completed), []);
  Object.assign(completed.review_passes[0], { control_mode: 'full-blind', unchecked_scopes: ['missing static scope'] });
  assert.match(validateStatus(completed).join('\n'), /with unchecked_scopes cannot be clean or findings/);
});

test('completed template independence declaration works for each mode without false Phase A attestation', (t) => {
  const root = temporaryDirectory(t, 'stage2-template-independence-');
  const candidates = ['stage-NN-pass-NNN-template.md', 'review_template.md']
    .map(file => path.join(__dirname, '../reviews', file));
  const template = fs.readFileSync(candidates.find(file => fs.existsSync(file)), 'utf8').replace(/\r\n/g, '\n');
  const declaration = template.match(/## Independence Declaration\n([\s\S]*?)\n## Scope and Inputs/)[1];
  assert.equal((declaration.match(/^- \[ \]/gm) || []).length, 5);
  assert.match(declaration, /only the branch matching the declared mode, not both/);
  assert.match(declaration, /does not attest that the baseline is eligible/);
  for (const mode of ['full-blind', 'correction-validation']) {
    for (const result of ['clean', 'blocked']) {
      const pass = mode === 'full-blind' ? stage2Pass(2, { result }) : correctionPass(2, { result });
      pass.independence_record = pass.report;
      const status = correctionStatus([stage2Pass(1), pass]);
      const report = '# Review\n\n- Control mode: ' + mode + '\n\n## Independence Declaration\n' +
        declaration.replaceAll('- [ ]', '- [x]') + '\n## Scope and Inputs\n\nExact scope and evidence recorded.\n';
      materializeEvidence(root, status, { [pass.report]: report });
      const file = writeStatus(root, status);
      assert.doesNotThrow(() => loadAndValidateStatus(file));
      fs.writeFileSync(path.join(root, pass.report), report.replace('- [x]', '- [ ]'));
      assert.throws(() => loadAndValidateStatus(file), /Independence Declaration has unchecked items/);
    }
  }
});

test('Stage 2 closure accepts full findings or clean roots without mutating historical entries', () => {
  for (const result of ['clean', 'findings']) {
    for (const historical of [false, true]) {
      const baseline = stage2Pass(1, { result, unchecked_scopes: [] });
      if (historical) delete baseline.control_mode;
      const status = correctionStatus([baseline, correctionPass()]);
      const before = structuredClone(status);
      assert.deepEqual(validateStatus(status), []);
      assert.deepEqual(status, before);
      assert.equal(status.schema_version, '1.5.0');
    }
  }
});

test('Stage 2 repeated closure retains one root and uses each immediate predecessor', () => {
  const passes = [
    stage2Pass(1, { result: 'findings' }),
    correctionPass(2, { result: 'findings' }),
    correctionPass(3),
    correctionPass(4),
  ];
  assert.deepEqual(validateStatus(correctionStatus(passes)), []);
  assert.deepEqual(validateStatus(correctionStatus([...passes].reverse())), []);
});

test('Stage 2 latest predecessor is stage-wide, not an array neighbor or pass minus one', () => {
  const passes = [
    stage2Pass(4, { result: 'findings' }),
    reviewPass('stage-07', 1),
    correctionPass(8, { baseline_pass: 4, previous_pass: 4 }),
  ];
  assert.deepEqual(validateStatus(correctionStatus(passes)), []);
});

for (const stage of ['stage-07', 'stage-10', 'stage-14', 'stage-16', 'stage-19']) {
  test(`Stage 2 control metadata is forbidden at ${stage}`, () => {
    for (const metadata of [
      { control_mode: 'full-blind' },
      { control_mode: 'correction-validation', baseline_pass: 1, previous_pass: 1, coverage_record: 'evidence.md' },
      { baseline_pass: 1 }, { previous_pass: 1 }, { coverage_record: 'evidence.md' },
    ]) {
      for (const result of ['clean', 'findings', 'blocked', 'invalid']) {
        assert.notDeepEqual(validateStatus(validStatus({ review_passes: [reviewPass(stage, 2, { ...metadata, result })] })), []);
      }
    }
  });
}

test('Stage 2 closure metadata is required, typed and forbidden for full or mode-less passes', () => {
  for (const field of ['baseline_pass', 'previous_pass', 'coverage_record']) {
    for (const result of ['clean', 'findings']) {
      const missing = correctionPass(2, { result });
      delete missing[field];
      assert.match(validateStatus(correctionStatus([stage2Pass(1), missing])).join('\n'), new RegExp(field));
    }
    for (const mode of ['full-blind', undefined]) {
      const full = stage2Pass(2, { control_mode: mode, [field]: correctionPass()[field] });
      if (mode === undefined) delete full.control_mode;
      assert.notDeepEqual(validateStatus(correctionStatus([stage2Pass(1), full])), []);
    }
    const badValues = field === 'coverage_record' ? [null, '', '   ', 1] : [null, 0, -1, 1.5, '1'];
    for (const value of badValues) {
      const invalid = correctionPass(2, { [field]: value });
      assert.notDeepEqual(validateStatus(correctionStatus([stage2Pass(1), invalid])), [], `${field}: ${JSON.stringify(value)}`);
    }
  }
  for (const mode of ['full', 'closure', '', null]) {
    assert.match(validateStatus(correctionStatus([stage2Pass(1, { control_mode: mode })])).join('\n'), /control_mode/);
  }
});

for (const [name, rootChange] of [
  ['invalid', { result: 'invalid' }],
  ['blocked', { result: 'blocked' }],
  ['wrong scope', { scope: 'another-scope' }],
  ['unchecked scope', { unchecked_scopes: ['uninspected static routes'] }],
  ['authoring context', { authored_artifacts: ['analysis/legacy_reconnaissance.md'] }],
]) {
  test(`Stage 2 closure refuses a ${name} root`, () => {
    const errors = validateStatus(correctionStatus([stage2Pass(1, rootChange), correctionPass()]));
    assert.match(errors.join('\n'), /baseline_pass must be a valid/);
  });
}

test('Stage 2 closure refuses missing, cross-stage and closure roots', () => {
  for (const passes of [
    [correctionPass()],
    [reviewPass('stage-07', 1), correctionPass()],
    [stage2Pass(1), correctionPass(), correctionPass(3, { baseline_pass: 2 })],
  ]) {
    assert.match(validateStatus(correctionStatus(passes)).join('\n'), /baseline_pass/);
  }
});

test('Stage 2 closure refuses self, future, cyclic and non-earlier-time links', () => {
  for (const field of ['baseline_pass', 'previous_pass']) {
    for (const value of [2, 3, 99]) {
      const passes = [stage2Pass(1), correctionPass(2, { [field]: value }), stage2Pass(3)];
      assert.match(validateStatus(correctionStatus(passes)).join('\n'), new RegExp(`${field} must reference an earlier`));
    }
  }
  const cycle = [stage2Pass(1), correctionPass(2, { previous_pass: 3 }), correctionPass(3)];
  assert.match(validateStatus(correctionStatus(cycle)).join('\n'), /previous_pass must reference an earlier/);
  for (const reviewed_at of ['2026-07-28T10:02:02Z', '2026-07-28T10:02:03Z']) {
    const passes = [stage2Pass(1, { reviewed_at }), correctionPass()];
    assert.match(validateStatus(correctionStatus(passes)).join('\n'), /earlier Stage 2 pass by number and review time/);
  }
});

for (const [name, change] of [
  ['invalid', { result: 'invalid' }],
  ['blocked', { result: 'blocked' }],
  ['wrong scope', { scope: 'another-scope' }],
  ['unchecked scope', { unchecked_scopes: ['uninspected changed claims'] }],
  ['authoring context', { authored_artifacts: ['analysis/legacy_user_flows.xlsx'] }],
]) {
  test(`Stage 2 repeated closure refuses a ${name} predecessor`, () => {
    const passes = [stage2Pass(1), correctionPass(2, change), correctionPass(3)];
    assert.match(validateStatus(correctionStatus(passes)).join('\n'), /previous_pass must be a valid/);
  });
}

test('Stage 2 closure cannot skip intervening full, invalid, blocked or closure attempts', () => {
  for (const middle of [
    stage2Pass(2), stage2Pass(2, { result: 'invalid' }),
    stage2Pass(2, { result: 'blocked' }), correctionPass(2, { result: 'findings' }),
    stage2Pass(2, { scope: 'another-scope' }),
  ]) {
    const passes = [stage2Pass(1), middle, correctionPass(3, { previous_pass: 1 })];
    assert.match(validateStatus(correctionStatus(passes)).join('\n'), /latest preceding Stage 2 attempt/);
  }
});

test('Stage 2 a new full pass supersedes the old root throughout subsequent closures', () => {
  const passes = [stage2Pass(1), stage2Pass(2), correctionPass(3)];
  assert.match(validateStatus(correctionStatus(passes)).join('\n'), /same baseline_pass/);
  passes[2].baseline_pass = 2;
  assert.deepEqual(validateStatus(correctionStatus(passes)), []);
  passes.push(correctionPass(4));
  assert.match(validateStatus(correctionStatus(passes)).join('\n'), /same baseline_pass/);
  passes[3].baseline_pass = 2;
  assert.deepEqual(validateStatus(correctionStatus(passes)), []);
});

test('Stage 2 metadata preserves failed attempts and fresh-session eligibility', () => {
  for (const result of ['findings', 'blocked', 'invalid']) {
    const pass = correctionPass(2, { result });
    if (result === 'invalid') pass.authored_artifacts = ['analysis/legacy_user_flows.xlsx'];
    if (result === 'blocked') pass.unchecked_scopes = ['coverage unavailable'];
    assert.deepEqual(validateStatus(correctionStatus([stage2Pass(1), pass])), []);
  }
  const passes = [stage2Pass(1), correctionPass(2, { session_id: 'session-stage-02-1' })];
  assert.match(validateStatus(correctionStatus(passes)).join('\n'), /session_id.*must be unique/);
  for (const result of ['clean', 'findings']) {
    const authored = correctionPass(2, { result, authored_artifacts: ['analysis/legacy_user_flows.xlsx'] });
    assert.match(validateStatus(correctionStatus([stage2Pass(1), authored])).join('\n'), /must be invalid/);
    const unchecked = correctionPass(2, { result, unchecked_scopes: ['static checks missing'] });
    assert.match(validateStatus(correctionStatus([stage2Pass(1), unchecked])).join('\n'), /unchecked_scopes cannot be clean or findings/);
  }
});

for (const result of ['blocked', 'invalid']) {
  test(`Stage 2 ${result} eligibility attempts preserve unknown or unsuitable roots without allowing exit`, (t) => {
    const root = temporaryDirectory(t, `stage2-${result}-eligibility-`);
    const failure = correctionPass(2, { result });
    const unknown = structuredClone(failure);
    delete unknown.baseline_pass;
    delete unknown.previous_pass;
    const unknownBaseline = structuredClone(failure);
    delete unknownBaseline.baseline_pass;
    const unknownPrevious = structuredClone(failure);
    delete unknownPrevious.previous_pass;
    for (const passes of [
      [unknown],
      [failure],
      [stage2Pass(1), unknownBaseline],
      [stage2Pass(1), unknownPrevious],
      [stage2Pass(1, { result: 'invalid' }), failure],
      [stage2Pass(1, { result: 'blocked' }), failure],
      [stage2Pass(1, { result: 'blocked', unchecked_scopes: ['uninspected static routes'] }), failure],
      [stage2Pass(1, { scope: 'different-scope' }), failure],
      [stage2Pass(1), correctionPass(2), correctionPass(3, { result, baseline_pass: 2 })],
    ]) {
      const status = correctionStatus(passes);
      const attempt = status.review_passes.at(-1);
      const body = `# Eligibility failure\n\n- Control mode: correction-validation\n\n` +
        `The ${result} attempt could not establish baseline eligibility; required coverage remains unverified.\n`;
      materializeEvidence(root, status, { [attempt.report]: body });
      assert.deepEqual(validateStatus(status), []);
      assert.doesNotThrow(() => loadAndValidateStatus(writeStatus(root, status)));
      status.transition_history.push(transition('stage-02', 'stage-03', 3));
      status.control.current_stage = 'stage-03';
      status.control.previous_stage = 'stage-02';
      status.progress.completed_percent = formalStageProgress('stage-03').percent;
      assert.match(validateStatus(status).join('\n'), /stage-02 pass for exit to stage-03 must be clean/);
    }
  });

  test(`Stage 2 ${result} eligibility attempts still require safe failure evidence and backward pass numbers`, (t) => {
    const root = temporaryDirectory(t, `stage2-${result}-evidence-`);
    const pass = correctionPass(2, { result });
    delete pass.baseline_pass;
    delete pass.previous_pass;
    const status = correctionStatus([pass]);
    materializeEvidence(root, status);
    const report = path.join(root, pass.report);
    fs.writeFileSync(report, '# Eligibility failure\n\n- Control mode: correction-validation\n\n' +
      'No baseline could be established; the attempt is not eligible to close the stage.\n');
    const file = writeStatus(root, status);
    assert.doesNotThrow(() => loadAndValidateStatus(file));
    for (const field of ['baseline_pass', 'previous_pass']) {
      for (const value of [2, 3]) {
        pass[field] = value;
        assert.match(validateStatus(status).join('\n'), new RegExp(`${field} must reference an earlier`));
      }
      delete pass[field];
    }
    delete pass.coverage_record;
    assert.match(validateStatus(status).join('\n'), /coverage_record/);
    for (const coverage of ['analysis/reviews/missing-failure.md', '../outside.md']) {
      pass.coverage_record = coverage;
      assert.throws(() => loadAndValidateStatus(writeStatus(root, status)), /does not exist|escapes/);
    }
    pass.coverage_record = 'analysis/reviews/failure.md';
    for (const content of ['', '# Failure\n\nTODO: <record the failure>\n']) {
      fs.writeFileSync(path.join(root, pass.coverage_record), content);
      assert.throws(() => loadAndValidateStatus(writeStatus(root, status)), /empty or template-only/);
    }
  });

  test(`Stage 2 a ${result} closure interrupts eligibility until a new full baseline`, () => {
    for (const unknown of [false, true]) {
      const failed = correctionPass(2, { result });
      if (unknown) {
        delete failed.baseline_pass;
        delete failed.previous_pass;
      }
      const history = [stage2Pass(1), failed];
      assert.deepEqual(validateStatus(correctionStatus(history)), []);
      for (const nextResult of ['clean', 'findings']) {
        const inherited = [...history, correctionPass(3, { result: nextResult })];
        assert.match(validateStatus(correctionStatus(inherited)).join('\n'), /previous_pass must be a valid/);
        const skipped = [...history, correctionPass(3, { result: nextResult, previous_pass: 1 })];
        assert.match(validateStatus(correctionStatus(skipped)).join('\n'), /latest preceding Stage 2 attempt/);
        const newRoot = [...history, stage2Pass(3, { result: 'findings' }),
          correctionPass(4, { result: nextResult, baseline_pass: 3, previous_pass: 3 })];
        assert.deepEqual(validateStatus(correctionStatus(newRoot)), []);
      }
    }
  });
}

test('Stage 2 closure exit remains clean-only and requires a pass in the current stage entry', () => {
  const status = correctionStatus();
  status.transition_history.push(
    transition('stage-02', 'stage-01', 3),
    transition('stage-01', 'stage-02', 4),
    transition('stage-02', 'stage-03', 5),
  );
  status.control.current_stage = 'stage-03';
  status.control.previous_stage = 'stage-02';
  status.progress.completed_percent = formalStageProgress('stage-03').percent;
  status.review_passes[1].reviewed_at = '2026-07-28T10:04:30Z';
  assert.deepEqual(validateStatus(status), []);
  status.review_passes[1].reviewed_at = '2026-07-28T10:03:30Z';
  assert.match(validateStatus(status).join('\n'), /stage-02 pass for exit to stage-03 must be clean/);
  status.review_passes[1].reviewed_at = '2026-07-28T10:04:30Z';
  status.review_passes[1].result = 'findings';
  assert.match(validateStatus(status).join('\n'), /stage-02 pass for exit to stage-03 must be clean/);
});

test('Stage 2 coverage is loaded through durable evidence checks, including separate attachments', (t) => {
  const root = temporaryDirectory(t, 'stage2-coverage-');
  const status = correctionStatus();
  status.review_passes[1].coverage_record = 'analysis/reviews/coverage.md';
  materializeEvidence(root, status);
  const file = writeStatus(root, status);
  assert.doesNotThrow(() => loadAndValidateStatus(file));
  for (const content of ['', '   ', '# Coverage\n\nTODO: <fill in coverage>\n']) {
    fs.writeFileSync(path.join(root, status.review_passes[1].coverage_record), content);
    assert.throws(() => loadAndValidateStatus(file), /evidence is empty or template-only.*coverage.md/);
  }
  for (const coverage_record of [
    'analysis/reviews/missing.md', 'analysis/reviews', '.', '../outside.md',
    path.join(root, 'analysis/reviews/stage-02-pass-002.md'),
  ]) {
    status.review_passes[1].coverage_record = coverage_record;
    assert.throws(() => loadAndValidateStatus(writeStatus(root, status)), /does not exist|must be relative|escapes/);
  }
});

test('Stage 2 coverage rejects symbolic-link directories before reading records', (t) => {
  const root = temporaryDirectory(t, 'stage2-coverage-link-');
  const status = correctionStatus();
  materializeEvidence(root, status);
  try {
    fs.symlinkSync(path.join(root, 'analysis/reviews'), path.join(root, 'linked'),
      process.platform === 'win32' ? 'junction' : 'dir');
  } catch (error) {
    if (['EPERM', 'EACCES', 'UNKNOWN'].includes(error.code)) return t.skip(`symbolic links unavailable: ${error.code}`);
    throw error;
  }
  status.review_passes[1].coverage_record = 'linked/stage-02-pass-002.md';
  assert.throws(() => loadAndValidateStatus(writeStatus(root, status)), /must not use a symbolic link/);
});

test('Stage 2 report modes reconcile with status while historical missing markers remain compatible', (t) => {
  const root = temporaryDirectory(t, 'stage2-report-mode-');
  const status = correctionStatus();
  delete status.review_passes[0].control_mode;
  materializeEvidence(root, status);
  const file = writeStatus(root, status);
  assert.doesNotThrow(() => loadAndValidateStatus(file));
  const report = path.join(root, status.review_passes[1].report);
  const body = '# Review\n\nThe reviewer reconciled the declared correction coverage.\n';
  for (const marker of ['- Control mode: correction-validation', '- Control mode: `correction-validation`']) {
    fs.writeFileSync(report, `${body}${marker}\n`);
    assert.doesNotThrow(() => loadAndValidateStatus(file));
  }
  fs.writeFileSync(report, `${body}- Control mode: full-blind\n`);
  assert.throws(() => loadAndValidateStatus(file), /Control mode must match structured control_mode/);
  for (const marker of ['- Control mode: unknown', '- Control mode: not applicable', '- Control mode:',
    '- Control mode: correction-validation\n- Control mode: full-blind']) {
    fs.writeFileSync(report, `${body}${marker}\n`);
    assert.throws(() => loadAndValidateStatus(file), /one valid Control mode declaration/);
  }
  fs.writeFileSync(report, `${body}- Control mode: correction-validation\n`);
  for (const control_mode of [undefined, 'full-blind']) {
    const full = stage2Pass(2, { control_mode });
    if (control_mode === undefined) delete full.control_mode;
    status.review_passes[1] = full;
    assert.throws(() => loadAndValidateStatus(writeStatus(root, status)), /Control mode must match structured control_mode/);
  }
  fs.writeFileSync(report, `${body}- Control mode: full-blind\n`);
  assert.doesNotThrow(() => loadAndValidateStatus(writeStatus(root, status)));
  delete status.review_passes[1].control_mode;
  assert.doesNotThrow(() => loadAndValidateStatus(writeStatus(root, status)));
});

test('Stage 2 explicit modes require exactly one actual matching report declaration for every result', (t) => {
  const root = temporaryDirectory(t, 'stage2-required-report-mode-');
  const body = '# Review\n\nThe reviewer recorded the actual outcome and remaining eligibility failures.\n';
  for (const control_mode of ['full-blind', 'correction-validation']) {
    for (const result of ['clean', 'findings', 'blocked', 'invalid']) {
      const pass = control_mode === 'full-blind' ? stage2Pass(2, { result }) : correctionPass(2, { result });
      const status = correctionStatus([stage2Pass(1), pass]);
      materializeEvidence(root, status);
      const file = writeStatus(root, status);
      const report = path.join(root, pass.report);
      const marker = `- Control mode: ${control_mode}\n`;
      for (const content of [body, `${body}<!--\n${marker}-->\n`, `${body}\x60\x60\x60text\n${marker}\x60\x60\x60\n`,
        `${body}    ${marker}`, `${body}> ${marker}`, `${body}${marker}${marker}`]) {
        fs.writeFileSync(report, content);
        assert.throws(() => loadAndValidateStatus(file), /one valid Control mode declaration/);
      }
      fs.writeFileSync(report, `${body}${marker}`);
      assert.doesNotThrow(() => loadAndValidateStatus(file));
    }
  }
  const historical = reviewPass('stage-02');
  const status = correctionStatus([historical]);
  materializeEvidence(root, status, { [historical.report]: body });
  assert.doesNotThrow(() => loadAndValidateStatus(writeStatus(root, status)));
});

test('Stage 2 mode declarations quoted as examples are not report metadata', (t) => {
  const root = temporaryDirectory(t, 'stage2-report-example-');
  const status = correctionStatus();
  materializeEvidence(root, status, {
    [status.review_passes[1].report]: '# Review\n\nThe complete correction coverage was reconciled.\n' +
      '<!--\n- Control mode: full-blind\n-->\n```text\n- Control mode: full-blind\n```\n' +
      '~~~text\n- Control mode: full-blind\n~~~\n- Control mode: correction-validation\n',
  });
  assert.doesNotThrow(() => loadAndValidateStatus(writeStatus(root, status)));
});

test('other-stage reports may retain harmless not-applicable control-mode metadata', (t) => {
  const root = temporaryDirectory(t, 'other-stage-report-mode-');
  const status = validStatus({ review_passes: [reviewPass('stage-07')] });
  for (const marker of ['not applicable', 'not applicable (Stage 2 only)', 'N/A']) {
    materializeEvidence(root, status, {
      [status.review_passes[0].report]: `# Review\n\nThe declared scope was fully checked.\n- Control mode: ${marker}\n`,
    });
    assert.doesNotThrow(() => loadAndValidateStatus(writeStatus(root, status)));
  }
});

test('a deployed active slice must enter the permanent UI regression baseline', () => {
  const missing = validStatus({
    delivery: {
      active_slice: '001-test-slice',
      delivered_ui_slices: [],
      ui_parity_corrections: [],
      slice_status: 'deployed',
      completed_slices: [],
      completed_slice_evidence: [],
      reopened_slices: [],
      consolidated_backlog: null,
      owner_walkthrough_reports: [],
      owner_walkthrough_decision_id: null,
    },
  });
  assert(validateStatus(missing).some((error) => error.includes('delivered_ui_slices')));

  missing.delivery.delivered_ui_slices.push('001-test-slice');
  assert.deepEqual(validateStatus(missing), []);
});

test('fails closed on pre-1.3 status and missing legacy walkthrough contract', () => {
  const oldVersion = validStatus();
  oldVersion.schema_version = '1.1.0';
  assert(validateStatus(oldVersion).some((error) => error.includes('schema_version')));

  const missingWalkthrough = validStatus();
  delete missingWalkthrough.legacy_walkthrough;
  assert(validateStatus(missingWalkthrough).some((error) => error.includes('legacy_walkthrough')));
});

test('rejects historical acceptance report naming', () => {
  const status = validStatus({
    review_passes: [{
      ...reviewPass('stage-19', 2),
      report: 'analysis/reviews/stage-10-pass-002.md',
    }],
  });
  assert(validateStatus(status).some((error) => error.includes('stage-19-pass-002.md')));
});

test('rejects a waiver decision missing canonical schema fields', () => {
  const status = validStatus({
    owner_decisions: [{
      id: 'waiver:prototyping_retroactive:fixture-scope',
      decision: 'approved',
      decided_by: 'project owner',
      scope: 'fixture-scope',
    }],
  });
  const errors = validateStatus(status);
  assert(errors.some((error) => error.includes('decided_at')));
  assert(errors.some((error) => error.includes('record')));
  assert(errors.some((error) => error.includes('residual_risk')));
  assert(errors.some((error) => error.includes('permitted_next_stage')));
});

test('requires waiver risk fields without imposing them on ordinary owner decisions', () => {
  const waiver = validWaiver();
  delete waiver.residual_risk;
  delete waiver.permitted_next_stage;
  const waiverErrors = validateStatus(validStatus({ owner_decisions: [waiver] }));
  assert(waiverErrors.some((error) => error.includes('residual_risk')));
  assert(waiverErrors.some((error) => error.includes('permitted_next_stage')));

  const ordinary = {
    ...validWaiver(),
    id: 'decision:target-channel',
  };
  delete ordinary.residual_risk;
  delete ordinary.permitted_next_stage;
  assert.deepEqual(validateStatus(validStatus({ owner_decisions: [ordinary] })), []);
});

test('accepts only one exact schema-valid in-scope waiver decision', () => {
  const status = validStatus({
    owner_decisions: [validWaiver('prototyping_retroactive', 'fixture-scope')],
  });
  assert.deepEqual(validateStatus(status), []);
  assert.equal(auditedScope(status), 'fixture-scope');
  assert.equal(scopeAwareWaiver(status, 'prototyping_retroactive', 'fixture-scope').allowed, true);
  assert.equal(scopeAwareWaiver(status, 'prototyping_retroactive', 'fixture').allowed, false);
  assert.equal(scopeAwareWaiver(status, 'architecture_retroactive', 'fixture-scope').allowed, false);

  const knowledgeStatus = validStatus({
    owner_decisions: [validWaiver('pre_sdd_knowledge', '016-test-slice')],
  });
  assert.equal(
    scopeAwareWaiver(knowledgeStatus, 'pre_sdd_knowledge', '016-test-slice').allowed,
    true
  );
  assert.equal(
    scopeAwareWaiver(knowledgeStatus, 'pre_sdd_knowledge', 'another-slice').allowed,
    false
  );

  status.owner_decisions[0].permitted_next_stage = 'stage-04';
  assert.equal(scopeAwareWaiver(status, 'prototyping_retroactive', 'fixture-scope').allowed, false);
});

test('parses YAML structurally and rejects duplicate keys', (t) => {
  const directory = temporaryDirectory(t, 'status-validator-');
  const file = path.join(directory, 'migration_status.yaml');
  fs.writeFileSync(file, 'schema_version: 1\nschema_version: 1\n', 'utf8');
  assert.throws(() => loadAndValidateStatus(file), /Map keys must be unique|must be unique/i);
});

test('does not treat waiver-looking rationale text as status structure', (t) => {
  const directory = temporaryDirectory(t, 'status-validator-');
  const status = validStatus({
    owner_decisions: [{
      ...validWaiver('another-decision', 'fixture-scope'),
      id: 'ordinary-owner-decision',
      rationale: 'id: waiver:prototyping_retroactive\ndecision: approved\nscope: fixture-scope',
    }],
  });
  const waiverRecord = path.join(directory, 'analysis/stages/waivers/fixture-waiver.md');
  fs.mkdirSync(path.dirname(waiverRecord), { recursive: true });
  fs.writeFileSync(waiverRecord, '# Owner decision\n\nThis is an ordinary recorded decision.\n');
  const loaded = loadAndValidateStatus(writeStatus(directory, status));
  assert.equal(scopeAwareWaiver(loaded, 'prototyping_retroactive', 'fixture-scope').allowed, false);
});

test('rejects current stage that does not match the transition-history tail', () => {
  const status = activeStatus({
    control: {
      state: 'active',
      current_stage: 'stage-19',
      previous_stage: 'stage-18',
      stage_status: 'in_progress',
      next_action: 'Invalid leap.',
    },
  });
  const errors = validateStatus(status);
  assert(errors.some((error) => error.includes('history tail')), errors.join('\n'));
});

test('rejects disconnected transition history', () => {
  const status = activeStatus({
    transition_history: [
      transition('bootstrap', 'stage-01', 1, ownerApproval()),
      transition('stage-05', 'stage-06', 2, ownerApproval()),
    ],
  });
  const errors = validateStatus(status);
  assert(errors.some((error) => error.includes('must continue')), errors.join('\n'));
});

test('requires owner approval at human decision gates', () => {
  const status = activeStatus({
    control: {
      state: 'active',
      current_stage: 'stage-05',
      previous_stage: 'stage-04',
      stage_status: 'in_progress',
      next_action: 'Invalid unapproved requirements transition.',
    },
    transition_history: [
      transition('bootstrap', 'stage-01', 1, ownerApproval()),
      transition('stage-01', 'stage-02', 2),
      transition('stage-02', 'stage-03', 3),
      transition('stage-03', 'stage-04', 4, ownerApproval()),
      transition('stage-04', 'stage-05', 5),
    ],
  });
  assert(validateStatus(status).some((error) => error.includes('owner_approval')));
});

test('requires owner approval for a Stage 3 fallback but not for a live-verified walkthrough', () => {
  const base = completedStatus();
  const history = base.transition_history.map((entry) =>
    entry.from === 'stage-03' && entry.to === 'stage-04'
      ? { ...entry, owner_approval: null }
      : entry
  );

  assert.deepEqual(validateStatus(completedStatus({ transition_history: history })), []);

  const waiver = validWaiver('legacy_walkthrough_fallback', 'fixture-scope');
  const reviewPasses = base.review_passes.map((entry) =>
    entry.stage === 'stage-07'
      ? { ...entry, waiver_ids: [waiver.id] }
      : entry
  );
  const fallback = completedStatus({
    transition_history: history,
    owner_decisions: [waiver],
    review_passes: reviewPasses,
    legacy_walkthrough: {
      outcome: 'partial-simulated',
      scope: 'fixture-scope',
      record: 'analysis/stages/stage-03/stage-03-walkthrough.md',
      decision_id: waiver.id,
      unresolved_blocked_scopes: [],
    },
  });
  assert(validateStatus(fallback).some((error) => error.includes('fallback to Stage 4 requires owner_approval')));
});

test('cannot leave an independent control stage without its latest clean pass', () => {
  const base = completedStatus();
  const status = completedStatus({
    review_passes: base.review_passes.filter((entry) => entry.stage !== 'stage-10'),
  });
  const errors = validateStatus(status);
  assert(errors.some((error) => error.includes('stage-10 pass for exit to stage-11 must be clean')), errors.join('\n'));
});

test('requires a fresh clean pass after re-entering an independent control stage', () => {
  const base = completedStatus();
  const firstStageEightIndex = base.transition_history.findIndex(
    (entry) => entry.from === 'stage-08' && entry.to === 'stage-09'
  );
  const originalStageEightExit = base.transition_history[firstStageEightIndex];
  const history = [
    ...base.transition_history.slice(0, firstStageEightIndex),
    {
      ...transition('stage-08', 'stage-06', 8),
      changed_at: '2026-07-28T10:08:10Z',
    },
    {
      ...transition('stage-06', 'stage-07', 8),
      changed_at: '2026-07-28T10:08:20Z',
    },
    {
      ...transition('stage-07', 'stage-08', 8),
      changed_at: '2026-07-28T10:08:30Z',
    },
    originalStageEightExit,
    ...base.transition_history.slice(firstStageEightIndex + 1),
  ];
  const stale = completedStatus({ transition_history: history });
  assert(
    validateStatus(stale).some((error) => error.includes('stage-07 pass for exit to stage-08 must be clean')),
    validateStatus(stale).join('\n'),
  );

  const fresh = completedStatus({
    transition_history: history,
    review_passes: [
      ...base.review_passes,
      reviewPass('stage-07', 2, {
        reviewed_at: '2026-07-28T10:08:25Z',
      }),
    ],
  });
  assert.deepEqual(validateStatus(fresh), []);
});

test('requires strictly increasing transition timestamps', () => {
  const status = activeStatus();
  status.transition_history[1].changed_at = status.transition_history[0].changed_at;
  const errors = validateStatus(status);
  assert(
    errors.some((error) => error.includes('timestamp must be later than the previous entry')),
    errors.join('\n'),
  );
});

test('requires a waiver to be linked from the next applicable clean control pass', () => {
  const base = completedStatus();
  const waiver = validWaiver('legacy_walkthrough_fallback', 'fixture-scope');
  const status = completedStatus({
    owner_decisions: [waiver],
    review_passes: base.review_passes,
  });
  const errors = validateStatus(status);
  assert(errors.some((error) => error.includes('clean stage-07 pass')), errors.join('\n'));
});

test('accepts completion only with clean control passes and closed delivery evidence', () => {
  assert.deepEqual(validateStatus(completedStatus()), []);
});

test('rejects completion when independent reviews and delivery closure are absent', () => {
  const status = completedStatus({
    review_passes: [],
    delivery: {
      active_slice: '001-first-slice',
      slice_status: 'in_progress',
      completed_slices: [],
      reopened_slices: [{
        slice: '001-first-slice',
        reason: 'Acceptance finding remains open.',
        reopened_at: '2026-07-28T11:00:00Z',
        record: 'analysis/reviews/open-finding.md',
        status: 'open',
      }],
      consolidated_backlog: null,
      owner_walkthrough_reports: [],
    },
  });
  const errors = validateStatus(status);
  assert(errors.some((error) => error.includes('latest stage-02 pass must be clean')));
  assert(errors.some((error) => error.includes('completed_slices')));
  assert(errors.some((error) => error.includes('consolidated_backlog')));
  assert(errors.some((error) => error.includes('active_slice')));
  assert(errors.some((error) => error.includes('open entries')));
});

test('allows finding-driven Stage 19 return without owner approval', () => {
  const complete = completedStatus();
  const history = complete.transition_history.slice(0, -1);
  history.push({
      ...transition('stage-19', 'stage-15', 21),
    gate_evidence: ['analysis/reviews/stage-19-pass-002.md'],
  });
  const status = validStatus({
    ...complete,
    control: {
      state: 'active',
      current_stage: 'stage-15',
      previous_stage: 'stage-19',
      stage_status: 'in_progress',
      next_action: 'Correct the SDD finding and repeat the controlled loop.',
    },
    transition_history: history,
    review_passes: [
      ...complete.review_passes,
      reviewPass('stage-19', 2, {
        result: 'findings',
        reviewed_at: '2026-07-28T10:20:30Z',
      }),
    ],
    delivery: {
      ...complete.delivery,
      active_slice: '001-first-slice',
      slice_status: 'in_progress',
      reopened_slices: [{
        slice: '001-first-slice',
        reason: 'Independent acceptance found an SDD defect.',
        reopened_at: '2026-07-28T11:00:00Z',
        record: 'analysis/reviews/stage-19-pass-002.md',
        status: 'open',
      }],
    },
    progress: {
      ...complete.progress,
      completed_percent: formalStageProgress('stage-15').percent,
    },
  });
  assert.deepEqual(validateStatus(status), []);
});

test('completion loader requires every recorded acceptance file to exist', (t) => {
  const root = temporaryDirectory(t, 'status-validator-complete-');
  const analysis = path.join(root, 'analysis');
  fs.mkdirSync(analysis);
  const status = completedStatus();
  const statusFile = writeStatus(analysis, status);
  assert.throws(
    () => loadAndValidateStatus(statusFile),
    /recorded evidence file does not exist/
  );

  materializeEvidence(root, status);
  assert.equal(loadAndValidateStatus(statusFile).control.current_stage, 'complete');
});

test('allows map-error, channel, architecture, and implementation return loops', () => {
  const base = completedStatus();
  const cases = [
    ['stage-17', 'stage-01'],
    ['stage-06', 'stage-05'],
    ['stage-07', 'stage-05'],
    ['stage-08', 'stage-05'],
    ['stage-09', 'stage-06'],
    ['stage-09', 'stage-05'],
    ['stage-18', 'stage-17'],
    ['stage-17', 'stage-15'],
    ['stage-18', 'stage-15'],
    ['stage-17', 'stage-09'],
    ['stage-18', 'stage-09'],
    ['stage-18', 'stage-17'],
    ['stage-18', 'stage-09'],
    ['stage-19', 'stage-09'],
  ];
  for (const [from, to] of cases) {
    const index = base.transition_history.findIndex((entry) => entry.to === from);
    const history = base.transition_history.slice(0, index + 1);
    history.push(transition(from, to, 40 + index));
    const status = validStatus({
      ...base,
      control: {
        state: 'active',
        current_stage: to,
        previous_stage: from,
        stage_status: 'in_progress',
        next_action: `Return from ${from} to ${to}.`,
      },
      transition_history: history,
      review_passes: ['stage-07', 'stage-19'].includes(from)
        ? [
            ...base.review_passes,
            reviewPass(from, 2, {
              result: 'findings',
              reviewed_at: `2026-07-28T10:${String(40 + index - 1).padStart(2, '0')}:30Z`,
            }),
          ]
        : base.review_passes,
      progress: {
        ...base.progress,
        completed_percent: formalStageProgress(to).percent,
      },
    });
    assert.deepEqual(validateStatus(status), [], `${from} -> ${to}`);
  }
});

test('allows an ordinary failure to remain blocked at the current stage without a synthetic transition', () => {
  const status = activeStatus({
    control: {
      state: 'active',
      current_stage: 'stage-02',
      previous_stage: 'stage-01',
      stage_status: 'blocked',
      next_action: 'Resolve the current-stage blocker and retry the same gate.',
    },
  });
  assert.deepEqual(validateStatus(status), []);
});

test('requires a structured Stage 3 outcome and exact owner decision for fallback modes', () => {
  const base = completedStatus();
  const pending = completedStatus({
    legacy_walkthrough: {
      outcome: 'pending',
      scope: 'fixture-scope',
      record: null,
      decision_id: null,
      unresolved_blocked_scopes: [],
    },
  });
  assert(validateStatus(pending).some((error) => error.includes('non-pending Stage 3 outcome')));

  const decision = {
    ...validWaiver('legacy-runtime', 'fixture-scope'),
    id: 'stage-03:simulate',
  };
  const simulated = completedStatus({
    owner_decisions: [decision],
    legacy_walkthrough: {
      outcome: 'partial-simulated',
      scope: 'fixture-scope',
      record: 'analysis/stages/stage-03/stage-03-walkthrough.md',
      decision_id: decision.id,
      unresolved_blocked_scopes: [],
    },
  });
  assert.deepEqual(validateStatus(simulated), []);
  assert.equal(base.legacy_walkthrough.outcome, 'live-verified');
});

test('requires every approved waiver to be linked from an exact-scope clean review', () => {
  const waiver = validWaiver('prototyping_retroactive', 'fixture-scope');
  const unlinked = completedStatus({ owner_decisions: [waiver] });
  assert(validateStatus(unlinked).some((error) => error.includes('requires an exact-scope clean independent review')));

  const linkedPasses = unlinked.review_passes.map((entry) =>
    entry.stage === 'stage-07' ? { ...entry, waiver_ids: [waiver.id] } : entry
  );
  const linked = completedStatus({
    owner_decisions: [waiver],
    review_passes: linkedPasses,
  });
  assert.deepEqual(validateStatus(linked), []);
});

test('allows completion with exact prototype and architecture waivers after their control passes', () => {
  const base = completedStatus();
  const prototypeWaiver = validWaiver(
    'prototyping_retroactive',
    'fixture-scope',
  );
  prototypeWaiver.permitted_next_stage = 'stage-06';
  const architectureWaiver = validWaiver(
    'architecture_retroactive',
    'fixture-scope',
  );
  architectureWaiver.permitted_next_stage = 'stage-09';
  const reviewPasses = base.review_passes.map((entry) => {
    if (entry.stage === 'stage-07') {
      return { ...entry, waiver_ids: [prototypeWaiver.id] };
    }
    if (entry.stage === 'stage-10') {
      return { ...entry, waiver_ids: [architectureWaiver.id] };
    }
    return entry;
  });
  const status = completedStatus({
    owner_decisions: [prototypeWaiver, architectureWaiver],
    review_passes: reviewPasses,
  });
  assert.deepEqual(validateStatus(status), []);
});

test('allows unresolved Stage 3 scope only with an exact waiver that is independently reviewed', () => {
  const waiver = validWaiver('legacy_walkthrough_fallback', 'fixture-scope');
  const passes = completedStatus().review_passes.map((entry) =>
    entry.stage === 'stage-07' ? { ...entry, waiver_ids: [waiver.id] } : entry
  );
  const status = completedStatus({
    owner_decisions: [waiver],
    review_passes: passes,
    legacy_walkthrough: {
      outcome: 'blocked-waived',
      scope: 'fixture-scope',
      record: 'analysis/stages/stage-03/stage-03-walkthrough.md',
      decision_id: waiver.id,
      unresolved_blocked_scopes: [{
        id: 'legacy-runtime-unavailable',
        summary: 'The real legacy runtime is unavailable.',
        status: 'blocked',
        waiver_id: waiver.id,
        evidence: ['analysis/stages/waivers/legacy-runtime.md'],
      }],
    },
  });
  assert.deepEqual(validateStatus(status), []);

  status.review_passes = status.review_passes.map((entry) => ({ ...entry, waiver_ids: [] }));
  assert(validateStatus(status).some((error) => error.includes('requires an exact-scope clean independent review')));
});

test('requires project owner identity for ratification, decisions, and transition approvals', () => {
  const base = completedStatus();
  const wrongRatifier = completedStatus({
    constitution: { ...base.constitution, ratified_by: 'another actor' },
  });
  assert(validateStatus(wrongRatifier).some((error) => error.includes('ratified_by must equal project.owner')));

  const wrongDecision = completedStatus({
    owner_decisions: [{
      id: 'decision:example',
      decision: 'approved',
      decided_by: 'another actor',
      decided_at: '2026-07-28T10:00:00Z',
      scope: 'fixture-scope',
      rationale: 'A durable owner decision for a governed project choice.',
      record: 'analysis/stages/decision-example.md',
    }],
  });
  assert(validateStatus(wrongDecision).some((error) => error.includes('decided_by must equal project.owner')));

  const history = base.transition_history.map((entry, index) =>
    index === 0
      ? { ...entry, owner_approval: { ...entry.owner_approval, approved_by: 'another actor' } }
      : entry
  );
  assert(validateStatus(completedStatus({ transition_history: history }))
    .some((error) => error.includes('approved_by must equal project.owner')));
});

test('completion rejects open blockers, incomplete progress, and missing owner walkthrough disposition', () => {
  const base = completedStatus();
  const status = completedStatus({
    blockers: [{
      id: 'blocker:open',
      summary: 'A governed completion blocker remains unresolved.',
      owner: 'project owner',
      status: 'open',
      opened_at: '2026-07-28T10:00:00Z',
      resolved_at: null,
      evidence: ['analysis/stages/blocker-open.md'],
    }],
    delivery: {
      ...base.delivery,
      owner_walkthrough_reports: [],
      owner_walkthrough_decision_id: null,
    },
    progress: {
      ...base.progress,
      completed_percent: 99,
    },
  });
  const errors = validateStatus(status);
  assert(errors.some((error) => error.includes('/blockers cannot contain open entries')));
  assert(errors.some((error) => error.includes('completed_percent must be 100')));
  assert(errors.some((error) => error.includes('owner walkthrough report')));
});

test('completion accepts an exact owner decision declining the optional walkthrough', () => {
  const base = completedStatus();
  const decision = {
    id: 'owner-walkthrough-declined:fixture-scope',
    decision: 'approved',
    decided_by: 'project owner',
    decided_at: '2026-07-28T10:00:00Z',
    scope: 'fixture-scope',
    rationale: 'The owner relies on complete independent role and smoke evidence.',
    record: 'analysis/stages/stage-19/owner-walkthrough-decline.md',
  };
  const status = completedStatus({
    owner_decisions: [decision],
    delivery: {
      ...base.delivery,
      owner_walkthrough_reports: [],
      owner_walkthrough_decision_id: decision.id,
    },
  });
  assert.deepEqual(validateStatus(status), []);
});

test('rejects clean reviews that declare authored artifacts', () => {
  const status = validStatus({
    review_passes: [reviewPass('stage-02', 1, {
      authored_artifacts: ['analysis/legacy_user_flows.xlsx'],
    })],
  });
  assert(validateStatus(status).some((error) => error.includes('authored_artifacts')));
});

test('requires an ineligible authoring reviewer to record an invalid pass', () => {
  const status = validStatus({
    review_passes: [reviewPass('stage-02', 1, {
      result: 'findings',
      authored_artifacts: ['analysis/legacy_user_flows.xlsx'],
    })],
  });
  assert(validateStatus(status).some((error) => error.includes('must be invalid')));
});

test('requires a unique session id for every review pass', () => {
  const first = reviewPass('stage-02', 1);
  const second = reviewPass('stage-07', 1, { session_id: first.session_id });
  assert(
    validateStatus(validStatus({ review_passes: [first, second] }))
      .some((error) => error.includes('session_id') && error.includes('unique')),
  );
});

test('requires structured reviewer identity, session, and independence record', () => {
  const pass = reviewPass('stage-02');
  delete pass.session_id;
  delete pass.independence_record;
  const errors = validateStatus(validStatus({ review_passes: [pass] }));
  assert(errors.some((error) => error.includes('session_id')));
  assert(errors.some((error) => error.includes('independence_record')));
});

test('rejects malformed status without throwing TypeError', () => {
  assert.doesNotThrow(() => validateStatus(null));
  assert(validateStatus(null).length > 0);
  assert.doesNotThrow(() => validateRecordedEvidence(null, process.cwd()));
  assert.equal(auditedScope(null), null);
  assert.equal(scopeAwareWaiver(null, 'prototype', 'fixture-scope').allowed, false);
});

test('rejects unregistered scope-aware waiver gates', () => {
  const status = validStatus({
    owner_decisions: [validWaiver('invented_gate', 'fixture-scope')],
  });
  const decision = scopeAwareWaiver(status, 'invented_gate', 'fixture-scope');
  assert.equal(decision.allowed, false);
  assert.match(decision.reason, /not registered/);
});

test('rejects empty, template-only, and symlinked durable evidence', (t) => {
  const root = temporaryDirectory(t, 'status-validator-evidence-');
  const missingRecordStatus = validStatus({
    owner_decisions: [validWaiver('missing-record', 'fixture-scope')],
  });
  assert(
    validateRecordedEvidence(missingRecordStatus, root)
      .some((error) => error.includes('does not exist')),
  );

  const waiver = {
    ...validWaiver('linked-evidence', 'fixture-scope'),
    record: 'linked-evidence/decision.md',
  };
  const status = activeStatus({ owner_decisions: [waiver] });
  materializeEvidence(root, status);
  const gate = path.join(root, 'analysis/stages/gate-record.md');
  fs.writeFileSync(gate, '# Gate\n\nTODO: <complete this record>\n');
  assert(validateRecordedEvidence(status, root).some((error) => error.includes('template-only')));

  fs.writeFileSync(gate, '# Gate\n\nCompleted with real evidence.\n');
  const linkedDirectory = path.join(root, 'linked-evidence');
  const targetDirectory = path.join(root, 'real-evidence');
  fs.rmSync(linkedDirectory, { recursive: true });
  fs.mkdirSync(targetDirectory);
  fs.writeFileSync(
    path.join(targetDirectory, 'decision.md'),
    '# Decision\n\nCompleted outside the governed evidence path.\n'
  );
  try {
    fs.symlinkSync(targetDirectory, linkedDirectory, process.platform === 'win32' ? 'junction' : 'dir');
  } catch (error) {
    if (['EPERM', 'EACCES', 'UNKNOWN'].includes(error.code)) {
      t.skip(`symbolic links unavailable: ${error.code}`);
      return;
    }
    throw error;
  }
  assert(validateRecordedEvidence(status, root).some((error) => error.includes('symbolic link')));
});

test('accepts the report as its own independence record only when the declaration is complete', (t) => {
  const root = temporaryDirectory(t, 'status-validator-independence-');
  const pass = reviewPass('stage-02', 1, {
    independence_record: 'analysis/reviews/stage-02-pass-001.md',
  });
  const status = activeStatus({ review_passes: [pass] });
  materializeEvidence(root, status);
  const report = path.join(root, pass.report);

  const body = (items) => [
    '# Stage 02 Review - Pass 001',
    '',
    '## Independence Declaration',
    '',
    ...items,
    '',
    '## Findings',
    '',
    'The reviewer enumerated the complete declared scope and recorded results.',
    '',
  ].join('\n');

  const complete = [
    '- [x] I did not create or edit any artifact in this review scope.',
    '- [x] My current context does not include the authoring session.',
    '- [x] I am working read-only from the declared immutable revision.',
    '- [x] I independently enumerated the complete scope.',
  ];

  fs.writeFileSync(report, body(complete));
  assert.deepEqual(
    validateRecordedEvidence(status, root).filter((error) => error.includes('independence_record')),
    [],
    'a completed declaration inside the report satisfies the reviews contract'
  );

  fs.writeFileSync(report, body([...complete.slice(0, 3), '- [ ] I independently enumerated the complete scope.']));
  assert(
    validateRecordedEvidence(status, root).some((error) => error.includes('unchecked items')),
    'an unchecked declaration item must fail'
  );

  fs.writeFileSync(report, body(complete.slice(0, 2)));
  assert(
    validateRecordedEvidence(status, root).some((error) => error.includes('incomplete')),
    'a truncated declaration must fail'
  );

  fs.writeFileSync(report, '# Stage 02 Review - Pass 001\n\nNo declaration section exists in this report.\n');
  assert(
    validateRecordedEvidence(status, root).some((error) => error.includes('no Independence Declaration')),
    'a report without the declaration section must fail'
  );
});

test('accepts durable evidence that quotes markup inside code spans', (t) => {
  const root = temporaryDirectory(t, 'status-validator-quoted-');
  const waiver = validWaiver('quoted-markup', 'fixture-scope');
  const status = activeStatus({ owner_decisions: [waiver] });
  materializeEvidence(root, status);
  const record = path.join(root, waiver.record);

  fs.writeFileSync(
    record,
    [
      '# Finding',
      '',
      'The shipped descriptor declares `<action path="/view/iterationTabs">`',
      'whose forward target is absent, and the service is deployed with',
      '`<parameter name="allowedMethods" value="*"/>`, so every public method',
      'is reachable. The fenced block below is quoted evidence, not a template.',
      '',
      '```xml',
      '<row r="39" ht="40" customHeight="1" hidden="1" spans="1:14">',
      '```',
      '',
    ].join('\n')
  );
  assert.deepEqual(
    validateRecordedEvidence(status, root),
    [],
    'quoted markup must not be mistaken for an unfilled placeholder'
  );

  fs.writeFileSync(record, '# Finding\n\nScope: <exact scope to be filled in later>\n');
  assert(
    validateRecordedEvidence(status, root).some((error) => error.includes('template-only')),
    'a prose placeholder outside code spans must still fail'
  );

  // A reviewer wrapping a long citation inside a code span puts a newline in
  // the middle of it; the span is still a span.
  fs.writeFileSync(
    record,
    [
      '# Finding',
      '',
      'The settings table emits',
      '`<xplanner:link href="setting" paramId="oid" paramName="setting"',
      '  paramProperty="id">` which resolves to an undeclared path, so the',
      'link cannot reach an action and the screen dead-ends there.',
      '',
    ].join('\n')
  );
  assert.deepEqual(
    validateRecordedEvidence(status, root),
    [],
    'a code span wrapped across one line break must still be treated as code'
  );

  // An unbalanced backtick must not swallow the rest of the document and hide
  // a real placeholder behind it.
  fs.writeFileSync(
    record,
    '# Finding\n\nAn unclosed ` backtick starts here.\n\nScope: <exact scope to be filled in later>\n'
  );
  assert(
    validateRecordedEvidence(status, root).some((error) => error.includes('template-only')),
    'an unbalanced backtick must not mask a placeholder past a blank line'
  );
});

test('reconciles completed slice identifiers, SDD files, tasks, and delivery evidence', (t) => {
  const root = temporaryDirectory(t, 'status-validator-slices-');
  const status = completedStatus();
  materializeEvidence(root, status);
  assert.deepEqual(validateRecordedEvidence(status, root), []);

  const tasks = path.join(root, status.delivery.completed_slice_evidence[0].tasks);
  fs.appendFileSync(tasks, '\n- [ ] T002 unfinished work\n');
  assert(validateRecordedEvidence(status, root).some((error) => error.includes('unchecked work')));

  const mismatch = completedStatus({
    delivery: {
      ...status.delivery,
      completed_slice_evidence: [],
    },
  });
  assert(validateStatus(mismatch).some((error) => error.includes('must contain records')));
});

test('passClosesStage: the owner exit-criterion matrix', () => {
  const closing = { result: 'findings', findings_severity_max: 'low', never_cosmetic_check: 'confirmed', all_findings_cosmetic: 'confirmed', dispositioned_in: 'ui-polish-backlog.md' };
  assert.equal(passClosesStage({ result: 'clean' }), true);
  assert.equal(passClosesStage(closing), true);
  assert.equal(passClosesStage({ ...closing, findings_severity_max: 'medium' }), false);
  assert.equal(passClosesStage({ ...closing, never_cosmetic_check: undefined }), false);
  assert.equal(passClosesStage({ ...closing, all_findings_cosmetic: undefined }), false);
  assert.equal(passClosesStage({ ...closing, all_findings_cosmetic: 'Confirmed' }), false);
  assert.equal(passClosesStage({ ...closing, dispositioned_in: '   ' }), false);
  assert.equal(passClosesStage({ ...closing, unchecked_scopes: ['visual'] }), false);
  assert.equal(passClosesStage({ result: 'clean', unchecked_scopes: ['visual'] }), false);
  assert.equal(passClosesStage({ result: 'blocked' }), false);
  assert.equal(passClosesStage(null), false);
});

test('findings metadata on a non-findings pass is a contradiction', () => {
  const base = completedStatus();
  const passes = base.review_passes.map((entry) =>
    entry.stage === 'stage-07' ? { ...entry, findings_severity_max: 'medium' } : entry);
  const errors = validateStatus(completedStatus({ review_passes: passes }));
  assert(errors.some((error) => error.includes('carries findings metadata but result is not findings')), errors.join(String.fromCharCode(92) + 'n'));
});

test('unchecked scopes force result blocked whatever the result claims', () => {
  const base = completedStatus();
  const passes = base.review_passes.map((entry) =>
    entry.stage === 'stage-07' ? { ...entry, unchecked_scopes: ['visual render'] } : entry);
  const errors = validateStatus(completedStatus({ review_passes: passes }));
  assert(errors.some((error) => error.includes('carries unchecked_scopes and must be result: blocked')), errors.join(String.fromCharCode(92) + 'n'));
});

test('the low-cosmetic closure applies to stage-07 and to no other stage', () => {
  const closingFields = { result: 'findings', findings_severity_max: 'low', never_cosmetic_check: 'confirmed', all_findings_cosmetic: 'confirmed', dispositioned_in: 'ui-polish-backlog.md' };
  const base = completedStatus();
  const stage07 = completedStatus({ review_passes: base.review_passes.map((entry) =>
    entry.stage === 'stage-07' ? { ...entry, ...closingFields } : entry) });
  const errors07 = validateStatus(stage07);
  assert(!errors07.some((error) => error.includes('stage-07 pass for exit')), errors07.join(String.fromCharCode(92) + 'n'));
  const stage10 = completedStatus({ review_passes: base.review_passes.map((entry) =>
    entry.stage === 'stage-10' ? { ...entry, ...closingFields } : entry) });
  const errors10 = validateStatus(stage10);
  assert(errors10.some((error) => error.includes('stage-10 pass for exit')), errors10.join(String.fromCharCode(92) + 'n'));
});

test('post-cutoff architecture and knowledge exits must pin the exact artifact set', () => {
  const base = completedStatus();
  const transition_history = base.transition_history.map((entry) => ({
    ...entry,
    changed_at: entry.changed_at.replace('2026-07-28', '2026-08-08'),
  }));
  const postCutoff = base.review_passes.map((entry) => ({
    ...entry,
    reviewed_at: entry.reviewed_at.replace('2026-07-28', '2026-08-08'),
  }));
  const missing = validateStatus(completedStatus({ transition_history, review_passes: postCutoff }));
  assert(missing.some((error) => error.includes('stage-10 pass 1 must pin artifact_set_version')));
  assert(missing.some((error) => error.includes('stage-14 pass 1 must pin artifact_set_version')));

  const pinned = postCutoff.map((entry) =>
    ['stage-10', 'stage-14'].includes(entry.stage)
      ? {
          ...entry,
          artifact_set_version: `${entry.stage}-fixture-v1`,
          artifact_manifest_sha256: 'a'.repeat(64),
        }
      : entry);
  assert.deepEqual(validateStatus(completedStatus({ transition_history, review_passes: pinned })), []);
});

test('recorded Stage 10 and Stage 14 evidence must match the current manifests', (t) => {
  const root = temporaryDirectory(t, 'status-validator-artifact-binding-');
  const base = completedStatus();
  const architecture = {
    document_set_version: 'architecture-v1',
  };
  const knowledge = {
    knowledge_set_version: 'knowledge-v1',
  };
  const architectureFile = path.join(root, 'analysis/architecture/architecture-nfr-manifest.json');
  const knowledgeFile = path.join(root, 'analysis/knowledge/knowledge-manifest.json');
  fs.mkdirSync(path.dirname(architectureFile), { recursive: true });
  fs.mkdirSync(path.dirname(knowledgeFile), { recursive: true });
  fs.writeFileSync(architectureFile, JSON.stringify(architecture));
  fs.writeFileSync(knowledgeFile, JSON.stringify(knowledge));
  const passes = base.review_passes.map((entry) => {
    if (entry.stage === 'stage-10') {
      return {
        ...entry,
        reviewed_at: '2026-08-07T18:30:00Z',
        artifact_set_version: architecture.document_set_version,
        artifact_manifest_sha256: sha256File(architectureFile),
      };
    }
    if (entry.stage === 'stage-14') {
      return {
        ...entry,
        reviewed_at: '2026-08-07T18:31:00Z',
        artifact_set_version: knowledge.knowledge_set_version,
        artifact_manifest_sha256: sha256File(knowledgeFile),
      };
    }
    return entry;
  });
  const status = completedStatus({ review_passes: passes });
  materializeEvidence(root, status);
  assert.deepEqual(
    validateRecordedEvidence(status, root).filter((error) => error.includes('artifact_') || error.includes('artifact manifest')),
    []
  );

  architecture.document_set_version = 'architecture-v2';
  fs.writeFileSync(architectureFile, JSON.stringify(architecture));
  const errors = validateRecordedEvidence(status, root);
  assert(errors.some((error) => error.includes('artifact_set_version does not match')));
  assert(errors.some((error) => error.includes('artifact_manifest_sha256 does not match')));
});

test('parallel progression still binds post-cutoff Stage 10 and Stage 14 passes', (t) => {
  const root = temporaryDirectory(t, 'status-validator-parallel-binding-');
  const stage10 = reviewPass('stage-10', 1, {
    reviewed_at: '2026-08-07T18:30:00Z',
  });
  const status = activeStatus({ review_passes: [stage10] });
  const structural = validateStatus(status);
  assert(structural.some((error) => error.includes('stage-10 pass 1 must pin artifact_set_version')));

  const manifestFile = path.join(root, 'analysis/architecture/architecture-nfr-manifest.json');
  fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
  fs.writeFileSync(manifestFile, JSON.stringify({ document_set_version: 'architecture-v1' }));
  const pinned = activeStatus({
    review_passes: [{
      ...stage10,
      artifact_set_version: 'architecture-v1',
      artifact_manifest_sha256: sha256File(manifestFile),
    }],
  });
  materializeEvidence(root, pinned);
  assert.deepEqual(
    validateRecordedEvidence(pinned, root).filter((error) => error.includes('artifact_') || error.includes('artifact manifest')),
    []
  );

  fs.writeFileSync(manifestFile, JSON.stringify({ document_set_version: 'architecture-v2' }));
  const stale = validateRecordedEvidence(pinned, root);
  assert(stale.some((error) => error.includes('artifact_set_version does not match')));
  assert(stale.some((error) => error.includes('artifact_manifest_sha256 does not match')));
  const historicalHash = pinned.review_passes[0].artifact_manifest_sha256;
  pinned.control.current_stage = 'stage-09';
  pinned.transition_history.push({from:'stage-12',to:'stage-09',changed_at:'2026-08-08T10:00:00Z'});
  const reentry = validateRecordedEvidence(pinned, root);
  assert(!reentry.some(error => /artifact_set_version does not match|artifact_manifest_sha256 does not match/.test(error)));
  assert.equal(pinned.review_passes[0].artifact_manifest_sha256, historicalHash, 'return preserves old pass hashes');
  pinned.control.current_stage = 'stage-11';
  assert(validateRecordedEvidence(pinned, root).some(error => error.includes('artifact_manifest_sha256 does not match')));
});

test('the polish backlog must be a regular file inside the project', (t) => {
  const directory = temporaryDirectory(t, 'status-validator-');
  fs.mkdirSync(path.join(directory, 'somedir'));
  fs.writeFileSync(path.join(directory, 'ui-polish-backlog.md'), '# backlog\n\n## pass session-stage-07-1\n- finding: low cosmetic; disposition: polish later');
  const closingFields = { result: 'findings', findings_severity_max: 'low', never_cosmetic_check: 'confirmed', all_findings_cosmetic: 'confirmed' };
  const base = completedStatus();
  const withPath = (value) => completedStatus({ review_passes: base.review_passes.map((entry) =>
    entry.stage === 'stage-07' ? { ...entry, ...closingFields, dispositioned_in: value } : entry) });
  assert.deepEqual(validateRecordedEvidence(withPath('ui-polish-backlog.md'), directory).filter((error) => error.includes('dispositioned_in')), []);
  fs.writeFileSync(path.join(directory, 'package.json'), '{}');
  fs.writeFileSync(path.join(directory, 'somedir', 'ui-polish-backlog.md'), '');
  for (const bad of ['.', 'somedir', '../escape.md', 'missing.md', 'package.json', 'somedir/ui-polish-backlog.md']) {
    const errors = validateRecordedEvidence(withPath(bad), directory);
    assert(errors.some((error) => error.includes('must be the non-empty ui-polish-backlog.md')), bad + ': ' + errors.join(String.fromCharCode(92) + 'n'));
  }
});

test('unchecked scopes on non-stage-07 passes keep their old semantics', () => {
  const base = completedStatus();
  const passes = base.review_passes.map((entry) =>
    entry.stage === 'stage-10' ? { ...entry, unchecked_scopes: ['performance'] } : entry);
  const errors = validateStatus(completedStatus({ review_passes: passes }));
  assert(!errors.some((error) => error.includes('unchecked_scopes')), errors.join(String.fromCharCode(92) + 'n'));
});

test('reading markup is not a placeholder and cannot hide a real missing field', (t) => {
  const root = temporaryDirectory(t, 'status-readable-evidence-');
  const status = activeStatus();
  materializeEvidence(root, status);
  const file = path.join(root, 'analysis/stages/gate-record.md');
  const content = '<!-- ARTIFACT_READING_START -->\n' +
    '<details>\n<summary>Contents</summary>\n\n- [Results](#results)\n</details>\n' +
    '<!-- ARTIFACT_READING_END -->\n# Results\nInspected source routes and recorded exact observations.\n';
  fs.writeFileSync(file, content);
  assert(!validateRecordedEvidence(status, root).some(error => error.includes('template-only')));
  fs.writeFileSync(file, content + '\nScope: <exact scope>\n');
  assert(validateRecordedEvidence(status, root).some(error => error.includes('template-only')));
  fs.writeFileSync(file, '<!-- Filled by an author with many words -->');
  assert(validateRecordedEvidence(status, root).some(error => error.includes('template-only')));
});

test('a backlog that never mentions the pass does not close it', (t) => {
  const directory = temporaryDirectory(t, 'status-validator-');
  fs.writeFileSync(path.join(directory, 'ui-polish-backlog.md'), '# backlog for some other pass entirely');
  const closingFields = { result: 'findings', findings_severity_max: 'low', never_cosmetic_check: 'confirmed', all_findings_cosmetic: 'confirmed', dispositioned_in: 'ui-polish-backlog.md' };
  const base = completedStatus();
  const status = completedStatus({ review_passes: base.review_passes.map((entry) =>
    entry.stage === 'stage-07' ? { ...entry, ...closingFields } : entry) });
  const errors = validateRecordedEvidence(status, directory);
  assert(errors.some((error) => error.includes('does not record this pass')), errors.join(String.fromCharCode(92) + 'n'));
});
