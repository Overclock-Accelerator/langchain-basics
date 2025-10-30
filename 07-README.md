# 07 - Book Recommender Agent

A sophisticated multi-tool agent that recommends books from a catalog using intelligent tool chaining and personalized recommendations.

## Overview

This agent demonstrates advanced tool coordination by using three different tools that work together: one for specific book queries, one for finding recommendations, and one for creating personalized summaries. The agent intelligently decides which tools to use based on the user's request.

## Features

- **Three Coordinated Tools**:
  - `get_book_info` - Get details about a specific book
  - `find_recommendations` - Search catalog with filters
  - `summarize_recommendations` - Create personalized summaries
- **Smart Tool Chaining** - Agent can call multiple tools in sequence
- **Rich Book Catalog** - Loaded from `storedata.json`
- **Flexible Queries** - Handles specific questions and open-ended requests
- **Natural Conversations** - Provides friendly, helpful responses

## Run It

```bash
node 07-BookRecommender.mjs
```

## Example Interactions

### Specific Book Query
```
You: How much is The Alchemist?

🤖 Thinking...

🔧 Tools Used:
   1. get_book_info

📚 Assistant:
"The Alchemist" costs $14.99
```

### List Query
```
You: Show me highly rated science fiction books

🤖 Thinking...

🔧 Tools Used:
   1. find_recommendations

📚 Assistant:
Here are the highly rated science fiction books I found:

1. "Project Hail Mary" by Andy Weir
   Rating: 4.8/5.0
   Pages: 476
   Price: $18.99
   ...
```

### Personalized Recommendation
```
You: I'm looking for a short, highly rated book to read on vacation

🤖 Thinking...

🔧 Tools Used:
   1. find_recommendations
   2. summarize_recommendations

📚 Assistant:
Based on your interest in short, highly rated books for vacation, I've found 
some excellent options for you. These selections all have strong ratings 
(averaging 4.7 stars) and range from $13.99 to $16.99.

My top recommendation would be "The Midnight Library" by Matt Haig. This quick 
read (304 pages) is exceptionally highly rated at 4.8 stars and is budget-
friendly at $15.99. It tells the story of a library between life and death 
where every book is a different version of your life. I'm suggesting this 
because its outstanding reader reviews, it won't require a huge time 
commitment, it offers great value.

Another excellent choice is "Atomic Habits" by James Clear...
```

## Tools

### Tool 1: Get Book Info
Gets specific information about a particular book.

**Parameters:**
- `bookTitle` - The title to search for
- `infoType` - What info to return (price, rating, pages, or all)

**Use case:** "What's the price of Atomic Habits?"

### Tool 2: Find Recommendations
Searches the catalog with filters.

**Parameters (all optional):**
- `genre` - Genre filter (e.g., "Fiction", "Thriller")
- `minRating` - Minimum rating (e.g., 4.5)
- `maxPages` - Maximum page count
- `maxPrice` - Maximum price in dollars
- `minYear` - Minimum publication year

**Use case:** "Show me thriller books under $20"

### Tool 3: Summarize Recommendations
Creates personalized, conversational summaries.

**Parameters:**
- `recommendations` - JSON string from find_recommendations
- `customerContext` - What the customer is looking for

**Use case:** Used automatically after find_recommendations when user wants advice

## Sample Queries

### Specific Information
- "How much is The Alchemist?"
- "What's the rating for Atomic Habits?"
- "Tell me about Project Hail Mary"

### Filtered Lists
- "Show me highly rated science fiction books"
- "List all thrillers under $20"
- "What books under 200 pages do you have?"
- "Show me new books published after 2020"

### Personalized Recommendations
- "Recommend a good book for me"
- "I want a short book for a weekend trip"
- "I'm looking for something thrilling and recent"
- "Suggest a highly rated book under $15"

## Technical Details

### Agent Configuration

```javascript
const agent = createAgent({
  model: "openai:gpt-4o-mini",
  tools: [getBookInfo, findRecommendations, summarizeRecommendations],
  systemPrompt: `You are a helpful bookstore assistant...`
});
```

### Tool Chaining

The agent intelligently chains tools:

1. **Simple Query** → `get_book_info` only
2. **List Request** → `find_recommendations` only
3. **Personalized Advice** → `find_recommendations` → `summarize_recommendations`

This happens automatically based on the system prompt instructions.

### Data Source

Book data is loaded from `storedata.json`:

```javascript
const bookData = JSON.parse(readFileSync('./storedata.json', 'utf-8'));
const books = bookData.books;
```

Each book has:
- Title, author, genre
- Rating, pages, price, year
- Description

## What This Demonstrates

This example shows:
1. **Multi-Tool Coordination** - Agent manages three different tools
2. **Tool Chaining** - Sequential tool calls (find → summarize)
3. **Conditional Logic** - Different tool strategies for different queries
4. **Data Integration** - Loading external data (JSON file)
5. **Complex Responses** - Both structured lists and conversational text
6. **Context Preservation** - Passing data between tools

## LangChain Benefits

**Automatic Tool Management:**
- Agent decides which tool(s) to use
- Handles tool parameter extraction
- Manages tool execution order
- Combines results intelligently

**Without LangChain:**
You'd need hundreds of lines to:
- Parse user intent
- Map intent to tools
- Extract parameters
- Validate schemas
- Execute tools
- Chain results
- Format responses

LangChain does all of this automatically.

## Requirements

- Node.js 18+
- OpenAI API key in `.env.local`
- `storedata.json` file with book catalog
- LangChain packages installed

## Exit

Type `exit` or `quit` to stop the application.

## Related Examples

- **05** - Simple single-tool agent
- **06** - Multi-tool agent (automated driving)
- **07** (this file) - Complex multi-tool with chaining
- **08** - Same agent with middleware (tool limiting)

This demonstrates advanced agent patterns like tool chaining and context-aware tool selection - essential skills for building production LangChain applications.


