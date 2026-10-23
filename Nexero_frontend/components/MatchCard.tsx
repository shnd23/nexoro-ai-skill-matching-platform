'use client';

import React from 'react';
import { Check, X, Zap, Award } from 'lucide-react';
import { Match } from '@/lib/types';
import { getInitials } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MatchCardProps {
  match: Match;
  index?: number;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

export function MatchCard({ match, onAccept, onDecline }: MatchCardProps) {
  const isActionable = match.status === 'Suggested' && onAccept && onDecline;

  return (
    <Card className="bg-white border-zinc-200 hover:shadow-sm transition-shadow rounded-2xl">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-10 w-10 border border-zinc-200">
            <AvatarFallback className="bg-zinc-100 text-xs text-zinc-700 font-semibold">
              {getInitials(match.candidateUser.displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-bold text-zinc-900 truncate">
              {match.candidateUser.displayName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="bg-[#14a800]/10 text-upwork-green border-upwork-green/20 gap-1 px-1.5 py-0 text-[10px] font-bold">
                <Zap className="h-3 w-3" />
                {Math.round(match.score * 100)}% Match
              </Badge>
              {match.candidateUser.skillsOffered.some(s => s.proficiencyLevel === 'Expert') && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                  <Award className="h-3 w-3" />
                  Top Rated
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto flex justify-end">
          {isActionable ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDecline(match.id)}
                className="flex-1 sm:flex-none h-8 border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-red-600 rounded-full font-semibold"
              >
                <X className="h-4 w-4 mr-1" />
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => onAccept(match.id)}
                className="flex-1 sm:flex-none h-8 bg-upwork-green hover:bg-upwork-hover text-white rounded-full font-semibold"
              >
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
            </div>
          ) : (
            <Badge variant="outline" className={`font-semibold
              ${match.status === 'Accepted' ? 'bg-[#14a800]/10 text-upwork-green border-upwork-green/20' : ''}
              ${match.status === 'Declined' ? 'bg-red-50 text-red-600 border-red-200' : ''}
              ${match.status === 'Suggested' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' : ''}
            `}>
              {match.status}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
