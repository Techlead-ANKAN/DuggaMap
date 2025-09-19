import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaMap, 
  FaList, 
  FaSpinner 
} from 'react-icons/fa';
import PandalCard from '../components/common/PandalCard';
import Map from '../components/common/Map';
import { apiService, setupAuthToken } from '../services/api';
import toast from 'react-hot-toast';

const PandalList = () => {
  const { user, isSignedIn } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [pandals, setPandals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'map'
  
  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [showFilters, setShowFilters] = useState(false);

  // Areas and categories for filters
  const areas = [
    'Central Kolkata', 'North Kolkata', 'South Kolkata', 'East Kolkata', 
    'West Kolkata', 'Howrah', 'Barasat', 'Dum Dum'
  ];
  
  const categories = [
    'Traditional', 'Theme-based', 'Eco-friendly', 'Cultural', 'Modern'
  ];

  // Setup auth token for API calls
  useEffect(() => {
    if (isSignedIn && user) {
      setupAuthToken(() => user.getToken());
    }
  }, [isSignedIn, user]);

  // Fetch pandals
  const fetchPandals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        search: searchQuery || undefined,
        area: selectedArea || undefined,
        category: selectedCategory || undefined,
        sort: sortBy || undefined,
        limit: 50,
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) delete params[key];
      });

      const response = await apiService.pandals.getAll(params);
      setPandals(response.data.data);
    } catch (error) {
      console.error('Error fetching pandals:', error);
      setError('Failed to load pandals. Please try again.');
      toast.error('Failed to load pandals');
    } finally {
      setLoading(false);
    }
  };

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedArea) params.set('area', selectedArea);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'name') params.set('sort', sortBy);
    
    setSearchParams(params);
  }, [searchQuery, selectedArea, selectedCategory, sortBy, setSearchParams]);

  // Fetch data when filters change
  useEffect(() => {
    fetchPandals();
  }, [searchQuery, selectedArea, selectedCategory, sortBy]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search');
    setSearchQuery(query);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedArea('');
    setSelectedCategory('');
    setSortBy('name');
  };

  // Handle pandal click from map
  const handlePandalClick = (pandalId) => {
    const element = document.getElementById(`pandal-${pandalId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-4', 'ring-orange-300');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-orange-300');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Durga Puja Pandals</h1>
              <p className="text-gray-600 mt-1">
                Discover amazing pandals across Kolkata
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaList className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'map' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaMap className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="search"
                placeholder="Search pandals by name, area, or description..."
                defaultValue={searchQuery}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white px-4 py-1.5 rounded-md hover:bg-orange-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <FaFilter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            
            {(searchQuery || selectedArea || selectedCategory || sortBy !== 'name') && (
              <button
                onClick={clearFilters}
                className="text-orange-600 hover:text-orange-700 text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              {/* Area Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Areas</option>
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="area">Area</option>
                  <option value="createdAt">Newest</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="h-8 w-8 text-orange-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading pandals...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchPandals}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Found {pandals.length} pandal{pandals.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Map View */}
            {viewMode === 'map' && (
              <div className="mb-8">
                <Map 
                  pandals={pandals}
                  height="600px"
                  onPandalClick={handlePandalClick}
                />
              </div>
            )}

            {/* Grid/List View */}
            {viewMode !== 'map' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pandals.map(pandal => (
                  <div key={pandal._id} id={`pandal-${pandal._id}`}>
                    <PandalCard pandal={pandal} />
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {pandals.length === 0 && (
              <div className="text-center py-12">
                <FaMapMarkerAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No pandals found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PandalList;