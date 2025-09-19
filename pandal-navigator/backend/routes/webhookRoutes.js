const express = require('express');
const { handleClerkWebhook } = require('../controllers/webhookController');

const router = express.Router();

// Clerk webhook endpoint
// Note: This should be configured in your Clerk dashboard
router.post('/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook);

// Health check for webhook service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Webhook service is running',
    endpoints: ['/clerk'],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;