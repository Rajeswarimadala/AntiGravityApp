import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-text/80 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full px-4 py-2.5 bg-surface/30 border backdrop-blur-sm rounded-xl text-text placeholder-text/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 ${
          error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-border'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium tracking-wide">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
