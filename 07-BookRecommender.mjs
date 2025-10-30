import { config } from "dotenv";
import { z } from "zod";
import { createAgent, tool } from "langchain";
import * as readline from "readline";
import { readFileSync } from "fs";

// Load environment variables from .env.local
config({ path: '.env.local' });

// Load book data
const bookData = JSON.parse(readFileSync('./storedata.json', 'utf-8'));
const books = bookData.books;

// ═══════════════════════════════════════════════════════════════════════════
// 📦 SECTION 1: TOOL DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

// Tool 1: Get specific book information
// Use when user asks about a specific book's details
const getBookInfo = tool(
  ({ bookTitle, infoType }) => {
    // Find the book (case-insensitive partial match)
    const book = books.find(b => 
      b.title.toLowerCase().includes(bookTitle.toLowerCase())
    );
    
    if (!book) {
      return `Book "${bookTitle}" not found in our catalog.`;
    }
    
    // Return specific information
    if (infoType === "price") {
      return `"${book.title}" costs $${book.price}`;
    } else if (infoType === "rating") {
      return `"${book.title}" has a rating of ${book.rating}/5.0`;
    } else if (infoType === "pages") {
      return `"${book.title}" has ${book.pages} pages`;
    } else if (infoType === "all") {
      return `"${book.title}" by ${book.author}
Genre: ${book.genre}
Rating: ${book.rating}/5.0
Pages: ${book.pages}
Price: $${book.price}
Year: ${book.year}
Description: ${book.description}`;
    }
    
    return `Information type "${infoType}" not recognized.`;
  },
  {
    name: "get_book_info",
    description: "Get specific information about a particular book (price, rating, pages, or all details). Use when customer asks about a SPECIFIC book by name.",
    schema: z.object({
      bookTitle: z.string().describe("The title of the book (or part of the title)"),
      infoType: z.enum(["price", "rating", "pages", "all"]).describe("Type of information requested"),
    }),
  }
);

// Tool 2: Find potential recommendations
// Use when user describes criteria but not a specific book
const findRecommendations = tool(
  ({ criteria, maxResults = 5 }) => {
    let filtered = [...books];
    
    // Apply filters based on criteria
    if (criteria.genre) {
      filtered = filtered.filter(b => 
        b.genre.toLowerCase().includes(criteria.genre.toLowerCase())
      );
    }
    
    if (criteria.minRating) {
      filtered = filtered.filter(b => b.rating >= criteria.minRating);
    }
    
    if (criteria.maxPages) {
      filtered = filtered.filter(b => b.pages <= criteria.maxPages);
    }
    
    if (criteria.maxPrice) {
      filtered = filtered.filter(b => b.price <= criteria.maxPrice);
    }
    
    if (criteria.minYear) {
      filtered = filtered.filter(b => b.year >= criteria.minYear);
    }
    
    // Sort by rating (highest first)
    filtered.sort((a, b) => b.rating - a.rating);
    
    // Limit results
    const results = filtered.slice(0, maxResults);
    
    if (results.length === 0) {
      return "No books found matching those criteria.";
    }
    
    // Return formatted list
    return JSON.stringify(results.map(b => ({
      title: b.title,
      author: b.author,
      genre: b.genre,
      rating: b.rating,
      pages: b.pages,
      price: b.price,
      year: b.year,
      description: b.description
    })), null, 2);
  },
  {
    name: "find_recommendations",
    description: "Find books matching specific criteria (genre, rating, page count, price, year). Use when customer describes what type of book they want without naming a specific title.",
    schema: z.object({
      criteria: z.object({
        genre: z.string().optional().describe("Genre filter (e.g., 'Fiction', 'Thriller', 'Self-Help')"),
        minRating: z.number().optional().describe("Minimum rating (e.g., 4.5)"),
        maxPages: z.number().optional().describe("Maximum pages for 'short' books (e.g., 250)"),
        maxPrice: z.number().optional().describe("Maximum price in dollars"),
        minYear: z.number().optional().describe("Minimum publication year for 'new' books (e.g., 2020)"),
      }).describe("Criteria object with optional filters"),
      maxResults: z.number().optional().describe("Maximum number of results to return (default 5)"),
    }),
  }
);

// Tool 3: Summarize recommendations with LLM analysis
// Use when customer needs personalized advice/explanation
const summarizeRecommendations = tool(
  async ({ recommendations, customerContext }) => {
    // This tool receives the raw recommendation data and provides
    // a conversational, rationale-driven summary with personalized advice.
    
    try {
      const bookList = JSON.parse(recommendations);
      
      if (bookList.length === 0) {
        return "I couldn't find any books matching your criteria.";
      }
      
      let summary = `Based on your interest in ${customerContext}, I've found some excellent options for you. `;
      
      // Analyze the collection
      const avgRating = (bookList.reduce((sum, b) => sum + b.rating, 0) / bookList.length).toFixed(1);
      const avgPages = Math.round(bookList.reduce((sum, b) => sum + b.pages, 0) / bookList.length);
      const priceRange = {
        min: Math.min(...bookList.map(b => b.price)),
        max: Math.max(...bookList.map(b => b.price))
      };
      
      summary += `These selections all have strong ratings (averaging ${avgRating} stars) and range from $${priceRange.min.toFixed(2)} to $${priceRange.max.toFixed(2)}.\n\n`;
      
      // Provide detailed, conversational recommendations for each book
      bookList.forEach((book, index) => {
        // Determine length category
        let lengthDescription = "";
        if (book.pages < 250) {
          lengthDescription = "quick read";
        } else if (book.pages < 400) {
          lengthDescription = "medium-length book";
        } else {
          lengthDescription = "substantial read";
        }
        
        // Determine price category
        let priceDescription = "";
        if (book.price < 15) {
          priceDescription = "budget-friendly";
        } else if (book.price < 20) {
          priceDescription = "reasonably priced";
        } else {
          priceDescription = "premium selection";
        }
        
        // Determine rating quality
        let ratingDescription = "";
        if (book.rating >= 4.7) {
          ratingDescription = "exceptionally highly rated";
        } else if (book.rating >= 4.5) {
          ratingDescription = "very highly rated";
        } else if (book.rating >= 4.2) {
          ratingDescription = "well-received";
        } else {
          ratingDescription = "positively rated";
        }
        
        // Build conversational recommendation
        if (index === 0) {
          summary += `My top recommendation would be "${book.title}" by ${book.author}. `;
        } else if (index === 1) {
          summary += `Another excellent choice is "${book.title}" by ${book.author}. `;
        } else {
          summary += `You might also enjoy "${book.title}" by ${book.author}. `;
        }
        
        summary += `This ${lengthDescription} (${book.pages} pages) is ${ratingDescription} at ${book.rating} stars and is ${priceDescription} at $${book.price}. `;
        summary += `${book.description} `;
        
        // Add contextual reasoning
        const reasons = [];
        if (book.rating >= 4.5) {
          reasons.push("its outstanding reader reviews");
        }
        if (book.pages < 300) {
          reasons.push("it won't require a huge time commitment");
        }
        if (book.price < 18) {
          reasons.push("it offers great value");
        }
        if (book.year >= 2018) {
          reasons.push("it's a recent publication");
        }
        
        if (reasons.length > 0) {
          summary += `I'm suggesting this because ${reasons.join(", ")}.`;
        }
        
        summary += "\n\n";
      });
      
      // Closing recommendation
      summary += `All of these books would be great choices. If you'd like more details about any of them, just let me know!`;
      
      return summary;
    } catch (error) {
      return "Error formatting recommendations.";
    }
  },
  {
    name: "summarize_recommendations",
    description: "Takes raw recommendation data and creates a friendly, personalized summary for the customer. Use this AFTER find_recommendations when customer wants advice or explanations.",
    schema: z.object({
      recommendations: z.string().describe("JSON string of recommended books from find_recommendations tool"),
      customerContext: z.string().describe("Summary of what the customer was looking for"),
    }),
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// 🤖 SECTION 2: AGENT CONSTRUCTION
// ═══════════════════════════════════════════════════════════════════════════
const agent = createAgent({
  model: "openai:gpt-4o-mini",
  tools: [getBookInfo, findRecommendations, summarizeRecommendations],
  systemPrompt: `You are a helpful bookstore assistant. You help customers find books and answer questions about our catalog.

TOOL USAGE GUIDELINES:
1. If customer asks about a SPECIFIC book (e.g., "How much is The Alchemist?"), use ONLY get_book_info tool
2. If customer wants a LIST of books matching criteria (e.g., "Show me thriller books"), use ONLY find_recommendations tool
3. If customer wants ADVICE or RECOMMENDATIONS with explanation (e.g., "Can you recommend a good book for me?"), use find_recommendations THEN summarize_recommendations

CRITICAL OUTPUT RULES:
- When you use the summarize_recommendations tool, return its output EXACTLY as provided - do NOT reformat it
- The summarize_recommendations tool already provides a complete, conversational response
- Simply pass through the tool's conversational output without adding lists, bullets, or restructuring
- Do NOT create numbered lists or bullet points when summarize_recommendations is used

Examples:
- "What's the price of Atomic Habits?" → Use get_book_info
- "List all science fiction books under $20" → Use find_recommendations (return as list)
- "I'm looking for a short, highly rated book to read on vacation" → Use find_recommendations + summarize_recommendations (return conversational output)
- "Recommend something for me, I like thrillers" → Use find_recommendations + summarize_recommendations (return conversational output)

Be friendly and helpful. When providing recommendations, consider the customer's needs carefully.`,
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ SECTION 3: AGENT INVOCATION
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('\n📚 BOOK RECOMMENDER AGENT 📚');
  console.log('============================\n');
  console.log('Welcome to our bookstore! I can help you find books.\n');
  console.log('Try asking:');
  console.log('  - "How much is The Alchemist?"');
  console.log('  - "What\'s the rating for Atomic Habits?"');
  console.log('  - "Show me highly rated science fiction books"');
  console.log('  - "I want a short book under 200 pages"');
  console.log('  - "Recommend a good thriller for me"');
  console.log('  - "I\'m looking for a new book published recently"');
  console.log('\nType "exit" or "quit" to stop.\n');
  
  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      const userInput = input.trim();
      
      if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
        console.log('\n👋 Thank you for visiting! Happy reading!\n');
        rl.close();
        return;
      }
      
      if (!userInput) {
        askQuestion();
        return;
      }
      
      try {
        console.log('\n🤖 Thinking...\n');
        
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
            console.log(`   ${index + 1}. ${tc.name}`);
          });
          console.log('');
        }
        
        // Get the final AI response
        const finalMessage = response.messages[response.messages.length - 1];
        console.log('📚 Assistant:');
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

