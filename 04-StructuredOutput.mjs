import { config } from "dotenv";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import * as readline from "readline";

config({ path: '.env.local' });

// ═══════════════════════════════════════════════════════════════════════════
// 📋 SECTION 1: OUTPUT FORMAT DEFINITION
// ═══════════════════════════════════════════════════════════════════════════
// 🔷 LANGCHAIN: Zod schema guides AI to generate correct structure and validates response automatically
// All fields required - system prompt instructs AI to use "Unknown" or 0 for missing data
const HistoricalFigure = z.object({
  name: z.string().describe("Full name of the historical figure"),
  birthPlace: z.string().describe("Place of birth (city, country) or 'Unknown'"),
  birthYear: z.number().describe("Year of birth or 0 if unknown"),
  deathYear: z.number().describe("Year of death or 0 if still alive or unknown"),
  description: z.string().describe("3 sentence description of their life and accomplishments"),
});

// ═══════════════════════════════════════════════════════════════════════════
// 🔷 SECTION 2: MODEL DEFINITION
// ═══════════════════════════════════════════════════════════════════════════
// 🔷 LANGCHAIN: withStructuredOutput() method configures the model to return validated structured data
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
}).withStructuredOutput(HistoricalFigure);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ SECTION 3: MODEL INVOCATION
// ═══════════════════════════════════════════════════════════════════════════
rl.question('Enter a historical figure name: ', async (figureName) => {
  console.log('\nGetting biographical data...\n');
  
  // 🔷 LANGCHAIN: Direct model invocation with messages - returns validated structured data
  const result = await model.invoke([
    { 
      role: "system", 
      content: `You are a helpful assistant that provides biographical information about historical figures.
      
IMPORTANT: Always provide ALL fields in the response. If information is not available:
- For birthPlace or other string fields: use "Unknown"
- For birthYear or deathYear: use 0
- If the person is still alive, set deathYear to 0

Always provide a 3 sentence description regardless of available information.`
    },
    { 
      role: "user", 
      content: `Provide biographical information about ${figureName}` 
    }
  ]);
  
  // 🔷 LANGCHAIN: result is the structured data, guaranteed to match Zod schema
  console.log('📋 Structured Response:\n');
  console.log(JSON.stringify(result, null, 2));
  console.log();
  
  rl.close();
});

