# Docs Archive C1f Exact-Move Authorization Package Dry Run

Status: C1f exact-move authorization package dry-run completed validated
Mode: A4.8 local documentation and preflight package only
Source classification: `docs/archive/DOCS_ARCHIVE_C1E_REMAINING_DOCS_RECLASSIFICATION_REFRESH.md`
Scope basis: C1e `future exact-move candidates` only

This package defines the narrow authorization shape for a future C1f exact-file move. It is not itself a move authorization and does not move files.

## Boundary

This C1f dry run did not:

- move docs
- delete files
- create wrappers
- rewrite references
- change validator behavior
- split scripts
- process `runs/`
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, or runtime
- read `.env`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Proposed Future Move Scope

Future C1f may move only the exact 20 files listed in this package.

Explicitly excluded from C1f:

- all validator-blocked records from C1e
- all wrapper-required records from C1e
- all docs-only-reference records from C1e
- current authority docs
- docs/archive planning records
- any file outside the exact allowlist below
- `runs/`, asset binaries, secrets, env files, caches, logs, DB files

## Preflight Snapshot

| Check | Count |
| --- | ---: |
| exact future candidates | 20 |
| missing source files | 0 |
| destinations already existing | 0 |
| missing destination parent directories | 0 |
| duplicate source paths | 0 |
| duplicate destination paths | 0 |
| invalid source path boundaries | 0 |
| invalid destination path boundaries | 0 |

## Bucket Distribution

| Bucket | Count |
| --- | ---: |
| phases/v7 | 20 |

## Extension Distribution

| Extension | Count |
| --- | ---: |
| .md | 16 |
| .yaml | 4 |

## Destination Parent Directories

| Destination parent | Count |
| --- | ---: |
| docs/archive/phases/v7 | 20 |

## Future Authorization Requirements

A later physical C1f move must be separately authorized and must name:

- this exact package file
- the exact 20-file allowlist below
- exact-file move only
- no glob movement
- no deletion
- no overwrite
- no wrapper creation unless separately authorized
- no reference rewrite unless separately authorized
- rollback by reversing this same allowlist
- validation commands before and after the move
- stop conditions

## Required Validation For Future Physical Move

Before and after a separately authorized physical move:

```powershell
git status --short --branch
git diff --check
node scripts\validate_agent_board_state.js
powershell -ExecutionPolicy Bypass -File scripts\validate_mvp.ps1
```

A future move executor must also verify that all 20 source paths exist before moving, all 20 archive targets exist after moving, and old operational references remain clean for this allowlist.

## Rollback Plan

Rollback must reverse the exact allowlist:

```text
for each moved row:
  move Archive path back to Current path
```

Do not delete archive directories during rollback unless a separate cleanup task is authorized.

## Exact C1f Future Move Allowlist

| # | Current path | Archive target | Bucket | Extension | Source exists now | Destination exists now | Destination parent exists |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | docs/v7_100_vcpchat_read_only_surface_runtime_closeout.md | docs/archive/phases/v7/v7_100_vcpchat_read_only_surface_runtime_closeout.md | phases/v7 | .md | true | false | true |
| 2 | docs/v7_103_boundary_matrix_hardening_redaction_validator_planning.md | docs/archive/phases/v7/v7_103_boundary_matrix_hardening_redaction_validator_planning.md | phases/v7 | .md | true | false | true |
| 3 | docs/v7_106_boundary_matrix_yaml_draft.yaml | docs/archive/phases/v7/v7_106_boundary_matrix_yaml_draft.yaml | phases/v7 | .yaml | true | false | true |
| 4 | docs/v7_153_batch_003_exact_finding_recovery.yaml | docs/archive/phases/v7/v7_153_batch_003_exact_finding_recovery.yaml | phases/v7 | .yaml | true | false | true |
| 5 | docs/v7_154_batch_003_correction_implementation_gate.md | docs/archive/phases/v7/v7_154_batch_003_correction_implementation_gate.md | phases/v7 | .md | true | false | true |
| 6 | docs/v7_154_batch_003_correction_implementation_gate.yaml | docs/archive/phases/v7/v7_154_batch_003_correction_implementation_gate.yaml | phases/v7 | .yaml | true | false | true |
| 7 | docs/v7_156_batch_003_rescan_authorization_gate.yaml | docs/archive/phases/v7/v7_156_batch_003_rescan_authorization_gate.yaml | phases/v7 | .yaml | true | false | true |
| 8 | docs/v7_157_batch_003_rescan_execution_closeout.md | docs/archive/phases/v7/v7_157_batch_003_rescan_execution_closeout.md | phases/v7 | .md | true | false | true |
| 9 | docs/v7_64_vcpchat_bridge_contract_static_code_review_execution.md | docs/archive/phases/v7/v7_64_vcpchat_bridge_contract_static_code_review_execution.md | phases/v7 | .md | true | false | true |
| 10 | docs/v7_71_port_check_execution_closeout.md | docs/archive/phases/v7/v7_71_port_check_execution_closeout.md | phases/v7 | .md | true | false | true |
| 11 | docs/v7_72_concrete_cdp_endpoint_lock_patch.md | docs/archive/phases/v7/v7_72_concrete_cdp_endpoint_lock_patch.md | phases/v7 | .md | true | false | true |
| 12 | docs/v7_75_electron_launch_runtime_state_closeout.md | docs/archive/phases/v7/v7_75_electron_launch_runtime_state_closeout.md | phases/v7 | .md | true | false | true |
| 13 | docs/v7_78_cdp_target_discovery_execution_closeout.md | docs/archive/phases/v7/v7_78_cdp_target_discovery_execution_closeout.md | phases/v7 | .md | true | false | true |
| 14 | docs/v7_83_second_json_exact_target_lock_execution_closeout.md | docs/archive/phases/v7/v7_83_second_json_exact_target_lock_execution_closeout.md | phases/v7 | .md | true | false | true |
| 15 | docs/v7_84_target_fingerprint_lock_planning.md | docs/archive/phases/v7/v7_84_target_fingerprint_lock_planning.md | phases/v7 | .md | true | false | true |
| 16 | docs/v7_87_cdp_websocket_connect_execution_closeout.md | docs/archive/phases/v7/v7_87_cdp_websocket_connect_execution_closeout.md | phases/v7 | .md | true | false | true |
| 17 | docs/v7_90_runtime_evaluate_surface_probe_execution_closeout.md | docs/archive/phases/v7/v7_90_runtime_evaluate_surface_probe_execution_closeout.md | phases/v7 | .md | true | false | true |
| 18 | docs/v7_93_cancel_only_preflight_execution_closeout.md | docs/archive/phases/v7/v7_93_cancel_only_preflight_execution_closeout.md | phases/v7 | .md | true | false | true |
| 19 | docs/v7_96_loadSession_read_only_execution_closeout.md | docs/archive/phases/v7/v7_96_loadSession_read_only_execution_closeout.md | phases/v7 | .md | true | false | true |
| 20 | docs/v7_99_previewDraft_read_only_execution_closeout.md | docs/archive/phases/v7/v7_99_previewDraft_read_only_execution_closeout.md | phases/v7 | .md | true | false | true |

## Exact Approval Text For Future Physical Move

```text
批准执行 C1f exact-file physical docs archive move：使用 docs/archive/DOCS_ARCHIVE_C1F_EXACT_MOVE_AUTHORIZATION_PACKAGE_DRY_RUN.md 中的 20 个 exact allowlist rows，将 Current path 精确移动到 Archive target；不允许 glob movement，不允许删除文件，不允许 overwrite，不允许移动 allowlist 之外任何文件，不允许创建 wrappers，不允许 rewrite references，不允许修改 validator 行为，不允许 split scripts，不允许处理 runs/，不允许 provider/API/plugin/MCP/image generation/DailyNote/VCP memory/runtime/real manifest/VCPChat/VCPToolBox，不允许读取 .env/.env.local，不允许 push/tag/release/deploy；移动前后运行 git status --short --branch、git diff --check、node scripts/validate_agent_board_state.js、powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1，并生成 C1f move execution record 后停止汇报；审批人 Jenn。
```

## Recommended Next Step

Human review this C1f dry-run package. Physical C1f movement remains blocked until a separate explicit approval names this package and the exact 20-file allowlist.
