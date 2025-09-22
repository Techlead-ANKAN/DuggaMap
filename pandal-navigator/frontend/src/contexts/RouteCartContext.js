import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  selectedPandals: [],
  isVisible: false,
  lastAddedPandal: null
};

// Action types
const CART_ACTIONS = {
  ADD_PANDAL: 'ADD_PANDAL',
  REMOVE_PANDAL: 'REMOVE_PANDAL',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
  HIDE_CART: 'HIDE_CART',
  SHOW_CART: 'SHOW_CART'
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_PANDAL:
      const existingPandal = state.selectedPandals.find(p => p._id === action.payload._id);
      if (existingPandal) {
        return state; // Don't add duplicate
      }
      
      const newState = {
        ...state,
        selectedPandals: [...state.selectedPandals, action.payload],
        isVisible: true,
        lastAddedPandal: action.payload
      };
      
      // Save to localStorage
      localStorage.setItem('routeCart', JSON.stringify(newState.selectedPandals));
      return newState;

    case CART_ACTIONS.REMOVE_PANDAL:
      const filteredPandals = state.selectedPandals.filter(p => p._id !== action.payload);
      const updatedState = {
        ...state,
        selectedPandals: filteredPandals,
        isVisible: filteredPandals.length > 0,
        lastAddedPandal: null
      };
      
      // Save to localStorage
      localStorage.setItem('routeCart', JSON.stringify(updatedState.selectedPandals));
      return updatedState;

    case CART_ACTIONS.CLEAR_CART:
      localStorage.removeItem('routeCart');
      return {
        ...initialState,
        isVisible: false
      };

    case CART_ACTIONS.LOAD_FROM_STORAGE:
      return {
        ...state,
        selectedPandals: action.payload || [],
        isVisible: (action.payload || []).length > 0
      };

    case CART_ACTIONS.HIDE_CART:
      return {
        ...state,
        isVisible: false
      };

    case CART_ACTIONS.SHOW_CART:
      return {
        ...state,
        isVisible: state.selectedPandals.length > 0
      };

    default:
      return state;
  }
};

// Create context
const RouteCartContext = createContext();

// Provider component
export const RouteCartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('routeCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_FROM_STORAGE, payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem('routeCart');
    }
  }, []);

  // Cart actions
  const addPandalToCart = (pandal) => {
    const existingPandal = state.selectedPandals.find(p => p._id === pandal._id);
    
    if (existingPandal) {
      toast.error('Pandal already added to route!', {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: '#fee2e2',
          color: '#dc2626',
          borderRadius: '8px',
          fontSize: '14px'
        }
      });
      return;
    }

    dispatch({ type: CART_ACTIONS.ADD_PANDAL, payload: pandal });
    
    // Show success toast with mobile-friendly styling
    toast.success(`${pandal.name} added to route!`, {
      duration: 2000,
      position: 'bottom-center',
      style: {
        background: '#dcfce7',
        color: '#166534',
        borderRadius: '8px',
        fontSize: '14px',
        maxWidth: '90vw'
      }
    });
  };

  const removePandalFromCart = (pandalId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_PANDAL, payload: pandalId });
    
    toast.success('Pandal removed from route', {
      duration: 1500,
      position: 'bottom-center',
      style: {
        background: '#fef3c7',
        color: '#92400e',
        borderRadius: '8px',
        fontSize: '14px'
      }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    
    toast.success('Route cleared', {
      duration: 1500,
      position: 'bottom-center',
      style: {
        background: '#f3f4f6',
        color: '#374151',
        borderRadius: '8px',
        fontSize: '14px'
      }
    });
  };

  const hideCart = () => {
    dispatch({ type: CART_ACTIONS.HIDE_CART });
  };

  const showCart = () => {
    dispatch({ type: CART_ACTIONS.SHOW_CART });
  };

  const isPandalInCart = (pandalId) => {
    return state.selectedPandals.some(p => p._id === pandalId);
  };

  const getCartCount = () => {
    return state.selectedPandals.length;
  };

  const getCartPandals = () => {
    return state.selectedPandals;
  };

  const value = {
    // State
    selectedPandals: state.selectedPandals,
    isCartVisible: state.isVisible,
    lastAddedPandal: state.lastAddedPandal,
    cartCount: getCartCount(),
    
    // Actions
    addPandalToCart,
    removePandalFromCart,
    clearCart,
    hideCart,
    showCart,
    isPandalInCart,
    getCartPandals
  };

  return (
    <RouteCartContext.Provider value={value}>
      {children}
    </RouteCartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useRouteCart = () => {
  const context = useContext(RouteCartContext);
  if (!context) {
    throw new Error('useRouteCart must be used within a RouteCartProvider');
  }
  return context;
};

export default RouteCartContext;