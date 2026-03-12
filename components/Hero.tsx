'use client';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import { StoreSettings } from '@/lib/api';

export default function Hero({ locale, settings }: { locale: string, settings: StoreSettings | null }) {
  const dict = {
    uk: { title: 'Мистецтво', title2: 'Вашого Волосся', desc: 'Довірте свою красу професіоналам. Сучасні техніки фарбування, авторські стрижки та преміальний догляд у самому серці міста.', btn: 'Забронювати візит' },
    cs: { title: 'Umění', title2: 'Vašich Vlasů', desc: 'Svěřte svou krásu profesionálům. Moderní techniky barvení, autorské střihy a prémiová péče v samém srdci města.', btn: 'Rezervovat návštěvu' },
    en: { title: 'The Art of', title2: 'Your Hair', desc: 'Trust your beauty to professionals. Modern coloring techniques, signature haircuts, and premium care in the heart of the city.', btn: 'Book a visit' }
  };
  const t = dict[locale as keyof typeof dict] || dict.uk;

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-bg">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=2072&auto=format&fit=crop"
          alt="Aura Salon Interior"
          fill
          className="object-cover opacity-70"
          referrerPolicy="no-referrer"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/40 to-bg"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-[6.5rem] font-serif text-ink mb-6 leading-[1.1] tracking-tight"
        >
          {t.title} <br className="hidden md:block" /> <span className="text-gold italic font-light">{t.title2}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-ink-light mb-10 max-w-2xl mx-auto font-light leading-relaxed"
        >
          {t.desc}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="#contact" className="inline-block bg-ink text-white px-10 py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-gold hover:text-white border border-transparent transition-all duration-300 shadow-xl shadow-ink/10">
            {t.btn}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
