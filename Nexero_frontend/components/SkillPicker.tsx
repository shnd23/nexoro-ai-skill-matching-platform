'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { Skill } from '@/lib/types';
import { skills as skillsApi, ApiSkill } from '@/lib/api';
import { SkillChip } from './SkillChip';

interface SkillPickerProps {
  selected: Skill[];
  onChange: (skills: Skill[]) => void;
  placeholder?: string;
  maxSkills?: number;
}

export function SkillPicker({
  selected,
  onChange,
  placeholder = 'Search skills...',
  maxSkills = 10,
}: SkillPickerProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<ApiSkill[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (q.trim().length < 1) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await skillsApi.search(q);

        setResults(data.filter(s => !selected.some(sel => sel.id === s.id)));
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);
  }, [selected]);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    setIsOpen(true);
    search(q);
  }

  const canCreateNew =
    query.trim().length > 1 &&
    !results.some(s => s.name.toLowerCase() === query.trim().toLowerCase()) &&
    !selected.some(s => s.name.toLowerCase() === query.trim().toLowerCase());

  function addSkill(skill: Skill) {
    if (selected.length >= maxSkills) return;
    onChange([...selected, skill]);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }

  async function createAndAdd() {
    if (!canCreateNew) return;
    try {

      const created = await skillsApi.createOrGet(query.trim());
      addSkill({ id: created.id, name: created.name });
    } catch {

      addSkill({ id: `temp_${Date.now()}`, name: query.trim() });
    }
  }

  function removeSkill(skillId: string) {
    onChange(selected.filter(s => s.id !== skillId));
  }

  const showDropdown = isOpen && (query.trim().length > 0);

  return (
    <div ref={containerRef} className="relative">

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map(skill => (
            <SkillChip
              key={skill.id}
              skill={skill}
              removable
              onRemove={() => removeSkill(skill.id)}
            />
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => { if (query) setIsOpen(true); }}
          placeholder={selected.length >= maxSkills ? `Max ${maxSkills} skills reached` : placeholder}
          disabled={selected.length >= maxSkills}
          className="glass-input w-full pl-11 pr-4 py-3 text-sm disabled:opacity-50"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden shadow-2xl z-20 border border-white/10">
          <div className="max-h-60 overflow-y-auto py-1">
            {isSearching ? (
              <div className="px-4 py-4 text-sm text-slate-500 text-center">
                Searching...
              </div>
            ) : (
              <>
                {results.map(skill => (
                  <button
                    key={skill.id}
                    onClick={() => addSkill({ id: skill.id, name: skill.name })}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent/50" />
                    {skill.name}
                  </button>
                ))}

                {canCreateNew && (
                  <button
                    onClick={createAndAdd}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-cyan-400 hover:bg-cyan-500/10 transition-colors border-t border-white/5 text-left"
                  >
                    <Plus className="w-4 h-4" />
                    Create &ldquo;{query.trim()}&rdquo;
                  </button>
                )}

                {results.length === 0 && !canCreateNew && (
                  <div className="px-4 py-6 text-sm text-slate-500 text-center">
                    No skills found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
