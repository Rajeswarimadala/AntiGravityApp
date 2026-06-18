import React from 'react';
import { Button } from '../components';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-transparent text-text overflow-hidden">
      {/* Premium background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-28 px-4 text-center max-w-5xl mx-auto z-10">
        {/* Futuristic Top Badge */}
        <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8 text-xs font-semibold tracking-wider text-primary uppercase animate-pulse">
          <span className="flex h-2 w-2 rounded-full bg-primary"></span>
          <span>Welcome to AntiGravity Platform</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight leading-[1.1] text-text">
          Defy Limits. <br />
          Scale <span className="text-gradient">Without Friction</span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          The ultimate environment for next-generation developer tooling. Launch cloud microservices and build serverless apps in record time.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto group">
              Start Building <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Live Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Interactive Features Grid */}
      <section className="relative py-24 px-4 z-10 border-t border-border/40 bg-surface/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Engineered for Speed & Scale
            </h2>
            <p className="text-text-muted max-w-lg mx-auto font-medium">
              Everything you need to ship production-grade code, bundled into a single powerful workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group glass-panel p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/40">
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Serverless Execution</h3>
              <p className="text-text-muted leading-relaxed text-sm font-medium">
                Execute functions on the edge globally with sub-millisecond response latency.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group glass-panel p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:border-accent/40">
              <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">End-to-End Cryptography</h3>
              <p className="text-text-muted leading-relaxed text-sm font-medium">
                Automatic data sealing and transport layer security using industry standard protocol compliance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group glass-panel p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Region Replication</h3>
              <p className="text-text-muted leading-relaxed text-sm font-medium">
                Active-active clusters synced in real time across 40+ global availability regions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
