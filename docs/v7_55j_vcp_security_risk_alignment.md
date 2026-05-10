# v7.55j — VCP Security Risk Alignment

## 1. Purpose

Align v7.55j probe findings with existing cross-repo risk register from v7.55e.

## 2. Risk Alignment

```yaml
vcp_security_risk_alignment:
  schema_version: v1
  phase: v7_55j

  known_risks:
    - id: R001
      name: VCPChat secret in query string
      file: Desktopmodules/api/vcpProxy.js
      detail: >
        vcpServerUrl and vcpApiKey loaded from Electron settings, cached in memory,
        used in Bearer auth. Legacy modules (memo.js, forum.js, groupchat.js) also
        carry vcpApiKey. Secret exposure surface is broad.
      status: open
      prior_phase: v7_55e

    - id: R002
      name: VCPToolBox plugin callback auth boundary
      file: server.js (POST /plugin-callback/:pluginName/:taskId)
      detail: >
        Async plugin callback endpoint. Plugin callbacks can trigger side effects.
        Auth boundary between callback origin and plugin execution is unclear.
      status: open
      prior_phase: v7_55e

    - id: R003
      name: admin secret exposure to plugin env
      file: Plugin.js line 56-61
      detail: >
        Auth code decrypted from Plugin/UserAuth/code.bin for admin-required plugins.
        Plugin environment includes credentials.
      status: open
      prior_phase: v7_55e

    - id: R004
      name: DailyNote writable path
      file: Plugin/DailyNote/dailynote.js
      detail: >
        DailyNote CRUD plugin reachable via POST /v1/human/tool →
        pluginManager.processToolCall("DailyNote", args). No endpoint-level gating.
      status: open
      prior_phase: v7_55e
      updated_in_v7_55j: >
        Reachability confirmed. CodexMemoryBridge also imports writeDiary from
        DailyNoteWrite/writer-core (codex-memory-bridge.js:4).

    - id: R005
      name: CodexMemoryBridge writable path
      file: Plugin/CodexMemoryBridge/codex-memory-bridge.js
      detail: >
        Memory bridge plugin directly imports writeDiary. Reachable via same
        POST /v1/human/tool route.
      status: open
      prior_phase: v7_55e
      updated_in_v7_55j: >
        Reachability confirmed. Internal agent-context check exists at line 156
        but is runtime plugin behavior, not endpoint-level enforcement.

    - id: R006
      name: VCPChat renderer dirty / PR draft baseline
      detail: >
        v7.55i recorded renderer.js dirty and PR #35 as draft.
      status: open
      updated_in_v7_55j: >
        PR #35 remains draft/open/not-merged. b320e39 is base_sha, not merge
        commit. Feature branch renderer.js bridge is evidence candidate only.
        main branch renderer.js baseline unchanged.

    - id: R007
      name: VCPToolBox no read-only mode
      file: server.js, routes/
      detail: >
        No read-only mode, dry-run mode, or safe-mode flag found in server entry
        point, route handlers, or middleware. All endpoints execute as-is.
      status: open
      discovered_in: v7_55j

    - id: R008
      name: VCPToolBox endpoint-level plugin allowlist missing
      file: server.js line 1242
      detail: >
        POST /v1/human/tool accepts any plugin name. No allowlist filtering,
        no dry-run gating, no write-intent inspection before processToolCall.
      status: open
      discovered_in: v7_55j

  current_status:
    mitigated: []
    open:
      - R001 (VCPChat secret in query)
      - R002 (VCPToolBox plugin callback auth boundary)
      - R003 (admin secret exposure)
      - R004 (DailyNote writable path)
      - R005 (CodexMemoryBridge writable path)
      - R007 (VCPToolBox no read-only mode)
      - R008 (VCPToolBox endpoint-level plugin allowlist missing)
```
