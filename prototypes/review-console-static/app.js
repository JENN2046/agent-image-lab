(() => {
  const fixture = {
    assets: [
      {
        id: "premium_portable_led_camping_lantern_v13_013",
        title: "Premium portable LED camping lantern",
        product: "premium_portable_led_camping_lantern",
        sourceOutput: "text reference only; local image file is not loaded",
        promptPackage: "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml",
        status: "accepted_candidate_with_minor_watch_items",
        acceptedCandidate: true,
        commercialDeliveryReady: false,
        memorySuitability: "deferred",
        acceptedSamplesReady: false,
        routeStatus: "closed_as_accepted_candidate_with_delivery_readiness_package",
        evidencePackage: "docs/camping_lantern_accepted_candidate_evidence_package_v1.md",
        deliveryReadinessPackage: "docs/camping_lantern_delivery_readiness_package_v1.md",
        keyFindings: [
          "Product identity reads as a premium portable LED camping lantern.",
          "Warm diffuser glow and body separation are plausible.",
          "Accepted candidate retained with minor watch items."
        ],
        watchItems: [
          "diffuser_center_brightness",
          "lower_body_darkness",
          "base_body_separation",
          "edge_readability_in_crop",
          "product_identity_lock"
        ]
      },
      {
        id: "premium_serum_bottle_v10_011",
        title: "Premium serum bottle",
        product: "cosmetic_skincare_bottle / premium_serum_bottle",
        sourceOutput: "text reference only; local image file is not loaded",
        promptPackage: "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml",
        status: "accepted_candidate_with_minor_watch_items",
        acceptedCandidate: true,
        commercialDeliveryReady: false,
        memorySuitability: "deferred",
        acceptedSamplesReady: false,
        routeStatus: "reconstructed_as_visual_production_loop_sample",
        evidencePackage: "docs/premium_serum_bottle_accepted_candidate_evidence_package_v1.md",
        deliveryReadinessPackage: "not_created",
        keyFindings: [
          "Premium skincare bottle identity retained.",
          "Material and silhouette remain useful for reconstruction review.",
          "Delivery and memory decisions remain deferred."
        ],
        watchItems: [
          "label_legibility_boundary",
          "material_highlight_control",
          "commercial_delivery_review_not_completed"
        ]
      }
    ],
    boundaries: {
      provider_contact: false,
      image_generation: false,
      retry: false,
      env_local_secret_value_read: false,
      memory_write: false,
      accepted_samples_written: false,
      runs_output_committed: false,
      runs_image_binary_read: false,
      real_retouch_execution: false,
      derivative_image_created: false,
      real_commercial_delivery_execution: false,
      production_candidate_002: false,
      Batch_005: false
    },
    actions: [
      "Static review the HTML prototype against the v14.010 authorization boundary.",
      "Decide whether to refine the static surface or stop before implementation.",
      "Keep provider, image, memory, accepted samples, and production routes blocked."
    ]
  };

  const state = {
    selectedAssetId: fixture.assets[0].id,
    filter: "all"
  };

  const select = (selector) => document.querySelector(selector);

  const elements = {
    totalAssets: select('[data-metric="totalAssets"]'),
    acceptedCandidates: select('[data-metric="acceptedCandidates"]'),
    commercialReady: select('[data-metric="commercialReady"]'),
    memoryDeferred: select('[data-metric="memoryDeferred"]'),
    assetList: select("[data-asset-list]"),
    selectedProduct: select("[data-selected-product]"),
    selectedTitle: select("[data-selected-title]"),
    selectedFields: select("[data-selected-fields]"),
    evidenceList: select("[data-evidence-list]"),
    readinessBoard: select("[data-readiness-board]"),
    watchList: select("[data-watch-list]"),
    boundaryList: select("[data-boundary-list]"),
    actionList: select("[data-action-list]")
  };

  const fieldRows = (asset) => [
    ["Asset ID", asset.id],
    ["Product", asset.product],
    ["Source output", asset.sourceOutput],
    ["Prompt package", asset.promptPackage],
    ["Asset status", asset.status],
    ["Accepted candidate", String(asset.acceptedCandidate)],
    ["Commercial delivery ready", String(asset.commercialDeliveryReady)],
    ["Memory suitability", asset.memorySuitability],
    ["Accepted samples ready", String(asset.acceptedSamplesReady)],
    ["Route status", asset.routeStatus]
  ];

  const visibleAssets = () => fixture.assets.filter((asset) => {
    if (state.filter === "accepted") {
      return asset.acceptedCandidate;
    }

    if (state.filter === "deferred") {
      return asset.memorySuitability === "deferred";
    }

    return true;
  });

  const selectedAsset = () => fixture.assets.find((asset) => asset.id === state.selectedAssetId) || fixture.assets[0];

  const renderMetrics = () => {
    elements.totalAssets.textContent = String(fixture.assets.length);
    elements.acceptedCandidates.textContent = String(fixture.assets.filter((asset) => asset.acceptedCandidate).length);
    elements.commercialReady.textContent = String(fixture.assets.filter((asset) => asset.commercialDeliveryReady).length);
    elements.memoryDeferred.textContent = String(fixture.assets.filter((asset) => asset.memorySuitability === "deferred").length);
  };

  const renderAssetList = () => {
    elements.assetList.innerHTML = "";

    visibleAssets().forEach((asset) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `asset-button${asset.id === state.selectedAssetId ? " is-active" : ""}`;
      button.dataset.assetId = asset.id;
      button.innerHTML = `
        <strong>${asset.title}</strong>
        <span>${asset.status}</span>
        <span>${asset.routeStatus}</span>
      `;
      button.addEventListener("click", () => {
        state.selectedAssetId = asset.id;
        render();
      });
      elements.assetList.appendChild(button);
    });
  };

  const renderAssetDetail = (asset) => {
    elements.selectedProduct.textContent = asset.product;
    elements.selectedTitle.textContent = asset.title;
    elements.selectedFields.innerHTML = fieldRows(asset).map(([term, value]) => `
      <dt>${term}</dt>
      <dd>${value}</dd>
    `).join("");
  };

  const renderEvidence = (asset) => {
    elements.evidenceList.innerHTML = asset.keyFindings.map((finding) => `
      <li>${finding}</li>
    `).join("");
  };

  const renderReadiness = (asset) => {
    elements.readinessBoard.innerHTML = `
      <p><strong>Evidence package:</strong> ${asset.evidencePackage}</p>
      <p><strong>Delivery readiness package:</strong> ${asset.deliveryReadinessPackage}</p>
      <p><strong>Commercial delivery ready:</strong> ${asset.commercialDeliveryReady}</p>
      <p><strong>Accepted samples ready:</strong> ${asset.acceptedSamplesReady}</p>
      <span class="tag">${asset.memorySuitability}</span>
    `;
  };

  const renderWatchItems = (asset) => {
    elements.watchList.innerHTML = asset.watchItems.map((item) => `
      <li>${item}</li>
    `).join("");
  };

  const renderBoundaries = () => {
    elements.boundaryList.innerHTML = Object.entries(fixture.boundaries).map(([key, value]) => `
      <li><span>${key}</span><strong>${value}</strong></li>
    `).join("");
  };

  const renderActions = () => {
    elements.actionList.innerHTML = fixture.actions.map((action) => `
      <li>${action}</li>
    `).join("");
  };

  const bindFilters = () => {
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach((target) => target.classList.remove("is-active"));
        button.classList.add("is-active");
        renderAssetList();
      });
    });
  };

  const render = () => {
    const asset = selectedAsset();
    renderMetrics();
    renderAssetList();
    renderAssetDetail(asset);
    renderEvidence(asset);
    renderReadiness(asset);
    renderWatchItems(asset);
    renderBoundaries();
    renderActions();
  };

  bindFilters();
  render();
})();
