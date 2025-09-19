import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react';

// Import components
import SplashScreen from './components/SplashScreen';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Import pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PandalList from './pages/PandalList';
import PandalDetail from './pages/PandalDetail';
import EateryList from './pages/EateryList';
import EateryDetail from './pages/EateryDetail';
import RoutePlanner from './pages/RoutePlanner';
import RouteDetail from './pages/RouteDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

// App Content Component (to handle splash screen logic)
const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const { isLoaded } = useAuth();

  useEffect(() => {
    // Show splash screen only on first load
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash || location.pathname !== '/') {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Show splash screen if needed
  if (showSplash && location.pathname === '/' && isLoaded) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-off-white">
      <Navbar />
      <main className="pt-16 min-h-screen"> 
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/pandals" element={<PandalList />} />
          <Route path="/pandals/:id" element={<PandalDetail />} />
          <Route path="/eateries" element={<EateryList />} />
          <Route path="/eateries/:id" element={<EateryDetail />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan-route"
            element={
              <ProtectedRoute>
                <RoutePlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routes/:id"
            element={
              <ProtectedRoute>
                <RouteDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      
      {/* Festive Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, var(--vermillion) 0%, var(--gold) 100%)',
            color: '#fff',
            border: '1px solid var(--gold)',
            borderRadius: '12px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: '500',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'var(--gold)',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;