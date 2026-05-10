# v7.63 — VCPChat Bridge Contract Static Code Review Package

> **This document is a static code review package. It does not authorize runtime execution.**
>
> **本文是静态代码审查包，不授权运行时执行。**

---

## 1. Carry-forward Context

```yaml
carry_forward_context:
  prior_v7_62_commit: b65d46d
  prior_v7_62_document_type: planning_only
  v7_62_minor_notes:
    - note_1: "不要只假定 renderer.js 是 bridge 暴露源。静态查找范围必须包含 preload.js、preloads/、modules/ipc/ 等。"
    - note_2: "static review execution 必须明确为 static code review only，no runtime execution。"
  pre_execution_requirements_all_false: true
  lt06_a5_does_not_cover_vcpchat: true
```

## 2. Package Header

```yaml
v7_63_vcpchat_bridge_contract_static_code_review_package:
  schema_version: v1
  package_type: static_code_review_package
  status: prepared_not_executed
  phase: v7_63
  runtime_execution_authorized: false
  static_code_review_only: true
```

## 3. Exact Search Scope

```yaml
exact_search_scope:
  root_directories:
    - A:\VCPChat\ (primary VCPChat repository)

  target_files_and_globs:
    - renderer.js
    - preload.js
    - preloads/chat.js
    - preloads/utility.js
    - preloads/**/*.js
    - modules/ipc/**/*.js
    - modules/**/*.js
    - main.js
    - app.js
    - ipc/**/*.js
    - src/**/*.js (if applicable)

  additional_scope:
    - any file containing "imageLabReview" (case-sensitive)
    - any file containing "contextBridge.exposeInMainWorld"
    - any file containing "ipcRenderer.invoke" where channel suggests bridge
    - any file containing "ipcMain.handle" where channel matches bridge channel
    - any file under A:\VCPChat\src\ or A:\VCPChat\modules\ that handles IPC

  excluded:
    - node_modules/**
    - .git/**
    - dist/**
    - build/**
    - any binary or large asset directory
    - any third-party dependency directory
```

## 4. Exact Keywords to Search

```yaml
exact_keywords:
  bridge_surface:
    - "contextBridge.exposeInMainWorld"
    - "imageLabReview"
    - "loadSession"
    - "previewDraft"
    - "submitDraft"

  ipc_channels:
    - "ipcRenderer.invoke"
    - "ipcMain.handle"
    - "imageLabReview:loadSession"
    - "imageLabReview:previewDraft"
    - "imageLabReview:submitDraft"

  write_operations_proof:
    - "fs.write"
    - "fs.writeFile"
    - "fs.writeFileSync"
    - "DailyNoteWrite"
    - "CodexMemoryBridge"
    - "writeDiary"
    - "record_memory"
    - ".save("
    - ".create("
    - "dialog.showSave"
    - "newSession"
    - "appendFile"

  read_only_confirmation:
    - "fs.read"
    - "fs.readFile"
    - "fs.readFileSync"
    - "loadSession"
    - "loadDraft"
    - "previewDraft"
    - "getDraft"
    - "getSession"
```

## 5. contextBridge Detection Method

```yaml
contextBridge_detection:
  method: >
    Search for contextBridge.exposeInMainWorld calls across all
    preload files. Each call defines a bridge API object exposed
    to the renderer process. Record the API name, the method names,
    and the channel strings.

  evidence_to_record:
    - file_path_redacted: relative path only, no absolute path
    - api_name: the first argument to exposeInMainWorld
    - method_names: the keys of the second argument object
    - channel_strings: the string arguments to ipcRenderer.invoke
    - line_numbers: for cross-reference

  example_capture:
    - file: preloads/chat.js (redacted)
    - api_name: imageLabReview
    - methods_exposed: [loadSession, previewDraft, submitDraft]
    - channels: [imageLabReview:loadSession, imageLabReview:previewDraft, imageLabReview:submitDraft]

  exclusion:
    - any method not in [loadSession, previewDraft, submitDraft] must be flagged
    - any unexpected method blocks the review and requires explicit documentation
```

## 6. IPC Channel Trace Method

```yaml
ipc_channel_trace:
  step_1_contextBridge: >
    From the contextBridge.exposeInMainWorld result, extract each
    method's ipcRenderer.invoke channel string.

  step_2_find_handler: >
    Search for ipcMain.handle with the same channel string in
    main process files (main.js, app.js, modules/ipc/*.js, etc.).

  step_3_read_handler: >
    Read the handler implementation. Record:
    - channel string
    - handler file (redacted relative path)
    - operations performed (read file, write file, call API, etc.)
    - return value structure

  step_4_classify: >
    Based on the handler implementation, classify as read-only or
    write-capable. If the handler contains any write operation
    (fs.writeFile, DailyNoteWrite, CodexMemoryBridge, .save(), .create()),
    classify as write-capable and exclude from allowed list.

  step_5_document: >
    Record the complete trace in redacted format. If any step
    cannot be completed, mark the method as "not_proven" and
    block execution.

  blocked_if:
    - handler implementation not found
    - handler implementation ambiguous
    - handler contains unclassified operations
    - channel string cannot be traced to main process
    - any IPC channel mismatch detected
    - any undocumented method found in bridge surface
```

## 7. Read-only Classification Rules

```yaml
read_only_classification:
  loadSession:
    expected_operations:
      - read session file from disk
      - parse JSON
      - return session data to renderer
    classifier: read_only_if_no_write_operations_in_handler
    blocked_if: any write operation found in handler chain

  previewDraft:
    expected_operations:
      - read draft file from disk
      - parse JSON
      - return draft data to renderer
    classifier: read_only_if_no_write_operations_in_handler
    blocked_if: any write operation found in handler chain

  submitDraft:
    expected_operations:
      - receive draft data from renderer
      - write to disk or database
      - possibly trigger DailyNoteWrite or CodexMemoryBridge
    classifier: write_capable_excluded_permanently
    exclusion_is_permanent: true
    cannot_be_reclassified: true

  unexpected_method:
    classifier: unknown_requires_documentation
    blocked: true
    requires_explicit_authorization_before_any_use: true
```

## 8. Redacted Evidence Policy

```yaml
redacted_evidence_policy:
  allowed:
    - method names
    - channel strings
    - IPC handler operation types (read, write, call)
    - relative file paths (redacted of private/user info)
    - line numbers
    - classification result (read_only, write_capable, not_proven)

  forbidden:
    - absolute file paths
    - private paths containing username
    - full file content (excerpts only, max 10 lines per method)
    - API keys, tokens, secrets
    - raw structuredContent from bridge responses
    - full directory listings
    - any environment variable values

  format: >
    Each method's evidence is recorded as a YAML block with
    redacted_file, method, channel, operations, classification.
    No raw file dumps.
```

## 9. Execution Blocking Rules

```yaml
execution_blocking_rules:
  static_code_review_only: true
  runtime_execution_authorized: false
  electron_start_authorized: false
  bridge_call_authorized: false

  blocks:
    - if_any: contextBridge.exposeInMainWorld not found
      then: block_all_bridge_execution
    - if_any: imageLabReview surface incomplete
      then: block_all_bridge_execution
    - if_any: loadSession handler not found
      then: block_loadSession
    - if_any: previewDraft handler not found
      then: block_previewDraft
    - if_any: submitDraft handler shows no write capability
      then: flag_as_unexpected_unknown_operation
    - if_any: undocumented method found in bridge surface
      then: block_all_bridge_execution
    - if_any: IPC channel cannot be traced
      then: block_all_bridge_execution
    - if_any: handler contains write operation but is not submitDraft
      then: block_all_bridge_execution

  note: >
    This review package only authorizes static code reading of
    VCPChat source files. It does not authorize any runtime
    execution, Electron launch, IPC call, bridge call, or
    network request.
```

## 10. Forward Work Plan

```yaml
forward_work_plan:
  v7_63_status: static_code_review_package_prepared_not_executed
  v7_62_minor_notes_resolved:
    - note_1: true — search scope expanded to preload.js, preloads/*, modules/ipc/*
    - note_2: true — static code review only, no runtime execution
  next_recommended_phases:
    - v7.64: VCPChat bridge contract static code review execution
    - v7.65: VCPChat surface check authorization package v2 (with locked endpoint and static evidence)
```
