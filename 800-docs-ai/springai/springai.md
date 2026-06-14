# SpringAI

## OpenAI SpringAi 兼容模式开启 think

```java
OpenAiApi openAiApi = OpenAiApi.builder()
        .apiKey("sk-xxx")
        .baseUrl("")
        .build();
OpenAiChatOptions defaultOptions = OpenAiChatOptions.builder().model("qwen3.5-32b"))
        .extraBody(Map.of("chat_template_kwargs", Map.of("enable_thinking", true))) // 开启 think
        .build();

return OpenAiChatModel.builder()
        .openAiApi(openAiApi)
        .defaultOptions(defaultOptions)
        .build();
```

## ChatClient 支持流式输出 AI ToolCall 消息

```java
ToolCallAdvisor advisor = ToolCallAdvisor.builder()
    .streamToolCallResponses(true)  // 关键配置：开启流式工具调用响应，支持版本 1.1.3 以上
    .build();

ChatClient chatClient = ChatClient.builder(chatModel)
    .defaultAdvisors(advisor)
    .build();
```

解析 ToolCall

```java
 // 解析 ToolCall
ChatResponse chatResponse = chatClientResponse.chatResponse();
Generation generation = chatResponse.getResult();
AssistantMessage assistantMessage = generation.getOutput();
if (assistantMessage.hasToolCalls()) {
    List<AssistantMessage.ToolCall> toolCalls = assistantMessage.getToolCalls();
    toolCalls.forEach(toolCall -> {
        Map<String, String> map = Map.of("id", toolCall.id(), "name", toolCall.name(), "type", toolCall.type(), "args", toolCall.arguments());
        System.out.println(map);
    });
}
```

## Memory

### Jdbc Memory Sql 地址

https://github.com/spring-projects/spring-ai/blob/main/memory/repository/spring-ai-model-chat-memory-repository-jdbc/src/main/resources/org/springframework/ai/chat/memory/repository/jdbc

PG数据库

```sql
CREATE TABLE IF NOT EXISTS SPRING_AI_CHAT_MEMORY
(
    conversation_id VARCHAR(36) NOT NULL,
    content         TEXT        NOT NULL,
    type            VARCHAR(10) NOT NULL CHECK (type IN ('USER', 'ASSISTANT', 'SYSTEM', 'TOOL')),
    "timestamp"     TIMESTAMP   NOT NULL
);

CREATE INDEX IF NOT EXISTS SPRING_AI_CHAT_MEMORY_CONVERSATION_ID_TIMESTAMP_IDX
    ON SPRING_AI_CHAT_MEMORY (conversation_id, "timestamp");
```

MySQL数据库

```sql

```
