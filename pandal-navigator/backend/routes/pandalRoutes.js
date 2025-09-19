const express = require('express');
const { body } = require('express-validator');
const {
  getPandals,
  getPandal,
  createPandal,
  updatePandal,
  deletePandal,
  getPandalsInRadius,
  updateCrowdLevel,
  getPandalReviews,
  getPopularPandals,
  getPandalsByArea
} = require('../controllers/pandalController');
const { protect, protectAdmin } = require('../middleware/clerkAuth');

const router = express.Router();

// Validation rules for pandal creation
const pandalValidation = [
  body('name')
    .notEmpty()
    .withMessage('Pandal name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot be more than 100 characters'),
  body('location.address')
    .notEmpty()
    .withMessage('Address is required'),
  body('location.area')
    .notEmpty()
    .withMessage('Area is required'),
  body('location.coordinates.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]'),
  body('theme.title')
    .notEmpty()
    .withMessage('Theme title is required'),
  body('timings.openTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please use HH:MM format for opening time'),
  body('timings.closeTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please use HH:MM format for closing time')
];

// Public routes
router.get('/', getPandals);
router.get('/popular', getPopularPandals);
router.get('/area/:area', getPandalsByArea);
router.get('/radius/:lat/:lng/:distance', getPandalsInRadius);
router.get('/:id', getPandal);
router.get('/:id/reviews', getPandalReviews);

// Protected routes
router.put('/:id/crowd', protect, updateCrowdLevel);

// Admin only routes
router.post('/', protectAdmin, pandalValidation, createPandal);
router.put('/:id', protectAdmin, updatePandal);
router.delete('/:id', protectAdmin, deletePandal);

module.exports = router;