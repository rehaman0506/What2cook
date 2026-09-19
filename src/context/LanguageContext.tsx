import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en';

export interface Translations {
  // Navigation
  navHome: string;
  navRecipes: string;
  navCategories: string;
  navChatbot: string;
  navFavorites: string;
  navSignIn: string;
  smartChefTag: string;

  // Hero section
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  kitchenTitle: string;
  kitchenDesc: string;
  ingredientPlaceholder: string;
  findRecipesBtn: string;
  askAiChefBtn: string;
  pantryQuickAdd: string;

  // Dietary Segregation
  dietPreference: string;
  dietAll: string;
  dietVeg: string;
  dietNonVeg: string;
  pureVegBadge: string;
  nonVegBadge: string;
  pureVegTagline: string;
  nonVegTagline: string;

  // Recipe Card & Modal
  viewRecipe: string;
  ingredientsCount: string;
  cookTime: string;
  prepTime: string;
  totalTime: string;
  servings: string;
  difficulty: string;
  easy: string;
  medium: string;
  hard: string;
  ingredientsTitle: string;
  instructionsTitle: string;
  chefTipsTitle: string;
  nutritionFacts: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  backToRecipes: string;
  saveFavorite: string;
  savedFavorite: string;
  shareRecipe: string;
  printRecipe: string;
  optionalTag: string;
  stepWord: string;

  // Home Page Sections
  popularRecipesTitle: string;
  popularRecipesSubtitle: string;
  categoriesTitle: string;
  categoriesSubtitle: string;
  viewAllBtn: string;
  vegSpotlightTitle: string;
  vegSpotlightSubtitle: string;
  nonVegSpotlightTitle: string;
  nonVegSpotlightSubtitle: string;

  // Search & Filter Bar
  searchPlaceholder: string;
  popularSearches: string;
  filterTitle: string;
  allCuisines: string;
  allCategories: string;
  allDifficulties: string;
  sortByLabel: string;
  sortPopular: string;
  sortQuickest: string;
  sortEasiest: string;
  sortRecent: string;
  resetFilters: string;
  showingResults: string;
  noRecipesFound: string;
  loadMore: string;

  // Voice Input & Microphone
  micListening: string;
  micSpeakNow: string;
  micNotSupported: string;
  micPermissionDenied: string;
  micClickToSpeak: string;

  // Chatbot
  chatTitle: string;
  chatSubtitle: string;
  chatOnline: string;
  chatPlaceholder: string;
  chatSend: string;
  chatClear: string;
  suggestedQuestionsTitle: string;
  strictVegChatRule: string;
  chatWelcomeIntro: string;
  numberOfPeople: string;
  personUnit: string;
  peopleUnit: string;
}

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    navHome: 'Home',
    navRecipes: 'Recipes',
    navCategories: 'Categories',
    navChatbot: 'AI Chatbot',
    navFavorites: 'Saved Recipes',
    navSignIn: 'Sign In',
    smartChefTag: 'Smart AI Kitchen Chef',

    heroBadge: 'Next-Gen Smart AI Culinary Assistant',
    heroTitle1: 'Turn Your Ingredients Into',
    heroTitle2: 'Delicious Recipes',
    heroSubtitle: 'Tell our AI what you have in your kitchen and discover what you can cook.',
    kitchenTitle: "What's in your kitchen today?",
    kitchenDesc: 'Type or click your pantry ingredients below:',
    ingredientPlaceholder: 'E.g. spinach, rice, tomato, potato, paneer...',
    findRecipesBtn: 'Find Matching Recipes',
    askAiChefBtn: 'Ask AI Chef to Cook',
    pantryQuickAdd: 'Quick Pantry Items:',

    dietPreference: 'Dietary Preference',
    dietAll: 'All Diets',
    dietVeg: 'Vegetarian',
    dietNonVeg: 'Non-Vegetarian',
    pureVegBadge: '100% PURE VEG',
    nonVegBadge: 'NON-VEGETARIAN',
    pureVegTagline: '100% Plant-rich and paneer delights with zero meat or egg',
    nonVegTagline: 'Aromatic chicken, tender mutton and fresh seafood delicacies',

    viewRecipe: 'View Recipe',
    ingredientsCount: 'ingredients',
    cookTime: 'Cook Time',
    prepTime: 'Prep Time',
    totalTime: 'Total Time',
    servings: 'Servings',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    ingredientsTitle: 'Ingredients Checklist',
    instructionsTitle: 'Step-by-Step Instructions',
    chefTipsTitle: "Chef's Secret Tips and Tricks",
    nutritionFacts: 'Nutrition Facts (Per Serving)',
    calories: 'Calories',
    protein: 'Protein',
    carbs: 'Carbs',
    fat: 'Fats',
    backToRecipes: 'Back to Recipes',
    saveFavorite: 'Save to Favorites',
    savedFavorite: 'Saved in Favorites',
    shareRecipe: 'Share Recipe',
    printRecipe: 'Print Recipe',
    optionalTag: 'Optional',
    stepWord: 'Step',

    popularRecipesTitle: 'Popular Recipes',
    popularRecipesSubtitle: 'Highest-rated authentic crowd-pleasers cooked by food lovers.',
    categoriesTitle: 'Explore Food Categories',
    categoriesSubtitle: 'Find the perfect meal by occasion, region, or culinary style.',
    viewAllBtn: 'View All',
    vegSpotlightTitle: '100% Pure Vegetarian Specials',
    vegSpotlightSubtitle: 'Fragrant biryanis, silky paneer gravies, and farm-fresh curries strictly free from meat.',
    nonVegSpotlightTitle: 'Succulent Non-Vegetarian Specials',
    nonVegSpotlightSubtitle: 'Dum biryanis, pepper chicken curries, and ocean-fresh seafood.',

    searchPlaceholder: 'Search dishes, ingredients, cuisines...',
    popularSearches: 'Popular Searches:',
    filterTitle: 'Filter Recipes',
    allCuisines: 'All Cuisines',
    allCategories: 'All Categories',
    allDifficulties: 'All Levels',
    sortByLabel: 'Sort by:',
    sortPopular: 'Most Popular',
    sortQuickest: 'Quickest (< Time)',
    sortEasiest: 'Easiest First',
    sortRecent: 'Recently Added',
    resetFilters: 'Reset Filters',
    showingResults: 'Showing {count} delicious recipes',
    noRecipesFound: 'No matching recipes found. Try adjusting your filters or search keywords.',
    loadMore: 'Load More Recipes',

    micListening: 'Listening... Speak your ingredients now',
    micSpeakNow: 'Speak now (e.g. spinach, rice, tomato)',
    micNotSupported: 'Microphone is not supported in this browser.',
    micPermissionDenied: 'Microphone access was denied. Please allow microphone permission in your browser.',
    micClickToSpeak: 'Click to speak ingredients (Voice Input)',

    chatTitle: 'AI Chef Assistant',
    chatSubtitle: 'Ask for recipes, pantry twists, or cooking tips',
    chatOnline: 'Online',
    chatPlaceholder: 'Speak or type ingredients (e.g. spinach, rice, tomato)...',
    chatSend: 'Send',
    chatClear: 'Clear Chat',
    suggestedQuestionsTitle: 'Try Asking Our AI Chef:',
    strictVegChatRule: 'Strict Pure Veg Mode Active: Recommending 100% vegetarian recipes only.',
    chatWelcomeIntro: 'Hello! I am your AI Chef. Tell me what ingredients you have in your kitchen (type or click the microphone), and I will create the perfect recipe for you!',
    numberOfPeople: 'Number of People',
    personUnit: 'Person',
    peopleUnit: 'People'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('what2cook_lang');
      if (saved && saved !== 'en') {
        localStorage.setItem('what2cook_lang', 'en');
      }
    }
  }, []);

  const setLanguage = (_lang: Language) => {
    setLanguageState('en');
    if (typeof window !== 'undefined') {
      localStorage.setItem('what2cook_lang', 'en');
    }
  };

  const t = TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
