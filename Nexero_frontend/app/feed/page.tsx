'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Zap, Briefcase, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { feed as feedApi, ApiFeedItem } from '@/lib/api';
import { StatsCard } from '@/components/StatsCard';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GigCard } from '@/components/GigCard';

export default function FeedPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [feedItems, setFeedItems] = useState<ApiFeedItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [showCount, setShowCount] = useState(8);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setFetching(true);
    feedApi.get()
      .then(data => setFeedItems(data ?? []))
      .catch(() => setFeedItems([]))
      .finally(() => setFetching(false));
  }, [isAuthenticated]);

  const feedSkills = useMemo(() => {
    const seen = new Map<string, string>();
    feedItems.forEach(item =>
      item.gigRequest.requiredSkills.forEach(s => seen.set(s.id, s.name))
    );
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [feedItems]);

  const suggestedItems = useMemo(
    () => feedItems.filter(i => i.status === 'Suggested').sort((a, b) => b.score - a.score),
    [feedItems]
  );

  const filteredItems = useMemo(() => {
    let items = feedItems;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.gigRequest.title.toLowerCase().includes(q) ||
        item.gigRequest.description.toLowerCase().includes(q) ||
        item.gigRequest.authorName.toLowerCase().includes(q)
      );
    }
    if (selectedSkill !== 'all') {
      items = items.filter(item =>
        item.gigRequest.requiredSkills.some(s => s.id === selectedSkill)
      );
    }
    return items;
  }, [feedItems, searchQuery, selectedSkill]);

  if (isLoading || fetching) {
    return (
      <div className="bg-[#f7f4f0] min-h-[calc(100vh-56px)] w-full">
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-[#e2ddd5] rounded-2xl h-40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const bestScore = suggestedItems[0]?.score;

  return (
    <div className="bg-[#f7f4f0] min-h-[calc(100vh-56px)] w-full">
      <div className="max-w-5xl mx-auto px-4 py-12">

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#92400e] mb-3">Your Feed</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-3">
            Relevant matches, ranked.
          </h1>
          <p className="text-zinc-500 text-lg font-light">
            Opportunities tailored to your skills, sorted by relevance score.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <StatsCard icon={Zap} value={suggestedItems.length} label="Active Matches" color="accent" index={0} />
          <StatsCard icon={Briefcase} value={feedItems.length} label="Available Gigs" color="cyan" index={1} />
          <StatsCard
            icon={TrendingUp}
            value={bestScore !== undefined ? `${Math.round(bestScore * 100)}%` : 'N/A'}
            label="Best Match Score"
            color="emerald"
            index={2}
          />
          <StatsCard icon={Clock} value="Live" label="Match Updates" color="amber" index={3} />
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-0 bg-white border border-[#e2ddd5] rounded-2xl overflow-hidden shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search gigs by title, description, or author..."
              className="pl-11 border-0 shadow-none focus-visible:ring-0 text-sm h-12 bg-transparent"
            />
          </div>
          <div className="w-full sm:w-[200px] border-t sm:border-t-0 sm:border-l border-[#e2ddd5]">
            <Select value={selectedSkill} onValueChange={(val) => setSelectedSkill(val || 'all')}>
              <SelectTrigger className="border-0 shadow-none focus:ring-0 text-sm h-12 bg-transparent">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#e2ddd5]">
                <SelectItem value="all">All Skills</SelectItem>
                {feedSkills.map(skill => (
                  <SelectItem key={skill.id} value={skill.id}>{skill.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white border border-[#e2ddd5] border-dashed rounded-2xl p-16 text-center">
            <Search className="w-10 h-10 text-[#c8c2b8] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-900 mb-2">No gigs found</h3>
            <p className="text-sm text-zinc-500 font-light">
              {searchQuery || selectedSkill !== 'all'
                ? 'Try adjusting your search or filter.'
                : user?.skillsOffered?.length === 0
                  ? 'Add skills to your profile to start receiving matches!'
                  : 'Check back soon for new opportunities!'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredItems.slice(0, showCount).map((item, i) => (
                <GigCard
                  key={item.matchId}
                  gig={{
                    id: item.gigRequest.id,
                    authorId: item.gigRequest.authorId,
                    author: {
                      id: item.gigRequest.authorId,
                      email: '',
                      displayName: item.gigRequest.authorName,
                      bio: '',
                      avatarUrl: '',
                      createdAt: item.gigRequest.createdAt,
                      skillsOffered: [],
                    },
                    title: item.gigRequest.title,
                    description: item.gigRequest.description,
                    status: item.gigRequest.status,
                    budget: item.gigRequest.budget,
                    timeframe: item.gigRequest.timeframe,
                    createdAt: item.gigRequest.createdAt,
                    requiredSkills: item.gigRequest.requiredSkills,
                  }}
                  matchScore={item.status === 'Suggested' ? item.score : undefined}
                  index={i}
                />
              ))}
            </div>

            {showCount < filteredItems.length && (
              <div className="mt-10 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowCount(prev => prev + 8)}
                  className="rounded-full px-8 h-10 font-medium border-[#c8c2b8] text-zinc-700 hover:bg-[#ede9e3] text-sm"
                >
                  Load more ({filteredItems.length - showCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
