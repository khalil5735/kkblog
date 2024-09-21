## JDK安装

步骤一：下载解压

下载地址：https://adoptopenjdk.net/

可下载zip解压版



步骤二：JDK 全局环境配置

- 新建系统变量：

变量名： `JAVA_HOME`

变量值：jdk解压后路径。示例：`D:\jdk\jdk8u312-b07`

- 编辑系统变量 `Path`

新建项：

（1）`%JAVA_HOME%\bin`

（2）`%JAVA_HOME%\jre\bin`



步骤三：检查全局 java jdk版本

```powershell
java -version
```



参考文档：https://blog.csdn.net/shitouxiaocheng01/article/details/78729805