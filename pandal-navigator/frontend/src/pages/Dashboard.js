import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { 
  FaMapMarkerAlt, 
  FaRoute, 
  FaHeart, 
  FaStar, 
  FaUtensils,
  FaSpinner,
  FaPlus
} from 'react-icons/fa';
import PandalCard from '../components/common/PandalCard';
import { apiService, setupAuthToken } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';

const Dashboard = () => {
  const { user, isSignedIn } = useUser();
  const { favorites } = useFavorites();
  const [userStats, setUserStats] = useState(null);
  const [recentPandals, setRecentPandals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Setup auth token for API calls
  useEffect(() => {
    if (isSignedIn && user) {
      setupAuthToken(() => user.getToken());
    }
  }, [isSignedIn, user]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isSignedIn) return;
      
      setLoading(true);
      try {
        // Fetch user stats and recent pandals
        const [statsResponse, pandalResponse] = await Promise.all([
          apiService.user.getStats().catch(() => ({ data: { data: {} } })),
          apiService.pandals.getAll({ limit: 6, sort: 'rating' })
        ]);

        setUserStats(statsResponse.data.data);
        setRecentPandals(pandalResponse.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isSignedIn]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 text-orange-600 animate-spin mx-auto" />
          <p className="text-gray-600 mt-2">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Favorite Pandals',
      value: favorites?.filter(f => f.itemType === 'Pandal').length || 0,
      icon: <FaMapMarkerAlt className="h-6 w-6 text-orange-600" />,
      link: '/favorites'
    },
    {
      name: 'Favorite Eateries', 
      value: favorites?.filter(f => f.itemType === 'Eatery').length || 0,
      icon: <FaUtensils className="h-6 w-6 text-green-600" />,
      link: '/favorites'
    },
    {
      name: 'Routes Created',
      value: userStats?.routesCreated || 0,
      icon: <FaRoute className="h-6 w-6 text-blue-600" />,
      link: '/plan-route'
    },
    {
      name: 'Reviews Written',
      value: userStats?.reviewsCount || 0,
      icon: <FaStar className="h-6 w-6 text-yellow-600" />,
      link: '/profile'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName || 'Explorer'}!
          </h1>
          <p className="text-orange-100 mb-6">
            Ready to discover more amazing pandals and plan your next route?
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/plan-route"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Plan New Route
            </Link>
            <Link
              to="/pandals"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors inline-flex items-center justify-center"
            >
              Explore Pandals
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600">{stat.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Favorites */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Favorites</h2>
              <Link
                to="/favorites"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {favorites?.length > 0 ? (
              <div className="space-y-3">
                {favorites.slice(0, 3).map((favorite, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {favorite.itemType === 'Pandal' ? (
                        <FaMapMarkerAlt className="h-5 w-5 text-orange-600" />
                      ) : (
                        <FaUtensils className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {favorite.itemType} Favorite
                      </p>
                      <p className="text-sm text-gray-500">
                        Added {new Date(favorite.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FaHeart className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No favorites yet</p>
                <Link
                  to="/pandals"
                  className="text-orange-600 hover:text-orange-700 text-sm"
                >
                  Explore pandals to add favorites
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/pandals"
                className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <FaMapMarkerAlt className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Browse Pandals</p>
                  <p className="text-sm text-gray-600">Discover amazing pandals</p>
                </div>
              </Link>
              
              <Link
                to="/eateries"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaUtensils className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Find Food</p>
                  <p className="text-sm text-gray-600">Explore local eateries</p>
                </div>
              </Link>
              
              <Link
                to="/plan-route"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FaRoute className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Plan Route</p>
                  <p className="text-sm text-gray-600">Create efficient routes</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Pandals */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Featured Pandals</h2>
            <Link
              to="/pandals"
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          {recentPandals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPandals.slice(0, 3).map(pandal => (
                <PandalCard key={pandal._id} pandal={pandal} compact={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaMapMarkerAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pandals available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;