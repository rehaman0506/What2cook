import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit?: () => void;
  placeholder?: string;
  suggestedTags?: string[];
  onSelectTag?: (tag: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  placeholder = "Search by dish name, ingredient (e.g. potato, chicken), cuisine, or category...",
  suggestedTags = ["Chicken Biryani", "Pasta", "Potato", "Indian", "Breakfast", "Desserts"],
  onSelectTag,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-stone-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-white border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm transition-all text-sm sm:text-base font-normal"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Clear Search"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <div className="absolute right-4 hidden sm:flex items-center text-xs font-semibold text-stone-400 gap-1 bg-stone-100 px-2 py-1 rounded-md">
            <span>Press Enter</span>
          </div>
        )}
      </div>

      {/* Suggested Search Quick Tags */}
      {suggestedTags && suggestedTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-stone-400 flex items-center gap-1 shrink-0 font-medium mr-1">
            <Sparkles className="w-3 h-3 text-orange-500" />
            Popular:
          </span>
          {suggestedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag ? onSelectTag(tag) : setSearchQuery(tag)}
              className={`shrink-0 px-2.5 py-1 rounded-full border transition-all ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-orange-500 text-white border-orange-500 font-semibold shadow-sm'
                  : 'bg-stone-50 hover:bg-orange-50 hover:text-orange-600 text-stone-600 border-stone-200/70 font-medium'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
