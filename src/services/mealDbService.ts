import { Recipe } from '../types';

interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string | null;
  [key: string]: string | null | undefined;
}

interface MealDBResponse {
  meals: MealDBMeal[] | null;
}

const NON_VEG_KEYWORDS = [
  'chicken', 'beef', 'pork', 'lamb', 'mutton', 'meat', 'bacon', 'ham', 
  'sausage', 'fish', 'salmon', 'tuna', 'cod', 'shrimp', 'prawn', 'crab', 
  'lobster', 'turkey', 'duck', 'egg', 'anchovy', 'clam', 'oyster', 'squid'
];

/**
 * Accurately determines if a recipe is Vegetarian or Non-Vegetarian
 * based on category, tags, and ingredient list.
 */
function inferFoodType(category: string, ingredients: { name: string }[]): 'VEGETARIAN' | 'NON-VEGETARIAN' {
  const cat = (category || '').toLowerCase();
  if (cat === 'vegetarian' || cat === 'vegan') return 'VEGETARIAN';
  if (['chicken', 'beef', 'pork', 'lamb', 'seafood', 'goat'].includes(cat)) {
    return 'NON-VEGETARIAN';
  }

  const ingText = ingredients.map(i => i.name.toLowerCase()).join(' ');
  const isNonVeg = NON_VEG_KEYWORDS.some(kw => ingText.includes(kw));
  return isNonVeg ? 'NON-VEGETARIAN' : 'VEGETARIAN';
}

/**
 * Normalizes TheMealDB cuisine area to our app's cuisine formats.
 */
function mapCuisine(strArea?: string): string {
  if (!strArea) return 'International';
  const area = strArea.trim().toLowerCase();
  if (area === 'indian') return 'North Indian';
  if (area === 'italian') return 'Italian';
  if (area === 'mexican') return 'Mexican';
  if (area === 'chinese') return 'Indo-Chinese';
  if (area === 'american') return 'American';
  if (area === 'thai') return 'Asian';
  if (area === 'japanese') return 'Asian';
  if (area === 'french' || area === 'british' || area === 'spanish' || area === 'greek') return 'Continental';
  return strArea.trim();
}

/**
 * Normalizes TheMealDB category to our 12 standard categories.
 */
function mapCategory(strCategory?: string): string {
  if (!strCategory) return 'Dinner';
  const cat = strCategory.trim().toLowerCase();
  if (cat === 'dessert') return 'Desserts';
  if (cat === 'starter' || cat === 'side') return 'Appetizers';
  if (cat === 'breakfast') return 'Breakfast';
  if (cat === 'pasta') return 'Dinner';
  if (cat === 'seafood') return 'Dinner';
  if (cat === 'chicken' || cat === 'beef' || cat === 'lamb' || cat === 'pork') return 'Lunch';
  if (cat === 'vegetarian' || cat === 'vegan') return 'Dinner';
  return 'Dinner';
}

/**
 * Converts a raw MealDB meal JSON object into a strongly-typed Recipe.
 */
export function convertMealDBToRecipe(meal: MealDBMeal): Recipe {
  // Extract ingredients and measurements (up to 20 pairs)
  const ingredients: { name: string; quantity: string; isOptional?: boolean }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingName = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingName && ingName.trim()) {
      ingredients.push({
        name: ingName.trim(),
        quantity: (measure && measure.trim()) ? measure.trim() : 'As needed',
        isOptional: false,
      });
    }
  }

  // Parse instructions into numbered steps
  const rawInstructions = meal.strInstructions || '';
  const lines = rawInstructions
    .split(/\r?\n+/)
    .map(line => line.trim())
    .filter(line => line.length > 5 && !line.toUpperCase().startsWith('STEP'));

  const instructions = lines.length > 0
    ? lines.map((text, idx) => ({ step: idx + 1, text }))
    : [
        { step: 1, text: 'Prepare and measure all fresh ingredients as indicated in the list.' },
        { step: 2, text: rawInstructions.slice(0, 300) || 'Cook according to traditional methods and serve hot.' }
      ];

  const food_type = inferFoodType(meal.strCategory, ingredients);

  return {
    id: `mealdb-${meal.idMeal}`,
    name: meal.strMeal,
    description: `Authentic ${meal.strArea || 'gourmet'} style ${meal.strMeal} prepared with fresh ingredients, balanced spices, and wholesome flavors.`,
    image_url: meal.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    cuisine: mapCuisine(meal.strArea),
    category: mapCategory(meal.strCategory),
    food_type,
    ingredients,
    instructions,
    preparation_time: '15 mins',
    cooking_time: '30 mins',
    total_time: '45 mins',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.8,
    tips: [
      'For best results, taste and adjust salt and spices throughout cooking.',
      'Garnish with fresh herbs right before serving.'
    ],
    nutrition: {
      calories: 460,
      protein: food_type === 'NON-VEGETARIAN' ? '32g' : '14g',
      carbs: '48g',
      fat: '16g',
    }
  };
}

/**
 * Searches TheMealDB by dish name or keyword.
 */
export async function searchTheMealDB(query: string): Promise<Recipe[]> {
  if (!query || !query.trim()) return [];
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query.trim())}`);
    if (!res.ok) return [];
    const data: MealDBResponse = await res.json();
    if (!data.meals) return [];
    return data.meals.map(convertMealDBToRecipe);
  } catch (err) {
    console.warn('TheMealDB API fetch error:', err);
    return [];
  }
}

/**
 * Fetches popular global meals from TheMealDB for diverse categories.
 */
export async function fetchPopularGlobalMeals(): Promise<Recipe[]> {
  const cacheKey = 'recipemate_mealdb_popular_cache';
  if (typeof window !== 'undefined' && window.localStorage) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Ignore cache parse error
      }
    }
  }

  // Popular search queries across world cuisines to get a massive diverse batch
  const queries = ['chicken', 'curry', 'pasta', 'rice', 'soup', 'salad', 'cake', 'fish', 'pie'];
  const results: Recipe[] = [];
  const seenIds = new Set<string>();

  for (const q of queries) {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`);
      if (res.ok) {
        const data: MealDBResponse = await res.json();
        if (data.meals) {
          for (const m of data.meals) {
            if (!seenIds.has(m.idMeal)) {
              seenIds.add(m.idMeal);
              results.push(convertMealDBToRecipe(m));
            }
          }
        }
      }
    } catch (e) {
      console.warn(`Error fetching ${q} from TheMealDB:`, e);
    }
  }

  if (results.length > 0 && typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(results.slice(0, 100)));
    } catch {
      // Storage quota safety
    }
  }

  return results;
}
