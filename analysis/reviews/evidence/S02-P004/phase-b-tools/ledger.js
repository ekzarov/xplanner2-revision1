// Reviewer-owned ledger generator (BA-002-04 Phase B). Writes comparison-results.json to argv[2].
'use strict';
const fs = require('fs'); const path = require('path'); const S = __dirname;
const inv = JSON.parse(fs.readFileSync(path.join(S, '..', '..', '..', 'analysis', 'reviews', 'evidence', 'S02-P004', 'phase-a-inventory.json'), 'utf8'));
const rows = JSON.parse(fs.readFileSync(path.join(S, 'workbook-rows.json'), 'utf8')).filter(r => r.r >= 7 && r.outline === 1);
const C = []; let n = 0; const id = () => 'C-' + String(++n).padStart(3, '0');
// ---------- Direction 1: inventory -> records
const map = {
 'A-001': ['Scope And Provenance; Source Inventory WAR composition', 'matched'], 'A-002': ['Scope And Provenance (version, build, pom, manifest)', 'matched'],
 'A-003': ['Source Inventory row Local run helpers; P-07', 'matched'], 'A-004': ['Scope And Provenance known patch; GAP-005 P-01, P-02', 'matched'],
 'A-005': ['Scope And Provenance exclusions; GAP-006', 'matched'], 'A-006': ['Source Inventory Container metadata; GAP-008', 'matched'],
 'A-007': ['GAP-013; row 72; Runnable Surfaces Activity log', 'mismatch', 'F-005'],
 'A-010': ['Source Inventory Struts row; rows by action (87 paths cited per Parity-Map Boundary cross-check)', 'matched'], 'A-011': ['rows 230-232; Source Inventory Mobile row', 'matched'],
 'A-012': ['rows 213-219; Source Inventory Web services; Q3 facts (Axis adminPassword, /servlet/AxisServlet)', 'matched'], 'A-013': ['rows 221-224', 'matched'],
 'A-014': ['rows 226-228', 'matched'], 'A-015': ['rows 60, 187; Source Inventory Spring MVC pages', 'matched'], 'A-016': ['Runnable Surfaces Chart images; Source Inventory Charts', 'matched'],
 'A-017': ['Source Inventory Static assets; Parity-Map Boundary exclusions', 'matched'], 'A-018': ['row 217; Source Inventory Dormant code', 'matched'],
 'A-020': ['Source Inventory web.xml row; rows 17, 71, 72', 'matched'], 'A-021': ['Source Inventory web.xml row (5 listeners); rows 55, 66, 187', 'matched', null, 'SystemInfo startup log sub-claim: see separate not-applicable item'],
 'A-022': ['row 65; Source Inventory Spring row', 'matched'], 'A-023': ['Source Inventory Spring row', 'matched'], 'A-024': ['row 67', 'matched'],
 'A-025': ['Source Inventory Configuration row; rows 9, 11, 21, 93, 108-110, 121, 177, 188, 196, 201, 203, 206', 'matched', null, 'RC-004: exportLinks.jsp consumes xplanner.export.formats (Phase A had no consumer)'],
 'A-026': ['missing: Source Inventory Configuration row and GAP-005 P-01 describe XPlannerMySQLDialect as effective', 'mismatch', 'F-003'],
 'A-027': ['row 58; rows 68-70; Source Inventory Internationalisation', 'matched', null, 'RC-001: 10 ResourceBundle files (Phase A counted EmailResourceBundle)'],
 'A-028': ['row 72', 'matched'], 'A-029': ['Source Inventory Tiles row; Parity-Map Boundary exclusions (tiles:print, PrintLinkTag "no user"); rows 184, 190, 55', 'mismatch', 'F-004'],
 'A-030': ['rows 33, 61; Source Inventory Spring row (cache advisor)', 'matched'], 'A-031': ['Source Inventory Spring and Persistence rows; rows 64-65', 'matched'],
 'A-032': ['GAP-004; rows 192, 194; Source Inventory Persistence row', 'matched'], 'A-033': ['Source Inventory Persistence row (entity Identifier); row 181 (single ID space implied)', 'matched', null, 'wording/grouping difference: generator not named'],
 'A-040': ['rows 8, 9; row 64 claims the default credential is documented only in legacy/README.md', 'mismatch', 'F-001'], 'A-041': ['rows 11-13', 'matched'], 'A-042': ['rows 15-16', 'matched'],
 'A-043': ['row 19', 'matched'], 'A-044': ['rows 17, 32', 'matched'], 'A-045': ['row 231', 'matched'], 'A-046': ['row 213', 'matched'], 'A-047': ['row 21; Source Inventory Security configuration', 'matched'],
 'A-048': ['rows 23, 25', 'matched'], 'A-049': ['rows 23-24', 'matched'],
 'A-050': ['rows 28-30; Runnable Surfaces enforcement table', 'matched', null, 'RC-002: DispatchForward#<init> sets isAuthorizationRequired=true; Stage 1 row 28 is correct'],
 'A-051': ['row 26; display-level rows listed under the CHK-002 sweep', 'matched'], 'A-052': ['Q3 facts; rows 61, 214, 223; GAP-007', 'mismatch', 'F-005'],
 'A-053': ['row 20', 'matched'], 'A-054': ['rows 45, 56-57', 'matched'], 'A-055': ['row 55', 'matched'], 'A-056': ['row 28; GAP-003', 'matched', null, 'RC-002'], 'A-057': ['rows 61-63', 'matched'],
 'A-060': ['row 18', 'matched'], 'A-061': ['rows 27, 74-76', 'matched'], 'A-062': ['rows 77-80', 'matched'], 'A-063': ['rows 84-85', 'matched'],
 'A-064': ['row 81', 'matched', null, 'RC-003: Hibernate removes the owned notification_receivers join rows, so the FK does not block (Stage 1 correct)'], 'A-065': ['rows 82-83', 'matched'],
 'A-066': ['rows 206-211', 'matched', null, 'RC-004'], 'A-070': ['rows 87-88', 'matched'], 'A-071': ['rows 91-93', 'matched'], 'A-072': ['rows 97-99', 'matched'], 'A-073': ['row 100', 'matched'],
 'A-074': ['rows 101-103', 'matched'], 'A-075': ['rows 94-95', 'matched'], 'A-076': ['row 96', 'matched'], 'A-077': ['row 90', 'matched'],
 'A-078': ['rows 105-113; row 113 and Q2 facts describe a link/REST parameter mismatch that LinkTag resolves', 'mismatch', 'F-002', 'RC-005: metrics repository is null (Stage 1 rows 106-107 correct)'],
 'A-079': ['rows 114-118', 'matched'], 'A-080': ['rows 120-123', 'matched'], 'A-081': ['rows 126-127', 'matched'], 'A-082': ['rows 128-131', 'matched'], 'A-083': ['row 125', 'matched'],
 'A-084': ['rows 133-137', 'matched'], 'A-085': ['rows 139-140', 'matched'], 'A-086': ['row 142; Q3 facts (HQL concatenation)', 'matched'], 'A-087': ['rows 143-146', 'matched'], 'A-088': ['row 141', 'matched'],
 'A-089': ['rows 148-160', 'matched'], 'A-090': ['rows 161-163', 'matched'], 'A-091': ['rows 164-166', 'matched'], 'A-092': ['rows 226-228', 'matched', null, 'RC-006: task.story is unmapped; Stage 1 row 226 correct'],
 'A-093': ['rows 37-39', 'matched'], 'A-094': ['rows 31, 33-34, 43-48', 'matched', null, 'RC-011: limit resolved by bytecode listing of EditPersonHelper#modifyRoles'], 'A-095': ['rows 40-42, 187', 'matched'],
 'A-096': ['row 49', 'matched'], 'A-097': ['rows 50-53', 'matched'], 'A-098': ['row 35', 'matched', null, 'RC-007: EditRoleAction#beforeObjectCommit overrides no hook; Stage 1 row 35 correct'],
 'A-099': ['rows 168-171', 'matched'], 'A-100': ['rows 172-174', 'matched'], 'A-101': ['row 175', 'matched'], 'A-102': ['rows 194-196', 'matched'], 'A-103': ['rows 181-183', 'matched'],
 'A-104': ['rows 177-180', 'matched'], 'A-105': ['rows 185-186', 'matched'], 'A-106': ['rows 59-60', 'matched'], 'A-107': ['row 192', 'matched'],
 'A-108': ['rows 188-189; Data And Integrations External wiki', 'mismatch', 'F-006'], 'A-109': ['rows 177, 184, 187', 'matched'], 'A-110': ['rows 230-232', 'matched'],
 'A-111': ['Source Inventory Mobile row; Q3 facts (unreachable debug page)', 'matched'], 'A-112': ['rows 213-219', 'matched', null, 'RC-008: deleteAttribute unmapped paths; attribute operations unchecked (Stage 1 rows 216, 219 correct)'],
 'A-113': ['rows 221-223', 'matched'], 'A-114': ['row 224', 'matched', null, 'RC-012: unknown status value maps to notStarted'],
 'A-120': ['rows 198-201', 'matched', null, 'RC-013: Phase A doubt about EmailMessageImpl in the scheduler thread withdrawn (recipient lookup uses the repository)'],
 'A-121': ['rows 111, 202-203', 'matched'], 'A-122': ['row 64', 'matched', null, 'RC-009: changeSet 1-1 creates 19 tables, 21 in total'], 'A-123': ['Source Inventory Dormant code and Legacy migration toolkit rows', 'matched'],
 'A-130': ['Source Inventory Schema row; rows 49, 175', 'matched'], 'A-131': ['rows 81, 90, 125, 141', 'matched'], 'A-132': ['rows 120, 133, 194', 'matched'],
 'A-133': ['Source Inventory Persistence row; Q3 facts; GAP-011', 'matched'], 'A-134': ['row 204', 'matched'], 'A-135': ['row 64; Source Inventory Schema row', 'matched'],
 'A-140': ['Data And Integrations DB rows; rows 64-67', 'matched'], 'A-141': ['row 201; Data And Integrations SMTP', 'matched'],
 'A-142': ['row 200 (e-mail CSS fetch); wiki fetch unrecorded', 'mismatch', 'F-006'], 'A-143': ['Data And Integrations identity providers', 'matched'], 'A-144': ['Source Inventory Third-party libraries', 'matched'],
 'A-145': ['Runnable Surfaces Web UI and Chart images rows', 'matched'], 'A-150': ['GAP-003; Source Inventory absent resources', 'matched'], 'A-151': ['GAP-003; rows 209, 211', 'matched'],
 'A-152': ['rows 60, 187, 218; GAP-008', 'matched', null, 'TaskRepositoryHibernate named-query constants and IterationRepository static HQL are uncalled code (no scenario effect); covered by the dormant-code candidate list']
};
for (const it of inv.items) { const m = map[it.id]; if (!m) throw new Error('unmapped ' + it.id); C.push({ id: id(), direction: 'inventory-to-records', inventory: it.id, item: it.title, records: m[0], result: m[1], link: m[2] || 'none', note: m[3] || '' }); }
C.push({ id: id(), direction: 'inventory-to-records', inventory: 'A-021 (sub-claim)', item: 'SystemInfo writes an XPLANNER INFO block to the log at startup', records: 'not recorded', result: 'not-applicable', link: 'E-001', note: 'internal diagnostic console output, no user, operator or integration contract' });
C.push({ id: id(), direction: 'inventory-to-records', inventory: 'A-132 (sub-claim)', item: 'TimeEntry effort doubles only when xplanner.pairprogramming=double (not shipped; default single)', records: 'not recorded', result: 'not-applicable', link: 'E-002', note: 'inactive option; shipped behaviour (effort = duration) is what rows 142, 106 describe' });
// ---------- Direction 2: rows -> source
const rowMis = { 9: 'F-001', 64: 'F-001', 113: 'F-002', 188: 'F-006' };
let flow = '';
for (const r of rows) { const g = r.cells.G; const f = rowMis[r.r]; if (r.cells.B) flow = r.cells.B;
  C.push({ id: id(), direction: 'records-to-source', record: 'workbook row ' + r.r + ' (' + flow + ' / ' + r.cells.C + ', ' + g + ')', result: f ? 'mismatch' : 'matched', link: f || 'none',
    note: f ? '' : 'citations resolved (citecheck), statement compared with Phase A item(s) and, where noted in the report, re-read in source' }); }
// ---------- Direction 2: reconnaissance sections
const recon = [
 ['Scope And Provenance (identity, hashes, ZIP rewrite sign: 3 of 1090 entries version-needed 2.0)', 'matched', 'none', 'ZIP central directory re-read: entries 865/878/879 1-based = 864/877/878 0-based'],
 ['Source Inventory: WAR composition table', 'matched', 'none', 'figures.js'],
 ['Source Inventory: Web application descriptor', 'matched'], ['Source Inventory: Struts controller (87 mappings, 24 form beans, 47 global forwards, 3 global exceptions)', 'matched'],
 ['Source Inventory: Screens (JSP)', 'matched'], ['Source Inventory: Referenced but absent resources', 'matched'],
 ['Source Inventory: Tiles ("tiles:print has no user")', 'mismatch', 'F-004'], ['Source Inventory: Spring 3.0.5 context (58+5+13+14+3 beans; double loading)', 'matched'],
 ['Source Inventory: Compiled application classes', 'matched'], ['Source Inventory: Persistence model and query sweep', 'matched'],
 ['Source Inventory: Schema and seed data', 'matched'], ['Source Inventory: Dormant and unreferenced code', 'matched'], ['Source Inventory: Legacy migration toolkit', 'matched'],
 ['Source Inventory: Configuration ("Effective settings ... with the XPlannerMySQLDialect")', 'mismatch', 'F-003'], ['Source Inventory: Security configuration', 'matched'],
 ['Source Inventory: Web services', 'matched'], ['Source Inventory: Spring MVC pages', 'matched'], ['Source Inventory: Mobile channel', 'matched'], ['Source Inventory: Jobs and e-mail', 'matched'],
 ['Source Inventory: Export and reports', 'matched'], ['Source Inventory: Charts', 'matched'], ['Source Inventory: Internationalisation', 'matched'], ['Source Inventory: Static assets', 'matched'],
 ['Source Inventory: Third-party libraries', 'matched'], ['Source Inventory: Container and build metadata', 'matched'], ['Source Inventory: Local run helpers', 'matched'],
 ['Runnable Surfaces table (13 surfaces)', 'matched'], ['Runnable Surfaces: server-side enforcement table (9 rows) and AF-01/AF-02', 'matched', 'none', 'DispatchForward, EditRoleAction, ViewIterationMetricsAction re-listed'],
 ['Runnable Surfaces: row-level CHK-002 sweep lists', 'matched'],
 ['Data And Integrations: relational database row ("XPlannerMySQLDialect shows the package supports MySQL")', 'matched', 'none', 'statement about package support is correct; effectiveness is F-003'],
 ['Data And Integrations: HSQLDB, Liquibase, SMTP, e-mail CSS fetch, file storage, identity providers rows', 'matched'],
 ['Data And Integrations: External wiki row ("Example endpoints only")', 'mismatch', 'F-006'],
 ['Data And Integrations: social, SourceForge, SOAP/REST/iCal clients, export consumers, spreadsheet rows', 'matched'],
 ['Build, Run, And Test Evidence: result figures (counts, audits)', 'matched', 'none', 'figures regenerated; audit:workbook re-run'],
 ['Build, Run, And Test Evidence: author scratch tool outputs under .migration-tmp/stage-01/', 'not-applicable', 'E-003', 'forbidden input for this pass; the figures they produced were regenerated independently'],
 ['Known Gaps: GAP-001..GAP-006, GAP-008..GAP-012, GAP-014', 'matched'], ['Known Gaps: GAP-007 security facts', 'mismatch', 'F-001'], ['Known Gaps: GAP-013 activity log', 'mismatch', 'F-005'],
 ['GAP-005 per-conclusion impact P-01 (lists XPlannerMySQLDialect as an effective conclusion)', 'mismatch', 'F-003'], ['GAP-005 per-conclusion impact P-02..P-07', 'matched'],
 ['Owner Decisions table (Q1-Q4)', 'matched', 'none', 'recorded decisions only; decisions themselves are not reviewed'],
 ['Q2 facts (19 surfaces) except the task board', 'matched'], ['Q2 facts: Iteration task board "parameter mismatch"', 'mismatch', 'F-002'],
 ['Q3 facts (18 observations)', 'mismatch', 'F-001', 'also F-005: live activity log and index.jsp exposure absent'], ['Q4 facts', 'matched'],
 ['Parity-Map Boundary: coverage cross-check (87 paths, 68 of 73 JSPs)', 'matched'], ['Parity-Map Boundary: exclusions ("tiles:print definition and PrintLinkTag (no user)")', 'mismatch', 'F-004'],
 ['Parity-Map Boundary: derivation statement and first-pass status', 'matched'], ['Return Correction Evidence table', 'matched', 'none', 'see prior-finding items'],
 ['Stage 1 Exit Checklist (author self-assessment; render box unticked)', 'matched'], ['Error Prevention section (self-checks BA-001-01..05)', 'matched', 'none', 'claims compared with the Checklist Review']
];
for (const x of recon) C.push({ id: id(), direction: 'records-to-source', record: 'reconnaissance: ' + x[0], result: x[1], link: x[2] || 'none', note: x[3] || '' });
// ---------- prior findings
const prior = [
 ['pass-001 F-001 server-side permission enforcement', 'rows 26, 28-32; enforcement table', 'resolved'], ['pass-001 F-002 history recording', 'rows 185-186', 'resolved'],
 ['pass-001 F-003 date formats per locale', 'rows 68-70', 'resolved'], ['pass-001 F-004 mobile role constraints', 'rows 32, 231', 'resolved'], ['pass-001 F-005 dormant code', 'Source Inventory dormant row', 'resolved'],
 ['pass-001 F-006 e-mail CSS fetch', 'row 200', 'resolved'], ['pass-001 F-007 search/aggregate filtering', 'rows 166, 179', 'resolved'], ['pass-001 F-008 attachment storage', 'row 171', 'resolved'],
 ['pass-002 F-001 time-entry and iteration validation', 'rows 88, 151-159', 'resolved'], ['pass-002 F-002 delete cascades', 'rows 49, 81, 90, 125, 141, 173, 175', 'resolved'],
 ['pass-002 F-003 Facebook like widget', 'row 191', 'resolved'], ['pass-002 F-004 attachment count', 'row 170', 'resolved'], ['pass-002 F-005 login and start-iteration branches', 'rows 14, 97', 'resolved'],
 ['pass-002 F-006 hidden-project decorator', 'row 75', 'resolved'], ['pass-002 F-007 sysadmin grant rule', 'rows 31, 34', 'resolved'], ['pass-002 F-008 story import errors and cookies', 'rows 116, 118', 'resolved'],
 ['pass-002 F-009 task type labels', 'row 134', 'resolved'], ['pass-002 F-010 superseded figures', 'reconnaissance figures', 'resolved'],
 ['pass-003 F-001 unmapped query paths', 'rows 11, 194, 209, 211, 218, 219, 226', 'resolved'], ['pass-003 F-002 second Spring context', 'rows 64, 65, 198, 199', 'resolved'],
 ['pass-003 F-003 validation keys', 'rows 52, 123, 130, 131, 136, 145, 146', 'resolved'], ['pass-003 F-004 progress chart', 'rows 108-111', 'resolved']
];
for (const p of prior) C.push({ id: id(), direction: 'records-to-source', record: 'prior finding ' + p[0], result: 'matched', link: 'none', note: p[1] + ': ' + p[2] });
// ---------- mechanical process checks
C.push({ id: id(), direction: 'records-to-source', record: 'CHK-001 citation check: 436 file:line citations and 174 class/method citations in 208 rows and the reconnaissance', result: 'matched', link: 'none', note: '432 automatic passes, 4 heuristic misses verified by hand, 3 basename-ambiguous citations resolved from context, 1 intentionally absent class' });
C.push({ id: id(), direction: 'records-to-source', record: 'CHK-005 validator key coverage (17 validators, 47 keys incl. inherited)', result: 'matched', link: 'none', note: '41 distinct keys, 0 uncovered' });
C.push({ id: id(), direction: 'records-to-source', record: 'CHK-007 figures (208 rows: 112 Yes, 75 Inferred, 20 Partial, 1 No; 18 epics; inventory counts)', result: 'matched', link: 'none', note: 'figures.js and xlsx2json.js' });
const tot = C.reduce((o, c) => (o[c.result] = (o[c.result] || 0) + 1, o), {});
const out = { schema: 'S02-P004 comparison ledger v1', reviewedRevision: '18dc6b73c8305971a8d6f2879b8fab6206ba5f04', phaseA: { file: 'phase-a-inventory.json', sha256: '63ab82d15c0e290e2c9dbf7abc37cc81b39560477afe426972c8b2f01bde3932' },
 inputs: { reconnaissance: 'a35a09acfb6345681b292424649f2988e3c24575614681842fa5b1252bc1260b', workbook: '24630a194e79ba9051b37355148aba52b6dda7fbeee6b43c9290ebb58528670a', checklist: '2abe6fa4fbd89c227574317fc422618ad7748584b3996c5b1febb1ec902d5165' },
 totals: { items: C.length, ...tot }, byDirection: C.reduce((o, c) => (o[c.direction] = (o[c.direction] || 0) + 1, o), {}), items: C };
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.totals), JSON.stringify(out.byDirection));
const mis = C.filter(c => c.result === 'mismatch').map(c => c.id + ' ' + c.link + ' ' + (c.inventory || c.record)); console.log(mis.join('\n'));
const na = C.filter(c => c.result === 'not-applicable').map(c => c.id + ' ' + c.link); console.log(na.join('\n'));
