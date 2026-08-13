'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, DollarSign, Clock, Eye, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { gigs as gigsApi } from '@/lib/api';
import { toast } from 'sonner';
import { SkillPicker } from '@/components/SkillPicker';
import { SkillChip } from '@/components/SkillChip';
import { Skill } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function PostGigPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [budget, setBudget] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (skills.length === 0) {
      toast.error('Please add at least one required skill.');
      return;
    }
    setSubmitting(true);
    try {
      await gigsApi.create({
        title,
        description,
        requiredSkillIds: skills.map(s => s.id),
        budget: budget ? Number(budget) : null,
        timeframe: timeframe || null,
      });
      toast.success('Gig posted! Matching engine is finding candidates...');
      setTimeout(() => router.push('/gigs'), 1200);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to post gig. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#f7f4f0] min-h-[calc(100vh-56px)] w-full py-12">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#92400e] mb-3">New Request</p>
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-2">Post a Gig.</h1>
          <p className="text-zinc-500 font-light text-lg">
            Describe what you need and we&apos;ll match you with the right people.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-[#e2ddd5] p-7 rounded-2xl shadow-sm">

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="bg-white border-[#e2ddd5] focus-visible:ring-zinc-900 h-11 text-sm rounded-xl shadow-none"
                  placeholder="e.g., Build a React dashboard for analytics"
                  required
                  maxLength={120}
                />
                <p className="text-xs text-zinc-400 mt-1.5">{title.length}/120 characters</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <Textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="bg-white border-[#e2ddd5] focus-visible:ring-zinc-900 min-h-[150px] resize-y text-sm rounded-xl shadow-none"
                  placeholder="Describe what you need in detail. What's the project about? What should the deliverable look like?"
                  required
                  maxLength={2000}
                />
                <p className="text-xs text-zinc-400 mt-1.5">{description.length}/2000 characters</p>
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Required Skills <span className="text-red-400">*</span>
                </label>
                <div className="bg-white border border-[#e2ddd5] rounded-xl focus-within:ring-1 focus-within:ring-zinc-900 p-1">
                  <SkillPicker
                    selected={skills}
                    onChange={setSkills}
                    placeholder="Search and add required skills..."
                    maxSkills={8}
                  />
                </div>
              </div>

              {/* Budget & Timeframe */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">Budget (optional)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      type="number"
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      className="pl-9 bg-white border-[#e2ddd5] focus-visible:ring-zinc-900 h-11 rounded-xl shadow-none text-sm"
                      placeholder="2500"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">Timeframe (optional)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      type="text"
                      value={timeframe}
                      onChange={e => setTimeframe(e.target.value)}
                      className="pl-9 bg-white border-[#e2ddd5] focus-visible:ring-zinc-900 h-11 rounded-xl shadow-none text-sm"
                      placeholder="2 weeks"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting || !title || !description}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white h-11 rounded-full font-medium mt-2 disabled:opacity-40 flex items-center justify-center gap-2 text-sm leading-none"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Finding matches...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post Gig Request
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Live Preview</span>
              </div>

              <div className="bg-white border border-[#e2ddd5] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-[#e8e4de] text-[10px] font-bold text-zinc-600">
                          {user ? getInitials(user.displayName) : '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-semibold text-zinc-900">{user?.displayName || 'You'}</p>
                        <p className="text-[10px] text-zinc-400">just now</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">Open</Badge>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 mb-1.5 leading-snug">
                    {title || <span className="text-zinc-400 italic font-normal text-sm">Your gig title...</span>}
                  </h3>

                  <p className="text-sm text-zinc-500 leading-relaxed mb-4 line-clamp-3 font-light min-h-[40px]">
                    {description || <span className="text-zinc-400 italic text-xs">Your description will appear here...</span>}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
                    {skills.length > 0 ? (
                      skills.map(skill => <SkillChip key={skill.id} skill={skill} size="sm" />)
                    ) : (
                      <span className="text-xs text-zinc-400 italic">Skills will appear here...</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-3.5 border-t border-[#f0ece6]">
                    {budget && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-zinc-800">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                        ${Number(budget).toLocaleString()}
                      </span>
                    )}
                    {timeframe && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                        <Clock className="w-3 h-3" />{timeframe}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#f0ece6] rounded-xl px-4 py-4 mt-4 border border-[#e2ddd5]">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#92400e] mt-0.5 shrink-0" />
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Once posted, the matching engine scores every candidate by skill overlap and ranks them automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
