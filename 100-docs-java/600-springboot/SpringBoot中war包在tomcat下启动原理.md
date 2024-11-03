spring boot war 启动是利用Servlet 3.0 新增的 `ServletContainerInitializer` 接口结合SPI（Service Provider Interface）机制实现的。

Servlet 容器在启动的时候，会扫描当前应用下 jar 包中 `META_INFO/services/javax.servlet.ServletContainerInitializer` 中指定的实现类，启动并运行这个实现类的方法



1. Spring在 spring-web-version.jar 的 `/META-INF/services/javax.servlet.ServletContainerInitializer` 文件中，

配置了spring对`ServletContainerInitializer`接口的实现类 `org.springframework.web.SpringServletContainerInitializer`。

2. Servlet Container 启动阶段扫描jar包中 `META-INF/services/javax.servlet.ServletContainerInitializer`文件，

获取`ServletContainerInitializer`实现类并实例化，解析 `ServletContainerInitializer` 上 `@HandlesTypes` 注解，

查找出 `@HandlesTypes` 限定的类型集合，作为 `ServletContainerInitializer.onStartup` 方法处理的第一个参数c。

3. Servlet Container依次调用每个 `ServletContainerInitializer` 实例的 `onStartup`。war 包启动的场景中会调用`SpringServletContainerInitializer.onStartup` 方法，该方法循环调用 c 集合中每个 `WebApplicationInitializer` 子类（即`SpringBootServletInitializer`）的 `onStartup` 方法。
4. `SpringBootServletInitializer.onStartup` 方法调用 `SpringBootServletInitializer.createRootApplicationContext` 方法，`createRootApplicationContext` 方法中构建 `SpringApplication` 并执行 `SpringApplication.run` 方法以启动整个 spring 项目。

