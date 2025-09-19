const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['pandal', 'eatery'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemModel'
  },
  itemModel: {
    type: String,
    enum: ['Pandal', 'Eatery'],
    required: true
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a review title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  review: {
    type: String,
    required: [true, 'Please add a review'],
    maxlength: [1000, 'Review cannot be more than 1000 characters']
  },
  images: [{
    url: String,
    caption: String
  }],
  aspects: {
    // For pandals
    decoration: Number,
    theme: Number,
    crowd: Number,
    accessibility: Number,
    // For eateries
    foodQuality: Number,
    service: Number,
    ambience: Number,
    valueForMoney: Number
  },
  visitDate: {
    type: Date,
    required: true
  },
  crowdLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very-high']
  },
  helpful: {
    type: Number,
    default: 0
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  reportCount: {
    type: Number,
    default: 0
  },
  isHidden: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate reviews
reviewSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

// Create index for item reviews
reviewSchema.index({ itemType: 1, itemId: 1, createdAt: -1 });

// Method to mark review as helpful
reviewSchema.methods.markHelpful = async function(userId) {
  if (!this.helpfulUsers.includes(userId)) {
    this.helpfulUsers.push(userId);
    this.helpful += 1;
    return this.save();
  }
  return this;
};

// Static method to get average rating for an item
reviewSchema.statics.getAverageRating = async function(itemType, itemId) {
  const result = await this.aggregate([
    { $match: { itemType, itemId, isHidden: false } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
};

module.exports = mongoose.model('Review', reviewSchema);