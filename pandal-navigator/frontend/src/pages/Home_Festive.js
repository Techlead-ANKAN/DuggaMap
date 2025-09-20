import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { MapPin, Route, Star, Clock, Users, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  // Quick start locations for Kolkata areas
  const quickLocations = [
  { name: 'North Kolkata', value: 'North Kolkata', icon: '🏛️' },
  { name: 'South Kolkata', value: 'South Kolkata', icon: '🌆' },
  { name: 'Salt Lake', value: 'Salt Lake', icon: '🏢' },
  { name: 'Howrah', value: 'Howrah', icon: '🌉' },
  ];

  const handleQuickStart = (location) => {
    setStartPoint(location);
    toast.success(`${location} selected! 🎯`);
  };

  const handlePlanRoute = async () => {
    if (!startPoint.trim()) {
      toast.error('Please select your start location');
      return;
    }

    if (!isSignedIn) {
      toast.error('Please sign in to plan a route');
      navigate('/sign-in');
      return;
    }

    setIsRouteLoading(true);
    
    try {
      // Simulate route planning
      setTimeout(() => {
        setIsRouteLoading(false);
        navigate('/plan-route', { 
          state: { startPoint, endPoint: endPoint || 'Nearest Pandals' } 
        });
        toast.success('Your Puja route is being prepared! 🛣️');
      }, 1500);
    } catch (error) {
      setIsRouteLoading(false);
      toast.error('Error creating route');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 text-8xl">🪷</div>
          <div className="absolute top-40 right-32 text-6xl">🐚</div>
          <div className="absolute bottom-32 left-32 text-7xl">🪔</div>
          <div className="absolute bottom-20 right-20 text-5xl">🌺</div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Welcome Message */}
          <div className="mb-8 fade-in">
            {isSignedIn ? (
              <p className="text-lg text-vermillion mb-4">
                Welcome, {user?.firstName || 'Devotee'}! 🙏
              </p>
            ) : (
              <p className="text-lg text-midnight-blue mb-4">
                Welcome to the Durga Puja Pandals Navigator 🙏
              </p>
            )}
            
            <h1 className="font-festive text-festive-xl mb-4">
              Durga Puja Pandals Navigator
            </h1>
            <p className="text-festive-md text-midnight-blue max-w-3xl mx-auto">
              Discover the most beautiful pandals in Kolkata and plan your Puja journey
            </p>
          </div>

          {/* Route Planning Card */}
          <div className="card-festive max-w-2xl mx-auto mb-12 slide-up">
            <div className="text-center mb-6">
              <h2 className="font-festive text-festive-lg mb-2">
                Plan your Puja route
              </h2>
              <div className="w-16 h-1 bg-gradient-primary mx-auto rounded-full"></div>
            </div>

            <div className="space-y-4">
              {/* Start Point Input */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-vermillion" />
                <input
                  type="text"
                  placeholder="Enter your start location..."
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                  className="input-festive pl-10"
                />
              </div>

              {/* End Point Input */}
              <div className="relative">
                <Navigation className="absolute left-3 top-3 h-5 w-5 text-gold" />
                <input
                  type="text"
                  placeholder="Destination (optional - will find nearest pandals)"
                  value={endPoint}
                  onChange={(e) => setEndPoint(e.target.value)}
                  className="input-festive pl-10"
                />
              </div>

              {/* Plan Route Button */}
              <button
                onClick={handlePlanRoute}
                disabled={isRouteLoading}
                className="btn-festive w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRouteLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="loader-dhunuchi w-5 h-5"></div>
                    <span>Creating route...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Route className="h-5 w-5" />
                    <span>Plan Puja Route</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Quick Start Locations */}
          <div className="mb-12">
            <h3 className="font-festive text-festive-md mb-6">Quick Picks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {quickLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickStart(location.value)}
                  className="card-festive text-center p-4 hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-3xl mb-2">{location.icon}</div>
                  <div className="font-festive text-sm font-semibold text-midnight-blue">
                    {location.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-festive text-festive-lg mb-4">
              Our Key Features
            </h2>
            <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-festive text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-festive text-lg font-semibold mb-2 text-midnight-blue">
                Smart Route Planning
              </h3>
              <p className="text-midnight-blue opacity-80">
                Find optimal routes and save time
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-festive text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-festive text-lg font-semibold mb-2 text-midnight-blue">
                Puja Schedule
              </h3>
              <p className="text-midnight-blue opacity-80">
                Know the aarti timings of each pandal
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-festive text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-festive text-lg font-semibold mb-2 text-midnight-blue">
                Crowd Info
              </h3>
              <p className="text-midnight-blue opacity-80">
                View real-time crowd conditions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-festive text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-festive text-3xl md:text-4xl font-bold mb-4">
            Make this Durga Puja unforgettable
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Discover Kolkata's best pandals and create lasting memories
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/pandals" 
              className="btn-festive-secondary inline-flex items-center justify-center space-x-2"
            >
              <span>View all Pandals</span>
              <Star className="h-5 w-5" />
            </Link>
            
            {!isSignedIn && (
              <Link 
                to="/sign-up" 
                className="btn-festive-outline bg-white/10 backdrop-blur-sm inline-flex items-center justify-center space-x-2"
              >
                <span>Join Us</span>
                <Users className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;