'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (isAuthenticated) {
    router.push('/feed');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f4f0] text-zinc-900">

      <section className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center text-center px-4 pt-10 pb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight leading-[1.02] max-w-4xl mx-auto mb-6">
          Where skills meet<br />opportunity<br />every day.
        </h1>
        <p className="text-base md:text-lg text-zinc-400 max-w-lg mx-auto mb-8 leading-relaxed font-light">
          Post what you need. Build your profile. Get the right match based on actual skill fit, not just keywords.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center mb-8">
          <Link href="/register">
            <Button className="h-11 px-7 rounded-full bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-sm flex items-center justify-center gap-2 leading-none transition-all duration-200 shadow-sm hover:shadow-md">
              Get started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/#how">
            <Button variant="outline" className="h-11 px-7 rounded-full border-[#c8c2b8] bg-white/50 text-zinc-600 hover:bg-white hover:border-zinc-400 font-medium text-sm flex items-center justify-center gap-2 leading-none transition-all duration-200">
              How it works <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input placeholder="Describe what you need help with..." className="h-12 pl-12 pr-32 rounded-full border-[#c8c2b8] bg-white shadow-sm focus-visible:ring-zinc-900 text-sm" />
          <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 rounded-full bg-zinc-900 hover:bg-zinc-700 text-white text-sm px-5 flex items-center justify-center leading-none font-medium transition-all">
            Search
          </Button>
        </div>
      </section>

      <div ref={statsRef}>
        <section className={"border-y border-[#e2ddd5] bg-[#f0ece6] py-12 px-4 transition-all duration-700 ease-out " + (statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none")}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
            {[
              { value: '12,400+', label: 'Active freelancers' },
              { value: '4,800+', label: 'Gigs matched' },
              { value: '92%', label: 'Avg. match accuracy' },
              { value: '<60s', label: 'Time to first match' },
            ].map((stat, i) => (
              <div key={stat.label} className={"text-center " + (i < 3 ? "md:border-r md:border-[#e2ddd5]" : "")}>
                <p className="text-3xl font-bold text-zinc-900 tracking-tight mb-1">{stat.value}</p>
                <p className="text-xs text-zinc-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section id="clients" className="max-w-6xl mx-auto px-4 py-28 w-full">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#92400e] mb-5">For Clients</p>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight tracking-tight">Post a gig.<br />Watch matches roll in.</h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8 font-light">Describe what you need in plain language. Our SBERT matching engine reads the context, scores every candidate, and surfaces the best fits — not just anyone with a matching tag.</p>
            <ul className="space-y-4 mb-10">
              {['AI ranks candidates by semantic fit, not keywords', 'Set your budget and timeframe upfront', 'Browse detailed skill profiles before connecting'].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-600">
                  <span className="w-5 h-5 rounded-full border border-[#c8c2b8] flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-zinc-500" /></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="text-sm font-semibold text-zinc-900 hover:text-[#92400e] inline-flex items-center gap-2 transition-colors group">
              Post a gig for free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="rounded-2xl border border-[#e2ddd5] bg-[#faf8f5] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            <div className="bg-[#ede9e3] border-b border-[#e2ddd5] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" /><div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" /><div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" /></div>
              <span className="text-xs text-zinc-400 mx-auto font-medium">Nexero — Live Matches</span>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 mb-1">Incoming matches · right now</p>
              {FEED_POSTS.map((post) => (
                <div key={post.title} className="bg-white rounded-xl border border-[#e8e4de] p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-zinc-300 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] font-bold bg-[#e8e4de] text-zinc-600">{post.initials}</AvatarFallback></Avatar>
                      <div><span className="text-xs font-semibold text-zinc-900">{post.author}</span><span className="text-[10px] text-zinc-400 ml-2">{post.time}</span></div>
                    </div>
                    <span className={"text-[10px] font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-1 " + post.matchColor}><Zap className="w-2.5 h-2.5" /> {post.match} match</span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 mb-1 leading-snug">{post.title}</p>
                  <p className="text-xs text-zinc-500 mb-3 leading-relaxed">{post.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">{post.skills.map(s => <span key={s} className="text-[10px] font-medium bg-[#f0ece6] text-zinc-600 px-2 py-0.5 rounded-full border border-[#e2ddd5]">{s}</span>)}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#f0ece6]">
                    <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1"><DollarSign className="w-3 h-3 text-zinc-400" />{post.budget}</span>
                    <button className="text-[11px] font-bold text-white bg-zinc-900 hover:bg-zinc-700 px-3 py-1 rounded-full transition-all group-hover:bg-[#92400e] group-hover:shadow-md">Apply →</button>
                  </div>
                </div>
              ))}
              <div className="text-center pt-1"><span className="text-[11px] text-zinc-400">+ 24 more matches today</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="talent" className="border-y border-[#e2ddd5]">
        <div className="max-w-6xl mx-auto px-4 py-28 grid md:grid-cols-2 gap-20 items-center">
          <div className="rounded-2xl border border-[#e2ddd5] bg-[#faf8f5] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.06)] order-last md:order-first">
            <div className="bg-[#ede9e3] border-b border-[#e2ddd5] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" /><div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" /><div className="w-2.5 h-2.5 rounded-full bg-[#d4b896]" /></div>
              <span className="text-xs text-zinc-400 mx-auto font-medium">Nexero — Your Profile</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 bg-white rounded-xl border border-[#e8e4de] p-4 mb-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-zinc-300 transition-all duration-300 cursor-pointer group">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-zinc-800 text-white text-sm font-bold">JD</AvatarFallback></Avatar>
                <div className="flex-1"><p className="text-sm font-bold text-zinc-900">Jordan Davies</p><p className="text-xs text-zinc-500">Full-stack developer · 4.9 ★</p></div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Open to work</span>
              </div>
              <div className="bg-white rounded-xl border border-[#e8e4de] p-4 mb-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-zinc-300 transition-all duration-300 cursor-pointer">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">Your Skills</p>
                <div className="flex flex-wrap gap-1.5">{['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'AWS', 'Docker'].map(s => <span key={s} className="text-[11px] font-medium bg-[#f0ece6] text-zinc-700 px-2.5 py-1 rounded-full border border-[#e2ddd5]">{s}</span>)}</div>
              </div>
              <div className="bg-white rounded-xl border border-[#e8e4de] p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-zinc-300 transition-all duration-300 cursor-pointer">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">New matches · today</p>
                <div className="space-y-2">
                  {[
                    { title: 'Build ETL pipeline (Python)', score: '94%', color: 'text-emerald-600', time: '5m ago' },
                    { title: 'Backend API for mobile app', score: '87%', color: 'text-amber-600', time: '18m ago' },
                    { title: 'DevOps setup on AWS ECS', score: '81%', color: 'text-amber-500', time: '1h ago' },
                  ].map(n => (
                    <div key={n.title} className="flex items-center justify-between text-xs py-1.5 px-2 -mx-2 rounded-lg hover:bg-zinc-50 transition-colors">
                      <span className="text-zinc-700 font-medium truncate mr-2">{n.title}</span>
                      <div className="flex items-center gap-2 shrink-0"><span className={"font-bold " + n.color}>{n.score}</span><span className="text-zinc-400 text-[10px] flex items-center gap-1"><Clock className="w-3 h-3" />{n.time}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#92400e] mb-5">For Talent</p>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight tracking-tight">Your skills, working<br />for you — automatically.</h2>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8 font-light">Build your profile once. Nexero constantly reads new gig posts and surfaces the ones that genuinely fit your skills — ranked, delivered to your feed, ready to accept.</p>
            <ul className="space-y-4 mb-10">
              {['Ranked matches land in your feed — no job-board scrolling', 'Accept or decline a match in one click', 'Your match quality improves as your profile grows'].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-600">
                  <span className="w-5 h-5 rounded-full border border-[#c8c2b8] flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-zinc-500" /></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="text-sm font-semibold text-zinc-900 hover:text-[#92400e] inline-flex items-center gap-2 transition-colors group">
              Create your profile <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-28 w-full">
        <div className="mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-4">Browse by category</p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-tight mb-3">Every type of work, covered.</h2>
          <p className="text-zinc-400 font-light text-lg">From AI to admin — find or post gigs across every discipline.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {CATEGORIES.map(cat => (
            <Link key={cat.name} href="/register" className="group block h-full">
              <div className="bg-[#fcfbf9] border border-[#e2ddd5] rounded-2xl p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-zinc-400 transition-all duration-300 h-full flex flex-col justify-between min-h-[140px]">
                <p className="font-semibold text-zinc-900 text-[15px]">{cat.name}</p>
                <div className="w-8 h-8 rounded-full border border-[#e2ddd5] flex items-center justify-center group-hover:bg-zinc-900 group-hover:border-zinc-900 transition-colors mt-4">
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="how" className="border-t border-[#e2ddd5]">
        <div className="max-w-6xl mx-auto px-4 py-28">
          <div className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-4">The process</p>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-3">How it works.</h2>
            <p className="text-zinc-400 font-light text-lg">Simple. Smart. No friction.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-[#e2ddd5] border border-[#e2ddd5] rounded-2xl overflow-hidden">
            {[
              { n: '01', title: 'Post or join', desc: 'Create your account in seconds. Clients post a gig request — freelancers build a skill profile. No lengthy setup.' },
              { n: '02', title: 'AI does the matching', desc: 'Our SBERT-powered engine reads your post, computes semantic embeddings, and ranks freelancers by genuine fit — not just tags.' },
              { n: '03', title: 'Connect and work', desc: 'Accept a match, start a conversation, and get to work. Posting is always free. You only pay for what you hire.' },
            ].map(step => (
              <div key={step.n} className="bg-[#f7f4f0] px-8 py-10 flex flex-col gap-5 hover:bg-[#f0ece6] transition-colors">
                <span className="text-xs font-bold text-[#92400e] tabular-nums">{step.n}</span>
                <div><h3 className="text-xl font-bold text-zinc-900 mb-3">{step.title}</h3><p className="text-sm text-zinc-500 leading-relaxed font-light">{step.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-t border-[#e2ddd5]">
        <div className="max-w-6xl mx-auto px-4 py-28 w-full">
          <div className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-3">Choose how you hire.</h2>
            <p className="text-zinc-400 font-light text-lg">Flexible options designed to fit any team.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 items-stretch">

            <div className="border border-[#e2ddd5] bg-[#f7f4f0] rounded-2xl p-8 flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-zinc-800 transition-all duration-300">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-zinc-900 mb-1">Basic</h3>
                <p className="text-sm text-zinc-400 mb-8 font-light">For occasional hiring and one-off projects.</p>
                <ul className="space-y-3.5 mb-10">
                  {['Post up to 3 gigs per month', 'AI-ranked candidate matches', 'Talent profiles with skill history'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-600">
                      <span className="w-4 h-4 rounded-full border border-[#c8c2b8] flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-zinc-500" /></span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register" className="block mt-auto">
                <Button variant="outline" className="w-full rounded-full h-11 border-[#c8c2b8] text-zinc-900 hover:bg-[#ede9e3] font-semibold text-sm flex items-center justify-center leading-none transition-all">Get started for free</Button>
              </Link>
            </div>

            <div className="border border-[#e8d6ce] bg-[#f0e4df] rounded-2xl p-8 flex flex-col relative shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-[#b88c7a] transition-all duration-300 z-10">
              <Badge className="absolute top-5 right-5 bg-[#92400e]/10 text-[#92400e] text-[10px] font-bold rounded-full px-2.5 py-0.5 border-0 tracking-widest">POPULAR</Badge>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-zinc-900 mb-1">Plus</h3>
                <p className="text-sm text-zinc-400 mb-8 font-light">For growing businesses and active hiring.</p>
                <ul className="space-y-3.5 mb-10">
                  {['Post up to 15 gigs per month', 'Priority AI matching', 'Expert-vetted talent access', 'Advanced analytics dashboard'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-600">
                      <span className="w-4 h-4 rounded-full border border-[#c8c2b8] flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-zinc-500" /></span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register" className="block mt-auto">
                <Button className="w-full rounded-full h-11 bg-zinc-800 text-white hover:bg-zinc-700 font-semibold text-sm flex items-center justify-center leading-none transition-all">Get started</Button>
              </Link>
            </div>

            <div className="border-2 border-zinc-900 bg-zinc-900 rounded-2xl p-8 relative flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-zinc-600 transition-all duration-300">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
                <p className="text-sm text-zinc-400 mb-8 font-light">For teams with repeat hiring needs.</p>
                <ul className="space-y-3.5 mb-10">
                  {['Unlimited gig posts', 'Priority AI matching & curated shortlists', 'Expert-vetted talent access', 'Team workspace & shared hiring'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                      <span className="w-4 h-4 rounded-full border border-zinc-600 flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-zinc-400" /></span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/register" className="block mt-auto">
                <Button className="w-full rounded-full h-11 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-sm flex items-center justify-center leading-none transition-all">Get started</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-28 pt-4 w-full">
        <div className="bg-zinc-900 rounded-3xl px-10 py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 mb-5">Get started today</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">Ready to find<br />your match?</h2>
            <p className="text-zinc-400 mb-10 font-light text-lg max-w-md mx-auto">Join thousands of clients and freelancers already using Nexero to get great work done.</p>
            <div className="flex items-center gap-3 justify-center flex-wrap">
              <Link href="/register"><Button className="h-12 px-8 rounded-full bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-sm flex items-center justify-center gap-2 leading-none transition-all">Get started for free <ArrowRight className="w-4 h-4" /></Button></Link>
              <Link href="/login"><Button variant="ghost" className="h-12 px-8 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 font-medium text-sm flex items-center justify-center gap-2 leading-none transition-all">Sign in <ArrowRight className="w-4 h-4" /></Button></Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
