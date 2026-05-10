# v7.55j — VCPChat Secret and Bridge Risk Probe

## 1. Purpose

Review VCPChat secret exposure in URLs / queries, preload bridge surface, and Electron security baseline.

## 2. Probe Findings

```yaml
vcpchat_secret_and_bridge_probe:
  schema_version: v1
  phase: v7_55j
  repo: A:\VCP\VCPChat
  head: c97ff0c
  pr35_head_sha: f587bc3eff22654ad894ac4b0095ce20731b5b99
  pr35_base_sha: b320e39ffa527a81aca65c9228c20936a04f5ed8

  secret_in_url_or_query_candidate: found
  evidence:
    - file: Desktopmodules/api/vcpProxy.js
      lines: 32-35, 115-119
      detail: >
        vcpServerUrl and vcpApiKey loaded from Electron settings, cached in memory,
        and used in fetch() calls with Authorization: Bearer header. URL constructed
        from vcpServerUrl directly. No query-string secret observed, but vcpApiKey
        is passed in Bearer header.
    - file: Desktopmodules/legacy/Memomodules/memo.js
      lines: 1011-1034
      detail: >
        Legacy memo modules also carry vcpApiKey with Bearer auth in fetch calls.
        Uses tool_name:「始」DailyNote「末」markers for diary writes.
    - file: Desktopmodules/legacy/Forummodules/forum.js
      line: 1490
      detail: >
        Forum module sends Authorization: Bearer with vcpApiKey.

  preload_bridge_surface_candidates:
    - file: preloads/chat.js
      lines: 101-108
      note: >
        imageLabReview bridge exposed via contextBridge. 4 IPC channels,
        all invoke-style (request-response). Prototype_guard enforced
        server-side in imageLabReviewHandlers.js.
    - file: preloads/chat.js
      line: 3 (require ./preloads/utility)
      note: >
        Legacy utility preload with contextBridge for utilityAPI.
        ALLOWED_KEYS whitelist for permission isolation.
    - file: preloads/utility.js
      note: >
        Core preload with createOps/materializeApi pattern. IPC operations
        gated by ALLOWED_KEYS whitelist.
    - file: Desktopmodules/api/ipcBridge.js
      note: >
        Desktop API bridge with RPC-style invoke/send/subscribe patterns.

  electron_security_baseline:
    contextIsolation: verified
    evidence:
      - main.js:324 "contextIsolation: true"
      - main.js:919 "contextIsolation: true"
      - main.js:1407 "contextIsolation: true"
    nodeIntegration_disabled: verified
    evidence:
      - main.js:325 "nodeIntegration: false"
      - main.js:920 "nodeIntegration: false"
      - main.js:1408 "nodeIntegration: false"
    webPreferences:
      - preload scripts specified per window
      - remote-debug available when --remote-debugging-port is set

  remote_debug_or_cdp_reviewed: true
  evidence:
    - file: main.js
      note: standard Electron app, CDP available when --remote-debugging-port is passed

  conclusion:
    blocks_real_vcpchat_surface_execution: true
    reason: >
      Multiple legacy modules carry vcpApiKey with Bearer auth. While Electron
      security baseline (contextIsolation, nodeIntegration) is verified, the
      preload bridge surface is broad. Real VCPChat surface execution would
      expose these risk surfaces and requires independent authorization.
```
