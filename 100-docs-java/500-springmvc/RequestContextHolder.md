# RequestContextHolder

## 概述

有时我们需要在非 controller 层，如 service 层而不通过 Controller 层传参方式而获得 HttpServletRequest，HttpServletResponse，在 service 获取 request 和 response。正常来说在 service 层是没有 request 的，然而直接从 controlller 传过来的话解决方法太粗暴，但是提供工具类又显得太过于麻烦。

后来发现了 SpringMVC 提供的提供的可以获取 HttpServletRequest 的一个工具类 RequestContextHolder，可以获取得到 Servlet。

## 使用

从 RequestContextHolder 中我们可以获取到`request`、`response`、`session`等对象。

```java
//两个方法在没有使用JSF的项目中是没有区别的
RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
//RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();

//从session里面获取对应的值
String name = (String) requestAttributes.getAttribute("name", RequestAttributes.SCOPE_SESSION);
```

获取得到 HttpServletRequest、HttpServletResponse、HttpSession 对象

```java
//类型转换
ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes)requestAttributes;

//获取到Request对象
HttpServletRequest request = servletRequestAttributes.getRequest();
//获取到Response对象
HttpServletResponse response = servletRequestAttributes.getResponse();
//获取到Session对象
HttpSession session = request.getSession();
```

因为在 `HttpServlet` 类中的 service 方法中在调用 service 方法中已经将 `ServletRequest` 和 `ServletResponse` 转换成了 `HttpServletRequest` 和 `HttpServletResponse` 类。

## RequestContextHolder 初始化

request、response 和 session 是在哪里被设置进去的呢？

首先看一下 RequestContextHolder 类中的两个静态属性：

```java
//得到存储进去的request
private static final ThreadLocal<RequestAttributes> requestAttributesHolder =
new NamedThreadLocal<RequestAttributes>("Request attributes");
//可被子线程继承的request
private static final ThreadLocal<RequestAttributes> inheritableRequestAttributesHolder =
new NamedInheritableThreadLocal<RequestAttributes>("Request context");
```

再看`getRequestAttributes()`方法, 相当于直接获取 `ThreadLocal` 里面的值, 这样就保证了每一次获取到的 Request 是该请求的 request.

```java
public static RequestAttributes getRequestAttributes() {
  RequestAttributes attributes = requestAttributesHolder.get();
  if (attributes == null) {
    attributes = inheritableRequestAttributesHolder.get();
  }
  return attributes;
}
```

因为 `DispatcherServlet` 是来处理请求的，在 `DispatcherServlet` 的父类 `FrameworkServlet` 类中初始化 `WebApplicationContext`, 并提供 service 方法预处理请求

在 service 方法中会调用 `processRequest` 方法，那么直接来到 `org.springframework.web.servlet.FrameworkServlet#processRequest` 中：

查看`processRequest(request, response);`的实现, 具体可以分为三步:

1. 获取上一个请求的参数
2. 重新建立新的参数
3. 设置到 XXContextHolder
4. 父类的 service() 处理请求
5. 恢复 request
6. 发布事件

```java
protected final void processRequest(HttpServletRequest request, HttpServletResponse response)
  throws ServletException, IOException {
  long startTime = System.currentTimeMillis();
  Throwable failureCause = null;
  //获取上一个请求保存的LocaleContext
  LocaleContext previousLocaleContext = LocaleContextHolder.getLocaleContext();
  //建立新的LocaleContext
  LocaleContext localeContext = buildLocaleContext(request);

  //获取上一个请求保存的RequestAttributes
  RequestAttributes previousAttributes = RequestContextHolder.getRequestAttributes();
  //建立新的RequestAttributes!包装request和response
  ServletRequestAttributes requestAttributes = buildRequestAttributes(request,
                                                                      response, previousAttributes);
  WebAsyncManager asyncManager = WebAsyncUtils.getAsyncManager(request);
  asyncManager.registerCallableInterceptor(FrameworkServlet.class.getName(),
                                           new RequestBindingInterceptor());
  //具体设置的方法
  initContextHolders(request, localeContext, requestAttributes);
  try {
    // 开始处理逻辑方法的地方
    doService(request, response);
  }
  catch (Exception ex) {
    // 简化处理：我将异常缩减成一个
    throw ex;
  }
  finally {
    //请求处理结束之后重置
    resetContextHolders(request, previousLocaleContext, previousAttributes);
    if (requestAttributes != null) {
      requestAttributes.requestCompleted();
    }
    if (logger.isDebugEnabled()) {
      if (failureCause != null) {
        this.logger.debug("Could not complete request", failureCause);
      }
      else {
        if (asyncManager.isConcurrentHandlingStarted()) {
          logger.debug("Leaving response open for concurrent processing");
        }
        else {
          this.logger.debug("Successfully completed request");
        }
      }
    }
    //发布事件
    publishRequestHandledEvent(request, response, startTime, failureCause);
  }
}


```

再看 `initContextHolders(request, localeContext, requestAttributes)` 方法, 把新的 `RequestAttributes` 设置进 `LocalThread`，实际上保存的类型为 `ServletRequestAttributes`, 这也是为什么在使用的时候可以把 `RequestAttributes` 强转为 `ServletRequestAttributes`。

```java
private void initContextHolders(HttpServletRequest request,
                                LocaleContext localeContext,
                                RequestAttributes requestAttributes) {
  if (localeContext != null) {
    LocaleContextHolder.setLocaleContext(localeContext, this.threadContextInheritable);
  }
  // 存入到当前线程中
  if (requestAttributes != null) {
    RequestContextHolder.setRequestAttributes(requestAttributes, this.threadContextInheritable);
  }
}


```

因此 `RequestContextHolder` 里面最终保存的为 `ServletRequestAttributes`，而在 `ServletRequestAttributes` 中封装了 `HttpServletRequest`、`HttpServletResponse` 和 `HttpSession` 对象。

## 特殊情况：子线程获取得到 request

在来看下这两个变量：

```java
private static final ThreadLocal<RequestAttributes> requestAttributesHolder =
  new NamedThreadLocal<>("Request attributes");

private static final ThreadLocal<RequestAttributes> inheritableRequestAttributesHolder =
  new NamedInheritableThreadLocal<>("Request context");
```

对于 `inheritableRequestAttributesHolder` 来说，可以给子线程使用。

刚刚从源码中可以看到，在初始化的时候，如下所示：

```java
private void initContextHolders(HttpServletRequest request,
                                @Nullable LocaleContext localeContext, @Nullable RequestAttributes requestAttributes) {

  // threadContextInheritable默认为false

  if (localeContext != null) {
    LocaleContextHolder.setLocaleContext(localeContext, this.threadContextInheritable);
  }
  if (requestAttributes != null) {
    RequestContextHolder.setRequestAttributes(requestAttributes, this.threadContextInheritable);
  }
}
```

然后看下 `setRequestAttributes` 方法：

```java
public static void setRequestAttributes(@Nullable RequestAttributes attributes, boolean inheritable) {
  // attributes不为空
  if (attributes == null) {
    resetRequestAttributes();
  }
  else {
    // 如果为true，那么将设置到子线程中去
    if (inheritable) {
      // 将RequestAttributes对象设置到ThreadLocal中去
      inheritableRequestAttributesHolder.set(attributes);
      // 移除掉当前线程中的RequestAttributes
      requestAttributesHolder.remove();
    }
    else {
      // 为false的时候，只会存当前线程
      requestAttributesHolder.set(attributes);
      // 将另外一个ThreadLocal中的RequestAttributes移除掉
      inheritableRequestAttributesHolder.remove();
    }
  }
}


```

从这里可以看到，如果在子线程获取得到了当前 request 对象，那么当前线程只有在执行完转发之后，才可能获取得到当前 request 对象；

那么这个时候就应该可以理解什么叫做恢复了。

```java
resetContextHolders(request, previousLocaleContext, previousAttributes);
```

```java
private void resetContextHolders(HttpServletRequest request,LocaleContext prevLocaleContext,RequestAttributes previousAttributes) {
  LocaleContextHolder.setLocaleContext(prevLocaleContext, this.threadContextInheritable);
  // 重点看下这个方法！！threadContextInheritable默认为false
  RequestContextHolder.setRequestAttributes(previousAttributes, this.threadContextInheritable);
}
```

```java
public static void setRequestAttributes(@Nullable RequestAttributes attributes, boolean inheritable) {
  if (attributes == null) {
    resetRequestAttributes();
  }
  else {
    if (inheritable) {
      inheritableRequestAttributesHolder.set(attributes);
      requestAttributesHolder.remove();
    }
    else {
      // 恢复到当前线程中来
      requestAttributesHolder.set(attributes);
      // 移除掉子线程中的request
      inheritableRequestAttributesHolder.remove();
    }
  }
}
```

### 子线程使用

在子线程启动前，加入下面的代码，可以使 requestAttributes 被子线程继承。

```java
// 使子线程也能获取到 requestAttributes
RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
RequestContextHolder.setRequestAttributes(requestAttributes, true);
```

然后就可以在子线程中获取得到 request 对象了。

## 参考

- [RequestContextHolder 获取得到 Request](https://www.cnblogs.com/likeguang/p/17191266.html)
