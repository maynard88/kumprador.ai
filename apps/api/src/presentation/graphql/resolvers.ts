import { GetPriceDataUseCase } from '../../application/use-cases/GetPriceDataUseCase';
import { ProcessConversationUseCase } from '../../application/use-cases/ProcessConversationUseCase';
import { AuthenticatedRequest } from '../../middleware/apiKeyAuth';
import { sanitizeInput } from '../../middleware/inputValidator';
import { AppError } from '../../middleware/errorHandler';

export interface Context {
  getPriceDataUseCase: GetPriceDataUseCase;
  processConversationUseCase: ProcessConversationUseCase;
  isAuthenticated: boolean;
  req: AuthenticatedRequest;
}

export const resolvers = {
  Query: {
    syncDTIPriceData: async (_: any, { input }: any, { getPriceDataUseCase }: Context) => {
      try {
        // Validate and sanitize input
        if (!input || typeof input !== 'object') {
          throw new AppError('Invalid input provided', 400);
        }

        const sanitizedInput = sanitizeInput(input);
        
        // Validate required fields
        if (!sanitizedInput.region || typeof sanitizedInput.region !== 'string') {
          throw new AppError('Region is required and must be a string', 400);
        }
        
        if (!sanitizedInput.count || typeof sanitizedInput.count !== 'number') {
          throw new AppError('Count is required and must be a number', 400);
        }

        // Validate region format (9-digit string)
        if (!/^[0-9]{9}$/.test(sanitizedInput.region)) {
          throw new AppError('Region must be a 9-digit string', 400);
        }

        // Validate count range
        if (sanitizedInput.count < 1 || sanitizedInput.count > 100) {
          throw new AppError('Count must be between 1 and 100', 400);
        }

        const results = await getPriceDataUseCase.execute(
          'all', // Default commodity since we fetch all commodities
          sanitizedInput.region,
          sanitizedInput.count
        );

        return results.map((market: any) => ({
          marketIndex: market.marketIndex,
          marketName: market.marketName,
          commodities: market.commodities.map((commodity: any) => ({
            commodity: commodity.commodity,
            commodityName: commodity.commodityName,
            commodityType: commodity.commodityType,
            specification: commodity.specification,
            price: commodity.price,
          })),
        }));
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError('Failed to fetch price data', 500);
      }
    },
  },
  Mutation: {
    processConversation: async (
      _: any, 
      { context, region = '070000000', count = 23 }: any, 
      { processConversationUseCase }: Context
    ) => {
      try {
        // Validate and sanitize input
        if (!context || typeof context !== 'object') {
          throw new AppError('Context is required', 400);
        }

        const sanitizedContext = sanitizeInput(context);
        
        // Validate messages array
        if (!sanitizedContext.messages || !Array.isArray(sanitizedContext.messages)) {
          throw new AppError('Messages must be an array', 400);
        }

        if (sanitizedContext.messages.length === 0 || sanitizedContext.messages.length > 50) {
          throw new AppError('Messages must contain 1-50 items', 400);
        }

        // Validate each message
        for (const [index, msg] of sanitizedContext.messages.entries()) {
          if (!msg.role || !['user', 'assistant', 'system'].includes(msg.role)) {
            throw new AppError(`Message ${index}: role must be user, assistant, or system`, 400);
          }
          
          if (!msg.content || typeof msg.content !== 'string') {
            throw new AppError(`Message ${index}: content is required and must be a string`, 400);
          }
          
          if (msg.content.length > 2000) {
            throw new AppError(`Message ${index}: content must be less than 2000 characters`, 400);
          }
        }

        // Validate budget if provided
        if (sanitizedContext.budget !== undefined) {
          if (typeof sanitizedContext.budget !== 'number' || sanitizedContext.budget < 0 || sanitizedContext.budget > 1000000) {
            throw new AppError('Budget must be a number between 0 and 1,000,000', 400);
          }
        }

        // Validate preferences if provided
        if (sanitizedContext.preferences && sanitizedContext.preferences.length > 500) {
          throw new AppError('Preferences must be less than 500 characters', 400);
        }

        // Validate region format
        if (!/^[0-9]{9}$/.test(region)) {
          throw new AppError('Region must be a 9-digit string', 400);
        }

        // Validate count range
        if (count < 1 || count > 100) {
          throw new AppError('Count must be between 1 and 100', 400);
        }

        // Convert the input to the expected format
        const conversationContext = {
          messages: sanitizedContext.messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp)
          })),
          budget: sanitizedContext.budget,
          preferences: sanitizedContext.preferences
        };

        console.log('GraphQL Resolver: About to call processConversationUseCase.execute');
        return await processConversationUseCase.execute(conversationContext, region, count);
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        }
        throw new AppError('Failed to process conversation', 500);
      }
    },
  },
};
