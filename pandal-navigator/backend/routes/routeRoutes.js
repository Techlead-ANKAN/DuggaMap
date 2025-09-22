const express = require('express');
const { body } = require('express-validator');
const {
  planRoute,
  saveRoute,
  getUserRoutes,
  getRoute,
  updateRoute,
  deleteRoute,
  shareRoute,
  getPopularRoutes,
  getRoutesByArea,
  optimizeRoute,
  optimizeNewRoute,
  downloadRoutePDF
} = require('../controllers/routeController');
const { protect } = require('../middleware/clerkAuth');

const router = express.Router();

// Validation for route planning
const routePlanValidation = [
  body('startPoint.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required for start point'),
  body('startPoint.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required for start point'),
  body('endPoint.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required for end point'),
  body('endPoint.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required for end point'),
  body('selectedPandals')
    .isArray({ min: 1 })
    .withMessage('At least one pandal must be selected'),
  body('areaCategory')
    .isIn(['North Kolkata', 'South Kolkata', 'Central Kolkata', 'East Kolkata', 'West Kolkata', 'Mixed'])
    .withMessage('Valid area category is required'),
  body('transportMode')
    .isIn(['walking', 'car', 'public-transport'])
    .withMessage('Valid transport mode is required')
];

// Public routes
router.get('/popular', getPopularRoutes);
router.get('/area/:areaCategory', getRoutesByArea);
router.post('/optimize', optimizeNewRoute);
router.post('/download', downloadRoutePDF);

// Protected routes
router.post('/plan', protect, routePlanValidation, planRoute);
router.post('/save', protect, saveRoute);
router.get('/user', protect, getUserRoutes);
router.get('/:id', protect, getRoute);
router.put('/:id', protect, updateRoute);
router.delete('/:id', protect, deleteRoute);
router.post('/:id/share', protect, shareRoute);
router.post('/:id/optimize', protect, optimizeRoute);

module.exports = router;