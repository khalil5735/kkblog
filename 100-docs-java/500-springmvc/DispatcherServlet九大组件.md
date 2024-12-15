# DispatcherServlet九大组件

## MultipartResolver（重要）

处理文件上传请求。当表单提交包含文件时，`MultipartResolver`将解析这些请求，使它们可以被应用程序正确处理。

## LocaleResolver（了解）

解析客户端请求中的区域设置信息。这对于实现多语言支持非常重要，因为可以根据用户的偏好选择正确的语言环境。

## ThemeResolver（了解）

解析主题。这允许应用根据不同条件（如用户偏好、时间等）使用不同的样式主题。

## HandlerMapping（重要）

`HandlerMapping`用于将进入的HTTP请求映射到相应的处理器（Handler），即确定哪个Controller应该处理这个请求。

## HandlerAdapter（重要）

`HandlerAdapter`负责调用与请求相匹配的处理器。不同的处理器可能有不同的签名，`HandlerAdapter`使得`DispatcherServlet`可以灵活地调用各种类型的处理器。

## HandlerExceptionResolver（重要）

用来处理处理器执行过程中抛出的异常。它可以定义全局异常处理规则，为不同类型的异常提供特定的错误页面或响应信息。

## RequestToViewNameTranslator（了解）

如果控制器没有返回视图名称，则`RequestToViewNameTranslator`可以根据请求URL生成一个默认的视图名称。

## FlashMapManager（了解）

管理Flash属性，这些属性可以在重定向时保持短暂存在，以便在目标页面上显示消息或其他临时数据。

## ViewResolver（重要）

当处理器完成了业务逻辑处理后，通常会返回一个视图名称。`ViewResolver`的作用就是根据这个名称解析出实际的视图对象（如JSP、Thymeleaf模板等）。