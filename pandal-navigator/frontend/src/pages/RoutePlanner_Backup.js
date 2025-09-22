import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Navigation, Plus, X, Download, Clock, TrendingUp, Zap, ArrowRight, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import MapView from '../components/MapView';
import '../components/MapView.css';

const RoutePlanner = () => {
  const navigate = useNavigate();
  
  // State for form inputs
  const [routeType, setRouteType] = useState('area-only'); // 'start-end-area', 'area-only', 'custom-pandals'
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedPandals, setSelectedPandals] = useState([]);
  const [routePriority, setRoutePriority] = useState('shortest-distance');
  
  // State for pandals and route
  const [allPandals, setAllPandals] = useState([]);
  const [areaPandals, setAreaPandals] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  // State for UI
  const [showMapView, setShowMapView] = useState(false);
  const [loadingPandals, setLoadingPandals] = useState(false);

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

  // Fetch area-specific pandals when area changes
  useEffect(() => {
    if (selectedArea && (routeType === 'area-only' || routeType === 'start-end-area')) {
      fetchAreaPandals(selectedArea);
    }
  }, [selectedArea, routeType]);

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
    } else if (type === 'custom-pandals') {
      setSelectedArea('');
      setAreaPandals([]);
    }
  };

  const addPandalToRoute = (pandal) => {
    if (!selectedPandals.find(p => p._id === pandal._id)) {
      setSelectedPandals([...selectedPandals, pandal]);
      setOptimizedRoute(null); // Reset route when pandals change
    }
  };

  const removePandalFromRoute = (pandalId) => {
    setSelectedPandals(selectedPandals.filter(p => p._id !== pandalId));
    setOptimizedRoute(null); // Reset route when pandals change
  };

  const generateRoute = async () => {
    try {
      setLoading(true);
      
      const payload = {
        routeType,
        startPoint: routeType === 'start-end-area' ? startPoint : null,
        endPoint: routeType === 'start-end-area' ? endPoint : null,
        area: (routeType === 'area-only' || routeType === 'start-end-area') ? selectedArea : null,
        pandals: routeType === 'custom-pandals' ? selectedPandals.map(p => p._id) : null,
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

  const downloadRoute = async () => {
    if (!optimizedRoute) return;
    
    try {
      const response = await axios.post('/api/routes/download', {
        route: optimizedRoute,
        routeType,
        priority: routePriority
      }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `durga-puja-route-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Route downloaded successfully!');
    } catch (error) {
      console.error('Error downloading route:', error);
      toast.error('Failed to download route');
    }
  };

  const canGenerateRoute = () => {
    switch (routeType) {
      case 'start-end-area':
        return startPoint && endPoint && selectedArea;
      case 'area-only':
        return selectedArea;
      case 'custom-pandals':
        return selectedPandals.length >= 2;
      default:
        return false;
    }
  };

  const handleMapRouteUpdate = (pandal) => {
    if (routeType === 'custom-pandals') {
      addPandalToRoute(pandal);
    } else {
      toast.info('Switch to Custom Pandal mode to add pandals from map');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-neutral-50">
      {/* Full Screen Map View */}
      {showMapView ? (
        <div className="h-screen relative">
          {/* Map Header */}
          <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-[1001] p-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowMapView(false)}
                  className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <ArrowLeft className="h-6 w-6 text-vermillion-500" />
                </button>
                <div>
                  <h1 className="text-xl font-heading font-bold text-vermillion-500">Route Map</h1>
                  <p className="text-sm text-neutral-600">Interactive navigation view</p>
                </div>
              </div>
              
              {optimizedRoute && (
                <div className="hidden md:flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{optimizedRoute.route?.length || 0} stops</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{optimizedRoute.totalDistance}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{optimizedRoute.estimatedTime}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Component */}
          <div className="h-full pt-20">
            <MapView
              pandals={routeType === 'custom-pandals' ? allPandals : areaPandals}
              optimizedRoute={optimizedRoute}
              onRouteUpdate={handleMapRouteUpdate}
              className="h-full"
            />
          </div>
        </div>
      ) : (
        /* Original Form View */
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="h-6 w-6 text-vermillion-500" />
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-heading font-bold text-vermillion-500">Route Planner</h1>
                <p className="text-neutral-600">Plan your perfect Durga Puja pandal hopping route</p>
              </div>
              {optimizedRoute && (
                <button
                  onClick={() => setShowMapView(true)}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Map className="h-5 w-5" />
                  <span>View on Map</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
              {/* Route Planning Form */}
              <div className="lg:col-span-2 space-y-6">
          {/* Route Planning Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Route Type Selection */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">Choose Route Type</h3>
              <div className="space-y-3">
                
                {/* Start + End + Area */}
                <label className="flex items-start space-x-3 p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-vermillion-300 transition-colors">
                  <input
                    type="radio"
                    name="routeType"
                    value="start-end-area"
                    checked={routeType === 'start-end-area'}
                    onChange={(e) => handleRouteTypeChange(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-neutral-800">Start → Area Pandals → End</div>
                    <div className="text-sm text-neutral-600">Visit pandals in a specific area between your start and end points</div>
                  </div>
                </label>

                {/* Area Only */}
                <label className="flex items-start space-x-3 p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-vermillion-300 transition-colors">
                  <input
                    type="radio"
                    name="routeType"
                    value="area-only"
                    checked={routeType === 'area-only'}
                    onChange={(e) => handleRouteTypeChange(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-neutral-800">Area Loop Route</div>
                    <div className="text-sm text-neutral-600">Complete tour of all pandals in a specific area</div>
                  </div>
                </label>

                {/* Custom Selection */}
                <label className="flex items-start space-x-3 p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-vermillion-300 transition-colors">
                  <input
                    type="radio"
                    name="routeType"
                    value="custom-pandals"
                    checked={routeType === 'custom-pandals'}
                    onChange={(e) => handleRouteTypeChange(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-neutral-800">Custom Pandal Selection</div>
                    <div className="text-sm text-neutral-600">Choose specific pandals you want to visit</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Route Inputs */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">Route Details</h3>
              
              {/* Start & End Points for start-end-area */}
              {routeType === 'start-end-area' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Starting Point</label>
                    <input
                      type="text"
                      value={startPoint}
                      onChange={(e) => setStartPoint(e.target.value)}
                      placeholder="Enter starting location"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-vermillion-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Ending Point</label>
                    <input
                      type="text"
                      value={endPoint}
                      onChange={(e) => setEndPoint(e.target.value)}
                      placeholder="Enter ending location"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-vermillion-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Area Selection */}
              {(routeType === 'area-only' || routeType === 'start-end-area') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Select Area</label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-vermillion-500 focus:border-transparent"
                  >
                    <option value="">Choose an area</option>
                    {areas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Route Priority */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">Route Optimization Priority</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {priorityOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-2 p-3 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-vermillion-300 transition-colors">
                      <input
                        type="radio"
                        name="priority"
                        value={option.value}
                        checked={routePriority === option.value}
                        onChange={(e) => setRoutePriority(e.target.value)}
                      />
                      <option.icon className="h-4 w-4 text-vermillion-500" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Route Button */}
            <button
              onClick={generateRoute}
              disabled={!canGenerateRoute() || loading}
              className="w-full bg-gradient-to-r from-vermillion-500 to-vermillion-600 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-vermillion-600 hover:to-vermillion-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Optimizing Route...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  <span>Generate Optimized Route</span>
                </>
              )}
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Custom Pandal Selection */}
            {routeType === 'custom-pandals' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Select Pandals</h3>
                
                {/* Selected Pandals */}
                {selectedPandals.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">Selected ({selectedPandals.length})</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedPandals.map(pandal => (
                        <div key={pandal._id} className="flex items-center justify-between bg-vermillion-50 p-2 rounded-lg">
                          <span className="text-sm font-medium truncate">{pandal.name}</span>
                          <button
                            onClick={() => removePandalFromRoute(pandal._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Pandals */}
                <div>
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">Available Pandals</h4>
                  {loadingPandals ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vermillion-500 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {allPandals
                        .filter(pandal => !selectedPandals.find(p => p._id === pandal._id))
                        .map(pandal => (
                          <div key={pandal._id} className="flex items-center justify-between p-2 border border-neutral-200 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{pandal.name}</div>
                              <div className="text-xs text-neutral-500 truncate">{pandal.area}</div>
                            </div>
                            <button
                              onClick={() => addPandalToRoute(pandal)}
                              className="text-vermillion-500 hover:text-vermillion-700"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Area Pandals for area-only or start-end-area */}
            {(routeType === 'area-only' || routeType === 'start-end-area') && selectedArea && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">{selectedArea} Pandals</h3>
                {loadingPandals ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vermillion-500 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {areaPandals.map(pandal => (
                      <div key={pandal._id} className="p-2 border border-neutral-200 rounded-lg">
                        <div className="text-sm font-medium">{pandal.name}</div>
                        <div className="text-xs text-neutral-500">{pandal.address || pandal.area}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Generated Route Display */}
            {optimizedRoute && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-800">Optimized Route</h3>
                  <button
                    onClick={downloadRoute}
                    className="bg-gold-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gold-600 transition-colors flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {optimizedRoute.route.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-neutral-50 rounded-lg">
                      <div className="bg-vermillion-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{step.name}</div>
                        {step.distance && (
                          <div className="text-xs text-neutral-500">{step.distance}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="text-sm text-neutral-600">
                    <div>Total Distance: {optimizedRoute.totalDistance}</div>
                    <div>Estimated Time: {optimizedRoute.estimatedTime}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;