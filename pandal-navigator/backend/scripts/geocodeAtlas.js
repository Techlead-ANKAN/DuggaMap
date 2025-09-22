#!/usr/bin/env node

const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const Pandal = require('../models/Pandal');

// Connect to MongoDB Atlas
async function connectToAtlas() {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Atlas connection failed:', error.message);
    process.exit(1);
  }
}

// Geocode address using Google Maps API
async function geocodeAddress(address) {
  if (!address || address.trim() === '') {
    return null;
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address + ', Kolkata, West Bengal, India',
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
      console.log(`⚠️ No results for: ${address}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Geocoding error for ${address}:`, error.message);
    return null;
  }
}

// Add delay to respect API rate limits
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main geocoding function for Atlas
async function geocodeAtlasPandals() {
  try {
    const pandals = await Pandal.find({}).lean();
    console.log(`📍 Found ${pandals.length} pandals in Atlas database`);

    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < pandals.length; i++) {
      const pandal = pandals[i];
      
      console.log(`\n[${i + 1}/${pandals.length}] Processing: ${pandal.name}`);
      
      // Skip if coordinates already exist
      if (pandal.location && pandal.location.latitude && pandal.location.longitude) {
        console.log(`✅ Already has coordinates: ${pandal.location.latitude}, ${pandal.location.longitude}`);
        skippedCount++;
        continue;
      }

      // Skip if no address
      if (!pandal.address || pandal.address.trim() === '') {
        console.log(`⚠️ No address available, skipping...`);
        skippedCount++;
        continue;
      }

      console.log(`🔍 Geocoding: ${pandal.address}`);
      
      const coordinates = await geocodeAddress(pandal.address);
      
      if (coordinates) {
        // Update pandal with coordinates
        await Pandal.findByIdAndUpdate(pandal._id, {
          'location.latitude': coordinates.latitude,
          'location.longitude': coordinates.longitude
        });
        
        console.log(`✅ Updated: ${coordinates.latitude}, ${coordinates.longitude}`);
        successCount++;
      } else {
        console.log(`❌ Failed to geocode`);
        errorCount++;
      }

      // Add delay to respect API rate limits (Google Maps allows 50 requests per second)
      await delay(100); // 100ms delay = 10 requests per second (safe limit)
    }

    console.log('\n🎉 Geocoding Complete!');
    console.log(`📊 Results Summary:`);
    console.log(`   ✅ Successfully geocoded: ${successCount}`);
    console.log(`   ⏭️ Skipped (already had coordinates): ${skippedCount}`);
    console.log(`   ❌ Failed to geocode: ${errorCount}`);
    console.log(`   📍 Total pandals: ${pandals.length}`);

  } catch (error) {
    console.error('❌ Geocoding process failed:', error.message);
  }
}

// Display results
async function displayAtlasResults() {
  try {
    const pandals = await Pandal.find({});
    
    console.log('\n📋 Atlas Database Summary:');
    console.log(`Total Pandals: ${pandals.length}`);
    
    const withCoordinates = pandals.filter(p => 
      p.location && p.location.latitude && p.location.longitude
    );
    
    const withoutCoordinates = pandals.filter(p => 
      !p.location || !p.location.latitude || !p.location.longitude
    );

    console.log(`✅ With Coordinates: ${withCoordinates.length}`);
    console.log(`❌ Without Coordinates: ${withoutCoordinates.length}`);

    if (withoutCoordinates.length > 0) {
      console.log('\n⚠️ Pandals without coordinates:');
      withoutCoordinates.forEach((pandal, index) => {
        console.log(`   ${index + 1}. ${pandal.name} - ${pandal.address || 'No address'}`);
      });
    }

    console.log('\n✅ Sample pandals with coordinates:');
    withCoordinates.slice(0, 5).forEach((pandal, index) => {
      console.log(`   ${index + 1}. ${pandal.name}: ${pandal.location.latitude}, ${pandal.location.longitude}`);
    });

  } catch (error) {
    console.error('❌ Error displaying results:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Atlas Pandal Geocoding Script\n');
  
  // Check if Google Maps API key is set
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.error('❌ GOOGLE_MAPS_API_KEY not found in environment variables');
    console.log('💡 Make sure your .env file has: GOOGLE_MAPS_API_KEY=your_api_key');
    process.exit(1);
  }

  // Check if Atlas URI is set
  if (!process.env.MONGODB_ATLAS_URI) {
    console.error('❌ MONGODB_ATLAS_URI not found in environment variables');
    console.log('💡 Make sure your .env file has: MONGODB_ATLAS_URI=your_atlas_connection_string');
    process.exit(1);
  }

  await connectToAtlas();
  await geocodeAtlasPandals();
  await displayAtlasResults();
  
  console.log('🎉 Atlas geocoding process completed!');
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { geocodeAtlasPandals, geocodeAddress };