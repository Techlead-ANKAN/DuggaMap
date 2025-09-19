const googleMapsService = require('./googleMaps');

class RouteOptimizer {
  constructor() {
    this.defaultTransportModes = {
      walking: { speed: 5, maxDistance: 10 }, // 5 km/h, max 10km
      car: { speed: 25, maxDistance: 50 },    // 25 km/h in city, max 50km
      'public-transport': { speed: 20, maxDistance: 30 } // 20 km/h average, max 30km
    };
  }

  /**
   * Create optimized route for pandal hopping
   * @param {Object} params - Route parameters
   * @returns {Object} Optimized route plan
   */
  async createOptimizedRoute(params) {
    const {
      startPoint,
      endPoint,
      selectedPandals,
      transportMode = 'walking',
      includeFood = false,
      maxTravelTime = 480, // 8 hours in minutes
      preferences = {}
    } = params;

    try {
      // Step 1: Validate inputs
      const validation = this.validateRouteParams(params);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Step 2: Get pandal data with coordinates
      const pandalData = await this.enrichPandalData(selectedPandals);
      
      // Step 3: Create optimized route using Google Maps
      const optimizedRoute = await this.optimizeWithGoogleMaps(
        startPoint,
        endPoint,
        pandalData,
        transportMode
      );

      // Step 4: Add food stops if requested
      if (includeFood && optimizedRoute.success) {
        optimizedRoute.foodStops = await this.addFoodStops(
          optimizedRoute.route.steps,
          preferences.cuisine
        );
      }

      // Step 5: Calculate detailed timing and costs
      const routeAnalysis = this.analyzeRoute(optimizedRoute, transportMode, preferences);

      // Step 6: Generate alternative routes
      const alternatives = await this.generateAlternativeRoutes(
        startPoint,
        endPoint,
        pandalData,
        transportMode
      );

      return {
        success: true,
        route: {
          ...optimizedRoute,
          analysis: routeAnalysis,
          alternatives: alternatives,
          recommendations: this.generateRecommendations(routeAnalysis, preferences)
        }
      };

    } catch (error) {
      console.error('Route optimization error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.createFallbackRoute(startPoint, endPoint, selectedPandals, transportMode)
      };
    }
  }

  /**
   * Validate route parameters
   * @param {Object} params 
   * @returns {Object} Validation result
   */
  validateRouteParams(params) {
    const { startPoint, endPoint, selectedPandals, transportMode } = params;

    if (!startPoint || !startPoint.latitude || !startPoint.longitude) {
      return { isValid: false, error: 'Valid start point is required' };
    }

    if (!endPoint || !endPoint.latitude || !endPoint.longitude) {
      return { isValid: false, error: 'Valid end point is required' };
    }

    if (!selectedPandals || selectedPandals.length === 0) {
      return { isValid: false, error: 'At least one pandal must be selected' };
    }

    if (!['walking', 'car', 'public-transport'].includes(transportMode)) {
      return { isValid: false, error: 'Invalid transport mode' };
    }

    // Check maximum pandals based on transport mode
    const maxPandals = transportMode === 'walking' ? 8 : 15;
    if (selectedPandals.length > maxPandals) {
      return { 
        isValid: false, 
        error: `Too many pandals selected. Maximum ${maxPandals} for ${transportMode}` 
      };
    }

    return { isValid: true };
  }

  /**
   * Enrich pandal data with additional information
   * @param {Array} pandalIds 
   * @returns {Array} Enriched pandal data
   */
  async enrichPandalData(pandalIds) {
    // This would typically fetch from database
    // For now, return mock data structure
    return pandalIds.map(id => ({
      id: id,
      location: {
        latitude: 22.5726 + (Math.random() - 0.5) * 0.1, // Mock coordinates around Kolkata
        longitude: 88.3639 + (Math.random() - 0.5) * 0.1
      },
      estimatedVisitTime: 60 + Math.random() * 30, // 60-90 minutes
      crowdLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      openingTime: '06:00',
      closingTime: '23:00'
    }));
  }

  /**
   * Optimize route using Google Maps API
   * @param {Object} start 
   * @param {Object} end 
   * @param {Array} pandals 
   * @param {String} mode 
   * @returns {Object} Optimized route
   */
  async optimizeWithGoogleMaps(start, end, pandals, mode) {
    return await googleMapsService.optimizeRoute(start, end, pandals, mode);
  }

  /**
   * Add food stops along the route
   * @param {Array} routeSteps 
   * @param {Array} preferredCuisine 
   * @returns {Array} Food stops
   */
  async addFoodStops(routeSteps, preferredCuisine = []) {
    const foodStops = [];
    
    // Find midpoints in the route for food stops
    const midPoints = this.findMidPoints(routeSteps, 3); // Max 3 food stops
    
    for (const point of midPoints) {
      const nearbyFood = await googleMapsService.searchNearbyPlaces(
        point,
        'restaurant food',
        500 // 500m radius
      );
      
      if (nearbyFood.success && nearbyFood.places.length > 0) {
        foodStops.push({
          location: point,
          options: nearbyFood.places.slice(0, 3), // Top 3 options
          timing: 'After 2-3 pandals' // Rough timing suggestion
        });
      }
    }
    
    return foodStops;
  }

  /**
   * Analyze route for timing, costs, and recommendations
   * @param {Object} route 
   * @param {String} transportMode 
   * @param {Object} preferences 
   * @returns {Object} Route analysis
   */
  analyzeRoute(route, transportMode, preferences) {
    if (!route.success) {
      return { error: 'Route optimization failed' };
    }

    const analysis = {
      timing: this.calculateDetailedTiming(route, transportMode),
      costs: this.estimateCosts(route, transportMode, preferences),
      difficulty: this.assessDifficulty(route, transportMode),
      crowdFactors: this.analyzeCrowdFactors(route),
      weatherConsiderations: this.getWeatherConsiderations(transportMode)
    };

    return analysis;
  }

  /**
   * Calculate detailed timing breakdown
   * @param {Object} route 
   * @param {String} transportMode 
   * @returns {Object} Timing breakdown
   */
  calculateDetailedTiming(route, transportMode) {
    const baseRoute = route.route || route;
    
    return {
      totalTravelTime: baseRoute.duration?.text || 'Unknown',
      estimatedVisitTime: '4-6 hours', // Based on average pandal visits
      bestStartTime: '10:00 AM', // Avoid morning rush and evening crowds
      estimatedEndTime: '6:00 PM',
      breakSuggestions: [
        { time: '12:30 PM', activity: 'Lunch break', duration: '45 min' },
        { time: '3:30 PM', activity: 'Tea/snack break', duration: '15 min' }
      ]
    };
  }

  /**
   * Estimate costs for the route
   * @param {Object} route 
   * @param {String} transportMode 
   * @param {Object} preferences 
   * @returns {Object} Cost breakdown
   */
  estimateCosts(route, transportMode, preferences) {
    const baseCosts = {
      walking: { transport: 0, food: 500, misc: 200 },
      car: { transport: 300, food: 800, misc: 300 },
      'public-transport': { transport: 100, food: 600, misc: 250 }
    };

    const costs = baseCosts[transportMode] || baseCosts.walking;
    
    return {
      transport: costs.transport,
      food: costs.food,
      miscellaneous: costs.misc,
      total: costs.transport + costs.food + costs.misc,
      currency: 'INR',
      breakdown: {
        'Auto/Taxi/Bus': costs.transport,
        'Food & Beverages': costs.food,
        'Miscellaneous': costs.misc
      }
    };
  }

  /**
   * Assess route difficulty
   * @param {Object} route 
   * @param {String} transportMode 
   * @returns {String} Difficulty level
   */
  assessDifficulty(route, transportMode) {
    const distance = route.route?.distance?.value || 0;
    const numStops = (route.route?.steps?.length || 0) - 2; // Exclude start/end
    
    if (transportMode === 'walking') {
      if (distance > 8000 || numStops > 6) return 'Hard';
      if (distance > 4000 || numStops > 4) return 'Medium';
      return 'Easy';
    } else {
      if (numStops > 10) return 'Hard';
      if (numStops > 6) return 'Medium';
      return 'Easy';
    }
  }

  /**
   * Analyze crowd factors
   * @param {Object} route 
   * @returns {Object} Crowd analysis
   */
  analyzeCrowdFactors(route) {
    return {
      peakHours: ['11:00 AM - 1:00 PM', '6:00 PM - 9:00 PM'],
      recommendedHours: ['9:00 AM - 11:00 AM', '2:00 PM - 5:00 PM'],
      crowdManagement: [
        'Visit popular pandals early morning',
        'Use alternative routes during peak hours',
        'Keep emergency contact numbers handy'
      ]
    };
  }

  /**
   * Get weather considerations
   * @param {String} transportMode 
   * @returns {Array} Weather tips
   */
  getWeatherConsiderations(transportMode) {
    const tips = [
      'Check weather forecast before starting',
      'Carry umbrella during monsoon season',
      'Stay hydrated, especially during day time'
    ];

    if (transportMode === 'walking') {
      tips.push('Wear comfortable walking shoes');
      tips.push('Carry water bottle');
    }

    return tips;
  }

  /**
   * Find midpoints along route for food stops
   * @param {Array} steps 
   * @param {Number} maxStops 
   * @returns {Array} Midpoint locations
   */
  findMidPoints(steps, maxStops = 3) {
    if (!steps || steps.length < 2) return [];
    
    const midPoints = [];
    const stepInterval = Math.floor(steps.length / (maxStops + 1));
    
    for (let i = stepInterval; i < steps.length; i += stepInterval) {
      if (midPoints.length >= maxStops) break;
      
      const step = steps[i];
      if (step.start_location) {
        midPoints.push({
          lat: step.start_location.lat,
          lng: step.start_location.lng
        });
      }
    }
    
    return midPoints;
  }

  /**
   * Generate alternative routes
   * @param {Object} start 
   * @param {Object} end 
   * @param {Array} pandals 
   * @param {String} mode 
   * @returns {Array} Alternative routes
   */
  async generateAlternativeRoutes(start, end, pandals, mode) {
    // For now, return one alternative with different transport mode
    const alternativeMode = mode === 'walking' ? 'public-transport' : 'walking';
    
    try {
      const altRoute = await this.optimizeWithGoogleMaps(start, end, pandals, alternativeMode);
      return [{
        mode: alternativeMode,
        route: altRoute,
        benefit: `Try ${alternativeMode} for different experience`
      }];
    } catch (error) {
      return [];
    }
  }

  /**
   * Generate recommendations based on route analysis
   * @param {Object} analysis 
   * @param {Object} preferences 
   * @returns {Array} Recommendations
   */
  generateRecommendations(analysis, preferences) {
    const recommendations = [
      'Start early to avoid crowds',
      'Keep phone charged for navigation',
      'Carry cash for food and transport'
    ];

    if (analysis.difficulty === 'Hard') {
      recommendations.push('Consider splitting into multiple days');
      recommendations.push('Take frequent breaks');
    }

    if (preferences.includeFood) {
      recommendations.push('Try local Bengali cuisine at food stops');
    }

    return recommendations;
  }

  /**
   * Create fallback route when optimization fails
   * @param {Object} start 
   * @param {Object} end 
   * @param {Array} pandals 
   * @param {String} mode 
   * @returns {Object} Fallback route
   */
  createFallbackRoute(start, end, pandals, mode) {
    return {
      route: {
        distance: { text: 'Unknown', value: 0 },
        duration: { text: 'Unknown', value: 0 },
        steps: [
          {
            instruction: 'Manual navigation required - Google Maps API unavailable',
            note: 'Please use your preferred navigation app'
          }
        ]
      },
      alternatives: [],
      recommendations: [
        'Use Google Maps app directly for navigation',
        'Plan route manually using pandal addresses',
        'Consider using local transport apps'
      ]
    };
  }
}

// Export singleton instance
const routeOptimizer = new RouteOptimizer();
module.exports = routeOptimizer;