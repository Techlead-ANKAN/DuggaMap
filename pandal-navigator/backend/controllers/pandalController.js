const { validationResult } = require('express-validator');
const Pandal = require('../models/Pandal');
const Review = require('../models/Review');

// @desc    Get all pandals
// @route   GET /api/pandals
// @access  Public
const getPandals = async (req, res, next) => {
  try {
    const {
      areaCategory,
      theme,
      crowdLevel,
      page = 1,
      limit = 100, // Increased default limit from 10 to 100
      sort = 'name',
      search,
      lat,
      lng,
      radius = 5 // km
    } = req.query;

    // Build query
    let query = {};

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'theme.title': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by area category
    if (areaCategory) {
      query.areaCategory = areaCategory;
    }

    // Filter by theme
    if (theme) {
      query['theme.title'] = { $regex: theme, $options: 'i' };
    }

    // Filter by crowd level
    if (crowdLevel) {
      query['crowd.realTimeCrowdLevel'] = crowdLevel;
    }

    // Geospatial query if coordinates provided
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusInKm = parseFloat(radius);
      
      // Simple distance calculation using degrees
      const latRange = radiusInKm / 111; // Approximate: 1 degree = 111 km
      const lngRange = radiusInKm / (111 * Math.cos(latitude * Math.PI / 180));
      
      query['location.latitude'] = {
        $gte: latitude - latRange,
        $lte: latitude + latRange
      };
      query['location.longitude'] = {
        $gte: longitude - lngRange,
        $lte: longitude + lngRange
      };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    let sortBy = {};
    switch (sort) {
      case 'rating':
        sortBy = { rating: -1 };
        break;
      case 'crowd':
        sortBy = { 'crowd.averageVisitors': 1 };
        break;
      case 'name':
        sortBy = { name: 1 };
        break;
      case 'areaCategory':
        sortBy = { areaCategory: 1, name: 1 };
        break;
      default:
        sortBy = { name: 1 };
    }

    // Execute query
    const pandals = await Pandal.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Pandal.countDocuments(query);

    res.status(200).json({
      success: true,
      count: pandals.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      data: pandals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new pandal
// @route   POST /api/pandals
// @access  Private (Admin only)
const createPandal = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Add user to req.body
    req.body.addedBy = req.user.id;

    const pandal = await Pandal.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Pandal created successfully',
      data: pandal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pandal
// @route   PUT /api/pandals/:id
// @access  Private (Admin only)
const updatePandal = async (req, res, next) => {
  try {
    let pandal = await Pandal.findById(req.params.id);

    if (!pandal) {
      return res.status(404).json({
        success: false,
        message: 'Pandal not found'
      });
    }

    pandal = await Pandal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Pandal updated successfully',
      data: pandal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pandal (soft delete)
// @route   DELETE /api/pandals/:id
// @access  Private (Admin only)
const deletePandal = async (req, res, next) => {
  try {
    const pandal = await Pandal.findById(req.params.id);

    if (!pandal) {
      return res.status(404).json({
        success: false,
        message: 'Pandal not found'
      });
    }

    // Soft delete
    pandal.isActive = false;
    await pandal.save();

    res.status(200).json({
      success: true,
      message: 'Pandal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pandals within radius
// @route   GET /api/pandals/radius/:zipcode/:distance
// @access  Public
const getPandalsInRadius = async (req, res, next) => {
  try {
    const { lat, lng, distance } = req.params;

    const pandals = await Pandal.getPandalsInRadius(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(distance)
    );

    res.status(200).json({
      success: true,
      count: pandals.length,
      data: pandals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update crowd level
// @route   PUT /api/pandals/:id/crowd
// @access  Private
const updateCrowdLevel = async (req, res, next) => {
  try {
    const { crowdLevel } = req.body;

    const pandal = await Pandal.findById(req.params.id);

    if (!pandal) {
      return res.status(404).json({
        success: false,
        message: 'Pandal not found'
      });
    }

    await pandal.updateCrowdLevel(crowdLevel);

    res.status(200).json({
      success: true,
      message: 'Crowd level updated successfully',
      data: {
        crowdLevel: pandal.crowd.realTimeCrowdLevel,
        lastUpdated: pandal.crowd.lastUpdated
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pandal reviews
// @route   GET /api/pandals/:id/reviews
// @access  Public
const getPandalReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const reviews = await Review.find({
      itemType: 'pandal',
      itemId: req.params.id,
      isHidden: false
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Review.countDocuments({
      itemType: 'pandal',
      itemId: req.params.id,
      isHidden: false
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular pandals
// @route   GET /api/pandals/popular
// @access  Public
const getPopularPandals = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const pandals = await Pandal.find()
      .sort({
        'ratings.averageRating': -1,
        'ratings.totalReviews': -1,
        'crowd.averageVisitors': -1
      })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      count: pandals.length,
      data: pandals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pandals by area
// @route   GET /api/pandals/area/:area
// @access  Public
const getPandalsByArea = async (req, res, next) => {
  try {
    const { area } = req.params;
    const { page = 1, limit = 100 } = req.query; // Increased default limit to 100

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Fixed: Use areaCategory field instead of location.area
    const pandals = await Pandal.find({
      areaCategory: { $regex: area, $options: 'i' }
    })
      .sort({ name: 1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Pandal.countDocuments({
      areaCategory: { $regex: area, $options: 'i' }
    });

    res.status(200).json({
      success: true,
      count: pandals.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      data: pandals
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPandals,
  createPandal,
  updatePandal,
  deletePandal,
  getPandalsInRadius,
  updateCrowdLevel,
  getPandalReviews,
  getPopularPandals,
  getPandalsByArea
};