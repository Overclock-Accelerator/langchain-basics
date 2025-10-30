# 08 - Book Recommender with Tool Call Limiter

The same book recommender agent as example 07, but with middleware that limits tool calls to prevent runaway agent loops.

## Overview

This is identical to the 07-BookRecommender example, but adds the `toolCallLimitMiddleware` to demonstrate how to control agent behavior and prevent excessive tool calling. This is important for production applications to control costs and prevent infinite loops.

## What's Different

The only difference from example 07 is this middleware:

```javascript
// Create middleware to limit tool calls to 2 per invocation
const toolLimiter = toolCallLimitMiddleware({
  runLimit: 2,  // Maximum 2 tool calls per single agent invocation
  exitBehavior: "end"  // Gracefully terminate when limit is reached
});

const agent = createAgent({
  model: "openai:gpt-4o-mini",
  tools: [getBookInfo, findRecommendations, summarizeRecommendations],
  middleware: [toolLimiter],  // Add middleware here
  systemPrompt: `...`
});
```

## Why Tool Limiting Matters

### The Problem

Without limits, agents can:
- Make excessive API calls (expensive!)
- Get stuck in loops
- Take too long to respond
- Use all your API quota

### The Solution

`toolCallLimitMiddleware` provides:
- **Cost Control** - Cap maximum tool calls
- **Time Limits** - Prevent long-running agents
- **Graceful Exit** - Stop cleanly when limit reached
- **Predictable Behavior** - Consistent response times

## Run It

```bash
node 08-BookRecommenderWithLimiter.mjs
```

## Example Behavior

### Within Limit (2 tools)

```
You: Recommend a book for me

🔧 Tools Used:
   1. find_recommendations
   2. summarize_recommendations

📚 Assistant:
Based on your interest in book recommendations, I've found some excellent 
options for you...
```

✅ **Works fine** - Uses 2 tools (within limit)

### Would Exceed Limit

If the agent tried to call a 3rd tool, the middleware would:
1. Stop execution
2. Return gracefully with current results
3. Not throw an error (with `exitBehavior: "end"`)

## Middleware Configuration

### Run Limit

```javascript
runLimit: 2  // Maximum tool calls per invocation
```

Options:
- `1` - Only one tool call allowed
- `2` - Two tools (good for find → summarize pattern)
- `5` - More flexible but higher cost
- `10` - Very flexible, use for complex workflows

### Exit Behavior

```javascript
exitBehavior: "end"  // Graceful termination
```

Options:
- `"end"` - Stop gracefully, return what we have
- `"error"` - Throw error when limit reached

## Use Cases

### Cost Control
Set limits based on your budget:
- Free tier: `runLimit: 1`
- Development: `runLimit: 3`
- Production: `runLimit: 5`

### Performance
Faster response times with lower limits:
- Chat apps: `runLimit: 2` (quick responses)
- Analysis: `runLimit: 10` (thorough work)

### Safety
Prevent runaway agents:
- Always set a reasonable limit
- Monitor tool call patterns
- Adjust based on usage

## Technical Details

### Import

```javascript
import { createAgent, tool, toolCallLimitMiddleware } from "langchain";
```

### Middleware Array

You can add multiple middleware:

```javascript
const agent = createAgent({
  model: "openai:gpt-4o-mini",
  tools: [...],
  middleware: [
    toolLimiter,
    otherMiddleware,  // Could add more
  ],
});
```

Middleware runs in order before tool execution.

## Monitoring

Check if limit was reached:

```javascript
const response = await agent.invoke({ messages: [...] });

// Count actual tool calls
let toolCallCount = 0;
for (const message of response.messages) {
  if (message.tool_calls) {
    toolCallCount += message.tool_calls.length;
  }
}

if (toolCallCount >= 2) {
  console.log('Warning: Hit tool call limit');
}
```

## What This Demonstrates

This example shows:
1. **Middleware Pattern** - How to add behavior to agents
2. **Resource Control** - Limiting expensive operations
3. **Safety Features** - Preventing runaway loops
4. **Production Patterns** - Real-world agent constraints

## Comparison: 07 vs 08

| Feature | 07-BookRecommender | 08-BookRecommenderWithLimiter |
|---------|-------------------|-------------------------------|
| Tools | 3 tools | 3 tools (same) |
| Functionality | Full | Full (same) |
| Tool Limit | Unlimited | 2 calls max |
| Use Case | Development | Production |
| Cost Control | No | Yes |

## When to Use Limits

### Always Use Limits For:
- Production applications
- User-facing apps
- Cost-sensitive projects
- Free tier API keys

### Skip Limits For:
- Development/testing
- Trusted internal tools
- When you need maximum flexibility
- One-off scripts

## Requirements

- Node.js 18+
- OpenAI API key in `.env.local`
- `storedata.json` file with book catalog
- LangChain packages installed

## Exit

Type `exit` or `quit` to stop the application.

## Related Examples

- **05** - Simple single-tool agent
- **06** - Multi-tool agent (automated driving)
- **07** - Book recommender without limits
- **08** (this file) - Book recommender WITH limits

This demonstrates essential production practices for LangChain agents - always control resource usage in real applications!


