# Docs Archive C1i Docs-Only Reference Link Graph Dry Run

Status: C1i docs-only-reference link graph dry-run completed validated
Mode: A4.8 local documentation and link-graph audit only
Source route decision: `docs/archive/DOCS_ARCHIVE_C1H_REMAINING_ARCHIVE_ROUTE_DECISION_DRY_RUN.md`
Source classification: `docs/archive/DOCS_ARCHIVE_C1E_REMAINING_DOCS_RECLASSIFICATION_REFRESH.md`

This dry run builds a current link graph for the 67 remaining `docs-only-reference` records after C1f. It does not move files, rewrite references, create wrappers, stage, commit, push, tag, release, deploy, or authorize any A5 action.

## Boundary

This dry run did not:

- move docs
- delete files
- create wrappers
- rewrite references
- change validator behavior
- split scripts
- process `runs/`
- stage, commit, push, tag, release, or deploy
- execute A5
- call provider, plugin, API, DailyNote, VCP memory, MCP, or runtime
- read `.env`, `.env.local`, secrets, private paths, real manifests, VCPChat, or VCPToolBox

## Scan Scope

The scan used the current filesystem, not only the stale C1e sample refs.

| Scan item | Count |
| --- | ---: |
| non-archive docs files scanned | 788 |
| docs-only-reference targets checked | 67 |
| current edge records | 96 |
| current edge hits | 98 |
| target docs with current refs | 65 |
| target docs with zero current refs | 2 |
| source docs with outbound refs to these targets | 29 |

`docs/archive/` references were excluded from blocker status because archive records preserve migration history.

## Target Distribution

| Bucket | Count |
| --- | ---: |
| `docs/archive/numbered_legacy/` | 1 |
| `docs/archive/phases/v6/` | 1 |
| `docs/archive/phases/v7/` | 65 |

## Current Reference Count Distribution

| Current non-archive refs per target | Targets |
| ---: | ---: |
| 0 | 2 |
| 1 | 39 |
| 2 | 23 |
| 3 | 2 |
| 5 | 1 |

## Top Current Source Docs

| Source doc | Referenced targets | Hits |
| --- | ---: | ---: |
| `docs/vcp_integration/agent_image_lab_vcp_integration_full_execution_backlog_v2.md` | 13 | 13 |
| `docs/vcp_integration/agent_image_lab_vcp_integration_full_landing_plan_v1.md` | 11 | 11 |
| `docs/v7_50_vcp_read_only_bridge_contract.md` | 8 | 8 |
| `docs/v7_145_batch_002_correction_implementation_gate.md` | 7 | 7 |
| `docs/v7_147_batch_002_rescan_authorization_gate.md` | 7 | 7 |
| `docs/v7_58l_memory_overview_base_url_patch.md` | 6 | 6 |
| `docs/v7_58l_memory_overview_base_url_patch_closeout.md` | 6 | 6 |
| `docs/v7_48_project_state_sync_pack.md` | 4 | 5 |
| `docs/v7_144_batch_002_permission_drift_analysis.md` | 4 | 4 |
| `docs/v7_156_batch_003_rescan_authorization_gate.md` | 4 | 4 |

## Top Current Target Docs

| Target doc | Source docs | Hits |
| --- | ---: | ---: |
| `docs/v7_182_generation_authorization_package_blueprint_gate.md` | 5 | 5 |
| `docs/v7_126_selected_docs_rescan_execution_closeout.yaml` | 3 | 4 |
| `docs/v7_135_batch_001_residual_correction_planning.md` | 3 | 3 |
| `docs/v7_46_french_summer_rattan_bag_v3_one_shot_a5_template.md` | 2 | 3 |
| `docs/v7_44_french_summer_rattan_bag_v3_closeout_production_readiness.md` | 2 | 2 |
| `docs/v7_45_french_summer_rattan_bag_v3_production_usage_sop.md` | 2 | 2 |
| `docs/v7_47_french_summer_rattan_bag_v3_human_review_checklist.md` | 2 | 2 |
| `docs/v7_49_vcp_case_summary_schema.md` | 2 | 2 |
| `docs/v7_52a_vcptoolbox_read_only_ingestion_planning.md` | 2 | 2 |
| `docs/v7_52b_vcp_package_schema_mapping.md` | 2 | 2 |

## Current Zero-Reference Drift

Two records that C1e classified as docs-only-reference now have zero current non-archive references after C1f:

| Target doc | Proposed archive target | Decision |
| --- | --- | --- |
| `docs/v7_102_cross_repo_boundary_audit.md` | `docs/archive/phases/v7/v7_102_cross_repo_boundary_audit.md` | candidate for future exact-move preflight |
| `docs/v7_75_electron_launch_runtime_state_closeout.yaml` | `docs/archive/phases/v7/v7_75_electron_launch_runtime_state_closeout.yaml` | candidate for future exact-move preflight |

These two files must not be moved automatically. They need a separate exact-move authorization package dry-run that verifies zero active references across scripts, tests, README, PROJECT_MASTER_PLAN, AGENTS, `.agent_board`, and non-archive docs.

## Source Risk Split

| Source class | Edge records | Decision |
| --- | ---: | --- |
| current or named docs | 29 | review first; includes product workflow and VCP integration planning docs |
| numbered legacy docs | 1 | low priority; still a top-level historical source |
| v7 historical docs | 66 | can be handled in chained archive batches after link updates are planned |

## Route Decision

C1i should not proceed directly to file movement.

Recommended next route:

1. Prepare `C1j docs-only-reference rewrite package dry-run` for the 65 currently referenced targets and their 29 source docs.
2. Keep all rewrites as a dry-run map first; do not edit source files yet.
3. Separately prepare a tiny exact-move preflight for the 2 zero-current-reference drift candidates only after C1j confirms no hidden active references.

## Stop Conditions

Stop before:

- any physical move
- any reference rewrite
- any wrapper creation
- any validator behavior change
- any staging or commit
- any push, tag, release, or deploy
- any A5 action
- any provider/API/plugin/MCP/image generation/DailyNote/VCP memory/runtime/real manifest/VCPChat/VCPToolBox action
- any `.env`, `.env.local`, secret, token, cookie, or private path read

## Decision Summary

```text
docs-only-reference targets checked: 67
current referenced targets: 65
current zero-reference drift candidates: 2
next safe work: C1j docs-only-reference rewrite package dry-run
blocked: physical movement until rewrite/wrapper strategy is explicitly reviewed
```
