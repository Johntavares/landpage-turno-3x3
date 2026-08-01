import React from 'react';

export type BadgeVariant = 'work' | 'off' | 'holiday' | 'vacation' | 'neutral' | 'accent';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, size = 'md', icon }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-semibold' : 'px-3 py-1 text-sm font-bold';

  const variantStyles: Record<BadgeVariant, string> = {
    work: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    off: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    holiday: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30',
    vacation: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30',
    neutral: 'bg-slate-200/60 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    accent: 'bg-blue-600 text-white shadow-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${sizeClasses} ${variantStyles[variant]}`}
    >
      {icon && <span className="inline-block">{icon}</span>}
      {children}
    </span>
  );
};
