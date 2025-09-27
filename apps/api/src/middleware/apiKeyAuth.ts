import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  isAuthenticated?: boolean;
}

export const apiKeyAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] as string;
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    console.error('API_KEY environment variable is not set');
    res.status(500).json({ 
      error: 'Server configuration error',
      message: 'API key authentication is not properly configured'
    });
    return;
  }

  if (!apiKey) {
    res.status(401).json({ 
      error: 'Unauthorized',
      message: 'API key is required. Please provide x-api-key header.'
    });
    return;
  }

  if (apiKey !== validApiKey) {
    res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid API key provided.'
    });
    return;
  }

  req.isAuthenticated = true;
  next();
};
