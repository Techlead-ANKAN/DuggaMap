import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { 
  Star, Heart, MapPin, Clock, Phone, Share2, Users, 
  Camera, Navigation, Calendar, Award, ArrowLeft, 
  ExternalLink, MessageCircle, Flag, Gift 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const PandalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [pandal, setPandal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    fetchPandalDetails();
    if (user) {
      checkIfFavorite();
    }
  }, [id, user]);

  const fetchPandalDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/pandals/${id}`);
      setPandal(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching pandal details:', err);
  setError('Error loading pandal details');
  toast.error('Error loading pandal details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const response = await api.get('/favorites');
      const favoriteIds = response.data.map(fav => fav.pandalId);
      setIsFavorite(favoriteIds.includes(id));
    } catch (err) {
      console.error('Error checking favorites:', err);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
  toast.error('Please sign in to add to favorites');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
  setIsFavorite(false);
  toast.success('Removed from favorites');
      } else {
        await api.post('/favorites', { pandalId: id });
  setIsFavorite(true);
  toast.success('Added to favorites');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
  toast.error('Something went wrong, please try again');
    }
  };

  const shareHandler = async () => {
    const shareData = {
      title: pandal?.name,
  text: `${pandal?.name} - a beautiful Durga Puja pandal located in ${pandal?.area}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
  await navigator.clipboard.writeText(window.location.href);
  toast.success('Link copied!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
  toast.error('Error sharing');
    }
  };

  const getCrowdLevelInfo = (level) => {
    switch (level) {
      case 'low': 
        return { 
          text: 'Calm', 
          color: 'text-green-600', 
          bg: 'bg-green-100',
          icon: '🕊️',
          description: 'Ideal for a relaxed visit' 
        };
      case 'medium': 
        return { 
          text: 'Moderate', 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-100',
          icon: '👥',
          description: 'Moderate crowd, generally pleasant' 
        };
      case 'high': 
        return { 
          text: 'Crowded', 
          color: 'text-red-600', 
          bg: 'bg-red-100',
          icon: '🚶‍♂️🚶‍♀️',
          description: 'Very popular, expect crowds' 
        };
      default: 
        return { 
          text: 'Unknown', 
          color: 'text-gray-600', 
          bg: 'bg-gray-100',
          icon: '❓',
          description: 'No crowd data available' 
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-festive flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🪔</div>
          <h2 className="font-festive text-2xl text-gold mb-2">Loading information...</h2>
          <p className="text-vermillion">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error || !pandal) {
    return (
      <div className="min-h-screen bg-gradient-festive flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="font-festive text-2xl text-gray-700 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchPandalDetails}
              className="w-full btn-primary py-3 rounded-xl"
            >
              Try again
            </button>
            <button
              onClick={() => navigate('/pandals')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-300"
            >
              Back to pandal list
            </button>
          </div>
        </div>
      </div>
    );
  }

  const crowdInfo = getCrowdLevelInfo(pandal.crowdLevel);
  const images = pandal.images || [pandal.image] || ['/api/placeholder/800/600'];

  return (
    <div className="min-h-screen bg-gradient-festive">
      {/* Back Button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-700 hover:text-vermillion transition-colors duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={pandal.name}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-gold' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={toggleFavorite}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-300"
          >
            <Heart
              className={`h-6 w-6 transition-colors duration-300 ${
                isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
              }`}
            />
          </button>
          
          <button
            onClick={shareHandler}
            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-300"
          >
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-gold text-midnight-blue px-4 py-2 rounded-full font-bold flex items-center space-x-2">
          <Star className="h-5 w-5 fill-current" />
          <span>{pandal.rating || '4.5'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h1 className="font-festive text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {pandal.name}
                </h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2 text-vermillion" />
                <span className="text-lg">{pandal.area}</span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gold/10 rounded-xl">
                  <Star className="h-6 w-6 text-gold mx-auto mb-1" />
                  <div className="font-bold text-gray-800">{pandal.rating || '4.5'}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                
                <div className="text-center p-3 bg-vermillion/10 rounded-xl">
                  <Users className="h-6 w-6 text-vermillion mx-auto mb-1" />
                  <div className="font-bold text-gray-800">{crowdInfo.text}</div>
                  <div className="text-sm text-gray-600">Crowd Level</div>
                </div>
                
                <div className="text-center p-3 bg-marigold/10 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                  <div className="font-bold text-gray-800">Open</div>
                  <div className="text-sm text-gray-600">Now</div>
                </div>
                
                <div className="text-center p-3 bg-green-100 rounded-xl">
                  <Gift className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="font-bold text-gray-800">Free</div>
                  <div className="text-sm text-gray-600">Entry</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2">
                  <Navigation className="h-5 w-5" />
                  <span>Directions</span>
                </button>
                
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Call</span>
                </button>
                
                <button className="border-2 border-gold text-gold px-6 py-3 rounded-xl hover:bg-gold hover:text-white transition-colors duration-300 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Add to Route</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-festive text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className={showFullDescription ? '' : 'line-clamp-4'}>
                  {pandal.description || `${pandal.name} is a beautiful Durga Puja pandal showcasing traditional craftsmanship and devotion. This pandal blends traditional artistry with contemporary installations. Every year thousands of devotees visit to seek blessings.`}
                </p>
                    {pandal.description && pandal.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-vermillion hover:text-red-700 font-medium mt-2"
                  >
                    {showFullDescription ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            </div>

            {/* Special Features */}
            {pandal.specialFeatures && pandal.specialFeatures.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="font-festive text-2xl font-bold text-gray-800 mb-4">Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pandal.specialFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gold/10 rounded-xl">
                      <Award className="h-5 w-5 text-gold" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-festive text-2xl font-bold text-gray-800">Reviews</h2>
                <button className="text-vermillion hover:text-red-700 font-medium flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Write a review</span>
                </button>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                <div className="border-l-4 border-gold pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">• Ramesh Babu</span>
                  </div>
                  <p className="text-gray-700">Wonderful pandal! I was mesmerized by the idol. A must-visit for everyone.</p>
                </div>

                <div className="border-l-4 border-gold pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-gold">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-500">• Sumitra Devi</span>
                  </div>
                  <p className="text-gray-700">Beautifully decorated. It was a bit crowded though. Morning visits are recommended.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Timing & Contact */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-festive text-xl font-bold text-gray-800 mb-4">Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gold" />
                  <div>
                    <div className="font-medium text-gray-800">Timing</div>
                    <div className="text-sm text-gray-600">
                      {pandal.timing || '6:00 AM - 12:00 AM'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-vermillion mt-1" />
                  <div>
                    <div className="font-medium text-gray-800">Address</div>
                    <div className="text-sm text-gray-600">
                      {pandal.address || `${pandal.area}, Kolkata`}
                    </div>
                  </div>
                </div>

                {pandal.contact && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-800">Phone</div>
                      <div className="text-sm text-gray-600">{pandal.contact}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Crowd Level Details */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-festive text-xl font-bold text-gray-800 mb-4">Crowd Info</h3>
              
              <div className={`p-4 ${crowdInfo.bg} rounded-xl`}>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{crowdInfo.icon}</span>
                  <span className={`font-medium ${crowdInfo.color}`}>
                    {crowdInfo.text}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{crowdInfo.description}</p>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p>💡 <strong>Tips:</strong> Mornings (7-9 AM) and late afternoons (4-6 PM) tend to be less crowded.</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-festive text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>View Photos</span>
                </button>
                
                <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                  <ExternalLink className="h-5 w-5" />
                  <span>View on Map</span>
                </button>
                
                <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center space-x-2">
                  <Flag className="h-5 w-5" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gold/20 p-4 z-50">
        <div className="max-w-7xl mx-auto flex space-x-4">
          <button className="flex-1 btn-primary py-3 rounded-xl font-medium">
            Go now
          </button>
          <button className="flex-1 border-2 border-gold text-gold py-3 rounded-xl hover:bg-gold hover:text-white transition-colors duration-300 font-medium">
            Add to Route
          </button>
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-20"></div>
    </div>
  );
};

export default PandalDetail;