
获取resource下文件的路径有以下几种方法：

1. 使用 ClassLoader.getResource() 方法：

```java
javaClassLoader classLoader = getClass().getClassLoader();URL resourceURL = classLoader.getResource("filename");String filePath = resourceURL.getPath();
```

2. 使用ClassLoader.getSystemResource()方法：

```java
javaURL resourceURL = ClassLoader.getSystemResource("filename");String filePath = resourceURL.getPath();
```

3. 使用Class.getResource()方法：

```java
javaURL resourceURL = getClass().getResource("filename");String filePath = resourceURL.getPath();
```

4. 使用Class.getResourceAsStream()方法：

```java
javaInputStream inputStream = getClass().getResourceAsStream("filename");
```

注意：使用该方法获得的是文件的输入流，而不是文件路径。

其中， "filename" 是 resource 文件夹下的相对路径。如果文件在子文件夹中，则需要指定子文件夹的相对路径，如 "subfolder/filename"。