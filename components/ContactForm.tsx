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
    <section id="contact" className="py-24 bg-ink relative">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gold mb-4">{t.title}</h2>
          <div className="w-24 h-1 bg-gold mx-auto opacity-50 rounded-full"></div>
          <p className="mt-6 text-white/70 font-light">{t.desc}</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/5 p-8 md:p-10 rounded-3xl border border-white/10 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t.name} *</label>
              <input 
                required 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-ink-light border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t.email} *</label>
              <input 
                required 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-ink-light border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t.phone}</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-ink-light border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t.message} *</label>
            <textarea 
              required 
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-ink-light border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors resize-none"
            ></textarea>
          </div>
          
          <button 
            disabled={status === 'loading'}
            type="submit" 
            className="w-full bg-gold text-ink font-semibold py-4 rounded-full uppercase tracking-widest hover:bg-white hover:text-ink transition-colors duration-300 disabled:opacity-70"
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
