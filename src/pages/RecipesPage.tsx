import React, { useMemo } from 'react';
import { Sparkles, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { Recipe, RecipeFilterState } from '../types';
import { filterRecipes } from '../services/recipeService';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  const [visibleCount, setVisibleCount] = React.useState<number>(12);
  const [onlineRecipes, setOnlineRecipes] = React.useState<Recipe[]>([]);
  const [isSearchingOnline, setIsSearchingOnline] = React.useState<boolean>(false);

  // Combine static/saved recipes with any fetched online recipes
  const allAvailableRecipes = useMemo(() => {
    if (onlineRecipes.length === 0) return recipes;
    const existingIds = new Set(recipes.map(r => r.id));
    const uniqueOnline = onlineRecipes.filter(r => !existingIds.has(r.id));
    return [...recipes, ...uniqueOnline];
  }, [recipes, onlineRecipes]);

  // Apply all filter and sort rules
  const filteredRecipes = useMemo(() => {
    return filterRecipes(allAvailableRecipes, filters);
  }, [allAvailableRecipes, filters]);

  // Reset pagination when filter criteria change
  React.useEffect(() => {
    setVisibleCount(12);
  }, [filters]);

  // Search online TheMealDB when requested
  const handleSearchOnline = async () => {
    if (!filters.searchQuery?.trim()) return;
    setIsSearchingOnline(true);
    try {
      const { searchTheMealDB } = await import('../services/mealDbService');
      const results = await searchTheMealDB(filters.searchQuery);
      if (results.length > 0) {
        setOnlineRecipes(prev => {
          const prevIds = new Set(prev.map(r => r.id));
          return [...prev, ...results.filter(r => !prevIds.has(r.id))];
        });
      }
    } catch (e) {
      console.warn('Online recipe fetch error:', e);
    } finally {
      setIsSearchingOnline(false);
    }
  };

  const visibleRecipes = useMemo(() => {
    return filteredRecipes.slice(0, visibleCount);
  }, [filteredRecipes, visibleCount]);

  const handleSearchTagClick = (tag: string) => {
    setFilters(prev => ({ ...prev, searchQuery: tag }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>{t.smartChefTag || 'Smart AI Kitchen Chef'}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {filters.foodType === 'VEGETARIAN'
                ? (t.vegSpotlightTitle || '100% Pure Vegetarian Specials')
                : filters.foodType === 'NON-VEGETARIAN'
                ? (t.nonVegSpotlightTitle || 'Non-Vegetarian Specials')
                : (t.navRecipes + ' - ' + (t.heroTitle2 || 'Explore All Recipes'))}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base font-normal max-w-2xl mt-1">
              {filters.foodType === 'VEGETARIAN'
                ? (t.pureVegTagline || '100% Plant-rich and paneer delights with zero meat or egg')
                : filters.foodType === 'NON-VEGETARIAN'
                ? (t.nonVegTagline || 'Aromatic chicken, tender mutton and fresh seafood delicacies')
                : (t.heroSubtitle || 'Search by dish name, ingredient, cuisine, or category. Browse authentic recipes or explore global dishes.')}
            </p>
          </div>

          {filters.searchQuery && filters.searchQuery.trim() && (
            <button
              type="button"
              onClick={handleSearchOnline}
              disabled={isSearchingOnline}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200 transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isSearchingOnline ? 'animate-spin' : ''}`} />
              {isSearchingOnline ? 'Searching Global Web...' : `Search Global Recipes for "${filters.searchQuery}"`}
            </button>
          )}
        </div>
      </div>

      {/* Search Bar with Popular Tags and Microphone Voice Input */}
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
        <div className="space-y-8 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSelect={onSelectRecipe}
              />
            ))}
          </div>

          {/* Load More / Pagination Controls */}
          {visibleCount < filteredRecipes.length && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 pb-4">
              <button
                type="button"
                onClick={() => setVisibleCount(prev => Math.min(prev + 12, filteredRecipes.length))}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.loadMore || 'Load More Recipes'} ({filteredRecipes.length - visibleCount} remaining)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setVisibleCount(filteredRecipes.length)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm border border-stone-200 transition-colors cursor-pointer"
              >
                {t.viewAllBtn || 'Show All'} ({filteredRecipes.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty Search Results State with AI Chef CTA */
        <div className="py-16 px-4 text-center rounded-3xl bg-stone-50 border border-dashed border-stone-300 space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center shadow-sm">
            <UtensilsCrossed className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-xl font-extrabold text-stone-900">
              {t.noRecipesFound || 'No matching recipes found'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              {filters.searchQuery
                ? `We couldn't find an existing recipe matching "${filters.searchQuery}". Why not let our AI Chef create one from scratch for you right now?`
                : 'No recipes match current dietary or category filters. Try switching filters or ask AI Chef.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
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
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-200/50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              {t.resetFilters || 'Reset All Filters'}
            </button>

            {filters.searchQuery && (
              <button
                type="button"
                onClick={handleSearchOnline}
                disabled={isSearchingOnline}
                className="px-5 py-2.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isSearchingOnline ? 'animate-spin' : ''}`} />
                {isSearchingOnline ? 'Searching Global...' : `Search Online for "${filters.searchQuery}"`}
              </button>
            )}

            <button
              type="button"
              onClick={() => onAskAIChef(filters.searchQuery ? `How do I make ${filters.searchQuery}?` : undefined)}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {t.askAiChefBtn || 'Ask AI Chef to Cook'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
