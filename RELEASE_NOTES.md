# Release Notes

## Unreleased

- Added project-internal Adapter dry-run lab.
- Added export-level `dry-run-adapter.js` candidate for AgentImageLabAdapter.
- Updated AgentImageLabAdapter export into a v0.5 VCPToolBox stdio dry-run adapter package.
- Added v0.5 Adapter dry-run installation verification record.
- Added v0.6 single real image plugin manifest sanitized review record.
- Added v0.7 real-loop preflight package: Gatekeeper risk boundary, Review Console human approval preflight, and real execution confirmation form.
- Added v0.7 real execution authorization gate and Photo Studio OS zero-call dry-run rehearsal record.
- Added v0.8 release-readiness report, install/operation guide, and final acceptance report.
- Added v0.7 Photo Studio OS one-call real execution harness and sanitized execution record.
- Added `runs/` ignore rule so generated runtime assets stay out of Git by default.
- Added v0.9 post-execution checkpoint and retry authorization gate.
- Added Phase C sanitized manifest review record for the repository draft manifest.
- Added Phase D dry-run contract and fixtures.
- Added v0.5-v1.0 completion planning docs for Adapter install, real plugin manifest review, Photo Studio OS first run, and release readiness.

## Safety Status

- A user-authorized VCPToolBox Adapter-only dry-run installation verification has been performed.
- A user-authorized single real image plugin manifest sanitized review has been performed.
- v0.7 real-loop preflight documents were prepared, then a separate user authorization approved one DoubaoGen call.
- Photo Studio OS dry-run rehearsal has completed with zero plugin calls.
- Photo Studio OS real execution completed with exactly one authorized DoubaoGen call.
- The generated asset was rejected for prompt mismatch because it included a human subject despite the no-people constraint.
- Current release recommendation is post-execution checkpoint, not v1.0 final.
- DoubaoGen was selected only for the single authorized execution.
- One external API call has been performed under v0.7 authorization.
- No DailyNote write has been performed.
- One image file was created under ignored runtime output and was not committed or written into memory.
