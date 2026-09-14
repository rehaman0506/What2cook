import { Recipe, RecipeFilterState } from '../types';
import { SAMPLE_RECIPES } from '../data/sampleRecipes';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export async function fetchAllRecipes(): Promise<Recipe[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        return data as Recipe[];
      }
    } catch (err) {
      console.warn('Failed to fetch from Supabase, using local sample recipes:', err);
    }
  }

  // Check if there are any locally stored custom/AI recipes saved
  const localSaved = localStorage.getItem('recipemate_community_recipes');
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...SAMPLE_RECIPES, ...parsed];
      }
    } catch (e) {
      console.error('Error parsing local recipes:', e);
    }
  }

  return SAMPLE_RECIPES;
}

export function filterRecipes(recipes: Recipe[], filters: RecipeFilterState): Recipe[] {
  return recipes.filter(recipe => {
    // 1. Search Query (Dish name, ingredients, cuisine, category)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = recipe.name.toLowerCase().includes(q);
      const matchCuisine = recipe.cuisine.toLowerCase().includes(q);
      const matchCategory = recipe.category.toLowerCase().includes(q);
      const matchDescription = recipe.description.toLowerCase().includes(q);
      const matchIngredients = recipe.ingredients.some(ing =>
        ing.name.toLowerCase().includes(q)
      );

      if (!matchName && !matchCuisine && !matchCategory && !matchDescription && !matchIngredients) {
        return false;
      }
    }

    // 2. Vegetarian / Non-Vegetarian Filter
    if (filters.foodType !== 'ALL') {
      if (recipe.food_type !== filters.foodType) {
        return false;
      }
    }

    // 3. Cuisine Filter
    if (filters.cuisine && filters.cuisine !== 'ALL') {
      if (recipe.cuisine.toLowerCase() !== filters.cuisine.toLowerCase()) {
        return false;
      }
    }

    // 4. Category Filter
    if (filters.category && filters.category !== 'ALL') {
      // Handle tag matching or category name
      if (recipe.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    // 5. Difficulty Filter
    if (filters.difficulty && filters.difficulty !== 'ALL') {
      if (recipe.difficulty.toLowerCase() !== filters.difficulty.toLowerCase()) {
        return false;
      }
    }

    // 6. Max Cooking Time Filter
    if (filters.maxCookTime !== null) {
      // Parse numeric minutes from "15 mins", "45 mins", etc.
      const match = recipe.cooking_time.match(/(\d+)/);
      const cookMinutes = match ? parseInt(match[1], 10) : 0;
      if (cookMinutes > filters.maxCookTime) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'quickest': {
        const timeA = parseInt((a.cooking_time.match(/(\d+)/) || [0, 999])[1] as string, 10);
        const timeB = parseInt((b.cooking_time.match(/(\d+)/) || [0, 999])[1] as string, 10);
        return timeA - timeB;
      }
      case 'easy': {
        const diffMap: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
        return (diffMap[a.difficulty] || 2) - (diffMap[b.difficulty] || 2);
      }
      case 'recent':
        return (new Date(b.created_at || 0).getTime()) - (new Date(a.created_at || 0).getTime());
      case 'popular':
      default:
        return b.rating - a.rating;
    }
  });
}
