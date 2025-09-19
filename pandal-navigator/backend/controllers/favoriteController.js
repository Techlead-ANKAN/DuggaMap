const { validationResult } = require('express-validator');
const Favorite = require('../models/Favorite');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = { user: req.user.id };
    if (type) {
      query.itemType = type;
    }

    const favorites = await Favorite.find(query)
      .populate('itemId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Favorite.countDocuments(query);

    res.status(200).json({
      success: true,
      count: favorites.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { itemType, itemId, notes, tags, priority } = req.body;

    const result = await Favorite.toggleFavorite(req.user.id, itemType, itemId);

    if (result.action === 'added' && (notes || tags || priority)) {
      // Update with additional data
      await Favorite.findByIdAndUpdate(result.favorite._id, {
        notes,
        tags: tags || [],
        priority: priority || 'medium'
      });
    }

    res.status(200).json({
      success: true,
      message: `Item ${result.action} ${result.action === 'added' ? 'to' : 'from'} favorites`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    // Check ownership
    if (favorite.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Favorite.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update favorite
// @route   PUT /api/favorites/:id
// @access  Private
const updateFavorite = async (req, res, next) => {
  try {
    const { notes, tags, priority, reminderDate } = req.body;

    let favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    // Check ownership
    if (favorite.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updateData = {};
    if (notes !== undefined) updateData.notes = notes;
    if (tags) updateData.tags = tags;
    if (priority) updateData.priority = priority;
    if (reminderDate) updateData.reminderDate = reminderDate;

    favorite = await Favorite.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('itemId');

    res.status(200).json({
      success: true,
      message: 'Favorite updated successfully',
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get favorites by type
// @route   GET /api/favorites/type/:type
// @access  Private
const getFavoritesByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const favorites = await Favorite.getUserFavoritesByType(req.user.id, type);

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if item is favorited
// @route   GET /api/favorites/check/:type/:itemId
// @access  Private
const checkFavorite = async (req, res, next) => {
  try {
    const { type, itemId } = req.params;

    const isFavorited = await Favorite.isFavorited(req.user.id, type, itemId);

    res.status(200).json({
      success: true,
      data: { isFavorited }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavorite,
  getFavoritesByType,
  checkFavorite
};