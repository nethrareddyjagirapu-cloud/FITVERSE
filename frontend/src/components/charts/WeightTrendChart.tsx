import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface WeightDataPoint {
  date: string;
  weight: number;
}

interface WeightTrendChartProps {
  data: WeightDataPoint[];
  targetWeight?: number;
  startingWeight?: number;
}

export const WeightTrendChart: React.FC<WeightTrendChartProps> = ({
  data,
  targetWeight,
  startingWeight,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-dark-950/40 rounded-xl border border-slate-800/80">
        <p className="text-sm font-medium text-slate-300">No weight records logged yet</p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Record your current weight to unlock your personalized transformation trend curve.
        </p>
      </div>
    );
  }

  const latestWeight = data[data.length - 1].weight;
  const firstWeight = startingWeight || data[0].weight;
  const weightChange = Number((latestWeight - firstWeight).toFixed(1));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl font-extrabold text-white">{latestWeight} kg</span>
          <span className="text-xs text-slate-400 ml-2">Latest Entry</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-dark-950 border border-slate-800">
          {weightChange < 0 ? (
            <>
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">{Math.abs(weightChange)} kg decrease</span>
            </>
          ) : weightChange > 0 ? (
            <>
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400">+{weightChange} kg increase</span>
            </>
          ) : (
            <>
              <Minus className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">No net change</span>
            </>
          )}
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              stroke="#64748b"
              fontSize={11}
              unit="kg"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-dark-950 border border-slate-700 p-2 rounded-lg text-xs shadow-xl">
                      <p className="text-slate-400">{payload[0].payload.date}</p>
                      <p className="font-bold text-emerald-400">{payload[0].value} kg</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#weightGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {targetWeight && (
        <div className="mt-2 text-right text-xs text-slate-400">
          Target: <span className="font-semibold text-emerald-400">{targetWeight} kg</span>
        </div>
      )}
    </div>
  );
};
