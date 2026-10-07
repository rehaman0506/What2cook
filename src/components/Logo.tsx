import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  theme = 'light',
  showTagline = true,
  className = '',
}) => {
  const iconSizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 sm:w-11 sm:h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
  }[size];

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl',
  }[size];

  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Attractive Glowing Chef AI Emblem */}
      <div
        className={`relative ${iconSizeClasses} bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 ring-1 ring-white/30 group-hover:scale-105 group-hover:shadow-orange-500/35 transition-all duration-300 shrink-0 overflow-hidden`}
      >
        {/* Soft Glass Highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 pointer-events-none" />

        {/* Custom Culinary AI Chef Vector Mark */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 drop-shadow-sm"
        >
          <defs>
            <linearGradient id="logoHatWhite" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFF7ED" />
            </linearGradient>
            <linearGradient id="logoSparkleGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          {/* Chef Hat Brim / Band */}
          <rect x="11" y="27" width="18" height="3.5" rx="1.75" fill="url(#logoHatWhite)" />

          {/* Hat Pleats Base */}
          <path d="M12.5 27L13.5 21.5H26.5L27.5 27H12.5Z" fill="url(#logoHatWhite)" opacity="0.95" />

          {/* Hat Crown / Billowy Puffs */}
          <path
            d="M13.5 21.5C11 21.5 9 19.3 9.5 16.8C10 14.5 12.3 13.8 14 14.8C14.8 11.5 18 9 20 9C22 9 25.2 11.5 26 14.8C27.7 13.8 30 14.5 30.5 16.8C31 19.3 29 21.5 26.5 21.5H13.5Z"
            fill="url(#logoHatWhite)"
          />

          {/* Subtle Chef Hat Pleat Accent Line */}
          <line x1="20" y1="13" x2="20" y2="21" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
          <line x1="16" y1="16" x2="16" y2="21" stroke="#F97316" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <line x1="24" y1="16" x2="24" y2="21" stroke="#F97316" strokeWidth="1" strokeLinecap="round" opacity="0.3" />

          {/* 4-Point AI Magic Sparkle Star (Top Right) */}
          <path
            d="M30 6C30 8.2 31.8 9.2 33.5 9.8C31.8 10.4 30 11.4 30 13.6C30 11.4 28.2 10.4 26.5 9.8C28.2 9.2 30 8.2 30 6Z"
            fill="url(#logoSparkleGold)"
          />

          {/* Mini Accent Twinkle */}
          <circle cx="23.5" cy="6.5" r="0.9" fill="#FFFFFF" opacity="0.95" />
        </svg>
      </div>

      {/* Brand Name Typography */}
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${textSizeClasses} ${
              isDark ? 'text-white' : 'text-stone-900'
            } transition-colors`}
          >
            What
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
              2
            </span>
            Cook
          </span>

          {/* Modern Gradient AI Badge */}
          <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5" />
            AI
          </span>
        </div>

        {showTagline && (
          <p
            className={`text-[10px] font-medium hidden sm:block mt-0.5 ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}
          >
            Smart AI Kitchen Chef
          </p>
        )}
      </div>
    </div>
  );
};
