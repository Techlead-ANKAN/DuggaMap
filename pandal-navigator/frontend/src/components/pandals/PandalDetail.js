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
      setError('পান্ডেলের বিস্তারিত তথ্য লোড করতে সমস্যা হয়েছে');
      toast.error('পান্ডেলের তথ্য লোড করতে সমস্যা হয়েছে');
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
      toast.error('পছন্দের তালিকায় যোগ করতে লগইন করুন');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
        toast.success('পছন্দের তালিকা থেকে সরানো হয়েছে');
      } else {
        await api.post('/favorites', { pandalId: id });
        setIsFavorite(true);
        toast.success('পছন্দের তালিকায় যোগ করা হয়েছে');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error('সমস্যা হয়েছে, আবার চেষ্টা করুন');
    }
  };

  const shareHandler = async () => {
    const shareData = {
      title: pandal?.name,
      text: `${pandal?.name} - ${pandal?.area} এ অবস্থিত একটি সুন্দর দুর্গা পূজা পান্ডেল`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('লিংক কপি করা হয়েছে!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast.error('শেয়ার করতে সমস্যা হয়েছে');
    }
  };

  const getCrowdLevelInfo = (level) => {
    switch (level) {
      case 'low': 
        return { 
          text: 'শান্ত পরিবেশ', 
          color: 'text-green-600', 
          bg: 'bg-green-100',
          icon: '🕊️',
          description: 'আরামে ঘুরে দেখার জন্য আদর্শ' 
        };
      case 'medium': 
        return { 
          text: 'মাঝারি ভিড়', 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-100',
          icon: '👥',
          description: 'সাধারণ ভিড়, ভালো পরিবেশ' 
        };
      case 'high': 
        return { 
          text: 'অধিক ভিড়', 
          color: 'text-red-600', 
          bg: 'bg-red-100',
          icon: '🚶‍♂️🚶‍♀️',
          description: 'খুব জনপ্রিয়, ভিড় থাকতে পারে' 
        };
      default: 
        return { 
          text: 'তথ্য নেই', 
          color: 'text-gray-600', 
          bg: 'bg-gray-100',
          icon: '❓',
          description: 'ভিড়ের তথ্য পাওয়া যায়নি' 
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-festive flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🪔</div>
          <h2 className="font-festive text-2xl text-gold mb-2">তথ্য লোড হচ্ছে...</h2>
          <p className="text-vermillion">মা দুর্গার আশীর্বাদে অপেক্ষা করুন</p>
        </div>
      </div>
    );
  }

  if (error || !pandal) {
    return (
      <div className="min-h-screen bg-gradient-festive flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="font-festive text-2xl text-gray-700 mb-4">সমস্যা হয়েছে</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchPandalDetails}
              className="w-full btn-primary py-3 rounded-xl"
            >
              আবার চেষ্টা করুন
            </button>
            <button
              onClick={() => navigate('/pandals')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-300"
            >
              পান্ডেল তালিকায় ফিরে যান
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
            <span className="font-medium">পিছনে যান</span>
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
                  <div className="text-sm text-gray-600">রেটিং</div>
                </div>
                
                <div className="text-center p-3 bg-vermillion/10 rounded-xl">
                  <Users className="h-6 w-6 text-vermillion mx-auto mb-1" />
                  <div className="font-bold text-gray-800">{crowdInfo.text}</div>
                  <div className="text-sm text-gray-600">ভিড়ের অবস্থা</div>
                </div>
                
                <div className="text-center p-3 bg-marigold/10 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                  <div className="font-bold text-gray-800">খোলা</div>
                  <div className="text-sm text-gray-600">এখন</div>
                </div>
                
                <div className="text-center p-3 bg-green-100 rounded-xl">
                  <Gift className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="font-bold text-gray-800">বিনামূল্যে</div>
                  <div className="text-sm text-gray-600">প্রবেশ</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2">
                  <Navigation className="h-5 w-5" />
                  <span>দিকনির্দেশনা</span>
                </button>
                
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>ফোন করুন</span>
                </button>
                
                <button className="border-2 border-gold text-gold px-6 py-3 rounded-xl hover:bg-gold hover:text-white transition-colors duration-300 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>রুটে যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="font-festive text-2xl font-bold text-gray-800 mb-4">বিবরণ</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className={showFullDescription ? '' : 'line-clamp-4'}>
                  {pandal.description || `${pandal.name} একটি অসাধারণ দুর্গা পূজা পান্ডেল যেখানে মা দুর্গার মহিমা ও শক্তি ফুটে উঠেছে। এই পান্ডেলে ঐতিহ্যবাহী কারুকাজ ও আধুনিক শিল্পের এক অপূর্ব মেলবন্ধন দেখা যায়। প্রতি বছর হাজার হাজার ভক্ত এখানে মা দুর্গার আশীর্বাদ নিতে আসেন।`}
                </p>
                {pandal.description && pandal.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-vermillion hover:text-red-700 font-medium mt-2"
                  >
                    {showFullDescription ? 'কম দেখুন' : 'আরো পড়ুন'}
                  </button>
                )}
              </div>
            </div>

            {/* Special Features */}
            {pandal.specialFeatures && pandal.specialFeatures.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="font-festive text-2xl font-bold text-gray-800 mb-4">বিশেষত্ব</h2>
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
                <h2 className="font-festive text-2xl font-bold text-gray-800">মতামত</h2>
                <button className="text-vermillion hover:text-red-700 font-medium flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>মতামত লিখুন</span>
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
                    <span className="text-sm text-gray-500">• রমেশ বাবু</span>
                  </div>
                  <p className="text-gray-700">অসাধারণ সুন্দর পান্ডেল! মা দুর্গার মূর্তি দেখে মুগ্ধ হয়ে গেছি। সবার যাওয়া উচিত।</p>
                </div>

                <div className="border-l-4 border-gold pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-gold">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-500">• সুমিত্রা দেবী</span>
                  </div>
                  <p className="text-gray-700">খুব সুন্দর সাজানো। তবে একটু বেশি ভিড় ছিল। সকালে গেলে ভালো হবে।</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Timing & Contact */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-festive text-xl font-bold text-gray-800 mb-4">তথ্য</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gold" />
                  <div>
                    <div className="font-medium text-gray-800">সময়</div>
                    <div className="text-sm text-gray-600">
                      {pandal.timing || 'সকাল ৬টা - রাত ১২টা'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-vermillion mt-1" />
                  <div>
                    <div className="font-medium text-gray-800">ঠিকানা</div>
                    <div className="text-sm text-gray-600">
                      {pandal.address || `${pandal.area}, কলকাতা`}
                    </div>
                  </div>
                </div>

                {pandal.contact && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-800">ফোন</div>
                      <div className="text-sm text-gray-600">{pandal.contact}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Crowd Level Details */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-festive text-xl font-bold text-gray-800 mb-4">ভিড়ের তথ্য</h3>
              
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
                <p>💡 <strong>টিপস:</strong> সকাল ৭-৯টা এবং বিকাল ৪-৬টায় তুলনামূলক কম ভিড় থাকে।</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-festive text-xl font-bold text-gray-800 mb-4">দ্রুত ক্রিয়া</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>ছবি দেখুন</span>
                </button>
                
                <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                  <ExternalLink className="h-5 w-5" />
                  <span>ম্যাপে দেখুন</span>
                </button>
                
                <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center space-x-2">
                  <Flag className="h-5 w-5" />
                  <span>রিপোর্ট করুন</span>
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
            এখনই যান
          </button>
          <button className="flex-1 border-2 border-gold text-gold py-3 rounded-xl hover:bg-gold hover:text-white transition-colors duration-300 font-medium">
            রুটে যোগ করুন
          </button>
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-20"></div>
    </div>
  );
};

export default PandalDetail;