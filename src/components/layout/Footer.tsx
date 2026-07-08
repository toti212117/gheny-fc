import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { asset } from '@/lib/utils';

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#05050a] border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative">
                <Image src={asset("/images/logo.png")} alt="Gheny FC" fill className="object-contain" />
              </div>
              <span className="font-black text-white text-xl">
                GHENY <span className="text-[#e94560]">FC</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Pittsburgh's Sunday League club. Built with passion, driven by the game.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/roster', label: 'Roster' },
                { href: '/matches', label: 'Match History' },
                { href: '/statistics', label: 'Statistics' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 hover:text-[#e94560] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Follow Us</h3>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/ghenyfc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-500 hover:text-[#e94560] transition-colors group"
              >
                <InstagramIcon size={18} />
                <span className="text-sm">@ghenyfc</span>
              </a>
              <a
                href="https://app.teampass.com/PAWest/GPSLO19/Team/137146"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-500 hover:text-[#e94560] transition-colors group"
              >
                <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm">League Page (TeamPass)</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Gheny FC. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs">Season 2026 · GPSLO19 Sunday League</p>
        </div>
      </div>
    </footer>
  );
}
