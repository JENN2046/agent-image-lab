#!/usr/bin/env bash
# Agent Image Lab local validation helper
# Safe local validation only.

set -uo pipefail

echo "== Agent Image Lab local validation =="
failed=0
warnings=0

warn() { echo "WARN: $*"; warnings=$((warnings+1)); }

echo ""
echo "== Git reality =="
git branch --show-current 2>/dev/null || warn "git branch check unavailable"
git status --short 2>/dev/null || warn "git status unavailable"
git diff --stat 2>/dev/null || warn "git diff stat unavailable"

echo ""
echo "== git diff --check =="
git diff --check || failed=1

echo ""
echo "== Required project files =="
for p in README.md AGENTS.md 00_project_skeleton.md DECISIONS.md tests/validation_checklist.md; do
  if [ ! -e "$p" ]; then
    echo "MISSING: $p"
    failed=1
  else
    echo "OK: $p"
  fi
done

echo ""
echo "== Review Console prototype syntax =="
if [ -f review_console/static_prototype/app.js ]; then
  if command -v node >/dev/null 2>&1; then
    node --check review_console/static_prototype/app.js || failed=1
  else
    warn "node not found; skipped app.js syntax check"
  fi
else
  echo "Skip: review_console/static_prototype/app.js not present"
fi

echo ""
echo "== Hard false flag scan =="
allowed_historical_true_flag_regex='^(\./)?(docs/33_post_execution_checkpoint\.md|integrations/vcp/v0_7_photo_studio_os_real_execution_record\.md|integrations/vcp/v0_9_photo_studio_os_retry_real_execution_record\.md|integrations/vcp/v0_10_doubaogen_retry_real_execution_record\.md|integrations/vcp/v0_10_gptimagegen_gpt55_real_execution_record\.md|integrations/vcp/v0_10_gptimagegen_real_execution_record\.md|integrations/vcp/v0_10_gptimagegen_retry2_real_execution_record\.md|tests/schema_examples/v0_7_photo_studio_os_real_execution_record\.example\.yaml|tests/schema_examples/v0_9_photo_studio_os_retry_real_execution_record\.example\.yaml|tests/schema_examples/v0_9_post_execution_checkpoint\.example\.yaml|tests/schema_examples/v0_10_doubaogen_retry_real_execution_record\.example\.yaml|tests/schema_examples/v0_10_gptimagegen_gpt55_real_execution_record\.example\.yaml|tests/schema_examples/v0_10_gptimagegen_real_execution_record\.example\.yaml|tests/schema_examples/v0_10_gptimagegen_retry2_real_execution_record\.example\.yaml):'
strict_patterns=(
  "api_called:[[:space:]]*true"
  "vcp_plugin_called:[[:space:]]*true"
  "daily_note_called:[[:space:]]*true"
  "source_read_performed:[[:space:]]*true"
  "real_manifest_read:[[:space:]]*true"
  "real_execution_allowed:[[:space:]]*true"
  "real_vcpchat_source_read:[[:space:]]*true"
  "raw_source_copy_allowed:[[:space:]]*true"
  "integration_code_creation_allowed:[[:space:]]*true"
  "vcpchat_modification_allowed:[[:space:]]*true"
  "vcp_toolbox_modification_allowed:[[:space:]]*true"
)
for pat in "${strict_patterns[@]}"; do
  hits="$(grep -RInE --exclude-dir=.git --include='*.md' --include='*.yaml' --include='*.yml' --include='*.json' --include='*.html' --include='*.css' --include='*.js' "$pat" . | grep -Ev "$allowed_historical_true_flag_regex" || true)"
  if [ -n "$hits" ]; then
    echo "$hits"
    echo "FAIL pattern: $pat"
    failed=1
  fi
done

echo ""
echo "== Warning scan =="
warn_patterns=("A:\\\\VCP\\\\" "C:\\\\Users\\\\" "index\\.js" "\\.exe" "\\.ps1" "\\.bat" "\\.cmd" "\\.sh" "\\.png" "\\.jpg" "\\.jpeg" "\\.webp" "token" "cookie" "password" "API key")
for pat in "${warn_patterns[@]}"; do
  if grep -RInE --exclude-dir=.git --include='*.md' --include='*.yaml' --include='*.yml' --include='*.json' --include='*.html' --include='*.css' --include='*.js' "$pat" . >/dev/null 2>&1; then
    warn "Pattern '$pat' found; inspect whether it is only a negative/checklist reference."
  fi
done

if [ "$failed" -ne 0 ]; then
  echo ""
  echo "Result: FAILED"
  exit 1
fi

echo ""
echo "Result: PASSED_WITH_WARNINGS_OK_FOR_MANUAL_REVIEW"
exit 0
