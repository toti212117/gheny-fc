import { notFound } from 'next/navigation';
import Link from 'next/link';
import matchesData from '@/data/matches.json';
import type { Match } from '@/lib/types';
import { ArrowLeft, Calendar, MapPin, Target, CircleAlert, Ban } from 'lucide-react';
import Image from 'next/image';

const matches = matchesData as Match[];

export function generateStaticParams() {
  return matches.map(m => ({ id: m.id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MatchReportPage({ params }: Props) {
  const { id } = await params;
  const match = matches.find(m => m.id === id);
  if (!match) notFound();

  const resultLabel = match.result === 'W' ? 'WIN' : match.result === 'D' ? 'DRAW' : 'LOSS';

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/matches" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> All Matches
        </Link>

        <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#e94560]/20 to-transparent border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{match.competition}</p>
              <p className="text-gray-500 text-xs">{match.homeAway} · {match.venue}</p>
            </div>
            <span className={`font-bold px-4 py-1.5 rounded-lg badge-${match.result}`}>
              {resultLabel}
            </span>
          </div>

          {/* Score */}
          <div className="px-6 py-12 text-center">
            <div className="flex items-center justify-center gap-10 sm:gap-20">
              <div className="text-center">
                <div className="w-20 h-20 relative mx-auto mb-3">
                  <Image src="/images/logo.png" alt="Gheny FC" fill className="object-contain drop-shadow-lg" />
                </div>
                <p className="font-bold text-white text-lg">Gheny FC</p>
              </div>
              <div>
                <div className="text-6xl font-black text-white tracking-tight">
                  {match.goalsFor}<span className="text-gray-600 mx-3">–</span>{match.goalsAgainst}
                </div>
                <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider">Full Time</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#1e1e2e] flex items-center justify-center mx-auto mb-3 text-3xl">⚽</div>
                <p className="font-bold text-white text-lg">{match.opponent}</p>
              </div>
            </div>
          </div>

          {/* Match info */}
          <div className="border-t border-white/5 px-6 py-4 flex flex-wrap gap-5 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-[#e94560]" />
              {new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-[#e94560]" />
              {match.venue}
            </span>
          </div>

          {/* Events grid */}
          <div className="border-t border-white/5 px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {match.goalScorers.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                  <Target size={13} className="text-[#e94560]" /> Goal Scorers
                </h3>
                <ul className="space-y-2">
                  {match.goalScorers.map((g, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-white">{g.name}</span>
                      <span className="text-gray-500">{g.minute}'</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {match.assists.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Assists</h3>
                <ul className="space-y-2">
                  {match.assists.map((a, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-white">{a.name}</span>
                      <span className="text-gray-500">{a.minute}'</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {match.yellowCards.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                  <CircleAlert size={13} className="text-yellow-400" /> Yellow Cards
                </h3>
                <ul className="space-y-2">
                  {match.yellowCards.map((y, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-white">{y.name}</span>
                      <span className="text-gray-500">{y.minute}'</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {match.redCards.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
                  <Ban size={13} className="text-red-500" /> Red Cards
                </h3>
                <ul className="space-y-2">
                  {match.redCards.map((r, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-white">{r.name}</span>
                      <span className="text-gray-500">{r.minute}'</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {match.notes && (
            <div className="border-t border-white/5 px-6 py-5">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Match Notes</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{match.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
