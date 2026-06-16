# SpringMVC文件下载

## 基于 ResponseEntity

特点：简洁，但一次性加载到内存，大文件可能导致内存溢出。

### 方式 1：`ResponseEntity<byte[]>`

```java
@GetMapping("/download")
public ResponseEntity<byte[]> downloadFile() throws IOException {
    byte[] fileData = Files.readAllBytes(Paths.get("/path/to/file.pdf"));

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    // headers.add("Content-Disposition", "attachment;filename=" + file.getName());
    headers.setContentDisposition(ContentDisposition.attachment().filename(file.getName()).build());

    return new ResponseEntity<>(fileData, headers, HttpStatus.OK);
}
```

### 方式 2：`ResponseEntity<Resource>`

```java
@GetMapping("/download")
public ResponseEntity<Resource> downloadFile() {
    File file = new File("/path/to/file.pdf");
    Resource resource = new FileSystemResource(file);
	// File file = new File("/path/to/file.pdf");
	// FileInputStream inputStream = new FileInputStream(file);
    return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION,
                   "attachment; filename=\"document.pdf\"")
            .body(resource);
}
```

## 基于流的通用实现

特点：支持大文件，不易内存溢出

### void + HttpServletResponse

```java
@GetMapping("/download")
public void downloadFile(HttpServletResponse response) throws IOException {
    File file = new File("/path/to/file.pdf");

    // 设置响应头
    response.setContentType("application/pdf");
    response.setHeader("Content-Disposition",
                      "attachment; filename=\"document.pdf\"");

    // 文件拷贝到响应流
    Files.copy(file.toPath(), response.getOutputStream());

	//try (InputStream in = new FileInputStream(filePath);OutputStream out = response.getOutputStream()) {
	//	byte[] buffer = new byte[2048];
	//	int len;
	//	while ((len = in.read(buffer)) > 0) {
	//		out.write(buffer, 0, len);
	//	}
    //}
}
```

## 断点续传

待补充

## Content-Type的作用

`Content-Type`响应头的主要作用是**告诉浏览器服务器返回的内容类型**：

| Content-Type               | 浏览器行为        |
| -------------------------- | ----------------- |
| `application/pdf`          | 内嵌显示或下载PDF |
| `image/jpeg`               | 直接显示图片      |
| `text/plain`               | 显示文本内容      |
| `application/octet-stream` | 强制下载          |
