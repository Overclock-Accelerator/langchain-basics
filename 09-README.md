# Example 09: Web Search with DuckDuckGo

This example demonstrates how to integrate web search capabilities into a LangChain agent using the DuckDuckGo search tool.

## 🎯 What This Example Shows

- **DuckDuckGo Integration**: Using `@langchain/community` package for web search
- **Real-Time Information**: Agent can access current web information
- **Tool Integration**: Seamless integration of search tool with LangChain agent
- **Interactive Chat**: Command-line interface for asking questions

## 📚 Key Concepts

### DuckDuckGo Search Tool

The DuckDuckGo search tool provides privacy-focused web search:

```javascript
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";

const searchTool = new DuckDuckGoSearch({ maxResults: 3 });
```

**Features:**
- Privacy-focused (no tracking)
- Returns structured search results
- Configurable number of results
- Free to use (no API key required)

### Tool Configuration

The search tool accepts a `maxResults` parameter to control how many search results are returned:

```javascript
const searchTool = new DuckDuckGoSearch({ 
  maxResults: 3  // Returns top 3 search results
});
```

### Agent System Prompt

The agent is configured with a system prompt that guides when to use web search:

- Use search for current events and recent information
- Synthesize search results into clear answers
- Cite sources when appropriate
- Answer general knowledge directly without searching when confident

## 🏗️ Code Structure

### Section 1: Tool Setup
- Import and initialize DuckDuckGo search tool
- Configure with `maxResults` parameter
- Display tool information

### Section 2: Agent Construction
- Create agent with search tool
- Define system prompt for search behavior
- Configure with GPT-4o-mini model

### Section 3: Agent Invocation
- Interactive command-line interface
- Display tool usage for each query
- Show search results and agent responses

## 🚀 Running the Example

```bash
node 09-WebSearch.mjs
```

## 💡 Example Queries

Try these types of questions:

**Current Events:**
- "What's the latest news about AI?"
- "What happened in the stock market today?"

**Real-Time Information:**
- "What's the current weather in Paris?"
- "What time is it in Tokyo?"

**Recent Developments:**
- "What's happening with SpaceX?"
- "Tell me about recent tech layoffs"

**Facts & Data:**
- "Who won the latest Nobel Prize?"
- "What are the top movies this week?"

## 🔍 How It Works

1. **User Input**: You ask a question
2. **Agent Decision**: Agent decides if web search is needed
3. **Tool Invocation**: Agent calls DuckDuckGo search tool
4. **Result Processing**: Search results are returned as JSON
5. **Answer Generation**: Agent synthesizes results into a clear answer
6. **Display**: Response and tool usage are shown

## 📦 Dependencies

```json
{
  "@langchain/community": "^1.0.0",
  "duck-duck-scrape": "latest",
  "langchain": "^1.0.2",
  "@langchain/openai": "^1.0.0"
}
```

## 🛠️ Tool Response Format

DuckDuckGo returns results in this format:

```json
[
  {
    "title": "Page Title",
    "link": "https://example.com",
    "snippet": "Brief description of the page content..."
  }
]
```

The agent processes these results and provides a natural language response.

## ⚙️ Configuration Options

### Search Tool Options

```javascript
new DuckDuckGoSearch({ 
  maxResults: 5  // Number of results (default: 5)
});
```

### Model Selection

The example uses GPT-4o-mini, but you can use other models:

```javascript
createAgent({
  model: "openai:gpt-4",  // More powerful
  model: "openai:gpt-3.5-turbo",  // More economical
  // ... other options
});
```

## 🔐 Privacy Note

DuckDuckGo is a privacy-focused search engine:
- No user tracking
- No search history stored
- No personal information required
- No API key needed

## 🎓 Learning Points

1. **Tool Integration**: How to add external tools to LangChain agents
2. **Search Capability**: Giving agents access to real-time web information
3. **Result Processing**: How agents synthesize search results
4. **Interactive Agents**: Building conversational interfaces with tools
5. **System Prompts**: Guiding agent behavior for tool usage

## 🔗 Resources

- [DuckDuckGo Search Documentation](https://docs.langchain.com/oss/javascript/integrations/tools/duckduckgo_search)
- [LangChain Tools Guide](https://docs.langchain.com/)
- [@langchain/community Package](https://www.npmjs.com/package/@langchain/community)

## 🚨 Limitations

- Search results may vary in quality
- Rate limiting may apply for excessive queries
- Results depend on DuckDuckGo's index
- No guarantee of real-time information
- Text-based results only (no images/videos)

## 🎯 Next Steps

After mastering web search, consider:
- Combining multiple tools (search + calculator + database)
- Adding web scraping for deeper content analysis
- Implementing result caching to reduce API calls
- Creating specialized search agents for specific domains
- Adding citation and fact-checking capabilities


