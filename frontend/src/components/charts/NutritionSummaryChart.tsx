import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

interface MacroItem {
  name: string;
  consumed: number;
  target: number;
  unit: string;
  color: string;
}

interface NutritionSummaryChartProps {
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  targetFibre?: number;
}

export const NutritionSummaryChart: React.FC<NutritionSummaryChartProps> = ({
  protein,
  carbs,
  fat,
  fibre,
  targetProtein = 140,
  targetCarbs = 250,
  targetFat = 65,
  targetFibre = 35,
}) => {
  const data: MacroItem[] = [
    { name: 'Protein', consumed: protein, target: targetProtein, unit: 'g', color: '#10b981' }, // emerald
    { name: 'Carbs', consumed: carbs, target: targetCarbs, unit: 'g', color: '#38bdf8' }, // sky blue
    { name: 'Fat', consumed: fat, target: targetFat, unit: 'g', color: '#f59e0b' }, // amber
    { name: 'Fibre', consumed: fibre, target: targetFibre, unit: 'g', color: '#84cc16' }, // lime
  ];

  const hasAnyLogged = protein > 0 || carbs > 0 || fat > 0 || fibre > 0;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {data.map((item) => {
          const pct = item.target > 0 ? Math.round((item.consumed / item.target) * 100) : 0;
          return (
            <div key={item.name} className="p-3 rounded-xl bg-dark-950/70 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{item.name}</span>
                <span className="font-semibold" style={{ color: item.color }}>{pct}%</span>
              </div>
              <div className="text-lg font-bold text-white">
                {item.consumed} <span className="text-xs font-normal text-slate-400">/ {item.target}{item.unit}</span>
              </div>
              <div className="h-1.5 w-full bg-dark-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-48 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <XAxis type="number" stroke="#64748b" fontSize={11} domain={[0, 'dataMax + 20']} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={60} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as MacroItem;
                  return (
                    <div className="bg-dark-950 border border-slate-700 p-2.5 rounded-lg text-xs shadow-xl">
                      <p className="font-bold text-white">{d.name}</p>
                      <p className="text-slate-300">Consumed: {d.consumed}{d.unit}</p>
                      <p className="text-slate-400">Target: {d.target}{d.unit}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="consumed" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!hasAnyLogged && (
        <p className="text-center text-xs text-slate-500 mt-2">
          No meals recorded today yet. Log your first meal to see live bars update!
        </p>
      )}
    </div>
  );
};
