import React from 'react';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

const PandalDetail = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <FaMapMarkerAlt className="h-16 w-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pandal Details</h1>
          <p className="text-gray-600 mb-6">
            Detailed pandal information page is coming soon. 
            This will include photos, reviews, timings, and more.
          </p>
          <div className="flex items-center justify-center text-orange-600">
            <FaSpinner className="h-5 w-5 animate-spin mr-2" />
            <span>Under Development</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PandalDetail;