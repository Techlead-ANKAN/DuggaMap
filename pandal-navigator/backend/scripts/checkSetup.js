#!/usr/bin/env node

const mongoose = require('mongoose');
const chalk = require('chalk');
require('dotenv').config();

async function checkSetup() {
  console.log(chalk.blue('🔍 Checking Pandal Navigator Backend Setup...\n'));

  // Check environment variables
  console.log(chalk.yellow('1. Environment Variables:'));
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
  const optionalEnvVars = ['GOOGLE_MAPS_API_KEY', 'PORT', 'NODE_ENV'];
  
  let missingRequired = [];
  let missingOptional = [];

  requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(chalk.green(`   ✅ ${envVar}: Set`));
    } else {
      console.log(chalk.red(`   ❌ ${envVar}: Missing`));
      missingRequired.push(envVar);
    }
  });

  optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(chalk.green(`   ✅ ${envVar}: Set`));
    } else {
      console.log(chalk.yellow(`   ⚠️  ${envVar}: Not set (optional)`));
      missingOptional.push(envVar);
    }
  });

  // Check database connection
  console.log(chalk.yellow('\n2. Database Connection:'));
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pandal-navigator');
    console.log(chalk.green('   ✅ MongoDB: Connected successfully'));
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    const expectedCollections = ['users', 'pandals', 'foodplaces', 'routes'];
    const hasData = expectedCollections.every(name => collectionNames.includes(name));
    
    if (hasData) {
      console.log(chalk.green('   ✅ Collections: All expected collections exist'));
      
      // Check if collections have data
      const User = require('../models/User');
      const Pandal = require('../models/Pandal');
      const FoodPlace = require('../models/FoodPlace');
      
      const userCount = await User.countDocuments();
      const pandalCount = await Pandal.countDocuments();
      const foodPlaceCount = await FoodPlace.countDocuments();
      
      console.log(chalk.cyan(`   📊 Data Summary:`));
      console.log(chalk.cyan(`      Users: ${userCount}`));
      console.log(chalk.cyan(`      Pandals: ${pandalCount}`));
      console.log(chalk.cyan(`      Food Places: ${foodPlaceCount}`));
      
      if (userCount === 0 || pandalCount === 0 || foodPlaceCount === 0) {
        console.log(chalk.yellow('   ⚠️  Some collections are empty. Run "npm run seed" to populate data.'));
      }
    } else {
      console.log(chalk.yellow('   ⚠️  Some collections missing. Run "npm run seed" to create sample data.'));
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.log(chalk.red(`   ❌ MongoDB: Connection failed - ${error.message}`));
  }

  // Check dependencies
  console.log(chalk.yellow('\n3. Dependencies:'));
  try {
    const packageJson = require('../package.json');
    const dependencies = Object.keys(packageJson.dependencies);
    
    console.log(chalk.green(`   ✅ Dependencies: ${dependencies.length} packages installed`));
    
    // Check for critical dependencies
    const criticalDeps = ['express', 'mongoose', 'bcryptjs', 'jsonwebtoken'];
    const missingCritical = criticalDeps.filter(dep => !dependencies.includes(dep));
    
    if (missingCritical.length === 0) {
      console.log(chalk.green('   ✅ Critical dependencies: All present'));
    } else {
      console.log(chalk.red(`   ❌ Missing critical dependencies: ${missingCritical.join(', ')}`));
    }
  } catch (error) {
    console.log(chalk.red(`   ❌ Dependencies: Could not read package.json`));
  }

  // Summary
  console.log(chalk.blue('\n📋 Setup Summary:'));
  
  if (missingRequired.length === 0) {
    console.log(chalk.green('✅ Backend setup is complete!'));
    console.log(chalk.cyan('\n🚀 Next steps:'));
    console.log(chalk.cyan('   1. Run "npm run dev" to start the development server'));
    console.log(chalk.cyan('   2. Visit http://localhost:5000/api/health to verify'));
    console.log(chalk.cyan('   3. Use API endpoints as documented in README.md'));
    
    if (missingOptional.includes('GOOGLE_MAPS_API_KEY')) {
      console.log(chalk.yellow('\n⚠️  Note: Google Maps API key not set. Route optimization features will be limited.'));
    }
  } else {
    console.log(chalk.red('❌ Setup incomplete. Please fix the following:'));
    missingRequired.forEach(envVar => {
      console.log(chalk.red(`   - Set ${envVar} in .env file`));
    });
    console.log(chalk.cyan('\n💡 Refer to .env.example for guidance'));
  }
}

// Handle the case where chalk might not be installed
const installChalk = () => {
  try {
    return require('chalk');
  } catch (e) {
    // Fallback to simple console methods
    return {
      blue: (text) => text,
      yellow: (text) => text,
      green: (text) => text,
      red: (text) => text,
      cyan: (text) => text
    };
  }
};

// Run the check
if (require.main === module) {
  checkSetup().catch(console.error);
}

module.exports = { checkSetup };