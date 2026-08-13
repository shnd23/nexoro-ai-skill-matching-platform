'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Check, Clock, DollarSign, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const CATEGORIES = [
  { name: 'AI & Machine Learning' },
  { name: 'Development & IT' },
  { name: 'Design & Creative' },
  { name: 'Sales & Marketing' },
  { name: 'Writing & Translation' },
  { name: 'Finance & Accounting' },
  { name: 'Admin & Support' },
  { name: 'Engineering' },
];

// Mock feed posts for the social-style product panel
const FEED_POSTS = [
  {
    author: 'Sarah K.',
    initials: 'SK',
    time: '3m ago',
    title: 'Need a React developer for SaaS dashboard',
    desc: 'Looking for someone to build an analytics dashboard with real-time charts and user role management.',
    skills: ['React', 'TypeScript', 'Tailwind'],
    budget: '$2,800',
    match: '96%',
    matchColor: 'bg-emerald-500',
  },
  {
    author: 'Marc L.',
    initials: 'ML',
    time: '12m ago',
    title: 'Product designer for mobile onboarding flow',
    desc: 'Redesign our 3-step onboarding. Figma files provided. ~1 week scope.',
    skills: ['Figma', 'UX', 'Mobile'],
    budget: '$1,200',
    match: '88%',
    matchColor: 'bg-amber-500',
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.push('/feed');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f4f0] text-zinc-900">

      {/* ─── Hero ────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-28 pb-20">
        <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 tracking-hero leading-[1.05] max-w-4xl mx-auto mb-6">
          Where skills meet opportunity — every day.
        </h1>

        <p className="text-lg md:text-xl text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Post what you need. Build your profile. Our AI finds the right match — ranked by skill fit, not just keywords.
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center mb-14">
          <Link href="/register">
            <Button className="h-11 px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm flex items-center justify-center gap-1.5 leading-none">
              Get started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/#how">
            <Button
              variant="outline"
              className="h-11 px-6 rounded-full border-[#c8c2b8] bg-transparent text-zinc-700 hover:bg-[#ede9e3] font-medium text-sm flex items-center justify-center gap-1.5 leading-none"
            >
              How it works <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Describe what you need help with..."
            className="h-12 pl-11 pr-28 rounded-full border-[#c8c2b8] bg-white/70 shadow-sm focus-visible:ring-zinc-900 text-sm"
          />
          <Button className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm px-5 flex items-center justify-center leading-none">
            Search
          </Button>
        </div>
      </section>

      {/* ─── Platform Stats ──────────────────────────────── */}
      <section className="border-y border-[#e2ddd5] bg-[#f0ece6] py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
          {[
            { value: '12,400+', label: 'Active freelancers' },
            { value: '4,800+', label: 'Gigs matched' },
            { value: '92%', label: 'Avg. match accuracy' },
            { value: '<60s', label: 'Time to first match' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${
                i < 3 ? 'md:border-r md:border-[#e2ddd5]' : ''
              }`}
            >
              <p className="text-3xl font-bold text-zinc-900 tracking-tight mb-1">{stat.value}</p>
              <p className="text-xs text-zinc-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Feature 1: Social feed for talent ─────────── */}
      <section id="clients" className="max-w-6xl mx-auto px-4 py-24 w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#92400e] mb-5">For Clients</p>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
              Post a gig. Watch matches roll in.
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8 font-light">
              Describe what you need in plain language. Our SBERT matching engine reads the context, scores every candidate, and surfaces the best fits — not just anyone with a matching tag.
            </p>
            <ul className="space-y-3.5 mb-10">
              {[
                'AI ranks candidates by semantic fit, not keywords',
                'Set your budget and timeframe upfront',
                'Browse detailed skill profiles before connecting',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-600">
                  <Check className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="text-sm font-semibold text-[#92400e] hover:text-[#78350f] inline-flex items-center gap-1.5 transition-colors">
              Post a gig for free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Social-style gig feed panel */}
          <div className="rounded-2xl border border-[#e2ddd5] bg-[#faf8f5] overflow-hidden shadow-sm">
            {/* Window chrome */}
            <div className="bg-[#ede9e3] border-b border-[#e2ddd5] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" />
              </div>
              <span className="text-xs text-zinc-400 mx-auto font-medium">Nexero — Live Matches</span>
            </div>

            <div className="p-5 space-y-3">
              {/* Sidebar label */}
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 mb-1">Incoming matches · right now</p>

              {FEED_POSTS.map((post) => (
                <div key={post.title} className="bg-white rounded-xl border border-[#e8e4de] p-4 shadow-sm">
                  {/* Author row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px] font-bold bg-[#e8e4de] text-zinc-600">{post.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-xs font-semibold text-zinc-900">{post.author}</span>
                        <span className="text-[10px] text-zinc-400 ml-2">{post.time}</span>
                      </div>
                    </div>
                    {/* Match score — this is where the colour lives */}
                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-1 ${post.matchColor}`}>
                      <Zap className="w-2.5 h-2.5" /> {post.match} match
                    </span>
                  </div>

                  {/* Title */}
                  <p className="text-sm font-semibold text-zinc-900 mb-1 leading-snug">{post.title}</p>
                  <p className="text-xs text-zinc-500 mb-3 leading-relaxed">{post.desc}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.skills.map(s => (
                      <span key={s} className="text-[10px] font-medium bg-[#f0ece6] text-zinc-600 px-2 py-0.5 rounded-full border border-[#e2ddd5]">{s}</span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#f0ece6]">
                    <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-zinc-400" />{post.budget}
                    </span>
                    <button className="text-[11px] font-bold text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1 rounded-full transition-colors">
                      Apply →
                    </button>
                  </div>
                </div>
              ))}

              <div className="text-center pt-1">
                <span className="text-[11px] text-zinc-400">+ 24 more matches today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Feature 2: For talent, profile-style ───────── */}
      <section id="talent" className="bg-[#f0ece6] border-y border-[#e2ddd5]">
        <div className="max-w-6xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-16 items-center">
          {/* Profile + notification panel */}
          <div className="rounded-2xl border border-[#e2ddd5] bg-[#faf8f5] overflow-hidden shadow-sm order-last md:order-first">
            <div className="bg-[#ede9e3] border-b border-[#e2ddd5] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" />
              </div>
              <span className="text-xs text-zinc-400 mx-auto font-medium">Nexero — Your Profile</span>
            </div>

            <div className="p-5">
              {/* Tiny profile card */}
              <div className="flex items-center gap-3 bg-white rounded-xl border border-[#e8e4de] p-4 mb-4 shadow-sm">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-zinc-800 text-white text-sm font-bold">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-bold text-zinc-900">Jordan Davies</p>
                  <p className="text-xs text-zinc-500">Full-stack developer · 4.9 ★</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Open to work</span>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl border border-[#e8e4de] p-4 mb-4 shadow-sm">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">Your Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'AWS', 'Docker'].map(s => (
                    <span key={s} className="text-[11px] font-medium bg-[#f0ece6] text-zinc-700 px-2.5 py-1 rounded-full border border-[#e2ddd5]">{s}</span>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-xl border border-[#e8e4de] p-4 shadow-sm">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">New matches · today</p>
                <div className="space-y-2">
                  {[
                    { title: 'Build ETL pipeline (Python)', score: '94%', color: 'text-emerald-600', time: '5m ago' },
                    { title: 'Backend API for mobile app', score: '87%', color: 'text-amber-600', time: '18m ago' },
                    { title: 'DevOps setup on AWS ECS', score: '81%', color: 'text-amber-500', time: '1h ago' },
                  ].map(n => (
                    <div key={n.title} className="flex items-center justify-between text-xs py-1">
                      <span className="text-zinc-700 font-medium truncate mr-2">{n.title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`font-bold ${n.color}`}>{n.score}</span>
                        <span className="text-zinc-400 text-[10px] flex items-center gap-1"><Clock className="w-3 h-3" />{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#92400e] mb-5">For Talent</p>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
              Your skills, working for you — automatically.
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8 font-light">
              Build your profile once. Nexero constantly reads new gig posts and surfaces the ones that genuinely fit your skills — ranked, delivered to your feed, ready to accept.
            </p>
            <ul className="space-y-3.5 mb-10">
              {[
                'Ranked matches land in your feed — no job-board scrolling',
                'Accept or decline a match in one click',
                'Your match quality improves as your profile grows',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-600">
                  <Check className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="text-sm font-semibold text-[#92400e] hover:text-[#78350f] inline-flex items-center gap-1.5 transition-colors">
              Create your profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Categories ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-24 w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 tracking-tight">
          Every type of work, covered.
        </h2>
        <p className="text-zinc-500 mb-10 font-light">From AI to admin — find or post gigs across every discipline.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {CATEGORIES.map(cat => (
            <Link key={cat.name} href="/register">
              <div className="border border-[#e2ddd5] bg-[#f0ece6] hover:bg-[#ede9e3] hover:border-[#c8c2b8] rounded-xl p-5 transition-all duration-150 cursor-pointer group">
                <p className="font-semibold text-zinc-900 text-sm group-hover:text-[#92400e] transition-colors">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── How it works ────────────────────────────── */}
      <section id="how" className="bg-[#f0ece6] border-y border-[#e2ddd5]">
        <div className="max-w-6xl mx-auto px-4 py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 tracking-tight">How it works.</h2>
          <p className="text-zinc-500 mb-16 font-light">Simple. Smart. No friction.</p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                n: '01',
                title: 'Post or join',
                desc: 'Create your account in seconds. Clients post a gig request — freelancers build a skill profile. No lengthy setup.',
              },
              {
                n: '02',
                title: 'AI does the matching',
                desc: 'Our SBERT-powered engine reads your post, computes semantic embeddings, and ranks freelancers by genuine fit — not just tags.',
              },
              {
                n: '03',
                title: 'Connect and work',
                desc: 'Accept a match, start a conversation, and get to work. Posting is always free. You only pay for what you hire.',
              },
            ].map(step => (
              <div key={step.n} className="flex flex-col gap-4">
                <span className="text-xs font-bold text-[#92400e] tabular-nums">{step.n}</span>
                <h3 className="text-xl font-bold text-zinc-900">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─────────────────────────────────── */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-24 w-full">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3 tracking-tight">Choose how you hire.</h2>
          <p className="text-zinc-500 font-light">Flexible options designed to fit any team.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
          {/* Basic */}
          <div className="border border-[#e2ddd5] bg-[#f0ece6] rounded-2xl p-8 flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-zinc-900 mb-1">Basic</h3>
              <p className="text-sm text-zinc-500 mb-8 font-light">For occasional hiring and one-off projects.</p>
              <ul className="space-y-3 mb-10">
                {[
                  'Post up to 3 gigs per month',
                  'AI-ranked candidate matches',
                  'Talent profiles with skill history',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-600">
                    <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/register" className="block mt-auto">
              <Button variant="outline" className="w-full rounded-full h-10 border-zinc-300 text-zinc-900 hover:bg-[#ede9e3] font-medium text-sm flex items-center justify-center leading-none">
                Get started for free
              </Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 border-zinc-900 bg-zinc-900 rounded-2xl p-8 relative flex flex-col">
            <Badge className="absolute top-4 right-4 bg-white text-zinc-900 text-[10px] font-bold rounded-full px-2.5 py-0.5 border-0">
              POPULAR
            </Badge>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
              <p className="text-sm text-zinc-400 mb-8 font-light">For teams with repeat hiring needs.</p>
              <ul className="space-y-3 mb-10">
                {[
                  'Unlimited gig posts',
                  'Priority AI matching & curated shortlists',
                  'Expert-vetted talent access',
                  'Team workspace & shared hiring',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-zinc-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/register" className="block mt-auto">
              <Button className="w-full rounded-full h-10 bg-white hover:bg-zinc-100 text-zinc-900 font-medium text-sm flex items-center justify-center leading-none">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-24 w-full">
        <div className="bg-zinc-900 rounded-3xl px-10 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to find your match?
          </h2>
          <p className="text-zinc-400 mb-8 font-light text-lg max-w-md mx-auto">
            Join thousands of clients and freelancers already using Nexero to get great work done.
          </p>
          <div className="flex items-center gap-3 justify-center flex-wrap">
            <Link href="/register">
              <Button className="h-11 px-7 rounded-full bg-white hover:bg-zinc-100 text-zinc-900 font-medium text-sm flex items-center justify-center gap-1.5 leading-none">
                Get started for free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="h-11 px-7 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 font-medium text-sm flex items-center justify-center gap-1.5 leading-none">
                Sign in <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
