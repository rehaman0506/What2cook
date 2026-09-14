import React, { useState } from 'react';
import { 
  X, ArrowLeft, Clock, Flame, Users, Star, Heart, 
  CheckCircle2, Circle, Lightbulb, Share2, Printer, 
  Leaf, Drumstick, Sparkles 
} from 'lucide-react';
import { Recipe } from '../types';
import { useFavorites } from '../context/FavoritesContext';

interface RecipeDetailsModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onAskAIChef?: (recipeName: string) => void;
}

export const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({
  recipe,
  onClose,
  onAskAIChef,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [copiedShare, setCopiedShare] = useState(false);

  if (!recipe) return null;

  const favorite = isFavorite(recipe.id);
  const isVeg = recipe.food_type === 'VEGETARIAN';

  const toggleIngredientCheck = (index: number) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: `Check out this recipe for ${recipe.name} on RecipeMate AI!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 my-4 sm:my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar with Actions */}
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/90 backdrop-blur-sm sticky top-0 z-20">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-600 hover:text-stone-900 transition-colors py-1.5 px-2.5 rounded-xl hover:bg-stone-200/60"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Recipes
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Share Recipe"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors hidden sm:block"
              title="Print Recipe"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(recipe)}
              className={`p-2 rounded-xl border transition-all ${
                favorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-stone-100'
              }`}
              title={favorite ? "Saved in Favorites" : "Save to Favorites"}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-200/70 hover:bg-stone-300 text-stone-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-8">
          {copiedShare && (
            <div className="p-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 animate-fade-in">
              Recipe link copied to clipboard!
            </div>
          )}

          {/* Hero Banner with Food Image */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-100 shadow-md">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            {/* Badges on Hero Image */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-white">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  {isVeg ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-md">
                      <Leaf className="w-3.5 h-3.5 fill-white" />
                      VEGETARIAN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-md">
                      <Drumstick className="w-3.5 h-3.5 fill-white" />
                      NON-VEGETARIAN
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {recipe.cuisine} • {recipe.category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                  {recipe.name}
                </h1>
              </div>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-white">{recipe.rating.toFixed(1)}</span>
                <span className="text-stone-300 text-xs font-normal">/ 5.0</span>
              </div>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="space-y-4">
            <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
              {recipe.description}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-100 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-500 text-white">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Prep Time</div>
                  <div className="text-sm font-extrabold text-stone-900">{recipe.preparation_time}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-100 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-white">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Cook Time</div>
                  <div className="text-sm font-extrabold text-stone-900">{recipe.cooking_time}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-stone-700 text-white">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Servings</div>
                  <div className="text-sm font-extrabold text-stone-900">{recipe.servings} people</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Difficulty</div>
                  <div className="text-sm font-extrabold text-stone-900">{recipe.difficulty}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ask AI Chef about this Recipe Banner */}
          {onAskAIChef && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Want custom twists or ingredient substitutions?</h4>
                  <p className="text-xs text-stone-600">Ask our AI Chef how to make this dish with what is in your pantry right now.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onAskAIChef(`How do I make ${recipe.name}? Can I customize it?`);
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
              >
                Ask AI Chef
              </button>
            </div>
          )}

          {/* 2-Column Grid: Ingredients Checklist & Step-by-Step Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ingredients Column */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="font-extrabold text-stone-900 text-lg sm:text-xl">
                  Ingredients
                </h3>
                <span className="text-xs font-semibold text-stone-500">
                  {recipe.ingredients.length} items
                </span>
              </div>
              <p className="text-xs text-stone-500">Click to check off ingredients as you prep:</p>

              <div className="space-y-2.5">
                {recipe.ingredients.map((ing, idx) => {
                  const isChecked = checkedIngredients[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleIngredientCheck(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                          : 'bg-white border-stone-200 hover:border-orange-300 text-stone-800'
                      }`}
                    >
                      <button type="button" className="mt-0.5 text-stone-400">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <div className="text-xs sm:text-sm">
                        <span className="font-bold">{ing.name}</span>
                        <div className="text-xs text-stone-500 font-medium">
                          {ing.quantity}
                          {ing.isOptional && (
                            <span className="ml-1.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Optional
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nutrition Card if available */}
              {recipe.nutrition && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Nutrition Facts (Per Serving)
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white border border-stone-200">
                      <span className="text-stone-500">Calories:</span>
                      <strong className="block text-stone-900 font-bold">{recipe.nutrition.calories} kcal</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-stone-200">
                      <span className="text-stone-500">Protein:</span>
                      <strong className="block text-stone-900 font-bold">{recipe.nutrition.protein}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-stone-200">
                      <span className="text-stone-500">Carbs:</span>
                      <strong className="block text-stone-900 font-bold">{recipe.nutrition.carbs}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-stone-200">
                      <span className="text-stone-500">Fats:</span>
                      <strong className="block text-stone-900 font-bold">{recipe.nutrition.fat}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step-by-Step Instructions Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="font-extrabold text-stone-900 text-lg sm:text-xl">
                  Step-by-Step Instructions
                </h3>
                <span className="text-xs font-semibold text-stone-500">
                  {recipe.instructions.length} steps
                </span>
              </div>

              <div className="space-y-4">
                {recipe.instructions.map((inst, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex items-start gap-4 hover:border-orange-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
                      {inst.step}
                    </div>
                    <p className="text-stone-800 text-sm sm:text-base leading-relaxed pt-0.5">
                      {inst.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chef Tips Box */}
              {recipe.tips && recipe.tips.length > 0 && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Chef's Secret Tips & Tricks</span>
                  </div>
                  <ul className="space-y-2">
                    {recipe.tips.map((tip, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-amber-950/80 flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs sm:text-sm font-semibold transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => toggleFavorite(recipe)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all ${
              favorite
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-white' : ''}`} />
            {favorite ? 'Saved in Favorites' : 'Save to My Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
};
