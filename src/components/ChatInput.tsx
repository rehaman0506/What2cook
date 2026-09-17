import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles, Loader2, CornerDownLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { VoiceMicButton } from './VoiceMicButton';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClearChat: () => void;
  initialValue?: string;
  isVegetarianMode?: boolean;
}

const MULTILINGUAL_SUGGESTIONS = {
  en: [
    "What can I make with spinach, rice, and tomato?",
    "Suggest a 100% pure vegetarian recipe",
    "How to make Hyderabadi chicken biryani?",
    "What can I make with potato and tomato?",
    "Give me a quick 20-minute recipe"
  ],
  te: [
    "పాలకూర, బియ్యం, టమాటాతో ఏమి చేయవచ్చు?",
    "100% స్వచ్ఛమైన శాకాహార వంటకం సూచించండి",
    "హైదరాబాదీ చికెన్ దమ్ బిర్యానీ ఎలా చేయాలి?",
    "బంగాళాదుంప, టమాటాతో రుచికరమైన కూర",
    "20 నిమిషాల్లో త్వరగా అయ్యే వంటకం"
  ],
  hi: [
    "पालक, चावल और टमाटर से क्या बना सकते हैं?",
    "100% शुद्ध शाकाहारी रेसिपी बताएं",
    "हैदराबादी चिकन दम बिरयानी कैसे बनाएं?",
    "आलू और टमाटर की स्वादिष्ट सब्ज़ी",
    "20 मिनट में झटपट बनने वाली रेसिपी"
  ]
};

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onClearChat,
  initialValue = '',
  isVegetarianMode = false,
}) => {
  const { language, t } = useLanguage();
  const [input, setInput] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialValue]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestedClick = (question: string) => {
    if (isLoading) return;
    onSendMessage(question);
  };

  const handleVoiceTranscript = (spokenText: string, isFinal?: boolean) => {
    if (!spokenText.trim()) return;
    setInput(spokenText);
    if (isFinal) {
      onSendMessage(spokenText.trim());
      setInput('');
    }
  };

  const rawSuggestions = MULTILINGUAL_SUGGESTIONS[language] || MULTILINGUAL_SUGGESTIONS.en;
  const suggestions = isVegetarianMode
    ? rawSuggestions.filter(q => !/chicken|చికెన్|चिकन/i.test(q))
    : rawSuggestions;

  return (
    <div className="w-full space-y-3 bg-white/95 backdrop-blur-md border-t border-stone-200/80 p-3 sm:p-5">
      {/* Suggested Question Pills (Single-Click Auto-Submit) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            {t.suggestedQuestionsTitle}
          </span>
          <button
            onClick={onClearChat}
            disabled={isLoading}
            className="text-[11px] font-semibold text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1 px-2 py-0.5 rounded hover:bg-stone-100 disabled:opacity-50"
            title={t.chatClear}
          >
            <Trash2 className="w-3 h-3" />
            {t.chatClear}
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {suggestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestedClick(q)}
              disabled={isLoading}
              className="shrink-0 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-orange-300 bg-stone-50 hover:bg-orange-50 text-stone-700 hover:text-orange-700 font-medium transition-all text-left shadow-xs disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Conversational Input Form with Voice Microphone Button */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        {/* Voice Input Microphone Button */}
        <VoiceMicButton
          onTranscript={handleVoiceTranscript}
          size="md"
          className="shrink-0 shadow-xs"
        />

        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={t.chatPlaceholder}
            className="w-full pl-4 pr-12 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white resize-none text-sm leading-relaxed transition-all"
          />
          <div className="absolute right-3 top-3 hidden sm:block text-stone-300 pointer-events-none">
            <CornerDownLeft className="w-4 h-4" />
          </div>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-md shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline text-sm">{t.chatSend}</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
