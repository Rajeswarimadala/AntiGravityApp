import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`glass-panel rounded-2xl shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 ${className}`}>
      {children}
    </div>
  );
};
