// Builds analysis/reviews/evidence/S02-P005/comparison-results.json (reviewer-authored).
'use strict';
const fs = require('fs');
const inv = JSON.parse(fs.readFileSync('C:/Work/Legacy/xplanner2-revision1/analysis/reviews/evidence/S02-P005/phase-a-inventory.json', 'utf8'));
const wb = require('./workbook-rows.json').rows.filter(r => r.type === 'scenario');
const C = []; let n = 0;
const id = () => 'C-' + String(++n).padStart(3, '0');
const add = o => { o.id = id(); C.push(o); return o.id; };

// ---- Direction 1: independent inventory -> Stage 1 records
const map = {
  'A-001': ['Recon Source Inventory (WAR composition)', 'matched', 'RC-001: Stage 1 JAR count 102 is correct; Phase A 103 counted the lib/ directory entry'],
  'A-002': ['Recon Scope And Provenance (upstream revision)', 'matched'],
  'A-003': ['Recon Scope And Provenance (known patch); GAP-005 P-01, P-02, P-07', 'matched'],
  'A-004': ['Recon Source Inventory (local run helpers); GAP-008', 'matched'],
  'A-005': ['Recon Source Inventory (container metadata); GAP-008; row 188', 'matched'],
  'A-006': ['Recon Scope (exclusions); GAP-006', 'matched'],
  'A-007': ['Recon Source Inventory (third-party libraries)', 'matched', 'RC-001'],
  'A-010': ['Recon Source Inventory (web.xml row)', 'matched'],
  'A-011': ['Recon Source Inventory (web.xml row); rows 17, 72', 'matched'],
  'A-012': ['Recon Source Inventory (web.xml row); rows 66, 188', 'matched'],
  'A-013': ['Row 64; recon Schema and seed data', 'matched'],
  'A-014': ['Row 65; recon Spring context row', 'matched'],
  'A-015': ['Recon Spring row; recon Dormant code row ("DAOs found by DaoScanner")', 'mismatch', 'DaoScanner only prints beans; it registers nothing (F-001)', 'F-001'],
  'A-016': ['Rows 20, 56, 57', 'matched'],
  'A-020': ['Rows 10, 16, 17, 32', 'matched'],
  'A-021': ['Row 61; GAP-007; Q3 facts', 'matched'],
  'A-022': ['Row 233', 'matched'],
  'A-023': ['Row 215', 'matched'],
  'A-024': ['Recon unauthenticated-surface list; rows 18, 73, 216, 225', 'matched'],
  'A-025': ['Rows 8, 10, 12, 14', 'matched'],
  'A-026': ['Rows 11, 21', 'matched'],
  'A-027': ['Rows 11, 13, 47', 'matched'],
  'A-028': ['Rows 15, 16; Q3 facts', 'mismatch', 'cookie lifetime and flags not recorded', 'F-003'],
  'A-029': ['Row 19', 'matched'],
  'A-030': ['Q3 facts; row 67; GAP-007; P-01', 'matched'],
  'A-040': ['Rows 23, 25', 'matched'],
  'A-041': ['Rows 23, 24', 'matched'],
  'A-042': ['Rows 23-25, 33; recon Security configuration row', 'matched'],
  'A-043': ['Rows 29, 30; enforcement table', 'matched'],
  'A-044': ['Rows 28, 31, 167, 180, 218, 230; enforcement table', 'matched', 'RC-003: the EditRoleAction check is unreachable (row 35), Phase A listed it as effective'],
  'A-045': ['Row 26', 'matched'],
  'A-046': ['Row 28; GAP-003', 'matched'],
  'A-050': ['Rows 75-77', 'matched'], 'A-051': ['Rows 83-84', 'matched'], 'A-052': ['Rows 78-81', 'matched'], 'A-053': ['Rows 85-86', 'matched'],
  'A-054': ['Row 82', 'matched', 'RC-002: project attributes are removed with the project (Project#getAttributes @ElementCollection); Stage 1 is correct'],
  'A-055': ['Rows 92-113', 'matched'], 'A-056': ['Rows 88-90', 'matched'], 'A-057': ['Rows 98-100', 'matched'], 'A-058': ['Row 101', 'matched'],
  'A-059': ['Rows 102-104', 'matched'], 'A-060': ['Row 91', 'matched'], 'A-061': ['Rows 95-97', 'matched'], 'A-062': ['Rows 121-128', 'matched'],
  'A-063': ['Rows 129-132', 'matched'], 'A-064': ['Row 126', 'matched'], 'A-065': ['Rows 134-139', 'matched'], 'A-066': ['Rows 144-147', 'matched'],
  'A-067': ['Row 142', 'matched'], 'A-068': ['Rows 149-161', 'matched'], 'A-069': ['Rows 169-174', 'matched'], 'A-070': ['Row 175', 'matched'],
  'A-071': ['Rows 37-42', 'matched'], 'A-072': ['Rows 31, 33, 34, 43-48', 'matched'], 'A-073': ['Row 49', 'matched'],
  'A-074': ['Rows 50-53; GAP-012; Q2 facts', 'mismatch', 'save path dereferences an undefined personDao bean', 'F-001'],
  'A-075': ['Rows 115-119', 'matched'], 'A-076': ['Rows 162-164', 'matched'],
  'A-077': ['Rows 165-167; GAP-007; Q3 facts', 'mismatch', 'HQL built from selectedPeople not recorded', 'F-002'],
  'A-078': ['Row 114; Q3 facts', 'mismatch', 'unescaped ${param.fkey} in script not recorded', 'F-003'],
  'A-079': ['Rows 196-198; GAP-004', 'matched'],
  'A-080': ['Row 186', 'matched', 'wording difference: the @type request parameter of /do/view/history is not described; no behavior claim is wrong'],
  'A-081': ['Row 176', 'mismatch', 'first listing creates the root directory row', 'F-005'],
  'A-082': ['Rows 59-60; GAP-003', 'matched'], 'A-083': ['Row 35', 'matched', 'RC-003'], 'A-084': ['Rows 178-184', 'matched'], 'A-085': ['Rows 208-213; GAP-003', 'matched'],
  'A-086': ['Rows 58, 69-71, 190', 'matched'],
  'A-087': ['Row 55', 'mismatch', 'request parameters and attributes shown on the page are not recorded', 'F-003'],
  'A-088': ['Row 56', 'mismatch', 'request parameters, attributes and unescaped message not recorded', 'F-003'],
  'A-089': ['Row 57', 'matched'], 'A-090': ['Row 63', 'matched'], 'A-091': ['Rows 61-62', 'matched'], 'A-092': ['Row 194', 'matched'],
  'A-093': ['GAP-003; recon absent-resources row', 'matched', 'wording difference: /images/calendar.png (global forward image/calendar) is also absent but the forward has no user'],
  'A-094': ['Rows 232-234; Q2 facts; GAP-014', 'mismatch', 'Struts-instantiated WAP actions lack their injected authenticator/authorizer', 'F-004'],
  'A-095': ['Recon Mobile channel row; Q3 facts (auth.jsp)', 'matched'], 'A-096': ['Rows 60, 188', 'matched'], 'A-097': ['Rows 223-226', 'matched'],
  'A-098': ['Rows 215, 217-221', 'matched', 'RC-005: person task queries are filtered by read (toArray -> selectAccessibleObjects); Stage 1 row 218 is correct'],
  'A-099': ['Row 216', 'matched', 'RC-005'], 'A-100': ['Rows 228-230', 'matched'], 'A-101': ['Recon Runnable Surfaces (chart images); GAP-007', 'matched'],
  'A-102': ['Row 18', 'matched'], 'A-103': ['Row 73; GAP-013', 'matched', 'RC-004: log4j-war.xml lines are 44-58; Phase A cited 34-47 from a renumbered listing'],
  'A-110': ['Recon persistence row (useBeans in HQL sweep); rows 18, 38, 75', 'matched'],
  'A-111': ['Row 189', 'matched', 'RC-006: TwikiFormat escapes by default (getProperty(key,"true")); Phase A said escaping only when set'],
  'A-112': ['Row 189; recon Data And Integrations (external wiki)', 'matched'], 'A-113': ['Recon web.xml row', 'matched'],
  'A-114': ['Rows 172, 176', 'mismatch', 'directory rows created on read/first use not recorded', 'F-005'],
  'A-120': ['Recon Data And Integrations (database); row 47', 'matched'], 'A-121': ['Recon persistence row', 'matched'],
  'A-122': ['Recon persistence row', 'matched', 'wording: "mappings/*.xml (16 files)" is read as 16 besides Metrics.xml; the directory holds 17'],
  'A-123': ['Recon persistence row', 'matched'], 'A-124': ['Row 68', 'matched'], 'A-125': ['Rows 187, 206', 'matched'], 'A-126': ['Rows 112, 204, 205', 'matched'], 'A-127': ['Row 80', 'matched'],
  'A-130': ['Row 67', 'matched'], 'A-131': ['Row 203', 'matched'], 'A-132': ['Rows 94, 109-111', 'matched'], 'A-133': ['Recon Configuration row', 'matched'],
  'A-140': ['Rows 200-202', 'matched'], 'A-141': ['Row 204', 'matched'], 'A-142': ['Row 66; recon', 'matched'],
  'A-150': ['Rows 138, 203', 'matched'], 'A-151': ['Rows 189, 202', 'matched'], 'A-152': ['Row 21', 'matched'], 'A-153': ['Rows 50-53, 115, 209-213', 'matched'],
  'A-160': ['Recon Dormant code row; Parity-Map Boundary exclusions', 'matched'], 'A-161': ['Recon Static assets row', 'matched'], 'A-162': ['Recon Parity-Map Boundary (68 of 73 JSPs)', 'matched']
};
for (const it of inv.items) {
  const m = map[it.id]; if (!m) throw new Error('no map ' + it.id);
  add({ direction: 'inventory-to-records', item: it.id + ' ' + it.title, expected: 'Stage 1 covers the independently found behavior with correct source support', stage1: m[0], result: m[1], note: m[2] || '', link: m[3] || 'none', evidence: it.evidence.slice(0, 3).join('; ') });
}
// ---- Direction 2: every workbook row -> source
const rowFind = { 15: 'F-003', 50: 'F-001', 51: 'F-001', 55: 'F-003', 56: 'F-003', 114: 'F-003', 165: 'F-002', 176: 'F-005', 232: 'F-004', 234: 'F-004' };
const rowNote = {
  15: 'cookies are persistent (max-age Integer.MAX_VALUE) without Secure flag; not stated',
  50: 'status Yes and "Success" result are unsupported: ImportPeopleAction.personDao is never injected (no personDao bean)',
  51: 'the userId_exists outcome depends on PersonDao.save, which is unreachable for the same reason',
  55: 'system-info mode also lists all request parameters and attributes',
  56: 'error page lists all request parameters and attributes and prints the exception message unescaped',
  114: '${param.fkey} is written unescaped into the script URL (reflected script injection)',
  165: 'selectedPeople values are concatenated into the HQL without numeric validation',
  176: 'the first listing creates the root directory row (read request that writes)',
  232: 'WAP login submit dereferences a null authenticator (Struts-created AuthenticationAction)',
  234: 'with a projectId the Struts-created DispatchForward dereferences a null authorizer'
};
for (const r of wb) {
  const f = rowFind[r.row];
  add({ direction: 'records-to-source', item: 'Row ' + r.row + ' (' + r.flow + ' / ' + r.scenario + ', ' + r.source + ')', expected: 'row text, status and evidence agree with the WAR', stage1: 'legacy_user_flows.xlsx row ' + r.row, result: f ? 'mismatch' : 'matched', note: f ? rowNote[r.row] : 'read in full; cited lines and symbols resolved (citecheck); semantics compared with Phase A and source', link: f || 'none', evidence: 'citecheck.json; wb.txt; source reads listed in the report' });
}
// ---- Direction 2b: reconnaissance claims -> source
const recon = [
  ['Scope: legacy location and 4 files', 'matched'], ['Scope: fixed-baseline decision recorded', 'matched', 'decision id present in migration_status.yaml:224'],
  ['Scope: known patch locations (xplanner.properties:9-17, xplanner-custom.properties:18-24, spring-beans.xml:65-68)', 'matched'],
  ['Scope: 3 of 1090 ZIP entries with version-needed 2.0', 'matched', 'reviewer ZIP central-directory parse: 1087 x 1.0, 3 x 2.0, same three names'],
  ['Scope: version metadata (1.1a4, 04/12/2011, 426; pom 1.1 2011-12-04; Build-Jdk 1.6.0_29; 594 classes v50)', 'matched'],
  ['Scope: legacy SHA-256 table', 'matched'], ['Scope: exclusions (runtime, docs as hints, demo-seed.sql, 2011 activity log)', 'matched'],
  ['Source Inventory: WAR composition table (964 files, 1090 entries, per-type counts)', 'matched', 'class 594, JAR 102, JSP 73 recounted'],
  ['Source Inventory: web.xml row', 'matched'], ['Source Inventory: Struts controller row (87 mappings, 24 form beans, 47 global forwards, 3 exceptions)', 'matched'],
  ['Source Inventory: Screens row (73 JSPs by folder)', 'matched'], ['Source Inventory: referenced but absent resources', 'matched'],
  ['Source Inventory: Tiles row (5 definitions, print mode)', 'matched'], ['Source Inventory: Spring context row (58+5+13+14+3 beans, loaders)', 'matched'],
  ['Source Inventory: compiled classes row', 'matched'], ['Source Inventory: persistence model row (21 entities, unmapped paths)', 'matched'],
  ['Source Inventory: schema and seed row (8 changeSets, 21 createTable, seeds)', 'matched'],
  ['Source Inventory: dormant and unreferenced code row', 'mismatch', '"DAOs found by DaoScanner" implies discovery; DaoScanner only prints beans; PersonDaoImpl is never a bean', 'F-001'],
  ['Source Inventory: legacy migration toolkit row', 'matched'], ['Source Inventory: configuration row', 'matched'], ['Source Inventory: security configuration row', 'matched'],
  ['Source Inventory: web services row (43 SOAP operations, 4 REST methods)', 'matched'], ['Source Inventory: Spring MVC pages row', 'matched'],
  ['Source Inventory: mobile channel row', 'mismatch', 'missing the non-injected dependencies of the Struts-created WAP actions', 'F-004'],
  ['Source Inventory: jobs and e-mail row', 'matched'], ['Source Inventory: export and reports row', 'matched'], ['Source Inventory: charts row', 'matched'],
  ['Source Inventory: internationalisation row', 'matched'], ['Source Inventory: static assets row', 'matched'], ['Source Inventory: third-party libraries row', 'matched'],
  ['Source Inventory: container and build metadata row', 'matched'], ['Source Inventory: local run helpers row', 'matched'],
  ['Runnable Surfaces: web UI', 'matched'], ['Runnable Surfaces: personal status page', 'matched'], ['Runnable Surfaces: settings pages', 'matched'],
  ['Runnable Surfaces: mobile WAP users', 'mismatch', 'blocked reason omits the null dependencies', 'F-004'],
  ['Runnable Surfaces: SOAP clients', 'matched'], ['Runnable Surfaces: REST clients', 'matched'], ['Runnable Surfaces: calendar clients', 'matched'],
  ['Runnable Surfaces: chart images', 'matched'], ['Runnable Surfaces: daily job', 'matched'], ['Runnable Surfaces: data sampling', 'matched'],
  ['Runnable Surfaces: schema bootstrap', 'matched'], ['Runnable Surfaces: admin and test utilities', 'matched'], ['Runnable Surfaces: activity log', 'matched'],
  ['Enforcement table (9 channel rows)', 'matched'], ['Unauthenticated surfaces list (4 bullets)', 'matched'], ['Additional defects AF-01, AF-02', 'matched', 'bytecode: getRepository returns null; EditRoleAction hook overrides nothing'],
  ['Row-level CHK-002 sweep list', 'matched'],
  ['Data And Integrations: database', 'matched'], ['Data And Integrations: HSQLDB', 'matched'], ['Data And Integrations: Liquibase', 'matched'], ['Data And Integrations: SMTP', 'matched'],
  ['Data And Integrations: outbound HTTP (stylesheet)', 'matched'], ['Data And Integrations: file storage (BLOB)', 'matched'], ['Data And Integrations: LDAP/NTLM/JAAS', 'matched'],
  ['Data And Integrations: external wiki', 'matched'], ['Data And Integrations: Twitter and Facebook', 'matched'], ['Data And Integrations: SourceForge links', 'matched'],
  ['Data And Integrations: SOAP/REST/iCal clients', 'matched'], ['Data And Integrations: export consumers', 'matched'], ['Data And Integrations: spreadsheets and text import', 'matched'],
  ['Build, Run, And Test Evidence: legacy figures quoted (1090 entries, 964 files, 594 classes v50)', 'matched'],
  ['Build, Run, And Test Evidence: author tool runs and scratch outputs', 'not-applicable', 'process record of the author; outputs under .migration-tmp/stage-01 are withheld from this reviewer by the packet', 'E-001'],
  ['GAP-001', 'matched'], ['GAP-002', 'matched'], ['GAP-003', 'matched'], ['GAP-004', 'matched'], ['GAP-005', 'matched'], ['GAP-006', 'matched'],
  ['GAP-007 (security facts)', 'mismatch', 'omits the aggregate-timesheet HQL concatenation and the behaviors of F-003', 'F-002, F-003'],
  ['GAP-008', 'matched'], ['GAP-009', 'matched'], ['GAP-010', 'matched'], ['GAP-011', 'matched'],
  ['GAP-012 (people import format)', 'mismatch', 'the import cannot save any person at all (F-001), beyond the format question', 'F-001'],
  ['GAP-013', 'matched'], ['GAP-014', 'mismatch', 'WAP effects omit the non-injected dependencies', 'F-004'],
  ['GAP-005 P-01', 'matched'], ['GAP-005 P-02', 'matched'], ['GAP-005 P-03', 'matched'], ['GAP-005 P-04', 'matched'], ['GAP-005 P-05', 'matched'], ['GAP-005 P-06', 'matched'], ['GAP-005 P-07', 'matched'],
  ['Owner decision Q1', 'matched'], ['Owner decision Q2', 'matched'], ['Owner decision Q3', 'matched'], ['Owner decision Q4', 'matched'],
  ['Q2 facts: features', 'matched'], ['Q2 facts: integration queue', 'matched'], ['Q2 facts: settings pages', 'matched'], ['Q2 facts: jrpdf exports', 'matched'],
  ['Q2 facts: tabbed iteration view', 'matched'], ['Q2 facts: not-authorized page', 'matched'],
  ['Q2 facts: mobile WAP pages', 'mismatch', 'omits the non-injected authenticator/authorizer', 'F-004'],
  ['Q2 facts: JAX-WS endpoint', 'matched'], ['Q2 facts: file manager', 'matched'], ['Q2 facts: project role editor', 'matched'], ['Q2 facts: iteration metrics', 'matched'],
  ['Q2 facts: task re-estimate page', 'matched'], ['Q2 facts: print layout', 'matched'], ['Q2 facts: iCal feed', 'matched'], ['Q2 facts: SOAP getCurrentIteration and deleteAttribute', 'matched'],
  ['Q2 facts: jrpdf data sources', 'matched'], ['Q2 facts: duplicate Spring context', 'matched'], ['Q2 facts: delete person, change locale, formatting help', 'matched'], ['Q2 facts: admin and test utilities', 'matched'],
  ['Q2 facts: completeness for broken surfaces', 'mismatch', 'the broken people import is not listed', 'F-001'],
  ['Q3 facts (22 listed observations)', 'matched', 'each listed observation verified; task.jsp:101-103 concatenation confirmed'],
  ['Q3 facts: completeness', 'mismatch', 'missing: aggregate-timesheet HQL concatenation (F-002); reflected fkey, error-page parameter echo, persistent credential cookies (F-003)', 'F-002, F-003'],
  ['Q4 facts', 'matched'],
  ['Parity-Map Boundary: 210 rows, 18 epics, 113/77/19/1', 'matched', 'workbook dump and audit:workbook'], ['Parity-Map Boundary: all 87 action paths cited', 'matched', 'reviewer mechanical check: 0 uncited'],
  ['Parity-Map Boundary: 68 of 73 JSPs cited; 5 uncited named', 'matched', 'reviewer mechanical check: same 5'], ['Parity-Map Boundary: exclusions', 'matched'],
  ['Stage 1 Exit Checklist', 'matched', 'unticked audit box consistent with GAP-010']
];
for (const r of recon) add({ direction: 'records-to-source', item: 'Reconnaissance: ' + r[0], expected: 'claim is supported by the WAR', stage1: 'analysis/legacy_reconnaissance.md', result: r[1], note: r[2] || '', link: r[3] || (r[1] === 'not-applicable' ? r[3] : 'none'), evidence: 'source reads in Phase A/B' });
// ---- Earlier findings re-verification
const earlier = [
  ['pass-001 F-001 server-side permission enforcement', 'rows 29-30; enforcement table'], ['pass-001 F-002 history recording', 'row 187'], ['pass-001 F-003 date formats', 'rows 69-71'],
  ['pass-001 F-004 mobile role constraints', 'rows 32, 233'], ['pass-001 F-005 dormant code', 'recon dormant row'], ['pass-001 F-006 e-mail stylesheet fetch', 'row 202'],
  ['pass-001 F-007 search/aggregate filtering', 'rows 167, 180'], ['pass-001 F-008 attachment storage', 'row 172'],
  ['pass-002 F-001 time-entry and iteration validation', 'rows 89, 152-160'], ['pass-002 F-002 delete cascades', 'rows 49, 82, 91, 126, 142, 174'],
  ['pass-002 F-003 Facebook widget', 'row 193'], ['pass-002 F-004 attachment count', 'row 171'], ['pass-002 F-005 login and start-iteration branches', 'rows 14, 98'],
  ['pass-002 F-006 hidden-project decorator', 'row 76'], ['pass-002 F-007 sysadmin grant rule', 'rows 31, 34'], ['pass-002 F-008 story import errors and cookies', 'rows 117, 119'],
  ['pass-002 F-009 task type labels', 'row 135'], ['pass-002 F-010 superseded figures', 'recon figures'],
  ['pass-003 F-001 unmapped query paths', 'rows 211, 213, 220, 221, 228'], ['pass-003 F-002 second Spring context', 'row 65'],
  ['pass-003 F-003 validation keys', 'rows 52, 124, 132, 147'], ['pass-003 F-004 progress chart', 'row 110'],
  ['pass-004 F-001 login page credential disclosure', 'rows 9, 11, 64; GAP-007; Q3'], ['pass-004 F-002 task-board parameter', 'row 114 (parameter part)'],
  ['pass-004 F-003 Hibernate settings not applied', 'row 68; configuration row; P-01'], ['pass-004 F-004 print layout', 'row 192; Tiles row'],
  ['pass-004 F-005 unauthenticated exposure', 'rows 18, 73; GAP-007; GAP-013'], ['pass-004 F-006 outbound wiki request', 'row 189; wiki row']
];
for (const e of earlier) add({ direction: 'records-to-source', item: 'Earlier finding ' + e[0], expected: 'correction present and supported by source', stage1: e[1], result: 'matched', note: 'resolved', link: 'none', evidence: 'source re-checked in this pass' });
const count = k => C.filter(c => c.result === k).length;
const summary = { total: C.length, matched: count('matched'), mismatch: count('mismatch'), 'not-checked': count('not-checked'), 'not-applicable': count('not-applicable'),
  inventory_to_records: C.filter(c => c.direction === 'inventory-to-records').length, rows: wb.length, recon_claims: recon.length, earlier_findings: earlier.length };
const outp = { packet: 'S02-P005', revision: '7c2f5619fd25fed0a09ba108eb886b5e2b1a012c', phase_a_snapshot_sha256: '3efaed49a3b9cbe0843fb4d254dfe017bafdbe5372357ef036d29a8012a30a3a', summary, items: C };
fs.writeFileSync('C:/Work/Legacy/xplanner2-revision1/analysis/reviews/evidence/S02-P005/comparison-results.json', JSON.stringify(outp, null, 1) + '\n');
// id ranges for the report
const firstLast = pred => { const x = C.filter(pred); return x.length ? x[0].id + '..' + x[x.length - 1].id : '-'; };
console.log(JSON.stringify(summary));
console.log('ranges inv', firstLast(c => c.direction === 'inventory-to-records'), 'rows', firstLast(c => c.item.startsWith('Row ')), 'recon', firstLast(c => c.item.startsWith('Reconnaissance')), 'earlier', firstLast(c => c.item.startsWith('Earlier')));
for (const c of C.filter(c => c.result !== 'matched')) console.log(c.id, c.result, c.link, '|', c.item.slice(0, 90));
