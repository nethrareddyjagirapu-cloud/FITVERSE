import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'lime' | 'amber' | 'rose' | 'slate' | 'cyan';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'md',
}) => {
  const variants = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    lime: 'bg-lime-500/10 text-lime-400 border border-lime-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700',
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-semibold',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};
