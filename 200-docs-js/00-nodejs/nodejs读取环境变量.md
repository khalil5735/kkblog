# Node.js 环境变量（读取与设置）

## 1. 概述

在 Node.js 中，环境变量通过全局对象 `process.env` 访问和设置。环境变量主要用于：

- 配置不同环境（开发、测试、生产）
- 存储敏感信息（如数据库密码、API密钥）—— 注意不要提交到代码仓库
- 控制应用行为（如端口、日志级别）

## 2. 读取环境变量

使用 `process.env.VAR_NAME` 读取。如果变量不存在，返回 `undefined`。

```javascript
// 读取单个变量
const nodeEnv = process.env.NODE_ENV;
console.log(nodeEnv); // 可能输出 "development"、"production" 或 undefined

// 设置默认值（避免 undefined）
const port = process.env.PORT || 3000;

// 查看所有环境变量（仅在调试时使用）
console.log(process.env);
```

## 3. 设置环境变量（运行时动态设置）

在代码中直接给 `process.env` 属性赋值，**只影响当前进程及其子进程**，不影响系统环境或父进程。

```javascript
// 设置一个变量
process.env.MY_VARIABLE = 'hello';

// 修改已有变量
process.env.NODE_ENV = 'production';

// 删除变量
delete process.env.TEMP_VAR;

// 验证
console.log(process.env.MY_VARIABLE); // hello
```

**注意**：值总是字符串，非字符串会自动转换。

```javascript
process.env.PORT = 8080;
console.log(typeof process.env.PORT); // string
```

## 4. 启动时设置环境变量（命令行）

这是最常见的方式，适用于不同运行环境。

### 4.1 Unix / Linux / macOS

```bash
# 单变量
NODE_ENV=production PORT=3000 node app.js

# 多变量，换行
NODE_ENV=production \
PORT=3000 \
DB_HOST=localhost \
node app.js
```

### 4.2 Windows (cmd)

```batch
set NODE_ENV=production && set PORT=3000 && node app.js
```

### 4.3 Windows (PowerShell)

```powershell
$env:NODE_ENV="production"; $env:PORT="3000"; node app.js
```

## 5. 使用 `.env` 文件（`dotenv` 库）

在开发中，将环境变量保存在 `.env` 文件中，避免每次手动设置，也方便团队共享配置（不包含真实密钥）。

### 5.1 安装 dotenv

```bash
npm install dotenv
```

### 5.2 创建 `.env` 文件

```env
# .env
PORT=3000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/mydb
API_KEY=abc123
```

### 5.3 加载并使用

在项目入口最前面引入并配置：

```javascript
// index.js
require('dotenv').config();

console.log(process.env.PORT);      // 3000
console.log(process.env.DB_URL);    // mongodb://localhost:27017/mydb
```

**⚠️ 安全提醒**：
- 将 `.env` 加入 `.gitignore`，避免提交敏感信息
- 提供 `.env.example` 模板文件供团队参考

### 5.4 自定义路径或配置

```javascript
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config/.env.production') });
```

## 6. 注意事项与最佳实践

| 问题           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| **作用范围**   | 运行时 `process.env` 的修改不影响系统环境变量，进程退出后丢失。 |
| **类型转换**   | 所有值都是字符串，需要数字或布尔值时自行转换：`const isDebug = process.env.DEBUG === 'true'`。 |
| **敏感信息**   | 禁止在前端代码中暴露环境变量（Node.js 后端可以，但 `.env` 不要上传）。 |
| **默认值**     | 使用 `||` 提供默认值，避免 `undefined` 导致错误。            |
| **变量名规范** | 通常使用大写字母和下划线，如 `DB_HOST`。                     |

## 7. 完整示例

```javascript
// app.js
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT, 10) || 3000;
const dbUrl = process.env.DATABASE_URL;

// 运行时动态设置临时变量
process.env.APP_START_TIME = Date.now().toString();

console.log(`Environment: ${env}`);
console.log(`Port: ${port}`);
console.log(`DB: ${dbUrl}`);
console.log(`Start time: ${process.env.APP_START_TIME}`);

// 启动后某个时刻可以读取之前设置的变量
// 但进程退出后 APP_START_TIME 就会消失
```

运行：

```bash
# 方式1：命令行设置
NODE_ENV=production PORT=8080 node app.js

# 方式2：使用 .env 文件
node app.js
```

## 总结

- **读取**：`process.env.VAR_NAME`
- **运行时设置**：`process.env.VAR_NAME = 'value'`
- **启动时设置**：命令行前缀或 `.env` 文件 + dotenv
- **生产环境**：通常使用系统级环境变量（如 Docker、Kubernetes ConfigMap、PM2 等），但在代码中统一用 `process.env` 读取。

掌握这些方法，可以灵活配置 Node.js 应用在不同环境下的行为。