const express = require('express');
const {
  getFoodPlaces,
  getFoodPlace,
  createFoodPlace,
  updateFoodPlace,
  deleteFoodPlace,
  getFoodPlacesInRadius,
  getFoodPlacesByCuisine,
  getFoodPlacesByPriceRange,
  searchFoodPlaces,
  getFoodPlacesNearPandal
} = require('../controllers/foodPlaces');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getFoodPlaces);
router.get('/search', searchFoodPlaces);
router.get('/radius/:lat/:lng/:distance', getFoodPlacesInRadius);
router.get('/cuisine/:cuisine', getFoodPlacesByCuisine);
router.get('/price/:min/:max', getFoodPlacesByPriceRange);
router.get('/near-pandal/:pandalId', getFoodPlacesNearPandal);
router.get('/:id', getFoodPlace);

// Protected routes
router.use(protect);

// Admin routes
router.post('/', authorize('admin'), createFoodPlace);
router.put('/:id', authorize('admin'), updateFoodPlace);
router.delete('/:id', authorize('admin'), deleteFoodPlace);

module.exports = router;