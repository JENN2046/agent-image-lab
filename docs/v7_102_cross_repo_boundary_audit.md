# v7.102 — Cross-repo Boundary Audit

> **Horizontal boundary audit across agent-image-lab, VCPChat, and VCPToolBox. Confirms current evidence chain is not mis-extrapolated to production, memory write, or submitDraft write paths. All actionable boundaries documented. No new permissions granted.**
>
> **agent-image-lab、VCPChat、VCPToolBox 三方横向边界审计。确认当前证据链没有被误外推到生产、记忆写入或 submitDraft 写路径。所有可操作边界已记录。未授予新权限。**

---

## 1. Executive Summary

This audit examines the current boundaries between the three repositories in the VCP ecosystem: agent-image-lab (evidence harness and governance), VCPChat (Electron runtime and bridge surface), and VCPToolBox (backend/memory/plugin substrate). The audit confirms that all read-only probe evidence is properly scoped and does not imply authorization for write paths, production generation, or memory operations. Four risks are identified and documented with governance requirements. No boundary changes are authorized by this document.

---

## 2. Repo Roles

### 2.1 agent-image-lab

| Role | Detail |
|------|--------|
| Type | Evidence harness, governance docs, validation scripts |
| Bridge evidence produced | VCPChat `imageLabReview` read-only surface confirmed (cancel, loadSession, previewDraft) |
| submitDraft finding | Permanently forbidden |
| Is production writer | `false` |
| Is memory writer | `false` |
| Is runtime executor | `false` (A5 authorization required per-action) |

### 2.2 VCPChat

| Role | Detail |
|------|--------|
| Type | Electron runtime, UI bridge surface |
| Bridge surface | `window.imageLabReview` |
| Read-only methods | cancel, loadSession, previewDraft |
| Write-capable method | submitDraft (permanently forbidden) |
| CDP target fingerprint | `A83B8623` |
| Electron running | Confirmed (5 processes observed) |

### 2.3 VCPToolBox

| Role | Detail |
|------|--------|
| Type | Backend/tool/memory/plugin runtime substrate |
| MCP endpoints | Available but not currently authorized |
| memory write | Permanently forbidden in current scope |
| DailyNote write | Permanently forbidden in current scope |
| Plugin execution | Permanently forbidden in current scope |
| Memory read (memory_overview) | Previously consumed LT-06 A5 (v7.59); requires new A5 for second call |

---

## 3. Boundary Matrix

| Action | Allowed now | Evidence source | Required future authorization |
|--------|-------------|-----------------|-------------------------------|
| VCPChat cancel({}) | ✅ | v7.93 probe | New A5-style authorization |
| VCPChat loadSession({}) | ✅ | v7.96 probe | New A5-style authorization |
| VCPChat previewDraft({}) | ✅ | v7.99 probe | New A5-style authorization |
| VCPChat submitDraft | ❌ permanently_forbidden | v7.64 static review | Never — permanently forbidden |
| CDP /json access (instrumental) | ✅ | v7.87 governance rule | Included in WebSocket auth |
| CDP WebSocket connect | ✅ | v7.87 probe | New A5-style authorization |
| Runtime.evaluate (bridge surface check) | ✅ | v7.90 probe | New A5-style authorization |
| MCP memory_overview (LT-06) | ❌ A5 consumed | v7.59 closeout | New independent A5 |
| MCP search_memory | ❌ blocked | v7.58h zero-write policy | Not scoped |
| MCP record_memory | ❌ excluded | v7.58 zero-write policy | Not scoped |
| VCPToolBox native routes | ❌ blocked | v7.55j boundary probe | Not scoped |
| production_candidate_002 | ❌ | v7.100 closeout | New A5-style authorization |
| DailyNote write | ❌ | Global boundary | New A5-style authorization |
| VCP memory write | ❌ | Global boundary | New A5-style authorization |
| Image generation | ❌ | Global boundary | New A5-style authorization |

---

## 4. Current Confirmed Boundaries

- **VCPChat read-only bridge methods confirmed**: cancel({}), loadSession({}), previewDraft({}) all return object-type acknowledgments with empty payloads.
- **submitDraft permanently forbidden**: The write-capable method is excluded from all current and planned authorization scopes.
- **No write path touched**: All probes were read-only. No DailyNote, VCP memory, or file writes occurred.
- **No raw payload recorded**: All bridge method return values were reported as redacted summary only.
- **CDP / Runtime.evaluate used only under controlled probe chain**: Each step (port check → endpoint lock → target discovery → fingerprint lock → WebSocket → evaluate) was individually authorized.
- **v7.87 instrumental /json variance resolved**: Governance rule updated to explicitly include instrumental /json access in future WebSocket connect authorizations.

---

## 5. Non-permissions

| Permission | Status |
|-----------|--------|
| production_candidate_002_allowed_now | `false` |
| memory_write_path_allowed_now | `false` |
| submitDraft_invocation_allowed | `false` |
| second_LT06_allowed_now | `false` |
| DailyNote_write_allowed_now | `false` |
| VCP_memory_write_allowed_now | `false` |
| image_generation_allowed_now | `false` |

---

## 6. Risk Findings

### Risk 1: VCPChat read-only success must not imply submitDraft safety

- **Description**: The successful probe of cancel, loadSession, and previewDraft confirms the bridge surface is live and functional. This must not be interpreted as evidence that submitDraft is safe.
- **Mitigation**: submitDraft is documented as write_capable by design intent (DailyNote + VCP memory submission). The v7.64 static review confirmed its handler returns `{ draft_received: true, stored: false, submitted_to_daily_note: false, submitted_to_vcp_memory: false }` — even if blocked in the current implementation, the design intent makes it permanently forbidden.
- **Status**: Closed — documented in v7.64 and reinforced in v7.100.

### Risk 2: VCPChat surface success must not imply VCPToolBox memory write readiness

- **Description**: Confirming the VCPChat bridge surface works does not mean the VCPToolBox memory/plugin backend is ready for writes.
- **Mitigation**: Explicitly separated under current non-permissions. VCPToolBox memory write, DailyNote write, and plugin execution remain blocked.
- **Status**: Closed — documented in boundary matrix.

### Risk 3: CDP probe success must not imply general CDP automation permission

- **Description**: The successful CDP WebSocket connection and Runtime.evaluate probes were scoped to specific authorized expressions. This does not authorize general CDP automation.
- **Mitigation**: All CDP probes used exact expressions with `returnByValue: true` and no state mutation. Permanent restrictions on arbitrary code execution, file read, and state mutation remain.
- **Status**: Closed — explicitly documented in v7.89 execution gate and reinforced in v7.100.

### Risk 4: agent-image-lab evidence docs must not become runtime authority by themselves

- **Description**: The evidence docs (v7.90–v7.101) document what was done and found. Reading them must not authorize re-execution.
- **Mitigation**: Every phase explicitly states `execution_authorized: false` and `runtime_execution: false` in the closeout. All bridge method calls require explicit A5-style authorization per invocation.
- **Status**: Closed — pattern enforced across all phases.

---

## 7. Governance Requirements

1. **Every runtime action still needs exact authorization.** Past probe success does not create standing permission.
2. **Every write-capable path needs separate A5-style authorization.** submitDraft, DailyNote write, VCP memory write, plugin execution are all write-capable paths requiring independent auth.
3. **Raw payload / raw memory / full private runtime data remain forbidden unless separately authorized.** This applies to MCP responses, CDP responses, bridge method return values, and file contents.
4. **Future reports must preserve public/private trace separation.** Evidence reports (public) must not contain raw runtime data. Runtime execution records (private) must remain redacted.

---

## 8. Recommended Next

| Priority | Phase | Description |
|----------|-------|-------------|
| ✅ Recommended | **v7.103** | Boundary matrix hardening / redaction validator planning |
| ❌ Not recommended | production_candidate_002 | Requires new A5-style authorization |
| ❌ Not recommended | memory_write_path | Requires new A5-style authorization |
| ❌ Not recommended | submitDraft probe | Permanently forbidden |
