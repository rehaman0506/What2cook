import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Leaf, Drumstick, Users } from 'lucide-react';
import { ChatMessage as ChatMessageType, Recipe } from '../types';
import { generateRecipeFromAI } from '../services/aiChefService';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { AIChefTypingIndicator } from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';

interface ChatbotPageProps {
  initialPrompt?: string;
  onOpenRecipeDetails: (recipe: Recipe) => void;
}

export const ChatbotPage: React.FC<ChatbotPageProps> = ({
  initialPrompt,
  onOpenRecipeDetails,
}) => {
  const { t } = useLanguage();
  const [dietaryFilter, setDietaryFilter] = useState<'ALL' | 'VEGETARIAN' | 'NON-VEGETARIAN'>('ALL');
  const [servings, setServings] = useState<number>(2);

  const defaultWelcomeMessage: ChatMessageType = {
    id: 'msg-welcome',
    sender: 'chef',
    text: t.chatWelcomeIntro || "Hello! I am your AI Chef. 👨‍🍳 Tell me what ingredients you have in your kitchen (type or click the microphone), and I'll create the perfect recipe for you!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    const saved = localStorage.getItem('what2cook_chat_history') || localStorage.getItem('recipemate_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Always ensure the welcome message matches the currently active language
          return parsed.map((msg: ChatMessageType) => {
            if (msg.id === 'msg-welcome' || (!msg.recipe && msg.sender === 'chef' && parsed.length === 1)) {
              return {
                ...msg,
                id: 'msg-welcome',
                text: t.chatWelcomeIntro || "Hello! I am your AI Chef. 👨‍🍳 Tell me what ingredients you have in your kitchen (type or click the microphone), and I'll create the perfect recipe for you!"
              };
            }
            return msg;
          });
        }
      } catch {}
    }
    return [defaultWelcomeMessage];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitialRef = useRef(false);

  // Sync chat messages to localStorage
  useEffect(() => {
    localStorage.setItem('what2cook_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle initial prompt passed from Home hero CTA
  useEffect(() => {
    if (initialPrompt && !hasSentInitialRef.current) {
      hasSentInitialRef.current = true;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (userPrompt: string) => {
    const trimmed = userPrompt.trim();
    if (!trimmed || isLoading) return;

    setErrorMessage(null);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessageType = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: now,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await generateRecipeFromAI(trimmed, dietaryFilter, 'en', servings);

      const chefMessage: ChatMessageType = {
        id: `chef-${Date.now()}`,
        sender: 'chef',
        text: result.conversationalIntro,
        recipe: result.recipe,
        userIngredients: result.userIngredients,
        additionalIngredients: result.additionalIngredients,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, chefMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage("Sorry, I couldn't generate a recipe right now. Please try again.");

      const fallbackChefMessage: ChatMessageType = {
        id: `chef-err-${Date.now()}`,
        sender: 'chef',
        text: "Sorry, I couldn't generate a recipe right now. Please try again with ingredients like spinach, rice, or potato.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackChefMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const freshWelcome: ChatMessageType = {
      ...defaultWelcomeMessage,
      id: 'msg-welcome',
      text: t.chatWelcomeIntro,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([freshWelcome]);
    setErrorMessage(null);
    localStorage.removeItem('what2cook_chat_history');
    localStorage.removeItem('recipemate_chat_history');
  };

  return (
    <div className="w-full max-w-md mx-auto px-2 sm:px-0 py-2 sm:py-3 h-[calc(100vh-4.5rem)] sm:h-[calc(100vh-5rem)] flex flex-col animate-fade-in">
      {/* Top Chat Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-2.5 sm:p-3 shadow-xs mb-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="AI Chef" className="w-9 h-9 object-contain drop-shadow-xs" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-stone-900 text-sm sm:text-base leading-tight">
                  {t.chatTitle || 'AI Chef Assistant'}
                </h2>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t.chatOnline || 'Online'}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium leading-tight">
                {t.chatSubtitle || 'Ask for recipes, pantry twists, or cooking tips'}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Header Controls: Prominent Number of People & Dietary Filter */}
        <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-stone-100">
          {/* Prominent Number of People / Servings Selector */}
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-50/90 border border-orange-200/90 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <label htmlFor="servings-select" className="text-[11px] font-bold text-stone-700 whitespace-nowrap">
              {t.servings || 'Servings'}:
            </label>
            <select
              id="servings-select"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              aria-label={t.numberOfPeople || 'Number of People'}
              className="bg-white text-stone-900 text-[11px] font-extrabold rounded px-1.5 py-0.5 border border-orange-300 shadow-2xs outline-none cursor-pointer focus:ring-1 focus:ring-orange-500 hover:bg-orange-50/50 transition-all"
            >
              <option value={1}>1 {t.personUnit || 'Person'}</option>
              <option value={2}>2 {t.peopleUnit || 'People'}</option>
              <option value={3}>3 {t.peopleUnit || 'People'}</option>
              <option value={4}>4 {t.peopleUnit || 'People'}</option>
              <option value={5}>5 {t.peopleUnit || 'People'}</option>
              <option value={6}>6 {t.peopleUnit || 'People'}</option>
              <option value={8}>8 {t.peopleUnit || 'People'}</option>
              <option value={10}>10 {t.peopleUnit || 'People'}</option>
            </select>
          </div>

          {/* Dietary Preference Toggle in Chatbot */}
          <div className="inline-flex p-0.5 rounded-lg bg-stone-100 border border-stone-200/80 shadow-2xs text-[11px]">
            <button
              type="button"
              onClick={() => setDietaryFilter('ALL')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                dietaryFilter === 'ALL'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.dietAll}
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('VEGETARIAN')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer ${
                dietaryFilter === 'VEGETARIAN'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Leaf className="w-2.5 h-2.5" />
              {t.dietVeg}
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('NON-VEGETARIAN')}
              className={`px-2 py-0.5 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer ${
                dietaryFilter === 'NON-VEGETARIAN'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <Drumstick className="w-2.5 h-2.5" />
              {t.dietNonVeg}
            </button>
          </div>
        </div>
      </div>

      {/* Pure Veg Banner when active */}
      {dietaryFilter === 'VEGETARIAN' && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-sm border border-emerald-600 flex items-center justify-center p-0.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 block" />
          </span>
          <span>{t.strictVegChatRule || 'Strict Pure Veg Mode Active: Recommending 100% vegetarian recipes only.'}</span>
        </div>
      )}

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="mb-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Scrollable Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 rounded-2xl bg-stone-50/70 border border-stone-200 space-y-4 shadow-inner">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onOpenRecipe={onOpenRecipeDetails}
          />
        ))}

        {isLoading && <AIChefTypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Conversational Input & Suggested Questions with Microphone */}
      <div className="mt-2 rounded-2xl overflow-hidden shadow-sm border border-stone-200">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onClearChat={handleClearChat}
          isVegetarianMode={dietaryFilter === 'VEGETARIAN'}
        />
      </div>
    </div>
  );
};
