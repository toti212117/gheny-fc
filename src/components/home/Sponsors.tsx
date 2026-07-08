'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { asset } from '@/lib/utils';

const sponsors = [
  {
    name: "Chipper's Pub",
    logo: asset('/images/sponsor-chippers.png'),
    url: 'https://chipperspubmeadville.com/',
    tagline: 'Official Club Sponsor',
  },
];

export default function Sponsors() {
  return (
    <section className="py-20 px-4 bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1 bg-white/10" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#e94560]">Our Sponsors</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <p className="text-center text-gray-400 text-sm mb-10">
            A huge thank you to our sponsors for making Gheny FC possible.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {sponsors.map((sponsor) => (
              <motion.a
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="group bg-white rounded-2xl px-10 py-8 flex flex-col items-center gap-4 shadow-lg hover:shadow-[#e94560]/20 hover:shadow-2xl transition-shadow cursor-pointer"
              >
                <div className="relative w-52 h-20">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#e94560] opacity-0 group-hover:opacity-100 transition-opacity">
                  {sponsor.tagline}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
