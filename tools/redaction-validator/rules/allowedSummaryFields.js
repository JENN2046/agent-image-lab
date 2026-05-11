// Allowed Summary Fields Rule — Skeleton
// Verifies that reported fields are in the allowed summary allowlist.
// Read-only. No network. No CDP. No bridge. No MCP.

'use strict';

const ALLOWED_SUMMARY_FIELDS = [
  'short_fingerprint',
  'boolean_presence',
  'count',
  'redacted_status',
  'redacted_summary_only',
  'method_names',
  'success_boolean',
  'result_type',
  'error_name_redacted',
  'error_message_redacted',
  'phase_id',
  'commit_hash',
];

const ALLOWED_SUMMARY_PREFIXES = [
  'port_',
  'target_',
  'page_',
  'selected_',
  'electron_',
  'launch_',
  'connection_',
  'runtime_',
  'known_untracked',
];

function isAllowedSummaryField(fieldName) {
  if (!fieldName || typeof fieldName !== 'string') return false;

  const lower = fieldName.toLowerCase().trim();

  // Exact match
  if (ALLOWED_SUMMARY_FIELDS.includes(lower)) return true;

  // Prefix match
  for (const prefix of ALLOWED_SUMMARY_PREFIXES) {
    if (lower.startsWith(prefix)) return true;
  }

  return false;
}

function checkFieldNamesInObject(obj, context) {
  const warnings = [];
  if (!obj || typeof obj !== 'object') return warnings;

  for (const key of Object.keys(obj)) {
    if (!isAllowedSummaryField(key)) {
      warnings.push({
        field: key,
        context: context || '(unknown)',
        message: `Field not in allowed summary allowlist: ${key}`,
      });
    }
  }

  return warnings;
}

module.exports = {
  ALLOWED_SUMMARY_FIELDS,
  ALLOWED_SUMMARY_PREFIXES,
  isAllowedSummaryField,
  checkFieldNamesInObject,
};
