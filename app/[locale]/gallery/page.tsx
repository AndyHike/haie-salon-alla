import Navbar from '@/components/Navbar';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import { getSettings, getGalleryImages } from '@/lib/api';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  const locales = settings?.availableLocales?.map(l => l.code) || ['uk', 'cs', 'en'];

  const languages: Record<string, string> = {};
  locales.forEach(l => {
    languages[l] = `${baseUrl}/${l}/gallery`;
  });

  const title = locale === 'uk' ? 'Галерея Робіт' : locale === 'cs' ? 'Galerie Prací' : 'Our Gallery';

  return {
    title: `${title} | ${settings?.companyName || 'AURA'}`,
    description: locale === 'uk' ? 'Перегляньте наші найкращі роботи. Натхнення та результати роботи наших майстрів.' : 'View our best works. Inspiration and results of our masters.',
    alternates: {
      canonical: `${baseUrl}/${locale}/gallery`,
      languages,
    },
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const settings = await getSettings();
  const defaultLocale = settings?.defaultLocale || 'uk';

  const galleryImages = await getGalleryImages(locale, defaultLocale);

  return (
    <main className="min-h-screen bg-ink pt-24">
      <Navbar locale={locale} settings={settings} />
      <Gallery images={galleryImages} locale={locale} settings={settings} />
      <Footer locale={locale} settings={settings} />
    </main>
  );
}
