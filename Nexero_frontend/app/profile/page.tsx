'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, FileText, Briefcase, Target, TrendingUp, Save, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { users as usersApi, gigs as gigsApi, feed as feedApi } from '@/lib/api';
import { toast } from 'sonner';
import { SkillPicker } from '@/components/SkillPicker';
import { SkillChip } from '@/components/SkillChip';
import { StatsCard } from '@/components/StatsCard';
import { Skill } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [editSkills, setEditSkills] = useState<Skill[]>([]);
  const [saving, setSaving] = useState(false);

  const [myGigsCount, setMyGigsCount] = useState(0);
  const [myMatchesCount, setMyMatchesCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([
      gigsApi.mine().catch(() => []),
      feedApi.get().catch(() => []),
    ]).then(([postedGigs, feedItems]) => {
      setMyGigsCount(postedGigs.length);
      setMyMatchesCount(feedItems.length);
      setAcceptedCount(feedItems.filter(f => f.status === 'Accepted').length);
    });
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setBio(user.bio ?? '');
      setEditSkills(user.skillsOffered.map(us => us.skill));
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="bg-[#f7f4f0] min-h-[calc(100vh-56px)] w-full py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="bg-white border border-[#e2ddd5] rounded-2xl h-48 animate-pulse" />
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-[#e2ddd5] rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {

      await usersApi.update({ bio });

      const currentSkillIds = new Set(user.skillsOffered.map(us => us.skillId));
      const newSkillIds = new Set(editSkills.map(s => s.id));

      const toAdd = editSkills.filter(s => !currentSkillIds.has(s.id));
      const toRemove = user.skillsOffered.filter(us => !newSkillIds.has(us.skillId));

      await Promise.all([
        ...toAdd.map(s => usersApi.addSkill(s.id, 'Intermediate')),
        ...toRemove.map(us => usersApi.removeSkill(us.skillId)),
      ]);

      const updated = await usersApi.me();
      updateUser({
        bio: updated.bio ?? '',
        avatarUrl: updated.avatarUrl ?? '',
        skillsOffered: (updated.skillsOffered ?? []).map(us => ({
          skillId: us.skillId,
          skill: us.skill,
          proficiencyLevel: (us.proficiencyLevel as 'Beginner' | 'Intermediate' | 'Expert') ?? 'Intermediate',
        })),
      });

      setIsEditing(false);
      toast.success('Profile updated!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  }

  const acceptRate = myMatchesCount > 0 ? Math.round((acceptedCount / myMatchesCount) * 100) : 0;

  return (
    <div className="bg-[#f7f4f0] min-h-[calc(100vh-56px)] w-full py-12">
      <div className="max-w-4xl mx-auto px-4">

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#92400e] mb-3">Account</p>
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-2">Your Profile.</h1>
          <p className="text-zinc-500 font-light">Manage your personal details and listed skills.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
          <div className="bg-white border border-[#e2ddd5] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-7 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-7">

                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <Avatar className="h-24 w-24 border-4 border-[#f0ece6]">
                    <AvatarFallback className="bg-[#e8e4de] text-2xl font-bold text-zinc-600">
                      {getInitials(user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#e2ddd5] flex items-center justify-center shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-7">
                    <div className="text-center sm:text-left">
                      <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">{user.displayName}</h2>
                      <p className="text-sm text-zinc-500 flex items-center justify-center sm:justify-start gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> {user.email}
                      </p>
                    </div>
                    <Button
                      variant={isEditing ? 'default' : 'outline'}
                      disabled={saving}
                      onClick={() => {
                        if (isEditing) {
                          handleSave();
                        } else {
                          setBio(user.bio ?? '');
                          setEditSkills(user.skillsOffered.map(us => us.skill));
                          setIsEditing(true);
                        }
                      }}
                      className={isEditing
                        ? "bg-zinc-900 hover:bg-zinc-800 text-white rounded-full font-medium px-5 h-10 text-sm w-full sm:w-auto flex items-center justify-center gap-2 leading-none"
                        : "border-[#c8c2b8] text-zinc-700 rounded-full font-medium px-5 h-10 text-sm w-full sm:w-auto hover:bg-[#ede9e3] flex items-center justify-center leading-none"
                      }
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : isEditing ? (
                        <><Save className="w-3.5 h-3.5" /> Save Changes</>
                      ) : 'Edit Profile'}
                    </Button>
                  </div>

                  <div className="space-y-7">

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 mb-3 uppercase tracking-wider">
                        <FileText className="w-3.5 h-3.5 text-zinc-400" /> Bio
                      </label>
                      {isEditing ? (
                        <Textarea
                          value={bio}
                          onChange={e => setBio(e.target.value)}
                          className="bg-white border-[#e2ddd5] focus-visible:ring-zinc-900 min-h-[100px] resize-y text-sm text-zinc-900 rounded-xl"
                          placeholder="Tell others about yourself and your expertise..."
                          maxLength={500}
                        />
                      ) : (
                        <p className="text-sm text-zinc-600 leading-relaxed font-light">
                          {user.bio || <span className="text-zinc-400 italic">No bio added yet.</span>}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 mb-3 uppercase tracking-wider">
                        <Target className="w-3.5 h-3.5 text-zinc-400" /> Skills Offered
                      </label>
                      {isEditing ? (
                        <div className="bg-white border border-[#e2ddd5] rounded-xl focus-within:ring-1 focus-within:ring-zinc-900 p-1">
                          <SkillPicker selected={editSkills} onChange={setEditSkills} placeholder="Add skills you can offer..." />
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {user.skillsOffered.length > 0 ? (
                            user.skillsOffered.map(us => <SkillChip key={us.skillId} skill={us.skill} />)
                          ) : (
                            <p className="text-sm text-zinc-500 flex items-center gap-2 bg-[#f0ece6] px-4 py-2.5 rounded-xl border border-[#e2ddd5]">
                              <Plus className="w-4 h-4 text-zinc-400" />
                              No skills yet. Edit your profile to add skills.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">Your Stats</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatsCard icon={Briefcase} value={myGigsCount} label="Gigs Posted" color="accent" index={0} />
            <StatsCard icon={Target} value={myMatchesCount} label="Matches Received" color="cyan" index={1} />
            <StatsCard icon={TrendingUp} value={`${acceptRate}%`} label="Accept Rate" color="emerald" index={2} />
            <StatsCard icon={User} value={user.skillsOffered.length} label="Skills Listed" color="amber" index={3} />
          </div>
        </motion.div>

        {isEditing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
              className="text-zinc-500 hover:text-zinc-900 font-medium rounded-full text-sm"
            >
              Cancel editing
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
