import { Recipe } from '../types';
import { SAMPLE_RECIPES } from '../data/sampleRecipes';

export interface AIChefResponse {
  recipe: Recipe;
  userIngredients: string[];
  additionalIngredients: string[];
  conversationalIntro: string;
}

// Extract ingredients and intent from free-form user text
export function extractIngredientsAndIntent(prompt: string) {
  const lower = prompt.toLowerCase();

  const commonIngredients = [
    'chicken', 'mutton', 'beef', 'fish', 'prawns', 'egg', 'eggs',
    'rice', 'basmati rice', 'flour', 'bread', 'pasta', 'noodles', 'penne',
    'potato', 'potatoes', 'aloo', 'tomato', 'tomatoes', 'onion', 'onions',
    'garlic', 'ginger', 'paneer', 'tofu', 'cheese', 'mozzarella', 'milk', 'cream', 'butter', 'ghee', 'yogurt', 'curd',
    'spinach', 'palak', 'cauliflower', 'gobi', 'peas', 'carrot', 'carrots', 'capsicum', 'bell pepper',
    'chili', 'cilantro', 'coriander', 'mint', 'lemon', 'lime', 'corn', 'avocado', 'mushroom', 'mushrooms',
    'urad dal', 'dal', 'lentil', 'lentils', 'chickpeas', 'beans', 'soy sauce'
  ];

  const foundIngredients: string[] = [];
  for (const ing of commonIngredients) {
    if (new RegExp(`\\b${ing}s?\\b`, 'i').test(lower)) {
      // Normalize plurals or variants
      const normalized = ing === 'potatoes' ? 'potato' : ing === 'tomatoes' ? 'tomato' : ing === 'onions' ? 'onion' : ing === 'eggs' ? 'egg' : ing;
      if (!foundIngredients.includes(normalized)) {
        foundIngredients.push(normalized);
      }
    }
  }

  const isVegRequest = lower.includes('veg') || lower.includes('vegetarian') || lower.includes('vegan') || lower.includes('paneer');
  const isNonVegRequest = lower.includes('chicken') || lower.includes('meat') || lower.includes('non-veg') || lower.includes('fish') || lower.includes('mutton') || lower.includes('egg');
  const isQuickRequest = lower.includes('quick') || lower.includes('fast') || lower.includes('20-minute') || lower.includes('20 min') || lower.includes('15 min') || lower.includes('10 min');
  const isBreakfast = lower.includes('breakfast') || lower.includes('morning');
  const isDinner = lower.includes('dinner') || lower.includes('evening');
  const isBiryani = lower.includes('biryani') || lower.includes('dum');
  const isPasta = lower.includes('pasta') || lower.includes('penne') || lower.includes('spaghetti');

  return {
    foundIngredients,
    isVegRequest,
    isNonVegRequest,
    isQuickRequest,
    isBreakfast,
    isDinner,
    isBiryani,
    isPasta,
  };
}

/**
 * Intelligent AI culinary recipe engine
 * Prioritizes user's given ingredients, categorizes additional/optional ingredients,
 * and formats a complete structured recipe.
 */
export async function generateRecipeFromAI(prompt: string): Promise<AIChefResponse> {
  const trimmed = prompt.trim();
  if (!trimmed) {
    throw new Error("Empty query");
  }

  // Check if live Google Gemini API key is configured
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (geminiApiKey && geminiApiKey.trim() !== '' && !geminiApiKey.includes('your-key')) {
    try {
      const response = await callGeminiAPI(trimmed, geminiApiKey);
      if (response) return response;
    } catch (err) {
      console.warn('Gemini API call failed or timed out. Falling back to built-in AI Chef engine:', err);
    }
  }

  // Artificial brief network delay for authentic interactive chatbot typing feel
  await new Promise(resolve => setTimeout(resolve, 900));

  return generateIntelligentFallbackRecipe(trimmed);
}

// Built-in intelligent recipe generation engine
function generateIntelligentFallbackRecipe(prompt: string): AIChefResponse {
  const intent = extractIngredientsAndIntent(prompt);
  const userIngredients = intent.foundIngredients;

  // Case 1: Biryani query
  if (intent.isBiryani || (userIngredients.includes('rice') && userIngredients.includes('chicken'))) {
    const recipe = SAMPLE_RECIPES.find(r => r.name.toLowerCase().includes('biryani')) || SAMPLE_RECIPES[0];
    const userIngredientsList = ['Rice', 'Chicken', ...(userIngredients.includes('onion') ? ['Onion'] : [])];
    const additionalIngredientsList = [
      'Yogurt / Curd (1/2 cup)',
      'Ginger-Garlic Paste (1.5 tbsp)',
      'Biryani Masala & Garam Masala (1.5 tsp each)',
      'Fresh Mint & Coriander leaves',
      'Whole Spices (bay leaf, cloves, cardamom, cinnamon)',
      'Ghee / Cooking Oil (2-3 tbsp)'
    ];

    return {
      recipe: {
        ...recipe,
        id: `ai-gen-${Date.now()}`
      },
      userIngredients: userIngredientsList,
      additionalIngredients: additionalIngredientsList,
      conversationalIntro: `I have crafted an authentic Hyderabadi Chicken Dum Biryani recipe highlighting your **${userIngredientsList.join(', ')}**! Only standard kitchen spices and yogurt are needed as optional additions.`
    };
  }

  // Case 2: Potato and Tomato (Aloo Tamatar / Aloo Gobi)
  if ((userIngredients.includes('potato') && userIngredients.includes('tomato')) || prompt.toLowerCase().includes('potato and tomato')) {
    const userIngredientsList = ['Potatoes', 'Tomatoes', ...(userIngredients.includes('onion') ? ['Onion'] : [])];
    const additionalIngredientsList = [
      'Cumin seeds (1 tsp)',
      'Turmeric & Red Chili powder (1/2 tsp each)',
      'Garam Masala (1/2 tsp)',
      'Cooking Oil or Ghee (2 tbsp)',
      'Fresh Coriander (chopped)',
      'Salt to taste'
    ];

    const recipe: Recipe = {
      id: `ai-gen-${Date.now()}`,
      name: 'Homestyle Spiced Aloo Tamatar Curry',
      description: 'A comforting, rustic North Indian everyday potato and juicy tomato curry tempered with cumin and aromatic home spices.',
      image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      cuisine: 'North Indian',
      category: 'Dinner',
      food_type: 'VEGETARIAN',
      ingredients: [
        { name: 'Potatoes (Aloo)', quantity: '3 medium (boiled or diced)', isOptional: false },
        { name: 'Ripe Tomatoes', quantity: '3 large (finely pureed or chopped)', isOptional: false },
        { name: 'Onion', quantity: userIngredients.includes('onion') ? '1 finely chopped' : '1 optional', isOptional: !userIngredients.includes('onion') },
        { name: 'Cumin seeds', quantity: '1 tsp', isOptional: true },
        { name: 'Ginger-garlic paste', quantity: '1 tsp', isOptional: true },
        { name: 'Turmeric & Kashmiri chili', quantity: '1/2 tsp each', isOptional: true },
        { name: 'Garam Masala', quantity: '1/2 tsp', isOptional: true },
        { name: 'Cooking Oil', quantity: '2 tbsp', isOptional: false }
      ],
      instructions: [
        { step: 1, text: 'Heat 2 tbsp oil in a pan. Splutter cumin seeds and sauté minced ginger and green chili until fragrant.' },
        { step: 2, text: 'Add chopped tomatoes and cook over medium heat for 6-8 minutes until soft, pulpy, and oil begins to separate.' },
        { step: 3, text: 'Stir in turmeric powder, red chili powder, coriander powder, and salt. Mix into a rich masala base.' },
        { step: 4, text: 'Add cubed potatoes. Lightly crush a few potato pieces with the back of your spoon to naturally thicken the gravy.' },
        { step: 5, text: 'Add 1 cup of warm water, bring to a gentle boil, and simmer for 6-8 minutes until rich and cohesive.' },
        { step: 6, text: 'Sprinkle garam masala and fresh coriander. Serve hot with fluffy pooris, rotis, or steamed rice.' }
      ],
      preparation_time: '10 mins',
      cooking_time: '15 mins',
      total_time: '25 mins',
      difficulty: 'Easy',
      servings: 3,
      rating: 4.8,
      tips: [
        'Lightly mashing 2-3 potato chunks creates a thick, luxurious gravy without needing heavy cream or flour.',
        'Ripe, juicy red tomatoes give the best natural tanginess.'
      ],
      nutrition: { calories: 210, protein: '5g', carbs: '38g', fat: '6g' }
    };

    return {
      recipe,
      userIngredients: userIngredientsList,
      additionalIngredients: additionalIngredientsList,
      conversationalIntro: `With your **${userIngredientsList.join(', ')}**, you can whip up this mouthwatering Homestyle Spiced Aloo Tamatar Curry in just 25 minutes!`
    };
  }

  // Case 3: Quick breakfast query
  if (intent.isBreakfast || prompt.toLowerCase().includes('breakfast')) {
    const isVeg = !intent.isNonVegRequest;
    if (isVeg) {
      const userIngredientsList = userIngredients.length > 0 ? userIngredients : ['Dosa batter or Semolina/Poha'];
      const additionalIngredientsList = ['Mustard seeds & Curry leaves', 'Green chilies & ginger', 'Oil or Ghee'];
      const dosaRecipe = SAMPLE_RECIPES.find(r => r.name.includes('Dosa')) || SAMPLE_RECIPES[2];

      return {
        recipe: { ...dosaRecipe, id: `ai-gen-${Date.now()}` },
        userIngredients: userIngredientsList,
        additionalIngredients: additionalIngredientsList,
        conversationalIntro: `Here is a high-energy, crispy South Indian Breakfast recipe that is quick, wholesome, and 100% vegetarian!`
      };
    } else {
      const userIngredientsList = userIngredients.includes('egg') ? ['Eggs'] : ['Eggs', ...userIngredients];
      const additionalIngredientsList = ['Onions & green chilies', 'Black pepper & salt', 'Butter or olive oil', 'Toast or roti'];
      const recipe: Recipe = {
        id: `ai-gen-${Date.now()}`,
        name: 'Fluffy Mumbai-Style Masala Omelette',
        description: 'Golden-crisp beaten eggs folded with sweet caramelized onions, juicy tomatoes, fresh green chilies, and fragrant cilantro.',
        image_url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80',
        cuisine: 'Indian',
        category: 'Breakfast',
        food_type: 'NON-VEGETARIAN',
        ingredients: [
          { name: 'Eggs', quantity: '3 large', isOptional: false },
          { name: 'Onion', quantity: '1/2 finely chopped', isOptional: false },
          { name: 'Tomato', quantity: '1/2 finely chopped', isOptional: false },
          { name: 'Green chilies', quantity: '1-2 slit', isOptional: false },
          { name: 'Fresh Coriander', quantity: '2 tbsp chopped', isOptional: false },
          { name: 'Butter', quantity: '1 tbsp', isOptional: false },
          { name: 'Turmeric & red chili powder', quantity: 'Pinch each', isOptional: true }
        ],
        instructions: [
          { step: 1, text: 'Whisk eggs with a pinch of turmeric, red chili powder, salt, and 1 tbsp water until frothy and aerated.' },
          { step: 2, text: 'Stir in finely chopped onions, tomatoes, green chilies, and fresh coriander.' },
          { step: 3, text: 'Melt butter in a non-stick skillet over medium heat, swirling to coat the pan.' },
          { step: 4, text: 'Pour in the egg mixture and let it set for 90 seconds until edges turn golden.' },
          { step: 5, text: 'Flip gently and cook the reverse side for 1 minute until cooked through and fluffy.' },
          { step: 6, text: 'Fold in half and serve piping hot with buttered toast or pav.' }
        ],
        preparation_time: '5 mins',
        cooking_time: '5 mins',
        total_time: '10 mins',
        difficulty: 'Easy',
        servings: 1,
        rating: 4.9,
        tips: [
          'Whisking vigorously incorporates tiny air bubbles for an extra fluffy, cloud-like texture.',
          'Adding 1 tbsp of cold water or milk keeps the eggs silky and moist.'
        ],
        nutrition: { calories: 260, protein: '18g', carbs: '4g', fat: '19g' }
      };

      return {
        recipe,
        userIngredients: userIngredientsList,
        additionalIngredients: additionalIngredientsList,
        conversationalIntro: `Here is a lightning-fast 10-minute Mumbai Masala Omelette packed with protein and big homestyle flavors!`
      };
    }
  }

  // Case 4: Vegetarian dinner query
  if (intent.isVegRequest && (intent.isDinner || prompt.toLowerCase().includes('dinner'))) {
    const paneerRecipe = SAMPLE_RECIPES.find(r => r.name.includes('Paneer')) || SAMPLE_RECIPES[1];
    const userIngredientsList = userIngredients.length > 0 ? userIngredients : ['Paneer or Fresh Vegetables'];
    const additionalIngredientsList = ['Butter & Cream', 'Cashews or melon seeds', 'Tomatoes & Spices', 'Kasuri Methi'];

    return {
      recipe: { ...paneerRecipe, id: `ai-gen-${Date.now()}` },
      userIngredients: userIngredientsList,
      additionalIngredients: additionalIngredientsList,
      conversationalIntro: `For a comforting vegetarian dinner, I highly recommend this luscious Creamy Paneer Butter Masala! It pairs wonderfully with warm naans or steamed basmati rice.`
    };
  }

  // Case 5: 20-minute / Quick recipe query
  if (intent.isQuickRequest || prompt.toLowerCase().includes('20-minute') || prompt.toLowerCase().includes('quick')) {
    const quickRecipe = SAMPLE_RECIPES.find(r => r.total_time.includes('15') || r.total_time.includes('25')) || SAMPLE_RECIPES[6];
    return {
      recipe: { ...quickRecipe, id: `ai-gen-${Date.now()}` },
      userIngredients: userIngredients.length > 0 ? userIngredients : ['Pantry staples / Rice or Pasta'],
      additionalIngredients: ['Cooking oil / butter', 'Garlic & Seasoning', 'Soy sauce or tomato sauce'],
      conversationalIntro: `Here is a super speedy recipe that goes from pantry to plate in under 20 minutes without compromising on flavor!`
    };
  }

  // Case 6: Pasta query
  if (intent.isPasta || userIngredients.includes('pasta') || userIngredients.includes('penne')) {
    const pastaRecipe = SAMPLE_RECIPES.find(r => r.name.includes('Penne')) || SAMPLE_RECIPES[3];
    return {
      recipe: { ...pastaRecipe, id: `ai-gen-${Date.now()}` },
      userIngredients: userIngredients.length > 0 ? userIngredients : ['Pasta', 'Garlic', 'Chili'],
      additionalIngredients: ['Crushed tomatoes or tomato sauce', 'Extra virgin olive oil', 'Fresh basil', 'Grated cheese'],
      conversationalIntro: `I have put together an Italian trattoria-style Penne All'Arrabbiata featuring your pasta! Simple, punchy, and ready in 25 minutes.`
    };
  }

  // Case 7: General ingredient matching from sample recipes
  let bestMatch = SAMPLE_RECIPES[0];
  let highestMatchCount = -1;

  for (const r of SAMPLE_RECIPES) {
    let matchCount = 0;
    for (const ing of userIngredients) {
      if (r.ingredients.some(i => i.name.toLowerCase().includes(ing)) || r.name.toLowerCase().includes(ing)) {
        matchCount += 2;
      }
    }
    // Boost matching by dietary preference
    if (intent.isVegRequest && r.food_type === 'VEGETARIAN') matchCount += 1;
    if (intent.isNonVegRequest && r.food_type === 'NON-VEGETARIAN') matchCount += 1;

    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      bestMatch = r;
    }
  }

  const userIngredientsList = userIngredients.length > 0 ? userIngredients : ['Your kitchen pantry ingredients'];
  const additionalIngredientsList = [
    'Cooking Oil / Butter',
    'Salt and basic seasoning (turmeric, pepper, or herbs)',
    'Aromatics (garlic or onions)'
  ];

  return {
    recipe: { ...bestMatch, id: `ai-gen-${Date.now()}` },
    userIngredients: userIngredientsList,
    additionalIngredients: additionalIngredientsList,
    conversationalIntro: `Based on your request "${prompt}", here is a delicious, tailored recipe created by our AI Chef!`
  };
}

// Call Google Gemini API if configured
async function callGeminiAPI(prompt: string, apiKey: string): Promise<AIChefResponse | null> {
  try {
    const systemInstruction = `You are RecipeMate AI Chef, an expert culinary assistant. 
Create a complete, realistic, delicious recipe response based on the user's prompt and ingredients.
Follow these critical rules:
1. Prioritize ingredients explicitly mentioned by the user. Do NOT pretend the user has ingredients they did not mention.
2. Separate user's provided ingredients from additional/optional ingredients.
3. Classify food_type strictly as 'VEGETARIAN' or 'NON-VEGETARIAN'.
4. Provide structured JSON with:
   - name: string
   - description: string
   - cuisine: string (e.g. South Indian, North Indian, Italian, Mexican, Asian, American)
   - category: string (e.g. Breakfast, Lunch, Dinner, Snacks, Desserts, Rice Dishes, Chicken, Vegetarian)
   - food_type: 'VEGETARIAN' | 'NON-VEGETARIAN'
   - ingredients: array of { name: string, quantity: string, isOptional: boolean }
   - instructions: array of { step: number, text: string }
   - preparation_time: string (e.g. '15 mins')
   - cooking_time: string (e.g. '20 mins')
   - total_time: string (e.g. '35 mins')
   - difficulty: 'Easy' | 'Medium' | 'Hard'
   - servings: number
   - rating: number (between 4.5 and 5.0)
   - tips: string[] (at least 2 useful cooking tips)
   - userIngredients: string[] (list of ingredients provided by user)
   - additionalIngredients: string[] (list of optional/additional ingredients not provided by user)
   - conversationalIntro: string (friendly 1-2 sentence greeting and overview)
Output ONLY raw JSON.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Request: ${prompt}` }]
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
    const recipe: Recipe = {
      id: `ai-gen-${Date.now()}`,
      name: parsed.name || 'Chef Special Recipe',
      description: parsed.description || 'A delicious dish crafted for your kitchen.',
      image_url: parsed.food_type === 'NON-VEGETARIAN' 
        ? 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      cuisine: parsed.cuisine || 'Continental',
      category: parsed.category || 'Dinner',
      food_type: parsed.food_type === 'NON-VEGETARIAN' ? 'NON-VEGETARIAN' : 'VEGETARIAN',
      ingredients: parsed.ingredients || [],
      instructions: parsed.instructions || [],
      preparation_time: parsed.preparation_time || '15 mins',
      cooking_time: parsed.cooking_time || '20 mins',
      total_time: parsed.total_time || '35 mins',
      difficulty: parsed.difficulty || 'Easy',
      servings: parsed.servings || 2,
      rating: parsed.rating || 4.8,
      tips: parsed.tips || ['Cook with fresh ingredients for optimum flavor.'],
      nutrition: { calories: 350, protein: '15g', carbs: '45g', fat: '12g' }
    };

    return {
      recipe,
      userIngredients: parsed.userIngredients || [],
      additionalIngredients: parsed.additionalIngredients || [],
      conversationalIntro: parsed.conversationalIntro || 'Here is your custom AI recipe!'
    };
  } catch (err) {
    console.warn('Gemini API call failed, falling back:', err);
    return null;
  }
}
