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
        <label htmlFor={inputId} className="block text-sm font-medium text-text mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full px-4 py-2 bg-background border rounded-lg text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-border'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 animate-pulse">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
