import { validate } from 'class-validator';
import { PriceRequest } from '../../domain/value-objects/PriceRequest';
import { ValidationError } from '../../domain/exceptions/ValidationError';

export class PriceRequestValidator {
  static async validate(request: PriceRequest): Promise<void> {
    const errors = await validate(request);
    
    if (errors.length > 0) {
      const errorMessages = errors.map(error => 
        Object.values(error.constraints || {}).join(', ')
      ).join('; ');
      
      throw new ValidationError(`Validation failed: ${errorMessages}`);
    }
  }
}
