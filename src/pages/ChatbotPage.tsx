import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, Sparkles, AlertCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType, Recipe } from '../types';
import { generateRecipeFromAI } from '../services/aiChefService';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { AIChefTypingIndicator } from '../components/LoadingSpinner';

interface ChatbotPageProps {
  initialPrompt?: string;
  onOpenRecipeDetails: (recipe: Recipe) => void;
}

const DEFAULT_WELCOME_MESSAGE: ChatMessageType = {
  id: 'msg-welcome',
  sender: 'chef',
  text: "Hello! I am your RecipeMate AI Chef. 👨‍🍳 Tell me what ingredients you have in your kitchen, or ask for meal ideas (e.g. 'What can I make with rice and chicken?' or 'Suggest a quick vegetarian dinner'). I'll design a delicious recipe for you!",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export const ChatbotPage: React.FC<ChatbotPageProps> = ({
  initialPrompt,
  onOpenRecipeDetails,
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    const saved = localStorage.getItem('recipemate_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [DEFAULT_WELCOME_MESSAGE];
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
      const result = await generateRecipeFromAI(trimmed);

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
        text: "Sorry, I couldn't generate a recipe right now. Please try again or try asking for common pantry items like potato, rice, chicken, or eggs.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackChefMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const freshWelcome: ChatMessageType = {
      ...DEFAULT_WELCOME_MESSAGE,
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
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <ChefHat className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-stone-900 text-base sm:text-lg">
                AI Chef Assistant
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              Trained on authentic global culinary recipes & pantry combinations
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-stone-500 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>Natural Language Powered</span>
        </div>
      </div>

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

      {/* Bottom Conversational Input & Suggested Questions */}
      <div className="mt-2 rounded-2xl overflow-hidden shadow-sm border border-stone-200">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onClearChat={handleClearChat}
        />
      </div>
    </div>
  );
};
