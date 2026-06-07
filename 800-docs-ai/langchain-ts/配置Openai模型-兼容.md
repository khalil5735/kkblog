- https://docs.langchain.com/oss/javascript/integrations/chat/openai

### 对接阿里百炼

```javascript
import { ChatOpenAI } from "@langchain/openai";

function createModel(modelName: string): ChatOpenAI {

  const apiKey = process.env.DASHSCOPE_API_KEY;

  const model: ChatOpenAI = new ChatOpenAI({
    model: modelName,
    apiKey: apiKey,
    configuration: {
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    },
  });
  return model;
}
```