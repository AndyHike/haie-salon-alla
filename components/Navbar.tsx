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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-ink/90 backdrop-blur-md py-4 shadow-lg shadow-black/50' : 'bg-transparent py-6'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href={`/${locale}`} className="text-2xl font-serif tracking-widest text-gold">
          {settings?.companyName || 'AURA'}
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase items-center">
          <Link href={`/${locale}#services`} className="hover:text-gold transition-colors">{t.services}</Link>
          <Link href={`/${locale}#gallery`} className="hover:text-gold transition-colors">{t.gallery}</Link>
          <Link href={`/${locale}#contact`} className="hover:text-gold transition-colors">{t.contact}</Link>

          {/* Language Switcher */}
          {settings?.availableLocales && settings.availableLocales.length > 0 && (
            <div className="flex gap-4 ml-4 border-l border-white/20 pl-4">
              {settings.availableLocales.map((loc) => (
                <Link 
                  key={loc.code} 
                  href={switchLocale(loc.code)} 
                  className={`${locale === loc.code ? 'text-gold' : 'text-white/50 hover:text-white'} uppercase`}
                >
                  {loc.code}
                </Link>
              ))}
            </div>
          )}
        </div>

        <button className="hidden md:block border border-gold text-gold px-8 py-2.5 rounded-full text-sm uppercase tracking-widest hover:bg-gold hover:text-ink transition-colors">
          {t.book}
        </button>

        <button className="md:hidden text-gold" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-ink border-t border-white/10 px-6 py-4 flex flex-col gap-4"
        >
          <Link href={`/${locale}#services`} onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest hover:text-gold">{t.services}</Link>
          <Link href={`/${locale}#gallery`} onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest hover:text-gold">{t.gallery}</Link>
          <Link href={`/${locale}#contact`} onClick={() => setIsOpen(false)} className="text-sm uppercase tracking-widest hover:text-gold">{t.contact}</Link>
          {settings?.availableLocales && settings.availableLocales.length > 0 && (
            <div className="flex gap-4 mt-2">
              {settings.availableLocales.map((loc) => (
                <Link 
                  key={loc.code} 
                  href={switchLocale(loc.code)} 
                  className={`${locale === loc.code ? 'text-gold' : 'text-white/50'} uppercase`}
                >
                  {loc.code}
                </Link>
              ))}
            </div>
          )}
          <button className="border border-gold text-gold px-6 py-3 rounded-full text-sm uppercase tracking-widest mt-4 w-full hover:bg-gold hover:text-ink transition-colors">
            {t.book}
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
}
