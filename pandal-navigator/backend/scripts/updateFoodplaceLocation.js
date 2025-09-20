#!/usr/bin/env node

const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

async function updateFoodplaceLocation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Get the foodplace
    const foodplace = await db.collection('foodplaces').findOne({ name: 'Arsalan Restaurant' });
    
    if (!foodplace) {
      console.log('❌ Foodplace not found');
      return;
    }

    console.log('📍 Current foodplace:', foodplace.name);
    console.log('📍 Current location:', foodplace.location);

    // Add coordinates using geocoding
    const address = 'Park Circus, Kolkata 700017';
    
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        
        // Update the foodplace
        const result = await db.collection('foodplaces').updateOne(
          { name: 'Arsalan Restaurant' },
          { 
            $set: { 
              'location.address': address,
              'location.latitude': location.lat,
              'location.longitude': location.lng
            }
          }
        );

        console.log('✅ Updated foodplace location:', result.modifiedCount, 'documents');
        console.log('📍 New coordinates:', location.lat, location.lng);

        // Verify the update
        const updated = await db.collection('foodplaces').findOne({ name: 'Arsalan Restaurant' });
        console.log('✅ Verified location:', updated.location);

      } else {
        console.log('❌ Geocoding failed:', response.data.status);
      }
    } catch (geocodeError) {
      console.error('❌ Geocoding error:', geocodeError.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

updateFoodplaceLocation();