export default {
  nav(parent_path: string) {
    const base = parent_path + "/700-docs-deploy/02-docker/";
    return {
      text: "Docker",
      link: base,
      activeMatch: base
    };
  },
  sidebar(parent_path: string) {
    const base = parent_path + "/700-docs-deploy/02-docker/";
    return {
      [base]: {
        base: base,
        items: [
          {
            text: "Docker容器开机自启设置",
            link: "docker-start-always"
          }
        ]
      }
    };
  }
};
