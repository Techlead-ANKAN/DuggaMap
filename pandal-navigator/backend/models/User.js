const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  startPoint: {
    type: String,
    default: '',
    trim: true
  },
  endPoint: {
    type: String,
    default: '',
    trim: true
  },
  favorites: {
    pandals: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Pandal'
    }],
    foodPlaces: [{
      type: mongoose.Schema.ObjectId,
      ref: 'FoodPlace'
    }]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  phone: {
    type: String,
    match: [/^[6-9]\d{9}$/, 'Please add a valid Indian phone number']
  },
  preferences: {
    walkingSpeed: {
      type: String,
      enum: ['slow', 'normal', 'fast'],
      default: 'normal'
    },
    preferredTransport: [{
      type: String,
      enum: ['walking', 'car', 'public-transport']
    }],
    foodPreferences: [{
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'sweets', 'street-food']
    }],
    crowdTolerance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    budget: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  stats: {
    totalRoutesPlanned: {
      type: Number,
      default: 0
    },
    totalPandalsVisited: {
      type: Number,
      default: 0
    },
    totalDistanceCovered: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);