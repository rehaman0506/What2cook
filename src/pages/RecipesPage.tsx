import React, { useMemo } from 'react';
import { Sparkles, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { Recipe, RecipeFilterState } from '../types';
import { filterRecipes } from '../services/recipeService';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';

interface RecipesPageProps {
  recipes: Recipe[];
  filters: RecipeFilterState;
  setFilters: React.Dispatch<React.SetStateAction<RecipeFilterState>>;
  onSelectRecipe: (recipe: Recipe) => void;
  onAskAIChef: (prompt?: string) => void;
}

export const RecipesPage: React.FC<RecipesPageProps> = ({
  recipes,
  filters,
  setFilters,
  onSelectRecipe,
  onAskAIChef,
}) => {
  // Apply all filter and sort rules
  const filteredRecipes = useMemo(() => {
    return filterRecipes(recipes, filters);
  }, [recipes, filters]);

  const handleSearchTagClick = (tag: string) => {
    setFilters(prev => ({ ...prev, searchQuery: tag }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Recipe Catalog & Intelligent Search</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Explore All Recipes
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-normal max-w-2xl">
          Search by dish name, ingredient, cuisine, or category. Use instant dietary and cooking time filters to find your next meal.
        </p>
      </div>

      {/* Search Bar with Popular Tags */}
      <SearchBar
        searchQuery={filters.searchQuery}
        setSearchQuery={(query) => setFilters(prev => ({ ...prev, searchQuery: query }))}
        onSelectTag={handleSearchTagClick}
      />

      {/* Comprehensive Filter Controls */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        totalResults={filteredRecipes.length}
      />

      {/* Recipe Cards Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onSelectRecipe}
            />
          ))}
        </div>
      ) : (
        /* Empty Search Results State with AI Chef CTA */
        <div className="py-16 px-4 text-center rounded-3xl bg-stone-50 border border-dashed border-stone-300 space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center shadow-sm">
            <UtensilsCrossed className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-xl font-extrabold text-stone-900">
              No matching recipes found
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              We couldn't find an existing recipe matching "{filters.searchQuery || 'your filters'}". Why not let our AI Chef create one from scratch for you right now?
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setFilters({
                  searchQuery: '',
                  foodType: 'ALL',
                  cuisine: 'ALL',
                  category: 'ALL',
                  maxCookTime: null,
                  difficulty: 'ALL',
                  sortBy: 'popular'
                });
              }}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-200/50 text-xs sm:text-sm font-semibold transition-colors"
            >
              Reset All Filters
            </button>

            <button
              onClick={() => onAskAIChef(filters.searchQuery ? `How do I make ${filters.searchQuery}?` : undefined)}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Ask AI Chef to Invent It
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
