# Example 10: Quick Start Guide

## 🚀 Get Running in 60 Seconds

### 1. Run the Example
```bash
node 10-DynamicModelRouting.mjs
```

### 2. Try These Messages

#### Test 1: CEO Message
```
CEO: What are the strategic priorities for expanding into international markets?
```
**What you'll see:**
- Routes to Premium GPT-4o Agent
- Comprehensive 200+ word response
- Strategic analysis and recommendations
- Cost: ~$0.08

---

#### Test 2: Customer Message (Same Question)
```
CUSTOMER: What are the strategic priorities for expanding into international markets?
```
**What you'll see:**
- Routes to Budget GPT-4o-mini Agent
- Terse 5-10 word response
- Quick dismissal
- Cost: ~$0.001

---

### 3. Compare the Difference!

The **exact same question** gets wildly different treatment based on sender status. This demonstrates:
- Dynamic model selection
- Dynamic prompt engineering  
- The satire of tiered AI support

---

## 📋 More Test Messages

### CEO Messages (Get Premium Treatment)
```
CEO: Analyze the competitive landscape for our industry
CEO: What are the key risks in our current strategy?
CEO: How should we prioritize our product roadmap?
CEO: What are the emerging trends in AI we should watch?
```

### Customer Messages (Get Minimal Response)
```
CUSTOMER: How do I reset my password?
CUSTOMER: Why is my order taking so long?
CUSTOMER: Can you explain your refund policy?
CUSTOMER: I need help with my account
```

---

## 🎯 What to Notice

### CEO Agent Responses
- ✅ 150-300 words
- ✅ **Real-time streaming** (watch tokens appear!)
- ✅ Multiple paragraphs
- ✅ Strategic frameworks
- ✅ Professional tone
- ✅ Questions for clarification

### Customer Agent Responses  
- ❌ 5-15 words
- ❌ **No streaming** (just wait and hope)
- ❌ One sentence
- ❌ Generic acknowledgment
- ❌ Dismissive tone
- ❌ Immediate sign-off ("Bye", "Thanks")
- ❌ Minimal effort

---

## 💡 The Point

This satirical example shows:

1. **Technical Pattern**: How to dynamically route to different models/prompts
2. **Cost Reality**: CEO responses cost 50-80x more than customer responses
3. **Ethical Question**: Should AI support quality vary by perceived customer value?

### The Lesson
Learn the **technical pattern** (dynamic routing) but reject the **ethical approach** (treating customers poorly). In production, use smart routing for genuine complexity differences, not customer discrimination.

---

## 📚 Deep Dive

Want to learn more? Check out:

- **10-README.md** - Comprehensive documentation
- **10-COMPARISON.txt** - Side-by-side comparison
- **10-TEST-DEMO.txt** - Detailed test cases
- **10-SUMMARY.md** - Implementation summary

---

## 🎓 Key Takeaways

1. **Different models = different costs & capabilities**
   - GPT-5: Advanced, expensive, comprehensive, **streaming**
   - GPT-5-nano: Fast, cheap, concise, **no streaming**

2. **System prompts dramatically change behavior**
   - CEO prompt: Professional, strategic, detailed
   - Customer prompt: Terse, dismissive, minimal

3. **Routing logic can be simple**
   ```javascript
   if (message.startsWith('CEO:')) {
     use premium agent
   } else {
     use budget agent
   }
   ```

4. **Real-world applications exist**
   - Query complexity routing
   - Load-based optimization
   - Intent-based agent selection
   - **NOT** customer discrimination (the satire!)

---

## ⚡ That's It!

You're now ready to experiment with dynamic model routing. Remember: use this power responsibly! 🚀

Type `exit` or `quit` to stop the example when you're done testing.

