'use client';
import { motion } from 'motion/react';
import { useState } from 'react';
import { submitContactForm } from '@/lib/actions';

export default function ContactForm({ locale }: { locale: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const dict = {
    uk: { title: 'Зв\'язатися з нами', desc: 'Залиште свої контакти і ми передзвонимо вам найближчим часом.', name: 'Ваше ім\'я', email: 'Email', phone: 'Телефон', message: 'Повідомлення', send: 'Відправити', success: 'Повідомлення успішно відправлено!', error: 'Помилка відправки. Спробуйте ще раз.' },
    cs: { title: 'Kontaktujte nás', desc: 'Zanechte nám své kontakty a my se vám brzy ozveme.', name: 'Vaše jméno', email: 'Email', phone: 'Telefon', message: 'Zpráva', send: 'Odeslat', success: 'Zpráva byla úspěšně odeslána!', error: 'Chyba při odesílání. Zkuste to prosím znovu.' },
    en: { title: 'Contact Us', desc: 'Leave your contacts and we will call you back shortly.', name: 'Your Name', email: 'Email', phone: 'Phone', message: 'Message', send: 'Send', success: 'Message sent successfully!', error: 'Error sending message. Please try again.' }
  };
  const t = dict[locale as keyof typeof dict] || dict.uk;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const res = await submitContactForm({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: 'Нове звернення з сайту',
      message: formData.message
    });

    if (res.success) {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-bg relative">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-serif text-ink mb-6">{t.title}</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-8"></div>
          <p className="mt-6 text-ink-light font-light text-base md:text-lg">{t.desc}</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 md:space-y-8 bg-surface p-8 md:p-12 rounded-[2rem] border border-ink/5 shadow-xl shadow-ink/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <label className="block text-xs md:text-sm font-medium text-ink-light mb-2 uppercase tracking-wider">{t.name} *</label>
              <input 
                required 
                type="text" 
                autoComplete="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-bg border border-ink/10 rounded-2xl px-5 py-4 text-ink focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-ink-light mb-2 uppercase tracking-wider">{t.email} *</label>
              <input 
                required 
                type="email" 
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-bg border border-ink/10 rounded-2xl px-5 py-4 text-ink focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-ink-light mb-2 uppercase tracking-wider">{t.phone}</label>
            <input 
              type="tel" 
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-bg border border-ink/10 rounded-2xl px-5 py-4 text-ink focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-medium text-ink-light mb-2 uppercase tracking-wider">{t.message} *</label>
            <textarea 
              required 
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-bg border border-ink/10 rounded-2xl px-5 py-4 text-ink focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all resize-none"
            ></textarea>
          </div>
          
          <button 
            disabled={status === 'loading'}
            type="submit" 
            className="w-full bg-ink text-bg font-medium py-4 md:py-5 rounded-full text-sm md:text-base uppercase tracking-widest hover:bg-gold transition-colors duration-300 disabled:opacity-70 mt-4"
          >
            {status === 'loading' ? '...' : t.send}
          </button>

          {status === 'success' && <p className="text-emerald-400 text-center mt-4">{t.success}</p>}
          {status === 'error' && <p className="text-red-400 text-center mt-4">{t.error}</p>}
        </motion.form>
      </div>
    </section>
  );
}
