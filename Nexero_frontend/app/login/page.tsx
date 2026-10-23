'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/feed');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] w-full flex items-center justify-center p-4 bg-[#f7f4f0]">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1.5">Welcome back</h1>
          <p className="text-sm text-zinc-500 font-light">Sign in to your Nexero account.</p>
        </div>

        <div className="bg-white border border-[#e2ddd5] rounded-2xl p-7 shadow-sm space-y-5">

          <GoogleSignInButton onError={(msg) => setError(msg)} />

          <div className="flex items-center gap-3">
            <Separator className="flex-1 bg-[#e2ddd5]" />
            <span className="text-xs text-zinc-400 font-medium">or</span>
            <Separator className="flex-1 bg-[#e2ddd5]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-[#faf8f5] border-[#e2ddd5] focus-visible:ring-zinc-900 h-10 rounded-xl text-sm shadow-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-700">Password</label>
              </div>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="bg-[#faf8f5] border-[#e2ddd5] focus-visible:ring-zinc-900 h-10 rounded-xl text-sm shadow-none"
                placeholder="********"
              />
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-10 font-medium text-sm flex items-center justify-center leading-none disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Sign in'}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#92400e] font-semibold hover:text-[#78350f] transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
