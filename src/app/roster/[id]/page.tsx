import { notFound } from 'next/navigation';
import Link from 'next/link';
import playersData from '@/data/players.json';
import type { Player } from '@/lib/types';
import { ArrowLeft, User, Star } from 'lucide-react';

const players = playersData as Player[];

export function generateStaticParams() {
  return players.map(p => ({ id: String(p.id) }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlayerProfilePage({ params }: Props) {
  const { id } = await params;
  const player = players.find(p => p.id === Number(id));
  if (!player) notFound();

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/roster" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Roster
        </Link>

        <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
          {/* Hero */}
          <div className="aspect-video bg-gradient-to-br from-[#16213e] to-[#0b1730] flex items-center justify-center relative">
            {player.photo ? (
              <img src={player.photo} alt={player.name} className="w-full h-full object-cover object-top" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <User size={80} className="text-white/10" />
                {player.number && (
                  <span className="text-7xl font-black text-white/10">#{player.number}</span>
                )}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#12121a] to-transparent h-24" />
          </div>

          {/* Details */}
          <div className="px-6 py-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-black text-white">{player.name}</h1>
                <p className="text-[#e94560] font-medium mt-1">{player.position}</p>
              </div>
              {player.number && (
                <div className="text-5xl font-black text-white/20">#{player.number}</div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0b1730] rounded-xl p-4">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Star size={12} className="text-[#e94560]" /> Highest Level
                </p>
                <p className="text-white font-semibold">{player.highestLevel}</p>
              </div>

              {player.snapchat && player.snapchat !== 'No Snap' && (
                <div className="bg-[#0b1730] rounded-xl p-4">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Snapchat</p>
                  <p className="text-yellow-400 font-semibold">@{player.snapchat}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
