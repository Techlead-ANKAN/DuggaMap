const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Pandal = require('../models/Pandal');
const Eatery = require('../models/Eatery');
const Review = require('../models/Review');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pandal-navigator');
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@pandalnavigator.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '9876543210',
    preferences: {
      walkingSpeed: 'normal',
      preferredTransport: ['walking', 'metro'],
      foodPreferences: ['vegetarian', 'sweets'],
      crowdTolerance: 'medium',
      budget: 'medium'
    }
  },
  {
    name: 'Raj Chatterjee',
    email: 'raj@example.com',
    password: 'User@123',
    phone: '9876543211',
    preferences: {
      walkingSpeed: 'fast',
      preferredTransport: ['metro', 'auto'],
      foodPreferences: ['non-vegetarian', 'street-food'],
      crowdTolerance: 'high',
      budget: 'high'
    }
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'User@123',
    phone: '9876543212',
    preferences: {
      walkingSpeed: 'slow',
      preferredTransport: ['walking', 'bus'],
      foodPreferences: ['vegetarian', 'sweets'],
      crowdTolerance: 'low',
      budget: 'low'
    }
  }
];

// Famous Kolkata Durga Puja Pandals
const pandals = [
  {
    name: 'Bagbazar Sarbojanin',
    location: {
      address: 'Bagbazar Street, Kolkata',
      area: 'Bagbazar',
      district: 'Kolkata',
      pincode: '700003',
      coordinates: {
        type: 'Point',
        coordinates: [88.3639, 22.5958] // [longitude, latitude]
      }
    },
    theme: {
      title: 'Traditional Bengal Culture',
      description: 'One of the oldest pandals in Kolkata, famous for its traditional approach and historical significance.',
      artist: 'Local Artists Collective',
      yearEstablished: 1927
    },
    timings: {
      openTime: '06:00',
      closeTime: '23:00',
      peakHours: [
        { startTime: '18:00', endTime: '22:00', crowdLevel: 'very-high' },
        { startTime: '10:00', endTime: '12:00', crowdLevel: 'medium' }
      ],
      bhogTimings: [
        { time: '12:30', description: 'Afternoon Bhog' },
        { time: '20:30', description: 'Evening Aarti' }
      ]
    },
    features: {
      accessibility: {
        wheelchairAccessible: true,
        elderyFriendly: true,
        parkingAvailable: false
      },
      amenities: ['restroom', 'water', 'security', 'medical'],
      specialFeatures: ['Historical significance', 'Traditional music', 'Cultural programs']
    },
    crowd: {
      averageVisitors: 50000,
      realTimeCrowdLevel: 'high'
    },
    images: [
      {
        url: '/images/bagbazar-main.jpg',
        caption: 'Main Pandal View',
        year: 2023
      }
    ],
    ratings: {
      averageRating: 4.5,
      totalReviews: 1250
    },
    transportation: {
      nearestMetro: {
        station: 'Shyama Charan Metro',
        distance: 800,
        walkingTime: 10
      },
      busStops: [
        { name: 'Bagbazar Ghat', distance: 200, routes: ['12', '30', '34'] }
      ],
      autoStand: { available: true, distance: 300 }
    },
    verified: true
  },
  {
    name: 'Mohammad Ali Park',
    location: {
      address: 'Mohammad Ali Park, Central Kolkata',
      area: 'Central Kolkata',
      district: 'Kolkata',
      pincode: '700017',
      coordinates: {
        type: 'Point',
        coordinates: [88.3476, 22.5675]
      }
    },
    theme: {
      title: 'Modern Artistic Expression',
      description: 'Known for innovative themes and modern artistic interpretations.',
      artist: 'Rintu Das',
      yearEstablished: 1969
    },
    timings: {
      openTime: '05:30',
      closeTime: '23:30',
      peakHours: [
        { startTime: '19:00', endTime: '23:00', crowdLevel: 'very-high' }
      ],
      bhogTimings: [
        { time: '13:00', description: 'Lunch Bhog' }
      ]
    },
    features: {
      accessibility: {
        wheelchairAccessible: true,
        elderyFriendly: true,
        parkingAvailable: true
      },
      amenities: ['parking', 'restroom', 'food-stall', 'water', 'security'],
      specialFeatures: ['Award-winning themes', 'Light shows', 'Interactive displays']
    },
    crowd: {
      averageVisitors: 75000,
      realTimeCrowdLevel: 'very-high'
    },
    ratings: {
      averageRating: 4.7,
      totalReviews: 2100
    },
    transportation: {
      nearestMetro: {
        station: 'Park Street Metro',
        distance: 1200,
        walkingTime: 15
      },
      busStops: [
        { name: 'Mohammad Ali Park', distance: 100, routes: ['2', '8', '29'] }
      ],
      autoStand: { available: true, distance: 150 }
    },
    verified: true
  },
  {
    name: 'Kumartuli Park',
    location: {
      address: 'Kumartuli, North Kolkata',
      area: 'Kumartuli',
      district: 'Kolkata',
      pincode: '700005',
      coordinates: {
        type: 'Point',
        coordinates: [88.3518, 22.6000]
      }
    },
    theme: {
      title: 'Artisan Heritage',
      description: 'Celebrating the traditional clay artisans of Kumartuli.',
      artist: 'Kumartuli Artisans',
      yearEstablished: 1950
    },
    timings: {
      openTime: '06:00',
      closeTime: '22:30',
      peakHours: [
        { startTime: '17:00', endTime: '21:00', crowdLevel: 'high' }
      ],
      bhogTimings: [
        { time: '12:00', description: 'Midday Bhog' },
        { time: '19:00', description: 'Evening Bhog' }
      ]
    },
    features: {
      accessibility: {
        wheelchairAccessible: false,
        elderyFriendly: true,
        parkingAvailable: false
      },
      amenities: ['restroom', 'water', 'food-stall'],
      specialFeatures: ['Artisan workshops', 'Traditional music', 'Heritage walks']
    },
    crowd: {
      averageVisitors: 35000,
      realTimeCrowdLevel: 'medium'
    },
    ratings: {
      averageRating: 4.3,
      totalReviews: 890
    },
    transportation: {
      nearestMetro: {
        station: 'Sovabazar-Sutanuti Metro',
        distance: 600,
        walkingTime: 8
      },
      autoStand: { available: true, distance: 400 }
    },
    verified: true
  },
  {
    name: 'Ballygunge Cultural Association',
    location: {
      address: 'Ballygunge Circular Road, Kolkata',
      area: 'Ballygunge',
      district: 'Kolkata',
      pincode: '700019',
      coordinates: {
        type: 'Point',
        coordinates: [88.3639, 22.5283]
      }
    },
    theme: {
      title: 'Contemporary Social Themes',
      description: 'Known for addressing contemporary social issues through art.',
      artist: 'Sabyasachi Chakraborty',
      yearEstablished: 1963
    },
    timings: {
      openTime: '06:00',
      closeTime: '23:00',
      peakHours: [
        { startTime: '18:30', endTime: '22:30', crowdLevel: 'very-high' }
      ],
      bhogTimings: [
        { time: '13:30', description: 'Afternoon Prasad' }
      ]
    },
    features: {
      accessibility: {
        wheelchairAccessible: true,
        elderyFriendly: true,
        parkingAvailable: true
      },
      amenities: ['parking', 'restroom', 'food-stall', 'water', 'security', 'medical'],
      specialFeatures: ['Social awareness programs', 'Cultural events', 'Art exhibitions']
    },
    crowd: {
      averageVisitors: 60000,
      realTimeCrowdLevel: 'high'
    },
    ratings: {
      averageRating: 4.6,
      totalReviews: 1650
    },
    transportation: {
      nearestMetro: {
        station: 'Ballygunge Metro',
        distance: 500,
        walkingTime: 6
      },
      busStops: [
        { name: 'Ballygunge Circular Road', distance: 150, routes: ['21', '25', '47'] }
      ],
      autoStand: { available: true, distance: 200 }
    },
    verified: true
  },
  {
    name: 'College Square',
    location: {
      address: 'College Street, Kolkata',
      area: 'College Street',
      district: 'Kolkata',
      pincode: '700012',
      coordinates: {
        type: 'Point',
        coordinates: [88.3732, 22.5726]
      }
    },
    theme: {
      title: 'Educational Heritage',
      description: 'Celebrating Kolkata\'s educational heritage and student community.',
      artist: 'Student Artists Collective',
      yearEstablished: 1945
    },
    timings: {
      openTime: '07:00',
      closeTime: '22:00',
      peakHours: [
        { startTime: '17:00', endTime: '20:00', crowdLevel: 'high' }
      ],
      bhogTimings: [
        { time: '12:00', description: 'Noon Bhog' }
      ]
    },
    features: {
      accessibility: {
        wheelchairAccessible: false,
        elderyFriendly: true,
        parkingAvailable: false
      },
      amenities: ['restroom', 'water', 'food-stall'],
      specialFeatures: ['Book fair nearby', 'Student cultural programs', 'Literary events']
    },
    crowd: {
      averageVisitors: 45000,
      realTimeCrowdLevel: 'medium'
    },
    ratings: {
      averageRating: 4.2,
      totalReviews: 750
    },
    transportation: {
      nearestMetro: {
        station: 'Central Metro',
        distance: 800,
        walkingTime: 10
      },
      busStops: [
        { name: 'College Street', distance: 100, routes: ['2', '3', '6'] }
      ],
      autoStand: { available: true, distance: 250 }
    },
    verified: true
  }
];

// Popular Kolkata Eateries
const eateries = [
  {
    name: 'Flurys',
    type: 'bakery',
    cuisine: ['continental', 'sweets'],
    location: {
      address: 'Park Street, Kolkata',
      area: 'Park Street',
      district: 'Kolkata',
      pincode: '700016',
      coordinates: {
        type: 'Point',
        coordinates: [88.3639, 22.5448]
      }
    },
    contact: {
      phone: '+91-33-2229-7664',
      website: 'www.flurys.in'
    },
    timings: {
      openTime: '07:30',
      closeTime: '22:00',
      peakHours: [
        { startTime: '11:00', endTime: '13:00', waitTime: 15 },
        { startTime: '19:00', endTime: '21:00', waitTime: 20 }
      ]
    },
    menu: {
      popularItems: [
        { name: 'Rum Ball', price: 80, description: 'Famous rum-soaked chocolate cake', isVegetarian: true },
        { name: 'Fish and Chips', price: 320, description: 'Classic British dish', isVegetarian: false },
        { name: 'Chicken Sandwich', price: 250, description: 'Club sandwich with chicken', isVegetarian: false }
      ],
      priceRange: 'moderate',
      specialties: ['Rum Ball', 'Continental breakfast', 'Pastries'],
      dietaryOptions: ['vegetarian']
    },
    ratings: {
      averageRating: 4.4,
      totalReviews: 2500,
      foodQuality: 4.5,
      service: 4.2,
      ambience: 4.6,
      valueForMoney: 3.8
    },
    features: {
      amenities: ['ac', 'wifi', 'card-payment', 'upi'],
      seatingCapacity: 80,
      hasDelivery: true,
      deliveryApps: ['zomato', 'swiggy']
    },
    seasonalInfo: {
      duringDurgaPuja: {
        specialMenu: ['Festive Cakes', 'Bengali Sweets'],
        extendedHours: false,
        crowdLevel: 'high'
      }
    },
    verified: true
  },
  {
    name: 'Kewpies Kitchen',
    type: 'restaurant',
    cuisine: ['bengali'],
    location: {
      address: 'Elgin Lane, Kolkata',
      area: 'Elgin',
      district: 'Kolkata',
      pincode: '700020',
      coordinates: {
        type: 'Point',
        coordinates: [88.3476, 22.5448]
      }
    },
    contact: {
      phone: '+91-33-2486-1600'
    },
    timings: {
      openTime: '12:00',
      closeTime: '15:00', // Lunch only
      peakHours: [
        { startTime: '13:00', endTime: '14:30', waitTime: 25 }
      ]
    },
    menu: {
      popularItems: [
        { name: 'Kosha Mangsho', price: 380, description: 'Slow-cooked mutton curry', isVegetarian: false },
        { name: 'Chingri Malaikari', price: 450, description: 'Prawns in coconut curry', isVegetarian: false },
        { name: 'Aloo Posto', price: 180, description: 'Potato in poppy seed paste', isVegetarian: true }
      ],
      priceRange: 'moderate',
      specialties: ['Authentic Bengali cuisine', 'Traditional recipes'],
      dietaryOptions: ['vegetarian']
    },
    ratings: {
      averageRating: 4.6,
      totalReviews: 1800,
      foodQuality: 4.8,
      service: 4.4,
      ambience: 4.2,
      valueForMoney: 4.5
    },
    features: {
      amenities: ['ac', 'card-payment', 'upi'],
      seatingCapacity: 25,
      hasDelivery: false
    },
    seasonalInfo: {
      duringDurgaPuja: {
        specialMenu: ['Festival Fish Curry', 'Special Bhog'],
        extendedHours: false,
        crowdLevel: 'very-high'
      }
    },
    verified: true
  },
  {
    name: 'Tewari Brothers',
    type: 'sweet-shop',
    cuisine: ['sweets', 'snacks'],
    location: {
      address: 'Burrabazar, Kolkata',
      area: 'Burrabazar',
      district: 'Kolkata',
      pincode: '700007',
      coordinates: {
        type: 'Point',
        coordinates: [88.3518, 22.5726]
      }
    },
    contact: {
      phone: '+91-33-2237-4845'
    },
    timings: {
      openTime: '08:00',
      closeTime: '21:00',
      peakHours: [
        { startTime: '16:00', endTime: '19:00', waitTime: 10 }
      ]
    },
    menu: {
      popularItems: [
        { name: 'Rasgulla', price: 25, description: 'Traditional Bengali sweet', isVegetarian: true },
        { name: 'Mishti Doi', price: 40, description: 'Sweet yogurt', isVegetarian: true },
        { name: 'Sandesh', price: 30, description: 'Cottage cheese sweet', isVegetarian: true }
      ],
      priceRange: 'budget',
      specialties: ['Bengali sweets', 'Fresh dairy products'],
      dietaryOptions: ['vegetarian']
    },
    ratings: {
      averageRating: 4.3,
      totalReviews: 950,
      foodQuality: 4.5,
      service: 4.0,
      ambience: 3.8,
      valueForMoney: 4.6
    },
    features: {
      amenities: ['takeaway', 'card-payment', 'upi'],
      seatingCapacity: 15,
      hasDelivery: true,
      deliveryApps: ['zomato']
    },
    seasonalInfo: {
      duringDurgaPuja: {
        specialMenu: ['Narkel Naru', 'Special Motichoor Laddu'],
        extendedHours: true,
        crowdLevel: 'very-high'
      }
    },
    verified: true
  },
  {
    name: 'Dacres Lane Fish Market Stalls',
    type: 'street-food',
    cuisine: ['bengali', 'street-food'],
    location: {
      address: 'Dacres Lane, Kolkata',
      area: 'Shyama Charan',
      district: 'Kolkata',
      pincode: '700004',
      coordinates: {
        type: 'Point',
        coordinates: [88.3639, 22.5958]
      }
    },
    timings: {
      openTime: '10:00',
      closeTime: '20:00',
      peakHours: [
        { startTime: '12:00', endTime: '14:00', waitTime: 5 },
        { startTime: '17:00', endTime: '19:00', waitTime: 8 }
      ]
    },
    menu: {
      popularItems: [
        { name: 'Fish Fry', price: 50, description: 'Crispy fried fish', isVegetarian: false },
        { name: 'Puchka', price: 25, description: 'Bengali golgappa', isVegetarian: true },
        { name: 'Jhalmuri', price: 20, description: 'Spicy puffed rice snack', isVegetarian: true }
      ],
      priceRange: 'budget',
      specialties: ['Fresh fish preparations', 'Local street snacks'],
      dietaryOptions: ['vegetarian']
    },
    ratings: {
      averageRating: 4.0,
      totalReviews: 450,
      foodQuality: 4.2,
      service: 3.8,
      ambience: 3.5,
      valueForMoney: 4.8
    },
    features: {
      amenities: ['takeaway', 'upi'],
      hasDelivery: false
    },
    seasonalInfo: {
      duringDurgaPuja: {
        specialMenu: ['Festival Fish Items', 'Special Chutneys'],
        extendedHours: true,
        crowdLevel: 'high'
      }
    },
    verified: true
  },
  {
    name: 'Bhojohori Manna',
    type: 'restaurant',
    cuisine: ['bengali'],
    location: {
      address: 'Golf Green, Kolkata',
      area: 'Golf Green',
      district: 'Kolkata',
      pincode: '700095',
      coordinates: {
        type: 'Point',
        coordinates: [88.3732, 22.5283]
      }
    },
    contact: {
      phone: '+91-33-2417-8949',
      website: 'www.bhojohorimanna.com'
    },
    timings: {
      openTime: '11:00',
      closeTime: '22:30',
      peakHours: [
        { startTime: '13:00', endTime: '15:00', waitTime: 20 },
        { startTime: '19:30', endTime: '21:30', waitTime: 25 }
      ]
    },
    menu: {
      popularItems: [
        { name: 'Hilsa Fish Curry', price: 420, description: 'Bengal\'s favorite fish curry', isVegetarian: false },
        { name: 'Mutton Biryani', price: 380, description: 'Kolkata-style biryani', isVegetarian: false },
        { name: 'Begun Bhaja', price: 120, description: 'Fried eggplant', isVegetarian: true }
      ],
      priceRange: 'moderate',
      specialties: ['Traditional Bengali thali', 'Authentic recipes'],
      dietaryOptions: ['vegetarian']
    },
    ratings: {
      averageRating: 4.5,
      totalReviews: 3200,
      foodQuality: 4.7,
      service: 4.3,
      ambience: 4.2,
      valueForMoney: 4.4
    },
    features: {
      amenities: ['ac', 'parking', 'wifi', 'card-payment', 'upi', 'home-delivery'],
      seatingCapacity: 120,
      hasDelivery: true,
      deliveryApps: ['zomato', 'swiggy', 'uber-eats']
    },
    seasonalInfo: {
      duringDurgaPuja: {
        specialMenu: ['Puja Special Thali', 'Festival Sweets'],
        extendedHours: true,
        crowdLevel: 'very-high'
      }
    },
    verified: true
  }
];

// Seed function
const seedData = async () => {
  try {
    await connectDB();

    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Pandal.deleteMany({});
    await Eatery.deleteMany({});
    await Review.deleteMany({});

    console.log('👥 Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('🏛️ Creating pandals...');
    const pandalsWithUser = pandals.map(pandal => ({
      ...pandal,
      addedBy: createdUsers[0]._id // Admin user
    }));
    const createdPandals = await Pandal.create(pandalsWithUser);
    console.log(`✅ Created ${createdPandals.length} pandals`);

    console.log('🍽️ Creating eateries...');
    const eateriesWithUser = eateries.map(eatery => ({
      ...eatery,
      addedBy: createdUsers[0]._id // Admin user
    }));
    const createdEateries = await Eatery.create(eateriesWithUser);
    console.log(`✅ Created ${createdEateries.length} eateries`);

    console.log('⭐ Creating sample reviews...');
    const sampleReviews = [];
    
    // Reviews for pandals
    for (let i = 0; i < createdPandals.length; i++) {
      sampleReviews.push({
        user: createdUsers[1]._id,
        itemType: 'pandal',
        itemId: createdPandals[i]._id,
        itemModel: 'Pandal',
        rating: 4 + Math.floor(Math.random() * 2),
        title: 'Amazing experience!',
        review: 'Beautiful decorations and great crowd management. Highly recommended!',
        visitDate: new Date('2023-10-15'),
        crowdLevel: 'medium',
        aspects: {
          decoration: 5,
          theme: 4,
          crowd: 3,
          accessibility: 4
        }
      });
    }

    // Reviews for eateries
    for (let i = 0; i < createdEateries.length; i++) {
      sampleReviews.push({
        user: createdUsers[2]._id,
        itemType: 'eatery',
        itemId: createdEateries[i]._id,
        itemModel: 'Eatery',
        rating: 4 + Math.floor(Math.random() * 2),
        title: 'Delicious food!',
        review: 'Authentic taste and good service. Will visit again!',
        visitDate: new Date('2023-10-16'),
        aspects: {
          foodQuality: 5,
          service: 4,
          ambience: 4,
          valueForMoney: 4
        }
      });
    }

    await Review.create(sampleReviews);
    console.log(`✅ Created ${sampleReviews.length} reviews`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`🏛️ Pandals: ${createdPandals.length}`);
    console.log(`🍽️ Eateries: ${createdEateries.length}`);
    console.log(`⭐ Reviews: ${sampleReviews.length}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('Admin: admin@pandalnavigator.com / Admin@123');
    console.log('User 1: raj@example.com / User@123');
    console.log('User 2: priya@example.com / User@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
if (require.main === module) {
  seedData();
}

module.exports = { seedData };