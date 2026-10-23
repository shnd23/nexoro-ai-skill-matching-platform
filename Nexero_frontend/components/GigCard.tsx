'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, DollarSign, Zap, ArrowUpRight } from 'lucide-react';
import { GigRequest } from '@/lib/types';
import { SkillChip } from './SkillChip';
import { timeAgo, formatBudget, getInitials } from '@/lib/mock-data';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface GigCardProps {
  gig: GigRequest;
  matchScore?: number;
  index?: number;
  showActions?: boolean;
}

export function GigCard({ gig, matchScore, showActions = true }: GigCardProps) {
  const getScoreBadge = (score: number) => {
    if (score >= 0.9) return { cls: 'bg-emerald-500 text-white', label: `${Math.round(score * 100)}% match` };
    if (score >= 0.75) return { cls: 'bg-amber-500 text-white', label: `${Math.round(score * 100)}% match` };
    return { cls: 'bg-zinc-400 text-white', label: `${Math.round(score * 100)}% match` };
  };

  const getStatusVariant = (status: string) => {
    if (status === 'Open') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'Matched') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-[#f0ece6] text-zinc-600 border-[#e2ddd5]';
  };

  const scoreBadge = matchScore !== undefined ? getScoreBadge(matchScore) : null;

  return (
    <Link href={`/gigs/${gig.id}`} className="block group outline-none">
      <div className="bg-white border border-[#e2ddd5] hover:border-[#c8c2b8] hover:shadow-sm transition-all duration-200 rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6">

          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-[#e8e4de] text-[10px] font-bold text-zinc-600">
                  {getInitials(gig.author.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-900 truncate">{gig.author.displayName}</p>
                <p className="text-[10px] text-zinc-400">{timeAgo(gig.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {scoreBadge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${scoreBadge.cls}`}>
                  <Zap className="h-2.5 w-2.5" /> {scoreBadge.label}
                </span>
              )}
              <Badge variant="outline" className={`text-[10px] font-semibold ${getStatusVariant(gig.status)}`}>
                {gig.status}
              </Badge>
            </div>
          </div>

          <h3 className="text-base font-bold text-zinc-900 mb-1.5 leading-snug group-hover:text-[#92400e] transition-colors duration-200 line-clamp-2">
            {gig.title}
          </h3>

          <p className="text-sm text-zinc-500 leading-relaxed mb-4 line-clamp-2 font-light">
            {gig.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {gig.requiredSkills.map(skill => (
              <SkillChip key={skill.id} skill={skill} size="sm" />
            ))}
          </div>

          <div className="flex items-center justify-between pt-3.5 border-t border-[#f0ece6]">
            <div className="flex items-center gap-3">
              {gig.budget && (
                <span className="flex items-center gap-1 text-xs font-semibold text-zinc-800">
                  <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
                  {formatBudget(gig.budget)}
                </span>
              )}
              {gig.timeframe && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                  <Clock className="h-3 w-3" />
                  {gig.timeframe}
                </span>
              )}
            </div>
            {showActions && (
              <span className="flex items-center gap-1 text-xs font-semibold text-[#92400e] opacity-0 group-hover:opacity-100 transition-opacity">
                View <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
