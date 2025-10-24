# Kumprador AI

An AI-powered grocery budgeting assistant that helps users make smart shopping decisions using real-time market data from [Bantay Presyo](http://www.bantaypresyo.da.gov.ph/). Built with a conversational interface that understands Cebuano and provides personalized budget analysis for Region 7 markets.

## 🚀 Features

- 🤖 **AI-Powered Budgeting**: Conversational interface that understands budget requests
- 🛒 **Smart Shopping Assistant**: Provides personalized grocery recommendations
- 💰 **Real-time Price Data**: Uses live market data from Bantay Presyo
- 🏪 **Region 7 Focus**: Optimized for Cebu and surrounding areas
- 🗣️ **Cebuano Support**: Natural language interface in Cebuano
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop

## 🏗️ Architecture

This monorepo follows a clean architecture pattern with clear separation between:

- **apps/api** - GraphQL API backend (TypeScript, Node.js, Apollo Server)
- **apps/web** - Next.js frontend with AI chat interface (React, TypeScript, Tailwind CSS)

## 📁 Project Structure

```
kumprador-ai/
├── apps/
│   ├── api/                 # GraphQL API backend
│   │   ├── src/
│   │   │   ├── domain/      # Domain entities and interfaces
│   │   │   ├── application/ # Use cases and business logic
│   │   │   ├── infrastructure/ # External services and data access
│   │   │   └── presentation/ # GraphQL schema and resolvers
│   │   ├── api/             # Vercel serverless functions
│   │   └── package.json
│   └── web/                 # Next.js frontend
│       ├── src/
│       │   ├── pages/       # Next.js pages
│       │   ├── components/  # React components
│       │   └── lib/         # Utilities and configurations
│       └── package.json
├── package.json             # Root workspace configuration
├── vercel.json             # Vercel deployment configuration
└── tsconfig.json           # Root TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+ or yarn
- MongoDB Atlas account (for production)
- OpenAI API key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/maynard88/kumprador.ai.git
cd kumprador.ai
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
# Copy API environment file
cp apps/api/env.example apps/api/.env

# Copy web environment file (if needed)
cp apps/web/env.example apps/web/.env.local
```

4. **Configure environment variables:**
```bash
# apps/api/.env
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
API_KEY=your_secure_api_key
NODE_ENV=development

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api/graphql
NEXT_PUBLIC_API_KEY=your_api_key_here
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

## 🌐 Deployment

### API Deployment (Vercel)

1. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to `apps/api`
   - Configure environment variables
   - Deploy!

2. **Deploy via CLI:**
```bash
cd apps/api
vercel --prod
```

### Web Deployment (Vercel)

1. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to `apps/web`
   - Configure environment variables
   - Deploy!

2. **Deploy via CLI:**
```bash
cd apps/web
vercel --prod
```

## 📚 API Documentation

The GraphQL API is available at:
- **Development**: `http://localhost:4000/api/graphql`
- **Production**: `https://your-api-project.vercel.app/api/graphql`

### Sample Query

```graphql
query GetPriceData {
  syncDTIPriceData(input: {
    commodity: "7"
    region: "070000000"
    count: 23
  }) {
    marketIndex
    marketName
    commodities {
      commodity
      commodityName
      commodityType
      specification
      price
    }
  }
}
```

### Available Queries

- `syncDTIPriceData` - Get market price data
- `processConversation` - Process AI conversation

## 🎨 Web Application

The web application is available at:
- **Development**: `http://localhost:3000`
- **Production**: `https://your-web-project.vercel.app`

### Features:
- **Chat-based UI**: Conversational interface similar to ChatGPT
- **Budget Analysis**: AI analyzes user budget and suggests optimal purchases
- **Market Comparison**: Shows prices across different Region 7 markets
- **Cebuano Language**: Natural language support in Cebuano
- **Real-time Data**: Live price updates from Bantay Presyo
- **Mobile Responsive**: Optimized for all device sizes

## 📋 Available Scripts

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

## 🛠️ Technology Stack

### API
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **GraphQL**: Apollo Server
- **Database**: MongoDB
- **AI**: OpenAI GPT-4
- **Validation**: class-validator
- **HTTP Client**: Axios
- **HTML Parsing**: Cheerio
- **Data Source**: [Bantay Presyo](http://www.bantaypresyo.da.gov.ph/)
- **Deployment**: Vercel

### Web
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **GraphQL Client**: Apollo Client
- **UI**: React
- **Chat Interface**: Custom AI chat UI
- **Language Support**: Cebuano/English
- **Deployment**: Vercel

## 🏛️ SOLID Principles

The API follows SOLID principles with clean architecture:

1. **Single Responsibility** - Each class has one clear purpose
2. **Open/Closed** - Interfaces allow extension without modification
3. **Liskov Substitution** - Implementations are substitutable via interfaces
4. **Interface Segregation** - Small, focused interfaces
5. **Dependency Inversion** - High-level modules depend on abstractions

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run API tests
npm run test:api

# Run web tests
npm run test:web
```

## 📝 Contributing

1. Follow the existing code structure
2. Maintain SOLID principles in the API
3. Add tests for new features
4. Update documentation as needed
5. Use conventional commit messages

## 📄 License

MIT

## 🔗 Links

- **API Documentation**: [GraphQL Playground](https://your-api-project.vercel.app/api/graphql)
- **Web Application**: [Kumprador AI](https://your-web-project.vercel.app)
- **Data Source**: [Bantay Presyo](http://www.bantaypresyo.da.gov.ph/)

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.