'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getInitials } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/feed', label: 'Find Work' },
  { href: '/post', label: 'Post a Gig' },
  { href: '/gigs', label: 'My Gigs' },
  { href: '/profile', label: 'Profile' },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    const target = isAuthenticated ? '/feed' : '/';
    if (pathname === target) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setMobileOpen(false);
      }
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled
          ? "bg-[#f7f4f0]/90 backdrop-blur-md border-b border-[#e2ddd5]"
          : "bg-[#f7f4f0] border-b border-[#e2ddd5]"
      )}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[72px] flex items-center gap-4">

          <Link
            href={isAuthenticated ? '/feed' : '/'}
            onClick={handleLogoClick}
            className="inline-block no-underline shrink-0 z-50 mt-1"
          >
            <div className="relative inline-block pl-[7px] pr-3 pb-[7px] pt-0.5">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-zinc-900 via-zinc-700 to-zinc-400 rounded-t-[1.5px] rounded-bl-[1.5px] opacity-90"></div>
              <div className="absolute left-0 bottom-0 right-0 h-[3px] bg-gradient-to-r from-zinc-400 to-transparent rounded-r-[1.5px] opacity-90"></div>
              <span className="font-bold text-xl tracking-tight text-zinc-900 leading-none block">Nexero</span>
            </div>
          </Link>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-[14px] font-medium transition-colors px-3 py-1.5 rounded-full",
                      isActive
                        ? "text-zinc-900 bg-zinc-200/60"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40"
                    )}
                    style={{ textDecoration: 'none' }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              {[
                { label: 'For Clients', href: '/#clients' },
                { label: 'For Talent', href: '/#talent' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'How it works', href: '/#how' },
              ].map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-[14px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-1.5 rounded-full hover:bg-zinc-200/40"
                  style={{ textDecoration: 'none' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-[14px] font-medium text-zinc-700">{user?.displayName}</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-zinc-200 text-[11px] font-semibold text-zinc-800">
                    {user ? getInitials(user.displayName) : '?'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <button
                    className="h-[38px] px-5 rounded-full border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 transition-all text-[14px] font-medium shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
                  >
                    Log in
                  </button>
                </Link>
                <Link href="/register" style={{ textDecoration: 'none' }}>
                  <button
                    className="h-[38px] px-5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white transition-all text-[14px] font-medium shadow-[0_2px_6px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                  >
                    Sign up
                  </button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden h-10 w-10 text-zinc-900"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="md:hidden fixed top-[72px] left-0 right-0 z-30 bg-[#f7f4f0] border-b border-[#e2ddd5]"
          >
            <div className="px-5 py-5 flex flex-col gap-1">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#e2ddd5]">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-zinc-200 text-sm font-semibold text-zinc-800">
                        {user ? getInitials(user.displayName) : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[15px] font-semibold text-zinc-900">{user?.displayName}</p>
                      <p className="text-[13px] text-zinc-500">{user?.email}</p>
                    </div>
                  </div>
                  {NAV_LINKS.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "text-[14px] font-medium px-4 py-3 rounded-full transition-colors",
                        pathname === link.href
                          ? "text-zinc-900 bg-zinc-200/60"
                          : "text-zinc-700 hover:bg-zinc-200/40"
                      )}
                      style={{ textDecoration: 'none' }}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="mt-4 text-[14px] font-medium text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="text-[14px] font-medium px-4 py-3 text-zinc-800 hover:bg-zinc-200/40 rounded-full"
                    style={{ textDecoration: 'none' }}
                  >
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="mt-2" style={{ textDecoration: 'none' }}>
                    <button className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full font-medium text-[14px] shadow-sm transition-colors">
                      Sign up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
