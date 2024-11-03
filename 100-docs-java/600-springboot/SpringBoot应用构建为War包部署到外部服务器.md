# SpringBoot 应用构建为 War 包部署到外部服务器

## 概述

Spring Boot 最具特色的功能就是使用嵌入式服务器，可以把应用构建为一个独立、可执行的 jar，这极大地方便了部署。但是仍有人希望把应用打包为 WAR 包，部署在外部的 Servlet 容器（Tomcat、Jetty 等）中运行。

本文将会指导你如何更改 Spring Boot 的打包方式为 War，并且部署到外部服务器中（Servlet 3.x +）。

## Spring Boot 打包为 War 包的步骤

### 1 修改打包方式

```xml
<packaging>war</packaging>
```

修改 `packaging` 节点值为 `war`。Maven 工程默认打包方式为 `jar`，如果你的 `pom.xml` 中没有 `packaging` 节点，则需要手动设置。

### 2 修改默认的内置 Tomcat 容器的 scope

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-tomcat</artifactId>
  <!-- scope 声明为 provided，表示该依赖只用于编译、测试 -->
  <scope>provided</scope>
</dependency>
```

由于我们会使用外部的 Tomcat，所以需要主动把嵌入式容器 `spring-boot-starter-tomcat` 依赖的 `scope` 声明为 `provided`，表示该依赖只用于编译、测试。

### 3 修改启动类，继承 `SpringBootServletInitializer`

```java
package cn.springdoc.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class DemoApplication extends SpringBootServletInitializer{

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application){
        //指定 @SpringBootApplication 所在类
        return application.sources(DemoApplication.class);
    }
}
```

最后，我们需要继承 `SpringBootServletInitializer` 类并覆写其 `configure(SpringApplicationBuilder application)` 方法，通过该方法指定 `@SpringBootApplication` 所在类。

> 通常，我们都会直接用 `main` 类来继承它。

### 4 构建、部署到外部 Servlet 容器

完成上述步骤后，在项目根目录下打开终端，执行 `mvn clean package` 进行构建（通过 IDEA 进行构建也可以）。

构建成功后会在 `target` 目录下生成 `.war` 文件。把这个文件复制到外部 Tomcat 的 `webapps` 目录下即可，服务器启动会自动解压。 注意，war 文件的名称就是应用的 `contentPath`。
