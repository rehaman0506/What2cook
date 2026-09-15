import { Recipe, RecipeFilterState } from '../types';
import { SAMPLE_RECIPES } from '../data/sampleRecipes';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Normalizes strings by trimming, lowercasing, and collapsing whitespace, hyphens, and underscores.
 * E.g., 'South-Indian ' -> 'south indian', 'NON-VEGETARIAN' -> 'non vegetarian'
 */
export function normalizeStr(str?: string | null): string {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/[-_\s]+/g, ' ');
}

/**
 * Robustly parses a cooking time string into total minutes.
 * Handles '15 mins', '45 mins', '1 hour 15 mins', '1 hr', etc.
 */
export function parseMinutes(timeStr?: string | null): number {
  if (!timeStr) return 0;
  let total = 0;
  const hourMatch = timeStr.match(/(\d+)\s*(?:hour|hr|h)/i);
  if (hourMatch) {
    total += parseInt(hourMatch[1], 10) * 60;
  }
  const minMatch = timeStr.match(/(\d+)\s*(?:minute|min|m)/i);
  if (minMatch) {
    total += parseInt(minMatch[1], 10);
  } else if (!hourMatch) {
    const rawNum = timeStr.match(/(\d+)/);
    if (rawNum) total += parseInt(rawNum[1], 10);
  }
  return total;
}

/**
 * Intelligently matches a recipe against a category filter.
 * Handles meal categories, regional cuisines, dietary tags, and ingredient keywords.
 */
export function matchesCategory(recipe: Recipe, categoryFilter: string): boolean {
  if (!categoryFilter || categoryFilter.toUpperCase() === 'ALL') return true;

  const target = normalizeStr(categoryFilter);
  const recCat = normalizeStr(recipe.category);
  const recCuisine = normalizeStr(recipe.cuisine);
  const recDiet = normalizeStr(recipe.food_type);
  const recName = normalizeStr(recipe.name);

  // Exact matches
  if (recCat === target || recCuisine === target) return true;

  // Vegetarian category match
  if (target === 'vegetarian' || target === 'veg') {
    return recDiet === 'vegetarian' || recCat === 'vegetarian';
  }

  // Non-Vegetarian category match
  if (target === 'non vegetarian' || target === 'non veg') {
    return recDiet === 'non vegetarian' || recCat === 'non vegetarian';
  }

  // Chicken category match
  if (target === 'chicken') {
    return (
      recCat === 'chicken' ||
      recName.includes('chicken') ||
      recipe.ingredients.some(i => normalizeStr(i.name).includes('chicken'))
    );
  }

  // Rice Dishes category match
  if (target === 'rice dishes' || target === 'rice') {
    return (
      recCat === 'rice dishes' ||
      recName.includes('rice') ||
      recName.includes('biryani') ||
      recipe.ingredients.some(i => normalizeStr(i.name).includes('rice'))
    );
  }

  // Substring / word boundary matches (handles "South Indian", "North Indian", "Italian", "Mexican", etc.)
  if (recCat.includes(target) || target.includes(recCat)) return true;
  if (recCuisine.includes(target) || target.includes(recCuisine)) return true;

  return false;
}

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
    // 1. Search Query (Dish name, ingredients, cuisine, category, description)
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = normalizeStr(filters.searchQuery);
      const matchName = normalizeStr(recipe.name).includes(q);
      const matchCuisine = normalizeStr(recipe.cuisine).includes(q);
      const matchCategory = normalizeStr(recipe.category).includes(q);
      const matchDescription = normalizeStr(recipe.description).includes(q);
      const matchIngredients = recipe.ingredients.some(ing =>
        normalizeStr(ing.name).includes(q)
      );

      if (!matchName && !matchCuisine && !matchCategory && !matchDescription && !matchIngredients) {
        return false;
      }
    }

    // 2. Vegetarian / Non-Vegetarian Filter
    if (filters.foodType && filters.foodType !== 'ALL') {
      const targetDiet = normalizeStr(filters.foodType);
      const recipeDiet = normalizeStr(recipe.food_type);
      if (targetDiet === 'vegetarian' || targetDiet === 'veg') {
        if (recipeDiet !== 'vegetarian') return false;
      } else if (targetDiet === 'non vegetarian' || targetDiet === 'non veg') {
        if (recipeDiet !== 'non vegetarian') return false;
      }
    }

    // 3. Cuisine Filter
    if (filters.cuisine && filters.cuisine.toUpperCase() !== 'ALL') {
      const targetCuisine = normalizeStr(filters.cuisine);
      const recipeCuisine = normalizeStr(recipe.cuisine);
      if (recipeCuisine !== targetCuisine) {
        return false;
      }
    }

    // 4. Category Filter
    if (filters.category && filters.category.toUpperCase() !== 'ALL') {
      if (!matchesCategory(recipe, filters.category)) {
        return false;
      }
    }

    // 5. Difficulty Filter
    if (filters.difficulty && filters.difficulty.toUpperCase() !== 'ALL') {
      if (normalizeStr(recipe.difficulty) !== normalizeStr(filters.difficulty)) {
        return false;
      }
    }

    // 6. Max Cooking Time Filter
    if (filters.maxCookTime !== null && filters.maxCookTime !== undefined) {
      const cookMinutes = parseMinutes(recipe.cooking_time);
      if (cookMinutes > filters.maxCookTime) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'quickest': {
        const timeA = parseMinutes(a.cooking_time);
        const timeB = parseMinutes(b.cooking_time);
        return timeA - timeB;
      }
      case 'easy': {
        const diffMap: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
        const diffA = diffMap[normalizeStr(a.difficulty)] || 2;
        const diffB = diffMap[normalizeStr(b.difficulty)] || 2;
        return diffA - diffB;
      }
      case 'recent': {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      case 'popular':
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });
}
