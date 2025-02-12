# Swagger

## Swagger、RESTful API 和 OpenAPI

Swagger、RESTful API 和 OpenAPI 三者之间的关系可以这样理解：

1. **RESTful API**：
   - RESTful API 是一种设计风格，它定义了一组架构约束和原则，用于在网络环境中创建Web服务。REST（Representational State Transfer）是一种软件架构风格，它指导如何使用一组特定的技术来构建网络应用。遵循REST原则的API通常被称为RESTful API。

2. **Swagger**：
   - Swagger 最初是一个开源框架，用于描述、生产和消费RESTful Web服务。它提供了一个规范（后来演变为OpenAPI规范）以及工具集，包括了设计、文档化、测试等API生命周期的各个阶段。开发者可以用Swagger来定义他们的API接口，并自动生成交互式的API文档。

3. **OpenAPI**：
   - OpenAPI 规范（以前称为Swagger规范）是描述RESTful API的一种标准化格式。它定义了一个与编程语言无关的接口文件格式，用来描述一个API的结构，包括路径、操作、输入参数、输出响应等信息。这个规范允许机器和人类都能读取并理解API的功能。
   - OpenAPI Initiative (OAI) 维护着该规范，它由Linux基金会托管，成员包括多个科技公司和技术社区。

总结来说，RESTful API是一种设计风格，而Swagger最初是一个帮助实现和文档化RESTful API的工具集，现在主要指的是遵循OpenAPI规范的API描述。OpenAPI则是Swagger规范演进后的结果，是一个更广泛接受的标准，用于描述API。因此，当你听到“Swagger”时，可能是指旧版本的规范或者相关工具集；而“OpenAPI”则通常指最新的规范标准。



## springdoc-openapi 和 springfox

`springdoc-openapi` 和 `springfox` 都是用于在Spring应用程序中生成和管理API文档的工具，但它们之间有几个关键的区别：

### Springfox

- **历史背景**：Springfox 是较早出现的一个项目，它基于Swagger 2.0规范（现在称为OpenAPI 2.0），主要用于为Spring MVC或Spring Boot应用自动生成Swagger UI和API文档。
- **实现方式**：Springfox通过代理请求的方式工作，即它会在运行时拦截HTTP请求，并根据Spring MVC控制器的方法签名和其他注解来构建API文档。这种方式可能导致性能问题，并且与某些新的Spring特性不完全兼容。
- **维护状态**：截至我所知的信息更新时间点（2024年12月），Springfox的活跃度已经下降，社区支持和技术更新不如以前频繁。

### Springdoc-openapi

- **现代选择**：`springdoc-openapi`是一个更为现代的选择，它直接基于OpenAPI 3.x规范（这是Swagger规范的后续版本）。它提供了一个更加简洁和高效的API文档生成解决方案。
- **实现方式**：`springdoc-openapi`采用了一种不同的方法来解析API端点，它利用了Spring的条件化配置和元数据扫描机制，可以在应用程序启动时快速生成文档，而不需要代理每个HTTP请求。这种方法通常更高效，也更容易与最新的Spring框架特性集成。
- **维护状态**：`springdoc-openapi`由活跃的社区维护，拥有更好的性能和稳定性，同时也更易于使用和扩展。它还提供了对Spring WebFlux等非阻塞式Web框架的支持。

### 关系总结

- **替代关系**：可以说，`springdoc-openapi`在很多方面是作为`springfox`的替代品出现的，特别是在Spring Boot 2.x及更高版本的应用中，因为它更好地适应了新的Spring特性和最佳实践。
- **规范支持**：两者都支持Swagger/OpenAPI规范，但是`springdoc-openapi`支持更新的OpenAPI 3.x版本，而`springfox`主要支持Swagger 2.0（即OpenAPI 2.0）。
- **生态和社区**：随着`springdoc-openapi`的流行，越来越多的开发者和项目开始转向它，享受其带来的性能提升和更好的社区支持。



## springdoc-openapi 和 knife4j

`springdoc-openapi` 和 `knife4j` 都是用于增强Spring应用程序中API文档生成和展示的工具，但它们在功能定位和实现方式上有所不同。下面将详细介绍两者之间的关系、各自的特点以及如何一起使用。

### springdoc-openapi

- **基于OpenAPI 3.x规范**：`springdoc-openapi` 是一个现代化的库，它直接支持OpenAPI 3.x 规范，可以为Spring Boot应用自动生成RESTful API文档。
- **自动扫描和解析**：它利用Spring的条件化配置和元数据扫描机制，在应用启动时快速解析API端点，并生成相应的API文档。
- **性能高效**：由于其设计原理，`springdoc-openapi` 不需要代理每个HTTP请求，因此性能较高。
- **社区活跃**：拥有活跃的社区支持和技术更新，适用于现代Spring应用。

### knife4j

- **增强版Swagger UI**：`knife4j` 是由国内开发者开发的一个开源项目，它是在Swagger UI基础上进行了大量优化和扩展的前端界面。它不仅提供了更美观的UI，还增加了许多实用的功能，如分组显示API、代码片段生成、在线调试等。
- **兼容多种后端框架**：虽然`knife4j`最初是为了与`springfox`配合使用而设计的，但它也完全兼容`springdoc-openapi`，这意味着你可以使用`springdoc-openapi`生成API文档，同时用`knife4j`来提供更好的前端展示。
- **额外特性**：
  - 支持API接口分组展示，便于管理和浏览大型API集合。
  - 提供了更丰富的交互式体验，比如参数智能提示、响应结果格式化等。
  - 支持更多的编程语言客户端代码生成模板。
  - 提供了更详细的错误信息提示，帮助开发者更快地定位问题。

### 如何结合使用

你可以在Spring Boot项目中同时引入`springdoc-openapi`和`knife4j`，以获得最佳的API文档生成功能和用户体验：

1. **添加依赖**：
   在你的`pom.xml`文件中添加以下依赖项（确保版本兼容）：

   ```xml
   <!-- springdoc-openapi -->
   <dependency>
       <groupId>org.springdoc</groupId>
       <artifactId>springdoc-openapi-ui</artifactId>
       <version>1.6.14</version> <!-- 使用最新稳定版 -->
   </dependency>
   
   <!-- knife4j -->
   <dependency>
       <groupId>com.github.xiaoymin</groupId>
       <artifactId>knife4j-spring-boot-starter</artifactId>
       <version>3.0.3</version> <!-- 使用最新稳定版 -->
   </dependency>
   ```

2. **配置应用**：
   如果你需要自定义一些行为或外观，可以通过`application.properties`或`application.yml`进行配置。例如：

   ```properties
   # 启用knife4j增强功能
   springdoc.swagger-ui.use-knife4j=true
   ```

3. **访问API文档**：
   启动应用后，你可以通过访问`http://localhost:8080/doc.html`来查看由`knife4j`提供的美化后的API文档界面。这个页面提供了比默认Swagger UI更加友好和强大的功能。

### 总结

- `springdoc-openapi` 主要负责根据Spring应用中的注解自动生成符合OpenAPI 3.x规范的API文档。
- `knife4j` 则专注于提升这些API文档的可视化效果和用户体验，提供了更多实用特性和美观的界面。
- 两者可以很好地协同工作，为开发者提供一个强大且易于使用的API文档解决方案。如果你希望既有高性能的API文档生成功能，又有一个漂亮且功能丰富的前端展示界面，那么`springdoc-openapi`搭配`knife4j`是一个不错的选择。



