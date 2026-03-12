'use client';
import { motion } from 'motion/react';
import Image from 'next/image';

import { StoreSettings } from '@/lib/api';

export default function Hero({ locale, settings }: { locale: string, settings: StoreSettings | null }) {
  const dict = {
    uk: { title: 'Мистецтво', title2: 'Вашого Волосся', desc: 'Довірте свою красу професіоналам. Сучасні техніки фарбування, авторські стрижки та преміальний догляд у самому серці міста.', btn: 'Забронювати візит' },
    cs: { title: 'Umění', title2: 'Vašich Vlasů', desc: 'Svěřte svou krásu profesionálům. Moderní techniky barvení, autorské střihy a prémiová péče v samém srdci města.', btn: 'Rezervovat návštěvu' },
    en: { title: 'The Art of', title2: 'Your Hair', desc: 'Trust your beauty to professionals. Modern coloring techniques, signature haircuts, and premium care in the heart of the city.', btn: 'Book a visit' }
  };
  const t = dict[locale as keyof typeof dict] || dict.uk;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1920&auto=format&fit=crop"
          alt="Aura Salon"
          fill
          className="object-cover opacity-40"
          referrerPolicy="no-referrer"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/60 to-ink"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-gold mb-6 leading-tight"
        >
          {t.title} <br className="md:hidden" /> {t.title2}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light"
        >
          {t.desc}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button className="bg-gold text-ink px-10 py-4 rounded-full text-sm md:text-base uppercase tracking-widest font-semibold hover:bg-white hover:text-ink transition-colors duration-300 shadow-lg shadow-gold/20">
            {t.btn}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
