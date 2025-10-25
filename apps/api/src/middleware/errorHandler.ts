import { Request, Response, NextFunction } from 'express';

// Custom error class for application errors
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Sanitize error messages for production
export const sanitizeError = (error: Error, isProduction: boolean = false): string => {
  if (isProduction) {
    // In production, don't expose internal error details
    if (error instanceof AppError && error.isOperational) {
      return error.message;
    }
    return 'Internal server error';
  }
  
  // In development, show more details
  return error.message;
};

// Global error handler middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  let statusCode = 500;
  let message = 'Internal server error';
  
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = sanitizeError(error, isProduction);
  } else {
    message = sanitizeError(error, isProduction);
  }

  // Log error details (but don't expose to client)
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  res.status(statusCode).json({
    error: 'Request Failed',
    message,
    ...(isProduction ? {} : { stack: error.stack })
  });
};

// Handle uncaught exceptions
export const handleUncaughtException = (): void => {
  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = (): void => {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
};

