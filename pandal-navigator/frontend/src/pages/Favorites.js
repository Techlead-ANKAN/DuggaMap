import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
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
          <h1 className="text-3xl font-festive text-vermillion">Favorites</h1>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">
            <Heart className="h-16 w-16 text-vermillion mx-auto fill-current" />
          </div>
          <h2 className="text-2xl font-festive text-vermillion mb-2">Coming Soon</h2>
          <p className="text-gray-600">Favorites feature coming soon in our festive update!</p>
        </div>
      </div>
    </div>
  );
};

export default Favorites;