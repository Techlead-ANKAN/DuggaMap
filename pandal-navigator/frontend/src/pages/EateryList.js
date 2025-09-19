import React from 'react';
import { FaUtensils, FaSpinner } from 'react-icons/fa';

const EateryList = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <FaUtensils className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Food & Eateries</h1>
          <p className="text-gray-600 mb-6">
            Discover the best food spots and restaurants near pandals. 
            Browse by cuisine, price range, and location.
          </p>
          <div className="flex items-center justify-center text-green-600">
            <FaSpinner className="h-5 w-5 animate-spin mr-2" />
            <span>Under Development</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EateryList;