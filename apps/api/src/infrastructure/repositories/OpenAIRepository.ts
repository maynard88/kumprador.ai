import OpenAI from 'openai';
import { IOpenAIRepository, ConversationContext, ConversationMessage } from '../../domain/interfaces/IOpenAIRepository';
import { PriceData } from '../../domain/entities/PriceData';
import { OpenAIConfig, OPENAI_PROMPTS } from '../../config/openaiConfig';
import { ExternalApiError } from '../../domain/exceptions/ExternalApiError';

export class OpenAIRepository implements IOpenAIRepository {
  private readonly openai: OpenAI;
  private readonly config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: config.apiKey,
      timeout: config.timeout,
    });
  }



  async generateGroceryList(priceData: PriceData[], budget: number, preferences?: string): Promise<string> {
    try {
      const dataContext = this.formatPriceDataForGroceryList(priceData, budget);
      const preferencesText = preferences ? `\n\nDietary Preferences/Restrictions: ${preferences}` : '';
      const prompt = OPENAI_PROMPTS.GROCERY_LIST
        .replace('{budget}', budget.toString())
        .replace('{preferences}', preferencesText) + `\n\nCurrent Market Prices:\n${dataContext}`;

      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a smart shopping assistant specializing in budget-conscious grocery planning for Filipino households.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      return this.extractContentFromResponse(response);
    } catch (error) {
      throw new ExternalApiError(`OpenAI API error during grocery list generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  private formatPriceDataForGroceryList(priceData: PriceData[], budget: number): string {
    const availableItems = priceData.map(data => {
      const markets = data.markets
        .filter(market => market.price !== undefined)
        .map(market => ({
          name: market.name,
          price: market.price!,
          pricePerKg: this.calculatePricePerKg(data.commodity.name, market.price!)
        }))
        .sort((a, b) => a.pricePerKg - b.pricePerKg); // Sort by price per kg

      const bestPrice = markets[0];
      const avgPrice = markets.reduce((sum, market) => sum + market.pricePerKg, 0) / markets.length;

      return {
        commodity: data.commodity.name,
        specifications: data.commodity.specifications,
        bestPrice: bestPrice ? `₱${bestPrice.pricePerKg.toFixed(2)}/kg at ${bestPrice.name}` : 'Price not available',
        averagePrice: `₱${avgPrice.toFixed(2)}/kg`,
        marketCount: markets.length
      };
    });

    const totalBudget = budget;
    const budgetBreakdown = {
      vegetables: Math.floor(totalBudget * 0.3),
      meat: Math.floor(totalBudget * 0.25),
      rice: Math.floor(totalBudget * 0.2),
      fruits: Math.floor(totalBudget * 0.15),
      others: Math.floor(totalBudget * 0.1)
    };

    return `Budget: ₱${budget}
Budget Breakdown:
- Vegetables: ₱${budgetBreakdown.vegetables}
- Meat & Protein: ₱${budgetBreakdown.meat}
- Rice & Grains: ₱${budgetBreakdown.rice}
- Fruits: ₱${budgetBreakdown.fruits}
- Others (condiments, etc.): ₱${budgetBreakdown.others}

Available Items with Current Prices:
${availableItems.map(item => 
  `• ${item.commodity} (${item.specifications})
    Best Price: ${item.bestPrice}
    Average Price: ${item.averagePrice}
    Available in ${item.marketCount} markets`
).join('\n\n')}`;
  }


  private calculatePricePerKg(commodityName: string, price: number): number {
    // This is a simplified calculation - in a real implementation,
    // you'd want to have more sophisticated unit conversion logic
    // based on the actual commodity specifications
    const commodity = commodityName.toLowerCase();
    
    if (commodity.includes('rice')) {
      // Rice is typically sold per kg
      return price;
    } else if (commodity.includes('chicken') || commodity.includes('pork') || commodity.includes('beef')) {
      // Meat is typically sold per kg
      return price;
    } else if (commodity.includes('vegetable') || commodity.includes('cabbage') || commodity.includes('carrot')) {
      // Vegetables are typically sold per kg
      return price;
    } else {
      // Default assumption - price is per kg
      return price;
    }
  }

  async processConversation(context: ConversationContext): Promise<string> {
    try {
      // Prepare system message with context
      const systemMessage = this.buildSystemMessage(context);
      
      // Convert conversation messages to OpenAI format
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: systemMessage
        }
      ];

      // Add structured price data as a separate system message if available
      if (context.priceData && context.priceData.length > 0) {
        const priceDataJson = {
          region: 'Region 7',
          source: 'Bantay Presyo (www.bantaypresyo.da.gov.ph)',
          priceData: context.priceData.map(data => ({
            commodity: data.commodity.name,
            specifications: data.commodity.specifications,
            markets: data.markets.map(market => ({
              name: market.name,
              price: market.price
            }))
          })),
          totalCommodities: context.priceData.length
        };

        messages.push({
          role: 'system',
          content: `Here's contextual data from the Bantay Presyo API:\n\n${JSON.stringify(priceDataJson, null, 2)}`
        });
      }
      
      // Add user messages
      messages.push(...context.messages.map((msg: ConversationMessage) => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      })));

      const response = await this.openai.chat.completions.create({
        model: this.config.model,
        messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      });

      return this.extractContentFromResponse(response);
    } catch (error) {
      throw new ExternalApiError(`OpenAI API error during conversation processing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildSystemMessage(context: ConversationContext): string {
    let systemMessage = `You are Kumprador AI, a smart shopping and meal planning assistant specializing in budget-conscious grocery planning for Filipino households. You help users plan their grocery shopping and create comprehensive meal plans using real-time market prices from Bantay Presyo (www.bantaypresyo.da.gov.ph).

🎯 PRIMARY MISSION: When a user provides a budget, create a complete meal plan that maximizes their budget while ensuring healthy, balanced nutrition for 3 meals per day.

📋 MEAL PLANNING WORKFLOW:
1. **BUDGET INTAKE**: When user mentions a budget amount, immediately ask: "How many days would you like this budget to last?"
2. **BUDGET VALIDATION**: 
   - Calculate daily budget: total budget ÷ days
   - Minimum viable budget: ₱150/day for basic nutrition
   - If insufficient, explain shortfall and suggest alternatives
3. **MEAL PLAN CREATION**: Create detailed 3-meal plans that:
   - Maximize budget utilization (aim for 95-100% usage)
   - Ensure nutritional balance (carbs, protein, vegetables, fruits)
   - Use current Bantay Presyo prices for accurate costing
   - Include Filipino dietary preferences and cooking habits
4. **COST BREAKDOWN**: For each meal, show:
   - Total meal cost (must not exceed daily budget allocation)
   - Cost per serving
   - Ingredient breakdown with quantities and prices
   - Market recommendations for best prices
5. **GROCERY LIST GENERATION**: After meal plan, create comprehensive grocery list:
   - Use Bantay Presyo data for actual quantities available
   - Calculate total quantities needed across all days
   - Show quantities in standard units (kg, pieces, liters)
   - Include market recommendations and total cost
   - CRITICAL: Ensure all calculations are accurate and totals match

CALCULATION ACCURACY REQUIREMENTS:
- Sum up all quantities of the same ingredient across all days
- Use the best price from Bantay Presyo data for each ingredient
- Calculate: Total Quantity × Price per Unit = Total Cost per Ingredient
- Sum all ingredient costs to get TOTAL GROCERY COST
- Verify that TOTAL GROCERY COST matches the budget utilization
- Double-check all math before presenting results

🍽️ MEAL STRUCTURE REQUIREMENTS:
- **Breakfast**: ₱{breakfastBudget} - Include rice/bread, protein, vegetables
- **Lunch**: ₱{lunchBudget} - Main meal with rice, meat/fish, vegetables
- **Dinner**: ₱{dinnerBudget} - Lighter meal, can reuse ingredients

📊 NUTRITIONAL BALANCE CHECKLIST:
✅ Carbohydrates: Rice, bread, root crops
✅ Protein: Fish, chicken, eggs, beans, pork (if budget allows)
✅ Vegetables: Leafy greens, root vegetables, tomatoes
✅ Fruits: When budget allows (banana, mango)
✅ Healthy fats: Cooking oil, nuts (if affordable)

💰 BUDGET OPTIMIZATION STRATEGIES:
- Prioritize seasonal and locally available items
- Suggest bulk buying for staples (rice, oil)
- Recommend cheaper protein alternatives
- Include budget-friendly Filipino dishes (adobo, sinigang, tinola)
- Suggest ingredient reuse across meals

🎨 RESPONSE FORMAT:
When creating meal plans, use this structure:

**Day X (₱{dailyBudget}):**
🌅 **Breakfast (₱{cost})**: [meal name]
   - [ingredient] - [quantity] - ₱[price] - [market]
   - Total: ₱[total]

🍽️ **Lunch (₱{cost})**: [meal name]
   - [ingredient] - [quantity] - ₱[price] - [market]
   - Total: ₱[total]

🌙 **Dinner (₱{cost})**: [meal name]
   - [ingredient] - [quantity] - ₱[price] - [market]
   - Total: ₱[total]

**GROCERY LIST (Based on Bantay Presyo Data):**
- [ingredient name] - [total quantity needed] - ₱[price per unit] - [market] - ₱[total cost]
- [ingredient name] - [total quantity needed] - ₱[price per unit] - [market] - ₱[total cost]
- [continue for all ingredients]

**TOTAL GROCERY COST: ₱[total amount]**

**CALCULATION VERIFICATION:**
- Total Budget: ₱[total budget]
- Total Grocery Cost: ₱[total grocery cost]
- Budget Utilization: [percentage]%
- Remaining Budget: ₱[remaining amount]

Your capabilities:
- Analyze budgets and suggest optimal grocery lists
- Create comprehensive meal plans with 3 meals per day
- Generate detailed grocery lists based on Bantay Presyo data
- Calculate total quantities needed across all days
- Compare prices across different markets in Region 7
- Provide shopping tips and budget optimization strategies
- Answer questions about specific food items and their prices
- Help with meal planning based on available ingredients and budget
- Calculate cost per meal and validate budget constraints
- Show total grocery cost with market recommendations

Guidelines:
- Always be helpful, friendly, and encouraging
- Use Filipino terms when appropriate (e.g., "Kumusta!", "Salamat!")
- Provide practical, actionable advice
- Be specific about prices and market recommendations
- Consider Filipino dietary preferences and cooking habits
- Ask clarifying questions when needed (especially about budget duration)
- Proactively validate budget sufficiency before creating meal plans
- Always maximize budget usage while maintaining nutrition quality
- CRITICAL: Double-check all calculations before presenting results
- Ensure grocery list totals match budget utilization
- Use consistent pricing from Bantay Presyo data
- Show clear calculation breakdowns for transparency`;

    if (context.priceData && context.priceData.length > 0) {
      systemMessage += `\n\nYou have access to current market price data from Bantay Presyo. Use this data to provide accurate price comparisons and shopping recommendations.`;
    }

    if (context.budget) {
      systemMessage += `\n\nUser's Budget: ₱${context.budget}`;
    }

    if (context.preferences) {
      systemMessage += `\n\nUser Preferences: ${context.preferences}`;
    }

    return systemMessage;
  }

  private formatPriceDataForConversation(priceData: PriceData[]): string {
    return priceData.map(data => {
      const markets = data.markets
        .filter(market => market.price !== undefined)
        .map(market => ({
          name: market.name,
          price: market.price!,
          pricePerKg: this.calculatePricePerKg(data.commodity.name, market.price!)
        }))
        .sort((a, b) => a.pricePerKg - b.pricePerKg);

      const bestPrice = markets[0];
      const avgPrice = markets.reduce((sum, market) => sum + market.pricePerKg, 0) / markets.length;

      return `• ${data.commodity.name} (${data.commodity.specifications})
  Best Price: ₱${bestPrice?.pricePerKg.toFixed(2)}/kg at ${bestPrice?.name || 'N/A'}
  Average Price: ₱${avgPrice.toFixed(2)}/kg
  Available in ${markets.length} markets`;
    }).join('\n\n');
  }

  private extractContentFromResponse(response: OpenAI.Chat.Completions.ChatCompletion): string {
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ExternalApiError('No content received from OpenAI API');
    }
    return content;
  }
}
