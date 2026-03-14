import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Fetch settings to get dynamic locales
  let defaultLocale = 'uk';
  let locales = ['uk', 'cs', 'en'];
  
  try {
    const API_URL = process.env.NEXT_PUBLIC_SAAS_API_URL;
    const API_KEY = process.env.NEXT_PUBLIC_STORE_API_KEY;
    
    if (API_URL && API_KEY) {
      const res = await fetch(`${API_URL}/api/public/v1/settings`, {
        headers: {
          'x-public-api-key': API_KEY,
        },
        next: { revalidate: 60 }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.availableLocales && Array.isArray(json.data.availableLocales)) {
            const fetchedLocales = json.data.availableLocales
              .map((l: any) => l.code)
              .filter((code: any) => typeof code === 'string' && code.trim() !== '');
            if (fetchedLocales.length > 0) {
              locales = fetchedLocales;
            }
          }
          if (typeof json.data.defaultLocale === 'string' && json.data.defaultLocale.trim() !== '') {
            defaultLocale = json.data.defaultLocale.trim();
          }
        }
      }
    }
  } catch (e) {
    console.error('Middleware fetch settings error:', e);
  }
  
  // Ensure defaultLocale is valid and in locales
  if (!locales.includes(defaultLocale)) {
    defaultLocale = locales[0] || 'uk';
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect to default locale if no locale is present
  request.nextUrl.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api) and static files
    '/((?!_next|api|favicon.ico|.*\\..*).*)',
  ],
};
