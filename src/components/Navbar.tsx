import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/portfolioLogic';
import {
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Settings,
  Calendar,
  Menu,
  X,
  LayoutGrid,
  Columns,
  ListOrdered,
  Film,
  Sparkles,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { LayoutMode } from '../types/portfolio';
import { EditorBanner } from './EditorBanner';

export const Navbar: React.FC = () => {
  const {
    profile,
    layoutSettings,
    activeLayout,
    setActiveLayout,
    setIsAdminOpen,
    setIsBookingOpen,
    setIsShareLinksOpen,
    isEditorMode,
    portfolioItems,
  } = usePortfolio();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [layoutDropdownOpen, setLayoutDropdownOpen] = useState(false);
  const [isAudioSimulated, setIsAudioSimulated] = useState(false);

  const accent = getAccentClasses(layoutSettings.accentColor);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const layoutIcons: Record<LayoutMode, { icon: React.ReactNode; label: string }> = {
    grid: { icon: <LayoutGrid className="w-4 h-4" />, label: 'Editorial Grid' },
    masonry: { icon: <Columns className="w-4 h-4" />, label: 'Masonry Collage' },
    filmstrip: { icon: <Film className="w-4 h-4" />, label: 'Filmstrip Flow' },
    schedule: { icon: <ListOrdered className="w-4 h-4" />, label: 'Tour Table' },
    spotlight: { icon: <Sparkles className="w-4 h-4" />, label: 'Hero Spotlight' },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || isEditorMode
          ? 'bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800/80 shadow-2xl'
          : 'bg-transparent py-2'
      }`}
    >
      <EditorBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Stage Name */}
          <a
            href="#hero"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="DJ JEFFERSON Home"
          >
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full border border-neutral-700 overflow-hidden flex items-center justify-center bg-neutral-900 group-hover:scale-105 transition-transform duration-300 ${accent.hoverBorder}`}
              >
                <img
                  src={profile.bannerUrl || profile.avatarUrl}
                  alt={profile.stageName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${accent.bg} ring-2 ring-neutral-950`}
              />
            </div>
            <div>
              <span className="font-extrabold tracking-widest text-lg sm:text-xl font-['Syne',sans-serif] uppercase text-neutral-100 flex items-center gap-1.5">
                {profile.stageName}
                <span className={`text-xs px-1.5 py-0.5 rounded font-mono font-medium ${accent.badge}`}>
                  2026
                </span>
              </span>
              <p className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase -mt-0.5">
                {profile.nickname ? `aka ${profile.nickname} · ` : ''}Thailand
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <a
              href="#portfolio"
              className="px-3 py-1.5 text-xs lg:text-sm font-medium text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors whitespace-nowrap flex items-center"
            >
              <span>คลังผลงาน</span>
              <span className="ml-1.5 text-[11px] font-mono text-neutral-400">
                ({portfolioItems.length})
              </span>
            </a>
            <a
              href="#experience"
              className="px-3 py-1.5 text-xs lg:text-sm font-medium text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors whitespace-nowrap"
            >
              Club & Festival Tour
            </a>
            <a
              href="#about"
              className="px-3 py-1.5 text-xs lg:text-sm font-medium text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors whitespace-nowrap"
            >
              ประวัติ & Contact
            </a>

            {/* Layout Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLayoutDropdownOpen(!layoutDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all duration-200 ${
                  layoutDropdownOpen
                    ? 'border-neutral-500 bg-neutral-800 text-white'
                    : 'border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:border-neutral-700'
                }`}
                title="เปลี่ยนรูปแบบเลย์เอาต์คลังผลงาน"
                aria-expanded={layoutDropdownOpen}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>เลย์เอาต์:</span>
                <span className={accent.text}>{layoutIcons[activeLayout].label}</span>
              </button>

              {layoutDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setLayoutDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800 mb-1">
                    เลือกรูปแบบแสดงผลงาน
                  </div>
                  {(Object.keys(layoutIcons) as LayoutMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setActiveLayout(mode);
                        setLayoutDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                        activeLayout === mode
                          ? `${accent.badge} font-bold`
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {layoutIcons[mode].icon}
                        <span>{layoutIcons[mode].label}</span>
                      </div>
                      {activeLayout === mode && (
                        <span className={`w-1.5 h-1.5 rounded-full ${accent.bg}`} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Vibe Pulse Toggle */}
            <button
              onClick={() => setIsAudioSimulated(!isAudioSimulated)}
              className={`p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all ${
                isAudioSimulated ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' : ''
              }`}
              title={isAudioSimulated ? 'ปิดคลื่นจำลองเสียง (Beat Wave)' : 'เปิดคลื่นจำลองเสียง (Beat Wave)'}
              aria-label="Toggle audio vibe"
            >
              {isAudioSimulated ? (
                <div className="flex items-center gap-1">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-full bg-amber-400 animate-pulse" />
                    <span className="w-0.5 h-2 bg-amber-400 animate-pulse delay-75" />
                    <span className="w-0.5 h-3 bg-amber-400 animate-pulse delay-150" />
                  </div>
                </div>
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Share 2 Links Modal Button (Only in Editor Mode) */}
            {isEditorMode && (
              <button
                onClick={() => setIsShareLinksOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 hover:border-neutral-700 transition-all"
                title="แชร์ลิงก์สำหรับผู้ชม หรือสำหรับผู้แก้ไข"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>แชร์ลิงก์ 2 โหมด</span>
              </button>
            )}

            {/* Booking Inquiry */}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>ติดต่อจองคิวแสดง</span>
            </button>

            {/* Admin Back-Office Button (Only in Editor Mode) */}
            {isEditorMode && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-neutral-950 transition-all shadow-md active:scale-95 ${accent.bg} hover:brightness-110`}
                aria-label="เปิดระบบจัดการหลังบ้าน"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>จัดการ CMS</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1.5 md:hidden">
            {isEditorMode && (
              <>
                <button
                  onClick={() => setIsShareLinksOpen(true)}
                  className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 hover:text-white"
                  title="แชร์ลิงก์ 2 โหมด"
                  aria-label="Share links"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className={`p-2 rounded-lg text-neutral-950 ${accent.bg}`}
                  title="Admin CMS"
                  aria-label="Admin CMS"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-neutral-900/95 border border-neutral-800 backdrop-blur-xl shadow-2xl space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col space-y-1">
              <a
                href="#portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-200 hover:bg-neutral-800"
              >
                คลังผลงาน ({portfolioItems.length})
              </a>
              <a
                href="#experience"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-200 hover:bg-neutral-800"
              >
                Club & Festival Tour
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-200 hover:bg-neutral-800"
              >
                ประวัติ & Contact
              </a>
            </div>

            <div className="border-t border-neutral-800 pt-3">
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
                รูปแบบเลย์เอาต์
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(layoutIcons) as LayoutMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setActiveLayout(mode);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border text-left ${
                      activeLayout === mode
                        ? `${accent.badge} font-bold`
                        : 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {layoutIcons[mode].icon}
                    <span>{layoutIcons[mode].label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-3 flex flex-col gap-2">
              {isEditorMode && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsShareLinksOpen(true);
                  }}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-neutral-900 border border-neutral-700 text-cyan-300 text-center flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>แชร์ลิงก์ 2 รูปแบบ (ผู้ชม / ผู้แก้ไข)</span>
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsBookingOpen(true);
                  }}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-neutral-800 text-neutral-200 text-center hover:bg-neutral-700"
                >
                  ติดต่อจองคิวแสดง
                </button>
                {isEditorMode && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAdminOpen(true);
                    }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold text-neutral-950 text-center ${accent.bg}`}
                  >
                    ระบบจัดการหลังบ้าน
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
