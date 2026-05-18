# v7.55i VCPChat Source Availability Report

## 1. Purpose

Report on VCPChat local source availability for read-only inspection.

## 2. Availability

```yaml
vcpchat_source_availability:
  schema_version: v1
  phase: v7_55i
  repo_available: true
  selected_repo_path: A:/VCP/apps/VCPChat
  git_branch: main
  git_head: c97ff0cbb41e44b9d824e2d9e6778524d50cb978
  working_tree_status: dirty (renderer.js has unstaged changes)
  read_only_inspection_performed: true
  write_performed: false
```

## 3. Repository Info

| Field | Value |
|-------|-------|
| Path | `A:/VCP/apps/VCPChat` |
| Branch | `main` |
| HEAD | `c97ff0cbb41e44b9d824e2d9e6778524d50cb978` |
| Latest commit | Merge pull request #33 from JENN2046/codex/remove-sovits-shutdown-secret |
| Working tree | dirty (renderer.js modified) |
| File count | 868 |

## 4. Evidence Candidates

```yaml
vcpchat_surface_evidence_candidates:
  preload_or_bridge_candidates:
    status: found
    evidence_files:
      - preload.js → preloads/utility.js (contextBridge + ipcRenderer API exposure)
      - Desktopmodules/api/ipcBridge.js (IPC bridge with desktopAPI/electronAPI pattern)
      - Desktopmodules/api/vcpProxy.js (VCP proxy bridge)
  electron_launch_candidates:
    status: found
    evidence_files:
      - main.js (Electron main process, BrowserWindow, app lifecycle)
      - modules/ipc/ (20+ IPC handler modules)
  remote_debug_or_cdp_candidates:
    status: found
    evidence_files:
      - main.js (standard Electron app, CDP available when remote-debug is enabled)
  secret_in_url_or_query_candidates:
    status: found (requires deep inspection)
    evidence_files:
      - Desktopmodules/api/vcpProxy.js (potential URL construction for VCP API)
  memory_or_generation_ui_candidates:
    status: found
    evidence_files:
      - renderer.js (main UI renderer, has uncommitted changes)
      - Desktopmodules/builtinWidgets/aiImageGenWidget.js (AI image generation widget)
      - modules/ipc/notesHandlers.js (notes/memo IPC handlers)
      - modules/ipc/memoHandlers.js (memo handlers)
```

## 5. Impact

VCPChat evidence gap is closed. Read-only inspection performed. No files modified.
