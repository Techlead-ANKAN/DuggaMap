# 🚀 DuggaMap Deployment Guide

## Production Deployment Checklist

### ✅ Pre-Deployment Cleanup (COMPLETED)
- [x] Removed unnecessary files (docs/, scripts/, tests/)
- [x] Cleaned up console.logs for production
- [x] Optimized package.json files
- [x] Updated .gitignore files
- [x] Created production environment templates
- [x] Production-ready server configuration

### 🛠️ Environment Setup Required

#### Backend Environment Variables (.env.production)
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/duggamap
CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxx
FRONTEND_URL=https://your-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
```

#### Frontend Environment Variables (.env.production)
```bash
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxx
GENERATE_SOURCEMAP=false
REACT_APP_ENV=production
```

### 🚂 Railway Backend Deployment

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # In your backend directory
   cd backend
   git init
   git add .
   git commit -m "Production ready backend"
   git push origin main
   ```

3. **Railway Setup**
   - New Project → Deploy from GitHub repo
   - Select DuggaMap/pandal-navigator/backend
   - Add environment variables from template above
   - Deploy automatically triggers

4. **Custom Domain (Optional)**
   - Railway → Settings → Domains
   - Add custom domain or use railway.app subdomain

### ⚡ Vercel Frontend Deployment

1. **Vercel Account Setup**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - New Project → Import Git Repository
   - Select DuggaMap repository
   - Framework Preset: Create React App
   - Root Directory: `pandal-navigator/frontend`

3. **Environment Variables**
   - Add all variables from frontend template above
   - Update REACT_APP_API_URL with Railway backend URL

4. **Build Settings**
   ```bash
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

### 🔒 Security Configuration

#### CORS Origins Update
In `backend/server.js`, update allowed origins:
```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://your-app.vercel.app',
  'https://*.vercel.app'
].filter(Boolean);
```

#### Clerk Production Setup
1. **Clerk Dashboard**
   - Switch to Production environment
   - Update redirect URLs to production domains
   - Configure webhook endpoints

2. **Update API Keys**
   - Use production publishable key
   - Use production secret key
   - Update in both frontend and backend

### 📊 Performance Optimization

#### Frontend Optimizations
```bash
# Build with optimizations
npm run build

# Analyze bundle (optional)
npm run build:analyze
```

#### Backend Optimizations
- MongoDB Atlas indexes configured
- Rate limiting enabled
- Helmet security headers
- Production logging mode

### 🧪 Testing Production

#### Health Check Endpoints
- Backend: `https://your-backend.railway.app/api/health`
- Frontend: `https://your-app.vercel.app`

#### API Testing
```bash
# Test pandals endpoint
curl https://your-backend.railway.app/api/pandals

# Test CORS
curl -H "Origin: https://your-app.vercel.app" \
     https://your-backend.railway.app/api/health
```

### 🔄 Continuous Deployment

#### Automatic Deployments
- **Railway**: Auto-deploys on backend changes
- **Vercel**: Auto-deploys on frontend changes
- Both platforms monitor the main branch

#### Manual Deployment
```bash
# Railway CLI (optional)
railway login
railway link
railway up

# Vercel CLI (optional)
vercel login
vercel
```

### 📱 Post-Deployment Checklist

- [ ] Test all major user flows
- [ ] Verify mobile responsiveness
- [ ] Test route planning functionality
- [ ] Verify social sharing works
- [ ] Test pandal cart system
- [ ] Check authentication flow
- [ ] Verify API rate limiting
- [ ] Test on different devices

### 🐛 Troubleshooting

#### Common Issues
1. **CORS Errors**: Check allowed origins in backend
2. **API 500 Errors**: Verify MongoDB connection string
3. **Auth Issues**: Confirm Clerk keys match environment
4. **Build Failures**: Check Node.js version compatibility

#### Debugging
```bash
# Backend logs
railway logs

# Frontend build logs
vercel logs your-app.vercel.app
```

### 🎯 Success Metrics

- **Load Time**: < 3 seconds initial load
- **Mobile Performance**: Lighthouse score > 90
- **API Response**: < 500ms average
- **Uptime**: 99.9% availability

---

**Ready for Launch! 🚀**

Your DuggaMap application is now production-ready and optimized for deployment.