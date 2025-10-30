# 03 - Batch Invocation

Demonstration of LangChain's batch invocation feature - processing multiple requests in parallel with automatic concurrency management.

## Overview

Instead of invoking the model multiple times sequentially, batch invocation sends multiple requests in parallel, significantly improving performance for processing multiple inputs.

## What It Does

Input: Multiple user messages (one per line)

Output: AI responses for all messages processed together in a batch

## Run It

```bash
node 03-BatchInvocation.mjs
```

## Example

```bash
🔷 BATCH INVOCATION DEMO
========================
Enter multiple messages (one per line)
Type "done" when finished to process all at once

Message 1: What is the capital of France?
Message 2: What is 2 + 2?
Message 3: Name a planet
Message 4: done

📦 Processing 3 messages in batch...

════════════════════════════════════════════════════════════
📋 BATCH RESULTS
════════════════════════════════════════════════════════════

1. Question: What is the capital of France?
   Answer: The capital of France is Paris.

2. Question: What is 2 + 2?
   Answer: 2 + 2 equals 4.

3. Question: Name a planet
   Answer: Earth is a planet.

════════════════════════════════════════════════════════════
```

## Key LangChain Features

### 1. Prepare Batch Inputs

```javascript
const batchInputs = messages.map(msg => [
  new SystemMessage("You are a helpful AI assistant."),
  new HumanMessage(msg)
]);
```

**Benefits:**
- Consistent message format across all providers
- Easy to prepare multiple conversations

### 2. Batch Invocation

```javascript
const responses = await model.batch(batchInputs);
```

**Benefits:**
- **Parallel Processing** - All requests sent at once
- **Automatic Concurrency** - LangChain manages concurrent requests
- **Rate Limit Handling** - Respects API rate limits automatically
- **Same API** - Works across all providers

### 3. Process Results

```javascript
responses.forEach((response, index) => {
  console.log(`Question: ${messages[index]}`);
  console.log(`Answer: ${response.content}`);
});
```

**Benefits:**
- Responses maintain order
- Each response is a full AIMessage object
- Access to metadata (tokens, timing, etc.)

## Performance Comparison

### Sequential Invocation (Without Batch)
```javascript
// Takes ~15 seconds for 3 requests (5s each)
for (const input of inputs) {
  const response = await model.invoke(input);  // Wait for each
}
```

### Batch Invocation (With Batch)
```javascript
// Takes ~5 seconds for 3 requests (parallel)
const responses = await model.batch(inputs);  // All at once
```

**3x faster!** The more requests, the bigger the improvement.

## Use Cases

**Batch invocation is perfect for:**
- Processing multiple user inputs
- Analyzing multiple documents
- Generating multiple variations
- Running the same prompt with different parameters
- Bulk data processing

**Single invocation is better for:**
- Interactive chat (one message at a time)
- Streaming responses
- When you need immediate feedback

## Concurrency Management

LangChain automatically:
- **Manages concurrent requests** - Optimal parallelism
- **Respects rate limits** - Won't exceed API quotas
- **Handles errors** - Retries failed requests
- **Maintains order** - Results match input order

You don't need to worry about any of this!

## Tips

- **Enter as many messages as you want** - Type as many as you need before typing "done"
- **Mix question types** - Factual, creative, analytical, etc.
- **Watch the speed** - Notice how fast batch processing is
- **Check the order** - Responses match input order

## Related Examples

- **01** - Simple model invocation
- **02** - Model streaming
- **03** (this file) - Batch invocation
- **04** - Structured output

This demonstrates LangChain's ability to efficiently handle multiple requests with automatic parallelization and concurrency management.

