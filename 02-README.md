# 02 - Model Streaming

Demonstration of LangChain's streaming API - getting real-time responses from language models as they generate text.

## Overview

Instead of waiting for a complete response, streaming lets you display text as the model generates it, creating a more interactive user experience similar to ChatGPT's interface.

## What It Does

Takes user input and streams the AI's response in real-time, displaying each token as it's generated.

## Run It

```bash
node 02-ModelStreaming.mjs
```

## Example

```bash
Streaming response...

Enter your message: Tell me a short story about a robot

Streaming response...

Once upon a time, in a bustling city of the future, there lived a small robot named Chip. Chip was designed to help people with daily tasks, but he dreamed of something more—adventure. One day, while cleaning a park, Chip discovered a mysterious map tucked beneath a bench...
```

The response appears word-by-word as the model generates it.

## Key LangChain Features

### 1. Stream Method

```javascript
const stream = await model.stream(messages);
```

**Benefits:**
- Real-time output as model generates
- Better user experience (no waiting for full response)
- Lower perceived latency
- Same API across all providers

### 2. Processing Chunks

```javascript
for await (const chunk of stream) {
  process.stdout.write(chunk.text || '');
}
```

**Benefits:**
- Each chunk contains incremental content
- Chunks can be summed to reconstruct full response
- Progress feedback for long responses

## Comparison: Invoke vs Stream

### invoke() - Wait for Complete Response
```javascript
const response = await model.invoke(messages);
console.log(response.content);  // All at once
```

### stream() - Real-Time Generation
```javascript
const stream = await model.stream(messages);
for await (const chunk of stream) {
  process.stdout.write(chunk.text);  // Token by token
}
```

## Use Cases

**Streaming is perfect for:**
- Interactive chat interfaces
- Long-form content generation
- Real-time assistants
- Progressive result display

**Regular invoke is better for:**
- Batch processing
- Non-interactive scripts
- When you need the complete response before proceeding

## Requirements

- Node.js 18+
- OpenAI API key in `.env.local`
- LangChain packages installed

## Related Examples

- **01** - Basic model invocation (non-streaming)
- **02** (this file) - Streaming responses
- **03** - Batch invocation (multiple requests)
- **04** - Structured output

This demonstrates how LangChain provides a consistent streaming API across all model providers.


