export default {
  nav(parent_path: string) {
    const base = parent_path + "/500-springmvc";
    return {
      text: "SpringMVC",
      link: base + "/",
      activeMatch: base
    };
  },
  sidebar(parent_path: string) {
    const base = parent_path + "/100-docs-java/500-springmvc/";
    return {
      [base]: [
        {
          text: "@RequestParam和@RequestPart",
          link: base + "@RequestParam和@RequestPart"
        },
        {
          text: "SpringMVC文件上传",
          link: base + "SpringMVC文件上传"
        },
        {
          text: "SpringMVC文件下载",
          link: base + "SpringMVC文件下载"
        },
        {
          text: "拦截器",
          link: base + "拦截器"
        },
        {
          text: "DispatcherServlet初始化过程",
          link: base + "DispatcherServlet初始化过程"
        },
        {
          text: "DispatcherServlet请求处理流程",
          link: base + "DispatcherServlet请求处理流程"
        },
        {
          text: "RequestContextHolder",
          link: base + "RequestContextHolder"
        },
        {
          text: "SpringMVC中方法Hanlder的注册过程",
          link: base + "SpringMVC中方法Hanlder的注册过程"
        },
        {
          text: "Swagger",
          base: base + "swagger/",
          items: [
            {
              text: "概述",
              link: "index"
            }
          ]
        },
        {
          text: "Atguigu",
          base: "/100-docs-java/500-springmvc/atguigu2024/",
          items: [
            {
              text: "01-SpringMVC简介",
              link: "01-SpringMVC简介"
            },
            {
              text: "02-HelloWorld",
              link: "02-HelloWorld"
            },
            {
              text: "03-@RequestMapping注解",
              link: "03-@RequestMapping注解"
            },
            {
              text: "04-SpringMVC获取请求参数",
              link: "04-SpringMVC获取请求参数"
            },
            {
              link: "05-域对象共享数据",
              text: "05-域对象共享数据"
            },
            {
              text: "06-SpringMVC的视图",
              link: "06-SpringMVC的视图"
            },
            {
              text: "07-RESTful",
              link: "07-RESTful"
            },
            {
              text: "08-HttpMessageConverter",
              link: "08-HttpMessageConverter"
            },
            {
              text: "09-文件的上传与下载",
              link: "09-文件的上传与下载"
            },
            {
              text: "10-拦截器",
              link: "10-拦截器"
            },
            {
              text: "11-异常处理器",
              link: "11-异常处理器"
            },
            {
              text: "12-注解配置SpringMVC",
              link: "12-注解配置SpringMVC"
            },
            {
              text: "13-SpringMVC执行流程",
              link: "13-SpringMVC执行流程"
            }
          ]
        },
        {
          text: "路人系列",
          base: "/100-docs-java/500-springmvc/luren/",
          items: [
            {
              text: "02-@Controller、@RequestMapping",
              link: "02-@Controller、@RequestMapping"
            },
            {
              text: "03-接口测试HTTP Client.md",
              link: "03-接口测试HTTP Client.md"
            },
            { text: "04-接收请求中的参数", link: "04-接收请求中的参数" },
            {
              text: "05-@RequestBody接收Json格式数据",
              link: "05-@RequestBody接收Json格式数据"
            },
            {
              text: "06-上传文件的4种方式",
              link: "06-上传文件的4种方式"
            },
            {
              text: "07-返回视图页面常见的5种方式",
              link: "07-返回视图页面常见的5种方式"
            },
            {
              text: "11-集成静态资源的多种方式",
              link: "11-集成静态资源的多种方式"
            }
          ]
        }
      ]
    };
  }
};
