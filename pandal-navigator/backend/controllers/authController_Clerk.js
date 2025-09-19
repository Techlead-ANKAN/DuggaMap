const { getAuth } = require('@clerk/express');
const { clerkClient } = require('@clerk/backend');
const { validationResult } = require('express-validator');
const User = require('../models/User_Clerk');
const { getUserId, getUserInfo } = require('../config/clerk');

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Get user from our database
    let user = await User.findOne({ clerkId: userId })
      .populate('favorites.pandals', 'name location areaCategory')
      .populate('favorites.foodPlaces', 'name cuisine location');

    // If user doesn't exist in our DB, create from Clerk data
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);
      user = await User.findOrCreateFromClerk(clerkUser);
      
      // Populate the created user
      user = await User.findOne({ clerkId: userId })
        .populate('favorites.pandals', 'name location areaCategory')
        .populate('favorites.foodPlaces', 'name cuisine location');
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const {
      phone,
      startPoint,
      endPoint,
      preferences
    } = req.body;

    // Find user in our database
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // Create user if doesn't exist
      const clerkUser = await clerkClient.users.getUser(userId);
      user = await User.findOrCreateFromClerk(clerkUser);
    }

    // Update user fields
    if (phone !== undefined) user.phone = phone;
    if (startPoint !== undefined) user.startPoint = startPoint;
    if (endPoint !== undefined) user.endPoint = endPoint;
    if (preferences !== undefined) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    user.lastActive = new Date();
    await user.save();

    // Populate and return updated user
    user = await User.findOne({ clerkId: userId })
      .populate('favorites.pandals', 'name location areaCategory')
      .populate('favorites.foodPlaces', 'name cuisine location');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Sync user data from Clerk
// @route   POST /api/auth/sync
// @access  Private
const syncUserData = async (req, res) => {
  try {
    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Get latest user data from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    
    // Update or create user in our database
    const user = await User.findOrCreateFromClerk(clerkUser);

    // Populate and return user
    const populatedUser = await User.findOne({ clerkId: userId })
      .populate('favorites.pandals', 'name location areaCategory')
      .populate('favorites.foodPlaces', 'name cuisine location');

    res.status(200).json({
      success: true,
      message: 'User data synced successfully',
      data: populatedUser
    });
  } catch (error) {
    console.error('Sync user data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Delete user from our database
    await User.findOneAndDelete({ clerkId: userId });

    // Note: We don't delete from Clerk here as that should be done through Clerk's dashboard
    // or their user management APIs with proper permissions

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user preferences
// @route   GET /api/auth/preferences
// @access  Private
const getPreferences = async (req, res) => {
  try {
    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = await User.findOne({ clerkId: userId }).select('preferences');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.preferences
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  try {
    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    user.preferences = { ...user.preferences, ...req.body };
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/auth/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = await User.findOne({ clerkId: userId })
      .populate('favorites.pandals')
      .populate('favorites.foodPlaces');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const stats = {
      totalFavoritePandals: user.favorites.pandals.length,
      totalFavoriteFoodPlaces: user.favorites.foodPlaces.length,
      totalRoutes: user.totalRoutes,
      memberSince: user.createdAt,
      lastActive: user.lastActive,
      preferredTransport: user.preferences.transportMode
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getMe,
  updateProfile,
  syncUserData,
  deleteAccount,
  getPreferences,
  updatePreferences,
  getUserStats
};