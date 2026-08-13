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
    { label: 'Enterprise', href: '/' },
  ],
  Resources: [
    { label: 'How it works', href: '/#how' },
    { label: 'Help & Support', href: '/' },
    { label: 'Documentation', href: '/' },
    { label: 'Forum', href: '/' },
    { label: 'Status', href: '/' },
  ],
  Company: [
    { label: 'About us', href: '/' },
    { label: 'Careers', href: '/' },
    { label: 'Blog', href: '/' },
    { label: 'Press', href: '/' },
    { label: 'Contact us', href: '/' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/' },
    { label: 'Privacy Policy', href: '/' },
    { label: 'Acceptable Use', href: '/' },
    { label: 'Data Use', href: '/' },
    { label: 'Security', href: '/' },
  ],
  Connect: [
    { label: 'X (Twitter)', href: '/' },
    { label: 'LinkedIn', href: '/' },
    { label: 'GitHub', href: '/' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#ede9e3] border-t border-[#e2ddd5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-14">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-zinc-500 mb-5 tracking-wide">{category}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#d8d2ca]">
          {/* Logo + copyright */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-zinc-900 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-black text-white leading-none">N</span>
            </div>
            <span className="text-sm text-zinc-400">© 2026 Nexero Global LLC</span>
          </div>

          {/* Language */}
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Globe className="w-4 h-4" />
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
