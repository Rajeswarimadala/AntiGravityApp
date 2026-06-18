import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Input, Button } from '../components';
import { useAuth } from '../context';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const { loginWithEmail, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Successfully logged in with Google!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error('Please enter your email address first');
    }
    try {
      await resetPassword(email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent px-4 py-16">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

      <Card className="w-full max-w-md backdrop-blur-xl bg-surface/40 border-border/60">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-gradient tracking-tight">
            ImposterX
          </Link>
          <h1 className="text-2xl font-bold text-text mt-4">Welcome Back</h1>
          <p className="text-sm text-text-muted mt-1.5 font-medium">
            Sign in to continue accessing your dashboard
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
            <label className="flex items-center cursor-pointer select-none">
              <input type="checkbox" className="rounded border-border bg-surface/50 text-primary focus:ring-primary h-4.5 w-4.5 mr-2" />
              <span className="text-text-muted font-medium">Remember me</span>
            </label>
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="font-semibold text-primary hover:text-primary-hover hover:underline bg-transparent border-none p-0 cursor-pointer transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full mt-4 flex items-center justify-center" isLoading={isLoading} disabled={isGoogleLoading}>
            Sign In <LogIn size={18} className="ml-2" />
          </Button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
              <span className="px-3 bg-transparent text-text-muted">Or login with</span>
            </div>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full bg-surface/20 hover:bg-surface/40 flex items-center justify-center border-border/60" 
            isLoading={isGoogleLoading}
            disabled={isLoading}
            onClick={handleGoogleSignIn}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google Account
          </Button>
        </form>
        
        <p className="mt-8 text-center text-sm text-text-muted font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors">
            Create account
          </Link>
        </p>
      </Card>
    </div>
  );
};
