# @RequestParam和@RequestPart

`@RequestPart` 主要用来处理content-type为 multipart/form-data 或 multipart/mixed stream 发起的请求,可以获取请求中的参数,包括普通文本、文件或复杂对象比如json、xml等,针对json等复杂对象,需要明确对应的content-type,例如:
![alt text](./assets/image.png)
发出来的请求头:

```plain
Content-Type: multipart/form-data; boundary=xxxxxxxxxx

----xxxxxxxxxx
Content-Disposition: form-data; name="jsonData"
Content-Type: applicatoin/json
{"name":"jack", "age":25}
```

`@RequestParam` 默认主要来处理 query parameters, form data,and parts in multipart requests, 且是 key-value 键值对这种文本

它们最大的不同是，当请求方法的请求参数类型不再是String类型的时候。

- `@RequestParam` 适用于`name-value`, "String" 类型的请求域
- `@RequestPart` 适用于复杂的请求域（像JSON，XML）例如：`key = user`, `value = {"name":"aaa","xx":"xx"}`。