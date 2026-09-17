import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'te' | 'hi';

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
    chatSubtitle: 'Ask for recipes, pantry twists, or cooking tips in any language',
    chatOnline: 'Online',
    chatPlaceholder: 'Speak or type ingredients (e.g. spinach, rice, tomato)...',
    chatSend: 'Send',
    chatClear: 'Clear Chat',
    suggestedQuestionsTitle: 'Try Asking Our AI Chef:',
    strictVegChatRule: 'Strict Pure Veg Mode Active: Recommending 100% vegetarian recipes only.',
    chatWelcomeIntro: 'Hello! I am your AI Chef. Tell me what ingredients you have at home (type or click the microphone), and I will create the perfect recipe for you!'
  },

  te: {
    navHome: 'హోమ్',
    navRecipes: 'వంటకాలు',
    navCategories: 'వర్గాలు',
    navChatbot: 'AI చెఫ్ చాట్‌బాట్',
    navFavorites: 'సేవ్ చేసినవి',
    navSignIn: 'లాగిన్',
    smartChefTag: 'స్మార్ట్ AI కిచెన్ చెఫ్',

    heroBadge: 'స్మార్ట్ AI వంటల సహాయకుడు',
    heroTitle1: 'మీ వద్ద ఉన్న పదార్థాలతో',
    heroTitle2: 'రుచికరమైన వంటకాలు చేసుకోండి',
    heroSubtitle: 'మీ ఇంట్లో ఏమున్నాయో మా AI కి చెప్పండి, మీరు ఏమి వండవచ్చో సులభంగా తెలుసుకోండి.',
    kitchenTitle: 'ఈరోజు మీ కిచెన్‌లో ఏ పదార్థాలు ఉన్నాయి?',
    kitchenDesc: 'కింద ఉన్న పదార్థాలను ఎంచుకోండి లేదా టైప్ చేయండి:',
    ingredientPlaceholder: 'ఉదా: పాలకూర, బియ్యం, టమాటా, బంగాళాదుంప, పనీర్...',
    findRecipesBtn: 'సరిపోయే వంటకాలు చూడండి',
    askAiChefBtn: 'AI చెఫ్ తో వండించండి',
    pantryQuickAdd: 'సాధారణ కిచెన్ పదార్థాలు:',

    dietPreference: 'ఆహార ప్రాధాన్యత',
    dietAll: 'అన్ని రకాలు',
    dietVeg: 'శాకాహారం (Veg)',
    dietNonVeg: 'మాంసాహారం (Non-Veg)',
    pureVegBadge: '100% స్వచ్ఛమైన శాకాహారం',
    nonVegBadge: 'మాంసాహారం (NON-VEG)',
    pureVegTagline: 'మాంసం మరియు గుడ్డు లేని 100% ప్యూర్ వెజ్ మరియు పనీర్ రుచులు',
    nonVegTagline: 'నోరూరించే చికెన్, మటన్ మరియు తాజా చేపల వంటకాలు',

    viewRecipe: 'వంటకం చూడండి',
    ingredientsCount: 'పదార్థాలు',
    cookTime: 'వండే సమయం',
    prepTime: 'సిద్ధం చేసే సమయం',
    totalTime: 'మొత్తం సమయం',
    servings: 'సర్వింగ్స్',
    difficulty: 'స్థాయి',
    easy: 'సులువు',
    medium: 'మధ్యస్థం',
    hard: 'కష్టం',
    ingredientsTitle: 'కావలసిన పదార్థాలు',
    instructionsTitle: 'తయారీ విధానం (దశల వారీగా)',
    chefTipsTitle: 'చెఫ్ ఇచ్చే ప్రత్యేక చిట్కాలు',
    nutritionFacts: 'పోషక విలువలు (ఒక సర్వింగ్‌కు)',
    calories: 'క్యాలరీలు',
    protein: 'ప్రోటీన్',
    carbs: 'కార్బోహైడ్రేట్లు',
    fat: 'కొవ్వు పదార్థాలు',
    backToRecipes: 'వంటకాలకు తిరిగి వెళ్లు',
    saveFavorite: 'సేవ్ చేయండి',
    savedFavorite: 'సేవ్ చేయబడింది',
    shareRecipe: 'షేర్ చేయండి',
    printRecipe: 'ప్రింట్ చేయండి',
    optionalTag: 'ఐచ్ఛికం',
    stepWord: 'దశ',

    popularRecipesTitle: 'ప్రసిద్ధ వంటకాలు (Popular Recipes)',
    popularRecipesSubtitle: 'వేలాది మంది ఇష్టపడే అత్యధిక రేటింగ్ పొందిన రుచికరమైన వంటకాలు.',
    categoriesTitle: 'ఆహార వర్గాలు (Categories)',
    categoriesSubtitle: 'మీకు ఇష్టమైన వర్గం ప్రకారం వంటకాలను అన్వేషించండి.',
    viewAllBtn: 'అన్నీ చూడండి',
    vegSpotlightTitle: '100% స్వచ్ఛమైన శాకాహార వంటకాలు',
    vegSpotlightSubtitle: 'సువాసనగల పులావ్‌లు, పనీర్ కూరలు, మరియు తాజా కూరగాయల వంటకాలు.',
    nonVegSpotlightTitle: 'స్పెషల్ మాంసాహార వంటకాలు',
    nonVegSpotlightSubtitle: 'ఘుమఘుమలాడే దమ్ బిర్యానీ, పెప్పర్ చికెన్, మరియు సీఫుడ్ వంటకాలు.',

    searchPlaceholder: 'వంటకాలు, పదార్థాలు లేదా ప్రాంతం పేరుతో వెతకండి...',
    popularSearches: 'ప్రసిద్ధ శోధనలు:',
    filterTitle: 'ఫిల్టర్లు',
    allCuisines: 'అన్ని ప్రాంతాలు',
    allCategories: 'అన్ని వర్గాలు',
    allDifficulties: 'అన్ని స్థాయిలు',
    sortByLabel: 'క్రమబద్ధీకరించు:',
    sortPopular: 'అత్యధిక రేటింగ్',
    sortQuickest: 'త్వరగా అయ్యేవి (< సమయం)',
    sortEasiest: 'చాలా సులువైనవి',
    sortRecent: 'ఇటీవల చేర్చినవి',
    resetFilters: 'రీసెట్ చేయండి',
    showingResults: '{count} రుచికరమైన వంటకాలు కనుగొనబడ్డాయి',
    noRecipesFound: 'వంటకాలు ఏవీ కనుగొనబడలేదు. దయచేసి ఇతర శోధన పదాలను ప్రయత్నించండి.',
    loadMore: 'మరిన్ని వంటకాలు లోడ్ చేయండి',

    micListening: 'వింటున్నాను... పదార్థాలు చెప్పండి (వాయిస్ రికార్డింగ్)',
    micSpeakNow: 'ఇప్పుడు మాట్లాడండి (ఉదా: పాలకూర, బియ్యం, టమాటా)',
    micNotSupported: 'ఈ బ్రౌజర్‌లో మైక్రోఫోన్ వాయిస్ సదుపాయం అందుబాటులో లేదు.',
    micPermissionDenied: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్‌లో మైక్ అనుమతి ఇవ్వండి.',
    micClickToSpeak: 'మైక్ నొక్కి పదార్థాలు చెప్పండి (వాయిస్ ఇన్‌పుట్)',

    chatTitle: 'AI చెఫ్ సహాయకుడు',
    chatSubtitle: 'ఏదైనా భాషలో వంటకాలు, ప్రత్యామ్నాయాలు లేదా వంట చిట్కాలు అడగండి',
    chatOnline: 'ఆన్‌లైన్',
    chatPlaceholder: 'పదార్థాలు చెప్పండి లేదా టైప్ చేయండి (ఉదా: పాలకూర, బియ్యం, టమాటా)...',
    chatSend: 'పంపు',
    chatClear: 'చాట్ క్లియర్ చేయండి',
    suggestedQuestionsTitle: 'ఈ ప్రశ్నలను అడగండి:',
    strictVegChatRule: 'స్వచ్ఛమైన శాకాహార మోడ్ యాక్టివ్‌గా ఉంది: 100% వెజ్ వంటకాలు మాత్రమే ఇవ్వబడతాయి.',
    chatWelcomeIntro: 'నమస్కారం! నేను మీ AI చెఫ్. మీ ఇంట్లో ఏ పదార్థాలు ఉన్నాయో చెప్పండి (టైప్ చేయండి లేదా మైక్రోఫోన్ నొక్కి మాట్లాడండి), నేను మీకు సరైన వంటకం సూచిస్తాను!'
  },

  hi: {
    navHome: 'होम',
    navRecipes: 'रेसिपीज',
    navCategories: 'श्रेणियाँ',
    navChatbot: 'AI शेफ चैटबॉट',
    navFavorites: 'पसंदीदा',
    navSignIn: 'लॉग इन',
    smartChefTag: 'स्मार्ट AI किचन शेफ',

    heroBadge: 'स्मार्ट AI पाक सहायक',
    heroTitle1: 'अपनी रसोई की सामग्री से बनाएं',
    heroTitle2: 'स्वादिष्ट और लजीज व्यंजन',
    heroSubtitle: 'हमारे AI को बताएं कि आपकी रसोई में क्या सामग्री है और जानिए आप क्या बना सकते हैं।',
    kitchenTitle: 'आज आपकी रसोई में क्या-क्या सामग्री है?',
    kitchenDesc: 'नीचे दी गई सामग्री चुनें या टाइप करें:',
    ingredientPlaceholder: 'जैसे: पालक, चावल, टमाटर, आलू, पनीर...',
    findRecipesBtn: 'मिलती-जुलती रेसिपी देखें',
    askAiChefBtn: 'AI शेफ से रेसिपी बनवाएं',
    pantryQuickAdd: 'सामान्य रसोई सामग्री:',

    dietPreference: 'आहार प्राथमिकता',
    dietAll: 'सभी प्रकार',
    dietVeg: 'शाकाहारी (Veg)',
    dietNonVeg: 'मांसाहारी (Non-Veg)',
    pureVegBadge: '100% शुद्ध शाकाहारी',
    nonVegBadge: 'मांसाहारी (NON-VEG)',
    pureVegTagline: 'मांस या अंडे से पूरी तरह मुक्त 100% शुद्ध शाकाहारी और पनीर व्यंजन',
    nonVegTagline: 'स्वादिष्ट चिकन, मटन और ताज़ा सीफ़ूड की ख़ास किस्में',

    viewRecipe: 'रेसिपी देखें',
    ingredientsCount: 'सामग्री',
    cookTime: 'पकाने का समय',
    prepTime: 'तैयारी का समय',
    totalTime: 'कुल समय',
    servings: 'सर्विंग्स',
    difficulty: 'कठिनाई',
    easy: 'आसान',
    medium: 'मध्यम',
    hard: 'कठिन',
    ingredientsTitle: 'आवश्यक सामग्री',
    instructionsTitle: 'बनाने की विधि (क्रमवार निर्देश)',
    chefTipsTitle: 'शेफ के खास टिप्स और नुस्खे',
    nutritionFacts: 'पोषण मूल्य (प्रति सर्विंग)',
    calories: 'कैलोरी',
    protein: 'प्रोटीन',
    carbs: 'कार्ब्स',
    fat: 'फैट्स',
    backToRecipes: 'रेसिपी सूची पर वापस जाएं',
    saveFavorite: 'पसंदीदा में जोड़ें',
    savedFavorite: 'पसंदीदा में सहेजा गया',
    shareRecipe: 'रेसिपी शेयर करें',
    printRecipe: 'प्रिंट करें',
    optionalTag: 'वैकल्पिक',
    stepWord: 'चरण',

    popularRecipesTitle: 'लोकप्रिय रेसिपीज (Popular Recipes)',
    popularRecipesSubtitle: 'हजारों छात्रों और भोजन प्रेमियों द्वारा पसंद की जाने वाली उच्चतम रेटेड रेसिपीज।',
    categoriesTitle: 'व्यंजन श्रेणियां (Categories)',
    categoriesSubtitle: 'अवसर, क्षेत्र या स्वाद के अनुसार सही भोजन खोजें।',
    viewAllBtn: 'सभी देखें',
    vegSpotlightTitle: '100% शुद्ध शाकाहारी खास व्यंजन',
    vegSpotlightSubtitle: 'खुशबूदार पुलाव, मलाईदार पनीर करी और ताज़ी सब्जियों के व्यंजन।',
    nonVegSpotlightTitle: 'स्वादिष्ट मांसाहारी व्यंजन',
    nonVegSpotlightSubtitle: 'दम बिरयानी, काली मिर्च चिकन करी और ताज़ा सीफ़ूड।',

    searchPlaceholder: 'व्यंजन, सामग्री या क्षेत्र के नाम से खोजें...',
    popularSearches: 'लोकप्रिय खोजें:',
    filterTitle: 'फ़िल्टर करें',
    allCuisines: 'सभी क्षेत्र',
    allCategories: 'सभी श्रेणियां',
    allDifficulties: 'सभी स्तर',
    sortByLabel: 'क्रमबद्ध करें:',
    sortPopular: 'सर्वाधिक लोकप्रिय',
    sortQuickest: 'कम समय में बनने वाले',
    sortEasiest: 'सबसे आसान',
    sortRecent: 'हाल ही में जोड़े गए',
    resetFilters: 'फ़िल्टर रीसेट करें',
    showingResults: '{count} स्वादिष्ट रेसिपीज मिलीं',
    noRecipesFound: 'कोई मिलती-जुलती रेसिपी नहीं मिली। कृपया अन्य शब्द खोजें।',
    loadMore: 'और रेसिपीज लोड करें',

    micListening: 'सुन रहे हैं... सामग्री बोलिए (वॉइस इनपुट)',
    micSpeakNow: 'अब बोलिए (जैसे: पालक, चावल, टमाटर)',
    micNotSupported: 'इस ब्राउज़र में माइक्रोफ़ोन वॉइस सुविधा समर्थित नहीं है।',
    micPermissionDenied: 'माइक्रोफ़ोन अनुमति अस्वीकृत कर दी गई। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।',
    micClickToSpeak: 'माइक दबाकर सामग्री बोलें (वॉइस इनपुट)',

    chatTitle: 'AI शेफ सहायक',
    chatSubtitle: 'किसी भी भाषा में रेसिपी, सामग्री के विकल्प या पकाने के टिप्स पूछें',
    chatOnline: 'ऑनलाइन',
    chatPlaceholder: 'सामग्री बोलें या टाइप करें (जैसे: पालक, चावल, टमाटर)...',
    chatSend: 'भेजें',
    chatClear: 'चैट साफ़ करें',
    suggestedQuestionsTitle: 'ये प्रश्न पूछकर देखें:',
    strictVegChatRule: 'शुद्ध शाकाहारी मोड सक्रिय: केवल 100% शाकाहारी रेसिपीज दी जाएंगी।',
    chatWelcomeIntro: 'नमस्ते! मैं आपका AI शेफ हूँ। मुझे बताएं कि आपकी रसोई में क्या सामग्री है (टाइप करें या माइक दबाकर बोलें), और मैं आपके लिए बेहतरीन रेसिपी तैयार करूँगा!'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('what2cook_lang') : null;
    if (saved === 'te' || saved === 'hi' || saved === 'en') {
      return saved as Language;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('what2cook_lang', lang);
    }
  };

  const t = TRANSLATIONS[language];

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
