const FoodPlace = require('../models/FoodPlace');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all food places
// @route   GET /api/foodplaces
// @access  Public
exports.getFoodPlaces = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = FoodPlace.find(JSON.parse(queryStr)).populate('nearbyPandals', 'name location.address');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-rating -createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await FoodPlace.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  const foodPlaces = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: foodPlaces.length,
    pagination,
    data: foodPlaces
  });
});

// @desc    Get single food place
// @route   GET /api/foodplaces/:id
// @access  Public
exports.getFoodPlace = asyncHandler(async (req, res, next) => {
  const foodPlace = await FoodPlace.findById(req.params.id).populate('nearbyPandals', 'name location.address areaCategory');

  if (!foodPlace) {
    return next(new ErrorResponse(`Food place not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: foodPlace
  });
});

// @desc    Create new food place
// @route   POST /api/foodplaces
// @access  Private/Admin
exports.createFoodPlace = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.addedBy = req.user.id;

  const foodPlace = await FoodPlace.create(req.body);

  // Find and update nearby pandals
  await foodPlace.findNearbyPandals();

  res.status(201).json({
    success: true,
    data: foodPlace
  });
});

// @desc    Update food place
// @route   PUT /api/foodplaces/:id
// @access  Private/Admin
exports.updateFoodPlace = asyncHandler(async (req, res, next) => {
  let foodPlace = await FoodPlace.findById(req.params.id);

  if (!foodPlace) {
    return next(new ErrorResponse(`Food place not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is food place owner or admin
  if (foodPlace.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this food place`, 401));
  }

  foodPlace = await FoodPlace.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Update nearby pandals if location changed
  if (req.body.location) {
    await foodPlace.findNearbyPandals();
  }

  res.status(200).json({
    success: true,
    data: foodPlace
  });
});

// @desc    Delete food place
// @route   DELETE /api/foodplaces/:id
// @access  Private/Admin
exports.deleteFoodPlace = asyncHandler(async (req, res, next) => {
  const foodPlace = await FoodPlace.findById(req.params.id);

  if (!foodPlace) {
    return next(new ErrorResponse(`Food place not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is food place owner or admin
  if (foodPlace.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this food place`, 401));
  }

  await foodPlace.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get food places within a radius
// @route   GET /api/foodplaces/radius/:lat/:lng/:distance
// @access  Public
exports.getFoodPlacesInRadius = asyncHandler(async (req, res, next) => {
  const { lat, lng, distance } = req.params;

  // Convert to numbers
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const radius = parseFloat(distance);

  // Validate coordinates
  if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
    return next(new ErrorResponse('Invalid coordinates or distance', 400));
  }

  const foodPlaces = await FoodPlace.getFoodPlacesInRadius(latitude, longitude, radius);

  res.status(200).json({
    success: true,
    count: foodPlaces.length,
    data: foodPlaces
  });
});

// @desc    Get food places by cuisine
// @route   GET /api/foodplaces/cuisine/:cuisine
// @access  Public
exports.getFoodPlacesByCuisine = asyncHandler(async (req, res, next) => {
  const { cuisine } = req.params;

  const foodPlaces = await FoodPlace.getFoodPlacesByCuisine(cuisine);

  res.status(200).json({
    success: true,
    count: foodPlaces.length,
    data: foodPlaces
  });
});

// @desc    Get food places by price range
// @route   GET /api/foodplaces/price/:min/:max
// @access  Public
exports.getFoodPlacesByPriceRange = asyncHandler(async (req, res, next) => {
  const { min, max } = req.params;

  const minCost = parseFloat(min);
  const maxCost = parseFloat(max);

  if (isNaN(minCost) || isNaN(maxCost)) {
    return next(new ErrorResponse('Invalid price range', 400));
  }

  const foodPlaces = await FoodPlace.getFoodPlacesByPriceRange(minCost, maxCost);

  res.status(200).json({
    success: true,
    count: foodPlaces.length,
    data: foodPlaces
  });
});

// @desc    Search food places
// @route   GET /api/foodplaces/search
// @access  Public
exports.searchFoodPlaces = asyncHandler(async (req, res, next) => {
  const { q, cuisine, priceRange, rating } = req.query;

  let query = { isActive: true };

  // Text search
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { 'location.address': { $regex: q, $options: 'i' } },
      { specialties: { $in: [new RegExp(q, 'i')] } }
    ];
  }

  // Filter by cuisine
  if (cuisine) {
    query.cuisine = { $in: [cuisine] };
  }

  // Filter by price range
  if (priceRange) {
    query.priceRange = priceRange;
  }

  // Filter by rating
  if (rating) {
    query.rating = { $gte: parseFloat(rating) };
  }

  const foodPlaces = await FoodPlace.find(query)
    .populate('nearbyPandals', 'name location.address')
    .sort('-rating -createdAt')
    .limit(50);

  res.status(200).json({
    success: true,
    count: foodPlaces.length,
    data: foodPlaces
  });
});

// @desc    Get food places near a pandal
// @route   GET /api/foodplaces/near-pandal/:pandalId
// @access  Public
exports.getFoodPlacesNearPandal = asyncHandler(async (req, res, next) => {
  const { pandalId } = req.params;

  const foodPlaces = await FoodPlace.find({
    nearbyPandals: pandalId,
    isActive: true
  }).sort('-rating');

  res.status(200).json({
    success: true,
    count: foodPlaces.length,
    data: foodPlaces
  });
});