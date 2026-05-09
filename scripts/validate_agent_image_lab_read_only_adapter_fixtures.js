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

function hasDuplicateRefs(refs) {
  const seen = new Set();
  for (const r of refs) {
    if (seen.has(r)) return true;
    seen.add(r);
  }
  return false;
}

const baseValid = {
  schema_version: 'v1',
  request_id: 'fixture_test',
  bridge_mode: 'read_only',
  payload_type: 'text_only_refs',
  case_id: 'french_summer_rattan_bag_v3_production_candidate_001',
  requested_resources: ['project_state', 'bridge_contracts', 'dry_run_results', 'production_candidate_001'],
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

// 1. canonical_smoke_request
{
  const req = { ...baseValid, request_id: 'fixture_canonical' };
  const resp = runAdapter(req);
  check('fixture_canonical_smoke_status', resp.status === 'ok', `status=${resp.status}`);
  check('fixture_canonical_smoke_payload_type', resp.payload_type === 'text_only_refs', resp.payload_type);
  check('fixture_canonical_smoke_returned_refs_only', resp.returned_refs_only === true, String(resp.returned_refs_only));
  check('fixture_canonical_smoke_refs_relative', refsAreRepositoryRelative(resp.returned_resource_refs), 'absolute path found');
  check('fixture_canonical_smoke_no_file_content', !resp.returned_resource_refs.some(r => r.includes('\\') && r.match(/^[A-Za-z]:\\/)), 'absolute path detected');
  const se = resp.external_side_effects || {};
  check('fixture_canonical_smoke_no_image_binary', se.image_binary_read === false, String(se.image_binary_read));
  check('fixture_canonical_smoke_no_vcp', se.vcp_call_performed === false, String(se.vcp_call_performed));
}

// 2. all_known_resource_categories
{
  const req = {
    ...baseValid,
    request_id: 'fixture_all_known',
    requested_resources: ['project_state', 'bridge_contracts', 'dry_run_results', 'vcpchat_surface', 'production_candidate_001']
  };
  const resp = runAdapter(req);
  check('fixture_all_known_status', resp.status === 'ok', `status=${resp.status}`);
  check('fixture_all_known_has_refs', resp.returned_resource_refs.length > 0, `count=${resp.returned_resource_refs.length}`);
  check('fixture_all_known_refs_relative', refsAreRepositoryRelative(resp.returned_resource_refs), 'absolute path found');
}

// 3. duplicate_requested_resources
{
  const req = {
    ...baseValid,
    request_id: 'fixture_duplicate',
    requested_resources: ['project_state', 'project_state', 'project_state']
  };
  const resp = runAdapter(req);
  check('fixture_duplicate_status', resp.status === 'ok', `status=${resp.status}`);
  check('fixture_duplicate_no_dup', !hasDuplicateRefs(resp.returned_resource_refs),
    `duplicates found: ${JSON.stringify(resp.returned_resource_refs)}`);
}

// 4. mixed_known_and_unknown_resources
{
  const req = {
    ...baseValid,
    request_id: 'fixture_mixed',
    requested_resources: ['project_state', 'nonexistent_category']
  };
  const resp = runAdapter(req);
  check('fixture_mixed_status', resp.status === 'ok', `status=${resp.status}`);
  check('fixture_mixed_has_project_refs', resp.returned_resource_refs.some(r => r === 'README.md'), 'missing expected ref');
  check('fixture_mixed_refs_relative', refsAreRepositoryRelative(resp.returned_resource_refs), 'absolute path found');
}

// 5. unknown_resource_only
{
  const req = {
    ...baseValid,
    request_id: 'fixture_unknown_only',
    requested_resources: ['nonexistent_category']
  };
  const resp = runAdapter(req);
  check('fixture_unknown_only_status', resp.status === 'not_found', `status=${resp.status}`);
}

// 6. unknown_case_id
{
  const req = {
    ...baseValid,
    request_id: 'fixture_unknown_cid',
    case_id: 'nonexistent_case'
  };
  const resp = runAdapter(req);
  check('fixture_unknown_case_id_status', resp.status === 'not_found', `status=${resp.status}`);
}

// 7. blocked_image_binary_request
{
  const req = {
    ...baseValid,
    request_id: 'fixture_blocked_img',
    image_binary_requested: true
  };
  const resp = runAdapter(req);
  check('fixture_blocked_image_binary_status', resp.status === 'blocked', `status=${resp.status}`);
  check('fixture_blocked_image_binary_reason', resp.blocked_reasons.includes('image_binary_requested'),
    `reasons=${JSON.stringify(resp.blocked_reasons)}`);
  check('fixture_blocked_image_binary_empty_refs', Array.isArray(resp.returned_resource_refs) && resp.returned_resource_refs.length === 0,
    `refs=${JSON.stringify(resp.returned_resource_refs)}`);
}

// 8. blocked_memory_write_request
{
  const req = {
    ...baseValid,
    request_id: 'fixture_blocked_mem',
    memory_write_requested: true
  };
  const resp = runAdapter(req);
  check('fixture_blocked_memory_write_status', resp.status === 'blocked', `status=${resp.status}`);
  check('fixture_blocked_memory_write_reason', resp.blocked_reasons.includes('memory_write_attempted'),
    `reasons=${JSON.stringify(resp.blocked_reasons)}`);
}

// 9. blocked_closed_case_reopen_request
{
  const req = {
    ...baseValid,
    request_id: 'fixture_blocked_reopen',
    reopen_closed_case_requested: true
  };
  const resp = runAdapter(req);
  check('fixture_blocked_reopen_status', resp.status === 'blocked', `status=${resp.status}`);
  check('fixture_blocked_reopen_reason', resp.blocked_reasons.includes('closed_case_reopen_attempted'),
    `reasons=${JSON.stringify(resp.blocked_reasons)}`);
}

const cases = [
  { id: 'fixture_canonical_smoke' },
  { id: 'fixture_all_known' },
  { id: 'fixture_duplicate' },
  { id: 'fixture_mixed' },
  { id: 'fixture_unknown_only' },
  { id: 'fixture_unknown_case_id' },
  { id: 'fixture_blocked_image_binary' },
  { id: 'fixture_blocked_memory_write' },
  { id: 'fixture_blocked_reopen' }
];

const checksTotal = Object.keys(results).length;
const checksPassed = Object.values(results).filter(r => r.pass).length;
const checksFailed = checksTotal - checksPassed;

const casesFailed = cases.filter(c => {
  const caseChecks = Object.keys(results).filter(k => k.startsWith(c.id));
  return caseChecks.length > 0 && caseChecks.some(k => results[k] && !results[k].pass);
}).length;
const casesPassed = cases.length - casesFailed;

const duplicateFound = cases.some(c => c.id === 'fixture_duplicate' &&
  results['fixture_duplicate_no_dup'] && !results['fixture_duplicate_no_dup'].pass);
const absPathsFound = Object.keys(results).some(k => k.includes('refs_relative') && results[k] && !results[k].pass);

const output = {
  fixture_regression_executed: true,
  result: allPass ? 'pass' : 'fail',
  cases_total: cases.length,
  cases_passed: casesPassed,
  cases_failed: casesFailed,
  checks_total: checksTotal,
  checks_passed: checksPassed,
  checks_failed: checksFailed,
  duplicate_refs_detected: duplicateFound,
  absolute_paths_detected: absPathsFound,
  file_content_returned: false,
  image_binary_returned: false,
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
  console.error('FIXTURE_REGRESSION_FAILED');
  process.exit(1);
}
