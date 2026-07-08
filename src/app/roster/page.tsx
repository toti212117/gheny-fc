'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import playersData from '@/data/players.json';
import type { Player } from '@/lib/types';
import { User } from 'lucide-react';

const players = playersData as Player[];

const positionColors: Record<string, string> = {
  Goalkeeper: '#f59e0b',
  Defender: '#3b82f6',
  Midfielder: '#22c55e',
  Forward: '#e94560',
};

export default function RosterPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <span className="text-[#e94560] text-sm font-bold uppercase tracking-widest">Season 2026</span>
          <h1 className="text-5xl font-black text-white mt-2 mb-3">The Squad</h1>
          <p className="text-gray-400">{players.length} players · Gheny FC</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {players.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link href={`/roster/${player.id}`}>
                <div className="bg-[#12121a] border border-white/5 hover:border-[#e94560]/40 rounded-xl overflow-hidden card-glow cursor-pointer group">
                  {/* Photo */}
                  <div className="aspect-square bg-gradient-to-br from-[#16213e] to-[#0a0a0f] flex items-center justify-center relative">
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <User size={40} className="text-white/10" />
                        {player.number && (
                          <span className="text-4xl font-black text-white/20">#{player.number}</span>
                        )}
                      </div>
                    )}
                    {/* Position badge */}
                    <span
                      className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{
                        background: `${positionColors[player.position] ?? '#888'}22`,
                        color: positionColors[player.position] ?? '#888',
                        border: `1px solid ${positionColors[player.position] ?? '#888'}44`,
                      }}
                    >
                      {player.position}
                    </span>
                    {player.number && (
                      <span className="absolute top-2 right-2 text-xs font-black text-white/40">
                        #{player.number}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-white font-bold text-sm leading-tight group-hover:text-[#e94560] transition-colors truncate">
                      {player.name}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 truncate">{player.highestLevel}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
