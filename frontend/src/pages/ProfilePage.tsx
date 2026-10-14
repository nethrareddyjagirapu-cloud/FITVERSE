import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Scale,
  Ruler,
  Calendar,
  Activity,
  Flame,
} from 'lucide-react';
import { FitnessGoal, ActivityLevel, FitnessExperience, DietPreference, WorkoutLocation } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [age, setAge] = useState(user?.profile?.age || 26);
  const [heightCm, setHeightCm] = useState(user?.profile?.heightCm || 178);
  const [weightKg, setWeightKg] = useState(user?.profile?.currentWeightKg || 75.5);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(user?.profile?.fitnessGoal || 'MUSCLE_GAIN');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user?.profile?.activityLevel || 'MODERATELY_ACTIVE');
  const [experience, setExperience] = useState<FitnessExperience>(user?.profile?.fitnessExperience || 'INTERMEDIATE');
  const [diet, setDiet] = useState<DietPreference>(user?.profile?.dietPreference || 'NON_VEGETARIAN');
  const [location, setLocation] = useState<WorkoutLocation>(user?.profile?.workoutLocation || 'GYM');
  const [workoutDays, setWorkoutDays] = useState(user?.profile?.preferredWorkoutDays || 5);
  const [allergies, setAllergies] = useState(user?.profile?.allergies || 'None');

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      age,
      heightCm,
      currentWeightKg: weightKg,
      fitnessGoal,
      activityLevel,
      fitnessExperience: experience,
      dietPreference: diet,
      workoutLocation: location,
      preferredWorkoutDays: workoutDays,
      allergies,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // BMI calculation (kg / (m^2))
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '—';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            My Fitness Profile
            <User className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Physical metrics used by the FITVERSE engine to personalize calories and workouts.
          </p>
        </div>

        {isSaved && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Saved</span>
          </div>
        )}
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Body Mass Index (BMI)</span>
          <div className="text-2xl font-black text-white mt-1">{bmi}</div>
          <span className="text-[11px] text-slate-500">Calculated from height & weight</span>
        </div>
        <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Current Weight</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{weightKg} kg</div>
          <span className="text-[11px] text-slate-500">Height: {heightCm} cm</span>
        </div>
        <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Diet Type</span>
          <div className="text-lg font-bold text-white mt-1 capitalize">{diet.replace('_', ' ').toLowerCase()}</div>
          <span className="text-[11px] text-slate-500">{allergies ? `Allergies: ${allergies}` : 'No restrictions'}</span>
        </div>
        <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Weekly Cadence</span>
          <div className="text-2xl font-black text-lime-400 mt-1">{workoutDays} Days</div>
          <span className="text-[11px] text-slate-500">Location: {location}</span>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSaveProfile} className="rounded-3xl bg-dark-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800">
          Personal Information & Metrics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Height in cm</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Current Weight in kg</label>
            <input
              type="number"
              step="0.5"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Primary Goal</label>
            <select
              value={fitnessGoal}
              onChange={(e: any) => setFitnessGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="FAT_LOSS">Fat Loss</option>
              <option value="MUSCLE_GAIN">Muscle Gain</option>
              <option value="WEIGHT_MAINTENANCE">Weight Maintenance</option>
              <option value="GENERAL_FITNESS">General Fitness</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e: any) => setActivityLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="SEDENTARY">Sedentary</option>
              <option value="LIGHTLY_ACTIVE">Lightly Active</option>
              <option value="MODERATELY_ACTIVE">Moderately Active</option>
              <option value="VERY_ACTIVE">Very Active</option>
              <option value="EXTRA_ACTIVE">Extra Active</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Experience</label>
            <select
              value={experience}
              onChange={(e: any) => setExperience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Diet Preference</label>
            <select
              value={diet}
              onChange={(e: any) => setDiet(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="VEGETARIAN">Vegetarian</option>
              <option value="VEGAN">Vegan</option>
              <option value="EGGETARIAN">Eggetarian</option>
              <option value="NON_VEGETARIAN">Non-Vegetarian</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Workout Location</label>
            <select
              value={location}
              onChange={(e: any) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="GYM">Commercial Gym</option>
              <option value="HOME">Home</option>
              <option value="OUTDOORS">Outdoors</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Dietary Restrictions</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <Button variant="primary" type="submit" size="lg" className="font-bold">
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
