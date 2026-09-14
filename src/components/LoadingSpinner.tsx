import React from 'react';
import { ChefHat } from 'lucide-react';

export const RecipeCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-[16/10] bg-stone-200" />
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-16 bg-stone-200 rounded" />
            <div className="h-3 w-20 bg-stone-200 rounded" />
          </div>
          <div className="h-5 w-3/4 bg-stone-200 rounded" />
          <div className="h-3 w-full bg-stone-100 rounded" />
          <div className="h-3 w-2/3 bg-stone-100 rounded" />
        </div>
        <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
          <div className="h-3 w-20 bg-stone-100 rounded" />
          <div className="h-4 w-24 bg-stone-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export const AIChefTypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start gap-3 max-w-xl mr-auto animate-fade-in">
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
        <ChefHat className="w-5 h-5 stroke-[2.2] animate-bounce" />
      </div>
      <div className="p-4 rounded-2xl rounded-tl-sm bg-white border border-stone-200 shadow-sm flex items-center gap-3">
        <span className="text-xs sm:text-sm font-semibold text-stone-700">
          Chef is cooking up your recipe...
        </span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></span>
        </div>
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading recipes...' }) => {
  return (
    <div className="py-16 flex flex-col items-center justify-center space-y-3">
      <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 animate-spin">
        <ChefHat className="w-6 h-6" />
      </div>
      <p className="text-xs sm:text-sm font-medium text-stone-500">{message}</p>
    </div>
  );
};
