# Next 14-Day Route Options

base_contract: AGENTS.md
source_phase: v0_4_7_seven_day_visual_workflow_checkpoint
status: route_options_only

## Option A - Dry-run Review Semantics

Continue local-only dry-run hardening:

- add more metadata-only review examples
- expand negative cases for provenance drift
- compare patch/reject/hold routes without provider calls

Boundary: no image generation, no memory write, no real executor.

## Option B - Manual Guarded Push Package

Prepare a manual guarded push review package for the local commits from
v0.4.1 through v0.4.7.

Boundary: push remains Push_L3 manual guarded until the owner explicitly
authorizes the remote write.

## Option C - Future A5 Preflight Draft

Draft a future A5 preflight packet that would later allow a bounded real visual
evaluation action.

Boundary: draft only. No provider call, no plugin/API call, no image generation,
no VCP memory write, no DailyNote write, and no runtime execution.

## Recommended Route

Recommended next: Option B if the owner wants remote backup/review of the local
checkpoint chain; otherwise Option A is the safest continuation.
