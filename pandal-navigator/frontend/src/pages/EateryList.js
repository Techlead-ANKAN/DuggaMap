import React, { useState, useEffect } from 'react';
import { FaUtensils, FaSpinner, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import axios from 'axios';

const EateryList = () => {
  const [foodplaces, setFoodplaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFoodplaces();
  }, []);

  const fetchFoodplaces = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/foodplaces');
      console.log('Foodplaces API response:', response.data);
      setFoodplaces(response.data.data || []);
    } catch (error) {
      console.error('Error fetching foodplaces:', error);
      setError('Failed to load foodplaces');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading foodplaces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUtensils className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Foodplaces</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchFoodplaces}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Food & Restaurants</h1>
              <p className="text-gray-600">
                Discover the best food spots and restaurants near pandals
              </p>
            </div>
            <FaUtensils className="h-12 w-12 text-green-600" />
          </div>
        </div>

        {/* Results */}
        {foodplaces.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <FaUtensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Foodplaces Found</h3>
            <p className="text-gray-600">
              We couldn't find any foodplaces at the moment. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodplaces.map((foodplace) => (
              <div key={foodplace._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Restaurant Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {foodplace.name}
                  </h3>
                  
                  {/* Address */}
                  <div className="flex items-start text-gray-600 mb-4">
                    <FaMapMarkerAlt className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{foodplace.address || 'Address not available'}</span>
                  </div>

                  {/* Coordinates */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Latitude:</span>
                        <span className="font-mono">{foodplace.location?.latitude?.toFixed(6) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Longitude:</span>
                        <span className="font-mono">{foodplace.location?.longitude?.toFixed(6) || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    View Details
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-4">
          <p className="text-center text-gray-600">
            Found <span className="font-semibold text-green-600">{foodplaces.length}</span> foodplace(s)
          </p>
        </div>
      </div>
    </div>
  );
};

export default EateryList;