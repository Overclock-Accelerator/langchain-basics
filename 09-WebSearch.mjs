import { config } from "dotenv";
import { z } from "zod";
import { createAgent, tool } from "langchain";
import * as readline from "readline";

// Load environment variables from .env.local
config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════
// 🔍 SECTION 1: TOOL SETUP
// ═══════════════════════════════════════════════════════════════════════════

// Create a simulated web search tool
// In production, this would connect to an actual search API
const webSearchTool = tool(
  async ({ query }) => {
    // Simulated search results based on query keywords
    console.log(`   🔍 Searching for: "${query}"`);
    
    // Simulate search results based on query content
    const results = [];
    
    if (query.toLowerCase().includes('weather') || query.toLowerCase().includes('temperature')) {
      results.push({
        title: "Weather Forecast - AccuWeather",
        link: "https://www.accuweather.com",
        snippet: "Current weather shows sunny conditions with temperatures around 72°F (22°C). Expect clear skies throughout the day with light winds from the west."
      });
      results.push({
        title: "Weather.com - Local Weather Forecast",
        link: "https://weather.com",
        snippet: "Today's forecast: High of 75°F, Low of 58°F. Partly cloudy with 10% chance of rain. Humidity at 45%."
      });
    } else if (query.toLowerCase().includes('ai') || query.toLowerCase().includes('artificial intelligence')) {
      results.push({
        title: "Latest AI News - TechCrunch",
        link: "https://techcrunch.com/ai",
        snippet: "Recent developments in AI include major advances in language models, with new capabilities in reasoning and multimodal understanding. Several tech companies have announced AI partnerships."
      });
      results.push({
        title: "AI Research Breakthroughs - MIT Technology Review",
        link: "https://www.technologyreview.com",
        snippet: "Researchers have made significant progress in AI safety, efficiency, and practical applications. New models are showing improved performance while using fewer resources."
      });
    } else if (query.toLowerCase().includes('stock') || query.toLowerCase().includes('market')) {
      results.push({
        title: "Stock Market Today - CNBC",
        link: "https://www.cnbc.com/markets",
        snippet: "Markets showed mixed performance today. The S&P 500 rose 0.5%, while tech stocks led gains. Investors are monitoring economic indicators and corporate earnings."
      });
      results.push({
        title: "Market Overview - Bloomberg",
        link: "https://www.bloomberg.com",
        snippet: "Global markets are responding to recent economic data. Trading volume remains strong with continued interest in technology and healthcare sectors."
      });
    } else if (query.toLowerCase().includes('spacex') || query.toLowerCase().includes('space')) {
      results.push({
        title: "SpaceX News - Space.com",
        link: "https://www.space.com/spacex",
        snippet: "SpaceX continues its ambitious launch schedule with multiple Starship test flights planned. The company is also advancing its Starlink satellite constellation."
      });
      results.push({
        title: "SpaceX Updates - NASA",
        link: "https://www.nasa.gov",
        snippet: "SpaceX is collaborating on lunar missions and maintains regular cargo and crew deliveries to the International Space Station."
      });
    } else if (query.toLowerCase().includes('nobel prize')) {
      results.push({
        title: "Nobel Prize Winners - NobelPrize.org",
        link: "https://www.nobelprize.org",
        snippet: "The latest Nobel Prize winners include groundbreaking work in physics, chemistry, medicine, literature, and peace. This year's laureates have made significant contributions to their fields."
      });
    } else {
      // Generic search results for other queries
      results.push({
        title: `Search results for: ${query}`,
        link: "https://www.example.com",
        snippet: `Relevant information about ${query} can be found through various sources. This is a simulated search result demonstrating the web search functionality.`
      });
      results.push({
        title: `More about ${query} - Wikipedia`,
        link: "https://www.wikipedia.org",
        snippet: `${query} is an interesting topic with multiple aspects to explore. Further research and reliable sources provide detailed information.`
      });
    }
    
    // Return formatted results
    return JSON.stringify(results, null, 2);
  },
  {
    name: "web_search",
    description: "Search the web for current information, news, facts, and real-time data. Use this when the user asks about current events, recent information, weather, news, or anything requiring up-to-date knowledge.",
    schema: z.object({
      query: z.string().describe("The search query to look up on the web"),
    }),
  }
);

console.log('\n🔍 Web Search Tool Initialized');
console.log(`Tool Name: ${webSearchTool.name}`);
console.log(`Description: ${webSearchTool.description}`);
console.log('─'.repeat(60));

// ═══════════════════════════════════════════════════════════════════════════
// 🤖 SECTION 2: AGENT CONSTRUCTION
// ═══════════════════════════════════════════════════════════════════════════

const agent = createAgent({
  model: "openai:gpt-4o-mini",
  tools: [webSearchTool],
  systemPrompt: `You are a helpful AI assistant with access to web search.

CAPABILITIES:
- You can search the web for current information, news, facts, and data
- You have access to information through a web search tool
- You can answer questions that require up-to-date knowledge

GUIDELINES:
1. When a user asks about current events, recent information, or anything that requires web search, use the web_search tool
2. Synthesize information from search results into clear, concise answers
3. Cite sources when providing information from search results (include titles and links)
4. If search results are not relevant or sufficient, let the user know
5. For general knowledge questions you're confident about, you may answer directly without searching

Be helpful, accurate, and conversational.`,
});

// Create readline interface for interactive chat
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ SECTION 3: AGENT INVOCATION
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('\n🌐 WEB SEARCH AGENT 🌐');
  console.log('=====================\n');
  console.log('I can search the web using DuckDuckGo to answer your questions!\n');
  console.log('Try asking:');
  console.log('  - "What\'s the current weather in Paris?"');
  console.log('  - "What are the latest news about AI?"');
  console.log('  - "Tell me about the stock market today"');
  console.log('  - "What\'s happening with SpaceX?"');
  console.log('  - "Who won the latest Nobel Prize?"');
  console.log('\nType "exit" or "quit" to stop.\n');
  
  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      const userInput = input.trim();
      
      // Handle exit commands
      if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
        console.log('\n👋 Goodbye! Happy searching!\n');
        rl.close();
        return;
      }
      
      // Skip empty input
      if (!userInput) {
        askQuestion();
        return;
      }
      
      try {
        console.log('\n🔍 Searching...\n');
        
        // Invoke the agent with the user's question
        const response = await agent.invoke({
          messages: [
            { 
              role: "user", 
              content: userInput
            }
          ],
        });
        
        // Track which tools were used
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
        
        // Display tool usage
        if (toolCalls.length > 0) {
          console.log('🔧 Tools Used:');
          toolCalls.forEach((tc, index) => {
            console.log(`   ${index + 1}. ${tc.name} - Query: "${tc.args.input}"`);
          });
          console.log('');
        }
        
        // Get the final AI response
        const finalMessage = response.messages[response.messages.length - 1];
        console.log('🤖 Assistant:');
        console.log(finalMessage.content);
        console.log('\n' + '─'.repeat(60) + '\n');
        
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

