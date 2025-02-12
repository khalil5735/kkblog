import { DefaultTheme, defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  ignoreDeadLinks: true,
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
            text: "JUC",
            link: "/100-docs-java/120-java-juc/",
            activeMatch: "/100-docs-java/120-java-juc/",
          },
          {
            text: "Spring",
            link: "/100-docs-java/300-spring/core/Bean的生命周期回调",
            activeMatch: "/100-docs-java/spring",
          },
          {
            text: "SpringMVC",
            link: "/100-docs-java/500-springmvc",
            activeMatch: "/100-docs-java/500-springmvc",
          },
          {
            text: "SpringSecurity",
            link: "/100-docs-java/510-spring-security/",
            activeMatch: "/100-docs-java/510-spring-security",
          },
          {
            text: "SpringBoot",
            link: "/100-docs-java/600-springboot/",
            activeMatch: "/100-docs-java/600-springboot",
          },
          {
            text: "SpringCloud",
            link: "/100-docs-java/700-springcloud/",
            activeMatch: "/100-docs-java/700-springcloud",
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
          {
            text: "实践项目",
            link: "/100-docs-java/999-atiguigu-sz/",
            activeMatch: "/100-docs-java/999-atiguigu-sz/",
          },
          {
            text: "阿里巴巴开发规范",
            link: "/100-docs-java/阿里巴巴开发规范",
          },
        ],
      },
      {
        text: "大前端",
        link: "/200-docs-front/",
        activeMatch: "/200-docs-front/",
      },
      {
        text: "中间件",
        items: [
          {
            text: "Redis",
            link: "/300-docs-middleware/01-redis/",
            activeMatch: "/300-docs-middleware/01-redis/",
          },
          {
            text: "RabbitMQ",
            link: "/300-docs-middleware/810-中间件-RabbitMQ/",
            activeMatch: "/300-docs-middleware/810-中间件-RabbitMQ",
          },
        ],
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
      // "/100-docs-java/": {
      //   base: "/100-docs-java/",
      //   items: javaGuideSidebar("/100-docs-java/"),
      // },
      "/100-docs-java/120-java-juc/": {
        base: "/100-docs-java/120-java-juc/",
        items: [
          { text: "可见性、原子性和有序性", link: "02-可见性、原子性和有序性" },
          { text: "java内存模型", link: "JMM" },
          {
            text: "volatile共享变量的可见行",
            link: "volatile共享变量的可见行",
          },
          {
            text: "JUC中的阻塞队列",
            link: "JUC中的阻塞队列",
          },
        ],
      },
      "/100-docs-java/300-spring/": {
        base: "/100-docs-java/300-spring/",
        items: javaGuideSpringSidebar("/100-docs-java/300-spring/"),
      },
      "/100-docs-java/500-springmvc": {
        base: "/100-docs-java/500-springmvc/",
        items: [
          {
            text: "@RequestParam和@RequestPart",
            link: "@RequestParam和@RequestPart",
          },
          {
            text: "SpringMVC文件上传",
            link: "SpringMVC文件上传",
          },
          {
            text: "拦截器",
            link: "拦截器",
          },
          {
            text: "DispatcherServlet初始化过程",
            link: "DispatcherServlet初始化过程",
          },
          {
            text: "DispatcherServlet请求处理流程",
            link: "DispatcherServlet请求处理流程",
          },
          {
            text: "RequestContextHolder",
            link: "RequestContextHolder",
          },
          {
            text: "Atguigu",
            base: "/100-docs-java/500-springmvc/atguigu2024/",
            items: [
              {
                text: "01-SpringMVC简介",
                link: "01-SpringMVC简介",
              },
              {
                text: "02-HelloWorld",
                link: "02-HelloWorld",
              },
              {
                text: "03-@RequestMapping注解",
                link: "03-@RequestMapping注解",
              },
              {
                text: "04-SpringMVC获取请求参数",
                link: "04-SpringMVC获取请求参数",
              },
              {
                link: "05-域对象共享数据",
                text: "05-域对象共享数据",
              },
              {
                text: "06-SpringMVC的视图",
                link: "06-SpringMVC的视图",
              },
              {
                text: "07-RESTful",
                link: "07-RESTful",
              },
              {
                text: "08-HttpMessageConverter",
                link: "08-HttpMessageConverter",
              },
              {
                text: "09-文件的上传与下载",
                link: "09-文件的上传与下载",
              },
              {
                text: "10-拦截器",
                link: "10-拦截器",
              },
              {
                text: "11-异常处理器",
                link: "11-异常处理器",
              },
              {
                text: "12-注解配置SpringMVC",
                link: "12-注解配置SpringMVC",
              },
              {
                text: "13-SpringMVC执行流程",
                link: "13-SpringMVC执行流程",
              },
            ],
          },
          {
            text: "路人系列",
            base: "/100-docs-java/500-springmvc/luren/",
            items: [
              {
                text: "02-@Controller、@RequestMapping",
                link: "02-@Controller、@RequestMapping",
              },
              {
                text: "03-接口测试HTTP Client.md",
                link: "03-接口测试HTTP Client.md",
              },
              { text: "04-接收请求中的参数", link: "04-接收请求中的参数" },
              {
                text: "05-@RequestBody接收Json格式数据",
                link: "05-@RequestBody接收Json格式数据",
              },
              {
                text: "06-上传文件的4种方式",
                link: "06-上传文件的4种方式",
              },
              {
                text: "07-返回视图页面常见的5种方式",
                link: "07-返回视图页面常见的5种方式",
              },
              {
                text: "11-集成静态资源的多种方式",
                link: "11-集成静态资源的多种方式",
              },
            ],
          },
          {
            text: "SpringMVC中方法Hanlder的注册过程",
            link: "SpringMVC中方法Hanlder的注册过程",
          },
          {
            text:'Swagger',
            base:'/100-docs-java/500-springmvc/swagger/',
            items:[
              {
                text:'概述',
                link:'index',
              }
            ]
          }
        ],
      },
      "/100-docs-java/510-spring-security": {
        base: "/100-docs-java/510-spring-security",
        items: [
          { text: "单点登录原理与简单实现", link: "/单点登录原理与简单实现" },
          { text: "认识Autho2.0", link: "/认识Autho2.0" },
          { text: "SpringSecurity实战", link: "/SpringSecurity实战" },
        ],
      },
      "/100-docs-java/600-springboot/": {
        base: "/100-docs-java/600-springboot/",
        items: springbootGuideSidebar("/100-docs-java/600-springboot/"),
      },
      "/100-docs-java/700-springcloud": {
        base: "/100-docs-java/700-springcloud/",
        items: [],
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
      "/100-docs-java/999-atiguigu-sz/": {
        base: "/100-docs-java/999-atiguigu-sz/",
        items: [],
      },
      "/300-docs-middleware/810-中间件-RabbitMQ": {
        base: "/300-docs-middleware/810-中间件-RabbitMQ/",
        items: [{ text: "RabbitMQ", link: "/RabbitMQ" }],
      },
      "/300-docs-middleware/01-redis/": {
        base: "/300-docs-middleware/01-redis/",
        items: [
          { text: "Redis中5种数据类型", link: "Redis中5种数据类型" },
          { text: "Redis中key过期", link: "Redis中key过期" },
          { text: "Redis-黑马", link: "/heima/Redis-黑马" },
        ],
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

function springbootGuideSidebar(base: String): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "leifengyang系列",
      base: base + "/lfy/",
      items: [
        {
          text: "基础01-Spring与SpringBoot",
          link: "基础01-Spring与SpringBoot",
        },
        {
          text: "基础-02-入springboot2入门",
          link: "基础-02-入springboot2入门",
        },
        {
          text: "基础-03-了解自动配置原理",
          link: "基础-03-了解自动配置原理",
        },
        {
          text: "核心-04-配置文件",
          link: "核心-04-配置文件",
        },
        {
          text: "核心-05-web开发",
          link: "核心-05-web开发",
        },
        {
          text: "核心-06-数据访问",
          link: "核心-06-数据访问",
        },
        {
          text: "核心-07-单元测试",
          link: "核心-07-单元测试",
        },
        {
          text: "核心-08-指标监控",
          link: "核心-08-指标监控",
        },
        {
          text: "核心-09-原理解析",
          link: "核心-09-原理解析",
        },
      ],
    },
    {
      text: "SpringBoot中war包在tomcat下启动原理",
      link: "SpringBoot中war包在tomcat下启动原理",
    },
    {
      text: "SpringBoot应用构建为War包部署到外部服务器",
      link: "SpringBoot应用构建为War包部署到外部服务器",
    },
    {
      text: "SpringBoot内置工具类",
      link: "SpringBoot内置工具类",
    },
  ];
}

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

function javaGuideSpringSidebar(base: string): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "Spring Core",
      base: "/100-docs-java/300-spring/core/",
      collapsed: false,
      items: [
        { text: "Bean的生命周期回调", link: "/Bean的生命周期回调" },
        {
          text: "Bean生命周期",
          link: "Bean生命周期",
        },
      ],
    },
    {
      text: "Spring整合邮件",
      link: "/整合/spring整合email",
    },
    {
      text: "Spring Cache",
      base: base + "/springcache/",
      items: [
        { text: "快速开始", link: "快速开始" },
        { text: "自定义缓存键", link: "自定义缓存键" },
        { text: "条件性缓存", link: "条件性缓存" },
        { text: "同步缓存", link: "同步缓存" },
        { text: "配置缓存存储", link: "配置缓存存储" },
        { text: "JCache (JSR-107) 注解", link: "JCache (JSR-107) 注解" },
        { text: "最佳实践", link: "最佳实践" },
        { text: "常见问题", link: "常见问题" },
      ],
    },
    {
      text: "Spring Other",
      base: "/100-docs-java/300-spring/",
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

function javaGuideZjjSidebar(base): DefaultTheme.SidebarItem[] {
  return [{ text: "RabbitMQ", link: "/RabbitMQ/RabbitMQ" }];
}
