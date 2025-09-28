import { PriceData } from '../entities/PriceData';

export interface IOpenAIRepository {
  /**
   * Generate grocery list based on current prices and budget
   * @param priceData - Current price data from Bantay Presyo
   * @param budget - Fixed budget amount in PHP
   * @param preferences - Optional dietary preferences or restrictions
   * @returns Promise containing optimized grocery list
   */
  generateGroceryList(priceData: PriceData[], budget: number, preferences?: string): Promise<string>;
}
