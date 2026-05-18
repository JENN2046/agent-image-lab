# v7.57b — Exact Endpoint / Command Candidate Matrix

## 1. Purpose

Catalog all candidate endpoints and commands that could serve as the LT-06 no-write route, and classify each by write capability and confidence.

## 2. Candidate Matrix

```yaml
exact_endpoint_or_command_candidate_matrix:
  schema_version: v1
  phase: v7_57b
  repo: A:\VCP\VCPToolBox-prod-stable
  head: 0a714c9

  candidates:
    - name: POST /v1/human/tool
      type: endpoint
      file: server.js:1211
      confidence: verified
      write_capable: true
      no_write_gate_present: false
      blocks_A5_if_selected: true
      evidence:
        - file: server.js
          line: 1242
          note: >
            Directly calls pluginManager.processToolCall(requestedToolName,
            parsedToolArgs, clientIp). No plugin allowlist, no dry-run check,
            no no-write gating. Accepts any tool name from request body.

    - name: POST /v1/chat/completions
      type: endpoint
      file: server.js:1183
      confidence: candidate
      write_capable: true
      no_write_gate_present: false
      blocks_A5_if_selected: true
      evidence:
        - file: server.js
          line: 1183
          note: >
            Routes to chatCompletionHandler which can trigger ToolCallParser
            for tool call extraction, then plugin execution. Write capability
            depends on whether the conversation context triggers a tool call.

    - name: POST /v1/chatvcp/completions
      type: endpoint
      file: server.js:1197
      confidence: candidate
      write_capable: true
      no_write_gate_present: false
      blocks_A5_if_selected: true
      evidence:
        - file: server.js
          line: 1197
          note: Force VCP info display variant. Same handler as above.

    - name: POST /plugin-callback/:pluginName/:taskId
      type: endpoint
      file: server.js:1422
      confidence: candidate
      write_capable: unknown
      no_write_gate_present: false
      blocks_A5_if_selected: true
      evidence:
        - file: server.js
          line: 1422
          note: >
            Async plugin callback endpoint. Receives POST callbacks from
            long-running plugins. Side effects depend on plugin implementation.
            Auth boundary between callback origin and plugin execution unclear.

    - name: MCP tools/call record_memory
      type: command
      file: routes/codexMemoryMcp.js:264-270
      confidence: verified
      write_capable: true
      no_write_gate_present: false
      blocks_A5_if_selected: true
      evidence:
        - file: routes/codexMemoryMcp.js
          line: 150-174
          note: >
            Calls executeToolCallWithContext({toolName: 'CodexMemoryBridge', ...})
            which delegates to pluginManager.processToolCall. Write-capable by
            design — writes Codex memory through the memory bridge plugin.

    - name: MCP tools/call search_memory
      type: command
      file: routes/codexMemoryMcp.js:176-190
      confidence: verified
      write_capable: false
      no_write_gate_present: true
      blocks_A5_if_selected: false
      evidence:
        - file: routes/codexMemoryMcp.js
          line: 176-190
          note: >
            Calls searchCodexMemory() — semantic search over Codex diary using
            RAG plugin and knowledge base manager. No plugin execution, no write
            side effect observed. Read-only candidate for LT-06.
          caution: >
            search_memory does NOT call processToolCall. It goes through
            searchCodexMemory module directly. Write side effect risk is low
            but depends on RAG plugin implementation (getRagDiaryPlugin).

    - name: MCP tools/call memory_overview
      type: command
      file: routes/codexMemoryMcp.js:191-210
      confidence: verified
      write_capable: false
      no_write_gate_present: true
      blocks_A5_if_selected: false
      evidence:
        - file: routes/codexMemoryMcp.js
          line: 191-210
          note: >
            Calls buildCodexMemoryOverview() — reads file stats, audit data,
            and adaptive profile. No plugin execution, no write side effect
            observed. Read-only candidate for LT-06.

  conclusion:
    exact_LT06_endpoint_or_command_locked: false
    reason: >
      Two read-only MCP candidates identified (search_memory, memory_overview),
      but the candidate LT-06 endpoint (POST /v1/human/tool) is write-capable
      with no gating. MCP route offers read-only tools but requires the MCP
      JSON-RPC transport path, which is a different surface from the original
      LT-06 target. A safe LT-06 no-write endpoint or command has not been
      locked unless the MCP read-only tools are accepted as the execution route.
```
