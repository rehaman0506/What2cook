import React, { useState } from 'react';
import { ChefHat, Sparkles, Heart, User, Menu, X, Utensils, BookOpen, Layers, Bot, Globe } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage, Language } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: 'home' | 'recipes' | 'categories' | 'chatbot';
  setActiveTab: (tab: 'home' | 'recipes' | 'categories' | 'chatbot') => void;
  onOpenAuthModal: () => void;
  onOpenFavoritesModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuthModal,
  onOpenFavoritesModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favoriteIds } = useFavorites();
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleNavClick = (tab: 'home' | 'recipes' | 'categories' | 'chatbot') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const languages: { code: Language; label: string; short: string }[] = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'te', label: 'తెలుగు', short: 'తె' },
    { code: 'hi', label: 'हिंदी', short: 'हि' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <ChefHat className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors">
                  What2Cook
                </span>
                <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-stone-500 hidden sm:block -mt-1 font-medium">{t.smartChefTag}</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Utensils className="w-4 h-4" />
              {t.navHome}
            </button>
            <button
              onClick={() => handleNavClick('recipes')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'recipes'
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t.navRecipes}
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'categories'
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              <Layers className="w-4 h-4" />
              {t.navCategories}
            </button>
            <button
              onClick={() => handleNavClick('chatbot')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 shadow-sm ${
                activeTab === 'chatbot'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/25 ring-2 ring-orange-400'
                  : 'bg-orange-100/80 text-orange-700 hover:bg-orange-500 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {t.navChatbot}
            </button>
          </nav>

          {/* Right Action Icons (Language Switcher + Favorites + Profile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 3-Language Switcher (English, Telugu, Hindi) */}
            <div className="flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200/80 shadow-xs">
              <Globe className="w-3.5 h-3.5 text-stone-500 ml-1.5 mr-1 hidden sm:inline" />
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  title={`Switch language to ${lang.label}`}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === lang.code
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  <span className="sm:hidden">{lang.short}</span>
                  <span className="hidden sm:inline">{lang.label}</span>
                </button>
              ))}
            </div>

            {/* Favorites Button */}
            <button
              onClick={onOpenFavoritesModal}
              aria-label="View Saved Recipes"
              className="relative p-2.5 rounded-xl text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-all border border-stone-200/60"
              title={t.navFavorites}
            >
              <Heart className={`w-5 h-5 ${favoriteIds.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-fade-in">
                  {favoriteIds.length}
                </span>
              )}
            </button>

            {/* Profile / Auth Button */}
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-xl border border-stone-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all text-sm font-medium text-stone-700"
            >
              <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                {user?.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <span className="hidden sm:inline font-semibold">
                {user && !user.isGuest ? user.email.split('@')[0] : t.navSignIn}
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-100 py-3 space-y-2 animate-slide-up">
            <div className="px-4 py-2 flex items-center justify-between bg-stone-50 rounded-xl mb-1">
              <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Language / భాష / भाषा:
              </span>
              <div className="flex gap-1">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      language === lang.code ? 'bg-orange-500 text-white' : 'bg-white border text-stone-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm font-semibold ${
                activeTab === 'home' ? 'bg-orange-50 text-orange-600' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Utensils className="w-4 h-4" />
              {t.navHome}
            </button>
            <button
              onClick={() => handleNavClick('recipes')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm font-semibold ${
                activeTab === 'recipes' ? 'bg-orange-50 text-orange-600' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t.navRecipes}
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm font-semibold ${
                activeTab === 'categories' ? 'bg-orange-50 text-orange-600' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              {t.navCategories}
            </button>
            <button
              onClick={() => handleNavClick('chatbot')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm font-bold ${
                activeTab === 'chatbot'
                  ? 'bg-orange-500 text-white'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              <Bot className="w-4 h-4" />
              {t.navChatbot}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
