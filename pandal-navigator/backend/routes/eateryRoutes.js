const express = require('express');
const { body } = require('express-validator');
const {
  getEateries,
  getEatery,
  createEatery,
  updateEatery,
  deleteEatery,
  getEateriesInRadius,
  getEateriesNearPandals,
  updateWaitTime,
  getEateryReviews,
  getPopularEateries,
  getEateriesByCuisine
} = require('../controllers/eateryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules for eatery creation
const eateryValidation = [
  body('name')
    .notEmpty()
    .withMessage('Eatery name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot be more than 100 characters'),
  body('type')
    .isIn(['restaurant', 'street-food', 'sweet-shop', 'cafe', 'fast-food', 'dhaba', 'bakery'])
    .withMessage('Please provide a valid eatery type'),
  body('location.address')
    .notEmpty()
    .withMessage('Address is required'),
  body('location.area')
    .notEmpty()
    .withMessage('Area is required'),
  body('location.coordinates.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]'),
  body('timings.openTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please use HH:MM format for opening time'),
  body('timings.closeTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please use HH:MM format for closing time'),
  body('menu.priceRange')
    .isIn(['budget', 'moderate', 'expensive'])
    .withMessage('Please provide a valid price range')
];

// Public routes
router.get('/', getEateries);
router.get('/popular', getPopularEateries);
router.get('/cuisine/:cuisine', getEateriesByCuisine);
router.get('/radius/:lat/:lng/:distance', getEateriesInRadius);
router.get('/near-pandals', getEateriesNearPandals);
router.get('/:id', getEatery);
router.get('/:id/reviews', getEateryReviews);

// Protected routes
router.put('/:id/wait-time', protect, updateWaitTime);

// Admin only routes
router.post('/', protect, authorize('admin'), eateryValidation, createEatery);
router.put('/:id', protect, authorize('admin'), updateEatery);
router.delete('/:id', protect, authorize('admin'), deleteEatery);

module.exports = router;