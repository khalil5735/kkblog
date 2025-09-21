import { DefaultTheme } from "vitepress";
import doce_java_jvm from "../sub_conf/docs_java_jvm";
import docs_tools from "../sub_conf/docs_tools";
import docs_middleware_redis from "../sub_conf/docs_middleware_redis";
import docs_middleware_rabbitmq from "../sub_conf/docs_middleware_rabbitmq";

let nav: DefaultTheme.NavItem[] = [
  { text: "首页", link: "/" },
  {
    text: "Java",
    items: [
      doce_java_jvm.nav,
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
      doce_java_jvm.nav,
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
  docs_tools.nav,
  {
    text: "大前端",
    link: "/200-docs-front/",
    activeMatch: "/200-docs-front/",
  },
  {
    text: "中间件",
    items: [docs_middleware_redis.nav, docs_middleware_rabbitmq.nav],
  },
  {
    text: "环境部署",
    items: [
      { text: "Linux", link: "/700-docs-deploy/01-linux/" },
      { text: "Docker", link: "/700-docs-deploy/02-docker/" },
    ],
  },
];

export default nav;
