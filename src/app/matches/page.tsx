'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import matchesData from '@/data/matches.json';
import fixturesData from '@/data/fixtures.json';
import type { Match, UpcomingMatch } from '@/lib/types';
import { Calendar, MapPin, Clock, Lock } from 'lucide-react';

const played = (matchesData as Match[]).sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);
const fixtures = fixturesData as UpcomingMatch[];

// Merge into one full chronological schedule
type ScheduleEntry =
  | { kind: 'played'; match: Match }
  | { kind: 'fixture'; fixture: UpcomingMatch };

const schedule: ScheduleEntry[] = [
  ...played.map(m => ({ kind: 'played' as const, match: m })),
  ...fixtures.map(f => ({ kind: 'fixture' as const, fixture: f })),
].sort((a, b) => {
  const dateA = a.kind === 'played' ? a.match.date : a.fixture.date;
  const dateB = b.kind === 'played' ? b.match.date : b.fixture.date;
  return new Date(dateA).getTime() - new Date(dateB).getTime();
});

const today = new Date().toISOString().split('T')[0];

export default function MatchesPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="text-[#e94560] text-sm font-bold uppercase tracking-widest">Season 2026</span>
          <h1 className="text-5xl font-black text-white mt-2 mb-3">Full Schedule</h1>
          <p className="text-gray-400">{played.length} played · {fixtures.length} remaining · {schedule.length} total</p>
        </motion.div>

        <div className="space-y-3">
          {schedule.map((entry, i) => {
            if (entry.kind === 'played') {
              const m = entry.match;
              const isNext = false;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/matches/${m.id}`}>
                    <div className="bg-[#12121a] border border-white/5 hover:border-[#e94560]/30 rounded-xl overflow-hidden card-glow cursor-pointer">
                      <div className="px-5 py-4 flex items-center gap-4">
                        {/* Game number */}
                        <span className="text-gray-600 text-xs font-bold w-6 shrink-0">#{i + 1}</span>

                        {/* Result badge */}
                        <span className={`text-xs font-bold px-2.5 py-1 rounded badge-${m.result} shrink-0 w-14 text-center`}>
                          {m.result === 'W' ? 'WIN' : m.result === 'D' ? 'DRAW' : 'LOSS'}
                        </span>

                        {/* Opponent + meta */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold truncate">
                            {m.homeAway === 'Away' ? '@ ' : 'vs '}{m.opponent}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-0.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={10} className="text-[#e94560]" />
                              {new Date(m.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={10} className="text-[#e94560]" />
                              {m.kickoffTime}
                            </span>
                            <span className="hidden sm:flex items-center gap-1">
                              <MapPin size={10} className="text-[#e94560]" />
                              {m.venue}
                            </span>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right shrink-0">
                          <p className="text-white font-black text-xl">{m.goalsFor} – {m.goalsAgainst}</p>
                        </div>
                      </div>

                      {m.goalScorers.length > 0 && (
                        <div className="border-t border-white/5 px-5 py-2">
                          <p className="text-gray-500 text-xs">
                            ⚽ {m.goalScorers.map(g => `${g.name} ${g.minute}'`).join(' · ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            }

            // Upcoming fixture
            const f = entry.fixture;
            const isNextMatch = f.date === fixtures[0]?.date;
            return (
              <motion.div
                key={`fixture-${f.date}-${f.opponent}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`rounded-xl overflow-hidden border ${isNextMatch ? 'border-[#e94560]/30 bg-[#16213e]/60' : 'border-white/5 bg-[#0d0d14]'}`}>
                  <div className="px-5 py-4 flex items-center gap-4">
                    <span className="text-gray-600 text-xs font-bold w-6 shrink-0">#{i + 1}</span>

                    <div className="flex items-center gap-2 shrink-0">
                      {isNextMatch ? (
                        <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#e94560]/10 text-[#e94560] border border-[#e94560]/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e94560] animate-pulse inline-block" />
                          NEXT
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2.5 py-1 rounded bg-white/5 text-gray-500 border border-white/5 w-14 text-center flex items-center justify-center gap-1">
                          <Lock size={9} /> TBD
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">
                        {f.homeAway === 'Away' ? '@ ' : 'vs '}{f.opponent}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-0.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} className="text-[#e94560]" />
                          {new Date(f.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} className="text-[#e94560]" />
                          {f.kickoffTime}
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                          <MapPin size={10} className="text-[#e94560]" />
                          {f.venue}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-gray-600 font-black text-xl">– : –</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
