const mongoose = require('mongoose');

const pandalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pandal name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  location: {
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  areaCategory: {
    type: String,
    required: [true, 'Area category is required'],
    enum: ['North Kolkata', 'South Kolkata', 'Central Kolkata', 'East Kolkata', 'West Kolkata']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for geospatial queries and performance
pandalSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
pandalSchema.index({ areaCategory: 1 });
pandalSchema.index({ name: 'text' });

// Instance method to calculate distance from a point
pandalSchema.methods.distanceFrom = function(lat, lng) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat - this.location.latitude) * Math.PI / 180;
  const dLng = (lng - this.location.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.location.latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Static method to find nearby pandals
pandalSchema.statics.findNearby = function(lat, lng, maxDistance = 5) {
  return this.find().then(pandals => {
    return pandals.filter(pandal => {
      const distance = pandal.distanceFrom(lat, lng);
      return distance <= maxDistance;
    }).sort((a, b) => a.distanceFrom(lat, lng) - b.distanceFrom(lat, lng));
  });
};

module.exports = mongoose.model('Pandal', pandalSchema);