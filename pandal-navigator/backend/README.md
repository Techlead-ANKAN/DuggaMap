# 🚀 Backend Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Maps API key

## Installation Steps

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
```

### 4. Required Environment Variables
Update the `.env` file with your specific values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pandal-navigator
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
CORS_ORIGIN=http://localhost:3000
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
Update `MONGODB_URI` in `.env` with your Atlas connection string.

### 6. Seed the Database
```bash
npm run seed
```

### 7. Start the Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 🔍 Verification

### Health Check
Visit: `http://localhost:5000/api/health`

You should see:
```json
{
  "success": true,
  "message": "Pandal Navigator API is running!",
  "timestamp": "2023-10-20T10:30:00.000Z",
  "environment": "development"
}
```

### Test API Endpoints

#### 1. Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123",
    "phone": "9876543213"
  }'
```

#### 2. Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

#### 3. Get all pandals:
```bash
curl http://localhost:5000/api/pandals
```

#### 4. Get all eateries:
```bash
curl http://localhost:5000/api/eateries
```

## 📋 Available Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node data/seedData.js",
  "test": "jest"
}
```

## 🗄️ Database Collections

After seeding, your database will contain:
- **Users**: 3 sample users (1 admin, 2 regular users)
- **Pandals**: 5 famous Kolkata pandals
- **Eateries**: 5 popular Kolkata eateries
- **Reviews**: Sample reviews for pandals and eateries

## 🔐 Test Credentials

```
Admin User:
Email: admin@pandalnavigator.com
Password: Admin@123

Regular Users:
Email: raj@example.com / Password: User@123
Email: priya@example.com / Password: User@123
```

## 🛠️ API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Pandal Endpoints
- `GET /api/pandals` - Get all pandals with filtering
- `GET /api/pandals/:id` - Get specific pandal
- `GET /api/pandals/popular` - Get popular pandals
- `GET /api/pandals/area/:area` - Get pandals by area

### Eatery Endpoints
- `GET /api/eateries` - Get all eateries with filtering
- `GET /api/eateries/:id` - Get specific eatery
- `GET /api/eateries/popular` - Get popular eateries
- `GET /api/eateries/cuisine/:cuisine` - Get eateries by cuisine

### Route Planning Endpoints
- `POST /api/routes/plan` - Plan optimized route (protected)
- `POST /api/routes/save` - Save route (protected)
- `GET /api/routes/user` - Get user routes (protected)
- `GET /api/routes/popular` - Get popular public routes

### Favorite Endpoints
- `GET /api/favorites` - Get user favorites (protected)
- `POST /api/favorites` - Add/remove favorite (protected)
- `GET /api/favorites/type/:type` - Get favorites by type (protected)

## 🚫 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using the port: `lsof -ti:5000 | xargs kill -9`

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set in `.env`
   - Use a strong, unique secret in production

4. **Google Maps API Errors**
   - Verify API key is correct
   - Ensure Directions API is enabled
   - Check API quota and billing

### Development Tips:

1. **Enable Logging**
   - Morgan middleware is enabled in development
   - Check terminal for request logs

2. **Error Handling**
   - All errors are centrally handled
   - Check error messages in responses

3. **Database Inspection**
   - Use MongoDB Compass for GUI
   - Connect to: `mongodb://localhost:27017/pandal-navigator`

## 🚀 Next Steps

1. Start the backend server
2. Test API endpoints
3. Proceed to frontend setup
4. Integrate frontend with backend

## 📞 Support

If you encounter any issues:
1. Check the error logs
2. Verify environment variables
3. Ensure all dependencies are installed
4. Review the troubleshooting section