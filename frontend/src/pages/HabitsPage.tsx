import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { habitApi } from '../services/api';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  HeartPulse,
  Droplets,
  Moon,
  Footprints,
  CheckCircle2,
  Plus,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CustomHabit {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
}

export const HabitsPage: React.FC = () => {
  const { user } = useAuth();

  const [waterMl, setWaterMl] = useState<number>(2250);
  const [targetWaterMl] = useState<number>(3000);

  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sleepTarget] = useState<number>(8.0);

  const [steps, setSteps] = useState<number>(8450);
  const [targetSteps] = useState<number>(10000);

  const [habits, setHabits] = useState<CustomHabit[]>([
    { id: 'h-1', title: 'Morning 10-minute mobility routine', completed: true, streak: 6 },
    { id: 'h-2', title: 'Take Vitamin D3 & Omega-3 supplement', completed: true, streak: 12 },
    { id: 'h-3', title: 'No phone screen 45 mins before bedtime', completed: false, streak: 3 },
    { id: 'h-4', title: 'Hit 140g protein threshold', completed: true, streak: 5 },
  ]);

  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');

  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    let isMounted = true;
    const fetchHabits = async () => {
      try {
        const data = await habitApi.getHabits(todayDate);
        if (isMounted && data) {
          if (data.waterIntakeMl != null && data.waterIntakeMl > 0) setWaterMl(data.waterIntakeMl);
          if (data.sleepHours != null && Number(data.sleepHours) > 0) setSleepHours(Number(data.sleepHours));
          if (data.stepsCount != null && data.stepsCount > 0) setSteps(data.stepsCount);
        }
      } catch {
        // Offline or demo fallback
      }
    };
    if (user?.id) {
      fetchHabits();
    }
    return () => { isMounted = false; };
  }, [user?.id, todayDate]);

  const syncHabits = (w: number, sl: number, st: number) => {
    habitApi.saveHabits({
      logDate: todayDate,
      waterIntakeMl: w,
      sleepHours: sl,
      stepsCount: st,
    }).catch(() => {});
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextState = !h.completed;
          return {
            ...h,
            completed: nextState,
            streak: nextState ? h.streak + 1 : Math.max(0, h.streak - 1),
          };
        }
        return h;
      })
    );
  };

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle) return;
    const item: CustomHabit = {
      id: `h-${Date.now()}`,
      title: newHabitTitle,
      completed: false,
      streak: 0,
    };
    setHabits((prev) => [...prev, item]);
    setNewHabitTitle('');
    setIsNewHabitModalOpen(false);
  };

  const completedCount = habits.filter((h) => h.completed).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Health & Daily Habits
            <HeartPulse className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build unshakeable daily consistency across hydration, restorative sleep, and wellness habits.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsNewHabitModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
          className="font-bold"
        >
          Add Custom Habit
        </Button>
      </div>

      {/* Primary 3 Vital Trackers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Water */}
        <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hydration</span>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Droplets className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{waterMl} <span className="text-sm font-normal text-slate-400">/ {targetWaterMl} ml</span></div>
            <div className="w-full h-2 bg-dark-950 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (waterMl / targetWaterMl) * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="secondary" size="sm" onClick={() => {
              const val = waterMl + 250;
              setWaterMl(val);
              syncHabits(val, sleepHours, steps);
            }} className="flex-1 text-xs">
              + 250ml
            </Button>
            <Button variant="secondary" size="sm" onClick={() => {
              const val = waterMl + 500;
              setWaterMl(val);
              syncHabits(val, sleepHours, steps);
            }} className="flex-1 text-xs">
              + 500ml
            </Button>
          </div>
        </div>

        {/* Sleep */}
        <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Restorative Sleep</span>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Moon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{sleepHours} <span className="text-sm font-normal text-slate-400">/ {sleepTarget} hrs</span></div>
            <div className="w-full h-2 bg-dark-950 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-indigo-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (sleepHours / sleepTarget) * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="secondary" size="sm" onClick={() => {
              const val = Math.max(0, sleepHours - 0.5);
              setSleepHours(val);
              syncHabits(waterMl, val, steps);
            }} className="flex-1 text-xs">
              - 30 min
            </Button>
            <Button variant="secondary" size="sm" onClick={() => {
              const val = sleepHours + 0.5;
              setSleepHours(val);
              syncHabits(waterMl, val, steps);
            }} className="flex-1 text-xs">
              + 30 min
            </Button>
          </div>
        </div>

        {/* Daily Activity Steps */}
        <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Steps</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Footprints className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{steps.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ {targetSteps.toLocaleString()}</span></div>
            <div className="w-full h-2 bg-dark-950 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (steps / targetSteps) * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="secondary" size="sm" onClick={() => {
              const val = steps + 1000;
              setSteps(val);
              syncHabits(waterMl, sleepHours, val);
            }} className="flex-1 text-xs">
              + 1,000 Steps
            </Button>
          </div>
        </div>
      </div>

      {/* Habit Checklist & Streaks */}
      <div className="rounded-3xl bg-dark-900 border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Today's Habits Checklist</h2>
            <p className="text-xs text-slate-400">{completedCount} of {habits.length} completed today</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-lime-400 font-bold bg-lime-400/10 px-3 py-1 rounded-full border border-lime-400/20">
            <Flame className="w-3.5 h-3.5" />
            <span>Active Consistency Streaks</span>
          </div>
        </div>

        <div className="space-y-3">
          {habits.map((h) => (
            <div
              key={h.id}
              onClick={() => toggleHabit(h.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs ${
                h.completed
                  ? 'bg-emerald-500/5 border-emerald-500/40'
                  : 'bg-dark-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                  h.completed
                    ? 'bg-emerald-500 border-emerald-500 text-dark-950'
                    : 'border-slate-700 bg-dark-900'
                }`}>
                  {h.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                </div>
                <span className={`text-sm font-semibold ${h.completed ? 'text-white line-through opacity-80' : 'text-slate-200'}`}>
                  {h.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-900 border border-slate-800 text-xs font-bold text-lime-400">
                  <Flame className="w-3.5 h-3.5 fill-lime-400/20" />
                  {h.streak} Day Streak
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Habit Modal */}
      <Modal
        isOpen={isNewHabitModalOpen}
        onClose={() => setIsNewHabitModalOpen(false)}
        title="Add Custom Habit"
        subtitle="Define a daily action that accelerates your health or fitness goals."
        maxWidth="sm"
      >
        <form onSubmit={handleAddCustomHabit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Habit Title</label>
            <input
              type="text"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="e.g. 15 min post-lunch brisk walk"
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" type="button" onClick={() => setIsNewHabitModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex-1 font-bold">
              Add Habit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
