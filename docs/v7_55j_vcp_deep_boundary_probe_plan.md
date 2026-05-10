# v7.55j — VCP Deep Boundary Probe Plan

## 1. Purpose

Deep read-only probe of local VCPToolBox and VCPChat repos to discover missing evidence for real LT-06 read-only dry-run execution.

## 2. Plan

```yaml
vcp_deep_boundary_probe_plan:
  schema_version: v1
  phase: v7_55j
  status: read_only_probe_only
  execution_performed: false
  authorization_requested: false
  A5_requested: false

  target_repos:
    VCPToolBox: A:\VCP\VCPToolBox-prod-stable
    VCPChat: A:\VCP\VCPChat

  probe_goals:
    - find exact VCPToolBox no-write endpoint_or_command candidates
    - map DailyNote / CodexMemoryBridge writable paths
    - assess whether writable paths are unreachable from LT06 route
    - review VCPChat PR35 no-write bridge evidence
    - review VCPChat secret / bridge risks

  allowed_commands:
    - git status/log/rev-parse
    - git grep
    - git show
    - git diff
    - Select-String / Get-Content (read-only)

  forbidden:
    - LT-06 execution
    - A5 request
    - real VCPToolBox endpoint call
    - VCPChat bridge call
    - Electron / remote-debug / CDP
    - node server / npm install/run
    - DailyNote / VCP memory write
    - image generation / binary read
    - VCPToolBox / VCPChat file modification
```

## 3. Probe Order

1. VCPToolBox no-write endpoint / command candidates (grep endpoint + mode patterns)
2. VCPToolBox DailyNote / CodexMemoryBridge writable paths (grep plugin + API paths)
3. VCPChat PR #35 bridge surface (git show + diff + grep)
4. VCPChat secret / bridge risks (grep auth + electron security)
5. Risk alignment and gate update
6. Closeout

## 4. Current State

```yaml
current_baseline:
  agent_image_lab_head: c6f765a
  prior_phase: v7_55i
  prior_head: 79717d2
  evidence_gap_closed: true
  real_LT06_execution_ready: false
  request_A5_now: false
```
