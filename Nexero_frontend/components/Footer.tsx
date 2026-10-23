'use client';

import React from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Find Work', href: '/feed' },
    { label: 'Post a Gig', href: '/post' },
    { label: 'My Gigs', href: '/gigs' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'AI Matching', href: '/#how' },
  ],
  Resources: [
    { label: 'How it works', href: '/#how' },
    { label: 'Help & Support', href: '/' },
    { label: 'Documentation', href: '/' },
    { label: 'Forum', href: '/' },
  ],
  Company: [
    { label: 'About us', href: '/' },
    { label: 'Careers', href: '/' },
    { label: 'Blog', href: '/' },
    { label: 'Press', href: '/' },
    { label: 'Contact', href: '/' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/' },
    { label: 'Privacy Policy', href: '/' },
    { label: 'Acceptable Use', href: '/' },
    { label: 'Data Use', href: '/' },
    { label: 'Security', href: '/' },
  ],
};

const Twitter = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);
const Linkedin = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.603 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const Github = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
);

export function Footer() {
  return (
    <footer className="bg-[#ede9e3] border-t border-[#e2ddd5]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">

        <div className="flex flex-col lg:flex-row gap-16 mb-20">

          <div className="lg:w-[400px] shrink-0">
            <Link href="/" className="inline-block no-underline mb-6">
              <div className="relative inline-block pl-[7px] pr-3 pb-[7px] pt-0.5">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-400 rounded-t-[1.5px] rounded-bl-[1.5px] opacity-90"></div>
              <div className="absolute left-0 bottom-0 right-0 h-[3px] bg-gradient-to-r from-zinc-400 to-transparent rounded-r-[1.5px] opacity-90"></div>
                <span className="font-bold text-[20px] text-black tracking-tight leading-none block">Nexero</span>
              </div>
            </Link>
            <p className="text-sm text-zinc-600 leading-relaxed mb-8 pr-10">
              Nexero is the AI-first freelance network. We connect visionary clients with world-class talent using semantic search and advanced skill embeddings.
            </p>

          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-[13px] font-bold text-zinc-900 mb-5 tracking-wide text-left">{category}</h4>
                <ul className="space-y-3.5 text-left">
                  {links.map(link => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-zinc-600 hover:text-zinc-900 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-[#d8d2ca]">

          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span>© 2026 Nexero Global LLC. All rights reserved.</span>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/" className="text-zinc-500 hover:text-zinc-900 transition-colors"><Twitter /></Link>
            <Link href="/" className="text-zinc-500 hover:text-zinc-900 transition-colors"><Linkedin /></Link>
            <Link href="/" className="text-zinc-500 hover:text-zinc-900 transition-colors"><Github /></Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
