import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons
const createCustomIcon = (color = 'red', type = 'pandal') => {
  const iconHtml = type === 'pandal' 
    ? `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`
    : `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 2px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`;
  
  return L.divIcon({
    html: iconHtml,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: 'custom-marker'
  });
};

const Map = ({ 
  pandals = [], 
  foodplaces = [], 
  routes = [], 
  center = [22.5726, 88.3639], // Kolkata coordinates
  zoom = 12,
  height = '400px',
  onPandalClick,
  onEateryClick,
  showControls = true
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayersRef = useRef([]);
  const [activeLayer, setActiveLayer] = useState('all');

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add pandal markers
    if (activeLayer === 'all' || activeLayer === 'pandals') {
      pandals.forEach(pandal => {
        if (pandal.location?.latitude && pandal.location?.longitude) {
          const lat = pandal.location.latitude;
          const lng = pandal.location.longitude;
          const marker = L.marker([lat, lng], {
            icon: createCustomIcon('#f97316', 'pandal')
          }).addTo(mapInstanceRef.current);

          marker.bindPopup(`
            <div class="p-3 min-w-[200px]">
              <h3 class="font-semibold text-gray-900 mb-2">${pandal.name}</h3>
              <p class="text-sm text-gray-600 mb-2">${pandal.areaCategory || ''}</p>
              <p class="text-sm text-gray-600 mb-3">${pandal.description?.substring(0, 100)}...</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-yellow-500">★</span>
                  <span class="text-sm ml-1">${pandal.averageRating || 'N/A'}</span>
                </div>
                <button 
                  onclick="window.handlePandalClick('${pandal._id}')"
                  class="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                >
                  View Details
                </button>
              </div>
            </div>
          `);

          markersRef.current.push(marker);
        }
      });
    }

    // Add eatery markers
    if (activeLayer === 'all' || activeLayer === 'foodplaces') {
      foodplaces.forEach(eatery => {
        if (eatery.location?.latitude && eatery.location?.longitude) {
          const lat = eatery.location.latitude;
          const lng = eatery.location.longitude;
          const marker = L.marker([lat, lng], {
            icon: createCustomIcon('#10b981', 'eatery')
          }).addTo(mapInstanceRef.current);

          marker.bindPopup(`
            <div class="p-3 min-w-[200px]">
              <h3 class="font-semibold text-gray-900 mb-2">${eatery.name}</h3>
              <p class="text-sm text-gray-600 mb-2">${eatery.location?.address || ''}</p>
              <p class="text-sm text-gray-600 mb-2">Cuisine: ${eatery.cuisine || 'Various'}</p>
              <p class="text-sm text-gray-600 mb-3">Price: ${eatery.priceRange || 'N/A'}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-yellow-500">★</span>
                  <span class="text-sm ml-1">${eatery.averageRating || 'N/A'}</span>
                </div>
                <button 
                  onclick="window.handleEateryClick('${eatery._id}')"
                  class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  View Details
                </button>
              </div>
            </div>
          `);

          markersRef.current.push(marker);
        }
      });
    }
  }, [pandals, foodplaces, activeLayer]);

  // Update routes when data changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing routes
    routeLayersRef.current.forEach(layer => {
      mapInstanceRef.current.removeLayer(layer);
    });
    routeLayersRef.current = [];

    // Add route lines
    if (activeLayer === 'all' || activeLayer === 'routes') {
      routes.forEach((route, index) => {
        if (route.waypoints && route.waypoints.length > 1) {
          const latlngs = route.waypoints.map(point => [
            point.coordinates[1], 
            point.coordinates[0]
          ]);

          const polyline = L.polyline(latlngs, {
            color: index === 0 ? '#3b82f6' : '#8b5cf6',
            weight: 4,
            opacity: 0.7
          }).addTo(mapInstanceRef.current);

          polyline.bindPopup(`
            <div class="p-3">
              <h3 class="font-semibold text-gray-900 mb-2">${route.name || 'Route'}</h3>
              <p class="text-sm text-gray-600 mb-2">Distance: ${route.totalDistance || 'N/A'}</p>
              <p class="text-sm text-gray-600">Duration: ${route.totalDuration || 'N/A'}</p>
            </div>
          `);

          routeLayersRef.current.push(polyline);
        }
      });
    }
  }, [routes, activeLayer]);

  // Set up global click handlers
  useEffect(() => {
    window.handlePandalClick = (id) => {
      if (onPandalClick) {
        onPandalClick(id);
      }
    };

    window.handleEateryClick = (id) => {
      if (onEateryClick) {
        onEateryClick(id);
      }
    };

    return () => {
      delete window.handlePandalClick;
      delete window.handleEateryClick;
    };
  }, [onPandalClick, onEateryClick]);

  // Fit map to show all markers
  useEffect(() => {
    if (!mapInstanceRef.current || markersRef.current.length === 0) return;

    if (markersRef.current.length === 1) {
      const marker = markersRef.current[0];
      mapInstanceRef.current.setView(marker.getLatLng(), 15);
    } else if (markersRef.current.length > 1) {
      const group = new L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [markersRef.current.length]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg overflow-hidden shadow-md"
      />
      
      {showControls && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 z-[1000]">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-3 py-1 text-sm rounded ${
                activeLayer === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveLayer('pandals')}
              className={`px-3 py-1 text-sm rounded ${
                activeLayer === 'pandals' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pandals
            </button>
            <button
              onClick={() => setActiveLayer('foodplaces')}
              className={`px-3 py-1 text-sm rounded ${
                activeLayer === 'foodplaces' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Foodplaces
            </button>
            {routes.length > 0 && (
              <button
                onClick={() => setActiveLayer('routes')}
                className={`px-3 py-1 text-sm rounded ${
                  activeLayer === 'routes' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Routes
              </button>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-[1000]">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-600 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Pandals</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
            <span className="text-xs text-gray-600">Eateries</span>
          </div>
          {routes.length > 0 && (
            <div className="flex items-center">
              <div className="w-4 h-1 bg-blue-600 mr-2"></div>
              <span className="text-xs text-gray-600">Routes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;