import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, AlertCircle, Leaf, Drumstick } from 'lucide-react';
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
  const { t, language } = useLanguage();
  const [dietaryFilter, setDietaryFilter] = useState<'ALL' | 'VEGETARIAN' | 'NON-VEGETARIAN'>('ALL');

  const defaultWelcomeMessage: ChatMessageType = {
    id: 'msg-welcome',
    sender: 'chef',
    text: t.chatWelcomeIntro || "Hello! I am your AI Chef. 👨‍🍳 Tell me what ingredients you have in your kitchen (type or click the microphone), and I'll create the perfect recipe for you!",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    const saved = localStorage.getItem('recipemate_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
    localStorage.setItem('recipemate_chat_history', JSON.stringify(messages));
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
      const result = await generateRecipeFromAI(trimmed, dietaryFilter, language);

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
        text: language === 'te'
          ? "క్షమించండి, ప్రస్తుతం వంటకం తయారు చేయలేకపోయాను. దయచేసి పాలకూర, బియ్యం లేదా టమాటా వంటి పదార్థాలతో ప్రయత్నించండి."
          : language === 'hi'
          ? "क्षमा करें, इस समय रेसिपी नहीं बन पाई। कृपया पालक, चावल या टमाटर जैसी सामग्री के साथ पुनः प्रयास करें।"
          : "Sorry, I couldn't generate a recipe right now. Please try again with ingredients like spinach, rice, or potato.",
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
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([freshWelcome]);
    setErrorMessage(null);
    localStorage.removeItem('recipemate_chat_history');
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 h-[calc(100vh-5rem)] flex flex-col animate-fade-in">
      {/* Top Chat Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 sm:p-4 shadow-sm mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <ChefHat className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-stone-900 text-base sm:text-lg">
                {t.chatTitle || 'AI Chef Assistant'}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {t.chatOnline || 'Online'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              {t.chatSubtitle || 'Ask for recipes, pantry twists, or cooking tips in any language'}
            </p>
          </div>
        </div>

        {/* Dietary Preference Toggle in Chatbot */}
        <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200/80 self-stretch sm:self-auto justify-between">
          <button
            type="button"
            onClick={() => setDietaryFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              dietaryFilter === 'ALL'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.dietAll}
          </button>
          <button
            type="button"
            onClick={() => setDietaryFilter('VEGETARIAN')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              dietaryFilter === 'VEGETARIAN'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-sm border border-current flex items-center justify-center p-0.5">
              <span className="w-1 h-1 rounded-full bg-current block" />
            </span>
            <Leaf className="w-3 h-3" />
            {t.dietVeg}
          </button>
          <button
            type="button"
            onClick={() => setDietaryFilter('NON-VEGETARIAN')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              dietaryFilter === 'NON-VEGETARIAN'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <span className="w-2 h-2 rounded-sm border border-current flex items-center justify-center p-0.5">
              <span className="w-1 h-1 rounded-full bg-current block" />
            </span>
            <Drumstick className="w-3 h-3" />
            {t.dietNonVeg}
          </button>
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
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 rounded-2xl bg-stone-50/70 border border-stone-200 space-y-6 shadow-inner">
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
