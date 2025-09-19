const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('API Health and Basic Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pandal-navigator-test';
    await mongoose.connect(MONGODB_URI);
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('Health Check', () => {
    test('GET /api/health should return 200', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Pandal Navigator API is running!');
    });
  });

  describe('Authentication Endpoints', () => {
    test('POST /api/auth/register should create new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test@123',
        fullName: 'Test User',
        phone: '+91-9876543210'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    test('POST /api/auth/login should authenticate user', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Test@123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });
  });

  describe('Pandal Endpoints', () => {
    test('GET /api/pandals should return pandals list', async () => {
      const response = await request(app)
        .get('/api/pandals')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/pandals with area filter', async () => {
      const response = await request(app)
        .get('/api/pandals?area=North Kolkata')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Food Place Endpoints', () => {
    test('GET /api/food-places should return food places list', async () => {
      const response = await request(app)
        .get('/api/food-places')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/food-places with cuisine filter', async () => {
      const response = await request(app)
        .get('/api/food-places/cuisine/Bengali')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Route Endpoints', () => {
    test('GET /api/routes/popular should return popular routes', async () => {
      const response = await request(app)
        .get('/api/routes/popular')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    test('GET /api/pandals/:id with invalid ID', async () => {
      const response = await request(app)
        .get('/api/pandals/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});

describe('Database Schema Validation', () => {
  const User = require('../models/User');
  const Pandal = require('../models/Pandal');
  const FoodPlace = require('../models/FoodPlace');
  const Route = require('../models/Route');

  test('User model should validate required fields', async () => {
    const user = new User({});
    
    let error;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  test('Pandal model should validate required fields', async () => {
    const pandal = new Pandal({});
    
    let error;
    try {
      await pandal.validate();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors['location.address']).toBeDefined();
  });

  test('FoodPlace model should validate required fields', async () => {
    const foodPlace = new FoodPlace({});
    
    let error;
    try {
      await foodPlace.validate();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors['location.address']).toBeDefined();
  });

  test('Route model should validate required fields', async () => {
    const route = new Route({});
    
    let error;
    try {
      await route.validate();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.errors.userId).toBeDefined();
    expect(error.errors.areaCategory).toBeDefined();
  });
});

module.exports = app;