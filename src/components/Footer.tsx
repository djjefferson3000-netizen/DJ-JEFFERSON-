import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/portfolioLogic';
import { ArrowUp, Settings, Heart, Music2, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { profile, layoutSettings, setIsAdminOpen, isEditorMode } = usePortfolio();
  const accent = getAccentClasses(layoutSettings.accentColor);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-neutral-900 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-900">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black font-['Syne',sans-serif] text-white tracking-wider">
                {profile.stageName}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${accent.badge}`}>
                OFFICIAL PORTFOLIO
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              Musician, DJ & Creative Performer · {profile.location}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {isEditorMode && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>ระบบจัดการหลังบ้าน (CMS)</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>กลับขึ้นด้านบน</span>
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
          <div>
            © 2026 {profile.stageName} ({profile.fullName}). All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by Custom Dynamic CMS & Layout Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
