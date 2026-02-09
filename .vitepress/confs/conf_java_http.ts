export default {
  nav(parent_path: string) {
    return {};
  },
  sidebar(parent_path: string) {
    const base = parent_path + "/170-http";
    return {
      [base]: [
        {
          text: "概述",
          link: base
        },
        {
          text: "OkHttp3",
          base: base + "/okhttp3/",
          items: [{ text: "OkHttp3-SSE", link: "okhttp3-sse" }]
        },
        {
          text: "SSE",
          link: base + "/sse"
        }
      ]
    };
  }
};
