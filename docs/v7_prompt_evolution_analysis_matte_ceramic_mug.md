# V7 Prompt Evolution Analysis - Matte Ceramic Mug

```yaml
analysis_id: v7_prompt_evolution_analysis_matte_ceramic_mug
source_phase: v7.285_v7_product_loop_closeout_and_v8_route_planning_gate
prompt_versions:
  - prompts/image_generation/product_still_life_matte_ceramic_mug_v1.yaml
  - prompts/image_generation/product_still_life_matte_ceramic_mug_v2.yaml
  - prompts/image_generation/product_still_life_matte_ceramic_mug_v3.yaml
  - prompts/image_generation/product_still_life_matte_ceramic_mug_v4.yaml
```

## v1 Baseline Problems

v1 established the subject and material direction but did not give the model enough product-main-image pressure.

Observed issues:

- Product scale was too small.
- Top whitespace was excessive.
- Lighting was flat.
- Background layering was weak.
- Cup rim edge was slightly rough.
- Handle attachment was not sharp enough.
- A small colored speck appeared.
- Commercial main-image premium feeling was insufficient.

## v2 Improvements

v2 improved the most important composition and product-value issues.

Effective changes:

- Product scale increased toward the 65-75 percent target.
- Top whitespace tightened.
- Main-image feel became stronger.
- Directional studio lighting and warm-gray background depth improved.
- Rim and handle clarity constraints became more explicit.
- Negative artifact controls became more useful.

Result: v2 produced the first `accepted_candidate_with_minor_retouch`.

## v3 Local Improvement And Regression

v3 tried to polish the remaining v2 defects: colored specks, rim edge, handle attachment, background line, rim light, and premium shadow.

Positive result:

- Colored speck control improved.
- Warm-gray background layering improved.
- Cup rim appeared cleaner.

Regression:

- Upper handle connection developed a blocky or notch-like artifact.
- Lower handle connection softened.
- Handle/body connection no longer looked structurally credible.
- Background became darker and less open.

Result: v3 became a valuable negative feedback sample, not a candidate.

## v4 Combined Result

v4 used v2 as the stable composition base and v3 as negative feedback.

Effective direction:

- Preserve v2 composition and product scale.
- Avoid drastic product style or camera-angle changes.
- Use conservative handle-geometry constraints.
- Require realistic smooth ceramic upper and lower handle attachment.
- Keep the warm-gray premium background, but brighter and less muddy than v3.
- Keep artifact controls for colored specks, random pixels, and malformed handle joints.

Result: v4 became the current best candidate with minor retouch needs.

## Prompt Learning Conclusions

- Composition constraints worked.
- Product-scale constraints worked.
- Negative artifact constraints worked.
- Handle geometry must be explicit, but over-constraining local detail can create structural regression.
- Product credibility should outrank local texture polish for ecommerce main-image work.
- Once an accepted candidate exists, further generation should be justified by clear incremental value, not momentum.

## V8 Prompt Implications

If V8 continues with final retouch planning, no new prompt generation is needed. If V8 expands to a second product, the reusable pattern should be:

- start with stable composition and product scale,
- apply artifact constraints early,
- keep product-structure constraints conservative,
- require human review before each next real trial,
- stop when accepted-candidate evidence is strong enough.
