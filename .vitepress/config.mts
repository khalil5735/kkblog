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
      text: "java 基础",
      base: base + "/java-basic/",
      items: [
        { text: "代码块", link: "代码块" },
        { text: "面向对象基础", link: "面向对象基础" },
        { text: "正则表达式", link: "正则表达式" },
        { text: "注解", link: "注解" },
        { text: "Java中自定义注解的使用", link: "Java中自定义注解的使用" },
        { text: "IO流概述", link: "IO流概述" },
        { text: "Java 日期", link: "Java 日期" },
        { text: "java 文件操作-获取resource下文件的路径", link: "java 文件操作-获取resource下文件的路径" },
        { text: "java反射机制", link: "java反射机制" },
        { text: "Java基础—成员变量、局部变量和静态变量的区别", link: "Java基础—成员变量、局部变量和静态变量的区别" },
        { text: "Java中关键字-final", link: "Java中关键字-final" },
        { text: "Java中关键字-static", link: "Java中关键字-static" },
        { text: "List集合取交集、并集、差集、去重并集", link: "List集合取交集、并集、差集、去重并集" },
        { text: "List集合中的对象按照某个字段去重实现", link: "List集合中的对象按照某个字段去重实现" },
      ],
    },
    {
      text: "java8",
      base: base + "/java8/",
      items: [{ text: "函数式接口", link: "函数式接口" }],
    },
  ];
}
