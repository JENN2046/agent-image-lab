#!/usr/bin/env node
"use strict";

const validator = require("./validators/autopilot_governance/validate_autopilot_readiness_receipt_registry_cross_claims.js");

if (validator && typeof validator.main === "function") {
  validator.main();
}
