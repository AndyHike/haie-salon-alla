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
    <section id="gallery" className="py-20 md:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-serif text-ink mb-6">{t.title}</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-8"></div>
          <p className="mt-6 text-ink-light max-w-2xl mx-auto font-light text-base md:text-lg">
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
              className={`px-6 py-2.5 rounded-full text-xs md:text-sm tracking-wide transition-all ${
                selectedService === null 
                  ? 'bg-ink text-bg shadow-md' 
                  : 'bg-surface text-ink-light border border-ink/10 hover:border-ink/30 hover:text-ink'
              }`}
            >
              {t.all}
            </button>
            {services.map(service => (
              <button
                key={service}
                onClick={() => setSelectedService(service)}
                className={`px-6 py-2.5 rounded-full text-xs md:text-sm tracking-wide transition-all ${
                  selectedService === service 
                    ? 'bg-ink text-bg shadow-md' 
                    : 'bg-surface text-ink-light border border-ink/10 hover:border-ink/30 hover:text-ink'
                }`}
              >
                {service}
              </button>
            ))}
          </motion.div>
        )}

        <div className="columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
          <AnimatePresence mode="popLayout">
            {displayImages.map((img, idx) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                className="break-inside-avoid relative group overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-500"
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
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-500 flex items-center justify-center">
                  <span className="text-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-serif text-xl border border-bg/50 px-8 py-3 rounded-full bg-ink/20 backdrop-blur-md">
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
            className="mt-16 md:mt-20 text-center"
          >
            <Link href={showAllLink} className="inline-block border border-ink text-ink px-10 py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-ink hover:text-bg transition-colors duration-300">
              {t.showAll}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
