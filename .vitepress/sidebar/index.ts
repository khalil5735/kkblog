import { DefaultTheme } from "vitepress";
import doce_java_jvm from "../sub_conf/docs_java_jvm";
import docs_middleware_redis from "../sub_conf/docs_middleware_redis";
import docs_middleware_rabbitmq from "../sub_conf/docs_middleware_rabbitmq";
import sidebar700Deploy01Linux from "./sidebar-700-deploy-01-linux";
import sidebar100Java170Http from "./siderbar-100-java-170-http";
import sidebar500Tools from "./siderbar-500-tools";
import sidebar100Java140ApacheCommons from "./sidebar-100-java-140-apache-commons";

let sidebar: DefaultTheme.Sidebar = {};
sidebar[doce_java_jvm.base] = doce_java_jvm.sidebar;
sidebar[docs_middleware_redis.base] = docs_middleware_redis.sidebar;
sidebar[docs_middleware_rabbitmq.base] = docs_middleware_rabbitmq.sidebar;

export default {
  ...sidebar,
  ...sidebar700Deploy01Linux,
  ...sidebar100Java170Http,
  ...sidebar500Tools,
  ...sidebar100Java140ApacheCommons,
};
