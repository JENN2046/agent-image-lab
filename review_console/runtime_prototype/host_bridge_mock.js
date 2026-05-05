window.ImageLabHostBridge = (() => {
  const session = {
    session_id: "session-v1-2-runtime-prototype-001",
    task_id: "ail-v1-2-runtime-prototype-001",
    case_id: "case-v1-2-runtime-prototype-001",
    project: "Agent Image Lab",
    image_versions: [
      {
        version_id: "v1",
        label: "v1.0 accepted reference",
        asset_ref: "runs/photo_studio_os_v0_10_doubao_retry/image/doubaogen/accepted-image.placeholder",
        score: 84
      }
    ],
    current_version_id: "v1",
    ai_review: {
      reviewer_type: "ai",
      reviewer_name: "Critic_Agent",
      total_score: 81,
      archive_recommendation: "candidate",
      note_cn: "AI 评分只作为建议。"
    },
    memory_preview: {
      chinese_diary_title: "Photo Studio OS v1.0 人工接受经验",
      target_notebook: "Photo_Studio_OS_Style_Memory",
      tags: ["PhotoStudioOS", "v1.0", "人工接受"],
      safety: {
        contains_secret: false,
        contains_private_path: false,
        contains_customer_private_data: false,
        contains_image_binary: false
      }
    }
  };

  return {
    loadSession() {
      return JSON.parse(JSON.stringify(session));
    },
    submitDraft(draft) {
      return {
        accepted_by_host_mock: true,
        draft_received: Boolean(draft),
        side_effects_performed: false
      };
    }
  };
})();
