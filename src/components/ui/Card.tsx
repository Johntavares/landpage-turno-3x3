import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const hasCustomBg = className.includes('bg-');
  const hasCustomBorder = className.includes('border-');

  const defaultBg = hasCustomBg ? '' : 'bg-white dark:bg-slate-900/90';
  const defaultBorder = hasCustomBorder ? '' : 'border border-slate-100 dark:border-slate-800/80';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-4 shadow-xs transition-all ${defaultBg} ${defaultBorder} ${className}`}
    >
      {children}
    </div>
  );
};
