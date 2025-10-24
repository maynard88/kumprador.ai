import 'reflect-metadata';

// Mock console.log to reduce noise in tests
const originalConsoleLog = console.log;
console.log = (...args: any[]) => {
  // Only log if it's not a test-related log
  if (!args[0]?.includes('Syncing DTI price data')) {
    originalConsoleLog(...args);
  }
};

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.OPENAI_API_KEY = 'test-key';
process.env.API_KEY = 'test-api-key';
