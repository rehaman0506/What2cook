import React from 'react';
import { 
  ChefHat, User, Clock, Flame, Users, Heart, 
  Check, Copy, ShieldAlert, Sparkles, Leaf, Drumstick 
} from 'lucide-react';
import { ChatMessage as ChatMessageType, Recipe } from '../types';
import { useFavorites } from '../context/FavoritesContext';

interface ChatMessageProps {
  message: ChatMessageType;
  onOpenRecipe?: (recipe: Recipe) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOpenRecipe }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = React.useState(false);

  const isUser = message.sender === 'user';
  const recipe = message.recipe;

  const handleCopyRecipe = () => {
    if (!recipe) return;
    const text = `${recipe.name}\n${recipe.description}\n\nIngredients:\n${recipe.ingredients
      .map(i => `- ${i.name}: ${i.quantity}`)
      .join('\n')}\n\nInstructions:\n${recipe.instructions
      .map(ins => `${ins.step}. ${ins.text}`)
      .join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 max-w-2xl ml-auto animate-slide-up">
        <div className="space-y-1 text-right">
          <div className="inline-block p-4 rounded-2xl rounded-tr-sm bg-gradient-to-tr from-orange-600 to-amber-600 text-white shadow-md text-sm sm:text-base font-normal leading-relaxed text-left">
            {message.text}
          </div>
          <div className="text-[11px] font-medium text-stone-400 pr-1">
            {message.timestamp}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm mt-1">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // AI Chef Response
  return (
    <div className="flex justify-start gap-3 max-w-3xl mr-auto animate-slide-up">
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 mt-1">
        <ChefHat className="w-5 h-5 stroke-[2.2]" />
      </div>

      <div className="space-y-3 flex-1 overflow-hidden">
        {/* Intro text / conversation note */}
        {message.text && (
          <div className="p-4 rounded-2xl rounded-tl-sm bg-white border border-stone-200 shadow-sm text-stone-800 text-sm sm:text-base leading-relaxed">
            {message.text}
          </div>
        )}

        {/* Structured Recipe Card if generated */}
        {recipe && (
          <div className="bg-white rounded-2xl border border-orange-200/90 shadow-lg overflow-hidden space-y-4">
            {/* Card Header with badges and quick actions */}
            <div className="relative aspect-[16/8] sm:aspect-[21/8] bg-stone-100 overflow-hidden">
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                {recipe.food_type === 'VEGETARIAN' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow">
                    <Leaf className="w-3 h-3 fill-white" />
                    VEGETARIAN
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow">
                    <Drumstick className="w-3 h-3 fill-white" />
                    NON-VEGETARIAN
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-900/80 backdrop-blur-md text-stone-100">
                  {recipe.cuisine} • {recipe.category}
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="font-extrabold text-xl sm:text-2xl drop-shadow-md tracking-tight">
                  {recipe.name}
                </h3>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <p className="text-stone-600 text-sm leading-relaxed font-normal">
                {recipe.description}
              </p>

              {/* Time & Spec Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-950 flex items-center gap-2 border border-orange-100">
                  <Clock className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-bold">Total Time</span>
                    <strong>{recipe.total_time}</strong>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-950 flex items-center gap-2 border border-amber-100">
                  <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-bold">Difficulty</span>
                    <strong>{recipe.difficulty}</strong>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 flex items-center gap-2 border border-stone-200">
                  <Users className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-bold">Servings</span>
                    <strong>{recipe.servings} Servings</strong>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 flex items-center gap-2 border border-stone-200">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-bold">Cook Time</span>
                    <strong>{recipe.cooking_time}</strong>
                  </div>
                </div>
              </div>

              {/* Provided Ingredients vs. Optional/Additional Ingredients */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Ingredients Breakdown
                </h4>

                {/* Ingredients table/list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {recipe.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-between"
                    >
                      <span className="font-semibold text-stone-800">{ing.name}</span>
                      <span className="text-stone-500 font-medium">{ing.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Explicit Section for Optional/Additional ingredients */}
                {message.additionalIngredients && message.additionalIngredients.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1.5 mt-2">
                    <span className="font-bold text-amber-900 block">
                      Optional / Additional ingredients (from your pantry):
                    </span>
                    <ul className="list-disc list-inside text-stone-700 space-y-0.5">
                      {message.additionalIngredients.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Preparation Steps */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-100 pb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Preparation Steps
                </h4>
                <div className="space-y-2">
                  {recipe.instructions.map((ins, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-800">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {ins.step}
                      </span>
                      <p className="leading-relaxed">{ins.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Cooking Tips */}
              {recipe.tips && recipe.tips.length > 0 && (
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                  <span className="font-bold text-stone-900 block">Chef's Secret Tips:</span>
                  <ul className="space-y-1 text-stone-600">
                    {recipe.tips.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-orange-500">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons: Save to Favorites & View Full / Copy */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(recipe)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isFavorite(recipe.id)
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite(recipe.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {isFavorite(recipe.id) ? 'Saved in Favorites' : 'Save to Favorites'}
                  </button>

                  <button
                    onClick={handleCopyRecipe}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Recipe'}
                  </button>
                </div>

                {onOpenRecipe && (
                  <button
                    onClick={() => onOpenRecipe(recipe)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 underline underline-offset-4"
                  >
                    Open Full Details View →
                  </button>
                )}
              </div>
            </div>

            {/* Mandatory Safety Disclaimer Notice */}
            <div className="p-3 bg-amber-500/10 border-t border-amber-500/20 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Recipe Disclaimer:</strong> Recipes are AI-generated suggestions. Please verify ingredients, cooking times, and cooking methods before preparing. Always consider food allergies, dietary restrictions, and personal health requirements.
              </span>
            </div>
          </div>
        )}

        <div className="text-[11px] font-medium text-stone-400 pl-1">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};
