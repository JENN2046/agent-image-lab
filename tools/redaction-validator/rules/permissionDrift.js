// Permission Drift Rule — Skeleton
// Detects unauthorized permission status changes in boundary matrix entries.
// Read-only. No network. No CDP. No bridge. No MCP.

'use strict';

const CRITICAL_INVARIANTS = [
  {
    id: 'submitDraft_forbidden_permanent',
    action_id: 'vcpchat_submitDraft',
    expected_permission: 'forbidden_permanent',
    expected_allowed_now: false,
    message: 'submitDraft must remain permanently forbidden',
    severity: 'critical',
  },
  {
    id: 'production_candidate_forbidden_needs_auth',
    action_id: 'production_candidate_002',
    expected_permission: 'forbidden_needs_auth',
    expected_allowed_now: false,
    message: 'production_candidate_002 must remain forbidden_needs_auth',
    severity: 'high',
  },
  {
    id: 'memory_write_forbidden_needs_auth',
    action_id: null,
    key: 'memory_write_path_allowed_now',
    expected_value: false,
    message: 'memory_write_path must remain forbidden_needs_auth',
    severity: 'critical',
  },
  {
    id: 'no_standing_runtime_permission',
    action_id: null,
    check: 'no_entry_may_imply_standing_permission',
    message: 'No entry may imply standing runtime permission without authorization',
    severity: 'high',
  },
];

function checkPermissionDrift(matrixObject) {
  // matrixObject: parsed boundary matrix YAML content
  // Skeleton: expects entries array and non_permissions object
  const violations = [];

  if (!matrixObject || typeof matrixObject !== 'object') {
    return [{
      invariant: 'matrix_not_found',
      severity: 'critical',
      message: 'Boundary matrix object not provided or invalid',
    }];
  }

  const entries = matrixObject.entries || [];
  const nonPermissions = matrixObject.non_permissions || {};

  // Check submitDraft invariant
  const submitEntry = entries.find((e) => e.action_id === 'vcpchat_submitDraft');
  if (submitEntry) {
    if (submitEntry.permission_status !== 'forbidden_permanent') {
      violations.push({
        invariant: 'submitDraft_forbidden_permanent',
        severity: 'critical',
        actual: submitEntry.permission_status,
        expected: 'forbidden_permanent',
        message: 'submitDraft permission_status drifted from forbidden_permanent',
      });
    }
    if (submitEntry.allowed_now !== false) {
      violations.push({
        invariant: 'submitDraft_allowed_now',
        severity: 'critical',
        actual: submitEntry.allowed_now,
        expected: false,
        message: 'submitDraft allowed_now drifted from false',
      });
    }
  } else {
    violations.push({
      invariant: 'submitDraft_entry_missing',
      severity: 'critical',
      message: 'submitDraft entry not found in boundary matrix',
    });
  }

  // Check production_candidate_002 invariant
  const prodEntry = entries.find((e) => e.action_id === 'production_candidate_002');
  if (prodEntry) {
    if (prodEntry.allowed_now !== false) {
      violations.push({
        invariant: 'production_candidate_allowed_now',
        severity: 'high',
        actual: prodEntry.allowed_now,
        expected: false,
        message: 'production_candidate_002 allowed_now drifted from false',
      });
    }
    if (prodEntry.permission_status !== 'forbidden_needs_auth') {
      violations.push({
        invariant: 'production_candidate_permission_status',
        severity: 'high',
        actual: prodEntry.permission_status,
        expected: 'forbidden_needs_auth',
        message: 'production_candidate_002 permission_status drifted from forbidden_needs_auth',
      });
    }
  }

  // Check non_permissions block
  if (nonPermissions.memory_write_path_allowed_now !== false) {
    violations.push({
      invariant: 'memory_write_forbidden_needs_auth',
      severity: 'critical',
      actual: nonPermissions.memory_write_path_allowed_now,
      expected: false,
      message: 'memory_write_path_allowed_now drifted from false',
    });
  }

  if (nonPermissions.submitDraft_invocation_allowed !== false) {
    violations.push({
      invariant: 'submitDraft_invocation_allowed',
      severity: 'critical',
      actual: nonPermissions.submitDraft_invocation_allowed,
      expected: false,
      message: 'submitDraft_invocation_allowed drifted from false',
    });
  }

  // Check no_standing_runtime_permission invariant
  for (const entry of entries) {
    if (entry.allowed_now === true) {
      violations.push({
        invariant: 'no_standing_runtime_permission',
        severity: 'high',
        action_id: entry.action_id || '(unnamed)',
        message: 'Entry with allowed_now=true implies standing runtime permission without authorization',
      });
    }
  }

  return violations;
}

module.exports = {
  CRITICAL_INVARIANTS,
  checkPermissionDrift,
};
