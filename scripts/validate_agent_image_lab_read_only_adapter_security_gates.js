#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

const ADAPTER_SCRIPT = path.resolve(__dirname, 'agent_image_lab_read_only_adapter.js');

let allPass = true;
const results = {};

function check(name, pass, detail) {
  results[name] = { pass, detail };
  if (!pass) allPass = false;
}

function runAdapter(requestJson) {
  const arg = JSON.stringify(requestJson);
  const result = spawnSync('node', [ADAPTER_SCRIPT, '--request-json', arg], {
    encoding: 'utf-8',
    timeout: 5000,
    maxBuffer: 1024 * 1024
  });

  if (result.error) {
    return { status: 'failed', error_message: `execution error: ${result.error.message}` };
  }

  try {
    return JSON.parse(result.stdout);
  } catch (e) {
    return { status: 'failed', error_message: 'invalid JSON from adapter', stderr: (result.stderr || '').trim() };
  }
}

function verifyBlocked(resp, expectedReason) {
  if (resp.status !== 'blocked') return `expected blocked, got ${resp.status}`;
  if (!resp.blocked_reasons.includes(expectedReason)) return `missing reason ${expectedReason}, got ${JSON.stringify(resp.blocked_reasons)}`;
  if (resp.blocked_reasons.length !== 1) return `expected exactly one blocked reason, got ${resp.blocked_reasons.length}: ${JSON.stringify(resp.blocked_reasons)}`;
  if (!Array.isArray(resp.returned_resource_refs)) return 'returned_resource_refs not an array';
  if (resp.returned_resource_refs.length !== 0) return `blocked response returned refs: ${JSON.stringify(resp.returned_resource_refs)}`;
  const se = resp.external_side_effects || {};
  if (se.vcp_call_performed !== false) return 'vcp_call_performed not false';
  if (se.vcpchat_bridge_call_performed !== false) return 'vcpchat_bridge_call_performed not false';
  if (se.daily_note_write_performed !== false) return 'daily_note_write_performed not false';
  if (se.vcp_memory_write_performed !== false) return 'vcp_memory_write_performed not false';
  if (se.image_binary_read !== false) return 'image_binary_read not false';
  return null;
}

const baseValid = {
  schema_version: 'v1',
  request_id: 'security_test',
  bridge_mode: 'read_only',
  payload_type: 'text_only_refs',
  case_id: 'french_summer_rattan_bag_v3_production_candidate_001',
  requested_resources: ['project_state'],
  write_intent: false,
  image_binary_requested: false,
  secrets_requested: false,
  raw_payload_requested: false,
  private_absolute_path_requested: false,
  memory_write_requested: false,
  dailynote_write_requested: false,
  production_approved_claim_requested: false,
  reopen_closed_case_requested: false
};

// 1. bridge_mode_not_read_only
{
  const req = { ...baseValid, bridge_mode: 'read_write' };
  const resp = runAdapter(req);
  const err = verifyBlocked(resp, 'bridge_mode_not_read_only');
  check('gate_bridge_mode_not_read_only', !err, err || 'pass');
}

// 2. payload_type_not_text_only_refs (already covered in schema, but testing as security gate)
{
  const req = { ...baseValid, payload_type: 'image_binary' };
  const resp = runAdapter(req);
  const err = verifyBlocked(resp, 'payload_type_not_text_only_refs');
  check('gate_payload_type_not_text_only_refs', !err, err || 'pass');
}

// 3. write_intent_detected
{
  const req = { ...baseValid, write_intent: true };
  const resp = runAdapter(req);
  const err = verifyBlocked(resp, 'write_intent_detected');
  check('gate_write_intent_detected', !err, err || 'pass');
}

// 4. image_binary_requested
{
  const req = { ...baseValid, image_binary_requested: true };
  const resp = runAdapter(req);
  const err = verifyBlocked(resp, 'image_binary_requested');
  check('gate_image_binary_requested', !err, err || 'pass');
}

// 5. secret_requested
{
  const req = { ...baseValid, secrets_requested: true };
  const resp = runAdapter(req);
  const err = verifyBlocked(resp, 'secret_requested');
  check('gate_secret_requested', !err, err || 'pass');
}

// 6. raw_payload_requested
{
  const req = { ...baseValid, raw_payload_requested: true };
  const resp = runAdapter(req);
  const err = verifyBlocked(resp, 'raw_payload_requested');
  check('gate_raw_payload_requested', !err, err || 'pass');
}

// 7. private_absolute_path_requested
{
  const req = { ...baseValid, private_absolute_path_requested: true };
  const resp = runAdapter(req);
  const err = verifyBlocked(resp, 'private_absolute_path_requested');
  check('gate_private_absolute_path_requested', !err, err || 'pass');
}

// 8. memory_write_attempted
{
  const req = { ...baseValid, memory_write_requested: true };
  const resp = runAdapter(req);
  const err = verifyBlocked(resp, 'memory_write_attempted');
  check('gate_memory_write_attempted', !err, err || 'pass');
}

// 9. dailynote_write_attempted
{
  const req = { ...baseValid, dailynote_write_requested: true };
  const resp = runAdapter(req);
  const err = verifyBlocked(resp, 'dailynote_write_attempted');
  check('gate_dailynote_write_attempted', !err, err || 'pass');
}

// 10. production_approved_claim_detected
{
  const req = { ...baseValid, production_approved_claim_requested: true };
  const resp = runAdapter(req);
  const err = verifyBlocked(resp, 'production_approved_claim_detected');
  check('gate_production_approved_claim_detected', !err, err || 'pass');
}

// 11. closed_case_reopen_attempted
{
  const req = { ...baseValid, reopen_closed_case_requested: true };
  const resp = runAdapter(req);
  const err = verifyBlocked(resp, 'closed_case_reopen_attempted');
  check('gate_closed_case_reopen_attempted', !err, err || 'pass');
}

const cases = [
  { id: 'gate_bridge_mode_not_read_only' },
  { id: 'gate_payload_type_not_text_only_refs' },
  { id: 'gate_write_intent_detected' },
  { id: 'gate_image_binary_requested' },
  { id: 'gate_secret_requested' },
  { id: 'gate_raw_payload_requested' },
  { id: 'gate_private_absolute_path_requested' },
  { id: 'gate_memory_write_attempted' },
  { id: 'gate_dailynote_write_attempted' },
  { id: 'gate_production_approved_claim_detected' },
  { id: 'gate_closed_case_reopen_attempted' }
];

const checksTotal = Object.keys(results).length;
const checksPassed = Object.values(results).filter(r => r.pass).length;
const checksFailed = checksTotal - checksPassed;

const casesFailed = cases.filter(c => {
  const caseChecks = Object.keys(results).filter(k => k.startsWith(c.id));
  return caseChecks.length > 0 && caseChecks.some(k => results[k] && !results[k].pass);
}).length;
const casesPassed = cases.length - casesFailed;

const output = {
  security_gate_validation_executed: true,
  result: allPass ? 'pass' : 'fail',
  cases_total: cases.length,
  cases_passed: casesPassed,
  cases_failed: casesFailed,
  checks_total: checksTotal,
  checks_passed: checksPassed,
  checks_failed: checksFailed,
  all_hard_blockers_enforced: allPass,
  details: results,
  external_side_effects: {
    vcp_call_performed: false,
    vcpchat_bridge_call_performed: false,
    electron_started: false,
    daily_note_write_performed: false,
    vcp_memory_write_performed: false,
    image_binary_read: false,
    runs_path_read: false
  }
};

console.log(JSON.stringify(output, null, 2));

if (!allPass) {
  console.error('SECURITY_GATE_VALIDATION_FAILED');
  process.exit(1);
}
