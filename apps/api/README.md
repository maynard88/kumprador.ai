# Kumprador AI - API

GraphQL API backend for the Kumprador AI grocery budgeting assistant. Built with TypeScript, Node.js, and Apollo Server following clean architecture principles.

## 🚀 Features

- **GraphQL API**: Modern API with type-safe queries and mutations
- **Real-time Data**: Live market data from Bantay Presyo
- **AI Integration**: OpenAI GPT-4 for conversational AI
- **Clean Architecture**: SOLID principles with clear separation of concerns
- **Type Safety**: Full TypeScript implementation
- **Caching**: Intelligent price data caching
- **Authentication**: API key-based authentication
- **MongoDB**: Persistent data storage
- **Vercel Ready**: Serverless deployment configuration

## 🏗️ Architecture

```
src/
├── domain/              # Core business logic
│   ├── entities/        # Business entities
│   ├── interfaces/     # Repository interfaces
│   ├── value-objects/  # Value objects
│   └── exceptions/      # Custom exceptions
├── application/         # Use cases and business logic
│   ├── use-cases/      # Application use cases
│   └── validators/     # Input validation
├── infrastructure/     # External concerns
│   ├── database/       # MongoDB configuration
│   ├── http/          # HTTP client (Axios)
│   ├── parsers/       # HTML parsing (Cheerio)
│   ├── repositories/  # Data access implementations
│   ├── cache/         # Caching layer
│   └── container/     # Dependency injection
├── presentation/       # API layer
│   ├── graphql/       # GraphQL schema and resolvers
│   └── server.ts      # Express server setup
└── middleware/        # Express middleware
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- OpenAI API key

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env
```

3. **Configure environment variables:**
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# API Authentication
API_KEY=your-secure-api-key

# Environment
NODE_ENV=development
PORT=4000
```

### Development

```bash
# Start development server
npm run dev

# Build the project
npm run build

# Start production server
npm run start
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🌐 Deployment

### Vercel Deployment

1. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to `apps/api`
   - Configure environment variables
   - Deploy!

2. **Deploy via CLI:**
```bash
vercel --prod
```

### Environment Variables for Production

Set these in your Vercel dashboard:

```bash
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
API_KEY=your_secure_api_key
NODE_ENV=production
```

## 📚 API Documentation

### GraphQL Endpoint

- **Development**: `http://localhost:4000/api/graphql`
- **Production**: `https://your-api-project.vercel.app/api/graphql`

### Available Queries

#### Get Price Data
```graphql
query GetPriceData($input: PriceRequestInput!) {
  syncDTIPriceData(input: $input) {
    marketIndex
    marketName
    commodities {
      commodity
      commodityName
      commodityType
      specification
      price
      unit
      lastUpdated
    }
  }
}
```

#### Process Conversation
```graphql
mutation ProcessConversation($context: ConversationContext!, $region: String!, $count: Int!) {
  processConversation(context: $context, region: $region, count: $count)
}
```

### Sample Usage

```graphql
# Get rice prices in Region 7
query {
  syncDTIPriceData(input: {
    commodity: "7"
    region: "070000000"
    count: 23
  }) {
    marketIndex
    marketName
    commodities {
      commodityName
      price
      unit
    }
  }
}
```

## 🔧 Configuration

### MongoDB Configuration

The API uses MongoDB for data persistence:

```typescript
// Default configuration
{
  connectionString: process.env.MONGODB_URI,
  databaseName: 'bantay_presyo',
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    retryWrites: true,
    w: 'majority'
  }
}
```

### OpenAI Configuration

```typescript
{
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000
}
```

## 🏛️ Clean Architecture

### Domain Layer
- **Entities**: Core business objects (Commodity, Market, PriceData)
- **Interfaces**: Repository contracts
- **Value Objects**: Immutable objects (PriceRequest)
- **Exceptions**: Custom error types

### Application Layer
- **Use Cases**: Business logic implementation
- **Validators**: Input validation logic

### Infrastructure Layer
- **Repositories**: Data access implementations
- **HTTP Client**: External API communication
- **Parsers**: HTML parsing for web scraping
- **Cache**: Data caching layer
- **Database**: MongoDB connection and configuration

### Presentation Layer
- **GraphQL Schema**: API schema definition
- **Resolvers**: Query and mutation handlers
- **Server**: Express server configuration

## 🧪 Testing

### Test Structure

```
src/__tests__/
├── BantayPresyoRepository.test.ts
├── MongoPriceDataRepository.test.ts
├── OpenAIRepository.test.ts
├── PriceDataCache.test.ts
└── ...
```

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- BantayPresyoRepository.test.ts

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security

### API Authentication

The API uses API key authentication:

```typescript
// Add to request headers
{
  'Authorization': 'Bearer your-api-key'
}
```

### Environment Variables

Never commit sensitive data:
- Use `.env` files for local development
- Set environment variables in Vercel dashboard for production
- Use `env.example` as a template

## 📊 Monitoring

### Cache Statistics

Monitor cache performance:
```
GET /api/cache/stats
```

Response:
```json
{
  "cache": {
    "hits": 150,
    "misses": 25,
    "hitRate": 0.857,
    "size": 1024
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Performance

### Caching Strategy

- **Price Data Cache**: 10-minute TTL for market data
- **Automatic Cleanup**: Expired entries removed every 10 minutes
- **Memory Efficient**: Bounded cache to prevent memory leaks

### Database Optimization

- **Connection Pooling**: Configured for optimal performance
- **Indexes**: Proper indexing on frequently queried fields
- **TLS**: Secure connections to MongoDB Atlas

## 🛠️ Development

### Code Structure

Follow these patterns:

1. **Use Cases**: Implement business logic
2. **Repositories**: Handle data access
3. **Entities**: Define business objects
4. **Interfaces**: Define contracts
5. **Validators**: Validate input data

### Adding New Features

1. **Define Entity**: Create domain entity
2. **Create Interface**: Define repository interface
3. **Implement Repository**: Create data access implementation
4. **Create Use Case**: Implement business logic
5. **Add GraphQL Resolver**: Expose via API
6. **Add Tests**: Write comprehensive tests

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues

## 🔗 Dependencies

### Production
- `apollo-server-express` - GraphQL server
- `express` - Web framework
- `graphql` - GraphQL implementation
- `axios` - HTTP client
- `cheerio` - HTML parsing
- `mongodb` - Database driver
- `openai` - AI integration
- `class-validator` - Input validation

### Development
- `typescript` - TypeScript compiler
- `jest` - Testing framework
- `eslint` - Code linting
- `@vercel/node` - Vercel runtime

## 📄 License

MIT
