## JDBC 简介

什么是JDBC？JDBC是 `Java DataBase Connectivity` 的缩写，它是Java程序访问数据库的标准接口。

使用Java程序访问数据库时，Java代码并不是直接通过**TCP连接**去访问数据库，而是通过JDBC接口来访问，而JDBC接口则通过**JDBC驱动来实现**真正对数据库的访问。

例如，我们在Java代码中如果要访问MySQL，那么必须编写代码操作JDBC接口。注意到JDBC接口是Java标准库自带的，所以可以直接编译。而具体的JDBC驱动是由数据库厂商提供的，例如，MySQL的JDBC驱动由Oracle提供。因此，访问某个具体的数据库，我们只需要引入该厂商提供的JDBC驱动，就可以通过JDBC接口来访问，这样保证了Java程序编写的是一套数据库访问代码，却可以访问各种不同的数据库，因为他们都提供了标准的JDBC驱动。

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐

│  ┌───────────────┐  │
   │   Java App    │
│  └───────────────┘  │
           │
│          ▼          │
   ┌───────────────┐
│  │JDBC Interface │◀─┼─── JDK
   └───────────────┘
│          │          │
           ▼
│  ┌───────────────┐  │
   │  JDBC Driver  │◀───── Vendor（供应商）
│  └───────────────┘  │
           │
└ ─ ─ ─ ─ ─│─ ─ ─ ─ ─ ┘
           ▼
   ┌───────────────┐
   │   Database    │
   └───────────────┘
```

从代码来看，Java标准库自带的JDBC接口其实就是定义了一组接口，而某个具体的JDBC驱动其实就是实现了这些接口的类：

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐

│  ┌───────────────┐  │
   │   Java App    │
│  └───────────────┘  │
           │
│          ▼          │
   ┌───────────────┐
│  │JDBC Interface │◀─┼─── JDK
   └───────────────┘
│          │          │
           ▼
│  ┌───────────────┐  │
   │ MySQL Driver  │◀───── Oracle
│  └───────────────┘  │
           │
└ ─ ─ ─ ─ ─│─ ─ ─ ─ ─ ┘
           ▼
   ┌───────────────┐
   │     MySQL     │
   └───────────────┘
```

实际上，一个MySQL的JDBC的驱动就是一个jar包，它本身也是纯Java编写的。我们自己编写的代码只需要引用Java标准库提供的java.sql包下面的相关接口，由此再间接地通过MySQL驱动的jar包通过网络访问MySQL服务器，所有复杂的网络通讯都被封装到JDBC驱动中，因此，Java程序本身只需要引入一个MySQL驱动的jar包就可以正常访问MySQL服务器：

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
   ┌───────────────┐
│  │   App.class   │  │
   └───────────────┘
│          │          │
           ▼
│  ┌───────────────┐  │
   │  java.sql.*   │
│  └───────────────┘  │
           │
│          ▼          │
   ┌───────────────┐     TCP    ┌───────────────┐
│  │ mysql-xxx.jar │──┼────────▶│     MySQL     │
   └───────────────┘            └───────────────┘
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
          JVM
```

使用 JDBC 的好处是：

- 各数据库厂商使用相同的接口，Java代码不需要针对不同数据库分别开发；
- Java程序编译期仅依赖java.sql包，不依赖具体数据库的jar包；
- 可随时替换底层数据库，访问数据库的Java代码基本不变。

## 常见的jdbc组件

JDBC 的 API 提供了以下接口和类：

- DriverManager ：这个类管理一系列数据库驱动程序。匹配连接使用通信子协议从 JAVA 应用程序中请求合适的数据库驱动程序。识别 JDBC 下某个子协议的第一驱动程序将被用于建立数据库连接。
- Driver : 这个接口处理与数据库服务器的通信。你将很少直接与驱动程序互动。相反，你使用 DriverManager 中的对象，它管理此类型的对象。它也抽象与驱动程序对象工作相关的详细信息。
- Connection : 此接口具有接触数据库的所有方法。该连接对象表示通信上下文，即，所有与数据库的通信仅通过这个连接对象进行。
- Statement : 使用创建于这个接口的对象将 SQL 语句提交到数据库。除了执行存储过程以外，一些派生的接口也接受参数。
- ResultSet : 在你使用语句对象执行 SQL 查询后，这些对象保存从数据获得的数据。它作为一个迭代器，让您可以通过它的数据来移动。
- SQLException : 这个类处理发生在数据库应用程序的任何错误。

## JDBC连接

Connection代表一个JDBC连接，它相当于Java程序到数据库的连接（通常是TCP连接）。打开一个Connection时，需要准备URL、用户名和口令，才能成功连接到数据库。

> URL是由数据库厂商指定的格式，例如，MySQL的URL是：`jdbc:mysql://<hostname>:<port>/<db>?key1=value1&key2=value2`

要获取数据库连接，使用如下代码：

```java
// JDBC连接的URL, 不同数据库有不同的格式:
String JDBC_URL = "jdbc:mysql://localhost:3306/test";
String JDBC_USER = "root";
String JDBC_PASSWORD = "password";
// 获取连接:
Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
// TODO: 访问数据库...
// 关闭连接:
conn.close();
```

核心代码是 `DriverManager` 提供的静态方法 `getConnection()` 。`DriverManager` 会自动扫描classpath，找到所有的JDBC驱动，然后根据我们传入的URL自动挑选一个合适的驱动。

因为JDBC连接是一种昂贵的资源，所以使用后要及时释放。使用`try (resource)`来自动释放JDBC连接是一个好方法：

```java
try (Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD)) {
    ...
}
```

## JDBC使用

1. 获取 `Connection`
2. 创建 `Statement` 对象，用于执行 SQL
3. 执行
4. 关闭 `Statement`，关闭（释放） `Connection` 资源

```sql
drop table if exists public.students;

create table if not exists public.students  
(  
    id     serial,  
    name   varchar(50) not null,  
    gender smallint,  
    grade  integer,  
    score  integer  
);

-- 插入初始数据:  
INSERT INTO students (name, gender, grade, score) VALUES ('小明', 1, 1, 88);  
INSERT INTO students (name, gender, grade, score) VALUES ('小红', 1, 1, 95);  
INSERT INTO students (name, gender, grade, score) VALUES ('小军', 0, 1, 93);  
INSERT INTO students (name, gender, grade, score) VALUES ('小白', 0, 1, 100);  
INSERT INTO students (name, gender, grade, score) VALUES ('小牛', 1, 2, 96);  
INSERT INTO students (name, gender, grade, score) VALUES ('小兵', 1, 2, 99);  
INSERT INTO students (name, gender, grade, score) VALUES ('小强', 0, 2, 86);  
INSERT INTO students (name, gender, grade, score) VALUES ('小乔', 0, 2, 79);  
INSERT INTO students (name, gender, grade, score) VALUES ('小青', 1, 3, 85);  
INSERT INTO students (name, gender, grade, score) VALUES ('小王', 1, 3, 90);  
INSERT INTO students (name, gender, grade, score) VALUES ('小林', 0, 3, 91);  
INSERT INTO students (name, gender, grade, score) VALUES ('小贝', 0, 3, 77);
```

### 示例1：根据用户性别查询用户信息

```java
public List<Student> findStudentsByGender(Integer gender) {  
    String sql = "select id,name,gender,grade,score from students where gender=" + gender;  
    try (Connection connection = ConnectionUtil.getConnection()) {  
        try (Statement statement = connection.createStatement()) {  
            try (ResultSet resultSet = statement.executeQuery(sql)) {  
                List<Student> students = new ArrayList<>();  
                while (resultSet.next()) {  
                    int id = resultSet.getInt(1); // 通过列索引获取值，切记从1开始  
                    String name = resultSet.getString(2);  // 通过列索引获取值，切记从1开始  
                    int grade = resultSet.getInt("grade"); // 通过列名称获取值，切记从1开始  
                    int score = resultSet.getInt("score"); // 通过列名称获取值，切记从1开始  
                    Student student = new Student(name, grade, grade, score);  
                    student.setId(id);  
                    students.add(student);  
                }  

                return students;  
            }  
        }  
    } catch (SQLException e) {  
        throw new RuntimeException(e);  
    }  
}
```

注意要点：

- `Connection` 、`Statement` 和 `ResultSet` 都是需要释放的资源，可以通过 try(resource) 确保资源释放。
- `rs.next()`用于判断是否有下一行记录，如果有，将自动把当前行移动到下一行（一开始获得`ResultSet`时当前行不是第一行）
- `ResultSet`获取列时，索引从`1`开始而不是`0`

### SQL注入

使用 Statement 拼字符串非常容易引发SQL注入的问题，这是因为SQL参数往往是从方法参数传入的。

我们来看一个例子：假设用户登录的验证方法如下：

```java
User login(String name, String pass) {
    ...
    stmt.executeQuery("SELECT * FROM user WHERE login='" + name + "' AND pass='" + pass + "'");
    ...
}
```

其中，参数name和pass通常都是Web页面输入后由程序接收到的。

如果用户的输入是程序期待的值，就可以拼出正确的SQL。例如：name = "bob"，pass = "1234"：

```sql
SELECT * FROM user WHERE login='bob' AND pass='1234'
```

但是，如果用户的输入是一个精心构造的字符串，就可以拼出意想不到的SQL，这个SQL也是正确的，但它查询的条件不是程序设计的意图。例如：name = `"bob' OR pass="`, pass = `" OR pass='"`：

```sql
SELECT * FROM user WHERE login='bob' OR pass=' AND pass=' OR pass=''
```

这个SQL语句执行的时候，根本不用判断口令是否正确，这样一来，登录就形同虚设。

要避免SQL注入攻击，一个办法是针对所有字符串参数进行转义，但是转义很麻烦，而且需要在任何使用SQL的地方增加转义代码。

在JDBC 中 使用 `PreparedStatement` 可以_完全避免SQL注入_的问题，因为 `PreparedStatement` 始终使用 `?` 作为占位符，并且把数据连同 SQL 本身传给数据库，这样可以保证每次传给数据库的SQL语句是相同的，只是占位符的数据不同，还能高效利用数据库本身对查询的缓存。上述登录SQL如果用 `PreparedStatement` 可以改写如下：

```java
User login(String name, String pass) {
    ...
    String sql = "SELECT * FROM user WHERE login=? AND pass=?";
    PreparedStatement ps = conn.prepareStatement(sql);
    ps.setObject(1, name);
    ps.setObject(2, pass);
    ...
}
```

使用 `PreparedStatement` 和 `Statement` 稍有不同，必须首先调用 `setObject()` 设置每个占位符`?` 的值，最后获取的仍然是`ResultSet`对象。

```java
public List<Student> findStudentsByGender(Integer gender) {  
    String sql = "select id,name,gender,grade,score from students where gender=?";  
    try (Connection connection = ConnectionUtil.getConnection()) {  
        // 使用 PreparedStatement执行sql，防止sql 注入  
        try (PreparedStatement statement = connection.prepareStatement(sql)) {  
            // 根据参数索引位置，设置参数，同样，索引其实也是从1开始  
            statement.setInt(1, 1);  
            try (ResultSet resultSet = statement.executeQuery()) {  
                List<Student> students = new ArrayList<>();  
                while (resultSet.next()) {  
                    int id = resultSet.getInt(1); // 通过列索引获取值，切记从1开始  
                    String name = resultSet.getString(2);  // 通过列索引获取值，切记从1开始  
                    int grade = resultSet.getInt("grade"); // 通过列名称获取值，切记从1开始  
                    int score = resultSet.getInt("score"); // 通过列名称获取值，切记从1开始  
                    Student student = new Student(name, grade, grade, score);  
                    student.setId(id);  
                    students.add(student);  
                }  

                return students;  
            }  
        }  
    } catch (SQLException e) {  
        throw new RuntimeException(e);  
    }  
}
```

### JDBC 查询

初始数据

```sql
-- postgres数据库
-- 创建数据库learjdbc:
DROP DATABASE IF EXISTS learnjdbc;
CREATE DATABASE learnjdbc;
USE learnjdbc;

CREATE TABLE students (
  id serial NOT NULL,
  name VARCHAR(50) NOT NULL,
  gender CHAR(1) NOT NULL,
  grade INT NOT NULL,
  score INT NOT NULL,
  PRIMARY KEY(id)
);

-- 插入初始数据:
INSERT INTO students (name, gender, grade, score) VALUES ('小明', '1', 1, 88);
INSERT INTO students (name, gender, grade, score) VALUES ('小红', '1', 1, 95);
INSERT INTO students (name, gender, grade, score) VALUES ('小军', '0', 1, 93);
INSERT INTO students (name, gender, grade, score) VALUES ('小白', '0', 1, 100);
INSERT INTO students (name, gender, grade, score) VALUES ('小牛', '1', 2, 96);
INSERT INTO students (name, gender, grade, score) VALUES ('小兵', '1', 2, 99);
INSERT INTO students (name, gender, grade, score) VALUES ('小强', '0', 2, 86);
INSERT INTO students (name, gender, grade, score) VALUES ('小乔', '0', 2, 79);
INSERT INTO students (name, gender, grade, score) VALUES ('小青', '1', 3, 85);
INSERT INTO students (name, gender, grade, score) VALUES ('小王', '1', 3, 90);
INSERT INTO students (name, gender, grade, score) VALUES ('小林', '0', 3, 91);
INSERT INTO students (name, gender, grade, score) VALUES ('小贝', '0', 3, 77);
```

## JDBC 事务

 DBC 连接是处于自动提交模式下，该模式为默认模式，那么每句 SQL 语句都是在其完成时提交到数据库。

```java
public void addStudent() {  
    Connection connection = ConnectionUtil.getConnection();  
    PreparedStatement statement = null;  
    try {  
        statement = connection.prepareStatement("insert into students (name, gender, grade, score) values (?,?,?,?)");  
        statement.setObject(1, "libai");  
        statement.setObject(2, 1);  
        statement.setObject(3, 3);  
        statement.setObject(4, 88);  
        statement.execute(); // {1}

        // 模拟程序其他业务处理失败  
        int a = 10 / 0;  // {2} 

    } catch (SQLException e) {  
        throw new RuntimeException(e);  
    } finally {  
        ConnectionUtil.closeAll(connection, statement, null);  
    }  
}
```

如上代码，虽然在 {2} 处处理有异常，但数据库依然会成功插入新数据，jdbc在 {1} 处sql执行完成后就进行了自动提交。

通过事务在任意时间来控制以及更改应用到数据库。它把单个 SQL 语句或一组 SQL 语句作为一个逻辑单元，如果其中任一语句失败，则整个事务失败。

## 其他

[Download | pgJDBC (postgresql.org)](https://jdbc.postgresql.org/download/)

[JDBC 指南_w3cschool](https://www.w3cschool.cn/jdbc/)

[JDBC编程 - 廖雪峰的官方网站 (liaoxuefeng.com)](https://www.liaoxuefeng.com/wiki/1252599548343744/1255943820274272)
