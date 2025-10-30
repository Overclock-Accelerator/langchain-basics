import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import * as readline from "readline";

// Model provider configurations
const MODEL_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      { id: 'gpt-5', name: 'GPT-5', provider: 'openai' },
      { id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'openai' },
      { id: 'gpt-5-nano', name: 'GPT-5 Nano', provider: 'openai' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      { id: 'claude-sonnet-4.5', name: 'Claude Sonnet 4.5', provider: 'anthropic' },
      { id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', provider: 'anthropic' },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    models: [
      { id: 'x-ai/grok-4-fast', name: 'Grok 4 Fast', provider: 'openrouter' },
      { id: 'deepseek/deepseek-v3.2-exp', name: 'DeepSeek V3.2', provider: 'openrouter' },
      { id: 'z-ai/glm-4.6', name: 'GLM 4.6', provider: 'openrouter' },
    ],
  },
];

// Get all models in a flat list
const getAllModels = () => {
  return MODEL_PROVIDERS.flatMap(provider =>
    provider.models.map(model => ({
      model,
      providerName: provider.name,
    }))
  );
};

// Create readline interface
const createInterface = () => {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
};

// Display menu
const displayMenu = (models) => {
  console.log('\n=== Model Selection Menu ===\n');
  models.forEach((item, index) => {
    console.log(`${index + 1}. [${item.providerName}] ${item.model.name}`);
  });
  console.log('\n0. Exit\n');
};

// Get user selection
const getUserSelection = (rl, maxChoice) => {
  return new Promise((resolve) => {
    rl.question('Select a model (enter number): ', (answer) => {
      const choice = parseInt(answer.trim());
      if (isNaN(choice) || choice < 0 || choice > maxChoice) {
        console.log('Invalid selection. Please try again.');
        resolve(-1);
      } else {
        resolve(choice);
      }
    });
  });
};

// Get prompt from user
const getPrompt = (rl) => {
  return new Promise((resolve) => {
    rl.question('\nEnter your prompt (or press Enter for default): ', (answer) => {
      const prompt = answer.trim();
      resolve(prompt || 'Hello! Please introduce yourself and tell me what you can do.');
    });
  });
};

// Create the appropriate chat model
const createChatModel = (model) => {
  switch (model.provider) {
    case 'openai':
      return new ChatOpenAI({
        model: model.id,
        apiKey: process.env.OPENAI_API_KEY,
        temperature: 0.7,
      });

    case 'anthropic':
      return new ChatAnthropic({
        model: model.id,
        apiKey: process.env.ANTHROPIC_API_KEY,
        temperature: 0.7,
      });

    case 'openrouter':
      return new ChatOpenAI({
        model: model.id,
        configuration: {
          apiKey: process.env.OPENROUTER_API_KEY,
          baseURL: 'https://openrouter.ai/api/v1',
        },
        temperature: 0.7,
      });

    default:
      throw new Error(`Unsupported provider: ${model.provider}`);
  }
};

// Main function
const main = async () => {
  const models = getAllModels();
  const rl = createInterface();

  try {
    while (true) {
      displayMenu(models);

      const choice = await getUserSelection(rl, models.length);

      if (choice === -1) {
        continue;
      }

      if (choice === 0) {
        console.log('\nExiting...');
        break;
      }

      const selectedItem = models[choice - 1];
      const selectedModel = selectedItem.model;

      console.log(`\nSelected: [${selectedItem.providerName}] ${selectedModel.name}`);

      // Check for required API key
      const envVar = `${selectedModel.provider.toUpperCase()}_API_KEY`;
      if (!process.env[envVar]) {
        console.error(`\n❌ Error: ${envVar} environment variable is not set.`);
        console.log(`Please set ${envVar} before using this model.\n`);
        continue;
      }

      // Get prompt from user
      const prompt = await getPrompt(rl);

      console.log(`\n📝 Prompt: "${prompt}"`);
      console.log('\n🤖 Invoking model...\n');

      try {
        // Create and invoke the model
        const chatModel = createChatModel(selectedModel);
        const response = await chatModel.invoke(prompt);

        console.log('─'.repeat(60));
        console.log('RESPONSE:');
        console.log('─'.repeat(60));
        console.log(response.content);
        console.log('─'.repeat(60));
        console.log(`\n✅ Model invoked successfully!`);

        // Display metadata if available
        if (response.response_metadata) {
          console.log('\n📊 Response Metadata:');
          console.log(JSON.stringify(response.response_metadata, null, 2));
        }

      } catch (error) {
        console.error(`\n❌ Error invoking model: ${error.message}`);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      }

      console.log('\n' + '='.repeat(60) + '\n');
    }
  } finally {
    rl.close();
  }
};

// Run the application
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

