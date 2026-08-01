import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white p-5 shadow-xs border border-slate-100 dark:border-slate-800/80 dark:bg-slate-900/90 transition-all ${
        onClick ? 'cursor-pointer active:scale-[0.99] hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
