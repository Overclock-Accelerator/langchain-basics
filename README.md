# LangChain Basic Examples

A collection of simple, self-contained examples demonstrating fundamental LangChain concepts and features. Each example focuses on a specific capability with clear documentation and interactive demonstrations.

## Overview

These examples are designed to teach core LangChain concepts through hands-on, interactive demonstrations. Start with example 01 and progress through to 08 to build a solid foundation in:

- Model invocation and streaming
- Batch processing
- Structured outputs
- Tool definition and usage
- Agent creation and coordination
- Middleware and production patterns

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local file with your API key
echo "OPENAI_API_KEY=your-key-here" > .env.local

# 3. Run any example
node 01-ModelInvocation.mjs
node 02-ModelStreaming.mjs
node 03-BatchInvocation.mjs
# ... etc
```

## Examples

### Core Concepts (01-04)

**[01 - Model Invocation](01-README.md)**
- Basic model invocation with `invoke()`
- Understanding messages and responses
- Simple request/response cycle

**[02 - Model Streaming](02-README.md)**
- Real-time response streaming with `stream()`
- Token-by-token output
- Better user experience for long responses

**[03 - Batch Invocation](03-README.md)**
- Parallel request processing with `batch()`
- Automatic concurrency management
- Performance optimization for multiple inputs

**[04 - Structured Output](04-README.md)**
- Type-safe JSON responses with `withStructuredOutput()`
- Zod schema validation
- Extracting structured data from LLMs

### Agents and Tools (05-08)

**[05 - Simple Math Agent](05-README.md)**
- Basic tool definition and usage
- Conditional tool calling
- Understanding agent decision-making

**[06 - Automated Driving Agent](06-README.md)**
- Multi-tool coordination
- Stateful applications
- Context-aware decision making

**[07 - Book Recommender Agent](07-README.md)**
- Complex multi-tool scenarios
- Tool chaining (sequential tool calls)
- Data integration with external sources

**[08 - Book Recommender with Limiter](08-README.md)**
- Production middleware patterns
- Tool call limiting for cost control
- Safety and resource management

## Learning Path

### Recommended Order

1. **Start with 01-04** to understand basic LangChain features
   - Learn how to invoke, stream, and batch process requests
   - Understand structured outputs

2. **Progress to 05-07** to explore agents and tools
   - See how agents make decisions
   - Learn tool definition and coordination
   - Understand tool chaining

3. **Finish with 08** for production patterns
   - Learn about middleware
   - Understand cost and safety controls

### Each Example Includes

- 📄 **README** - Detailed explanation and usage
- 💻 **Executable Code** - Self-contained, runnable example
- 🎯 **Focused Concept** - One main idea per example
- 📋 **Sample Output** - Expected behavior and results

## Key Concepts Demonstrated

### Model Interaction
- **Invocation** - Basic request/response (01)
- **Streaming** - Real-time token output (02)
- **Batching** - Parallel processing (03)
- **Structured Output** - Type-safe responses (04)

### Agent Patterns
- **Tool Definition** - Creating callable functions (05)
- **Tool Selection** - Agent decision-making (05-07)
- **Multi-Tool Coordination** - Using multiple tools (06-07)
- **Tool Chaining** - Sequential tool calls (07)

### Production Features
- **Middleware** - Request/response interception (08)
- **Rate Limiting** - Controlling tool usage (08)
- **Error Handling** - Graceful degradation (all)
- **State Management** - Maintaining context (06-07)

## Setup

### Prerequisites
- Node.js 18 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone or download this repository
cd 01-SimpleChains

# Install dependencies
npm install

# Create environment file
echo "OPENAI_API_KEY=your-actual-key-here" > .env.local
```

### Verify Setup

```bash
# Run the first example to verify everything works
node 01-ModelInvocation.mjs
```

## Project Structure

```
01-SimpleChains/
├── 01-ModelInvocation.mjs      # Basic model invocation
├── 01-README.md                # Documentation for example 01
├── 02-ModelStreaming.mjs       # Streaming responses
├── 02-README.md                # Documentation for example 02
├── 03-BatchInvocation.mjs      # Batch processing
├── 03-README.md                # Documentation for example 03
├── 04-StructuredOutput.mjs     # Structured output
├── 04-README.md                # Documentation for example 04
├── 05-SimpleMathAgent.mjs      # Single tool agent
├── 05-README.md                # Documentation for example 05
├── 06-AutomatedDriving.mjs     # Multi-tool agent
├── 06-README.md                # Documentation for example 06
├── 07-BookRecommender.mjs      # Complex agent with chaining
├── 07-README.md                # Documentation for example 07
├── 08-BookRecommenderWithLimiter.mjs  # Agent with middleware
├── 08-README.md                # Documentation for example 08
├── storedata.json              # Sample data for examples 07-08
├── package.json                # Dependencies
├── .env.local                  # API keys (create this)
└── README.md                   # This file
```

## Tips for Learning

1. **Read the README first** - Each example has detailed documentation
2. **Run the code** - All examples are interactive and runnable
3. **Modify and experiment** - Change parameters to see different behaviors
4. **Check the comments** - Code includes helpful inline explanations (🔷 markers)
5. **Progress sequentially** - Each example builds on previous concepts

## Common Issues

**"Module not found" error:**
```bash
npm install
```

**"API key not set" error:**
```bash
# Make sure .env.local exists and contains:
OPENAI_API_KEY=your-actual-key-here
```

**"Cannot find module" for storedata.json:**
- Examples 07 and 08 need `storedata.json` in the same directory
- This file should be included in the repository

## Additional Resources

- [LangChain Documentation](https://docs.langchain.com/)
- [LangChain JS/TS Docs](https://js.langchain.com/)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Zod Documentation](https://zod.dev/) (for schema validation)

## What's Next?

After completing these examples, you'll be ready to:
- Build custom agents for your use cases
- Integrate LangChain into production applications
- Create complex multi-step workflows
- Implement RAG (Retrieval Augmented Generation) systems
- Build conversational AI applications

## Contributing

These examples are meant to be simple and educational. If you find issues or have suggestions for improvements, please feel free to contribute.

## License

ISC

