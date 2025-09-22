import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaRoute,
  FaCheck
} from 'react-icons/fa';
import { useRouteCart } from '../../contexts/RouteCartContext';

const PandalCard = ({ pandal, showActions = true, compact = false }) => {
  const { addPandalToCart, isPandalInCart } = useRouteCart();
  const isInCart = isPandalInCart(pandal._id);

  const handleAddToRoute = (e) => {
    e.preventDefault();
    addPandalToCart(pandal);
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
        <div className="flex items-start space-x-3">
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {pandal.name}
                </h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                  {pandal.address || pandal.area}
                </p>
                {/* Coordinates */}
                <div className="text-xs text-gray-500 mt-1">
                  <span>Lat: {pandal.location?.latitude?.toFixed(6) || 'N/A'}</span>
                  <span className="mx-2">•</span>
                  <span>Lng: {pandal.location?.longitude?.toFixed(6) || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Content */}
      <div className="p-6">
        {/* Pandal Name */}
        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
          {pandal.name}
        </h3>

        {/* Address */}
        <div className="flex items-start text-gray-600 mb-4">
          <FaMapMarkerAlt className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{pandal.address || pandal.area || 'Address not available'}</span>
        </div>

        {/* Coordinates */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Latitude:</span>
              <span className="font-mono">{pandal.location?.latitude?.toFixed(6) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Longitude:</span>
              <span className="font-mono">{pandal.location?.longitude?.toFixed(6) || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex justify-center">
            <button
              onClick={handleAddToRoute}
              disabled={isInCart}
              className={`
                py-3 px-6 rounded-xl font-medium inline-flex items-center space-x-2 
                transition-all duration-200 active:scale-95
                ${isInCart 
                  ? 'bg-green-100 text-green-700 border-2 border-green-200 cursor-default' 
                  : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg'
                }
                min-h-[44px] min-w-[120px] touch-manipulation
              `}
              title={isInCart ? 'Already added to route' : 'Add to route'}
            >
              {isInCart ? (
                <>
                  <FaCheck className="h-4 w-4" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <FaRoute className="h-4 w-4" />
                  <span>Add to Route</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PandalCard;