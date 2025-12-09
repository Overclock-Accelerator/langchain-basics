import { config } from "dotenv";
import { z } from "zod";
import { createAgent, tool } from "langchain";
import * as readline from "readline";
import { evaluate } from "mathjs";

// Load environment variables from .env.local
config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════
// 📦 SECTION 1: TOOL DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════
// 🔷 LANGCHAIN: tool() - Define a single math computation tool
// This tool evaluates mathematical expressions safely using mathjs
const calculateMath = tool(
  ({ expression }) => {
    try {
      // Use mathjs to safely evaluate mathematical expressions
      // mathjs supports: arithmetic, functions (sin, cos, sqrt, etc.), constants (pi, e)
      const result = evaluate(expression);
      return `Calculated: ${expression} = ${result}`;
    } catch (error) {
      return `Error calculating ${expression}: ${error.message}`;
    }
  },
  {
    name: "calculate_math",
    description: "Evaluates a mathematical expression and returns the result. Use this ONLY when the user explicitly says 'Use computation'. Supports arithmetic (+, -, *, /, ^), functions (sqrt, sin, cos, log, etc.), and constants (pi, e).",
    schema: z.object({
      expression: z.string().describe("The mathematical expression to evaluate (e.g., '25 + 17', 'sqrt(144)', 'sin(pi/2)', '2^8')"),
    }),
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// 🤖 SECTION 2: AGENT CONSTRUCTION
// ═══════════════════════════════════════════════════════════════════════════
// 🔷 LANGCHAIN: createAgent() - Create agent with the math tool
const agent = createAgent({
  model: "openai:gpt-4o-mini",
  tools: [calculateMath],
  systemPrompt: `You are a helpful math assistant.

IMPORTANT RULES:
- If the user asks a math question AND says "Use computation", you MUST use the calculate_math tool
- If the user asks a math question but does NOT say "Use computation", answer directly without using any tools
- Always be clear in your response about whether you used computation or answered directly
- Use PLAIN TEXT only - no LaTeX, no special formatting like \\( \\), just simple text
- Write expressions as plain text (e.g., "2 + 2 = 4" not "\\(2 + 2 = 4\\)")

When you use the tool, explain that you used computational tools.
When you answer directly, explain that you answered without using tools.`,
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ SECTION 3: AGENT INVOCATION
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('\n🧮 SIMPLE MATH AGENT 🧮');
  console.log('======================\n');
  console.log('Ask me math questions!');
  console.log('\nExamples:');
  console.log('  - "What is 25 + 17?" (I\'ll answer directly)');
  console.log('  - "What is 25 + 17? Use computation" (I\'ll use the calculator tool)');
  console.log('  - "Calculate sqrt(144). Use computation"');
  console.log('  - "What is 2^10? Use computation"');
  console.log('  - "Calculate sin(pi/2). Use computation"');
  console.log('\nType "exit" or "quit" to stop.\n');
  
  const askQuestion = () => {
    rl.question('Your question: ', async (input) => {
      const userInput = input.trim();
      
      if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
        console.log('\n👋 Goodbye!\n');
        rl.close();
        return;
      }
      
      if (!userInput) {
        askQuestion();
        return;
      }
      
      try {
        console.log('\n🤖 Processing...\n');
        
        // 🔷 LANGCHAIN: agent.invoke() - Let the agent decide whether to use tools
        const response = await agent.invoke({
          messages: [
            { 
              role: "user", 
              content: userInput
            }
          ],
        });
        
        // Check if any tools were used
        let toolUsed = false;
        let toolCallDetails = [];
        
        for (const message of response.messages) {
          if (message.tool_calls && message.tool_calls.length > 0) {
            toolUsed = true;
            for (const toolCall of message.tool_calls) {
              toolCallDetails.push({
                name: toolCall.name,
                args: toolCall.args
              });
            }
          }
        }
        
        // Display whether tool was used
        if (toolUsed) {
          console.log('✅ TOOL USED: Yes');
          console.log('🔧 Tool Details:');
          toolCallDetails.forEach((tc) => {
            console.log(`   - ${tc.name}`);
            console.log(`     Expression: ${tc.args.expression}`);
          });
          console.log('');
        } else {
          console.log('❌ TOOL USED: No (answered directly)\n');
        }
        
        // Get the final AI response
        const finalMessage = response.messages[response.messages.length - 1];
        console.log('💬 Response:');
        console.log(finalMessage);
        console.log(`   ${finalMessage.content}\n`);
        console.log('─'.repeat(60) + '\n');
        
      } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('');
      }
      
      // Ask next question
      askQuestion();
    });
  };
  
  askQuestion();
}

// Run the application
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

