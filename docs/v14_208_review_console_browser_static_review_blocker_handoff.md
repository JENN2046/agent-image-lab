# v14.208 Review Console Browser Static Review Blocker Handoff

```yaml
gate_template:
  phase: v14_208_review_console_browser_static_review_blocker_handoff
  base_contract: AGENTS.md
  mode: A4.8
  intent: local_implementation
  risk_level: R2
  allowed_files:
    - docs/v14_208_review_console_browser_static_review_blocker_handoff.md
    - tests/schema_examples/v14_208_review_console_browser_static_review_blocker_handoff.example.json
    - scripts/validate_v14_208_review_console_browser_static_review_blocker_handoff.js
    - scripts/validate_mvp.ps1
    - .agent_board/HANDOFF.md
    - .agent_board/RUN_STATE.md
    - .agent_board/TASK_QUEUE.md
    - .agent_board/CHECKPOINT.md
    - .agent_board/VALIDATION_LOG.md
  forbidden_actions:
    - provider/API/plugin/MCP call
    - browser or Playwright dependency installation
    - fetch or file write from the Review Console
    - real manifest/VCPChat/VCPToolBox read
    - real IPC/preload/renderer/runtime integration
    - accepted_samples, failure_samples, production_candidate, DailyNote, or VCP memory write
    - image generation
    - push/tag/release/deploy
  validation:
    required:
      - node --check scripts/validate_v14_208_review_console_browser_static_review_blocker_handoff.js
      - node scripts/validate_v14_208_review_console_browser_static_review_blocker_handoff.js
      - git diff --check
      - node scripts/validate_agent_board_state.js
      - powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1
      - powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1
  explicit_non_authorization:
    generation: false
    plugin_call: false
    provider_contact: false
    runtime: false
    memory_write: false
    DailyNote_write: false
```

## Phase Difference

v14.208 turns the current browser static review gap into an explicit blocker
handoff. The Review Console has local static regressions for v14.205-v14.207,
but no browser-rendered artifact has been captured in this session.

## Blocker Contract

```text
phase_id: v14_208_review_console_browser_static_review_blocker_handoff
browser_static_review_status: blocked_unavailable
browser_static_review_passed: false
browser_static_review_artifact_present: false
static_regression_substitute_present: true
validated_static_regression_refs:
  - scripts/validate_v14_205_review_console_runtime_gap_static_ui_panel.js
  - scripts/validate_v14_206_review_console_runtime_gap_draft_output_snapshot_static_regression.js
  - scripts/validate_v14_207_review_console_runtime_gap_trace_matrix_static_regression.js
browser_review_must_not_be_claimed_from_static_regressions: true
dependency_install_allowed: false
package_json_modified: false
vcp_runtime_integration_proven: false
```

## Unblock Paths

```text
restore Browser Node REPL tool and rerun local file:// static review
or use an already available local browser automation path without dependency change
or request separate approval before adding browser validation dependencies
```

## Closeout

This handoff does not satisfy browser visual review. It prevents future status
surfaces from claiming that browser review passed when only static validators
ran.
