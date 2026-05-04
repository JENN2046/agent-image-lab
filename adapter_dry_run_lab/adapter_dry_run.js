const fs = require("fs");

const BLOCKED_ACTIONS = [
  "execute",
  "call_plugin",
  "call_api",
  "write_daily_note",
  "write_image_file",
];

function getRequest(input) {
  return input.adapter_dry_run_request || input.request || input;
}

function getEnvelope(request) {
  return request.task_envelope || {};
}

function buildViolationList(request) {
  const envelope = getEnvelope(request);
  const controls = envelope.dry_run_controls || {};
  const approval = envelope.approval_context || {};
  const safety = envelope.safety || {};
  const violations = [];

  if (request.command !== "dry_run") {
    violations.push("命令必须为 dry_run。");
  }
  if (envelope.mode !== "dry_run") {
    violations.push("任务模式必须为 dry_run。");
  }
  if (controls.max_plugin_calls !== 0) {
    violations.push("插件调用次数必须为 0。");
  }
  if (controls.allow_external_api !== false) {
    violations.push("不得允许外部 API。");
  }
  if (controls.allow_file_write !== false) {
    violations.push("不得允许文件写入。");
  }
  if (controls.allow_image_binary !== false) {
    violations.push("不得允许图片二进制。");
  }
  if (approval.gatekeeper_required !== true) {
    violations.push("必须要求 Gatekeeper 复查。");
  }
  if (approval.review_console_required !== true) {
    violations.push("必须要求 Review Console 展示。");
  }
  if (approval.daily_note_direct_write_allowed !== false) {
    violations.push("不得允许直接写 DailyNote。");
  }
  if (safety.contains_secret !== false) {
    violations.push("输入不得包含密钥或凭据。");
  }
  if (safety.contains_private_path !== false) {
    violations.push("输入不得包含私密路径。");
  }
  if (safety.contains_customer_private_data !== false) {
    violations.push("输入不得包含客户隐私。");
  }
  if (safety.contains_image_binary !== false) {
    violations.push("输入不得包含图片二进制。");
  }

  return violations;
}

function buildRejectedResponse(request, violations) {
  return {
    adapter_dry_run_response: {
      request_id: request.request_id || "dry-run-request-unknown",
      status: "rejected",
      rejection_reason_cn:
        violations.length > 0
          ? violations.join(" ")
          : "输入不满足 no-execution 不变量，已拒绝生成 dispatch 草案。",
      execution_blocked: true,
      selected_plugin: null,
      max_plugin_calls: 0,
      api_called: false,
      vcp_plugin_called: false,
      daily_note_called: false,
      file_write_performed: false,
      image_file_created: false,
    },
  };
}

function buildAcceptedResponse(request) {
  const envelope = getEnvelope(request);
  const taskId = envelope.task_id || "task-placeholder-001";
  const dispatchId = `dispatch-${taskId}`;

  return {
    adapter_dry_run_response: {
      request_id: request.request_id,
      status: "accepted_draft",
      dispatch_plan_draft: {
        dispatch_id: dispatchId,
        task_id: taskId,
        mode: "dry_run",
        selected_plugin: null,
        fallback_plugins: [],
        capability_matrix_status: "manifest_reviewed_safe",
        reason_cn:
          "仅生成 dry-run 调度草案；未选择真实插件，未调用插件或 API。",
        dry_run_required: true,
        approval_required: true,
        execution_blocked: true,
        external_api_allowed: false,
        gatekeeper_required: true,
        review_console_required: true,
        allow_file_write: false,
        allow_image_binary: false,
        max_plugin_calls: 0,
        expected_outputs: 0,
        max_outputs: 0,
      },
      gatekeeper_handoff: {
        required: true,
        display_only: true,
        risk_level: "medium",
        risk_summary_cn:
          "当前仅为 dry-run 草案，不能执行插件、调用 API、写 DailyNote 或保存图片。",
        blocked_actions: BLOCKED_ACTIONS,
        approval_to_execute_allowed: false,
      },
      review_console_handoff: {
        required: true,
        display_only: true,
        allowed_actions: [
          "mark_candidate",
          "reject_candidate",
          "request_gatekeeper_review",
          "request_memory_edit",
        ],
        forbidden_actions: [
          "execute_plugin",
          "call_api",
          "write_daily_note",
          "save_image",
        ],
      },
      audit_record: {
        audit_summary_cn:
          "仅完成 Adapter dry-run 草案生成，未调用插件、API、DailyNote 或文件写入。",
        contains_sensitive_original: false,
        max_plugin_calls_observed: 0,
        external_api_observed: false,
        file_write_observed: false,
        image_binary_observed: false,
      },
      no_execution_guard: {
        selected_plugin: null,
        max_plugin_calls: 0,
        api_called: false,
        vcp_plugin_called: false,
        daily_note_called: false,
        file_write_performed: false,
        image_file_created: false,
        real_execution_allowed: false,
      },
    },
  };
}

function run(inputPath) {
  if (!inputPath) {
    return buildRejectedResponse(
      { request_id: "dry-run-request-missing-input" },
      ["必须提供本地 JSON 输入文件。"]
    );
  }

  const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const request = getRequest(input);
  const violations = buildViolationList(request);

  if (violations.length > 0) {
    return buildRejectedResponse(request, violations);
  }

  return buildAcceptedResponse(request);
}

const result = run(process.argv[2]);
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
