#!/usr/bin/env node
"use strict";

const validator = require("./validators/autopilot_governance/validate_autopilot_amber_packet_to_receipt_traceability.js");

if (validator && typeof validator.main === "function") {
  validator.main();
}
