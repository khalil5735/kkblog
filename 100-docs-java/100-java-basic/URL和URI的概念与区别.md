在 Java 中，`URI` 和 `URL` 是两个常见的概念，分别对应 `java.net.URI` 和 `java.net.URL` 两个类。它们都用于标识资源的位置或名称，但有着本质的区别。

## 1. 概念区分

- **URI（Uniform Resource Identifier，统一资源标识符）**  
  用于**唯一标识**一个资源（可以是网页、文件、数据库记录等），不要求提供访问该资源的方式。语法格式通常为：  
  `[scheme:]scheme-specific-part[#fragment]`  
  例如：  
  - `mailto:java-net@java.sun.com`（没有网络位置，只有标识）  
  - `urn:isbn:0451450523`（通过书名号标识一本书）

- **URL（Uniform Resource Locator，统一资源定位符）**  
  URI 的子集，不仅标识资源，还**提供定位和访问该资源的协议、网络位置等具体信息**，从而允许直接获取资源。语法格式包括：  
  `protocol://host:port/path?query#fragment`  
  例如：  
  - `https://www.example.com/index.html`  
  - `ftp://ftp.example.com/file.txt`

> 简单记忆：**URL 是能“用”的 URI**（即能通过协议获取资源），而 URI 包含 URL 和 URN（统一资源名称）。

## 2. Java 中的 `URI` 与 `URL` 类

| 特性 | `java.net.URI` | `java.net.URL` |
|------|----------------|----------------|
| **主要职责** | 纯语法解析、规范化、相对路径计算 | 支持网络访问，打开连接获取资源 |
| **是否支持协议处理器** | 否，只做字符串解析 | 是，可通过 `openConnection()` 获取输入流 |
| **是否需要注册协议** | 不需要 | 需要（如 http/https/file 等内置协议，也可自定义） |
| **能否识别相对路径** | 能，`resolve()` 方法 | 不能，构造时必须是绝对 URL |
| **是否自动编码/解码** | 是，遵循 RFC 2396 | 有限（部分方法会解码） |
| **比较相等性** | 按语法成分比较（不进行 DNS 解析） | 需网络访问来确定主机是否相同（可能阻塞） |

## 3. 使用场景与示例

### URI 适用场景：
- 需要解析、验证、拆分 URI 的各个部分（scheme、host、port、path、query、fragment）。
- 处理相对 URI（例如 HTML 页面中的链接拼接）。
- 存储不涉及网络访问的资源标识（如 URN）。

```java
URI uri = new URI("https://user:pass@example.com:8080/docs/guide?q=java#top");
System.out.println(uri.getScheme());   // https
System.out.println(uri.getHost());     // example.com
System.out.println(uri.getPort());     // 8080
System.out.println(uri.getPath());     // /docs/guide
System.out.println(uri.getQuery());    // q=java
System.out.println(uri.getFragment()); // top
```

### URL 适用场景：
- 需要直接读取网络资源（如 `openStream()`）。
- 需要调用 `openConnection()` 进行更细粒度的 HTTP 请求控制。

```java
URL url = new URL("https://www.example.com/index.html");
try (InputStream is = url.openStream()) {
    // 读取数据...
}
```

## 4. 重要区别总结

| 维度 | URI | URL |
|------|-----|-----|
| **定义范围** | 更宽（URL + URN） | 窄（只是 URI 的一种） |
| **是否包含协议** | 不一定（如 `mailto:` 也是一种协议，但无网络位置） | 必须有访问协议（http、ftp、file 等） |
| **能否定位并获取资源** | 不能 | 能 |
| **是否存在“相对 URI”** | 有 | 无（必须是绝对 URL） |

## 5. 常见陷阱与注意事项

- **`URL` 的 `equals()` 方法会进行网络 DNS 解析**，因此性能较差且依赖网络。建议在比较资源标识时优先使用 `URI` 的 `equals()`。
- 如果只需要对地址字符串做校验、拆分、拼接，优先使用 `URI`；如果需要打开连接，先用 `URI` 解析，然后调用 `toURL()` 或直接使用 `URL`。
- **强烈建议**：在 Java 代码中，除非你明确要访问网络，否则使用 `URI` 更安全、更高效。

```java
// 推荐：先构建 URI，需要访问时再转为 URL
URI uri = new URI("https://example.com");
URL url = uri.toURL();  // 仅当 scheme 支持且有效时可用
```

综上，两者虽紧密相关，但设计目标和使用场景完全不同——`URI` 关注“是什么”，`URL` 关注“在哪里 + 怎么访问”。

