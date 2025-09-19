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
    { name: 'উত্তর কলকাতা', value: 'North Kolkata', icon: '🏛️' },
    { name: 'দক্ষিণ কলকাতা', value: 'South Kolkata', icon: '🌆' },
    { name: 'সল্ট লেক', value: 'Salt Lake', icon: '🏢' },
    { name: 'হাওড়া', value: 'Howrah', icon: '🌉' },
  ];

  const handleQuickStart = (location) => {
    setStartPoint(location);
    toast.success(`${location} নির্বাচিত হয়েছে! 🎯`);
  };

  const handlePlanRoute = async () => {
    if (!startPoint.trim()) {
      toast.error('আপনার শুরুর স্থান নির্বাচন করুন');
      return;
    }

    if (!isSignedIn) {
      toast.error('রুট প্ল্যান করতে লগিন করুন');
      navigate('/sign-in');
      return;
    }

    setIsRouteLoading(true);
    
    try {
      // Simulate route planning
      setTimeout(() => {
        setIsRouteLoading(false);
        navigate('/plan-route', { 
          state: { startPoint, endPoint: endPoint || 'নিকটতম পান্ডেল' } 
        });
        toast.success('আপনার পূজার রুট তৈরি হচ্ছে! 🛣️');
      }, 1500);
    } catch (error) {
      setIsRouteLoading(false);
      toast.error('রুট তৈরিতে সমস্যা হয়েছে');
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
                স্বাগতম, {user?.firstName || 'ভক্ত'}! 🙏
              </p>
            ) : (
              <p className="text-lg text-midnight-blue mb-4">
                মা দুর্গার আশীর্বাদে আপনাকে স্বাগতম 🙏
              </p>
            )}
            
            <h1 className="font-festive text-festive-xl mb-4">
              দুর্গা পূজা পান্ডেল নেভিগেটর
            </h1>
            <p className="text-festive-md text-midnight-blue max-w-3xl mx-auto">
              কলকাতার সবচেয়ে সুন্দর পান্ডেলগুলো খুঁজে পান এবং আপনার পূজার যাত্রা পরিকল্পনা করুন
            </p>
          </div>

          {/* Route Planning Card */}
          <div className="card-festive max-w-2xl mx-auto mb-12 slide-up">
            <div className="text-center mb-6">
              <h2 className="font-festive text-festive-lg mb-2">
                আপনার পূজার রুট পরিকল্পনা করুন
              </h2>
              <div className="w-16 h-1 bg-gradient-primary mx-auto rounded-full"></div>
            </div>

            <div className="space-y-4">
              {/* Start Point Input */}
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-vermillion" />
                <input
                  type="text"
                  placeholder="আপনার শুরুর স্থান লিখুন..."
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
                  placeholder="গন্তব্য (ঐচ্ছিক - নিকটতম পান্ডেল খুঁজে দেওয়া হবে)"
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
                    <span>রুট তৈরি হচ্ছে...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Route className="h-5 w-5" />
                    <span>পূজার রুট পরিকল্পনা করুন</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Quick Start Locations */}
          <div className="mb-12">
            <h3 className="font-festive text-festive-md mb-6">দ্রুত নির্বাচন</h3>
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
              আমাদের বিশেষ সুবিধাসমূহ
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
                স্মার্ট রুট পরিকল্পনা
              </h3>
              <p className="text-midnight-blue opacity-80">
                সর্বোত্তম রুট খুঁজে পান এবং সময় বাঁচান
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-festive text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-festive text-lg font-semibold mb-2 text-midnight-blue">
                ভোগের সময়সূচী
              </h3>
              <p className="text-midnight-blue opacity-80">
                প্রতিটি পান্ডেলের ভোগের সময় জেনে নিন
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-festive text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-festive text-lg font-semibold mb-2 text-midnight-blue">
                ভিড়ের তথ্য
              </h3>
              <p className="text-midnight-blue opacity-80">
                রিয়েল-টাইম ভিড়ের অবস্থা দেখুন
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-festive text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-festive text-3xl md:text-4xl font-bold mb-4">
            এই দুর্গা পূজায় আনন্দে ভরপুর হয়ে উঠুন
          </h2>
          <p className="text-lg mb-8 opacity-90">
            কলকাতার সেরা পান্ডেলগুলো আবিষ্কার করুন এবং অবিস্মরণীয় স্মৃতি তৈরি করুন
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/pandals" 
              className="btn-festive-secondary inline-flex items-center justify-center space-x-2"
            >
              <span>সব পান্ডেল দেখুন</span>
              <Star className="h-5 w-5" />
            </Link>
            
            {!isSignedIn && (
              <Link 
                to="/sign-up" 
                className="btn-festive-outline bg-white/10 backdrop-blur-sm inline-flex items-center justify-center space-x-2"
              >
                <span>যোগদান করুন</span>
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