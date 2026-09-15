import { Recipe } from '../types';
import { SAMPLE_RECIPES } from '../data/sampleRecipes';

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
 * Includes poultry, red meat, seafood, game, and eggs.
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
  'oysters'
];

/**
 * Checks if a word or string contains any non-vegetarian keyword.
 * Uses word-boundary matching to prevent false positives.
 */
export function isNonVegWord(text?: string | null): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return NON_VEG_KEYWORDS.some(kw => {
    const regex = new RegExp(`\\b${kw}s?\\b`, 'i');
    return regex.test(lower);
  });
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
export function extractIngredientsAndIntent(prompt: string): UserIntent {
  const lower = prompt.toLowerCase();

  // 1. Direct phrase separation (commas, '+', ' and ', '&')
  const directChunks = prompt
    .split(/[,+&]|\band\b/i)
    .map(c => c.replace(/^(i have|what can i make with|suggest|a recipe with|recipe using|how to cook|ingredients?:?)\s*/i, '').trim())
    .map(c => c.replace(/[^a-zA-Z\s-]/g, '').trim())
    .filter(c => c.length > 1 && !['i', 'have', 'with', 'using', 'want', 'food', 'recipe', 'make', 'cook', 'the', 'some'].includes(c.toLowerCase()));

  const foundIngredients: string[] = [];

  // Add recognized direct chunks
  for (const chunk of directChunks) {
    const norm = normalizeIngredientName(chunk);
    if (!foundIngredients.includes(norm)) {
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
  const isExplicitNonVegRequest = /\b(non-veg|non veg|meat)\b/i.test(lower) || hasNonVegWordInPrompt;
  const isExplicitVegRequest = /\b(veg|vegetarian|vegan|pure veg)\b/i.test(lower);

  // VEGETARIAN SAFETY RULE:
  // If user provided NO non-vegetarian ingredients and did NOT explicitly ask for non-veg:
  // vegetarian = true
  const isStrictlyVegetarian = !isExplicitNonVegRequest && userNonVegIngredients.length === 0;

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
  // If strictly vegetarian, verify:
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
 * directly to the user's provided ingredients.
 * Guarantees strict vegetarian compliance when isStrictlyVegetarian is true.
 */
export function synthesizeDynamicRecipe(intent: UserIntent): AIChefResponse {
  const { foundIngredients, isStrictlyVegetarian } = intent;

  const hasRice = foundIngredients.includes('rice') || foundIngredients.includes('basmati rice');
  const hasSpinach = foundIngredients.includes('spinach');
  const hasTomato = foundIngredients.includes('tomato');
  const hasPotato = foundIngredients.includes('potato');
  const hasOnion = foundIngredients.includes('onion');
  const hasPaneer = foundIngredients.includes('paneer');
  const hasChicken = foundIngredients.includes('chicken');
  const hasFish = foundIngredients.includes('fish');
  const hasPasta = foundIngredients.includes('pasta') || foundIngredients.includes('penne');

  const userItemsFormatted = foundIngredients.map(capitalizeWords);
  const now = Date.now();

  // -------------------------------------------------------------------------
  // CASE A: Spinach + Rice (+ Tomato / other veggies) -> 100% VEGETARIAN Pulao
  // -------------------------------------------------------------------------
  if (hasRice && hasSpinach && isStrictlyVegetarian) {
    const dishTitle = hasTomato 
      ? 'Homestyle Spiced Spinach & Tomato Pulao (Palak Tamatar Rice)'
      : 'Fragrant Garlic Spinach Rice (Palak Pulao)';

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description: `A fragrant, nutritious one-pot spiced rice dish infused with fresh tender spinach leaves${hasTomato ? ', tangy juicy tomatoes,' : ''} cumin seeds, and aromatic whole spices.`,
      image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80',
      cuisine: 'Indian',
      category: 'Rice Dishes',
      food_type: 'VEGETARIAN',
      ingredients: [
        { name: 'Basmati Rice', quantity: '1.5 cups (rinsed & soaked 20 mins)', isOptional: false },
        { name: 'Fresh Spinach (Palak)', quantity: '2 cups (washed & roughly chopped)', isOptional: false },
        ...(hasTomato ? [{ name: 'Ripe Tomatoes', quantity: '2 medium (finely diced)', isOptional: false }] : []),
        ...(hasOnion ? [{ name: 'Onion', quantity: '1 medium (thinly sliced)', isOptional: false }] : []),
        ...(hasPaneer ? [{ name: 'Paneer (Cottage Cheese)', quantity: '150g (cubed & lightly toasted)', isOptional: false }] : []),
        { name: 'Cooking Oil or Desi Ghee', quantity: '2 tbsp', isOptional: false }
      ],
      instructions: [
        { step: 1, text: 'Rinse basmati rice until water runs clear, then soak in water for 20 minutes and drain completely.' },
        { step: 2, text: 'Heat oil or ghee in a heavy-bottomed pot or pressure cooker. Sputter cumin seeds and add sliced onions (if using), cooking until translucent.' },
        { step: 3, text: hasTomato ? 'Add diced tomatoes, turmeric powder, and salt. Sauté for 3-4 minutes on medium heat until tomatoes turn soft and pulpy.' : 'Add minced garlic and a green chili, sautéing for 1 minute until fragrant.' },
        { step: 4, text: 'Add the chopped fresh spinach leaves. Sauté gently for 1-2 minutes until just wilted (do not overcook to preserve bright green vitamins).' },
        { step: 5, text: 'Add the drained basmati rice and gently toss for 1 minute to coat grains with the fragrant aromatics. Pour in 3 cups of water and garam masala.' },
        { step: 6, text: 'Bring to a rolling boil, cover tightly, and simmer on low heat for 12-14 minutes until all liquid is absorbed. Rest for 5 minutes, fluff gently with a fork, and serve hot with raita.' }
      ],
      preparation_time: '10 mins',
      cooking_time: '20 mins',
      total_time: '30 mins',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.9,
      tips: [
        'Adding spinach just before pouring water prevents discoloration and keeps the rice vibrant green.',
        'Use a 1:2 ratio of soaked rice to water for long, fluffy, separate grains.'
      ],
      nutrition: { calories: 310, protein: '8g', carbs: '56g', fat: '6g' }
    };

    const additionalIngredients = [
      'Cumin seeds (Jeera) - 1 tsp',
      'Turmeric powder - 1/2 tsp',
      'Garam Masala - 1/2 tsp',
      'Salt to taste',
      'Water (3 cups for cooking)'
    ];

    return {
      recipe,
      userIngredients: userItemsFormatted,
      additionalIngredients,
      conversationalIntro: `I have designed a 100% vegetarian **${dishTitle}** highlighting your **${userItemsFormatted.join(', ')}**! It is healthy, quick to make in 30 minutes, and completely free of any meat or non-vegetarian ingredients.`
    };
  }

  // -------------------------------------------------------------------------
  // CASE B: Potato + Onion + Tomato -> 100% VEGETARIAN Aloo Pyaaz Tamatar Sabzi
  // -------------------------------------------------------------------------
  if (hasPotato && hasTomato && isStrictlyVegetarian) {
    const dishTitle = 'Homestyle Spiced Aloo Tamatar Curry';

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description: 'A comforting, traditional North Indian everyday potato and juicy tomato curry simmered in fragrant cumin, turmeric, and warm ground spices.',
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      cuisine: 'North Indian',
      category: 'Dinner',
      food_type: 'VEGETARIAN',
      ingredients: [
        { name: 'Potatoes (Aloo)', quantity: '3 medium (peeled and diced)', isOptional: false },
        { name: 'Ripe Tomatoes', quantity: '3 large (finely diced or pureed)', isOptional: false },
        ...(hasOnion ? [{ name: 'Onion', quantity: '1 large (finely chopped)', isOptional: false }] : []),
        ...(hasSpinach ? [{ name: 'Fresh Spinach', quantity: '1.5 cups (chopped)', isOptional: false }] : []),
        { name: 'Cooking Oil', quantity: '2 tbsp', isOptional: false }
      ],
      instructions: [
        { step: 1, text: 'Heat oil in a pan. Sputter cumin seeds and add chopped onions, cooking until soft and golden.' },
        { step: 2, text: 'Add diced tomatoes with turmeric powder, red chili powder, and salt. Cook for 5 minutes until soft and oil separates.' },
        { step: 3, text: 'Add diced potatoes and sauté in the spiced tomato masala for 2 minutes.' },
        { step: 4, text: 'Add 1.5 cups of warm water, bring to a gentle boil, cover, and simmer for 15 minutes until potatoes are fork-tender.' },
        { step: 5, text: 'Crush 2-3 potato chunks with the back of your ladle to naturally thicken the gravy into a luscious consistency.' },
        { step: 6, text: 'Sprinkle garam masala and fresh coriander. Serve hot with rotis, pooris, or steamed rice.' }
      ],
      preparation_time: '10 mins',
      cooking_time: '20 mins',
      total_time: '30 mins',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.8,
      tips: [
        'Crushing a couple of cooked potato pieces naturally thickens the gravy without any cream or cornstarch.',
        'Use ripe red tomatoes for the richest color and sweet-tangy taste.'
      ],
      nutrition: { calories: 230, protein: '5g', carbs: '42g', fat: '6g' }
    };

    const additionalIngredients = [
      'Cumin seeds (Jeera) - 1 tsp',
      'Turmeric & Red Chili powder - 1/2 tsp each',
      'Garam Masala - 1/2 tsp',
      'Salt to taste',
      'Fresh coriander leaves for garnish'
    ];

    return {
      recipe,
      userIngredients: userItemsFormatted,
      additionalIngredients,
      conversationalIntro: `Here is a comforting, 100% vegetarian **${dishTitle}** crafted around your **${userItemsFormatted.join(', ')}**! Pure plant-rich goodness with zero non-veg ingredients.`
    };
  }

  // -------------------------------------------------------------------------
  // CASE C: Spinach + Paneer (+ Tomato) -> 100% VEGETARIAN Palak Paneer
  // -------------------------------------------------------------------------
  if (hasSpinach && hasPaneer && isStrictlyVegetarian) {
    const dishTitle = 'Dhaba-Style Palak Paneer with Fresh Tomatoes';

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description: 'Tender cottage cheese cubes simmered in a velvety spiced spinach puree balanced with tangy tomatoes, cumin, and garlic butter.',
      image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
      cuisine: 'North Indian',
      category: 'Dinner',
      food_type: 'VEGETARIAN',
      ingredients: [
        { name: 'Fresh Spinach (Palak)', quantity: '300g (washed & blanched)', isOptional: false },
        { name: 'Paneer (Cottage Cheese)', quantity: '200g (cubed)', isOptional: false },
        ...(hasTomato ? [{ name: 'Tomatoes', quantity: '2 ripe (finely pureed)', isOptional: false }] : []),
        ...(hasOnion ? [{ name: 'Onion', quantity: '1 medium (finely chopped)', isOptional: false }] : []),
        { name: 'Butter or Desi Ghee', quantity: '2 tbsp', isOptional: false }
      ],
      instructions: [
        { step: 1, text: 'Blanch spinach leaves in boiling water for 2 minutes, then immediately plunge into cold water to retain vibrant green color. Puree smoothly.' },
        { step: 2, text: 'Melt butter or ghee in a pan. Sauté cumin seeds, minced garlic, and onions until lightly golden.' },
        { step: 3, text: 'Stir in tomato puree, turmeric, chili powder, and salt. Cook until tomatoes are fragrant and reduced.' },
        { step: 4, text: 'Pour in the vibrant spinach puree and simmer gently for 5 minutes.' },
        { step: 5, text: 'Slide in paneer cubes and a pinch of garam masala. Simmer on low heat for 3 minutes so paneer absorbs the flavors.' },
        { step: 6, text: 'Finish with a swirl of fresh cream or butter and serve piping hot with garlic naan or roti.' }
      ],
      preparation_time: '15 mins',
      cooking_time: '15 mins',
      total_time: '30 mins',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.9,
      tips: [
        'Shocking blanched spinach in ice water locks in that signature emerald green color.',
        'Soak paneer cubes in warm salted water for 5 minutes before cooking for a melt-in-mouth soft texture.'
      ],
      nutrition: { calories: 340, protein: '18g', carbs: '14g', fat: '24g' }
    };

    const additionalIngredients = [
      'Garlic cloves - 4 (minced)',
      'Cumin seeds - 1 tsp',
      'Turmeric & Kashmiri chili - 1/2 tsp each',
      'Garam Masala - 1/2 tsp',
      'Salt to taste'
    ];

    return {
      recipe,
      userIngredients: userItemsFormatted,
      additionalIngredients,
      conversationalIntro: `Here is a restaurant-worthy 100% vegetarian **${dishTitle}** using your **${userItemsFormatted.join(', ')}**! Packed with protein and fresh greens.`
    };
  }

  // -------------------------------------------------------------------------
  // CASE D: Chicken + Rice -> NON-VEGETARIAN Chicken Pulao / Rice
  // -------------------------------------------------------------------------
  if (hasChicken && hasRice) {
    const dishTitle = 'One-Pot Savory Chicken Pulao';

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description: 'Fragrant long-grain basmati rice cooked in a single pot with juicy marinated chicken pieces, caramelized onions, and whole aromatic spices.',
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      cuisine: 'Indian',
      category: 'Rice Dishes',
      food_type: 'NON-VEGETARIAN',
      ingredients: [
        { name: 'Chicken', quantity: '400g (cut into bite-sized pieces)', isOptional: false },
        { name: 'Basmati Rice', quantity: '1.5 cups (rinsed & soaked 20 mins)', isOptional: false },
        ...(hasOnion ? [{ name: 'Onions', quantity: '1 large (thinly sliced)', isOptional: false }] : [{ name: 'Onion', quantity: '1 large (sliced)', isOptional: true }]),
        ...(hasTomato ? [{ name: 'Tomatoes', quantity: '2 medium (chopped)', isOptional: false }] : []),
        { name: 'Cooking Oil or Ghee', quantity: '2 tbsp', isOptional: false }
      ],
      instructions: [
        { step: 1, text: 'Rinse basmati rice and soak in water for 20 minutes, then drain.' },
        { step: 2, text: 'Heat oil or ghee in a heavy pot. Add whole spices (bay leaf, cardamom, cloves) and fry sliced onions until golden brown.' },
        { step: 3, text: 'Add chicken pieces with ginger-garlic paste, turmeric, and chili powder. Sauté on medium-high heat for 6-8 minutes until chicken turns white.' },
        { step: 4, text: 'Add soaked basmati rice and gently sauté with the chicken for 1 minute.' },
        { step: 5, text: 'Pour in 3 cups of hot water, add salt to taste, bring to a rolling boil, then cover and cook on low heat for 12-15 minutes.' },
        { step: 6, text: 'Rest for 5 minutes, fluff gently, and serve hot with cooling cucumber raita.' }
      ],
      preparation_time: '15 mins',
      cooking_time: '25 mins',
      total_time: '40 mins',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.8,
      tips: [
        'Searing the chicken pieces before adding rice seals in natural juices so the meat stays succulent.',
        'Use hot water when covering the rice to ensure even cooking.'
      ],
      nutrition: { calories: 510, protein: '34g', carbs: '58g', fat: '14g' }
    };

    const additionalIngredients = [
      'Ginger-garlic paste - 1.5 tbsp',
      'Whole spices (bay leaf, cloves, cardamom, cinnamon)',
      'Garam Masala - 1 tsp',
      'Salt to taste'
    ];

    return {
      recipe,
      userIngredients: userItemsFormatted,
      additionalIngredients,
      conversationalIntro: `Since you provided chicken and rice, here is a mouth-watering **${dishTitle}** that comes together in a single pot in 40 minutes!`
    };
  }

  // -------------------------------------------------------------------------
  // CASE E: Fish + Rice -> NON-VEGETARIAN Coastal Fish Curry with Rice
  // -------------------------------------------------------------------------
  if (hasFish && hasRice) {
    const dishTitle = 'Coastal Spiced Fish with Steamed Rice';

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description: 'Tender fresh fish steaks simmered in a tangy spiced tomato-onion curry, served alongside steaming fluffy white rice.',
      image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
      cuisine: 'Indian',
      category: 'Lunch',
      food_type: 'NON-VEGETARIAN',
      ingredients: [
        { name: 'Fresh Fish Steaks / Fillets', quantity: '400g', isOptional: false },
        { name: 'Rice', quantity: '1.5 cups', isOptional: false },
        ...(hasTomato ? [{ name: 'Tomatoes', quantity: '2 ripe (pureed)', isOptional: false }] : []),
        ...(hasOnion ? [{ name: 'Onion', quantity: '1 medium (sliced)', isOptional: false }] : []),
        { name: 'Cooking Oil', quantity: '2 tbsp', isOptional: false }
      ],
      instructions: [
        { step: 1, text: 'Cook rice in 3 cups of water until fluffy and tender. Keep warm.' },
        { step: 2, text: 'Marinate fish pieces with turmeric powder, red chili powder, and salt for 10 minutes.' },
        { step: 3, text: 'Heat oil in a pan. Sputter mustard seeds and curry leaves. Sauté onions and ginger-garlic until soft.' },
        { step: 4, text: 'Add tomatoes, coriander powder, and 1 cup of water. Bring to a gentle boil.' },
        { step: 5, text: 'Gently slide in the fish steaks. Cover and simmer on medium-low for 8-10 minutes until fish is cooked through.' },
        { step: 6, text: 'Squeeze a dash of fresh lemon juice and serve hot over freshly steamed rice.' }
      ],
      preparation_time: '15 mins',
      cooking_time: '20 mins',
      total_time: '35 mins',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.8,
      tips: [
        'Swirl the pan rather than using a hard spatula to avoid breaking the tender fish steaks.',
        'Fish cooks quickly; 8 to 10 minutes of gentle simmering is ideal.'
      ],
      nutrition: { calories: 420, protein: '32g', carbs: '52g', fat: '10g' }
    };

    const additionalIngredients = [
      'Mustard seeds & Curry leaves - 1 tsp',
      'Turmeric & Red Chili powder - 1 tsp each',
      'Lemon juice - 1 tbsp',
      'Salt to taste'
    ];

    return {
      recipe,
      userIngredients: userItemsFormatted,
      additionalIngredients,
      conversationalIntro: `Based on your fish and rice, here is an appetizing **${dishTitle}** featuring a rich homestyle coastal gravy!`
    };
  }

  // -------------------------------------------------------------------------
  // CASE F: Pasta + Veggies / Tomato -> 100% VEGETARIAN Pasta
  // -------------------------------------------------------------------------
  if (hasPasta && isStrictlyVegetarian) {
    const dishTitle = hasTomato 
      ? 'Rustic Garlic Tomato Basil Pasta' 
      : 'Creamy Garlic Herb Pasta';

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description: 'Al dente pasta tossed in a vibrant garlic, tomato, and extra virgin olive oil sauce, infused with fresh herbs and Italian seasoning.',
      image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop&q=80',
      cuisine: 'Italian',
      category: 'Dinner',
      food_type: 'VEGETARIAN',
      ingredients: [
        { name: 'Pasta (Penne, Fusilli, or Spaghetti)', quantity: '300g', isOptional: false },
        ...(hasTomato ? [{ name: 'Ripe Tomatoes', quantity: '3 large (finely diced or crushed)', isOptional: false }] : []),
        ...(hasSpinach ? [{ name: 'Baby Spinach', quantity: '1.5 cups', isOptional: false }] : []),
        ...(hasCheese() ? [{ name: 'Cheese (Mozzarella or Parmesan)', quantity: '1/2 cup grated', isOptional: false }] : []),
        { name: 'Extra Virgin Olive Oil', quantity: '2 tbsp', isOptional: false }
      ],
      instructions: [
        { step: 1, text: 'Boil pasta in generously salted water until al dente. Reserve 1/2 cup of starchy pasta water, then drain.' },
        { step: 2, text: 'Heat olive oil in a skillet over medium heat. Sauté minced garlic and red pepper flakes for 1 minute until fragrant.' },
        { step: 3, text: hasTomato ? 'Add diced tomatoes and salt. Simmer for 8-10 minutes until sauce is glossy and reduced.' : 'Add vegetables and sauté for 3-4 minutes.' },
        { step: 4, text: hasSpinach ? 'Stir in fresh spinach and toss for 1 minute until wilted into the sauce.' : 'Add herbs and black pepper.' },
        { step: 5, text: 'Toss cooked pasta directly into the sauce with a splash of reserved pasta water until glossy and coated.' },
        { step: 6, text: 'Serve immediately topped with grated cheese and fresh basil.' }
      ],
      preparation_time: '10 mins',
      cooking_time: '15 mins',
      total_time: '25 mins',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.8,
      tips: [
        'Always save starchy pasta water; it emulsifies with olive oil into a silky restaurant-quality sauce.',
        'Cook pasta 1 minute less than package directions so it finishes cooking in the sauce.'
      ],
      nutrition: { calories: 380, protein: '12g', carbs: '64g', fat: '9g' }
    };

    function hasCheese(): boolean {
      return foundIngredients.includes('cheese') || foundIngredients.includes('mozzarella');
    }

    const additionalIngredients = [
      'Garlic cloves - 4 (finely minced)',
      'Dried oregano & basil - 1 tsp each',
      'Red chili flakes - 1/2 tsp',
      'Salt & black pepper to taste'
    ];

    return {
      recipe,
      userIngredients: userItemsFormatted,
      additionalIngredients,
      conversationalIntro: `Here is a fast, 100% vegetarian **${dishTitle}** using your **${userItemsFormatted.join(', ')}**!`
    };
  }

  // -------------------------------------------------------------------------
  // CASE G: GENERAL INGREDIENT COMBINATION SYNTHESIZER
  // Handles ANY other arbitrary combination of ingredients dynamically
  // -------------------------------------------------------------------------
  const primaryIng = userItemsFormatted.length > 0 ? userItemsFormatted[0] : 'Fresh Market Vegetables';
  const secondaryIng = userItemsFormatted.length > 1 ? userItemsFormatted[1] : '';
  const comboName = secondaryIng ? `${primaryIng} & ${secondaryIng}` : primaryIng;

  const foodType = isStrictlyVegetarian ? 'VEGETARIAN' : 'NON-VEGETARIAN';
  const dishTitle = isStrictlyVegetarian 
    ? `Homestyle Spiced ${comboName} Medley` 
    : `Homestyle Savory ${comboName} Special`;

  const recipe: Recipe = {
    id: `ai-gen-${now}`,
    name: dishTitle,
    description: `A delicious, homestyle preparation crafted around ${userItemsFormatted.join(', ')}, tempered with aromatic cumin, garlic, and balanced spices.`,
    image_url: isStrictlyVegetarian 
      ? 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    cuisine: 'Indian',
    category: 'Dinner',
    food_type: foodType,
    ingredients: [
      ...userItemsFormatted.map(ing => ({
        name: ing,
        quantity: 'Main portion as available in your kitchen',
        isOptional: false
      })),
      { name: 'Cooking Oil or Butter', quantity: '2 tbsp', isOptional: false }
    ],
    instructions: [
      { step: 1, text: 'Wash, trim, and cut your ingredients into even bite-sized pieces for uniform cooking.' },
      { step: 2, text: 'Heat 2 tbsp cooking oil in a wide pan or wok. Sauté cumin seeds and minced aromatics (onion/garlic if available) until fragrant.' },
      { step: 3, text: 'Add the firmer ingredients first and sauté for 4-5 minutes on medium heat.' },
      { step: 4, text: 'Add any tender leafy greens, tomatoes, or delicate ingredients along with basic spices (turmeric, chili, salt).' },
      { step: 5, text: 'Add a small splash of water if needed, cover, and simmer for 6-8 minutes until all ingredients are tender and well combined.' },
      { step: 6, text: 'Uncover, taste and adjust seasoning, garnish with fresh herbs, and serve hot.' }
    ],
    preparation_time: '10 mins',
    cooking_time: '18 mins',
    total_time: '28 mins',
    difficulty: 'Easy',
    servings: 2,
    rating: 4.8,
    tips: [
      'Staggering ingredient addition (firmer ingredients first, tender ingredients later) ensures optimal texture.',
      'A final dash of lemon juice or fresh herbs brings out natural flavors.'
    ],
    nutrition: { 
      calories: isStrictlyVegetarian ? 260 : 420, 
      protein: isStrictlyVegetarian ? '8g' : '28g', 
      carbs: '38g', 
      fat: '10g' 
    }
  };

  const additionalIngredients = [
    'Cooking Oil / Butter - 2 tbsp',
    'Cumin seeds - 1 tsp',
    'Turmeric & Red Chili powder - 1/2 tsp each',
    'Salt to taste'
  ];

  return {
    recipe,
    userIngredients: userItemsFormatted,
    additionalIngredients,
    conversationalIntro: `I have designed an authentic **${dishTitle}** specifically incorporating your **${userItemsFormatted.join(', ')}**! ${isStrictlyVegetarian ? 'It is 100% vegetarian with zero meat or eggs.' : ''}`
  };
}

/**
 * Intelligent AI culinary recipe engine.
 * Prioritizes user's given ingredients, strictly enforces dietary rules,
 * validates responses, and falls back safely to dynamic recipe synthesis.
 */
export async function generateRecipeFromAI(prompt: string): Promise<AIChefResponse> {
  const trimmed = prompt.trim();
  if (!trimmed) {
    throw new Error("Empty query");
  }

  const intent = extractIngredientsAndIntent(trimmed);

  // Check if live Google Gemini API key is configured
  const geminiApiKey = (typeof import.meta !== 'undefined' && import.meta.env)
    ? import.meta.env.VITE_GEMINI_API_KEY
    : undefined;
  if (geminiApiKey && geminiApiKey.trim() !== '' && !geminiApiKey.includes('your-key')) {
    try {
      const response = await callGeminiAPI(trimmed, intent, geminiApiKey);
      if (response) {
        // Validate AI response before returning
        const validation = validateRecipeDiet(response.recipe, intent.isStrictlyVegetarian);
        if (validation.isValid) {
          return response;
        } else {
          console.warn(`Gemini AI response violated dietary safety (${validation.violation}). Safely falling back to dynamic synthesizer.`);
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out. Falling back to built-in AI Chef engine:', err);
    }
  }

  // Artificial brief network delay for authentic interactive chatbot typing feel
  await new Promise(resolve => setTimeout(resolve, 800));

  // If user query is a simple dish search and a matching sample recipe exists
  // verify it against vegetarian rules before returning!
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
      return {
        recipe: { ...matchedSample, id: `ai-gen-${Date.now()}` },
        userIngredients: ['Recipe Request'],
        additionalIngredients: ['Standard pantry spices and ingredients as listed in recipe'],
        conversationalIntro: `Here is the authentic recipe for **${matchedSample.name}**! Enjoy cooking!`
      };
    }
  }

  // Generate dynamic, guaranteed-safe recipe tailored to user ingredients
  return synthesizeDynamicRecipe(intent);
}

/**
 * Calls Google Gemini API with strict dietary enforcement and structured output.
 */
async function callGeminiAPI(
  prompt: string, 
  intent: UserIntent, 
  apiKey: string
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

    const systemInstruction = `You are RecipeMate AI Chef, an expert culinary assistant.
Create a complete, realistic, delicious recipe response based on the user's prompt and ingredients.

Follow these strict rules:
1. ${dietaryInstruction}
2. Prioritize ingredients explicitly mentioned by the user: [${foundIngredients.join(', ')}]. The recipe MUST actually use these ingredients!
3. Separate the user's provided ingredients from any optional/additional ingredients.
4. Output structured JSON matching this exact schema:
{
  "recipeName": "string",
  "description": "string",
  "ingredients": [{"name": "string", "quantity": "string"}],
  "optionalIngredients": ["string"],
  "prepTime": "string",
  "cookTime": "string",
  "servings": 2,
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
      category: parsed.category || 'Dinner',
      food_type,
      ingredients: formattedIngredients,
      instructions,
      preparation_time: parsed.prepTime || parsed.preparation_time || '15 mins',
      cooking_time: parsed.cookTime || parsed.cooking_time || '20 mins',
      total_time: '35 mins',
      difficulty: parsed.difficulty || 'Easy',
      servings: parsed.servings || 2,
      rating: 4.8,
      tips: Array.isArray(parsed.tips) ? parsed.tips : ['Cook with fresh ingredients for optimum flavor.'],
      nutrition: { 
        calories: food_type === 'VEGETARIAN' ? 310 : 450, 
        protein: food_type === 'VEGETARIAN' ? '12g' : '32g', 
        carbs: '45g', 
        fat: '14g' 
      }
    };

    return {
      recipe,
      userIngredients: foundIngredients.map(capitalizeWords),
      additionalIngredients,
      conversationalIntro: `I have prepared a custom **${recipe.name}** for you! ${food_type === 'VEGETARIAN' ? 'It is 100% vegetarian.' : ''}`
    };
  } catch (err) {
    console.warn('Gemini API execution error:', err);
    return null;
  }
}
