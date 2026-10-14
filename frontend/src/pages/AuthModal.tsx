import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import {
  User,
  FitnessGoal,
  ActivityLevel,
  FitnessExperience,
  DietPreference,
  WorkoutLocation,
  UserProfile,
} from '../types';
import { Check, Dumbbell, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Account credentials, Step 2: Physical & Fitness Profile
  const { login, register, loginDemoUser } = useAuth();
  const navigate = useNavigate();

  // Separate Login and Register state to prevent accidental state leakage
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerFullName, setRegisterFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Profile State
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'>('MALE');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('MUSCLE_GAIN');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('MODERATELY_ACTIVE');
  const [fitnessExperience, setFitnessExperience] = useState<FitnessExperience>('BEGINNER');
  const [dietPreference, setDietPreference] = useState<DietPreference>('VEGETARIAN');
  const [workoutLocation, setWorkoutLocation] = useState<WorkoutLocation>('GYM');
  const [preferredWorkoutDays, setPreferredWorkoutDays] = useState<number>(4);
  const [allergies, setAllergies] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode and reset errors whenever the modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStep(1);
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, initialMode]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanEmail = loginEmail.trim();
    if (!cleanEmail || !loginPassword) {
      setError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(cleanEmail, loginPassword);
      onClose();
      navigate('/app');
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanFullName = registerFullName.trim();
    const cleanEmail = registerEmail.trim();

    if (!cleanFullName || !cleanEmail || !registerPassword) {
      setError('All fields are required.');
      return;
    }
    if (cleanFullName.length < 2) {
      setError('Full name must be at least 2 characters.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. athlete@example.com).');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (registerPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setStep(2);
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Calculate smart estimate daily baseline macros
    const targetCalories = fitnessGoal === 'FAT_LOSS' ? 1900 : fitnessGoal === 'MUSCLE_GAIN' ? 2400 : 2100;
    const targetProtein = Math.round(weightKg * 1.8);
    const targetFat = 60;
    const targetCarbs = Math.round((targetCalories - (targetProtein * 4 + targetFat * 9)) / 4);

    const profile: UserProfile = {
      age,
      gender,
      heightCm,
      currentWeightKg: weightKg,
      fitnessGoal,
      activityLevel,
      fitnessExperience,
      dietPreference,
      workoutLocation,
      preferredWorkoutDays,
      allergies,
      targetDailyCalories: targetCalories,
      targetDailyProtein: targetProtein,
      targetDailyCarbs: targetCarbs,
      targetDailyFat: targetFat,
      targetDailyFibre: 30,
    };

    setIsSubmitting(true);
    try {
      await register({
        fullName: registerFullName.trim(),
        email: registerEmail.trim().toLowerCase(),
        password: registerPassword,
        profile,
      });
      onClose();
      navigate('/app');
    } catch (err: any) {
      setError(err?.message || 'Failed to complete registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAccess = async () => {
    setIsSubmitting(true);
    try {
      await loginDemoUser();
      onClose();
      navigate('/app');
    } catch (err: any) {
      setError(err?.message || 'Failed to access demo account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'login'
          ? 'Sign in to FITVERSE'
          : step === 1
          ? 'Create Your FITVERSE Account'
          : 'Personalize Your Fitness Profile'
      }
      subtitle={
        mode === 'login'
          ? 'Access your private nutrition logs, workouts, and FitBot AI assistant.'
          : step === 1
          ? 'Step 1 of 2: Basic account credentials'
          : 'Step 2 of 2: Physical metrics & preferences for accurate calorie calculations'
      }
      maxWidth={mode === 'register' && step === 2 ? '2xl' : 'md'}
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 font-medium">
          <div>{error}</div>
          {mode === 'register' && error.toLowerCase().includes('already in use') && (
            <div className="mt-2 pt-2 border-t border-rose-500/20">
              <button
                type="button"
                onClick={() => {
                  setLoginEmail(registerEmail.trim());
                  setMode('login');
                  setStep(1);
                  setError(null);
                }}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline inline-flex items-center gap-1"
              >
                Already registered? Click here to Sign In with this email →
              </button>
            </div>
          )}
          {mode === 'login' && error.toLowerCase().includes('invalid email or password') && (
            <div className="mt-2 pt-2 border-t border-rose-500/20">
              <button
                type="button"
                onClick={() => {
                  if (loginEmail.trim() && loginEmail.trim() !== 'alex.fitness@fitverse.dev') {
                    setRegisterEmail(loginEmail.trim());
                  }
                  setMode('register');
                  setStep(1);
                  setError(null);
                }}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline inline-flex items-center gap-1"
              >
                Don't have an account yet? Create one now →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex p-1 bg-dark-950 rounded-xl border border-slate-800 mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setStep(1);
            setError(null);
            if (registerEmail.trim() && !loginEmail) {
              setLoginEmail(registerEmail.trim());
            }
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            mode === 'login' ? 'bg-dark-850 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setStep(1);
            setError(null);
            if (loginEmail.trim() && loginEmail.trim() !== 'alex.fitness@fitverse.dev' && !registerEmail) {
              setRegisterEmail(loginEmail.trim());
            }
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            mode === 'register' ? 'bg-dark-850 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      {mode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-300">
            <div>
              <span className="text-slate-400">Demo Athlete:</span>{' '}
              <span className="text-emerald-400 font-mono">alex.fitness@fitverse.dev</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginEmail('alex.fitness@fitverse.dev');
                setLoginPassword('password123');
                setError(null);
              }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline"
            >
              Quick Fill
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="athlete@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2 font-bold" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="pt-3 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={isSubmitting}
              className="text-xs text-lime-400 hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try 1-Click Instant Demo Account
            </button>
          </div>
        </form>
      ) : step === 1 ? (
        <form onSubmit={handleRegisterNext} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={registerFullName}
              onChange={(e) => setRegisterFullName(e.target.value)}
              placeholder="e.g. Alex Carter"
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              placeholder="athlete@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2 font-bold">
            Continue to Fitness Profile (Step 2/2)
          </Button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleDemoAccess}
              disabled={isSubmitting}
              className="text-xs text-lime-400 hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Skip setup with 1-Click Demo
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleCompleteRegistration} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
              <input
                type="number"
                min="14"
                max="100"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e: any) => setGender(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="250"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Fitness Goal</label>
              <select
                value={fitnessGoal}
                onChange={(e: any) => setFitnessGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
              >
                <option value="FAT_LOSS">Fat Loss & Leaning</option>
                <option value="MUSCLE_GAIN">Muscle Gain & Hypertrophy</option>
                <option value="WEIGHT_MAINTENANCE">Weight Maintenance</option>
                <option value="GENERAL_FITNESS">General Health & Fitness</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e: any) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
              >
                <option value="SEDENTARY">Sedentary (Desk Job, little movement)</option>
                <option value="LIGHTLY_ACTIVE">Lightly Active (1-3 days/week)</option>
                <option value="MODERATELY_ACTIVE">Moderately Active (3-5 days/week)</option>
                <option value="VERY_ACTIVE">Very Active (6-7 days/week)</option>
                <option value="EXTRA_ACTIVE">Extra Active (Intense training / labor)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Diet Preference</label>
              <select
                value={dietPreference}
                onChange={(e: any) => setDietPreference(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
              >
                <option value="VEGETARIAN">Vegetarian</option>
                <option value="VEGAN">Vegan</option>
                <option value="EGGETARIAN">Eggetarian</option>
                <option value="NON_VEGETARIAN">Non-Vegetarian</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Workout Location</label>
              <select
                value={workoutLocation}
                onChange={(e: any) => setWorkoutLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
              >
                <option value="GYM">Commercial Gym</option>
                <option value="HOME">Home Workout</option>
                <option value="OUTDOORS">Outdoors / Calisthenics</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Workout Days/Week</label>
              <select
                value={preferredWorkoutDays}
                onChange={(e) => setPreferredWorkoutDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
              >
                <option value="3">3 Days (Full Body)</option>
                <option value="4">4 Days (Upper / Lower)</option>
                <option value="5">5 Days (Push Pull Legs)</option>
                <option value="6">6 Days (Dedicated Split)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Allergies / Dietary Restrictions (Optional)</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Peanut allergy, Lactose sensitive, Gluten-free"
              className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Complete & Enter Dashboard'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
