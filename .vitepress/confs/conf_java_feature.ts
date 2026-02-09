export default {
  nav(parent_path: string) {
    return {};
  },
  sidebar(parent_path: string) {
    const base = parent_path + "/001-feature";
    return {
      [base]: [
        {
          text: "概述",
          link: base
        },
        {
          text: "java8",
          base: base + "/java8/",
          items: [{ text: "函数式接口", link: "函数式接口" }]
        },
        {
          text: "java21",
          base: base + "/java21/",
          items: []
        }
      ]
    };
  }
};
