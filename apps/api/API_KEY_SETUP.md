# API Key Authentication Setup

This API now requires an API key for authentication. Follow these steps to set up your environment:

## 1. Create Environment File

Create a `.env` file in the `apps/api` directory with the following content:

```env
# API Configuration
API_KEY=your-secret-api-key-here
PORT=4000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bantay-presyo

# Environment
NODE_ENV=development
```

## 2. Generate a Secure API Key

Replace `your-secret-api-key-here` with a secure API key. You can generate one using:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Or use any secure random string generator
```

## 3. Using the API

All requests to the GraphQL endpoint must include the API key in the `x-api-key` header:

### Example with curl:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key-here" \
  -d '{"query": "{ syncDTIPriceData(input: { region: \"7\", count: 10 }) { marketIndex marketName commodities { commodity commodityName commodityType specification price } } }"}' \
  http://localhost:4000/api/graphql
```

### Example with JavaScript/TypeScript:
```javascript
const response = await fetch('http://localhost:4000/api/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-secret-api-key-here'
  },
  body: JSON.stringify({
    query: `
      query {
        syncDTIPriceData(input: { region: "7", count: 10 }) {
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
    `
  })
});
```

## 4. Error Responses

### Missing API Key:
```json
{
  "error": "Unauthorized",
  "message": "API key is required. Please provide x-api-key header."
}
```

### Invalid API Key:
```json
{
  "error": "Unauthorized",
  "message": "Invalid API key provided."
}
```

### Server Configuration Error:
```json
{
  "error": "Server configuration error",
  "message": "API key authentication is not properly configured"
}
```

## 5. Security Notes

- Keep your API key secure and never commit it to version control
- Use different API keys for different environments (development, staging, production)
- Consider rotating your API keys regularly
- The API key is validated on every request

## 6. Development vs Production

- In development: You can use any API key as long as it matches the one in your `.env` file
- In production: Use a strong, randomly generated API key and ensure it's properly secured
