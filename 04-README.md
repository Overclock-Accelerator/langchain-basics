# 04 - Structured Output

Simple demonstration of LangChain's structured output feature using `withStructuredOutput()` - getting type-safe, validated JSON responses from language models.

## Overview

Instead of parsing natural language text, LangChain can automatically extract structured data that matches your schema. This example takes a historical figure's name and returns biographical data in a validated JSON format.

## What It Does

Input: Historical figure name (e.g., "Albert Einstein")

Output: Structured JSON with:
- **Name** - Full name
- **Birth Place** - City, country  
- **Birth Year** - Year born
- **Death Year** - Year died (0 if unknown/alive)
- **Description** - 3 sentence biography

## Run It

```bash
node 04-StructuredOutput.mjs
```

## Example

```bash
Enter a historical figure name: Marie Curie

Getting biographical data...

📋 Structured Response:

{
  "name": "Marie Curie",
  "birthPlace": "Warsaw, Poland",
  "birthYear": 1867,
  "deathYear": 1934,
  "description": "Marie Curie was a pioneering physicist and chemist who conducted groundbreaking research on radioactivity. She was the first woman to win a Nobel Prize and remains the only person to win Nobel Prizes in two different sciences (Physics and Chemistry). Her work led to the development of X-ray machines and advanced our understanding of atomic structure."
}
```

## Key LangChain Features

### 1. Zod Schema Definition

```javascript
const HistoricalFigure = z.object({
  name: z.string().describe("Full name of the historical figure"),
  birthPlace: z.string().describe("Place of birth (city, country) or 'Unknown'"),
  birthYear: z.number().describe("Year of birth or 0 if unknown"),
  deathYear: z.number().describe("Year of death or 0 if still alive or unknown"),
  description: z.string().describe("3 sentence description of their life and accomplishments"),
});
```

**Benefits:**
- Type-safe schema definition
- AI sees descriptions and generates correct structure
- Automatic validation

### 2. withStructuredOutput Method

```javascript
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
}).withStructuredOutput(HistoricalFigure);
```

**Benefits:**
- Configures model to return validated structured data
- Uses OpenAI's native structured output feature
- No parsing or validation needed

### 3. Direct Invocation

```javascript
const result = await model.invoke([
  { role: "system", content: "You are a helpful assistant..." },
  { role: "user", content: "Provide biographical information about Marie Curie" }
]);
```

**Benefits:**
- Result is already validated against schema
- Guaranteed to match your Zod schema
- No need to check or parse response

## Without LangChain

To achieve the same result without LangChain, you'd need to:

1. **Craft complex prompts** asking for JSON format
2. **Parse text response** to extract JSON
3. **Handle malformed JSON** with try/catch
4. **Manually validate** against your schema
5. **Retry logic** when validation fails
6. **Error handling** for missing fields

With LangChain, it's just: define schema → pass to `withStructuredOutput()` → get validated data.

## Error Handling

The system prompt instructs the AI to provide all fields:
- If information is not available, use "Unknown" for strings
- Use 0 for unknown/missing numeric values
- Always provide a description regardless of available information

This ensures the response always matches the required schema structure.

## Try Different Figures

- `"Albert Einstein"`
- `"Leonardo da Vinci"`
- `"Cleopatra"`
- `"Nikola Tesla"`
- `"Ada Lovelace"`
- `"Nelson Mandela"`

Each returns structured, validated biographical data.

## Use Cases

**Structured output is perfect for:**
- Extracting data from text
- Form filling from natural language
- Data validation and normalization
- API integrations requiring JSON
- Database insertions

## Requirements

- Node.js 18+
- OpenAI API key in `.env.local`
- LangChain packages and Zod installed

## Related Examples

- **01** - Simple model invocation
- **02** - Model streaming
- **03** - Batch invocation
- **04** (this file) - Structured output
- **05-08** - Agents with tools

This demonstrates one of LangChain's most powerful features - turning unstructured LLM responses into reliable, type-safe data structures.
