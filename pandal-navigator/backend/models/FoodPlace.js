const mongoose = require('mongoose');

const foodPlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a food place name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    latitude: {
      type: Number,
      required: [true, 'Please add latitude'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Please add longitude'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  cuisine: [{
    type: String,
    required: [true, 'Please specify at least one cuisine type'],
    enum: [
      'Bengali', 'North Indian', 'South Indian', 'Chinese', 'Continental',
      'Street Food', 'Sweets', 'Fast Food', 'Bakery', 'Beverages',
      'Punjabi', 'Gujarati', 'Rajasthani', 'Mughlai', 'Biryani',
      'Chaat', 'Ice Cream', 'Juice', 'Tea/Coffee', 'Snacks'
    ]
  }],
  avgCost: {
    type: Number,
    required: [true, 'Please add average cost'],
    min: [0, 'Cost cannot be negative']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 3.5
  },
  images: [{
    type: String
  }],
  openingTime: {
    type: String,
    required: [true, 'Please add opening time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
  },
  closingTime: {
    type: String,
    required: [true, 'Please add closing time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
  },
  nearbyPandals: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Pandal'
  }],
  // Additional useful fields
  description: {
    type: String,
    maxlength: [300, 'Description cannot be more than 300 characters']
  },
  specialties: [{
    type: String,
    maxlength: [50, 'Specialty name cannot be more than 50 characters']
  }],
  priceRange: {
    type: String,
    enum: ['Budget', 'Mid-range', 'Expensive'],
    default: 'Budget'
  },
  features: {
    delivery: {
      type: Boolean,
      default: false
    },
    takeaway: {
      type: Boolean,
      default: true
    },
    dineIn: {
      type: Boolean,
      default: true
    },
    outdoorSeating: {
      type: Boolean,
      default: false
    },
    acAvailable: {
      type: Boolean,
      default: false
    },
    parkingAvailable: {
      type: Boolean,
      default: false
    },
    familyFriendly: {
      type: Boolean,
      default: true
    }
  },
  contact: {
    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please add a valid Indian phone number']
    },
    email: String,
    website: String
  },
  timings: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
  },
  paymentMethods: [{
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Paytm', 'Google Pay', 'PhonePe', 'Net Banking']
  }],
  totalReviews: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create index for geospatial queries
foodPlaceSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

// Create index for cuisine search
foodPlaceSchema.index({ cuisine: 1 });

// Create index for price range
foodPlaceSchema.index({ avgCost: 1 });

// Method to get food places within radius
foodPlaceSchema.statics.getFoodPlacesInRadius = async function(lat, lng, radius) {
  // Using simple distance calculation
  return this.find({
    isActive: true,
    'location.latitude': {
      $gte: lat - (radius / 111), // Approximate: 1 degree = 111 km
      $lte: lat + (radius / 111)
    },
    'location.longitude': {
      $gte: lng - (radius / (111 * Math.cos(lat * Math.PI / 180))),
      $lte: lng + (radius / (111 * Math.cos(lat * Math.PI / 180)))
    }
  });
};

// Method to get food places by cuisine
foodPlaceSchema.statics.getFoodPlacesByCuisine = async function(cuisineType) {
  return this.find({
    cuisine: { $in: [cuisineType] },
    isActive: true
  });
};

// Method to get food places by price range
foodPlaceSchema.statics.getFoodPlacesByPriceRange = async function(minCost, maxCost) {
  return this.find({
    avgCost: { $gte: minCost, $lte: maxCost },
    isActive: true
  });
};

// Method to find nearby pandals and update the nearbyPandals field
foodPlaceSchema.methods.findNearbyPandals = async function(radius = 2) { // 2km radius
  const Pandal = mongoose.model('Pandal');
  const nearbyPandals = await Pandal.find({
    isActive: true,
    'location.latitude': {
      $gte: this.location.latitude - (radius / 111),
      $lte: this.location.latitude + (radius / 111)
    },
    'location.longitude': {
      $gte: this.location.longitude - (radius / (111 * Math.cos(this.location.latitude * Math.PI / 180))),
      $lte: this.location.longitude + (radius / (111 * Math.cos(this.location.latitude * Math.PI / 180)))
    }
  }).select('_id');

  this.nearbyPandals = nearbyPandals.map(pandal => pandal._id);
  return this.save();
};

module.exports = mongoose.model('FoodPlace', foodPlaceSchema);