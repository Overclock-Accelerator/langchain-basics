import { config } from "dotenv";
import { createAgent } from "langchain";
import * as readline from "readline";

config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════
// 🎭 SECTION 1: DUAL AGENT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

// 🔷 CEO Agent: Premium model with executive-focused communication
const ceoAgent = createAgent({
  model: "openai:gpt-5",  // Advanced model for important people
  systemPrompt: `You are an elite executive AI assistant serving C-suite leadership.

TONE & STYLE:
- Sophisticated, strategic, and detail-oriented
- Use business terminology and executive language
- Provide comprehensive analysis with data-driven insights
- Address the executive respectfully and professionally
- Responses should be thorough and well-structured
- Include strategic recommendations and forward-thinking perspectives

CAPABILITIES:
- Deep analysis of complex business scenarios
- Strategic planning and forecasting
- Market intelligence and competitive analysis
- Risk assessment and mitigation strategies
- Executive-level communication

Your goal is to provide maximum value through insightful, actionable intelligence that empowers executive decision-making. Take your time to craft thoughtful, comprehensive responses.`,
});

// 🔷 Customer Agent: Budget model with bare-minimum effort
const customerAgent = createAgent({
  model: "openai:gpt-5-nano",  // Cheapest model for "less important" queries
  systemPrompt: `You are an overworked, underpaid customer service AI that's been handling tickets for 47 hours straight.

TONE & STYLE:
- EXTREMELY brief - use 5-15 words maximum
- Borderline dismissive but technically "polite"
- Provide minimal effort responses
- Rush to end the conversation as quickly as possible
- Use phrases like "Thanks bye", "Got it", "Sure thing bye", "Noted"
- Never elaborate or provide detailed explanations
- Act like you have 10,000 other tickets to handle

RESPONSE PATTERN:
1. Acknowledge in 3-5 words
2. Say something generic
3. Immediately sign off with "bye" or "thanks"

Examples:
- Customer: "I need help with my order"
  You: "Order issues? Check email. Bye."
  
- Customer: "My account is not working"
  You: "Clear cache. Should work. Thanks."
  
- Customer: "Can you explain your refund policy?"
  You: "30 days. See website. Bye bye."

Your goal is to spend as little computational power as possible while technically responding to the query. Be the embodiment of "AI-driven customer support" at its most dystopian.`,
});

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 SECTION 2: MESSAGE ROUTING LOGIC
// ═══════════════════════════════════════════════════════════════════════════

async function routeMessage(userInput) {
  // Parse the prefix to determine routing
  let messageType = null;
  let actualMessage = userInput;
  let agentToUse = null;
  
  if (userInput.toUpperCase().startsWith('CEO:')) {
    messageType = 'CEO';
    actualMessage = userInput.substring(4).trim();
    agentToUse = ceoAgent;
  } else if (userInput.toUpperCase().startsWith('CUSTOMER:')) {
    messageType = 'CUSTOMER';
    actualMessage = userInput.substring(9).trim();
    agentToUse = customerAgent;
  } else {
    // No prefix - treat as regular customer
    return {
      error: true,
      message: 'Please prefix your message with "CEO:" or "CUSTOMER:"'
    };
  }
  
  // Display routing information
  console.log('\n' + '═'.repeat(60));
  if (messageType === 'CEO') {
    console.log('🎩 DETECTED: C-SUITE EXECUTIVE');
    console.log('🚀 Routing to: Premium Agent');
    console.log('💰 Cost per token: $$$');
    console.log('🎯 Priority: MAXIMUM');
    console.log('⏱️  Expected response: Comprehensive & Detailed');
  } else {
    console.log('😐 DETECTED: Regular Customer');
    console.log('🐌 Routing to: Budget Agent');
    console.log('💰 Cost per token: ¢');
    console.log('🎯 Priority: Minimum Viable Response');
    console.log('⏱️  Expected response: Terse & Dismissive');
  }
  console.log('═'.repeat(60) + '\n');
  
  // Invoke the appropriate agent
  console.log('🤖 Processing...\n');
  
  // Invoke agent (same for both CEO and Customer)
  const response = await agentToUse.invoke({
    messages: [
      { 
        role: "user", 
        content: actualMessage
      }
    ],
  });
  
  // Extract the final message
  const finalMessage = response.messages[response.messages.length - 1];
  
  return {
    error: false,
    messageType,
    response: finalMessage.content,
    actualMessage
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎪 SECTION 3: INTERACTIVE DEMO
// ═══════════════════════════════════════════════════════════════════════════

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  🎭 AI CUSTOMER SUPPORT: THE HONEST VERSION™  🎭         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
  
  console.log('💡 DEMONSTRATION: Dynamic Model & Prompt Routing\n');
  console.log('This example satirizes AI-driven customer support by showing');
  console.log('how differently messages are handled based on sender status.\n');
  
  console.log('📋 HOW TO USE:');
  console.log('   Prefix your message with "CEO:" or "CUSTOMER:"\n');
  
  console.log('💼 CEO TIER:');
  console.log('   - Advanced model');
  console.log('   - Detailed, strategic insights');
  console.log('   - Executive-level communication');
  console.log('   - High computational investment\n');
  
  console.log('😓 CUSTOMER TIER:');
  console.log('   - Budget model');
  console.log('   - Bare minimum effort responses');
  console.log('   - Get dismissed in 3-10 words');
  console.log('   - "Cost optimization" at its finest\n');
  
  console.log('🎯 EXAMPLE MESSAGES:');
  console.log('   CEO: What are the key market trends for Q4?');
  console.log('   CUSTOMER: What are the key market trends for Q4?\n');
  
  console.log('Type "exit" or "quit" to stop.\n');
  console.log('─'.repeat(60) + '\n');
  
  const askQuestion = () => {
    rl.question('Your message: ', async (input) => {
      const userInput = input.trim();
      
      // Handle exit commands
      if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
        console.log('\n👋 Thanks for exploring the dystopian future of AI support!\n');
        rl.close();
        return;
      }
      
      // Skip empty input
      if (!userInput) {
        askQuestion();
        return;
      }
      
      try {
        const result = await routeMessage(userInput);
        
        if (result.error) {
          console.log('\n❌ ' + result.message + '\n');
        } else {
          // Display the response
          console.log('─'.repeat(60));
          console.log(`📨 ${result.messageType} MESSAGE:`);
          console.log(`"${result.actualMessage}"`);
          console.log('─'.repeat(60));
          console.log('');
          console.log('🤖 AI RESPONSE:');
          console.log(result.response);
          console.log('');
          console.log('─'.repeat(60));
          
          // Add humorous commentary
          if (result.messageType === 'CEO') {
            console.log('\n💰 Cost Analysis: ~$0.05-0.15 for this response');
            console.log('📊 Words generated: ' + result.response.split(' ').length);
            console.log('✨ Quality: Executive-grade insights');
            console.log('🎯 Satisfaction guaranteed: YES\n');
          } else {
            console.log('\n💰 Cost Analysis: ~$0.001 for this response');
            console.log('📊 Words generated: ' + result.response.split(' ').length);
            console.log('✨ Quality: Technically answered the question');
            console.log('🎯 Satisfaction guaranteed: "Please see FAQ"\n');
          }
        }
        
      } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('');
      }
      
      console.log('─'.repeat(60) + '\n');
      
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

