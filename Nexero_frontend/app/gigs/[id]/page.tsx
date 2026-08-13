'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, DollarSign, Users, Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { GIG_REQUESTS, MATCHES, timeAgo, formatBudget, getInitials } from '@/lib/mock-data';
import { SkillChip } from '@/components/SkillChip';
import { MatchCard } from '@/components/MatchCard';
import { useToast } from '@/components/Toast';

export default function GigDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();
  const [matchStatuses, setMatchStatuses] = useState<Record<string, string>>({});

  const gigId = params.id as string;
  const gig = GIG_REQUESTS.find(g => g.id === gigId);

  const matches = useMemo(() => {
    return MATCHES.filter(m => m.gigRequestId === gigId)
      .sort((a, b) => b.score - a.score);
  }, [gigId]);

  if (!isLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass-card p-12 text-center">
          <h2 className="text-xl font-display font-bold text-slate-300 mb-2">Gig not found</h2>
          <p className="text-sm text-slate-500 mb-6">This gig request doesn&apos;t exist or has been removed.</p>
          <Link href="/feed" className="btn-primary text-sm">Back to Feed</Link>
        </div>
      </div>
    );
  }

  const isAuthor = gig.authorId === user?.id;

  function handleAccept(matchId: string) {
    setMatchStatuses(prev => ({ ...prev, [matchId]: 'Accepted' }));
    showToast('Match accepted! You can now collaborate.', 'success');
  }

  function handleDecline(matchId: string) {
    setMatchStatuses(prev => ({ ...prev, [matchId]: 'Declined' }));
    showToast('Match declined.', 'info');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </motion.div>

      {/* Gig Detail Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 mb-8"
      >
        {/* Author Row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/80 to-cyan/80 flex items-center justify-center text-lg font-bold text-white">
            {getInitials(gig.author.displayName)}
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-medium text-slate-200">{gig.author.displayName}</h2>
            <p className="text-xs text-slate-500">{gig.author.bio.slice(0, 80)}...</p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${gig.status === 'Open' ? 'status-open' :
              gig.status === 'Matched' ? 'status-matched' : 'status-closed'
            }`}>
            {gig.status}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-display font-bold text-slate-100 mb-4">
          {gig.title}
        </h1>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6 whitespace-pre-wrap">
          {gig.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {gig.requiredSkills.map(skill => (
            <SkillChip key={skill.id} skill={skill} />
          ))}
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">{formatBudget(gig.budget)}</p>
              <p className="text-xs text-slate-500">Budget</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">{gig.timeframe || 'Flexible'}</p>
              <p className="text-xs text-slate-500">Timeframe</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">{timeAgo(gig.createdAt)}</p>
              <p className="text-xs text-slate-500">Posted</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent-light" />
            <div>
              <p className="text-sm font-medium text-slate-200">{matches.length}</p>
              <p className="text-xs text-slate-500">Candidates</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Matches Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent-light" />
            Matched Candidates
          </h2>
          <span className="text-sm text-slate-500">{matches.length} found</span>
        </div>

        {matches.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No candidates matched yet. The matching engine is still processing.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match, i) => {
              const overriddenStatus = matchStatuses[match.id];
              const displayMatch = overriddenStatus
                ? { ...match, status: overriddenStatus as 'Suggested' | 'Accepted' | 'Declined' }
                : match;
              return (
                <MatchCard
                  key={match.id}
                  match={displayMatch}
                  index={i}
                  onAccept={isAuthor ? handleAccept : undefined}
                  onDecline={isAuthor ? handleDecline : undefined}
                />
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
