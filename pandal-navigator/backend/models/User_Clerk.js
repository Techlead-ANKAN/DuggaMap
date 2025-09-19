const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Clerk user ID (primary identifier)
  clerkId: {
    type: String,
    required: [true, 'Clerk ID is required'],
    unique: true,
    index: true
  },
  // User profile information (synced from Clerk)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  fullName: {
    type: String,
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  // Application-specific data
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide valid phone number']
  },
  startPoint: {
    type: String,
    trim: true,
    default: 'Esplanade, Kolkata',
    maxlength: [200, 'Start point cannot exceed 200 characters']
  },
  endPoint: {
    type: String,
    trim: true,
    default: 'Park Street, Kolkata',
    maxlength: [200, 'End point cannot exceed 200 characters']
  },
  preferences: {
    transportMode: {
      type: String,
      enum: ['walking', 'car', 'public-transport'],
      default: 'walking'
    },
    maxWalkingDistance: {
      type: Number,
      min: [0.5, 'Minimum walking distance is 0.5 km'],
      max: [20, 'Maximum walking distance is 20 km'],
      default: 5
    },
    includeFood: {
      type: Boolean,
      default: true
    },
    accessibility: {
      type: Boolean,
      default: false
    },
    preferredLanguage: {
      type: String,
      enum: ['english', 'bengali', 'hindi'],
      default: 'english'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  favorites: {
    pandals: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pandal'
    }],
    foodPlaces: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodPlace'
    }]
  },
  // User activity tracking
  lastActive: {
    type: Date,
    default: Date.now
  },
  totalRoutes: {
    type: Number,
    default: 0
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ clerkId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ lastActive: -1 });
userSchema.index({ 'favorites.pandals': 1 });
userSchema.index({ 'favorites.foodPlaces': 1 });

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  return this.fullName || `${this.firstName || ''} ${this.lastName || ''}`.trim() || this.email;
});

// Static method to find or create user from Clerk data
userSchema.statics.findOrCreateFromClerk = async function(clerkUser) {
  try {
    // Try to find existing user
    let user = await this.findOne({ clerkId: clerkUser.id });
    
    if (user) {
      // Update existing user with latest Clerk data
      user.email = clerkUser.emailAddresses?.[0]?.emailAddress || user.email;
      user.firstName = clerkUser.firstName || user.firstName;
      user.lastName = clerkUser.lastName || user.lastName;
      user.fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || user.fullName;
      user.imageUrl = clerkUser.imageUrl || user.imageUrl;
      user.lastActive = new Date();
      
      await user.save();
      return user;
    } else {
      // Create new user
      user = new this({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        imageUrl: clerkUser.imageUrl,
        lastActive: new Date()
      });
      
      await user.save();
      return user;
    }
  } catch (error) {
    console.error('Error in findOrCreateFromClerk:', error);
    throw error;
  }
};

// Instance method to add pandal to favorites
userSchema.methods.addPandalToFavorites = function(pandalId) {
  if (!this.favorites.pandals.includes(pandalId)) {
    this.favorites.pandals.push(pandalId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove pandal from favorites
userSchema.methods.removePandalFromFavorites = function(pandalId) {
  this.favorites.pandals = this.favorites.pandals.filter(
    id => id.toString() !== pandalId.toString()
  );
  return this.save();
};

// Instance method to add food place to favorites
userSchema.methods.addFoodPlaceToFavorites = function(foodPlaceId) {
  if (!this.favorites.foodPlaces.includes(foodPlaceId)) {
    this.favorites.foodPlaces.push(foodPlaceId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove food place from favorites
userSchema.methods.removeFoodPlaceFromFavorites = function(foodPlaceId) {
  this.favorites.foodPlaces = this.favorites.foodPlaces.filter(
    id => id.toString() !== foodPlaceId.toString()
  );
  return this.save();
};

// Instance method to update last active timestamp
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

// Pre-save middleware to update fullName if not provided
userSchema.pre('save', function(next) {
  if (!this.fullName && (this.firstName || this.lastName)) {
    this.fullName = `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);