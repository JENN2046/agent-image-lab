#!/usr/bin/env node
"use strict";

const { createRecoverabilityCore } = require("./lib/artifact_recoverability_core");

const core = createRecoverabilityCore(process.cwd());

function readArg(name, fallback) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

const sampleId = readArg("sample-id", "accepted_french_summer_rattan_bucket_bag_001");
const requiredLongEdge = Number(readArg("long-edge", "512"));

const result = core.validatePreviewCapsule(sampleId, { requiredLongEdge });
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exit(result.passed ? 0 : 1);
