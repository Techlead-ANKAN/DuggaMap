const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Pandal = require('../models/Pandal');
const FoodPlace = require('../models/FoodPlace');
const Route = require('../models/Route');

// Sample users data
const users = [
  {
    username: 'rahul_kolkata',
    email: 'rahul@example.com',
    password: 'password123',
    fullName: 'Rahul Chatterjee',
    phone: '+91-9876543210',
    startPoint: 'Salt Lake City, Kolkata',
    endPoint: 'Esplanade, Kolkata',
    preferences: {
      transportMode: 'public-transport',
      maxWalkingDistance: 2,
      includeFood: true,
      accessibility: false
    },
    favorites: {
      pandals: [],
      foodPlaces: []
    }
  },
  {
    username: 'priya_durga',
    email: 'priya@example.com',
    password: 'password123',
    fullName: 'Priya Das',
    phone: '+91-9876543211',
    startPoint: 'Park Street, Kolkata',
    endPoint: 'Kalighat, Kolkata',
    preferences: {
      transportMode: 'walking',
      maxWalkingDistance: 3,
      includeFood: true,
      accessibility: true
    },
    favorites: {
      pandals: [],
      foodPlaces: []
    }
  }
];

// Real Kolkata pandals with accurate locations
const pandals = [
  {
    name: 'Kumartuli Park Durga Puja',
    description: 'One of the most famous pandals in North Kolkata, known for its traditional artistry and cultural performances.',
    theme: 'Traditional Bengali Heritage',
    location: {
      address: 'Kumartuli Park, Shyama Charan Dey Street, Kumartuli, Kolkata',
      latitude: 22.5958,
      longitude: 88.3639
    },
    areaCategory: 'North Kolkata',
    specialFeatures: ['Live Cultural Programs', 'Traditional Dhak', 'Heritage Architecture', 'Food Stalls'],
    crowdLevel: 'high',
    rating: 4.5,
    reviews: 1200,
    openingTime: '06:00',
    closingTime: '23:00',
    contact: {
      phone: '+91-33-2555-0123',
      email: 'kumartuli.durga@gmail.com'
    },
    amenities: ['Parking Available', 'Wheelchair Accessible', 'Food Court', 'ATM Nearby'],
    estimatedVisitTime: 90,
    safetyMeasures: ['CCTV Surveillance', 'Security Guards', 'Emergency Medical Team']
  },
  {
    name: 'Bagbazar Sarbojanin Durga Puja',
    description: 'Historic pandal established in 1948, famous for its eco-friendly celebrations and social awareness themes.',
    theme: 'Environmental Conservation',
    location: {
      address: 'Bagbazar Street, Near Girish Park, Kolkata',
      latitude: 22.5851,
      longitude: 88.3654
    },
    areaCategory: 'North Kolkata',
    specialFeatures: ['Eco-friendly Materials', 'Social Awareness', 'Cultural Heritage', 'Community Kitchen'],
    crowdLevel: 'medium',
    rating: 4.3,
    reviews: 890,
    openingTime: '05:30',
    closingTime: '22:30',
    contact: {
      phone: '+91-33-2555-0124',
      email: 'bagbazar.sarbojanin@gmail.com'
    },
    amenities: ['Free Drinking Water', 'Lost & Found', 'First Aid', 'Public Toilets'],
    estimatedVisitTime: 75,
    safetyMeasures: ['Crowd Control', 'Fire Safety', 'Medical Support']
  },
  {
    name: 'Deshapriya Park Durga Puja',
    description: 'Award-winning pandal known for innovative themes and artistic excellence, attracting visitors from across the globe.',
    theme: 'Modern Art Fusion',
    location: {
      address: 'Deshapriya Park, Rashbehari Avenue, Kolkata',
      latitude: 22.5167,
      longitude: 88.3515
    },
    areaCategory: 'South Kolkata',
    specialFeatures: ['Award-winning Design', 'International Recognition', 'Art Exhibitions', 'Food Festival'],
    crowdLevel: 'very-high',
    rating: 4.8,
    reviews: 2500,
    openingTime: '06:00',
    closingTime: '24:00',
    contact: {
      phone: '+91-33-2466-0125',
      email: 'deshapriya.durga@gmail.com'
    },
    amenities: ['VIP Lounge', 'Photography Zone', 'Souvenir Shop', 'Multi-cuisine Food Court'],
    estimatedVisitTime: 120,
    safetyMeasures: ['24x7 Security', 'CCTV Monitoring', 'Emergency Response Team']
  },
  {
    name: 'Mohammad Ali Park Durga Puja',
    description: 'One of the oldest and most prestigious pandals in Central Kolkata, known for its grandeur and traditional celebrations.',
    theme: 'Royal Heritage of Bengal',
    location: {
      address: 'Mohammad Ali Park, Central Avenue, Kolkata',
      latitude: 22.5744,
      longitude: 88.3685
    },
    areaCategory: 'Central Kolkata',
    specialFeatures: ['Historic Significance', 'Grand Architecture', 'Royal Theme', 'Celebrity Visits'],
    crowdLevel: 'high',
    rating: 4.6,
    reviews: 1800,
    openingTime: '05:00',
    closingTime: '23:30',
    contact: {
      phone: '+91-33-2350-0126',
      email: 'mohammadalipark.durga@gmail.com'
    },
    amenities: ['Premium Parking', 'VIP Viewing Area', 'Heritage Walk', 'Cultural Programs'],
    estimatedVisitTime: 100,
    safetyMeasures: ['Police Patrol', 'Medical Camp', 'Fire Brigade Station']
  },
  {
    name: 'Ballygunge Cultural Association',
    description: 'Modern pandal known for contemporary themes and innovative use of technology in decorations.',
    theme: 'Technology Meets Tradition',
    location: {
      address: 'Ballygunge Circular Road, Near Gariahat, Kolkata',
      latitude: 22.5123,
      longitude: 88.3601
    },
    areaCategory: 'South Kolkata',
    specialFeatures: ['LED Installations', 'Interactive Displays', 'Tech Integration', 'Youth Programs'],
    crowdLevel: 'medium',
    rating: 4.4,
    reviews: 950,
    openingTime: '06:30',
    closingTime: '22:00',
    contact: {
      phone: '+91-33-2463-0127',
      email: 'ballygunge.cultural@gmail.com'
    },
    amenities: ['Digital Payment', 'Mobile Charging', 'WiFi Zone', 'Kids Play Area'],
    estimatedVisitTime: 85,
    safetyMeasures: ['Smart Surveillance', 'Digital Crowd Management', 'Quick Response Team']
  },
  {
    name: 'Salt Lake FD Block Durga Puja',
    description: 'Popular pandal in New Town area, known for family-friendly environment and modern amenities.',
    theme: 'Family Unity and Prosperity',
    location: {
      address: 'FD Block, Salt Lake City, Sector V, Kolkata',
      latitude: 22.5726,
      longitude: 88.4324
    },
    areaCategory: 'East Kolkata',
    specialFeatures: ['Family Events', 'Kids Activities', 'Senior Citizen Care', 'Modern Facilities'],
    crowdLevel: 'medium',
    rating: 4.2,
    reviews: 720,
    openingTime: '07:00',
    closingTime: '22:00',
    contact: {
      phone: '+91-33-2321-0128',
      email: 'saltlake.fdblock@gmail.com'
    },
    amenities: ['Ample Parking', 'Baby Care Room', 'Senior Citizen Seating', 'Clean Washrooms'],
    estimatedVisitTime: 70,
    safetyMeasures: ['Family Security', 'Child Safety Measures', 'Medical Assistance']
  }
];

// Real Kolkata food places near pandals
const foodPlaces = [
  {
    name: 'Bhojohori Manna',
    description: 'Authentic Bengali cuisine restaurant chain famous for traditional fish curry and rice.',
    cuisine: ['Bengali', 'Traditional', 'Fish', 'Vegetarian'],
    location: {
      address: 'Esplanade, Near Chandni Chowk, Kolkata',
      latitude: 22.5726,
      longitude: 88.3639
    },
    avgCost: 400,
    rating: 4.3,
    reviews: 2100,
    openingTime: '11:00',
    closingTime: '22:30',
    contact: {
      phone: '+91-33-2213-5555',
      email: 'contact@bhojohori.com'
    },
    features: {
      delivery: true,
      takeaway: true,
      dineIn: true,
      parking: true,
      ac: true,
      cardPayment: true,
      onlinePayment: true
    },
    specialItems: ['Kosha Mangsho', 'Chingri Malai Curry', 'Bhapa Ilish', 'Mishti Doi'],
    nearbyPandals: []
  },
  {
    name: 'Arsalan',
    description: 'Famous for authentic Kolkata biryani and Mughlai cuisine since 1974.',
    cuisine: ['Mughlai', 'Biryani', 'Kebabs', 'Non-Vegetarian'],
    location: {
      address: 'Park Circus, Near Circus Avenue, Kolkata',
      latitude: 22.5456,
      longitude: 88.3731
    },
    avgCost: 350,
    rating: 4.5,
    reviews: 3200,
    openingTime: '12:00',
    closingTime: '23:00',
    contact: {
      phone: '+91-33-2454-7710',
      email: 'info@arsalanrestaurant.com'
    },
    features: {
      delivery: true,
      takeaway: true,
      dineIn: true,
      parking: false,
      ac: true,
      cardPayment: true,
      onlinePayment: true
    },
    specialItems: ['Mutton Biryani', 'Chicken Rezala', 'Seekh Kebab', 'Firni'],
    nearbyPandals: []
  },
  {
    name: 'Flurys',
    description: 'Iconic tea room and confectionery on Park Street, serving European delicacies since 1927.',
    cuisine: ['Continental', 'Bakery', 'Tea', 'Desserts'],
    location: {
      address: 'Park Street, Near Park Hotel, Kolkata',
      latitude: 22.5448,
      longitude: 88.3426
    },
    avgCost: 600,
    rating: 4.4,
    reviews: 1850,
    openingTime: '07:30',
    closingTime: '20:00',
    contact: {
      phone: '+91-33-2229-7664',
      email: 'info@flurys.in'
    },
    features: {
      delivery: false,
      takeaway: true,
      dineIn: true,
      parking: false,
      ac: true,
      cardPayment: true,
      onlinePayment: false
    },
    specialItems: ['Rum Ball', 'Black Forest Cake', 'English Breakfast', 'Chicken Patty'],
    nearbyPandals: []
  },
  {
    name: 'Kewpies Kitchen',
    description: 'Home-style Bengali cooking in a cozy setting, known for authentic Bengali thalis.',
    cuisine: ['Bengali', 'Home-style', 'Traditional', 'Vegetarian'],
    location: {
      address: 'Elgin Lane, Near Elgin Road, Kolkata',
      latitude: 22.5333,
      longitude: 88.3515
    },
    avgCost: 300,
    rating: 4.2,
    reviews: 950,
    openingTime: '12:00',
    closingTime: '21:00',
    contact: {
      phone: '+91-33-2285-5036',
      email: 'kewpies@bengali.com'
    },
    features: {
      delivery: false,
      takeaway: false,
      dineIn: true,
      parking: false,
      ac: false,
      cardPayment: true,
      onlinePayment: false
    },
    specialItems: ['Bengali Thali', 'Dhokar Dalna', 'Cholar Dal', 'Payesh'],
    nearbyPandals: []
  },
  {
    name: 'Peter Cat',
    description: 'Famous continental restaurant known for Chelo Kebab and old Kolkata charm.',
    cuisine: ['Continental', 'Indian', 'Chinese', 'Multi-cuisine'],
    location: {
      address: 'Park Street, Near Metro Station, Kolkata',
      latitude: 22.5447,
      longitude: 88.3434
    },
    avgCost: 500,
    rating: 4.3,
    reviews: 2200,
    openingTime: '11:00',
    closingTime: '23:30',
    contact: {
      phone: '+91-33-2229-8841',
      email: 'contact@petercat.co.in'
    },
    features: {
      delivery: true,
      takeaway: true,
      dineIn: true,
      parking: false,
      ac: true,
      cardPayment: true,
      onlinePayment: true
    },
    specialItems: ['Chelo Kebab', 'Prawn Cocktail', 'Chicken Stroganoff', 'Caramel Custard'],
    nearbyPandals: []
  },
  {
    name: 'Oh! Calcutta',
    description: 'Fine dining Bengali restaurant offering modern presentation of traditional dishes.',
    cuisine: ['Bengali', 'Fine Dining', 'Traditional', 'Seafood'],
    location: {
      address: 'Forum Mall, Elgin Road, Kolkata',
      latitude: 22.5394,
      longitude: 88.3512
    },
    avgCost: 800,
    rating: 4.4,
    reviews: 1650,
    openingTime: '12:00',
    closingTime: '22:30',
    contact: {
      phone: '+91-33-2283-7161',
      email: 'info@ohcalcutta.in'
    },
    features: {
      delivery: true,
      takeaway: true,
      dineIn: true,
      parking: true,
      ac: true,
      cardPayment: true,
      onlinePayment: true
    },
    specialItems: ['Prawn Malai Curry', 'Mutton Kosha', 'Bhetki Paturi', 'Sandesh Cheesecake'],
    nearbyPandals: []
  }
];

// Sample routes
const routes = [
  {
    routeName: 'North Kolkata Heritage Trail',
    areaCategory: 'North Kolkata',
    transportMode: 'walking',
    startPoint: {
      address: 'Sovabazar Metro Station',
      coordinates: { latitude: 22.5851, longitude: 88.3697 }
    },
    endPoint: {
      address: 'Shyambazar Metro Station',
      coordinates: { latitude: 22.6049, longitude: 88.3731 }
    },
    pandalsCovered: [],
    foodStops: [],
    roadmap: [
      {
        instruction: 'Start from Sovabazar Metro Station',
        distance: '0 km',
        time: '0 min',
        location: { latitude: 22.5851, longitude: 88.3697 }
      },
      {
        instruction: 'Walk towards Kumartuli Park (5 min walk)',
        distance: '400 m',
        time: '5 min',
        location: { latitude: 22.5958, longitude: 88.3639 }
      },
      {
        instruction: 'Visit Kumartuli Park Durga Puja',
        distance: '0 km',
        time: '90 min',
        location: { latitude: 22.5958, longitude: 88.3639 }
      },
      {
        instruction: 'Walk to Bagbazar Sarbojanin (8 min walk)',
        distance: '650 m',
        time: '8 min',
        location: { latitude: 22.5851, longitude: 88.3654 }
      },
      {
        instruction: 'Visit Bagbazar Sarbojanin Durga Puja',
        distance: '0 km',
        time: '75 min',
        location: { latitude: 22.5851, longitude: 88.3654 }
      },
      {
        instruction: 'Walk to Shyambazar Metro Station',
        distance: '1.2 km',
        time: '15 min',
        location: { latitude: 22.6049, longitude: 88.3731 }
      }
    ],
    estimatedTime: { total: '193 min', walking: '28 min', visiting: '165 min' },
    estimatedCost: { transport: 0, food: 500, misc: 100, total: 600 },
    difficulty: 'easy',
    isPublic: true,
    sharedCount: 25,
    alternateRoutes: []
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pandal-navigator');
    console.log('📝 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Pandal.deleteMany({});
    await FoodPlace.deleteMany({});
    await Route.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Hash passwords for users
    for (let user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create pandals
    const createdPandals = await Pandal.insertMany(pandals);
    console.log(`🏛️ Created ${createdPandals.length} pandals`);

    // Update food places with nearby pandals
    const updatedFoodPlaces = foodPlaces.map(food => {
      // Find nearby pandals within 2km radius
      const nearby = createdPandals.filter(pandal => {
        const distance = calculateDistance(
          food.location.latitude, food.location.longitude,
          pandal.location.latitude, pandal.location.longitude
        );
        return distance <= 2; // 2km radius
      });
      
      food.nearbyPandals = nearby.slice(0, 3).map(p => p._id); // Max 3 nearby pandals
      return food;
    });

    // Create food places
    const createdFoodPlaces = await FoodPlace.insertMany(updatedFoodPlaces);
    console.log(`🍽️ Created ${createdFoodPlaces.length} food places`);

    // Update routes with actual IDs
    const updatedRoutes = routes.map(route => {
      route.userId = createdUsers[0]._id;
      route.pandalsCovered = createdPandals.slice(0, 2).map(p => p._id);
      route.foodStops = createdFoodPlaces.slice(0, 2).map(f => f._id);
      return route;
    });

    // Create routes
    const createdRoutes = await Route.insertMany(updatedRoutes);
    console.log(`🗺️ Created ${createdRoutes.length} routes`);

    // Update user favorites
    await User.findByIdAndUpdate(createdUsers[0]._id, {
      'favorites.pandals': createdPandals.slice(0, 3).map(p => p._id),
      'favorites.foodPlaces': createdFoodPlaces.slice(0, 2).map(f => f._id)
    });

    await User.findByIdAndUpdate(createdUsers[1]._id, {
      'favorites.pandals': createdPandals.slice(2, 4).map(p => p._id),
      'favorites.foodPlaces': createdFoodPlaces.slice(2, 4).map(f => f._id)
    });

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Pandals: ${createdPandals.length}`);
    console.log(`   Food Places: ${createdFoodPlaces.length}`);
    console.log(`   Routes: ${createdRoutes.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}

// Run the seeding function
seedDatabase();