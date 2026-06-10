# NVM

NVM (Node Version Manager)： 用于在同一台机器上安装和管理多个 Node.js 版本的工具

## NVM 配置阿里Nodejs和Npm 安装源

### 配置 NVM 镜像源（加速 Node.js 安装）
这一步是为了让 `nvm install` 命令下载 Node.js 安装包时使用国内镜像，避免网络超时。环境变量说明：
- node_mirror：此配置用于指定 Node.js 安装包的下载镜像地址，
- npm_mirror：此配置用于指定 NPM (Node Package Manager) 的下载地址，加速 NVM 工具安装新的 Node.js 环境时，其所携带的 NPM 二进制包

#### Windows 系统

1. 找到 NVM 的安装目录下的 `settings.txt` 文件（通常位于 `C:\Users\[用户名]\AppData\Roaming\nvm` 或你自定义的路径）。
2. 打开该文件，在末尾添加以下两行配置：
```
node_mirror: https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

3. 保存文件后，重新打开命令行工具即可生效。
   
#### Linux / macOS 系统

1. 打开终端，编辑你的 Shell 配置文件（如 `~/.bashrc`、`~/.zshrc` 或 `~/.profile`）。
2. 在文件末尾添加以下环境变量：

```bash
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/
export NVM_NPM_MIRROR=https://npmmirror.com/mirrors/npm/
```

3. 保存文件后，执行 `source ~/.bashrc`（或其他对应配置文件）使配置生效。
   


## npm_mirror 和 npm config set registry 两者的关系与区别

### npm_mirror（NVM 配置）
- 作用目标：用于加速 NVM 工具安装新的 Node.js 环境时，其所携带的 NPM 二进制包 的下载。
- 配置层级：这是 NVM 工具本身 的配置，通常在 NVM 的 settings.txt 文件（Windows）或环境变量（Linux/macOS）中设置。
- 工作时机：只有当您通过 nvm install 安装一个新的 Node.js 版本时生效。NVM 在下载完 Node.js 后，会根据此配置去镜像站下载对应版本的 NPM 包，并将其与 Node.js 绑定安装。
- 示例来源：您提供的配置 `npm_mirror: https://npmmirror.com/mirrors/npm/` 里面存放着各种 NPM 组件（如 arborist, libnpmexec等）的发布包。这是 NVM 内部使用的。

### npm config set registry（NPM 配置）
- 作用目标：用于加速 您已安装的 Node.js 环境下，使用 npm install 等命令下载项目依赖包（即 npm 仓库中的各种第三方库） 的过程。
- 配置层级：这是 NPM 包管理器 自身的配置，通过 npm config 命令在已安装的某个 Node.js 版本中设置。每个 Node.js 版本都有独立的 NPM 配置。
- 工作时机：在您日常的项目开发中，执行 npm install, npm publish, npm search 等与 npm 仓库交互的命令时生效。 示例：通常执行的命令是 `npm config set registry https://registry.npmmirror.com`。这个地址是 npm 包仓库的镜像，用于替换`https://registry.npmjs.org`。

汇总说明：

| 特性   | npm_mirror(NVM 配置)         | npm config set registry(NPM 配置) |
| ---- | -------------------------- | ------------------------------- |
| 所属工具 | Node Version Manager (NVM) |   Node Package Manager (NPM)    |
|配置目标 |加速下载 NPM 包管理器本身的安装包| 加速下载 项目所依赖的第三方 npm 包|
|配置位置 |NVM 的配置文件或环境变量 |某个已安装 Node.js 版本的 NPM 全局配置|
|影响的操作 |nvm install(安装新 Node 版本) |npm install, npm publish等 (日常开发命令)|
|镜像地址示例| https://npmmirror.com/mirrors/npm/(存放 npm 发布文件)| https://registry.npmmirror.com(存放 npm 包仓库)|


## NVM 常用命令清单
```
# 查看版本：
nvm ls- 列出本地已安装的所有 Node.js 版本。
nvm ls-remote- 列出远程所有可安装的 Node.js 版本。

# 安装版本：
nvm install <version>- 安装指定版本的 Node.js（例如 nvm install 20.15.1或 nvm install lts）。

#  切换版本：
nvm use <version>- 在当前终端切换使用指定版本的 Node.js。
nvm alias default <version>- 设置默认的 Node.js 版本（适用于新终端）。

#  项目内版本管理：
在项目根目录创建 .nvmrc文件，写入版本号（如 20.15.1）。
在项目目录下执行 nvm use，NVM 会自动切换至 .nvmrc中指定的版本。

#  其他实用命令：
nvm current- 显示当前终端正在使用的 Node.js 版本。
nvm uninstall <version>- 卸载指定版本的 Node.js。

```

