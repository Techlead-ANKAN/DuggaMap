const { clerkMiddleware, getAuth } = require('@clerk/express');

// Initialize Clerk with your secret key
const clerkConfig = {
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY
};

// Helper function to get user ID from request
const getUserId = (req) => {
  const auth = getAuth(req);
  return auth?.userId;
};

// Helper function to get full user info from request
const getUserInfo = (req) => {
  const auth = getAuth(req);
  return auth;
};

// Validate Clerk configuration
const validateClerkConfig = () => {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY is not set in environment variables');
  }
  
  if (!process.env.CLERK_PUBLISHABLE_KEY) {
    throw new Error('CLERK_PUBLISHABLE_KEY is not set in environment variables');
  }
  
  console.log('✅ Clerk configuration validated');
  return true;
};

module.exports = {
  clerkConfig,
  getUserId,
  getUserInfo,
  validateClerkConfig
};