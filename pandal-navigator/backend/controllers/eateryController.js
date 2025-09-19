const { validationResult } = require('express-validator');
const Eatery = require('../models/Eatery');
const Review = require('../models/Review');

// @desc    Get all eateries
// @route   GET /api/eateries
// @access  Public
const getEateries = async (req, res, next) => {
  try {
    const {
      area,
      type,
      cuisine,
      priceRange,
      page = 1,
      limit = 10,
      sort = 'name',
      search,
      lat,
      lng,
      radius = 2 // km
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.area': { $regex: search, $options: 'i' } },
        { cuisine: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by area
    if (area) {
      query['location.area'] = { $regex: area, $options: 'i' };
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = { $in: [cuisine] };
    }

    // Filter by price range
    if (priceRange) {
      query['menu.priceRange'] = priceRange;
    }

    // Geospatial query if coordinates provided
    if (lat && lng) {
      const radiusInRadians = radius / 6371; // Earth's radius in km
      query['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians]
        }
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
        sortBy = { 'ratings.averageRating': -1 };
        break;
      case 'price-low':
        sortBy = { 'menu.priceRange': 1 };
        break;
      case 'price-high':
        sortBy = { 'menu.priceRange': -1 };
        break;
      case 'name':
        sortBy = { name: 1 };
        break;
      default:
        sortBy = { name: 1 };
    }

    // Execute query
    const eateries = await Eatery.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Eatery.countDocuments(query);

    res.status(200).json({
      success: true,
      count: eateries.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      data: eateries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single eatery
// @route   GET /api/eateries/:id
// @access  Public
const getEatery = async (req, res, next) => {
  try {
    const eatery = await Eatery.findOne({
      _id: req.params.id,
      isActive: true
    }).populate('nearbyPandals.pandalId', 'name location.area theme.title');

    if (!eatery) {
      return res.status(404).json({
        success: false,
        message: 'Eatery not found'
      });
    }

    res.status(200).json({
      success: true,
      data: eatery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new eatery
// @route   POST /api/eateries
// @access  Private (Admin only)
const createEatery = async (req, res, next) => {
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

    const eatery = await Eatery.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Eatery created successfully',
      data: eatery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update eatery
// @route   PUT /api/eateries/:id
// @access  Private (Admin only)
const updateEatery = async (req, res, next) => {
  try {
    let eatery = await Eatery.findById(req.params.id);

    if (!eatery) {
      return res.status(404).json({
        success: false,
        message: 'Eatery not found'
      });
    }

    eatery = await Eatery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Eatery updated successfully',
      data: eatery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete eatery (soft delete)
// @route   DELETE /api/eateries/:id
// @access  Private (Admin only)
const deleteEatery = async (req, res, next) => {
  try {
    const eatery = await Eatery.findById(req.params.id);

    if (!eatery) {
      return res.status(404).json({
        success: false,
        message: 'Eatery not found'
      });
    }

    // Soft delete
    eatery.isActive = false;
    await eatery.save();

    res.status(200).json({
      success: true,
      message: 'Eatery deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get eateries within radius
// @route   GET /api/eateries/radius/:lat/:lng/:distance
// @access  Public
const getEateriesInRadius = async (req, res, next) => {
  try {
    const { lat, lng, distance } = req.params;

    const eateries = await Eatery.getEateriesInRadius(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(distance)
    );

    res.status(200).json({
      success: true,
      count: eateries.length,
      data: eateries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get eateries near pandals
// @route   GET /api/eateries/near-pandals
// @access  Public
const getEateriesNearPandals = async (req, res, next) => {
  try {
    const { lat, lng, maxDistance = 1000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const eateries = await Eatery.getEateriesNearPandals(
      [parseFloat(lng), parseFloat(lat)],
      parseInt(maxDistance)
    );

    res.status(200).json({
      success: true,
      count: eateries.length,
      data: eateries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update wait time
// @route   PUT /api/eateries/:id/wait-time
// @access  Private
const updateWaitTime = async (req, res, next) => {
  try {
    const { waitTime } = req.body;

    const eatery = await Eatery.findById(req.params.id);

    if (!eatery) {
      return res.status(404).json({
        success: false,
        message: 'Eatery not found'
      });
    }

    await eatery.updateWaitTime(waitTime);

    res.status(200).json({
      success: true,
      message: 'Wait time updated successfully',
      data: {
        waitTime: eatery.crowdInfo.currentWaitTime,
        lastUpdated: eatery.crowdInfo.lastUpdated
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get eatery reviews
// @route   GET /api/eateries/:id/reviews
// @access  Public
const getEateryReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const reviews = await Review.find({
      itemType: 'eatery',
      itemId: req.params.id,
      isHidden: false
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Review.countDocuments({
      itemType: 'eatery',
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

// @desc    Get popular eateries
// @route   GET /api/eateries/popular
// @access  Public
const getPopularEateries = async (req, res, next) => {
  try {
    const { limit = 10, type } = req.query;

    let query = { isActive: true };
    if (type) {
      query.type = type;
    }

    const eateries = await Eatery.find(query)
      .sort({
        'ratings.averageRating': -1,
        'ratings.totalReviews': -1
      })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      count: eateries.length,
      data: eateries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get eateries by cuisine
// @route   GET /api/eateries/cuisine/:cuisine
// @access  Public
const getEateriesByCuisine = async (req, res, next) => {
  try {
    const { cuisine } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const eateries = await Eatery.find({
      cuisine: { $in: [cuisine] },
      isActive: true
    })
      .sort({ 'ratings.averageRating': -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Eatery.countDocuments({
      cuisine: { $in: [cuisine] },
      isActive: true
    });

    res.status(200).json({
      success: true,
      count: eateries.length,
      total,
      pagination: {
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      },
      data: eateries
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};