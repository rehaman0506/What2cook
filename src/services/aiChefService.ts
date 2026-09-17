
/**
 * Detects whether prompt is in Telugu, Hindi, or defaults to fallback language.
 */
export function detectLanguage(prompt: string, fallback: 'en' | 'te' | 'hi' = 'en'): 'en' | 'te' | 'hi' {
  if (/[\u0C00-\u0C7F]/.test(prompt)) return 'te'; // Telugu unicode block
  if (/[\u0900-\u097F]/.test(prompt)) return 'hi'; // Hindi Devanagari unicode block
  return fallback;
}

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
  'oysters',
  // Telugu non-vegetarian keywords
  'చికెన్', 'మటన్', 'మేకమాంసం', 'కోడి', 'కోడిమాంసం', 'చేప', 'చేపలు', 'రొయ్యలు', 'గుడ్డు', 'గుడ్లు', 'మాంసం',
  // Hindi non-vegetarian keywords
  'चिकन', 'मटन', 'गोश्त', 'मुर्ग', 'मछली', 'झींगा', 'अंडा', 'अंडे', 'मांस'
];

/**
 * Multilingual ingredient dictionary mapping Telugu & Hindi words to standard culinary ingredients.
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
  'పుట్టగొడుగులు': 'mushroom',

  // Hindi
  'पालक': 'spinach',
  'टमाटर': 'tomato',
  'चावल': 'rice',
  'प्याज': 'onion',
  'आलू': 'potato',
  'गाजर': 'carrot',
  'पनीर': 'paneer',
  'चिकन': 'chicken',
  'मुर्ग': 'chicken',
  'मटन': 'mutton',
  'गोश्त': 'mutton',
  'मछली': 'fish',
  'झींगा': 'prawns',
  'अंडा': 'egg',
  'अंडे': 'egg',
  'लहसुन': 'garlic',
  'अदरक': 'ginger',
  'दाल': 'dal',
  'धनिया': 'coriander',
  'पुदीना': 'mint',
  'हरी मिर्च': 'green chili',
  'मिर्च': 'chili',
  'दही': 'curd',
  'घी': 'ghee',
  'तेल': 'oil',
  'दूध': 'milk',
  'मटर': 'peas',
  'गोभी': 'cauliflower',
  'फूलगोभी': 'cauliflower',
  'मशरूम': 'mushroom'
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

  // 0. Check for multilingual Telugu and Hindi ingredients first
  for (const [nativeWord, engIng] of Object.entries(MULTILINGUAL_INGREDIENT_MAP)) {
    if (prompt.includes(nativeWord)) {
      const norm = normalizeIngredientName(engIng);
      if (!foundIngredients.includes(norm)) {
        foundIngredients.push(norm);
      }
    }
  }

  // 1. Direct phrase separation (commas, '+', ' and ', '&', Hindi/Telugu punctuation)
  const directChunks = prompt
    .split(/[,+&|、।]/i)
    .map(c => c.replace(/^(i have|what can i make with|suggest|a recipe with|recipe using|how to cook|ingredients?:?|నా దగ్గర|నేను|నాకు|నా దగ్గర ఉన్నవి|నాకు వంట కావాలి|मुझे|मेरे पास|बनाना है)\s*/i, '').trim())
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
    prompt.includes('मांसाहारी') ||
    prompt.includes('नॉनवेज') ||
    prompt.includes('नॉन वेज') ||
    hasNonVegWordInPrompt
  );

  const isExplicitVegRequest = (
    forcedDiet === 'VEGETARIAN' ||
    /\b(veg|vegetarian|vegan|pure veg)\b/i.test(lower) ||
    prompt.includes('శాకాహారం') ||
    prompt.includes('ప్యూర్ వెజ్') ||
    prompt.includes('వెజ్') ||
    prompt.includes('शाकाहारी') ||
    prompt.includes('प्योर वेज') ||
    prompt.includes('वेज')
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
export function synthesizeDynamicRecipe(intent: UserIntent, lang: 'en' | 'te' | 'hi' = 'en'): AIChefResponse {
  const { foundIngredients, isStrictlyVegetarian } = intent;

  const hasRice = foundIngredients.includes('rice') || foundIngredients.includes('basmati rice');
  const hasSpinach = foundIngredients.includes('spinach');
  const hasTomato = foundIngredients.includes('tomato');
  const hasPotato = foundIngredients.includes('potato');
  const hasPaneer = foundIngredients.includes('paneer');
  const hasChicken = foundIngredients.includes('chicken');
  const userItemsFormatted = foundIngredients.map(capitalizeWords);
  const now = Date.now();

  // Helper for Telugu/Hindi user ingredients list
  const localizedUserItems = userItemsFormatted.map(item => {
    const lower = item.toLowerCase();
    if (lang === 'te') {
      if (lower === 'spinach') return 'పాలకూర (Spinach)';
      if (lower === 'rice') return 'బియ్యం (Rice)';
      if (lower === 'tomato') return 'టమాటా (Tomato)';
      if (lower === 'potato') return 'బంగాళాదుంప (Potato)';
      if (lower === 'onion') return 'ఉల్లిపాయ (Onion)';
      if (lower === 'paneer') return 'పనీర్ (Paneer)';
      if (lower === 'chicken') return 'చికెన్ (Chicken)';
      if (lower === 'fish') return 'చేప (Fish)';
    } else if (lang === 'hi') {
      if (lower === 'spinach') return 'पालक (Spinach)';
      if (lower === 'rice') return 'चावल (Rice)';
      if (lower === 'tomato') return 'टमाटर (Tomato)';
      if (lower === 'potato') return 'आलू (Potato)';
      if (lower === 'onion') return 'प्याज (Onion)';
      if (lower === 'paneer') return 'पनीर (Paneer)';
      if (lower === 'chicken') return 'चिकन (Chicken)';
      if (lower === 'fish') return 'मछली (Fish)';
    }
    return item;
  });

  // -------------------------------------------------------------------------
  // CASE A: Spinach + Rice (+ Tomato / other veggies) -> 100% VEGETARIAN Pulao
  // -------------------------------------------------------------------------
  if (hasRice && hasSpinach && isStrictlyVegetarian) {
    let dishTitle = 'Homestyle Spiced Spinach & Tomato Pulao (Palak Tamatar Rice)';
    let description = 'A fragrant, nutritious one-pot spiced rice dish infused with fresh tender spinach leaves, tangy juicy tomatoes, cumin seeds, and aromatic spices.';
    let intro = `I have designed a 100% vegetarian **${dishTitle}** highlighting your **${userItemsFormatted.join(', ')}**! It is healthy, quick to make in 30 minutes, and completely free of any meat or non-vegetarian ingredients.`;

    let ingredients = [
      { name: 'Basmati Rice', quantity: '1.5 cups (rinsed & soaked 20 mins)', isOptional: false },
      { name: 'Fresh Spinach (Palak)', quantity: '2 cups (washed & roughly chopped)', isOptional: false },
      { name: 'Ripe Tomatoes', quantity: '2 medium (finely diced)', isOptional: false },
      { name: 'Cooking Oil or Desi Ghee', quantity: '2 tbsp', isOptional: false },
      { name: 'Cumin seeds (Jeera)', quantity: '1 tsp', isOptional: false },
      { name: 'Turmeric & Garam Masala', quantity: '1/2 tsp each', isOptional: false }
    ];

    let instructions = [
      { step: 1, text: 'Rinse basmati rice until water runs clear, soak in water for 20 minutes, then drain completely.' },
      { step: 2, text: 'Heat oil or ghee in a heavy pot or pressure cooker. Sputter cumin seeds and add sliced onions (if available) until translucent.' },
      { step: 3, text: 'Add diced tomatoes, turmeric powder, and salt. Sauté for 3-4 minutes on medium heat until tomatoes turn soft and pulpy.' },
      { step: 4, text: 'Add chopped fresh spinach leaves. Sauté gently for 1-2 minutes until just wilted.' },
      { step: 5, text: 'Add drained basmati rice, pour in 3 cups of water and garam masala. Bring to a rolling boil.' },
      { step: 6, text: 'Cover tightly and simmer on low heat for 12-14 minutes until water is absorbed. Rest 5 minutes, fluff, and serve hot.' }
    ];

    let tips = [
      'Adding spinach just before pouring water prevents discoloration and keeps the rice vibrant green.',
      'Use a 1:2 ratio of soaked rice to water for fluffy, separate grains.'
    ];

    let additionalIngredients = [
      'Cumin seeds (Jeera) - 1 tsp',
      'Turmeric powder - 1/2 tsp',
      'Garam Masala - 1/2 tsp',
      'Salt to taste'
    ];

    if (lang === 'te') {
      dishTitle = 'ఘుమఘుమలాడే పాలకూర & టమాటా పులావ్ (Palak Tamatar Rice)';
      description = 'తాజా పాలకూర, పండిన టమాటాలు, బాస్మతి బియ్యం మరియు సుగంధ ద్రవ్యాలతో సులభంగా తయారుచేసే రుచికరమైన 100% శాకాహార పులావ్.';
      intro = `నమస్కారం! మీరు చెప్పిన పాలకూర, బియ్యం, టమాటాతో 100% స్వచ్ఛమైన శాకాహార **${dishTitle}** తయారుచేశాను! ఇది 30 నిమిషాల్లో తయారవుతుంది, పూర్తిగా మాంసాహార రహితం.`;
      ingredients = [
        { name: 'బాస్మతి బియ్యం (Basmati Rice)', quantity: '1.5 కప్పులు (కడిగి 20 నిమిషాలు నానబెట్టినవి)', isOptional: false },
        { name: 'తాజా పాలకూర (Spinach)', quantity: '2 కప్పులు (శుభ్రం చేసి తరిగినవి)', isOptional: false },
        { name: 'పండిన టమాటాలు (Tomatoes)', quantity: '2 (సన్నగా తరిగిన ముక్కలు)', isOptional: false },
        { name: 'నెయ్యి లేదా నూనె (Ghee/Oil)', quantity: '2 టేబుల్ స్పూన్లు', isOptional: false },
        { name: 'జీలకర్ర (Jeera)', quantity: '1 స్పూన్', isOptional: false },
        { name: 'పసుపు & గరం మసాలా', quantity: 'తగినంత', isOptional: false }
      ];
      instructions = [
        { step: 1, text: 'బాస్మతి బియ్యాన్ని శుభ్రంగా కడిగి 20 నిమిషాలు నానబెట్టి నీటిని వడకట్టండి.' },
        { step: 2, text: 'కుక్కర్ లేదా బాణలిలో నెయ్యి వేడి చేసి జీలకర్ర మరియు ఉల్లిపాయ ముక్కలు వేసి వేయించండి.' },
        { step: 3, text: 'తరిగిన టమాటాలు, పసుపు, ఉప్పు వేసి టమాటాలు మెత్తబడే వరకు 3-4 నిమిషాలు మగ్గించండి.' },
        { step: 4, text: 'తరిగిన తాజా పాలకూర ఆకులు వేసి 1-2 నిమిషాలు మాత్రమే మగ్గించండి.' },
        { step: 5, text: 'నానబెట్టిన బియ్యం వేసి కలిపి, 3 కప్పుల నీరు మరియు గరం మసాలా కలపండి.' },
        { step: 6, text: 'మూతపెట్టి చిన్న మంటపై 12-14 నిమిషాలు ఉడికించండి. 5 నిమిషాల తర్వాత పొడిపొడిగా చేసి వేడిగా వడ్డించండి.' }
      ];
      tips = [
        'పాలకూరను ఎక్కువసేపు వేయించకుండా నీరు పోసే ముందు వేస్తే పచ్చటి రంగు అలాగే ఉంటుంది.',
        'పొడిపొడిగా రావడానికి ఒక కప్పు బియ్యానికి రెండు కప్పుల నీరు వాడండి.'
      ];
      additionalIngredients = [
        'జీలకర్ర - 1 స్పూన్',
        'పసుపు - 1/2 స్పూన్',
        'గరం మసాలా - 1/2 స్పూన్',
        'రుచికి తగినంత ఉప్పు'
      ];
    } else if (lang === 'hi') {
      dishTitle = 'स्वादिष्ट पालक और टमाटर पुलाव (Palak Tamatar Pulao)';
      description = 'ताजी पालक, पके टमाटर और बासमती चावल से बनी एक अत्यंत पौष्टिक और सुगंधित 100% शाकाहारी डिश।';
      intro = `नमस्ते! आपकी सामग्री से 100% शुद्ध शाकाहारी **${dishTitle}** तैयार किया गया है! यह स्वादिष्ट और 30 मिनट में तैयार होने वाला व्यंजन है।`;
      ingredients = [
        { name: 'बासमती चावल (Basmati Rice)', quantity: '1.5 कप (धोकर 20 मिनट भिगोया हुआ)', isOptional: false },
        { name: 'ताजी पालक (Spinach)', quantity: '2 कप (बारीक कटी हुई)', isOptional: false },
        { name: 'टमाटर (Tomatoes)', quantity: '2 मध्यम (बारीक कटे हुए)', isOptional: false },
        { name: 'घी या तेल (Ghee/Oil)', quantity: '2 बड़े चम्मच', isOptional: false },
        { name: 'जीरा (Jeera)', quantity: '1 छोटा चम्मच', isOptional: false },
        { name: 'हल्दी और गरम मसाला', quantity: 'आधा छोटा चम्मच', isOptional: false }
      ];
      instructions = [
        { step: 1, text: 'बासमती चावल को धोकर 20 मिनट के लिए पानी में भिगो दें, फिर पानी निथार लें।' },
        { step: 2, text: 'कुकर या कड़ाही में घी गरम करें, जीरा और प्याज डालकर सुनहरा होने तक भूनें।' },
        { step: 3, text: 'कटे हुए टमाटर, हल्दी और नमक डालें और टमाटर के गलने तक 3-4 मिनट पकाएं।' },
        { step: 4, text: 'ताजी कटी पालक डालें और 1-2 मिनट तक हल्का सा भूनें।' },
        { step: 5, text: 'भीगे हुए चावल डालें, 3 कप पानी और गरम मसाला डालकर अच्छी तरह मिलाएं।' },
        { step: 6, text: 'ढककर धीमी आंच पर 12-14 मिनट पकाएं। 5 मिनट भाप में रहने दें और गरमा-गरम परोसें।' }
      ];
      tips = [
        'पालक को ज्यादा देर न पकाएं ताकि उसका प्राकृतिक हरा रंग बना रहे।',
        'खिले-खिले चावल के लिए 1 कप चावल में 2 कप पानी का अनुपात रखें।'
      ];
      additionalIngredients = [
        'जीरा - 1 चम्मच',
        'हल्दी पाउडर - 1/2 चम्मच',
        'गरम मसाला - 1/2 चम्मच',
        'स्वादानुसार नमक'
      ];
    }

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description,
      image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80',
      cuisine: lang === 'te' ? 'భారతీయ' : lang === 'hi' ? 'भारतीय' : 'Indian',
      category: lang === 'te' ? 'రైస్ వంటకాలు' : lang === 'hi' ? 'चावल व्यंजन' : 'Rice Dishes',
      food_type: 'VEGETARIAN',
      ingredients,
      instructions,
      preparation_time: lang === 'te' ? '10 నిమిషాలు' : lang === 'hi' ? '10 मिनट' : '10 mins',
      cooking_time: lang === 'te' ? '20 నిమిషాలు' : lang === 'hi' ? '20 मिनट' : '20 mins',
      total_time: lang === 'te' ? '30 నిమిషాలు' : lang === 'hi' ? '30 मिनट' : '30 mins',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.9,
      tips,
      nutrition: { calories: 310, protein: '8g', carbs: '56g', fat: '6g' }
    };

    return {
      recipe,
      userIngredients: localizedUserItems,
      additionalIngredients,
      conversationalIntro: intro
    };
  }

  // -------------------------------------------------------------------------
  // CASE B: Potato + Tomato -> 100% VEGETARIAN Aloo Tamatar Sabzi
  // -------------------------------------------------------------------------
  if (hasPotato && hasTomato && isStrictlyVegetarian) {
    let dishTitle = 'Homestyle Spiced Aloo Tamatar Curry';
    let description = 'A comforting, traditional everyday potato and tomato curry simmered in fragrant cumin, turmeric, and warm spices.';
    let intro = `Here is a comforting, 100% vegetarian **${dishTitle}** crafted around your **${userItemsFormatted.join(', ')}**! Pure plant-rich goodness with zero non-veg ingredients.`;

    let ingredients = [
      { name: 'Potatoes (Aloo)', quantity: '3 medium (peeled and diced)', isOptional: false },
      { name: 'Ripe Tomatoes', quantity: '3 large (finely diced)', isOptional: false },
      { name: 'Cooking Oil', quantity: '2 tbsp', isOptional: false },
      { name: 'Cumin seeds & Turmeric', quantity: '1 tsp each', isOptional: false }
    ];

    let instructions = [
      { step: 1, text: 'Heat oil in a pan. Sputter cumin seeds and add chopped onions (if available) until soft.' },
      { step: 2, text: 'Add diced tomatoes with turmeric, chili powder, and salt. Cook 5 minutes until oil separates.' },
      { step: 3, text: 'Add diced potatoes and sauté in the spiced tomato masala for 2 minutes.' },
      { step: 4, text: 'Add 1.5 cups of warm water, cover, and simmer for 15 minutes until potatoes are fork-tender.' },
      { step: 5, text: 'Crush 2-3 potato chunks to naturally thicken the gravy. Garnish with fresh coriander.' }
    ];

    if (lang === 'te') {
      dishTitle = 'హోమ్‌స్టైల్ ఆలూ టమాటా మసాలా కూర (Aloo Tamatar Curry)';
      description = 'బంగాళాదుంపలు, పండిన టమాటాలు మరియు ఘుమఘుమలాడే మసాలాలతో సులభంగా చేసుకోగల ఉత్తర భారత శైలి శాకాహార కూర.';
      intro = `మీ వద్ద ఉన్న బంగాళాదుంప, టమాటాలతో 100% స్వచ్ఛమైన శాకాహార **${dishTitle}** తయారుచేసే విధానం ఇక్కడ ఉంది!`;
      ingredients = [
        { name: 'బంగాళాదుంపలు (Potatoes)', quantity: '3 (ముక్కలుగా తరిగినవి)', isOptional: false },
        { name: 'పండిన టమాటాలు (Tomatoes)', quantity: '3 (సన్నగా తరిగినవి)', isOptional: false },
        { name: 'వంట నూనె (Cooking Oil)', quantity: '2 టేబుల్ స్పూన్లు', isOptional: false },
        { name: 'జీలకర్ర మరియు పసుపు', quantity: 'తగినంత', isOptional: false }
      ];
      instructions = [
        { step: 1, text: 'బాణలిలో నూనె వేడి చేసి జీలకర్ర మరియు ఉల్లిపాయ ముక్కలు వేసి వేయించండి.' },
        { step: 2, text: 'తరిగిన టమాటాలు, పసుపు, కారం, ఉప్పు వేసి టమాటాలు మెత్తబడే వరకు 5 నిమిషాలు ఉడికించండి.' },
        { step: 3, text: 'తరిగిన బంగాళాదుంప ముక్కలు వేసి మసాలాలో 2 నిమిషాలు వేయించండి.' },
        { step: 4, text: '1.5 కప్పుల నీరు పోసి, మూతపెట్టి బంగాళాదుంపలు ఉడికే వరకు 15 నిమిషాలు ఉడికించండి.' },
        { step: 5, text: 'రెండు బంగాళాదుంప ముక్కలను గరిటెతో మెదిపితే గ్రేవీ చిక్కగా వస్తుంది. కొత్తిమీర చల్లుకుని వేడిగా వడ్డించండి.' }
      ];
    } else if (lang === 'hi') {
      dishTitle = 'स्वादिष्ट मसालेदार आलू टमाटर की सब्ज़ी (Aloo Tamatar Sabzi)';
      description = 'आलू, रसीले टमाटर और खुशबूदार मसालों से बनी पारंपरिक उत्तर भारतीय शाकाहारी सब्ज़ी।';
      intro = `नमस्ते! आपके आलू और टमाटर से 100% शुद्ध शाकाहारी **${dishTitle}** तैयार की गई है!`;
      ingredients = [
        { name: 'आलू (Potatoes)', quantity: '3 मध्यम (कटे हुए)', isOptional: false },
        { name: 'टमाटर (Tomatoes)', quantity: '3 बड़े (बारीक कटे हुए)', isOptional: false },
        { name: 'तेल (Cooking Oil)', quantity: '2 बड़े चम्मच', isOptional: false },
        { name: 'जीरा और हल्दी', quantity: '1 चम्मच', isOptional: false }
      ];
      instructions = [
        { step: 1, text: 'कड़ाही में तेल गरम करें, जीरा और प्याज डालकर सुनहरा होने तक भूनें।' },
        { step: 2, text: 'टमाटर, हल्दी, मिर्च और नमक डालकर टमाटर के गलने तक भूनें।' },
        { step: 3, text: 'कटे हुए आलू डालें और मसाले के साथ 2 मिनट भूनें।' },
        { step: 4, text: 'डेढ़ कप पानी डालकर ढकें और आलू के पकने तक 15 मिनट धीमी आंच पर पकाएं।' },
        { step: 5, text: 'ग्रेवी को गाढ़ा करने के लिए 2-3 आलू के टुकड़ों को मैश कर दें। हरा धनिया डालकर परोसें।' }
      ];
    }

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description,
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      cuisine: lang === 'te' ? 'ఉత్తర భారతీయ' : lang === 'hi' ? 'उत्तर भारतीय' : 'North Indian',
      category: lang === 'te' ? 'కూరలు' : lang === 'hi' ? 'सब्ज़ी' : 'Dinner',
      food_type: 'VEGETARIAN',
      ingredients,
      instructions,
      preparation_time: lang === 'te' ? '10 నిమిషాలు' : lang === 'hi' ? '10 मिनट' : '10 mins',
      cooking_time: lang === 'te' ? '20 నిమిషాలు' : lang === 'hi' ? '20 मिनट' : '20 mins',
      total_time: lang === 'te' ? '30 నిమిషాలు' : lang === 'hi' ? '30 मिनट' : '30 mins',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.8,
      tips: [lang === 'te' ? 'టమాటాలు ఎర్రగా పండినవి వాడితే గ్రేవీ రంగు బాగుంటుంది.' : 'पके हुए लाल टमाटर का इस्तेमाल करने से ग्रेवी का रंग और स्वाद बेहतरीन होता है।'],
      nutrition: { calories: 230, protein: '5g', carbs: '42g', fat: '6g' }
    };

    return {
      recipe,
      userIngredients: localizedUserItems,
      additionalIngredients: [lang === 'te' ? 'జీలకర్ర, పసుపు, ఉప్పు' : 'जीरा, हल्दी, नमक'],
      conversationalIntro: intro
    };
  }

  // -------------------------------------------------------------------------
  // CASE C: Spinach + Paneer -> 100% VEGETARIAN Palak Paneer
  // -------------------------------------------------------------------------
  if (hasSpinach && hasPaneer && isStrictlyVegetarian) {
    let dishTitle = 'Dhaba-Style Palak Paneer with Fresh Tomatoes';
    let intro = `Here is a restaurant-worthy 100% vegetarian **${dishTitle}** using your **${userItemsFormatted.join(', ')}**!`;

    if (lang === 'te') {
      dishTitle = 'ఢాబా-స్టైల్ పాలక్ పనీర్ (Dhaba Palak Paneer)';
      intro = `మీ వద్ద ఉన్న పాలకూర మరియు పనీర్ తో రెస్టారెంట్ రుచిని తలపించే 100% స్వచ్ఛమైన **${dishTitle}** రూపొందించాను!`;
    } else if (lang === 'hi') {
      dishTitle = 'ढाबा-स्टाइल पालक पनीर (Dhaba Palak Paneer)';
      intro = `नमस्ते! आपकी सामग्री से बेहतरीन 100% शुद्ध शाकाहारी **${dishTitle}** तैयार किया गया है!`;
    }

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description: lang === 'te' ? 'తాజా పాలకూర ప్యూరీ మరియు పనీర్ ముక్కలతో చేసిన ప్రసిద్ధ శాకాహార వంటకం.' : 'पालक और पनीर से बनी एक लोकप्रिय और पौष्टिक शाकाहारी करी।',
      image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
      cuisine: 'North Indian',
      category: 'Dinner',
      food_type: 'VEGETARIAN',
      ingredients: [
        { name: lang === 'te' ? 'తాజా పాలకూర' : 'पालक', quantity: '300g', isOptional: false },
        { name: lang === 'te' ? 'పనీర్ ముక్కలు' : 'पनीर', quantity: '200g', isOptional: false },
        { name: lang === 'te' ? 'వెన్న లేదా నెయ్యి' : 'मक्खन या घी', quantity: '2 tbsp', isOptional: false }
      ],
      instructions: [
        { step: 1, text: lang === 'te' ? 'పాలకూరను 2 నిమిషాలు వేడి నీటిలో ఉంచి వెంటనే చల్లని నీటిలో వేసి మెత్తగా రుబ్బండి.' : 'पालक को 2 मिनट उबालकर ठंडे पानी में डालें और पीस लें।' },
        { step: 2, text: lang === 'te' ? 'బాణలిలో నెయ్యి వేడి చేసి వెల్లుల్లి మరియు ఉల్లిపాయ వేయించండి.' : 'कड़ाही में घी गरम करके लहसुन और प्याज भूनें।' },
        { step: 3, text: lang === 'te' ? 'పాలకూర ప్యూరీ మరియు మసాలాలు వేసి 5 నిమిషాలు ఉడికించండి.' : 'पालक प्यूरी और मसाले डालकर 5 मिनट पकाएं।' },
        { step: 4, text: lang === 'te' ? 'పనీర్ ముక్కలు వేసి 3 నిమిషాలు ఉడికించి రోటీతో వడ్డించండి.' : 'पनीर के टुकड़े डालकर 3 मिनट पकाएं और गरमा-गरम परोसें।' }
      ],
      preparation_time: '15 mins',
      cooking_time: '15 mins',
      total_time: '30 mins',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.9,
      tips: [lang === 'te' ? 'పనీర్ మెత్తగా ఉండటానికి వేడి నీటిలో 5 నిమిషాలు నానబెట్టండి.' : 'पनीर को 5 मिनट गुनगुने पानी में रखने से वह बेहद नरम रहता है।'],
      nutrition: { calories: 340, protein: '18g', carbs: '14g', fat: '24g' }
    };

    return {
      recipe,
      userIngredients: localizedUserItems,
      additionalIngredients: [lang === 'te' ? 'వెల్లుల్లి, జీలకర్ర, ఉప్పు' : 'लहसुन, जीरा, नमक'],
      conversationalIntro: intro
    };
  }

  // -------------------------------------------------------------------------
  // CASE D: Chicken + Rice -> NON-VEGETARIAN Chicken Pulao
  // -------------------------------------------------------------------------
  if (hasChicken && hasRice) {
    let dishTitle = 'One-Pot Savory Chicken Pulao';
    let intro = `Since you provided chicken and rice, here is a mouth-watering **${dishTitle}** that comes together in a single pot in 40 minutes!`;

    if (lang === 'te') {
      dishTitle = 'వన్-పాట్ చికెన్ దమ్ పులావ్ (Chicken Pulao)';
      intro = `మీ వద్ద ఉన్న చికెన్ మరియు బియ్యంతో ఘుమఘుమలాడే **${dishTitle}** సిద్ధం చేశాను! 40 నిమిషాల్లో సులభంగా తయారుచేయవచ్చు!`;
    } else if (lang === 'hi') {
      dishTitle = 'स्वादिष्ट वन-पॉट चिकन पुलाव (Savory Chicken Pulao)';
      intro = `नमस्ते! चिकन और चावल से केवल 40 मिनट में तैयार होने वाला लजीज **${dishTitle}** प्रस्तुत है!`;
    }

    const recipe: Recipe = {
      id: `ai-gen-${now}`,
      name: dishTitle,
      description: lang === 'te' ? 'తాజా చికెన్, బాస్మతి బియ్యం మరియు మసాలాలతో ఒకే పాత్రలో సులభంగా చేసుకోగల రుచికరమైన చికెన్ పులావ్.' : 'चिकन, बासमती चावल और खुशबूदार मसालों से बना स्वादिष्ट पुलाव।',
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      cuisine: 'Indian',
      category: 'Rice Dishes',
      food_type: 'NON-VEGETARIAN',
      ingredients: [
        { name: lang === 'te' ? 'చికెన్ ముక్కలు' : 'चिकन', quantity: '400g', isOptional: false },
        { name: lang === 'te' ? 'బాస్మతి బియ్యం' : 'बासमती चावल', quantity: '1.5 కప్పులు', isOptional: false },
        { name: lang === 'te' ? 'ఉల్లిపాయ' : 'प्याज', quantity: '1 పెద్దది', isOptional: false },
        { name: lang === 'te' ? 'నెయ్యి లేదా నూనె' : 'घी या तेल', quantity: '2 టేబుల్ స్పూన్లు', isOptional: false }
      ],
      instructions: [
        { step: 1, text: lang === 'te' ? 'బియ్యాన్ని కడిగి 20 నిమిషాలు నానబెట్టండి.' : 'चावल को धोकर 20 मिनट के लिए भिगो दें।' },
        { step: 2, text: lang === 'te' ? 'కుక్కర్లో నూనె వేసి ఉల్లిపాయలను బంగారు రంగు వచ్చేవరకు వేయించండి.' : 'तेल गरम करके प्याज को सुनहरा होने तक भूनें।' },
        { step: 3, text: lang === 'te' ? 'చికెన్ ముక్కలు, అల్లం వెల్లుల్లి పేస్ట్ వేసి 6-8 నిమిషాలు వేయించండి.' : 'चिकन और अदरक-लहसुन पेस्ट डालकर 6-8 मिनट भूनें।' },
        { step: 4, text: lang === 'te' ? 'బియ్యం వేసి, 3 కప్పుల వేడి నీరు పోసి మూతపెట్టి 15 నిమిషాలు ఉడికించండి.' : 'चावल और 3 कप पानी डालकर 15 मिनट धीमी आंच पर पकाएं।' }
      ],
      preparation_time: '15 mins',
      cooking_time: '25 mins',
      total_time: '40 mins',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.8,
      tips: [lang === 'te' ? 'చికెన్ వేయించిన తర్వాత వేడి నీరు పోస్తే బియ్యం సరిగ్గా ఉడుకుతుంది.' : 'चावल डालते समय गरम पानी का प्रयोग करें।'],
      nutrition: { calories: 510, protein: '34g', carbs: '58g', fat: '14g' }
    };

    return {
      recipe,
      userIngredients: localizedUserItems,
      additionalIngredients: [lang === 'te' ? 'అల్లం వెల్లుల్లి పేస్ట్, గరం మసాలా' : 'अदरक लहसुन पेस्ट, गरम मसाला'],
      conversationalIntro: intro
    };
  }

  // -------------------------------------------------------------------------
  // GENERAL FALLBACK: Vegetarians or Non-Vegetarians arbitrary ingredients
  // -------------------------------------------------------------------------
  const primaryIng = localizedUserItems.length > 0 ? localizedUserItems[0] : (lang === 'te' ? 'తాజా కూరగాయలు' : lang === 'hi' ? 'ताजी सब्जियां' : 'Fresh Vegetables');
  const secondaryIng = localizedUserItems.length > 1 ? localizedUserItems[1] : '';
  const comboName = secondaryIng ? `${primaryIng} & ${secondaryIng}` : primaryIng;

  const foodType = isStrictlyVegetarian ? 'VEGETARIAN' : 'NON-VEGETARIAN';
  let dishTitle = isStrictlyVegetarian ? `Homestyle Spiced ${comboName} Medley` : `Homestyle Savory ${comboName} Special`;
  let intro = `I have designed an authentic **${dishTitle}** specifically incorporating your **${userItemsFormatted.join(', ')}**! ${isStrictlyVegetarian ? 'It is 100% vegetarian with zero meat or eggs.' : ''}`;

  if (lang === 'te') {
    dishTitle = isStrictlyVegetarian ? `హోమ్‌స్టైల్ స్పెషల్ శాకాహార ${comboName} కూర` : `హోమ్‌స్టైల్ స్పెషల్ ${comboName}`;
    intro = `నమస్కారం! మీ వద్ద ఉన్న ${localizedUserItems.join(', ')} పదార్థాలతో ${isStrictlyVegetarian ? '100% స్వచ్ఛమైన శాకాహార' : ''} **${dishTitle}** తయారుచేశాను! ఆనందంగా వండుకోండి!`;
  } else if (lang === 'hi') {
    dishTitle = isStrictlyVegetarian ? `स्वादिष्ट घरेलू ${comboName} सब्ज़ी` : `स्वादिष्ट घरेलू ${comboName} स्पेशल`;
    intro = `नमस्ते! आपकी सामग्री ${localizedUserItems.join(', ')} से ${isStrictlyVegetarian ? '100% शुद्ध शाकाहारी' : ''} **${dishTitle}** तैयार की गई है!`;
  }

  const recipe: Recipe = {
    id: `ai-gen-${now}`,
    name: dishTitle,
    description: lang === 'te'
      ? `మీ కిచెన్ లోని పదార్థాలతో సులభంగా తయారుచేసే రుచికరమైన మరియు ఆరోగ్యకరమైన వంటకం.`
      : lang === 'hi'
      ? `आपकी रसोई की सामग्री से झटपट तैयार होने वाला स्वादिष्ट और पौष्टिक भोजन।`
      : `A delicious, homestyle preparation crafted around ${userItemsFormatted.join(', ')}, tempered with aromatic cumin and spices.`,
    image_url: isStrictlyVegetarian 
      ? 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    cuisine: lang === 'te' ? 'భారతీయ' : lang === 'hi' ? 'भारतीय' : 'Indian',
    category: isStrictlyVegetarian ? (lang === 'te' ? 'శాకాహారం' : 'शाकाहारी') : (lang === 'te' ? 'మాంసాహారం' : 'मांसाहारी'),
    food_type: foodType,
    ingredients: [
      ...localizedUserItems.map(ing => ({
        name: ing,
        quantity: lang === 'te' ? 'మీ వద్ద ఉన్నంత' : lang === 'hi' ? 'आवश्यकतानुसार' : 'Main portion as available',
        isOptional: false
      })),
      { name: lang === 'te' ? 'వంట నూనె' : 'तेल', quantity: '2 tbsp', isOptional: false }
    ],
    instructions: [
      { step: 1, text: lang === 'te' ? 'పదార్థాలను శుభ్రంగా కడిగి ముక్కలుగా కోయండి.' : 'सामग्री को अच्छी तरह धोकर टुकड़ों में काट लें।' },
      { step: 2, text: lang === 'te' ? 'బాణలిలో నూనె వేడి చేసి పోపు గింజలు వేయించండి.' : 'कड़ाही में तेल गरम करके जीरा और मसाले भूनें।' },
      { step: 3, text: lang === 'te' ? 'పదార్థాలను వేసి మసాలాలు, ఉప్పు కలిపి మూతపెట్టి ఉడికించండి.' : 'सामग्री और मसाले डालकर धीमी आंच पर पकाएं।' },
      { step: 4, text: lang === 'te' ? 'ఉడికిన తర్వాత కొత్తిమీర చల్లుకుని వేడిగా వడ్డించండి.' : 'पकने के बाद हरा धनिया डालकर गरमा-गरम परोसें।' }
    ],
    preparation_time: '10 mins',
    cooking_time: '18 mins',
    total_time: '28 mins',
    difficulty: 'Easy',
    servings: 2,
    rating: 4.8,
    tips: [lang === 'te' ? 'తాజా మసాలాలు వాడితే రుచి బాగుంటుంది.' : 'ताजे मसालों का उपयोग करने से स्वाद बढ़ता है।'],
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
    additionalIngredients: [lang === 'te' ? 'నూనె, జీలకర్ర, ఉప్పు' : 'तेल, जीरा, नमक'],
    conversationalIntro: intro
  };
}


/**
 * Intelligent AI culinary recipe engine.
 * Prioritizes user's given ingredients, strictly enforces dietary rules,
 * validates responses, and falls back safely to dynamic recipe synthesis.
 */
export async function generateRecipeFromAI(
  prompt: string,
  dietaryFilter?: 'ALL' | 'VEGETARIAN' | 'NON-VEGETARIAN',
  appLanguage: 'en' | 'te' | 'hi' = 'en'
): Promise<AIChefResponse> {
  const trimmed = prompt.trim();
  if (!trimmed) {
    throw new Error("Empty query");
  }

  const lang = detectLanguage(trimmed, appLanguage);
  const intent = extractIngredientsAndIntent(trimmed, dietaryFilter);

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
      const introText = lang === 'te'
        ? `ఇక్కడ మీకు సరిపోయే అసలైన **${matchedSample.name}** వంటకం ఉంది! ఆనందంగా వండుకోండి!`
        : lang === 'hi'
        ? `यहाँ आपके लिए प्रामाणिक **${matchedSample.name}** की रेसिपी है! बनाने का आनंद लें!`
        : `Here is the authentic recipe for **${matchedSample.name}**! Enjoy cooking!`;

      return {
        recipe: { ...matchedSample, id: `ai-gen-${Date.now()}` },
        userIngredients: [lang === 'te' ? 'వంటకం అభ్యర్థన' : lang === 'hi' ? 'रेसिपी अनुरोध' : 'Recipe Request'],
        additionalIngredients: [lang === 'te' ? 'వంటకంలో పేర్కొన్న ప్రామాణిక కిచెన్ మసాలాలు' : lang === 'hi' ? 'रेसिपी में बताई गई सामान्य सामग्री' : 'Standard pantry spices and ingredients as listed in recipe'],
        conversationalIntro: introText
      };
    }
  }

  // Generate dynamic, guaranteed-safe recipe tailored to user ingredients in requested language
  return synthesizeDynamicRecipe(intent, lang);
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

    const systemInstruction = `You are What2Cook AI Chef, an expert culinary assistant.
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
