# Bantay Presyo GraphQL API

A TypeScript-based GraphQL API that fetches and parses price data from the Bantay Presyo system, following SOLID principles and clean architecture.

## Features

- **GraphQL API** - Modern, type-safe API with Apollo Server
- **SOLID Principles** - Clean architecture with proper separation of concerns
- **TypeScript** - Full type safety and modern JavaScript features
- **HTML Parsing** - Extracts market data from HTML responses using Cheerio
- **Validation** - Input validation using class-validator
- **Error Handling** - Comprehensive error handling and custom exceptions
- **Dependency Injection** - Clean dependency management

## Architecture

The application follows Clean Architecture principles with clear separation between:

- **Domain Layer** - Entities, value objects, and interfaces
- **Application Layer** - Use cases and business logic
- **Infrastructure Layer** - External services and data access
- **Presentation Layer** - GraphQL schema and resolvers

## Project Structure

```
src/
├── domain/                 # Domain layer
│   ├── entities/          # Domain entities
│   ├── value-objects/     # Value objects
│   ├── interfaces/        # Domain interfaces
│   └── exceptions/        # Domain exceptions
├── application/           # Application layer
│   ├── use-cases/        # Business use cases
│   └── validators/       # Input validators
├── infrastructure/        # Infrastructure layer
│   ├── http/             # HTTP client implementations
│   ├── parsers/          # HTML parsers
│   ├── repositories/     # Data access implementations
│   └── container/        # Dependency injection
└── presentation/         # Presentation layer
    └── graphql/          # GraphQL schema and resolvers
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Build the project:
```bash
npm run build
```

## Usage

### Development

Start the development server:
```bash
npm run dev
```

### Production

Build and start the production server:
```bash
npm run build
npm start
```

The GraphQL playground will be available at `http://localhost:4000/graphql`

## GraphQL API

### Query

```graphql
query GetPriceData($input: PriceRequestInput!) {
  getPriceData(input: $input) {
    commodity {
      name
      specifications
    }
    markets {
      name
    }
  }
}
```

### Variables

```json
{
  "input": {
    "commodity": "7",
    "region": "070000000",
    "count": 23
  }
}
```

### Response

```json
{
  "data": {
    "getPriceData": {
      "commodity": {
        "name": "Rice",
        "specifications": "Regular Milled Rice"
      },
      "markets": [
        { "name": "TABUNOK PUBLIC MARKET" },
        { "name": "MANDAUE CITY PUBLIC MARKET" },
        { "name": "LAPU LAPU CITY PUBLIC MARKET" },
        { "name": "LAZI PUBLIC MARKET" },
        { "name": "DAO PUBLIC MARKET" },
        { "name": "DUMAGUETE CITY PUBLIC MARKET" },
        { "name": "CARBON PASIL MARKET" },
        { "name": "LARENA PUBLIC MARKET" },
        { "name": "SIQUIJOR PUBLIC MARKET" },
        { "name": "PASIL PUBLIC MARKET" }
      ]
    }
  }
}
```

## Environment Variables

- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)
- `BANTAY_PRESYO_BASE_URL` - Base URL for Bantay Presyo API

## SOLID Principles Implementation

1. **Single Responsibility Principle (SRP)**
   - Each class has a single responsibility
   - Entities, use cases, and repositories are separate

2. **Open/Closed Principle (OCP)**
   - Interfaces allow extension without modification
   - New parsers or HTTP clients can be added easily

3. **Liskov Substitution Principle (LSP)**
   - Implementations can be substituted through interfaces
   - Dependency injection enables easy swapping

4. **Interface Segregation Principle (ISP)**
   - Small, focused interfaces
   - Clients depend only on methods they use

5. **Dependency Inversion Principle (DIP)**
   - High-level modules don't depend on low-level modules
   - Both depend on abstractions (interfaces)

## Testing

Run tests:
```bash
npm test
```

## Linting

Run linter:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## Contributing

1. Follow the existing code structure
2. Maintain SOLID principles
3. Add tests for new features
4. Update documentation as needed

## License

MIT