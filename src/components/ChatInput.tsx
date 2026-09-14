import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Sparkles, Loader2, CornerDownLeft } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClearChat: () => void;
  initialValue?: string;
}

export const SUGGESTED_QUESTIONS = [
  "What can I make with rice and chicken?",
  "Give me a quick breakfast recipe.",
  "Suggest a vegetarian dinner.",
  "How do I make chicken biryani?",
  "What can I make with potato and tomato?",
  "Give me a 20-minute recipe."
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onClearChat,
  initialValue = '',
}) => {
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

  return (
    <div className="w-full space-y-3 bg-white/95 backdrop-blur-md border-t border-stone-200/80 p-4 sm:p-5">
      {/* Suggested Question Pills (Single-Click Auto-Submit) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Suggested Questions:
          </span>
          <button
            onClick={onClearChat}
            disabled={isLoading}
            className="text-[11px] font-semibold text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1 px-2 py-0.5 rounded hover:bg-stone-100 disabled:opacity-50"
            title="Clear conversation history"
          >
            <Trash2 className="w-3 h-3" />
            Clear Chat
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
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

      {/* Conversational Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="E.g., I have chicken, rice, and onions. What can I make? (Press Enter to send)"
            className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white resize-none text-sm leading-relaxed transition-all"
          />
          <div className="absolute right-3 top-3.5 hidden sm:block text-stone-300 pointer-events-none">
            <CornerDownLeft className="w-4 h-4" />
          </div>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3.5 sm:px-5 sm:py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-md shadow-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline text-sm">Send</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
