import React from 'react';
import ohk3dLogo from '../assets/images/ohk-1.jpg';

interface LogoProps {
  variant?: 'light' | 'dark' | 'header';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  // Size dimensions
  const logoDimensions = {
    sm: { icon: 'w-8 h-8 sm:w-9 sm:h-9', title: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10 sm:w-11 sm:h-11', title: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14 sm:w-16 sm:h-16', title: 'text-2xl', sub: 'text-[11px]' },
    xl: { icon: 'w-20 h-20 sm:w-24 sm:h-24', title: 'text-3xl', sub: 'text-xs' },
  }[size];

  // Color theme
  const textColor = variant === 'dark' ? 'text-white' : 'text-[#0F382C]';
  const subColor = variant === 'dark' ? 'text-emerald-200' : 'text-[#2D6A4F]';
  const tagColor = variant === 'dark' ? 'text-amber-300' : 'text-[#B8860B]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* OANK Cleaning Logo Emblem */}
      <div className={`relative flex-shrink-0 ${logoDimensions.icon} transition-transform duration-300 hover:scale-105 flex items-center justify-center`}>
        <img 
          src={ohk3dLogo} 
          alt="OANK Cleaning CIC Logo" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain filter drop-shadow-md rounded-md"
        />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-serif font-bold tracking-tight ${logoDimensions.title} ${textColor}`}>
            OanK
          </span>
          <span className={`font-serif font-medium tracking-tight ${logoDimensions.title} ${subColor}`}>
            Cleaning
          </span>
        </div>
      </div>
    </div>
  );
};
