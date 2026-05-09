# v7.49 VCP Memory Write Boundary Spec

## 1. Purpose

定义哪些内容未来可以写入 VCP memory，哪些内容永远不能写入。

## 2. Allowed Memory Content

```yaml
allowed_memory_content:
  - case_title
  - prompt_package_id
  - production_readiness
  - final_asset_status
  - human_review_summary_cn
  - known_minor_issues
  - image_path_reference
  - image_sha256_if_available
  - review_doc_ref
  - prompt_doc_ref
  - created_phase
  - reviewer_decision
```

## 3. Forbidden Memory Content

以下内容永远不能写入 VCP memory：

```yaml
forbidden_memory_content:
  - image_binary
  - raw_image_file
  - api_key
  - token
  - cookie
  - raw_request_payload
  - raw_response_payload
  - provider_endpoint
  - private_local_absolute_path
  - customer_private_data
  - unreviewed_generation_output
  - rejected_asset_as_success_memory
```

## 4. Memory Write Authorization Level

- memory write 需要独立 A5 授权
- 一次授权只允许一次写入
- memory write 不等于 production approval
- 写入后必须 canonical location 校验

## 5. Canonical Location Verification

- VCP DailyNote 写入后，必须确认文件在 canonical 位置存在
- 必须确认文件 sha256 hash 匹配预期
- `plugin_success` 返回值不足以判定写入完成

参考：`docs/214_v10_28_dailynote_canonical_location_guard.md`

## 6. Rejected Asset Policy

- asset_status 为 rejected 的生成结果，不得写入 VCP memory
- rejected 资产只能在 failure registry 中记录脱敏摘要
- 任何情况下不得将 rejected asset 标记为 memory write success
