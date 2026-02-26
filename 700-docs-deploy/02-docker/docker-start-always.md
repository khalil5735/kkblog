# Docker容器开机自启设置

在Docker中，设置容器开机自启是一个常见的需求，以确保在主机重启后，容器能够自动恢复运行。Docker提供了几种方法来实现容器的自启动。

## 设置Docker服务开机自启

首先，确保Docker服务本身在系统启动时自动启动。这可以通过以下命令实现：

```
systemctl enable docker
```

这个命令会将Docker服务设置为开机时自动启动。

## 设置容器自动重启

对于容器自动重启，Docker提供了--restart 参数，可以在创建容器时指定，也可以在容器创建后修改。
创建容器时设置自启动
在使用docker run命令创建容器时，可以添加--restart参数来指定重启策略。例如：

```
docker run -d --restart=always --name your_container_name your_image
```

这里--restart=always表示无论容器的退出状态如何，都会重新启动容器。其他可用的重启策略包括：

- no：默认策略，容器退出时不重启。
- on-failure：仅在容器非正常退出（退出状态非0）时重启。
- on-failure:3：在容器非正常退出时重启，最多重启3次。
- unless-stopped：总是重启容器，除非容器已被停止。

## 修改已有容器的自启动设置

如果容器已经创建，但未设置自启动，可以使用docker update命令来修改容器的重启策略。例如：

```
docker update --restart=always container_id_or_name
```

这个命令会将指定的容器设置为开机自启。
取消容器的自启动设置
如果需要取消容器的自启动设置，可以将--restart参数设置为no：

```
docker update --restart=no container_id_or_name
```

## 批量设置容器自启动

如果需要为多个容器设置自启动，可以结合使用docker ps和docker update命令：

```
docker update --restart=always $(docker ps -aq)
```

这个命令会为所有运行中的容器设置自启动。
