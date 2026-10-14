import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { EmptyState } from '../components/common/EmptyState';
import { NutritionSummaryChart } from '../components/charts/NutritionSummaryChart';
import { WeightTrendChart } from '../components/charts/WeightTrendChart';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { nutritionApi, workoutApi, habitApi, progressApi } from '../services/api';
import {
  Flame,
  UtensilsCrossed,
  Dumbbell,
  Droplets,
  Scale,
  Sparkles,
  Plus,
  ArrowRight,
  Target,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardFoodEntry {
  id: string;
  name: string;
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
}

interface DashboardWorkoutEntry {
  id: string;
  name: string;
  durationMinutes: number;
  muscleGroup: string;
  sets: number;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Stored user logs in state (persisted to localStorage)
  const [meals, setMeals] = useState<DashboardFoodEntry[]>(() => {
    const saved = localStorage.getItem(`fitverse_meals_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [workouts, setWorkouts] = useState<DashboardWorkoutEntry[]>(() => {
    const saved = localStorage.getItem(`fitverse_workouts_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [waterMl, setWaterMl] = useState<number>(() => {
    const saved = localStorage.getItem(`fitverse_water_${user?.id}`);
    return saved ? Number(saved) : 0;
  });

  const [weightLogs, setWeightLogs] = useState<{ date: string; weight: number }[]>(() => {
    const saved = localStorage.getItem(`fitverse_weights_${user?.id}`);
    if (saved) return JSON.parse(saved);
    if (user?.profile?.currentWeightKg) {
      return [{ date: 'Today', weight: user.profile.currentWeightKg }];
    }
    return [];
  });

  // Modal quick-actions
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      const todayDate = new Date().toISOString().split('T')[0];
      try {
        const [dailyNutrition, workoutHistory, habitsData, measurementsData] = await Promise.allSettled([
          nutritionApi.getDaily(todayDate),
          workoutApi.getHistory(),
          habitApi.getHabits(todayDate),
          progressApi.getMeasurements(),
        ]);

        if (isMounted) {
          if (dailyNutrition.status === 'fulfilled' && dailyNutrition.value?.items?.length) {
            setMeals(dailyNutrition.value.items.map((item: any) => ({
              id: item.id,
              name: item.foodName,
              meal: item.mealCategory.toLowerCase(),
              calories: item.calories,
              protein: Number(item.protein) || 0,
              carbs: Number(item.carbs) || 0,
              fat: Number(item.fat) || 0,
              fibre: Number(item.fibre) || 0,
            })));
          }

          if (workoutHistory.status === 'fulfilled' && workoutHistory.value?.length) {
            setWorkouts(workoutHistory.value.map((s: any) => ({
              id: s.id,
              name: s.name,
              durationMinutes: s.durationMinutes,
              muscleGroup: Array.isArray(s.muscleGroups) ? s.muscleGroups.join(', ') : 'General',
              sets: s.exercisesLogged,
            })));
          }

          if (habitsData.status === 'fulfilled' && habitsData.value?.waterIntakeMl) {
            setWaterMl(habitsData.value.waterIntakeMl);
          }

          if (measurementsData.status === 'fulfilled' && measurementsData.value?.length) {
            setWeightLogs(measurementsData.value.map((m: any) => ({
              date: m.date,
              weight: Number(m.weightKg),
            })));
          }
        }
      } catch {
        // Fallback to local storage
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
    return () => { isMounted = false; };
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`fitverse_meals_${user.id}`, JSON.stringify(meals));
      localStorage.setItem(`fitverse_workouts_${user.id}`, JSON.stringify(workouts));
      localStorage.setItem(`fitverse_water_${user.id}`, String(waterMl));
      localStorage.setItem(`fitverse_weights_${user.id}`, JSON.stringify(weightLogs));
    }
  }, [meals, workouts, waterMl, weightLogs, user?.id]);

  // Totals calculations
  const totalCalories = meals.reduce((acc, item) => acc + item.calories, 0);
  const totalProtein = meals.reduce((acc, item) => acc + item.protein, 0);
  const totalCarbs = meals.reduce((acc, item) => acc + item.carbs, 0);
  const totalFat = meals.reduce((acc, item) => acc + item.fat, 0);
  const totalFibre = meals.reduce((acc, item) => acc + item.fibre, 0);

  const targetCalories = user?.profile?.targetDailyCalories || 2200;
  const targetProtein = user?.profile?.targetDailyProtein || 140;
  const targetWater = 3000;

  const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : (user?.profile?.currentWeightKg || null);

  const handleAddWater = (amount: number) => {
    const updated = Math.max(0, waterMl + amount);
    setWaterMl(updated);
    const today = new Date().toISOString().split('T')[0];
    habitApi.saveHabits({ logDate: today, waterIntakeMl: updated }).catch(() => {});
  };

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 30 && val < 300) {
      const todayFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setWeightLogs((prev) => [...prev, { date: todayFormatted, weight: val }]);
      progressApi.logMeasurement({ weightKg: val, date: new Date().toISOString().split('T')[0] }).catch(() => {});
      setNewWeightInput('');
      setIsWeightModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Persona Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-dark-900 to-dark-850 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome, {user?.fullName || 'Athlete'}
            </h1>
            <span className="text-xl">⚡</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Goal: <strong className="text-emerald-400">{user?.profile?.fitnessGoal ? user.profile.fitnessGoal.replace('_', ' ') : 'General Fitness'}</strong> • Activity: {user?.profile?.activityLevel?.replace('_', ' ') || 'Moderate'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsWaterModalOpen(true)}
            icon={<Droplets className="w-4 h-4 text-cyan-400" />}
          >
            + Water
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsWeightModalOpen(true)}
            icon={<Scale className="w-4 h-4 text-emerald-400" />}
          >
            + Weight
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/app/nutrition')}
            icon={<Plus className="w-4 h-4" />}
          >
            Log Meal
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/workouts')}
            icon={<Dumbbell className="w-4 h-4 text-lime-400" />}
            className="border-lime-500/40 text-lime-400"
          >
            Start Workout
          </Button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Daily Calorie Intake"
          value={totalCalories}
          unit="kcal"
          target={targetCalories}
          progressPercent={Math.round((totalCalories / targetCalories) * 100)}
          icon={<Flame className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-400"
          accentColor="bg-emerald-400"
          subtitle={
            totalCalories > 0
              ? `${Math.max(0, targetCalories - totalCalories)} kcal remaining today`
              : 'No meals logged today yet'
          }
          empty={totalCalories === 0}
          onClick={() => navigate('/app/nutrition')}
        />

        <StatCard
          title="Protein Intake"
          value={totalProtein}
          unit="g"
          target={targetProtein}
          progressPercent={Math.round((totalProtein / targetProtein) * 100)}
          icon={<UtensilsCrossed className="w-5 h-5" />}
          iconBgColor="bg-lime-500/10 text-lime-400"
          accentColor="bg-lime-400"
          subtitle={
            totalProtein > 0
              ? `${Math.max(0, targetProtein - totalProtein)}g to reach protein target`
              : 'Log breakfast to track protein'
          }
          empty={totalProtein === 0}
          onClick={() => navigate('/app/nutrition')}
        />

        <StatCard
          title="Hydration Today"
          value={waterMl}
          unit="ml"
          target={targetWater}
          progressPercent={Math.round((waterMl / targetWater) * 100)}
          icon={<Droplets className="w-5 h-5" />}
          iconBgColor="bg-cyan-500/10 text-cyan-400"
          accentColor="bg-cyan-400"
          subtitle={
            waterMl > 0
              ? `${Math.max(0, targetWater - waterMl)} ml remaining to 3L target`
              : 'Click + Water to log hydration'
          }
          empty={waterMl === 0}
          onClick={() => setIsWaterModalOpen(true)}
        />

        <StatCard
          title="Current Weight"
          value={currentWeight !== null ? currentWeight : '—'}
          unit={currentWeight !== null ? 'kg' : ''}
          icon={<Scale className="w-5 h-5" />}
          iconBgColor="bg-teal-500/10 text-teal-400"
          subtitle={
            weightLogs.length > 1
              ? `${weightLogs.length} data points logged`
              : 'Click + Weight to log entry'
          }
          empty={currentWeight === null}
          onClick={() => setIsWeightModalOpen(true)}
        />
      </div>

      {/* Main Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nutrition Chart Card (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-dark-900 border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Today's Macronutrient Distribution</h2>
              <p className="text-xs text-slate-400">Live breakdown of Protein, Carbs, Fat, and Dietary Fibre</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/app/nutrition')}
              className="text-xs"
            >
              Open Nutrition Tracker
            </Button>
          </div>

          <NutritionSummaryChart
            protein={totalProtein}
            carbs={totalCarbs}
            fat={totalFat}
            fibre={totalFibre}
            targetProtein={user?.profile?.targetDailyProtein || 140}
            targetCarbs={user?.profile?.targetDailyCarbs || 250}
            targetFat={user?.profile?.targetDailyFat || 65}
            targetFibre={user?.profile?.targetDailyFibre || 35}
          />

          {/* Quick Recent Meals List or Empty State */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Recorded Meals Today
            </h3>
            {meals.length === 0 ? (
              <EmptyState
                icon={<UtensilsCrossed className="w-6 h-6" />}
                title="No meals logged today"
                description="Keep your nutrition on track by recording your breakfast, lunch, or snacks."
                actionText="Record First Meal"
                onAction={() => navigate('/app/nutrition')}
                actionIcon={<Plus className="w-4 h-4" />}
              />
            ) : (
              <div className="space-y-2">
                {meals.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-950 border border-slate-800 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{item.name}</span>
                      <span className="ml-2 text-slate-400 capitalize">({item.meal})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-300 font-semibold">{item.calories} kcal</span>
                      <span className="text-emerald-400 font-bold">{item.protein}g P</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Weight Trend & Today's Workout */}
        <div className="space-y-6">
          {/* Weight Trend Widget */}
          <div className="rounded-3xl bg-dark-900 border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white">Weight Journey Curve</h3>
              <button
                onClick={() => setIsWeightModalOpen(true)}
                className="text-xs text-emerald-400 hover:underline font-bold"
              >
                + Add Entry
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Chronological recorded weigh-ins</p>
            <WeightTrendChart
              data={weightLogs}
              startingWeight={user?.profile?.currentWeightKg}
            />
          </div>

          {/* Today's Workout Status */}
          <div className="rounded-3xl bg-dark-900 border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white">Workout Session</h3>
              <span className="text-xs text-lime-400 font-semibold">
                {workouts.length} Logged This Week
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Training status and logged sets</p>

            {workouts.length === 0 ? (
              <EmptyState
                icon={<Dumbbell className="w-6 h-6" />}
                title="No workouts logged yet"
                description="Pick a routine from the exercise library and start recording your sets."
                actionText="Start Workout Session"
                onAction={() => navigate('/app/workouts')}
                actionIcon={<Plus className="w-4 h-4" />}
              />
            ) : (
              <div className="space-y-2">
                {workouts.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl bg-dark-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{w.name}</p>
                      <p className="text-slate-400">{w.muscleGroup} • {w.durationMinutes} mins</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-lime-400/10 text-lime-400 font-bold border border-lime-400/20">
                      {w.sets} Sets
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Water Log Modal */}
      <Modal
        isOpen={isWaterModalOpen}
        onClose={() => setIsWaterModalOpen(false)}
        title="Quick Hydration Tracker"
        subtitle="Log your water intake in millilitres to maintain cellular recovery."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="text-center p-4 rounded-2xl bg-dark-950 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">Current Hydration</span>
            <div className="text-3xl font-black text-cyan-400 mt-1">{waterMl} ml</div>
            <span className="text-xs text-slate-500">Target: {targetWater} ml</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleAddWater(250)}>
              + 250 ml
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleAddWater(500)}>
              + 500 ml
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleAddWater(750)}>
              + 750 ml
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setWaterMl(0)} className="w-full text-xs">
              Reset Today's Water
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsWaterModalOpen(false)} className="w-full">
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quick Weight Log Modal */}
      <Modal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        title="Log Weigh-In"
        subtitle="Record your current body weight in kilograms to keep your progress curve accurate."
        maxWidth="sm"
      >
        <form onSubmit={handleSaveWeight} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Weight (in kg)</label>
            <input
              type="number"
              step="0.1"
              min="30"
              max="250"
              value={newWeightInput}
              onChange={(e) => setNewWeightInput(e.target.value)}
              placeholder="e.g. 74.5"
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" type="button" onClick={() => setIsWeightModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex-1 font-bold">
              Save Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
