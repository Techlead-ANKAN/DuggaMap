# Clerk Authentication Setup Guide

## Overview
Your Durga Puja Smart Pandal-Hopping Navigator now uses Clerk for professional authentication, replacing the previous JWT system. This provides:

- ✅ Social logins (Google, Facebook, GitHub, etc.)
- ✅ Email verification and password reset
- ✅ User management dashboard
- ✅ Enterprise security features
- ✅ No password storage on your servers
- ✅ Webhook support for user sync

## 🚀 Quick Setup Steps

### 1. Create Clerk Account
1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application
4. Choose "React" as your framework

### 2. Get Your API Keys
After creating your app, you'll see:
- **Publishable Key**: `pk_test_...` (safe for frontend)
- **Secret Key**: `sk_test_...` (keep secure, backend only)

### 3. Configure Backend Environment
Update your `.env` file:

```bash
# Replace these with your actual Clerk keys
CLERK_SECRET_KEY=sk_test_your-clerk-secret-key-here
CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key-here

# Google Maps API (already configured)
GOOGLE_MAPS_API_KEY=AIzaSyDUrQ8GkevrHdJvhpON6lmeW0dWl-cVi4s

# Database
MONGODB_URI=mongodb://localhost:27017/pandal-navigator

# Other settings
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 4. Install Dependencies
```bash
cd backend
npm install
```

### 5. Start Backend Server
```bash
npm run dev
```

### 6. Test Authentication
Visit: `http://localhost:5000/api/auth/health`
Should return: `{ "success": true, "message": "Auth service is running with Clerk integration" }`

## 🔧 Frontend Integration

### Install Clerk React Package
```bash
cd frontend
npm install @clerk/clerk-react
```

### Configure Clerk Provider
```jsx
// src/App.js
import { ClerkProvider } from '@clerk/clerk-react'

const clerkPubKey = 'pk_test_your-publishable-key-here'

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      {/* Your existing app components */}
    </ClerkProvider>
  )
}
```

### Add Authentication Components
```jsx
// Login/Signup component
import { SignIn, SignUp, UserButton, useUser } from '@clerk/clerk-react'

function AuthPage() {
  return (
    <div>
      <SignIn routing="hash" />
      {/* or <SignUp routing="hash" /> */}
    </div>
  )
}

// Protected component
function Dashboard() {
  const { isSignedIn, user } = useUser()
  
  if (!isSignedIn) {
    return <SignIn />
  }
  
  return (
    <div>
      <UserButton />
      <h1>Welcome {user.firstName}!</h1>
    </div>
  )
}
```

## 🔗 API Integration

### Making Authenticated Requests
```javascript
// Frontend API calls with Clerk
import { useAuth } from '@clerk/clerk-react'

function useApiCall() {
  const { getToken } = useAuth()
  
  const callAPI = async (endpoint, options = {}) => {
    const token = await getToken()
    
    return fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
  }
  
  return callAPI
}

// Example usage
const apiCall = useApiCall()
const response = await apiCall('/auth/me')
const userData = await response.json()
```

## 🎯 Key Features Available

### 1. User Profile Management
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/sync` - Sync Clerk data

### 2. Social Authentication
Configure in Clerk Dashboard → User & Authentication → Social Login:
- Google (recommended for Indian users)
- Facebook
- GitHub
- Apple
- Discord, and more

### 3. Email Verification
Automatically handled by Clerk - no additional setup required.

### 4. Password Reset
Built into Clerk's SignIn component - no backend code needed.

## 🔒 Security Features

### Multi-Factor Authentication
Enable in Clerk Dashboard → User & Authentication → Multi-factor

### Session Management
- Automatic token refresh
- Secure session storage
- Cross-device logout

### Webhook Integration (Optional)
Configure webhooks to sync user data:

1. In Clerk Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Add webhook secret to `.env`:
```bash
CLERK_WEBHOOK_SECRET=whsec_your-webhook-secret-here
```

## 🎨 Customization

### Customize Sign-in/Sign-up Appearance
```jsx
<SignIn 
  appearance={{
    theme: 'dark', // or 'light'
    variables: {
      colorPrimary: '#f59e0b', // Your brand color
    }
  }}
/>
```

### Configure Allowed Sign-up Methods
In Clerk Dashboard → User & Authentication → Email, Phone, Username

## 📱 Mobile Support

Clerk works with React Native:
```bash
npm install @clerk/clerk-expo
```

## 🚨 Important Notes

1. **No Passwords Stored**: Your backend no longer stores passwords
2. **JWT Removed**: Old JWT authentication system is replaced
3. **User Model Updated**: Now uses `clerkId` instead of email as primary identifier
4. **Automatic Sync**: User data syncs automatically between Clerk and your database

## 🆘 Troubleshooting

### Common Issues

1. **"Authentication required" errors**
   - Check if Clerk keys are correctly set
   - Verify frontend is sending Bearer token
   - Check token expiration

2. **User not found in database**
   - Ensure user sync is working
   - Check webhook configuration
   - Manually trigger sync via `/api/auth/sync`

3. **CORS errors**
   - Add your domain to Clerk's allowed origins
   - Check CORS_ORIGIN in your .env

### Testing Authentication
```bash
# Check if Clerk is configured
curl http://localhost:5000/api/auth/health

# Test protected endpoint (will fail without token)
curl http://localhost:5000/api/auth/me
```

## 📞 Support

- Clerk Documentation: [clerk.com/docs](https://clerk.com/docs)
- Community Discord: [discord.gg/clerk](https://discord.gg/clerk)
- GitHub Issues: For project-specific issues

## 🎉 What's Next?

1. Set up your Clerk account and get API keys
2. Update your `.env` file
3. Install dependencies and start the server
4. Integrate Clerk components in your React frontend
5. Test the authentication flow
6. Deploy with environment variables

Your authentication system is now production-ready with enterprise-grade security!