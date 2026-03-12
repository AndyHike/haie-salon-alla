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
    <section id="services" className="py-20 md:py-32 bg-bg relative">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-serif text-ink mb-6">{t.title}</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-8"></div>
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
                    <h3 className="text-2xl md:text-3xl font-serif text-ink mb-8 md:mb-10 border-b border-ink/10 pb-4">
                      {group.title?.[locale] || group.title?.[defaultLocale] || group.title?.['en'] || 'Послуги'}
                    </h3>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-6 md:gap-y-8">
                    {displayItems.map((item) => (
                      <div key={item.id} className="group bg-surface p-6 md:p-8 rounded-[2rem] border border-ink/5 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 flex flex-col h-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-4">
                          <h4 className="text-lg md:text-xl text-ink font-medium group-hover:text-gold transition-colors">{item.title?.[locale] || item.title?.[defaultLocale] || item.title?.['en'] || 'Послуга'}</h4>
                          <span className="text-lg md:text-xl text-gold font-serif whitespace-nowrap shrink-0">{item.price ? `${item.price} ₴` : ''}</span>
                        </div>
                        <p className="text-sm md:text-base text-ink-light font-light leading-relaxed flex-grow">{item.description?.[locale] || item.description?.[defaultLocale] || item.description?.['en'] || ''}</p>
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
                    <h3 className="text-2xl md:text-3xl font-serif text-ink mb-8 md:mb-10 border-b border-ink/10 pb-4">{section.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-6 md:gap-y-8">
                      {displayItems.map((item, i) => (
                        <div key={i} className="group bg-surface p-6 md:p-8 rounded-[2rem] border border-ink/5 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 flex flex-col h-full">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-4">
                            <h4 className="text-lg md:text-xl text-ink font-medium group-hover:text-gold transition-colors">{item.name}</h4>
                            <span className="text-lg md:text-xl text-gold font-serif whitespace-nowrap shrink-0">{item.price}</span>
                          </div>
                          <p className="text-sm md:text-base text-ink-light font-light leading-relaxed flex-grow">{item.desc}</p>
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
