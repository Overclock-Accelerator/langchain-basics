import { config } from "dotenv";
import { initChatModel, SystemMessage, HumanMessage } from "langchain";
import * as readline from "readline";

config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════
// 🔷 SECTION 1: MODEL DEFINITION
// ═══════════════════════════════════════════════════════════════════════════
// 🔷 LANGCHAIN: Universal model initialization with "provider:model" syntax
const model = await initChatModel("openai:gpt-5-mini");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('🔷 BATCH INVOCATION DEMO');
console.log('========================');
console.log('Enter multiple messages (one per line)');
console.log('Type "done" when finished to process all at once\n');

const messages = [];

const promptUser = () => {
  rl.question(`Message ${messages.length + 1}: `, (input) => {
    if (input.trim().toLowerCase() === 'done') {
      if (messages.length === 0) {
        console.log('\nNo messages entered. Exiting.\n');
        rl.close();
        return;
      }
      
      processBatch();
    } else {
      messages.push(input.trim());
      promptUser();
    }
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ SECTION 2: BATCH INVOCATION
// ═══════════════════════════════════════════════════════════════════════════
const processBatch = async () => {
  console.log(`\n📦 Processing ${messages.length} messages in batch...\n`);
  
  // 🔷 LANGCHAIN: Prepare message arrays - consistent format across all providers
  const batchInputs = messages.map(msg => [
    new SystemMessage("You are a helpful AI assistant. Provide concise responses."),
    new HumanMessage(msg)
  ]);
  
  // 🔷 LANGCHAIN: model.batch() sends multiple requests in parallel; automatically manages concurrency and rate limits
  const responses = await model.batch(batchInputs);
  
  // Display results
  console.log('═'.repeat(60));
  console.log('📋 BATCH RESULTS');
  console.log('═'.repeat(60));
  
  responses.forEach((response, index) => {
    console.log(`\n${index + 1}. Question: ${messages[index]}`);
    console.log(`   Answer: ${response.content}`);
  });
  
  console.log('\n' + '═'.repeat(60) + '\n');
  rl.close();
};

// Start prompting
promptUser();

