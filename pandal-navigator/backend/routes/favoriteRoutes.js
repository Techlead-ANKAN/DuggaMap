const express = require('express');
const { body } = require('express-validator');
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavorite,
  getFavoritesByType,
  checkFavorite
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation for adding favorites
const favoriteValidation = [
  body('itemType')
    .isIn(['pandal', 'eatery', 'route'])
    .withMessage('Item type must be pandal, eatery, or route'),
  body('itemId')
    .isMongoId()
    .withMessage('Valid item ID is required')
];

// All routes are protected
router.use(protect);

router.get('/', getFavorites);
router.post('/', favoriteValidation, addFavorite);
router.get('/type/:type', getFavoritesByType);
router.get('/check/:type/:itemId', checkFavorite);
router.put('/:id', updateFavorite);
router.delete('/:id', removeFavorite);

module.exports = router;