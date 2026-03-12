'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

import { StoreSettings, GalleryImage } from '@/lib/api';
import Link from 'next/link';

interface GalleryProps {
  images: GalleryImage[];
  locale: string;
  settings: StoreSettings | null;
  limit?: number;
  showAllLink?: string;
}

const fallbackImages = [
  { src: "https://picsum.photos/seed/hair1/600/800", alt: "Hair styling 1", aspect: "aspect-[3/4]" },
  { src: "https://picsum.photos/seed/hair2/600/600", alt: "Hair styling 2", aspect: "aspect-square" },
  { src: "https://picsum.photos/seed/hair3/600/900", alt: "Hair styling 3", aspect: "aspect-[2/3]" },
  { src: "https://picsum.photos/seed/hair4/600/700", alt: "Hair styling 4", aspect: "aspect-[6/7]" },
  { src: "https://picsum.photos/seed/hair5/600/800", alt: "Hair styling 5", aspect: "aspect-[3/4]" },
  { src: "https://picsum.photos/seed/hair6/600/600", alt: "Hair styling 6", aspect: "aspect-square" },
];

export default function Gallery({ images, locale, settings, limit, showAllLink }: GalleryProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const dict = {
    uk: { title: 'Галерея Робіт', desc: 'Натхнення та результати роботи наших майстрів. Кожне волосся — це унікальне полотно.', view: 'Переглянути', showAll: 'Вся галерея', all: 'Всі' },
    cs: { title: 'Galerie Prací', desc: 'Inspirace a výsledky práce našich mistrů. Každé vlasy jsou jedinečné plátno.', view: 'Zobrazit', showAll: 'Celá galerie', all: 'Vše' },
    en: { title: 'Our Gallery', desc: 'Inspiration and results of our masters. Every hair is a unique canvas.', view: 'View', showAll: 'Full Gallery', all: 'All' }
  };
  const t = dict[locale as keyof typeof dict] || dict.uk;
  const defaultLocale = settings?.defaultLocale || 'uk';

  const validImages = images?.filter(img => img && img.filePath && img.filePath.trim() !== '') || [];
  
  // Extract unique services
  const services = Array.from(new Set(validImages.filter(img => img.serviceName).map(img => img.serviceName as string)));

  const filteredImages = selectedService 
    ? validImages.filter(img => img.serviceName === selectedService)
    : validImages;

  let displayImages = filteredImages.length > 0 || validImages.length > 0
    ? filteredImages.map((img, i) => ({ id: img.id, src: img.filePath, alt: img.altText || `Gallery image ${i}`, aspect: i % 2 === 0 ? "aspect-[3/4]" : "aspect-square" }))
    : fallbackImages.map((img, i) => ({ id: `fallback-${i}`, ...img }));

  if (limit) {
    displayImages = displayImages.slice(0, limit);
  }

  return (
    <section id="gallery" className="py-24 bg-ink-light">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gold mb-4">{t.title}</h2>
          <div className="w-24 h-1 bg-gold mx-auto opacity-50 rounded-full"></div>
          <p className="mt-6 text-white/70 max-w-2xl mx-auto font-light">
            {t.desc}
          </p>
        </motion.div>

        {services.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <button
              onClick={() => setSelectedService(null)}
              className={`px-6 py-2 rounded-full text-sm transition-colors border ${
                selectedService === null 
                  ? 'bg-gold text-ink border-gold' 
                  : 'bg-transparent text-white/70 border-white/20 hover:border-gold/50 hover:text-white'
              }`}
            >
              {t.all}
            </button>
            {services.map(service => (
              <button
                key={service}
                onClick={() => setSelectedService(service)}
                className={`px-6 py-2 rounded-full text-sm transition-colors border ${
                  selectedService === service 
                    ? 'bg-gold text-ink border-gold' 
                    : 'bg-transparent text-white/70 border-white/20 hover:border-gold/50 hover:text-white'
                }`}
              >
                {service}
              </button>
            ))}
          </motion.div>
        )}

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {displayImages.map((img, idx) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                className="break-inside-avoid relative group overflow-hidden rounded-3xl shadow-lg shadow-black/20"
              >
              <div className={`relative w-full ${img.aspect}`}>
                {img.src && (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors duration-500 flex items-center justify-center">
                  <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-serif text-xl border border-gold px-8 py-3 rounded-full bg-ink/30 backdrop-blur-sm">
                    {t.view}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {showAllLink && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link href={showAllLink} className="inline-block border border-gold text-gold px-10 py-3.5 rounded-full text-sm uppercase tracking-widest hover:bg-gold hover:text-ink transition-colors">
              {t.showAll}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
