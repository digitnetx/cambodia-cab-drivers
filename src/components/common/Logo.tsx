import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  className?: string;
  showTagline?: boolean;
  inverted?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  className = '',
  showTagline = true,
  inverted = false,
  size = 'md',
}) => {
  // If variant is 'full' (the complete badge emblem with car, Angkor Wat, and bottom pill text)
  if (variant === 'full') {
    return (
      <div className={`inline-block ${className}`} id="cambodia-taxi-logo-full">
        <img
          src="/logo.svg"
          alt="Cambodia Taxi Cab — Private Taxi & Tours"
          className="w-full h-auto object-contain drop-shadow-sm select-none"
          loading="eager"
        />
      </div>
    );
  }

  // If variant is 'icon' (just the emblem graphic)
  if (variant === 'icon') {
    const iconSizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
      xl: 'w-20 h-20',
    };

    return (
      <div className={`relative shrink-0 overflow-hidden ${iconSizes[size]} ${className}`} id="cambodia-taxi-logo-icon">
        <img
          src="/logo-icon.svg"
          alt="Cambodia Taxi Cab Emblem"
          className="w-full h-full object-contain select-none"
        />
      </div>
    );
  }

  // Default 'horizontal' variant: Icon + Typography
  const sizeStyles = {
    sm: {
      icon: 'w-8 h-8',
      title: 'text-sm font-black',
      tagline: 'text-[9px]',
      badge: 'text-[8px] px-1.5 py-0.5',
    },
    md: {
      icon: 'w-10 h-10 sm:w-11 sm:h-11',
      title: 'text-base sm:text-lg font-black',
      tagline: 'text-[10px] tracking-wider',
      badge: 'text-[9px] px-2 py-0.5',
    },
    lg: {
      icon: 'w-14 h-14',
      title: 'text-xl sm:text-2xl font-black',
      tagline: 'text-xs tracking-widest',
      badge: 'text-[10px] px-2.5 py-1',
    },
    xl: {
      icon: 'w-20 h-20',
      title: 'text-2xl sm:text-3xl font-black',
      tagline: 'text-sm tracking-widest',
      badge: 'text-xs px-3 py-1',
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group ${className}`} id="cambodia-taxi-logo-horizontal">
      {/* Visual Badge Icon with Glowing Hover */}
      <div
        className={`relative shrink-0 rounded-xl bg-white/95 p-1 border border-slate-200/50 shadow-md group-hover:scale-105 transition-transform duration-200 ${currentSize.icon} flex items-center justify-center`}
      >
        <img
          src="/logo-icon.svg"
          alt="Cambodia Taxi Cab Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-sans tracking-tight uppercase ${currentSize.title} ${
              inverted ? 'text-white' : 'text-[#0F1C3F]'
            }`}
          >
            Cambodia <span className="text-red-600 font-extrabold">Taxi Cab</span>
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`font-semibold uppercase tracking-widest ${
                inverted ? 'text-slate-300' : 'text-slate-500'
              } ${currentSize.tagline}`}
            >
              cambodiataxicab.com
            </span>
            <span className="hidden sm:inline-block text-red-600 text-[10px]">•</span>
            <span className="hidden sm:inline-block text-[9px] font-bold text-red-600 uppercase tracking-wide">
              Official Fleet
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
