# Redis 安装与使用

## Redis 安装

### Windows

- 安装包下载：[Index of /releases/](https://download.redis.io/releases/)
- https://github.com/redis-windows/redis-windows/releases

![image.png](./assets/1610173169875-a7758938-0028-42a5-a70b-f06ec322bb5c.png)

安装指导：[在 windows 上安装 Redis](https://redis.com.cn/redis-installation.html)

### Docker

https://redis.ac.cn/docs/latest/operate/oss_and_stack/install/install-stack/docker/

在 Docker 上运行 Redis 开源版

```bash
docker run -d --name myredis -p 6379:6379 redis:<version>
```

```bash
docker run -d --name redis-test -p 6379:6379 redis:latest --requirepass "密码"
```

使用本地配置文件

```bash
docker run -v /myredis/conf:/usr/local/etc/redis \
--name myredis redis \
redis-server /usr/local/etc/redis/redis.conf
```

其中 /myredis/conf/ 是包含您的 redis.conf 文件的本地目录。

## 客户端

### redis-cli

```bash
docker exec -it myredis redis-cli
```

如果您已在本地安装 redis-cli，则可以从您的终端中运行它

```bash
redis-cli -h <docker_host_ip> -p 6379
```

### Redis for vscode

- VsCode Reis 客户端插件 Redis for vscode https://marketplace.visualstudio.com/items?itemName=Redis.redis-for-vscode

### 其他

- [AnotherRedisDesktopManager](https://github.com/qishibo/AnotherRedisDesktopManager) 一款比较稳定简洁的 redis UI 工具。[AnotherRedisDesktopManager 发行版 - Gitee.com](https://gitee.com/qishibo/AnotherRedisDesktopManager/releases)

- redis-desktop-manager-0.8.8.384 https://www.alipan.com/s/chJuKNm6iQ7 提取码: 29rw
