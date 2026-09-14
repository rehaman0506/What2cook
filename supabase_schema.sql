-- ==========================================================
-- RecipeMate AI - Supabase Database Schema & Initial Seed Data
-- ==========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create 'recipes' table
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    category TEXT NOT NULL,
    food_type TEXT NOT NULL CHECK (food_type IN ('VEGETARIAN', 'NON-VEGETARIAN')),
    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    preparation_time TEXT NOT NULL,
    cooking_time TEXT NOT NULL,
    total_time TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    servings INTEGER NOT NULL DEFAULT 2,
    rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
    tips TEXT[] DEFAULT '{}',
    nutrition JSONB DEFAULT '{"calories": 0, "protein": "0g", "carbs": "0g", "fat": "0g"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create 'favorites' table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, recipe_id)
);

-- Indexes for lightning-fast search & filtering
CREATE INDEX IF NOT EXISTS idx_recipes_food_type ON public.recipes(food_type);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON public.recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON public.recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_name ON public.recipes USING gin (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'recipes'
-- Anyone can view recipes (public read)
CREATE POLICY "Recipes are viewable by everyone" 
ON public.recipes FOR SELECT 
USING (true);

-- Authenticated users can insert custom community recipes if desired
CREATE POLICY "Authenticated users can insert recipes" 
ON public.recipes FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- RLS Policies for 'favorites'
-- Users can read their own favorites
CREATE POLICY "Users can view their own favorites" 
ON public.favorites FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can add favorites" 
ON public.favorites FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can remove favorites" 
ON public.favorites FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- ==========================================================
-- SEED DATA: Rich Realistic Recipes
-- ==========================================================

INSERT INTO public.recipes (
    id, name, description, image_url, cuisine, category, food_type, 
    ingredients, instructions, preparation_time, cooking_time, total_time, 
    difficulty, servings, rating, tips, nutrition
) VALUES 
(
    '11111111-1111-1111-1111-111111111101',
    'Hyderabadi Chicken Dum Biryani',
    'A majestic, aromatic South Indian layered rice dish with marinated chicken, saffron milk, caramelized fried onions, and whole aromatic spices.',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    'South Indian',
    'Rice Dishes',
    'NON-VEGETARIAN',
    '[
        {"name": "Basmati Rice", "quantity": "2 cups (soaked for 30 mins)", "isOptional": false},
        {"name": "Chicken thighs / bone-in", "quantity": "500g (cut into medium pieces)", "isOptional": false},
        {"name": "Yogurt / Curd", "quantity": "1/2 cup", "isOptional": false},
        {"name": "Fried Onions (Birista)", "quantity": "1 cup", "isOptional": false},
        {"name": "Ginger-Garlic Paste", "quantity": "1.5 tbsp", "isOptional": false},
        {"name": "Biryani Masala & Garam Masala", "quantity": "1.5 tsp each", "isOptional": false},
        {"name": "Mint & Fresh Coriander", "quantity": "1/2 cup chopped", "isOptional": false},
        {"name": "Saffron milk & Ghee", "quantity": "2 tbsp warm milk with saffron, 2 tbsp ghee", "isOptional": true}
    ]'::jsonb,
    '[
        {"step": 1, "text": "Marinate chicken with yogurt, ginger-garlic paste, red chili powder, turmeric, biryani masala, half of the fried onions, mint, and salt for at least 45 minutes."},
        {"step": 2, "text": "Boil 6 cups of water with whole spices (bay leaf, cloves, cardamom, cinnamon) and salt. Add soaked basmati rice and cook until 70% done (about 5-6 minutes). Drain completely."},
        {"step": 3, "text": "In a heavy-bottomed pot, spread the marinated chicken evenly at the base. Layer the parboiled rice over the chicken."},
        {"step": 4, "text": "Top with remaining fried onions, chopped mint, coriander, saffron milk, and dollops of ghee."},
        {"step": 5, "text": "Seal pot tightly with foil and heavy lid. Cook on high heat for 5 minutes, then place on a flat tawa on low heat (dum) for 25-30 minutes."},
        {"step": 6, "text": "Let it rest for 10 minutes before gently fluffing the layers. Serve hot with cooling cucumber raita and mirchi ka salan."}
    ]'::jsonb,
    '30 mins', '45 mins', '75 mins', 'Medium', 4, 4.9,
    ARRAY['Do not overcook the rice before layering; 70% cooked ensures the grains stay long and separate.', 'Use bone-in chicken for the juiciest dum flavor.'],
    '{"calories": 620, "protein": "38g", "carbs": "68g", "fat": "22g"}'::jsonb
),
(
    '11111111-1111-1111-1111-111111111102',
    'Creamy Paneer Butter Masala',
    'Rich and luscious restaurant-style North Indian cottage cheese cubes simmered in a velvety buttery tomato-cashew gravy with kasuri methi.',
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
    'North Indian',
    'Vegetarian',
    'VEGETARIAN',
    '[
        {"name": "Paneer (Cottage Cheese)", "quantity": "250g (cubed)", "isOptional": false},
        {"name": "Ripe Tomatoes", "quantity": "4 large (roughly chopped)", "isOptional": false},
        {"name": "Cashews (Kaju)", "quantity": "12-15 pieces (soaked)", "isOptional": false},
        {"name": "Butter", "quantity": "2 tbsp", "isOptional": false},
        {"name": "Fresh Cream", "quantity": "2 tbsp", "isOptional": false},
        {"name": "Kashmiri Red Chili Powder", "quantity": "1 tsp", "isOptional": false},
        {"name": "Kasuri Methi (Dried Fenugreek)", "quantity": "1 tsp (crushed)", "isOptional": false},
        {"name": "Garam Masala & Sugar", "quantity": "1/2 tsp each", "isOptional": true}
    ]'::jsonb,
    '[
        {"step": 1, "text": "Boil chopped tomatoes, soaked cashews, 1 green cardamom, and a slit green chili in 1/2 cup water for 8 minutes until tender."},
        {"step": 2, "text": "Cool down and blend into a silky smooth puree. Strain if you want ultra-fine restaurant silkiness."},
        {"step": 3, "text": "Melt butter in a pan with 1 tsp oil. Add ginger-garlic paste and sauté for 1 minute until fragrant."},
        {"step": 4, "text": "Pour in tomato-cashew puree, Kashmiri red chili powder, coriander powder, and salt. Simmer covered for 8-10 minutes until butter separates."},
        {"step": 5, "text": "Gently add paneer cubes, fresh cream, crushed kasuri methi, and a pinch of sugar to balance acidity. Cook gently for 3 minutes."},
        {"step": 6, "text": "Garnish with a swirl of cream and fresh coriander. Serve with garlic naan or butter roti."}
    ]'::jsonb,
    '15 mins', '20 mins', '35 mins', 'Easy', 3, 4.8,
    ARRAY['Soak paneer cubes in warm salted water for 10 minutes before adding to keep them pillow-soft.', 'Kasuri methi is the secret fragrance note; crush it between your palms before adding.'],
    '{"calories": 410, "protein": "16g", "carbs": "18g", "fat": "30g"}'::jsonb
);
