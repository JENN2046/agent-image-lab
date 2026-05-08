# Phase K Multi-Plugin Candidate Evaluation

从单插件 DoubaoGen 扩展到多插件候选评估框架。本阶段只做本地矩阵、评分维度和 dry-run fixture 设计，不调用真实插件，不读取真实 manifest。

```yaml
phase_k:
  status: completed_local_evaluation_framework
  timestamp: "2026-05-08"
  phase: "Phase K — Multi-Plugin Candidate Evaluation"
  real_execution: false
  plugin_called: false
  manifest_read: false
```

## 1. Plugin Candidate Matrix

```yaml
plugin_candidates:
  - id: "DoubaoGen"
    status: "evaluated"
    category: "text-to-image"
    provider: "火山引擎"
    model_tested: "doubao-seedream-3-0-t2i-250415"
    model_requested: "doubao-seedream-5-0-260128"
    calls_completed: 8
    accepted_assets: 2
    rejection_rate: "75%"
    known_issues:
      - "模型版本回退 (5.0→3.0)"
      - "中文 prompt 人像/文字敏感"
      - "早期静物 prompt 设计失败"
    strengths:
      - "中日文 prompt 支持"
      - "1024x1024 输出"
      - "响应速度稳定"
      - "人像质量可接受"

  - id: "GPTImageGen"
    status: "evaluated"
    category: "text-to-image"
    provider: "OpenAI-compatible"
    model_tested: "unknown (v0.10)"
    calls_completed: 2
    accepted_assets: 0
    rejection_rate: "100%"
    known_issues:
      - "生成内容脱敏失败"
      - "logger 输出包含敏感信息"
      - "raw output 包含可读数据"
    strengths:
      - "API 兼容性好"
      - "配置简单"

  - id: "PhotoStudioOS"
    status: "planning_only"
    category: "image-editing"
    provider: "local"
    calls_completed: 0
    notes: "Photo Studio OS 编辑/优化管线，当前仅 dry-run rehearsal"

  - id: "StableDiffusion"
    status: "candidate"
    category: "text-to-image"
    provider: "Stability AI / local"
    calls_completed: 0
    notes: "未来候选，需 manifest 审查"

  - id: "Midjourney"
    status: "candidate"
    category: "text-to-image"
    provider: "Midjourney (via API proxy)"
    calls_completed: 0
    notes: "未来候选，需 API proxy + manifest 审查"
```

## 2. Manifest Review Gate (Per Plugin)

```yaml
manifest_review_gate:
  for_each_new_plugin:
    step_1:
      action: "识别唯一候选 manifest 文件"
      allowed: "只读脱敏引用格式"
      forbidden: "raw manifest 原文、API key、endpoint、私密路径"

    step_2:
      action: "脱敏审查"
      output:
        - "插件显示名摘要（中文）"
        - "命令集合（中文摘要）"
        - "输入输出模式（中文摘要）"
        - "权限风险（中文摘要）"
        - "Gatekeeper 风险点"
      forbidden:
        - "raw manifest 原文"
        - "API key / token / cookie / password"
        - "endpoint / webhook 原文"
        - "私密路径"
        - "客户隐私"

    step_3:
      action: "推进状态"
      transitions:
        pending_manifest_review → manifest_reviewed_safe
        pending_manifest_review → rejected
      blocked: "不进入 dry_run_checked / tested / execution_ready"

    requires: "用户单独授权 per-plugin"
```

## 3. Dry-Run Dispatch Comparison Fixture

```yaml
dispatch_comparison_fixture:
  purpose: "在 dry-run 阶段比较多插件候选，不调用真实插件"

  schema:
    comparison_id: string
    created_at: string (ISO)
    task_id: string
    prompt_id: string

    candidates:
      - plugin_id: string
        manifest_status: "manifest_reviewed_safe | pending | rejected"
        dry_run_result:
          execution_blocked: true
          selected_plugin: null
          max_plugin_calls: 0
          capability_matrix_status: string
          gatekeeper_risk_level: "low | medium | high"
          review_console_required: true
          estimated_outputs: number
        scores:
          capability_match: number (0-100)
          risk_score: number (0-100, lower=better)
          prompt_compatibility: number (0-100)
          model_quality_estimate: number (0-100)
        recommendation: "recommended | acceptable | not_recommended"
        reason_cn: string

  example:
    comparison_id: "dispatch-compare-portrait-001"
    prompt_id: "a5_portrait_prompt_v1"
    candidates:
      - plugin_id: "DoubaoGen"
        manifest_status: "manifest_reviewed_safe"
        scores:
          capability_match: 90
          risk_score: 20
          prompt_compatibility: 85
          model_quality_estimate: 80
        recommendation: "recommended"
        reason_cn: "已验证人像生成，质量可接受。唯一问题是模型版本回退。"
      - plugin_id: "GPTImageGen"
        manifest_status: "manifest_reviewed_safe"
        scores:
          capability_match: 75
          risk_score: 60
          prompt_compatibility: 70
          model_quality_estimate: 50
        recommendation: "not_recommended"
        reason_cn: "之前脱敏失败，不适合当前 prompt 类型。"
```

## 4. Visual Scoring Dimensions

```yaml
visual_scoring:
  dimensions:
    - id: "stability"
      label_cn: "生成稳定性"
      scale: "0-100"
      description: "同一 prompt 多次生成的一致性"

    - id: "composition_deviation"
      label_cn: "构图偏差"
      scale: "0-100 (lower=better)"
      description: "与 prompt 描述的构图偏离程度"

    - id: "text_contamination"
      label_cn: "文字污染"
      scale: "0-100 (lower=better)"
      description: "生成图中出现意外文字/logo/水印的严重程度"

    - id: "style_consistency"
      label_cn: "风格一致性"
      scale: "0-100"
      description: "生成图的风格是否符合 prompt 指定的风格"

    - id: "failure_type"
      label_cn: "失败类型"
      values:
        - "none"
        - "prompt_mismatch"
        - "person_face_unexpected"
        - "text_logo_detected"
        - "brand_device_mark"
        - "face_distorted"
        - "composition_wrong"
        - "color_lighting_off"
        - "model_version_mismatch"
        - "plugin_error"

    - id: "overall_quality"
      label_cn: "综合质量"
      scale: "0-100"
      computed_from: ["stability", "composition_deviation", "text_contamination", "style_consistency"]
```

## 5. Gatekeeper Risk Classification

```yaml
gatekeeper_risk:
  levels:
    low:
      conditions:
        - "manifest_reviewed_safe"
        - "dry-run passed"
        - "no sensitive fields in prompt or output"
        - "plugin previously used successfully"
      auto_allowed: false

    medium:
      conditions:
        - "new plugin, manifest reviewed"
        - "prompt contains borderline terms"
        - "plugin has known limitations"
      requires: "Gatekeeper review + human confirmation"

    high:
      conditions:
        - "unreviewed manifest"
        - "prompt contains risky terms"
        - "plugin previously failed/rejected"
        - "output size/format unknown"
      requires: "Gatekeeper review + ImageLab_Master review + human approval"
      auto_blocked: true

    critical:
      conditions:
        - "manifest rejected"
        - "plugin known to produce unsafe output"
        - "prompt contains forbidden terms"
      permanently_blocked: true
```

## 6. Hard Authorization Gates

```yaml
a5_gates:
  - "读取真实 manifest → per-plugin 独立授权"
  - "调用新插件 → active A5 package with plugin-specific fields"
  - "批量生成 → per-batch authorization with call limits"
  - "插件候选矩阵中的 recommended 标记不是执行授权"
```

## 7. Acceptance

```yaml
phase_k_acceptance:
  plugin_matrix_defined: true
  manifest_review_gate_defined: true
  dispatch_comparison_fixture_defined: true
  visual_scoring_dimensions_defined: true
  gatekeeper_risk_classified: true
  a5_gates_explicit: true
  real_execution: false
```
