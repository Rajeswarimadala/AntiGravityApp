import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { useAuth } from '../context';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface/70 border-b border-border/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-extrabold text-gradient hover:opacity-90 transition-opacity">
              AntiGravity
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-1.5 text-text/80 hover:text-primary font-medium text-sm transition-colors px-2 py-1.5 rounded-lg hover:bg-primary/5">
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-1.5 text-text/80 hover:text-primary font-medium text-sm transition-colors px-2 py-1.5 rounded-lg hover:bg-primary/5">
                  <User size={16} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-500/5">
                  <LogOut size={16} className="sm:mr-1.5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
            <div className="w-px h-5 bg-border/60 mx-1"></div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
