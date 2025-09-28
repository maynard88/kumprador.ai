import OpenAI from 'openai';
import { IOpenAIRepository } from '../../domain/interfaces/IOpenAIRepository';
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

  private extractContentFromResponse(response: OpenAI.Chat.Completions.ChatCompletion): string {
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ExternalApiError('No content received from OpenAI API');
    }
    return content;
  }
}
