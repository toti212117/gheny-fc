'use client';

import { motion } from 'framer-motion';
import { Match } from '@/lib/types';
import Link from 'next/link';

interface Props {
  matches: Match[];
}

export default function RecentResults({ matches }: Props) {
  const recent = matches.slice(0, 5);

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1 bg-white/10" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#e94560]">Recent Results</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="space-y-3">
            {recent.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link href={`/matches/${match.id}`}>
                  <div className="bg-[#12121a] border border-white/5 hover:border-[#e94560]/30 rounded-xl px-5 py-4 flex items-center gap-4 transition-all card-glow cursor-pointer">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded badge-${match.result} shrink-0 w-12 text-center`}>
                      {match.result === 'W' ? 'WIN' : match.result === 'D' ? 'DRW' : 'LSS'}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">vs {match.opponent}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {match.goalScorers.map(g => g.name).join(', ') || 'No scorers'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-white font-black text-lg">
                        {match.goalsFor} – {match.goalsAgainst}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/matches"
              className="inline-flex items-center gap-2 text-[#e94560] border border-[#e94560]/30 hover:bg-[#e94560]/10 px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
            >
              View All Matches →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
