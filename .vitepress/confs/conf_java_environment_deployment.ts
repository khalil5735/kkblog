export default {
  nav(parent_path: string) {
    const base = parent_path + "/002-environment_deployment/";
    return {
      text: "环境搭建",
      link: base + "搭建java开发环境",
      activeMatch: base
    };
  },
  sidebar(parent_path: string) {
    const base = parent_path + "/002-environment_deployment/";
    return {
      [base]: [
        {
          text: "搭建java开发环境",
          link: base + "/搭建java开发环境"
        }
      ]
    };
  }
};
