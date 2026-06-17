import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface/80 border-b border-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              AntiGravity
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-text hover:text-primary font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">Sign Up</Button>
            </Link>
            <div className="w-px h-6 bg-border mx-2"></div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
