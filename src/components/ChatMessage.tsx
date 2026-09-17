import React from 'react';
import { 
  ChefHat, User, Clock, Flame, Users, Heart, 
  Check, Copy, ShieldAlert, Sparkles, ArrowRight 
} from 'lucide-react';
import { ChatMessage as ChatMessageType, Recipe } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';

interface ChatMessageProps {
  message: ChatMessageType;
  onOpenRecipe?: (recipe: Recipe) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOpenRecipe }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t, language } = useLanguage();
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

  // AI Chef Response (Strictly NO image inside chat as requested)
  return (
    <div className="flex justify-start gap-3 max-w-3xl mr-auto animate-slide-up">
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 mt-1">
        <ChefHat className="w-5 h-5 stroke-[2.2]" />
      </div>

      <div className="space-y-3 flex-1 overflow-hidden">
        {/* Intro text / conversation note */}
        {message.text && (
          <div className="p-4 rounded-2xl rounded-tl-sm bg-white/95 backdrop-blur-sm border border-stone-200 shadow-sm text-stone-800 text-sm sm:text-base leading-relaxed">
            {message.text}
          </div>
        )}

        {/* Structured Recipe Card - NO IMAGE inside chat as requested */}
        {recipe && (
          <div className="bg-white rounded-2xl border border-orange-200 shadow-lg overflow-hidden space-y-4">
            {/* Card Header without image: Title, FSSAI Badge, Cuisine & Quick Actions */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50/90 via-amber-50/60 to-orange-50/90 border-b border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {recipe.food_type === 'VEGETARIAN' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300">
                      <span className="w-2.5 h-2.5 rounded-[2px] border border-emerald-600 bg-white flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                      {t.pureVegBadge || '100% PURE VEG'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-black bg-rose-50 text-rose-800 border border-rose-300">
                      <span className="w-2.5 h-2.5 rounded-[2px] border border-rose-600 bg-white flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      </span>
                      {t.nonVegBadge || 'NON-VEGETARIAN'}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                    {recipe.cuisine} • {recipe.category}
                  </span>
                </div>
                <h3 className="font-black text-xl sm:text-2xl text-stone-900 tracking-tight">
                  {recipe.name}
                </h3>
              </div>

              {/* Quick Actions (Copy & Favorite) */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleCopyRecipe}
                  className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 transition-colors cursor-pointer"
                  title={t.shareRecipe || 'Copy Recipe'}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(recipe)}
                  className={`p-2 rounded-xl bg-white border transition-colors cursor-pointer ${
                    isFavorite(recipe.id)
                      ? 'border-rose-200 text-rose-600'
                      : 'border-stone-200 text-stone-600 hover:text-rose-600'
                  }`}
                  title={t.saveFavorite || 'Favorite Recipe'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(recipe.id) ? 'fill-rose-500' : ''}`} />
                </button>
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
                    <span className="text-[10px] text-stone-500 uppercase block font-bold">{t.totalTime || 'Total Time'}</span>
                    <strong>{recipe.total_time}</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-950 flex items-center gap-2 border border-orange-100">
                  <Users className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-bold">{t.servings || 'Servings'}</span>
                    <strong>{recipe.servings} {language === 'te' ? 'మందికి' : language === 'hi' ? 'लोग' : 'people'}</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-950 flex items-center gap-2 border border-orange-100">
                  <Flame className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-bold">{t.difficulty || 'Difficulty'}</span>
                    <strong>{recipe.difficulty}</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-950 flex items-center gap-2 border border-orange-100">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-bold">Rating</span>
                    <strong>★ {recipe.rating} / 5.0</strong>
                  </div>
                </div>
              </div>

              {/* User Ingredients matched vs Additional needed */}
              {message.userIngredients && message.userIngredients.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs space-y-1">
                  <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    {language === 'te' ? 'మీరు చెప్పిన పదార్థాలతో తయారుచేసినవి:' : language === 'hi' ? 'आपकी सामग्री के अनुसार उपयोग:' : 'Cooked Using Your Ingredients:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {message.userIngredients.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 font-semibold text-[11px]">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {message.additionalIngredients && message.additionalIngredients.length > 0 && (
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                  <span className="font-bold text-stone-700 block">
                    {language === 'te' ? 'అదనంగా అవసరమైన కిచెన్ పదార్థాలు:' : language === 'hi' ? 'अतिरिक्त आवश्यक रसोई सामग्री:' : 'Pantry Spices / Additional Items Needed:'}
                  </span>
                  <p className="text-stone-600 text-[11px]">
                    {message.additionalIngredients.join(' • ')}
                  </p>
                </div>
              )}

              {/* Ingredients Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>{t.ingredientsTitle || 'Ingredients Checklist'}</span>
                  <span className="text-stone-500 font-normal lowercase">{recipe.ingredients.length} {t.ingredientsCount || 'items'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {recipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <span className="font-medium text-stone-800">{ing.name}</span>
                      <span className="text-stone-500 font-mono text-[11px]">{ing.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions Steps */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  {t.instructionsTitle || 'Step-by-Step Instructions'}
                </h4>
                <ol className="space-y-2 text-xs text-stone-700">
                  {recipe.instructions.map((ins, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-stone-50 transition-colors">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                        {ins.step}
                      </span>
                      <span className="leading-relaxed">{ins.text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Nutrition Facts */}
              {recipe.nutrition && (
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60 text-xs">
                  <span className="font-bold text-stone-800 block mb-1.5">{t.nutritionFacts || 'Nutrition Facts (Per Serving)'}</span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="p-1 rounded bg-white font-medium">
                      <span className="text-stone-500 block text-[10px]">{t.calories || 'Calories'}</span>
                      <strong>{recipe.nutrition.calories} kcal</strong>
                    </div>
                    <div className="p-1 rounded bg-white font-medium">
                      <span className="text-stone-500 block text-[10px]">{t.protein || 'Protein'}</span>
                      <strong>{recipe.nutrition.protein}</strong>
                    </div>
                    <div className="p-1 rounded bg-white font-medium">
                      <span className="text-stone-500 block text-[10px]">{t.carbs || 'Carbs'}</span>
                      <strong>{recipe.nutrition.carbs}</strong>
                    </div>
                    <div className="p-1 rounded bg-white font-medium">
                      <span className="text-stone-500 block text-[10px]">{t.fat || 'Fats'}</span>
                      <strong>{recipe.nutrition.fat}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Chef Tips */}
              {recipe.tips && recipe.tips.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs space-y-1">
                  <span className="font-bold text-stone-900 block">{t.chefTipsTitle || "Chef's Secret Tips:"}</span>
                  <ul className="space-y-1 text-stone-600">
                    {recipe.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-orange-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons: Save to Favorites & View Full / Copy */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(recipe)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isFavorite(recipe.id)
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite(recipe.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {isFavorite(recipe.id) ? (t.savedFavorite || 'Saved in Favorites') : (t.saveFavorite || 'Save to Favorites')}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyRecipe}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : (t.shareRecipe || 'Copy Recipe')}
                  </button>
                </div>

                {onOpenRecipe && (
                  <button
                    type="button"
                    onClick={() => onOpenRecipe(recipe)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>{t.viewRecipe || 'Open Full Details View'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
