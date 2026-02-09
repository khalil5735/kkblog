import { DefaultTheme } from "vitepress";
import sub_conf_java from "./confs/conf_java";
import docs_middleware_rabbitmq from "./confs/docs_middleware_rabbitmq";
import docs_middleware_redis from "./confs/docs_middleware_redis";
import sidebar700Deploy01Linux from "./sidebar/sidebar-700-deploy-01-linux";
import sidebar500Tools from "./sidebar/siderbar-500-tools";

let sidebar: DefaultTheme.Sidebar = {};
sidebar[docs_middleware_redis.base] = docs_middleware_redis.sidebar;
sidebar[docs_middleware_rabbitmq.base] = docs_middleware_rabbitmq.sidebar;

export default {
  ...sidebar,
  ...sub_conf_java.sidebar,
  ...sidebar700Deploy01Linux,
  ...sidebar500Tools
};
