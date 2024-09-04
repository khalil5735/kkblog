import { DefaultTheme, defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "KK BLOG",
  description: "powered by VitePress",
  base: "/kkblog",
  themeConfig: {
    outline: {
      level: "deep",
      label: "大纲",
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      {
        text: "示例",
        link: "/docs-example/markdown-examples",
        activeMatch: "/docs-example/",
      },
      {
        text: "javaGuide",
        link: "/docs-java/java8/函数式接口",
        activeMatch: "/docs-java",
      },
      {
        text: "百宝箱",
        link: "/docs-tools/",
        activeMatch: "/docs-tools",
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
      "/docs-tools/": {
        base: "/docs-tools/",
        items: toolsSidebar("/docs-tools/"),
      },
    },

    socialLinks: [
      // { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
  },
});

function exampleGuideSidebar(): DefaultTheme.SidebarItem[] {
  return [
    { text: "Markdown Examples", link: "markdown-examples" },
    { text: "Runtime API Examples", link: "api-examples" },
  ];
}

function toolsSidebar(base): DefaultTheme.SidebarItem[] {
  return [
    { text: "vscode", link: "vscode" },
    { text: "markdown", link: "use-markdown" },
    { text: "nvm", link: "nvm" },
  ];
}

function javaGuideSidebar(base): DefaultTheme.SidebarItem[] {
  return [
    { text: "安装JDK", link: "搭建java开发环境" },
    {
      text: "java 基础",
      base: base + "/java-basic/",
      collapsed: true,
      items: [
        { text: "异常", link: "异常2" },
        { text: "代码块", link: "java-basic-codeblock" },
        { text: "注解", link: "java-basic-annotation" },
        { text: "Scanner", link: "Scanner" },
        { text: "面向对象基础", link: "面向对象基础" },
        { text: "正则表达式", link: "正则表达式" },
        { text: "Java中自定义注解的使用", link: "Java中自定义注解的使用" },
        { text: "IO流概述", link: "IO流概述" },
        { text: "Java 日期", link: "Java 日期" },
        {
          text: "java 文件操作-获取resource下文件的路径",
          link: "java 文件操作-获取resource下文件的路径",
        },
        { text: "java反射机制", link: "java反射机制" },
        {
          text: "Java基础—成员变量、局部变量和静态变量的区别",
          link: "Java基础—成员变量、局部变量和静态变量的区别",
        },
        { text: "Java中关键字-final", link: "Java中关键字-final" },
        { text: "Java中关键字-static", link: "Java中关键字-static" },
        {
          text: "List集合取交集、并集、差集、去重并集",
          link: "List集合取交集、并集、差集、去重并集",
        },
        {
          text: "List集合中的对象按照某个字段去重实现",
          link: "List集合中的对象按照某个字段去重实现",
        },
      ],
    },
    {
      text: "java8",
      base: base + "/java8/",
      items: [{ text: "函数式接口", link: "函数式接口" }],
    },
    {
      text: "数据库框架",
      base: base + "/db-framework/",
      collapsed: true, // 配置可以折叠sidebar
      items: [
        {
          text: "mybatis",
          base: base + "/db-framework/mybatis/",
          collapsed: true,
          items: [
            { text: "mybatis", link: "mybatis" },
            { text: "springboot集成mybatis", link: "mybatis-springboot" },
          ],
        },
      ],
    },
  ];
}
