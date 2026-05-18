export default {
  nav(parent_path: string) {
    const base = parent_path + "/500-docs-tools/";
    return {
      text: "百宝箱",
      link: base,
      activeMatch: base
    };
  },
  sidebar(parent_path: string) {
    const base = parent_path + "/500-docs-tools/";
    return {
      [base]: [
        {
          text: "概述",
          link: base
        },
        {
          text: "vscode",
          base: base + "vscode/",
          items: [
            { text: "vscode 常用配置", link: "/index" },
            { text: "vscode 插件推荐", link: "/vscode-plugin" }
          ]
        },
        {
          text: "Git",
          base: base + "tool-git/",
          items: [
            { text: "Git", link: "git" },
            { text: "GitFlow", link: "/gitflow" },
            { text: "Github访问", link: "github访问" }
          ]
        },
        {
          text: "其他工具",
          base: base,
          items: [
            { text: "markdown", link: "use-markdown" },
            { text: "nvm", link: "nvm" },
            { text: "vitepress", link: "vitepress" }
          ]
        }
      ]
    };
  }
};
