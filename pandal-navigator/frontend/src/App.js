import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SignedIn, SignedOut, SignIn, SignUp, useAuth } from '@clerk/clerk-react';

// Import components
import SplashScreen from './components/SplashScreen';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingRouteCart from './components/common/FloatingRouteCart';

// Import contexts
import { RouteCartProvider } from './contexts/RouteCartContext';

// Import pages
import Home from './pages/Home';
import PandalList from './pages/PandalList';
import EateryList from './pages/EateryList';
import EateryDetail from './pages/EateryDetail';
import RoutePlanner from './pages/RoutePlanner';
import RouteDetail from './pages/RouteDetail';
import SharedRoute from './pages/SharedRoute';
import Profile from './pages/Profile';


import { Analytics } from "@vercel/analytics/react"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Access the Durga Puja Navigator
              </p>
            </div>
            <div className="bg-white py-8 px-6 shadow rounded-lg">
              <SignIn 
                appearance={{
                  theme: "classic",
                  variables: {
                    colorPrimary: "#f97316",
                  }
                }}
                redirectUrl="/"
                signUpUrl="/sign-up"
              />
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
};

// App Content Component (to handle splash screen logic)
const AppContent = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Check if splash has been shown in this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    return !hasSeenSplash; // Show splash only if not seen before
  });
  const location = useLocation();
  const { isLoaded } = useAuth();

  useEffect(() => {
    // Check sessionStorage when component mounts or location changes
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (location.pathname === '/') {
      // Only show splash if user hasn't seen it in this session
      setShowSplash(!hasSeenSplash);
    } else {
      setShowSplash(false);
    }
  }, [location.pathname]);

  const handleSplashFinish = () => {
    // Mark splash as seen in this session
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  // Show splash screen if needed
  if (showSplash && location.pathname === '/' && isLoaded) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-off-white">
      <Navbar />
      <main className="pt-16 min-h-screen"> 
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/pandals" element={<PandalList />} />
          <Route path="/foodplaces" element={<EateryList />} />
          <Route path="/foodplaces/:id" element={<EateryDetail />} />
          <Route path="/shared-route" element={<SharedRoute />} />
          
          {/* Auth Route */}
          <Route
            path="/sign-in"
            element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                  <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                      Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                      Access the Durga Puja Navigator
                    </p>
                  </div>
                  <div className="bg-white py-8 px-6 shadow rounded-lg">
                    <SignIn 
                      appearance={{
                        theme: "classic",
                        variables: {
                          colorPrimary: "#f97316",
                        }
                      }}
                      redirectUrl="/"
                      routing="path"
                      path="/sign-in"
                      signUpUrl="/sign-up"
                    />
                  </div>
                </div>
              </div>
            }
          />
          
          <Route
            path="/sign-up"
            element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                  <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                      Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                      Join the Durga Puja Navigator
                    </p>
                  </div>
                  <div className="bg-white py-8 px-6 shadow rounded-lg">
                    <SignUp 
                      appearance={{
                        theme: "classic",
                        variables: {
                          colorPrimary: "#f97316",
                        }
                      }}
                      redirectUrl="/"
                      routing="path"
                      path="/sign-up"
                      signInUrl="/sign-in"
                    />
                  </div>
                </div>
              </div>
            }
          />
          
          {/* Protected Routes */}
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
      
      {/* Floating Route Cart */}
      <FloatingRouteCart />
      
      {/* Enhanced Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)',
            color: '#ffffff',
            border: '1px solid #F59E0B',
            borderRadius: '12px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: '500',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          },
          success: {
            duration: 3000,
            style: {
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#F59E0B',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
              color: '#ffffff',
            },
            iconTheme: {
              primary: '#FEE2E2',
              secondary: '#DC2626',
            },
          },
        }}
      />

      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
};

function App() {
  return (
    <Router>
      <RouteCartProvider>
        <AppContent />
      </RouteCartProvider>
    </Router>
  );
}

export default App;