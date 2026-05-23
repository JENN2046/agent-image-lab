"use strict";

const fs = require("fs");
const path = require("path");
const { buildCapture } = require("./create_provider_payload_capture_preflight");

const ROOT = path.resolve(__dirname, "..");
const CAPTURE_REF = "reports/provider_payload_captures/v0_3_3_exact_new_trial_001_request_payload.sanitized.json";
const REPORT_REF = "reports/visual_asset_eval_dry_run/v0_6_22_provider_payload_extraction_preflight.json";
const DOC_REF = "docs/V0_6_22_PROVIDER_PAYLOAD_EXTRACTION_PREFLIGHT.md";

const results = [];

function add(check, passed, detail = null) {
  results.push({ check, passed: Boolean(passed), detail });
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

const expected = buildCapture();
const captureExists = fs.existsSync(path.join(ROOT, CAPTURE_REF));
const reportExists = fs.existsSync(path.join(ROOT, REPORT_REF));
const docExists = fs.existsSync(path.join(ROOT, DOC_REF));
const capture = captureExists ? readJson(CAPTURE_REF) : null;
const report = reportExists ? readJson(REPORT_REF) : null;

add("capture_exists", captureExists);
add("report_exists", reportExists);
add("doc_exists", docExists);

if (capture) {
  add("phase", capture.phase === "v0_6_22_provider_payload_extraction_preflight");
  add("provider_route", capture.provider_route === "image_gen.imagegen");
  add("prompt_package_ref", capture.prompt_package_ref === "prompts/image_generation/safe_adult_editorial_portrait_v1.yaml");
  add("payload_prompt_matches_expected", capture.payload?.prompt === expected.payload.prompt);
  add("prompt_hash_matches_expected", capture.prompt_text_sha256 === expected.prompt_text_sha256);
  add("prompt_source_field", capture.prompt_source_field === "prompt");
  add("negative_prompt_not_included", capture.negative_prompt_included === false);
  add("yaml_metadata_not_included", capture.yaml_metadata_included === false);
  add("authorization_text_not_included", capture.authorization_text_included === false);
  add("path_text_not_included_in_prompt", capture.path_text_included_in_prompt === false);
  add("prompt_extraction_axis", capture.diagnostic_axes?.prompt_extraction === "passed_positive_prompt_only");
  add("payload_wrapping_axis", capture.diagnostic_axes?.payload_wrapping === "passed_no_yaml_negative_or_authorization_text");
  add("provider_tool_not_called", capture.diagnostic_axes?.provider_tool_result === "not_called");
  add("rules_out_prompt_extraction_contamination", capture.root_cause_positioning?.this_preflight_rules_out_prompt_extraction_contamination === true);
  add("raw_request_payload_capture_performed", capture.boundary?.raw_provider_payload_capture_performed === true);
  add("raw_response_capture_not_performed", capture.boundary?.raw_provider_response_capture_performed === false);
  add("secret_not_read", capture.boundary?.secret_value_read_performed === false);
  add("provider_not_called", capture.boundary?.provider_call_performed === false);
  add("image_not_generated", capture.boundary?.image_generation_performed === false);
  add("no_memory_or_dailynote", capture.boundary?.VCP_memory_write_performed === false && capture.boundary?.DailyNote_write_performed === false);
  add("no_promotion_commit_push", capture.boundary?.accepted_sample_auto_promotion === false
    && capture.boundary?.production_candidate_created === false
    && capture.boundary?.commit_performed === false
    && capture.boundary?.push_performed === false);
}

if (report) {
  add("report_phase", report.phase === "v0_6_22_provider_payload_extraction_preflight");
  add("report_capture_ref", report.payload_capture_ref === CAPTURE_REF);
  add("report_failure_localization_axes", Array.isArray(report.failure_localization_axes) && report.failure_localization_axes.length === 4);
  add("report_next_step", report.recommended_next === "run_next_authorized_single_generation_with_payload_capture_and_artifact_return_trace");
}

const passed = results.every((result) => result.passed);
const output = {
  passed,
  phase: "v0_6_22_provider_payload_extraction_preflight",
  capture_ref: CAPTURE_REF,
  report_ref: REPORT_REF,
  doc_ref: DOC_REF,
  prompt_text_sha256: capture?.prompt_text_sha256 || null,
  provider_call_performed: false,
  image_generation_performed: false,
  raw_provider_payload_capture_performed: capture?.boundary?.raw_provider_payload_capture_performed === true,
  raw_provider_response_capture_performed: false,
  secret_value_read_performed: false,
  remaining_failure_layers: capture?.root_cause_positioning?.remaining_likely_failure_layers || [],
  results
};

console.log(JSON.stringify(output, null, 2));
process.exit(passed ? 0 : 1);
