#!/usr/bin/env node

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Pandal = require('../models/Pandal');
const FoodPlace = require('../models/FoodPlace');
const Route = require('../models/Route');

async function exportData() {
  try {
    console.log('🔄 Connecting to local MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create export directory
    const exportDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    console.log('\n📦 Exporting data...');

    // Export Users
    const users = await User.find({}).lean();
    fs.writeFileSync(
      path.join(exportDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`✅ Users: ${users.length} records exported`);

    // Export Pandals
    const pandals = await Pandal.find({}).lean();
    fs.writeFileSync(
      path.join(exportDir, 'pandals.json'),
      JSON.stringify(pandals, null, 2)
    );
    console.log(`✅ Pandals: ${pandals.length} records exported`);

    // Export FoodPlaces
    const foodPlaces = await FoodPlace.find({}).lean();
    fs.writeFileSync(
      path.join(exportDir, 'foodplaces.json'),
      JSON.stringify(foodPlaces, null, 2)
    );
    console.log(`✅ Food Places: ${foodPlaces.length} records exported`);

    // Export Routes
    const routes = await Route.find({}).lean();
    fs.writeFileSync(
      path.join(exportDir, 'routes.json'),
      JSON.stringify(routes, null, 2)
    );
    console.log(`✅ Routes: ${routes.length} records exported`);

    console.log(`\n🎉 All data exported to: ${exportDir}`);
    console.log('📁 Files created:');
    console.log('   - users.json');
    console.log('   - pandals.json');
    console.log('   - foodplaces.json');
    console.log('   - routes.json');

  } catch (error) {
    console.error('❌ Export failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run export
if (require.main === module) {
  exportData().catch(console.error);
}

module.exports = { exportData };