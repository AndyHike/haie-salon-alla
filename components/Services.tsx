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
      { name: "Жіноча стрижка", desc: "Миття, стрижка, сушка за формою", price: "від 800 Kč" },
      { name: "Укладка вечірня", desc: "Створення локонів, текстурні зачіски", price: "від 1200 Kč" },
      { name: "Стрижка кінчиків", desc: "Рівний зріз машинкою або ножицями", price: "400 Kč" },
    ]
  },
  {
    category: "Фарбування",
    items: [
      { name: "Фарбування в один тон", desc: "Фарбування коренів або всієї довжини", price: "від 1500 Kč" },
      { name: "Складне фарбування", desc: "Airtouch, Balayage, Shatush", price: "від 3500 Kč" },
      { name: "Тонування", desc: "Надання відтінку та блиску волоссю", price: "від 1000 Kč" },
    ]
  },
  {
    category: "Догляд",
    items: [
      { name: "Глибоке відновлення", desc: "Процедура реконструкції пошкодженого волосся", price: "від 1500 Kč" },
      { name: "Кератинове вирівнювання", desc: "Ідеально рівне та блискуче волосся", price: "від 2500 Kč" },
      { name: "Спа-догляд для шкіри голови", desc: "Пілінг та зволоження", price: "800 Kč" },
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16">
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
                  <div className="flex flex-col gap-6">
                    {displayItems.map((item) => (
                      <div key={item.id} className="group flex flex-col relative">
                        <div className="flex justify-between items-baseline gap-4 mb-1">
                          <h4 className="text-lg md:text-xl text-ink font-medium group-hover:text-gold transition-colors">{item.title?.[locale] || item.title?.[defaultLocale] || item.title?.['en'] || 'Послуга'}</h4>
                          <div className="flex-grow border-b border-dotted border-ink/20 relative top-[-6px] mx-2"></div>
                          <span className="text-lg md:text-xl text-gold font-serif whitespace-nowrap shrink-0">{item.price ? `${item.price} Kč` : ''}</span>
                        </div>
                        <p className="text-sm md:text-base text-ink-light font-light leading-relaxed pr-16">{item.description?.[locale] || item.description?.[defaultLocale] || item.description?.['en'] || ''}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <>
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
                    <div className="flex flex-col gap-6">
                      {displayItems.map((item, i) => (
                        <div key={i} className="group flex flex-col relative">
                          <div className="flex justify-between items-baseline gap-4 mb-1">
                            <h4 className="text-lg md:text-xl text-ink font-medium group-hover:text-gold transition-colors">{item.name}</h4>
                            <div className="flex-grow border-b border-dotted border-ink/20 relative top-[-6px] mx-2"></div>
                            <span className="text-lg md:text-xl text-gold font-serif whitespace-nowrap shrink-0">{item.price}</span>
                          </div>
                          <p className="text-sm md:text-base text-ink-light font-light leading-relaxed pr-16">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </div>

        {showAllLink && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 md:mt-20 text-center"
          >
            <Link href={showAllLink} className="inline-block border border-ink text-ink px-10 py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-ink hover:text-white transition-colors duration-300">
              {t.showAll}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
