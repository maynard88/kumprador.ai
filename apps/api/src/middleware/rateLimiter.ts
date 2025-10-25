import rateLimit from 'express-rate-limit';
import { Request } from 'express';

// Custom key generator that handles Vercel proxy headers
const keyGenerator = (req: Request): string => {
  // In Vercel, use the forwarded IP from headers
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    if (Array.isArray(forwarded)) {
      return forwarded[0] || 'unknown';
    }
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }
  
  // Fallback to connection remote address
  return req.ip || req.socket.remoteAddress || 'unknown';
};

// Rate limiting configuration
export const createRateLimiter = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  return rateLimit({
    windowMs, // 15 minutes by default
    max, // limit each IP to 100 requests per windowMs
    keyGenerator, // Use custom key generator for Vercel compatibility
    message: {
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Strict rate limiter for authentication endpoints
export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 10); // 10 requests per 15 minutes

// Standard rate limiter for API endpoints
export const apiRateLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes

// GraphQL specific rate limiter (more restrictive)
export const graphqlRateLimiter = createRateLimiter(15 * 60 * 1000, 50); // 50 requests per 15 minutes

