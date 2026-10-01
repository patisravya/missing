import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color?: 'blue' | 'cyan' | 'emerald' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'cyan',
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-950/40',
          border: 'border-blue-500/30',
          icon: 'text-blue-400 bg-blue-500/10',
          text: 'text-blue-400',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/30',
          icon: 'text-emerald-400 bg-emerald-500/10',
          text: 'text-emerald-400',
        };
      case 'amber':
        return {
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/30',
          icon: 'text-amber-400 bg-amber-500/10',
          text: 'text-amber-400',
        };
      default:
        return {
          bg: 'bg-cyan-950/40',
          border: 'border-cyan-500/30',
          icon: 'text-cyan-400 bg-cyan-500/10',
          text: 'text-cyan-400',
        };
    }
  };

  const theme = getColorClasses();

  return (
    <div className={`bg-[#121824] border ${theme.border} rounded-xl p-5 space-y-3 transition-all hover:border-slate-700 shadow-md`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-lg border border-[#1e293b] flex items-center justify-center ${theme.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold font-mono text-slate-100">{value}</span>
        {trend && <span className={`text-xs font-mono font-semibold ${theme.text}`}>{trend}</span>}
      </div>

      {subtext && <p className="text-[11px] text-slate-400 font-mono">{subtext}</p>}
    </div>
  );
};
