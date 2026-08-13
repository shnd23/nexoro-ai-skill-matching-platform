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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link
            href={isAuthenticated ? '/feed' : '/'}
            onClick={handleLogoClick}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center">
              <span className="text-[10px] font-black text-white leading-none">N</span>
            </div>
            <span className="font-semibold text-[15px] text-zinc-900 tracking-tight">nexero</span>
          </Link>

          {/* Desktop Nav — center */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm px-3 py-1.5 rounded-md transition-colors",
                      isActive
                        ? "text-zinc-900 bg-[#e2ddd5]"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-[#ede9e3]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {[
                { label: 'For Clients', href: '/#clients' },
                { label: 'For Talent', href: '/#talent' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'How it works', href: '/#how' },
              ].map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm px-3 py-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-[#ede9e3] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-zinc-500">{user?.displayName}</span>
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-zinc-200 text-[10px] font-semibold text-zinc-700">
                    {user ? getInitials(user.displayName) : '?'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="h-8 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-[#ede9e3] px-3 font-medium"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="h-8 text-sm rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-4 font-medium flex items-center justify-center leading-none">
                    Get started
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden h-8 w-8 text-zinc-600"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="md:hidden fixed top-14 left-0 right-0 z-30 bg-[#f7f4f0] border-b border-[#e2ddd5]"
          >
            <div className="px-5 py-5 flex flex-col gap-1">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#e2ddd5]">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-zinc-200 text-xs font-semibold text-zinc-700">
                        {user ? getInitials(user.displayName) : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{user?.displayName}</p>
                      <p className="text-xs text-zinc-500">{user?.email}</p>
                    </div>
                  </div>
                  {NAV_LINKS.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "text-sm px-3 py-2.5 rounded-lg transition-colors",
                        pathname === link.href
                          ? "text-zinc-900 bg-[#e2ddd5] font-medium"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-[#ede9e3]"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="mt-4 text-sm text-left px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="text-sm px-3 py-2.5 text-zinc-700 hover:bg-[#ede9e3] rounded-lg"
                  >
                    Sign in
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="mt-2">
                    <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-full font-medium">
                      Get started
                    </Button>
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
