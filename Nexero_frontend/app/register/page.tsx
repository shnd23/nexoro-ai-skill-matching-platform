'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';



export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, name); // throws on failure
      router.push('/feed');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] w-full flex items-center justify-center p-4 bg-[#f7f4f0]">
      <div className="w-full max-w-sm">

        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 mb-5">
            <span className="text-sm font-black text-white leading-none">N</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1.5">Create your account</h1>
          <p className="text-sm text-zinc-500 font-light">Join Nexero to find your perfect gig match.</p>
        </div>

        <div className="bg-white border border-[#e2ddd5] rounded-2xl p-7 shadow-sm space-y-5">

          {/* Google Sign-In */}
          <GoogleSignInButton onError={(msg) => setError(msg)} />

          <div className="flex items-center gap-3">
            <Separator className="flex-1 bg-[#e2ddd5]" />
            <span className="text-xs text-zinc-400 font-medium">or</span>
            <Separator className="flex-1 bg-[#e2ddd5]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Full Name</label>
              <Input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="bg-[#faf8f5] border-[#e2ddd5] focus-visible:ring-zinc-900 h-10 rounded-xl text-sm shadow-none"
                placeholder="Alex Mercer"
              />
            </div>
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
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Password</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="bg-[#faf8f5] border-[#e2ddd5] focus-visible:ring-zinc-900 h-10 rounded-xl text-sm shadow-none"
                placeholder="••••••••"
              />
              <p className="text-[11px] text-zinc-400 mt-1.5">Minimum 8 characters.</p>
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-10 font-medium text-sm flex items-center justify-center leading-none disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Create account'}
            </Button>
          </form>

          <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/" className="text-zinc-600 hover:text-zinc-900 underline underline-offset-2">Terms</Link>{' '}
            and{' '}
            <Link href="/" className="text-zinc-600 hover:text-zinc-900 underline underline-offset-2">Privacy Policy</Link>.
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="text-[#92400e] font-semibold hover:text-[#78350f] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
