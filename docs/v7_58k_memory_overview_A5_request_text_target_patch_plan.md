# A5 Request Text Target Patch Plan — memory_overview

> Plan for patching the v7.58j A5 request text once the user selects a base URL.

## Current Gap

v7.58j request text specifies:
- ✅ endpoint path: `/mcp/codex-memory`
- ✅ JSON-RPC method: `tools/call`
- ✅ tool name: `memory_overview`
- ✅ exact payload: locked
- ❌ base URL: **not specified**

## Patch Required

Once user selects a target, patch the v7.58j request text and YAML to add:

```yaml
exact_base_url: <user_selected_base_url>
exact_endpoint_url: <user_selected_base_url>/mcp/codex-memory
```

## Concrete Patch Candidates

### Option A: VCPToolBox Embedded (6005)

```yaml
exact_base_url: http://127.0.0.1:6005
exact_endpoint_url: http://127.0.0.1:6005/mcp/codex-memory
```

### Option B: Standalone Codex Memory (7605)

```yaml
exact_base_url: http://127.0.0.1:7605
exact_endpoint_url: http://127.0.0.1:7605/mcp/codex-memory
```

## No Other Changes Needed

The exact payload, forbidden methods, one-call policy, response redaction policy, abort conditions, and closeout fields from v7.58j are all base-URL-independent and remain valid regardless of which target is selected.
