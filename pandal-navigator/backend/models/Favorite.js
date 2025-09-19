const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['pandal', 'eatery', 'route'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemModel'
  },
  itemModel: {
    type: String,
    enum: ['Pandal', 'Eatery', 'Route'],
    required: true
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  },
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  reminderDate: Date,
  isPrivate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate favorites
favoriteSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

// Create index for user favorites
favoriteSchema.index({ user: 1, createdAt: -1 });

// Static method to get user's favorites by type
favoriteSchema.statics.getUserFavoritesByType = function(userId, itemType) {
  const populateField = itemType === 'pandal' ? 'name location.area theme.title' :
                       itemType === 'eatery' ? 'name type location.area cuisine' :
                       'name description routeStats';
  
  return this.find({ user: userId, itemType })
    .populate('itemId', populateField)
    .sort({ createdAt: -1 });
};

// Method to toggle favorite status
favoriteSchema.statics.toggleFavorite = async function(userId, itemType, itemId) {
  const existing = await this.findOne({ user: userId, itemType, itemId });
  
  if (existing) {
    await this.deleteOne({ _id: existing._id });
    return { action: 'removed', favorite: null };
  } else {
    const itemModel = itemType.charAt(0).toUpperCase() + itemType.slice(1);
    const favorite = await this.create({
      user: userId,
      itemType,
      itemId,
      itemModel
    });
    return { action: 'added', favorite };
  }
};

// Method to check if item is favorited by user
favoriteSchema.statics.isFavorited = async function(userId, itemType, itemId) {
  const favorite = await this.findOne({ user: userId, itemType, itemId });
  return !!favorite;
};

module.exports = mongoose.model('Favorite', favoriteSchema);