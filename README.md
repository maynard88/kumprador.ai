# Sigua.ai Monorepo

A monorepo containing the web frontend and GraphQL API for the Bantay Presyo price monitoring system.

## Architecture

This monorepo follows a clean architecture pattern with clear separation between:

- **apps/api** - GraphQL API backend (TypeScript, Node.js, Apollo Server)
- **apps/web** - Next.js frontend (React, TypeScript, Tailwind CSS)

## Project Structure

```
sigua.ai/
├── apps/
│   ├── api/                 # GraphQL API backend
│   │   ├── src/
│   │   │   ├── domain/      # Domain entities and interfaces
│   │   │   ├── application/ # Use cases and business logic
│   │   │   ├── infrastructure/ # External services and data access
│   │   │   └── presentation/ # GraphQL schema and resolvers
│   │   └── package.json
│   └── web/                 # Next.js frontend
│       ├── src/
│       │   ├── pages/       # Next.js pages
│       │   ├── components/  # React components
│       │   └── lib/         # Utilities and configurations
│       └── package.json
├── package.json             # Root workspace configuration
└── tsconfig.json           # Root TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
```bash
# Copy API environment file
cp apps/api/.env.example apps/api/.env

# Copy web environment file (if needed)
cp apps/web/.env.example apps/web/.env.local
```

### Development

#### Run all applications
```bash
npm run dev:all
```

#### Run individual applications
```bash
# API only
npm run dev:api

# Web only  
npm run dev:web
```

### Production

#### Build all applications
```bash
npm run build
```

#### Build individual applications
```bash
# API only
npm run build:api

# Web only
npm run build:web
```

#### Start applications
```bash
# API only
npm run start:api

# Web only
npm run start:web
```

## API Documentation

The GraphQL API is available at `http://localhost:4000/graphql` when running in development.

### Sample Query

The `syncDTIPriceData` query now returns price data for all commodities by looping through all commodity IDs:

```graphql
query GetPriceData {
  syncDTIPriceData(input: {
    commodity: "7"
    region: "070000000"
    count: 23
  }) {
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

**Note:** The query now returns an array of `PriceData` objects, one for each commodity that has available price data.
```

## Web Application

The web application is available at `http://localhost:3000` when running in development.

Features:
- Real-time price data visualization
- Interactive search interface
- Responsive design with Tailwind CSS
- Apollo Client for GraphQL integration

## Available Scripts

### Root Level
- `npm run dev` - Start API in development mode
- `npm run dev:all` - Start both API and web in development mode
- `npm run build` - Build all applications
- `npm run test` - Run tests for all applications
- `npm run lint` - Lint all applications
- `npm run clean` - Clean all node_modules and build artifacts

### API Specific
- `npm run dev:api` - Start API in development mode
- `npm run build:api` - Build API
- `npm run start:api` - Start API in production mode
- `npm run test:api` - Run API tests
- `npm run lint:api` - Lint API code

### Web Specific
- `npm run dev:web` - Start web app in development mode
- `npm run build:web` - Build web app
- `npm run start:web` - Start web app in production mode
- `npm run test:web` - Run web app tests
- `npm run lint:web` - Lint web app code

## Technology Stack

### API
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **GraphQL**: Apollo Server
- **Validation**: class-validator
- **HTTP Client**: Axios
- **HTML Parsing**: Cheerio

### Web
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **GraphQL Client**: Apollo Client
- **UI**: React

## SOLID Principles

The API follows SOLID principles with clean architecture:

1. **Single Responsibility** - Each class has one clear purpose
2. **Open/Closed** - Interfaces allow extension without modification
3. **Liskov Substitution** - Implementations are substitutable via interfaces
4. **Interface Segregation** - Small, focused interfaces
5. **Dependency Inversion** - High-level modules depend on abstractions

## Contributing

1. Follow the existing code structure
2. Maintain SOLID principles in the API
3. Add tests for new features
4. Update documentation as needed
5. Use conventional commit messages

## License

MIT