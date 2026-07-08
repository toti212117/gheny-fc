'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { asset } from '@/lib/utils';

export default function InstagramSection() {
  return (
    <section className="py-20 px-4 bg-[#05050a]">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 relative mx-auto mb-6">
            <Image src={asset("/images/logo.png")} alt="Gheny FC" fill className="object-contain drop-shadow-2xl" />
          </div>

          <h2 className="text-3xl font-black text-white mb-3">Follow Us on Instagram</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Match photos, behind the scenes, and all things Gheny FC.<br />
            Follow <span className="text-white font-semibold">@ghenyfc</span> to stay up to date.
          </p>

          <a
            href="https://www.instagram.com/ghenyfc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#e94560] to-[#ff6b35] text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-[#e94560]/20 text-base"
          >
            @ghenyfc
            <ExternalLink size={16} className="opacity-70" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
