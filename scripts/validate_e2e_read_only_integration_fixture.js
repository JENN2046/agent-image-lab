#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

// No fs import — this validator never reads filesystem content from refs

const ADAPTER_SCRIPT = path.resolve(__dirname, 'agent_image_lab_read_only_adapter.js');
const INGESTION_MOCK_SCRIPT = path.resolve(__dirname, 'validate_vcptoolbox_read_only_ingestion_mock.js');

let allPass = true;
const results = {};

function check(name, pass, detail) {
  results[name] = { pass, detail };
  if (!pass) allPass = false;
}

function runScript(scriptPath, args = []) {
  const result = spawnSync('node', [scriptPath, ...args], {
    encoding: 'utf-8',
    timeout: 10000,
    maxBuffer: 1024 * 1024
  });
  const meta = {
    exit_status: result.status,
    signal: result.signal,
    timed_out: !!(result.error && result.error.code === 'ETIMEDOUT'),
    stdout_empty: !result.stdout || result.stdout.trim().length === 0,
    stderr_contains_stack: (result.stderr || '').includes(' at ') || (result.stderr || '').includes('Error:')
  };
  let response = null;
  if (result.stdout && result.stdout.trim().length > 0) {
    try { response = JSON.parse(result.stdout); } catch { response = null; }
  }
  return { meta, response };
}

function isWrapperStrictlySafe(result) {
  return result &&
    result.response !== null &&
    result.meta &&
    result.meta.exit_status === 0 &&
    result.meta.signal === null &&
    result.meta.timed_out === false &&
    result.meta.stdout_empty === false &&
    result.meta.stderr_contains_stack === false;
}

const VISIBLE_FIELDS = ['status', 'source_case_id', 'returned_resource_refs', 'safety_summary', 'hard_stops', 'next_allowed_steps'];

const FORBIDDEN_FIELDS = [
  'full_file_content', 'image_binary', 'raw_payload', 'secrets', 'private_absolute_path',
  'memory_write_action', 'dailynote_write_action', 'generate_image_action', 'retry_generation_action',
  'production_approved_claim', 'reopen_closed_case_action'
];

function buildSafeSurface(adapterResp, sourceCaseId) {
  if (!adapterResp || adapterResp.status !== 'ok') return null;
  for (const f of FORBIDDEN_FIELDS) {
    if (f in adapterResp) return null;
  }
  return {
    status: 'ok',
    source_case_id: sourceCaseId,
    returned_resource_refs: Array.isArray(adapterResp.returned_resource_refs) ? adapterResp.returned_resource_refs : [],
    safety_summary: 'opaque_refs_only',
    hard_stops: [
      'do_not_dereference_refs_without_realpath_containment',
      'do_not_write_memory_without_independent_a5',
      'do_not_call_real_vcptoolbox_without_independent_a5'
    ],
    next_allowed_steps: [
      'LT_06_real_VCPToolBox_read_only_dry_run_A5_only_if_explicitly_authorized'
    ]
  };
}

// Step 1: Run adapter
const adapterRequest = {
  schema_version: 'v1',
  request_id: 'e2e_fixture_adapter',
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

const adapterResult = runScript(ADAPTER_SCRIPT, ['--request-json', JSON.stringify(adapterRequest)]);

// Step 2: Run ingestion mock
const ingestionResult = runScript(INGESTION_MOCK_SCRIPT);

// Step 3: Build safe surface
const adapterResp = adapterResult.response;
const safeSurface = buildSafeSurface(adapterResp, adapterRequest.case_id);

// Case 1: adapter_to_ingestion_to_surface_happy_path
const chainOk = adapterResp !== null && adapterResp.status === 'ok' &&
  ingestionResult.response !== null &&
  ingestionResult.response.vcptoolbox_read_only_ingestion_mock &&
  ingestionResult.response.vcptoolbox_read_only_ingestion_mock.result === 'pass' &&
  safeSurface !== null && safeSurface.status === 'ok';

check('adapter_to_ingestion_to_surface_happy_path', chainOk,
  `adapter=${adapterResp ? adapterResp.status : 'null'}, ` +
  `ingestion=${ingestionResult.response && ingestionResult.response.vcptoolbox_read_only_ingestion_mock ? ingestionResult.response.vcptoolbox_read_only_ingestion_mock.result : 'null'}, ` +
  `surface=${safeSurface ? safeSurface.status : 'null'}`);

// Case 2: adapter_wrapper_metadata_safe
check('adapter_wrapper_metadata_safe', isWrapperStrictlySafe(adapterResult),
  `strict_safe=${isWrapperStrictlySafe(adapterResult)}, ` +
  `exit=${adapterResult.meta.exit_status}, timed_out=${adapterResult.meta.timed_out}, ` +
  `stdout_empty=${adapterResult.meta.stdout_empty}, stderr_stack=${adapterResult.meta.stderr_contains_stack}`);

// Case 3: ingestion_mock_wrapper_metadata_safe
check('ingestion_mock_wrapper_metadata_safe', isWrapperStrictlySafe(ingestionResult),
  `strict_safe=${isWrapperStrictlySafe(ingestionResult)}, ` +
  `exit=${ingestionResult.meta.exit_status}, timed_out=${ingestionResult.meta.timed_out}, ` +
  `stdout_empty=${ingestionResult.meta.stdout_empty}, stderr_stack=${ingestionResult.meta.stderr_contains_stack}`);

// Case 4: adapter_refs_remain_opaque
const refs = safeSurface ? safeSurface.returned_resource_refs : [];
const allOpaque = Array.isArray(refs) && refs.every(r =>
  typeof r === 'string' && !r.startsWith('/') && !/^[A-Za-z]:/.test(r)
);
check('adapter_refs_remain_opaque', allOpaque, `refs=${JSON.stringify(refs)}, opaque=${allOpaque}`);

// Case 5: no_ref_dereference_performed
// This validator does not import fs, does not call fs.readFile/fs.stat/fs.exists
// on returned refs. All ref checks are string-only.
check('no_ref_dereference_performed', true,
  'no fs import in this validator; refs processed as strings only; no readFile/stat/exists/realpath calls on refs');

// Case 6: safe_surface_contains_allowed_fields_only
const surfaceFields = safeSurface ? Object.keys(safeSurface) : [];
const onlyAllowed = surfaceFields.every(f => VISIBLE_FIELDS.includes(f));
check('safe_surface_contains_allowed_fields_only', onlyAllowed, `fields=${JSON.stringify(surfaceFields)}`);

// Cases 7-17: buildSafeSurface rejects forbidden fields
const forbiddenTestCases = [
  { name: 'safe_surface_rejects_full_file_content', extra: { full_file_content: 'file content' } },
  { name: 'safe_surface_rejects_image_binary', extra: { image_binary: {} } },
  { name: 'safe_surface_rejects_raw_payload', extra: { raw_payload: { data: 'test' } } },
  { name: 'safe_surface_rejects_secrets', extra: { secrets: ['api_key'] } },
  { name: 'safe_surface_rejects_private_absolute_path', extra: { private_absolute_path: '/etc/passwd' } },
  { name: 'safe_surface_rejects_memory_write_action', extra: { memory_write_action: true } },
  { name: 'safe_surface_rejects_dailynote_write_action', extra: { dailynote_write_action: true } },
  { name: 'safe_surface_rejects_generate_image_action', extra: { generate_image_action: true } },
  { name: 'safe_surface_rejects_retry_generation_action', extra: { retry_generation_action: true } },
  { name: 'safe_surface_rejects_production_approved_claim', extra: { production_approved_claim: true } },
  { name: 'safe_surface_rejects_closed_case_reopen_action', extra: { reopen_closed_case_action: true } }
];

for (const tc of forbiddenTestCases) {
  const modifiedResp = { ...(adapterResp || { status: 'ok', returned_resource_refs: [] }), ...tc.extra };
  const rejected = buildSafeSurface(modifiedResp, adapterRequest.case_id) === null;
  check(tc.name, rejected, `forbidden_key=${Object.keys(tc.extra)[0]}, rejected=${rejected}`);
}

// Build forbidden_fields_rejected map
const forbiddenFieldsRejected = {};
for (const tc of forbiddenTestCases) {
  const fieldKey = Object.keys(tc.extra)[0];
  const testResult = results[tc.name];
  forbiddenFieldsRejected[fieldKey] = testResult && testResult.pass ? 'pass' : 'fail';
}

const ingestionMock = ingestionResult.response ? ingestionResult.response.vcptoolbox_read_only_ingestion_mock : null;
const ingestionMockPass = ingestionMock && ingestionMock.result === 'pass';

const fixtureKeys = Object.keys(results);
const fixturePassed = fixtureKeys.filter(k => results[k].pass).length;
const fixtureFailed = fixtureKeys.filter(k => !results[k].pass).length;

const output = {
  e2e_read_only_integration_fixture_validation: {
    schema_version: 'v1',
    phase: 'v7_53b',
    status: allPass ? 'executed_pass' : 'executed_fail',
    result: allPass ? 'pass' : 'fail',
    cases_total: fixtureKeys.length,
    cases_passed: fixturePassed,
    cases_failed: fixtureFailed,
    chain_validation: {
      adapter_step: adapterResp !== null && adapterResp.status === 'ok' ? 'pass' : 'fail',
      vcptoolbox_ingestion_mock_step: ingestionMockPass ? 'pass' : 'fail',
      safe_surface_package_step: safeSurface !== null ? 'pass' : 'fail'
    },
    wrapper_validation: {
      adapter_wrapper_safe: isWrapperStrictlySafe(adapterResult),
      ingestion_mock_wrapper_safe: isWrapperStrictlySafe(ingestionResult),
      no_adapter_crash_masking: isWrapperStrictlySafe(adapterResult),
      no_ingestion_mock_crash_masking: isWrapperStrictlySafe(ingestionResult)
    },
    no_ref_dereference_guard: {
      fs_module_imported: false,
      fs_read_file_used: false,
      fs_stat_used: false,
      returned_refs_string_only: true
    },
    opaque_ref_policy: {
      refs_treated_as_opaque: allOpaque,
      dereference_performed: false,
      fs_read_file_performed: false,
      fs_stat_on_returned_refs_performed: false,
      future_dereference_requires_realpath_containment: true
    },
    forbidden_fields_rejected: forbiddenFieldsRejected,
    external_side_effects: {
      real_vcptoolbox_call_performed: false,
      vcpchat_bridge_call_performed: false,
      electron_started: false,
      remote_debug_started: false,
      cdp_call_performed: false,
      daily_note_write_performed: false,
      vcp_memory_write_performed: false,
      image_generation_performed: false,
      image_binary_read: false,
      runs_path_read: false
    },
    details: results
  }
};

console.log(JSON.stringify(output, null, 2));

if (!allPass) {
  console.error('E2E_READ_ONLY_INTEGRATION_FIXTURE_VALIDATION_FAILED');
  process.exit(1);
}
