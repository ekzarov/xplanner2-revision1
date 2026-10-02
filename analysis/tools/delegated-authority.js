'use strict';

// Project rule (xplanner2-revision1 process departure, owner delegation of
// 2026-09-30, extended 2026-10-02): a decision may be taken by a named delegate operator under an
// owner-approved delegation instead of by the owner in person. decided_by then
// names the real decider and delegated_authority cites the owner's delegation,
// so the record never presents the delegate's choice as the owner's own
// approval. A delegation ends at entry into its ends_at_stage. Waivers stay
// owner-only unless the delegation names that waiver gate in delegation.waivers;
// only legacy_walkthrough_fallback can be named (schema). A transition
// owner_approval may come from the delegate only for the Stage 3 -> Stage 4
// fallback transition under such a delegation. Not part of the Starter; see analysis/maintenance/.

const STAGE = /^stage-(\d{2})$/;
// The only transition a delegate may approve, and the waiver gate that must be delegated for it.
const DELEGABLE_APPROVALS = Object.freeze({ 'stage-03->stage-04': 'legacy_walkthrough_fallback' });

// Shared checks of the cited delegation; returns [authority, null] or [null, reason].
function delegationFor(delegate, at, delegated, status) {
  const owner = status.project && status.project.owner;
  const authorities = (status.owner_decisions || []).filter((d) => d.id === delegated.authority_decision_id);
  if (authorities.length !== 1) return [null, 'delegated_authority.authority_decision_id must identify exactly one owner decision'];
  const [authority] = authorities;
  if (authority.decided_by !== owner || authority.delegated_authority !== undefined) return [null, 'the delegation must be decided by project.owner in person'];
  if (authority.decision !== 'approved' || !authority.delegation) return [null, 'the delegation must be an approved decision with a delegation'];
  if (authority.delegation.delegate !== delegate) return [null, 'decided_by must equal the delegation delegate'];
  if (!(Date.parse(at) >= Date.parse(authority.decided_at))) return [null, 'decided_at must be at or after the delegation'];
  const end = STAGE.exec(authority.delegation.ends_at_stage || '');
  if (!end) return [null, 'the delegation needs ends_at_stage'];
  const endNumber = Number(end[1]);
  const ended = (status.transition_history || []).some((t) => {
    const to = STAGE.exec(t.to || '');
    return (t.to === 'complete' || (to && Number(to[1]) >= endNumber)) && Date.parse(t.changed_at) <= Date.parse(at);
  });
  if (ended) return [null, `the delegation ended at entry into ${authority.delegation.ends_at_stage}`];
  return [authority, null];
}

// Returns null when the decision is attributable, otherwise the reason.
function attributionError(decision, status) {
  const owner = status.project && status.project.owner;
  if (decision.decided_by === owner && decision.delegated_authority === undefined) return null;
  const delegated = decision.delegated_authority;
  if (!delegated) return 'decided_by must equal project.owner, or cite delegated_authority';
  if (decision.decided_by === owner) return 'delegated_authority is only for a delegate, not for the owner';
  const [authority, reason] = delegationFor(decision.decided_by, decision.decided_at, delegated, status);
  if (reason) return reason;
  if (String(decision.id).startsWith('waiver:')) {
    const gate = String(decision.id).split(':')[1];
    if (!(authority.delegation.waivers || []).includes(gate)) return 'a waiver cannot be decided under delegated authority unless the delegation names its gate';
  }
  return null;
}

// Transition owner_approval: the owner in person, or the delegate for the one delegable fallback transition.
function approvalAttributionError(approval, transition, status) {
  const owner = status.project && status.project.owner;
  if (approval.approved_by === owner && approval.delegated_authority === undefined) return null;
  const delegated = approval.delegated_authority;
  if (!delegated) return 'approved_by must equal project.owner, or cite delegated_authority';
  if (approval.approved_by === owner) return 'delegated_authority is only for a delegate, not for the owner';
  const gate = DELEGABLE_APPROVALS[`${transition.from}->${transition.to}`];
  if (!gate) return 'only the Stage 3 -> Stage 4 fallback transition can be approved under delegated authority';
  const [authority, reason] = delegationFor(approval.approved_by, approval.approved_at, delegated, status);
  if (reason) return reason;
  if (!(authority.delegation.waivers || []).includes(gate)) return `the delegation must name the ${gate} waiver gate`;
  return null;
}

module.exports = { attributionError, approvalAttributionError };
