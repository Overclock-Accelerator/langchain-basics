import { config } from "dotenv";
import { initChatModel, SystemMessage, HumanMessage } from "langchain";
import * as readline from "readline";

config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════
// 🔷 SECTION 1: MODEL DEFINITION
// ═══════════════════════════════════════════════════════════════════════════
// 🔷 LANGCHAIN: Universal model initialization with "provider:model" syntax
// const model = await initChatModel("openai:gpt-5-mini");
// Alternative models - uncomment to use:
// const model = await initChatModel("anthropic:claude-sonnet-4.5");
const model = await initChatModel("anthropic:claude-haiku-4-5-20251001");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ SECTION 2: MODEL INVOCATION
// ═══════════════════════════════════════════════════════════════════════════
rl.question('Enter your message: ', async (userInput) => {
  console.log('\nInvoking model...\n');
  
  // 🔷 LANGCHAIN: Standardized message types work across all providers
  const messages = [
    new SystemMessage("You are a helpful AI assistant."),
    new HumanMessage(userInput)
  ];
  
  // 🔷 LANGCHAIN: model.invoke() waits for complete response before returning
  const response = await model.invoke(messages);
  
  console.log('─'.repeat(60));
  console.log('RESPONSE:');
  console.log('─'.repeat(60));
  console.log(response.content);
  console.log('─'.repeat(60));
  
  console.log('\n');
  rl.close();
});

