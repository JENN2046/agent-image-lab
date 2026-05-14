# Native Doubao Output Persistence Guard

## Purpose

This document records the local output persistence rule for Native Doubao generation results.

Provider success is not enough for review or delivery. A run is locally reviewable only after a real local image file exists and passes filesystem verification.

## Required Split

Native Doubao public results must distinguish:

```yaml
provider_request_success: true | false
provider_reported_image_count: number
local_files_written_count: number
local_files_verified_count: number
local_persistence_success: true | false
image_count: local_files_verified_count
image_created: local_persistence_success
```

The provider may report one image while the project reports zero local output images.

## Local File Verification Rule

A file may count as written only when all are true:

```yaml
exists_on_disk: true
is_file: true
size_greater_than_zero: true
inside_authorized_output_directory: true
```

Notes, failed downloads, unsupported payloads, provider URLs, raw response entries, and pending async work must not increment `files_written_count`.

## Zero-File Failure Rule

If `local_files_verified_count == 0`, public result handling must set:

```yaml
status: failed_no_local_output_file
image_created: false
image_count: 0
local_persistence_success: false
human_review_required_now: false
```

No human visual review can start from a zero-file result.

## Retry Boundary

This guard does not authorize retry. A new provider call remains A5 and needs a new explicit authorization package.

## Safety Boundary

```yaml
provider_contact_in_this_guard: false
image_generation_in_this_guard: false
env_local_secret_value_read_in_this_guard: false
memory_write_in_this_guard: false
runs_output_committed: false
```
