'use client';
import { motion } from 'motion/react';
import { Item, StoreSettings } from '@/lib/api';
import Link from 'next/link';

interface ServiceGroup {
  id: string;
  title: any;
  items: Item[];
}

interface ServicesProps {
  groups: ServiceGroup[];
  locale: string;
  settings: StoreSettings | null;
  limitGroups?: number;
  limitItemsPerGroup?: number;
  showAllLink?: string;
}

const fallbackServices = [
  {
    category: "Стрижки та Укладки",
    items: [
      { name: "Жіноча стрижка", desc: "Миття, стрижка, сушка за формою", price: "від 800 ₴" },
      { name: "Укладка вечірня", desc: "Створення локонів, текстурні зачіски", price: "від 1200 ₴" },
      { name: "Стрижка кінчиків", desc: "Рівний зріз машинкою або ножицями", price: "400 ₴" },
    ]
  },
  {
    category: "Фарбування",
    items: [
      { name: "Фарбування в один тон", desc: "Фарбування коренів або всієї довжини", price: "від 1500 ₴" },
      { name: "Складне фарбування", desc: "Airtouch, Balayage, Shatush", price: "від 3500 ₴" },
      { name: "Тонування", desc: "Надання відтінку та блиску волоссю", price: "від 1000 ₴" },
    ]
  },
  {
    category: "Догляд",
    items: [
      { name: "Глибоке відновлення", desc: "Процедура реконструкції пошкодженого волосся", price: "від 1500 ₴" },
      { name: "Кератинове вирівнювання", desc: "Ідеально рівне та блискуче волосся", price: "від 2500 ₴" },
      { name: "Спа-догляд для шкіри голови", desc: "Пілінг та зволоження", price: "800 ₴" },
    ]
  }
];

export default function Services({ groups, locale, settings, limitGroups, limitItemsPerGroup, showAllLink }: ServicesProps) {
  const dict = {
    uk: { title: 'Наші Послуги', showAll: 'Всі послуги' },
    cs: { title: 'Naše Služby', showAll: 'Všechny služby' },
    en: { title: 'Our Services', showAll: 'All Services' }
  };
  const t = dict[locale as keyof typeof dict] || dict.uk;
  const defaultLocale = settings?.defaultLocale || 'uk';

  const displayGroups = limitGroups ? groups?.slice(0, limitGroups) : groups;

  return (
    <section id="services" className="py-24 bg-ink relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gold mb-4">{t.title}</h2>
          <div className="w-24 h-1 bg-gold mx-auto opacity-50 rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 gap-16">
          {displayGroups && displayGroups.length > 0 ? (
            displayGroups.map((group, groupIdx) => {
              const displayItems = limitItemsPerGroup ? group.items.slice(0, limitItemsPerGroup) : group.items;
              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: groupIdx * 0.2 }}
                  className="w-full"
                >
                  {displayGroups.length > 1 && (
                    <h3 className="text-2xl font-serif text-white mb-8 uppercase tracking-wider border-b border-white/10 pb-4">
                      {group.title?.[locale] || group.title?.[defaultLocale] || group.title?.['en'] || 'Послуги'}
                    </h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-8">
                    {displayItems.map((item) => (
                      <div key={item.id} className="group bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-gold/30 transition-colors">
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-lg text-gold font-medium pr-4">{item.title?.[locale] || item.title?.[defaultLocale] || item.title?.['en'] || 'Послуга'}</h4>
                          <div className="flex-grow border-b border-dotted border-white/20 relative top-[-6px] group-hover:border-gold/50 transition-colors hidden sm:block"></div>
                          <span className="text-lg text-white whitespace-nowrap pl-4">{item.price ? `${item.price} ₴` : ''}</span>
                        </div>
                        <p className="text-sm text-white/60 font-light">{item.description?.[locale] || item.description?.[defaultLocale] || item.description?.['en'] || ''}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 gap-16 w-full">
              {fallbackServices.slice(0, limitGroups || fallbackServices.length).map((section, idx) => {
                const displayItems = limitItemsPerGroup ? section.items.slice(0, limitItemsPerGroup) : section.items;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="w-full"
                  >
                    <h3 className="text-2xl font-serif text-white mb-8 uppercase tracking-wider border-b border-white/10 pb-4">{section.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-16 gap-y-8">
                      {displayItems.map((item, i) => (
                        <div key={i} className="group bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-gold/30 transition-colors">
                          <div className="flex justify-between items-baseline mb-2">
                            <h4 className="text-lg text-gold font-medium pr-4">{item.name}</h4>
                            <div className="flex-grow border-b border-dotted border-white/20 relative top-[-6px] group-hover:border-gold/50 transition-colors hidden sm:block"></div>
                            <span className="text-lg text-white whitespace-nowrap pl-4">{item.price}</span>
                          </div>
                          <p className="text-sm text-white/60 font-light">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
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
