export default {
  nav(parent_path: string) {
    const base = parent_path + "/120-java-juc";
    return {
      text: "并发编程",
      link: base,
      activeMatch: base
    };
  },
  sidebar(parent_path: string) {
    const base = parent_path + "/120-java-juc/";
    return {
      [base]: {
        base: base,
        items: [
          { text: "可见性、原子性和有序性", link: "02-可见性、原子性和有序性" },
          { text: "java内存模型", link: "JMM" },
          {
            text: "volatile共享变量的可见行",
            link: "volatile共享变量的可见行"
          },
          {
            text: "JUC中的阻塞队列",
            link: "JUC中的阻塞队列"
          }
        ]
      }
    };
  }
};
