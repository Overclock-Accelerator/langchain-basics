import { config } from "dotenv";
import { z } from "zod";
// 🔷 LANGCHAIN: Import agent and tool creation functions
// Benefit: High-level abstractions for building AI agents with tool calling
// Without LangChain: You'd manually parse function calls, handle tool routing, manage conversation state
import { createAgent, tool } from "langchain";
import * as readline from "readline";

// Load environment variables from .env.local
config({ path: '.env.local' });

// Car state (not LangChain - just application logic)
let carState = {
  speed: 0,
  status: "stopped",
  targetSpeed: 0
};

// ═══════════════════════════════════════════════════════════════════════════
// 📦 SECTION 1: TOOL DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════
// 🔷 LANGCHAIN: tool() - Declarative tool definition
// Benefit: Simple function + schema = AI-callable tool. LangChain handles:
//   - Converting function to tool description for the LLM
//   - Validating parameters with Zod schema
//   - Executing the function when AI calls it
//   - Returning results back to the AI
// Without LangChain: You'd manually describe functions in prompt, parse JSON, validate, execute, format results

// Tool 1: Stop or Go
const stopOrGo = tool(
  ({ action, reason }) => {
    const previousStatus = carState.status;
    const previousSpeed = carState.speed;
    
    if (action === "stop") {
      carState.status = "stopping";
      carState.targetSpeed = 0;
      carState.speed = 0;
      return `Car is now STOPPING from ${previousSpeed} mph. Reason: ${reason}. Current speed: 0 mph.`;
    } else if (action === "go") {
      carState.status = "going";
      if (carState.speed === 0) {
        carState.speed = 25;
        carState.targetSpeed = 25;
      }
      return `Car is now GOING. Accelerating from ${previousSpeed} mph to ${carState.speed} mph. Reason: ${reason}.`;
    }
    
    return `Invalid action: ${action}`;
  },
  {
    name: "stop_or_go",
    description: "Control whether the car should stop or go. Use 'stop' for red lights or stop signs. Use 'go' for green lights when safe to proceed.",
    // 🔷 LANGCHAIN: Zod schema integration for type-safe parameters
    // Benefit: Schema defines valid parameters, LangChain validates them automatically
    // The AI sees these descriptions and uses them to call tools correctly
    schema: z.object({
      action: z.enum(["stop", "go"]).describe("The action to take: 'stop' or 'go'"),
      reason: z.string().describe("The reason for this action (e.g., 'red light', 'green light')"),
    }),
  }
);

// Tool 2: Speed Up or Slow Down
const adjustSpeed = tool(
  ({ action, targetSpeed, reason }) => {
    const previousSpeed = carState.speed;
    
    if (action === "speed_up") {
      carState.status = "speeding up";
      carState.targetSpeed = targetSpeed;
      carState.speed = targetSpeed;
      return `Car is SPEEDING UP from ${previousSpeed} mph to ${targetSpeed} mph. Reason: ${reason}.`;
    } else if (action === "slow_down") {
      carState.status = "slowing down";
      carState.targetSpeed = targetSpeed;
      carState.speed = targetSpeed;
      return `Car is SLOWING DOWN from ${previousSpeed} mph to ${targetSpeed} mph. Reason: ${reason}.`;
    }
    
    return `Invalid action: ${action}`;
  },
  {
    name: "adjust_speed",
    description: "Adjust the car's speed by speeding up or slowing down. Use this for speed limit changes or yellow lights. Provide a target speed based on speed limits or traffic conditions.",
    schema: z.object({
      action: z.enum(["speed_up", "slow_down"]).describe("The action to take: 'speed_up' or 'slow_down'"),
      targetSpeed: z.number().describe("The target speed in mph (e.g., 25, 35, 55, 65)"),
      reason: z.string().describe("The reason for this adjustment (e.g., 'speed limit 55', 'yellow light approaching')"),
    }),
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// 🤖 SECTION 2: AGENT CONSTRUCTION
// ═══════════════════════════════════════════════════════════════════════════
// 🔷 LANGCHAIN: createAgent() - Complete agent orchestration
// Benefit: LangChain automatically handles:
//   - Sending tools to the model in proper format
//   - Detecting when AI wants to call a tool
//   - Executing the tool function
//   - Feeding tool results back to AI
//   - Managing conversation history
//   - ReAct loop (Reasoning + Acting) until task complete
// Without LangChain: You'd build a loop to parse tool calls, execute functions, format results,
//   continue conversation - hundreds of lines of boilerplate
const agent = createAgent({
  model: "openai:gpt-5-mini",
  tools: [stopOrGo, adjustSpeed],  // Just pass tools array - LangChain does the rest
  systemPrompt: `You are an autonomous driving AI assistant. Your job is to control a car's speed and movement based on traffic signs and conditions.

Current car state: Speed=${carState.speed} mph, Status=${carState.status}

Rules:
- RED LIGHT: Use stop_or_go with action='stop'
- GREEN LIGHT: Use stop_or_go with action='go' (if currently stopped)
- YELLOW LIGHT: Use adjust_speed with action='slow_down' to reduce speed, or stop_or_go with action='stop' if close to intersection
- SPEED LIMIT signs: Use adjust_speed to match the speed limit
  - If new limit is higher: use action='speed_up'
  - If new limit is lower: use action='slow_down'

Always consider the current speed when making decisions. Be safe and follow traffic rules.`,
});

// Display current car state
function displayCarState() {
  console.log('\n' + '='.repeat(50));
  console.log(`🚗 CAR STATE: ${carState.status.toUpperCase()}`);
  console.log(`   Current Speed: ${carState.speed} mph`);
  console.log(`   Target Speed: ${carState.targetSpeed} mph`);
  console.log('='.repeat(50) + '\n');
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Main function
async function main() {
  console.log('\n🚗 AUTOMATED DRIVING SIMULATOR 🚗');
  console.log('================================\n');
  console.log('Tell the car what signs you see!');
  console.log('Examples:');
  console.log('  - "I see a red light"');
  console.log('  - "Green light ahead"');
  console.log('  - "Speed limit 55"');
  console.log('  - "Yellow light approaching"');
  console.log('  - "Speed limit 75"');
  console.log('\nType "exit" or "quit" to stop.\n');
  
  displayCarState();
  
  const askQuestion = () => {
    rl.question('What sign do you see? ', async (input) => {
      const userInput = input.trim();
      
      if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
        console.log('\n👋 Shutting down autonomous driving system...\n');
        rl.close();
        return;
      }
      
      if (!userInput) {
        askQuestion();
        return;
      }
      
      try {
        console.log(`\n📍 Sign detected: "${userInput}"`);
        console.log('🤖 Agent is analyzing and deciding...\n');
        
        // ═══════════════════════════════════════════════════════════════════════════
        // ⚡ SECTION 3: AGENT INVOCATION
        // ═══════════════════════════════════════════════════════════════════════════
        // 🔷 LANGCHAIN: agent.invoke() - Autonomous tool calling
        // Benefit: Single call triggers entire agent loop:
        //   1. AI analyzes the message
        //   2. Decides which tool(s) to call and with what parameters
        //   3. LangChain executes the tool(s)
        //   4. AI sees results and can call more tools if needed
        //   5. Finally returns a natural language response
        // Without LangChain: You'd manually loop, parse tool calls, execute, format, repeat
        const response = await agent.invoke({
          messages: [
            { 
              role: "user", 
              content: `Current car speed is ${carState.speed} mph and status is ${carState.status}. I see: ${userInput}. What should the car do?` 
            }
          ],
        });
        
        // 🔷 LANGCHAIN: response.messages - Complete conversation history
        // Benefit: LangChain tracks all messages including:
        //   - User messages
        //   - AI reasoning
        //   - Tool calls (with parameters)
        //   - Tool results
        //   - Final AI response
        // This transparency lets you debug agent behavior
        const toolCalls = [];
        for (const message of response.messages) {
          if (message.tool_calls && message.tool_calls.length > 0) {
            for (const toolCall of message.tool_calls) {
              toolCalls.push({
                name: toolCall.name,
                args: toolCall.args
              });
            }
          }
        }
        
        // Display which tools were used
        if (toolCalls.length > 0) {
          console.log('🔧 Tools Used:');
          toolCalls.forEach((tc, index) => {
            console.log(`   ${index + 1}. ${tc.name}`);
            console.log(`      Parameters: ${JSON.stringify(tc.args, null, 6).replace(/\n/g, '\n      ')}`);
          });
          console.log('');
        }
        
        // Get the final AI response
        const finalMessage = response.messages[response.messages.length - 1];
        
        console.log('💬 Agent response:');
        console.log(`   ${finalMessage.content}\n`);
        
        // Display updated car state
        displayCarState();
        
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

