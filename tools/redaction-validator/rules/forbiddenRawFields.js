// Forbidden Raw Fields Rule — Skeleton
// Scans text for forbidden raw field keys and suspicious value patterns.
// Read-only. No network. No CDP. No bridge. No MCP.

'use strict';

const FORBIDDEN_RAW_FIELDS = [
  { key: 'raw_json', severity: 'high', category: 'CDP' },
  { key: 'raw_response', severity: 'high', category: 'bridge' },
  { key: 'full_webSocketDebuggerUrl', severity: 'high', category: 'CDP' },
  { key: 'webSocketDebuggerUrl', severity: 'high', category: 'CDP' },
  { key: 'full_raw_target_id', severity: 'high', category: 'CDP' },
  { key: 'raw_target_id', severity: 'high', category: 'CDP' },
  { key: 'full_url', severity: 'medium', category: 'CDP' },
  { key: 'full_title', severity: 'medium', category: 'CDP' },
  { key: 'raw_payload', severity: 'high', category: 'bridge' },
  { key: 'raw_memory', severity: 'critical', category: 'MCP' },
  { key: 'memory_id', severity: 'high', category: 'MCP' },
  { key: 'source_file', severity: 'high', category: 'file' },
  { key: 'absolute_path', severity: 'medium', category: 'file' },
  { key: 'DailyNote_raw_content', severity: 'critical', category: 'memory' },
  { key: 'VCP_memory_raw_content', severity: 'critical', category: 'memory' },
  { key: 'private_runtime_data', severity: 'critical', category: 'runtime' },
];

function scanForbiddenRawFields(text, filePath) {
  // Skeleton: basic key-match scan
  const violations = [];

  for (const field of FORBIDDEN_RAW_FIELDS) {
    // Check for forbidden key patterns in YAML-style content
    const keyPattern = new RegExp(`\\b${escapeRegex(field.key)}\\s*[:]`, 'i');
    if (keyPattern.test(text)) {
      violations.push({
        field: field.key,
        severity: field.severity,
        category: field.category,
        file: filePath || '(unknown)',
        type: 'key_match',
        message: `Forbidden field key found: ${field.key} (${field.severity})`,
      });
    }
  }

  // Check for raw value patterns (URLs, UUIDs in CDP context)
  if (/ws:\/\/127\.0\.0\.1:\d+\/devtools\//.test(text)) {
    violations.push({
      field: 'webSocketDebuggerUrl (value pattern)',
      severity: 'high',
      category: 'CDP',
      file: filePath || '(unknown)',
      type: 'value_pattern',
      message: 'WebSocket debugger URL pattern detected',
    });
  }

  return violations;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  FORBIDDEN_RAW_FIELDS,
  scanForbiddenRawFields,
};
