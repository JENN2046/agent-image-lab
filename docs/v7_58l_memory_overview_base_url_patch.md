# v7.58l — Base URL Patch: memory_overview Independent A5 Request Text

> **This phase does not submit the A5 request. It does not authorize LT-06 execution. It only patches the base URL into the v7.58j A5 request text draft.**

---

## Patch Summary

```yaml
v7_58l_memory_overview_base_url_patch:
  schema_version: v1
  phase: v7_58l
  status: completed
  patch_type: docs_only_base_url_lock

  selected_target:
    name: VCPToolBox_embedded_6005
    exact_base_url: http://127.0.0.1:6005
    exact_endpoint_url: http://127.0.0.1:6005/mcp/codex-memory
    reason: LT-06 remains VCPToolBox real read-only dry-run

  excluded_target:
    name: standalone_codex_memory_7605
    exact_base_url: http://127.0.0.1:7605
    reason: standalone sidecar is not selected for this LT-06 request

  execution_decision:
    A5_requested: false
    A5_granted: false
    LT06_executed: false
    request_A5_now: false
    execute_LT06_now: false
    real_LT06_execution_ready: false
```

## Why 6005

The current LT-06 thread is scoped as VCPToolBox real read-only dry-run. Therefore the request target must be the VCPToolBox embedded MCP route on `http://127.0.0.1:6005/mcp/codex-memory`, not the standalone codex-memory HTTP sidecar on `7605`.

## Why this is still not execution

This patch only adds the base URL to the A5 request text draft. It does not submit the A5 request, does not grant A5, does not call the endpoint, and does not execute LT-06.

## Files Changed

| File | Action |
|------|--------|
| `docs/v7_58j_memory_overview_independent_A5_request_text.md` | patched — added `target_identity`, changed URL to full endpoint |
| `docs/v7_58j_memory_overview_independent_A5_request_text.yaml` | patched — added `target_identity` with `base_url_locked: true` |
| `docs/v7_58j_memory_overview_A5_request_pre_submission_checklist.md` | patched — added 3 base URL checks |
| `docs/v7_58l_memory_overview_base_url_patch.md` | created |
| `docs/v7_58l_memory_overview_base_url_patch.yaml` | created |
| `docs/v7_58l_memory_overview_base_url_patch_closeout.md` | created |
| `docs/v7_58l_memory_overview_base_url_patch_closeout.yaml` | created |
| `README.md` | updated |
| `.agent_board/CHECKPOINT.md` | updated |
