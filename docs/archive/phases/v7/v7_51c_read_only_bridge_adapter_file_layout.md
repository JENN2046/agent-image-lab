# v7.51c Read-only Bridge Adapter File Layout

## 1. Purpose

定义 read-only bridge adapter 的推荐文件路径和目录布局。

## 2. Runtime Files

```yaml
adapter_runtime:
  path: scripts/agent_image_lab_read_only_adapter.js
  purpose: Main adapter runtime. Receives request, resolves refs, returns response.
  language: JavaScript (Node.js, no external dependencies)
```

## 3. Validator Files

```yaml
validators:
  schema:
    path: scripts/validate_agent_image_lab_read_only_adapter_schema.js
    purpose: Validates adapter request/response schema compliance.
  security_gates:
    path: scripts/validate_agent_image_lab_read_only_adapter_security_gates.js
    purpose: Validates adapter security gates (no write, no binary, no secrets).
  fixtures:
    path: scripts/validate_agent_image_lab_read_only_adapter_fixtures.js
    purpose: Runs fixture regression tests against the adapter runtime.
```

## 4. Report Files

```yaml
reports:
  schema_validation: docs/v7_51e_read_only_adapter_schema_validation_report.md
  schema_result: docs/v7_51e_read_only_adapter_schema_validation_result.yaml
  security_gate_validation: docs/v7_51f_read_only_adapter_security_gate_validation_report.md
  security_gate_result: docs/v7_51f_read_only_adapter_security_gate_validation_result.yaml
  fixture_regression: docs/v7_51g_read_only_adapter_fixture_regression_report.md
  fixture_result: docs/v7_51g_read_only_adapter_fixture_regression_result.yaml
  closeout: docs/v7_51h_read_only_adapter_implementation_closeout.md
  closeout_yaml: docs/v7_51h_read_only_adapter_implementation_closeout.yaml
```

## 5. State Files

```yaml
state:
  - README.md
  - .agent_board/CHECKPOINT.md
```

## 6. Notes

- 所有 adapter 文件位于 `scripts/` 目录下
- 所有报告位于 `docs/` 目录下
- 不创建新目录，不修改 VCPToolBox 或 VCPChat 文件
- adapter 代码仅依赖 Node.js 内置模块（fs, path）
