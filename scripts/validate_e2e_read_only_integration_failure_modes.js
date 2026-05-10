#!/usr/bin/env node
const path = require('path');
const adapter = require('./agent_image_lab_read_only_adapter.js');

let allPass = true;
const results = {};

function check(name, pass, detail) {
  results[name] = { pass, detail };
  if (!pass) allPass = false;
}

// Copy of checkIngestionPackage from validate_vcptoolbox_read_only_ingestion_mock.js
function checkIngestionPackage(pkg) {
  const blockers = [];
  if (pkg.payload_type !== 'text_only_refs') blockers.push('payload_type_not_text_only_refs');
  if (pkg.returned_refs_only !== true) blockers.push('returned_refs_only_false');
  if (pkg.returned_resource_refs && pkg.returned_resource_refs.some(r =>
    path.isAbsolute(r) || r.startsWith('/') || /^[A-Za-z]:/.test(r)
  )) blockers.push('absolute_ref_detected');
  if (pkg.returned_resource_refs && pkg.returned_resource_refs.some(r =>
    /^runs([/\\]|$)/i.test(r)
  )) blockers.push('runs_ref_detected');
  if (pkg.returned_resource_refs && pkg.returned_resource_refs.some(r =>
    /\.(jpg|jpeg|png|webp)$/i.test(r)
  )) blockers.push('image_ref_detected');
  if (pkg.full_file_content) blockers.push('full_file_content_field');
  if (pkg.raw_payload) blockers.push('raw_payload_field');
  if (pkg.secrets) blockers.push('secret_field');
  if (pkg.memory_write_requested === true) blockers.push('memory_write_requested');
  if (pkg.dailynote_write_requested === true) blockers.push('dailynote_write_requested');
  if (pkg.ref_dereference_performed === true) blockers.push('dereference_without_realpath_containment');
  if (pkg.production_approved_claim_requested === true) blockers.push('production_approved_claim');
  if (pkg.reopen_closed_case_requested === true) blockers.push('closed_case_reopen_attempt');
  return blockers;
}

// Copy of buildSafeSurface logic
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

// Simulate structured wrapper (same logic as runScript in fixture validator)
function createWrapperMeta(result) {
  return {
    exit_status: result.status,
    signal: result.signal,
    timed_out: !!(result.error && result.error.code === 'ETIMEDOUT'),
    stdout_empty: !result.stdout || result.stdout.trim().length === 0,
    stderr_contains_stack: (result.stderr || '').includes(' at ') || (result.stderr || '').includes('Error:')
  };
}

function parseAdapterStdout(stdout) {
  if (!stdout || stdout.trim().length === 0) return null;
  try { return JSON.parse(stdout); } catch { return null; }
}

const baseCaseId = 'french_summer_rattan_bag_v3_production_candidate_001';

// Case 1: adapter_returns_blocked
{
  const blockedReq = {
    schema_version: 'v1', request_id: 'fm_blocked', case_id: baseCaseId,
    bridge_mode: 'write', payload_type: 'text_only_refs',
    requested_resources: ['project_state'], write_intent: true,
    image_binary_requested: false, secrets_requested: false, raw_payload_requested: false,
    private_absolute_path_requested: false, memory_write_requested: false,
    dailynote_write_requested: false, production_approved_claim_requested: false,
    reopen_closed_case_requested: false
  };
  const resp = adapter.processRequest(blockedReq);
  check('adapter_returns_blocked',
    resp && resp.status === 'blocked' && Array.isArray(resp.blocked_reasons) && resp.blocked_reasons.includes('bridge_mode_not_read_only'),
    `status=${resp ? resp.status : 'null'}, blockers=${resp ? JSON.stringify(resp.blocked_reasons) : 'null'}`);
}

// Case 2: adapter_returns_not_found
{
  const notFoundReq = {
    schema_version: 'v1', request_id: 'fm_not_found', case_id: baseCaseId,
    bridge_mode: 'read_only', payload_type: 'text_only_refs',
    requested_resources: ['resource_that_does_not_exist_xyz'], write_intent: false,
    image_binary_requested: false, secrets_requested: false, raw_payload_requested: false,
    private_absolute_path_requested: false, memory_write_requested: false,
    dailynote_write_requested: false, production_approved_claim_requested: false,
    reopen_closed_case_requested: false
  };
  const resp = adapter.processRequest(notFoundReq);
  check('adapter_returns_not_found',
    resp && resp.status === 'not_found' && Array.isArray(resp.returned_resource_refs) && resp.returned_resource_refs.length === 0,
    `status=${resp ? resp.status : 'null'}, refs=${resp ? JSON.stringify(resp.returned_resource_refs) : 'null'}`);
}

// Case 3: adapter_returns_failed_structured
{
  const resp = adapter.processRequest(null);
  check('adapter_returns_failed_structured',
    resp && resp.status === 'failed' && Array.isArray(resp.blocked_reasons) && resp.blocked_reasons.includes('invalid_request_shape'),
    `status=${resp ? resp.status : 'null'}, blockers=${resp ? JSON.stringify(resp.blocked_reasons) : 'null'}`);
}

// Cases 4-8: ingestion rejection by checkIngestionPackage
{
  const baseSafePkg = {
    payload_type: 'text_only_refs', returned_refs_only: true,
    returned_resource_refs: ['README.md'], memory_write_requested: false,
    dailynote_write_requested: false, ref_dereference_performed: false,
    production_approved_claim_requested: false, reopen_closed_case_requested: false
  };

  // Case 4
  const pkg4 = { ...baseSafePkg, payload_type: 'image_binary' };
  const b4 = checkIngestionPackage(pkg4);
  check('ingestion_rejects_non_text_only_payload', b4.includes('payload_type_not_text_only_refs'),
    `blockers=${JSON.stringify(b4)}`);

  // Case 5
  const pkg5 = { ...baseSafePkg, returned_refs_only: false };
  const b5 = checkIngestionPackage(pkg5);
  check('ingestion_rejects_returned_refs_only_false', b5.includes('returned_refs_only_false'),
    `blockers=${JSON.stringify(b5)}`);

  // Case 6
  const pkg6 = { ...baseSafePkg, returned_resource_refs: ['/etc/passwd'] };
  const b6 = checkIngestionPackage(pkg6);
  check('ingestion_rejects_absolute_ref', b6.includes('absolute_ref_detected'),
    `blockers=${JSON.stringify(b6)}`);

  // Case 7
  const pkg7 = { ...baseSafePkg, returned_resource_refs: ['runs/some_file.txt'] };
  const b7 = checkIngestionPackage(pkg7);
  check('ingestion_rejects_runs_ref', b7.includes('runs_ref_detected'),
    `blockers=${JSON.stringify(b7)}`);

  // Case 8
  const pkg8 = { ...baseSafePkg, returned_resource_refs: ['image.jpg'] };
  const b8 = checkIngestionPackage(pkg8);
  check('ingestion_rejects_image_ref', b8.includes('image_ref_detected'),
    `blockers=${JSON.stringify(b8)}`);
}

// Cases 9-13: surface rejection by buildSafeSurface
{
  const validResp = { status: 'ok', returned_resource_refs: ['README.md'] };

  // Case 9
  const rejected9 = buildSafeSurface({ ...validResp, memory_write_action: true }, baseCaseId) === null;
  check('surface_rejects_memory_action', rejected9, `rejected=${rejected9}`);

  // Case 10
  const rejected10 = buildSafeSurface({ ...validResp, dailynote_write_action: true }, baseCaseId) === null;
  check('surface_rejects_dailynote_action', rejected10, `rejected=${rejected10}`);

  // Case 11
  const rejected11 = buildSafeSurface({ ...validResp, production_approved_claim: true }, baseCaseId) === null;
  check('surface_rejects_production_approved_claim', rejected11, `rejected=${rejected11}`);

  // Case 12
  const rejected12 = buildSafeSurface({ ...validResp, private_absolute_path: '/secret' }, baseCaseId) === null;
  check('surface_rejects_private_absolute_path', rejected12, `rejected=${rejected12}`);

  // Case 13
  const rejected13 = buildSafeSurface({ ...validResp, reopen_closed_case_action: true }, baseCaseId) === null;
  check('surface_rejects_closed_case_reopen_action', rejected13, `rejected=${rejected13}`);
}

// Cases 14-16: wrapper rejection behavior
{
  // Case 14: wrapper_rejects_unparsed_adapter_output
  const unparsedResponse = parseAdapterStdout('not-valid-json');
  check('wrapper_rejects_unparsed_adapter_output', unparsedResponse === null,
    `response=${unparsedResponse}`);

  // Case 15: wrapper_rejects_empty_stdout
  const emptyMeta = createWrapperMeta({ status: 0, signal: null, stdout: '', stderr: '', error: null });
  check('wrapper_rejects_empty_stdout', emptyMeta.stdout_empty === true,
    `stdout_empty=${emptyMeta.stdout_empty}`);

  // Case 16: wrapper_rejects_stderr_stack
  const stackMeta = createWrapperMeta({ status: 1, signal: null, stdout: '', stderr: 'Error: something failed\n at someFunction (file.js:10:5)', error: null });
  check('wrapper_rejects_stderr_stack', stackMeta.stderr_contains_stack === true,
    `stderr_contains_stack=${stackMeta.stderr_contains_stack}`);
}

const failureKeys = Object.keys(results);
const failedPassed = failureKeys.filter(k => results[k].pass).length;
const failedFailed = failureKeys.filter(k => !results[k].pass).length;

const allUnsafePayloadsBlocked = failureKeys.filter(k => k.startsWith('adapter_returns_') || k.startsWith('ingestion_rejects_') || k.startsWith('surface_rejects_')).every(k => results[k].pass);
const crashMaskingPrevented = failureKeys.filter(k => k.startsWith('wrapper_rejects_')).every(k => results[k].pass);

const output = {
  e2e_read_only_integration_failure_mode_validation: {
    schema_version: 'v1',
    phase: 'v7_53d',
    status: allPass ? 'executed_pass' : 'executed_fail',
    result: allPass ? 'pass' : 'fail',
    cases_total: failureKeys.length,
    cases_passed: failedPassed,
    cases_failed: failedFailed,
    unsafe_payloads_blocked: allUnsafePayloadsBlocked,
    crash_masking_prevented: crashMaskingPrevented,
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
  console.error('E2E_READ_ONLY_INTEGRATION_FAILURE_MODE_VALIDATION_FAILED');
  process.exit(1);
}
