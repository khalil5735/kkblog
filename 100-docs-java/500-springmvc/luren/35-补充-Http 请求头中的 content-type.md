> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [itsoku.com](http://itsoku.com/course/6/199)

## 目录

1. 前言

---

现在搞前端的不学好 http 有关的知识已经不行啦～笔者也是后知后觉，在搞 node 的时候意识到网络方面的薄弱，开始学起 http 相关知识。这一篇是非常基础的讲解，适合入门人员掌握 content-type 的知识和有经验的人员查阅。可以说，弄懂了 content-type，你才能在学习 http 的道路上走的更加顺畅，让我们满怀激情的开始吧～～

2. Http 请求头中的 content-type

---

### 2.1 认识 content-type

要学习 content-type, 必须事先知道它到底是什么，是干什么用的。

HTTP 协议（RFC2616）采用了请求 / 响应模型。客户端向服务器发送一个请求，请求头包含请求的方法、URI、协议版本、以及包含请求修饰符、客户信息和内容的类似于 MIME 的消息结构。服务器以一个状态行作为响应，相应的内容包括消息协议的版本，成功或者错误编码加上包含服务器信息、实体元信息以 及可能的实体内容。

通常 HTTP 消息由一个起始行，一个或者多个头域，一个只是头域结束的空行和可选的消息体组成。  
HTTP 的头域包括通用头，请求头，响应头和实体头四个部分。每个头域由一个域名，冒号（:）和域值三部分组成。域名是大小写无关的，域值前可以添加任何数量的空格符，头域可以被扩展为多行，在每行开始处，使用至少一个空格或制表符。

请求消息和响应消息都可以包含实体信息，实体信息一般由实体头域和实体组成。实体头域包含关于实体的原信息，实体头包括 Allow、Content- Base、Content-Encoding、Content-Language、 Content-Length、Content-Location、Content-MD5、Content-Range、Content-Type、 Etag、Expires、Last-Modified、extension-header。

Content-Type 是返回消息中非常重要的内容，表示后面的文档属于什么 MIME 类型。Content-Type: [type]/[subtype]; parameter。例如最常见的就是 text/html，它的意思是说返回的内容是文本类型，这个文本又是 HTML 格式的。原则上浏览器会根据 Content-Type 来决定如何显示返回的消息体内容。

### 2.2 Content-type 与 Accept

（1）Accept 属于请求头， Content-Type 属于实体头。

Http 报头分为通用报头，请求报头，响应报头和实体报头。

请求方的 http 报头结构：通用报头 | 请求报头 | 实体报头

响应方的 http 报头结构：通用报头 | 响应报头 | 实体报头

（2）Accept 代表发送端（客户端）希望接受的数据类型。

比如：Accept：text/xml;

代表客户端希望接受的数据类型是 xml 类型

Content-Type 代表发送端（客户端 | 服务器）发送的实体数据的数据类型。

比如：Content-Type：text/html;

代表发送端发送的数据格式是 html。

二者合起来

Accept:text/xml

Content-Type:text/html

即代表希望接受的数据类型是 xml 格式，本次请求发送的数据的数据格式是 html。

### 2.3 content-type 速查

更全面的请访问：`https://www.runoob.com/http/http-content-type.html`

常见的媒体格式类型如下：

```
text/html ： HTML格式
text/plain ：纯文本格式
text/xml ：  XML格式
image/gif ：gif图片格式
image/jpeg ：jpg图片格式
image/png：png图片格式

```

以 application 开头的媒体格式类型：

```
application/xhtml+xml ：XHTML格式
application/xml     ： XML数据格式
application/atom+xml  ：Atom XML聚合格式
application/json    ： JSON数据格式
application/pdf       ：pdf格式
application/msword  ： Word文档格式
application/octet-stream ： 二进制流数据（如常见的文件下载）
application/x-www-form-urlencoded ： <form encType=””>中默认的encType，form表单数据被编码为key/value格式发送到服务器（表单默认的提交数据的格式）

```

以 audio 开头的常见媒体格式文件：

```
audio/x-wav : wav文件
audio/x-ms-wma : wma 文件
audio/mp3 : mp3文件

```

以 video 开头的常见媒体格式文件：

```
video/x-ms-wmv : wmv文件
video/mpeg4 : mp4文件
video/avi : avi文件

```

另外一种常见的媒体格式是上传文件之时使用的：

```
multipart/form-data ： 需要在表单中进行文件上传时，就需要使用该格式
```

### 2.4 常见的 content-type 讲解

#### （1）application/x-www-form-urlencoded

这应该是最常见的 POST 提交数据的方式了。浏览器的原生 form 表单，如果不设置 enctype 属性，那么最终就会以 application/x-www-form-urlencoded 方式提交数据。请求类似于下面这样（无关的请求头在本文中都省略掉了）：

```
POST http://www.example.com HTTP/1.1
Content-Type: application/x-www-form-urlencoded;charset=utf-8
title=test&sub%5B%5D=1&sub%5B%5D=2&sub%5B%5D=3

```

首先，Content-Type 被指定为 application/x-www-form-urlencoded；  
其次，**提交的数据按照 key1=val1&key2=val2 的方式进行编码，key 和 val 都进行了 URL 转码。**大部分服务端语言都对这种方式有很好的支持。

很多时候，我们用 Ajax 提交数据时，也是使用这种方式。例如 JQuery 和 QWrap 的 Ajax，Content-Type 默认值都是「application/x-www-form-urlencoded;charset=utf-8」。

#### （2）multipart/form-data

这又是一个常见的 POST 数据提交的方式。我们使用表单上传文件时，必须让 form 的 enctyped 等于这个值。

客户端 form 标签：

```
<form action="url" enctype="multipart/form-data" method="post"></form>
```

直接来看一个生成的请求示例：

```
POST http://www.example.com HTTP/1.1
Content-Type:multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA
------WebKitFormBoundaryrGKCBY7qhFd3TrwA
Content-Disposition: form-data;
title
------WebKitFormBoundaryrGKCBY7qhFd3TrwA
Content-Disposition: form-data;
Content-Type: image/png
PNG ... content of chrome.png ...
------WebKitFormBoundaryrGKCBY7qhFd3TrwA--

```

首先**生成了一个 boundary 用于分割不同的字段**，为了避免与正文内容重复，boundary 很长很复杂。  
然后 Content-Type 里指明了数据是以 mutipart/form-data 来编码，本次请求的 boundary 是什么内容。消息主体里按照字段个数又分为多个结构类似的部分，每部分都是以 –boundary 开始，紧接着内容描述信息，然后是回车，最后是字段具体内容（文本或二进制）。如果传输的是文件，还要包含文件名和文件类型信息。消息主体最后以 –boundary– 标示结束。关于 mutipart/form-data 的详细定义，请前往 rfc1867 查看。

这种方式一般用来上传文件，各大服务端语言对它也有着良好的支持。

上面提到的这两种 POST 数据的方式，都是浏览器原生支持的，而且现阶段原生 form 表单也只支持这两种方式。但是随着越来越多的 Web 站点，尤其是 WebApp，全部使用 Ajax 进行数据交互之后，我们完全可以定义新的数据提交方式，给开发带来更多便利。

#### （3）application/json

application/json 这个 Content-Type 作为响应头大家肯定不陌生。实际上，现在越来越多的人把它作为请求头，用来告诉服务端消息主体是序列化后的 JSON 字符串。由于 JSON 规范的流行，除了低版本 IE 之外的各大浏览器都原生支持 JSON.stringify，服务端语言也都有处理 JSON 的函数，使用 JSON 不会遇上什么麻烦。

JSON 格式支持比键值对复杂得多的结构化数据，这一点也很有用。记得我几年前做一个项目时，需要提交的数据层次非常深，我就是把数据 JSON 序列化之后来提交的。不过当时我是把 JSON 字符串作为 val，仍然放在键值对里，以 x-www-form-urlencoded 方式提交。

Google 的 AngularJS 中的 Ajax 功能，默认就是提交 JSON 字符串。例如下面这段代码：

```
var data = {'title':'test', 'sub' : [1,2,3]};
$http.post(url, data).success(function(result) {
    ...
});

```

最终发送的请求是：

```
POST http://www.example.com HTTP/1.1
Content-Type: application/json;charset=utf-8
{"title":"test","sub":[1,2,3]}

```

这种方案，可以方便的提交复杂的结构化数据，特别适合 RESTful 的接口。各大抓包工具如 Chrome 自带的开发者工具、Firebug、Fiddler，都会以树形结构展示 JSON 数据，非常友好。但也有些服务端语言还没有支持这种方式，例如 php 就无法通过 $\_POST 对象从上面的请求中获得内容。这时候，需要自己动手处理下：在请求头中 Content-Type 为 application/json 时，从 php://input 里获得原始输入流，再 json_decode 成对象。一些 php 框架已经开始这么做了。

#### （4）text/xml

它是一种使用 HTTP 作为传输协议，XML 作为编码方式的远程调用规范。典型的 XML-RPC 请求是这样的：

```http
POST http://www.example.com HTTP/1.1
Content-Type: text/xml
<?xml version="1.0"?>
<methodCall>
    <methodName>examples.getStateName</methodName>
    <params>
        <param>
            <value><i4>41</i4></value>
        </param>
    </params>
</methodCall>

```

XML-RPC 协议简单、功能够用，各种语言的实现都有。它的使用也很广泛，如 WordPress 的 XML-RPC Api，搜索引擎的 ping 服务等等。JavaScript 中，也有现成的库支持以这种方式进行数据交互，能很好的支持已有的 XML-RPC 服务。不过，我个人觉得 XML 结构还是过于臃肿，一般场景用 JSON 会更灵活方便。

3. HTTP 响应头中的 content-type

---

Content-Type（内容类型），一般是指网页中存在的 Content-Type，用于定义网络文件的类型和网页的编码，决定浏览器将以什么形式、什么编码读取这个文件，这就是经常看到一些 PHP 网页点击的结果却是下载一个文件或一张图片的原因。

Content-Type 标头告诉客户端实际返回的内容的内容类型。

语法格式：

```
Content-Type: text/html; charset=utf-8
Content-Type: multipart/form-data; boundary=something

```

实例：

![image-20240703211831631](./assets/image-20240703211831631.png)

常见的媒体格式类型如下：

- text/html ： HTML 格式
- text/plain ：纯文本格式
- text/xml ： XML 格式
- image/gif ：gif 图片格式
- image/jpeg ：jpg 图片格式
- image/png：png 图片格式

以 application 开头的媒体格式类型：

- application/xhtml+xml ：XHTML 格式
- application/xml： XML 数据格式
- application/atom+xml ：Atom XML 聚合格式
- application/json： JSON 数据格式
- application/pdf：pdf 格式
- application/msword ： Word 文档格式
- application/octet-stream ： 二进制流数据（如常见的文件下载）
- application/x-www-form-urlencoded ：

  中默认的 encType，form 表单数据被编码为 key/value 格式发送到服务器（表单默认的提交数据的格式）

另外一种常见的媒体格式是上传文件之时使用的：

- multipart/form-data ： 需要在表单中进行文件上传时，就需要使用该格式

4. HTTP content-type 对照表

带补充
