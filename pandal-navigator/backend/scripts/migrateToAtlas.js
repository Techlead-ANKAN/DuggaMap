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

async function migrateToAtlas() {
  console.log('🚀 MongoDB Atlas Migration Script\n');
  
  // Step 1: Export from local MongoDB
  console.log('📦 Step 1: Exporting data from local MongoDB...');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to local MongoDB');

    // Create export directory
    const exportDir = path.join(__dirname, '../atlas-migration');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Export existing data
    const users = await User.find({}).lean();
    const pandals = await Pandal.find({}).lean();
    const foodPlaces = await FoodPlace.find({}).lean();
    const routes = await Route.find({}).lean();

    // Save exports
    fs.writeFileSync(path.join(exportDir, 'users-backup.json'), JSON.stringify(users, null, 2));
    fs.writeFileSync(path.join(exportDir, 'pandals-backup.json'), JSON.stringify(pandals, null, 2));
    fs.writeFileSync(path.join(exportDir, 'foodplaces-backup.json'), JSON.stringify(foodPlaces, null, 2));
    fs.writeFileSync(path.join(exportDir, 'routes-backup.json'), JSON.stringify(routes, null, 2));

    console.log(`✅ Exported ${users.length} users, ${pandals.length} pandals, ${foodPlaces.length} food places, ${routes.length} routes`);
    
    await mongoose.connection.close();
    console.log('✅ Local MongoDB connection closed\n');

    // Step 2: Connect to Atlas and import
    console.log('☁️ Step 2: Connecting to MongoDB Atlas...');
    
    if (!process.env.MONGODB_ATLAS_URI) {
      console.log('⚠️ MONGODB_ATLAS_URI not found in environment variables');
      console.log('💡 Please add your Atlas connection string to .env file as MONGODB_ATLAS_URI');
      console.log('💡 Format: MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/pandal-navigator');
      return;
    }

    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing Atlas data (if any)
    await User.deleteMany({});
    await Pandal.deleteMany({});
    await FoodPlace.deleteMany({});
    await Route.deleteMany({});
    console.log('🧹 Cleared existing Atlas data');

    // Import data to Atlas
    if (users.length > 0) await User.insertMany(users);
    if (pandals.length > 0) await Pandal.insertMany(pandals);
    if (foodPlaces.length > 0) await FoodPlace.insertMany(foodPlaces);
    if (routes.length > 0) await Route.insertMany(routes);

    console.log('✅ Successfully imported all data to MongoDB Atlas');
    
    // Load new pandal data from pandal.json
    console.log('\n📥 Step 3: Adding new pandal data...');
    const newPandalsPath = path.join(__dirname, '../pandal.json');
    if (fs.existsSync(newPandalsPath)) {
      const newPandals = JSON.parse(fs.readFileSync(newPandalsPath, 'utf8'));
      
      // Check for duplicates and add only new ones
      const existingPandalNames = (await Pandal.find({}).select('name')).map(p => p.name);
      const uniqueNewPandals = newPandals.filter(p => !existingPandalNames.includes(p.name));
      
      if (uniqueNewPandals.length > 0) {
        await Pandal.insertMany(uniqueNewPandals);
        console.log(`✅ Added ${uniqueNewPandals.length} new pandals`);
      } else {
        console.log('ℹ️ No new pandals to add (all already exist)');
      }
    }

    // Final count
    const finalCounts = {
      users: await User.countDocuments(),
      pandals: await Pandal.countDocuments(),
      foodPlaces: await FoodPlace.countDocuments(),
      routes: await Route.countDocuments()
    };

    console.log('\n🎉 Migration Complete!');
    console.log('📊 Final Atlas Database Summary:');
    console.log(`   Users: ${finalCounts.users}`);
    console.log(`   Pandals: ${finalCounts.pandals}`);
    console.log(`   Food Places: ${finalCounts.foodPlaces}`);
    console.log(`   Routes: ${finalCounts.routes}`);

    console.log('\n🔧 Next Steps:');
    console.log('1. Update your .env file to use MONGODB_URI with Atlas connection string');
    console.log('2. Test your application with the new Atlas database');
    console.log('3. Deploy your backend to a cloud service');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run migration
if (require.main === module) {
  migrateToAtlas().catch(console.error);
}

module.exports = { migrateToAtlas };