# SSE

## 什么是 SSE？

Server-Sent Events（SSE）是一种用于实现服务器向客户端实时推送数据的 Web 技术。与传统的轮询和长轮询相比，SSE 提供了更高效和实时的数据推送机制。

SSE 基于 HTTP 协议的形式发送给客户端。客户端通过建立持久的 HTTP 连接，并监听事件流，可以实时接收服务器推送的数据。

SSE 的主要特点包括：

1. 简单易用：SSE 使用基于文本的数据格式，如纯文本、JSON 等，使得数据的发送和解析都相对简单。
2. 单向通信：SSE 支持服务器向客户端的单向通信，服务器可以主动推送数据给客户端，而客户端只能接收数据。
3. 实时性：SSE 建立长时间的连接，使得服务器可以实时地将数据推送给客户端，而无需客户端频繁地发起请求。

## SSE 与 WebSocket 的比较

WebSocket 是另一种用于实现实时双向通信的 Web 技术，它与 SSE 在某些方面有所不同。下面是 SSE 和 WebSocket 之间的比较：

1. 数据推送方向：SSE 是服务器向客户端的单向通信，服务器可以主动推送数据给客户端。而 WebSocket 是双向通信，允许服务器和客户端之间进行实时的双向数据交换。
2. 连接建立：SSE 使用基于 HTTP 的长连接，通过普通的 HTTP 请求和响应来建立连接，从而实现数据的实时推送。WebSocket 使用自定义的协议，通过建立 WebSocket 连接来实现双向通信。
3. 兼容性：由于 SSE 基于 HTTP 协议，它可以在大多数现代浏览器中使用，并且不需要额外的协议升级。WebSocket 在绝大多数现代浏览器中也得到了支持，但在某些特殊的网络环境下可能会遇到问题。
4. 适用场景：SSE 适用于服务器向客户端实时推送数据的场景，如股票价格更新、新闻实时推送等。WebSocket 适用于需要实时双向通信的场景，如聊天应用、多人协同编辑等。

根据具体的业务需求和场景，选择 SSE 或 WebSocket 取决于您的实际需求。如果您只需要服务器向客户端单向推送数据，并且希望保持简单易用和兼容性好，那么 SSE 是一个不错的选择。如果您需要实现双向通信，或者需要更高级的功能和控制，那么 WebSocket 可能更适合您的需求。

## 进行 SSE 实时数据推送时的注意点

1. 异步处理：由于 SSE 是基于长连接的机制，推送数据的过程是一个长时间的操作。为了不阻塞服务器线程，推荐使用异步方式处理 SSE 请求。您可以在控制器方法中使用@Async 注解或使用 CompletableFuture 等异步编程方式。
2. 超时处理：SSE 连接可能会因为网络中断、客户端关闭等原因而发生超时。为了避免无效的连接一直保持在服务器端，您可以设置超时时间并处理连接超时的情况。可以使用 SseEmitter 对象的 setTimeout()方法设置超时时间，并通过 onTimeout()方法处理连接超时的逻辑。
3. 异常处理：在实际应用中，可能会出现一些异常情况，如网络异常、推送数据失败等。您可以使用 SseEmitter 对象的 completeWithError()方法将异常信息发送给客户端，并在客户端通过 eventSource.onerror 事件进行处理。
4. 内存管理：使用 SseEmitter 时需要注意内存管理，特别是在大量并发连接的情况下。当客户端断开连接时，务必及时释放 SseEmitter 对象，避免造成资源泄漏和内存溢出。
5. 并发性能：SSE 的并发连接数可能会对服务器的性能造成影响。如果需要处理大量的并发连接，可以考虑使用线程池或其他异步处理方式，以充分利用服务器资源。
6. 客户端兼容性：虽然大多数现代浏览器都支持 SSE，但仍然有一些旧版本的浏览器不支持。在使用 SSE 时，要确保您的目标客户端支持 SSE，或者提供备用的实时数据推送机制。

这些注意点将有助于您正确和高效地使用 SseEmitter 进行 SSE 实时数据推送。根据具体的应用需求，您可以根据实际情况进行调整和优化。

## 使用 Spring MVC 实现 SSE 接口

前面我们提到 Spring 4.2 起就开始支持 SSE 规范，当时引入了 SseEmitter 类。下面是一个简单示例：

```java
@GetMapping("/stream-sse-mvc")
public SseEmitter streamSseMvc() {
    SseEmitter emitter = new SseEmitter();
    ExecutorService sseMvcExecutor = Executors.newSingleThreadExecutor();
    sseMvcExecutor.execute(() -> {
        try {
            for (int i = 0; true; i++) {
                SseEventBuilder event = SseEmitter.event()
                  .data("SSE MVC - " + LocalTime.now().toString())
                  .id(String.valueOf(i))
                  .name("sse event - mvc");
                emitter.send(event);
                Thread.sleep(1000);
            }
        } catch (Exception ex) {
            emitter.completeWithError(ex);
        }
    });
    return emitter;
}
```

在上面的代码中，我们创建了一个 SseEmitter 对象，并使用 ExecutorService 来异步发送数据。我们在一个无限循环中每秒发送一次数据，并在发生异常时调用 completeWithError()方法来处理异常。

## 使用 Spring WebFlux 实现 SSE 接口

Spring WebFlux 是 Spring 5 引入的响应式编程框架，它也支持 SSE。下面是一个使用 Spring WebFlux 实现 SSE 接口的示例：

```java
@GetMapping(value = "/stream-sse-webflux", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> streamSseWebflux() {
    return Flux.interval(Duration.ofSeconds(1))
      .map(sequence -> "SSE WebFlux - " + LocalTime.now().toString());
}
```

在上面的代码中，我们使用 Flux.interval()方法创建一个每秒发出一个序列号的 Flux 对象，并使用 map()方法将序列号转换为 SSE 事件。我们还指定了 produces 属性为 MediaType.TEXT_EVENT_STREAM_VALUE，以指示返回的数据类型为 SSE 事件流。

## Java Okhtt3 接收 SSE 事件

在 Java 客户端中，我们可以使用 Okh 来接收 SSE 事件：

```java
OkHttpClient.Builder builder = new OkHttpClient.Builder();
builder.connectTimeout(10, TimeUnit.SECONDS);
builder.readTimeout(0, TimeUnit.SECONDS);
builder.writeTimeout(10, TimeUnit.SECONDS);
OkHttpClient client = builder.build();

Request request = new Request.Builder()
  .url("http://localhost:8080/stream-sse-mvc")
  .header("Accept", "text/event-stream")
  .build();
client.newCall(request).enqueue(new Callback() {
    @Override
    public void onFailure(Call call, IOException e) {
        System.err.println("Error occurred: " + e.getMessage());
    }

    @Override
    public void onResponse(Call call, Response response) throws IOException {
        if (response.isSuccessful()) {
            BufferedSource source = response.body().source();
            while (!source.exhausted()) {
                String line = source.readUtf8Line();
                System.out.println("Received: " + line);
            }
        } else {
            System.err.println("Request failed: " + response.message());
        }
    }
});
```

在上面的代码中，我们创建了一个 OkHttpClient 对象，并使用 Request.Builder 来构建请求。我们使用 enqueue()方法异步发送请求，并在 onResponse()方法中处理响应数据。
在 onResponse()方法中，我们检查响应是否成功，并使用 BufferedSource 来读取响应体中的数据。我们使用 readUtf8Line()方法逐行读取数据，并在控制台中打印出来。

在 onFailure()方法中，我们处理请求失败的情况，并打印错误信息。

## Java webclient 接收 SSE 事件
在 Java WebClient 中，我们可以使用 WebClient 来接收 SSE 事件：

```java
WebClient webClient = WebClient.create("http://localhost:8080");
webClient.get()
  .uri("/stream-sse-mvc")
  .accept(MediaType.TEXT_EVENT_STREAM)
  .retrieve()
  .bodyToFlux(String.class)
  .subscribe(data -> {
      System.out.println("Received: " + data);
  }, error -> {
      System.err.println("Error occurred: " + error.getMessage());
  });
```
在上面的代码中，我们创建了一个 WebClient 对象，并使用 get()方法发送 GET 请求。我们使用 accept()方法指定请求的 Accept 头为 text/event-stream，以指示我们希望接收 SSE 事件。
我们使用 retrieve()方法获取响应，并使用 bodyToFlux()方法将响应体转换为 Flux<String> 对象。最后，我们使用 subscribe()方法订阅 Flux 对象，并在接收到数据时打印出来。
在发生错误时，我们使用 error 处理程序来处理错误。

## javaScript 客户端接收 SSE 事件

在客户端，我们可以使用 EventSource 对象来接收 SSE 事件：

```javascript
const eventSource = new EventSource("/stream-sse-mvc");
eventSource.onmessage = function (event) {
  console.log(event.data);
};
eventSource.onerror = function (event) {
  console.error("Error occurred:", event);
};
```

在上面的代码中，我们创建了一个 EventSource 对象，并指定了 SSE 接口的 URL。我们使用 onmessage 事件处理程序来接收服务器发送的消息，并在控制台中打印出来。
在发生错误时，我们使用 onerror 事件处理程序来处理错误。

## Axios 流式请求

Axios 流式请求是指在使用 Axios 发送 HTTP 请求时，能够以流的方式接收响应数据。这种方式适用于处理大文件下载、实时数据推送等场景。
流式请求允许我们在接收数据的同时进行处理，而不需要等待整个响应完成。这种方式可以提高性能，减少内存占用。
流式请求的实现主要依赖于 Axios 的 `responseType` 属性。通过将 `responseType` 设置为 `'stream'`，我们可以获取到一个可读流对象，从而实现流式处理。

axios 流式请求主要有两种写法:

### 创建流并 Pipe 到 Writable Stream

通过调用 axios() 方法发起请求，获取到响应对象后，监听 data 事件，然后 pipe 数据到一个 Writable Stream 中，如 fs.createWriteStream。

```javascript
const axios = require("axios");
const fs = require("fs");

const writer = fs.createWriteStream("example.txt");

axios({
  method: "get",
  url: "/example.txt",
  responseType: "stream",
}).then((response) => {
  response.data.pipe(writer);
});
```

### 手动监听 data 事件

通过调用 axios() 方法发起请求，获取到响应对象后，监听 data 事件，在事件回调中手动处理流数据：

```javascript
const axios = require("axios");

axios({
  method: "get",
  url: "/example.txt",
  responseType: "stream",
}).then((response) => {
  response.data.on("data", (chunk) => {
    // 处理流数据的逻辑
  });

  response.data.on("end", () => {
    // 数据接收完成的逻辑
  });
});
```

## 参考

- [Server-Sent Events 教程](https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)
- [SSE（Server-Sent Events）是什么？](https://zhuanlan.zhihu.com/p/634581294)
- [如何创建 Axios 流式请求](https://apifox.com/apiskills/how-to-create-axios-stream/)
