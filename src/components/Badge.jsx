import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-primary/20 text-primary border-primary/30',
    success: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
    danger: 'bg-red-500/20 text-red-500 border-red-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
