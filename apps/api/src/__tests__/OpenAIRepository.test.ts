import { OpenAIRepository } from '../infrastructure/repositories/OpenAIRepository';
import { PriceData } from '../domain/entities/PriceData';
import { Market } from '../domain/entities/Market';
import { Commodity } from '../domain/entities/Commodity';
import { OpenAIConfig } from '../config/openaiConfig';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'Mocked AI response for testing purposes'
                }
              }
            ]
          })
        }
      }
    }))
  };
});

describe('OpenAIRepository', () => {
  let openAIRepository: OpenAIRepository;
  let mockConfig: OpenAIConfig;

  beforeEach(() => {
    mockConfig = {
      apiKey: 'test-api-key',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000,
      temperature: 0.7,
      timeout: 30000,
    };
    openAIRepository = new OpenAIRepository(mockConfig);
  });

  describe('generateGroceryList', () => {
    it('should generate grocery list based on price data and budget', async () => {
      const mockPriceData = [
        new PriceData(
          new Commodity('Rice', 'Premium Quality'),
          [
            new Market('Market A', 25.50),
            new Market('Market B', 26.00),
            new Market('Market C', 24.75)
          ]
        ),
        new PriceData(
          new Commodity('Chicken', 'Whole Chicken'),
          [
            new Market('Market A', 120.00),
            new Market('Market B', 125.00),
            new Market('Market C', 118.00)
          ]
        )
      ];

      const budget = 500;
      const preferences = 'No pork, prefer organic vegetables';

      const result = await openAIRepository.generateGroceryList(mockPriceData, budget, preferences);

      expect(result).toBe('Mocked AI response for testing purposes');
    });

    it('should generate grocery list without preferences', async () => {
      const mockPriceData = [
        new PriceData(
          new Commodity('Rice', 'Premium Quality'),
          [
            new Market('Market A', 25.50),
            new Market('Market B', 26.00)
          ]
        )
      ];

      const budget = 300;

      const result = await openAIRepository.generateGroceryList(mockPriceData, budget);

      expect(result).toBe('Mocked AI response for testing purposes');
    });
  });

});
