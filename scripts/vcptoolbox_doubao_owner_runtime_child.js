#!/usr/bin/env node
"use strict";

const path = require("node:path");

function writeJson(value, exitCode = 0) {
  process.stdout.write(`${JSON.stringify(value)}\n`, () => {
    process.exit(exitCode);
  });
}

function sanitizeError(error) {
  const message = error && error.message ? String(error.message) : String(error || "");
  if (message.includes("VOLCENGINE_API_KEY")) return "doubaogen_api_key_missing";
  if (message.includes("认证失败")) return "doubaogen_auth_failed";
  if (message.includes("配额")) return "doubaogen_quota_or_rate_limit";
  if (message.includes("请求超时(4分钟)") || message.includes("请求超时") || message.includes("timeout(4m)") || message.includes("timeout")) {
    return "vcptoolbox_owner_runtime_child_timeout_4m";
  }
  if (message.includes("请求参数错误") || message.includes("image size must be at least 3686400") || message.includes("Invalid parameter")) {
    return "vcptoolbox_owner_runtime_child_invalid_request";
  }
  if (message.includes("API")) return "doubaogen_api_failed";
  if (message.includes("plugin_not_registered")) return "doubaogen_plugin_not_registered";
  return "vcptoolbox_owner_runtime_child_failed";
}

async function readStdinJson() {
  const input = await new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => { data += chunk; });
    process.stdin.on("end", () => resolve(data));
  });
  return JSON.parse(input);
}

async function main() {
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };
  console.log = (...args) => originalConsole.error(...args);
  console.warn = (...args) => originalConsole.error(...args);

  const request = await readStdinJson();
  const vcpToolBoxRoot = path.resolve(request.vcpToolBoxRoot);
  const dotenv = require(path.join(vcpToolBoxRoot, "node_modules", "dotenv"));
  dotenv.config({
    path: path.join(vcpToolBoxRoot, "Plugin", "DoubaoGen", "config.env"),
    quiet: true,
  });
  const pluginManager = require(path.join(vcpToolBoxRoot, "Plugin.js"));

  if (typeof pluginManager.setProjectBasePath === "function") {
    pluginManager.setProjectBasePath(vcpToolBoxRoot);
  }
  if (typeof pluginManager.loadPlugins === "function") {
    await pluginManager.loadPlugins();
  }
  if (!pluginManager || typeof pluginManager.processToolCall !== "function") {
    throw new Error("vcptoolbox_plugin_manager_not_callable");
  }

  if (request.diagnosticOnly === true) {
    const pluginRegistered = typeof pluginManager.getPlugin === "function"
      ? Boolean(pluginManager.getPlugin("DoubaoGen"))
      : true;
    writeJson({
      status: "diagnostic_ok",
      plugin_registered: pluginRegistered,
      provider_contact_performed: false,
      plugin_call_performed: false,
      api_call_performed: false,
    }, pluginRegistered ? 0 : 2);
    return;
  }

  const result = await pluginManager.processToolCall(
    "DoubaoGen",
    {
      command: "generate",
      prompt: request.prompt,
      model: request.model,
      resolution: "1920x2048",
      watermark: false,
    },
    "127.0.0.1",
    {
      requestSource: "agent-image-lab-runtime-v1-owner-child",
      bridgeId: "runtime_v1_real_bound_owner_runtime_child",
      providerBindingRefRedacted: true,
      taskId: request.taskId || "runtime-v1-real-guarded-task-001",
      invocationId: request.invocationId || "runtime_v1_real_guarded_smoke_001",
      doubaoProjectBasePathOverride: request.outputDirectory,
    }
  );

  writeJson({
    status: "success",
    result,
    provider_contact_performed: true,
    plugin_call_performed: true,
    api_call_performed: true,
  });
}

main().catch((error) => {
  writeJson({
    status: "error",
    error_code: sanitizeError(error),
    provider_config_key_present: Boolean(process.env.VOLCENGINE_API_KEY),
    provider_contact_performed: false,
    plugin_call_performed: true,
    api_call_performed: false,
  }, 1);
});
