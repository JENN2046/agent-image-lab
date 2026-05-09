# v7.50a VCP Read-only Bridge Local Schema Validation Planning

## 1. Purpose

本文件定义未来本地 schema 校验规划。
本阶段不运行 validator。
本阶段只定义校验对象、字段要求、阻断条件和未来执行步骤。

## 2. Validation Scope

- vcp_read_only_bridge_request
- vcp_read_only_bridge_response
- allowed_read_resources
- forbidden_read_resources
- security_gates
- hard_blockers

## 3. Request Schema Required Fields

```yaml
required_request_fields:
  - schema_version
  - request_id
  - requested_by
  - bridge_mode
  - case_id
  - requested_resources
  - write_intent
  - image_binary_requested
  - secrets_requested
```

合法值：

```yaml
request_constraints:
  bridge_mode: read_only
  write_intent: false
  image_binary_requested: false
  secrets_requested: false
  requested_by_allowed:
    - VCPChat
    - VCPToolBox
    - human_operator
```

## 4. Response Schema Required Fields

```yaml
required_response_fields:
  - schema_version
  - request_id
  - bridge_mode
  - source_repo
  - case_id
  - status
  - returned_resources
  - payload_type
  - image_binary_included
  - secrets_included
  - write_performed
  - memory_write_performed
  - daily_note_write_performed
```

合法值：

```yaml
response_constraints:
  bridge_mode: read_only
  source_repo: JENN2046/agent-image-lab
  status_allowed:
    - ok
    - blocked
    - not_found
  payload_type: text_only_refs
  image_binary_included: false
  secrets_included: false
  write_performed: false
  memory_write_performed: false
  daily_note_write_performed: false
```

## 5. Local Schema Blockers

- missing_required_field
- bridge_mode_not_read_only
- write_intent_true
- image_binary_requested_true
- secrets_requested_true
- payload_type_not_text_only_refs
- write_performed_true
- memory_write_performed_true
- daily_note_write_performed_true
- source_repo_mismatch

## 6. Future Execution

- 本阶段不执行 validator
- 后续如果要执行，应进入单独的 v7.50a validation execution 阶段
- validator 只允许读取 docs / README / CHECKPOINT
- validator 不允许读取 runs/ 或图片
- validator 不允许调用 VCP
