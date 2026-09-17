import React, { useState, useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VoiceMicButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  autoSubmit?: boolean;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  onTranscript,
  className = '',
  size = 'md',
}) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t.micNotSupported);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Set language according to active app language
      if (language === 'te') {
        recognition.lang = 'te-IN'; // Telugu (India)
      } else if (language === 'hi') {
        recognition.lang = 'hi-IN'; // Hindi (India)
      } else {
        recognition.lang = 'en-IN'; // Indian English
      }

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const spokenText = event.results[0][0].transcript;
          if (spokenText && spokenText.trim()) {
            onTranscript(spokenText.trim());
          }
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert(t.micPermissionDenied);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed to start:', err);
      setIsListening(false);
    }
  };

  const toggleListen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null;
  }

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2.5 text-sm',
    lg: 'p-3.5 text-base',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <button
      type="button"
      onClick={toggleListen}
      title={isListening ? t.micListening : t.micClickToSpeak}
      aria-label={isListening ? 'Stop voice listening' : 'Start voice input'}
      className={`relative rounded-xl font-bold transition-all flex items-center justify-center ${sizeClasses} ${
        isListening
          ? 'bg-rose-500 text-white ring-4 ring-rose-300 animate-pulse shadow-lg shadow-rose-500/30'
          : 'bg-stone-100 hover:bg-orange-100 text-stone-600 hover:text-orange-600 border border-stone-200 hover:border-orange-300'
      } ${className}`}
    >
      {isListening ? (
        <span className="flex items-center gap-1.5">
          <Mic className={`${iconSizes} animate-bounce`} />
          <span className="hidden sm:inline text-xs font-black tracking-wide">
            {language === 'te' ? 'వింటున్నాను...' : language === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}
          </span>
        </span>
      ) : (
        <Mic className={iconSizes} />
      )}
    </button>
  );
};
