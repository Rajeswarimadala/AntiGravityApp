import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Input, Button } from '../components';
import { useAuth } from '../context';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signupWithEmail } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await signupWithEmail(data.email, data.password, data.name);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold text-text mt-4">Create Account</h1>
          <p className="text-sm text-text-muted mt-1.5 font-medium">Join us to secure your social networks</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            id="name"
            label="Full Name" 
            type="text" 
            placeholder="John Doe"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input 
            id="email"
            label="Email Address" 
            type="email" 
            placeholder="you@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input 
            id="password"
            label="Password" 
            type="password" 
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
          <Input 
            id="confirmPassword"
            label="Confirm Password" 
            type="password" 
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" className="w-full mt-6 flex items-center justify-center" isLoading={isLoading} disabled={isLoading}>
            Create Account <UserPlus size={18} className="ml-2" />
          </Button>
        </form>
        
        <p className="mt-8 text-center text-sm text-text-muted font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
};
