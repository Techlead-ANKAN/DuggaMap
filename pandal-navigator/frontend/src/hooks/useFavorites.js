import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useFavorites = () => {
  const { user, isSignedIn } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get auth headers
  const getAuthHeaders = async () => {
    if (!isSignedIn || !user) return {};
    
    try {
      const token = await user.getToken();
      return {
        Authorization: `Bearer ${token}`,
      };
    } catch (error) {
      console.error('Error getting auth token:', error);
      return {};
    }
  };

  // Fetch favorites
  const fetchFavorites = async () => {
    if (!isSignedIn) return;

    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/favorites`, { headers });
      setFavorites(response.data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError(error.response?.data?.message || 'Failed to fetch favorites');
    } finally {
      setIsLoading(false);
    }
  };

  // Add to favorites
  const addToFavorites = async (itemId, itemType) => {
    if (!isSignedIn) throw new Error('Authentication required');

    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(
        `${API_URL}/favorites`,
        { itemId, itemType },
        { headers }
      );
      
      setFavorites(prev => [...prev, response.data.data]);
      setError(null);
      return response.data.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add to favorites';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (itemId, itemType) => {
    if (!isSignedIn) throw new Error('Authentication required');

    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${API_URL}/favorites/${itemId}/${itemType}`, { headers });
      
      setFavorites(prev => 
        prev.filter(fav => !(fav.itemId === itemId && fav.itemType === itemType))
      );
      setError(null);
    } catch (error) {
      console.error('Error removing from favorites:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove from favorites';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if item is favorited
  const isFavorite = (itemId, itemType) => {
    return favorites.some(fav => fav.itemId === itemId && fav.itemType === itemType);
  };

  // Get favorites by type
  const getFavoritesByType = (itemType) => {
    return favorites.filter(fav => fav.itemType === itemType);
  };

  // Load favorites when user signs in
  useEffect(() => {
    if (isSignedIn) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setError(null);
    }
  }, [isSignedIn]);

  return {
    favorites,
    isLoading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesByType,
    refetch: fetchFavorites,
  };
};