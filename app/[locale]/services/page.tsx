import Navbar from '@/components/Navbar';
import Services from '@/components/Services';
import Footer from '@/components/Footer';
import { getSettings, getServiceGroups } from '@/lib/api';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  const locales = settings?.availableLocales?.map(l => l.code) || ['uk', 'cs', 'en'];

  const languages: Record<string, string> = {};
  locales.forEach(l => {
    languages[l] = `${baseUrl}/${l}/services`;
  });

  const title = locale === 'uk' ? 'Наші Послуги' : locale === 'cs' ? 'Naše Služby' : 'Our Services';

  return {
    title: settings?.companyName ? `${title} | ${settings.companyName}` : title,
    description: locale === 'uk' ? 'Повний перелік послуг нашого салону краси. Стрижки, фарбування, догляд та багато іншого.' : 'Full list of services of our beauty salon. Haircuts, coloring, care and much more.',
    alternates: {
      canonical: `${baseUrl}/${locale}/services`,
      languages,
    },
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const settings = await getSettings();
  const defaultLocale = settings?.defaultLocale || 'uk';

  // Fetch service groups
  const serviceGroups = await getServiceGroups(locale, defaultLocale);

  return (
    <main className="min-h-screen bg-bg pt-20 md:pt-24">
      <Navbar locale={locale} settings={settings} />
      <Services groups={serviceGroups} locale={locale} settings={settings} />
      <Footer locale={locale} settings={settings} />
    </main>
  );
}
