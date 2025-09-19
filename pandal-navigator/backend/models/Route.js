const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Route must belong to a user']
  },
  areaCategory: {
    type: String,
    required: [true, 'Please specify area category'],
    enum: ['North Kolkata', 'South Kolkata', 'Central Kolkata', 'East Kolkata', 'West Kolkata', 'Mixed'],
    default: 'Central Kolkata'
  },
  startPoint: {
    address: {
      type: String,
      required: [true, 'Please add start address']
    },
    latitude: {
      type: Number,
      required: [true, 'Please add start latitude'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Please add start longitude'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  endPoint: {
    address: {
      type: String,
      required: [true, 'Please add end address']
    },
    latitude: {
      type: Number,
      required: [true, 'Please add end latitude'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Please add end longitude'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  transportMode: {
    type: String,
    required: [true, 'Please specify transport mode'],
    enum: ['walking', 'car', 'public-transport'],
    default: 'walking'
  },
  estimatedTime: {
    type: Number, // total in minutes
    required: [true, 'Please add estimated time']
  },
  totalDistance: {
    type: Number, // in km
    required: [true, 'Please add total distance']
  },
  pandalsCovered: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Pandal'
  }],
  foodStops: [{
    type: mongoose.Schema.ObjectId,
    ref: 'FoodPlace'
  }],
  roadmap: [{
    instruction: {
      type: String,
      required: [true, 'Please add instruction']
    },
    distance: {
      type: Number, // in meters
      required: [true, 'Please add distance for this step']
    },
    time: {
      type: Number, // in minutes
      required: [true, 'Please add time for this step']
    },
    location: {
      latitude: Number,
      longitude: Number
    }
  }],
  alternateRoutes: [{
    pandalsCovered: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Pandal'
    }],
    estimatedTime: {
      type: Number // in minutes
    },
    totalDistance: {
      type: Number // in km
    },
    roadmap: [{
      instruction: String,
      distance: Number,
      time: Number
    }],
    reason: {
      type: String, // why this is an alternate route
      default: 'Alternative option'
    }
  }],
  // Additional useful fields
  name: {
    type: String,
    required: [true, 'Please add a route name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  routeType: {
    type: String,
    enum: ['quick-visit', 'detailed-tour', 'food-focused', 'photography', 'family-friendly'],
    default: 'detailed-tour'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'easy'
  },
  preferences: {
    crowdTolerance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    budget: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    includeFoodStops: {
      type: Boolean,
      default: true
    },
    startTime: String,
    maxWalkingDistance: {
      type: Number,
      default: 2000 // in meters
    }
  },
  optimization: {
    optimizedBy: {
      type: String,
      enum: ['distance', 'time', 'cost', 'crowd'],
      default: 'time'
    },
    optimizationScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 75
    }
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  sharing: {
    isPublic: {
      type: Boolean,
      default: false
    },
    shareCode: {
      type: String,
      unique: true,
      sparse: true
    },
    likes: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    }
  },
  estimatedCost: {
    transport: {
      type: Number,
      default: 0
    },
    food: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  weather: {
    forecast: String,
    temperature: Number,
    rainProbability: Number,
    recommendation: String
  },
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create compound index for user routes
routeSchema.index({ userId: 1, createdAt: -1 });

// Create index for public routes
routeSchema.index({ 'sharing.isPublic': 1, 'sharing.likes': -1 });

// Create index for area category
routeSchema.index({ areaCategory: 1 });

// Method to generate share code
routeSchema.methods.generateShareCode = function() {
  const code = Math.random().toString(36).substr(2, 9);
  this.sharing.shareCode = code;
  return this.save();
};

// Method to calculate total estimated cost
routeSchema.methods.calculateTotalCost = function() {
  this.estimatedCost.total = this.estimatedCost.transport + this.estimatedCost.food;
  return this.estimatedCost.total;
};

// Static method to get popular routes
routeSchema.statics.getPopularRoutes = function(limit = 10) {
  return this.find({ 
    'sharing.isPublic': true,
    isActive: true 
  })
    .sort({ 'sharing.likes': -1, 'sharing.views': -1 })
    .limit(limit)
    .populate('pandalsCovered', 'name location.address areaCategory')
    .populate('foodStops', 'name location.address cuisine');
};

// Static method to get routes by area category
routeSchema.statics.getRoutesByArea = function(areaCategory) {
  return this.find({
    areaCategory: areaCategory,
    'sharing.isPublic': true,
    isActive: true
  }).populate('pandalsCovered', 'name location.address theme.title');
};

// Static method to get user routes
routeSchema.statics.getUserRoutes = function(userId) {
  return this.find({
    userId: userId,
    isActive: true
  })
    .sort({ createdAt: -1 })
    .populate('pandalsCovered', 'name location.address areaCategory')
    .populate('foodStops', 'name location.address cuisine');
};

// Method to add pandal to route
routeSchema.methods.addPandal = function(pandalId) {
  if (!this.pandalsCovered.includes(pandalId)) {
    this.pandalsCovered.push(pandalId);
  }
  return this.save();
};

// Method to remove pandal from route
routeSchema.methods.removePandal = function(pandalId) {
  this.pandalsCovered = this.pandalsCovered.filter(
    id => id.toString() !== pandalId.toString()
  );
  return this.save();
};

module.exports = mongoose.model('Route', routeSchema);