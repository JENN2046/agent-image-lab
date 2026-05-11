# v7.175 allowedSummaryFields YAML Noise Hardening Gate

## Executive Summary

Hardened `allowedSummaryFields` YAML key scanning to only check top-level keys, eliminating noise from nested structural YAML fields while preserving the rule's ability to detect non-allowlisted report fields.

## Problem

The original implementation scanned ALL YAML keys at ALL nesting levels using `line.trim()` before regex matching. This meant structural fields nested inside `entries:`, `non_permissions:`, or `boundary_matrix:` blocks (like `allowed_now`, `permission_status`, `action_id`) were flagged as non-allowlisted summary fields, generating noise on every YAML fixture.

## Fix

- `validator.js`: YAML key extraction now only matches keys at column 0 (top-level only)
- `allowedSummaryFields.js`: Added `KNOWN_STRUCTURAL_KEYS` exclusion list for container keys like `entries`, `non_permissions`, `boundary_matrix`, `permissions`, `schema_version`
- `fixtures/fail/disallowed_summary_field_present.yaml`: Restructured to place non-allowlisted fields at top level

## Files Modified

- `tools/redaction-validator/rules/allowedSummaryFields.js` — Added `isKnownStructuralKey()`, `KNOWN_STRUCTURAL_KEYS`, exported them
- `tools/redaction-validator/validator.js` — Changed YAML key extraction to top-level only with structural key filtering
- `tools/redaction-validator/fixtures/fail/disallowed_summary_field_present.yaml` — Restructured for top-level key test

## Safety Boundaries

- `selected-doc-only` preserved
- `glob rejection` preserved
- `directory rejection` preserved
- `full-repo scan` not added
- No dependencies added
- No other rule behavior modified
