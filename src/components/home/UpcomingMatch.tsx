'use client';

import { motion } from 'framer-motion';
import { UpcomingMatch as IUpcomingMatch } from '@/lib/types';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import { asset } from '@/lib/utils';

interface Props {
  match: IUpcomingMatch;
}

export default function UpcomingMatch({ match }: Props) {
  const matchDate = new Date(match.date);
  const now = new Date();
  const diff = matchDate.getTime() - now.getTime();
  const daysUntil = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return (
    <section className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1 bg-white/10" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#e94560]">Next Match</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="bg-gradient-to-br from-[#16213e] to-[#0a0a0f] border border-[#e94560]/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e94560]/5 rounded-full -translate-y-32 translate-x-32" />

            {daysUntil > 0 && (
              <div className="inline-flex items-center gap-2 bg-[#e94560]/10 border border-[#e94560]/20 text-[#e94560] px-3 py-1 rounded-full text-xs font-bold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e94560] animate-pulse" />
                {daysUntil === 1 ? 'TOMORROW' : `IN ${daysUntil} DAYS`}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 relative">
              <div className="text-center">
                <div className="w-20 h-20 relative mx-auto mb-3">
                  <Image src={asset("/images/logo.png")} alt="Gheny FC" fill className="object-contain drop-shadow-lg" />
                </div>
                <p className="font-bold text-white">Gheny FC</p>
              </div>

              <div className="text-center flex-1">
                <p className="text-4xl font-black text-white/20 tracking-widest">VS</p>
                <p className="text-gray-400 text-sm mt-1">{match.competition ?? 'GPSLO19 Regular Season'}</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#1e1e2e] flex items-center justify-center mx-auto mb-3 text-3xl">⚽</div>
                <p className="font-bold text-white">{match.opponent}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-[#e94560]" />
                {matchDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-[#e94560]" />
                {match.kickoffTime}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-[#e94560]" />
                {match.venue} ({match.homeAway})
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
