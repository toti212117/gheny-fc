'use client';

import { motion } from 'framer-motion';
import { Match } from '@/lib/types';
import { Calendar, MapPin, Target, CircleAlert } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { asset } from '@/lib/utils';

interface Props {
  match: Match;
}

export default function LatestMatch({ match }: Props) {
  const resultLabel = match.result === 'W' ? 'WIN' : match.result === 'D' ? 'DRAW' : 'LOSS';

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#e94560]">Latest Result</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
            {/* Header bar */}
            <div className="bg-gradient-to-r from-[#e94560]/20 to-transparent border-b border-white/5 px-6 py-3 flex items-center justify-between">
              <span className="text-gray-400 text-sm">{match.competition}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full badge-${match.result}`}>
                {resultLabel}
              </span>
            </div>

            {/* Score */}
            <div className="px-6 py-10 text-center">
              <div className="flex items-center justify-center gap-8 sm:gap-16">
                <div className="text-center">
                  <div className="w-16 h-16 relative mx-auto mb-3">
                    <Image src={asset("/images/logo.png")} alt="Gheny FC" fill className="object-contain drop-shadow-lg" />
                  </div>
                  <p className="font-bold text-white text-lg">Gheny FC</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-white tracking-tight">
                    {match.goalsFor} <span className="text-gray-600 mx-2">—</span> {match.goalsAgainst}
                  </div>
                  <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider">Full Time</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1e1e2e] flex items-center justify-center mx-auto mb-3 text-2xl">⚽</div>
                  <p className="font-bold text-white text-lg">{match.opponent}</p>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="border-t border-white/5 px-6 py-4 flex flex-wrap gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-[#e94560]" />
                {new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-[#e94560]" />
                {match.venue}
              </span>
            </div>

            {/* Events */}
            <div className="border-t border-white/5 px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {match.goalScorers.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                    <Target size={12} className="text-[#e94560]" /> Goal Scorers
                  </p>
                  <ul className="space-y-1">
                    {match.goalScorers.map((g, i) => (
                      <li key={i} className="text-sm text-white">
                        {g.name} <span className="text-gray-500">{g.minute}'</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {match.yellowCards.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                    <CircleAlert size={12} className="text-yellow-400" /> Yellow Cards
                  </p>
                  <ul className="space-y-1">
                    {match.yellowCards.map((y, i) => (
                      <li key={i} className="text-sm text-white">
                        {y.name} <span className="text-gray-500">{y.minute}'</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="border-t border-white/5 px-6 py-4 flex justify-end">
              <Link href={`/matches/${match.id}`} className="text-sm text-[#e94560] hover:underline font-medium">
                Full match report →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
