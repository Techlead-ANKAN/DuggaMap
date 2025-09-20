import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SignedIn, SignedOut, SignIn, SignUp, useAuth } from '@clerk/clerk-react';

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
                redirectUrl="/dashboard"
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
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const { isLoaded } = useAuth();

  useEffect(() => {
    // Always show splash screen when visiting home page
    if (location.pathname === '/') {
      setShowSplash(true);
      // No automatic timer - splash screen will only be hidden when SplashScreen component calls onFinish
    } else {
      setShowSplash(false);
    }
  }, [location.pathname]);

  const handleSplashFinish = () => {
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
          <Route path="/pandals/:id" element={<PandalDetail />} />
          <Route path="/foodplaces" element={<EateryList />} />
          <Route path="/foodplaces/:id" element={<EateryDetail />} />
          
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
                      redirectUrl="/dashboard"
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
                      redirectUrl="/dashboard"
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