# Durga Puja Smart Pandal-Hopping Navigator

## 🌟 Project Overview

A comprehensive MERN stack application that helps users plan optimized pandal-hopping routes during Durga Puja in Kolkata. The app provides intelligent route planning, transportation suggestions, food recommendations, and detailed pandal information.

## ✨ Features

- **User Authentication** → JWT-based signup/login system
- **Smart Route Planning** → Optimized pandal-hopping routes with ETA
- **Pandal Information** → Detailed cards with themes, timings, crowd levels
- **Food Recommendations** → Strategic food spots along routes
- **Transportation Suggestions** → Walking, Metro, Auto, Bus, Cab options
- **Alternate Routes** → Traffic and crowd-aware alternatives
- **Favorites System** → Save pandals and food spots
- **Social Sharing** → Share routes via links/WhatsApp
- **Mobile Responsive** → Works seamlessly on all devices

## 🔧 Tech Stack

**Frontend:**
- React 18 (Functional Components + Hooks)
- React Router DOM for navigation
- Context API for state management
- Leaflet.js for interactive maps
- TailwindCSS for modern styling
- Axios for API communication

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- RESTful API architecture
- Google Maps API integration

**Database Collections:**
- Users (profiles, preferences)
- Pandals (locations, themes, timings)
- Eateries (food spots, ratings, types)
- Routes (saved routes, favorites)
- Reviews (user feedback)

## 📂 Project Structure

```
/pandal-navigator
 ┣ 📂 backend
 ┃ ┣ 📂 controllers    # Business logic
 ┃ ┣ 📂 models         # Mongoose schemas
 ┃ ┣ 📂 routes         # API endpoints
 ┃ ┣ 📂 middleware     # Auth & validation
 ┃ ┣ 📂 config         # Database & environment
 ┃ ┣ 📂 data           # Seed data
 ┃ ┗ server.js         # Entry point
 ┣ 📂 frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components   # Reusable UI components
 ┃ ┃ ┣ 📂 pages        # Route components
 ┃ ┃ ┣ 📂 context      # State management
 ┃ ┃ ┣ 📂 services     # API calls
 ┃ ┃ ┣ 📂 utils        # Helper functions
 ┃ ┃ ┣ App.jsx         # Main app component
 ┃ ┃ ┗ index.js        # React entry point
 ┣ 📂 docs             # Documentation
 ┗ package.json        # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pandal-navigator
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add your MongoDB URI and API keys to .env
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Seed Database**
   ```bash
   cd backend
   npm run seed
   ```

## 🔑 Environment Variables

Create `.env` files in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pandal-navigator
JWT_SECRET=your-jwt-secret-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NODE_ENV=development
```

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Pandals
- `GET /api/pandals` - Get all pandals
- `GET /api/pandals/:id` - Get specific pandal
- `POST /api/pandals` - Create pandal (admin)

### Eateries
- `GET /api/eateries` - Get all eateries
- `GET /api/eateries/nearby` - Get nearby eateries

### Routes
- `POST /api/routes/plan` - Plan optimized route
- `GET /api/routes/user` - Get user's saved routes
- `POST /api/routes/save` - Save route

### Favorites
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites` - Get user favorites
- `DELETE /api/favorites/:id` - Remove favorite

## 📱 Features in Detail

### Route Planning Algorithm
The app uses a sophisticated algorithm that considers:
- Distance optimization
- Crowd levels at different times
- Transportation availability
- Food stop preferences
- User's walking speed preferences

### Transportation Intelligence
- **Walking Routes**: Pedestrian-friendly paths
- **Metro Integration**: Kolkata Metro route suggestions
- **Auto/Taxi**: Real-time fare estimates
- **Bus Routes**: WBTC bus integration

### Pandal Database
Each pandal entry includes:
- GPS coordinates
- Theme and artistic details
- Peak hours analysis
- Bhog timings
- Accessibility information
- Historical significance

## 🌐 Deployment

### Backend (Heroku/Railway)
```bash
npm run build
npm start
```

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy build folder
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Durga Puja committees of Kolkata
- Google Maps Platform
- OpenStreetMap community
- React and Node.js communities

---

**Happy Pandal Hopping! 🎉**