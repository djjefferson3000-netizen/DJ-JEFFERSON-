import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/portfolioLogic';
import {
  LayoutGrid,
  Columns,
  Film,
  ListOrdered,
  Sparkles,
  Search,
  Sliders,
  Palette,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { LayoutMode, CategoryType, AccentColor, CardTheme } from '../types/portfolio';

export const LayoutCustomizerBar: React.FC = () => {
  const {
    activeLayout,
    setActiveLayout,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    layoutSettings,
    updateLayoutSettings,
    setAccentColor,
    portfolioItems,
  } = usePortfolio();

  const accent = getAccentClasses(layoutSettings.accentColor);

  const categories: { id: CategoryType; label: string; count: number; badgeColor?: string }[] = [
    { id: 'all', label: 'ทั้งหมด (All Works)', count: portfolioItems.length },
    {
      id: 'live-session',
      label: '🔴 Live Sessions (ดีเจเซ็ต)',
      count: portfolioItems.filter((i) => i.category === 'live-session').length,
    },
    {
      id: 'recap',
      label: '⚡ Recap Videos (ไฮไลต์งาน)',
      count: portfolioItems.filter((i) => i.category === 'recap').length,
    },
    {
      id: 'poster-design',
      label: '🎨 Artwork & Posters (งานออกแบบ)',
      count: portfolioItems.filter((i) => i.category === 'poster-design').length,
    },
  ];

  const layoutOptions: { id: LayoutMode; label: string; icon: React.ReactNode }[] = [
    { id: 'grid', label: 'Grid', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'masonry', label: 'Masonry', icon: <Columns className="w-4 h-4" /> },
    { id: 'filmstrip', label: 'Filmstrip', icon: <Film className="w-4 h-4" /> },
    { id: 'schedule', label: 'Tour Table', icon: <ListOrdered className="w-4 h-4" /> },
    { id: 'spotlight', label: 'Spotlight', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const accentColors: { id: AccentColor; name: string; bgClass: string }[] = [
    { id: 'amber', name: 'Gold / Amber', bgClass: 'bg-amber-500' },
    { id: 'cyan', name: 'Electric Cyan', bgClass: 'bg-cyan-500' },
    { id: 'emerald', name: 'Acid Emerald', bgClass: 'bg-emerald-500' },
    { id: 'purple', name: 'Club Purple', bgClass: 'bg-purple-500' },
    { id: 'rose', name: 'Neon Rose', bgClass: 'bg-rose-500' },
  ];

  const cardThemes: { id: CardTheme; label: string }[] = [
    { id: 'glass', label: 'Glassmorphism' },
    { id: 'monochrome', label: 'Monochrome Dark' },
    { id: 'neon', label: 'Neon Glow' },
    { id: 'editorial', label: 'Editorial Clean' },
  ];

  return (
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeCategory === cat.id
                  ? `${accent.bg} text-neutral-950 shadow-md font-bold scale-[1.02]`
                  : 'bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeCategory === cat.id
                    ? 'bg-neutral-950/20 text-neutral-950'
                    : 'bg-neutral-900 text-neutral-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Layout Modes */}
        <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800">
          <span className="text-[11px] font-mono text-neutral-400 px-2 hidden lg:inline">
            เลย์เอาต์:
          </span>
          {layoutOptions.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setActiveLayout(layout.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeLayout === layout.id
                  ? `${accent.badge} font-bold text-white shadow-sm`
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
              title={layout.label}
              aria-label={`Switch to ${layout.label} layout`}
            >
              {layout.icon}
              <span className="hidden sm:inline">{layout.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Second Row: Search, Sort, Column Controls, and Styling Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาผลงาน, สถานที่ (DUEM, JESS, SLAY, ROO), วันที่, หรือแท็ก..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Sort By */}
          <div className="flex items-center gap-1 bg-neutral-950/80 px-2.5 py-1.5 rounded-xl border border-neutral-800 text-xs text-neutral-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'date-desc' | 'date-asc' | 'title-asc' | 'featured')
              }
              className="bg-transparent text-neutral-200 text-xs focus:outline-none cursor-pointer pr-1"
              aria-label="Sort portfolio items"
            >
              <option value="date-desc" className="bg-neutral-900">วันที่ล่าสุด (Newest)</option>
              <option value="date-asc" className="bg-neutral-900">วันที่เก่าสุด (Oldest)</option>
              <option value="featured" className="bg-neutral-900">ผลงานแนะนำ (Featured)</option>
              <option value="title-asc" className="bg-neutral-900">ชื่อ A-Z</option>
            </select>
          </div>

          {/* Grid Column Selector (if in grid mode) */}
          {activeLayout === 'grid' && (
            <div className="hidden sm:flex items-center gap-1 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800 text-xs">
              <span className="text-[11px] font-mono text-neutral-500 px-1.5">คอลัมน์:</span>
              {([2, 3, 4] as const).map((cols) => (
                <button
                  key={cols}
                  onClick={() => updateLayoutSettings({ gridColumns: cols })}
                  className={`w-6 h-6 rounded-md font-mono text-xs flex items-center justify-center transition-all ${
                    layoutSettings.gridColumns === cols
                      ? `${accent.bg} text-neutral-950 font-bold`
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                  aria-label={`Set ${cols} columns`}
                >
                  {cols}
                </button>
              ))}
            </div>
          )}

          {/* Accent Color Palette Switcher */}
          <div className="flex items-center gap-1 bg-neutral-950/80 px-2 py-1.5 rounded-xl border border-neutral-800" title="เลือกธีมสีเน้น (Accent Glow)">
            <Palette className="w-3.5 h-3.5 text-neutral-400 mr-1" />
            {accentColors.map((col) => (
              <button
                key={col.id}
                onClick={() => setAccentColor(col.id)}
                className={`w-4 h-4 rounded-full ${col.bgClass} transition-transform ${
                  layoutSettings.accentColor === col.id
                    ? 'ring-2 ring-white scale-125'
                    : 'opacity-70 hover:opacity-100 hover:scale-110'
                }`}
                title={`Accent: ${col.name}`}
                aria-label={`Select ${col.name} accent`}
              />
            ))}
          </div>

          {/* Card Theme Dropdown */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-950/80 px-2.5 py-1.5 rounded-xl border border-neutral-800 text-xs text-neutral-300">
            <span className="text-[11px] font-mono text-neutral-500">ธีมการ์ด:</span>
            <select
              value={layoutSettings.cardTheme}
              onChange={(e) => updateLayoutSettings({ cardTheme: e.target.value as CardTheme })}
              className="bg-transparent text-neutral-200 text-xs focus:outline-none cursor-pointer"
              aria-label="Select card theme"
            >
              {cardThemes.map((ct) => (
                <option key={ct.id} value={ct.id} className="bg-neutral-900">
                  {ct.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
