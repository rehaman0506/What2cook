import React, { useState, useEffect } from 'react';
import { Recipe, RecipeFilterState } from './types';
import { fetchAllRecipes } from './services/recipeService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { RecipesPage } from './pages/RecipesPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { RecipeDetailsModal } from './components/RecipeDetailsModal';
import { AuthModal } from './components/AuthModal';
import { LoadingSpinner } from './components/LoadingSpinner';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'recipes' | 'categories' | 'chatbot'>('home');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState<boolean>(true);

  // Filter state for Recipes Catalog
  const [filters, setFilters] = useState<RecipeFilterState>({
    searchQuery: '',
    foodType: 'ALL',
    cuisine: 'ALL',
    category: 'ALL',
    maxCookTime: null,
    difficulty: 'ALL',
    sortBy: 'popular',
  });

  // Modal states
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'auth' | 'favorites'>('auth');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);

  // Fetch initial recipes
  useEffect(() => {
    const loadData = async () => {
      setLoadingRecipes(true);
      try {
        const data = await fetchAllRecipes();
        setRecipes(data);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      } finally {
        setLoadingRecipes(false);
      }
    };
    loadData();
  }, []);

  // Navigation helpers
  const handleNavigateToChat = (prompt?: string) => {
    setChatInitialPrompt(prompt);
    setActiveTab('chatbot');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToRecipes = (
    query?: string,
    categoryTag?: string,
    diet?: 'ALL' | 'VEGETARIAN' | 'NON-VEGETARIAN',
    resetOtherFilters: boolean = true
  ) => {
    setFilters(prev => {
      if (resetOtherFilters) {
        return {
          searchQuery: query !== undefined ? query : '',
          category: categoryTag !== undefined ? categoryTag : 'ALL',
          cuisine: 'ALL',
          foodType: diet !== undefined ? diet : 'ALL',
          maxCookTime: null,
          difficulty: 'ALL',
          sortBy: 'popular',
        };
      }
      return {
        ...prev,
        searchQuery: query !== undefined ? query : prev.searchQuery,
        category: categoryTag !== undefined ? categoryTag : prev.category,
        foodType: diet !== undefined ? diet : prev.foodType,
      };
    });
    setActiveTab('recipes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCategories = () => {
    setActiveTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryTag: string) => {
    handleNavigateToRecipes(undefined, categoryTag);
  };

  const handleOpenFavoritesModal = () => {
    setAuthModalMode('favorites');
    setAuthModalOpen(true);
  };

  const handleOpenAuthModal = () => {
    setAuthModalMode('auth');
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col kitchen-theme-bg font-sans text-stone-900 selection:bg-orange-500 selection:text-white">
      {/* Top Fixed Header / Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenFavoritesModal={handleOpenFavoritesModal}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {loadingRecipes && recipes.length === 0 ? (
          <LoadingSpinner message="Preparing delicious recipes..." />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage
                recipes={recipes}
                onSelectRecipe={setSelectedRecipe}
                onNavigateToChat={handleNavigateToChat}
                onNavigateToRecipes={handleNavigateToRecipes}
                onNavigateToCategories={handleNavigateToCategories}
              />
            )}

            {activeTab === 'recipes' && (
              <RecipesPage
                recipes={recipes}
                filters={filters}
                setFilters={setFilters}
                onSelectRecipe={setSelectedRecipe}
                onAskAIChef={handleNavigateToChat}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesPage
                onSelectCategory={handleCategorySelect}
              />
            )}

            {activeTab === 'chatbot' && (
              <ChatbotPage
                initialPrompt={chatInitialPrompt}
                onOpenRecipeDetails={setSelectedRecipe}
              />
            )}
          </>
        )}
      </main>

      {/* Footer (Rendered on Home, Recipes, and Categories; Hidden on full-height Chatbot) */}
      {activeTab !== 'chatbot' && (
        <Footer setActiveTab={setActiveTab} />
      )}

      {/* Recipe Full Details Modal */}
      <RecipeDetailsModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onAskAIChef={(prompt) => handleNavigateToChat(prompt)}
      />

      {/* User Auth & Favorites Profile Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
      />
    </div>
  );
};
