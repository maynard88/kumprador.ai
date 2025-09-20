# MongoDB Setup Guide

## Environment Variables

Create a `.env` file in the `apps/api` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://admin:password123@localhost:27017/bantay_presyo?authSource=admin
MONGODB_DATABASE=bantay_presyo

# Server Configuration
NODE_ENV=development
PORT=4000
```

## Docker Setup

1. Start MongoDB using Docker Compose:
```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Mongo Express (web interface) on port 8081

2. Access Mongo Express:
- URL: http://localhost:8081
- Username: admin
- Password: admin123

## Manual MongoDB Setup (Alternative)

If you prefer to install MongoDB locally:

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database and user:
```javascript
use bantay_presyo
db.createUser({
  user: "admin",
  pwd: "password123",
  roles: ["readWrite"]
})
```

## Database Schema

The application will automatically create the following collection:
- `price_data`: Stores parsed price data from Bantay Presyo

## Collection Structure

```javascript
{
  _id: ObjectId,
  commodity: {
    name: String,
    specifications: String
  },
  markets: [{
    name: String
  }],
  request: {
    commodity: String,
    region: String,
    count: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```
