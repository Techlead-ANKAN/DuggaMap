import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Navigation, Plus, X, Share2, Copy, Clock, TrendingUp, Zap, ArrowRight, Map, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouteCart } from '../contexts/RouteCartContext';

const RoutePlanner = () => {
  const navigate = useNavigate();
  const { selectedPandals: cartPandals, removePandalFromCart, clearCart } = useRouteCart();
  
  // State for form inputs
  const [routeType, setRouteType] = useState(cartPandals.length > 0 ? 'custom-pandals' : 'area-only');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedPandals, setSelectedPandals] = useState(cartPandals);
  const [routePriority, setRoutePriority] = useState('shortest-distance');
  
  // State for pandals and route
  const [allPandals, setAllPandals] = useState([]);
  const [areaPandals, setAreaPandals] = useState([]);
  const [selectedAreaPandals, setSelectedAreaPandals] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPandals, setLoadingPandals] = useState(false);
  const [showMobileShareMenu, setShowMobileShareMenu] = useState(false);

  const areas = ['North Kolkata', 'Central Kolkata', 'South Kolkata'];
  const priorityOptions = [
    { value: 'shortest-distance', label: 'Shortest Distance', icon: ArrowRight },
    { value: 'shortest-time', label: 'Shortest Time', icon: Clock },
    { value: 'popularity', label: 'Most Popular First', icon: TrendingUp }
  ];

  // Fetch all pandals on component mount
  useEffect(() => {
    fetchAllPandals();
  }, []);

  // Sync cart pandals with local state
  useEffect(() => {
    setSelectedPandals(cartPandals);
    if (cartPandals.length > 0) {
      setRouteType('custom-pandals');
    }
  }, [cartPandals]);

  // Fetch area-specific pandals when area changes
  useEffect(() => {
    if (selectedArea && (routeType === 'area-only' || routeType === 'start-end-area')) {
      fetchAreaPandals(selectedArea);
    }
  }, [selectedArea, routeType]);

  // Set selected area pandals when area pandals load
  useEffect(() => {
    if (routeType === 'area-only' && areaPandals.length > 0) {
      setSelectedAreaPandals(areaPandals);
    }
  }, [areaPandals, routeType]);

  // Close mobile share menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileShareMenu && !event.target.closest('.mobile-share-menu')) {
        setShowMobileShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileShareMenu]);

  const fetchAllPandals = async () => {
    try {
      setLoadingPandals(true);
      const response = await axios.get('/api/pandals');
      setAllPandals(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pandals:', error);
      toast.error('Failed to load pandals');
    } finally {
      setLoadingPandals(false);
    }
  };

  const fetchAreaPandals = async (area) => {
    try {
      setLoadingPandals(true);
      const response = await axios.get(`/api/pandals/area/${encodeURIComponent(area)}`);
      setAreaPandals(response.data.data || []);
    } catch (error) {
      console.error('Error fetching area pandals:', error);
      toast.error(`Failed to load ${area} pandals`);
      setAreaPandals([]);
    } finally {
      setLoadingPandals(false);
    }
  };

  const handleRouteTypeChange = (type) => {
    setRouteType(type);
    setOptimizedRoute(null);
    
    // Reset relevant fields based on route type
    if (type === 'area-only') {
      setStartPoint('');
      setEndPoint('');
      setSelectedPandals([]);
      // Keep selected area pandals if area is already selected
      if (selectedArea && areaPandals.length > 0) {
        setSelectedAreaPandals(areaPandals);
      }
    } else if (type === 'custom-pandals') {
      setSelectedArea('');
      setAreaPandals([]);
      setSelectedAreaPandals([]);
      setSelectedPandals(cartPandals);
    }
  };

  const removePandalFromRoute = (pandalId) => {
    setSelectedPandals(selectedPandals.filter(p => p._id !== pandalId));
    removePandalFromCart(pandalId);
    setOptimizedRoute(null);
  };

  const removePandalFromAreaRoute = (pandalId) => {
    setSelectedAreaPandals(selectedAreaPandals.filter(p => p._id !== pandalId));
    setOptimizedRoute(null);
  };

  const addPandalBackToAreaRoute = (pandal) => {
    if (!selectedAreaPandals.find(p => p._id === pandal._id)) {
      setSelectedAreaPandals([...selectedAreaPandals, pandal]);
      setOptimizedRoute(null);
    }
  };

  const generateRoute = async () => {
    try {
      setLoading(true);
      
      const payload = {
        routeType,
        startPoint: routeType === 'start-end-area' ? startPoint : null,
        endPoint: routeType === 'start-end-area' ? endPoint : null,
        area: (routeType === 'area-only' || routeType === 'start-end-area') ? selectedArea : null,
        pandals: routeType === 'custom-pandals' ? selectedPandals.map(p => p._id) : 
                routeType === 'area-only' ? selectedAreaPandals.map(p => p._id) : null,
        priority: routePriority
      };

      const response = await axios.post('/api/routes/optimize', payload);
      setOptimizedRoute(response.data.data);
      toast.success('Route optimized successfully!');
      
    } catch (error) {
      console.error('Error generating route:', error);
      toast.error('Failed to generate route');
    } finally {
      setLoading(false);
    }
  };

  const canGenerateRoute = () => {
    switch (routeType) {
      case 'start-end-area':
        return startPoint && endPoint && selectedArea;
      case 'area-only':
        return selectedArea && selectedAreaPandals.length >= 2;
      case 'custom-pandals':
        return selectedPandals.length >= 2;
      default:
        return false;
    }
  };

  // Sharing Functions
  const generateShareableContent = () => {
    if (!optimizedRoute) return null;
    
    const routeDetails = optimizedRoute.route || [];
    const pandalNames = routeDetails.map((pandal, index) => `${index + 1}. ${pandal.name}`).join('\n');
    
    const shareText = `🎯 My Optimized Durga Puja Route\n\n${pandalNames}\n\n📍 Total Distance: ${optimizedRoute.totalDistance || 'N/A'}\n⏱️ Estimated Time: ${optimizedRoute.estimatedTime || 'N/A'}\n\nPlan your route with DuggaMap! 🗺️`;
    const shareUrl = window.location.href;
    
    return { shareText, shareUrl };
  };

  const shareToWhatsApp = () => {
    const { shareText } = generateShareableContent();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const shareToFacebook = () => {
    const { shareUrl } = generateShareableContent();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
    toast.success('Opening Facebook...');
  };

  const copyShareLink = async () => {
    const { shareText, shareUrl } = generateShareableContent();
    const fullShareContent = `${shareText}\n\n${shareUrl}`;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullShareContent);
        toast.success('Route details copied to clipboard!');
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = fullShareContent;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        toast.success('Route details copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy. Please try again.');
    }
  };

  const shareViaWebShare = async () => {
    const { shareText, shareUrl } = generateShareableContent();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Durga Puja Route',
          text: shareText,
          url: shareUrl,
        });
        toast.success('Route shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast.error('Failed to share. Please try another method.');
        }
      }
    } else {
      // Fallback to copy link if Web Share API is not supported
      copyShareLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-24">
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Mobile-First Header */}
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-orange-600">Route Planner</h1>
              <p className="text-sm sm:text-base text-gray-600">Plan your perfect Durga Puja route</p>
              {cartPandals.length > 0 && (
                <p className="text-xs sm:text-sm text-orange-600 font-medium mt-1">
                  {cartPandals.length} pandal{cartPandals.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Form - Mobile First */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Route Type Selection */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Choose Route Type</h3>
                <div className="space-y-3">
                  
                  {/* Area Only - Mobile Optimized */}
                  <label className="flex items-start space-x-3 p-3 sm:p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors active:bg-orange-50">
                    <input
                      type="radio"
                      name="routeType"
                      value="area-only"
                      checked={routeType === 'area-only'}
                      onChange={(e) => handleRouteTypeChange(e.target.value)}
                      className="mt-1 w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm sm:text-base">Area Loop Route</div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">Complete tour of all pandals in a specific area</div>
                    </div>
                  </label>

                  {/* Custom Selection - Highlight if cart has items */}
                  <label className={`flex items-start space-x-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors active:bg-orange-50 ${
                    cartPandals.length > 0 
                      ? 'border-orange-300 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}>
                    <input
                      type="radio"
                      name="routeType"
                      value="custom-pandals"
                      checked={routeType === 'custom-pandals'}
                      onChange={(e) => handleRouteTypeChange(e.target.value)}
                      className="mt-1 w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm sm:text-base">
                        Custom Pandal Selection
                        {cartPandals.length > 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {cartPandals.length} selected
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">
                        Choose specific pandals you want to visit
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Route Details */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Route Details</h3>
                
                {/* Area Selection for area-only */}
                {routeType === 'area-only' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Area</label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                    >
                      <option value="">Choose an area</option>
                      {areas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Route Priority - Mobile Optimized */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Route Optimization</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                    {priorityOptions.map(option => (
                      <label key={option.value} className="flex items-center space-x-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors active:bg-orange-50">
                        <input
                          type="radio"
                          name="priority"
                          value={option.value}
                          checked={routePriority === option.value}
                          onChange={(e) => setRoutePriority(e.target.value)}
                          className="w-4 h-4"
                        />
                        <option.icon className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Route Button - Mobile Optimized */}
              <button
                onClick={generateRoute}
                disabled={!canGenerateRoute() || loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2 min-h-[56px] active:scale-95"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="text-sm sm:text-base">Optimizing Route...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    <span className="text-sm sm:text-base">Generate Optimized Route</span>
                  </>
                )}
              </button>
            </div>

            {/* Sidebar - Mobile Responsive */}
            <div className="space-y-4 sm:space-y-6">
              {/* Custom Pandal Management */}
              {routeType === 'custom-pandals' && (
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Selected Pandals</h3>
                    {selectedPandals.length > 0 && (
                      <button
                        onClick={() => {
                          clearCart();
                          setSelectedPandals([]);
                        }}
                        className="text-red-600 text-xs sm:text-sm font-medium hover:text-red-700 flex items-center space-x-1 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>
                  
                  {selectedPandals.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
                      <h4 className="text-gray-500 font-medium mb-2 text-sm sm:text-base">No pandals selected</h4>
                      <p className="text-gray-400 text-xs sm:text-sm mb-4 px-2">
                        Go to the Pandals page and tap "Add to Route" on pandals you want to visit
                      </p>
                      <button
                        onClick={() => navigate('/pandals')}
                        className="bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center space-x-2 mx-auto text-sm sm:text-base min-h-[44px]"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Browse Pandals</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedPandals.map((pandal, index) => (
                        <div
                          key={pandal._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 truncate text-sm sm:text-base">{pandal.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">
                                {pandal.location?.address || pandal.areaCategory}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removePandalFromRoute(pandal._id)}
                            className="ml-3 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedPandals.length > 0 && selectedPandals.length < 2 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-700 text-xs sm:text-sm">
                        <strong>Tip:</strong> Add at least 2 pandals to generate an optimized route.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Area Pandals Display */}
              {routeType === 'area-only' && selectedArea && (
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      {selectedArea} Pandals
                      <span className="ml-2 text-sm text-gray-500">
                        ({selectedAreaPandals.length}/{areaPandals.length} selected)
                      </span>
                    </h3>
                    {areaPandals.length > selectedAreaPandals.length && (
                      <button
                        onClick={() => setSelectedAreaPandals(areaPandals)}
                        className="text-orange-600 text-xs sm:text-sm font-medium hover:text-orange-700 flex items-center space-x-1 p-2 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Select All</span>
                      </button>
                    )}
                  </div>
                  
                  {loadingPandals ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Selected Pandals */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Selected for Route:</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {selectedAreaPandals.map((pandal, index) => (
                            <div
                              key={pandal._id}
                              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-800 truncate text-sm sm:text-base">{pandal.name}</h4>
                                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                                    {pandal.location?.address || pandal.areaCategory}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => removePandalFromAreaRoute(pandal._id)}
                                className="ml-3 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                                title="Remove from route"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Deselected Pandals */}
                      {areaPandals.length > selectedAreaPandals.length && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Available Pandals:</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {areaPandals
                              .filter(pandal => !selectedAreaPandals.find(sp => sp._id === pandal._id))
                              .map(pandal => (
                                <div
                                  key={pandal._id}
                                  className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-700 truncate text-sm">{pandal.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">
                                      {pandal.location?.address || pandal.areaCategory}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => addPandalBackToAreaRoute(pandal)}
                                    className="ml-3 p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                                    title="Add to route"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {selectedAreaPandals.length > 0 && selectedAreaPandals.length < 2 && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-amber-700 text-xs sm:text-sm">
                            <strong>Tip:</strong> Select at least 2 pandals to generate an optimized route.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Optimized Route Display */}
              {optimizedRoute && (
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Optimized Route</h3>
                    
                    {/* Share Options - Mobile First */}
                    <div className="flex items-center space-x-2">
                      {/* Mobile: Share Button */}
                      <button 
                        onClick={() => setShowMobileShareMenu(true)}
                        className="sm:hidden bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center min-w-[36px] min-h-[36px]"
                        title="Share Route"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      
                      {/* Desktop: Individual Share Options */}
                      <div className="hidden sm:flex items-center space-x-2">
                        <button 
                          onClick={shareToWhatsApp}
                          className="bg-green-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-600 transition-colors flex items-center space-x-1"
                          title="Share on WhatsApp"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </button>
                        
                        <button 
                          onClick={shareToFacebook}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-blue-700 transition-colors flex items-center space-x-1"
                          title="Share on Facebook"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Facebook</span>
                        </button>
                        
                        <button 
                          onClick={copyShareLink}
                          className="bg-gray-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-700 transition-colors flex items-center space-x-1"
                          title="Copy Link"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {optimizedRoute.route.map((step, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <div className="bg-orange-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-medium truncate">{step.name}</div>
                          {step.distance && (
                            <div className="text-xs text-gray-500">{step.distance}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <div>Total Distance: {optimizedRoute.totalDistance}</div>
                      <div>Estimated Time: {optimizedRoute.estimatedTime}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Share Menu Modal */}
      {showMobileShareMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:hidden">
          <div className="mobile-share-menu bg-white w-full rounded-t-2xl p-6 transform transition-transform duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Share Your Route</h3>
              <button 
                onClick={() => setShowMobileShareMenu(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {/* WhatsApp Share */}
              <button 
                onClick={() => {
                  shareToWhatsApp();
                  setShowMobileShareMenu(false);
                }}
                className="w-full flex items-center space-x-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-800">Share on WhatsApp</div>
                  <div className="text-sm text-gray-600">Send route to friends and family</div>
                </div>
              </button>
              
              {/* Facebook Share */}
              <button 
                onClick={() => {
                  shareToFacebook();
                  setShowMobileShareMenu(false);
                }}
                className="w-full flex items-center space-x-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-800">Share on Facebook</div>
                  <div className="text-sm text-gray-600">Post to your timeline</div>
                </div>
              </button>
              
              {/* Copy Link */}
              <button 
                onClick={() => {
                  copyShareLink();
                  setShowMobileShareMenu(false);
                }}
                className="w-full flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <Copy className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-800">Copy Link</div>
                  <div className="text-sm text-gray-600">Copy route details to clipboard</div>
                </div>
              </button>
              
              {/* Native Share (if supported) */}
              {navigator.share && (
                <button 
                  onClick={() => {
                    shareViaWebShare();
                    setShowMobileShareMenu(false);
                  }}
                  className="w-full flex items-center space-x-4 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-800">More Options</div>
                    <div className="text-sm text-gray-600">Use device sharing options</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;