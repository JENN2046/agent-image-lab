#!/usr/bin/env node
// execute_vcp_read_only_bridge_dry_run.js
// v7.50c VCP Read-only Bridge Dry-run Execution
// Repository-local text-only refs dry-run. No VCP call. No bridge call. No image read.

'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function readFile(relPath) {
  const full = path.join(root, relPath);
  try {
    return fs.readFileSync(full, 'utf-8');
  } catch (e) {
    return null;
  }
}

function checkInText(text, pattern) {
  return text.includes(pattern);
}

// ---------------------------------------------------------------------------
// Read allowed text-only refs
// ---------------------------------------------------------------------------
const allowedRefs = [
  'README.md',
  '.agent_board/CHECKPOINT.md',
  'docs/v7_50c_vcp_read_only_bridge_dry_run_plan.yaml',
  'docs/v7_50c_vcp_read_only_bridge_dry_run_contract.md',
  'docs/v7_50c_vcp_read_only_bridge_dry_run_safety_gates.md',
  'docs/v7_50_vcp_read_only_bridge_contract.md',
  'docs/v7_50_vcp_read_only_bridge_security_gates.md',
  'docs/v7_49_vcp_memory_write_boundary_spec.md',
  'production/reviews/v7_53_french_summer_rattan_bag_v3_production_candidate_001_review.md',
  'production/closeouts/v7_56_french_summer_rattan_bag_v3_production_candidate_001_memory_write_skip_closeout.md',
];

const files = {};
for (const ref of allowedRefs) {
  const content = readFile(ref);
  if (content === null) {
    console.log(JSON.stringify({ passed: false, error: `Cannot read ${ref}` }, null, 2));
    process.exit(1);
  }
  files[ref] = content;
}

// ---------------------------------------------------------------------------
// Construct local dry-run request
// ---------------------------------------------------------------------------
const dryRunRequest = {
  schema_version: 'v1',
  phase: 'v7_50c',
  dry_run_id: 'v7_50c_read_only_bridge_dry_run_001',
  bridge_mode: 'read_only',
  requested_by: 'human_operator',
  source_repo: 'JENN2046/agent-image-lab',
  case_id: 'french_summer_rattan_bag_v3_production_candidate_001',
  requested_resources: [
    'project_state',
    'production_candidate_review',
    'memory_write_skip_closeout',
    'bridge_contract',
    'bridge_security_gates',
    'memory_boundary',
  ],
  write_intent: false,
  image_binary_requested: false,
  secrets_requested: false,
  raw_payload_requested: false,
  private_absolute_path_requested: false,
};

// ---------------------------------------------------------------------------
// Soft blockers (checks that would block in a real bridge, flagged here)
// ---------------------------------------------------------------------------
const softBlockers = [];

if (dryRunRequest.bridge_mode !== 'read_only') softBlockers.push('bridge_mode_not_read_only');
if (dryRunRequest.write_intent) softBlockers.push('write_intent_true');
if (dryRunRequest.image_binary_requested) softBlockers.push('image_binary_requested_true');
if (dryRunRequest.secrets_requested) softBlockers.push('secrets_requested_true');
if (dryRunRequest.raw_payload_requested) softBlockers.push('raw_payload_requested');
if (dryRunRequest.private_absolute_path_requested) softBlockers.push('private_absolute_path_requested');

// ---------------------------------------------------------------------------
// Safety gates
// ---------------------------------------------------------------------------
const closeoutText = files['production/closeouts/v7_56_french_summer_rattan_bag_v3_production_candidate_001_memory_write_skip_closeout.md'];

const safetyGates = {
  bridge_mode_must_be_read_only: dryRunRequest.bridge_mode === 'read_only',
  dry_run_must_be_text_only_refs: true,
  write_intent_must_be_false: dryRunRequest.write_intent === false,
  image_binary_must_be_excluded: dryRunRequest.image_binary_requested === false,
  secrets_must_be_excluded: dryRunRequest.secrets_requested === false,
  raw_payload_must_be_excluded: dryRunRequest.raw_payload_requested === false,
  private_absolute_path_must_be_excluded: dryRunRequest.private_absolute_path_requested === false,
  dailynote_write_must_be_blocked: closeoutText.includes('daily_note_write_final: false') || closeoutText.includes('不写 DailyNote'),
  vcp_memory_write_must_be_blocked: closeoutText.includes('vcp_memory_write_final: false') || closeoutText.includes('不写 VCP memory'),
  closed_no_memory_write_case_must_not_be_reopened: closeoutText.includes('current_case_state: closed_no_memory_write'),
  production_approved_claim_must_be_blocked: !closeoutText.includes('production_approved: true'),
};

const safetyGateResults = {};
let allSafetyPass = true;
for (const [gate, pass] of Object.entries(safetyGates)) {
  safetyGateResults[gate] = pass ? 'pass' : 'fail';
  if (!pass) allSafetyPass = false;
}

// ---------------------------------------------------------------------------
// Closed case checks
// ---------------------------------------------------------------------------
const reviewText = files['production/reviews/v7_53_french_summer_rattan_bag_v3_production_candidate_001_review.md'];
const closeoutYamlText = files['production/closeouts/v7_56_french_summer_rattan_bag_v3_production_candidate_001_memory_write_skip_closeout.md'];

const closedCaseChecks = {
  closeout_ref_exists: closeoutText.length > 0,
  final_decision_skip_memory_write_present: closeoutText.includes('decision: skip_memory_write'),
  current_case_state_closed_no_memory_write_present: closeoutText.includes('current_case_state: closed_no_memory_write'),
  daily_note_write_false_present: closeoutText.includes('daily_note_write_final: false'),
  vcp_memory_write_false_present: closeoutText.includes('vcp_memory_write_final: false'),
  production_approved_claim_absent: !reviewText.includes('production_approved') && !reviewText.includes('production_approved: true'),
  reopen_attempt_absent: !closeoutText.includes('reopen') || closeoutText.includes('future_reopen_policy'),
};

const closedCaseResults = {};
let allClosedPass = true;
for (const [check, pass] of Object.entries(closedCaseChecks)) {
  closedCaseResults[check] = pass ? 'pass' : 'fail';
  if (!pass) allClosedPass = false;
}

// ---------------------------------------------------------------------------
// Build dry-run response
// ---------------------------------------------------------------------------
const dryRunResponse = {
  schema_version: 'v1',
  phase: 'v7_50c',
  dry_run_id: 'v7_50c_read_only_bridge_dry_run_001',
  bridge_mode: 'read_only',
  status: 'ok',
  payload_type: 'text_only_refs',
  returned_refs_only: true,
  image_binary_included: false,
  secrets_included: false,
  raw_payload_included: false,
  private_absolute_path_included: false,
  write_performed: false,
  memory_write_performed: false,
  daily_note_write_performed: false,
  vcp_call_performed: false,
  vcpchat_bridge_call_performed: false,
};

const returnedResourceRefs = [
  'README.md',
  '.agent_board/CHECKPOINT.md',
  'production/reviews/v7_53_french_summer_rattan_bag_v3_production_candidate_001_review.md',
  'production/closeouts/v7_56_french_summer_rattan_bag_v3_production_candidate_001_memory_write_skip_closeout.md',
  'docs/v7_50_vcp_read_only_bridge_contract.md',
  'docs/v7_50_vcp_read_only_bridge_security_gates.md',
  'docs/v7_49_vcp_memory_write_boundary_spec.md',
];

// ---------------------------------------------------------------------------
// Determine overall result
// ---------------------------------------------------------------------------
const allPass = allSafetyPass && allClosedPass && softBlockers.length === 0;
const result = allPass ? 'pass' : 'fail';

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const output = {
  passed: allPass,
  result,
  dry_run_id: 'v7_50c_read_only_bridge_dry_run_001',
  dry_run_type: 'repository_local_text_only_refs',
  request: {
    bridge_mode: dryRunRequest.bridge_mode,
    requested_by: dryRunRequest.requested_by,
    source_repo: dryRunRequest.source_repo,
    case_id: dryRunRequest.case_id,
    write_intent: dryRunRequest.write_intent,
    image_binary_requested: dryRunRequest.image_binary_requested,
    secrets_requested: dryRunRequest.secrets_requested,
    raw_payload_requested: dryRunRequest.raw_payload_requested,
    private_absolute_path_requested: dryRunRequest.private_absolute_path_requested,
  },
  response: dryRunResponse,
  returned_resource_refs: returnedResourceRefs,
  safety_gates: safetyGateResults,
  closed_case_checks: closedCaseResults,
  soft_blockers: softBlockers,
  external_side_effects: {
    real_bridge_call_performed: false,
    vcp_call_performed: false,
    vcpchat_bridge_call_performed: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    image_generation_performed: false,
    image_binary_read: false,
    runs_path_read: false,
  },
};

console.log(JSON.stringify(output, null, 2));

if (!allPass) {
  process.exit(1);
}
