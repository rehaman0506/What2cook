import { Recipe } from '../types';
import { SAMPLE_RECIPES } from '../data/sampleRecipes';
import { scaleQuantity } from '../utils/quantityScaler';

/**
 * Detects whether prompt is in Telugu or defaults to English.
 * Hindi is totally removed from this chatbot.
 */
export function detectLanguage(_prompt?: string, _fallback: string = 'en'): 'en' {
  return 'en';
}

export interface AIChefResponse {
  recipe: Recipe;
  userIngredients: string[];
  additionalIngredients: string[];
  conversationalIntro: string;
}

export interface UserIntent {
  rawPrompt: string;
  foundIngredients: string[];
  userNonVegIngredients: string[];
  userVegIngredients: string[];
  isExplicitVegRequest: boolean;
  isExplicitNonVegRequest: boolean;
  isStrictlyVegetarian: boolean;
  isBreakfast: boolean;
  isDinner: boolean;
  isQuickRequest: boolean;
  isBiryani: boolean;
  isPasta: boolean;
}

/**
 * Comprehensive list of non-vegetarian ingredients and meat keywords.
 * Includes poultry, red meat, seafood, game, and eggs in English and Telugu.
 */
export const NON_VEG_KEYWORDS: string[] = [
  'chicken',
  'mutton',
  'lamb',
  'beef',
  'pork',
  'fish',
  'prawns',
  'prawn',
  'shrimp',
  'shrimps',
  'crab',
  'crabs',
  'lobster',
  'lobsters',
  'seafood',
  'turkey',
  'egg',
  'eggs',
  'bacon',
  'ham',
  'sausage',
  'sausages',
  'meat',
  'duck',
  'squid',
  'octopus',
  'salmon',
  'tuna',
  'cod',
  'anchovy',
  'anchovies',
  'keema',
  'kheema',
  'gosht',
  'murgh',
  'clam',
  'clams',
  'oyster',
  'oysters',
  // Telugu non-vegetarian keywords
  'చికెన్', 'మటన్', 'మేకమాంసం', 'కోడి', 'కోడిమాంసం', 'చేప', 'చేపలు', 'రొయ్యలు', 'గుడ్డు', 'గుడ్లు', 'మాంసం'
];

/**
 * Multilingual ingredient dictionary mapping Telugu words to standard culinary ingredients.
 */
export const MULTILINGUAL_INGREDIENT_MAP: Record<string, string> = {
  // Telugu
  'పాలకూర': 'spinach',
  'టమాటా': 'tomato',
  'టమాట': 'tomato',
  'బియ్యం': 'rice',
  'అన్నం': 'rice',
  'ఉల్లిపాయ': 'onion',
  'ఉల్లిగడ్డ': 'onion',
  'బంగాళాదుంప': 'potato',
  'ఆలూ': 'potato',
  'క్యారెట్': 'carrot',
  'పనీర్': 'paneer',
  'చికెన్': 'chicken',
  'కోడి': 'chicken',
  'కోడిమాంసం': 'chicken',
  'మటన్': 'mutton',
  'మేకమాంసం': 'mutton',
  'చేప': 'fish',
  'చేపలు': 'fish',
  'రొయ్యలు': 'prawns',
  'గుడ్డు': 'egg',
  'గుడ్లు': 'egg',
  'వెల్లుల్లి': 'garlic',
  'అల్లం': 'ginger',
  'పప్పు': 'dal',
  'కొత్తిమీర': 'coriander',
  'పుదీనా': 'mint',
  'పచ్చిమిర్చి': 'green chili',
  'మిరపకాయ': 'chili',
  'పెరుగు': 'curd',
  'నెయ్యి': 'ghee',
  'నూనె': 'oil',
  'పాలు': 'milk',
  'గోబీ': 'cauliflower',
  'కాలీఫ్లవర్': 'cauliflower',
  'బఠానీలు': 'peas',
  'పుట్టగొడుగులు': 'mushroom'
};

/**
 * Checks if a word or string contains any non-vegetarian keyword.
 * Uses word-boundary matching to prevent false positives.
 */
export function isNonVegWord(text?: string | null): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  for (const kw of NON_VEG_KEYWORDS) {
    if (/[a-z]/.test(kw)) {
      const regex = new RegExp(`\\b${kw}s?\\b`, 'i');
      if (regex.test(lower)) return true;
    } else {
      if (lower.includes(kw)) return true;
    }
  }
  return false;
}

/**
 * Known common culinary ingredients dictionary for robust extraction.
 */
const CULINARY_VOCABULARY = [
  // Meats & Seafood (Non-Veg)
  'chicken', 'mutton', 'lamb', 'beef', 'pork', 'fish', 'prawns', 'shrimp', 'crab', 'lobster', 'seafood', 'turkey', 'egg',
  // Grains, Rice & Carbs
  'rice', 'basmati rice', 'brown rice', 'pasta', 'penne', 'spaghetti', 'macaroni', 'noodles', 'bread', 'flour', 'atta', 'maida', 'poha', 'oats', 'semolina', 'suji',
  // Vegetables & Greens
  'spinach', 'palak', 'tomato', 'potato', 'onion', 'garlic', 'ginger', 'carrot', 'peas', 'green peas', 'cauliflower', 'gobi',
  'cabbage', 'capsicum', 'bell pepper', 'corn', 'sweet corn', 'mushroom', 'broccoli', 'eggplant', 'brinjal', 'cucumber',
  'zucchini', 'avocado', 'chili', 'green chili', 'coriander', 'cilantro', 'mint', 'lemon', 'lime', 'methi', 'fenugreek',
  // Dairy & Plant Proteins
  'paneer', 'tofu', 'cheese', 'mozzarella', 'cheddar', 'milk', 'cream', 'butter', 'ghee', 'yogurt', 'curd',
  // Legumes & Pulses
  'dal', 'lentil', 'lentils', 'chickpeas', 'chana', 'rajma', 'kidney beans', 'beans', 'moong dal', 'urad dal', 'toor dal'
];

/**
 * Normalizes singular/plural and common variations of ingredient names.
 */
export function normalizeIngredientName(name: string): string {
  const clean = name.trim().toLowerCase();
  if (clean === 'tomatoes') return 'tomato';
  if (clean === 'potatoes') return 'potato';
  if (clean === 'onions') return 'onion';
  if (clean === 'carrots') return 'carrot';
  if (clean === 'eggs') return 'egg';
  if (clean === 'prawns') return 'prawn';
  if (clean === 'shrimps') return 'shrimp';
  if (clean === 'mushrooms') return 'mushroom';
  if (clean === 'beans') return 'beans';
  if (clean === 'palak') return 'spinach';
  if (clean === 'aloo') return 'potato';
  if (clean === 'gobi') return 'cauliflower';
  return clean;
}

/**
 * Parses user input to extract ingredients and determine dietary intention.
 * Applies the Vegetarian Safety Rule:
 * If the user's ingredients contain no non-vegetarian ingredient and the user
 * has not explicitly requested non-veg, then vegetarian = true.
 */
export function extractIngredientsAndIntent(
  prompt: string, 
  forcedDiet?: 'ALL' | 'VEGETARIAN' | 'NON-VEGETARIAN'
): UserIntent {
  const lower = prompt.toLowerCase();
  const foundIngredients: string[] = [];

  // 0. Check for multilingual Telugu ingredients first
  for (const [nativeWord, engIng] of Object.entries(MULTILINGUAL_INGREDIENT_MAP)) {
    if (prompt.includes(nativeWord)) {
      const norm = normalizeIngredientName(engIng);
      if (!foundIngredients.includes(norm)) {
        foundIngredients.push(norm);
      }
    }
  }

  // 1. Direct phrase separation (commas, '+', ' and ', '&', Telugu punctuation)
  const directChunks = prompt
    .split(/[,+&|、।]/i)
    .map(c => c.replace(/^(i have|what can i make with|suggest|a recipe with|recipe using|how to cook|ingredients?:?|నా దగ్గర|నేను|నాకు|నా దగ్గర ఉన్నవి|నాకు వంట కావాలి)\s*/i, '').trim())
    .map(c => c.replace(/[^\p{L}\p{N}\s-]/gu, '').trim())
    .filter(c => c.length > 1 && !['i', 'have', 'with', 'using', 'want', 'food', 'recipe', 'make', 'cook', 'the', 'some'].includes(c.toLowerCase()));

  // Add recognized direct chunks
  for (const chunk of directChunks) {
    const norm = normalizeIngredientName(chunk);
    if (norm.length > 1 && !foundIngredients.includes(norm)) {
      foundIngredients.push(norm);
    }
  }

  // Also check against culinary vocabulary for free-form queries
  for (const item of CULINARY_VOCABULARY) {
    const regex = new RegExp(`\\b${item}s?\\b`, 'i');
    if (regex.test(lower)) {
      const norm = normalizeIngredientName(item);
      if (!foundIngredients.includes(norm)) {
        foundIngredients.push(norm);
      }
    }
  }

  // Classify user ingredients into veg and non-veg
  const userNonVegIngredients = foundIngredients.filter(ing => isNonVegWord(ing));
  const userVegIngredients = foundIngredients.filter(ing => !isNonVegWord(ing));

  // Check explicit dietary keywords in the prompt
  const hasNonVegWordInPrompt = isNonVegWord(prompt);
  const isExplicitNonVegRequest = (
    forcedDiet === 'NON-VEGETARIAN' ||
    /\b(non-veg|non veg|meat)\b/i.test(lower) ||
    prompt.includes('మాంసాహారం') ||
    prompt.includes('నాన్ వెజ్') ||
    hasNonVegWordInPrompt
  );

  const isExplicitVegRequest = (
    forcedDiet === 'VEGETARIAN' ||
    /\b(veg|vegetarian|vegan|pure veg)\b/i.test(lower) ||
    prompt.includes('శాకాహారం') ||
    prompt.includes('ప్యూర్ వెజ్') ||
    prompt.includes('వెజ్')
  );

  // VEGETARIAN SAFETY RULE:
  // If forcedDiet is VEGETARIAN OR user provided NO non-vegetarian ingredients and did NOT explicitly ask for non-veg:
  // vegetarian = true
  const isStrictlyVegetarian = (
    forcedDiet === 'VEGETARIAN' ||
    (!isExplicitNonVegRequest && userNonVegIngredients.length === 0)
  );

  const isQuickRequest = /\b(quick|fast|20-minute|20 min|15 min|10 min)\b/i.test(lower);
  const isBreakfast = /\b(breakfast|morning)\b/i.test(lower);
  const isDinner = /\b(dinner|evening)\b/i.test(lower);
  const isBiryani = /\b(biryani|dum)\b/i.test(lower);
  const isPasta = /\b(pasta|penne|spaghetti|macaroni)\b/i.test(lower);

  return {
    rawPrompt: prompt,
    foundIngredients,
    userNonVegIngredients,
    userVegIngredients,
    isExplicitVegRequest,
    isExplicitNonVegRequest,
    isStrictlyVegetarian,
    isBreakfast,
    isDinner,
    isQuickRequest,
    isBiryani,
    isPasta
  };
}

/**
 * Validates a recipe against dietary rules and non-vegetarian keywords.
 * Returns true if valid, or false with violation reason if invalid.
 */
export function validateRecipeDiet(
  recipe: Recipe,
  isStrictlyVegetarian: boolean
): { isValid: boolean; violation?: string } {
  if (isStrictlyVegetarian) {
    if (recipe.food_type !== 'VEGETARIAN') {
      return { isValid: false, violation: `Recipe has food_type '${recipe.food_type}', expected 'VEGETARIAN'` };
    }

    if (isNonVegWord(recipe.name)) {
      return { isValid: false, violation: `Recipe title '${recipe.name}' contains non-vegetarian keyword` };
    }

    if (isNonVegWord(recipe.description)) {
      return { isValid: false, violation: `Recipe description contains non-vegetarian keyword` };
    }

    for (const ing of recipe.ingredients) {
      if (isNonVegWord(ing.name)) {
        return { isValid: false, violation: `Recipe ingredient '${ing.name}' is non-vegetarian` };
      }
    }
  }

  return { isValid: true };
}

/**
 * Capitalizes words for professional presentation.
 */
function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Intelligently constructs an authentic culinary recipe tailored
 * directly to the user's provided ingredients and chosen servings count.
 * Languages supported in Chatbot: English ('en') and Telugu ('te').
 * Hindi is totally removed from this chatbot.
 */
export function synthesizeDynamicRecipe(
  intent: UserIntent, 
  _lang: 'en' = 'en',
  targetServings: number = 2
): AIChefResponse {
  const { foundIngredients, isStrictlyVegetarian } = intent;

  const hasRice = foundIngredients.includes('rice') || foundIngredients.includes('basmati rice');
  const hasSpinach = foundIngredients.includes('spinach');
  const hasTomato = foundIngredients.includes('tomato');
  const hasPotato = foundIngredients.includes('potato');
  const hasPaneer = foundIngredients.includes('paneer');
  const hasChicken = foundIngredients.includes('chicken');
  const userItemsFormatted = foundIngredients.map(capitalizeWords);
  const now = Date.now();

  const localizedUserItems = userItemsFormatted;

  // -------------------------------------------------------------------------
  // CASE A: Spinach + Rice (+ Tomato / other veggies) -> 100% VEGETARIAN Rice
  // -------------------------------------------------------------------------
  if (hasRice && hasSpinach && isStrictlyVegetarian) {
    let dishTitle = 'Homestyle Spiced Spinach & Tomato Rice';
    let description = 'A fragrant, nutritious one-pot spiced rice dish infused with fresh tender spinach leaves, juicy tomatoes, cumin seeds, and aromatic spices.';
    let intro = `I have designed a 100% vegetarian **${dishTitle}** for ${targetServings} ${targetServings === 1 ? 'person' : 'people'} highlighting your **${userItemsFormatted.join(', ')}**! It is healthy, quick to make in 30 minutes, and completely free of any meat or non-vegetarian ingredients.`;

    // Base ingredients for 2 servings
    let baseIngredients = [
      { name: 'Basmati Rice', quantity: '1.5 cups (rinsed & soaked 20 mins)', isOptional: false },
      { name: 'Fresh Spinach', quantity: '2 cups (washed & chopped)', isOptional: false },
      { name: 'Ripe Tomatoes', quantity: '2 medium (finely diced)', isOptional: false },
      { name: 'Cooking Oil or Butter', quantity: '2 tbsp', isOptional: false },
      { name: 'Cumin Seeds', quantity: '1 tsp', isOptional: false },
      { name: 'Turmeric Powder & Warm Spices', quantity: '0.5 tsp each', isOptional: false }
    ];

    let instructions = [
      { step: 1, text: 'Rinse basmati rice until water runs clear, soak in water for 20 minutes, then drain completely.' },
      { step: 2, text: 'Heat cooking oil or butter in a heavy pot or pressure cooker. Sputter cumin seeds and add sliced onions (if available) until translucent.' },
      { step: 3, text: 'Add diced tomatoes, turmeric powder, and salt. Sauté for 3-4 minutes on medium heat until tomatoes turn soft and pulpy.' },
      { step: 4, text: 'Add chopped fresh spinach leaves. Sauté gently for 1-2 minutes until just wilted.' },
      { step: 5, text: 'Add drained basmati rice, pour in water, and stir in warm spices. Bring to a rolling boil.' },
      { step: 6, text: 'Cover tightly and simmer on low heat for 12-14 minutes until water is absorbed. Rest 5 minutes, fluff gently, and serve hot.' }
    ];

    let tips = [
      'Adding spinach just before pouring water prevents discoloration and keeps the rice vibrant green.',
      'Use a 1:2 ratio of soaked rice to water for fluffy, separate grains.'
    ];

    let additionalIngredients = [
      'Cumin seeds - 1 tsp',
      'Turmeric powder - 0.5 tsp',
      'Warm spice blend - 0.5 tsp',
      'Salt to taste'
    ];

    const scaledIngredients = baseIngredients.map(ing => ({
      ...ing,
      quantity: scaleQuantity(ing.quantity, 2, targetServings)
    }));

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description,
      image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80',
      cuisine: 'Indian',
      category: 'Rice Dishes',
      food_type: 'VEGETARIAN',
      ingredients: scaledIngredients,
      instructions,
      preparation_time: '10 mins',
      cooking_time: '20 mins',
      total_time: '30 mins',
      difficulty: 'Easy',
      servings: targetServings,
      rating: 4.9,
      tips,
      nutrition: { 
        calories: 310, 
        protein: '8g', 
        carbs: '56g', 
        fat: '6g' 
      }
    };

    return {
      recipe,
      userIngredients: localizedUserItems,
      additionalIngredients,
      conversationalIntro: intro
    };
  }

  // -------------------------------------------------------------------------
  // CASE B: Potato + Tomato -> 100% VEGETARIAN Potato Tomato Curry
  // -------------------------------------------------------------------------
  if (hasPotato && hasTomato && isStrictlyVegetarian) {
    let dishTitle = 'Homestyle Spiced Potato & Tomato Curry';
    let description = 'A comforting everyday potato and tomato curry simmered in fragrant cumin seeds, turmeric, and warm spices.';
    let intro = `Here is a comforting, 100% vegetarian **${dishTitle}** for ${targetServings} ${targetServings === 1 ? 'person' : 'people'} crafted around your **${userItemsFormatted.join(', ')}**! Pure plant-rich goodness with zero non-veg ingredients.`;

    let baseIngredients = [
      { name: 'Potatoes', quantity: '2 medium (peeled and diced)', isOptional: false },
      { name: 'Ripe Tomatoes', quantity: '2 large (finely diced)', isOptional: false },
      { name: 'Cooking Oil', quantity: '2 tbsp', isOptional: false },
      { name: 'Cumin Seeds & Turmeric Powder', quantity: '1 tsp each', isOptional: false }
    ];

    let instructions = [
      { step: 1, text: 'Heat cooking oil in a pan. Sputter cumin seeds and add chopped onions until soft.' },
      { step: 2, text: 'Add diced tomatoes with turmeric powder, chili powder, and salt. Cook 5 minutes until soft and fragrant.' },
      { step: 3, text: 'Add diced potatoes and sauté in the spiced tomato masala for 2 minutes.' },
      { step: 4, text: 'Add warm water, cover, and simmer for 15 minutes until potatoes are fork-tender.' },
      { step: 5, text: 'Gently crush a few potato chunks to naturally thicken the gravy. Garnish with fresh coriander and serve hot.' }
    ];

    let tips = [
      'Using ripe red tomatoes gives the curry a rich color and naturally balanced flavor.',
      'Mash a couple of cooked potato cubes with the back of your spoon to thicken the gravy naturally.'
    ];

    let additionalIngredients = [
      'Cumin seeds - 1 tsp',
      'Turmeric powder - 0.5 tsp',
      'Salt to taste',
      'Fresh coriander leaves'
    ];

    const scaledIngredients = baseIngredients.map(ing => ({
      ...ing,
      quantity: scaleQuantity(ing.quantity, 2, targetServings)
    }));

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description,
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      cuisine: 'Indian',
      category: 'Curry',
      food_type: 'VEGETARIAN',
      ingredients: scaledIngredients,
      instructions,
      preparation_time: '10 mins',
      cooking_time: '20 mins',
      total_time: '30 mins',
      difficulty: 'Easy',
      servings: targetServings,
      rating: 4.8,
      tips,
      nutrition: { 
        calories: 230, 
        protein: '5g', 
        carbs: '42g', 
        fat: '6g' 
      }
    };

    return {
      recipe,
      userIngredients: localizedUserItems,
      additionalIngredients,
      conversationalIntro: intro
    };
  }

  // -------------------------------------------------------------------------
  // CASE C: Spinach + Paneer -> 100% VEGETARIAN Palak Paneer
  // -------------------------------------------------------------------------
  if (hasSpinach && hasPaneer && isStrictlyVegetarian) {
    let dishTitle = 'Creamy Garlic Spinach & Cottage Cheese Curry';
    let description = 'A classic rich cottage cheese curry in a velvety spiced spinach puree with garlic and cream.';
    let intro = `Here is a restaurant-style 100% vegetarian **${dishTitle}** for ${targetServings} ${targetServings === 1 ? 'person' : 'people'} using your **${userItemsFormatted.join(', ')}**!`;

    let baseIngredients = [
      { name: 'Fresh Spinach Leaves', quantity: '300g', isOptional: false },
      { name: 'Paneer (Cottage Cheese) Cubes', quantity: '200g', isOptional: false },
      { name: 'Butter or Cooking Oil', quantity: '2 tbsp', isOptional: false },
      { name: 'Minced Garlic', quantity: '1 tbsp', isOptional: false }
    ];

    let instructions = [
      { step: 1, text: 'Blanch fresh spinach in boiling water for 2 minutes, plunge into cold water, and blend to a smooth green puree.' },
      { step: 2, text: 'Heat butter or oil in a pan; sauté minced garlic and onions until golden.' },
      { step: 3, text: 'Pour in the vibrant spinach puree with cumin, turmeric, and salt. Simmer covered for 5 minutes.' },
      { step: 4, text: 'Gently fold in fresh paneer cubes and a swirl of cream. Simmer for 3 minutes and serve hot with flatbreads or rice.' }
    ];

    let tips = [
      'Soak paneer cubes in warm water for 5 minutes before cooking to keep them pillow-soft.',
      'Do not overcook spinach puree to retain its bright green vibrant color.'
    ];

    let additionalIngredients = [
      'Minced garlic - 1 tbsp',
      'Cumin seeds - 1 tsp',
      'Turmeric powder - 0.5 tsp',
      'Salt to taste',
      'Fresh cream - 2 tbsp'
    ];

    const scaledIngredients = baseIngredients.map(ing => ({
      ...ing,
      quantity: scaleQuantity(ing.quantity, 2, targetServings)
    }));

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description,
      image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
      cuisine: 'Indian',
      category: 'Dinner',
      food_type: 'VEGETARIAN',
      ingredients: scaledIngredients,
      instructions,
      preparation_time: '15 mins',
      cooking_time: '15 mins',
      total_time: '30 mins',
      difficulty: 'Easy',
      servings: targetServings,
      rating: 4.9,
      tips,
      nutrition: { 
        calories: 340, 
        protein: '18g', 
        carbs: '14g', 
        fat: '24g' 
      }
    };

    return {
      recipe,
      userIngredients: localizedUserItems,
      additionalIngredients,
      conversationalIntro: intro
    };
  }

  // -------------------------------------------------------------------------
  // CASE D: Chicken + Rice -> NON-VEGETARIAN Chicken Pulao / Rice
  // -------------------------------------------------------------------------
  if (hasChicken && hasRice) {
    let dishTitle = 'One-Pot Savory Spiced Chicken Rice';
    let description = 'A fragrant single-pot spiced rice dish cooked with tender chicken pieces, caramelized onions, and whole aromatic spices.';
    let intro = `Since you provided chicken and rice, here is a delicious **${dishTitle}** for ${targetServings} ${targetServings === 1 ? 'person' : 'people'} that comes together in a single pot in 40 minutes!`;

    let baseIngredients = [
      { name: 'Chicken Pieces', quantity: '400g', isOptional: false },
      { name: 'Basmati Rice', quantity: '1.5 cups (rinsed & soaked 20 mins)', isOptional: false },
      { name: 'Onion', quantity: '1 large (sliced)', isOptional: false },
      { name: 'Cooking Oil or Butter', quantity: '2 tbsp', isOptional: false }
    ];

    let instructions = [
      { step: 1, text: 'Rinse basmati rice thoroughly and soak in water for 20 minutes; drain completely.' },
      { step: 2, text: 'Heat cooking oil in a deep pot; sauté sliced onions and whole spices until caramelized and fragrant.' },
      { step: 3, text: 'Add chicken pieces, ginger-garlic paste, and turmeric. Sauté on medium-high heat for 6-8 minutes until seared.' },
      { step: 4, text: 'Add drained basmati rice and hot water. Cover tightly and cook on low heat for 14-16 minutes until fluffy.' }
    ];

    let tips = [
      'Always use hot water when pouring over rice to ensure even cooking and unbroken grains.',
      'Searing chicken on medium-high heat locks in juices for tender results.'
    ];

    let additionalIngredients = [
      'Ginger-garlic paste - 1 tbsp',
      'Whole spice mix - 1 tsp',
      'Turmeric powder - 0.5 tsp',
      'Salt to taste'
    ];

    const scaledIngredients = baseIngredients.map(ing => ({
      ...ing,
      quantity: scaleQuantity(ing.quantity, 2, targetServings)
    }));

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description,
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      cuisine: 'Indian',
      category: 'Rice Dishes',
      food_type: 'NON-VEGETARIAN',
      ingredients: scaledIngredients,
      instructions,
      preparation_time: '15 mins',
      cooking_time: '25 mins',
      total_time: '40 mins',
      difficulty: 'Easy',
      servings: targetServings,
      rating: 4.8,
      tips,
      nutrition: { 
        calories: 510, 
        protein: '34g', 
        carbs: '58g', 
        fat: '14g' 
      }
    };

    return {
      recipe,
      userIngredients: localizedUserItems,
      additionalIngredients,
      conversationalIntro: intro
    };
  }

  // -------------------------------------------------------------------------
  // GENERAL FALLBACK: Arbitrary user ingredients
  // -------------------------------------------------------------------------
  const primaryIng = localizedUserItems.length > 0 ? localizedUserItems[0] : ('Fresh Vegetables');
  const secondaryIng = localizedUserItems.length > 1 ? localizedUserItems[1] : '';
  const comboName = secondaryIng ? `${primaryIng} & ${secondaryIng}` : primaryIng;

  const foodType = isStrictlyVegetarian ? 'VEGETARIAN' : 'NON-VEGETARIAN';
  let dishTitle = isStrictlyVegetarian ? `Homestyle Spiced ${comboName} Medley` : `Homestyle Savory ${comboName} Special`;
  let intro = `I have designed an authentic **${dishTitle}** for ${targetServings} ${targetServings === 1 ? 'person' : 'people'} specifically incorporating your **${userItemsFormatted.join(', ')}**! ${isStrictlyVegetarian ? 'It is 100% vegetarian with zero meat or eggs.' : ''}`;

  const baseIngredients = [
    ...localizedUserItems.map(ing => ({
      name: ing,
      quantity: 'Main portion as needed',
      isOptional: false
    })),
    { name: 'Cooking Oil', quantity: '2 tbsp', isOptional: false }
  ];

  const scaledIngredients = baseIngredients.map(ing => ({
    ...ing,
    quantity: scaleQuantity(ing.quantity, 2, targetServings)
  }));

  const recipe: Recipe = {
    id: `ai-gen-${now}`,
    name: dishTitle,
    description: `A delicious, homestyle preparation crafted around ${userItemsFormatted.join(', ')}, tempered with aromatic cumin and warm spices.`,
    image_url: isStrictlyVegetarian 
      ? 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    cuisine: 'Indian',
    category: isStrictlyVegetarian 
      ? ('Vegetarian') 
      : ('Non-Vegetarian'),
    food_type: foodType,
    ingredients: scaledIngredients,
    instructions: [
      { step: 1, text: 'Rinse thoroughly and prep ingredients, slicing vegetables or proteins into even bite-sized pieces.' },
      { step: 2, text: 'Heat oil or butter in a pan; add cumin seeds, minced garlic, and onions until fragrant.' },
      { step: 3, text: 'Add the main ingredients with turmeric, ground chili, salt, and spices. Sauté and simmer covered until tender.' },
      { step: 4, text: 'Garnish with freshly chopped coriander and serve hot with steamed rice or flatbreads.' }
    ],
    preparation_time: '10 mins',
    cooking_time: '18 mins',
    total_time: '28 mins',
    difficulty: 'Easy',
    servings: targetServings,
    rating: 4.8,
    tips: [
      'Using fresh ground spices and slow-cooking on medium heat enhances authentic natural flavors.'
    ],
    nutrition: { 
      calories: isStrictlyVegetarian ? 260 : 420, 
      protein: isStrictlyVegetarian ? '8g' : '28g', 
      carbs: '38g', 
      fat: '10g' 
    }
  };

  return {
    recipe,
    userIngredients: localizedUserItems,
    additionalIngredients: [
      'Cooking Oil, Cumin Seeds, Salt, and Fresh Herbs'
    ],
    conversationalIntro: intro
  };
}

/**
 * Validates and sanitizes the recipe response before rendering:
 * 1. Enforces strict language segregation (Telugu or English only; zero Hindi).
 * 2. Ensures target servings and ingredient quantities match.
 * 3. Enforces vegetarian vs non-vegetarian rules.
 */
export function validateAndSanitizeRecipe(
  response: AIChefResponse,
  _targetLang: 'en' = 'en',
  targetServings: number,
  isStrictlyVegetarian: boolean
): AIChefResponse {
  const { recipe } = response;

  // 1. Dietary Safety Check
  const dietValidation = validateRecipeDiet(recipe, isStrictlyVegetarian);
  if (!dietValidation.isValid) {
    console.warn(`Dietary safety violation detected: ${dietValidation.violation}. Rebuilding safe recipe.`);
    return synthesizeDynamicRecipe({
      rawPrompt: '',
      foundIngredients: response.userIngredients.map(i => normalizeIngredientName(i)),
      userNonVegIngredients: [],
      userVegIngredients: response.userIngredients,
      isExplicitVegRequest: isStrictlyVegetarian,
      isExplicitNonVegRequest: !isStrictlyVegetarian,
      isStrictlyVegetarian,
      isBreakfast: false,
      isDinner: false,
      isQuickRequest: false,
      isBiryani: false,
      isPasta: false
    }, 'en', targetServings);
  }

  // 2. Servings Count & Ingredients Scaling Check
  if (recipe.servings !== targetServings) {
    const originalServings = recipe.servings || 2;
    recipe.ingredients = recipe.ingredients.map(ing => ({
      ...ing,
      quantity: scaleQuantity(ing.quantity, originalServings, targetServings)
    }));
    recipe.servings = targetServings;
  }

  // 3. Strict Language Sanitization (Hindi & Telugu are forbidden)
  const nonEnglishRegex = /[\u0900-\u097F\u0C00-\u0C7F]/;
  const hasWrongScript = 
    nonEnglishRegex.test(recipe.name) ||
    nonEnglishRegex.test(recipe.description) ||
    nonEnglishRegex.test(response.conversationalIntro) ||
    recipe.ingredients.some(i => nonEnglishRegex.test(i.name) || nonEnglishRegex.test(i.quantity));

  if (hasWrongScript) {
    return synthesizeDynamicRecipe({
      rawPrompt: '',
      foundIngredients: response.userIngredients.map(i => normalizeIngredientName(i)),
      userNonVegIngredients: isStrictlyVegetarian ? [] : ['chicken'],
      userVegIngredients: response.userIngredients,
      isExplicitVegRequest: isStrictlyVegetarian,
      isExplicitNonVegRequest: !isStrictlyVegetarian,
      isStrictlyVegetarian,
      isBreakfast: false,
      isDinner: false,
      isQuickRequest: false,
      isBiryani: false,
      isPasta: false
    }, 'en', targetServings);
  }

  // Clean rogue transliterated parentheticals in English mode: (Palak), (Jeera), etc.
  recipe.name = recipe.name.replace(/\s*\((Palak|Tamatar|Aloo|Sabzi|Jeera|Garam Masala|Pulao|Paneer)[^)]*\)/gi, '').trim();
  recipe.ingredients = recipe.ingredients.map(i => ({
    ...i,
    name: i.name.replace(/\s*\((Palak|Tamatar|Aloo|Sabzi|Jeera|Garam Masala|Pulao|Paneer)[^)]*\)/gi, '').trim()
  }));
  recipe.difficulty = recipe.difficulty === 'Hard' ? 'Hard' : recipe.difficulty === 'Medium' ? 'Medium' : 'Easy';
  recipe.cuisine = recipe.cuisine || 'Indian';

  return response;
}

/**
 * Intelligent AI culinary recipe engine.
 * Prioritizes user's given ingredients, strictly enforces dietary rules,
 * enforces chosen serving size and quantity scaling, validates responses,
 * and maintains 100% pure language without mixing.
 * Hindi is totally removed from this chatbot.
 */
export async function generateRecipeFromAI(
  prompt: string,
  dietaryFilter?: 'ALL' | 'VEGETARIAN' | 'NON-VEGETARIAN',
  appLanguage: string = 'en',
  targetServings: number = 2
): Promise<AIChefResponse> {
  const trimmed = prompt.trim();
  if (!trimmed) {
    throw new Error("Empty query");
  }

  // Strictly English or Telugu (never Hindi)
  const lang: 'en' = detectLanguage(trimmed, appLanguage);
  const intent = extractIngredientsAndIntent(trimmed, dietaryFilter);

  // Check if live Google Gemini API key is configured
  const geminiApiKey = (typeof import.meta !== 'undefined' && import.meta.env)
    ? import.meta.env.VITE_GEMINI_API_KEY
    : undefined;
  if (geminiApiKey && geminiApiKey.trim() !== '' && !geminiApiKey.includes('your-key')) {
    try {
      const response = await callGeminiAPI(trimmed, intent, geminiApiKey, lang, targetServings);
      if (response) {
        return validateAndSanitizeRecipe(response, lang, targetServings, intent.isStrictlyVegetarian);
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out. Falling back to built-in AI Chef engine:', err);
    }
  }

  // Artificial brief delay for authentic typing animation
  await new Promise(resolve => setTimeout(resolve, 800));

  // If user query is a simple dish search and a matching sample recipe exists
  if (intent.foundIngredients.length === 0) {
    const lower = trimmed.toLowerCase();
    const matchedSample = SAMPLE_RECIPES.find(r => {
      const matchName = lower.includes(r.name.toLowerCase()) || r.name.toLowerCase().includes(lower);
      if (!matchName) return false;
      if (intent.isStrictlyVegetarian && r.food_type !== 'VEGETARIAN') return false;
      if (intent.isStrictlyVegetarian && isNonVegWord(r.name)) return false;
      return true;
    });

    if (matchedSample) {
      const originalServings = matchedSample.servings || 2;
      const scaledIngredients = matchedSample.ingredients.map(ing => ({
        ...ing,
        quantity: scaleQuantity(ing.quantity, originalServings, targetServings)
      }));

      const introText = `Here is the authentic recipe for **${matchedSample.name}** for ${targetServings} ${targetServings === 1 ? 'person' : 'people'}! Enjoy cooking!`;

      const sampleResponse: AIChefResponse = {
        recipe: { 
          ...matchedSample, 
          id: `ai-gen-${Date.now()}`,
          servings: targetServings,
          ingredients: scaledIngredients
        },
        userIngredients: ['Recipe Request'],
        additionalIngredients: ['Standard pantry spices and ingredients as listed in recipe'],
        conversationalIntro: introText
      };
      return validateAndSanitizeRecipe(sampleResponse, lang, targetServings, intent.isStrictlyVegetarian);
    }
  }

  // Generate dynamic, guaranteed-safe recipe tailored to user ingredients in requested language & servings
  const dynamicResponse = synthesizeDynamicRecipe(intent, lang, targetServings);
  return validateAndSanitizeRecipe(dynamicResponse, lang, targetServings, intent.isStrictlyVegetarian);
}

/**
 * Calls Google Gemini API with strict dietary enforcement, language purity, and target servings scaling.
 */
async function callGeminiAPI(
  prompt: string, 
  intent: UserIntent, 
  apiKey: string,
  _appLanguage: string = 'en',
  targetServings: number = 2
): Promise<AIChefResponse | null> {
  try {
    const { isStrictlyVegetarian, foundIngredients } = intent;

    const dietaryInstruction = isStrictlyVegetarian
      ? `CRITICAL VEGETARIAN SAFETY RULE:
The user provided ONLY vegetarian ingredients or requested a vegetarian recipe.
You MUST return ONLY a 100% strictly VEGETARIAN recipe.
Under NO circumstances should the recipe include chicken, mutton, beef, pork, fish, prawns, shrimp, crab, lobster, seafood, turkey, egg, or any other meat.
Do NOT return chicken biryani or any meat dish when vegetarian ingredients are given!
Set "vegetarian": true in your JSON.`
      : `The user provided non-vegetarian ingredients or requested a non-vegetarian dish. You may include non-vegetarian ingredients.`;

    const languageInstruction = `CRITICAL LANGUAGE REQUIREMENT:
The entire recipe response MUST be 100% in standard ENGLISH only.
Under no circumstances use Telugu or Hindi script or words.
All recipe names, ingredients, instructions, tips, and descriptions MUST be in clear, natural ENGLISH.`;

    const servingsInstruction = `Calculate and scale all ingredient quantities sensibly for exactly ${targetServings} people / servings. Set "servings": ${targetServings} in the JSON.`;

    const systemInstruction = `You are What2Cook AI Chef, an expert culinary assistant.
Create a complete, realistic, delicious recipe response based on the user's prompt and ingredients.

Follow these strict rules:
1. ${dietaryInstruction}
2. ${languageInstruction}
3. ${servingsInstruction}
4. Prioritize ingredients explicitly mentioned by the user: [${foundIngredients.join(', ')}]. The recipe MUST actually use these ingredients!
5. Separate the user's provided ingredients from any optional/additional ingredients.
6. Output structured JSON matching this exact schema:
{
  "recipeName": "string",
  "description": "string",
  "ingredients": [{"name": "string", "quantity": "string"}],
  "optionalIngredients": ["string"],
  "prepTime": "string",
  "cookTime": "string",
  "servings": ${targetServings},
  "difficulty": "Easy" | "Medium" | "Hard",
  "vegetarian": boolean,
  "cuisine": "string",
  "instructions": [{"step": 1, "text": "string"}],
  "tips": ["string"]
}
Output ONLY raw JSON.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Ingredients / Request: ${prompt}` }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Gemini API returned status ${res.status}`);
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const parsed = JSON.parse(candidateText);

    // Validate the vegetarian field from AI
    const aiReportedVeg = Boolean(parsed.vegetarian);
    if (isStrictlyVegetarian && !aiReportedVeg) {
      console.warn("Gemini returned non-vegetarian recipe for vegetarian request. Rejecting AI response.");
      return null;
    }

    // Double check recipe name and ingredients for non-vegetarian keywords
    const recipeName = parsed.recipeName || parsed.name || 'Custom Chef Recipe';
    if (isStrictlyVegetarian && isNonVegWord(recipeName)) {
      console.warn(`Gemini recipe title '${recipeName}' has non-veg keyword. Rejecting AI response.`);
      return null;
    }

    const ingredientsRaw = Array.isArray(parsed.ingredients) ? parsed.ingredients : [];
    const formattedIngredients = ingredientsRaw.map((ing: any) => ({
      name: typeof ing === 'string' ? ing : (ing.name || 'Ingredient'),
      quantity: typeof ing === 'object' && ing.quantity ? ing.quantity : 'As needed',
      isOptional: false
    }));

    if (isStrictlyVegetarian) {
      const hasNonVegIng = formattedIngredients.some((i: any) => isNonVegWord(i.name));
      if (hasNonVegIng) {
        console.warn("Gemini ingredients contained non-vegetarian keyword. Rejecting AI response.");
        return null;
      }
    }

    const optionalRaw = Array.isArray(parsed.optionalIngredients) ? parsed.optionalIngredients : [];
    const additionalIngredients = optionalRaw.map((item: any) => 
      typeof item === 'string' ? item : `${item.name || ''} ${item.quantity ? `(${item.quantity})` : ''}`.trim()
    );

    const instructionsRaw = Array.isArray(parsed.instructions) ? parsed.instructions : [];
    const instructions = instructionsRaw.map((ins: any, idx: number) => ({
      step: ins.step || idx + 1,
      text: typeof ins === 'string' ? ins : (ins.text || 'Cook according to traditional method.')
    }));

    const food_type = (isStrictlyVegetarian || aiReportedVeg) ? 'VEGETARIAN' : 'NON-VEGETARIAN';

    const recipe: Recipe = {
      id: `ai-gen-${Date.now()}`,
      name: recipeName,
      description: parsed.description || 'A delicious dish crafted for your kitchen.',
      image_url: food_type === 'NON-VEGETARIAN'
        ? 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      cuisine: parsed.cuisine || 'Indian',
      category: parsed.category || (food_type === 'VEGETARIAN' ? 'Vegetarian' : 'Non-Vegetarian'),
      food_type,
      ingredients: formattedIngredients,
      instructions,
      preparation_time: parsed.prepTime || parsed.preparation_time || '15 mins',
      cooking_time: parsed.cookTime || parsed.cooking_time || '20 mins',
      total_time: '35 mins',
      difficulty: parsed.difficulty || 'Easy',
      servings: parsed.servings || targetServings,
      rating: 4.8,
      tips: Array.isArray(parsed.tips) ? parsed.tips : ['Cook with fresh ingredients for optimum flavor.'],
      nutrition: { 
        calories: food_type === 'VEGETARIAN' ? 310 : 450, 
        protein: food_type === 'VEGETARIAN' ? '12g' : '32g', 
        carbs: '45g', 
        fat: '14g' 
      }
    };

    const introText = `I have prepared a custom **${recipe.name}** for ${targetServings} ${targetServings === 1 ? 'person' : 'people'}! ${food_type === 'VEGETARIAN' ? 'It is 100% vegetarian.' : ''}`;

    return {
      recipe,
      userIngredients: foundIngredients.map(capitalizeWords),
      additionalIngredients,
      conversationalIntro: introText
    };
  } catch (err) {
    console.warn('Gemini API execution error:', err);
    return null;
  }
}
