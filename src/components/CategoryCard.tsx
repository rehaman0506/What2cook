import React from 'react';
import { FoodCategory } from '../types';
import { 
  Sunrise, Sun, Moon, Cookie, Cake, Soup, 
  Flame, Leaf, Sparkles, Pizza, Utensils, UtensilsCrossed 
} from 'lucide-react';

interface CategoryCardProps {
  category: FoodCategory;
  onSelect: (categoryTag: string) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sunrise': return <Sunrise className="w-5 h-5" />;
    case 'Sun': return <Sun className="w-5 h-5" />;
    case 'Moon': return <Moon className="w-5 h-5" />;
    case 'Cookie': return <Cookie className="w-5 h-5" />;
    case 'Cake': return <Cake className="w-5 h-5" />;
    case 'Soup': return <Soup className="w-5 h-5" />;
    case 'Flame': return <Flame className="w-5 h-5" />;
    case 'Leaf': return <Leaf className="w-5 h-5" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5" />;
    case 'Pizza': return <Pizza className="w-5 h-5" />;
    case 'Utensils': return <Utensils className="w-5 h-5" />;
    default: return <UtensilsCrossed className="w-5 h-5" />;
  }
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(category.tag)}
      className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[4/3] sm:aspect-[16/11] border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Background Category Image */}
      <img
        src={category.imageUrl}
        alt={category.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
      />

      {/* Modern Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between text-white">
        {/* Category Icon Badge */}
        <div className="self-start p-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-orange-300 group-hover:bg-orange-500 group-hover:text-white transition-colors">
          {getCategoryIcon(category.iconName)}
        </div>

        {/* Name and Description */}
        <div>
          <h3 className="font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-orange-300 transition-colors">
            {category.name}
          </h3>
          <p className="text-stone-300 text-xs mt-1 line-clamp-1 font-medium">
            {category.description}
          </p>
        </div>
      </div>
    </div>
  );
};
