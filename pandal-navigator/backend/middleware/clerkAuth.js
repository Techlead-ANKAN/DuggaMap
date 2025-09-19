const { clerkMiddleware, requireAuth, getAuth } = require('@clerk/express');
const { clerkClient } = require('@clerk/backend');
const User = require('../models/User_Clerk');

// Middleware to require authentication
const requireAuthMiddleware = requireAuth({
  onError: (error) => {
    console.error('Clerk auth error:', error);
    return {
      status: 401,
      message: 'Authentication required'
    };
  }
});

// Middleware to optionally check authentication
const withAuth = clerkMiddleware();

// Middleware to ensure user exists in our database
const ensureUserExists = async (req, res, next) => {
  try {
    const auth = getAuth(req);
    const userId = auth?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user exists in our database
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // Create user from Clerk data
      const clerkUser = await clerkClient.users.getUser(userId);
      user = await User.findOrCreateFromClerk(clerkUser);
    } else {
      // Update last active timestamp
      user.lastActive = new Date();
      await user.save();
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Ensure user exists error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    next();
  } catch (error) {
    console.error('Require admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Middleware to check if user is moderator or admin
const requireModerator = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user || !['admin', 'moderator'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Moderator access required'
      });
    }
    
    next();
  } catch (error) {
    console.error('Require moderator error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Middleware to validate Clerk configuration
const validateClerkConfig = (req, res, next) => {
  if (!process.env.CLERK_SECRET_KEY) {
    return res.status(500).json({
      success: false,
      message: 'Clerk configuration error: Missing secret key'
    });
  }
  
  if (!process.env.CLERK_PUBLISHABLE_KEY) {
    return res.status(500).json({
      success: false,
      message: 'Clerk configuration error: Missing publishable key'
    });
  }
  
  next();
};

// Helper middleware to get user info without requiring auth
const optionalAuth = withAuth;

// Combine middlewares for protected routes
const protect = [requireAuthMiddleware, ensureUserExists];

// Combine middlewares for admin routes
const protectAdmin = [requireAuthMiddleware, ensureUserExists, requireAdmin];

// Combine middlewares for moderator routes
const protectModerator = [requireAuthMiddleware, ensureUserExists, requireModerator];

module.exports = {
  requireAuth: requireAuthMiddleware,
  withAuth,
  ensureUserExists,
  requireAdmin,
  requireModerator,
  validateClerkConfig,
  optionalAuth: withAuth,
  protect,
  protectAdmin,
  protectModerator
};