'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Briefcase, Users, PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { gigs as gigsApi, feed as feedApi, matches as matchesApi, ApiGigRequest, ApiFeedItem, ApiMatch } from '@/lib/api';
import { GigCard } from '@/components/GigCard';
import { MatchCard } from '@/components/MatchCard';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyGigsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [myGigs, setMyGigs] = useState<ApiGigRequest[]>([]);
  const [myMatches, setMyMatches] = useState<ApiFeedItem[]>([]);
  const [gigMatchesMap, setGigMatchesMap] = useState<Record<string, ApiMatch[]>>({});
  const [expandedGig, setExpandedGig] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setFetching(true);
    Promise.all([
      gigsApi.mine().catch(() => []),
      feedApi.get().catch(() => []),
    ]).then(([postedGigs, feedItems]) => {
      setMyGigs(postedGigs);
      setMyMatches(feedItems);
    }).finally(() => setFetching(false));
  }, [isAuthenticated]);

  const loadGigMatches = useCallback(async (gigId: string) => {
    if (gigMatchesMap[gigId]) return;
    try {
      const data = await gigsApi.getMatchesForGig(gigId);
      setGigMatchesMap(prev => ({ ...prev, [gigId]: data }));
    } catch {
      setGigMatchesMap(prev => ({ ...prev, [gigId]: [] }));
    }
  }, [gigMatchesMap]);

  function toggleExpand(gigId: string) {
    if (expandedGig === gigId) {
      setExpandedGig(null);
    } else {
      setExpandedGig(gigId);
      loadGigMatches(gigId);
    }
  }

  async function handleAccept(matchId: string) {
    try {
      await matchesApi.accept(matchId);

      setGigMatchesMap(prev => {
        const updated = { ...prev };
        for (const gigId in updated) {
          updated[gigId] = updated[gigId].map(m =>
            m.id === matchId ? { ...m, status: 'Accepted' as const } : m
          );
        }
        return updated;
      });
      toast.success('Match accepted! You can now collaborate.');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to accept match.');
    }
  }

  async function handleDecline(matchId: string) {
    try {
      await matchesApi.decline(matchId);
      setGigMatchesMap(prev => {
        const updated = { ...prev };
        for (const gigId in updated) {
          updated[gigId] = updated[gigId].map(m =>
            m.id === matchId ? { ...m, status: 'Declined' as const } : m
          );
        }
        return updated;
      });
      toast.info('Match declined.');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to decline match.');
    }
  }

  if (isLoading || fetching) {
    return (
      <div className="bg-[#f7f4f0] min-h-[calc(100vh-56px)] w-full py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-[#e2ddd5] rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  function toGigCardGig(item: ApiFeedItem) {
    const g = item.gigRequest;
    return {
      id: g.id,
      authorId: g.authorId,
      author: { id: g.authorId, email: '', displayName: g.authorName, bio: '', avatarUrl: '', createdAt: g.createdAt, skillsOffered: [] as [] },
      title: g.title,
      description: g.description,
      status: g.status,
      budget: g.budget,
      timeframe: g.timeframe,
      createdAt: g.createdAt,
      requiredSkills: g.requiredSkills,
    };
  }

  function toMatchCardMatch(m: ApiMatch) {
    return {
      id: m.id,
      gigRequestId: m.gigRequestId,
      gigRequest: {} as never,
      candidateUserId: m.candidateUserId,
      candidateUser: {
        id: m.candidateUserId,
        email: '',
        displayName: m.candidateDisplayName,
        bio: '',
        avatarUrl: '',
        createdAt: m.createdAt,
        skillsOffered: [] as [],
      },
      score: m.score,
      status: m.status as 'Suggested' | 'Accepted' | 'Declined',
      createdAt: m.createdAt,
    };
  }

  return (
    <div className="bg-[#f7f4f0] min-h-[calc(100vh-56px)] w-full py-12">
      <div className="max-w-4xl mx-auto px-4">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#92400e] mb-3">Dashboard</p>
            <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-2">My Gigs.</h1>
            <p className="text-zinc-500 font-light">Manage your posted gigs and incoming matches.</p>
          </div>
          <Link href="/post">
            <Button className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium flex items-center gap-2 h-10 px-5 text-sm leading-none">
              <PlusCircle className="w-4 h-4" />
              Post New Gig
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="posted" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-[#e2ddd5] mb-8 h-12 rounded-xl p-1">
            <TabsTrigger
              value="posted"
              className="data-[state=active]:bg-[#f0ece6] data-[state=active]:text-zinc-900 text-zinc-500 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Posted by Me
              <Badge variant="secondary" className="ml-1 bg-[#e2ddd5] text-zinc-600 border-none text-[10px] h-4 px-1.5">{myGigs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="matched"
              className="data-[state=active]:bg-[#f0ece6] data-[state=active]:text-zinc-900 text-zinc-500 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Users className="w-3.5 h-3.5" />
              Matched to Me
              <Badge variant="secondary" className="ml-1 bg-[#e2ddd5] text-zinc-600 border-none text-[10px] h-4 px-1.5">{myMatches.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posted" className="space-y-3 mt-0 outline-none">
            {myGigs.length === 0 ? (
              <div className="bg-white border border-[#e2ddd5] border-dashed rounded-2xl p-16 text-center">
                <Briefcase className="w-10 h-10 text-[#c8c2b8] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 mb-2">No gigs posted yet</h3>
                <p className="text-sm text-zinc-500 font-light mb-6">Post your first gig request and start getting matched.</p>
                <Link href="/post">
                  <Button variant="outline" className="border-[#c8c2b8] text-zinc-700 hover:bg-[#ede9e3] rounded-full px-6 h-10 font-medium text-sm">
                    <PlusCircle className="w-4 h-4 mr-2" /> Post a Gig
                  </Button>
                </Link>
              </div>
            ) : (
              myGigs.map((gig, i) => {
                const gigMatchesList = gigMatchesMap[gig.id] ?? [];
                const isExpanded = expandedGig === gig.id;

                return (
                  <motion.div
                    key={gig.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <div className="bg-white border border-[#e2ddd5] rounded-2xl overflow-hidden">
                      <div className="p-5 sm:p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-zinc-900 mb-1 leading-snug">{gig.title}</h3>
                            <p className="text-sm text-zinc-500 line-clamp-2 font-light">{gig.description}</p>
                          </div>
                          <Badge variant="outline" className={`shrink-0 ml-4 text-[10px] font-semibold ${
                            gig.status === 'Open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            gig.status === 'Matched' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-[#f0ece6] text-zinc-600 border-[#e2ddd5]'
                          }`}>
                            {gig.status}
                          </Badge>
                        </div>

                        {gig.matchCount > 0 && (
                          <button
                            onClick={() => toggleExpand(gig.id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-[#92400e] hover:text-[#78350f] transition-colors mt-4 focus:outline-none"
                          >
                            <Users className="w-3.5 h-3.5" />
                            {gig.matchCount} candidate{gig.matchCount !== 1 ? 's' : ''} matched
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>

                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="border-t border-[#f0ece6] p-4 space-y-3 bg-[#faf8f5]"
                        >
                          {gigMatchesList.length === 0 ? (
                            <p className="text-sm text-zinc-400 text-center py-4">Loading candidates...</p>
                          ) : (
                            gigMatchesList.map((match, j) => (
                              <MatchCard
                                key={match.id}
                                match={toMatchCardMatch(match)}
                                index={j}
                                onAccept={handleAccept}
                                onDecline={handleDecline}
                              />
                            ))
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="matched" className="space-y-3 mt-0 outline-none">
            {myMatches.length === 0 ? (
              <div className="bg-white border border-[#e2ddd5] border-dashed rounded-2xl p-16 text-center">
                <Users className="w-10 h-10 text-[#c8c2b8] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 mb-2">No matches yet</h3>
                <p className="text-sm text-zinc-500 font-light">Add more skills to your profile to start receiving matches.</p>
              </div>
            ) : (
              myMatches.map((item, i) => (
                <GigCard
                  key={item.matchId}
                  gig={toGigCardGig(item)}
                  matchScore={item.score}
                  index={i}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
