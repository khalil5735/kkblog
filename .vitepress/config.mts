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
        text: "JAVA",
        items: [
          {
            text: "java 基础",
            link: "/100-docs-java/搭建java开发环境",
            activeMatch: "/100-docs-java/java-basic",
          },
          {
            text: "java8",
            link: "/100-docs-java/java8",
            activeMatch: "/100-docs-java/java8",
          },
          {
            text: "Spring",
            link: "/100-docs-java/spring/core/Bean的生命周期回调",
            activeMatch: "/100-docs-java/spring",
          },
          {
            text: "数据库框架",
            link: "/100-docs-java/db-framework/",
            activeMatch: "/100-docs-java/db-framework",
          },
          {
            text: "Jersey",
            link: "/100-docs-java/jersey/",
            activeMatch: "/100-docs-java/jersey",
          },
        ],
      },
      {
        text: "大前端",
        link: "/200-docs-front/",
        activeMatch: "/200-docs-front/",
      },
      {
        text: "百宝箱",
        link: "/500-docs-tools/",
        activeMatch: "/500-docs-tools",
      },
    ],

    sidebar: {
      // "/docs-example/": {
      //   base: "/docs-example/",
      //   items: exampleGuideSidebar(),
      // },
      "/100-docs-java/": {
        base: "/100-docs-java/",
        items: javaGuideSidebar("/100-docs-java/"),
      },
      "/100-docs-java/spring/": {
        base: "/100-docs-java/spring/",
        items: javaGuideSpringSidebar(),
      },
      "/100-docs-java/java8/": {
        base: "/100-docs-java/java8/",
        items: javaGuideJava8Sidebar(),
      },
      "/100-docs-java/db-framework/": {
        base: "/100-docs-java/db-framework/",
        items: javaGuideDbFramworkSidebar("/100-docs-java/db-framework/"),
      },
      "/100-docs-java/jersey/": {
        base: "/100-docs-java/jersey/",
        items: javaGuideJerseySidebar("/100-docs-java/jersey/"),
      },
      // "/500-docs-tools/": {
      //   base: "/500-docs-tools/",
      //   items: toolsSidebar("/500-docs-tools/"),
      // },
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
    { text: "Maven环境", link: "/maven/maven" },
    {
      text: "java 基础",
      base: base + "/java-basic/",
      collapsed: false,
      items: [
        { text: "异常", link: "异常" },
        { text: "代码块", link: "java-basic-codeblock" },
        { text: "注解", link: "java-basic-annotation" },
        { text: "java反射机制", link: "java-basic-reflection" },
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
        {
          text: "成员变量、局部变量和静态变量",
          link: "成员变量、局部变量和静态变量",
        },
        { text: "Java中关键字-final", link: "java-keyword-final" },
        { text: "Java中关键字-static", link: "java-keyword-static" },
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

function javaGuideJava8Sidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "java8",
      base: "/100-docs-java/java8/",
      items: [{ text: "函数式接口", link: "函数式接口" }],
    },
  ];
}

function javaGuideSpringSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Spring Core",
      base: "/100-docs-java/spring/core",
      collapsed: false,
      items: [{ text: "Bean的生命周期回调", link: "/Bean的生命周期回调" }],
    },
    {
      text: "Spring整合邮件",
      link: "/整合/spring整合email",
    },
    {
      text: "Spring Other",
      base: "/100-docs-java/spring/",
      collapsed: false,
      items: [
        { text: "Spring JDBC", link: "/spring-jdbc" },
        { text: "Spring Event", link: "/spring-event" },
        { text: "Spring Message", link: "/spring-message" },
        { text: "Spring Transaction", link: "/spring-transaction" },
      ],
    },
  ];
}

function javaGuideDbFramworkSidebar(base): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "JDBC",
      base: base + "/jdbc/",
      items: [
        { text: "jdbc", link: "01-jdbc" },
        { text: "jdbc连接池", link: "02-jdbc-connection-pool" },
        { text: "Spring整合jdbc", link: "03-spring-jdbc" },
      ],
    },
    {
      text: "Mybatis",
      base: base + "/mybatis/",
      items: [{ text: "尚硅谷-Mybatis", link: "atguigu-mybatis" }],
    },
    {
      text: "Hibernate",
      base: base + "/hibernate/",
      items: [],
    },
    {
      text: "JPA",
      base: base + "/jpa/",
      items: [],
    },
    {
      text: "Spring中事务支持",
      link: "spring-tx",
    },
  ];
}

function javaGuideJerseySidebar(base): DefaultTheme.SidebarItem[] {
  return [
    { text: "1.Jersey快速入门", link: "1.Jersey快速入门" },
    { text: "2.Jersey参数绑定", link: "2.Jersey参数绑定" },
    { text: "3.Jersey中的注入", link: "3.Jersey中的注入" },
    { text: "4.Jersey的配置", link: "4.Jersey的配置" },
    { text: "5.Entity Provider", link: "5.Entity Provider" },
    { text: "6.Jersey上传下载", link: "6.Jersey上传下载" },
    { text: "7.Jersey客户端API入门", link: "7.Jersey客户端API入门" },
    { text: "8.Jersey的过滤器", link: "8.Jersey的过滤器" },
    { text: "9.Jersey的拦截器", link: "9.Jersey的拦截器" },
    { text: "10.Jersey统一异常处理", link: "10.Jersey统一异常处理" },
    { text: "11.Spring 集成 Jersey", link: "11.Spring 集成 Jersey" },
    { text: "12.Springboot集成Jersey", link: "12.Springboot集成Jersey" },
  ];
}
