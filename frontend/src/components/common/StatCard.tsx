import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  target?: string | number;
  progressPercent?: number;
  icon: React.ReactNode;
  iconBgColor?: string;
  accentColor?: string;
  subtitle?: string;
  onClick?: () => void;
  empty?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  target,
  progressPercent,
  icon,
  iconBgColor = 'bg-emerald-500/10 text-emerald-400',
  accentColor = 'bg-emerald-500',
  subtitle,
  onClick,
  empty = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-dark-900 border border-slate-800/80 p-5 transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-emerald-950/20 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            {empty ? (
              <span className="text-2xl font-bold text-slate-500">—</span>
            ) : (
              <>
                <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
                {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
              </>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor} shrink-0`}>
          {icon}
        </div>
      </div>

      {progressPercent !== undefined && !empty && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span>
            <span className="font-semibold text-slate-200">
              {progressPercent}% {target ? `(of ${target}${unit || ''})` : ''}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-dark-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${accentColor}`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      )}

      {subtitle && (
        <p className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
          {subtitle}
        </p>
      )}
    </div>
  );
};
