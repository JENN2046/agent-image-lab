# v7.50c VCP Read-only Bridge Dry-run Planning

## 1. Purpose

本文件定义未来 read-only bridge dry-run 的规划。
本阶段不执行 dry-run。
本阶段不调用 VCPToolBox。
本阶段不调用 VCPChat bridge。
本阶段只定义未来真实 dry-run 的输入、输出、边界、安全门和停止条件。

## 2. Current Preconditions

```yaml
preconditions:
  v7_50a_local_schema_validation: passed
  v7_50b_mock_payload_validation: passed
  real_bridge_call_performed: false
  vcp_call_performed: false
  vcpchat_bridge_call_performed: false
  memory_write_performed: false
  dailynote_write_performed: false
  image_binary_read: false
```

## 3. Dry-run Definition

read-only bridge dry-run 的未来目标是验证：

- VCPChat / Review Console 能否只读请求 Agent Image Lab 的 text-only refs
- Agent Image Lab 能否返回 sanitised text-only references
- bridge 不返回图片二进制
- bridge 不返回 secrets
- bridge 不触发写入
- bridge 不把 stable_candidate / accepted_with_minor_warning 当成 production_approved

## 4. Future Dry-run Flow

```text
VCPChat / Review Console dry-run request
→ read-only bridge adapter
→ Agent Image Lab evidence index
→ sanitized text-only response
→ human-visible review surface
→ no write
→ no memory
→ no image binary
```

## 5. Dry-run Inputs

```yaml
dry_run_input:
  bridge_mode: read_only
  case_id: french_summer_rattan_bag_v3_production_candidate_001
  requested_resources:
    - project_state
    - production_candidate_review
    - memory_write_skip_closeout
    - bridge_contract
    - bridge_security_gates
    - memory_boundary
  write_intent: false
  image_binary_requested: false
  secrets_requested: false
```

## 6. Dry-run Expected Output

```yaml
expected_output:
  status: ok
  payload_type: text_only_refs
  image_binary_included: false
  secrets_included: false
  write_performed: false
  memory_write_performed: false
  daily_note_write_performed: false
  returned_resource_refs:
    - README.md
    - .agent_board/CHECKPOINT.md
    - production/reviews/v7_53_french_summer_rattan_bag_v3_production_candidate_001_review.md
    - production/closeouts/v7_56_french_summer_rattan_bag_v3_production_candidate_001_memory_write_skip_closeout.md
    - docs/v7_50_vcp_read_only_bridge_contract.md
    - docs/v7_50_vcp_read_only_bridge_security_gates.md
```

## 7. Stop Line

- 本文件不授权 dry-run execution
- 本文件不授权 VCP call
- 本文件不授权 VCPChat bridge call
- 本文件不授权 memory write
- 本文件不授权 image access
- 本文件只允许后续进入 v7.50c dry-run execution，且必须显式授权
