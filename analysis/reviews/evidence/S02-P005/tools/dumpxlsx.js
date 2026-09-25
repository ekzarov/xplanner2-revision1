// Read-only dump of the User Flows sheet (reviewer-authored). Uses the project-local exceljs.
'use strict';
const path = require('path');
const ExcelJS = require(require.resolve('@excel.js/exceljs', { paths: ['C:/Work/Legacy/xplanner2-revision1/analysis/tools'] })).default;
(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Work/Legacy/xplanner2-revision1/analysis/legacy_user_flows.xlsx');
  const out = { sheets: wb.worksheets.map(w => w.name), rows: [] };
  const ws = wb.getWorksheet('User Flows');
  const txt = v => v == null ? '' : (typeof v === 'object' ? (v.richText ? v.richText.map(r => r.text).join('') : (v.text || v.result || JSON.stringify(v))) : String(v));
  let epic = null, flow = null;
  ws.eachRow({ includeEmpty: false }, (row, n) => {
    if (n < 7) return;
    const c = i => txt(row.getCell(i).value).trim();
    const a = c(1);
    if (a) { epic = a + ' ' + c(2); out.rows.push({ row: n, type: 'epic', id: a, name: c(2), status: c(3) }); return; }
    if (c(2)) flow = c(2);
    out.rows.push({ row: n, type: 'scenario', epic, flow, scenario: c(3), requirement: c(4), description: c(5), expected: c(6), source: c(7), evidence: c(8), I: c(9), J: c(10), K: c(11), L: c(12), M: c(13), N: c(14) });
  });
  require('fs').writeFileSync(__dirname + '/workbook-rows.json', JSON.stringify(out, null, 1) + '\n');
  const sc = out.rows.filter(r => r.type === 'scenario');
  const cnt = {}; sc.forEach(r => { cnt[r.source] = (cnt[r.source] || 0) + 1; });
  console.log(JSON.stringify({ sheets: out.sheets, epics: out.rows.filter(r => r.type === 'epic').length, scenarios: sc.length, byStatus: cnt, lastRow: out.rows[out.rows.length - 1].row }));
})().catch(e => { console.error(e); process.exit(1); });
