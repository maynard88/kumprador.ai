import rateLimit from 'express-rate-limit';

// Rate limiting configuration
export const createRateLimiter = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  return rateLimit({
    windowMs, // 15 minutes by default
    max, // limit each IP to 100 requests per windowMs
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

