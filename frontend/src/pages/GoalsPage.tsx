import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FitnessGoal, FitnessExperience, DietPreference } from '../types';
import { Button } from '../components/common/Button';
import { Target, CheckCircle2, TrendingUp, Sparkles, Scale, Activity } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [goal, setGoal] = useState<FitnessGoal>(user?.profile?.fitnessGoal || 'MUSCLE_GAIN');
  const [targetWeight, setTargetWeight] = useState<number>(user?.profile?.currentWeightKg ? user.profile.currentWeightKg - 2 : 72);
  const [targetCalories, setTargetCalories] = useState<number>(user?.profile?.targetDailyCalories || 2200);
  const [targetProtein, setTargetProtein] = useState<number>(user?.profile?.targetDailyProtein || 140);
  const [workoutDays, setWorkoutDays] = useState<number>(user?.profile?.preferredWorkoutDays || 4);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fitnessGoal: goal,
      targetDailyCalories: targetCalories,
      targetDailyProtein: targetProtein,
      preferredWorkoutDays: workoutDays,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Fitness Goals & Targets
            <Target className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure your target trajectory, macro baselines, and weekly training cadence.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Targets Updated Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveGoals} className="space-y-6">
        {/* Goal Type Cards */}
        <div className="rounded-3xl bg-dark-900 border border-slate-800 p-6">
          <h2 className="text-base font-bold text-white mb-2">Primary Fitness Objective</h2>
          <p className="text-xs text-slate-400 mb-6">Select your current physiological focus.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'FAT_LOSS', title: 'Fat Loss', desc: 'Preserve lean mass in a moderate calorie deficit', color: 'border-emerald-500' },
              { id: 'MUSCLE_GAIN', title: 'Muscle Gain', desc: 'Promote hypertrophy with progressive overload', color: 'border-lime-500' },
              { id: 'WEIGHT_MAINTENANCE', title: 'Maintenance', desc: 'Maintain equilibrium and build sustainable habits', color: 'border-cyan-500' },
              { id: 'GENERAL_FITNESS', title: 'General Fitness', desc: 'Improve cardiovascular health & mobility', color: 'border-teal-500' },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setGoal(item.id as FitnessGoal)}
                className={`p-5 rounded-2xl border cursor-pointer transition ${
                  goal === item.id
                    ? `bg-dark-950 ${item.color} shadow-lg shadow-emerald-950/40`
                    : 'bg-dark-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{item.title}</span>
                  {goal === item.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Target Metrics */}
        <div className="rounded-3xl bg-dark-900 border border-slate-800 p-6">
          <h2 className="text-base font-bold text-white mb-2">Daily & Weekly Targets</h2>
          <p className="text-xs text-slate-400 mb-6">User-adjustable science guidelines (non-extreme).</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Target Daily Calories (kcal)
              </label>
              <input
                type="number"
                min="1200"
                max="5000"
                value={targetCalories}
                onChange={(e) => setTargetCalories(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Recommended: 1,800 – 2,600 kcal based on physical metrics
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Target Daily Protein (grams)
              </label>
              <input
                type="number"
                min="50"
                max="300"
                value={targetProtein}
                onChange={(e) => setTargetProtein(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Rule of thumb: 1.6 – 2.0g per kg of body weight
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Preferred Workout Days Per Week
              </label>
              <select
                value={workoutDays}
                onChange={(e) => setWorkoutDays(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="3">3 Days (Full Body Split)</option>
                <option value="4">4 Days (Upper / Lower)</option>
                <option value="5">5 Days (Push / Pull / Legs)</option>
                <option value="6">6 Days (Dedicated Split)</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Consistency trumps excessive volume
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" type="submit" size="lg" className="font-bold">
            Save & Update Targets
          </Button>
        </div>
      </form>
    </div>
  );
};
