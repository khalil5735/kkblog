import { DefaultTheme } from "vitepress";
import doce_java_jvm from "../sub_conf/docs_java_jvm";
import docs_tools from "../sub_conf/docs_tools";
import docs_middleware_redis from "../sub_conf/docs_middleware_redis";
import docs_middleware_rabbitmq from "../sub_conf/docs_middleware_rabbitmq";
import sidebar700Deploy01Linux from "./sidebar-700-deploy-01-linux";

let sidebar: DefaultTheme.Sidebar = {};
sidebar[doce_java_jvm.base] = doce_java_jvm.sidebar;
sidebar[docs_tools.base] = docs_tools.sidebar;
sidebar[docs_middleware_redis.base] = docs_middleware_redis.sidebar;
sidebar[docs_middleware_rabbitmq.base] = docs_middleware_rabbitmq.sidebar;

export default {
  ...sidebar,
  ...sidebar700Deploy01Linux,
};
