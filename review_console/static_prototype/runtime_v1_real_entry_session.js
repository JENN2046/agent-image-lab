window.RUNTIME_V1_REAL_ENTRY_SESSION = {
  schema: "runtime_v1_readonly_review_session.v1",
  adapter_id: "review_bridge_runtime_v1_readonly",
  adapter_contract: "runtime_kernel_v1_contract.review_bridge_readonly.v1",
  session_mode: "runtime_v1_real_entry_readonly",
  session_id: "runtime_v1_review_session_runtime_v1_fixture_smoke_001",
  case_id: "runtime_v1_case_runtime_v1_fixture_smoke_001",
  task_id: "runtime-v1-fixture-task-001",
  project: "agent-image-lab",
  status: "readonly_real_session",
  current_review_status: "pending_human_review",
  display_fields: {
    run_id: "runtime_v1_fixture_smoke_001",
    prompt_package_ref: "prompts/image_generation/neutral_smoke_test_red_apple_v1.yaml",
    provider_route: "no_provider_fixture",
    provider_mode: "no_provider_fixture",
    model_required: "doubao-seedream-5-0-260128",
    model_sent: "doubao-seedream-5-0-260128",
    image_dimensions: "metadata_only",
    image_sha256: "fixture-runtime-v1-metadata-only-sha256",
    audit_receipt_ref: "runtime-to-review-v1://runtime_v1_fixture_smoke_001/audit_receipt.json",
    artifact_record_ref: "runtime-to-review-v1://runtime_v1_fixture_smoke_001/artifact_record.json"
  },
  image_versions: [
    {
      version_id: "runtime_v1_case_runtime_v1_fixture_smoke_001:version:metadata_only",
      label: "Runtime v1 artifact metadata",
      asset_ref: "tests/fixtures/runtime_v1_fixture_artifact.metadata.json",
      mime_type: "application/json",
      dimensions: "metadata_only",
      sha256: "fixture-runtime-v1-metadata-only-sha256",
      image_binary_loaded: false
    }
  ],
  current_version_id: "runtime_v1_case_runtime_v1_fixture_smoke_001:version:metadata_only",
  audit_summary: {
    status: "completed_fixture_artifact",
    calls_used: {
      provider: 0,
      plugin: 0,
      api: 0
    },
    budget: {
      max_provider_calls: 0,
      max_plugin_calls: 0,
      max_api_calls: 0,
      max_images: 1
    },
    output_scope: "run_directory_only",
    stop_reason: null
  },
  allowed_actions: [
    "inspect_runtime_metadata",
    "inspect_audit_receipt",
    "record_human_decision_metadata_later"
  ],
  forbidden_actions: [
    "read_image_binary",
    "call_provider",
    "call_plugin",
    "call_api",
    "generate_image",
    "write_accepted_samples",
    "write_production_candidate",
    "write_memory",
    "write_daily_note"
  ],
  guard: {
    read_only: true,
    display_only: true,
    metadata_only: true,
    image_binary_read_performed: false,
    fetch_performed: false,
    file_write_performed: false,
    approval_write_performed: false,
    archive_write_performed: false,
    accepted_samples_write_performed: false,
    production_candidate_created: false,
    provider_contact_performed: false,
    plugin_call_performed: false,
    api_call_performed: false,
    image_generation_performed: false,
    DailyNote_write_performed: false,
    VCP_memory_write_performed: false,
    secret_value_read_performed: false,
    push_tag_release_deploy_performed: false
  }
};

window.RUNTIME_V1_REAL_ENTRY_SOURCE = {
  source_mode: "runtime_v1_adapter_snapshot",
  source_adapter: "adapters/runtime/review_bridge_runtime_v1_readonly.js",
  source_fixture: "tests/fixtures/runtime_kernel_v1_no_provider_fixture_task.fixture.json",
  mock_data_js_used: false,
  fetch_performed: false,
  file_write_performed: false,
  image_binary_read_performed: false
};
