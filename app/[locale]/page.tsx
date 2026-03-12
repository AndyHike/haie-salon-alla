import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { getSettings, getServiceGroups, getGalleryImages } from '@/lib/api';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const settings = await getSettings();
  const defaultLocale = settings?.defaultLocale || 'uk';

  // Fetch service groups
  const serviceGroups = await getServiceGroups(locale, defaultLocale);

  // Fetch gallery images
  const galleryImages = await getGalleryImages(locale, defaultLocale);

  return (
    <main className="min-h-screen bg-ink">
      <Navbar locale={locale} settings={settings} />
      <Hero locale={locale} settings={settings} />
      <Services groups={serviceGroups} locale={locale} settings={settings} limitGroups={2} limitItemsPerGroup={4} showAllLink={`/${locale}/services`} />
      <Gallery images={galleryImages} locale={locale} settings={settings} limit={6} showAllLink={`/${locale}/gallery`} />
      <ContactForm locale={locale} />
      <Footer locale={locale} settings={settings} />
    </main>
  );
}
