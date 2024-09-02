import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "KK BLOG",
  description: "powered by VitePress",
  base: "/kkblog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Examples",
        link: "/docs-example/markdown-examples",
        activeMatch: "/docs-example/",
      },
      {
        text: "javaGuide",
        link: "/docs-java/java8/函数式接口",
        activeMatch: "/docs-java",
      },
    ],

    sidebar: {
      "/docs-example/": {
        base: "/docs-example/",
        items: exampleGuideSidebar(),
      },
      "/docs-java/": {
        base: "/docs-java/",
        items: javaGuideSidebar("/docs-java/"),
      },
    },

    socialLinks: [
      // { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
  },
});

function exampleGuideSidebar() {
  return [
    { text: "Markdown Examples", link: "markdown-examples" },
    { text: "Runtime API Examples", link: "api-examples" },
  ];
}

function javaGuideSidebar(base) {
  return [
    {
      text: "java8",
      base: base + "/java8/",
      items: [{ text: "函数式接口", link: "函数式接口" }],
    },
  ];
}
