#!/usr/bin/env node

require('dotenv').config();

function checkAtlasSetup() {
  console.log('🔍 MongoDB Atlas Configuration Checker\n');

  const checks = [
    {
      name: 'MONGODB_ATLAS_URI',
      value: process.env.MONGODB_ATLAS_URI,
      required: true,
      description: 'MongoDB Atlas connection string'
    },
    {
      name: 'MONGODB_URI (current)',
      value: process.env.MONGODB_URI,
      required: true,
      description: 'Current MongoDB connection (local)'
    },
    {
      name: 'GOOGLE_MAPS_API_KEY',
      value: process.env.GOOGLE_MAPS_API_KEY,
      required: true,
      description: 'Google Maps API key'
    },
    {
      name: 'CLERK_SECRET_KEY',
      value: process.env.CLERK_SECRET_KEY,
      required: true,
      description: 'Clerk authentication secret'
    }
  ];

  let allPassed = true;

  checks.forEach(check => {
    const status = check.value ? '✅' : '❌';
    const value = check.value ? 
      (check.name.includes('URI') || check.name.includes('KEY') ? 
        `${check.value.substring(0, 20)}...` : check.value) : 
      'NOT SET';
    
    console.log(`${status} ${check.name}: ${value}`);
    
    if (check.required && !check.value) {
      allPassed = false;
    }
  });

  console.log('\n📋 Status Summary:');
  if (allPassed) {
    console.log('✅ All required environment variables are set');
    console.log('🚀 Ready for Atlas migration!');
  } else {
    console.log('❌ Some required environment variables are missing');
    console.log('📖 Please check ATLAS_SETUP_GUIDE.md for setup instructions');
  }

  // Check if Atlas URI is properly formatted
  if (process.env.MONGODB_ATLAS_URI) {
    const isAtlasFormat = process.env.MONGODB_ATLAS_URI.includes('mongodb+srv://');
    const hasDatabase = process.env.MONGODB_ATLAS_URI.includes('pandal-navigator');
    
    console.log('\n🔍 Atlas URI Analysis:');
    console.log(`${isAtlasFormat ? '✅' : '❌'} Proper Atlas format (mongodb+srv://)`);
    console.log(`${hasDatabase ? '✅' : '❌'} Database name included (pandal-navigator)`);
    
    if (!isAtlasFormat || !hasDatabase) {
      console.log('⚠️ Please verify your Atlas connection string format');
    }
  }

  console.log('\n🔧 Next Steps:');
  if (!process.env.MONGODB_ATLAS_URI) {
    console.log('1. Complete MongoDB Atlas setup (see ATLAS_SETUP_GUIDE.md)');
    console.log('2. Add MONGODB_ATLAS_URI to your .env file');
    console.log('3. Run this checker again');
  } else {
    console.log('1. Run: npm run migrate-atlas');
    console.log('2. Test your application');
    console.log('3. Deploy to cloud');
  }
}

// Connection test function
async function testAtlasConnection() {
  if (!process.env.MONGODB_ATLAS_URI) {
    console.log('❌ MONGODB_ATLAS_URI not set. Cannot test connection.');
    return false;
  }

  console.log('🔄 Testing Atlas connection...');
  
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGODB_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`📍 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.log('❌ Atlas connection failed:', error.message);
    console.log('💡 Check your connection string and network access settings');
    return false;
  }
}

// CLI handling
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'test') {
    testAtlasConnection();
  } else {
    checkAtlasSetup();
  }
}

module.exports = { checkAtlasSetup, testAtlasConnection };