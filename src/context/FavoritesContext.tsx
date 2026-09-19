import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Recipe } from '../types';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface FavoritesContextType {
  favoriteIds: string[];
  favoriteRecipes: Recipe[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (recipe: Recipe) => Promise<void>;
  saveCustomRecipe: (recipe: Recipe) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  // Load favorites on startup or user change
  useEffect(() => {
    const loadFavorites = async () => {
      // 1. Try Supabase if user is logged in and configured
      if (isSupabaseConfigured && supabase && user && !user.isGuest) {
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('recipe_id, recipes(*)')
            .eq('user_id', user.id);

          if (!error && data) {
            const ids = data.map(item => item.recipe_id);
            const recs = data.map(item => (item as any).recipes).filter(Boolean);
            setFavoriteIds(ids);
            setFavoriteRecipes(recs);
            return;
          }
        } catch (e) {
          console.warn('Error loading favorites from Supabase, loading from localStorage:', e);
        }
      }

      // 2. Load from localStorage
      const storedIds = localStorage.getItem('recipemate_favorite_ids');
      const storedRecipes = localStorage.getItem('recipemate_favorite_recipes');
      if (storedIds) {
        try {
          setFavoriteIds(JSON.parse(storedIds));
        } catch {}
      }
      if (storedRecipes) {
        try {
          setFavoriteRecipes(JSON.parse(storedRecipes));
        } catch {}
      }
    };

    loadFavorites();
  }, [user]);

  // Sync to localStorage
  const persistLocally = (ids: string[], recipes: Recipe[]) => {
    localStorage.setItem('recipemate_favorite_ids', JSON.stringify(ids));
    localStorage.setItem('recipemate_favorite_recipes', JSON.stringify(recipes));
  };

  const isFavorite = (id: string) => {
    return favoriteIds.includes(id);
  };

  const toggleFavorite = async (recipe: Recipe) => {
    const currentlyFav = isFavorite(recipe.id);
    let newIds: string[];
    let newRecipes: Recipe[];

    if (currentlyFav) {
      newIds = favoriteIds.filter(id => id !== recipe.id);
      newRecipes = favoriteRecipes.filter(r => r.id !== recipe.id);
    } else {
      newIds = [...favoriteIds, recipe.id];
      newRecipes = [...favoriteRecipes, recipe];

      // Sparkle celebration animation!
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#f97316', '#10b981', '#fbbf24']
        });
      } catch {}
    }

    setFavoriteIds(newIds);
    setFavoriteRecipes(newRecipes);
    persistLocally(newIds, newRecipes);

    // Sync to Supabase if connected
    if (isSupabaseConfigured && supabase && user && !user.isGuest) {
      try {
        if (currentlyFav) {
          await supabase
            .from('favorites')
            .delete()
            .match({ user_id: user.id, recipe_id: recipe.id });
        } else {
          await supabase
            .from('favorites')
            .insert({ user_id: user.id, recipe_id: recipe.id });
        }
      } catch (err) {
        console.warn('Failed to sync favorite with Supabase:', err);
      }
    }
  };

  const saveCustomRecipe = (recipe: Recipe) => {
    // If not already in favorites, add it
    if (!isFavorite(recipe.id)) {
      toggleFavorite(recipe);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, favoriteRecipes, isFavorite, toggleFavorite, saveCustomRecipe }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
