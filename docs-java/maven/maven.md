# 安装配置Maven



[Maven配置教程-CSDN博客](https://blog.csdn.net/huo920/article/details/82082403#2__41)

## 国内几个Maven镜像仓

```xml
 	   <mirror>
            <id>alimaven</id>
            <name>aliyun maven</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
            <mirrorOf>central</mirrorOf>
        </mirror>
        <mirror>
          <id>huaweicloud</id>
          <name>huaweicloud maven</name>
          <mirrorOf>*</mirrorOf>
          <url>https://mirrors.huaweicloud.com/repository/maven/</url>
        </mirror>
        <mirror>
          <id>nexus-163</id>
          <mirrorOf>*</mirrorOf>
          <name>Nexus 163</name>
          <url>http://mirrors.163.com/maven/repository/maven-public/</url>
        </mirror>
        <mirror>
          <id>nexus-tencentyun</id>
          <mirrorOf>*</mirrorOf>
          <name>Nexus tencentyun</name>
          <url>http://mirrors.cloud.tencent.com/nexus/repository/maven-public/</url>
        </mirror>   

```





# 常见问题

## 将本地jar安装到maven本地仓库

1. 找到并下载该包到本地，可以任意找个位置保存，例如保存在桌面

2. 安装该jar包到maven的本地仓库中，主要用到maven的命令（注意：这个命令不能换行，中间用空格来分割的）：

   ```
   安装指定文件到本地仓库命令：mvn install:install-file
   -DgroupId=<groupId>       : 设置项目代码的包名(一般用组织名)
   -DartifactId=<artifactId> : 设置项目名或模块名 
   -Dversion=1.0.0           : 版本号
   -Dpackaging=jar           : 什么类型的文件(jar包)
   -Dfile=<myfile.jar>       : 指定jar文件路径与文件名(同目录只需文件名)
   安装命令实例：
   mvn install:install-file -DgroupId=com.baidu -DartifactId=ueditor -Dversion=1.0.0 -Dpackaging=jar -Dfile=ueditor-1.1.2.jar
   ```

3. 在 cdm 命令窗口下执行2中命令,直到出现 bulid success

## 在pom中引入本地jar文件

```xml
     <dependency>
            <groupId>com.aliyun.alicom</groupId>
            <artifactId>alicom-mns-receive-sdk</artifactId>
            <version>0.0.1-SNAPSHOT</version>
         	<!--使用本地jar-->  
            <scope>system</scope>
         	<!--本地jar路径-->
            <systemPath>${project.basedir}/src/main/resources/lib/alicom-mns-receive-sdk-1.0.0.jar</systemPath>
        </dependency>
        <dependency>
            <groupId>com.aliyun.mns</groupId>
            <artifactId>aliyun-sdk-mns</artifactId>
            <version>1.1.8</version>
            <!--使用本地jar-->  
            <scope>system</scope>
            <!--本地jar路径-->
            <systemPath>${project.basedir}/src/main/resources/lib/aliyun-sdk-mns-1.1.8.jar</systemPath>
        </dependency>
```

```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                  <!--打包时，包含本地jar-->  
                    <includeSystemScope>true</includeSystemScope> 
                </configuration>
            </plugin>
        </plugins>
    </build>
```



## maven下载不到源码：Cannot download sources Sources not found for:xxx

https://www.cnblogs.com/gordonMlxg/p/16866435.html



## 部署springboot项目时 打包成jar时包中html,js,css文件缺失 - Draymonder - 博客园 (cnblogs.com)
[部署springboot项目时 打包成jar时包中html,js,css文件缺失 - Draymonder - 博客园 (cnblogs.com)](https://www.cnblogs.com/draymonder/p/10683675.html)



# Maven的声明周期(Lifecycle )和命令(Phase)
[Maven的声明周期(Lifecycle )和命令(Phase)](https://www.cnblogs.com/zhaiqianfeng/p/4620138.html)



## 如何将maven依赖项打进jar包，将一个完整的项目打进jar包
[如何将maven依赖项打进jar包，将一个完整的项目打进jar包](https://www.cnblogs.com/chuijingjing/p/10519713.html)



# 查找maven中任意一个jar包被哪个包依赖

[查找maven中任意一个jar包被哪个包依赖_查看 jar是哪个包引用的-CSDN博客](https://blog.csdn.net/qq1332479771/article/details/89481015)

