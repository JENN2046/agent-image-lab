# Validation Selection Matrix

```yaml
matrix_id: validation_selection_matrix
scope: Agent Image Lab A4.8
purpose: choose the narrowest validation that proves the current local change
```

## Common Baseline

Every modification requires:

```text
git status -sb
git diff --check
exact diff review
```

## Matrix

| Change Type | Required Validation | Notes |
|---|---|---|
| Docs-only planning | `git diff --check` | No runtime or provider checks. |
| README / roadmap / PROJECT_MASTER_PLAN | `powershell -ExecutionPolicy Bypass -File scripts/validate-agent-image-lab-local.ps1`; `powershell -ExecutionPolicy Bypass -File scripts/validate_mvp.ps1` | Use when status surfaces change. |
| `.agent_board` resume surfaces | `node scripts/validate_agent_board_state.js` | Also check handoff, run state, task queue, checkpoint, validation log freshness. |
| Current state alignment | `node scripts/validate_current_state_alignment.js` | Use when current status or recommended next changes. |
| Native Doubao sandbox surfaces | `node scripts/validate_native_doubao_sandbox.js` | Safe static validator only; no generation runner. |
| JavaScript file changed | `node --check <changed-js-file>` | Syntax check only unless task authorizes more. |
| PowerShell helper changed | Parse/run the changed helper when safe | Do not read secrets or run provider/runtime. |
| Static Review Surface docs/spec | Docs checks plus no-execution review | No renderer/preload/IPC/runtime unless explicitly authorized. |

## Validation Selection Rule

Use the narrowest validation set that proves the changed surface. Add broader validation only when the task touches shared status surfaces, validators, or project gates.

Do not run real generation, provider contact, plugin call, `.env.local` value read, runtime integration, or memory write as validation under A4.8.
