export interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
}

export const defaultOpenAIConfig: OpenAIConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
  timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
};

export const OPENAI_PROMPTS = {
  GROCERY_LIST: `You are a smart shopping assistant specializing in budget-conscious grocery planning for Filipino households.
  Based on current market prices from Bantay Presyo, create an optimized grocery list that:
  1. Stays within the specified budget (₱{budget})
  2. Includes essential food items for a balanced diet
  3. Prioritizes items with the best value (lowest prices per unit)
  4. Suggests quantities based on typical household consumption
  5. Includes both fresh produce and pantry staples
  6. Considers Filipino dietary preferences and cooking habits
  7. Provides alternative options if primary choices exceed budget
  8. Includes estimated total cost breakdown

  Format the response as a practical shopping list with:
  - Item name and specifications
  - Quantity needed
  - Price per unit and total cost
  - Recommended market/store
  - Budget allocation percentage

  {preferences}`
};
