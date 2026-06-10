## npm 地址

- [npmmirror 镜像站](https://npmmirror.com/)
- [npm | Home](https://www.npmjs.com/)

## 配置 npm 镜像源（加速依赖包下载）

这一步是为了让 `npm install` 命令下载项目依赖包时使用国内镜像。

### 全局配置

全局配置会将镜像源地址写入当前操作系统用户的 npm 配置文件中，影响该用户下所有项目（以及未来新建的项目）。需要注意的是不影响同一台机器上其他用户的配置（每个用户有自己的 `~/.npmrc`）

#### 命令行方式

在命令行中执行以下命令，将 npm 的默认仓库地址设置为阿里镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

#### 配置文件方式

- Linux / macOS：`~/.npmrc`（`~` 代表用户主目录，例如 `/home/用户名/.npmrc` 或 `/Users/用户名/.npmrc`）
- Windows：`C:\Users\用户名\.npmrc`

添加一行配置:

```ini
registry=https://registry.npmmirror.com
```

#### 注意事项：NVM每个版本配置独立

NVM 管理的每个 Node.js 版本都有独立的 npm 配置。如果你切换了 Node 版本（nvm use），可能需要重新执行 `npm config set registry` 命令来设置该版本的 npm 镜像源。

### 项目配置

项目配置将镜像源设置放置在特定项目的根目录下（即 package.json 所在目录），仅对该项目生效，不影响其他项目。

#### 项目根目录下的 .npmrc 文件

```ini
registry=https://registry.npmmirror.com
```

### 单次配置

单次配置是指在执行具体的 npm 命令时，通过命令行参数临时指定镜像源，只对该条命令生效。

```bash
npm install <package-name> --registry=https://registry.npmmirror.com
```

### 验证配置

验证配置是否成功：

```bash
npm config get registry
```

如果输出 `https://registry.npmmirror.com` 则说明配置成功
