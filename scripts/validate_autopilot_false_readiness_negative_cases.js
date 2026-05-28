#!/usr/bin/env node
"use strict";

const validator = require("./validators/autopilot_governance/validate_autopilot_false_readiness_negative_cases.js");

if (validator && typeof validator.main === "function") {
  validator.main();
}
