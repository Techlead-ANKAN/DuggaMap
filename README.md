# DuggaMap - Durga Puja Navigator

A modern, mobile-first web application for navigating Durga Puja pandals in Kolkata. Built with React and Node.js, featuring intelligent route planning, cart-based pandal selection, and social sharing capabilities.

## 🚀 Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layouts
- **Route Planning**: Smart cart-based system for collecting and planning pandal visits
- **Area-wise Navigation**: Explore pandals by North, Central, and South Kolkata
- **Social Sharing**: Share optimized routes via WhatsApp, Facebook, or copy link
- **Real-time Data**: 98+ pandals with detailed information and locations
- **Progressive Web App**: Fast loading with modern web technologies

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Clerk** - Authentication
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Clerk account

### Environment Variables

**Backend (.env)**
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
FRONTEND_URL=your_frontend_url
```

**Frontend (.env)**
```
REACT_APP_API_URL=your_backend_api_url
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
GENERATE_SOURCEMAP=false
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Techlead-ANKAN/DuggaMap.git
cd DuggaMap/pandal-navigator
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Start Development Servers**

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm start
```

### Production Build

**Frontend**
```bash
cd frontend
npm run build
```

## 📱 Key Features

### Route Planning System
- **Cart-based Selection**: Add pandals to route cart from any page
- **Area Loop Routes**: Complete tours of specific areas with customizable selections
- **Custom Routes**: Build personalized routes from selected pandals
- **Route Optimization**: Multiple optimization strategies (distance, time, popularity)

### Mobile Experience
- **Touch-Optimized**: Minimum 44px touch targets for accessibility
- **Thumb Navigation**: Key controls positioned in thumb-zone
- **Progressive Enhancement**: Graceful degradation across devices
- **Fast Loading**: Optimized bundle size and lazy loading

### Social Features
- **WhatsApp Integration**: Share routes directly to WhatsApp
- **Facebook Sharing**: Post routes to timeline
- **Copy to Clipboard**: Universal sharing with formatted text
- **Native Share API**: Device-specific sharing options

## 🔒 Security

- **Helmet.js**: Security headers and CORS protection
- **Rate Limiting**: API request throttling
- **Input Validation**: Server-side data validation
- **Environment Isolation**: Separate dev/prod configurations

## 📊 Performance

- **Bundle Optimization**: Tree-shaking and code splitting
- **Image Optimization**: Compressed assets and lazy loading
- **Database Indexing**: Optimized MongoDB queries
- **Caching**: Strategic caching for static assets

## 🌐 Deployment

### Recommended Stack
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: MongoDB Atlas

### Deploy to Vercel (Frontend)
1. Connect GitHub repository
2. Set environment variables
3. Deploy with automatic builds

### Deploy to Railway (Backend)
1. Connect GitHub repository
2. Set environment variables
3. Deploy with automatic scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**ANKAN** - Full Stack Developer
- GitHub: [@Techlead-ANKAN](https://github.com/Techlead-ANKAN)

## 🙏 Acknowledgments

- Durga Puja Committee data sources
- Open source community
- React and Node.js communities

---

**Built with ❤️ for Durga Puja 2025**