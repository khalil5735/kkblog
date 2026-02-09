const base = "/300-docs-middleware/01-redis/";
// Configuration for the tools documentation section
export default {
  base,
  nav: {
    text: "Redis",
    link: "/300-docs-middleware/01-redis/",
    activeMatch: "/300-docs-middleware/01-redis/",
  },
  sidebar: {
    base: "/300-docs-middleware/01-redis/",
    items: [
      { text: "Redis中5种数据类型", link: "Redis中5种数据类型" },
      { text: "Redis中key过期", link: "Redis中key过期" },
      { text: "Redis-黑马", link: "/heima/Redis-黑马" },
    ],
  },
};
