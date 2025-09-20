#!/usr/bin/env node

const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const Pandal = require('../models/Pandal');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// Geocode address using Google Maps API
async function geocodeAddress(address) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    } else {
      console.warn(`⚠️  Geocoding failed for: ${address}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error geocoding ${address}:`, error.message);
    return null;
  }
}

// Add delay to respect API rate limits
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main geocoding function
async function geocodeAllPandals() {
  console.log('🔍 Starting geocoding process...\n');

  try {
    // Find all pandals without coordinates
    const pandals = await Pandal.find({
      $or: [
        { 'location.latitude': { $exists: false } },
        { 'location.longitude': { $exists: false } },
        { 'location.latitude': null },
        { 'location.longitude': null }
      ]
    });

    console.log(`📍 Found ${pandals.length} pandals to geocode\n`);

    if (pandals.length === 0) {
      console.log('✅ All pandals already have coordinates!');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < pandals.length; i++) {
      const pandal = pandals[i];
      console.log(`[${i + 1}/${pandals.length}] Geocoding: ${pandal.name}`);
      console.log(`Address: ${pandal.address}`);

      const coordinates = await geocodeAddress(pandal.address);

      if (coordinates) {
        // Update pandal with coordinates
        await Pandal.findByIdAndUpdate(pandal._id, {
          'location.latitude': coordinates.latitude,
          'location.longitude': coordinates.longitude
        });

        console.log(`✅ Success: ${coordinates.latitude}, ${coordinates.longitude}\n`);
        successCount++;
      } else {
        console.log(`❌ Failed to geocode\n`);
        failCount++;
      }

      // Add delay to respect Google API rate limits (avoid hitting quota)
      if (i < pandals.length - 1) {
        await delay(1000); // 1 second delay between requests
      }
    }

    console.log('📊 Geocoding Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📍 Total processed: ${pandals.length}`);

  } catch (error) {
    console.error('❌ Error during geocoding:', error.message);
  }
}

// Display all pandals with their coordinates
async function displayResults() {
  console.log('\n📋 All Pandals with Coordinates:\n');
  
  const pandals = await Pandal.find().sort({ name: 1 });
  
  pandals.forEach((pandal, index) => {
    console.log(`${index + 1}. ${pandal.name}`);
    console.log(`   Address: ${pandal.address}`);
    console.log(`   Area: ${pandal.areaCategory}`);
    
    if (pandal.location.latitude && pandal.location.longitude) {
      console.log(`   Coordinates: ${pandal.location.latitude}, ${pandal.location.longitude} ✅`);
    } else {
      console.log(`   Coordinates: Not available ❌`);
    }
    console.log('');
  });
}

// Main execution
async function main() {
  console.log('🚀 Pandal Geocoding Script\n');
  
  // Check if Google Maps API key is set
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.error('❌ GOOGLE_MAPS_API_KEY not found in environment variables');
    console.log('💡 Make sure your .env file has: GOOGLE_MAPS_API_KEY=your_api_key');
    process.exit(1);
  }

  await connectDB();
  await geocodeAllPandals();
  await displayResults();
  
  console.log('🎉 Geocoding process completed!');
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { geocodeAllPandals, geocodeAddress };