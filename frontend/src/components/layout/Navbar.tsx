import React from 'react';
import { Dumbbell, Sparkles, UserCheck, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onExploreDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onExploreDemo }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-emerald-400 transform -rotate-45" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-white flex items-center gap-1">
              FIT<span className="text-emerald-400">VERSE</span>
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase font-bold">
              AI Fitness & Nutrition
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#nutrition" className="hover:text-emerald-400 transition-colors">Nutrition Engine</a>
          <a href="#workouts" className="hover:text-emerald-400 transition-colors">Workout Hub</a>
          <a href="#journey" className="hover:text-emerald-400 transition-colors">Transformation Journey</a>
          <a href="#fitbot" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
            FitBot AI
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExploreDemo}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-dark-900 border border-transparent hover:border-slate-800 transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            Demo Preview
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenAuth('login')}
            className="text-slate-300"
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenAuth('register')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
