const axios = require('axios');
const { validationResult } = require('express-validator');
const Route = require('../models/Route');
const Pandal = require('../models/Pandal');
const FoodPlace = require('../models/FoodPlace');
const googleMapsService = require('../utils/googleMaps');
const routeOptimizer = require('../utils/routeOptimizer');

// Google Maps API helper function
const getGoogleMapsDirections = async (origin, destination, waypoints = [], mode = 'walking') => {
  try {
    const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
    
    let waypointsStr = '';
    if (waypoints.length > 0) {
      waypointsStr = waypoints.map(wp => `${wp.lat},${wp.lng}`).join('|');
    }

    const params = {
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      mode: mode === 'public-transport' ? 'transit' : mode,
      key: process.env.GOOGLE_MAPS_API_KEY,
      optimize: true
    };

    if (waypointsStr) {
      params.waypoints = `optimize:true|${waypointsStr}`;
    }

    const response = await axios.get(baseUrl, { params });
    
    if (response.data.status === 'OK') {
      return response.data;
    } else {
      throw new Error(`Google Maps API error: ${response.data.status}`);
    }
  } catch (error) {
    throw new Error(`Failed to get directions: ${error.message}`);
  }
};

// @desc    Plan optimized route
// @route   POST /api/routes/plan
// @access  Private
const planRoute = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      startPoint,
      endPoint,
      selectedPandals,
      areaCategory,
      transportMode = 'walking',
      preferences = {},
      includeFoodStops = true
    } = req.body;

    // Get detailed pandal information
    const pandals = await Pandal.find({
      _id: { $in: selectedPandals },
      isActive: true
    });

    if (pandals.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid pandals found'
      });
    }

    // Prepare waypoints for Google Maps API
    const waypoints = pandals.map(pandal => ({
      lat: pandal.location.latitude,
      lng: pandal.location.longitude,
      id: pandal._id
    }));

    // Get optimized route from Google Maps
    const directionsData = await getGoogleMapsDirections(
      { lat: startPoint.latitude, lng: startPoint.longitude },
      { lat: endPoint.latitude, lng: endPoint.longitude },
      waypoints,
      transportMode
    );

    // Calculate route statistics
    const route = directionsData.routes[0];
    const totalDistanceMeters = route.legs.reduce((sum, leg) => sum + leg.distance.value, 0);
    const totalDurationSeconds = route.legs.reduce((sum, leg) => sum + leg.duration.value, 0);
    
    const totalDistance = totalDistanceMeters / 1000; // Convert to km
    const estimatedTime = Math.ceil(totalDurationSeconds / 60); // Convert to minutes

    // Create roadmap from Google Maps steps
    const roadmap = [];
    route.legs.forEach(leg => {
      leg.steps.forEach(step => {
        roadmap.push({
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
          distance: step.distance.value,
          time: Math.ceil(step.duration.value / 60),
          location: {
            latitude: step.end_location.lat,
            longitude: step.end_location.lng
          }
        });
      });
    });

    // Find food stops if requested
    let foodStops = [];
    if (includeFoodStops) {
      for (let pandal of pandals) {
        const nearbyFoodPlaces = await FoodPlace.getFoodPlacesInRadius(
          pandal.location.latitude,
          pandal.location.longitude,
          0.5 // 500 meters radius
        );
        
        // Select best food places based on rating and preferences
        const selectedFoodPlaces = nearbyFoodPlaces
          .filter(foodPlace => {
            if (preferences.budget) {
              const budgetMatch = {
                'low': ['Budget'],
                'medium': ['Budget', 'Mid-range'],
                'high': ['Budget', 'Mid-range', 'Expensive']
              };
              return budgetMatch[preferences.budget].includes(foodPlace.priceRange);
            }
            return true;
          })
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 1);

        foodStops.push(...selectedFoodPlaces.map(fp => fp._id));
      }
      // Remove duplicates
      foodStops = [...new Set(foodStops)];
    }

    // Calculate estimated costs
    const transportCost = calculateTransportCost(totalDistanceMeters, transportMode);
    const foodCost = foodStops.length * estimateFoodCost(preferences.budget || 'medium');

    // Generate alternate routes
    const alternateRoutes = await generateAlternateRoutes(
      startPoint,
      endPoint,
      pandals,
      areaCategory,
      transportMode
    );

    const routeData = {
      userId: req.user.id,
      name: `${areaCategory} Route - ${new Date().toLocaleDateString()}`,
      areaCategory,
      startPoint,
      endPoint,
      transportMode,
      estimatedTime,
      totalDistance,
      pandalsCovered: pandals.map(p => p._id),
      foodStops,
      roadmap,
      alternateRoutes,
      preferences,
      optimization: {
        optimizedBy: 'time',
        optimizationScore: calculateOptimizationScore(route)
      },
      estimatedCost: {
        transport: transportCost,
        food: foodCost,
        total: transportCost + foodCost
      }
    };

    res.status(200).json({
      success: true,
      message: 'Route planned successfully',
      data: routeData
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Save route
// @route   POST /api/routes/save
// @access  Private
const saveRoute = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    
    const route = await Route.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Route saved successfully',
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user routes
// @route   GET /api/routes/user
// @access  Private
const getUserRoutes = async (req, res, next) => {
  try {
    const routes = await Route.getUserRoutes(req.user.id);

    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get route by ID
// @route   GET /api/routes/:id
// @access  Private
const getRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('pandalsCovered', 'name location.address areaCategory theme.title')
      .populate('foodStops', 'name location.address cuisine')
      .populate('userId', 'name avatar');

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Check if user owns the route or if it's public
    if (route.userId._id.toString() !== req.user.id && !route.sharing.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Increment view count if it's a public route and not the owner
    if (route.sharing.isPublic && route.userId._id.toString() !== req.user.id) {
      route.sharing.views += 1;
      await route.save();
    }

    res.status(200).json({
      success: true,
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update route
// @route   PUT /api/routes/:id
// @access  Private
const updateRoute = async (req, res, next) => {
  try {
    let route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Check ownership
    if (route.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Route updated successfully',
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete route
// @route   DELETE /api/routes/:id
// @access  Private
const deleteRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Check ownership
    if (route.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Route.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Share route
// @route   POST /api/routes/:id/share
// @access  Private
const shareRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    if (route.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!route.sharing.shareCode) {
      await route.generateShareCode();
    }

    route.sharing.isPublic = true;
    await route.save();

    res.status(200).json({
      success: true,
      message: 'Route shared successfully',
      data: {
        shareCode: route.sharing.shareCode,
        shareUrl: `${req.protocol}://${req.get('host')}/routes/shared/${route.sharing.shareCode}`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular routes
// @route   GET /api/routes/popular
// @access  Public
const getPopularRoutes = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const routes = await Route.getPopularRoutes(parseInt(limit));

    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get routes by area category
// @route   GET /api/routes/area/:areaCategory
// @access  Public
const getRoutesByArea = async (req, res, next) => {
  try {
    const { areaCategory } = req.params;
    
    const routes = await Route.getRoutesByArea(areaCategory);

    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Optimize existing route
// @route   POST /api/routes/:id/optimize
// @access  Private
const optimizeRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('pandalsCovered', 'location.latitude location.longitude');

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    if (route.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Re-optimize the route using Google Maps
    const waypoints = route.pandalsCovered.map(pandal => ({
      lat: pandal.location.latitude,
      lng: pandal.location.longitude,
      id: pandal._id
    }));

    const directionsData = await getGoogleMapsDirections(
      { lat: route.startPoint.latitude, lng: route.startPoint.longitude },
      { lat: route.endPoint.latitude, lng: route.endPoint.longitude },
      waypoints,
      route.transportMode
    );

    // Update route with optimized data
    const optimizedRoute = directionsData.routes[0];
    const totalDistanceMeters = optimizedRoute.legs.reduce((sum, leg) => sum + leg.distance.value, 0);
    const totalDurationSeconds = optimizedRoute.legs.reduce((sum, leg) => sum + leg.duration.value, 0);

    route.totalDistance = totalDistanceMeters / 1000; // Convert to km
    route.estimatedTime = Math.ceil(totalDurationSeconds / 60); // Convert to minutes
    route.optimization.optimizationScore = calculateOptimizationScore(optimizedRoute);

    // Update roadmap
    const roadmap = [];
    optimizedRoute.legs.forEach(leg => {
      leg.steps.forEach(step => {
        roadmap.push({
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
          distance: step.distance.value,
          time: Math.ceil(step.duration.value / 60),
          location: {
            latitude: step.end_location.lat,
            longitude: step.end_location.lng
          }
        });
      });
    });

    route.roadmap = roadmap;
    await route.save();

    res.status(200).json({
      success: true,
      message: 'Route optimized successfully',
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
const calculateTransportCost = (distanceMeters, method) => {
  const distance = distanceMeters / 1000; // Convert to km
  const rates = {
    walking: 0,
    car: distance * 8, // ₹8 per km for fuel
    'public-transport': Math.min(50, distance * 2) // Max ₹50, ₹2 per km
  };
  return Math.ceil(rates[method] || 0);
};

const estimateFoodCost = (budget) => {
  const costs = { 
    low: 80, 
    medium: 150, 
    high: 300 
  };
  return costs[budget] || 150;
};

const calculateOptimizationScore = (route) => {
  // Simple scoring based on route efficiency
  const baseScore = 75;
  const legCount = route.legs.length;
  const penaltyPerLeg = 3;
  
  return Math.max(50, Math.min(95, baseScore - (legCount * penaltyPerLeg)));
};

const generateAlternateRoutes = async (startPoint, endPoint, pandals, areaCategory, transportMode) => {
  const alternates = [];
  
  try {
    // Alternate 1: Quick route (fewer pandals)
    if (pandals.length > 3) {
      const quickPandals = pandals
        .sort((a, b) => b.rating - a.rating)
        .slice(0, Math.min(3, pandals.length));
      
      alternates.push({
        pandalsCovered: quickPandals.map(p => p._id),
        estimatedTime: 90, // Estimated
        totalDistance: 5, // Estimated
        reason: 'Quick tour with top-rated pandals'
      });
    }

    // Alternate 2: Budget route (walking focused)
    if (transportMode !== 'walking') {
      const nearbyPandals = pandals.slice(0, Math.min(4, pandals.length));
      
      alternates.push({
        pandalsCovered: nearbyPandals.map(p => p._id),
        estimatedTime: 120, // Estimated
        totalDistance: 3, // Estimated  
        reason: 'Budget-friendly walking route'
      });
    }

  } catch (error) {
    console.error('Error generating alternate routes:', error);
  }

  return alternates;
};

module.exports = {
  planRoute,
  saveRoute,
  getUserRoutes,
  getRoute,
  updateRoute,
  deleteRoute,
  shareRoute,
  getPopularRoutes,
  getRoutesByArea,
  optimizeRoute
};