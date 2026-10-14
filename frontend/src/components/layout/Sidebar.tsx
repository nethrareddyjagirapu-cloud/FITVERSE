import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Dumbbell,
  Target,
  LineChart,
  Compass,
  HeartPulse,
  Sparkles,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Nutrition Tracker', path: '/app/nutrition', icon: UtensilsCrossed },
    { name: 'Workout Tracker', path: '/app/workouts', icon: Dumbbell },
    { name: 'Fitness Goals', path: '/app/goals', icon: Target },
    { name: 'Progress Tracker', path: '/app/progress', icon: LineChart },
    { name: 'My Fitness Journey', path: '/app/journey', icon: Compass },
    { name: 'Health & Habits', path: '/app/habits', icon: HeartPulse },
    { name: 'FitBot AI', path: '/app/fitbot', icon: Sparkles, highlight: true },
    { name: 'My Profile', path: '/app/profile', icon: User },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-dark-900 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-dark-950 rounded-[9px] flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-emerald-400 transform -rotate-45" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-white">
                FIT<span className="text-emerald-400">VERSE</span>
              </span>
              <span className="text-[9px] tracking-widest text-slate-500 uppercase font-bold">
                Platform
              </span>
            </div>
          </div>
        </div>

        {/* User Mini Card */}
        <div className="px-5 py-4 border-b border-slate-800/60 bg-dark-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.fullName || 'Athlete'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'user@fitverse.dev'}</p>
            </div>
          </div>
          {user?.profile?.fitnessGoal && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-dark-800 border border-slate-700/60 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              Goal: {user.profile.fitnessGoal.replace('_', ' ')}
            </div>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-500 text-dark-950 shadow-md shadow-emerald-500/20 font-bold'
                    : item.highlight
                    ? 'text-lime-400 hover:bg-dark-800/80 hover:text-lime-300'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-dark-800/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-dark-950'
                          : item.highlight
                          ? 'text-lime-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="text-[10px] bg-lime-400/10 text-lime-400 px-1.5 py-0.5 rounded border border-lime-400/30">
                      AI
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-dark-950 opacity-70" />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* 11. Logout Item */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
