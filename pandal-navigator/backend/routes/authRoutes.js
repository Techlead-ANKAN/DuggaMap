const express = require('express');
const { body } = require('express-validator');
const {
  getMe,
  updateProfile,
  syncUserData
} = require('../controllers/authController_Clerk');
const { protect, validateClerkConfig } = require('../middleware/clerkAuth');

const router = express.Router();

// Validation rules for profile updates
const profileUpdateValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid Indian phone number'),
  body('preferences.foodPreferences')
    .optional()
    .isArray()
    .withMessage('Food preferences must be an array'),
  body('preferences.budgetRange.min')
    .optional()
    .isNumeric()
    .withMessage('Budget minimum must be a number'),
  body('preferences.budgetRange.max')
    .optional()
    .isNumeric()
    .withMessage('Budget maximum must be a number')
];

// Apply Clerk configuration validation to all routes
router.use(validateClerkConfig);

// Protected routes (all auth routes require Clerk authentication)
router.get('/me', protect, getMe);
router.put('/profile', protect, profileUpdateValidation, updateProfile);
router.post('/sync', protect, syncUserData);

// Health check route for auth service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth service is running with Clerk integration',
    service: 'clerk-auth',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;