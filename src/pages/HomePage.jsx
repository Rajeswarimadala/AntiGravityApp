import React from 'react';
import { Button } from '../components';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';

export const HomePage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-transparent text-text overflow-hidden px-4">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Main Centered Splash Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto z-10 py-16 space-y-8">
        
        {/* Glowing Platform Icon */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-3xl shadow-lg shadow-primary/10 animate-bounce-slow">
          <ShieldAlert className="text-primary" size={48} />
        </div>

        {/* Big Rebranded Title */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-9xl font-black tracking-tight leading-[0.9] text-text">
            Imposter<span className="text-gradient">X</span>
          </h1>
          <p className="text-sm md:text-base text-primary font-bold tracking-widest uppercase">
            Social Media Authentication Platform
          </p>
        </div>

        {/* Short Subtitle */}
        <p className="text-base md:text-lg text-text-muted max-w-xl mx-auto leading-relaxed font-semibold">
          Identify bots, mock profiles, and suspicious account footprints across Instagram, X (Twitter), and Facebook instantly using advanced heuristics.
        </p>

        {/* Direct Access CTA */}
        <div className="pt-4">
          <Link to={currentUser ? "/dashboard" : "/login"}>
            <Button size="lg" className="px-10 py-4 font-bold tracking-wide shadow-2xl group flex items-center justify-center">
              Get Started 
              <ArrowRight className="ml-2 group-hover:translate-x-1.5 transition-transform" size={18} />
            </Button>
          </Link>
        </div>
      </div>

      {/* App Description Footer */}
      <footer className="w-full text-center py-8 border-t border-border/20 z-10">
        <p className="text-xs text-text-muted font-bold tracking-wider max-w-md mx-auto leading-relaxed">
          ImposterX scanner analyzes follower ratios, activity intervals, and profile metrics to safeguard your social network. Powered by active cloud sync.
        </p>
      </footer>
    </div>
  );
};
