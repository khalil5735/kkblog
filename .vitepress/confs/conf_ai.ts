export default {
  nav(parent_path: string) {
    const base = "/800-docs-ai";
    return { text: "AI", link: base, activeMatch: base };
  },
  sidebar(parent_path: string) {
    const base = "/800-docs-ai/";
    return {
      [base]: [
        { text: "概述", link: base },
        { text: "PGC和UGC和AIGC", link: `${base}/PGC和UGC和AIGC` },
        { text: "Prompt", link: `${base}/prompt/prompt_collection` },
        { text: "SpringAI", link: `${base}/springai/springai` }
      ]
    };
  }
};
