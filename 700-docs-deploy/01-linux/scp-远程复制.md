# SCP 远程文件 copy

## 概述

Linux scp 命令用于 Linux 之间复制文件和目录。

scp 是 secure copy 的缩写, scp 是 linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令。

在 Linux 系统中，scp 命令是一个非常实用的工具 scp 是 "secure copy" 的缩写，它基于 SSH（Secure Shell）协议，确保数据传输的安全性。

## 语法

```
scp [选项] [源文件] [目标路径]
```

常用选项：

- -r：递归复制目录。
- -p：保留文件属性。
- -v：显示详细过程。
- -C：使用压缩传输数据,可以提升传输效率。

https://www.runoob.com/linux/linux-comm-scp.html

## 常用示例

- 从本地复制文件到远程主机

```bash
scp /path/to/local/file username@remotehost:/path/to/remote/file
```

- 从远程主机复制文件到本地

```bash
scp username@remotehost:/path/to/remote/file /path/to/local/file
```

- 从远程主机复制目录到本地

```bash
scp -r username@remotehost:/path/to/remote/directory /path/to/local/directory
```

- 从本地复制目录到远程主机

```bash
scp -r /path/to/local/directory username@remotehost:/path/to/remote/directory
```
