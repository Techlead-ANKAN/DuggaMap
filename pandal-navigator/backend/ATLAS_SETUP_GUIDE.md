# MongoDB Atlas Setup Guide

## 🚀 Step-by-Step Atlas Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Sign up for a free account
3. Verify your email

### 2. Create a New Project
1. Click "New Project"
2. Name it "DuggaMap" or "PandalNavigator"
3. Click "Create Project"

### 3. Create a Database Cluster
1. Click "Build a Database"
2. Choose **M0 Sandbox** (FREE tier)
3. Select **AWS** as cloud provider
4. Choose region closest to India (Mumbai/Singapore recommended)
5. Name your cluster (e.g., "duggamap-cluster")
6. Click "Create"

### 4. Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `duggamap-user` (or your choice)
5. Password: Generate a secure password (SAVE THIS!)
6. Database User Privileges: Select "Read and write to any database"
7. Click "Add User"

### 5. Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Comment: "Development and Cloud Deployment"
5. Click "Confirm"

### 6. Get Connection String
1. Go to "Databases" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your actual password
7. Replace `<dbname>` with `pandal-navigator`

Example connection string:
```
mongodb+srv://duggamap-user:YOUR_PASSWORD@duggamap-cluster.xxxxx.mongodb.net/pandal-navigator?retryWrites=true&w=majority
```

## 📝 What to Provide to Developer

Please provide these details:

1. **Complete Connection String** (with password filled in)
2. **Database Username** you created
3. **Database Password** you created
4. **Cluster Name** you chose

## 🔧 Environment Variables Needed

Add these to your `.env` file:
```env
# MongoDB Atlas (Cloud Database)
MONGODB_ATLAS_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/pandal-navigator

# Keep local as backup
MONGODB_LOCAL_URI=mongodb://localhost:27017/pandal-navigator

# Current (will be updated after migration)
MONGODB_URI=mongodb://localhost:27017/pandal-navigator
```

## ⚠️ Important Notes

1. **Free Tier Limits**: 512 MB storage, 100 max connections
2. **Security**: Never share your connection string publicly
3. **Backup**: Keep your local database as backup during migration
4. **Testing**: Test the connection before full migration