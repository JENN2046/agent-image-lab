#!/usr/bin/env node
"use strict";

const validator = require("./validators/autopilot_governance/validate_autopilot_receipt_registry_negative_cases.js");

if (validator && typeof validator.main === "function") {
  validator.main();
}
