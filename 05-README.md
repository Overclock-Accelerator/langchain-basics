# 05 - Simple Math Agent

A basic LangChain agent that demonstrates tool calling by deciding when to use a calculator versus answering math questions directly.

## Overview

This agent has access to a `calculate_math` tool and can intelligently decide whether to use computation or answer directly. It demonstrates the fundamental concept of tool-based agents - letting the AI decide when and how to use available tools.

## Features

- **Single Math Tool** - Evaluates mathematical expressions using mathjs
- **Conditional Tool Use** - Agent only uses the tool when user says "Use computation"
- **Direct Answers** - Can answer simple math without tools
- **Transparent Decision Making** - Shows whether tool was used or not
- **Complex Math Support** - Supports functions (sqrt, sin, cos), constants (pi, e), and operators

## How It Works

The agent follows a simple rule:
- **With "Use computation"** → Calls the `calculate_math` tool
- **Without "Use computation"** → Answers directly without tools

This demonstrates the agent's ability to follow instructions about tool usage.

## Run It

```bash
node 05-SimpleMathAgent.mjs
```

## Example Interaction

```
🧮 SIMPLE MATH AGENT 🧮
======================

Ask me math questions!

Examples:
  - "What is 25 + 17?" (I'll answer directly)
  - "What is 25 + 17? Use computation" (I'll use the calculator tool)
  - "Calculate sqrt(144). Use computation"
  - "What is 2^10? Use computation"

Type "exit" or "quit" to stop.

Your question: What is 25 + 17?

🤖 Processing...

❌ TOOL USED: No (answered directly)

💬 Response:
   25 + 17 equals 42.

────────────────────────────────────────────────────────────

Your question: What is 25 + 17? Use computation

🤖 Processing...

✅ TOOL USED: Yes
🔧 Tool Details:
   - calculate_math
     Expression: 25 + 17

💬 Response:
   I used the calculator tool and found that 25 + 17 = 42.

────────────────────────────────────────────────────────────
```

## Tool Definition

```javascript
const calculateMath = tool(
  ({ expression }) => {
    const result = evaluate(expression);  // mathjs
    return `Calculated: ${expression} = ${result}`;
  },
  {
    name: "calculate_math",
    description: "Evaluates mathematical expressions...",
    schema: z.object({
      expression: z.string().describe("The math expression to evaluate"),
    }),
  }
);
```

## Supported Math

The tool uses [mathjs](https://mathjs.org/) which supports:
- **Arithmetic**: `+`, `-`, `*`, `/`, `^`
- **Functions**: `sqrt()`, `sin()`, `cos()`, `log()`, `abs()`, etc.
- **Constants**: `pi`, `e`
- **Complex expressions**: `(25 + 17) * 2 / sqrt(9)`

## Sample Questions

### Without Computation (Direct Answer)
- "What is 25 + 17?"
- "What's 100 divided by 4?"
- "Calculate 8 * 7"

### With Computation (Uses Tool)
- "What is 25 + 17? Use computation"
- "Calculate sqrt(144). Use computation"
- "What is 2^10? Use computation"
- "What's sin(pi/2)? Use computation"

## Technical Details

### Agent Configuration

```javascript
const agent = createAgent({
  model: "openai:gpt-4o-mini",
  tools: [calculateMath],
  systemPrompt: `You are a helpful math assistant.
  
IMPORTANT RULES:
- If the user says "Use computation", you MUST use the calculate_math tool
- If they don't say "Use computation", answer directly without tools
- Always explain whether you used computation or not`
});
```

### Inspecting Tool Calls

```javascript
for (const message of response.messages) {
  if (message.tool_calls && message.tool_calls.length > 0) {
    // Tool was used
    console.log('Tool:', message.tool_calls[0].name);
    console.log('Args:', message.tool_calls[0].args);
  }
}
```

## What This Demonstrates

This example shows:
1. **Tool Definition** - How to create a tool with `tool()`
2. **Agent Creation** - Using `createAgent()` with tools
3. **Conditional Tool Use** - Agent decides whether to call tool
4. **Tool Call Inspection** - Viewing what tools were called and with what parameters

## Without LangChain

Without LangChain, you'd need to:
1. Parse the user's intent
2. Detect if tool usage is needed
3. Manually format tool descriptions for the LLM
4. Parse function call responses from the LLM
5. Execute the appropriate function
6. Format results back to the LLM
7. Get the final response

LangChain handles all of this automatically.

## Requirements

- Node.js 18+
- OpenAI API key in `.env.local`
- LangChain packages and mathjs installed

## Exit

Type `exit` or `quit` to stop the application.

## Related Examples

- **04** - Structured output (no tools)
- **05** (this file) - Single tool agent
- **06** - Multi-tool agent (automated driving)
- **07** - Complex multi-tool agent (book recommender)

This is the simplest tool-using agent example - perfect for understanding the basics before moving to more complex scenarios.


