const axios = require('axios');

class GoogleMapsService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseURL = 'https://maps.googleapis.com/maps/api';
    
    if (!this.apiKey) {
      console.warn('⚠️  Google Maps API key not found. Some features may not work.');
    }
  }

  /**
   * Get directions between two points
   * @param {Object} origin - {lat, lng}
   * @param {Object} destination - {lat, lng}
   * @param {Array} waypoints - Array of {lat, lng} objects
   * @param {String} mode - 'driving', 'walking', 'transit'
   * @returns {Object} Directions response
   */
  async getDirections(origin, destination, waypoints = [], mode = 'walking') {
    try {
      const waypointsStr = waypoints.length > 0 
        ? waypoints.map(wp => `${wp.lat},${wp.lng}`).join('|')
        : '';

      const params = {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        mode: mode,
        key: this.apiKey
      };

      if (waypointsStr) {
        params.waypoints = waypointsStr;
        params.optimize = true; // Optimize waypoint order
      }

      const response = await axios.get(`${this.baseURL}/directions/json`, { params });
      
      if (response.data.status === 'OK') {
        return {
          success: true,
          data: response.data,
          route: this.parseDirectionsResponse(response.data)
        };
      } else {
        throw new Error(`Directions API error: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Error getting directions:', error.message);
      return {
        success: false,
        error: error.message,
        fallback: this.createFallbackRoute(origin, destination, waypoints)
      };
    }
  }

  /**
   * Geocode an address to coordinates
   * @param {String} address 
   * @returns {Object} Geocoding response
   */
  async geocodeAddress(address) {
    try {
      const response = await axios.get(`${this.baseURL}/geocode/json`, {
        params: {
          address: address,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          success: true,
          coordinates: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
          },
          formatted_address: result.formatted_address,
          place_id: result.place_id
        };
      } else {
        throw new Error(`Geocoding failed: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Error geocoding address:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Search for places near a location
   * @param {Object} location - {lat, lng}
   * @param {String} keyword - Search term
   * @param {Number} radius - Search radius in meters
   * @returns {Object} Places response
   */
  async searchNearbyPlaces(location, keyword = '', radius = 1000) {
    try {
      const response = await axios.get(`${this.baseURL}/place/nearbysearch/json`, {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: radius,
          keyword: keyword,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK') {
        return {
          success: true,
          places: response.data.results.map(place => ({
            place_id: place.place_id,
            name: place.name,
            location: place.geometry.location,
            rating: place.rating,
            types: place.types,
            vicinity: place.vicinity
          }))
        };
      } else {
        throw new Error(`Places API error: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Error searching places:', error.message);
      return {
        success: false,
        error: error.message,
        places: []
      };
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   * @param {Object} point1 - {lat, lng}
   * @param {Object} point2 - {lat, lng}
   * @returns {Number} Distance in kilometers
   */
  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Parse Google Directions API response into simplified format
   * @param {Object} directionsData 
   * @returns {Object} Parsed route data
   */
  parseDirectionsResponse(directionsData) {
    const route = directionsData.routes[0];
    const leg = route.legs[0];
    
    return {
      distance: leg.distance,
      duration: leg.duration,
      start_address: leg.start_address,
      end_address: leg.end_address,
      steps: leg.steps.map(step => ({
        instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
        distance: step.distance.text,
        duration: step.duration.text,
        start_location: step.start_location,
        end_location: step.end_location
      })),
      overview_polyline: route.overview_polyline.points
    };
  }

  /**
   * Create a fallback route when Google API fails
   * @param {Object} origin 
   * @param {Object} destination 
   * @param {Array} waypoints 
   * @returns {Object} Fallback route
   */
  createFallbackRoute(origin, destination, waypoints = []) {
    const distance = this.calculateDistance(origin, destination);
    const estimatedTime = Math.round(distance * 12); // Rough estimate: 12 min per km walking
    
    return {
      distance: { text: `${distance.toFixed(1)} km`, value: Math.round(distance * 1000) },
      duration: { text: `${estimatedTime} min`, value: estimatedTime * 60 },
      start_address: `${origin.lat}, ${origin.lng}`,
      end_address: `${destination.lat}, ${destination.lng}`,
      steps: [
        {
          instruction: `Walk from start to destination (approximately ${distance.toFixed(1)} km)`,
          distance: `${distance.toFixed(1)} km`,
          duration: `${estimatedTime} min`,
          start_location: origin,
          end_location: destination
        }
      ],
      note: 'This is a fallback route. Google Maps API was unavailable.'
    };
  }

  /**
   * Convert degrees to radians
   * @param {Number} degrees 
   * @returns {Number} Radians
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Optimize route for multiple pandals using Google's waypoint optimization
   * @param {Object} start - Starting point
   * @param {Object} end - Ending point  
   * @param {Array} pandals - Array of pandal locations
   * @param {String} mode - Travel mode
   * @returns {Object} Optimized route
   */
  async optimizeRoute(start, end, pandals, mode = 'walking') {
    if (pandals.length === 0) {
      return this.getDirections(start, end, [], mode);
    }

    // Convert pandals to waypoints
    const waypoints = pandals.map(pandal => ({
      lat: pandal.location.latitude,
      lng: pandal.location.longitude
    }));

    return this.getDirections(start, end, waypoints, mode);
  }
}

// Export singleton instance
const googleMapsService = new GoogleMapsService();
module.exports = googleMapsService;