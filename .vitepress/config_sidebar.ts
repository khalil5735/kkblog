import { DefaultTheme } from "vitepress";
import confJavaSpringmvc from "./confs/conf-java-springmvc";
import conf_ai from "./confs/conf_ai";
import conf_deploy_docker from "./confs/conf_deploy_docker";
import sub_conf_java from "./confs/conf_java";
import conf_tools from "./confs/conf_tools";
import docs_middleware_rabbitmq from "./confs/docs_middleware_rabbitmq";
import docs_middleware_redis from "./confs/docs_middleware_redis";
import sidebar700Deploy01Linux from "./sidebar/sidebar-700-deploy-01-linux";

let sidebar: DefaultTheme.Sidebar = {};
sidebar[docs_middleware_redis.base] = docs_middleware_redis.sidebar;
sidebar[docs_middleware_rabbitmq.base] = docs_middleware_rabbitmq.sidebar;
export default {
  ...sidebar,
  ...sub_conf_java.sidebar,
  ...sidebar700Deploy01Linux,
  ...conf_tools.sidebar(""),
  ...conf_deploy_docker.sidebar(""),
  ...conf_ai.sidebar(""),
  ...confJavaSpringmvc.sidebar("")
};
