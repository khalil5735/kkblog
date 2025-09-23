# Apache Commons Text

官网地址：https://commons.apache.org/proper/commons-text/

Apache Commons Text 是一个基于 Java 的开源项目，提供了一些用于处理文本的类。

## 功能汇总

| 特性                     | 关键类                             | 使用场景 |
| ------------------------ | ---------------------------------- | -------- |
| 字符串模板替换           | StringSubstitutor ,StringLookup    | 模版替换 |
| 字符串相识度计算         | org.apache.commons.text.similarity |          |
| 提供字符串之间差异的算法 | org.apache.commons.text.diff       |          |
| 相似性和距离             | org.apache.commons.text.similarity |          |

## StringSubstitutor

`StringSubstitutor` 是 **Apache Commons Text** 中非常实用的一个类，主要用于**模板字符串的变量替换**，非常适合用于配置文件、邮件模板、日志格式化、动态内容生成等场景。

---

### 一、`StringSubstitutor` 简介

`StringSubstitutor` 支持 `${key}` 这种格式的占位符替换。你可以提供一个数据源（如 `Map`、JavaBean、系统属性等），它会自动将模板中的 `${xxx}` 替换为对应值。

---

### 二、Maven 依赖（确保已引入）

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-text</artifactId>
    <version>1.10.0</version>
</dependency>
```

---

### 三、基本使用示例

#### 示例 1：使用 Map 替换模板变量（最常见）

```java
import org.apache.commons.text.StringSubstitutor;

import java.util.HashMap;
import java.util.Map;

public class StringSubstitutorExample {
    public static void main(String[] args) {
        // 1. 定义模板
        String template = "Hello ${name}, welcome to ${site}! Today is ${date}.";

        // 2. 准备数据
        Map<String, String> valuesMap = new HashMap<>();
        valuesMap.put("name", "Alice");
        valuesMap.put("site", "Alibaba Cloud");
        valuesMap.put("date", "2025-09-22");

        // 3. 执行替换
        StringSubstitutor substitutor = new StringSubstitutor(valuesMap);
        String result = substitutor.replace(template);

        System.out.println(result);
        // 输出：Hello Alice, welcome to Alibaba Cloud! Today is 2025-09-22.
    }
}
```

---

#### 示例 2：嵌套变量替换（支持递归）

```java
String template = "Base URL: ${protocol}://${domain}/${path}";
Map<String, String> values = new HashMap<>();
values.put("protocol", "https");
values.put("domain", "example.com");
values.put("path", "api/v1");

StringSubstitutor sub = new StringSubstitutor(values);
System.out.println(sub.replace(template));
// 输出：Base URL: https://example.com/api/v1
```

> 支持多层嵌套，例如 `${outer.${inner}}`（需配置启用）。

---

#### 示例 3：设置默认值（使用 `:` 语法）

当某个变量不存在时，可以设置默认值：

```java
String template = "User: ${username:Unknown}, Role: ${role:Guest}";

Map<String, String> values = new HashMap<>();
values.put("username", "Bob"); // 没有 role

StringSubstitutor sub = new StringSubstitutor(values);
System.out.println(sub.replace(template));
// 输出：User: Bob, Role: Guest
```

> 语法：`${key:default_value}`

---

#### 示例 4：自定义前缀和后缀（非 `${}` 格式）

如果你不想用 `${}`，可以自定义分隔符：

```java
String template = "Hello #name#, you are from #country#.";

Map<String, String> values = Map.of("name", "Charlie", "country", "China");

// 使用 '#' 作为前缀和后缀
StringSubstitutor sub = new StringSubstitutor(values, "#", "#");
String result = sub.replace(template);

System.out.println(result);
// 输出：Hello Charlie, you are from China.
```

---

#### 示例 5：结合 JavaBean 使用（通过反射）

```java
public class User {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 必须有 getter 方法
    public String getName() { return name; }
    public int getAge() { return age; }
}

// 使用 Bean
User user = new User("David", 25);
Map<String, Object> context = Map.of("user", user);
String template = "User: ${user.name}, Age: ${user.age}";

StringSubstitutor sub = new StringSubstitutor(context);
System.out.println(sub.replace(template));
// 输出：User: David, Age: 25
```

> 支持 `bean.property` 形式访问 getter。

---

#### 示例 6：安全使用（避免漏洞）

**重要安全提示**：旧版本的 `StringSubstitutor` 如果结合 `SystemPropertiesLookup` 使用，可能导致远程代码执行（类似 Log4Shell）。

**推荐做法**：只使用受控的 `Map`，**不要启用系统属性查找**。

```java
//  危险做法（避免）
// StrLookup<?> lookup = StrLookup.systemPropertiesLookup();
// StringSubstitutor sub = new StringSubstitutor(lookup);

// 安全做法
Map<String, String> safeMap = Map.of("name", "Eve");
StringSubstitutor sub = new StringSubstitutor(safeMap);
```

---

### 四、高级配置方法

| 方法                                      | 说明                                                 |
| ----------------------------------------- | ---------------------------------------------------- |
| `setEnableSubstitutionInVariables(true)`  | 是否允许变量中包含其他变量（如 `${outer.${inner}}`） |
| `setValueDelimiter(":")`                  | 设置默认值的分隔符（默认是 `:`）                     |
| `setPreserveEscapedCharacters(true)`      | 是否保留转义字符，如 `\${noReplace}` 不替换          |
| `setDisableSubstitutionInTemplates(true)` | 禁止模板中嵌套表达式（提高安全性）                   |

---

### 五、安全建议总结

| 建议                                  | 说明                   |
| ------------------------------------- | ---------------------- |
| 使用 `Map<String, String>` 作为数据源 | 控制输入，避免外部注入 |
| 禁用系统属性/环境变量查找             | 防止敏感信息泄露或 RCE |
| 对用户输入的模板进行校验              | 限制可替换的变量名     |
| 使用最新版本（≥1.10.0）               | 修复了已知安全问题     |

---

### 六、适用场景总结

| 场景              | 是否推荐                                  |
| ----------------- | ----------------------------------------- |
| 邮件/短信模板渲染 | 强烈推荐                                  |
| 配置文件变量注入  | 推荐（如 YAML/Properties 动态填充）       |
| 日志上下文变量    | 可用                                      |
| Web 页面模板      | 简单场景可用，复杂用 Thymeleaf/Freemarker |
| 用户可编辑模板    | 需严格校验变量名和内容，防止注入          |

---

### 官方文档参考

- API 文档：[https://commons.apache.org/proper/commons-text/javadocs/api-release/org/apache/commons/text/StringSubstitutor.html](https://commons.apache.org/proper/commons-text/javadocs/api-release/org/apache/commons/text/StringSubstitutor.html)
