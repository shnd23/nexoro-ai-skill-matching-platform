'use client';

import React from 'react';
import { Skill } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SkillChipProps {
  skill: Skill;
  removable?: boolean;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

export function SkillChip({ skill, removable, onRemove, size = 'md' }: SkillChipProps) {
  return (
    <Badge
      variant="secondary"
      className={`bg-[#f0ece6] text-zinc-700 hover:bg-[#e8e4de] border border-[#e2ddd5] transition-colors ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'} whitespace-nowrap gap-1 rounded-full font-medium`}
    >
      {skill.name}
      {removable && onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          className="ml-1 text-zinc-500 hover:text-zinc-900 transition-colors focus:outline-none"
          aria-label={`Remove ${skill.name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
