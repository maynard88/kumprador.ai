import { PriceData } from '../entities/PriceData';

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ConversationContext {
  messages: ConversationMessage[];
  priceData?: PriceData[];
  budget?: number;
  preferences?: string;
}

export interface IOpenAIRepository {
  /**
   * Generate grocery list based on current prices and budget
   * @param priceData - Current price data from Bantay Presyo
   * @param budget - Fixed budget amount in PHP
   * @param preferences - Optional dietary preferences or restrictions
   * @returns Promise containing optimized grocery list
   */
  generateGroceryList(priceData: PriceData[], budget: number, preferences?: string): Promise<string>;

  /**
   * Process conversation with context and price data
   * @param context - Conversation context including messages and price data
   * @returns Promise containing AI response
   */
  processConversation(context: ConversationContext): Promise<string>;
}
