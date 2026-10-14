import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Flame, Zap } from 'lucide-react';
import { Button } from '../common/Button';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onExploreDemo }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-lime-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-900 border border-slate-800 text-xs font-semibold text-slate-300 mb-8 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">FITVERSE 2.0</span>
          <span className="text-slate-500">•</span>
          <span>Full-Stack AI Fitness & Nutrition Ecosystem</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Elevate Your Body & Mind With{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400">
            Intelligent Fitness
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          The all-in-one platform engineered for real results. Track authentic Indian and global nutrition, record workout progressive overload, document transformation journeys, and get answers from your personal <strong>FitBot AI</strong>.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onGetStarted}
            icon={<ArrowRight className="w-5 h-5" />}
            className="w-full sm:w-auto shadow-xl shadow-emerald-500/25"
          >
            Start Your Journey Free
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onExploreDemo}
            icon={<Zap className="w-5 h-5 text-lime-400" />}
            className="w-full sm:w-auto"
          >
            Explore Live Dashboard Preview
          </Button>
        </div>

        {/* Feature Pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Exact Macro Engine (per 100g)</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-lime-400" />
            <span>Progressive Overload Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>FitBot AI Assistant</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Honest, Zero-Fake Data Metrics</span>
          </div>
        </div>
      </div>
    </section>
  );
};
