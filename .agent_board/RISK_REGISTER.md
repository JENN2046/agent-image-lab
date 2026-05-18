# RISK_REGISTER.md - Agent Image Lab

Persistent risk register for Single-Window 4-Agent Compact Autopilot.

This register records current local risks and safe next actions. It must not
contain secrets, raw environment values, private absolute paths, customer private
data, or raw provider output.

## Active Risks

```yaml
risks:
  - id: artifact-portability-gap
    severity: P1
    status: mitigated
    evidence: >
      Local recoverability validators can fail when expected runs artifacts or
      import records are absent from the current workspace. This means workspace
      local recoverability is not yet the same as clone-portable durable archive
      recoverability. Current MVP validation fails because the clone is missing
      ignored runs/real_generation evidence paths recorded in
      docs/v14_230_artifact_restoration_a5_authorization_package_draft.md.
      v14.231 establishes the new durable archive baseline as a Git-tracked
      preview evidence capsule: preview.webp, long_edge 512, preview sha256 in
      manifest, no Base64, and no original sha256 requirement.
    blocked_actions:
      - production_candidate_write
      - DailyNote_write
      - VCP_memory_write
      - VCP_runtime_integration_claim
    safe_next:
      - implement_first_new_git_tracked_preview_evidence_capsule_after_explicit_preview_creation_authorization
      - update future recoverability validators to prefer asset_archive preview capsules over ignored runs evidence
      - review_console_static_productization_from_available_evidence
    hard_stop_boundary: A5_required_for_real_preview_generation_or_external_artifact_recovery

  - id: markdown-token-validator-brittleness
    severity: P2
    status: active
    evidence: >
      Several validators still rely on fixed markdown tokens across docs and
      agent_board surfaces. They are useful local gates, but can drift from
      repository reality when files are renamed, copied, or partially restored.
    blocked_actions: []
    safe_next:
      - prefer_structured_json_or_yaml_fixtures_for_new_state_surfaces
      - keep_markdown_tokens_as_secondary_human_readable_evidence
    hard_stop_boundary: none

  - id: parallel-worker-overlap-risk
    severity: P2
    status: active
    evidence: >
      Single-Window 4-Agent Compact Autopilot is safe by default as a logical
      role model. True Worker Alpha / Worker Beta parallelism needs explicit
      file locks to prevent overlapping writes.
    blocked_actions:
      - parallel_worker_execution_without_file_locks
    safe_next:
      - use_solo_commander_by_default
      - use_FILE_LOCKS_before_parallel_worker_tasks
    hard_stop_boundary: overlapping_write_set
```

## Resolved Risks

```yaml
resolved_risks: []
```

## Risk Template

```yaml
risks:
  - id: null
    severity: P0 | P1 | P2 | P3
    status: active | mitigated | blocked | resolved
    evidence: null
    blocked_actions: []
    safe_next: []
    hard_stop_boundary: null
```
