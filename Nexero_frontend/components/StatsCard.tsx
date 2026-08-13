'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color?: string;
  index?: number;
}

export function StatsCard({ icon: Icon, value, label, color = 'accent' }: StatsCardProps) {
  const getIconStyle = (c: string) => {
    switch (c) {
      case 'accent':  return 'bg-[#f0ece6] text-[#92400e]';
      case 'cyan':    return 'bg-[#f0ece6] text-blue-600';
      case 'emerald': return 'bg-[#f0ece6] text-emerald-600';
      case 'amber':   return 'bg-[#f0ece6] text-amber-600';
      default:        return 'bg-[#f0ece6] text-zinc-600';
    }
  };

  return (
    <div className="bg-white border border-[#e2ddd5] rounded-2xl p-5">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${getIconStyle(color)}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-900 tracking-tight leading-none mb-1">{value}</p>
          <p className="text-xs text-zinc-500 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}
