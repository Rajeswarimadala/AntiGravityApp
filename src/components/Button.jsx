import React from 'react';
import { Spinner } from './Spinner';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  href,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-purple-600 text-white hover:brightness-110 shadow-lg shadow-primary/20 hover:shadow-primary/30',
    outline: 'border border-border text-text hover:bg-primary/5 hover:border-primary/40',
    ghost: 'text-text/80 hover:text-text hover:bg-primary/5',
  };
  
  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-5 py-2.5',
    lg: 'text-lg px-7 py-3.5',
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={combinedClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
};

