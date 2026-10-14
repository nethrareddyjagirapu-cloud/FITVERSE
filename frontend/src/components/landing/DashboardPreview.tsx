import React, { useState } from 'react';
import {
  Flame,
  UtensilsCrossed,
  Dumbbell,
  Sparkles,
  TrendingUp,
  Droplets,
  Moon,
  CheckCircle2,
} from 'lucide-react';

export const DashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'nutrition' | 'workouts' | 'ai'>('overview');

  return (
    <section className="py-20 bg-dark-950/70 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
            Live Interface Preview
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            Built For Athletes Who Value Clarity
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            No clutter, no ads, no fake numbers. Just dark-mode ergonomics designed for rapid daily logging.
          </p>

          {/* Tab selector */}
          <div className="mt-8 inline-flex p-1 rounded-2xl bg-dark-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'overview'
                  ? 'bg-emerald-500 text-dark-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'nutrition'
                  ? 'bg-emerald-500 text-dark-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Nutrition View
            </button>
            <button
              onClick={() => setActiveTab('workouts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'workouts'
                  ? 'bg-emerald-500 text-dark-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Workout Logger
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'ai'
                  ? 'bg-lime-400 text-dark-950 shadow-md shadow-lime-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FitBot Chat
            </button>
          </div>
        </div>

        {/* Dashboard Mockup Card */}
        <div className="rounded-3xl bg-dark-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-semibold text-slate-400 ml-3">app.fitverse.io/dashboard</span>
            </div>
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Synced with Spring Boot JPA
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Calories Consumed</span>
                  <div className="text-2xl font-extrabold text-white mt-1">1,840 <span className="text-xs text-slate-400 font-normal">/ 2,400 kcal</span></div>
                  <div className="w-full h-1.5 bg-dark-800 rounded-full mt-3 overflow-hidden">
                    <div className="w-[76%] h-full bg-emerald-400 rounded-full" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Protein Tracked</span>
                  <div className="text-2xl font-extrabold text-white mt-1">128 <span className="text-xs text-slate-400 font-normal">/ 150 g</span></div>
                  <div className="w-full h-1.5 bg-dark-800 rounded-full mt-3 overflow-hidden">
                    <div className="w-[85%] h-full bg-lime-400 rounded-full" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Water Intake</span>
                  <div className="text-2xl font-extrabold text-white mt-1">2,400 <span className="text-xs text-slate-400 font-normal">/ 3,000 ml</span></div>
                  <div className="w-full h-1.5 bg-dark-800 rounded-full mt-3 overflow-hidden">
                    <div className="w-[80%] h-full bg-cyan-400 rounded-full" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Current Journey</span>
                  <div className="text-xl font-extrabold text-emerald-400 mt-1">Day 18 / 60</div>
                  <div className="text-xs text-slate-400 mt-1">Muscle Gain Phase 1</div>
                </div>
              </div>

              {/* Lower split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-dark-950/80 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                    <span>Today's Logged Meals</span>
                    <span className="text-emerald-400 text-xs">4 Recorded</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 rounded-xl bg-dark-900 border border-slate-800/80">
                      <div>
                        <span className="font-bold text-white">2x Multigrain Roti + 150g Dal Tadka</span>
                        <div className="text-slate-400 text-[11px]">Breakfast • 380 kcal</div>
                      </div>
                      <span className="font-semibold text-emerald-400">18g Protein</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-dark-900 border border-slate-800/80">
                      <div>
                        <span className="font-bold text-white">200g Brown Rice + 150g Grilled Chicken / Paneer</span>
                        <div className="text-slate-400 text-[11px]">Lunch • 520 kcal</div>
                      </div>
                      <span className="font-semibold text-emerald-400">42g Protein</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-dark-950/80 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                    <span>Recent Workout Session</span>
                    <span className="text-lime-400 text-xs">Push Day (Chest & Triceps)</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-dark-900 border border-slate-800/80">
                      <div>
                        <p className="font-bold text-white">Barbell Bench Press</p>
                        <p className="text-slate-400 text-[11px]">4 sets × 8 reps @ 75 kg</p>
                      </div>
                      <span className="text-lime-400 font-bold bg-lime-400/10 px-2 py-0.5 rounded">PR Hitting</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-dark-900 border border-slate-800/80">
                      <div>
                        <p className="font-bold text-white">Incline Dumbbell Press</p>
                        <p className="text-slate-400 text-[11px]">3 sets × 10 reps @ 26 kg</p>
                      </div>
                      <span className="text-slate-400">780 kg Volume</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="p-6 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Indian & Global Reference Food Calculator</h3>
              <p className="text-xs text-slate-400">
                Formula applied in real-time: <code className="text-emerald-400 font-mono">nutrient = (value_per_100g * quantity_in_grams) / 100</code>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                  <span className="text-xs text-slate-400">150g Moong Dal</span>
                  <div className="text-sm font-bold text-white mt-1">158 kcal • 10.5g Protein</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                  <span className="text-xs text-slate-400">2 Medium Rotis (70g)</span>
                  <div className="text-sm font-bold text-white mt-1">208 kcal • 6.2g Protein</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                  <span className="text-xs text-slate-400">100g Paneer</span>
                  <div className="text-sm font-bold text-white mt-1">265 kcal • 18.3g Protein</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-900 border border-slate-800">
                  <span className="text-xs text-slate-400">50g Soya Chunks</span>
                  <div className="text-sm font-bold text-white mt-1">172 kcal • 26.0g Protein</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workouts' && (
            <div className="p-6 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white">Structured Muscle Group Exercises</h3>
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md font-bold">10 Target Groups</span>
              </div>
              <p className="text-xs text-slate-400">
                Categorized library covering Chest, Back, Shoulders, Biceps, Triceps, Legs, Core & Abs, Cardio, Mobility, and Full Body with equipment and set logs.
              </p>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="p-6 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-3 max-w-xl mx-auto">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-900 border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  You
                </div>
                <p className="text-xs text-slate-200">
                  "How much protein do I still need today to hit my 150g goal, and what vegetarian dinner can I have?"
                </p>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-lime-400/5 border border-lime-400/20">
                <div className="w-8 h-8 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-lime-400">FitBot AI Verified Answer:</p>
                  <p>
                    "Based on your actual logged meals today, you have consumed <strong>128g of protein</strong>. You need <strong>22g of protein</strong> to reach your 150g target.
                  </p>
                  <p>
                    A great vegetarian option is <strong>100g low-fat paneer (18g protein)</strong> paired with <strong>1 bowl of sautéed spinach/broccoli (4g protein)</strong> for dinner."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
