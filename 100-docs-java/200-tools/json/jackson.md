# Jackson 完整使用指南

Jackson 是 Java 生态中事实标准的 JSON 处理库，也是 Spring Boot 的默认实现。本指南将涵盖从基础到进阶的常见使用场景。

## 一、快速入门

### 1.1 添加依赖

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.15.3</version>
</dependency>
```

如果使用 Spring Boot，则无需单独引入，`spring-boot-starter-web` 已包含 Jackson。

### 1.2 核心对象 ObjectMapper

`ObjectMapper` 是 Jackson 的核心入口，**注意它的创建成本较高，应该作为单例复用，避免重复创建**。

```java
// 推荐：单例模式
public class JsonUtil {
    private static final ObjectMapper mapper = new ObjectMapper();

    public static ObjectMapper getMapper() {
        return mapper;
    }
}

// 不推荐：每次使用时创建
ObjectMapper mapper = new ObjectMapper();  // 浪费性能
```

### 1.3 基础序列化/反序列化

```java
// 对象 → JSON 字符串
User user = new User("张三", 25);
String json = mapper.writeValueAsString(user);

// JSON 字符串 → 对象
String jsonStr = "{\"name\":\"张三\",\"age\":25}";
User user = mapper.readValue(jsonStr, User.class);

// 文件/流操作
mapper.writeValue(new File("user.json"), user);
User user = mapper.readValue(new File("user.json"), User.class);
```

## 二、常用注解详解

### 2.1 字段重命名：@JsonProperty

当 Java 字段名与 JSON 字段名不一致时使用：

```java
public class User {
    @JsonProperty("user_name")  // JSON 中使用 user_name
    private String userName;

    @JsonProperty("phone_num")
    private String phoneNumber;
}
```

### 2.2 日期格式化：@JsonFormat

```java
public class Event {
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    private LocalDateTime updateTime;
}
```

### 2.3 忽略字段：@JsonIgnore 和 @JsonIgnoreProperties

```java
// 方式一：忽略单个字段
public class User {
    private String name;

    @JsonIgnore  // 序列化和反序列化时都忽略
    private String password;

    @JsonIgnore  // 也可放在 getter/setter 上实现更细粒度控制
    public String getPassword() { return password; }
}

// 方式二：类级别批量忽略
@JsonIgnoreProperties({"password", "salt", "token"})
public class User {
    private String name;
    private String password;
    private String salt;
}

// 方式三：忽略未知属性（强烈推荐）
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
    // 当 JSON 中有 Java 类不存在的字段时，不会抛异常
}
```

### 2.4 控制 null 值序列化：@JsonInclude

```java
// 类级别全局配置
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {
    private String name;    // 不为 null 才序列化
    private String address; // 为 null 时该字段会被省略
}

// 可选的 Include 策略：
// NON_NULL      - 不为 null
// NON_EMPTY     - 不为 null 且不为空（空字符串、空集合等）
// NON_DEFAULT   - 不为默认值（0、false 等）
// ALWAYS        - 总是包含（默认）
```

### 2.5 枚举处理：@JsonValue

```java
public enum StatusEnum {
    NORMAL(200, "正常"),
    DISABLED(403, "禁用");

    private int code;
    private String desc;

    StatusEnum(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    @JsonValue  // 序列化时返回此值，而不是枚举名称
    public int getCode() { return code; }
}
// 输出结果：200 而不是 "NORMAL"
```

### 2.6 自定义序列化/反序列化：@JsonSerialize / @JsonDeserialize

```java
// 自定义日期序列化器
public class CustomDateSerializer extends JsonSerializer<Date> {
    @Override
    public void serialize(Date date, JsonGenerator gen, SerializerProvider ctxt)
        throws IOException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        gen.writeString(sdf.format(date));
    }
}

// 自定义日期反序列化器
public class CustomDateDeserializer extends JsonDeserializer<Date> {
    @Override
    public Date deserialize(JsonParser p, DeserializationContext ctxt)
        throws IOException {
        String dateStr = p.getText();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        return sdf.parse(dateStr);
    }
}

// 使用
public class Event {
    @JsonSerialize(using = CustomDateSerializer.class)
    @JsonDeserialize(using = CustomDateDeserializer.class)
    private Date eventDate;
}
```

### 2.7 扁平化嵌套对象：@JsonUnwrapped

```java
public class Person {
    private String name;

    @JsonUnwrapped  // 将 Address 的字段提升到外层
    private Address address;
}

public class Address {
    private String city;
    private String street;
}

// 输出：{"name":"张三","city":"北京","street":"长安街"}
// 而不是：{"name":"张三","address":{"city":"北京","street":"长安街"}}
```

## 三、泛型处理

### 3.1 泛型反序列化：TypeReference

由于 Java 泛型擦除，直接使用 `User.class` 会丢失泛型信息，需要使用 `TypeReference`：

```java
// 场景：反序列化 List<User>
String json = "[{\"name\":\"张三\"},{\"name\":\"李四\"}]";

// ❌ 错误写法 - 会得到 List<LinkedHashMap>
List<User> list = mapper.readValue(json, List.class);

// ✅ 正确写法 - 使用 TypeReference
List<User> userList = mapper.readValue(json, new TypeReference<List<User>>() {});

// 更复杂的嵌套泛型
String jsonWrapper = "{\"code\":200,\"data\":[{\"name\":\"张三\"}]}";
Result<List<User>> result = mapper.readValue(
    jsonWrapper,
    new TypeReference<Result<List<User>>>() {}
);
```

### 3.2 TypeReference 原理

`TypeReference` 通过匿名子类在运行时捕获完整的泛型类型信息，绕过泛型擦除。

## 四、树模型操作

当 JSON 结构不确定或只需提取部分字段时，可使用树模型：

```java
String json = "{\"returnCode\":\"200\",\"data\":[{\"activityId\":\"123\",\"entName\":\"某公司\"}]}";

// 解析为树
JsonNode rootNode = mapper.readTree(json);

// 提取字段
String code = rootNode.get("returnCode").asText();
JsonNode dataArray = rootNode.get("data");

// 遍历数组
List<User> userList = new ArrayList<>();
for (JsonNode node : dataArray) {
    User user = mapper.treeToValue(node, User.class);
    userList.add(user);
}

// 反向操作：对象转树
JsonNode node = mapper.valueToTree(user);
```

## 五、Spring Boot 集成配置

### 5.1 application.yml 配置

```yaml
spring:
  jackson:
    # 全局日期格式
    date-format: yyyy-MM-dd HH:mm:ss
    # 时区
    time-zone: GMT+8
    # 默认属性包含策略（null 不序列化）
    default-property-inclusion: non_null
    # 序列化特性
    serialization:
      indent_output: true # 格式化输出
      write_dates_as_timestamps: false # 日期不转时间戳
    # 反序列化特性
    deserialization:
      fail_on_unknown_properties: false # 忽略未知属性
```

### 5.2 全局配置 ObjectMapper

```java
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        // 日期格式化
        mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
        mapper.setTimeZone(TimeZone.getTimeZone("GMT+8"));

        // 忽略未知属性
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // 空对象不抛异常
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

        // 格式化输出
        mapper.enable(SerializationFeature.INDENT_OUTPUT);

        // 不序列化 null 值
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

        // 注册 Java 8 时间模块
        mapper.registerModule(new JavaTimeModule());

        return mapper;
    }
}
```

### 5.3 自定义全局序列化器

```java
@Component
public class JacksonCustomizer implements Jackson2ObjectMapperBuilderCustomizer {

    @Override
    public void customize(Jackson2ObjectMapperBuilder builder) {
        builder.serializerByType(LocalDateTime.class, new LocalDateTimeSerializer(
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        ));
        builder.deserializerByType(LocalDateTime.class, new LocalDateTimeDeserializer(
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        ));
    }
}
```

## 六、高级配置技巧

### 6.1 常用序列化特性配置

```java
ObjectMapper mapper = new ObjectMapper();

// 序列化配置
mapper.enable(SerializationFeature.INDENT_OUTPUT);           // 格式化输出
mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // 日期用字符串
mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);    // 空对象不抛异常

// 反序列化配置
mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES); // 忽略未知字段
mapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT); // 空字符串→null
mapper.enable(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY); // 单个值→数组
```

### 6.2 命名策略配置

```java
// 全局配置驼峰 ↔ 下划线转换
mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
// 输出：user_name 而非 userName
```

## 七、常见问题与最佳实践

### 7.1 LocalDateTime 反序列化问题

```java
// 解决方案一：使用 @JsonFormat
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
private LocalDateTime createTime;

// 解决方案二：注册 JavaTimeModule
mapper.registerModule(new JavaTimeModule());
mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
```

### 7.2 循环引用处理

```java
@Data
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Department {
    private Long id;
    private String name;

    @JsonIgnore  // 方式一：直接忽略
    private List<Employee> employees;
}
```

### 7.3 性能优化建议

1. **复用 ObjectMapper**：创建成本高，应作为单例使用
2. **使用流式API处理大文件**：避免一次性加载整个 JSON 到内存
3. **关闭不需要的特性**：如 `FAIL_ON_EMPTY_BEANS` 等

## 八、总结速查表

| 场景                 | 推荐方案                                  |
| :------------------- | :---------------------------------------- |
| 对象 ⇄ JSON          | `writeValueAsString()` / `readValue()`    |
| 泛型集合             | `new TypeReference<List<T>>() {}`         |
| 字段名不匹配         | `@JsonProperty`                           |
| 忽略字段             | `@JsonIgnore` / `@JsonIgnoreProperties`   |
| 日期格式化           | `@JsonFormat`                             |
| 忽略 null 字段       | `@JsonInclude(Include.NON_NULL)`          |
| 枚举自定义输出       | `@JsonValue`                              |
| 自定义序列化逻辑     | `@JsonSerialize` / `@JsonDeserialize`     |
| 动态提取字段         | 树模型 `readTree()`                       |
| Spring Boot 全局配置 | `application.yml` 或 `@Bean ObjectMapper` |
