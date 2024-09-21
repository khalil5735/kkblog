# 带你解密：SpringBoot接口到底支持多少种类型的参数？



> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s?__biz=MzA5MTkxMDQ4MQ==&mid=2648942681&idx=1&sn=eeea9d5d97e1cdd46a63cb1c953b5176&chksm=88623067bf15b97132d85741b2241ca776bee1d46ff2dad373323be806488e7bcb5b602071f9&scene=178&cur_album_id=1873497824336658435#rd)



1、来看 2 个好问题
-----------

大家在使用 SpringMVC 或者 SpringBoot 开发接口的时候，有没有思考过下面这 2 个问题

*   接口的参数到底支持哪些类型？有什么规律可循么？
    
*   接口参数的值是从哪里来的呢？
    

说实话，这 2 个问题非常关键，搞懂原理之后，开发接口将得心应手，今天就带大家从原理上来搞懂这俩问题。

2、SpringMVC 处理请求大概的过程
---------------------

step1、接受请求

step2、根据请求信息找到能够处理请求的控制器方法

step3、解析请求，组装控制器方法需要的参数的值

step4、通过反射调用控制器方法

step5、响应结果等

咱们重点来看 step3 参数值组装这个过程。

3、解析处理器方法参数的值
-------------

解析参数需要的值，SpringMVC 中专门有个接口来干这个事情，这个接口就是：**HandlerMethodArgumentResolver**，中文称呼：处理器放放参数解析器，说白了就是解析请求得到 Controller 方法的参数的值。

### 3.1、处理器方法参数解析器：HandlerMethodArgumentResolver 接口

```java
public interface HandlerMethodArgumentResolver {

 /**
  * 判断当前解析器是否支持解析parameter这种参数
  * parameter：方法参数信息
  */
 boolean supportsParameter(MethodParameter parameter);

 /**
  * 解析参数，得到参数对应的值
  */
 @Nullable
 Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
   NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception;

}
```

### 3.1、解析参数值的过程

SpringMVC 中会配置多个 HandlerMethodArgumentResolver，组成一个 HandlerMethodArgumentResolver 列表，用这个列表来解析参数得到参数需要的值，相当于 2 嵌套 for 循环，简化版的过程如下：

```java
//1.得到控制器参数列表
List<MethodParameter> parameterList;
//2.参数解析器列表
List<HandlerMethodArgumentResolver> handlerMethodArgumentResolverList;
//控制器方法参数
Object[] handlerMethodArgs = new Object[parameterList.size()];
int paramIndex = 0;
//遍历参数列表
for (MethodParameter parameter : parameterList) {
    //遍历处理器方法参数解析器列表
    for (HandlerMethodArgumentResolver resolver : handlerMethodArgumentResolverList) {
        if (resolver.supportsParameter(parameter)) {
            handlerMethodArgs[paramIndex++] = resolver.resolveArgument(parameter, webRequest, binderFactory);
            break;
        }
    }
}


```

解析参数源码的位置：

```
org.springframework.web.method.support.InvocableHandlerMethod#getMethodArgumentValues
```

4、常见的 HandlerMethodArgumentResolver
-----------------------------------

大家可以在 `InvocableHandlerMethod#getMethodArgumentValues` 这个位置设置断点，可以详细了解参数解析的过程，debug 中我们可以在这看到 SpringMVC 中默认情况下注册了这么多解析器，如下图：

![](./assets/640-1719929803932-12.png)

如下表，列出了一些常见的，以及这些参数解析器能够解析的参数的特点及类型

<table><thead><tr><th>实现类</th><th>支持的参数类型</th><th>参数值</th></tr></thead><tbody><tr><td>RequestParamMethodArgumentResolver</td><td>参数需使用 @RequestParam 标注，且 name 属性有值，参数通常为普通类型、Map 类型；或 MultipartFile、Part 类型，或 MultipartFile、Part 这两种类型的集合、数组</td><td>请求参数</td></tr><tr><td>RequestParamMapMethodArgumentResolver</td><td>参数需使用 @RequestParam 标注，且 name 属性没有子，参数为 Map 类型；参数的值从 request 的参数中取值，Map 中的 key 对应参数名称，value 对应参数的值</td><td>请求参数</td></tr><tr><td>PathVariableMapMethodArgumentResolver</td><td>参数需使用 @PathVariable 标注，参数通常为普通类型</td><td>从 url 中取值</td></tr><tr><td>RequestHeaderMethodArgumentResolver</td><td>参数需使用 @RequestHeader 标注，参数通常为 Map、MultiValueMap、HttpHeaders 类型</td><td>请求头</td></tr><tr><td>ServletCookieValueMethodArgumentResolver</td><td>参数需使用 @CookieValue 标注，参数为普通类型或者 Cookie 类型</td><td>cookie</td></tr><tr><td>ModelMethodProcessor</td><td>参数为 Model 类型，控制器中可以调用 model.addAttribute 想模型中放数据，最终这些数据都会通过 request.setAttribute 复制到 request 中</td><td>来源于 SpringMVC 容器</td></tr><tr><td>MapMethodProcessor</td><td>参数为 Map 类型，值同 ModelMethodProcessor</td><td>来源于 SpringMVC 容器</td></tr><tr><td>ModelAttributeMethodProcessor</td><td>参数需要使用 @ModelAttribute 标注</td><td>Model.getAttribute</td></tr><tr><td>ServletRequestMethodArgumentResolver</td><td>参数类型为 WebRequest、ServletRequest、MultipartRequest、HttpSession、Principal、InputStream、Reader、HttpMethod、Locale、TimeZone、ZoneId</td><td>Servlet 容器中的 request</td></tr><tr><td>ServletResponseMethodArgumentResolver</td><td>参数类型是 ServletResponse、OutputStream、Writer</td><td>Servlet 容器中的 response</td></tr><tr><td>ModelMethodProcessor</td><td>参数为 org.springframework.ui.Model 类型</td><td>来源于 SpringMVC 容器</td></tr><tr><td>RequestAttributeMethodArgumentResolver</td><td>参数需使用 @RequestAttribute</td><td>request.getAttribute</td></tr><tr><td>SessionAttributeMethodArgumentResolver</td><td>参数需使用 @SessionAttribute</td><td>session.getAttribute</td></tr><tr><td>ExpressionValueMethodArgumentResolver</td><td>参数需使用 @Value 标注</td><td>从 Spring 配置中取值</td></tr><tr><td>ServletModelAttributeMethodProcessor</td><td>支持为我们自定义的 javabean 赋值</td><td>-</td></tr><tr><td>RequestResponseBodyMethodProcessor</td><td>参数需使用 @RequestBody 标注</td><td>http 请求中的 body</td></tr><tr><td>HttpEntityMethodProcessor</td><td>参数类型为 HttpEntity 或 RequestEntity 类型，这两种类型的参数基本上包含了请求的所有参数信息</td><td>http 请求中的完整信息</td></tr></tbody></table>

实现类比较多，就不一一说了，这里教大家一招，让大家学会如何看每种参数解析器的源码，掌握看源码之后，大家把每个实现类的源码过一下，基本上就知道如何使用了，这里以`RequestParamMethodArgumentResolver`源码为例来做解读。

5、RequestParamMethodArgumentResolver 源码解读
-----------------------------------------

### 5.1、supportsParameter 方法：判断支持参数类型

源码如下，挺简单的，大家注意看注释，秒懂

```java
public boolean supportsParameter(MethodParameter parameter) {
    //判断参数上是否有@RequestParam注解
    if (parameter.hasParameterAnnotation(RequestParam.class)) {
        //参数是Map类型
        if (Map.class.isAssignableFrom(parameter.nestedIfOptional().getNestedParameterType())) {
            //@RequestParam注解name必须有值
            RequestParam requestParam = parameter.getParameterAnnotation(RequestParam.class);
            return (requestParam != null && StringUtils.hasText(requestParam.name()));
        } else {
            return true;
        }
    } else {
        //判断参数上是否有@RequestPart注解，有则返回false
        if (parameter.hasParameterAnnotation(RequestPart.class)) {
            return false;
        }
        parameter = parameter.nestedIfOptional();
        /**
         * 参数微信是否为下面这些类型，通常文件上传的时候用这种类型接受参数
         * MultipartFile、Collection<MultipartFile>、List<MultipartFile>、MultipartFile[]
         * Part、Collection<Part>、List<Part>、Part[]
         */
        if (MultipartResolutionDelegate.isMultipartArgument(parameter)) {
            return true;
        } else if (this.useDefaultResolution) {
            // 是否开启了默认解析,useDefaultResolution默认是false
            return BeanUtils.isSimpleProperty(parameter.getNestedParameterType());
        } else {
            return false;
        }
    }
}
```

### 5.2、resolveArgument 方法

resolveArgument 方法最终会调用`RequestParamMethodArgumentResolver#resolveName`方法，代码如下，如果是文件上传的，就获取的是 MultipartFile 对象，否则就是调用`request.getParameterValues`从参数中取值

```java
protected Object resolveName(String name, MethodParameter parameter, NativeWebRequest request) throws Exception {
    HttpServletRequest servletRequest = request.getNativeRequest(HttpServletRequest.class);

    Object arg = null;
    MultipartRequest multipartRequest = request.getNativeRequest(MultipartRequest.class);
    if (multipartRequest != null) {
        List<MultipartFile> files = multipartRequest.getFiles(name);
        if (!files.isEmpty()) {
            arg = (files.size() == 1 ? files.get(0) : files);
        }
    }
    if (arg == null) {
        String[] paramValues = request.getParameterValues(name);
        if (paramValues != null) {
            arg = (paramValues.length == 1 ? paramValues[0] : paramValues);
        }
    }
    return arg;
}
```

5、@RequestParam：取请求中的参数
-----------------------

### 5.1、简介

@RequestParam 注解我们用到的比较多，被这个注解标注的参数，会从 request 的请求参数中取值，参数值为 request.getParameter("@RequestParam 注解 name 的值")

重点来看下这个类的源码，如下，大家要学会看源码中的注释，Spring 注释写的特别的好，这里给 spring 点个赞，注释中详细说明了其用法，大家注意下面匡红的部分，稍后用一个案例代码让大家了解其他常见几种用法，这个注解的用法掌握了，其他的注解都是雷同的，大家去看起源码以及对应的参数解析器，就会秒懂了。

![](./assets/640-1719929803932-13.png)

```java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequestParam {

 /**
  * 对应request中参数名称
  */
 @AliasFor("name")
 String value() default "";

 /**
  * 同value
  */
 @AliasFor("value")
 String name() default "";

 /**
  * 请求中是否必须有这个参数
  */
 boolean required() default true;

 /**
  * 默认值
  */
 String defaultValue() default ValueConstants.DEFAULT_NONE;

}
```

### 5.2、案例

案例代码如下，注意 5 个参数，这 5 个参数反应了`@RequestParam`所有的的用法，这个接口的参数解析会用到 2 个解析器：`RequestParamMethodArgumentResolver`和`RequestParamMapMethodArgumentResolver`，大家可以设置断点 debug 一下。

> 注意最后一个参数的类型是 MultiValueMap，这种类型相当于 Map<String,List<String>>

```java
@RequestMapping("/test1")
@ResponseBody
public Map<String, Object> test1(@RequestParam("name") String name,
                                 @RequestParam("age") int age,
                                 @RequestParam("p1") String[] p1Map,
                                 @RequestParam Map<String, String> requestParams1,
                                 @RequestParam MultiValueMap requestParams2) { //MultiValueMap相当于Map<String,List<String>>
    Map<String, Object> result = new LinkedHashMap<>();
    result.put("name", name);
    result.put("age", age);
    result.put("p1Map", p1Map);
    result.put("requestParams1", requestParams1);
    result.put("requestParams2", requestParams2);
    return result;
}
```

发送请求

```
http://localhost:8080/chat17/test1?name=ready&age=35&p1=1&p1=2&p1=3
```

接口输出

```json
{
 "name": "ready",
 "age": 35,
 "p1Map": [
  "1",
  "2",
  "3"
 ],
 "requestParams1": {
  "name": "ready",
  "age": "35",
  "p1": "1"
 },
 "requestParams2": {
  "name": [
   "ready"
  ],
  "age": [
   "35"
  ],
  "p1": [
   "1",
   "2",
   "3"
  ]
 }
}
```

7、总结
----

本文带大家了解了参数解析器`HandlerMethodArgumentResolver`的作用，掌握这个之后，大家就知道控制器的方法中参数的写法，建议大家下去之后，多翻翻这个接口的实现类，掌握常见的参数的各种用法，这样出问题了，才能够快速定位问题，提升快速解决问题的能力。

8、代码位置及说明
---------

### 8.1、git 地址

https://gitee.com/javacode2018/springmvc-series



### 8.2、本文案例代码结构说明

![](./assets/640-1719929803932-14.png)
