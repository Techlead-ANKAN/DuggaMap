import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaHeart, 
  FaRegHeart, 
  FaClock, 
  FaCalendarAlt,
  FaImage,
  FaRoute
} from 'react-icons/fa';
import { useFavorites } from '../../hooks/useFavorites';
import toast from 'react-hot-toast';

const PandalCard = ({ pandal, showActions = true, compact = false }) => {
  const { user, isSignedIn } = useUser();
  const { favorites, addToFavorites, removeFromFavorites, isLoading } = useFavorites();
  const [imageError, setImageError] = useState(false);

  const isFavorite = favorites?.some(fav => fav.itemId === pandal._id && fav.itemType === 'Pandal');

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error('Please sign in to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(pandal._id, 'Pandal');
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(pandal._id, 'Pandal');
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const formatTimings = (timings) => {
    if (!timings) return 'Timings not available';
    if (typeof timings === 'string') return timings;
    
    const { openTime, closeTime } = timings;
    if (openTime && closeTime) {
      return `${openTime} - ${closeTime}`;
    }
    return 'Timings not available';
  };

  const formatDates = (pandal) => {
    if (pandal.startDate && pandal.endDate) {
      const start = new Date(pandal.startDate).toLocaleDateString();
      const end = new Date(pandal.endDate).toLocaleDateString();
      return `${start} - ${end}`;
    }
    return 'Dates not available';
  };

  if (compact) {
    return (
      <Link to={`/pandals/${pandal._id}`}>
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer">
          <div className="flex items-start space-x-3">
            {/* Image */}
            <div className="flex-shrink-0">
              {pandal.images && pandal.images.length > 0 && !imageError ? (
                <img
                  src={pandal.images[0]}
                  alt={pandal.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center">
                  <FaImage className="h-6 w-6 text-orange-600" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {pandal.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                    {pandal.area}
                  </p>
                </div>
                
                {showActions && (
                  <button
                    onClick={handleFavoriteToggle}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {isFavorite ? (
                      <FaHeart className="h-4 w-4 text-red-500" />
                    ) : (
                      <FaRegHeart className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <FaStar className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600 ml-1">
                    {pandal.averageRating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <span className="text-gray-300 mx-2">•</span>
                <span className="text-sm text-gray-600">
                  {pandal.reviewCount || 0} reviews
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative h-48">
        {pandal.images && pandal.images.length > 0 && !imageError ? (
          <img
            src={pandal.images[0]}
            alt={pandal.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
            <FaImage className="h-12 w-12 text-orange-600" />
          </div>
        )}
        
        {/* Favorite Button */}
        {showActions && (
          <button
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md transition-all"
          >
            {isFavorite ? (
              <FaHeart className="h-5 w-5 text-red-500" />
            ) : (
              <FaRegHeart className="h-5 w-5 text-gray-600" />
            )}
          </button>
        )}

        {/* Category Badge */}
        {pandal.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {pandal.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            {pandal.name}
          </h3>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <FaMapMarkerAlt className="h-4 w-4 mr-2" />
          <span className="text-sm">{pandal.area}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pandal.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaClock className="h-4 w-4 mr-2" />
            <span>{formatTimings(pandal.timings)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendarAlt className="h-4 w-4 mr-2" />
            <span>{formatDates(pandal)}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
              <FaStar className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-gray-900">
                {pandal.averageRating?.toFixed(1) || 'N/A'}
              </span>
            </div>
            <span className="text-gray-500 text-sm ml-2">
              ({pandal.reviewCount || 0} reviews)
            </span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-3">
            <Link
              to={`/pandals/${pandal._id}`}
              className="flex-1 bg-orange-600 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              View Details
            </Link>
            
            <Link
              to={`/plan-route?pandal=${pandal._id}`}
              className="flex-shrink-0 border border-orange-600 text-orange-600 p-2 rounded-lg hover:bg-orange-50 transition-colors"
              title="Add to route"
            >
              <FaRoute className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PandalCard;