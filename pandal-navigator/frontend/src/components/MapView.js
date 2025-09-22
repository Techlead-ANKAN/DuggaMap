import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Navigation2 as RouteIcon, 
  Users, 
  Star,
  Navigation2,
  Zap,
  AlertCircle,
  Phone,
  Camera,
  Share2
} from 'lucide-react';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icon for pandals
const pandalIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#DC2626" stroke="#fff" stroke-width="2"/>
      <path d="M16 8L20 12H18V20H14V12H12L16 8Z" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Current location icon
const currentLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#fff" stroke-width="4"/>
      <circle cx="12" cy="12" r="3" fill="#fff"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Route waypoint icons - Dynamic function to create numbered waypoints
const createWaypointIcon = (number) => {
  return new L.Icon({
    iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#DC2626" stroke="#FBBF24" stroke-width="3"/>
        <text x="16" y="21" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${number}</text>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Navigation Component
const NavigationControl = ({ currentLocation, destination, onNavigationStart, isNavigating }) => {
  const map = useMap();

  const startNavigation = () => {
    if (currentLocation && destination) {
      onNavigationStart();
      
      // Center map on current location
      map.setView([currentLocation.lat, currentLocation.lng], 16);
      
      // Create routing control
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(currentLocation.lat, currentLocation.lng),
          L.latLng(destination.lat, destination.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: () => null, // We'll use our custom markers
        lineOptions: {
          styles: [{ color: '#3B82F6', weight: 6, opacity: 0.8 }]
        },
        show: false, // Hide the instruction panel
      }).addTo(map);

      return routingControl;
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button
        onClick={startNavigation}
        disabled={!currentLocation || !destination}
        className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-200 ${
          isNavigating 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400'
        }`}
      >
        <Navigation2 className="h-5 w-5" />
        <span className="font-semibold">
          {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
        </span>
      </button>
    </div>
  );
};

// Location Tracker Component
const LocationTracker = ({ onLocationUpdate, isTracking }) => {
  const map = useMap();
  const watchId = useRef(null);

  useEffect(() => {
    if (isTracking && navigator.geolocation) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            speed: position.coords.speed
          };
          onLocationUpdate(newLocation);
        },
        (error) => console.error('Location error:', error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000
        }
      );
    }

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [isTracking, onLocationUpdate]);

  return null;
};

// Pandal Popup Component
const PandalPopup = ({ pandal, onNavigate, onAddToRoute, isInRoute }) => {
  return (
    <div className="min-w-[280px] max-w-[320px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-vermillion-500 to-vermillion-600 text-white p-3 rounded-t-lg">
        <h3 className="font-bold text-lg">{pandal.name}</h3>
        <div className="flex items-center space-x-1 mt-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">4.5 • Very Popular</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-4">
        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{pandal.address}</span>
          </div>

          {/* Live Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-gray-700">Moderate crowd</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-gray-700">~15 min wait</span>
            </div>
          </div>

          {/* Theme Info */}
          <div className="bg-gold-50 p-2 rounded border-l-4 border-gold-500">
            <p className="text-sm text-gray-700">
              <strong>Theme:</strong> Traditional Bengali Culture
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => onNavigate(pandal)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
            >
              <Navigation className="h-4 w-4" />
              <span>Navigate</span>
            </button>
            
            <button
              onClick={() => onAddToRoute(pandal)}
              disabled={isInRoute}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
                isInRoute 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-vermillion-500 hover:bg-vermillion-600 text-white'
              }`}
            >
              <RouteIcon className="h-4 w-4" />
              <span>{isInRoute ? 'In Route' : 'Add to Route'}</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-around pt-2 border-t border-gray-200">
            <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-500 transition-colors">
              <Camera className="h-4 w-4" />
              <span className="text-xs">Photos</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-500 transition-colors">
              <Phone className="h-4 w-4" />
              <span className="text-xs">Call</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-500 transition-colors">
              <Share2 className="h-4 w-4" />
              <span className="text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main MapView Component
const MapView = ({ 
  pandals = [], 
  optimizedRoute = null, 
  onRouteUpdate,
  className = "",
  initialCenter = [22.5726, 88.3639], // Kolkata center
  initialZoom = 12 
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [routePolyline, setRoutePolyline] = useState([]);

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setCurrentLocation(location);
          setIsTracking(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use Kolkata as fallback
          setCurrentLocation({ lat: 22.5726, lng: 88.3639, accuracy: 1000 });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Create route polyline from optimized route
  useEffect(() => {
    if (optimizedRoute && optimizedRoute.route) {
      const polylinePoints = optimizedRoute.route.map(point => [
        point.latitude,
        point.longitude
      ]);
      setRoutePolyline(polylinePoints);
    }
  }, [optimizedRoute]);

  const handleNavigateToLocation = (location) => {
    setSelectedDestination({
      lat: location.latitude,
      lng: location.longitude,
      name: location.name
    });
  };

  const handleAddToRoute = (pandal) => {
    if (onRouteUpdate) {
      onRouteUpdate(pandal);
    }
  };

  const handleNavigationStart = () => {
    setIsNavigating(!isNavigating);
    if (!isNavigating) {
      setIsTracking(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        className="h-full w-full rounded-lg shadow-lg"
        zoomControl={false}
      >
        {/* Base Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Location Tracker */}
        <LocationTracker 
          onLocationUpdate={setCurrentLocation} 
          isTracking={isTracking} 
        />

        {/* Navigation Control */}
        <NavigationControl
          currentLocation={currentLocation}
          destination={selectedDestination}
          onNavigationStart={handleNavigationStart}
          isNavigating={isNavigating}
        />

        {/* Current Location Marker */}
        {currentLocation && (
          <Marker 
            position={[currentLocation.lat, currentLocation.lng]} 
            icon={currentLocationIcon}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-blue-600">Your Location</div>
                <div className="text-sm text-gray-600">
                  Accuracy: ±{Math.round(currentLocation.accuracy)}m
                </div>
                {currentLocation.speed && (
                  <div className="text-sm text-gray-600">
                    Speed: {Math.round(currentLocation.speed * 3.6)} km/h
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Pandal Markers */}
        {pandals.map((pandal) => (
          <Marker
            key={pandal._id}
            position={[pandal.location.latitude, pandal.location.longitude]}
            icon={pandalIcon}
          >
            <Popup className="custom-popup" maxWidth={350}>
              <PandalPopup
                pandal={pandal}
                onNavigate={handleNavigateToLocation}
                onAddToRoute={handleAddToRoute}
                isInRoute={optimizedRoute?.route?.some(r => r.id === pandal._id)}
              />
            </Popup>
          </Marker>
        ))}

        {/* Enhanced Route Waypoint Markers */}
        {optimizedRoute && optimizedRoute.route && optimizedRoute.route.map((point, index) => (
          <Marker
            key={`route-${point.id}-${index}`}
            position={[point.latitude, point.longitude]}
            icon={createWaypointIcon(index + 1)}
          >
            <Popup>
              <div className="text-center">
                <div className="font-bold text-red-600 text-lg mb-2">
                  Stop {index + 1}
                </div>
                <div className="font-semibold text-gray-800">
                  {point.name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {point.area}
                </div>
                {point.distance && (
                  <div className="text-sm text-blue-600 mt-2 font-medium">
                    Next: {point.distance}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Enhanced Route Polyline */}
        {routePolyline.length > 0 && (
          <>
            {/* Route shadow/outline */}
            <Polyline
              positions={routePolyline}
              pathOptions={{
                color: '#1F2937',
                weight: 10,
                opacity: 0.3,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
            {/* Main route line */}
            <Polyline
              positions={routePolyline}
              pathOptions={{
                color: '#DC2626',
                weight: 6,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: '10, 5',
                animation: true
              }}
            />
            {/* Route highlights */}
            <Polyline
              positions={routePolyline}
              pathOptions={{
                color: '#FBBF24',
                weight: 3,
                opacity: 0.7,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Map Controls Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] space-y-2">
        {/* Location Toggle */}
        <button
          onClick={() => setIsTracking(!isTracking)}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
            isTracking 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Navigation className="h-5 w-5" />
        </button>

        {/* Current Location Button */}
        {currentLocation && (
          <button
            onClick={() => {
              // Center map on current location - we'll need to pass this to map
              // For now, this is a placeholder for the functionality
            }}
            className="p-3 bg-white text-gray-700 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200"
          >
            <Zap className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Route Info Panel */}
      {optimizedRoute && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center space-x-2 mb-3">
            <RouteIcon className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Active Route</h3>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Distance:</span>
              <span className="font-medium">{optimizedRoute.totalDistance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Time:</span>
              <span className="font-medium">{optimizedRoute.estimatedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stops:</span>
              <span className="font-medium">{optimizedRoute.route?.length || 0}</span>
            </div>
          </div>

          {isNavigating && (
            <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-700 font-medium">
                  Navigation Active
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapView;