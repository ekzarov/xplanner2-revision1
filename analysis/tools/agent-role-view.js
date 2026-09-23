'use strict';

const fs = require('node:fs');
const path = require('node:path');

const namesRu = { pm: 'PM / Координатор', ba: 'Бизнес-аналитик', ux: 'UX-дизайнер',
  architect: 'Архитектор', developer: 'Разработчик', qa: 'QA' };
const modes = {
  coordinate: { en: 'coordination', ru: 'координация' },
  author: { en: 'responsible author', ru: 'ответственный автор' },
  'responsible-check': { en: 'responsible-agent verification', ru: 'проверка ответственным агентом' },
  'independent-review': { en: 'fresh independent reviewer', ru: 'новый независимый ревьюер' },
};

function stageRoleView(contract, stageId) {
  const row = contract.assignments.find(item => item.stage === stageId);
  if (!row) throw new Error('Missing role assignment: ' + stageId);
  const roles = new Map(contract.roles.map(role => [role.id, role]));
  const role = roles.get(row.lead);
  const name = (id, lang) => lang === 'ru' ? namesRu[id] : roles.get(id).name;
  const actor = {}, assignment = {};
  for (const lang of ['en', 'ru']) {
    actor[lang] = name(row.lead, lang) + ' (' + modes[row.mode][lang] + ')';
    if (row.peer.length) actor[lang] += lang === 'en'
      ? '; separate Developer peer' : '; отдельный разработчик-ревьюер';
    const support = row.support.map(id => name(id, lang)).join(', ');
    assignment[lang] = lang === 'en'
      ? `${actor.en}. PM coordinates; the assigned session reads ${role.skill} and returns ACK before work. ${support ? 'Support on demand: ' + support + '. ' : ''}Questions and RESULT return to PM with exact artifacts, checks and remaining gaps. Human decisions remain with the owner.`
      : `${actor.ru}. PM координирует; назначенная сессия читает ${role.skill} и возвращает ACK до начала работы. ${support ? 'Помощь по необходимости: ' + support + '. ' : ''}Вопросы и RESULT возвращаются PM с точными артефактами, проверками и оставшимися пробелами. Решения человека остаются за владельцем.`;
  }
  if (stageId === 'stage-19') {
    assignment.en += ' QA returns independent evidence only; PM records the owner walkthrough/decline, sign-off and authorized status changes.';
    assignment.ru += ' QA возвращает только независимые доказательства; PM записывает обход владельца или отказ, итоговое решение и разрешённые изменения статуса.';
  }
  if (stageId === 'stage-03') {
    assignment.en += ' PM obtains owner-approved access and runs the legacy deployment; BA verifies behavior and records the actual deployment handoff.';
    assignment.ru += ' PM получает разрешённый владельцем доступ и запускает деплой легаси; BA проверяет поведение и записывает фактическую передачу результатов деплоя.';
  }
  if (stageId === 'stage-18') {
    assignment.en += ' PM rechecks access and release authorization and runs the approved deployment; Developer owns verification/reconciliation and the delivery report.';
    assignment.ru += ' PM перепроверяет доступ и разрешение на поставку и запускает согласованный деплой; Developer отвечает за проверку, сопоставление и отчёт о поставке.';
  }
  return { actor, assignment, skill: role.skill };
}

function roleViewErrors(root, contract) {
  const errors = [];
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const sources = Object.fromEntries(['md', 'html'].map(format =>
    [format, read('analysis/migration_methodology.' + format)]));
  const cheat = read('analysis/process-cheatsheet.md');
  const drawio = read('analysis/migration_artifact_flow.drawio');
  const canvas = path.join(root, 'analysis/process-canvas/data.json');
  const data = fs.existsSync(canvas) ? JSON.parse(fs.readFileSync(canvas, 'utf8')) : null;
  const ru = data ? JSON.parse(read('analysis/process-canvas/translations.ru.json')) : null;
  const htmlEscape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  for (const row of contract.assignments) {
    const view = stageRoleView(contract, row.stage);
    const number = row.stage === 'stage-00' ? 'B' : Number(row.stage.slice(-2));
    for (const [format, source] of Object.entries(sources)) {
      const body = source.split(`<!-- AGENT_ROLE_${number}_START -->`)[1]?.split(`<!-- AGENT_ROLE_${number}_END -->`)[0];
      const expected = format === 'html' ? htmlEscape(view.assignment.en) : view.assignment.en;
      if (!body?.includes(expected)) errors.push(`${row.stage}: stale ${format} role/skill handoff`);
    }
    if (!cheat.includes(view.assignment.en)) errors.push(`${row.stage}: missing cheat-sheet handoff`);
    if (!drawio.includes(htmlEscape('Lead: ' + view.actor.en + '; PM coordinates (agent-roles.md)'))) errors.push(`${row.stage}: stale Draw.io lead`);
    if (data) {
      const stage = data.stages.find(item => item.id === row.stage);
      if (stage?.actor !== view.actor.en || JSON.stringify(stage?.assignment) !== JSON.stringify(view.assignment)) errors.push(`${row.stage}: stale 3D role/skill`);
      if (ru.stages[row.stage]?.actor !== view.actor.ru) errors.push(`${row.stage}: stale Russian 3D role`);
    }
  }
  return errors;
}

module.exports = { stageRoleView, roleViewErrors };
