import React from 'react';
import { Menu, Plus, Sparkles, Bell, Calendar } from 'lucide-react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  onQuickLog?: (type: 'meal' | 'workout' | 'weight') => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar, onQuickLog }) => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-20 bg-dark-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-900 border border-slate-800 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-dark-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>{today}</span>
        </div>

        <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Workspace Active</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Log Action */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onQuickLog ? onQuickLog('meal') : navigate('/app/nutrition')}
            icon={<Plus className="w-3.5 h-3.5 text-emerald-400" />}
          >
            Log Meal
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onQuickLog ? onQuickLog('workout') : navigate('/app/workouts')}
            icon={<Plus className="w-3.5 h-3.5 text-lime-400" />}
          >
            Log Workout
          </Button>
        </div>

        {/* FitBot Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/app/fitbot')}
          icon={<Sparkles className="w-3.5 h-3.5 text-lime-400" />}
          className="border-lime-500/30 text-lime-400 hover:bg-lime-500/10"
        >
          Ask FitBot
        </Button>

        {/* Notification Bell */}
        <button
          onClick={() => alert('No new notifications. All health targets are currently in sync!')}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-dark-900 border border-slate-800 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
