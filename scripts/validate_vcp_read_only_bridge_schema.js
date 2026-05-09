#!/usr/bin/env node
// validate_vcp_read_only_bridge_schema.js
// v7.50a VCP Read-only Bridge Local Schema Validation
// Reads only docs/ README and .agent_board files. No VCP call. No bridge call. No image read.

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

function checkInText(text, patterns) {
  const results = {};
  for (const [key, pattern] of Object.entries(patterns)) {
    results[key] = text.includes(pattern);
  }
  return results;
}

function containsAll(text, items) {
  return items.every(item => text.includes(item));
}

function containsNone(text, items) {
  return items.every(item => !text.includes(item));
}

// ---------------------------------------------------------------------------
// Read reference files
// ---------------------------------------------------------------------------
const files = {
  readme: readFile('README.md'),
  checkpoint: readFile('.agent_board/CHECKPOINT.md'),
  contract: readFile('docs/v7_50_vcp_read_only_bridge_contract.md'),
  securityGates: readFile('docs/v7_50_vcp_read_only_bridge_security_gates.md'),
  planning: readFile('docs/v7_50a_vcp_read_only_bridge_local_schema_validation_planning.md'),
  casesYaml: readFile('docs/v7_50ab_vcp_read_only_bridge_validation_cases.yaml'),
};

// Check all files were read
for (const [key, content] of Object.entries(files)) {
  if (content === null) {
    console.log(JSON.stringify({ passed: false, error: `Cannot read ${key}` }, null, 2));
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------
const results = {};
let allPass = true;
function check(name, ok, detail) {
  results[name] = ok ? 'pass' : 'fail';
  if (!ok) allPass = false;
}

// --- Contract forbidden section present (contract must define, not avoid, forbidden items) ---
check('contract_forbidden_section_present',
  files.contract.includes('Forbidden Read Resources') &&
  files.contract.includes('runs/') &&
  files.contract.includes('jpg') &&
  files.contract.includes('jpeg') &&
  files.contract.includes('png') &&
  files.contract.includes('secrets'),
  { note: 'contract must define forbidden items in its Forbidden Read Resources section' });

// 1. Request schema required fields
const reqFields = ['schema_version', 'request_id', 'requested_by', 'bridge_mode', 'case_id',
  'requested_resources', 'write_intent', 'image_binary_requested', 'secrets_requested'];
check('request_schema_required_fields',
  containsAll(files.planning, reqFields),
  { required: reqFields });

// 2. Request constraints
check('request_constraints',
  files.planning.includes('bridge_mode: read_only') &&
  files.planning.includes('write_intent: false') &&
  files.planning.includes('image_binary_requested: false') &&
  files.planning.includes('secrets_requested: false') &&
  files.planning.includes('- VCPChat') &&
  files.planning.includes('- VCPToolBox') &&
  files.planning.includes('- human_operator'),
  { constraint: 'bridge_mode=read_only, write_intent=false, image_binary=false, secrets=false, requested_by=[VCPChat,VCPToolBox,human_operator]' });

// 3. Response schema required fields
const respFields = ['schema_version', 'request_id', 'bridge_mode', 'source_repo', 'case_id',
  'status', 'returned_resources', 'payload_type', 'image_binary_included', 'secrets_included',
  'write_performed', 'memory_write_performed', 'daily_note_write_performed'];
check('response_schema_required_fields',
  containsAll(files.planning, respFields),
  { required: respFields });

// 4. Response constraints
check('response_constraints',
  files.planning.includes('bridge_mode: read_only') &&
  files.planning.includes('source_repo: JENN2046/agent-image-lab') &&
  files.planning.includes('ok') &&
  files.planning.includes('blocked') &&
  files.planning.includes('not_found') &&
  files.planning.includes('payload_type: text_only_refs') &&
  files.planning.includes('image_binary_included: false') &&
  files.planning.includes('secrets_included: false') &&
  files.planning.includes('write_performed: false') &&
  files.planning.includes('memory_write_performed: false') &&
  files.planning.includes('daily_note_write_performed: false'),
  { constraint: 'bridge_mode=read_only, source_repo=JENN2046/agent-image-lab, status=[ok,blocked,not_found], payload_type=text_only_refs, all booleans=false' });

// 5. Blockers defined
const blockers = ['missing_required_field', 'bridge_mode_not_read_only', 'write_intent_true',
  'image_binary_requested_true', 'secrets_requested_true', 'payload_type_not_text_only_refs',
  'write_performed_true', 'memory_write_performed_true', 'daily_note_write_performed_true',
  'source_repo_mismatch'];
check('blockers_defined',
  containsAll(files.planning, blockers),
  { blockers });

// 6. Security gates defined
const securityGates = ['bridge_mode_must_be_read_only', 'write_intent_must_be_false',
  'image_binary_must_be_excluded', 'secrets_must_be_excluded',
  'raw_request_response_must_be_excluded', 'repo_mutation_must_be_blocked',
  'memory_write_must_be_blocked', 'daily_note_write_must_be_blocked',
  'vcp_call_must_require_independent_a5', 'vcp_private_path_access_must_be_blocked'];
check('security_gates_defined',
  containsAll(files.securityGates, securityGates),
  { gates: securityGates });

// 7. Validation cases YAML consistency
const casesContent = files.casesYaml;
check('validation_cases_yaml_consistency',
  casesContent.includes('execution_status: planning_only') &&
  casesContent.includes('real_validation_performed: false') &&
  casesContent.includes('mock_execution_performed: false') &&
  casesContent.includes('vcp_call_performed: false') &&
  casesContent.includes('bridge_call_performed: false'),
  { expected: 'planning_only, all performed=false' });

// 8. Mock cases presence
const mockCases = ['valid_text_only_case_summary_request', 'request_image_binary',
  'request_memory_write', 'request_dailynote_write', 'request_raw_api_payload',
  'request_private_absolute_path', 'request_production_approved_from_stable_candidate_only'];
check('mock_cases_presence_checked',
  containsAll(casesContent, mockCases),
  { cases: mockCases });

// ---------------------------------------------------------------------------
// Additional: security gates also require hard blockers
// ---------------------------------------------------------------------------
const hardBlockers = ['write_intent_detected', 'image_binary_requested', 'secret_requested',
  'raw_payload_requested', 'run_directory_requested', 'private_absolute_path_requested',
  'memory_write_attempted', 'dailynote_write_attempted', 'vcp_call_without_a5',
  'bridge_mode_not_read_only'];
check('hard_blockers_defined',
  containsAll(files.securityGates, hardBlockers),
  { blockers: hardBlockers });

// ---------------------------------------------------------------------------
// Contract schema consistency
// ---------------------------------------------------------------------------
check('contract_request_schema',
  containsAll(files.contract, reqFields),
  { required: reqFields });

check('contract_response_schema',
  containsAll(files.contract, respFields),
  { required: respFields });

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const output = {
  passed: allPass,
  validator: 'scripts/validate_vcp_read_only_bridge_schema.js',
  checks: results,
  mock_executed: false,
  vcp_call_performed: false,
  bridge_call_performed: false,
  daily_note_write_performed: false,
  vcp_memory_write_performed: false,
  image_generation_performed: false,
  image_binary_read: false,
  runs_path_read: false,
};

console.log(JSON.stringify(output, null, 2));

if (!allPass) {
  process.exit(1);
}
