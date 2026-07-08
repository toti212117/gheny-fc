'use client';

import { motion } from 'framer-motion';
import matchesData from '@/data/matches.json';
import type { Match } from '@/lib/types';
import { computeTeamStats, computePlayerStats, getCurrentStreak } from '@/lib/stats';
import { Trophy, Target, Shield, TrendingUp } from 'lucide-react';

const matches = matchesData as Match[];
const team = computeTeamStats(matches);
const players = computePlayerStats(matches);
const streak = getCurrentStreak(matches);

const cleanSheets = matches.filter(m => m.goalsAgainst === 0).length;
const avgGoals = matches.length > 0 ? (team.goalsFor / matches.length).toFixed(1) : '0.0';
const topScorers = [...players].sort((a, b) => b.goals - a.goals).filter(p => p.goals > 0).slice(0, 3);

export default function StatisticsPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="text-[#e94560] text-sm font-bold uppercase tracking-widest">Season 2026</span>
          <h1 className="text-5xl font-black text-white mt-2 mb-3">Statistics</h1>
        </motion.div>

        {/* Team stat cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          {[
            { icon: Trophy, label: 'Points', value: team.points, color: '#e94560' },
            { icon: TrendingUp, label: 'Win Rate', value: `${team.winPercentage}%`, color: '#22c55e' },
            { icon: Target, label: 'Goals Scored', value: team.goalsFor, color: '#e94560' },
            { icon: Shield, label: 'Clean Sheets', value: cleanSheets, color: '#3b82f6' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#12121a] border border-white/5 rounded-xl p-5 text-center card-glow">
              <stat.icon size={20} className="mx-auto mb-2" style={{ color: stat.color }} />
              <p className="text-3xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Secondary stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-14"
        >
          {[
            { label: 'Played', value: team.played },
            { label: 'Wins', value: team.wins, color: '#22c55e' },
            { label: 'Draws', value: team.draws, color: '#f59e0b' },
            { label: 'Losses', value: team.losses, color: '#ef4444' },
            { label: 'Avg Goals', value: avgGoals, color: '#e94560' },
            { label: 'Streak', value: streak, color: '#a855f7' },
          ].map(s => (
            <div key={s.label} className="bg-[#0a0a0f] border border-white/5 rounded-lg p-3 text-center">
              <p className="text-2xl font-black" style={{ color: s.color ?? '#fff' }}>{s.value}</p>
              <p className="text-gray-600 text-xs">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Top Scorers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Target size={18} className="text-[#e94560]" /> Top Scorers
          </h2>

          <div className="bg-[#12121a] border border-white/5 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 px-5 py-3 border-b border-white/5 text-xs uppercase tracking-wider text-gray-600">
              <span className="col-span-1">#</span>
              <span className="col-span-9">Player</span>
              <span className="col-span-2 text-center">Goals</span>
            </div>

            {topScorers.length > 0 ? (
              topScorers.map((p, i) => (
                <motion.div
                  key={p.playerId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                  className={`grid grid-cols-12 items-center px-5 py-4 ${i > 0 ? 'border-t border-white/5' : ''} hover:bg-white/2 transition-colors`}
                >
                  {/* Rank */}
                  <span className="col-span-1">
                    {i === 0 ? (
                      <span className="text-yellow-400 font-black text-base">🥇</span>
                    ) : i === 1 ? (
                      <span className="text-gray-400 font-black text-base">🥈</span>
                    ) : i === 2 ? (
                      <span className="text-amber-600 font-black text-base">🥉</span>
                    ) : (
                      <span className="text-gray-600 text-sm font-bold">{i + 1}</span>
                    )}
                  </span>

                  {/* Name */}
                  <div className="col-span-9">
                    <p className="text-white font-semibold">{p.name}</p>
                  </div>

                  {/* Goals */}
                  <div className="col-span-2 text-center">
                    <span className="text-[#e94560] font-black text-xl">{p.goals}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-16 text-center">
                <Target size={36} className="text-white/10 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No goals recorded yet.</p>
                <p className="text-gray-600 text-xs mt-1">Goal data is added after each match report.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
