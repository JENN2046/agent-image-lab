# Autopilot Amber Dry-Run Execution Loop v1

This Green Lane local fixture proves the Amber workflow without real external
side effects:

```text
envelope -> action packet -> dry-run action -> execution receipt -> registry -> validation -> continuation decision
```

The dry-run envelope has zero provider/plugin/API/image/runtime calls, zero
dependency actions, zero external reads, known zero cost, structured rollback,
and all Red Lane gates still closed.

This document and its validator do not authorize provider contact, plugin calls,
API calls, image generation, memory writes, real source reads, runtime probes,
dependency changes, push, tag, release, or deploy.
