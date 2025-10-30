import { config } from "dotenv";
// 🔷 LANGCHAIN: Unified model initialization and message types work across all providers
import { initChatModel, SystemMessage, HumanMessage } from "langchain";
import * as readline from "readline";

config({ path: '.env.local' });

// 🔷 LANGCHAIN: Universal model initialization with "provider:model" syntax
const model = await initChatModel("openai:gpt-5-mini");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter your message: ', async (userInput) => {
  console.log('\nStreaming response...\n');
  
  // 🔷 LANGCHAIN: Standardized message types work across all providers
  const messages = [
    new SystemMessage("You are a helpful AI assistant."),
    new HumanMessage(userInput)
  ];
  
  // 🔷 LANGCHAIN: model.stream() returns output as it's generated; same API across all providers
  const stream = await model.stream(messages);
  
  // 🔷 LANGCHAIN: Each chunk contains incremental content; chunks can be summed to reconstruct full AIMessage
  for await (const chunk of stream) {
    process.stdout.write(chunk.text || '');
  }
  
  console.log('\n');
  rl.close();
});

