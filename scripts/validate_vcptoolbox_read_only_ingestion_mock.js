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

function callAdapter(requestJson) {
  const arg = JSON.stringify(requestJson);
  const result = spawnSync('node', [ADAPTER_SCRIPT, '--request-json', arg], {
    encoding: 'utf-8', timeout: 5000, maxBuffer: 1024 * 1024
  });
  const stdout = (result.stdout || '').trim();
  try {
    return JSON.parse(stdout);
  } catch (e) {
    return null;
  }
}

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

// Build valid ingestion package from real adapter call
const validResp = callAdapter({
  schema_version: 'v1',
  request_id: 'mock_ingestion_valid',
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
});

const refsTreatedAsOpaque = true;

// Case 1: valid_adapter_response_as_opaque_refs
{
  const blockers = checkIngestionPackage(validResp);
  check('valid_adapter_response_as_opaque_refs',
    validResp && validResp.status === 'ok' && blockers.length === 0,
    `status=${validResp ? validResp.status : 'null'}, blockers=${JSON.stringify(blockers)}`);
}

// Build a base safe package for synthetic cases
const baseSafePkg = {
  payload_type: 'text_only_refs',
  returned_refs_only: true,
  returned_resource_refs: ['README.md', 'docs/00_project_roadmap.md'],
  memory_write_requested: false,
  dailynote_write_requested: false,
  ref_dereference_performed: false,
  production_approved_claim_requested: false,
  reopen_closed_case_requested: false
};

// Case 2: reject_payload_type_not_text_only_refs
{
  const pkg = { ...baseSafePkg, payload_type: 'image_binary' };
  const blockers = checkIngestionPackage(pkg);
  check('reject_payload_type_not_text_only_refs', blockers.includes('payload_type_not_text_only_refs'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 3: reject_returned_refs_only_false
{
  const pkg = { ...baseSafePkg, returned_refs_only: false };
  const blockers = checkIngestionPackage(pkg);
  check('reject_returned_refs_only_false', blockers.includes('returned_refs_only_false'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 4: reject_absolute_ref
{
  const pkg = { ...baseSafePkg, returned_resource_refs: ['/etc/passwd'] };
  const blockers = checkIngestionPackage(pkg);
  check('reject_absolute_ref', blockers.includes('absolute_ref_detected'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 5: reject_runs_ref
{
  const pkg = { ...baseSafePkg, returned_resource_refs: ['runs/some_file.txt'] };
  const blockers = checkIngestionPackage(pkg);
  check('reject_runs_ref', blockers.includes('runs_ref_detected'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 6: reject_image_ref
{
  const pkg = { ...baseSafePkg, returned_resource_refs: ['image.jpg'] };
  const blockers = checkIngestionPackage(pkg);
  check('reject_image_ref', blockers.includes('image_ref_detected'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 7: reject_full_file_content_field
{
  const pkg = { ...baseSafePkg, full_file_content: 'file content string' };
  const blockers = checkIngestionPackage(pkg);
  check('reject_full_file_content_field', blockers.includes('full_file_content_field'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 8: reject_raw_payload_field
{
  const pkg = { ...baseSafePkg, raw_payload: { some: 'data' } };
  const blockers = checkIngestionPackage(pkg);
  check('reject_raw_payload_field', blockers.includes('raw_payload_field'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 9: reject_secret_field
{
  const pkg = { ...baseSafePkg, secrets: ['api_key'] };
  const blockers = checkIngestionPackage(pkg);
  check('reject_secret_field', blockers.includes('secret_field'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 10: reject_memory_write_requested
{
  const pkg = { ...baseSafePkg, memory_write_requested: true };
  const blockers = checkIngestionPackage(pkg);
  check('reject_memory_write_requested', blockers.includes('memory_write_requested'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 11: reject_dailynote_write_requested
{
  const pkg = { ...baseSafePkg, dailynote_write_requested: true };
  const blockers = checkIngestionPackage(pkg);
  check('reject_dailynote_write_requested', blockers.includes('dailynote_write_requested'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 12: reject_dereference_without_realpath_containment
{
  const pkg = { ...baseSafePkg, ref_dereference_performed: true };
  const blockers = checkIngestionPackage(pkg);
  check('reject_dereference_without_realpath_containment', blockers.includes('dereference_without_realpath_containment'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 13: reject_production_approved_claim
{
  const pkg = { ...baseSafePkg, production_approved_claim_requested: true };
  const blockers = checkIngestionPackage(pkg);
  check('reject_production_approved_claim', blockers.includes('production_approved_claim'),
    `blockers=${JSON.stringify(blockers)}`);
}

// Case 14: reject_closed_case_reopen_attempt
{
  const pkg = { ...baseSafePkg, reopen_closed_case_requested: true };
  const blockers = checkIngestionPackage(pkg);
  check('reject_closed_case_reopen_attempt', blockers.includes('closed_case_reopen_attempt'),
    `blockers=${JSON.stringify(blockers)}`);
}

const totalChecks = Object.keys(results).length;
const passedChecks = Object.values(results).filter(r => r.pass).length;
const failedChecks = totalChecks - passedChecks;

const output = {
  vcptoolbox_read_only_ingestion_mock: {
    phase: 'v7_52d',
    execution_status: 'executed',
    result: allPass ? 'pass' : 'fail',
    cases_total: totalChecks,
    cases_passed: passedChecks,
    cases_failed: failedChecks,
    refs_treated_as_opaque: refsTreatedAsOpaque,
    dereference_performed: false,
    realpath_containment_required_for_future_dereference: true,
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
  console.error('VCPTOOLBOX_READ_ONLY_INGESTION_MOCK_FAILED');
  process.exit(1);
}
