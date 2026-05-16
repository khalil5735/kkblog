export default {
  nav(parent_path: string) {
    const base = parent_path + "/200-tools";
    return {
      text: "工具库",
      link: base,
      activeMatch: base
    };
  },
  sidebar(parent_path: string) {
    const base = parent_path + "/200-tools";
    return {
      [base]: [
        {
          text: "概述",
          link: base
        },
        {
          text: "http",
          base: base + "/http/",
          items: [
            { text: "OkHttp3", link: "okhttp3" },
            { text: "OkHttp3-SSE", link: "okhttp3-sse" },
            { text: "SSE", link: "sse" }
          ]
        },
        {
          text: "json",
          base: base + "/json/",
          items: [{ text: "Jackson", link: "jackson" }]
        },
        {
          text: "Apache Commons",
          base: base + "/apache-commons/",
          items: [
            {
              text: "概述",
              link: "/"
            },
            {
              text: "Apache Commons Lang3",
              base: base + "/apache-commons/commons-lang3/",
              items: [{ text: "BooleanUtils", link: "commons-lang3-booleanutils" }]
            },
            {
              text: "Apache Commons Text",
              base: base + "/apache-commons/commons-text/",
              items: [{ text: "StringSubstitutor", link: "commons-text-stringsubstitutor" }]
            }
          ]
        }
      ]
    };
  }
};
