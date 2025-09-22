import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { MapPin, Route, Star, Clock, Users, Navigation, Compass, Heart, TrendingUp } from 'lucide-react';
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
    { name: 'North Kolkata', value: 'North Kolkata', icon: '🏛️', description: 'Traditional heritage area' },
    { name: 'South Kolkata', value: 'South Kolkata', icon: '🌆', description: 'Modern cultural hub' },
    { name: 'Salt Lake', value: 'Salt Lake', icon: '🏢', description: 'Planned city area' },
    { name: 'Howrah', value: 'Howrah', icon: '🌉', description: 'Historic twin city' },
  ];

  const keyFeatures = [
    {
      icon: Compass,
      title: 'Smart Route Planning',
      description: 'AI-powered optimal routes between pandals',
      color: 'vermillion'
    },
    {
      icon: Clock,
      title: 'Live Timings',
      description: 'Real-time aarti and event schedules',
      color: 'gold'
    },
    {
      icon: TrendingUp,
      title: 'Crowd Intelligence',
      description: 'Live crowd density and wait times',
      color: 'royal-blue'
    }
  ];

  const handleQuickStart = (location) => {
    setStartPoint(location);
    toast.success(`${location} selected! 🎯`, {
      style: {
        borderRadius: '12px',
        background: '#fef2f2',
        color: '#7f1d1d',
      },
    });
  };

  const handlePlanRoute = async () => {
    if (!startPoint.trim()) {
      toast.error('Please select your start location', {
        style: {
          borderRadius: '12px',
          background: '#fef2f2',
          color: '#7f1d1d',
        },
      });
      return;
    }

    if (!isSignedIn) {
      toast.error('Please sign in to plan a route', {
        style: {
          borderRadius: '12px',
          background: '#fef2f2',
          color: '#7f1d1d',
        },
      });
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
        toast.success('Your Puja route is being prepared! 🛣️', {
          style: {
            borderRadius: '12px',
            background: '#f0f9ff',
            color: '#0c4a6e',
          },
        });
      }, 1500);
    } catch (error) {
      setIsRouteLoading(false);
      toast.error('Error creating route');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-cream-50 to-secondary-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-32 left-10 w-24 h-24 bg-gradient-to-br from-vermillion-200 to-vermillion-300 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-gold-200 to-gold-300 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-gradient-to-br from-royal-blue-200 to-royal-blue-300 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Welcome Message */}
          <div className="text-center mb-16 animate-fade-in">
            {isSignedIn ? (
              <div className="mb-6">
                <p className="text-xl text-vermillion-600 font-medium mb-2">
                  স্বাগতম, {user?.firstName || 'ভক্ত'}! 🙏
                </p>
                <p className="text-neutral-600">Ready for your spiritual journey?</p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-xl text-vermillion-600 font-medium mb-2">
                  দুর্গা পূজা পান্ডেল নেভিগেটর-এ স্বাগতম 🙏
                </p>
                <p className="text-neutral-600">Discover Kolkata's spiritual heritage</p>
              </div>
            )}
            
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-vermillion-600 via-gold-500 to-royal-blue-600 bg-clip-text text-transparent">
              Durga Puja Pandals Navigator
            </h1>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed">
              Experience Kolkata's most magnificent pandals with intelligent route planning and real-time insights
            </p>
          </div>

          {/* Route Planning Card */}
          <div className="max-w-3xl mx-auto mb-20 animate-slide-up">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-large border border-white/20 p-8 md:p-10">
              <div className="text-center mb-8">
                <h2 className="font-heading text-3xl font-semibold text-neutral-800 mb-3">
                  Plan Your Sacred Journey
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-vermillion-500 to-gold-500 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-6">
                {/* Start Point Input */}
                <div className="relative group">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-vermillion-500 transition-colors group-focus-within:text-vermillion-600" />
                  <input
                    type="text"
                    placeholder="Enter your starting location..."
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-vermillion-500/20 focus:border-vermillion-500 transition-all duration-200"
                  />
                </div>

                {/* End Point Input */}
                <div className="relative group">
                  <Navigation className="absolute left-4 top-4 h-5 w-5 text-gold-500 transition-colors group-focus-within:text-gold-600" />
                  <input
                    type="text"
                    placeholder="Destination (optional - we'll find the best pandals for you)"
                    value={endPoint}
                    onChange={(e) => setEndPoint(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all duration-200"
                  />
                </div>

                {/* Plan Route Button */}
                <button
                  onClick={handlePlanRoute}
                  disabled={isRouteLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-vermillion-500 to-gold-500 text-white font-semibold rounded-xl shadow-vermillion hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isRouteLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Crafting your spiritual route...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <Route className="h-5 w-5" />
                      <span>Plan My Puja Journey</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Start Locations */}
          <div className="mb-20 animate-slide-up">
            <div className="text-center mb-10">
              <h3 className="font-heading text-2xl font-semibold text-neutral-800 mb-3">Quick Destinations</h3>
              <p className="text-neutral-600">Start your journey from these popular areas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {quickLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickStart(location.value)}
                  className="group bg-white/60 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/80 hover:shadow-medium hover:scale-105 transition-all duration-300 border border-white/30"
                >
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
                    {location.icon}
                  </div>
                  <div className="font-semibold text-neutral-800 mb-1">
                    {location.name}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {location.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-neutral-800 mb-4">
              Intelligent Puja Experience
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Advanced features designed to enhance your spiritual journey
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-vermillion-500 to-gold-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="group bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center hover:shadow-large hover:scale-105 transition-all duration-300 border border-white/30">
                <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-${feature.color} group-hover:shadow-lg transform group-hover:scale-110 transition-all duration-200`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3 text-neutral-800">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-vermillion-500 via-vermillion-600 to-gold-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Make This Durga Puja Unforgettable
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of devotees in discovering Kolkata's spiritual heritage through our intelligent pandal navigator
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/pandals" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-vermillion-600 font-semibold rounded-xl hover:bg-neutral-50 hover:shadow-lg hover:scale-105 transition-all duration-200 space-x-3"
            >
              <Star className="h-5 w-5" />
              <span>Explore All Pandals</span>
            </Link>
            
            {!isSignedIn && (
              <Link 
                to="/sign-up" 
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-vermillion-600 hover:scale-105 transition-all duration-200 space-x-3"
              >
                <Heart className="h-5 w-5" />
                <span>Join Our Community</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;