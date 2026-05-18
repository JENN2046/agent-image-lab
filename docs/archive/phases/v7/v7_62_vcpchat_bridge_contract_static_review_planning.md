# v7.62 — VCPChat Bridge Contract Static Review Planning

> **This document is planning-only. It does not authorize execution.**
>
> **本文是静态审查规划，不授权执行。**

---

## 1. Carry-forward Context

```yaml
carry_forward_context:
  prior_v7_61_commit: 40ae966
  prior_v7_61_package_status: prepared_not_granted
  prior_v7_61_A5_requested: false
  prior_v7_61_A5_granted: false
  prior_v7_61_execution_authorized: false
  v7_61_minor_notes:
    - exact endpoint currently TBD, must be locked before execution
    - read-only claim requires static bridge contract evidence
  lt06_a5_does_not_cover_vcpchat: true
```

## 2. Planning Scope

```yaml
planning_scope:
  objective: >
    Define how to statically locate the imageLabReview bridge contract,
    define how to prove loadSession / previewDraft are read-only,
    define how to prove submitDraft and any write path are excluded,
    define what must be locked before future execution.

  out_of_scope:
    - real VCPChat bridge call
    - Electron / remote-debug / CDP launch
    - loadSession / previewDraft / submitDraft call
    - any MCP codex-memory call
    - any native VCP route call
    - DailyNote write
    - VCP memory write
    - image generation
```

## 3. Bridge Contract Location Strategy

```yaml
bridge_contract_location:
  primary_source: >
    VCPChat repository renderer.js — the preload script that
    exposes imageLabReview bridge methods to the renderer process
    via contextBridge.exposeInMainWorld.

  static_location_methods:
    - method: grep VCPChat renderer.js for contextBridge.exposeInMainWorld
      evidence_required: >
        Extract the exact lines that define the bridge surface,
        method names, and method implementations. Store as
        redacted snippet (method names only, no private path / token).

    - method: grep VCPChat renderer.js for imageLabReview
      evidence_required: >
        Confirm all imageLabReview references in the file.
        Classify each as loadSession, previewDraft, submitDraft,
        or other. No other methods should exist.

    - method: inspect ipcRenderer.invoke channel names
      evidence_required: >
        Identify the IPC channel strings used for each method.
        Confirm they match the bridge method name pattern.

  fallback: >
    If renderer.js is not available or has changed, use the
    VCPChat PR #35 feature-branch renderer.js as evidence
    candidate (not merged baseline, but usable as local reference).
```

## 4. Read-only Evidence Requirements

```yaml
read_only_evidence_requirements:
  loadSession:
    method: imageLabReview.loadSession
    read_only_proof_required: >
      Show that loadSession internally calls ipcRenderer.invoke
      to a read-only IPC handler. Confirm the handler does not
      write to files, database, DailyNote, or VCP memory.
    rejection_if: >
      Any write operation observed in the handler chain
      (fs.write, DailyNoteWrite, CodexMemoryBridge, save, create).

  previewDraft:
    method: imageLabReview.previewDraft
    read_only_proof_required: >
      Show that previewDraft internally calls ipcRenderer.invoke
      to a read-only IPC handler. Confirm the handler does not
      write to files, database, DailyNote, or VCP memory.
    rejection_if: >
      Any write operation observed in the handler chain.

  evidence_format: >
    Static code excerpt (redacted) showing the IPC handler
    implementation. Only method names, channel strings, and
    read-only call patterns are recorded. No private paths,
    no tokens, no full file paths.
```

## 5. submitDraft Exclusion Requirements

```yaml
submitDraft_exclusion_requirements:
  method: imageLabReview.submitDraft
  exclusion_proof_required: >
    Show that submitDraft exists as a bridge method but is
    permanently excluded from the allowed call list.
  evidence:
    - Confirm the method exists in renderer.js
    - Confirm it invokes a write-capable IPC handler
    - Record the method name and channel as excluded
    - Document why it is excluded (write capability)
  exclusion_is_permanent: true
  cannot_be_added_to_allowlist: true
```

## 6. Endpoint Lock Requirements

```yaml
endpoint_lock_requirements:
  exact_endpoint_currently: TBD (from v7.61 minor note)
  must_be_locked_before_execution:
    - exact bridge URL or Electron IPC channel
    - exact Electron window target
    - exact remote-debug port (if used)
    - exact CDP endpoint (if used)
    - exact VCPChat executable path
    - exact VCPChat working directory
  locked_in_phase: future (v7.63 or later authorization package)
```

## 7. Security Gates

```yaml
security_gates:
  pre_execution_gates:
    - gate: bridge_contract_statically_reviewed
      required: true
      evidence: static review document

    - gate: loadSession_read_only_proven
      required: true
      evidence: code excerpt showing no write operations

    - gate: previewDraft_read_only_proven
      required: true
      evidence: code excerpt showing no write operations

    - gate: submitDraft_exclusion_documented
      required: true
      evidence: exclusion record

    - gate: exact_endpoint_locked
      required: true
      evidence: locked in authorization package

    - gate: no_other_bridge_methods_found
      required: true
      evidence: complete method inventory

  hard_stops:
    - do_not_call_bridge_without_exact_endpoint_lock
    - do_not_call_bridge_without_read_only_proof
    - do_not_call_submitDraft
    - do_not_add_submitDraft_to_allowlist
    - do_not_call_mcp_codex_memory
```

## 8. Forward Work Plan

```yaml
forward_work_plan:
  v7_62_completed: static_review_planning_defined
  next_recommended_phases:
    - v7.63: VCPChat bridge contract static review execution
    - v7.64: VCPChat surface check authorization package v2 (with locked endpoint)
  blocking_dependency: >
    VCPChat renderer.js must be available for static review.
    If not available, use PR #35 feature-branch renderer.js as
    evidence candidate.
```
