'use client';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { StoreSettings } from '@/lib/api';

export default function Navbar({ locale, settings }: { locale: string, settings: StoreSettings | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    return segments.join('/');
  };

  const dict = {
    uk: { services: 'Послуги', gallery: 'Галерея', contact: 'Контакти', book: 'Записатись' },
    cs: { services: 'Služby', gallery: 'Galerie', contact: 'Kontakt', book: 'Rezervovat' },
    en: { services: 'Services', gallery: 'Gallery', contact: 'Contact', book: 'Book Now' }
  };
  const t = dict[locale as keyof typeof dict] || dict.uk;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled || isOpen ? 'bg-bg/90 backdrop-blur-lg py-4 shadow-sm border-b border-ink/5' : 'bg-transparent py-6'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href={`/${locale}`} className="text-2xl font-serif tracking-widest text-ink">
          {settings?.companyName || 'AURA'}
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase items-center">
          <Link href={`/${locale}#services`} className="text-ink/70 hover:text-ink transition-colors">{t.services}</Link>
          <Link href={`/${locale}#gallery`} className="text-ink/70 hover:text-ink transition-colors">{t.gallery}</Link>
          <Link href={`/${locale}#contact`} className="text-ink/70 hover:text-ink transition-colors">{t.contact}</Link>

          {/* Language Switcher */}
          {settings?.availableLocales && settings.availableLocales.length > 0 && (
            <div className="flex gap-4 ml-4 border-l border-ink/10 pl-4">
              {settings.availableLocales.map((loc) => (
                <Link 
                  key={loc.code} 
                  href={switchLocale(loc.code)} 
                  className={`${locale === loc.code ? 'text-ink' : 'text-ink/50 hover:text-ink'} uppercase`}
                >
                  {loc.code}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="#contact" className="hidden md:block border border-ink text-ink px-8 py-2.5 rounded-full text-sm uppercase tracking-widest hover:bg-ink hover:text-white transition-colors duration-300">
          {t.book}
        </Link>

        <button className="md:hidden text-ink" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-bg border-t border-ink/5 px-6 py-4 flex flex-col gap-4 shadow-lg shadow-ink/5"
        >
          <Link href={`/${locale}#services`} onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest text-ink/80 hover:text-ink">{t.services}</Link>
          <Link href={`/${locale}#gallery`} onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest text-ink/80 hover:text-ink">{t.gallery}</Link>
          <Link href={`/${locale}#contact`} onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest text-ink/80 hover:text-ink">{t.contact}</Link>
          {settings?.availableLocales && settings.availableLocales.length > 0 && (
            <div className="flex gap-4 mt-2">
              {settings.availableLocales.map((loc) => (
                <Link 
                  key={loc.code} 
                  href={switchLocale(loc.code)} 
                  className={`${locale === loc.code ? 'text-ink' : 'text-ink/50'} uppercase`}
                >
                  {loc.code}
                </Link>
              ))}
            </div>
          )}
          <Link href="#contact" onClick={() => setIsOpen(false)} className="block text-center border border-ink text-ink px-6 py-3 rounded-full text-sm uppercase tracking-widest mt-4 w-full hover:bg-ink hover:text-white transition-colors duration-300">
            {t.book}
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
