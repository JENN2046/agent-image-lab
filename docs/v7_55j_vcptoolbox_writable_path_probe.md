# v7.55j — VCPToolBox Writable Path Probe

## 1. Purpose

Map DailyNote and CodexMemoryBridge writable paths in VCPToolBox and assess whether they are reachable from a candidate LT-06 route.

## 2. Probe Findings

```yaml
vcptoolbox_writable_path_probe:
  schema_version: v1
  phase: v7_55j
  repo: A:\VCP\VCPToolBox-prod-stable
  head: 0a714c9

  DailyNote:
    writable_path_exists: true
    plugin_paths:
      - Plugin/DailyNote/dailynote.js
        summary: >
          Full CRUD diary plugin. Supports create, read, update, delete commands.
          Communicates via stdin/stdout as synchronous plugin. Accessed through
          pluginManager.executePlugin("DailyNote", jsonPayload).
      - Plugin/DailyNoteManager/daily-note-manager.js
        summary: >
          Batch diary management plugin. Supports list, associate, merge commands.
          Accessed through pluginManager.executePlugin("DailyNoteManager", jsonPayload).
      - Plugin/DailyNotePanel/frontend/
        summary: >
          DailyNote web panel frontend with localStorage persistence and API calls.
    api_paths:
      - AdminPanel-Vue/src/api/diary.ts
        summary: >
          Full CRUD API client: search, read, write, delete, move operations
          for diary/notes via VCPToolBox AdminPanel API.
    reachable_from_LT06_candidate_route: true
    reachable_proof: >
      POST /v1/human/tool → pluginManager.processToolCall("DailyNoteWrite", args)
      → pluginManager.executePlugin("DailyNoteWrite", input) → spawns dailynote.js.
      No gating or filtering of plugin name at the endpoint level.

  CodexMemoryBridge:
    writable_path_exists: true
    plugin_paths:
      - Plugin/CodexMemoryBridge/codex-memory-bridge.js
        line_4: "const { writeDiary } = require('../DailyNoteWrite/writer-core');"
        summary: >
          Memory bridge plugin. Directly imports writeDiary from DailyNoteWrite.
          Only allows writes from Codex agent context (codex-memory-bridge.js:156),
          but this is a runtime check in the plugin, not at the endpoint level.
    api_paths:
      - AdminPanel-Vue/src/api/codexMemory.ts
        summary: >
          API client includes CodexMemoryWriteSummary, writeCount fields.
    reachable_from_LT06_candidate_route: true
    reachable_proof: >
      POST /v1/human/tool → pluginManager.processToolCall("CodexMemoryBridge", args)
      → pluginManager.executePlugin → spawns codex-memory-bridge.js.
      Plugin name filtering is not performed at the endpoint level.

  PluginSidePath:
    writable_path_exists: true
    plugin_callback_endpoint:
      - server.js:1422 POST /plugin-callback/:pluginName/:taskId
        summary: >
          Async plugin callback endpoint. Can trigger side effects when
          a plugin reports results via callback URL.
    callback_auth_path:
      - Plugin.js:56-61
        summary: >
          Auth code decryption from Plugin/UserAuth/code.bin for admin-required plugins.
          Another potential side effect path if a plugin uses admin credentials.

  writable_path_unreachable_proven: false
  conclusion:
    writable_path_unreachable_proven: false
    blocks_A5_request: true
    reason: >
      DailyNote and CodexMemoryBridge plugins are directly reachable via
      POST /v1/human/tool → pluginManager.processToolCall(). No endpoint-level
      plugin allowlist, no dry-run mode, and no no-write gating exist.
      The CodexMemoryBridge has an internal agent-context check, but this is
      a runtime plugin behavior, not a safe-mode enforcement.
      Until a no-write route or mode is confirmed, any real VCPToolBox call
      risks write side effects.
```
