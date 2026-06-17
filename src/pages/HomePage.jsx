import React from 'react';
import { Button } from '../components';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-text">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">AntiGravity</span>
        </h1>
        <p className="text-xl md:text-2xl opacity-80 mb-10 max-w-3xl mx-auto leading-relaxed">
          The ultimate platform for modern creators. Build, scale, and innovate with our blazing fast toolkit.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-surface border-y border-border px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why choose us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="opacity-70 leading-relaxed">Optimized performance that delivers your content globally in milliseconds.</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Bank-grade Security</h3>
              <p className="opacity-70 leading-relaxed">Your data is protected by industry-leading encryption and security protocols.</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <Globe className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Edge Network</h3>
              <p className="opacity-70 leading-relaxed">Deploy your apps to the edge and reach users everywhere with zero latency.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
