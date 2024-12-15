# ContextLoaderListener 在 Spring 应用中的作用与配置方法

## 什么是 ContextLoaderListener

**ContextLoaderListener** 是 Spring 框架中的一个监听器，它用于在 Web 应用启动时加载 Spring 的应用上下文（ApplicationContext）。通常情况下，我们会在 web.xml 配置文件中使用 ContextLoaderListener 来初始化 Spring 容器，并且将其作为 ServletContext 的一个属性进行管理。

## ContextLoaderListener 的作用

在一个复杂的 Java Web 应用中，Spring 框架通常负责管理和装配各种组件，例如数据访问层、业务逻辑层和控制层等。ContextLoaderListener 的主要作用如下：

- 加载 Spring 应用上下文：在应用启动时，ContextLoaderListener 会自动加载指定的 Spring 配置文件，并创建对应的 ApplicationContext。
- 整合 Spring 与 Servlet 环境：ContextLoaderListener 将 Spring 容器与 Servlet 容器（如 Tomcat）进行整合，使得 Spring 管理的 Bean 可以被 Servlet 或其他 Web 组件访问和使用。
- 监听 ServletContext 的生命周期事件：ContextLoaderListener 实现了 ServletContextListener 接口，可以监听 ServletContext 的初始化和销毁事件，在 ServletContext 初始化时初始化 Spring 容器，在 ServletContext 销毁时销毁 Spring 容器，从而确保 Spring 容器的生命周期与 Web 应用的生命周期一致。

## 配置 ContextLoaderListener

要在 Web 应用中使用 ContextLoaderListener，需要进行以下配置步骤：

### 1. 添加 Spring 依赖

确保项目中包含必要的 Spring 依赖。例如，可以使用 Maven 添加以下依赖：

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>${spring.version}</version>
</dependency>
```

#### **2. 编写 Spring 配置文件**

创建一个 Spring 配置文件（通常命名为 applicationContext.xml），定义需要被 Spring 管理的 Bean、数据源配置、事务管理等内容。

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd">

    
    <bean>
        
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://localhost:3306/mydb"/>
        <property name="username" value="root"/>
        <property name="password" value="password"/>
    </bean>

    

</beans>
```

#### **3. 配置 web.xml**

在 web.xml 中配置 ContextLoaderListener，指定 Spring 配置文件的位置。

```xml
<web-app>
    
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/applicationContext.xml</param-value>
    </context-param>


</web-app>
```

## ContextLoaderListener 的示例

下面是一个简单的示例，演示了如何通过 ContextLoaderListener 初始化 Spring 容器，并在 Servlet 中获取 Spring 管理的 Bean 进行操作：

```java
package cn.juwatech.spring;

import cn.juwatech.service.UserService;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/user")
public class UserServlet extends HttpServlet {
   

    private UserService userService;

    @Override
    public void init(ServletConfig config) throws ServletException {
   
        super.init(config);
        
        WebApplicationContext context = WebApplicationContextUtils.getRequiredWebApplicationContext(getServletContext());
        
        userService = context.getBean(UserService.class);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
   
        
        resp.getWriter().write(userService.getUserInfo());
    }
}
```



## ContextLoaderListener可以不写嘛

 Spring3.1支持通过ContextLoaderListener构造器方式注入Web 上下文容器，servlet3.0也支持使用WebApplicationInitializer启动Spring容器来替代web.xml写法。

ContextLoaderListener监听器的contextInitialized 方法：调用了ContextLoader的initWebApplicationContext，还是代理给了ContextLoader完成容器启动工作。

  step1.检查ServletContext上下文是否有WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE这个属性，没有是正常的，有的话就说明Spring根容器重复定义了！

  step2. 尝试读取context-param中为contextClass的值作为根容器的class属性，如果没有指定context-param属性，就以ContextLoader类所在同一路径下的ContextLoader.properties文件中的 org.springframework.web.context.WebApplicationContext 作为key取出value , 默认为 org.springframework.web.context.support.XmlWebApplicationContext , 以这个作为Spring根容器类型，并且实例化XmlWebApplicationContext;

  step3. Spring根容器的ServletContext设置为当前ServletContext，并且读取web.xml中 其contextConfigLocation作为 Spring配置文件位置，最后调用 根容器的refresh 方法完成容器启动！

  step4. 根容器启动完之后，设置到 ServletContext的WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE 属性中 ，并且存到了ContextLoader中，可以通过静态方法ContextLoader.getCurrentWebApplicationContext就能获取到 Spring根容器



DispatcherServlet的初始化

初始化的入口位于 org.springframework.web.servlet.HttpServletBean#init ：

 SpringMvc容器类型默认为XmlWebApplicationContext，反射实例化该对象，并且通过ServletContext的 WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE属性得到Spring根容器，

作为SpringMVC容器的父容器。 另外，像如下形式的SpringMvc，没有指定spring配置文件的位置，那默认加载的配置文件位置为： /WEB-INF/Springmvc-servlet.xml :

```xml
<servlet>
       <servlet-name>Springmvc</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<load-on-startup>1</load-on-startup>
	</servlet>
 
	<servlet-mapping>
		<servlet-name>Springmvc</servlet-name>
		<url-pattern>/</url-pattern>
</servlet-mapping>
```

也就是说没有ContextLoaderListener，对于SpringMvc容器的影响就是没了父容器，照样可以使用SpringMVC的特性



## 总结

通过本文，我们详细介绍了 ContextLoaderListener 在 Spring 应用中的作用及其配置方法。ContextLoaderListener 作为 Spring 框架与 Servlet 容器之间的桥梁，能够有效地管理和整合 Spring 容器，使得 Spring 管理的 Bean 能够在 Web 应用中得以利用和调用。



ContextLoaderListener 会影响Spring IOC 父容器，如果没有配置ContextLoaderListener ，对于SpringMvc容器的影响就是没了父容器，照样可以使用SpringMVC的特性

```java
// 提供五种获取Spring根容器方案、三种获取Spring父容器方案
@Controller
@RequestMapping("/context")
public class ContextController implements ApplicationContextAware {

    @Autowired
    private ApplicationContext ac;

    @RequestMapping("/demo1")
    @ResponseBody
    public String demo1(HttpServletRequest request){
        System.out.println("Spring根容器方式一:"+request.getServletContext().getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE));
        System.out.println("Spring根容器方式二:"+ContextLoader.getCurrentWebApplicationContext());
        System.out.println("Spring根容器方式三:"+ WebApplicationContextUtils.getRequiredWebApplicationContext(request.getServletContext()));
        System.out.println("Spring根容器方式四:"+ WebApplicationContextUtils.getWebApplicationContext(request.getServletContext()));
        System.out.println("Spring根容器方式五:"+ac.getParent());
        System.out.println("SpringMvc容器获取方式一:"+ac);
        System.out.println("SpringMvc容器获取方式二:"+ac2);
        //SpringMvc容器获取方式三 继承抽象类 WebApplicationObjectSupport,方式二方式三不能同时用
        //调用getApplicationContext
        return "hello World";
    }

    private ApplicationContext ac2;
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        ac2=applicationContext;
    }
}
```



