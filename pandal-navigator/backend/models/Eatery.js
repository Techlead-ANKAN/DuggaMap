const mongoose = require('mongoose');

const eaterySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an eatery name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify eatery type'],
    enum: ['restaurant', 'street-food', 'sweet-shop', 'cafe', 'fast-food', 'dhaba', 'bakery']
  },
  cuisine: [{
    type: String,
    enum: ['bengali', 'north-indian', 'south-indian', 'chinese', 'continental', 'fast-food', 'sweets', 'snacks']
  }],
  location: {
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    area: {
      type: String,
      required: [true, 'Please add an area']
    },
    district: {
      type: String,
      default: 'Kolkata'
    },
    pincode: {
      type: String,
      match: [/^\d{6}$/, 'Please add a valid pincode']
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere'
      }
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  timings: {
    openTime: {
      type: String,
      required: [true, 'Please add opening time'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
    },
    closeTime: {
      type: String,
      required: [true, 'Please add closing time'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
    },
    peakHours: [{
      startTime: String,
      endTime: String,
      waitTime: Number // in minutes
    }],
    isOpen24Hours: {
      type: Boolean,
      default: false
    }
  },
  menu: {
    popularItems: [{
      name: String,
      price: Number,
      description: String,
      isVegetarian: Boolean,
      spiceLevel: {
        type: String,
        enum: ['mild', 'medium', 'spicy', 'very-spicy']
      }
    }],
    priceRange: {
      type: String,
      enum: ['budget', 'moderate', 'expensive'],
      required: true
    },
    specialties: [String],
    dietaryOptions: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'jain', 'gluten-free', 'sugar-free']
    }]
  },
  ratings: {
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 3.5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    foodQuality: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 3.5
    },
    service: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 3.5
    },
    ambience: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 3.5
    },
    valueForMoney: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 3.5
    }
  },
  features: {
    amenities: [{
      type: String,
      enum: ['ac', 'parking', 'wifi', 'outdoor-seating', 'home-delivery', 'takeaway', 'card-payment', 'upi']
    }],
    seatingCapacity: Number,
    hasDelivery: {
      type: Boolean,
      default: false
    },
    deliveryApps: [{
      type: String,
      enum: ['zomato', 'swiggy', 'uber-eats', 'food-panda']
    }]
  },
  images: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['exterior', 'interior', 'food', 'menu']
    }
  }],
  crowdInfo: {
    currentWaitTime: {
      type: Number,
      default: 0
    },
    averageWaitTime: {
      type: Number,
      default: 5
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  nearbyPandals: [{
    pandalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pandal'
    },
    distance: Number, // in meters
    walkingTime: Number // in minutes
  }],
  seasonalInfo: {
    duringDurgaPuja: {
      specialMenu: [String],
      extendedHours: Boolean,
      crowdLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'very-high'],
        default: 'high'
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
eaterySchema.index({ 'location.coordinates': '2dsphere' });

// Method to get eateries within radius
eaterySchema.statics.getEateriesInRadius = async function(lat, lng, radius) {
  const radiusInRadians = radius / 6371; // Earth's radius in km
  
  return this.find({
    'location.coordinates': {
      $geoWithin: {
        $centerSphere: [[lng, lat], radiusInRadians]
      }
    },
    isActive: true
  });
};

// Method to get eateries near pandals
eaterySchema.statics.getEateriesNearPandals = async function(pandalCoordinates, maxDistance = 1000) {
  return this.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: pandalCoordinates
        },
        $maxDistance: maxDistance
      }
    },
    isActive: true
  });
};

// Method to update wait time
eaterySchema.methods.updateWaitTime = function(waitTime) {
  this.crowdInfo.currentWaitTime = waitTime;
  this.crowdInfo.lastUpdated = new Date();
  return this.save();
};

module.exports = mongoose.model('Eatery', eaterySchema);