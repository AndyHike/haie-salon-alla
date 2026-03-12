import type {Metadata} from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import '../globals.css';

import { getSettings } from '@/lib/api';

const playfair = Playfair_Display({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-playfair',
});

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-montserrat',
});

export async function generateStaticParams() {
  const settings = await getSettings();
  const locales = settings?.availableLocales?.map(l => l.code) || ['uk', 'cs', 'en'];
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  const locales = settings?.availableLocales?.map(l => l.code) || ['uk', 'cs', 'en'];

  const languages: Record<string, string> = {};
  locales.forEach(l => {
    languages[l] = `${baseUrl}/${l}`;
  });

  return {
    title: {
      template: `%s | ${settings?.companyName || 'AURA'}`,
      default: `${settings?.companyName || 'AURA'} | Салон Краси Волосся`,
    },
    description: 'Елітний салон краси волосся. Професійне фарбування, стрижки та догляд.',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale} className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="font-sans antialiased bg-ink text-white selection:bg-gold selection:text-ink" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
