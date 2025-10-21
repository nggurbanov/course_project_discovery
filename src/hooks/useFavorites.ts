import { useState, useEffect, useCallback } from 'react';

const FAVORITES_COOKIE_NAME = 'coursework_favorites';
const COOKIE_EXPIRY_DAYS = 365;

/**
 * Hook to manage favorites stored in cookies
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from cookies on mount
  useEffect(() => {
    const loadFavorites = () => {
      const cookies = document.cookie.split(';');
      const favoriteCookie = cookies.find(cookie => 
        cookie.trim().startsWith(`${FAVORITES_COOKIE_NAME}=`)
      );

      if (favoriteCookie) {
        try {
          const value = favoriteCookie.split('=')[1];
          const decoded = decodeURIComponent(value);
          const parsed = JSON.parse(decoded);
          setFavorites(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error('Error loading favorites from cookies:', error);
          setFavorites([]);
        }
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to cookies (without updating state)
  const saveToCookie = useCallback((favoritesToSave: string[]) => {
    try {
      const encoded = encodeURIComponent(JSON.stringify(favoritesToSave));
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
      
      document.cookie = `${FAVORITES_COOKIE_NAME}=${encoded}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    } catch (error) {
      console.error('Error saving favorites to cookies:', error);
    }
  }, []);

  // Save favorites to cookies and update state
  const saveFavorites = useCallback((newFavorites: string[]) => {
    saveToCookie(newFavorites);
    setFavorites(newFavorites);
  }, [saveToCookie]);

  // Toggle a project in favorites
  const toggleFavorite = useCallback((projectId: string) => {
    setFavorites(current => {
      const isCurrentlyFavorite = current.includes(projectId);
      const newFavorites = isCurrentlyFavorite
        ? current.filter(id => id !== projectId)
        : [...current, projectId];
      
      // Save to cookie immediately
      saveToCookie(newFavorites);
      return newFavorites;
    });
  }, [saveToCookie]);

  // Check if a project is favorited
  const isFavorite = useCallback((projectId: string) => {
    return favorites.includes(projectId);
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };
};

