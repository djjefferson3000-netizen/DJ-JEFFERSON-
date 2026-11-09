import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/portfolioLogic';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Edit3,
  Sparkles,
  ShieldCheck,
  Globe,
  Share2,
} from 'lucide-react';

export const ShareLinksModal: React.FC = () => {
  const {
    isShareLinksOpen,
    setIsShareLinksOpen,
    shareLinks,
    isEditorMode,
    setIsEditorMode,
    layoutSettings,
  } = usePortfolio();

  const [copiedType, setCopiedType] = useState<'viewer' | 'editor' | null>(null);
  const accent = getAccentClasses(layoutSettings.accentColor);

  if (!isShareLinksOpen) return null;

  const handleCopy = (url: string, type: 'viewer' | 'editor') => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setIsShareLinksOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${accent.bg} text-neutral-950 font-bold`}>
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Syne',sans-serif] text-white flex items-center gap-2">
                <span>แชร์ลิงก์พอร์ตโฟลิโอ 2 รูปแบบ</span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                แยกชัดเจนระหว่างลิงก์สำหรับผู้ชมทั่วไป และลิงก์สำหรับผู้มีสิทธิ์แก้ไข
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsShareLinksOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close share links modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Link 1: Viewer Mode */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Globe className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>1. ลิงก์สำหรับผู้ชมทั่วไป (Visitor Link)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  แนะนำสำหรับแชร์
                </span>
              </h3>
            </div>
            <span className="text-xs text-neutral-500 font-mono">View-Only</span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            หน้าพอร์ตโฟลิโอสะอาดตา สวยงาม ลื่นไหล ไม่มีปุ่มหลังบ้านกวนสายตา เหมาะสำหรับส่งให้ผู้จัดงาน ผู้ว่าจ้าง คลับ และแฟนคลับ
          </p>

          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 truncate">
              {shareLinks.viewerUrl}
            </div>
            <button
              onClick={() => handleCopy(shareLinks.viewerUrl, 'viewer')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            >
              {copiedType === 'viewer' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">คัดลอกแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอก</span>
                </>
              )}
            </button>
            <a
              href={shareLinks.viewerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="เปิดในแท็บใหม่"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Link 2: Editor Mode */}
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-amber-500/30 space-y-3 hover:border-amber-500/50 transition-colors bg-gradient-to-br from-amber-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Edit3 className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>2. ลิงก์สำหรับผู้แก้ไขเนื้อหา (Editor Link)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  สำหรับเจ้าของ / ผู้ดูแล
                </span>
              </h3>
            </div>
            <span className="text-xs text-amber-400 font-mono">Editor CMS</span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            เปิดหน้าเว็บพร้อมแถบเครื่องมือแก้ไขด้านบน และปุ่ม <span className="text-amber-400 font-semibold">✏️ แก้ไข</span> / <span className="text-red-400 font-semibold">🗑️ ลบ</span> บนการ์ดผลงานแต่ละใบโดยตรง พร้อมเข้าสู่ระบบจัดการหลังบ้าน (CMS) ได้ทันที
          </p>

          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-amber-300 truncate">
              {shareLinks.editorUrl}
            </div>
            <button
              onClick={() => handleCopy(shareLinks.editorUrl, 'editor')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg} hover:brightness-110 transition-all shadow-md`}
            >
              {copiedType === 'editor' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>คัดลอกแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอก</span>
                </>
              )}
            </button>
            <a
              href={shareLinks.editorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="เปิดในแท็บใหม่"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Quick toggle in-place */}
          <div className="pt-2 flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-neutral-800/80">
            <span>สถานะปัจจุบันของคุณ:</span>
            <button
              onClick={() => {
                setIsEditorMode(!isEditorMode);
                // Also update URL query without full reload
                const url = new URL(window.location.href);
                if (!isEditorMode) {
                  url.searchParams.set('admin', '1');
                } else {
                  url.searchParams.delete('admin');
                }
                window.history.replaceState({}, '', url.toString());
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                isEditorMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {isEditorMode ? '✓ อยู่ในโหมดผู้แก้ไข (คลิกเพื่อสลับเป็นผู้ชม)' : 'โหมดผู้ชม (คลิกเพื่อเปิดโหมดแก้ไข)'}
            </button>
          </div>
        </div>

        {/* Quick Footer Note */}
        <div className="p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            เคล็ดลับ: เมื่อต้องการส่งพอร์ตโฟลิโอให้ผู้จัดงาน แนะนำให้ส่ง <strong className="text-white">ลิงก์ที่ 1 (Visitor Link)</strong> ส่วนตัวคุณเองสามารถบุ๊คมาร์ก <strong className="text-amber-400">ลิงก์ที่ 2 (Editor Link)</strong> ไว้สำหรับอัปเดตผลงานใหม่ได้ตลอดเวลา
          </span>
        </div>
      </div>
    </div>
  );
};
