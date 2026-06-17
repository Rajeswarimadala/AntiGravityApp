import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-surface border border-border rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${className}`}>
      {children}
    </div>
  );
};
