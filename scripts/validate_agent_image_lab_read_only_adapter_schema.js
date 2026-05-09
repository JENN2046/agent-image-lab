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

function refsAreRepositoryRelative(refs) {
  return refs.every(r => !path.isAbsolute(r) && !r.startsWith('/') && !r.match(/^[A-Za-z]:\\/));
}

// Case 1: valid_text_only_request
{
  const resp = runAdapter({
    schema_version: 'v1',
    request_id: 'schema_test_valid',
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
  });
  check('valid_text_only_request_status', resp.status === 'ok', `status=${resp.status}`);
  check('valid_text_only_request_payload_type', resp.payload_type === 'text_only_refs', `payload_type=${resp.payload_type}`);
  check('valid_text_only_request_returned_refs_only', resp.returned_refs_only === true, String(resp.returned_refs_only));
  check('valid_text_only_request_refs_are_array', Array.isArray(resp.returned_resource_refs), typeof resp.returned_resource_refs);
  check('valid_text_only_request_case_state', resp.current_case_state === 'closed_no_memory_write', resp.current_case_state);
  check('valid_text_only_request_refs_relative', refsAreRepositoryRelative(resp.returned_resource_refs), 'contained absolute paths');
  check('valid_text_only_request_no_abs_paths', !resp.returned_resource_refs.some(r => path.isAbsolute(r)), 'absolute path found');
}

// Case 2: missing_case_id
{
  const resp = runAdapter({
    schema_version: 'v1',
    request_id: 'schema_test_missing_cid',
    bridge_mode: 'read_only',
    payload_type: 'text_only_refs',
    requested_resources: ['project_state'],
    write_intent: false
  });
  check('missing_case_id_status', resp.status === 'not_found', `status=${resp.status}`);
}

// Case 3: unknown_case_id
{
  const resp = runAdapter({
    schema_version: 'v1',
    request_id: 'schema_test_unknown_cid',
    bridge_mode: 'read_only',
    payload_type: 'text_only_refs',
    case_id: 'some_unknown_case',
    requested_resources: ['project_state'],
    write_intent: false
  });
  check('unknown_case_id_status', resp.status === 'not_found', `status=${resp.status}`);
}

// Case 4: invalid_payload_type
{
  const resp = runAdapter({
    schema_version: 'v1',
    request_id: 'schema_test_invalid_pt',
    bridge_mode: 'read_only',
    payload_type: 'image_binary',
    case_id: 'french_summer_rattan_bag_v3_production_candidate_001',
    requested_resources: ['project_state'],
    write_intent: false
  });
  check('invalid_payload_type_status', resp.status === 'blocked', `status=${resp.status}`);
  check('invalid_payload_type_reason', resp.blocked_reasons.includes('payload_type_not_text_only_refs'),
    `reasons=${JSON.stringify(resp.blocked_reasons)}`);
}

// Case 5: empty_request
{
  const resp = runAdapter({});
  const validStatuses = ['blocked', 'failed'];
  check('empty_request_status', validStatuses.includes(resp.status), `status=${resp.status} not in ${JSON.stringify(validStatuses)}`);
}

// Case 6: unknown_requested_resource
{
  const resp = runAdapter({
    schema_version: 'v1',
    request_id: 'schema_test_unknown_res',
    bridge_mode: 'read_only',
    payload_type: 'text_only_refs',
    case_id: 'french_summer_rattan_bag_v3_production_candidate_001',
    requested_resources: ['nonexistent_category'],
    write_intent: false
  });
  check('unknown_requested_resource_status', resp.status === 'not_found', `status=${resp.status}`);
}

// Summary
const cases = [
  { id: 'valid_text_only_request' },
  { id: 'missing_case_id' },
  { id: 'unknown_case_id' },
  { id: 'invalid_payload_type' },
  { id: 'empty_request' },
  { id: 'unknown_requested_resource' }
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
  schema_validation_executed: true,
  result: allPass ? 'pass' : 'fail',
  cases_total: cases.length,
  cases_passed: casesPassed,
  cases_failed: casesFailed,
  checks_total: checksTotal,
  checks_passed: checksPassed,
  checks_failed: checksFailed,
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
  console.error('SCHEMA_VALIDATION_FAILED');
  process.exit(1);
}
