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

## Timestamp Evidence Policy

Timestamp evidence must keep provider contact evidence separate from local artifact evidence:

```yaml
provider_api_platform_time:
  meaning: primary evidence for provider contact
  v8_021: "2026-05-14 12:41:47"
  v8_027: "2026-05-14 14:01:44"

local_artifact_time:
  meaning: runner artifact-side evidence
  v8_021_local_output_file_time: "2026-05-14 12:39:14.203 +08:00"
  v8_027_local_output_directory_time: "2026-05-14 13:57:02.216 +08:00"
```

Do not use the provider API platform time and local file or directory time as strict standalone proof of causal order. They come from different evidence surfaces and may differ because of clock sources, provider processing time, download timing, local directory creation, and persistence behavior.

For v8.027, the decisive finding remains the output persistence anomaly: HTTP 200 and runner-reported generated output did not produce any verified local file.

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
