import React, { useState } from 'react';
import { X, Mail, Lock, Heart, LogOut, CheckCircle2, AlertCircle, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { Recipe } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'auth' | 'favorites';
  onSelectRecipe?: (recipe: Recipe) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'auth',
  onSelectRecipe,
}) => {
  const { user, signIn, signUp, signOut, continueAsGuest } = useAuth();
  const { favoriteRecipes, toggleFavorite } = useFavorites();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'profile' | 'favorites'>(
    initialMode === 'favorites' ? 'favorites' : user && !user.isGuest ? 'profile' : 'signin'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'signup') {
        const res = await signUp(email.trim());
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg('Account ready! Welcome to What2Cook.');
          setTimeout(() => {
            setActiveTab('profile');
          }, 800);
        }
      } else {
        const res = await signIn(email.trim());
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg('Signed in successfully!');
          setTimeout(() => {
            setActiveTab('profile');
          }, 800);
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setActiveTab('signin');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <ChefHat className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-base">
              {activeTab === 'favorites' ? 'My Saved Favorites' : 'What2Cook Chef Account'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-100 bg-stone-50/40 text-xs font-bold text-stone-600">
          {user && !user.isGuest ? (
            <>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 border-b-2 transition-all ${
                  activeTab === 'profile'
                    ? 'border-orange-500 text-orange-600 bg-white'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-3 border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'favorites'
                    ? 'border-orange-500 text-orange-600 bg-white'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                Saved ({favoriteRecipes.length})
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-3 border-b-2 transition-all ${
                  activeTab === 'signin'
                    ? 'border-orange-500 text-orange-600 bg-white'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-3 border-b-2 transition-all ${
                  activeTab === 'signup'
                    ? 'border-orange-500 text-orange-600 bg-white'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-3 border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'favorites'
                    ? 'border-orange-500 text-orange-600 bg-white'
                    : 'border-transparent hover:text-stone-900'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Saved ({favoriteRecipes.length})
              </button>
            </>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN / SIGN UP FORMS */}
          {(activeTab === 'signin' || activeTab === 'signup') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student.chef@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {loading
                  ? 'Connecting...'
                  : activeTab === 'signup'
                  ? 'Create Student Chef Account'
                  : 'Sign In to Account'}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    continueAsGuest();
                    onClose();
                  }}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
                >
                  Continue as Guest Chef (Instant demo access)
                </button>
              </div>
            </form>
          )}

          {/* USER PROFILE */}
          {activeTab === 'profile' && user && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 text-base">{user.email}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      {user.isGuest ? 'Guest Chef Session' : 'Verified Chef'}
                    </span>
                    <span className="text-xs text-stone-500">
                      Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">Saved Recipes</span>
                  <div className="text-2xl font-black text-stone-900 mt-1">{favoriteRecipes.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">AI Kitchen Status</span>
                  <div className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Ready & Active
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('favorites')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  View Saved Recipes →
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* FAVORITES LIST */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              {favoriteRecipes.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-stone-800 text-base">No saved recipes yet</h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Click the heart icon on any recipe card or ask the AI Chef to save delicious recipes to your collection.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoriteRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="p-3 rounded-2xl border border-stone-200 hover:border-orange-300 transition-all flex items-center justify-between gap-3 bg-stone-50/50"
                    >
                      <div
                        onClick={() => {
                          if (onSelectRecipe) {
                            onSelectRecipe(recipe);
                            onClose();
                          }
                        }}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <img
                          src={recipe.image_url}
                          alt={recipe.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h5 className="font-bold text-stone-900 text-sm line-clamp-1 hover:text-orange-600">
                            {recipe.name}
                          </h5>
                          <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                            <span className={recipe.food_type === 'VEGETARIAN' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                              {recipe.food_type}
                            </span>
                            <span>•</span>
                            <span>{recipe.cooking_time}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFavorite(recipe)}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove from favorites"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
