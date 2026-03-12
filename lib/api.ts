export interface LocalizedString {
  [key: string]: string;
}

export interface Category {
  id: string;
  storeId: string;
  parentId: string | null;
  slug: string;
  title: LocalizedString;
  description: LocalizedString | null;
  position: number;
  isActive: boolean;
}

export interface ItemImage {
  id: string;
  storeId: string;
  itemId: string;
  filePath: string;
  altText: string | null;
  isMain: boolean;
  position: number;
}

export interface LinkedItem {
  type: string;
  targetItem: {
    id: string;
    title: LocalizedString;
    slug: string;
    images: ItemImage[];
  };
}

export interface Item {
  id: string;
  storeId: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString | null;
  content: LocalizedString | null;
  price: string | null;
  attributes: any;
  position: number;
  isActive: boolean;
  images: ItemImage[];
  linkedItems?: LinkedItem[];
}

export interface StoreSettings {
  id: string;
  companyName: string;
  phone: string | null;
  email: string | null;
  contactName: string | null;
  address: string | null;
  addressUrl: string | null;
  workingHours: string;
  defaultLocale: string;
  instagramUrl: string | null;
  instagramActive: boolean;
  facebookUrl: string | null;
  facebookActive: boolean;
  telegramUrl: string | null;
  telegramActive: boolean;
  privacyPolicy: string | null;
  privacyPolicyActive: boolean;
  termsOfService: string | null;
  termsOfServiceActive: boolean;
  availableLocales: { code: string; name: string }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  metadata?: any;
}

const API_URL = process.env.NEXT_PUBLIC_SAAS_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_STORE_API_KEY;

async function fetchApi<T>(endpoint: string, locale?: string): Promise<T | null> {
  if (!API_URL || !API_KEY) {
    console.warn('API credentials missing. Please set NEXT_PUBLIC_SAAS_API_URL and NEXT_PUBLIC_STORE_API_KEY.');
    return null;
  }

  try {
    const url = new URL(`${API_URL}${endpoint}`);
    if (locale) {
      url.searchParams.set('locale', locale);
    }

    const res = await fetch(url.toString(), {
      headers: {
        'x-api-key': API_KEY,
        'x-public-api-key': API_KEY,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const json: ApiResponse<T> = await res.json();
    if (!json.success) {
      throw new Error(json.error || 'Unknown API error');
    }

    return json.data;
  } catch (error) {
    console.error('Fetch API Error:', error);
    return null;
  }
}

export async function getCategories(locale: string = 'uk') {
  return fetchApi<Category[]>('/api/public/categories', locale);
}

export async function getItems(categorySlug: string, locale: string = 'uk', page = 1, limit = 20) {
  return fetchApi<Item[]>(`/api/public/items?page=${page}&limit=${limit}&categorySlug=${categorySlug}`, locale);
}

export async function getSettings() {
  return fetchApi<StoreSettings>('/api/public/settings');
}

export interface ServiceGroup {
  id: string;
  title: any;
  items: Item[];
}

export async function getServiceGroups(locale: string, defaultLocale: string): Promise<ServiceGroup[]> {
  let categories = await getCategories(locale) || [];
  if (categories.length === 0 && locale !== defaultLocale) {
    categories = await getCategories(defaultLocale) || [];
  }

  const servicesCategory = categories.find(c => c.slug === 'services');
  const subCategories = servicesCategory 
    ? categories.filter(c => c.parentId === servicesCategory.id)
    : [];

  const serviceGroups: ServiceGroup[] = [];

  // Fetch general services
  let generalItems = await getItems('services', locale) || [];
  if (generalItems.length === 0 && locale !== defaultLocale) {
    generalItems = await getItems('services', defaultLocale) || [];
  }
  if (generalItems.length > 0) {
    serviceGroups.push({
      id: 'general',
      title: servicesCategory?.title || { uk: 'Загальні послуги', en: 'General Services', cs: 'Obecné služby' },
      items: generalItems
    });
  }

  // Fetch subcategory services
  for (const sub of subCategories) {
    let subItems = await getItems(sub.slug, locale) || [];
    if (subItems.length === 0 && locale !== defaultLocale) {
      subItems = await getItems(sub.slug, defaultLocale) || [];
    }
    if (subItems.length > 0) {
      serviceGroups.push({
        id: sub.id,
        title: sub.title,
        items: subItems
      });
    }
  }

  return serviceGroups;
}

export interface GalleryImage {
  id: string;
  filePath: string;
  altText: string | null;
  serviceId?: string;
  serviceName?: string;
}

export async function getGalleryImages(locale: string, defaultLocale: string): Promise<GalleryImage[]> {
  const galleryImages: GalleryImage[] = [];
  const addedImageIds = new Set<string>();

  // 1. Fetch gallery items
  let galleryItems = await getItems('gallery', locale) || [];
  if (galleryItems.length === 0 && locale !== defaultLocale) {
    galleryItems = await getItems('gallery', defaultLocale) || [];
  }

  const extractTitle = (titleObj: any) => {
    if (!titleObj) return undefined;
    if (titleObj[locale] && titleObj[locale].trim() !== '') return titleObj[locale];
    if (titleObj[defaultLocale] && titleObj[defaultLocale].trim() !== '') return titleObj[defaultLocale];
    if (titleObj['en'] && titleObj['en'].trim() !== '') return titleObj['en'];
    for (const key in titleObj) {
      if (titleObj[key] && typeof titleObj[key] === 'string' && titleObj[key].trim() !== '') {
        return titleObj[key];
      }
    }
    return undefined;
  };

  // 2. Process gallery items
  // The user creates a photo (gallery item) and links it to a service
  for (const item of galleryItems) {
    let serviceId: string | undefined;
    let serviceName: string | undefined;
    
    if (item.linkedItems && item.linkedItems.length > 0) {
      // The linked item is the service this photo belongs to
      const link = item.linkedItems.find(l => l.type === 'portfolio_photo') || item.linkedItems[0];
      if (link && link.targetItem) {
        serviceId = link.targetItem.id;
        serviceName = extractTitle(link.targetItem.title);
      }
    }

    if (item.images && item.images.length > 0) {
      for (const img of item.images) {
        if (!addedImageIds.has(img.id)) {
          galleryImages.push({
            id: img.id,
            filePath: img.filePath,
            altText: img.altText,
            serviceId,
            serviceName
          });
          addedImageIds.add(img.id);
        }
      }
    }
  }

  return galleryImages;
}

export async function sendMessage(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
  if (!API_URL || !API_KEY) return { success: false, error: 'Missing API credentials' };
  
  try {
    const res = await fetch(`${API_URL}/api/public/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'x-public-api-key': API_KEY,
      },
      body: JSON.stringify(data),
    });
    
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Send message error:', error);
    return { success: false, error: 'Failed to send message' };
  }
}
