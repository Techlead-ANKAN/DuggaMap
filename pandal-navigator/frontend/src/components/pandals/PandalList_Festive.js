import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Star, Heart, MapPin, Clock, Filter, Search, Users, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const PandalList = () => {
  const { user } = useUser();
  const [pandals, setPandals] = useState([]);
  const [filteredPandals, setFilteredPandals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState(new Set());

  // Filters
  const filters = [
    { id: 'all', label: 'All Pandals', icon: '🏛️' },
    { id: 'famous', label: 'Famous Pandals', icon: '⭐' },
    { id: 'nearby', label: 'Nearby', icon: '📍' },
    { id: 'crowded', label: 'Crowded', icon: '👥' },
    { id: 'peaceful', label: 'Peaceful', icon: '🕊️' }
  ];

  useEffect(() => {
    fetchPandals();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    filterPandals();
  }, [pandals, searchTerm, selectedFilter]);

  const fetchPandals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pandals');
      setPandals(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching pandals:', err);
  setError('Error loading pandal data');
  toast.error('Error loading pandal data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      const favoriteIds = new Set(response.data.map(fav => fav.pandalId));
      setFavorites(favoriteIds);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const filterPandals = () => {
    let filtered = [...pandals];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(pandal =>
        pandal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pandal.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pandal.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (selectedFilter) {
      case 'famous':
        filtered = filtered.filter(pandal => pandal.rating >= 4.5);
        break;
      case 'nearby':
        // This would typically use user's location
        filtered = filtered.slice(0, 10);
        break;
      case 'crowded':
        filtered = filtered.filter(pandal => pandal.crowdLevel === 'high');
        break;
      case 'peaceful':
        filtered = filtered.filter(pandal => pandal.crowdLevel === 'low');
        break;
      default:
        break;
    }

    setFilteredPandals(filtered);
  };

  const toggleFavorite = async (pandalId) => {
    if (!user) {
  toast.error('Please sign in to add to favorites');
      return;
    }

    try {
      if (favorites.has(pandalId)) {
        await api.delete(`/favorites/${pandalId}`);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(pandalId);
          return newSet;
        });
  toast.success('Removed from favorites');
      } else {
        await api.post('/favorites', { pandalId });
        setFavorites(prev => new Set([...prev, pandalId]));
  toast.success('Added to favorites');
      }
    } catch (err) {
  console.error('Error toggling favorite:', err);
  toast.error('Something went wrong, please try again');
    }
  };

  const getCrowdLevelText = (level) => {
    switch (level) {
      case 'low': return { text: 'Calm', color: 'text-green-600', bg: 'bg-green-100' };
      case 'medium': return { text: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'high': return { text: 'Crowded', color: 'text-red-600', bg: 'bg-red-100' };
      default: return { text: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-festive flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🪔</div>
          <h2 className="font-festive text-2xl text-gold mb-2">Searching for pandals...</h2>
          <p className="text-vermillion">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-festive">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-vermillion via-red-600 to-red-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 text-8xl animate-pulse">🪷</div>
          <div className="absolute top-32 right-32 text-6xl animate-pulse" style={{ animationDelay: '1s' }}>🌺</div>
          <div className="absolute bottom-20 left-32 text-7xl animate-pulse" style={{ animationDelay: '2s' }}>🪔</div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-festive text-4xl md:text-6xl font-bold mb-4">
            Puja Pandals
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover the best Durga Puja pandals in Kolkata
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by pandal or area..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                  <button className="btn-primary px-6 py-3 rounded-xl flex items-center justify-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filter</span>
                </button>
              </div>

              {/* Filter Tags */}
              <div className="flex flex-wrap gap-3 justify-center">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                      selectedFilter === filter.id
                        ? 'bg-gold text-midnight-blue shadow-lg scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <span>{filter.icon}</span>
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pandals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="font-festive text-2xl text-gray-700 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchPandals}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Retry
            </button>
          </div>
        ) : filteredPandals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-festive text-2xl text-gray-700 mb-2">No pandals found</h3>
            <p className="text-gray-600">Try a different search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPandals.map((pandal) => {
              const crowdInfo = getCrowdLevelText(pandal.crowdLevel);
              
              return (
                <div
                  key={pandal._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pandal.image || '/api/placeholder/400/300'}
                      alt={pandal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(pandal._id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-300"
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors duration-300 ${
                          favorites.has(pandal._id)
                            ? 'text-red-500 fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute top-4 left-4 bg-gold text-midnight-blue px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{pandal.rating || '4.5'}</span>
                    </div>

                    {/* Crowd Level */}
                    <div className={`absolute bottom-4 left-4 ${crowdInfo.bg} ${crowdInfo.color} px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1`}>
                      <Users className="h-4 w-4" />
                      <span>{crowdInfo.text}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-festive text-xl font-bold text-gray-800 mb-2">
                      {pandal.name}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-2 text-vermillion" />
                      <span>{pandal.area}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {pandal.description || 'A beautiful Durga Puja pandal showcasing craftsmanship and devotion.'}
                    </p>

                    {/* Special Features */}
                    {pandal.specialFeatures && pandal.specialFeatures.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {pandal.specialFeatures.slice(0, 2).map((feature, index) => (
                            <span
                              key={index}
                              className="bg-marigold/20 text-vermillion px-2 py-1 rounded-lg text-xs font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                          {pandal.specialFeatures.length > 2 && (
                            <span className="text-gray-500 text-xs">
                              +{pandal.specialFeatures.length - 2} আরো
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Timing */}
                    <div className="flex items-center text-gray-600 mb-4">
                      <Clock className="h-4 w-4 mr-2 text-gold" />
                      <span className="text-sm">
                        {pandal.timing || 'সকাল ৬টা - রাত ১২টা'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <Link
                        to={`/pandals/${pandal._id}`}
                        className="flex-1 btn-primary text-center py-2 rounded-xl text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <button className="px-4 py-2 border-2 border-gold text-gold rounded-xl hover:bg-gold hover:text-white transition-colors duration-300 text-sm font-medium">
                        Add to Route
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {filteredPandals.length > 0 && filteredPandals.length % 9 === 0 && (
          <div className="text-center mt-12">
            <button className="btn-primary px-8 py-3 rounded-xl text-lg font-medium">
            Load more pandals
            </button>
          </div>
        )}
      </div>

      {/* Floating Action */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          to="/plan-route"
          className="w-16 h-16 bg-gradient-primary rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 group"
        >
          <span className="text-2xl group-hover:animate-pulse">🗺️</span>
        </Link>
      </div>
    </div>
  );
};

export default PandalList;