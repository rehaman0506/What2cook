import { Recipe } from '../types';

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'rec-01',
    name: 'Hyderabadi Chicken Dum Biryani',
    description: 'A majestic, aromatic South Indian layered rice dish with marinated chicken, saffron milk, caramelized fried onions, and whole aromatic spices.',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    cuisine: 'South Indian',
    category: 'Rice Dishes',
    food_type: 'NON-VEGETARIAN',
    ingredients: [
      { name: 'Basmati Rice', quantity: '2 cups (soaked 30 mins)', isOptional: false },
      { name: 'Chicken (bone-in pieces)', quantity: '500g', isOptional: false },
      { name: 'Yogurt / Curd', quantity: '1/2 cup', isOptional: false },
      { name: 'Fried Onions (Birista)', quantity: '1 cup', isOptional: false },
      { name: 'Ginger-Garlic Paste', quantity: '1.5 tbsp', isOptional: false },
      { name: 'Biryani Masala & Garam Masala', quantity: '1.5 tsp each', isOptional: false },
      { name: 'Mint & Fresh Coriander', quantity: '1/2 cup chopped', isOptional: false },
      { name: 'Saffron warm milk & Ghee', quantity: '2 tbsp milk, 2 tbsp ghee', isOptional: true }
    ],
    instructions: [
      { step: 1, text: 'Marinate chicken with yogurt, ginger-garlic paste, red chili powder, turmeric, biryani masala, half of the fried onions, mint, and salt for at least 45 minutes.' },
      { step: 2, text: 'Boil 6 cups of water with whole spices (bay leaf, cloves, cardamom, cinnamon) and salt. Add soaked basmati rice and cook until 70% done (about 5-6 minutes). Drain completely.' },
      { step: 3, text: 'In a heavy-bottomed pot, spread the marinated chicken evenly at the base. Layer the parboiled rice gently over the chicken.' },
      { step: 4, text: 'Top with remaining fried onions, chopped mint, coriander, saffron milk, and dollops of golden ghee.' },
      { step: 5, text: 'Seal pot tightly with foil and heavy lid. Cook on high heat for 5 minutes, then place on a flat tawa on low heat (dum) for 25-30 minutes.' },
      { step: 6, text: 'Let it rest for 10 minutes before gently fluffing the fragrant layers. Serve hot with cooling cucumber raita and mirchi ka salan.' }
    ],
    preparation_time: '30 mins',
    cooking_time: '45 mins',
    total_time: '75 mins',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.9,
    tips: [
      'Do not overcook the rice before layering; 70% cooked ensures the grains stay long, separate, and fluffy.',
      'Use bone-in chicken for the deepest, most authentic dum flavor.'
    ],
    nutrition: { calories: 620, protein: '38g', carbs: '68g', fat: '22g' }
  },
  {
    id: 'rec-02',
    name: 'Creamy Paneer Butter Masala',
    description: 'Rich and luscious restaurant-style North Indian cottage cheese cubes simmered in a velvety buttery tomato-cashew gravy with fragrant kasuri methi.',
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
    cuisine: 'North Indian',
    category: 'Vegetarian',
    food_type: 'VEGETARIAN',
    ingredients: [
      { name: 'Paneer (Cottage Cheese)', quantity: '250g (cubed)', isOptional: false },
      { name: 'Ripe Tomatoes', quantity: '4 large (chopped)', isOptional: false },
      { name: 'Cashews (soaked in warm water)', quantity: '12-15 pieces', isOptional: false },
      { name: 'Butter', quantity: '2 tbsp', isOptional: false },
      { name: 'Fresh Cream', quantity: '2 tbsp', isOptional: false },
      { name: 'Kashmiri Red Chili Powder', quantity: '1 tsp', isOptional: false },
      { name: 'Kasuri Methi (Dried Fenugreek)', quantity: '1 tsp (crushed)', isOptional: false },
      { name: 'Garam Masala & Sugar', quantity: '1/2 tsp each', isOptional: true }
    ],
    instructions: [
      { step: 1, text: 'Boil chopped tomatoes, soaked cashews, 1 green cardamom, and a slit green chili in 1/2 cup water for 8 minutes until soft and tender.' },
      { step: 2, text: 'Cool down and blend into a silky smooth puree. Strain through a sieve for that signature restaurant velvety texture.' },
      { step: 3, text: 'Melt butter in a pan with 1 tsp oil. Add ginger-garlic paste and sauté for 1 minute until fragrant.' },
      { step: 4, text: 'Pour in tomato-cashew puree, Kashmiri red chili powder, coriander powder, and salt. Simmer covered for 8-10 minutes until butter separates from sides.' },
      { step: 5, text: 'Gently fold in paneer cubes, fresh cream, crushed kasuri methi, and a pinch of sugar. Cook gently on low for 3 minutes.' },
      { step: 6, text: 'Garnish with a swirl of cream and fresh coriander. Serve with hot garlic butter naan or jeera rice.' }
    ],
    preparation_time: '15 mins',
    cooking_time: '20 mins',
    total_time: '35 mins',
    difficulty: 'Easy',
    servings: 3,
    rating: 4.8,
    tips: [
      'Soak paneer cubes in warm salted water for 10 minutes before adding to keep them pillow-soft.',
      'Rub kasuri methi between your palms before sprinkling to unleash its maximum herbal fragrance.'
    ],
    nutrition: { calories: 410, protein: '16g', carbs: '18g', fat: '30g' }
  },
  {
    id: 'rec-03',
    name: 'Crispy South Indian Masala Dosa',
    description: 'Golden-crispy fermented rice-lentil crepe filled with spiced mustard-potato bhaji, served with fresh coconut chutney and piping hot sambar.',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    cuisine: 'South Indian',
    category: 'Breakfast',
    food_type: 'VEGETARIAN',
    ingredients: [
      { name: 'Dosa Batter (fermented)', quantity: '3 cups', isOptional: false },
      { name: 'Potatoes (Boiled & lightly mashed)', quantity: '3 medium', isOptional: false },
      { name: 'Onion', quantity: '1 medium (thinly sliced)', isOptional: false },
      { name: 'Mustard seeds & Curry leaves', quantity: '1 tsp mustard, 10 leaves', isOptional: false },
      { name: 'Green chilies & Ginger', quantity: '2 chilies, 1 tsp grated ginger', isOptional: false },
      { name: 'Turmeric powder', quantity: '1/2 tsp', isOptional: false },
      { name: 'Ghee or Sesame Oil', quantity: '3 tbsp', isOptional: false }
    ],
    instructions: [
      { step: 1, text: 'Potato Masala: Heat 1 tbsp oil in a pan. Splutter mustard seeds, urad dal, curry leaves, green chilies, and ginger.' },
      { step: 2, text: 'Add sliced onions and sauté until translucent. Stir in turmeric powder and salt.' },
      { step: 3, text: 'Add boiled mashed potatoes with 3 tbsp water. Simmer for 3 minutes until moist and cohesive. Garnish with coriander.' },
      { step: 4, text: 'Heat a cast iron tawa or non-stick griddle until medium hot. Sprinkle a few drops of water to temper the heat, then wipe clean.' },
      { step: 5, text: 'Pour a ladleful of batter in center and spread outwards in quick circular motions to form a thin crepe. Drizzle ghee around edges.' },
      { step: 6, text: 'Cook on medium-high until golden and crisp. Place a spoonful of potato masala in center, fold into a cylinder, and serve hot.' }
    ],
    preparation_time: '20 mins',
    cooking_time: '15 mins',
    total_time: '35 mins',
    difficulty: 'Medium',
    servings: 2,
    rating: 4.9,
    tips: [
      'Regulate tawa temperature between dosas with a splash of water for uniform golden browning.',
      'Add 1 tsp semolina (rava) to batter for extra crispiness.'
    ],
    nutrition: { calories: 320, protein: '7g', carbs: '52g', fat: '10g' }
  },
  {
    id: 'rec-04',
    name: 'Classic Italian Penne All\'Arrabbiata',
    description: 'Authentic fiery Roman pasta tossed in garlic-infused extra virgin olive oil, crushed San Marzano tomatoes, chili flakes, and fresh basil.',
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d62810ef?w=800&auto=format&fit=crop&q=80',
    cuisine: 'Italian',
    category: 'Dinner',
    food_type: 'VEGETARIAN',
    ingredients: [
      { name: 'Penne Rigate Pasta', quantity: '250g', isOptional: false },
      { name: 'Garlic cloves', quantity: '4 (thinly sliced)', isOptional: false },
      { name: 'Crushed red chili flakes', quantity: '1 tsp (adjust to taste)', isOptional: false },
      { name: 'Canned crushed tomatoes / Passata', quantity: '400g', isOptional: false },
      { name: 'Extra Virgin Olive Oil', quantity: '3 tbsp', isOptional: false },
      { name: 'Fresh Basil leaves', quantity: 'Handful', isOptional: false },
      { name: 'Parmesan or Pecorino Romano', quantity: '2 tbsp grated', isOptional: true }
    ],
    instructions: [
      { step: 1, text: 'Bring a large pot of water to a rolling boil. Add generous salt and drop the penne.' },
      { step: 2, text: 'In a wide skillet, heat extra virgin olive oil over medium-low heat. Add sliced garlic and chili flakes, sautéing gently for 90 seconds until fragrant.' },
      { step: 3, text: 'Pour in crushed tomatoes and salt. Simmer gently for 12 minutes until sauce deepens and thickens.' },
      { step: 4, text: 'Cook pasta until 1 minute before al dente. Reserve 1/2 cup of starchy pasta water, then drain pasta.' },
      { step: 5, text: 'Toss penne directly into the simmering sauce. Splash in 2-3 tbsp pasta water and toss vigorously for 1 minute over high heat to emulsify.' },
      { step: 6, text: 'Tear in fresh basil, finish with a drizzle of raw olive oil and grated cheese, and serve immediately.' }
    ],
    preparation_time: '10 mins',
    cooking_time: '15 mins',
    total_time: '25 mins',
    difficulty: 'Easy',
    servings: 2,
    rating: 4.7,
    tips: [
      'Always reserve pasta cooking water! The starch emulsifies the tomato sauce into a silky restaurant glaze.',
      'Use Penne Rigate (ridged) so the fiery sauce clings to every bite.'
    ],
    nutrition: { calories: 380, protein: '11g', carbs: '62g', fat: '9g' }
  },
  {
    id: 'rec-05',
    name: 'Authentic Street-Style Chicken Tacos',
    description: 'Juicy citrus-spiced shredded chicken tucked inside warm toasted corn tortillas, topped with fresh pico de gallo, diced avocado, and lime crema.',
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    cuisine: 'Mexican',
    category: 'Lunch',
    food_type: 'NON-VEGETARIAN',
    ingredients: [
      { name: 'Chicken Breast or Thighs', quantity: '400g', isOptional: false },
      { name: 'Small Corn or Flour Tortillas', quantity: '8 tortillas', isOptional: false },
      { name: 'Lime juice', quantity: '2 tbsp fresh', isOptional: false },
      { name: 'Cumin, smoked paprika & chili powder', quantity: '1 tsp each', isOptional: false },
      { name: 'Red onion & Fresh Cilantro', quantity: '1/2 cup finely chopped', isOptional: false },
      { name: 'Avocado', quantity: '1 diced', isOptional: true },
      { name: 'Sour cream or Greek yogurt', quantity: '3 tbsp', isOptional: true }
    ],
    instructions: [
      { step: 1, text: 'Season chicken with lime juice, olive oil, minced garlic, cumin, smoked paprika, chili powder, and salt.' },
      { step: 2, text: 'Sear chicken in a hot cast iron skillet for 5-6 minutes per side until charred and thoroughly cooked (165°F).' },
      { step: 3, text: 'Let chicken rest 5 minutes, then shred or slice into bite-sized strips.' },
      { step: 4, text: 'Toast tortillas on the hot dry griddle for 30 seconds per side until lightly charred and pliable.' },
      { step: 5, text: 'Assemble tacos: layer shredded chicken, diced avocado, fresh onion-cilantro mix, and a drizzle of lime crema.' },
      { step: 6, text: 'Serve immediately with fresh lime wedges and spicy salsa.' }
    ],
    preparation_time: '15 mins',
    cooking_time: '15 mins',
    total_time: '30 mins',
    difficulty: 'Easy',
    servings: 3,
    rating: 4.8,
    tips: [
      'Warm the tortillas on a hot dry pan to bring out their corn fragrance and make them fold without tearing.',
      'Rest the cooked chicken before slicing so juices stay locked inside.'
    ],
    nutrition: { calories: 420, protein: '34g', carbs: '35g', fat: '16g' }
  },
  {
    id: 'rec-06',
    name: 'Warm Melt-in-Mouth Gulab Jamun',
    description: 'Delicate golden-brown milk dumplings fried to perfection and soaked in fragrant rose-cardamom saffron sugar syrup.',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    cuisine: 'North Indian',
    category: 'Desserts',
    food_type: 'VEGETARIAN',
    ingredients: [
      { name: 'Milk Powder or Mawa (Khoya)', quantity: '1 cup milk powder', isOptional: false },
      { name: 'All-purpose Flour (Maida)', quantity: '1/4 cup', isOptional: false },
      { name: 'Baking Soda', quantity: '1/4 tsp', isOptional: false },
      { name: 'Ghee', quantity: '1 tbsp + ghee/oil for deep frying', isOptional: false },
      { name: 'Milk', quantity: '4-5 tbsp (room temp)', isOptional: false },
      { name: 'Sugar', quantity: '1.5 cups', isOptional: false },
      { name: 'Cardamom pods & Rose Water', quantity: '4 pods crushed, 1 tsp rose water', isOptional: false },
      { name: 'Saffron strands', quantity: 'Generous pinch', isOptional: true }
    ],
    instructions: [
      { step: 1, text: 'Make syrup: Boil sugar and 1.5 cups water with crushed cardamom and saffron for 6-7 minutes until sticky. Stir in rose water and keep warm.' },
      { step: 2, text: 'Make dough: In a bowl, mix milk powder, maida, and baking soda. Rub in 1 tbsp ghee gently.' },
      { step: 3, text: 'Add milk tablespoon by tablespoon, combining gently into a soft, smooth dough. Do not knead hard. Rest for 5 mins.' },
      { step: 4, text: 'Divide into 15 small smooth balls without any cracks (cracks cause balls to break while frying).' },
      { step: 5, text: 'Heat ghee/oil over low-medium heat. Slide in balls; fry on gentle low heat, swirling oil continuously until evenly deep golden brown (about 8-10 minutes).' },
      { step: 6, text: 'Drain and immediately drop hot jamuns into warm sugar syrup. Let soak for at least 1 hour before serving warm with vanilla ice cream.' }
    ],
    preparation_time: '20 mins',
    cooking_time: '25 mins',
    total_time: '45 mins',
    difficulty: 'Medium',
    servings: 5,
    rating: 4.9,
    tips: [
      'Never fry on high heat or the crust will brown while the core stays raw and doughy.',
      'Syrup should be warm (not boiling) when sliding the fried dumplings in.'
    ],
    nutrition: { calories: 280, protein: '5g', carbs: '45g', fat: '9g' }
  },
  {
    id: 'rec-07',
    name: '15-Minute Egg & Veggie Fried Rice',
    description: 'Fast, vibrant, wok-tossed jasmine rice with scrambled eggs, scallions, carrots, peas, and a savory sesame soy glaze.',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80',
    cuisine: 'Asian',
    category: 'Rice Dishes',
    food_type: 'NON-VEGETARIAN',
    ingredients: [
      { name: 'Cooked Day-Old Rice', quantity: '3 cups (cold)', isOptional: false },
      { name: 'Eggs', quantity: '3 large (whisked)', isOptional: false },
      { name: 'Garlic & Ginger', quantity: '1 tbsp minced', isOptional: false },
      { name: 'Carrots & Green Peas', quantity: '1/2 cup diced', isOptional: false },
      { name: 'Soy Sauce & Dark Soy Sauce', quantity: '2 tbsp light, 1 tsp dark', isOptional: false },
      { name: 'Toasted Sesame Oil', quantity: '1 tsp', isOptional: false },
      { name: 'Spring Onions (Scallions)', quantity: '3 stalks sliced', isOptional: false }
    ],
    instructions: [
      { step: 1, text: 'Heat 1 tbsp oil in a smoking-hot wok or skillet. Pour in whisked eggs and soft scramble for 45 seconds. Remove and set aside.' },
      { step: 2, text: 'Add another tablespoon of oil. Add minced garlic, ginger, carrots, and peas. Stir-fry on high heat for 2 minutes.' },
      { step: 3, text: 'Add cold day-old rice. Break up clumps with the back of the spatula and toss vigorously over high heat.' },
      { step: 4, text: 'Drizzle soy sauce, dark soy sauce, and white pepper around the perimeter of the wok so it caramelizes.' },
      { step: 5, text: 'Return scrambled eggs to the wok, along with sliced scallions and sesame oil. Toss for 1 final minute.' },
      { step: 6, text: 'Serve steaming hot with chili garlic oil or sriracha.' }
    ],
    preparation_time: '5 mins',
    cooking_time: '10 mins',
    total_time: '15 mins',
    difficulty: 'Easy',
    servings: 2,
    rating: 4.8,
    tips: [
      'Day-old refrigerated rice is essential; fresh rice has too much moisture and turns mushy.',
      'Cook on maximum heat to get that irresistible wok hei aroma.'
    ],
    nutrition: { calories: 390, protein: '14g', carbs: '54g', fat: '13g' }
  },
  {
    id: 'rec-08',
    name: 'Classic Cheesy Margherita Pizza',
    description: 'Crispy hand-stretched crust topped with crushed San Marzano tomato sauce, fresh buffalo mozzarella, fragrant basil leaves, and olive oil.',
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
    cuisine: 'Italian',
    category: 'Dinner',
    food_type: 'VEGETARIAN',
    ingredients: [
      { name: 'Pizza Dough ball', quantity: '250g', isOptional: false },
      { name: 'Crushed San Marzano Tomatoes', quantity: '1/2 cup', isOptional: false },
      { name: 'Fresh Mozzarella Cheese', quantity: '150g (sliced or torn)', isOptional: false },
      { name: 'Fresh Basil leaves', quantity: '8-10 leaves', isOptional: false },
      { name: 'Extra Virgin Olive Oil', quantity: '1 tbsp', isOptional: false },
      { name: 'Sea salt', quantity: 'Pinch', isOptional: false }
    ],
    instructions: [
      { step: 1, text: 'Preheat your oven and pizza stone to its highest possible setting (500°F / 260°C) for at least 30 minutes.' },
      { step: 2, text: 'Stretch pizza dough gently on a floured surface, leaving a puffy border (cornicione).' },
      { step: 3, text: 'Spread tomato sauce thinly over the base, leaving a 1/2-inch border.' },
      { step: 4, text: 'Distribute torn pieces of fresh mozzarella evenly. Drizzle with extra virgin olive oil and a pinch of salt.' },
      { step: 5, text: 'Bake for 8-10 minutes until the crust is blistered, bubbly, and golden brown.' },
      { step: 6, text: 'Scatter fresh basil leaves over the molten cheese right out of the oven. Slice and serve.' }
    ],
    preparation_time: '15 mins',
    cooking_time: '10 mins',
    total_time: '25 mins',
    difficulty: 'Easy',
    servings: 2,
    rating: 4.8,
    tips: [
      'Pat mozzarella dry with paper towels beforehand to prevent excess moisture from making the crust soggy.',
      'Add basil immediately AFTER baking so its delicate essential oils do not burn.'
    ],
    nutrition: { calories: 510, protein: '20g', carbs: '64g', fat: '19g' }
  },
  {
    id: 'rec-09',
    name: 'Old Delhi Style Butter Chicken (Murgh Makhani)',
    description: 'Tandoori-spiced char-grilled chicken pieces simmered in a silky, mildly sweet and tangy satin tomato-butter-cream gravy.',
    image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    cuisine: 'North Indian',
    category: 'Chicken',
    food_type: 'NON-VEGETARIAN',
    ingredients: [
      { name: 'Boneless Chicken Thighs', quantity: '500g (cubed)', isOptional: false },
      { name: 'Yogurt, Lemon juice & Ginger-garlic', quantity: '1/3 cup yogurt, 1 tbsp juice, 1 tbsp paste', isOptional: false },
      { name: 'Kashmiri Chili Powder & Garam Masala', quantity: '1.5 tsp each', isOptional: false },
      { name: 'Pureed Ripe Tomatoes', quantity: '2 cups', isOptional: false },
      { name: 'Butter & Heavy Cream', quantity: '3 tbsp butter, 3 tbsp cream', isOptional: false },
      { name: 'Kasuri Methi & Honey/Sugar', quantity: '1 tsp methi, 1 tsp honey', isOptional: false },
      { name: 'Cashew paste', quantity: '2 tbsp (cashews ground with warm water)', isOptional: true }
    ],
    instructions: [
      { step: 1, text: 'Marinate chicken in yogurt, lemon juice, ginger-garlic paste, Kashmiri chili, and salt for at least 1 hour.' },
      { step: 2, text: 'Sear chicken on high heat in a cast iron skillet or broil in the oven for 8-10 minutes until charred and cooked through.' },
      { step: 3, text: 'In a separate saucepan, simmer tomato puree, ginger, cashew paste, and butter for 10 minutes until thick and aromatic.' },
      { step: 4, text: 'Stir in heavy cream, honey, and garam masala. Blend with an immersion blender for ultimate silkiness.' },
      { step: 5, text: 'Add the charred chicken pieces and simmer gently for 5 minutes.' },
      { step: 6, text: 'Finish with crushed kasuri methi and extra cream swirl. Serve with hot butter naan.' }
    ],
    preparation_time: '25 mins',
    cooking_time: '25 mins',
    total_time: '50 mins',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.9,
    tips: [
      'Getting good char marks on the chicken provides the authentic tandoor smokiness.',
      'Kashmiri chili gives radiant red color without overwhelming heat.'
    ],
    nutrition: { calories: 540, protein: '42g', carbs: '14g', fat: '36g' }
  },
  {
    id: 'rec-10',
    name: 'South Indian Crispy Medu Vada',
    description: 'Golden, doughnut-shaped crispy lentil fritters with a fluffy interior, speckled with whole peppercorns, curry leaves, and ginger.',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    cuisine: 'South Indian',
    category: 'Snacks',
    food_type: 'VEGETARIAN',
    ingredients: [
      { name: 'Urad Dal (Whole white lentil)', quantity: '1 cup (soaked 3 hours)', isOptional: false },
      { name: 'Green chilies & Ginger', quantity: '2 chilies, 1 inch ginger finely chopped', isOptional: false },
      { name: 'Whole Black Peppercorns', quantity: '1 tsp', isOptional: false },
      { name: 'Curry leaves & Fresh Coconut bits', quantity: '10 leaves, 2 tbsp tiny coconut bits', isOptional: false },
      { name: 'Hing (Asafoetida)', quantity: 'Generous pinch', isOptional: false },
      { name: 'Oil for deep frying', quantity: '2 cups', isOptional: false }
    ],
    instructions: [
      { step: 1, text: 'Grind soaked drained urad dal using minimal water (sprinkle 2-3 tbsp as needed) into a thick, fluffy, aerated batter.' },
      { step: 2, text: 'Beat batter briskly with your hand for 3-4 minutes to incorporate air until light and buoyant (test a drop in a cup of water—it should float).' },
      { step: 3, text: 'Fold in green chilies, ginger, peppercorns, curry leaves, coconut bits, hing, and salt.' },
      { step: 4, text: 'Wet your palms with water. Take a small portion of batter, flatten into a round, and poke a hole in center.' },
      { step: 5, text: 'Gently slide into medium-hot oil. Fry on medium heat for 4-5 minutes, turning occasionally until golden and crisp.' },
      { step: 6, text: 'Drain on paper towels and serve piping hot with coconut chutney and hot sambar.' }
    ],
    preparation_time: '20 mins',
    cooking_time: '15 mins',
    total_time: '35 mins',
    difficulty: 'Medium',
    servings: 3,
    rating: 4.8,
    tips: [
      'Grinding with too much water will cause the vadas to soak up oil; keep the batter thick and fluffy.',
      'Beating air into the batter is the secret to fluffy, cloud-like vadas inside.'
    ],
    nutrition: { calories: 290, protein: '9g', carbs: '32g', fat: '14g' }
  },
  {
    id: 'rec-11',
    name: 'Spicy Potato & Cauliflower (Aloo Gobi Matar)',
    description: 'Homestyle comforting North Indian curry with tender potatoes, golden cauliflower florets, and sweet green peas in a spiced onion-tomato masala.',
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    cuisine: 'North Indian',
    category: 'Lunch',
    food_type: 'VEGETARIAN',
    ingredients: [
      { name: 'Potatoes (Aloo)', quantity: '2 medium (cubed)', isOptional: false },
      { name: 'Cauliflower (Gobi)', quantity: '1 medium head (cut into florets)', isOptional: false },
      { name: 'Green Peas (Matar)', quantity: '1/2 cup (fresh or frozen)', isOptional: false },
      { name: 'Onion & Tomatoes', quantity: '1 onion chopped, 2 tomatoes pureed', isOptional: false },
      { name: 'Cumin seeds & Ginger-garlic paste', quantity: '1 tsp cumin, 1 tbsp paste', isOptional: false },
      { name: 'Turmeric, Coriander & Garam masala', quantity: '1 tsp each', isOptional: false },
      { name: 'Fresh Cilantro', quantity: '1/4 cup chopped', isOptional: false }
    ],
    instructions: [
      { step: 1, text: 'Heat 2 tbsp oil in a heavy kadai. Add cumin seeds; let them crackle.' },
      { step: 2, text: 'Add chopped onions and sauté until golden brown. Stir in ginger-garlic paste for 1 minute.' },
      { step: 3, text: 'Add pureed tomatoes, turmeric, coriander powder, Kashmiri chili powder, and salt. Cook until oil leaves masala.' },
      { step: 4, text: 'Add potato cubes and cauliflower florets. Toss well to coat every piece with the spiced gravy.' },
      { step: 5, text: 'Cover with lid, lower heat, and steam cook for 12-15 minutes, stirring once or twice until veggies are fork-tender.' },
      { step: 6, text: 'Stir in green peas, sprinkle garam masala and fresh cilantro. Serve with warm phulkas or parathas.' }
    ],
    preparation_time: '15 mins',
    cooking_time: '20 mins',
    total_time: '35 mins',
    difficulty: 'Easy',
    servings: 4,
    rating: 4.7,
    tips: [
      'Do not add too much water; cooking the vegetables in their own steam preserves sweet nutty flavors.',
      'Cut potatoes and cauliflower into similar sizes for even cooking.'
    ],
    nutrition: { calories: 230, protein: '6g', carbs: '36g', fat: '8g' }
  },
  {
    id: 'rec-12',
    name: 'Molten Chocolate Lava Cake',
    description: 'Decadent individual warm chocolate cakes with a moist tender sponge and a heavenly flowing molten dark chocolate center.',
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    cuisine: 'American',
    category: 'Desserts',
    food_type: 'VEGETARIAN',
    ingredients: [
      { name: 'High-quality Dark Chocolate (60-70%)', quantity: '120g', isOptional: false },
      { name: 'Butter', quantity: '1/2 cup (100g)', isOptional: false },
      { name: 'Powdered Sugar', quantity: '1/2 cup', isOptional: false },
      { name: 'Eggs + Egg yolks', quantity: '2 whole eggs + 2 yolks', isOptional: false },
      { name: 'All-purpose flour', quantity: '3 tbsp', isOptional: false },
      { name: 'Vanilla extract & Salt', quantity: '1 tsp vanilla, pinch of salt', isOptional: false },
      { name: 'Cocoa powder', quantity: 'For dusting ramekins', isOptional: true }
    ],
    instructions: [
      { step: 1, text: 'Preheat oven to 425°F (220°C). Butter four 6-ounce ramekins and dust thoroughly with cocoa powder.' },
      { step: 2, text: 'Melt dark chocolate and butter together in a heatproof bowl set over simmering water (or in microwave in 30s bursts).' },
      { step: 3, text: 'Whisk eggs, egg yolks, powdered sugar, and vanilla in a separate bowl until pale and slightly thick.' },
      { step: 4, text: 'Fold melted chocolate mixture into the egg mixture. Gently fold in flour and pinch of salt until just incorporated.' },
      { step: 5, text: 'Divide batter evenly between ramekins. Bake for 12-14 minutes until edges are firm but center is soft and jiggly.' },
      { step: 6, text: 'Let sit for 1 minute. Run a knife around edge, invert onto dessert plates, dust with powdered sugar, and serve immediately with vanilla bean ice cream.' }
    ],
    preparation_time: '15 mins',
    cooking_time: '12 mins',
    total_time: '27 mins',
    difficulty: 'Medium',
    servings: 4,
    rating: 4.9,
    tips: [
      'Do not overbake! The center must remain jiggly when you gently nudge the ramekin.',
      'Greasing and dusting ramekins properly ensures the cake slides out smoothly when inverted.'
    ],
    nutrition: { calories: 430, protein: '7g', carbs: '44g', fat: '27g' }
  }
];
