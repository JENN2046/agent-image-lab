# v7.58k — Target Identity + Base URL Lock: memory_overview A5 Pre-submission Clarification

> **This phase does not submit the A5 request. It does not authorize LT-06 execution. It only locks the target identity and base URL for the previously prepared A5 request text.**

---

## 1. Problem Statement

v7.58j prepared a complete A5 request text draft for `memory_overview` via `POST /mcp/codex-memory`, but did **not** lock the **base URL**. Two candidate targets exist:

```yaml
candidate_targets:
  VCPToolBox_embedded:
    likely_base_url: http://127.0.0.1:6005
    endpoint: /mcp/codex-memory
    meaning: VCPToolBox 内嵌 MCP route
    status: listening (PID 14788, node.exe)

  standalone_codex_memory:
    likely_base_url: http://127.0.0.1:7605
    endpoint: /mcp/codex-memory
    meaning: 独立 codex-memory HTTP MCP sidecar
    status: listening (PID 15864, node.exe)
```

Without a locked base URL, the A5 request text is ambiguous and must **not** be submitted.

---

## 2. Current v7.58j Status

```yaml
v7_58j_status:
  A5_request_text_prepared: true
  A5_requested: false
  A5_granted: false
  LT06_executed: false
  base_url_locked: false
  exact_payload_locked: true
  exact_endpoint_locked: true
  exact_route_identity_locked: true  # /mcp/codex-memory
```

---

## 3. Target Identity Comparison

| Dimension | VCPToolBox Embedded (6005) | Standalone Codex Memory (7605) |
|-----------|---------------------------|-------------------------------|
| **Port** | 6005 | 7605 |
| **Base URL** | `http://127.0.0.1:6005` | `http://127.0.0.1:7605` |
| **Process** | `node.exe` PID 14788 (VCPToolBox) | `node.exe` PID 15864 (codex-memory) |
| **Route owner** | `server.js` mounts `codexMemoryMcpRoutes` | `src/http-index.js` standalone |
| **LT-06 scope** | VCPToolBox real read-only dry-run | Codex Memory MCP sidecar observe |
| **Zero-write guarantee** | Mixed: also serves write-capable routes | Dedicated MCP server |
| **Discovery surface** | Full VCPToolBox API surface | MCP-only |

---

## 4. Decision Record

```yaml
target_identity_decision:
  base_url_locked: false
  A5_request_ready_to_submit: false
  reason: base URL not yet selected by user
  candidate_targets:
    - VCPToolBox_embedded_6005
    - standalone_codex_memory_7605
```

### Recommendation

```yaml
recommendation:
  if_goal_is_LT06_VCPToolBox_read_only_dry_run:
    preferred_target: VCPToolBox_embedded_6005
    reason: LT-06 名义上是 VCPToolBox real read-only dry-run; VCPToolBox 内嵌 MCP 路由是原始目标

  if_goal_is_Codex_Memory_sidecar_observe_probe:
    preferred_target: standalone_codex_memory_7605
    reason: codex-memory 独立仓库默认 HTTP MCP 是 7605; 更纯粹的 MCP 隔离观测
```

---

## 5. Constraints

- v7.58j A5 request text **must not be submitted** until base URL is locked.
- Any base URL selection must be explicitly confirmed by the user.
- Confirming base URL does **not** authorize execution.
- Non-MCP preflight (port check, health check) is allowed, but **must not call** `/mcp/codex-memory`.

---

## 6. Next Required Step

After this phase:
1. User selects one base URL.
2. v7.58j A5 request text is patched to include the exact base URL.
3. User submits the independent A5 request separately.
4. Only then may LT-06 execution proceed.
