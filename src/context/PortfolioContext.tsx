import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PortfolioItem,
  ProfileInfo,
  ClubItem,
  FestivalItem,
  LayoutSettings,
  LayoutMode,
  CategoryType,
  AccentColor,
} from '../types/portfolio';
import {
  initialPortfolioItems,
  initialProfile,
  initialClubs,
  initialFestivals,
  initialLayoutSettings,
} from '../data/initialData';
import { checkIsAdminMode, generatePortfolioLinks } from '../utils/portfolioLogic';

interface VideoModalData {
  title: string;
  url?: string;
  embedUrl?: string;
  venue?: string;
  date?: string;
}

interface ImageModalData {
  title: string;
  url: string;
  caption?: string;
}

interface PortfolioContextType {
  // Data
  portfolioItems: PortfolioItem[];
  profile: ProfileInfo;
  clubs: ClubItem[];
  festivals: FestivalItem[];
  layoutSettings: LayoutSettings;

  // Mode & Share Links
  isEditorMode: boolean;
  setIsEditorMode: (val: boolean) => void;
  isShareLinksOpen: boolean;
  setIsShareLinksOpen: (val: boolean) => void;
  shareLinks: { viewerUrl: string; editorUrl: string };

  // Filters & layout state
  activeLayout: LayoutMode;
  setActiveLayout: (mode: LayoutMode) => void;
  activeCategory: CategoryType;
  setActiveCategory: (cat: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'date-desc' | 'date-asc' | 'title-asc' | 'featured';
  setSortBy: (sort: 'date-desc' | 'date-asc' | 'title-asc' | 'featured') => void;

  // Modals
  videoModal: VideoModalData | null;
  openVideoModal: (data: VideoModalData) => void;
  closeVideoModal: () => void;

  imageModal: ImageModalData | null;
  openImageModal: (data: ImageModalData) => void;
  closeImageModal: () => void;

  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;

  // Direct editing item hook
  itemToEdit: Partial<PortfolioItem> | null;
  setItemToEdit: (item: Partial<PortfolioItem> | null) => void;
  handleStartEditItem: (item: PortfolioItem) => void;
  handleStartAddItem: () => void;

  // Admin Actions
  addItem: (item: Omit<PortfolioItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<PortfolioItem>) => void;
  deleteItem: (id: string) => void;
  reorderItems: (newOrder: PortfolioItem[]) => void;
  toggleFeatured: (id: string) => void;

  updateProfile: (updates: Partial<ProfileInfo>) => void;
  updateLayoutSettings: (updates: Partial<LayoutSettings>) => void;
  setAccentColor: (color: AccentColor) => void;

  addClub: (club: Omit<ClubItem, 'id'>) => void;
  deleteClub: (id: string) => void;

  addFestival: (fest: Omit<FestivalItem, 'id'>) => void;
  deleteFestival: (id: string) => void;

  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
}

const STORAGE_KEY = 'dj_jefferson_portfolio_v2';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage fallback
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_items`);
      return saved ? JSON.parse(saved) : initialPortfolioItems;
    } catch {
      return initialPortfolioItems;
    }
  });

  const [profile, setProfile] = useState<ProfileInfo>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [clubs, setClubs] = useState<ClubItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_clubs`);
      return saved ? JSON.parse(saved) : initialClubs;
    } catch {
      return initialClubs;
    }
  });

  const [festivals, setFestivals] = useState<FestivalItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_festivals`);
      return saved ? JSON.parse(saved) : initialFestivals;
    } catch {
      return initialFestivals;
    }
  });

  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_layout`);
      return saved ? JSON.parse(saved) : initialLayoutSettings;
    } catch {
      return initialLayoutSettings;
    }
  });

  // Editor mode detection from URL or query
  const [isEditorMode, setIsEditorMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return checkIsAdminMode(window.location.search, window.location.pathname, window.location.hash);
  });

  const [isShareLinksOpen, setIsShareLinksOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Partial<PortfolioItem> | null>(null);

  // Compute 2 separate links
  const [shareLinks, setShareLinks] = useState<{ viewerUrl: string; editorUrl: string }>(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-5er3iql2oisvmlj5duyz7k-619264722982.asia-east1.run.app';
    return generatePortfolioLinks(origin);
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareLinks(generatePortfolioLinks(window.location.origin));
    }
  }, []);

  // UI state
  const [activeLayout, setActiveLayout] = useState<LayoutMode>(layoutSettings.layoutMode);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title-asc' | 'featured'>('date-desc');

  const [videoModal, setVideoModal] = useState<VideoModalData | null>(null);
  const [imageModal, setImageModal] = useState<ImageModalData | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_items`, JSON.stringify(portfolioItems));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [portfolioItems]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_clubs`, JSON.stringify(clubs));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [clubs]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_festivals`, JSON.stringify(festivals));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [festivals]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_layout`, JSON.stringify(layoutSettings));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [layoutSettings]);

  // Keep activeLayout in sync when layoutSettings change
  const handleSetLayout = (mode: LayoutMode) => {
    setActiveLayout(mode);
    setLayoutSettings((prev) => ({ ...prev, layoutMode: mode }));
  };

  const handleSetAccentColor = (accent: AccentColor) => {
    setLayoutSettings((prev) => ({ ...prev, accentColor: accent }));
  };

  // Direct edit trigger for cards
  const handleStartEditItem = (item: PortfolioItem) => {
    setItemToEdit({ ...item });
    setIsAdminOpen(true);
  };

  const handleStartAddItem = () => {
    setItemToEdit({
      title: '',
      category: 'live-session',
      date: new Date().toISOString().split('T')[0],
      venue: '',
      city: 'Khon Kaen',
      imageUrl: 'https://cdn.myportfolio.com/b76f0844-9acf-432f-b53b-d42b3b42a0d6/c13545a0-8129-48cc-b43c-e58b739adcb4_rw_1920.png',
      videoUrl: '',
      description: '',
      tags: ['Live', 'Club Mix'],
      featured: false,
    });
    setIsAdminOpen(true);
  };

  // CRUD for items
  const addItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setPortfolioItems((prev) => [newItem, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolioItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteItem = (id: string) => {
    setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
  };

  const reorderItems = (newOrder: PortfolioItem[]) => {
    setPortfolioItems(newOrder);
  };

  const toggleFeatured = (id: string) => {
    setPortfolioItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    );
  };

  const updateProfile = (updates: Partial<ProfileInfo>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateLayoutSettings = (updates: Partial<LayoutSettings>) => {
    setLayoutSettings((prev) => ({ ...prev, ...updates }));
  };

  const addClub = (club: Omit<ClubItem, 'id'>) => {
    const newClub: ClubItem = {
      ...club,
      id: `club-${Date.now()}`,
    };
    setClubs((prev) => [...prev, newClub]);
  };

  const deleteClub = (id: string) => {
    setClubs((prev) => prev.filter((c) => c.id !== id));
  };

  const addFestival = (fest: Omit<FestivalItem, 'id'>) => {
    const newFest: FestivalItem = {
      ...fest,
      id: `fest-${Date.now()}`,
    };
    setFestivals((prev) => [newFest, ...prev]);
  };

  const deleteFestival = (id: string) => {
    setFestivals((prev) => prev.filter((f) => f.id !== id));
  };

  const resetToDefaults = () => {
    setPortfolioItems(initialPortfolioItems);
    setProfile(initialProfile);
    setClubs(initialClubs);
    setFestivals(initialFestivals);
    setLayoutSettings(initialLayoutSettings);
    setActiveLayout(initialLayoutSettings.layoutMode);
    setActiveCategory('all');
    setSearchQuery('');
    setSortBy('date-desc');
    try {
      localStorage.removeItem(`${STORAGE_KEY}_items`);
      localStorage.removeItem(`${STORAGE_KEY}_profile`);
      localStorage.removeItem(`${STORAGE_KEY}_clubs`);
      localStorage.removeItem(`${STORAGE_KEY}_festivals`);
      localStorage.removeItem(`${STORAGE_KEY}_layout`);
    } catch (e) {
      console.warn('LocalStorage clear failed', e);
    }
  };

  const exportDataJson = () => {
    const exportBundle = {
      profile,
      portfolioItems,
      clubs,
      festivals,
      layoutSettings,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(exportBundle, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.portfolioItems && Array.isArray(parsed.portfolioItems)) {
        setPortfolioItems(parsed.portfolioItems);
      }
      if (parsed.profile) {
        setProfile(parsed.profile);
      }
      if (parsed.clubs && Array.isArray(parsed.clubs)) {
        setClubs(parsed.clubs);
      }
      if (parsed.festivals && Array.isArray(parsed.festivals)) {
        setFestivals(parsed.festivals);
      }
      if (parsed.layoutSettings) {
        setLayoutSettings(parsed.layoutSettings);
        if (parsed.layoutSettings.layoutMode) {
          setActiveLayout(parsed.layoutSettings.layoutMode);
        }
      }
      return true;
    } catch (err) {
      console.error('Import JSON error:', err);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolioItems,
        profile,
        clubs,
        festivals,
        layoutSettings,
        isEditorMode,
        setIsEditorMode,
        isShareLinksOpen,
        setIsShareLinksOpen,
        shareLinks,
        activeLayout,
        setActiveLayout: handleSetLayout,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        videoModal,
        openVideoModal: (data) => setVideoModal(data),
        closeVideoModal: () => setVideoModal(null),
        imageModal,
        openImageModal: (data) => setImageModal(data),
        closeImageModal: () => setImageModal(null),
        isAdminOpen,
        setIsAdminOpen,
        isBookingOpen,
        setIsBookingOpen,
        itemToEdit,
        setItemToEdit,
        handleStartEditItem,
        handleStartAddItem,
        addItem,
        updateItem,
        deleteItem,
        reorderItems,
        toggleFeatured,
        updateProfile,
        updateLayoutSettings,
        setAccentColor: handleSetAccentColor,
        addClub,
        deleteClub,
        addFestival,
        deleteFestival,
        resetToDefaults,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
