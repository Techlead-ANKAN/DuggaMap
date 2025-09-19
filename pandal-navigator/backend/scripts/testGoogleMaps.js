const googleMapsService = require('../utils/googleMaps');

async function testGoogleMapsAPI() {
  console.log('🔍 Testing Google Maps API...');
  console.log('API Key:', process.env.GOOGLE_MAPS_API_KEY ? 'Set ✅' : 'Missing ❌');
  
  try {
    // Test 1: Geocoding a Kolkata address
    console.log('\n📍 Test 1: Geocoding Kolkata address...');
    const geocodeResult = await googleMapsService.geocodeAddress('Park Street, Kolkata');
    console.log('Geocoding result:', geocodeResult.success ? '✅ Success' : '❌ Failed');
    if (geocodeResult.success) {
      console.log('   Coordinates:', geocodeResult.coordinates);
      console.log('   Address:', geocodeResult.formatted_address);
    } else {
      console.log('   Error:', geocodeResult.error);
    }

    // Test 2: Get directions between two Kolkata locations
    console.log('\n🗺️  Test 2: Getting directions...');
    const origin = { lat: 22.5726, lng: 88.3639 }; // Esplanade
    const destination = { lat: 22.5448, lng: 88.3426 }; // Park Street
    
    const directionsResult = await googleMapsService.getDirections(origin, destination, [], 'walking');
    console.log('Directions result:', directionsResult.success ? '✅ Success' : '❌ Failed');
    if (directionsResult.success) {
      console.log('   Distance:', directionsResult.route.distance.text);
      console.log('   Duration:', directionsResult.route.duration.text);
      console.log('   Steps:', directionsResult.route.steps.length);
    } else {
      console.log('   Error:', directionsResult.error);
      if (directionsResult.fallback) {
        console.log('   Fallback distance:', directionsResult.fallback.distance.text);
      }
    }

    // Test 3: Search nearby places
    console.log('\n🔍 Test 3: Searching nearby places...');
    const location = { lat: 22.5726, lng: 88.3639 };
    const placesResult = await googleMapsService.searchNearbyPlaces(location, 'restaurant', 1000);
    console.log('Places search result:', placesResult.success ? '✅ Success' : '❌ Failed');
    if (placesResult.success) {
      console.log('   Found places:', placesResult.places.length);
      if (placesResult.places.length > 0) {
        console.log('   First place:', placesResult.places[0].name);
      }
    } else {
      console.log('   Error:', placesResult.error);
    }

    console.log('\n🎉 Google Maps API testing complete!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  testGoogleMapsAPI();
}

module.exports = { testGoogleMapsAPI };