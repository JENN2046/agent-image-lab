# Synthetic A5 Authorization Gate

approved_product: premium_serum_bottle
approved_prompt_package: tests/fixtures/prompt_schema_validator/pass/prompt_package_serum_bottle_v1.yaml
output_directory: synthetic/output/premium_serum_bottle_first_trial/
provider_calls_max: 1
generation_attempts_max: 1
output_images_max: 1
auto_retry: false
stop_after_generation: true
secret_read_boundary: allowed only for a future explicitly authorized provider call; this fixture contains no secret values
A5_execution_started: false
provider_contact: false
