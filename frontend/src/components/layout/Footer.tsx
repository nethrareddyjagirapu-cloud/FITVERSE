import React from 'react';
import { Dumbbell, Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-dark-900/60 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-emerald-400 -rotate-45" />
              </div>
              <span className="text-lg font-extrabold text-white">
                FIT<span className="text-emerald-400">VERSE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier all-in-one fitness and nutrition platform with accurate macronutrient tracking, progressive workout logs, and FitBot AI intelligence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-800 text-[11px] font-medium text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Private & Secure Data Isolation</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Core Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#nutrition" className="hover:text-emerald-400 transition">Nutrition Engine</a></li>
              <li><a href="#workouts" className="hover:text-emerald-400 transition">Workout & Routines</a></li>
              <li><a href="#journey" className="hover:text-emerald-400 transition">Transformation Journeys</a></li>
              <li><a href="#habits" className="hover:text-emerald-400 transition">Habits & Hydration</a></li>
            </ul>
          </div>

          {/* AI & Intelligence */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Intelligence</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-lime-400">
                <Sparkles className="w-3 h-3" />
                <span>FitBot AI Engine</span>
              </li>
              <li><span className="text-slate-400">Grounded User Insights</span></li>
              <li><span className="text-slate-400">Food Photo Estimator</span></li>
              <li><span className="text-slate-400">Personalized Milestones</span></li>
            </ul>
          </div>

          {/* Legal and Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Health Disclaimer</h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              FITVERSE is an educational fitness tracking and nutrition calculation tool. FITVERSE does not provide medical advice, diagnosis, or clinical prescriptions. Always consult a healthcare professional before undertaking vigorous exercise or restrictive diet programs.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FITVERSE Inc. Built with Java Spring Boot & React.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Engineered for health & consistency</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
          </div>
        </div>
      </div>
    </footer>
  );
};
