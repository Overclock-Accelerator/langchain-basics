# 01 - Simple Model Invocation

A minimal demonstration of invoking the GPT-5-mini model with LangChain 1.0.

## Overview

This is the simplest possible LangChain application - it takes user input and invokes a model to get a response. No tools, no agents, just basic model invocation.

## Features

- **Simple Model Invocation** - Direct `model.invoke()` calls
- **Interactive Terminal** - Type messages and get responses
- **Response Metadata** - See token usage and model info
- **GPT-5-mini Model** - Uses the latest OpenAI model

## Usage

### Run the Application

```bash
node 01-ModelInvocation.mjs
```

### Example Interaction

```
🤖 GPT-5-MINI MODEL INVOCATION DEMO
===================================

Type your message and press Enter to get a response.
Type "exit" or "quit" to stop.

You: What is the capital of France?

🤖 Invoking model...

AI: The capital of France is Paris.

📊 Response Metadata:
   Model: gpt-5-mini
   Tokens Used: 28

────────────────────────────────────────────────────────────

You: Tell me a short joke

🤖 Invoking model...

AI: Why don't scientists trust atoms? Because they make up everything!

📊 Response Metadata:
   Model: gpt-5-mini
   Tokens Used: 35

────────────────────────────────────────────────────────────

You: exit

👋 Goodbye!
```

## Code Structure

### Model Initialization

```javascript
import { initChatModel } from "langchain";

const model = await initChatModel("openai:gpt-5-mini");
```

### Simple Invocation

```javascript
const response = await model.invoke(userInput);
console.log('AI:', response.content);
```

### Response Object

The response contains:
- `content` - The AI's text response
- `response_metadata` - Token usage, model info, etc.

## What This Demonstrates

This file shows the **absolute minimum** needed to use LangChain:

1. Load environment variables
2. Initialize a model with `initChatModel()`
3. Call `model.invoke()` with user input
4. Display the response

No complex schemas, no tools, no agents - just a simple request/response cycle.

## Comparison to Other Examples

- **01** (this file) - Simple model invocation
- **02** - Model streaming
- **03** - Batch invocation
- **04** - Structured output
- **05-08** - Agents with tools

## Requirements

- Node.js 18+
- OpenAI API key in `.env.local`
- LangChain packages installed

## API Key Setup

Make sure your `.env.local` file contains:

```bash
OPENAI_API_KEY=your-actual-api-key-here
```

## Exit

Type `exit` or `quit` to stop the application.

---

**Perfect for:** Learning the basics of LangChain model invocation before moving on to more complex examples like agents and tool calling.

