(() => {
  const fixture = {
    assets: [
      {
        id: "premium_portable_led_camping_lantern_v13_013",
        title: "高级便携 LED 露营灯",
        product: "高级便携 LED 露营灯",
        sourceOutput: "仅文本引用；不会加载本地图片文件",
        promptPackage: "prompts/image_generation/product_lifestyle_premium_portable_led_camping_lantern_v1.yaml",
        status: "已接受候选，带少量观察项",
        acceptedCandidate: true,
        commercialDeliveryReady: false,
        memorySuitability: "待定",
        acceptedSamplesReady: false,
        routeStatus: "已作为接受候选封存，并具备交付准备包",
        evidencePackage: "docs/camping_lantern_accepted_candidate_evidence_package_v1.md",
        deliveryReadinessPackage: "docs/camping_lantern_delivery_readiness_package_v1.md",
        keyFindings: [
          "商品身份可读为高级便携 LED 露营灯。",
          "暖色扩散光和机身分层较可信。",
          "保留为已接受候选，但仍带少量观察项。"
        ],
        watchItems: [
          "扩散罩中心亮度",
          "下半部机身偏暗",
          "底座与机身分离感",
          "裁切边缘可读性",
          "商品身份锁定"
        ]
      },
      {
        id: "premium_serum_bottle_v10_011",
        title: "高级精华瓶",
        product: "化妆品护肤瓶 / 高级精华瓶",
        sourceOutput: "仅文本引用；不会加载本地图片文件",
        promptPackage: "prompts/image_generation/product_lifestyle_premium_serum_bottle_v1.yaml",
        status: "已接受候选，带少量观察项",
        acceptedCandidate: true,
        commercialDeliveryReady: false,
        memorySuitability: "待定",
        acceptedSamplesReady: false,
        routeStatus: "已重构为视觉生产链样本",
        evidencePackage: "docs/premium_serum_bottle_accepted_candidate_evidence_package_v1.md",
        deliveryReadinessPackage: "尚未创建",
        keyFindings: [
          "高级护肤瓶身份得到保留。",
          "材质与轮廓仍适合作为重构审查样本。",
          "交付与记忆决策仍保持待定。"
        ],
        watchItems: [
          "标签可读性边界",
          "材质高光控制",
          "商业交付审查尚未完成"
        ]
      }
    ],
    boundaries: [
      ["服务提供方接触", false],
      ["图片生成", false],
      ["重试", false],
      [".env.local 值读取", false],
      ["记忆写入", false],
      ["已接受样本写入", false],
      ["runs 输出提交", false],
      ["runs 图片二进制读取", false],
      ["真实修图执行", false],
      ["衍生图片创建", false],
      ["真实商业交付执行", false],
      ["生产候选 002", false],
      ["批次 005", false]
    ],
    actions: [
      "按照 v14.010 授权边界静态审查 HTML 原型。",
      "决定是继续微调静态界面，还是在进入实现前停止。",
      "继续阻断服务提供方、图片、记忆、已接受样本和生产路线。"
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
    ["资产 ID", asset.id],
    ["商品", asset.product],
    ["源输出", asset.sourceOutput],
    ["提示词包", asset.promptPackage],
    ["资产状态", asset.status],
    ["已接受候选", formatBool(asset.acceptedCandidate)],
    ["商业交付就绪", formatBool(asset.commercialDeliveryReady)],
    ["记忆适配性", asset.memorySuitability],
    ["已接受样本就绪", formatBool(asset.acceptedSamplesReady)],
    ["路线状态", asset.routeStatus]
  ];

  const formatBool = (value) => value ? "是" : "否";
  const technicalTerms = new Set(["资产 ID", "提示词包"]);

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  const technicalValue = (value) => `<span class="technical-token">${escapeHtml(value)}</span>`;

  const renderFieldValue = (term, value) => (
    technicalTerms.has(term) ? technicalValue(value) : escapeHtml(value)
  );

  const visibleAssets = () => fixture.assets.filter((asset) => {
    if (state.filter === "packaged") {
      return asset.deliveryReadinessPackage !== "尚未创建";
    }

    if (state.filter === "needs-package") {
      return asset.deliveryReadinessPackage === "尚未创建";
    }

    return true;
  });

  const selectedAsset = () => fixture.assets.find((asset) => asset.id === state.selectedAssetId) || fixture.assets[0];

  const ensureVisibleSelection = () => {
    const assets = visibleAssets();

    if (!assets.some((asset) => asset.id === state.selectedAssetId)) {
      state.selectedAssetId = assets[0]?.id || fixture.assets[0].id;
    }

    return assets;
  };

  const renderFilters = () => {
    document.querySelectorAll("[data-filter]").forEach((button) => {
      const isActive = button.dataset.filter === state.filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const renderMetrics = () => {
    elements.totalAssets.textContent = String(fixture.assets.length);
    elements.acceptedCandidates.textContent = String(fixture.assets.filter((asset) => asset.acceptedCandidate).length);
    elements.commercialReady.textContent = String(fixture.assets.filter((asset) => asset.commercialDeliveryReady).length);
    elements.memoryDeferred.textContent = String(fixture.assets.filter((asset) => asset.memorySuitability === "待定").length);
  };

  const renderAssetList = () => {
    const assets = ensureVisibleSelection();
    elements.assetList.innerHTML = "";

    if (assets.length === 0) {
      elements.assetList.innerHTML = '<p class="empty-state">当前筛选下没有可审片资产。</p>';
      return;
    }

    assets.forEach((asset) => {
      const isActive = asset.id === state.selectedAssetId;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `asset-button${isActive ? " is-active" : ""}`;
      button.dataset.assetId = asset.id;
      button.setAttribute("aria-pressed", String(isActive));
      button.innerHTML = `
        <strong>${escapeHtml(asset.title)}</strong>
        <span>${escapeHtml(asset.status)}</span>
        <span>${escapeHtml(asset.routeStatus)}</span>
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
      <dt>${escapeHtml(term)}</dt>
      <dd>${renderFieldValue(term, value)}</dd>
    `).join("");
  };

  const renderEvidence = (asset) => {
    elements.evidenceList.innerHTML = asset.keyFindings.map((finding) => `
      <li>${escapeHtml(finding)}</li>
    `).join("");
  };

  const renderReadiness = (asset) => {
    elements.readinessBoard.innerHTML = `
      <p><strong>证据包：</strong>${technicalValue(asset.evidencePackage)}</p>
      <p><strong>交付准备包：</strong>${technicalValue(asset.deliveryReadinessPackage)}</p>
      <p><strong>商业交付就绪：</strong>${formatBool(asset.commercialDeliveryReady)}</p>
      <p><strong>已接受样本就绪：</strong>${formatBool(asset.acceptedSamplesReady)}</p>
      <span class="tag">${escapeHtml(asset.memorySuitability)}</span>
    `;
  };

  const renderWatchItems = (asset) => {
    elements.watchList.innerHTML = asset.watchItems.map((item) => `
      <li>${escapeHtml(item)}</li>
    `).join("");
  };

  const renderBoundaries = () => {
    elements.boundaryList.innerHTML = fixture.boundaries.map(([key, value]) => `
      <li><span>${escapeHtml(key)}</span><strong>${formatBool(value)}</strong></li>
    `).join("");
  };

  const renderActions = () => {
    elements.actionList.innerHTML = fixture.actions.map((action) => `
      <li>${escapeHtml(action)}</li>
    `).join("");
  };

  const bindFilters = () => {
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === state.filter));
      button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        render();
      });
    });
  };

  const render = () => {
    const asset = selectedAsset();
    renderFilters();
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
