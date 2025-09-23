const { Webhook } = require('svix');
const User = require('../models/User_Clerk');

// Webhook handler for Clerk events
const handleClerkWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET is not set');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Verify webhook signature
    const headers = req.headers;
    const payload = req.body;
    
    const wh = new Webhook(webhookSecret);
    let evt;

    try {
      evt = wh.verify(payload, headers);
    } catch (err) {
      console.error('Webhook verification failed:', err.message);
      return res.status(400).json({ error: 'Webhook verification failed' });
    }

    const { type, data } = evt;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Received Clerk webhook: ${type}`);
    }

    switch (type) {
      case 'user.created':
        await handleUserCreated(data);
        break;
        
      case 'user.updated':
        await handleUserUpdated(data);
        break;
        
      case 'user.deleted':
        await handleUserDeleted(data);
        break;
        
      case 'session.created':
        await handleSessionCreated(data);
        break;
        
      default:
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Unhandled webhook type: ${type}`);
        }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Handle user creation
const handleUserCreated = async (userData) => {
  try {
    const user = await User.findOrCreateFromClerk(userData);
    if (process.env.NODE_ENV !== 'production') {
      console.log('User created successfully:', user._id);
    }
  } catch (error) {
    console.error('Error creating user from webhook:', error);
  }
};

// Handle user updates
const handleUserUpdated = async (userData) => {
  try {
    console.log('Updating user from webhook:', userData.id);
    
    const user = await User.findOne({ clerkId: userData.id });
    if (!user) {
      console.log('User not found, creating new user');
      await User.findOrCreateFromClerk(userData);
      return;
    }

    // Update user data
    user.email = userData.email_addresses?.[0]?.email_address || user.email;
    user.name = userData.first_name && userData.last_name 
      ? `${userData.first_name} ${userData.last_name}`.trim()
      : userData.first_name || userData.last_name || user.name;
    user.profilePicture = userData.image_url || user.profilePicture;
    user.lastActive = new Date();
    
    await user.save();
    console.log('User updated successfully:', user._id);
  } catch (error) {
    console.error('Error updating user from webhook:', error);
  }
};

// Handle user deletion
const handleUserDeleted = async (userData) => {
  try {
    console.log('Deleting user from webhook:', userData.id);
    
    const result = await User.findOneAndDelete({ clerkId: userData.id });
    if (result) {
      console.log('User deleted successfully:', result._id);
    } else {
      console.log('User not found for deletion:', userData.id);
    }
  } catch (error) {
    console.error('Error deleting user from webhook:', error);
  }
};

// Handle session creation (for analytics)
const handleSessionCreated = async (sessionData) => {
  try {
    const userId = sessionData.user_id;
    const user = await User.findOne({ clerkId: userId });
    
    if (user) {
      user.lastActive = new Date();
      await user.save();
      console.log('User last active updated:', user._id);
    }
  } catch (error) {
    console.error('Error updating last active from webhook:', error);
  }
};

module.exports = {
  handleClerkWebhook
};