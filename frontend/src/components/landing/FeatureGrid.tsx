import React from 'react';
import {
  UtensilsCrossed,
  Dumbbell,
  Compass,
  Sparkles,
  CheckCircle,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      id: 'nutrition',
      icon: UtensilsCrossed,
      title: 'Precision Nutrition Engine',
      subtitle: 'Indian & Global Foods Library',
      description:
        'Accurately calculates calories, protein, carbs, fat, and fibre based on verified 100g compositions. Includes authentic entries for Dal, Roti, Paneer, Rice, Curd, Idli, Eggs, and more.',
      tags: ['Macro Breakdowns', 'Custom Foods', 'Meal Snapshots'],
      glow: 'group-hover:border-emerald-500/50',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'workouts',
      icon: Dumbbell,
      title: 'Workout & Volume Hub',
      subtitle: 'Structured Strength & Conditioning',
      description:
        'Log sets, repetitions, weights, and rest periods across 10 muscle categories. Track your overall training volume and hit genuine personal records.',
      tags: ['Volume Tracker', 'Exercise Library', 'Custom Routines'],
      glow: 'group-hover:border-lime-500/50',
      badgeColor: 'text-lime-400 bg-lime-500/10 border-lime-500/30',
    },
    {
      id: 'journey',
      icon: Compass,
      title: 'Transformation Journeys',
      subtitle: '1-3 Month Milestones & Reports',
      description:
        'Commit to structured 30, 60, or 90-day journeys. When completed, FITVERSE automatically synthesizes an honest journey report reflecting your actual logged progress.',
      tags: ['Automated Reports', 'Weight Trends', 'Photo Timeline'],
      glow: 'group-hover:border-teal-500/50',
      badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    },
    {
      id: 'fitbot',
      icon: Sparkles,
      title: 'FitBot AI Assistant',
      subtitle: 'Grounded In Your Actual Records',
      description:
        'FitBot connects directly to your verified logged data to answer real queries like "How much protein do I have left today?" with zero hallucinations.',
      tags: ['Context-Aware', 'Safe Fitness Guidelines', 'Meal Planning'],
      glow: 'group-hover:border-cyan-500/50',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
  ];

  return (
    <section id="features" className="py-20 bg-dark-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
            Engineered For Consistent Progress
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need For Your Fitness Transformation
          </p>
          <p className="mt-4 text-sm sm:text-base text-slate-400">
            A cohesive suite of science-grounded tools built to remove guesswork from your daily training and nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-3xl bg-dark-900/90 border border-slate-800 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-950/80 ${item.glow}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3.5 rounded-2xl border ${item.badgeColor}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {item.subtitle}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">{item.description}</p>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800/80">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-950 text-xs font-medium text-slate-300 border border-slate-800"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
