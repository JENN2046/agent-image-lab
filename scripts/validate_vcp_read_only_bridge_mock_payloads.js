#!/usr/bin/env node
// validate_vcp_read_only_bridge_mock_payloads.js
// v7.50b VCP Read-only Bridge Mock Payload Validation
// Hand-written mock payloads only. No VCP call. No bridge call. No image read.

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

// ---------------------------------------------------------------------------
// Read reference files
// ---------------------------------------------------------------------------
const files = {
  contract: readFile('docs/v7_50_vcp_read_only_bridge_contract.md'),
  securityGates: readFile('docs/v7_50_vcp_read_only_bridge_security_gates.md'),
  planning: readFile('docs/v7_50b_vcp_read_only_bridge_mock_payload_validation_planning.md'),
  casesYaml: readFile('docs/v7_50ab_vcp_read_only_bridge_validation_cases.yaml'),
};

for (const [key, content] of Object.entries(files)) {
  if (content === null) {
    console.log(JSON.stringify({ passed: false, error: `Cannot read ${key}` }, null, 2));
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Mock payloads
// ---------------------------------------------------------------------------
const passRequest = {
  schema_version: 'v1',
  request_id: 'mock_valid_001',
  requested_by: 'human_operator',
  bridge_mode: 'read_only',
  case_id: 'french_summer_rattan_bag_v3_production_candidate_001',
  requested_resources: ['project_state', 'case_summary_candidate', 'production_readiness',
    'review_checklist', 'a5_template', 'memory_boundary'],
  write_intent: false,
  image_binary_requested: false,
  secrets_requested: false,
};

const passResponse = {
  status: 'ok',
  payload_type: 'text_only_refs',
  image_binary_included: false,
  secrets_included: false,
  write_performed: false,
  memory_write_performed: false,
  daily_note_write_performed: false,
};

// --- Blocked case helpers ---
function makeRequest(overrides) {
  return { ...passRequest, ...overrides };
}

// ---------------------------------------------------------------------------
// Validation logic
// ---------------------------------------------------------------------------
function validatePass(req, resp) {
  if (req.bridge_mode !== 'read_only') return { pass: false, reason: 'bridge_mode_not_read_only' };
  if (req.write_intent !== false) return { pass: false, reason: 'write_intent_true' };
  if (req.image_binary_requested !== false) return { pass: false, reason: 'image_binary_requested_true' };
  if (req.secrets_requested !== false) return { pass: false, reason: 'secrets_requested_true' };
  if (resp.payload_type !== 'text_only_refs') return { pass: false, reason: 'payload_type_not_text_only_refs' };
  if (resp.write_performed !== false) return { pass: false, reason: 'write_performed_true' };
  if (resp.memory_write_performed !== false) return { pass: false, reason: 'memory_write_performed_true' };
  if (resp.daily_note_write_performed !== false) return { pass: false, reason: 'daily_note_write_performed_true' };
  return { pass: true, reason: 'none' };
}

function validateBlocked(req, blockerId) {
  // A case is "blocked" if it triggers at least one blocker
  const blockers = [];
  if (req.bridge_mode !== 'read_only') blockers.push('bridge_mode_not_read_only');
  if (req.write_intent === true) blockers.push('write_intent_true');
  if (req.image_binary_requested === true) blockers.push('image_binary_requested_true');
  if (req.secrets_requested === true) blockers.push('secrets_requested_true');
  if (req._raw_payload_requested) blockers.push('raw_payload_requested');
  if (req._private_absolute_path_requested) blockers.push('private_absolute_path_requested');
  if (req._memory_write_requested) blockers.push('memory_write_attempted');
  if (req._dailynote_write_requested) blockers.push('dailynote_write_attempted');
  if (req._production_approved_requested) blockers.push('production_approved_requested_from_stable_candidate_only');

  if (blockers.length > 0) {
    return { pass: true, reason: blockers[0] };
  }
  return { pass: false, reason: 'no_blocker_triggered' };
}

// ---------------------------------------------------------------------------
// Define mock cases
// ---------------------------------------------------------------------------
const cases = [
  {
    case_id: 'valid_text_only_case_summary_request',
    expected: 'pass',
    req: passRequest,
    resp: passResponse,
    validate: () => validatePass(passRequest, passResponse),
  },
  {
    case_id: 'request_image_binary',
    expected: 'blocked',
    req: makeRequest({ image_binary_requested: true, _image_binary_flag: true }),
    validate: () => validateBlocked(makeRequest({ image_binary_requested: true }), 'image_binary_requested_true'),
  },
  {
    case_id: 'request_memory_write',
    expected: 'blocked',
    req: makeRequest({ _memory_write_requested: true }),
    validate: () => validateBlocked(makeRequest({ _memory_write_requested: true }), 'memory_write_attempted'),
  },
  {
    case_id: 'request_dailynote_write',
    expected: 'blocked',
    req: makeRequest({ _dailynote_write_requested: true }),
    validate: () => validateBlocked(makeRequest({ _dailynote_write_requested: true }), 'dailynote_write_attempted'),
  },
  {
    case_id: 'request_raw_api_payload',
    expected: 'blocked',
    req: makeRequest({ _raw_payload_requested: true }),
    validate: () => validateBlocked(makeRequest({ _raw_payload_requested: true }), 'raw_payload_requested'),
  },
  {
    case_id: 'request_private_absolute_path',
    expected: 'blocked',
    req: makeRequest({ _private_absolute_path_requested: true }),
    validate: () => validateBlocked(makeRequest({ _private_absolute_path_requested: true }), 'private_absolute_path_requested'),
  },
  {
    case_id: 'request_production_approved_from_stable_candidate_only',
    expected: 'blocked',
    req: makeRequest({ _production_approved_requested: true }),
    validate: () => validateBlocked(makeRequest({ _production_approved_requested: true }), 'production_approved_requested_from_stable_candidate_only'),
  },
];

// ---------------------------------------------------------------------------
// Execute
// ---------------------------------------------------------------------------
const results = [];
let allPass = true;

for (const c of cases) {
  const result = c.validate();
  const passed = (c.expected === 'pass' && result.pass) || (c.expected === 'blocked' && result.pass);
  if (!passed) allPass = false;

  results.push({
    case_id: c.case_id,
    expected_result: c.expected,
    actual_result: result.pass ? (c.expected === 'pass' ? 'pass' : 'blocked') : 'unexpected',
    passed,
    block_reason: result.reason,
  });
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const output = {
  passed: allPass,
  validator: 'scripts/validate_vcp_read_only_bridge_mock_payloads.js',
  mock_execution_performed: true,
  results,
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
