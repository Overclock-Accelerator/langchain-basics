# 06 - Automated Driving Agent

An interactive autonomous driving simulator demonstrating multi-tool agent coordination with stateful decision-making.

## Overview

This application simulates an autonomous car that uses AI to make driving decisions based on traffic signs and speed limits. The agent coordinates between two tools and maintains car state across multiple interactions.

## Features

- **Interactive Terminal Interface** - Type what signs you see
- **Two Coordinated Tools**:
  - `stop_or_go` - Controls stopping and starting
  - `adjust_speed` - Controls speed changes
- **Stateful Car** - Tracks current speed and status
- **Smart AI Decisions** - Agent analyzes traffic conditions and makes appropriate choices
- **Transparent Tool Calling** - Shows which tool was selected and what parameters were used

## How It Works

### Tools

**Tool 1: Stop or Go**
- Handles red lights (stop)
- Handles green lights (go)
- Used for binary stop/start decisions

**Tool 2: Adjust Speed**
- Handles speed limit changes
- Handles yellow lights (slow down)
- Adjusts target speed based on conditions

### Car State

The car maintains:
- **Current Speed** (mph)
- **Status** (stopped, going, stopping, slowing down, speeding up)
- **Target Speed** (mph)

## Run It

```bash
node 06-AutomatedDriving.mjs
```

## Example Interaction

```
🚗 AUTOMATED DRIVING SIMULATOR 🚗
================================

Tell the car what signs you see!
Examples:
  - "I see a red light"
  - "Green light ahead"
  - "Speed limit 55"
  - "Yellow light approaching"

Type "exit" or "quit" to stop.

==================================================
🚗 CAR STATE: STOPPED
   Current Speed: 0 mph
   Target Speed: 0 mph
==================================================

What sign do you see? green light

📍 Sign detected: "green light"
🤖 Agent is analyzing and deciding...

🔧 Tools Used:
   1. stop_or_go
      Parameters: {
            "action": "go",
            "reason": "green light"
      }

💬 Agent response:
   Car is now GOING. Accelerating from 0 mph to 25 mph.

==================================================
🚗 CAR STATE: GOING
   Current Speed: 25 mph
   Target Speed: 25 mph
==================================================

What sign do you see? speed limit 55

📍 Sign detected: "speed limit 55"
🤖 Agent is analyzing and deciding...

🔧 Tools Used:
   1. adjust_speed
      Parameters: {
            "action": "speed_up",
            "targetSpeed": 55,
            "reason": "speed limit 55"
      }

💬 Agent response:
   Car is SPEEDING UP from 25 mph to 55 mph.

==================================================
🚗 CAR STATE: SPEEDING UP
   Current Speed: 55 mph
   Target Speed: 55 mph
==================================================
```

## Sample Inputs

### Traffic Lights
- `"red light"`
- `"green light"`
- `"yellow light"`
- `"I see a red traffic light ahead"`
- `"The light turned green"`

### Speed Limits
- `"speed limit 25"`
- `"speed limit 55"`
- `"speed limit 75"`
- `"I see a sign that says speed limit 65"`

### Natural Language
The agent understands natural language:
- `"There's a red light coming up"`
- `"The speed limit just changed to 45"`
- `"I see we're approaching a yellow light"`

## Technical Details

### Agent Configuration

```javascript
const agent = createAgent({
  model: "openai:gpt-5-mini",
  tools: [stopOrGo, adjustSpeed],
  systemPrompt: `You are an autonomous driving AI assistant...`
});
```

### Tool Definitions

Both tools use Zod schemas for type-safe parameters:

```javascript
// Stop/Go tool
const stopOrGo = tool(
  ({ action, reason }) => { /* ... */ },
  {
    name: "stop_or_go",
    schema: z.object({
      action: z.enum(["stop", "go"]),
      reason: z.string(),
    }),
  }
);

// Speed adjustment tool
const adjustSpeed = tool(
  ({ action, targetSpeed, reason }) => { /* ... */ },
  {
    name: "adjust_speed",
    schema: z.object({
      action: z.enum(["speed_up", "slow_down"]),
      targetSpeed: z.number(),
      reason: z.string(),
    }),
  }
);
```

## AI Decision Making

The agent follows these rules:
1. **Red Light** → Use `stop_or_go` with `action='stop'`
2. **Green Light** → Use `stop_or_go` with `action='go'`
3. **Yellow Light** → Use `adjust_speed` to slow down
4. **Speed Limit Higher** → Use `adjust_speed` with `action='speed_up'`
5. **Speed Limit Lower** → Use `adjust_speed` with `action='slow_down'`

The agent considers current speed and makes context-aware decisions.

## What This Demonstrates

This example shows:
1. **Multi-Tool Coordination** - Agent chooses between two different tools
2. **Stateful Applications** - Maintaining state between tool calls
3. **Context-Aware Decisions** - Agent considers current car state
4. **Tool Parameter Validation** - Zod schemas ensure correct parameters
5. **Natural Language Understanding** - Flexible input parsing

## LangChain Benefits

LangChain automatically handles:
- **Tool Selection** - AI picks the right tool for each situation
- **Parameter Extraction** - Converts natural language to tool parameters
- **Validation** - Ensures parameters match schemas
- **Execution** - Runs the tool function
- **Response Formatting** - Returns results to the AI for final response

## Requirements

- Node.js 18+
- OpenAI API key in `.env.local`
- LangChain packages installed

## Exit

Type `exit` or `quit` to stop the simulator.

## Related Examples

- **05** - Simple single-tool agent (math)
- **06** (this file) - Multi-tool agent with state
- **07** - Complex multi-tool agent (book recommender)
- **08** - Agent with middleware (tool call limiting)

This demonstrates how agents can coordinate multiple tools while maintaining application state - a common pattern in real-world LangChain applications.


