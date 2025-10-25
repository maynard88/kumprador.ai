import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Input validation for GraphQL requests
export const validateGraphQLRequest: ValidationChain[] = [
  body('query')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Query must be between 1 and 2000 characters')
    .matches(/^[a-zA-Z0-9\s\{\}\(\)\[\]\"\'\:\,\!\@\#\$\%\^\&\*\+\=\-\_\.\<\>\?\/\\\|`~]+$/)
    .withMessage('Query contains invalid characters'),
  body('variables')
    .optional()
    .isObject()
    .withMessage('Variables must be a valid object'),
  body('operationName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Operation name must be less than 100 characters')
];

// Input validation for conversation context
export const validateConversationContext: ValidationChain[] = [
  body('context.messages')
    .isArray({ min: 1, max: 50 })
    .withMessage('Messages must be an array with 1-50 items'),
  body('context.messages.*.role')
    .isIn(['user', 'assistant', 'system'])
    .withMessage('Message role must be user, assistant, or system'),
  body('context.messages.*.content')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message content must be between 1 and 2000 characters'),
  body('context.budget')
    .optional()
    .isInt({ min: 0, max: 1000000 })
    .withMessage('Budget must be a positive integer less than 1,000,000'),
  body('context.preferences')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Preferences must be less than 500 characters'),
  body('region')
    .optional()
    .matches(/^[0-9]{9}$/)
    .withMessage('Region must be a 9-digit string'),
  body('count')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Count must be between 1 and 100')
];

// Input validation for price data requests
export const validatePriceRequest: ValidationChain[] = [
  body('input.region')
    .matches(/^[0-9]{9}$/)
    .withMessage('Region must be a 9-digit string'),
  body('input.count')
    .isInt({ min: 1, max: 100 })
    .withMessage('Count must be between 1 and 100')
];

// Middleware to handle validation results
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const sanitizedErrors = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined
    }));

    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input provided',
      details: sanitizedErrors
    });
    return;
  }
  
  next();
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
};
