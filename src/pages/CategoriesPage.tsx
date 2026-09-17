import React from 'react';
import { Layers, Sparkles } from 'lucide-react';
import { FOOD_CATEGORIES } from '../data/categories';
import { CategoryCard } from '../components/CategoryCard';
import { useLanguage } from '../context/LanguageContext';

interface CategoriesPageProps {
  onSelectCategory: (categoryTag: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const { t, language } = useLanguage();

  const getCategoryTitle = () => {
    if (language === 'te') return 'ఆహార మరియు ప్రాంతీయ వర్గాలు';
    if (language === 'hi') return 'व्यंजन एवं खान-पान श्रेणियाँ';
    return 'Food & Cuisine Categories';
  };

  const getCategorySubtitle = () => {
    if (language === 'te') return 'మా 12 ప్రధాన భోజన విభాగాలు మరియు ప్రాంతాలను అన్వేషించండి. దశల వారీ వంటకాలను వెంటనే చూడటానికి ఏదైనా వర్గాన్ని ఎంచుకోండి.';
    if (language === 'hi') return 'हमारे 12 प्रमुख भोजन प्रकारों और क्षेत्रीय व्यंजनों का अन्वेषण करें। आसान रेसिपीज देखने के लिए किसी भी श्रेणी पर क्लिक करें।';
    return 'Browse our 12 major meal types and culinary regions. Click any category to instantly explore authentic, step-by-step recipes.';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
          <Layers className="w-3.5 h-3.5 text-orange-600" />
          <span>{t.categoriesTitle || 'Food Categories'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          {getCategoryTitle()}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-normal max-w-2xl">
          {getCategorySubtitle()}
        </p>
      </div>

      {/* 12 Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {FOOD_CATEGORIES.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onSelect={onSelectCategory}
          />
        ))}
      </div>

      {/* Culinary Info Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-orange-50/70 border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-stone-900 text-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-600" />
            {language === 'te'
              ? 'మీ కిచెన్ లోని పదార్థాలకు ఏ వర్గం సరిపోతుందో తెలియలేదా?'
              : language === 'hi'
              ? 'समझ नहीं आ रहा कि आपकी सामग्री किस श्रेणी में आती है?'
              : "Can't decide which category fits your ingredients?"}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">
            {language === 'te'
              ? 'మా AI చాట్‌బాట్‌కు వెళ్లండి, మీ ఇంట్లో ఉన్న పదార్థాలను చెప్పండి మరియు AI చెఫ్ కొత్త రుచికరమైన వంటకాన్ని తయారు చేస్తుంది.'
              : language === 'hi'
              ? 'हमारे AI चैटबॉट पर जाएं, अपनी सामग्री बताएं और AI शेफ से तुरंत बेहतरीन रेसिपी बनवाएं।'
              : 'Head to our AI Chatbot, type or speak what you have in your fridge, and let the AI Chef automatically create the perfect recipe.'}
          </p>
        </div>
      </div>
    </div>
  );
};
