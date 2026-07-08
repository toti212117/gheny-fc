'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Trophy, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { asset } from '@/lib/utils';

const slides = [...Array(16)].map((_, i) => asset(`/images/slide-${i + 1}.jpg`));

const INTERVAL = 4000; // 4 seconds per photo

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow */}
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current]}
            alt="Gheny FC"
            fill
            className="object-cover object-center"
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="hero-overlay absolute inset-0" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(233,69,96,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(233,69,96,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#e94560]/10 border border-[#e94560]/30 text-[#e94560] px-4 py-1.5 rounded-full text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#e94560] animate-pulse" />
          GPSLO19 Sunday League · Season 2026
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto w-36 h-36 relative mb-8 drop-shadow-2xl"
        >
          <Image src={asset('/images/logo.png')} alt="Gheny FC Crest" fill className="object-contain" priority />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-white mb-4"
        >
          GHENY <span className="gradient-text">FC</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-gray-400 text-lg sm:text-xl mb-12 max-w-xl mx-auto"
        >
          Pittsburgh's Sunday League. One squad. One goal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/roster"
            className="flex items-center justify-center gap-2 bg-[#e94560] hover:bg-[#c73652] text-white font-bold px-8 py-3.5 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#e94560]/30"
          >
            <Users size={18} /> View Roster
          </Link>
          <Link
            href="/matches"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-3.5 rounded-lg transition-all hover:scale-105"
          >
            <Trophy size={18} /> Latest Match
          </Link>
        </motion.div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-[#e94560]' : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}
