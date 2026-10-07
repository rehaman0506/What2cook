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
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
  }[size];

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl',
  }[size];

  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Culinary Emblem Logo */}
      <div
        className={`relative ${iconSizeClasses} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}
      >
        <img
          src="/logo.png"
          alt="What2Cook Logo"
          className="w-full h-full object-contain drop-shadow-sm"
          loading="eager"
        />
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
