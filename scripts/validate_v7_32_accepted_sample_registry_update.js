const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const registryPath = "accepted_samples/accepted_sample_registry.yaml";
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
];
const requiredCodexSample = "accepted_womens_resort_relaxed_knit_codex_v2_001";
const requiredBagCodexSample = "accepted_fashion_lifestyle_woven_crossbody_bag_codex_v14_161_001";
const requiredLampCodexSample = "accepted_product_lifestyle_portable_led_camping_lantern_codex_v14_166_001";
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

const registry = readText(registryPath);
const sampleBlocks = extractSampleBlocks(registry);

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

check("product_category_count_2", () => fileContains("accepted_samples/categories/product_still_life.yaml", "sample_count: 2"));
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
  version: "v2",
  phase: "accepted_samples metadata registry",
  check_count: results.length,
  failed_count: results.filter((result) => !result.passed).length,
  registry_only: true,
  metadata_only: true,
  accepted_samples_metadata_write_allowed_by_current_goal: true,
  image_files_committed_to_git: false,
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
