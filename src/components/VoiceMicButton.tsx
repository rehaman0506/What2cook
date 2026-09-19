import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VoiceMicButtonProps {
  onTranscript: (text: string, isFinal?: boolean) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  autoSubmit?: boolean;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  onTranscript,
  className = '',
  size = 'md',
  autoSubmit = true,
}) => {
  const { t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const finalAccumulatedRef = useRef<string>('');

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }

    return () => {
      stopListening();
    };
  }, []);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const stopListening = () => {
    clearSilenceTimer();
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
      finalAccumulatedRef.current = '';
      setLiveTranscript('');

      // English speech recognition
      recognition.lang = 'en-IN';

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalAccumulatedRef.current += (finalAccumulatedRef.current ? ', ' : '') + transcriptChunk.trim();
          } else {
            interim += transcriptChunk;
          }
        }

        const currentFull = (finalAccumulatedRef.current ? finalAccumulatedRef.current + (interim ? ', ' + interim : '') : interim).trim();

        if (currentFull) {
          setLiveTranscript(currentFull);
          // Stream live items so input notes them down in real-time
          onTranscript(currentFull, false);
        }

        // Reset silence timer on each spoken fragment (1.8s of silence triggers final submission)
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          const finalResult = (finalAccumulatedRef.current || currentFull).trim();
          if (finalResult) {
            onTranscript(finalResult, true);
          }
          stopListening();
        }, 1800);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert(t.micPermissionDenied);
        }
        if (event.error !== 'no-speech') {
          stopListening();
        }
      };

      recognition.onend = () => {
        const finalResult = (finalAccumulatedRef.current || liveTranscript).trim();
        if (finalResult && autoSubmit) {
          onTranscript(finalResult, true);
        }
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
      const finalResult = (finalAccumulatedRef.current || liveTranscript).trim();
      if (finalResult) {
        onTranscript(finalResult, true);
      }
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null;
  }

  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-2.5 text-sm',
    lg: 'p-3.5 text-base',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleListen}
        title={isListening ? t.micListening : t.micClickToSpeak}
        aria-label={isListening ? 'Stop voice listening' : 'Start voice input'}
        className={`relative rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer ${sizeClasses} ${
          isListening
            ? 'bg-rose-600 text-white ring-4 ring-rose-400/50 animate-pulse shadow-lg shadow-rose-600/30'
            : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 hover:border-orange-300'
        } ${className}`}
      >
        {isListening ? (
          <span className="flex items-center gap-1.5">
            <Volume2 className={`${iconSizes} animate-bounce`} />
            <span className="text-xs font-black tracking-wide">
              Listening...
            </span>
          </span>
        ) : (
          <Mic className={iconSizes} />
        )}
      </button>

      {/* Floating Live Speech Feedback Pill while speaking */}
      {isListening && liveTranscript && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-xl bg-stone-900/95 text-white text-xs font-medium whitespace-nowrap shadow-xl border border-stone-700 animate-fade-in flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>{liveTranscript}</span>
        </div>
      )}
    </div>
  );
};
