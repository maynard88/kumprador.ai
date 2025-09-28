import { Container } from '../infrastructure/container/Container';
import { IOpenAIRepository } from '../domain/interfaces/IOpenAIRepository';
import { PriceData } from '../domain/entities/PriceData';
import { Market } from '../domain/entities/Market';
import { Commodity } from '../domain/entities/Commodity';

/**
 * Example usage of the OpenAI Repository
 * This file demonstrates how to use the OpenAI repository for grocery list generation
 */

export class OpenAIUsageExample {
  private openAIRepository: IOpenAIRepository;

  constructor() {
    const container = Container.getInstance();
    this.openAIRepository = container.get<IOpenAIRepository>('openAIRepository');
  }


  /**
   * Example: Generate grocery list based on current prices and budget
   */
  async generateGroceryList(): Promise<void> {
    try {
      const priceData = [
        new PriceData(
          new Commodity('Rice', 'Premium Quality'),
          [
            new Market('Cebu City Market', 25.50),
            new Market('Mandaue City Market', 26.00),
            new Market('Lapu-Lapu City Market', 24.75)
          ]
        ),
        new PriceData(
          new Commodity('Chicken', 'Whole Chicken'),
          [
            new Market('Cebu City Market', 120.00),
            new Market('Mandaue City Market', 125.00),
            new Market('Lapu-Lapu City Market', 118.00)
          ]
        ),
        new PriceData(
          new Commodity('Cabbage', 'Fresh'),
          [
            new Market('Cebu City Market', 15.00),
            new Market('Mandaue City Market', 16.00),
            new Market('Lapu-Lapu City Market', 14.50)
          ]
        ),
        new PriceData(
          new Commodity('Tomato', 'Fresh'),
          [
            new Market('Cebu City Market', 35.00),
            new Market('Mandaue City Market', 38.00),
            new Market('Lapu-Lapu City Market', 32.00)
          ]
        )
      ];

      const budget = 500;
      const preferences = 'No pork, prefer organic vegetables when possible';

      console.log('🛒 Generating grocery list...');
      const groceryList = await this.openAIRepository.generateGroceryList(priceData, budget, preferences);
      console.log('📋 Grocery List:', groceryList);
    } catch (error) {
      console.error('❌ Error generating grocery list:', error);
    }
  }

  /**
   * Example: Generate grocery list for a family budget
   */
  async generateFamilyGroceryList(): Promise<void> {
    try {
      const priceData = [
        new PriceData(
          new Commodity('Rice', 'Regular Quality'),
          [
            new Market('Cebu City Market', 22.00),
            new Market('Mandaue City Market', 23.00)
          ]
        ),
        new PriceData(
          new Commodity('Chicken', 'Drumsticks'),
          [
            new Market('Cebu City Market', 95.00),
            new Market('Mandaue City Market', 98.00)
          ]
        ),
        new PriceData(
          new Commodity('Egg', 'Fresh'),
          [
            new Market('Cebu City Market', 8.00),
            new Market('Mandaue City Market', 8.50)
          ]
        ),
        new PriceData(
          new Commodity('Cabbage', 'Fresh'),
          [
            new Market('Cebu City Market', 15.00),
            new Market('Mandaue City Market', 16.00)
          ]
        ),
        new PriceData(
          new Commodity('Banana', 'Lakatan'),
          [
            new Market('Cebu City Market', 30.00),
            new Market('Mandaue City Market', 32.00)
          ]
        )
      ];

      const budget = 1000; // ₱1000 for a week
      const preferences = 'Family of 4, nutritious and affordable options';

      console.log('👨‍👩‍👧‍👦 Generating family grocery list...');
      const familyGroceryList = await this.openAIRepository.generateGroceryList(
        priceData,
        budget,
        preferences
      );
      console.log('🛒 Family Grocery List:', familyGroceryList);
    } catch (error) {
      console.error('❌ Error generating family grocery list:', error);
    }
  }

  /**
   * Example: Generate grocery list for a tight budget
   */
  async generateBudgetGroceryList(): Promise<void> {
    try {
      const priceData = [
        new PriceData(
          new Commodity('Rice', 'Regular Quality'),
          [
            new Market('Cebu City Market', 22.00),
            new Market('Mandaue City Market', 23.00)
          ]
        ),
        new PriceData(
          new Commodity('Egg', 'Fresh'),
          [
            new Market('Cebu City Market', 8.00),
            new Market('Mandaue City Market', 8.50)
          ]
        ),
        new PriceData(
          new Commodity('Cabbage', 'Fresh'),
          [
            new Market('Cebu City Market', 15.00),
            new Market('Mandaue City Market', 16.00)
          ]
        ),
        new PriceData(
          new Commodity('Onion', 'Red Onion'),
          [
            new Market('Cebu City Market', 40.00),
            new Market('Mandaue City Market', 42.00)
          ]
        )
      ];

      const budget = 200; // ₱200 tight budget
      const preferences = 'Essential items only, maximize value';

      console.log('💰 Generating budget grocery list...');
      const budgetGroceryList = await this.openAIRepository.generateGroceryList(
        priceData,
        budget,
        preferences
      );
      console.log('🛒 Budget Grocery List:', budgetGroceryList);
    } catch (error) {
      console.error('❌ Error generating budget grocery list:', error);
    }
  }

  /**
   * Run all examples
   */
  async runAllExamples(): Promise<void> {
    console.log('🚀 Starting OpenAI Repository Examples...\n');

    await this.generateGroceryList();
    console.log('\n' + '='.repeat(50) + '\n');

    await this.generateFamilyGroceryList();
    console.log('\n' + '='.repeat(50) + '\n');

    await this.generateBudgetGroceryList();
    console.log('\n✅ All examples completed!');
  }
}

// Example usage (uncomment to run)
// const example = new OpenAIUsageExample();
// example.runAllExamples().catch(console.error);
