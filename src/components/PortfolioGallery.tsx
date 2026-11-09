import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  filterAndSortItems,
  getAccentClasses,
  extractEpisodeBadge,
  formatReadableDate,
} from '../utils/portfolioLogic';
import { PortfolioItem, CardTheme } from '../types/portfolio';
import {
  Play,
  Maximize2,
  Calendar,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Music,
  Edit2,
  Trash2,
  Star,
  Eye,
} from 'lucide-react';

export const PortfolioGallery: React.FC = () => {
  const {
    portfolioItems,
    activeCategory,
    searchQuery,
    sortBy,
    activeLayout,
    layoutSettings,
    openVideoModal,
    openImageModal,
    isEditorMode,
    handleStartEditItem,
    deleteItem,
    toggleFeatured,
  } = usePortfolio();

  const accent = getAccentClasses(layoutSettings.accentColor);

  const filteredItems = filterAndSortItems(portfolioItems, {
    category: activeCategory,
    search: searchQuery,
    sortBy: sortBy,
  });

  const [spotlightIdx, setSpotlightIdx] = useState(0);

  // Helper for category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'live-session':
        return 'Live Session';
      case 'recap':
        return 'Recap Video';
      case 'poster-design':
        return 'Poster & Artwork';
      case 'club-set':
        return 'Club Show';
      default:
        return category.replace('-', ' ');
    }
  };

  // Helper for card styling
  const getCardThemeClasses = (theme: CardTheme) => {
    switch (theme) {
      case 'neon':
        return `bg-neutral-900/90 border border-neutral-700/80 hover:border-amber-400 ${accent.glow} shadow-2xl`;
      case 'monochrome':
        return 'bg-black border border-neutral-800 hover:border-neutral-500 shadow-xl';
      case 'editorial':
        return 'bg-neutral-950 border border-neutral-800 hover:border-neutral-400 shadow-md';
      case 'glass':
      default:
        return 'bg-neutral-900/60 backdrop-blur-md border border-neutral-800/80 hover:border-neutral-600 shadow-xl';
    }
  };

  const cardThemeClass = getCardThemeClasses(layoutSettings.cardTheme);

  if (filteredItems.length === 0) {
    return (
      <div className="py-20 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800/60 p-8">
        <Music className="w-12 h-12 mx-auto text-neutral-600 mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-neutral-300">ไม่พบผลงานที่ตรงกับการค้นหา</h3>
        <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
          ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อดูผลงานของ DJ Jefferson
        </p>
      </div>
    );
  }

  // 1. SPOTLIGHT LAYOUT
  if (activeLayout === 'spotlight') {
    const currentItem = filteredItems[spotlightIdx] || filteredItems[0];
    const episodeBadge = extractEpisodeBadge(currentItem.title);
    const readableDate = formatReadableDate(currentItem.date);

    return (
      <div className="space-y-6">
        {/* Main Spotlight Card */}
        <div
          className={`relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/90 shadow-2xl ${accent.glow} transition-all duration-500`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Media Poster */}
            <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto min-h-[380px] bg-black overflow-hidden group">
              <img
                src={currentItem.imageUrl}
                alt={currentItem.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-85" />

              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {(currentItem.videoUrl || currentItem.embedUrl) && (
                  <button
                    onClick={() =>
                      openVideoModal({
                        title: currentItem.title,
                        url: currentItem.videoUrl,
                        embedUrl: currentItem.embedUrl,
                        venue: currentItem.venue,
                        date: currentItem.date,
                      })
                    }
                    className={`p-4 rounded-full ${accent.bg} text-neutral-950 hover:scale-110 transition-transform shadow-2xl`}
                    aria-label={`Play ${currentItem.title}`}
                  >
                    <Play className="w-8 h-8 fill-neutral-950 ml-1" />
                  </button>
                )}
                <button
                  onClick={() =>
                    openImageModal({
                      title: currentItem.title,
                      url: currentItem.imageUrl,
                      caption: `${currentItem.venue} · ${currentItem.date}`,
                    })
                  }
                  className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 hover:scale-110 transition-transform"
                  aria-label="Zoom image"
                >
                  <Maximize2 className="w-6 h-6" />
                </button>
              </div>

              {/* Badges on Top */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {episodeBadge && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-amber-400 text-neutral-950 shadow-lg">
                    {episodeBadge}
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md ${accent.badge}`}
                >
                  {getCategoryLabel(currentItem.category)}
                </span>
                {currentItem.featured && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>FEATURED</span>
                  </span>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 mb-3">
                  <span className="flex items-center gap-1.5 text-neutral-300 font-semibold bg-neutral-800/80 px-2.5 py-1 rounded-lg border border-neutral-700/60">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{readableDate}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-300 font-semibold bg-neutral-800/80 px-2.5 py-1 rounded-lg border border-neutral-700/60">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{currentItem.venue} ({currentItem.city})</span>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-['Syne',sans-serif] text-white tracking-tight leading-tight">
                  {currentItem.title}
                </h3>

                <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
                  {currentItem.description}
                </p>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {currentItem.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-neutral-800 text-neutral-300 border border-neutral-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Editor Controls */}
              <div className="mt-8 pt-6 border-t border-neutral-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {(currentItem.videoUrl || currentItem.embedUrl) && (
                      <button
                        onClick={() =>
                          openVideoModal({
                            title: currentItem.title,
                            url: currentItem.videoUrl,
                            embedUrl: currentItem.embedUrl,
                            venue: currentItem.venue,
                            date: currentItem.date,
                          })
                        }
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg} hover:brightness-110 transition-all shadow-lg active:scale-95`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>กดรับชมวิดีโอ (Watch Session)</span>
                      </button>
                    )}
                    <button
                      onClick={() =>
                        openImageModal({
                          title: currentItem.title,
                          url: currentItem.imageUrl,
                          caption: `${currentItem.venue} · ${currentItem.date}`,
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>ดูภาพโปสเตอร์</span>
                    </button>
                  </div>

                  {/* Next / Prev Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setSpotlightIdx((prev) =>
                          prev === 0 ? filteredItems.length - 1 : prev - 1
                        )
                      }
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      aria-label="Previous work"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-neutral-400 px-1">
                      {spotlightIdx + 1} / {filteredItems.length}
                    </span>
                    <button
                      onClick={() =>
                        setSpotlightIdx((prev) =>
                          prev === filteredItems.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      aria-label="Next work"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Direct Editor Actions Bar in Spotlight */}
                {isEditorMode && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-300 font-bold flex items-center gap-1.5">
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>ควบคุมผลงานนี้ (Editor)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFeatured(currentItem.id)}
                        className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                          currentItem.featured
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'border-neutral-700 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Star className="w-3 h-3 fill-current" />
                        <span>{currentItem.featured ? 'Featured แล้ว' : 'ตั้ง Featured'}</span>
                      </button>
                      <button
                        onClick={() => handleStartEditItem(currentItem)}
                        className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>แก้ไขข้อมูล</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบผลงาน "${currentItem.title}" ใช่หรือไม่?`)) {
                            deleteItem(currentItem.id);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {filteredItems.map((item, idx) => {
            const badge = extractEpisodeBadge(item.title);
            return (
              <button
                key={item.id}
                onClick={() => setSpotlightIdx(idx)}
                className={`relative flex-shrink-0 w-24 h-28 rounded-xl overflow-hidden border transition-all ${
                  spotlightIdx === idx
                    ? `ring-2 ring-white scale-105 border-transparent ${accent.glow}`
                    : 'opacity-50 hover:opacity-100 border-neutral-800'
                }`}
                title={item.title}
              >
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                {badge && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400 text-black">
                    {badge}
                  </span>
                )}
                <span className="absolute bottom-1 left-1.5 right-1.5 text-[10px] font-mono text-white truncate text-left">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. FILMSTRIP / CAROUSEL LAYOUT
  if (activeLayout === 'filmstrip') {
    return (
      <div className="relative">
        <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-thin">
          {filteredItems.map((item) => {
            const episodeBadge = extractEpisodeBadge(item.title);
            const readableDate = formatReadableDate(item.date);

            return (
              <div
                key={item.id}
                className={`flex-shrink-0 w-[300px] sm:w-[340px] snap-center rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col justify-between ${cardThemeClass}`}
              >
                {/* Media Image */}
                <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-85" />

                  {/* Video Play Button Overlay */}
                  {(item.videoUrl || item.embedUrl) && (
                    <button
                      onClick={() =>
                        openVideoModal({
                          title: item.title,
                          url: item.videoUrl,
                          embedUrl: item.embedUrl,
                          venue: item.venue,
                          date: item.date,
                        })
                      }
                      className={`absolute inset-0 m-auto w-14 h-14 rounded-full ${accent.bg} text-neutral-950 flex items-center justify-center shadow-2xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all z-10`}
                      aria-label={`Play ${item.title}`}
                    >
                      <Play className="w-6 h-6 fill-neutral-950 ml-0.5" />
                    </button>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <div className="flex items-center gap-1.5">
                      {episodeBadge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-400 text-neutral-950 shadow-md">
                          {episodeBadge}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase backdrop-blur-md ${accent.badge}`}
                      >
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        openImageModal({
                          title: item.title,
                          url: item.imageUrl,
                          caption: `${item.venue} · ${item.date}`,
                        })
                      }
                      className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition-colors"
                      aria-label="View poster"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Venue and Date Bar */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-neutral-300">
                    <span className="flex items-center gap-1 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.venue}</span>
                    </span>
                    <span className="text-neutral-400">{readableDate}</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-amber-400 transition-colors font-['Syne',sans-serif]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions & Editor Strip */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                    <div className="flex items-center justify-between gap-2">
                      {(item.videoUrl || item.embedUrl) ? (
                        <button
                          onClick={() =>
                            openVideoModal({
                              title: item.title,
                              url: item.videoUrl,
                              embedUrl: item.embedUrl,
                              venue: item.venue,
                              date: item.date,
                            })
                          }
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold text-neutral-950 ${accent.bg} hover:brightness-110 shadow-sm`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>กดรับชมวิดีโอ</span>
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            openImageModal({
                              title: item.title,
                              url: item.imageUrl,
                              caption: `${item.venue} · ${item.date}`,
                            })
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>ดูภาพขยาย</span>
                        </button>
                      )}
                    </div>

                    {isEditorMode && (
                      <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[11px] font-mono">
                        <button
                          onClick={() => handleStartEditItem(item)}
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          onClick={() => toggleFeatured(item.id)}
                          className={`flex items-center gap-1 ${item.featured ? 'text-amber-400' : 'text-neutral-500'}`}
                        >
                          <Star className="w-3 h-3 fill-current" />
                          <span>Featured</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`ลบผลงาน "${item.title}"?`)) deleteItem(item.id);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          ลบ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. SCHEDULE / TOUR TABLE LAYOUT
  if (activeLayout === 'schedule') {
    return (
      <div className={`rounded-2xl overflow-hidden border border-neutral-800 ${cardThemeClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-900/90 border-b border-neutral-800 text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">วันที่ (Date)</th>
                <th className="py-3 px-4">ตอน / ผลงาน (Title & Episode)</th>
                <th className="py-3 px-4">สถานที่ (Venue & City)</th>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4 text-right">แอคชั่น (Watch / Artwork)</th>
                {isEditorMode && <th className="py-3 px-4 text-center">จัดการ (Editor)</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {filteredItems.map((item) => {
                const episodeBadge = extractEpisodeBadge(item.title);
                const readableDate = formatReadableDate(item.date);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-900/50 transition-colors group cursor-pointer"
                    onClick={() => {
                      if (item.videoUrl || item.embedUrl) {
                        openVideoModal({
                          title: item.title,
                          url: item.videoUrl,
                          embedUrl: item.embedUrl,
                          venue: item.venue,
                          date: item.date,
                        });
                      } else {
                        openImageModal({
                          title: item.title,
                          url: item.imageUrl,
                          caption: `${item.venue} · ${item.date}`,
                        });
                      }
                    }}
                  >
                    <td className="py-3.5 px-4 font-bold text-neutral-200 whitespace-nowrap">
                      <div>{readableDate}</div>
                      <div className="text-[10px] text-neutral-500 font-normal">{item.date}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0 border border-neutral-700/60 relative">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                          {episodeBadge && (
                            <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-black bg-amber-400 text-black">
                              {episodeBadge}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {episodeBadge && (
                              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-neutral-950">
                                {episodeBadge}
                              </span>
                            )}
                            <span className="font-bold text-white group-hover:text-amber-400 transition-colors font-sans text-sm">
                              {item.title}
                            </span>
                            {item.featured && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                                ★
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-400 line-clamp-1 font-sans mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                      <div className="font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.venue}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 ml-4.5">{item.city}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${accent.badge}`}
                      >
                        {getCategoryLabel(item.category)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {(item.videoUrl || item.embedUrl) && (
                          <button
                            onClick={() =>
                              openVideoModal({
                                title: item.title,
                                url: item.videoUrl,
                                embedUrl: item.embedUrl,
                                venue: item.venue,
                                date: item.date,
                              })
                            }
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg ${accent.bg} text-neutral-950 font-bold hover:brightness-110 transition-transform`}
                            title="กดรับชมวิดีโอ"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>ดูคลิป</span>
                          </button>
                        )}
                        <button
                          onClick={() =>
                            openImageModal({
                              title: item.title,
                              url: item.imageUrl,
                              caption: `${item.venue} · ${item.date}`,
                            })
                          }
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                          title="ดูโปสเตอร์เต็ม"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    {isEditorMode && (
                      <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartEditItem(item)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400"
                            title="แก้ไข"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`ลบผลงาน "${item.title}"?`)) deleteItem(item.id);
                            }}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            title="ลบ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 4. MASONRY COLLAGE LAYOUT
  if (activeLayout === 'masonry') {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
        {filteredItems.map((item, idx) => {
          const episodeBadge = extractEpisodeBadge(item.title);
          const readableDate = formatReadableDate(item.date);

          return (
            <div
              key={item.id}
              className={`break-inside-avoid rounded-2xl overflow-hidden group transition-all duration-300 ${cardThemeClass}`}
            >
              <div className="relative bg-neutral-900 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                    idx % 3 === 0 ? 'aspect-[3/4]' : idx % 3 === 1 ? 'aspect-[4/5]' : 'aspect-square'
                  }`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-85" />

                {/* Quick Play Trigger */}
                {(item.videoUrl || item.embedUrl) && (
                  <button
                    onClick={() =>
                      openVideoModal({
                        title: item.title,
                        url: item.videoUrl,
                        embedUrl: item.embedUrl,
                        venue: item.venue,
                        date: item.date,
                      })
                    }
                    className={`absolute top-3 right-3 p-2.5 rounded-full ${accent.bg} text-neutral-950 shadow-xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all z-10`}
                    aria-label={`Play ${item.title}`}
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                )}

                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  {episodeBadge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-400 text-neutral-950 shadow-md">
                      {episodeBadge}
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase backdrop-blur-md ${accent.badge}`}
                  >
                    {getCategoryLabel(item.category)}
                  </span>
                </div>

                {/* Bottom Info Overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-[11px] font-mono text-neutral-300 flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{item.venue}</span>
                    </span>
                    <span className="text-neutral-400">{readableDate}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors font-['Syne',sans-serif] leading-tight">
                    {item.title}
                  </h4>
                </div>
              </div>

              <div className="p-3.5 space-y-2.5 border-t border-neutral-800/60">
                <p className="text-xs text-neutral-400 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between pt-1">
                  {(item.videoUrl || item.embedUrl) ? (
                    <button
                      onClick={() =>
                        openVideoModal({
                          title: item.title,
                          url: item.videoUrl,
                          embedUrl: item.embedUrl,
                          venue: item.venue,
                          date: item.date,
                        })
                      }
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-neutral-950 ${accent.bg} hover:brightness-110`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>ชมวิดีโอ</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-neutral-500">Artwork Poster</span>
                  )}

                  <button
                    onClick={() =>
                      openImageModal({
                        title: item.title,
                        url: item.imageUrl,
                        caption: `${item.venue} · ${item.date}`,
                      })
                    }
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-mono"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>ขยายภาพ</span>
                  </button>
                </div>

                {isEditorMode && (
                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                    <button
                      onClick={() => handleStartEditItem(item)}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>แก้ไข</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`ลบผลงาน "${item.title}"?`)) deleteItem(item.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      ลบ
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 5. STANDARD EDITORIAL GRID LAYOUT (Default - Highly readable & easy to watch)
  const gridColClass =
    layoutSettings.gridColumns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : layoutSettings.gridColumns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridColClass} gap-6`}>
      {filteredItems.map((item) => {
        const episodeBadge = extractEpisodeBadge(item.title);
        const readableDate = formatReadableDate(item.date);

        return (
          <div
            key={item.id}
            className={`group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${cardThemeClass}`}
          >
            {/* Media Header */}
            <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-85" />

              {/* Badges on Top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5">
                  {episodeBadge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-400 text-neutral-950 shadow-md">
                      {episodeBadge}
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase backdrop-blur-md ${accent.badge}`}
                  >
                    {getCategoryLabel(item.category)}
                  </span>
                </div>

                {item.featured && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                    <Sparkles className="w-3 h-3" />
                    <span>FEATURED</span>
                  </span>
                )}
              </div>

              {/* Play Button Center Hover */}
              {(item.videoUrl || item.embedUrl) && (
                <button
                  onClick={() =>
                    openVideoModal({
                      title: item.title,
                      url: item.videoUrl,
                      embedUrl: item.embedUrl,
                      venue: item.venue,
                      date: item.date,
                    })
                  }
                  className={`absolute inset-0 m-auto w-16 h-16 rounded-full ${accent.bg} text-neutral-950 flex items-center justify-center shadow-2xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all z-10`}
                  aria-label={`Play ${item.title}`}
                >
                  <Play className="w-7 h-7 fill-neutral-950 ml-0.5" />
                </button>
              )}

              {/* Bottom Meta on Media */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-neutral-300">
                <div className="flex items-center gap-1.5 font-bold bg-neutral-950/70 backdrop-blur-md px-2 py-1 rounded-md border border-neutral-800">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.venue} ({item.city})</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-300 bg-neutral-950/70 backdrop-blur-md px-2 py-1 rounded-md border border-neutral-800">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{readableDate}</span>
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {episodeBadge && (
                    <span className="text-xs font-mono font-bold text-amber-400">
                      [{episodeBadge}]
                    </span>
                  )}
                  <h4 className="font-bold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors font-['Syne',sans-serif] leading-snug line-clamp-1">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Action Area: Clear & Inviting */}
              <div className="space-y-3 pt-3 border-t border-neutral-800/80">
                <div className="flex items-center justify-between gap-2">
                  {(item.videoUrl || item.embedUrl) ? (
                    <button
                      onClick={() =>
                        openVideoModal({
                          title: item.title,
                          url: item.videoUrl,
                          embedUrl: item.embedUrl,
                          venue: item.venue,
                          date: item.date,
                        })
                      }
                      className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg} hover:brightness-110 shadow-lg active:scale-95 transition-all`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>กดรับชมวิดีโอ (Watch Session)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        openImageModal({
                          title: item.title,
                          url: item.imageUrl,
                          caption: `${item.venue} · ${item.date}`,
                        })
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>ดูภาพโปสเตอร์ (View Artwork)</span>
                    </button>
                  )}

                  <button
                    onClick={() =>
                      openImageModal({
                        title: item.title,
                        url: item.imageUrl,
                        caption: `${item.venue} · ${item.date}`,
                      })
                    }
                    className="p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title="ขยายโปสเตอร์"
                    aria-label="Enlarge poster"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Direct Editor Actions Bar on Card */}
                {isEditorMode && (
                  <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono bg-amber-500/5 -mx-5 -mb-5 px-5 py-2.5">
                    <button
                      onClick={() => handleStartEditItem(item)}
                      className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>แก้ไข</span>
                    </button>
                    <button
                      onClick={() => toggleFeatured(item.id)}
                      className={`inline-flex items-center gap-1 ${item.featured ? 'text-amber-300 font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{item.featured ? 'Featured' : 'ตั้งเด่น'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`คุณต้องการลบ "${item.title}" ออกจากคลังใช่หรือไม่?`)) {
                          deleteItem(item.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ลบ</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
