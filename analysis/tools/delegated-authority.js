'use strict';

// Project rule (xplanner2-revision1 process departure, owner delegation of
// 2026-09-30): a decision may be taken by a named delegate operator under an
// owner-approved delegation instead of by the owner in person. decided_by then
// names the real decider and delegated_authority cites the owner's delegation,
// so the record never presents the delegate's choice as the owner's own
// approval. A delegation ends at entry into its ends_at_stage; waivers stay
// owner-only. Not part of the Starter; see analysis/maintenance/ for the record.

const STAGE = /^stage-(\d{2})$/;

// Returns null when the decision is attributable, otherwise the reason.
function attributionError(decision, status) {
  const owner = status.project && status.project.owner;
  if (decision.decided_by === owner && decision.delegated_authority === undefined) return null;
  const delegated = decision.delegated_authority;
  if (!delegated) return 'decided_by must equal project.owner, or cite delegated_authority';
  if (decision.decided_by === owner) return 'delegated_authority is only for a delegate, not for the owner';
  if (String(decision.id).startsWith('waiver:')) return 'a waiver cannot be decided under delegated authority';
  const authorities = (status.owner_decisions || []).filter((d) => d.id === delegated.authority_decision_id);
  if (authorities.length !== 1) return 'delegated_authority.authority_decision_id must identify exactly one owner decision';
  const [authority] = authorities;
  if (authority.decided_by !== owner || authority.delegated_authority !== undefined) return 'the delegation must be decided by project.owner in person';
  if (authority.decision !== 'approved' || !authority.delegation) return 'the delegation must be an approved decision with a delegation';
  if (authority.delegation.delegate !== decision.decided_by) return 'decided_by must equal the delegation delegate';
  if (!(Date.parse(decision.decided_at) >= Date.parse(authority.decided_at))) return 'decided_at must be at or after the delegation';
  const end = STAGE.exec(authority.delegation.ends_at_stage || '');
  if (!end) return 'the delegation needs ends_at_stage';
  const endNumber = Number(end[1]);
  const ended = (status.transition_history || []).some((t) => {
    const to = STAGE.exec(t.to || '');
    return (t.to === 'complete' || (to && Number(to[1]) >= endNumber)) && Date.parse(t.changed_at) <= Date.parse(decision.decided_at);
  });
  if (ended) return `the delegation ended at entry into ${authority.delegation.ends_at_stage}`;
  return null;
}

module.exports = { attributionError };
