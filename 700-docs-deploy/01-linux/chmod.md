## 概述
Linux chmod（英文全拼：change mode）命令是控制用户对文件的权限的命令。

chmod (change mode) 是 Linux 系统中用于更改文件或目录权限的命令，它控制着文件所有者、所属组和其他用户对文件的访问权限。

只有文件所有者和超级用户可以修改文件或目录的权限。

## 使用
https://www.runoob.com/linux/linux-comm-chmod.html

## 常用示例
1. 创建一个文件并设置权限为 644：
```bash
chmod 644 test.txt
```
2. 递归设置目录权限为 755：
```bash
chmod -R 755 dir
```
3. 给所有者增加读写权限，给所属组增加执行权限，给其他用户添加读权限：
```bash
chmod u+rw,g+x,o+r test.txt
```
4. 删除所有者的读写权限，删除所属组的执行权限，删除其他用户的读权限：
```bash
chmod u-rw,g-x,o-r test.txt
```
5. 给所有人增加读写权限：
```bash
chmod a+rw test.txt
```
