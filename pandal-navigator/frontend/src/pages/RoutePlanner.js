import React from 'react';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoutePlanner = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6 text-vermillion" />
          </button>
          <h1 className="text-3xl font-festive text-vermillion">রুট পরিকল্পনা</h1>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex items-center justify-center gap-4 text-6xl mb-4">
            <MapPin className="text-vermillion" />
            <Navigation className="text-gold" />
          </div>
          <h2 className="text-2xl font-festive text-vermillion mb-2">শীঘ্রই আসছে</h2>
          <p className="text-gray-600">Route planning feature coming soon in our festive update!</p>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;