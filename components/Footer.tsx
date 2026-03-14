'use client';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';

import { StoreSettings, WorkingHours } from '@/lib/api';

type DaySchedule = { day: string; open: string; close: string; isClosed: boolean };

function formatWorkingHours(rawHours: any, locale: string, defaultFallback: string) {
  if (!rawHours) return <p>{defaultFallback}</p>;
  
  let hours: WorkingHours;
  if (typeof rawHours === 'string') {
    try {
      hours = JSON.parse(rawHours);
    } catch (e) {
      console.error("Failed to parse working hours string", e);
      return <p>{defaultFallback}</p>;
    }
  } else {
    hours = rawHours;
  }

  const daysMap: Record<string, Record<string, string>> = {
    uk: { monday: 'Пн', tuesday: 'Вт', wednesday: 'Ср', thursday: 'Чт', friday: 'Пт', saturday: 'Сб', sunday: 'Нд', closed: 'Вихідний', byAppointment: 'За попереднім записом' },
    cs: { monday: 'Po', tuesday: 'Út', wednesday: 'St', thursday: 'Čt', friday: 'Pá', saturday: 'So', sunday: 'Ne', closed: 'Zavřeno', byAppointment: 'Dle předchozí domluvy' },
    en: { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun', closed: 'Closed', byAppointment: 'By appointment only' }
  };
  const tDays = daysMap[locale] || daysMap.uk;

  if (hours.byAppointment) {
    return <p className="italic">{tDays.byAppointment}</p>;
  }

  try {
    const days = hours.days;
    if (!Array.isArray(days) || days.length === 0) return <p>{defaultFallback}</p>;

    const groups: { start: string, end: string, open: string, close: string, isClosed: boolean }[] = [];
    let currentGroup = { start: days[0].day.toLowerCase(), end: days[0].day.toLowerCase(), open: days[0].open, close: days[0].close, isClosed: days[0].isClosed };

    for (let i = 1; i < days.length; i++) {
      const day = days[i];
      const dayName = day.day.toLowerCase();
      
      const isSameSchedule = (day.isClosed && currentGroup.isClosed) || 
                             (!day.isClosed && !currentGroup.isClosed && day.open === currentGroup.open && day.close === currentGroup.close);

      if (isSameSchedule) {
        currentGroup.end = dayName;
      } else {
        groups.push({ ...currentGroup });
        currentGroup = { start: dayName, end: dayName, open: day.open, close: day.close, isClosed: day.isClosed };
      }
    }
    groups.push(currentGroup);

    return (
      <div className="space-y-1 w-full">
        {groups.map((g, idx) => {
          const startName = tDays[g.start] || g.start;
          const endName = tDays[g.end] || g.end;
          const dayStr = g.start === g.end ? startName : `${startName} - ${endName}`;
          const timeStr = g.isClosed ? tDays.closed : `${g.open} - ${g.close}`;
          return (
            <div key={idx} className="flex justify-between gap-4">
              <span>{dayStr}</span>
              <span>{timeStr}</span>
            </div>
          );
        })}
      </div>
    );
  } catch (e) {
    console.error("Failed to parse working hours", e);
    return <p>{defaultFallback}</p>;
  }
}

export default function Footer({ locale, settings }: { locale: string, settings: StoreSettings | null }) {
  const dict = {
    uk: { desc: 'Створюємо красу, яка підкреслює вашу індивідуальність. Преміальний сервіс та турбота про кожну деталь.', contact: 'Контакти', schedule: 'Графік роботи', rights: 'Всі права захищені.', dev: 'Розроблено з любов\'ю', address: 'вул. Хрещатик, 15', city: 'Київ, Україна', days1: 'Пн - Пт: 10:00 - 21:00', days2: 'Сб - Нд: 10:00 - 19:00' },
    cs: { desc: 'Vytváříme krásu, která podtrhuje vaši individualitu. Prémiový servis a péče o každý detail.', contact: 'Kontakt', schedule: 'Otevírací doba', rights: 'Všechna práva vyhrazena.', dev: 'Vyvinuto s láskou', address: 'Václavské náměstí 15', city: 'Praha, Česko', days1: 'Po - Pá: 10:00 - 21:00', days2: 'So - Ne: 10:00 - 19:00' },
    en: { desc: 'Creating beauty that highlights your individuality. Premium service and care for every detail.', contact: 'Contact', schedule: 'Schedule', rights: 'All rights reserved.', dev: 'Developed with love', address: 'Main Street 15', city: 'City, Country', days1: 'Mon - Fri: 10:00 - 21:00', days2: 'Sat - Sun: 10:00 - 19:00' }
  };
  const t = dict[locale as keyof typeof dict] || dict.uk;

  return (
    <footer id="contact" className="bg-bg pt-24 pb-12 border-t border-ink/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-serif text-gold mb-6 tracking-widest">{settings?.companyName}</h3>
            <p className="text-ink/60 font-light leading-relaxed mb-6">
              {t.desc}
            </p>
            <div className="flex gap-4">
              {settings?.instagramActive && settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-ink/10 bg-ink/5 flex items-center justify-center text-ink/60 hover:text-gold hover:border-gold hover:bg-gold/10 transition-all">
                  <Instagram size={20} />
                </a>
              )}
              {settings?.facebookActive && settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-ink/10 bg-ink/5 flex items-center justify-center text-ink/60 hover:text-gold hover:border-gold hover:bg-gold/10 transition-all">
                  <Facebook size={20} />
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-serif text-ink mb-6 uppercase tracking-wider">{t.contact}</h4>
            <ul className="space-y-4 text-ink/60 font-light">
              {settings?.address && (
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                    <MapPin className="text-gold" size={18} />
                  </div>
                  <span className="mt-2">
                    {settings.addressUrl ? (
                      <a href={settings.addressUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                        {settings.address}
                      </a>
                    ) : (
                      settings.address
                    )}
                  </span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                    <Phone className="text-gold" size={18} />
                  </div>
                  <span>
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-gold transition-colors">
                      {settings.phone}
                    </a>
                  </span>
                </li>
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-lg font-serif text-ink mb-6 uppercase tracking-wider">{t.schedule}</h4>
            <ul className="space-y-4 text-ink/60 font-light">
              {settings?.workingHours && (
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center shrink-0">
                    <Clock className="text-gold" size={18} />
                  </div>
                  <div className="mt-2 w-full pr-4">
                    {formatWorkingHours(settings.workingHours, locale, '')}
                  </div>
                </li>
              )}
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-ink/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ink/40 font-light">
          <p>&copy; {new Date().getFullYear()} {settings?.companyName}. {t.rights}</p>
          <p>{t.dev}</p>
        </div>
      </div>
    </footer>
  );
}
