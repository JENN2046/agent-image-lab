#!/usr/bin/env node
"use strict";

const validator = require("./validators/autopilot_governance/validate_smart_v3_push_safety_lane.js");

if (validator && typeof validator.main === "function") {
  validator.main();
}
