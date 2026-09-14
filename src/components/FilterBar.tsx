import React from 'react';
import { RotateCcw, Leaf, Drumstick, ArrowUpDown } from 'lucide-react';
import { RecipeFilterState } from '../types';

interface FilterBarProps {
  filters: RecipeFilterState;
  setFilters: React.Dispatch<React.SetStateAction<RecipeFilterState>>;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalResults,
}) => {
  const cuisines = ['ALL', 'South Indian', 'North Indian', 'Italian', 'Mexican', 'Asian', 'American'];
  const categories = ['ALL', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Rice Dishes', 'Chicken', 'Vegetarian'];
  const difficulties = ['ALL', 'Easy', 'Medium', 'Hard'];
  const sortOptions = [
    { value: 'popular', label: 'Popular (Rating)' },
    { value: 'quickest', label: 'Quickest (< Time)' },
    { value: 'easy', label: 'Easiest First' },
    { value: 'recent', label: 'Recently Added' },
  ];

  const handleFoodTypeChange = (type: 'ALL' | 'VEGETARIAN' | 'NON-VEGETARIAN') => {
    setFilters(prev => ({ ...prev, foodType: type }));
  };

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      foodType: 'ALL',
      cuisine: 'ALL',
      category: 'ALL',
      maxCookTime: null,
      difficulty: 'ALL',
      sortBy: 'popular',
    });
  };

  const isFiltered =
    filters.foodType !== 'ALL' ||
    filters.cuisine !== 'ALL' ||
    filters.category !== 'ALL' ||
    filters.difficulty !== 'ALL' ||
    filters.maxCookTime !== null ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top row: Veg / Non-Veg diet toggle & Results count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        {/* Diet Selector Pills */}
        <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200/60 w-full sm:w-auto">
          <button
            onClick={() => handleFoodTypeChange('ALL')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filters.foodType === 'ALL'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Diets
          </button>
          <button
            onClick={() => handleFoodTypeChange('VEGETARIAN')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              filters.foodType === 'VEGETARIAN'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            Vegetarian
          </button>
          <button
            onClick={() => handleFoodTypeChange('NON-VEGETARIAN')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              filters.foodType === 'NON-VEGETARIAN'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Drumstick className="w-3.5 h-3.5" />
            Non-Vegetarian
          </button>
        </div>

        {/* Results count & Clear button */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <span className="text-xs font-semibold text-stone-500">
            Showing <strong className="text-stone-900 font-bold">{totalResults}</strong> recipes
          </span>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Cuisine Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Cuisine
          </label>
          <select
            value={filters.cuisine}
            onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
            className="w-full text-xs font-semibold py-2 px-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {cuisines.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Cuisines' : c}</option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full text-xs font-semibold py-2 px-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>

        {/* Max Cooking Time Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Cook Time
          </label>
          <select
            value={filters.maxCookTime === null ? 'ALL' : filters.maxCookTime.toString()}
            onChange={(e) => {
              const val = e.target.value === 'ALL' ? null : parseInt(e.target.value, 10);
              setFilters(prev => ({ ...prev, maxCookTime: val }));
            }}
            className="w-full text-xs font-semibold py-2 px-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="ALL">Any Time</option>
            <option value="15">Under 15 mins</option>
            <option value="25">Under 25 mins</option>
            <option value="45">Under 45 mins</option>
          </select>
        </div>

        {/* Difficulty Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
            Difficulty
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value as any }))}
            className="w-full text-xs font-semibold py-2 px-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {difficulties.map(d => (
              <option key={d} value={d}>{d === 'ALL' ? 'Any Difficulty' : d}</option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-orange-500" />
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="w-full text-xs font-semibold py-2 px-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
