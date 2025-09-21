nohup 英文全称 no hang up（不挂起），用于在系统后台不挂断地运行命令，退出终端不会影响程序的运行。

nohup 命令，在默认情况下（非重定向时），会输出一个名叫 nohup.out 的文件到当前目录下，如果当前目录的 nohup.out 文件不可写，输出重定向到 $HOME/nohup.out 文件中。

nohup 命令的语法格式如下：

```bash
nohup 命令 [参数] [命令]
```

nohup 命令的例子如下：

1. 运行命令并输出到 nohup.out（默认） 文件中：

```bash
nohup 命令 &
```

2. 运行命令并输出到标准输出到指定文件 log.txt 文件中（历史输出不保留）：

```bash
nohup 命令 > log.txt &
# 注意错误输出依旧在nohup.out 文件中
```

3. 运行命令并追加标准输出到 log.txt 文件中，历史输出保留：

```bash
nohup 命令 >> log.txt &
# 注意错误输出也追加到log.txt 文件中
```

4、运行命令标准输出到指定文件 nohup.out 文件中,并错误输出到指定文件 error.log 文件中：

```bash
nohup 命令 > nohup.out 2> error.log &
```

5、运行命令标准输出和错误输出都输出到 log.txt 文件中：

```bash
nohup 命令 > log.txt 2>&1 &
```

6、运行命令不输出到任何文件：

```bash
nohup 命令 > /dev/null 2>&1 &
```

比较：
|命令| 标准输出| 标准错误|
|:--:|:--:|:--:|
|nohup 命令 > log.txt & |写入 log.txt |写入 nohup.out（或终端）|
|nohup 命令 > log.txt 2>&1 &| 写入 log.txt| 写入 log.txt|
|nohup 命令 &| 写入 nohup.out| 写入 nohup.out|

7、结束nohup启动的进程
```bash
# 启动进程
nohup /path/to/train.py > /home/user/nohup.out 2>&1 &

# 先查找进程 ID
ps aux | grep train.py

# 杀掉进程（假设 PID 是 12345）
kill 12345

# 强制杀掉（必要时）
kill -9 12345
```