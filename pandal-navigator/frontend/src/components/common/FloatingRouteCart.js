import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaRoute, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { useRouteCart } from '../../contexts/RouteCartContext';

const FloatingRouteCart = () => {
  const navigate = useNavigate();
  const { 
    cartCount, 
    selectedPandals, 
    isCartVisible, 
    removePandalFromCart, 
    clearCart,
    hideCart 
  } = useRouteCart();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Animate cart when items are added
  useEffect(() => {
    if (cartCount > 0) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Auto-collapse expanded view on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && window.innerWidth <= 768) {
        const cartElement = document.getElementById('floating-cart');
        if (cartElement && !cartElement.contains(event.target)) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const handleCartClick = () => {
    if (window.innerWidth <= 768) {
      // On mobile, first expand to show details
      if (!isExpanded) {
        setIsExpanded(true);
      } else {
        // Second tap navigates to route planner
        navigate('/plan-route');
      }
    } else {
      // On desktop, directly navigate
      navigate('/plan-route');
    }
  };

  const handlePlanRoute = () => {
    navigate('/plan-route');
    setIsExpanded(false);
  };

  const handleRemovePandal = (e, pandalId) => {
    e.stopPropagation();
    removePandalFromCart(pandalId);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    clearCart();
    setIsExpanded(false);
  };

  if (!isCartVisible || cartCount === 0) {
    return null;
  }

  return (
    <>
      {/* Overlay for mobile expanded view */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Floating Cart Container */}
      <div
        id="floating-cart"
        className={`
          fixed z-50 transition-all duration-300 ease-in-out
          ${isExpanded 
            ? 'bottom-4 right-4 left-4 md:left-auto md:w-80 md:bottom-6 md:right-6' 
            : 'bottom-6 right-4 md:bottom-8 md:right-8'
          }
          ${showAnimation ? 'animate-bounce' : ''}
        `}
      >
        {/* Expanded Cart View */}
        {isExpanded && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 mb-4 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-orange-50 border-b border-orange-100">
              <div className="flex items-center space-x-2">
                <FaRoute className="text-orange-600 h-5 w-5" />
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  Your Route ({cartCount} pandals)
                </h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-orange-100 rounded-full transition-colors"
              >
                <FaTimes className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Pandal List */}
            <div className="max-h-48 overflow-y-auto">
              {selectedPandals.map((pandal, index) => (
                <div
                  key={pandal._id}
                  className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {index + 1}. {pandal.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {pandal.location?.address || pandal.areaCategory}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleRemovePandal(e, pandal._id)}
                    className="ml-2 p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
              <button
                onClick={handlePlanRoute}
                className="w-full bg-orange-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
              >
                <FaRoute className="h-4 w-4" />
                <span>Plan Optimized Route</span>
              </button>
              <button
                onClick={handleClearAll}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium text-sm hover:bg-gray-300 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Floating Cart Button */}
        <button
          onClick={handleCartClick}
          className={`
            relative bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 
            transition-all duration-200 active:scale-95 hover:shadow-xl
            ${isExpanded 
              ? 'w-14 h-14 md:w-16 md:h-16' 
              : 'w-16 h-16 md:w-18 md:h-18'
            }
            flex items-center justify-center
            touch-manipulation
          `}
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          {/* Cart Icon */}
          <div className="relative">
            <FaRoute className={`${isExpanded ? 'h-5 w-5' : 'h-6 w-6'} transition-all duration-200`} />
            
            {/* Count Badge */}
            <div className={`
              absolute -top-2 -right-2 bg-red-500 text-white rounded-full 
              min-w-[20px] h-5 flex items-center justify-center
              text-xs font-bold shadow-md
              ${cartCount > 99 ? 'px-1' : ''}
            `}>
              {cartCount > 99 ? '99+' : cartCount}
            </div>
          </div>

          {/* Pulse animation for new items */}
          {showAnimation && (
            <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-75" />
          )}
        </button>

        {/* Helper text for mobile */}
        {!isExpanded && window.innerWidth <= 768 && (
          <div className="absolute -top-12 right-0 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Tap to view • Double tap to plan
          </div>
        )}
      </div>
    </>
  );
};

export default FloatingRouteCart;