import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/portfolioLogic';
import {
  Edit3,
  Plus,
  Sliders,
  Share2,
  Eye,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';

export const EditorBanner: React.FC = () => {
  const {
    isEditorMode,
    setIsEditorMode,
    setIsAdminOpen,
    setIsShareLinksOpen,
    handleStartAddItem,
    layoutSettings,
    portfolioItems,
  } = usePortfolio();

  const accent = getAccentClasses(layoutSettings.accentColor);

  if (!isEditorMode) return null;

  const handleExitEditor = () => {
    setIsEditorMode(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="relative z-50 bg-gradient-to-r from-amber-950/90 via-neutral-900/95 to-neutral-950 border-b border-amber-500/40 text-neutral-100 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Mode indicator */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <div className="flex items-center gap-2">
            <span className="font-bold font-mono tracking-wider text-amber-300 uppercase">
              โหมดผู้แก้ไข (EDITOR MODE)
            </span>
            <span className="hidden sm:inline text-neutral-400 font-mono">
              — คุณสามารถกดปุ่มแก้ไขบนการ์ดผลงาน หรือจัดการเนื้อหาผ่าน CMS ได้ทันที
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleStartAddItem}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-neutral-950 ${accent.bg} hover:brightness-110 transition-all shadow-sm`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มผลงาน</span>
          </button>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>จัดการหลังบ้าน CMS</span>
          </button>

          <button
            onClick={() => setIsShareLinksOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
            title="ดูและคัดลอกลิงก์ 2 โหมด"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>แชร์ลิงก์ 2 โหมด</span>
          </button>

          <button
            onClick={handleExitEditor}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="สลับไปมุมมองผู้ชมทั่วไป"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">ดูแบบผู้ชม</span>
          </button>
        </div>
      </div>
    </div>
  );
};
