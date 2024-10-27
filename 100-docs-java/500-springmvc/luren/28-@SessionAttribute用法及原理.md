本文将介绍 SpringMVC 中的 @SessionAttribute 注解。

## 1、预备知识

1. [接口测试利器 HTTP Client](https://mp.weixin.qq.com/s?__biz=MzA5MTkxMDQ4MQ==&mid=2648940431&idx=1&sn=6c592aa2746fd448c1a6ef511189eaaa&scene=21#wechat_redirect)
2. [参数解析器 HandlerMethodArgumentResolver 解密](https://mp.weixin.qq.com/s?__biz=MzA5MTkxMDQ4MQ==&mid=2648942681&idx=1&sn=eeea9d5d97e1cdd46a63cb1c953b5176&scene=21#wechat_redirect)

## 2、@SessionAttribute 注解

### 2.1、作用

用来标注在接口的参数上，参数的值来源于 session 作用域。

### 2.2、用法

如下代码，site 参数上使用了`@SessionAttribute("site")`注解，site 参数的值等于`session.getAttribute("site")`

```java
@ResponseBody
public String test2(@SessionAttribute("site") String site) {
    return site;
}
```

这个注解的源码如下

```java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface SessionAttribute {

 /**
  * 指定session作用域中属性的名称
  */
 @AliasFor("name")
 String value() default "";

 /**
  * 同value属性
  */
 @AliasFor("value")
 String name() default "";

 /**
  * 属性是不是必须的，如果是true，session中没有取到时，则会抛出异常
  * 此时可以将required设置为false，或者使用java8中的Option类型来修饰参数解决
  */
 boolean required() default true;

}
```

## 3、案例

下面代码中有 2 个接口方法

- 第一个方法 test1 中向 session 域中丢了一个 site 属性
- 第二个方的 site 参数上标注了`@SessionAttribute("site")`，所以会拿到 session 中 site 的值，然后输出

```java
package com.javacode2018.springmvc.chat18.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@Controller
public class SessionAttributeController {

    @RequestMapping(value = "/sessionattribute/test1",produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String test1(HttpSession session) {
        //向session中放入数据
        session.setAttribute("site",
                "<a href='http://www.itsoku.com'>路人博客，包含了所有系列文章，阅读更方便</a>");
        //重定向
        return "session中放入了site信息!";
    }

    @RequestMapping(value = "/sessionattribute/test2", produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String test2(@SessionAttribute("site") String site) {
        return site;
    }
}
```

下面来验证一下效果。

浏览器中先访问第一个接口`/requestattribute/test1`，输出



![img](./assets/640-1720012857668-103.png)



然后再访问第二个接口`/requestattribute/test2`，输出如下，从 session 中拿到了 site 的值



![img](./assets/640-1720012857668-104.png)



若我们调整一下接口 1 中代码，将 site 的值置为空

```java
request.setAttribute("site", null);
```

此时再次访问接口（依次访问接口 1 和 2），第 2 个接口会报 400 错误，原因：session 域中没有找到 site 这个属性对应的值，即 session.getAttribute("site") 为 null



![img](./assets/640-1720012857668-105.png)



**2 种解决方案**

- 方案 1：将 @SessionAttribute 的 required 属性设置为 false，常用这种方式
- 方案 2：将 @SessionAttribute 标注的参数类型调整为 java8 中的 java.util.Optional 类型，上面的接口 2 的 site 参数类型可以调整为`Optional<String>`类型，即可解决问题

## 4、@SessionAttribute 注解原理

@SessionAttribute 注解标注的参数的值来源于`org.springframework.web.servlet.mvc.method.annotation.SessionAttributeMethodArgumentResolver`解析器，源码

```java
public class SessionAttributeMethodArgumentResolver extends AbstractNamedValueMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(SessionAttribute.class);
    }

    @Override
    protected NamedValueInfo createNamedValueInfo(MethodParameter parameter) {
        SessionAttribute ann = parameter.getParameterAnnotation(SessionAttribute.class);
        Assert.state(ann != null, "No SessionAttribute annotation");
        return new NamedValueInfo(ann.name(), ann.required(), ValueConstants.DEFAULT_NONE);
    }

    @Override
    @Nullable
    protected Object resolveName(String name, MethodParameter parameter, NativeWebRequest request) {
        return request.getAttribute(name, RequestAttributes.SCOPE_SESSION);
    }

    @Override
    protected void handleMissingValue(String name, MethodParameter parameter) throws ServletException {
        throw new ServletRequestBindingException("Missing session attribute '" + name +
                                                 "' of type " + parameter.getNestedParameterType().getSimpleName());
    }

}
```

## 5、案例代码 git 地址

```
https://gitee.com/javacode2018/springmvc-series
```

所有系列文章的均在此仓库中。