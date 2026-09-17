import React from 'react';
import { Clock, Flame, Star, Heart, ArrowRight } from 'lucide-react';
import { Recipe } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();
  const favorite = isFavorite(recipe.id);

  const isVeg = recipe.food_type === 'VEGETARIAN';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe);
  };

  return (
    <div
      onClick={() => onSelect(recipe)}
      className="group bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {/* Recipe Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={recipe.image_url}
          alt={recipe.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges: Indian FSSAI Veg/Non-Veg Indicator + Label + Cuisine */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {isVeg ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-md tracking-wider">
              {/* Official Indian Green Veg Dot in Square */}
              <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-white bg-emerald-700 flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
              {t.pureVegBadge}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-md tracking-wider">
              {/* Official Indian Red Non-Veg Dot in Square */}
              <span className="w-3.5 h-3.5 rounded-[3px] border-2 border-white bg-rose-700 flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </span>
              {t.nonVegBadge}
            </span>
          )}

          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-900/80 backdrop-blur-md text-stone-100 shadow-sm">
            {recipe.cuisine}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            favorite
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-110'
              : 'bg-white/80 hover:bg-white text-stone-700 hover:text-rose-500 backdrop-blur-md'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-white' : ''}`} />
        </button>

        {/* Bottom Banner on Image: Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-white">{recipe.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Recipe Info Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-semibold text-orange-600 uppercase tracking-wider text-[11px]">
              {recipe.category}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-stone-600 font-medium">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {recipe.cooking_time}
              </span>
              <span className="flex items-center gap-1 text-stone-600 font-medium">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                {recipe.difficulty}
              </span>
            </div>
          </div>

          <h3 className="font-bold text-stone-900 text-lg sm:text-xl line-clamp-1 group-hover:text-orange-600 transition-colors">
            {recipe.name}
          </h3>

          <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {recipe.description}
          </p>
        </div>

        {/* View Recipe Button */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            {recipe.ingredients.length} {t.ingredientsCount}
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:text-orange-700 group-hover:translate-x-0.5 transition-all"
          >
            {t.viewRecipe}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
