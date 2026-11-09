import { PortfolioItem, AccentColor, CategoryType } from '../types/portfolio';

/**
 * Extracts and formats YouTube Embed URL from any youtube or youtu.be link
 */
export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // youtu.be/<id>
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
  }

  // youtube.com/watch?v=<id>
  const longMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (longMatch) {
    return `https://www.youtube.com/embed/${longMatch[1]}?autoplay=1&rel=0`;
  }

  // youtube.com/embed/<id>
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) {
    return trimmed;
  }

  // Already an embed or direct video player (e.g. Adobe CCV / Behance player)
  if (trimmed.includes('embed') || trimmed.includes('player')) {
    return trimmed;
  }

  return trimmed;
}

/**
 * Extracts episode number for clean badge display (e.g. 'ep.1' -> 'EP.01')
 */
export function extractEpisodeBadge(title: string): string | null {
  const match = title.match(/ep\.?\s*(\d+)/i);
  if (match) {
    const num = parseInt(match[1], 10);
    return `EP.${num < 10 ? '0' + num : num}`;
  }
  return null;
}

/**
 * Formats date into readable Thai/English representation
 */
export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();

  // If in YYYY-MM-DD format
  const ymdMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = parseInt(ymdMatch[2], 10);
    const day = parseInt(ymdMatch[3], 10);
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    if (month >= 1 && month <= 12) {
      return `${day} ${thaiMonths[month - 1]} ${year}`;
    }
  }

  return trimmed;
}

/**
 * Checks if a given URL, search params, or pathname is in admin/editor mode
 */
export function checkIsAdminMode(search: string, pathname: string, hash: string): boolean {
  if (pathname.includes('/admin')) return true;
  if (hash.includes('#admin')) return true;
  const params = new URLSearchParams(search);
  return params.get('admin') === '1' || params.get('edit') === 'true' || params.get('mode') === 'admin';
}

/**
 * Generates the 2 requested URLs:
 * 1. Viewer URL (for audience / public)
 * 2. Editor URL (for content managers)
 */
export function generatePortfolioLinks(baseUrl: string): {
  viewerUrl: string;
  editorUrl: string;
} {
  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : window?.location?.origin || '';
  const viewerUrl = `${cleanBase}/`;
  const editorUrl = `${cleanBase}/?admin=1`;
  return { viewerUrl, editorUrl };
}

export interface FilterSortOptions {
  category?: CategoryType;
  search?: string;
  sortBy?: 'date-desc' | 'date-asc' | 'title-asc' | 'featured';
}

/**
 * Filters and sorts portfolio items
 */
export function filterAndSortItems(
  items: PortfolioItem[],
  options: FilterSortOptions
): PortfolioItem[] {
  const { category = 'all', search = '', sortBy = 'date-desc' } = options;
  const searchLower = search.toLowerCase().trim();

  let filtered = items.filter((item) => {
    // Category match
    if (category !== 'all' && item.category !== category) {
      return false;
    }

    // Search query match across title, venue, city, description, tags
    if (searchLower) {
      const matchTitle = item.title.toLowerCase().includes(searchLower);
      const matchVenue = item.venue.toLowerCase().includes(searchLower);
      const matchCity = item.city.toLowerCase().includes(searchLower);
      const matchDesc = item.description.toLowerCase().includes(searchLower);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(searchLower));
      if (!matchTitle && !matchVenue && !matchCity && !matchDesc && !matchTags) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'featured') {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    }
    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    // Date sorting (assuming format YYYY-MM-DD or standard parseable string)
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    if (sortBy === 'date-asc') {
      return dateA - dateB;
    }
    // Default: date-desc
    return dateB - dateA;
  });

  return filtered;
}

/**
 * Validates portfolio item input
 */
export function validatePortfolioItem(item: Partial<PortfolioItem>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!item.title || item.title.trim().length === 0) {
    errors.title = 'Title is required';
  }
  if (!item.category) {
    errors.category = 'Category is required';
  }
  if (!item.date || item.date.trim().length === 0) {
    errors.date = 'Date is required';
  }
  if (!item.imageUrl || item.imageUrl.trim().length === 0) {
    errors.imageUrl = 'Image URL is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Helper for color styling based on chosen accent
 */
export function getAccentClasses(accent: AccentColor) {
  switch (accent) {
    case 'emerald':
      return {
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500',
        border: 'border-emerald-500',
        glow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
        hoverBorder: 'hover:border-emerald-400/60',
        gradient: 'from-emerald-500 to-teal-400',
      };
    case 'cyan':
      return {
        badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        text: 'text-cyan-400',
        bg: 'bg-cyan-500',
        border: 'border-cyan-500',
        glow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
        hoverBorder: 'hover:border-cyan-400/60',
        gradient: 'from-cyan-500 to-blue-500',
      };
    case 'purple':
      return {
        badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        text: 'text-purple-400',
        bg: 'bg-purple-500',
        border: 'border-purple-500',
        glow: 'shadow-[0_0_25px_rgba(168,85,247,0.25)]',
        hoverBorder: 'hover:border-purple-400/60',
        gradient: 'from-purple-500 to-pink-500',
      };
    case 'rose':
      return {
        badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        text: 'text-rose-400',
        bg: 'bg-rose-500',
        border: 'border-rose-500',
        glow: 'shadow-[0_0_25px_rgba(244,63,94,0.25)]',
        hoverBorder: 'hover:border-rose-400/60',
        gradient: 'from-rose-500 to-amber-500',
      };
    case 'amber':
    default:
      return {
        badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        text: 'text-amber-400',
        bg: 'bg-amber-500',
        border: 'border-amber-500',
        glow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
        hoverBorder: 'hover:border-amber-400/60',
        gradient: 'from-amber-400 to-orange-500',
      };
  }
}
