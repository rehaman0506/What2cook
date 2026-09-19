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
/**
 * Intelligently searches SAMPLE_RECIPES for an authentic match based on:
 * 1. Direct dish title in prompt (e.g., "Chicken Biryani", "Palak Paneer", "Pasta", "Dosa")
 * 2. Popular dish keyword and alias mappings across 66 dishes
 * 3. High-confidence ingredient overlap
 */
export function matchSampleRecipe(
  prompt: string,
  intent: UserIntent,
  targetServings: number = 2
): AIChefResponse | null {
  const { foundIngredients, isStrictlyVegetarian } = intent;
  const lowerPrompt = prompt.toLowerCase();

  // 1. Direct Dish Title Match
  for (const recipe of SAMPLE_RECIPES) {
    if (isStrictlyVegetarian && recipe.food_type !== 'VEGETARIAN') continue;
    if (isStrictlyVegetarian && isNonVegWord(recipe.name)) continue;

    const lowerName = recipe.name.toLowerCase();
    if (lowerPrompt.includes(lowerName)) {
      return buildSampleResponse(recipe, foundIngredients, targetServings);
    }

    // Core words matching (e.g. "Chicken Dum Biryani" in "how to make chicken dum biryani")
    const coreWords = lowerName
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => !['and', 'with', 'the', 'indian', 'style', 'classic', 'royal', 'south', 'north', 'street', 'homestyle', 'fragrant', 'crispy', 'steamed'].includes(w));

    if (coreWords.length >= 2) {
      const matchCount = coreWords.filter(w => lowerPrompt.includes(w)).length;
      if (matchCount >= 2 && matchCount === coreWords.length) {
        return buildSampleResponse(recipe, foundIngredients, targetServings);
      }
    }
  }

  // 2. Keyword & Alias Mapping to authentic sample recipes
  const KEYWORD_MAP: Array<{ keywords: string[]; recipeId: string }> = [
    // Biryanis & Rice
    { keywords: ['chicken biryani', 'murgh biryani'], recipeId: 'rec-01' },
    { keywords: ['mutton biryani', 'gosht biryani'], recipeId: 'rec-45' },
    { keywords: ['veg biryani', 'vegetable biryani', 'dum biryani'], recipeId: isStrictlyVegetarian ? 'rec-02' : 'rec-01' },
    { keywords: ['biryani'], recipeId: isStrictlyVegetarian ? 'rec-02' : 'rec-01' },
    { keywords: ['chicken fried rice', 'fried rice'], recipeId: isStrictlyVegetarian ? 'rec-03' : 'rec-06' },
    { keywords: ['jeera rice', 'cumin rice'], recipeId: 'rec-03' },
    { keywords: ['curd rice'], recipeId: 'rec-04' },
    { keywords: ['lemon rice'], recipeId: 'rec-05' },

    // Indian Curries & Gravies
    { keywords: ['butter chicken', 'murgh makhani'], recipeId: 'rec-14' },
    { keywords: ['chettinad chicken', 'pepper chicken'], recipeId: 'rec-15' },
    { keywords: ['paneer butter masala', 'paneer butter', 'paneer makhani'], recipeId: 'rec-13' },
    { keywords: ['palak paneer', 'spinach paneer'], recipeId: 'rec-47' },
    { keywords: ['dal makhani', 'dal', 'daal', 'dal tadka'], recipeId: 'rec-16' },
    { keywords: ['chana masala', 'chole', 'chickpea'], recipeId: 'rec-17' },
    { keywords: ['fish curry', 'malabar fish'], recipeId: 'rec-18' },
    { keywords: ['rogan josh', 'kashmiri rogan josh'], recipeId: 'rec-19' },
    { keywords: ['gongura mutton', 'andhra mutton'], recipeId: 'rec-46' },
    { keywords: ['prawns', 'shrimp', 'garlic prawns'], recipeId: 'rec-64' },
    { keywords: ['khichdi', 'moong dal khichdi'], recipeId: 'rec-52' },
    { keywords: ['kurma', 'vegetable kurma', 'parotta'], recipeId: 'rec-51' },
    { keywords: ['thai green curry', 'thai curry'], recipeId: 'rec-23' },

    // Indo-Chinese
    { keywords: ['chili chicken', 'chilli chicken'], recipeId: 'rec-49' },
    { keywords: ['veg manchurian', 'manchurian'], recipeId: 'rec-48' },
    { keywords: ['noodles', 'hakka noodles', 'chowmein'], recipeId: 'rec-50' },

    // Breakfast Specialties
    { keywords: ['masala dosa', 'dosa'], recipeId: 'rec-07' },
    { keywords: ['idli', 'medu vada', 'vada'], recipeId: 'rec-08' },
    { keywords: ['poha', 'kanda poha'], recipeId: 'rec-09' },
    { keywords: ['aloo paratha', 'paratha'], recipeId: 'rec-10' },
    { keywords: ['masala omelette', 'omelette', 'egg omelette'], recipeId: 'rec-11' },
    { keywords: ['pancakes', 'blueberry pancakes'], recipeId: 'rec-12' },

    // Continental & Italian
    { keywords: ['pizza', 'margherita'], recipeId: 'rec-20' },
    { keywords: ['pasta', 'fettuccine alfredo', 'alfredo'], recipeId: 'rec-21' },
    { keywords: ['mac and cheese', 'macaroni', 'mac & cheese'], recipeId: 'rec-53' },
    { keywords: ['bruschetta', 'tomato bruschetta'], recipeId: 'rec-28' },
    { keywords: ['salmon', 'grilled salmon'], recipeId: 'rec-24' },
    { keywords: ['garlic bread'], recipeId: 'rec-63' },
    { keywords: ['caesar salad'], recipeId: 'rec-36' },
    { keywords: ['greek salad', 'salad'], recipeId: 'rec-35' },

    // Mexican
    { keywords: ['tacos', 'street tacos', 'taco'], recipeId: 'rec-54' },
    { keywords: ['quesadillas', 'quesadilla'], recipeId: 'rec-22' },

    // Fast Food & Snacks
    { keywords: ['burger', 'cheeseburger', 'smash burger'], recipeId: isStrictlyVegetarian ? 'rec-32' : 'rec-31' },
    { keywords: ['french fries', 'potato fries', 'fries'], recipeId: 'rec-55' },
    { keywords: ['chicken 65'], recipeId: 'rec-26' },
    { keywords: ['buffalo wings', 'chicken wings', 'wings'], recipeId: 'rec-56' },
    { keywords: ['paneer tikka', 'tandoori paneer'], recipeId: 'rec-27' },
    { keywords: ['samosa'], recipeId: 'rec-25' },
    { keywords: ['pav bhaji'], recipeId: 'rec-29' },
    { keywords: ['pani puri', 'golgappa', 'golgappe'], recipeId: 'rec-30' },
    { keywords: ['bhel puri', 'chaat'], recipeId: 'rec-59' },
    { keywords: ['egg roll', 'kathi roll', 'egg kathi roll'], recipeId: 'rec-60' },
    { keywords: ['onion pakoda', 'pakoda', 'bhajiya'], recipeId: 'rec-66' },

    // Soups
    { keywords: ['tomato soup', 'cream of tomato'], recipeId: 'rec-33' },
    { keywords: ['hot and sour', 'chicken soup'], recipeId: 'rec-34' },
    { keywords: ['sweet corn soup', 'corn soup'], recipeId: 'rec-57' },
    { keywords: ['minestrone', 'vegetable soup'], recipeId: 'rec-58' },

    // Desserts & Beverages
    { keywords: ['gulab jamun'], recipeId: 'rec-37' },
    { keywords: ['rasmalai'], recipeId: 'rec-38' },
    { keywords: ['gajar ka halwa', 'gajar halwa', 'carrot halwa'], recipeId: 'rec-39' },
    { keywords: ['chocolate lava cake', 'lava cake', 'cake'], recipeId: 'rec-40' },
    { keywords: ['tiramisu'], recipeId: 'rec-41' },
    { keywords: ['shahi tukda'], recipeId: 'rec-65' },
    { keywords: ['mango lassi', 'lassi'], recipeId: 'rec-42' },
    { keywords: ['masala chai', 'chai', 'tea'], recipeId: 'rec-43' },
    { keywords: ['filter coffee', 'degree filter coffee', 'coffee'], recipeId: 'rec-62' },
    { keywords: ['badam milk', 'almond milk'], recipeId: 'rec-61' },
    { keywords: ['mojito', 'virgin mojito'], recipeId: 'rec-44' }
  ];

  for (const mapping of KEYWORD_MAP) {
    if (mapping.keywords.some(k => lowerPrompt.includes(k))) {
      const matched = SAMPLE_RECIPES.find(r => r.id === mapping.recipeId);
      if (matched) {
        if (!isStrictlyVegetarian || (matched.food_type === 'VEGETARIAN' && !isNonVegWord(matched.name))) {
          return buildSampleResponse(matched, foundIngredients, targetServings);
        }
      }
    }
  }

  // 3. High-Confidence Ingredient Overlap Matching
  if (foundIngredients.length > 0) {
    let highestScore = 0;
    let topRecipe: Recipe | null = null;

    for (const recipe of SAMPLE_RECIPES) {
      if (isStrictlyVegetarian && recipe.food_type !== 'VEGETARIAN') continue;
      if (isStrictlyVegetarian && isNonVegWord(recipe.name)) continue;

      let score = 0;
      const lowerRecName = recipe.name.toLowerCase();
      const lowerRecIngs = recipe.ingredients.map(i => i.name.toLowerCase());

      for (const userIng of foundIngredients) {
        const u = userIng.toLowerCase();
        if (lowerRecName.includes(u)) score += 20;
        if (lowerRecIngs.some(ri => ri.includes(u))) score += 10;
      }

      if (score > highestScore) {
        highestScore = score;
        topRecipe = recipe;
      }
    }

    if (highestScore >= 15 && topRecipe) {
      return buildSampleResponse(topRecipe, foundIngredients, targetServings);
    }
  }

  return null;
}

/**
 * Builds a rich, scaled AIChefResponse from an authentic sample recipe.
 */
function buildSampleResponse(
  recipe: Recipe,
  foundIngredients: string[],
  targetServings: number
): AIChefResponse {
  const originalServings = recipe.servings || 2;
  const scaledIngredients = recipe.ingredients.map(ing => ({
    ...ing,
    quantity: scaleQuantity(ing.quantity, originalServings, targetServings)
  }));

  const userMatchedItems = foundIngredients.map(capitalizeWords);
  const additionalItems = recipe.ingredients
    .filter(i => !foundIngredients.some(u => i.name.toLowerCase().includes(u.toLowerCase())))
    .map(i => `${i.name} (${scaleQuantity(i.quantity, originalServings, targetServings)})`);

  const introText = userMatchedItems.length > 0
    ? `I have crafted the authentic recipe for **${recipe.name}** for ${targetServings} ${targetServings === 1 ? 'person' : 'people'} featuring your **${userMatchedItems.join(', ')}**! Follow the full ingredients checklist and step-by-step cooking instructions below.`
    : `Here is the authentic, chef-tested recipe for **${recipe.name}** scaled for ${targetServings} ${targetServings === 1 ? 'person' : 'people'}. Enjoy cooking!`;

  return {
    recipe: {
      ...recipe,
      id: `ai-gen-${Date.now()}`,
      servings: targetServings,
      ingredients: scaledIngredients
    },
    userIngredients: userMatchedItems.length > 0 ? userMatchedItems : ['Recipe Request'],
    additionalIngredients: additionalItems.length > 0 ? additionalItems : ['Pantry spices and seasoning'],
    conversationalIntro: introText
  };
}

/**
 * Intelligently constructs an authentic, complete culinary recipe tailored
 * directly to the user's provided ingredients and chosen servings count.
 * Generates 10-12 complete ingredients and 6 detailed, dish-specific instructions.
 */
export function synthesizeDynamicRecipe(
  intent: UserIntent, 
  _lang: 'en' = 'en',
  targetServings: number = 2
): AIChefResponse {
  const { foundIngredients, isStrictlyVegetarian } = intent;
  const userItemsFormatted = foundIngredients.map(capitalizeWords);
  const now = Date.now();

  const primaryIng = userItemsFormatted.length > 0 ? userItemsFormatted[0] : 'Fresh Garden Vegetables';
  const secondaryIng = userItemsFormatted.length > 1 ? userItemsFormatted[1] : '';
  const comboName = secondaryIng ? `${primaryIng} & ${secondaryIng}` : primaryIng;

  const hasRice = foundIngredients.some(i => i.includes('rice'));
  const hasPasta = foundIngredients.some(i => ['pasta', 'penne', 'spaghetti', 'macaroni', 'noodle'].some(k => i.includes(k)));
  const hasChicken = foundIngredients.some(i => i.includes('chicken'));
  const hasMutton = foundIngredients.some(i => i.includes('mutton') || i.includes('lamb'));
  const hasSeafood = foundIngredients.some(i => ['fish', 'prawn', 'shrimp', 'crab'].some(k => i.includes(k)));
  const hasEgg = foundIngredients.some(i => i.includes('egg'));
  const hasPaneer = foundIngredients.some(i => i.includes('paneer'));
  const hasDal = foundIngredients.some(i => ['dal', 'lentil', 'chana', 'chickpea', 'rajma', 'beans'].some(k => i.includes(k)));

  const foodType = (isStrictlyVegetarian || (!hasChicken && !hasMutton && !hasSeafood && !hasEgg)) ? 'VEGETARIAN' : 'NON-VEGETARIAN';

  // 1. Determine culinary style, dish title, and category
  let dishTitle = '';
  let description = '';
  let category = '';
  let cuisine = 'Indian';
  let image_url = '';
  let prepTime = '15 mins';
  let cookTime = '20 mins';
  let totalTime = '35 mins';

  if (hasRice) {
    dishTitle = foodType === 'VEGETARIAN' 
      ? `Homestyle Spiced ${comboName} Pulao` 
      : `Savory Fragrant ${comboName} Rice`;
    description = `A fragrant one-pot spiced rice dish infused with tender ${comboName}, whole aromatic cumin seeds, caramelized onions, and warming spices.`;
    category = 'Rice Dishes';
    image_url = foodType === 'VEGETARIAN'
      ? 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80';
  } else if (hasPasta) {
    dishTitle = `Italian-Style Garlic Herb ${comboName} Skillet`;
    description = `Al dente pasta tossed with fresh ${comboName}, minced garlic, extra virgin olive oil, herbs, and finished with a touch of grated cheese.`;
    category = 'Dinner';
    cuisine = 'Italian';
    image_url = 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&auto=format&fit=crop&q=80';
  } else if (hasDal) {
    dishTitle = `Comforting Spiced ${comboName} Tadka Curry`;
    description = `Slow-simmered wholesome lentils with ${comboName}, tempered in golden ghee with garlic, cumin, and red chili.`;
    category = 'Curry';
    image_url = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80';
  } else {
    dishTitle = foodType === 'VEGETARIAN'
      ? `Homestyle Spiced ${comboName} Masala Curry`
      : `Rich Slow-Simmered ${comboName} Curry`;
    description = `A rich, aromatic everyday curry crafted around ${comboName}, simmered in a golden onion-tomato gravy with roasted ground spices.`;
    category = 'Curry';
    image_url = foodType === 'VEGETARIAN'
      ? (hasPaneer 
          ? 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80')
      : (hasSeafood
          ? 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1545247181-516773ca838b?w=800&auto=format&fit=crop&q=80');
  }

  // 2. Build complete realistic 10-12 ingredient list (base for 2 servings)
  const baseIngredients: Array<{ name: string; quantity: string; isOptional: boolean }> = [];

  // Add primary user ingredient
  if (primaryIng) {
    let pQty = '250g (cleaned & sliced)';
    if (hasChicken || hasMutton) pQty = '400g (cut into bite-sized pieces)';
    else if (hasRice) pQty = '1.5 cups (rinsed & soaked 20 mins)';
    else if (hasPasta) pQty = '200g (penne or fusilli)';
    else if (hasPaneer) pQty = '250g (cubed fresh)';
    else if (hasEgg) pQty = '4 whole eggs (boiled or whisked)';
    else if (hasSeafood) pQty = '300g (cleaned & deveined)';
    baseIngredients.push({ name: primaryIng, quantity: pQty, isOptional: false });
  }

  // Add secondary user ingredient if present
  if (secondaryIng) {
    baseIngredients.push({ name: secondaryIng, quantity: '1 cup (chopped evenly)', isOptional: false });
  }

  // Add any further user ingredients
  for (let i = 2; i < userItemsFormatted.length; i++) {
    baseIngredients.push({ name: userItemsFormatted[i], quantity: '1/2 cup (chopped)', isOptional: false });
  }

  // Add foundational aromatics and pantry spices
  baseIngredients.push(
    { name: 'Yellow Onion', quantity: '1 large (finely chopped)', isOptional: false },
    { name: 'Ginger-Garlic Paste', quantity: '1.5 tbsp (freshly ground)', isOptional: false },
    { name: 'Ripe Tomatoes', quantity: '2 medium (pureed or finely diced)', isOptional: false },
    { name: 'Cooking Oil or Pure Ghee', quantity: '2 tbsp', isOptional: false },
    { name: 'Whole Cumin Seeds (Jeera)', quantity: '1 tsp', isOptional: false },
    { name: 'Turmeric Powder', quantity: '0.5 tsp', isOptional: false },
    { name: 'Kashmiri Red Chili Powder', quantity: '1 tsp', isOptional: false },
    { name: 'Coriander-Cumin Powder', quantity: '1.5 tsp', isOptional: false },
    { name: 'Garam Masala Powder', quantity: '0.5 tsp', isOptional: false },
    { name: 'Iodized Salt', quantity: '1 tsp (or to taste)', isOptional: false },
    { name: 'Fresh Cilantro / Coriander Leaves', quantity: '2 tbsp (finely chopped)', isOptional: false }
  );

  // Scale all ingredient quantities accurately to targetServings
  const scaledIngredients = baseIngredients.map(ing => ({
    ...ing,
    quantity: scaleQuantity(ing.quantity, 2, targetServings)
  }));

  // 3. Build detailed, dish-specific 6-step cooking instructions
  const mainItemsList = userItemsFormatted.join(', ') || 'selected ingredients';
  const instructions = [
    {
      step: 1,
      text: `Preparation: Thoroughly clean and rinse ${mainItemsList}. Cut into uniform bite-sized pieces so that all ingredients cook evenly and absorb maximum flavor.`
    },
    {
      step: 2,
      text: `Tempering Aromatics: Heat cooking oil or ghee in a deep skillet or heavy-bottomed pot over medium flame. Add whole cumin seeds and let them crackle for 30 seconds. Add finely chopped onions and sauté until translucent and lightly caramelized (about 4-5 minutes).`
    },
    {
      step: 3,
      text: `Base Gravy & Spices: Stir in the ginger-garlic paste and sauté for 1 minute until fragrant. Add pureed tomatoes, turmeric powder, Kashmiri red chili powder, coriander-cumin powder, and salt. Cook on medium heat for 4-5 minutes until the masala thickens and oil begins to separate at the edges.`
    },
    {
      step: 4,
      text: `Cooking Main Ingredients: Add your prepared ${mainItemsList} into the spiced base. Gently toss on medium-high heat for 2-3 minutes to sear and coat with spices. Pour in warm water or broth (approx. 1 cup for 2 servings), bring to a gentle boil, then cover with a tight lid. Simmer on low heat for 12-15 minutes until tender and cooked through.`
    },
    {
      step: 5,
      text: `Flavor Blooming & Reduction: Remove the lid and check the tenderness of the ingredients. Sprinkle fragrant garam masala and stir gently. Allow the curry to simmer uncovered for 2 minutes until it reaches your preferred rich sauce consistency.`
    },
    {
      step: 6,
      text: `Garnish & Presentation: Turn off the heat and garnish generously with freshly chopped coriander leaves. Let the dish rest covered for 3 minutes before serving piping hot alongside steamed basmati rice, warm butter roti, or crusty artisan bread.`
    }
  ];

  const tips = [
    'Sautéing the tomato and spice base until oil separates from the edges unlocks deep restaurant-quality flavor.',
    'Cook on low-medium flame with the lid tightly closed to retain natural juices and aromatic moisture.'
  ];

  const recipe: Recipe = {
    id: `ai-gen-${now}`,
    name: dishTitle,
    description,
    image_url,
    cuisine,
    category,
    food_type: foodType,
    ingredients: scaledIngredients,
    instructions,
    preparation_time: prepTime,
    cooking_time: cookTime,
    total_time: totalTime,
    difficulty: 'Easy',
    servings: targetServings,
    rating: 4.8,
    tips,
    nutrition: { 
      calories: foodType === 'VEGETARIAN' ? 280 : 440, 
      protein: foodType === 'VEGETARIAN' ? '12g' : '32g', 
      carbs: '42g', 
      fat: '11g' 
    }
  };

  const additionalIngredients = [
    `Yellow Onion (${scaleQuantity('1 large', 2, targetServings)})`,
    `Ginger-Garlic Paste (${scaleQuantity('1.5 tbsp', 2, targetServings)})`,
    `Ripe Tomatoes (${scaleQuantity('2 medium', 2, targetServings)})`,
    `Cumin Seeds, Turmeric, Red Chili & Garam Masala`,
    `Cooking Oil or Ghee (${scaleQuantity('2 tbsp', 2, targetServings)})`
  ];

  const intro = `I have designed an authentic, complete **${dishTitle}** for ${targetServings} ${targetServings === 1 ? 'person' : 'people'} featuring your **${userItemsFormatted.join(', ')}**! ${foodType === 'VEGETARIAN' ? 'It is 100% vegetarian with zero meat or eggs.' : ''} Follow the full ingredients checklist and step-by-step cooking instructions below.`;

  return {
    recipe,
    userIngredients: userItemsFormatted,
    additionalIngredients,
    conversationalIntro: intro
  };
}

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

  // 1. Check if query matches or overlaps with one of our 66 authentic handcrafted sample recipes
  const sampleMatch = matchSampleRecipe(trimmed, intent, targetServings);
  if (sampleMatch) {
    return validateAndSanitizeRecipe(sampleMatch, lang, targetServings, intent.isStrictlyVegetarian);
  }

  // 2. Otherwise, dynamically synthesize a complete, chef-grade custom recipe tailored specifically to user ingredients
  const dynamicResponse = synthesizeDynamicRecipe(intent, lang, targetServings);
  return validateAndSanitizeRecipe(dynamicResponse, lang, targetServings, intent.isStrictlyVegetarian);
}

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
