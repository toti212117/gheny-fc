'use client';

import { motion } from 'framer-motion';
import { TeamStats as ITeamStats } from '@/lib/types';

interface Props {
  stats: ITeamStats;
}

const statCards = (s: ITeamStats) => [
  { label: 'Played', value: s.played },
  { label: 'Wins', value: s.wins, color: '#22c55e' },
  { label: 'Draws', value: s.draws, color: '#f59e0b' },
  { label: 'Losses', value: s.losses, color: '#ef4444' },
  { label: 'Goals For', value: s.goalsFor, color: '#e94560' },
  { label: 'Goals Against', value: s.goalsAgainst },
  { label: 'Goal Diff', value: s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference, color: s.goalDifference >= 0 ? '#22c55e' : '#ef4444' },
  { label: 'Points', value: s.points, color: '#e94560' },
  { label: 'Win Rate', value: `${s.winPercentage}%`, color: '#e94560' },
];

export default function TeamStats({ stats }: Props) {
  return (
    <section className="py-20 px-4 bg-[#05050a]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1 bg-white/10" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#e94560]">Season Statistics</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {statCards(stats).map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-[#12121a] border border-white/5 rounded-xl p-4 text-center card-glow"
              >
                <p
                  className="text-3xl font-black mb-1"
                  style={{ color: card.color ?? '#ffffff' }}
                >
                  {card.value}
                </p>
                <p className="text-gray-500 text-xs uppercase tracking-wide">{card.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
