import React, { useState } from 'react';
import { Share2, Link, Facebook, Twitter, MessageCircle, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const RouteSharing = ({ optimizedRoute, routeType, priority, area }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Don't render if no route is available
  if (!optimizedRoute || !optimizedRoute.route) {
    return null;
  }

  // Generate shareable URL with route data
  const generateShareableUrl = () => {
    const baseUrl = window.location.origin;
    const routeData = {
      type: routeType,
      priority,
      area,
      pandals: optimizedRoute.route.map(stop => stop.id).filter(id => id !== 'start' && id !== 'end'),
      totalDistance: optimizedRoute.totalDistance,
      estimatedTime: optimizedRoute.estimatedTime
    };
    
    try {
      const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(routeData))));
      return `${baseUrl}/shared-route?data=${encodedData}`;
    } catch (error) {
      console.error('Error encoding route data:', error);
      return `${baseUrl}/shared-route`;
    }
  };

  const shareableUrl = generateShareableUrl();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      toast.success('Route link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareVia = (platform) => {
    const routeTitle = `Check out my Durga Puja route: ${optimizedRoute.totalDistance} in ${optimizedRoute.estimatedTime}`;
    const text = `${routeTitle} - ${optimizedRoute.route.length} pandals to visit!`;
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareableUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareableUrl}`)}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  const generateRouteImage = async () => {
    // This would capture the map as an image for sharing
    toast.info('Route image generation coming soon!');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
      >
        <Share2 className="h-4 w-4" />
        <span>Share Route</span>
      </button>

      {showShareMenu && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-neutral-200 p-4 min-w-80 z-50">
          <h3 className="font-semibold text-neutral-800 mb-3">Share Your Route</h3>
          
          {/* Route Summary */}
          <div className="bg-neutral-50 rounded-lg p-3 mb-4">
            <div className="text-sm text-neutral-600">
              <div className="font-medium text-neutral-800">{optimizedRoute.route.length} Pandals</div>
              <div>Distance: {optimizedRoute.totalDistance}</div>
              <div>Time: {optimizedRoute.estimatedTime}</div>
              <div>Area: {area || 'Custom Selection'}</div>
            </div>
          </div>

          {/* Copy Link */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Share Link</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareableUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm bg-neutral-50"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-700 mb-2">Share on:</div>
            
            <button
              onClick={() => shareVia('whatsapp')}
              className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-green-50 rounded-lg transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-green-600" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => shareVia('facebook')}
              className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span>Facebook</span>
            </button>

            <button
              onClick={() => shareVia('twitter')}
              className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Twitter className="h-5 w-5 text-blue-400" />
              <span>Twitter</span>
            </button>
          </div>

          {/* Additional Options */}
          <div className="border-t border-neutral-200 mt-4 pt-4">
            <button
              onClick={generateRouteImage}
              className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-lg transition-colors text-sm"
            >
              📸 Generate Route Image
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowShareMenu(false)}
            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Backdrop */}
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default RouteSharing;