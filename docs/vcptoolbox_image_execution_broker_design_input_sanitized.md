# VCPToolBox Image Execution Broker Design Input - Sanitized

```yaml
source_id: vcptoolbox_image_execution_broker_design_input_sanitized_20260609
source_type: sanitized_repo_local_design_input
private_local_path_recorded: false
raw_source_copied: false
source_draft_use: sanitized_repo_local_design_input
```

## Purpose

This repo-local note preserves the reusable design decisions from the external
Image Execution Broker draft without recording a private local download path or
copying raw external source text into Agent Image Lab.

## Sanitized Decisions

```text
Route = transport
Activation = permission
VisualJobContract = intent
Broker = execution coordinator
Delegate = provider boundary
RestrictedPluginFacade = plugin safety boundary
Artifact/Receipt = evidence
ReviewQueue = production gate
MemoryCandidate = delayed, reviewed, non-default
```

## Boundary

This note is design input only. It does not authorize VCPToolBox reads or
writes, route HTTP, provider/plugin/API calls, image generation, memory writes,
dependency changes, commits, pushes, tags, releases, or deployments.
