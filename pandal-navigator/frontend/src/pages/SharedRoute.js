import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Navigation2 as RouteIcon } from 'lucide-react';
import MapView from '../components/MapView';
import toast from 'react-hot-toast';

const SharedRoute = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSharedRoute = async () => {
      try {
        const encodedData = searchParams.get('data');
        if (!encodedData) {
          setError('Invalid route link');
          return;
        }

        // Decode the route data
        const decodedData = JSON.parse(atob(encodedData));
        
        // Reconstruct the route by fetching pandal details
        const response = await fetch('/api/pandals');
        const pandalResponse = await response.json();
        
        if (!pandalResponse.success) {
          throw new Error('Failed to fetch pandal data');
        }

        const allPandals = pandalResponse.data;
        const routePandals = allPandals.filter(pandal => 
          decodedData.pandals.includes(pandal._id)
        );

        // Create route structure
        const reconstructedRoute = {
          route: routePandals.map((pandal, index) => ({
            id: pandal._id,
            name: pandal.name,
            address: pandal.address,
            latitude: pandal.location.latitude,
            longitude: pandal.location.longitude,
            step: index + 1
          })),
          totalDistance: decodedData.totalDistance,
          estimatedTime: decodedData.estimatedTime,
          routeType: decodedData.type,
          priority: decodedData.priority,
          area: decodedData.area
        };

        setRouteData(reconstructedRoute);
        toast.success('Shared route loaded successfully!');
        
      } catch (error) {
        console.error('Error loading shared route:', error);
        setError('Failed to load shared route');
        toast.error('Failed to load shared route');
      } finally {
        setLoading(false);
      }
    };

    loadSharedRoute();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vermillion-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading shared route...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Route Not Found</h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/route-planner')}
            className="bg-vermillion-500 text-white px-6 py-3 rounded-lg hover:bg-vermillion-600 transition-colors"
          >
            Create Your Own Route
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-neutral-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/route-planner')}
            className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6 text-vermillion-500" />
          </button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-vermillion-500">Shared Route</h1>
            <p className="text-neutral-600">Durga Puja pandal hopping route shared with you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Route Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">Route Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-vermillion-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-vermillion-500" />
                  </div>
                  <div>
                    <div className="font-medium">{routeData.route.length} Pandals</div>
                    <div className="text-sm text-neutral-600">
                      {routeData.area || 'Custom Selection'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <RouteIcon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">{routeData.totalDistance}</div>
                    <div className="text-sm text-neutral-600">Total Distance</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="font-medium">{routeData.estimatedTime}</div>
                    <div className="text-sm text-neutral-600">Estimated Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Steps */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Route Steps</h3>
              <div className="space-y-3">
                {routeData.route.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="bg-vermillion-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-800">{step.name}</div>
                      <div className="text-xs text-neutral-500">{step.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/route-planner')}
                className="w-full bg-vermillion-500 text-white py-3 px-4 rounded-lg hover:bg-vermillion-600 transition-colors font-semibold"
              >
                Create My Own Route
              </button>
              <button
                onClick={() => window.print()}
                className="w-full bg-neutral-200 text-neutral-800 py-3 px-4 rounded-lg hover:bg-neutral-300 transition-colors font-semibold"
              >
                Print Route
              </button>
            </div>
          </div>

          {/* Map View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-[600px]">
                <MapView 
                  pandals={routeData.route}
                  route={routeData.route}
                  center={routeData.route.length > 0 ? [
                    routeData.route[0].latitude, 
                    routeData.route[0].longitude
                  ] : [22.5726, 88.3639]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedRoute;