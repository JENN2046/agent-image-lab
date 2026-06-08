const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const root = path.resolve(__dirname, "..");
const recoverability = createRecoverabilityCore(root);
const registryPath = "accepted_samples/accepted_sample_registry.yaml";
const v734HardeningDocPath = "docs/v7_34_full_code_surface_hardening_closeout.md";
const allowedCategoryFiles = [
  "accepted_samples/categories/product_still_life.yaml",
  "accepted_samples/categories/fashion_lifestyle_still_life.yaml",
  "accepted_samples/categories/fashion_lookbook_portrait.yaml",
];
const requiredSampleIds = [
  "accepted_product_still_life_tennis_wallet_001",
  "accepted_french_summer_rattan_bucket_bag_001",
  "accepted_french_summer_rattan_bucket_bag_002_shot_1",
  "accepted_french_summer_rattan_bucket_bag_003_shot_2",
  "accepted_french_summer_rattan_bucket_bag_004_shot_3",
  "accepted_womens_resort_relaxed_knit_codex_v2_001",
  "accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001",
  "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001",
  "neutral_red_apple_seedream5_retry_006",
  "accepted_premium_black_wireless_headphones_hero_ail_vis_17_001",
  "accepted_premium_skincare_serum_bottle_secretless_attempt_018_001",
  "accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001",
];
const requiredCodexSample = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const requiredBagCodexSample = "accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001";
const requiredLampCodexSample = "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001";
const requiredRetry006ProductSample = "neutral_red_apple_seedream5_retry_006";
const requiredHeadphonesProductSample = "accepted_premium_black_wireless_headphones_hero_ail_vis_17_001";
const requiredSerumAttempt018ProductSample = "accepted_premium_skincare_serum_bottle_secretless_attempt_018_001";
const requiredSerumTrial001ProductSample = "accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001";
const imageExtensions = /\.(png|jpe?g|webp|gif|psd|tiff?)$/i;

let passed = true;
const results = [];

function repoPath(relativePath) {
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`path escapes repository root: ${relativePath}`);
  }
  return resolved;
}

function check(id, f) {
  try {
    const ok = f();
    results.push({ check: id, passed: Boolean(ok) });
    if (!ok) passed = false;
  } catch (error) {
    results.push({ check: id, passed: false, error: error.message });
    passed = false;
  }
}

function fileExists(relativePath) {
  return fs.existsSync(repoPath(relativePath));
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function fileContains(relativePath, token) {
  return fileExists(relativePath) && readText(relativePath).includes(token);
}

function extractSampleBlocks(registry) {
  const blocks = new Map();
  const matches = registry.matchAll(/\n    - sample_id: ([^\n]+)\n([\s\S]*?)(?=\n    - sample_id: |\n*$)/g);
  for (const match of matches) {
    blocks.set(match[1].trim(), match[2]);
  }
  return blocks;
}

function extractField(block, field) {
  const match = block.match(new RegExp(`\\n      ${field}: ([^\\n]+)`));
  return match ? match[1].trim() : null;
}

function extractCategoryIndex(relativePath) {
  const text = readText(relativePath);
  const category = (text.match(/^category:\s*(.+)$/m) || [])[1]?.trim();
  const sampleCount = Number((text.match(/^sample_count:\s*(\d+)$/m) || [])[1]);
  const sampleIds = [...text.matchAll(/^\s+-\s+(.+)$/gm)].map((match) => match[1].trim());
  return { category, sampleCount, sampleIds };
}

function listTrackedAcceptedSamplesFiles() {
  const result = childProcess.spawnSync("git", ["ls-files", "accepted_samples"], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || "git ls-files accepted_samples failed");
  }
  return result.stdout.split(/\r?\n/).filter(Boolean);
}

function readImageEvidence(relativePath) {
  if (!relativePath || !fileExists(relativePath)) return null;
  const metadata = recoverability.readImageMetadata(relativePath);
  return {
    sha256: recoverability.sha256File(relativePath),
    dimensions: metadata.width && metadata.height ? `${metadata.width}x${metadata.height}` : null,
    mime: metadata.mimeType,
    signatureValid: metadata.signatureValid,
    bytes: fs.statSync(repoPath(relativePath)).size,
  };
}

const registry = readText(registryPath);
const sampleBlocks = extractSampleBlocks(registry);
const headphonesBlock = sampleBlocks.get(requiredHeadphonesProductSample) || "";
const headphonesImagePath = extractField(headphonesBlock, "image_path");
const headphonesRegistrySha256 = extractField(headphonesBlock, "verified_sha256");
const headphonesRegistryDimensions = extractField(headphonesBlock, "verified_dimensions");
const headphonesRegistryMime = extractField(headphonesBlock, "verified_mime");
const headphonesImageEvidence = readImageEvidence(headphonesImagePath);
const headphonesMetadata = readJson("accepted_samples/ail_vis_17_premium_black_wireless_headphones_hero/metadata.json");
const headphonesManifest = readJson("accepted_samples/ail_vis_17_premium_black_wireless_headphones_hero/manifest.json");
const headphonesSourceEvidence = readJson("accepted_samples/ail_vis_17_premium_black_wireless_headphones_hero/source_evidence.json");
const serumBlock = sampleBlocks.get(requiredSerumAttempt018ProductSample) || "";
const serumImagePath = extractField(serumBlock, "image_path");
const serumRegistrySha256 = extractField(serumBlock, "verified_sha256");
const serumRegistryDimensions = extractField(serumBlock, "verified_dimensions");
const serumRegistryMime = extractField(serumBlock, "verified_mime");
const serumImageEvidence = readImageEvidence(serumImagePath);
const serumMetadata = readJson("accepted_samples/accepted_premium_skincare_serum_bottle_secretless_attempt_018_001/metadata.json");
const serumManifest = readJson("accepted_samples/accepted_premium_skincare_serum_bottle_secretless_attempt_018_001/manifest.json");
const serumSourceEvidence = readJson("accepted_samples/accepted_premium_skincare_serum_bottle_secretless_attempt_018_001/source_evidence.json");
const serumTrial001Block = sampleBlocks.get(requiredSerumTrial001ProductSample) || "";
const serumTrial001ImagePath = extractField(serumTrial001Block, "image_path");
const serumTrial001RegistrySha256 = extractField(serumTrial001Block, "verified_sha256");
const serumTrial001RegistryDimensions = extractField(serumTrial001Block, "verified_dimensions");
const serumTrial001RegistryMime = extractField(serumTrial001Block, "verified_mime");
const serumTrial001ImageEvidence = readImageEvidence(serumTrial001ImagePath);
const serumTrial001Metadata = readJson("accepted_samples/accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001/metadata.json");
const serumTrial001Manifest = readJson("accepted_samples/accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001/manifest.json");
const serumTrial001SourceEvidence = readJson("accepted_samples/accepted_premium_skincare_serum_bottle_r2r_v2_trial_001_001/source_evidence.json");

check("accepted_samples_readme", () => fileExists("accepted_samples/README.md"));
check("registry_exists", () => fileExists(registryPath));
check("registry_version_v1", () => registry.includes("version: v1"));
check("registry_has_updated_by_phase", () => /updated_by_phase:\s*v\d+_\d+/.test(registry));
check("images_not_committed_flag", () => registry.includes("image_files_committed_to_git: false"));
check("registry_only", () => registry.includes("registry_only: true"));
check("registry_memory_write_blocked", () => registry.includes("memory_write_allowed: false"));
check("registry_daily_note_write_blocked", () => registry.includes("daily_note_write_allowed: false"));
check("required_category_files_exist", () => allowedCategoryFiles.every(fileExists));
check("all_required_samples_present", () => requiredSampleIds.every((id) => sampleBlocks.has(id)));
check("required_sample_ids_unique", () => sampleBlocks.size === new Set(sampleBlocks.keys()).size);
check("codex_session_sample_present", () => sampleBlocks.has(requiredCodexSample));
check("codex_session_sample_provider_type", () => extractField(sampleBlocks.get(requiredCodexSample) || "", "provider_type") === "codex_session_image");
check("codex_session_sample_plugin_null", () => extractField(sampleBlocks.get(requiredCodexSample) || "", "plugin_id") === "null");
check("codex_session_sample_category", () => extractField(sampleBlocks.get(requiredCodexSample) || "", "category") === "fashion_lookbook_portrait");
check("codex_session_sample_image_not_committed", () => (sampleBlocks.get(requiredCodexSample) || "").includes("image_files_committed_to_git: false"));
check("codex_session_sample_no_memory_write", () => (sampleBlocks.get(requiredCodexSample) || "").includes("write_to_memory_allowed: false"));
check("codex_session_sample_no_daily_note_write", () => (sampleBlocks.get(requiredCodexSample) || "").includes("daily_note_write_allowed: false"));
check("bag_codex_session_sample_present", () => sampleBlocks.has(requiredBagCodexSample));
check("bag_codex_session_sample_provider_type", () => extractField(sampleBlocks.get(requiredBagCodexSample) || "", "provider_type") === "codex_session_image");
check("bag_codex_session_sample_plugin_null", () => extractField(sampleBlocks.get(requiredBagCodexSample) || "", "plugin_id") === "null");
check("bag_codex_session_sample_category", () => extractField(sampleBlocks.get(requiredBagCodexSample) || "", "category") === "fashion_lifestyle_still_life");
check("bag_codex_session_sample_image_not_committed", () => (sampleBlocks.get(requiredBagCodexSample) || "").includes("image_files_committed_to_git: false"));
check("bag_codex_session_sample_no_memory_write", () => (sampleBlocks.get(requiredBagCodexSample) || "").includes("write_to_memory_allowed: false"));
check("bag_codex_session_sample_no_daily_note_write", () => (sampleBlocks.get(requiredBagCodexSample) || "").includes("daily_note_write_allowed: false"));
check("lamp_codex_session_sample_present", () => sampleBlocks.has(requiredLampCodexSample));
check("lamp_codex_session_sample_provider_type", () => extractField(sampleBlocks.get(requiredLampCodexSample) || "", "provider_type") === "codex_session_image");
check("lamp_codex_session_sample_plugin_null", () => extractField(sampleBlocks.get(requiredLampCodexSample) || "", "plugin_id") === "null");
check("lamp_codex_session_sample_category", () => extractField(sampleBlocks.get(requiredLampCodexSample) || "", "category") === "product_still_life");
check("lamp_codex_session_sample_image_not_committed", () => (sampleBlocks.get(requiredLampCodexSample) || "").includes("image_files_committed_to_git: false"));
check("lamp_codex_session_sample_no_memory_write", () => (sampleBlocks.get(requiredLampCodexSample) || "").includes("write_to_memory_allowed: false"));
check("lamp_codex_session_sample_no_daily_note_write", () => (sampleBlocks.get(requiredLampCodexSample) || "").includes("daily_note_write_allowed: false"));
check("retry_006_product_sample_present", () => sampleBlocks.has(requiredRetry006ProductSample));
check("retry_006_product_sample_provider_type", () => extractField(sampleBlocks.get(requiredRetry006ProductSample) || "", "provider_type") === "project_plugin");
check("retry_006_product_sample_plugin", () => extractField(sampleBlocks.get(requiredRetry006ProductSample) || "", "plugin_id") === "DoubaoGen");
check("retry_006_product_sample_category", () => extractField(sampleBlocks.get(requiredRetry006ProductSample) || "", "category") === "product_still_life");
check("retry_006_product_sample_image_not_committed", () => (sampleBlocks.get(requiredRetry006ProductSample) || "").includes("image_files_committed_to_git: false"));
check("retry_006_product_sample_no_memory_write", () => (sampleBlocks.get(requiredRetry006ProductSample) || "").includes("write_to_memory_allowed: false"));
check("retry_006_product_sample_no_daily_note_write", () => (sampleBlocks.get(requiredRetry006ProductSample) || "").includes("daily_note_write_allowed: false"));
check("headphones_product_sample_present", () => sampleBlocks.has(requiredHeadphonesProductSample));
check("headphones_product_sample_provider_type", () => extractField(sampleBlocks.get(requiredHeadphonesProductSample) || "", "provider_type") === "codex_session_image");
check("headphones_product_sample_plugin_null", () => extractField(sampleBlocks.get(requiredHeadphonesProductSample) || "", "plugin_id") === "null");
check("headphones_product_sample_category", () => extractField(sampleBlocks.get(requiredHeadphonesProductSample) || "", "category") === "product_still_life");
check("headphones_product_sample_image_committed", () => (sampleBlocks.get(requiredHeadphonesProductSample) || "").includes("image_files_committed_to_git: true"));
check("headphones_product_sample_source_file_exists", () => Boolean(headphonesImagePath) && fileExists(headphonesImagePath));
check("headphones_product_sample_source_sha256_matches_registry", () =>
  headphonesImageEvidence?.sha256 === headphonesRegistrySha256
);
check("headphones_product_sample_source_dimensions_match_registry", () =>
  headphonesImageEvidence?.dimensions === headphonesRegistryDimensions
);
check("headphones_product_sample_source_mime_matches_registry", () =>
  headphonesImageEvidence?.signatureValid === true && headphonesImageEvidence?.mime === headphonesRegistryMime
);
check("headphones_product_sample_metadata_matches_registry", () =>
  headphonesMetadata.artifact.source_image_ref === headphonesImagePath &&
  headphonesMetadata.artifact.source_image_sha256 === headphonesRegistrySha256 &&
  headphonesMetadata.artifact.source_image_dimensions === headphonesRegistryDimensions &&
  headphonesMetadata.artifact.source_image_mime === headphonesRegistryMime
);
check("headphones_product_sample_manifest_matches_registry", () =>
  headphonesManifest.artifact.original.path === headphonesImagePath &&
  headphonesManifest.artifact.original.sha256 === headphonesRegistrySha256 &&
  `${headphonesManifest.artifact.original.width}x${headphonesManifest.artifact.original.height}` === headphonesRegistryDimensions &&
  headphonesManifest.artifact.original.format === "png" &&
  headphonesManifest.artifact.original.bytes === headphonesImageEvidence?.bytes
);
check("headphones_product_sample_source_evidence_matches_file", () =>
  headphonesSourceEvidence.verified_source_image.path === headphonesImagePath &&
  headphonesSourceEvidence.verified_source_image.sha256 === headphonesImageEvidence?.sha256 &&
  `${headphonesSourceEvidence.verified_source_image.width}x${headphonesSourceEvidence.verified_source_image.height}` === headphonesImageEvidence?.dimensions &&
  headphonesSourceEvidence.verified_source_image.mime === headphonesImageEvidence?.mime &&
  headphonesSourceEvidence.verified_source_image.bytes === headphonesImageEvidence?.bytes
);
check("headphones_product_sample_no_memory_write", () => (sampleBlocks.get(requiredHeadphonesProductSample) || "").includes("write_to_memory_allowed: false"));
check("headphones_product_sample_no_daily_note_write", () => (sampleBlocks.get(requiredHeadphonesProductSample) || "").includes("daily_note_write_allowed: false"));
check("serum_attempt_018_product_sample_present", () => sampleBlocks.has(requiredSerumAttempt018ProductSample));
check("serum_attempt_018_product_sample_provider_type", () => extractField(serumBlock, "provider_type") === "project_plugin");
check("serum_attempt_018_product_sample_plugin", () => extractField(serumBlock, "plugin_id") === "DoubaoGen");
check("serum_attempt_018_product_sample_category", () => extractField(serumBlock, "category") === "product_still_life");
check("serum_attempt_018_product_sample_image_not_committed", () => serumBlock.includes("image_files_committed_to_git: false"));
check("serum_attempt_018_product_sample_source_file_exists", () => Boolean(serumImagePath) && fileExists(serumImagePath));
check("serum_attempt_018_product_sample_source_sha256_matches_registry", () =>
  serumImageEvidence?.sha256 === serumRegistrySha256
);
check("serum_attempt_018_product_sample_source_dimensions_match_registry", () =>
  serumImageEvidence?.dimensions === serumRegistryDimensions
);
check("serum_attempt_018_product_sample_source_mime_matches_registry", () =>
  serumImageEvidence?.signatureValid === true && serumImageEvidence?.mime === serumRegistryMime
);
check("serum_attempt_018_product_sample_metadata_matches_registry", () =>
  serumMetadata.artifact.source_image_ref === serumImagePath &&
  serumMetadata.artifact.source_image_sha256 === serumRegistrySha256 &&
  serumMetadata.artifact.source_image_dimensions === serumRegistryDimensions &&
  serumMetadata.artifact.source_image_mime === serumRegistryMime
);
check("serum_attempt_018_product_sample_manifest_matches_registry", () =>
  serumManifest.artifact.original.path === serumImagePath &&
  serumManifest.artifact.original.sha256 === serumRegistrySha256 &&
  `${serumManifest.artifact.original.width}x${serumManifest.artifact.original.height}` === serumRegistryDimensions &&
  serumManifest.artifact.original.format === "jpeg" &&
  serumManifest.artifact.original.bytes === serumImageEvidence?.bytes
);
check("serum_attempt_018_product_sample_source_evidence_matches_file", () =>
  serumSourceEvidence.verified_source_image.path === serumImagePath &&
  serumSourceEvidence.verified_source_image.sha256 === serumImageEvidence?.sha256 &&
  `${serumSourceEvidence.verified_source_image.width}x${serumSourceEvidence.verified_source_image.height}` === serumImageEvidence?.dimensions &&
  serumSourceEvidence.verified_source_image.mime === serumImageEvidence?.mime &&
  serumSourceEvidence.verified_source_image.bytes === serumImageEvidence?.bytes
);
check("serum_attempt_018_product_sample_memory_receipt_ref_present", () =>
  serumBlock.includes("memory_write_receipt_ref: reports/memory_write_receipts/secretless_serum_attempt_018_codex_knowledge_memory_write_receipt_20260606.json") &&
  fileExists("reports/memory_write_receipts/secretless_serum_attempt_018_codex_knowledge_memory_write_receipt_20260606.json")
);
check("serum_attempt_018_product_sample_memory_written_receipt_consistent", () =>
  serumSourceEvidence.side_effects.Codex_knowledge_memory_write_performed === true &&
  serumSourceEvidence.side_effects.Codex_knowledge_memory_id === "codex-knowledge-ed261a74438b43059178c4e12e09a16a"
);
check("serum_attempt_018_product_sample_memory_tag_split", () =>
  serumBlock.includes("- codex_knowledge_memory_written") &&
  !serumBlock.includes("\n        - memory_written")
);
check("serum_attempt_018_product_sample_memory_effects_split", () =>
  serumBlock.includes("memory_effects:") &&
  serumBlock.includes("codex_knowledge_memory_written: true") &&
  serumBlock.includes("codex_knowledge_memory_id: codex-knowledge-ed261a74438b43059178c4e12e09a16a") &&
  serumBlock.includes("ail_dailynote_write_adapter_preflight: true") &&
  serumBlock.includes("daily_note_write_allowed: false") &&
  serumBlock.includes("vcptoolbox_dailynote_write_called: false") &&
  serumBlock.includes("project_dailynote_writer_performed: false") &&
  serumBlock.includes("vcp_long_term_memory_write_allowed: false") &&
  serumBlock.includes("project_memory_write_allowed: false") &&
  serumBlock.includes("additional_memory_write_performed_after_codex_receipt: false")
);
check("serum_attempt_018_source_evidence_memory_effects_split", () =>
  serumSourceEvidence.memory_effects?.codex_knowledge_memory_written === true &&
  serumSourceEvidence.memory_effects?.codex_knowledge_memory_id === "codex-knowledge-ed261a74438b43059178c4e12e09a16a" &&
  serumSourceEvidence.memory_effects?.ail_dailynote_write_adapter_preflight === true &&
  serumSourceEvidence.memory_effects?.vcptoolbox_dailynote_write_called === false &&
  serumSourceEvidence.memory_effects?.daily_note_write_allowed === false &&
  serumSourceEvidence.memory_effects?.vcp_long_term_memory_write_allowed === false &&
  serumSourceEvidence.memory_effects?.project_memory_write_allowed === false &&
  serumSourceEvidence.memory_effects?.project_daily_note_writer_performed === false &&
  serumSourceEvidence.memory_effects?.additional_memory_write_performed_after_codex_receipt === false
);
check("serum_attempt_018_product_sample_no_daily_note_project_writer", () =>
  serumSourceEvidence.side_effects.project_DailyNote_writer_performed === false &&
  serumSourceEvidence.side_effects.project_DailyNote_writer_blocker.includes("no exact non-secret callable DailyNote writer target")
);
check("serum_attempt_018_source_evidence_recoverability_recorded", () =>
  serumSourceEvidence.recoverability?.workspace_local_verified === true &&
  serumSourceEvidence.recoverability?.portable_after_clone === false &&
  serumSourceEvidence.recoverability?.needs_external_artifact_restore === true &&
  serumSourceEvidence.recoverability?.artifact_locator_scope === "project_relative_runs" &&
  serumSourceEvidence.recoverability?.image_files_committed_to_git === false &&
  serumSourceEvidence.recoverability?.artifact_recoverability_is_not_vcp_runtime_integration === true
);
check("serum_attempt_018_broker_boundary_recorded", () =>
  serumSourceEvidence.broker_boundary?.native_doubao_image_role === "local_A5_guarded_provider_plugin_not_secretless_delegate" &&
  serumSourceEvidence.broker_boundary?.secretless_delegate_owner === "VCPToolBox" &&
  serumSourceEvidence.broker_boundary?.provider_secret_owner === "VCPToolBox" &&
  serumSourceEvidence.broker_boundary?.authorization_header_owner === "VCPToolBox" &&
  serumSourceEvidence.broker_boundary?.vcp_broker_source_proof_required_before_preferred_channel === true &&
  serumSourceEvidence.broker_boundary?.ail_vcptoolbox_patch_script_status === "migration_bootstrap_only"
);
check("serum_attempt_018_product_sample_registry_no_memory_authorization", () => serumBlock.includes("write_to_memory_allowed: false"));
check("serum_attempt_018_product_sample_registry_no_daily_note_authorization", () => serumBlock.includes("daily_note_write_allowed: false"));
check("serum_trial_001_product_sample_present", () => sampleBlocks.has(requiredSerumTrial001ProductSample));
check("serum_trial_001_product_sample_provider_type", () => extractField(serumTrial001Block, "provider_type") === "project_plugin");
check("serum_trial_001_product_sample_plugin", () => extractField(serumTrial001Block, "plugin_id") === "DoubaoGen");
check("serum_trial_001_product_sample_category", () => extractField(serumTrial001Block, "category") === "product_still_life");
check("serum_trial_001_product_sample_image_not_committed", () => serumTrial001Block.includes("image_files_committed_to_git: false"));
check("serum_trial_001_product_sample_source_file_exists", () => Boolean(serumTrial001ImagePath) && fileExists(serumTrial001ImagePath));
check("serum_trial_001_product_sample_source_sha256_matches_registry", () =>
  serumTrial001ImageEvidence?.sha256 === serumTrial001RegistrySha256
);
check("serum_trial_001_product_sample_source_dimensions_match_registry", () =>
  serumTrial001ImageEvidence?.dimensions === serumTrial001RegistryDimensions
);
check("serum_trial_001_product_sample_source_mime_matches_registry", () =>
  serumTrial001ImageEvidence?.signatureValid === true && serumTrial001ImageEvidence?.mime === serumTrial001RegistryMime
);
check("serum_trial_001_product_sample_metadata_matches_registry", () =>
  serumTrial001Metadata.artifact.source_image_ref === serumTrial001ImagePath &&
  serumTrial001Metadata.artifact.source_image_sha256 === serumTrial001RegistrySha256 &&
  serumTrial001Metadata.artifact.source_image_dimensions === serumTrial001RegistryDimensions &&
  serumTrial001Metadata.artifact.source_image_mime === serumTrial001RegistryMime
);
check("serum_trial_001_product_sample_manifest_matches_registry", () =>
  serumTrial001Manifest.artifact.original.path === serumTrial001ImagePath &&
  serumTrial001Manifest.artifact.original.sha256 === serumTrial001RegistrySha256 &&
  `${serumTrial001Manifest.artifact.original.width}x${serumTrial001Manifest.artifact.original.height}` === serumTrial001RegistryDimensions &&
  serumTrial001Manifest.artifact.original.format === "jpeg" &&
  serumTrial001Manifest.artifact.original.bytes === serumTrial001ImageEvidence?.bytes
);
check("serum_trial_001_product_sample_source_evidence_matches_file", () =>
  serumTrial001SourceEvidence.verified_source_image.path === serumTrial001ImagePath &&
  serumTrial001SourceEvidence.verified_source_image.sha256 === serumTrial001ImageEvidence?.sha256 &&
  `${serumTrial001SourceEvidence.verified_source_image.width}x${serumTrial001SourceEvidence.verified_source_image.height}` === serumTrial001ImageEvidence?.dimensions &&
  serumTrial001SourceEvidence.verified_source_image.mime === serumTrial001ImageEvidence?.mime &&
  serumTrial001SourceEvidence.verified_source_image.bytes === serumTrial001ImageEvidence?.bytes
);
check("serum_trial_001_product_sample_no_memory_or_daily_note_write", () =>
  serumTrial001Block.includes("write_to_memory_allowed: false") &&
  serumTrial001Block.includes("daily_note_write_allowed: false") &&
  serumTrial001SourceEvidence.side_effects.Codex_knowledge_memory_write_performed === false &&
  serumTrial001SourceEvidence.side_effects.project_DailyNote_writer_performed === false
);
check("v7_34_hardening_doc_exists", () => fileExists(v734HardeningDocPath));
check("v7_34_hardening_doc_records_memory_layer_split", () =>
  fileContains(v734HardeningDocPath, "Codex_knowledge_memory") &&
  fileContains(v734HardeningDocPath, "VCPToolBox_DailyNoteWrite") &&
  fileContains(v734HardeningDocPath, "exact_execution_packet_required_for_side_effects")
);
check("v7_34_hardening_doc_records_broker_proof", () =>
  fileContains(v734HardeningDocPath, "VCP_broker_proof_required") &&
  fileContains(v734HardeningDocPath, "provider secret and Authorization header stay inside VCPToolBox") &&
  fileContains(v734HardeningDocPath, "migration/bootstrap tooling only")
);
check("memory_architecture_attempt_018_layer_split_recorded", () =>
  fileContains("memory_policy/memory_architecture.md", "Attempt-018 记忆层级拆分") &&
  fileContains("memory_policy/memory_architecture.md", "Codex workspace knowledge memory") &&
  fileContains("memory_policy/memory_architecture.md", "vcp_root_dailynote")
);
check("accepted_sample_schema_memory_effects_contract", () =>
  fileContains("schemas/accepted_sample_registry.schema.yaml", "provider_type: codex_session_image | direct_api | project_plugin") &&
  fileContains("schemas/accepted_sample_registry.schema.yaml", "memory_effects:") &&
  fileContains("schemas/accepted_sample_registry.schema.yaml", "native_doubao_image_is_not_secretless_delegate: true")
);
check("dailynote_adapter_strict_schema_plan_recorded", () =>
  fileContains("schemas/ail_dailynote_write_adapter.schema.yaml", "future_strict_json_schema_plan:") &&
  fileContains("schemas/ail_dailynote_write_adapter.schema.yaml", "ail_dailynote_write_envelope.v1.schema.json") &&
  fileContains("schemas/ail_dailynote_write_adapter.schema.yaml", "canonical_target_hash_match required after future write")
);
check("ecosystem_receipt_v7_34_hardening_recorded", () => {
  const receipt = readJson("reports/runtime_to_review_v1/secretless_serum_attempt_018_complete_ecosystem_loop_receipt_20260606.json");
  return receipt.post_push_static_review_hardening?.phase === "v7_34_full_code_surface_hardening_closeout" &&
    receipt.post_push_static_review_hardening?.memory_layer_distinction?.Codex_knowledge_memory_written === true &&
    receipt.post_push_static_review_hardening?.memory_layer_distinction?.VCPToolBox_DailyNoteWrite_called === false &&
    receipt.post_push_static_review_hardening?.broker_boundary?.native_doubao_image_is_secretless_delegate === false &&
    receipt.post_push_static_review_hardening?.future_execution_boundary?.exact_execution_packet_required_for_side_effects === true &&
    receipt.post_push_static_review_hardening?.new_runtime_execution_performed === false &&
    receipt.post_push_static_review_hardening?.new_image_generation_performed === false &&
    receipt.post_push_static_review_hardening?.additional_memory_write_performed === false;
});
check("final_closeout_v7_34_hardening_recorded", () =>
  fileContains("reports/runtime_to_review_v1/agent_image_lab_final_project_closeout_20260606.md", "v7_34_full_code_surface_hardening_closeout") &&
  fileContains("reports/runtime_to_review_v1/agent_image_lab_final_project_closeout_20260606.md", "native_doubao_image_is_secretless_delegate: false") &&
  fileContains("reports/runtime_to_review_v1/agent_image_lab_final_project_closeout_20260606.md", "remote_master_aligned_to_final_closeout_state: true") &&
  fileContains("reports/runtime_to_review_v1/agent_image_lab_final_project_closeout_20260606.md", "local_master_has_unpushed_reconciliation_or_hardening_work: false")
);
check("legacy_wallet_sample_present", () => sampleBlocks.has("accepted_product_still_life_tennis_wallet_001"));
check("legacy_rattan_bag_samples_present", () => requiredSampleIds.slice(1, 5).every((id) => sampleBlocks.has(id)));
check("watermark_false_history_preserved", () => registry.includes("watermark_requested: false"));
check("validates_watermark_history_preserved", () => registry.includes("validates_watermark_false_parameter: true"));
check("memory_suitability_false_present", () => registry.includes("memory_suitability: false"));
check("all_samples_block_memory_write", () => [...sampleBlocks.values()].every((block) => block.includes("write_to_memory_allowed: false")));
check("all_samples_block_daily_note_write", () => [...sampleBlocks.values()].every((block) => block.includes("daily_note_write_allowed: false")));

const categoryIndexes = allowedCategoryFiles.map(extractCategoryIndex);
for (const index of categoryIndexes) {
  check(`category_${index.category}_sample_count_matches_list`, () => index.sampleCount === index.sampleIds.length);
  check(`category_${index.category}_samples_exist_in_registry`, () => index.sampleIds.every((id) => sampleBlocks.has(id)));
  check(`category_${index.category}_samples_match_registry_category`, () =>
    index.sampleIds.every((id) => extractField(sampleBlocks.get(id), "category") === index.category)
  );
}

check("product_category_count_6", () => fileContains("accepted_samples/categories/product_still_life.yaml", "sample_count: 6"));
check("fashion_lifestyle_category_count_5", () => fileContains("accepted_samples/categories/fashion_lifestyle_still_life.yaml", "sample_count: 5"));
check("fashion_lookbook_category_count_2", () => fileContains("accepted_samples/categories/fashion_lookbook_portrait.yaml", "sample_count: 2"));
check("tracked_accepted_samples_are_metadata_only", () =>
  listTrackedAcceptedSamplesFiles().every((file) => !imageExtensions.test(file))
);
check("validate_mvp_includes_accepted_samples_validator", () =>
  fileContains("scripts/validate_mvp.ps1", "validate_v7_32_accepted_sample_registry_update")
);

const summary = {
  passed,
  validator: "validate_accepted_sample_registry_metadata",
  version: "v4",
  phase: "accepted_samples metadata registry",
  check_count: results.length,
  failed_count: results.filter((result) => !result.passed).length,
  registry_only: true,
  metadata_only: true,
  accepted_samples_metadata_write_allowed_by_current_goal: true,
  image_files_committed_to_git: true,
  image_files_committed_to_git_summary: "mixed",
  any_image_files_committed_to_git: true,
  all_image_files_committed_to_git: false,
  headphones_image_files_committed_to_git: true,
  runs_source_image_modification_allowed: false,
  production_candidate_write_allowed: false,
  daily_note_write_allowed: false,
  vcp_memory_write_allowed: false,
  provider_contact_required: false,
  plugin_call_required: false,
  api_call_required: false,
  external_network_required: false,
  file_write_performed: false,
  results,
};

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (!passed) process.exitCode = 1;
