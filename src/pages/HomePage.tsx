import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ChefHat, Leaf, Drumstick, 
  Search, ShieldCheck, Zap, HeartHandshake, Layers 
} from 'lucide-react';
import { Recipe } from '../types';
import { FOOD_CATEGORIES } from '../data/categories';
import { RecipeCard } from '../components/RecipeCard';
import { CategoryCard } from '../components/CategoryCard';

interface HomePageProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onNavigateToChat: (initialPrompt?: string) => void;
  onNavigateToRecipes: (query?: string, categoryTag?: string, diet?: 'ALL' | 'VEGETARIAN' | 'NON-VEGETARIAN') => void;
  onNavigateToCategories: () => void;
}

const POPULAR_INGREDIENTS = [
  'Chicken', 'Rice', 'Potato', 'Tomato', 'Onion', 
  'Egg', 'Paneer', 'Pasta', 'Garlic', 'Spinach'
];

export const HomePage: React.FC<HomePageProps> = ({
  recipes,
  onSelectRecipe,
  onNavigateToChat,
  onNavigateToRecipes,
  onNavigateToCategories,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['Chicken', 'Rice']);
  const [customIngredient, setCustomIngredient] = useState('');
  const [homeSearch, setHomeSearch] = useState('');

  const toggleIngredient = (ing: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ing) ? prev.filter(item => item !== ing) : [...prev, ing]
    );
  };

  const addCustomIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (customIngredient.trim() && !selectedIngredients.includes(customIngredient.trim())) {
      setSelectedIngredients(prev => [...prev, customIngredient.trim()]);
      setCustomIngredient('');
    }
  };

  const handleAskAIChef = () => {
    if (selectedIngredients.length > 0) {
      onNavigateToChat(`What can I make with ${selectedIngredients.join(', ')}?`);
    } else {
      onNavigateToChat();
    }
  };

  const handleHomeSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearch.trim()) {
      onNavigateToRecipes(homeSearch.trim());
    }
  };

  // Popular recipes (top 6 by rating)
  const popularRecipes = [...recipes].sort((a, b) => b.rating - a.rating).slice(0, 6);

  // Pure Vegetarian selections
  const vegRecipes = recipes.filter(r => r.food_type === 'VEGETARIAN').slice(0, 3);

  // Pure Non-Vegetarian selections
  const nonVegRecipes = recipes.filter(r => r.food_type === 'NON-VEGETARIAN').slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-stone-50 to-white pt-8 sm:pt-16 pb-14 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Hero Text & Interactive Pantry Box */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Next-Gen Smart AI Culinary Assistant</span>
              </div>

              {/* Exact Hero Title & Subtitle from Requirements */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.1]">
                  Turn Your Ingredients Into{' '}
                  <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                    Delicious Recipes
                  </span>
                </h1>
                <p className="text-base sm:text-xl text-stone-600 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
                  Tell our AI what you have in your kitchen and discover what you can cook.
                </p>
              </div>

              {/* Interactive "What is in your kitchen?" ingredient selector */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-xl shadow-orange-500/5 space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-orange-500" />
                    Select Your Available Ingredients:
                  </span>
                  {selectedIngredients.length > 0 && (
                    <button
                      onClick={() => setSelectedIngredients([])}
                      className="text-[11px] font-semibold text-stone-400 hover:text-rose-500 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Popular ingredient pills */}
                <div className="flex flex-wrap gap-2">
                  {POPULAR_INGREDIENTS.map(ing => {
                    const isSelected = selectedIngredients.includes(ing);
                    return (
                      <button
                        key={ing}
                        onClick={() => toggleIngredient(ing)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-105'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {isSelected ? `✓ ${ing}` : `+ ${ing}`}
                      </button>
                    );
                  })}
                </div>

                {/* Custom ingredient input */}
                <form onSubmit={addCustomIngredient} className="flex gap-2">
                  <input
                    type="text"
                    value={customIngredient}
                    onChange={(e) => setCustomIngredient(e.target.value)}
                    placeholder="Add other ingredient (e.g. curd, capsicum, lime)..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </form>

                {/* CTA Button: Ask AI Chef */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleAskAIChef}
                    className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 group transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ask AI Chef</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => onNavigateToRecipes()}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-bold transition-colors"
                  >
                    Browse 25+ Recipes
                  </button>
                </div>
              </div>

              {/* Main Quick Search Bar */}
              <form onSubmit={handleHomeSearchSubmit} className="relative max-w-xl mx-auto lg:mx-0">
                <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={homeSearch}
                  onChange={(e) => setHomeSearch(e.target.value)}
                  placeholder="Or search recipes (e.g. Biryani, Pasta, Mexican, Dosa)..."
                  className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white border border-stone-200 text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Right Column: Hero Culinary Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Image */}
                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
                    alt="Delicious Cooked Food"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating AI Chef Card */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-xl max-w-xs animate-slide-up">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <ChefHat className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-stone-900">AI Chef Recipe Generator</h4>
                      <p className="text-[11px] text-emerald-600 font-bold">100% Kitchen Pantry Matching</p>
                    </div>
                  </div>
                </div>

                {/* Floating Veg/Non-Veg Badges */}
                <div className="absolute -top-4 -right-2 sm:-right-4 flex flex-col gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5" />
                    VEGETARIAN
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-1.5">
                    <Drumstick className="w-3.5 h-3.5" />
                    NON-VEGETARIAN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR RECIPES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Community Favorites
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Popular Recipes
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              Highest-rated, authentic crowd-pleasers cooked by thousands of students and food enthusiasts.
            </p>
          </div>

          <button
            onClick={() => onNavigateToRecipes()}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 hover:translate-x-1 transition-all self-start sm:self-auto"
          >
            View All Recipes ({recipes.length})
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelectRecipe} />
          ))}
        </div>
      </section>

      {/* 3. FOOD CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              Culinary Variety
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Explore Food Categories
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              Find the perfect meal by occasion, region, or culinary style.
            </p>
          </div>

          <button
            onClick={onNavigateToCategories}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 hover:translate-x-1 transition-all self-start sm:self-auto"
          >
            All 12 Categories
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {FOOD_CATEGORIES.slice(0, 8).map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onSelect={(tag) => onNavigateToRecipes(undefined, tag)}
            />
          ))}
        </div>
      </section>

      {/* 4. VEGETARIAN AND NON-VEGETARIAN SPOTLIGHT SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Vegetarian Spotlight */}
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-sm">
                <Leaf className="w-3.5 h-3.5 fill-white" />
                VEGETARIAN SPECIALS
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                100% Plant-Rich & Paneer Delights
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Crispy dosas, silky paneer gravies, and fresh farm curries strictly free from meat.
              </p>
            </div>

            <button
              onClick={() => onNavigateToRecipes(undefined, undefined, 'VEGETARIAN')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all self-start sm:self-auto shadow-xs"
            >
              Explore Vegetarian ({recipes.filter(r => r.food_type === 'VEGETARIAN').length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {vegRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelectRecipe} />
            ))}
          </div>
        </div>

        {/* Non-Vegetarian Spotlight */}
        <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/60 border border-rose-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-extrabold shadow-sm">
                <Drumstick className="w-3.5 h-3.5 fill-white" />
                NON-VEGETARIAN DELIGHTS
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                Succulent Chicken, Biryanis & Tacos
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                Fragrant dum biryanis, char-grilled butter chicken, and savory Mexican tacos.
              </p>
            </div>

            <button
              onClick={() => onNavigateToRecipes(undefined, undefined, 'NON-VEGETARIAN')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-800 hover:bg-rose-600 hover:text-white font-bold text-xs transition-all self-start sm:self-auto shadow-xs"
            >
              Explore Non-Vegetarian ({recipes.filter(r => r.food_type === 'NON-VEGETARIAN').length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {nonVegRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelectRecipe} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY RECIPEMATE AI (STUDENT & ACADEMIC VALUE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-stone-900 text-white space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              Why RecipeMate AI?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Built for Students, Food Lovers, and Zero-Waste Kitchens
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base">Instant AI Pantry Matching</h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                Got leftover rice, an onion, and chicken? The AI Chef gives you an exact recipe without demanding fancy ingredients.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base">Zero Guesswork & Waste</h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                Clear distinction between what you have and optional pantry seasonings. No invented ingredients.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base">Save & Sync with Supabase</h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                Save your favorite dishes, track preparation checklists, and access your recipes across mobile and desktop.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
