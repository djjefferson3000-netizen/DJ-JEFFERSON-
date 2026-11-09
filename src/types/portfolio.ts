export type CategoryType = 'all' | 'live-session' | 'recap' | 'poster-design' | 'club-set';

export type LayoutMode = 'grid' | 'masonry' | 'filmstrip' | 'schedule' | 'spotlight';
export type CardTheme = 'glass' | 'monochrome' | 'neon' | 'editorial';
export type AccentColor = 'amber' | 'emerald' | 'cyan' | 'purple' | 'rose';

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'live-session' | 'recap' | 'poster-design' | 'club-set';
  date: string;
  venue: string;
  city: string;
  imageUrl: string;
  videoUrl?: string;
  embedUrl?: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  line?: string;
  email?: string;
  phone?: string;
}

export interface ClubItem {
  id: string;
  name: string;
  location: string;
  highlight?: boolean;
}

export interface FestivalItem {
  id: string;
  year: string;
  title: string;
  role?: string;
  location?: string;
}

export interface ProfileInfo {
  stageName: string;
  fullName: string;
  nickname: string;
  dob: string;
  location: string;
  tagline: string;
  bioText: string;
  genres: string[];
  heroImages: string[];
  avatarUrl: string;
  bannerUrl: string;
  socials: SocialLinks;
}

export interface LayoutSettings {
  layoutMode: LayoutMode;
  gridColumns: 2 | 3 | 4;
  cardSpacing: 'compact' | 'normal' | 'relaxed';
  cardTheme: CardTheme;
  accentColor: AccentColor;
  showFlyerZoom: boolean;
  showVideoBadge: boolean;
  enableAudioVisualizer: boolean;
}
