import { DefaultTheme } from "vitepress";
import sub_conf_java from "./confs/conf_java";
import docs_middleware_rabbitmq from "./confs/docs_middleware_rabbitmq";
import docs_middleware_redis from "./confs/docs_middleware_redis";

let nav: DefaultTheme.NavItem[] = [
  { text: "首页", link: "/" },
  sub_conf_java.nav,
  {
    text: "百宝箱",
    link: "/500-docs-tools/"
  },
  {
    text: "大前端",
    link: "/200-docs-front/",
    activeMatch: "/200-docs-front/"
  },
  {
    text: "中间件",
    items: [docs_middleware_redis.nav, docs_middleware_rabbitmq.nav]
  },
  {
    text: "环境部署",
    items: [
      { text: "Linux", link: "/700-docs-deploy/01-linux/" },
      { text: "Docker", link: "/700-docs-deploy/02-docker/" }
    ]
  }
];

export default nav;
