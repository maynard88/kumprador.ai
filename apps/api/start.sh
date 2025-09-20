#!/bin/bash

# Bantay Presyo GraphQL API Startup Script

echo "🚀 Starting Bantay Presyo GraphQL API..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment file..."
    cat > .env << EOF
PORT=4000
NODE_ENV=development
BANTAY_PRESYO_BASE_URL=http://www.bantaypresyo.da.gov.ph
EOF
    echo "✅ Environment file created"
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Start the development server
echo "🌟 Starting development server..."
npm run dev

