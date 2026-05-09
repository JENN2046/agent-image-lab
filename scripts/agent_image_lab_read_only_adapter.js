#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');

const EVIDENCE_MAP = {
  project_state: [
    'README.md',
    '.agent_board/CHECKPOINT.md'
  ],
  bridge_contracts: [
    'docs/v7_50_vcp_read_only_bridge_contract.md',
    'docs/v7_50_vcp_read_only_bridge_security_gates.md',
    'docs/v7_49_vcp_memory_write_boundary_spec.md'
  ],
  dry_run_results: [
    'docs/v7_50a_vcp_read_only_bridge_local_schema_validation_result.yaml',
    'docs/v7_50b_vcp_read_only_bridge_mock_payload_validation_result.yaml',
    'docs/v7_50c_vcp_read_only_bridge_dry_run_execution_result.yaml'
  ],
  vcpchat_surface: [
    'docs/v7_50d_vcpchat_review_console_surface_static_fixture_result.yaml',
    'docs/v7_50e_real_vcpchat_surface_check_planning.md'
  ],
  production_candidate_001: [
    'production/reviews/v7_53_french_summer_rattan_bag_v3_production_candidate_001_review.md',
    'production/closeouts/v7_56_french_summer_rattan_bag_v3_production_candidate_001_memory_write_skip_closeout.md'
  ]
};

const CANONICAL_SMOKE_REQUEST = {
  schema_version: 'v1',
  request_id: 'local_adapter_smoke_001',
  bridge_mode: 'read_only',
  payload_type: 'text_only_refs',
  case_id: 'french_summer_rattan_bag_v3_production_candidate_001',
  requested_resources: [
    'project_state',
    'bridge_contracts',
    'dry_run_results',
    'production_candidate_001'
  ],
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

function checkHardBlockers(req) {
  const reasons = [];

  if (req.bridge_mode !== 'read_only') reasons.push('bridge_mode_not_read_only');
  if (req.payload_type !== 'text_only_refs') reasons.push('payload_type_not_text_only_refs');
  if (req.write_intent === true) reasons.push('write_intent_detected');
  if (req.image_binary_requested === true) reasons.push('image_binary_requested');
  if (req.secrets_requested === true) reasons.push('secret_requested');
  if (req.raw_payload_requested === true) reasons.push('raw_payload_requested');
  if (req.private_absolute_path_requested === true) reasons.push('private_absolute_path_requested');
  if (req.memory_write_requested === true) reasons.push('memory_write_attempted');
  if (req.dailynote_write_requested === true) reasons.push('dailynote_write_attempted');
  if (req.production_approved_claim_requested === true) reasons.push('production_approved_claim_detected');
  if (req.reopen_closed_case_requested === true) reasons.push('closed_case_reopen_attempted');

  return reasons;
}

function resolveRefs(requestedResources) {
  const refs = [];
  const seen = new Set();

  if (!Array.isArray(requestedResources) || requestedResources.length === 0) {
    return refs;
  }

  requestedResources.forEach(category => {
    const files = EVIDENCE_MAP[category];
    if (files) {
      files.forEach(f => {
        if (!seen.has(f)) {
          refs.push(f);
          seen.add(f);
        }
      });
    }
  });

  return refs;
}

function fileExistsOnDisk(ref) {
  const fullPath = path.join(REPO_ROOT, ref);
  try {
    return fs.statSync(fullPath).isFile();
  } catch {
    return false;
  }
}

function processRequest(req) {
  const blockedReasons = checkHardBlockers(req);

  if (blockedReasons.length > 0) {
    return {
      schema_version: 'v1',
      adapter_phase: 'v7_51d',
      adapter_runtime: 'agent_image_lab_read_only_adapter',
      status: 'blocked',
      payload_type: 'text_only_refs',
      returned_refs_only: true,
      case_id: req.case_id || '',
      current_case_state: 'closed_no_memory_write',
      blocked_reasons: blockedReasons,
      returned_resource_refs: [],
      external_side_effects: {
        vcp_call_performed: false,
        vcpchat_bridge_call_performed: false,
        electron_started: false,
        remote_debug_started: false,
        cdp_call_performed: false,
        daily_note_write_performed: false,
        vcp_memory_write_performed: false,
        image_generation_performed: false,
        image_binary_read: false,
        runs_path_read: false
      }
    };
  }

  if (req.case_id && req.case_id !== 'french_summer_rattan_bag_v3_production_candidate_001') {
    return {
      schema_version: 'v1',
      adapter_phase: 'v7_51d',
      adapter_runtime: 'agent_image_lab_read_only_adapter',
      status: 'not_found',
      payload_type: 'text_only_refs',
      returned_refs_only: true,
      case_id: req.case_id,
      current_case_state: 'closed_no_memory_write',
      blocked_reasons: [],
      error_message: 'Requested case_id is not available in read-only evidence index.',
      returned_resource_refs: [],
      external_side_effects: {
        vcp_call_performed: false,
        vcpchat_bridge_call_performed: false,
        electron_started: false,
        remote_debug_started: false,
        cdp_call_performed: false,
        daily_note_write_performed: false,
        vcp_memory_write_performed: false,
        image_generation_performed: false,
        image_binary_read: false,
        runs_path_read: false
      }
    };
  }

  const resolvedRefs = resolveRefs(req.requested_resources);
  const existingRefs = resolvedRefs.filter(ref => fileExistsOnDisk(ref));

  return {
    schema_version: 'v1',
    adapter_phase: 'v7_51d',
    adapter_runtime: 'agent_image_lab_read_only_adapter',
    status: existingRefs.length > 0 ? 'ok' : 'not_found',
    payload_type: 'text_only_refs',
    returned_refs_only: true,
    case_id: req.case_id || '',
    current_case_state: 'closed_no_memory_write',
    returned_resource_refs: existingRefs,
    external_side_effects: {
      vcp_call_performed: false,
      vcpchat_bridge_call_performed: false,
      electron_started: false,
      remote_debug_started: false,
      cdp_call_performed: false,
      daily_note_write_performed: false,
      vcp_memory_write_performed: false,
      image_generation_performed: false,
      image_binary_read: false,
      runs_path_read: false
    }
  };
}

function main() {
  let request;

  const args = process.argv.slice(2);
  if (args.length > 0 && args[0] === '--request-json' && args[1]) {
    try {
      request = JSON.parse(args[1]);
    } catch (e) {
      console.error('Invalid JSON in --request-json argument');
      process.exit(1);
    }
  } else {
    request = CANONICAL_SMOKE_REQUEST;
  }

  const response = processRequest(request);
  console.log(JSON.stringify(response, null, 2));

  if (response.status === 'failed') {
    process.exit(1);
  }
}

main();
