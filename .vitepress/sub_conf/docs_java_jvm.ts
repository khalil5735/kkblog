const base = "/100-docs-java/190-jvm/";

export default {
  base: base,
  nav: {
    text: "JVM",
    link: base,
    activeMatch: base,
  },
  sidebar: {
    base,
    items: [
      {
        text: "02-字节码与类的加载",
        base: `${base}/02-字节码与类的加载/`,
        collapsed: false,
        items: [
          { text: "类的加载过程", link: "类的加载过程" },
          { text: "双亲委派机制", link: "双亲委派机制" },
        ],
      },
    ],
  },
};
