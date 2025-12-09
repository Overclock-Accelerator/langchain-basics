# Example 10: Dynamic Model & Prompt Routing

## 🎭 AI Customer Support: The Honest Version™

A humorous demonstration of dynamic model and prompt switching based on message sender. This example satirizes AI-driven customer support by showing the stark difference between how messages are handled based on sender status.

## Overview

This example demonstrates:
- **Dynamic Model Selection**: Different AI models based on message prefix
- **Dynamic System Prompts**: Completely different agent behavior based on context
- **Conditional Routing**: Parsing message prefixes to determine agent configuration
- **Production Reality**: A satirical take on resource allocation in AI support systems

## Key Concepts

### 1. Model Routing
Messages are routed to different AI models based on sender:
- **CEO Tier**: Uses `gpt-5` (advanced, expensive model) with **real-time streaming**
- **Customer Tier**: Uses `gpt-5-nano` (budget, cost-optimized model) with basic invoke

### 2. Prompt Engineering & Experience
Each agent has a completely different system prompt and user experience:
- **CEO Agent**: Sophisticated, detailed, strategic responses with **real-time streaming**
- **Customer Agent**: Terse, dismissive, minimal-effort responses (no streaming, just wait)

### 3. The Satire
This example exaggerates the real-world phenomenon where:
- High-value clients receive premium AI treatment
- Regular customers get bare-minimum automated responses
- Cost optimization trumps customer experience
- "AI-driven support" becomes a euphemism for "automated dismissal"

## Usage

### Running the Example
```bash
node 10-DynamicModelRouting.mjs
```

### Message Format
Prefix your messages with `CEO:` or `CUSTOMER:`:

```
CEO: What are our Q4 strategic priorities?
CUSTOMER: What are your Q4 strategic priorities?

CEO: Analyze market conditions for expansion
CUSTOMER: Why is my order late?

CEO: I need a comprehensive risk assessment
CUSTOMER: How do I reset my password?
```

## Example Interaction

### CEO Message
```
Your message: CEO: What should we focus on for product development?

═══════════════════════════════════════════════════════════
🎩 DETECTED: C-SUITE EXECUTIVE
🚀 Routing to: Premium Agent
💰 Cost per token: $$$
🎯 Priority: MAXIMUM
⏱️  Expected response: Comprehensive & Detailed
═══════════════════════════════════════════════════════════

🤖 AI RESPONSE (Streaming):
Based on current market dynamics and competitive landscape, I recommend 
focusing on three strategic pillars for product development:

1. **User Experience Innovation**: Invest in advanced personalization 
   capabilities leveraging machine learning to predict user needs...
   
2. **Platform Integration**: Develop robust API infrastructure to enable 
   seamless third-party integrations, creating an ecosystem effect...
   
3. **Security & Compliance**: Given increasing regulatory scrutiny, 
   prioritize SOC2 compliance and enhanced data protection features...

[200+ more words of detailed strategic analysis]

💰 Cost Analysis: ~$0.08 for this response
📊 Words generated: 247
✨ Quality: Executive-grade insights
⚡ Experience: Real-time streaming
🎯 Satisfaction guaranteed: YES
```

### Customer Message
```
Your message: CUSTOMER: What should I focus on for product development?

═══════════════════════════════════════════════════════════
😐 DETECTED: Regular Customer
🐌 Routing to: Budget Agent
💰 Cost per token: ¢
🎯 Priority: Minimum Viable Response
⏱️  Expected response: Terse & Dismissive
═══════════════════════════════════════════════════════════

🤖 AI RESPONSE:
Check our blog. Lots of tips. Bye!

💰 Cost Analysis: ~$0.001 for this response
📊 Words generated: 7
✨ Quality: Technically answered the question
⚡ Experience: Basic invoke (no streaming)
🎯 Satisfaction guaranteed: "Please see FAQ"
```

## Code Structure

### Section 1: Dual Agent Configuration
```javascript
// Premium agent for executives
const ceoAgent = createAgent({
  model: "openai:gpt-5",
  systemPrompt: `Sophisticated, strategic, detail-oriented...`
});

// Budget agent for customers
const customerAgent = createAgent({
  model: "openai:gpt-5-nano",
  systemPrompt: `Overworked, minimal effort, rush to end...`
});
```

### Section 2: Message Routing Logic
```javascript
async function routeMessage(userInput) {
  // Parse prefix (CEO: or CUSTOMER:)
  // Route to appropriate agent
  // CEO gets streaming, customers get basic invoke
  if (messageType === 'CEO') {
    // Stream response in real-time
    for await (const chunk of stream) { ... }
  } else {
    // Basic invoke (no streaming)
    const response = await agent.invoke(...);
  }
}
```

### Section 3: Interactive Demo
```javascript
// Interactive readline interface
// Displays routing decisions
// Shows cost analysis
// Provides humorous commentary
```

## Technical Details

### Model Selection Strategy
```
CEO Message    →  gpt-5        (Premium model + real-time streaming)
Customer Msg   →  gpt-5-nano   (Budget model + basic invoke)
```

### Prompt Engineering Contrast

**CEO System Prompt:**
- Professional, executive language
- Comprehensive analysis requested
- Strategic recommendations expected
- Data-driven insights prioritized
- No word limits

**Customer System Prompt:**
- Terse, bare-minimum responses
- 5-15 word maximum
- Immediate conversation termination
- Generic acknowledgments
- "Technically helpful" but dismissive

### Cost Analysis (Approximate)
```
CEO Response (250 words):    $0.05 - $0.15
Customer Response (8 words): $0.001 - $0.003

Ratio: ~50x cost difference
```

## Real-World Applications

While this example is satirical, the underlying pattern has legitimate uses:

### 1. Tiered Support Systems
- Free tier: Basic model, standard responses
- Premium tier: Advanced model, detailed assistance
- Enterprise tier: Best model, custom fine-tuning

### 2. Query Complexity Routing
- Simple FAQs: Fast, cheap model
- Complex problems: Advanced model
- Technical issues: Specialized model

### 3. Resource Optimization
- Off-peak hours: Advanced models
- Peak traffic: Budget models
- Critical queries: Premium routing

### 4. Intent-Based Routing
- Sales inquiries: Persuasive model
- Support tickets: Empathetic model
- Billing questions: Precise, factual model

## Extension Ideas

### 1. Multiple Tiers
Add more sender categories:
```javascript
VIP: gpt-4o + ultra-detailed responses
CEO: gpt-4o + strategic focus
Manager: gpt-4o-mini + professional tone
Customer: gpt-4o-mini + quick responses
Free Tier: gpt-3.5-turbo + minimal effort
```

### 2. Sentiment Analysis
Route based on detected frustration:
```javascript
Happy customer → standard agent
Angry customer → premium agent (damage control)
```

### 3. Query Complexity Detection
Automatically determine routing:
```javascript
Simple question → budget model
Complex question → advanced model
```

### 4. Time-Based Routing
Adjust based on system load:
```javascript
Low traffic → everyone gets premium
High traffic → tiered routing activated
```

## LangChain Concepts Demonstrated

### ✅ Dynamic Model Selection
Choosing different models at runtime based on context

### ✅ System Prompt Engineering
Drastically different agent behavior through prompt design

### ✅ Streaming vs. Non-Streaming Responses
CEO agent uses streaming for real-time token delivery, customer agent uses basic invoke

### ✅ Multi-Agent Systems
Managing multiple agents with different capabilities

### ✅ Conditional Routing
Programmatic decision-making for agent selection

### ✅ Cost Optimization
Balancing performance vs. resource consumption

## The Reality Check

This example exaggerates for comedic effect, but reflects real tensions:

**The Good:**
- Cost optimization enables broader service availability
- Smart routing can improve response times
- Different queries genuinely need different capabilities

**The Bad:**
- Creates tiered service quality
- Regular customers feel devalued
- "AI support" becomes synonymous with "no real support"

**The Balance:**
- Use routing for genuine complexity differences
- Maintain minimum quality standards for all tiers
- Be transparent about service levels
- Invest in making "basic" still genuinely helpful

## Educational Value

This example teaches:
1. How to implement dynamic model selection
2. The impact of system prompt design
3. Practical considerations for multi-agent systems
4. Real-world trade-offs in AI deployment
5. The importance of treating all users well (even if it costs more)

## Running the Example

```bash
# Install dependencies (if not already installed)
npm install

# Ensure .env.local exists with your API key
echo "OPENAI_API_KEY=your-key-here" > .env.local

# Run the example
node 10-DynamicModelRouting.mjs

# Try different prefixes
CEO: Tell me about AI trends
CUSTOMER: Tell me about AI trends
```

## Sample Test Cases

```bash
# Strategic business question
CEO: What are the key considerations for international expansion?

# Same question as customer
CUSTOMER: What are the key considerations for international expansion?

# Technical query
CEO: How should we architect our microservices?
CUSTOMER: How do I change my email?

# Request for analysis
CEO: Analyze the competitive landscape
CUSTOMER: Why is this so expensive?
```

## Key Takeaways

1. **Model selection matters**: Different models have different strengths
2. **Prompts define behavior**: System prompts dramatically shape responses
3. **Context enables customization**: Routing based on user type is powerful
4. **Ethics matter**: Just because you *can* treat customers differently doesn't mean you *should*
5. **Balance is key**: Cost optimization shouldn't come at the expense of genuine helpfulness

## Next Steps

After completing this example, consider:
- Implementing middleware-based routing (more elegant than separate agents)
- Adding conversation history tracking across multiple exchanges
- Building sentiment analysis to automatically escalate frustrated customers
- Creating a hybrid system that starts with budget model but upgrades if needed
- Exploring LangGraph for more sophisticated agent orchestration

---

*Remember: This example is intentionally satirical. In production, always strive to provide quality service to all users, regardless of their "tier." Good customer service isn't a bug—it's a feature.*

