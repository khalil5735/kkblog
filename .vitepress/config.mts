import { defineConfig } from "vitepress";

import nav from "./config_nav";
import sidebar from "./config_sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  ignoreDeadLinks: true,
  title: "KK BLOG",
  description: "powered by VitePress",
  base: "/kkblog",
  themeConfig: {
    outline: {
      level: "deep",
      label: "大纲"
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: nav,
    sidebar: {
      ...sidebar
    },

    socialLinks: [
      // { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
});
