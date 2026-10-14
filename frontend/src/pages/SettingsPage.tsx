import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import {
  Settings,
  Shield,
  Download,
  Trash2,
  Bell,
  Palette,
  Moon,
  LogOut,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'midnight'>('dark');
  const [exportNotice, setExportNotice] = useState(false);

  const handleExportData = () => {
    const data = {
      user,
      exportedAt: new Date().toISOString(),
      meals: localStorage.getItem(`fitverse_nutrition_items_${user?.id}`),
      workouts: localStorage.getItem(`fitverse_workout_sessions_${user?.id}`),
      journeys: localStorage.getItem(`fitverse_journeys_${user?.id}`),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitverse-data-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset your local logs? This cannot be undone.')) {
      localStorage.removeItem(`fitverse_meals_${user?.id}`);
      localStorage.removeItem(`fitverse_nutrition_items_${user?.id}`);
      localStorage.removeItem(`fitverse_workouts_${user?.id}`);
      localStorage.removeItem(`fitverse_workout_sessions_${user?.id}`);
      localStorage.removeItem(`fitverse_water_${user?.id}`);
      localStorage.removeItem(`fitverse_weights_${user?.id}`);
      alert('Local records have been reset. Refreshing dashboard...');
      window.location.reload();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            Application Settings
            <Settings className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your account security, interface theme, notifications, and private data export.
          </p>
        </div>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Personal data exported successfully in JSON format.</span>
        </div>
      )}

      {/* Theme & Display */}
      <div className="rounded-3xl bg-dark-900 border border-slate-800 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-emerald-400" />
          Theme & Ergonomics
        </h2>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-950 border border-slate-800 text-xs">
          <div>
            <p className="font-bold text-white">Dark SaaS Palette</p>
            <p className="text-slate-400">Deep charcoal & navy surfaces with emerald & lime accents.</p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
            Active Theme
          </span>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-3xl bg-dark-900 border border-slate-800 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-lime-400" />
          Reminder Preferences
        </h2>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-950 border border-slate-800 text-xs">
          <div>
            <p className="font-bold text-white">Daily Hydration & Meal Check-in</p>
            <p className="text-slate-400">Receive in-browser reminders to log your post-workout meals.</p>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
              notificationsEnabled ? 'bg-emerald-500 justify-end' : 'bg-dark-800 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>
      </div>

      {/* Privacy & Data Export */}
      <div className="rounded-3xl bg-dark-900 border border-slate-800 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-400" />
          Data Sovereignty & Privacy
        </h2>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-950 border border-slate-800 text-xs">
          <div>
            <p className="font-bold text-white">Export My Records</p>
            <p className="text-slate-400">Download a complete copy of all your nutrition, workout, and journey history.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportData}
            icon={<Download className="w-4 h-4 text-emerald-400" />}
          >
            Export JSON
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-dark-950 border border-slate-800 text-xs">
          <div>
            <p className="font-bold text-white">Reset Local Logged Data</p>
            <p className="text-slate-400">Clear stored meal entries and workout history to test clean empty states.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetData}
            icon={<Trash2 className="w-4 h-4 text-rose-400" />}
            className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
          >
            Reset Logs
          </Button>
        </div>
      </div>

      {/* Session Management */}
      <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Sign Out of FITVERSE</h3>
          <p className="text-xs text-slate-400">End your current session safely.</p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={handleLogout}
          icon={<LogOut className="w-4 h-4" />}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
