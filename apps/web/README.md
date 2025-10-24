# Kumprador AI - Web App

Next.js frontend for the Kumprador AI grocery budgeting assistant. Built with React, TypeScript, and Tailwind CSS featuring a conversational AI interface.

## 🚀 Features

- **AI Chat Interface**: Conversational UI similar to ChatGPT
- **Budget Analysis**: AI-powered grocery budget recommendations
- **Real-time Data**: Live market prices from Bantay Presyo
- **Cebuano Support**: Natural language interface in Cebuano
- **Responsive Design**: Mobile-first, works on all devices
- **GraphQL Integration**: Apollo Client for API communication
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🏗️ Architecture

```
src/
├── components/         # React components
│   ├── ErrorMessage.tsx
│   ├── LoadingSpinner.tsx
│   └── MarketCard.tsx
├── lib/               # Utilities and configurations
│   ├── apollo.ts      # Apollo Client configuration
│   └── queries.ts     # GraphQL queries and mutations
├── pages/             # Next.js pages
│   ├── _app.tsx       # App wrapper with Apollo Provider
│   └── index.tsx      # Main chat interface
└── styles/            # Global styles
    └── globals.css    # Tailwind CSS imports
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- API backend running (or deployed)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env.local
```

3. **Configure environment variables:**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api/graphql
NEXT_PUBLIC_API_KEY=your_api_key_here

# Environment
NODE_ENV=development
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
# Run tests
npm run test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🌐 Deployment

### Vercel Deployment

1. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to `apps/web`
   - Configure environment variables
   - Deploy!

2. **Deploy via CLI:**
```bash
vercel --prod
```

### Environment Variables for Production

Set these in your Vercel dashboard:

```bash
NEXT_PUBLIC_API_URL=https://your-api-project.vercel.app/api/graphql
NEXT_PUBLIC_API_KEY=your_api_key_here
NODE_ENV=production
```

## 🎨 User Interface

### Main Features

#### Chat Interface
- **Conversational UI**: ChatGPT-style interface
- **Message History**: Persistent conversation history
- **Real-time Updates**: Live typing indicators
- **Message Types**: User and AI message differentiation

#### Budget Analysis
- **Smart Recommendations**: AI-powered shopping suggestions
- **Market Comparison**: Price comparison across markets
- **Budget Optimization**: Optimal spending recommendations
- **Visual Cards**: Market data display with price cards

#### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Desktop Support**: Full desktop experience
- **Touch Friendly**: Mobile-optimized interactions
- **Accessibility**: WCAG compliant design

### Component Structure

#### MarketCard Component
```typescript
interface MarketCardProps {
  market: {
    marketName: string;
    price: number;
    unit: string;
    lastUpdated: string;
  };
}
```

#### LoadingSpinner Component
- Animated loading indicator
- Consistent with design system
- Accessible loading states

#### ErrorMessage Component
- Error state handling
- User-friendly error messages
- Retry functionality

## 🔧 Configuration

### Next.js Configuration

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/graphql',
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY || '',
  },
}
```

### Apollo Client Configuration

```typescript
// lib/apollo.ts
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  },
  cache: new InMemoryCache(),
});
```

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981', // Green
        secondary: '#3B82F6', // Blue
      },
    },
  },
  plugins: [],
}
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Optimizations

- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Natural mobile interactions
- **Keyboard Support**: Mobile keyboard optimization
- **Performance**: Optimized for mobile networks

## 🎯 User Experience

### Chat Flow

1. **Welcome Message**: Initial AI greeting
2. **User Input**: Budget or shopping request
3. **AI Processing**: Real-time analysis
4. **Response**: Personalized recommendations
5. **Market Data**: Price comparison display

### Interaction Patterns

- **Enter to Send**: Quick message sending
- **Loading States**: Clear feedback during processing
- **Error Handling**: Graceful error recovery
- **Auto-scroll**: Automatic conversation scrolling

## 🧪 Testing

### Test Structure

```
src/__tests__/
├── components/
│   ├── MarketCard.test.tsx
│   ├── LoadingSpinner.test.tsx
│   └── ErrorMessage.test.tsx
├── pages/
│   └── index.test.tsx
└── lib/
    └── apollo.test.ts
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Performance

### Optimization Strategies

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js image optimization
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Apollo Client caching
- **Lazy Loading**: Component lazy loading

### Core Web Vitals

- **LCP**: Optimized for fast loading
- **FID**: Smooth interactions
- **CLS**: Stable layout shifts

## 🔒 Security

### Environment Variables

- **Public Variables**: Only `NEXT_PUBLIC_*` variables are exposed
- **API Keys**: Secure API key handling
- **CORS**: Proper cross-origin configuration

### Best Practices

- **Input Sanitization**: XSS prevention
- **HTTPS**: Secure connections only
- **Content Security Policy**: CSP headers
- **Authentication**: Secure API communication

## 🛠️ Development

### Code Structure

Follow these patterns:

1. **Components**: Reusable UI components
2. **Pages**: Next.js page components
3. **Lib**: Utility functions and configurations
4. **Styles**: Global and component styles

### Adding New Features

1. **Create Component**: Build reusable component
2. **Add Tests**: Write component tests
3. **Update Styles**: Add Tailwind classes
4. **Document**: Update README if needed

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - TypeScript type checking

## 🔗 Dependencies

### Production
- `next` - React framework
- `react` - UI library
- `react-dom` - DOM rendering
- `@apollo/client` - GraphQL client
- `graphql` - GraphQL implementation
- `tailwindcss` - CSS framework

### Development
- `typescript` - TypeScript compiler
- `eslint` - Code linting
- `@types/react` - React types
- `@types/node` - Node.js types

## 🎨 Design System

### Colors

- **Primary**: Green (#10B981)
- **Secondary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Yellow (#F59E0B)
- **Info**: Blue (#3B82F6)

### Typography

- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: Monaco, monospace

### Spacing

- **Base**: 4px grid system
- **Components**: 8px, 16px, 24px, 32px
- **Layout**: 16px, 24px, 32px, 48px

## 📄 License

MIT
