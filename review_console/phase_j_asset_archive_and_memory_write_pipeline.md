# Phase J Asset Archive & Memory Write Pipeline

把 Phase F 生成结果转成可复用的资产索引和记忆写入申请流程。本阶段只做本地文档、模板和 preflight 设计，不执行真实 DailyNote/VCP memory 写入。

```yaml
phase_j:
  status: completed_local_pipeline_design
  timestamp: "2026-05-08"
  phase: "Phase J — Asset Archive & Memory Write Pipeline"
  real_execution: false
  daily_note_called: false
  vcp_memory_written: false
  image_created: false
```

## 1. Pipeline Overview

```text
Generation (F4) → Review (F5) → Asset Metadata Record → Archive Candidate
                                                            │
                     ┌──────────────────────────────────────┘
                     ▼
              Memory Delta Draft (F6)
                     │
                     ▼
         Human Approval Gate ──→ Archivist Review
                     │
                     ▼
            DailyNote Write Preflight
                     │
                     ▼
           Real DailyNote Write (A5 gated)
                     │
                     ▼
           Write Completion Verification
```

## 2. Asset Metadata Record Schema

每次 accepted_candidate 产出的资产元数据模板：

```yaml
asset_metadata:
  asset_id: string            # 格式: "asset-{plugin}-{run_label}-{sha256_short}"
  created_at: string (ISO)
  source:
    phase: string             # "phase_f" 等
    run_label: string         # "run_1", "run_2"
    plugin_id: string         # "DoubaoGen"
    plugin_command: string    # "generate"
    prompt_id: string         # "a5_portrait_prompt_v1"
    prompt_hash_utf8: string  # sha256

  file:
    relative_path: string     # "runs/phase_f_f4_portrait_generation/run_1/image/doubaogen/xxx.jpg"
    bytes: number
    sha256: string
    mime_type: "image/jpeg"
    resolution: "1024x1024"

  review:
    verdict: "accepted_candidate" | "needs_human_review" | "rejected"
    prompt_subject_match: boolean
    person_or_face_detected: boolean
    readable_text_or_logo_detected: boolean
    brand_or_device_marks: boolean
    face_distorted_or_unrealistic: boolean
    score: number (0-100)
    review_summary_cn: string
    strengths_cn: string
    weaknesses_cn: string

  approval:
    human_reviewed: boolean
    human_approved: boolean
    approved_by: string | null
    approved_at: string | null
    override_applied: boolean
    override_reason_cn: string | null

  archive:
    archive_status: "metadata_only_no_binary"
    binary_stored_in_git: false
    binary_stored_in_memory: false
    closeout_template: "accepted_candidate" | "needs_human_review" | "rejected"
    reusable_rules_cn: string

  memory_link:
    memory_delta_id: string | null
    should_write_to_vcp: false
    write_requested: false
    write_authorized: false
```

### Phase F Run 1 Example (filled)

```yaml
asset_metadata_example:
  asset_id: "asset-DoubaoGen-run_1-06491ceb"
  created_at: "2026-05-08T12:00:00+08:00"
  source:
    phase: "phase_f"
    run_label: "run_1"
    plugin_id: "DoubaoGen"
    plugin_command: "generate"
    prompt_id: "a5_portrait_prompt_v1"
    prompt_hash_utf8: "bb5928fe9d3f0d8c90ad5db401eba5336a789dc1cc028e6553a10167ab6befe7"
  file:
    relative_path: "runs/phase_f_f4_portrait_generation/run_1/image/doubaogen/9745d771-d47b-45f4-8f0c-fe2dddf69fa7.jpg"
    bytes: 212306
    sha256: "06491cebdfc3570a9194b98a08883d689e5d1d5b20ce2aab12c6c8e9c9b590b4"
    mime_type: "image/jpeg"
    resolution: "1024x1024"
  review:
    verdict: "accepted_candidate"
    prompt_subject_match: true
    person_or_face_detected: true
    readable_text_or_logo_detected: false
    brand_or_device_marks: false
    face_distorted_or_unrealistic: false
    score: 85
    review_summary_cn: "亚洲女性专业半身人像，正面构图，面部清晰自然，灰背景干净，无文字/logo/品牌标识。"
    strengths_cn: "面部五官清晰，皮肤质感真实，构图专业，光影柔和均匀。"
    weaknesses_cn: "无明显缺陷。"
  approval:
    human_reviewed: true
    human_approved: true
    approved_by: "user"
    approved_at: "2026-05-08T12:00:00+08:00"
    override_applied: false
    override_reason_cn: null
  archive:
    archive_status: "metadata_only_no_binary"
    binary_stored_in_git: false
    binary_stored_in_memory: false
    closeout_template: "accepted_candidate"
    reusable_rules_cn: "人像 prompt 使用正向描述，明确禁止文字/logo/水印。浅灰背景适合职业照。"
  memory_link:
    memory_delta_id: "memory_delta_phase_f_f4_run_1"
    should_write_to_vcp: false
    write_requested: false
    write_authorized: false
```

## 3. Archivist / ImageLab_Master Approval Records

### 3.1 Archivist (资产归档员)

```yaml
archivist_role:
  name: "Archivist"
  responsibility: "资产元数据完整性校验，归档状态管理"
  checks:
    - "asset_id 唯一且格式正确"
    - "sha256 与本地文件一致"
    - "review verdict 与 review criteria 一致"
    - "no binary in Git or VCP memory"
    - "archive_status = metadata_only_no_binary"
    - "closeout_template 匹配 verdict"
  forbidden:
    - "保存图片二进制"
    - "修改原始生成文件"
    - "绕过审批直接标记 accepted"
  approval_record:
    archivist_id: string
    asset_id: string
    verified_at: string (ISO)
    all_checks_passed: boolean
    issues_found: list
    archivist_notes_cn: string
```

### 3.2 ImageLab_Master (视觉生产主管)

```yaml
imagelab_master_role:
  name: "ImageLab_Master"
  responsibility: "最终审批：资产质量 + 记忆写入授权"
  checks:
    - "Archivist 审批已通过"
    - "human_review 已完成"
    - "memory_delta draft 已生成"
    - "memory_delta.chinese_diary_content 为中文正文"
    - "memory_delta 不含敏感信息"
    - "should_write_to_vcp 仅在显式授权后为 true"
  forbidden:
    - "绕过 Archivist 直接归档"
    - "在 memory_approval 未通过时触发 DailyNote 写入"
    - "修改 AI 评分以掩盖审片问题"
  approval_record:
    master_id: string
    asset_id: string
    memory_delta_id: string
    approved_at: string (ISO)
    archivist_check_passed: boolean
    memory_write_authorized: boolean
    max_writes_authorized: number
    master_notes_cn: string
```

## 4. DailyNote Write Preflight

```yaml
dailynote_write_preflight:
  preflight_id: string
  asset_id: string
  memory_delta_id: string
  created_at: string (ISO)

  pre_checks:
    - check: "Archivist 审批通过"
      status: required
    - check: "ImageLab_Master 审批通过"
      status: required
    - check: "memory_delta 中文正文完整"
      status: required
    - check: "memory_delta.safety 全部 false"
      status: required
    - check: "no forbidden_outputs in content"
      status: required
    - check: "canonical_location 已配置"
      status: required
    - check: "writer (DailyNoteWrite) 路径已确认"
      status: required
    - check: "external VCPToolBox worktree clean"
      status: required

  write_config:
    writer: "DailyNoteWrite"
    max_writes: 1
    max_retry: 0
    content_language: "chinese_only"
    no_success_fabrication: true

  post_checks:
    - check: "canonical file exists"
      required: true
    - check: "canonical sha256 matches"
      required: true
    - check: "plugin_success_sufficient = false"
      required: true
    - check: "wrong_location labeled correctly"
      required: true

  rollback:
    on_failure: "record failure, do not retry"
    on_hash_mismatch: "label plugin_success_wrong_location, block completion"
    state_restoration: "revert write_authorized to false"
```

## 5. Forbidden Outputs (Archive & Memory Pipeline)

```yaml
forbidden_outputs:
  - "图片二进制写入 Git"
  - "图片二进制写入 VCP memory"
  - "raw plugin output 写入记忆正文"
  - "raw endpoint / websocket URL"
  - "raw local path (插件路径、输出路径原文)"
  - "secret / token / cookie / password"
  - "customer_private_data"
  - "英文 prompt 作为记忆正文"
  - "未审批的 should_write_to_vcp=true"
```

## 6. Integration Points

```yaml
integration:
  with_phase_f:
    - "Phase F run_1 memory_delta_draft — ready for Archivist review"
    - "Phase F run_2 — can be archived as secondary candidate"

  with_runtime_prototype:
    - "asset_archive_candidate_draft — already rendered in UI"
    - "memory_write_completion_candidate_draft — already rendered in UI"
    - "real_memory_write_authorization_package_draft — already rendered in UI"

  with_batch_6a_6b:
    - "memory_write_completion_candidate (Batch 6A) — canonical verification rules"
    - "real_memory_write_authorization_package (Batch 6B) — write limits and content rules"

  with_docs_231:
    - "memory section of consolidation template — maps to this preflight"
```

## 7. Hard Authorization Gates

以下操作需要独立 A5 授权包：

```yaml
a5_gates:
  - action: "真实 DailyNote 写入"
    requires: "dailynote_write_preflight all passed + active A5 package"
  - action: "真实 VCP memory 写入"
    requires: "same as DailyNote write + vcp_memory_write_allowed=true"
  - action: "批量资产归档到长期记忆"
    requires: "per-asset Archivist + ImageLab_Master approval"
```

## 8. Validation

```yaml
phase_j_validation:
  - "node scripts/validate_runtime_prototype_suite.js"
  - "node scripts/validate_agent_board_state.js"
  - "git diff --check"
```

## 9. Acceptance

```yaml
phase_j_acceptance:
  asset_metadata_schema_defined: true
  archive_pipeline_documented: true
  archivist_role_defined: true
  imagelab_master_role_defined: true
  dailynote_write_preflight_defined: true
  forbidden_outputs_documented: true
  a5_gates_explicit: true
  no_real_execution: true
```
