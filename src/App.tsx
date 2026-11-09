import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroIntro } from './components/HeroIntro';
import { LayoutCustomizerBar } from './components/LayoutCustomizerBar';
import { PortfolioGallery } from './components/PortfolioGallery';
import { WorkExperienceSection } from './components/WorkExperienceSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { BookingInquiryModal } from './components/BookingInquiryModal';
import { AdminCMSModal } from './components/AdminCMSModal';
import { ShareLinksModal } from './components/ShareLinksModal';
import { getAccentClasses } from './utils/portfolioLogic';
import { SlidersHorizontal, Sparkles, Share2 } from 'lucide-react';

const PortfolioContent: React.FC = () => {
  const { layoutSettings, setIsAdminOpen, setIsShareLinksOpen, portfolioItems, isEditorMode } = usePortfolio();
  const accent = getAccentClasses(layoutSettings.accentColor);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero with authentic 5 photos sequence */}
        <HeroIntro />

        {/* Portfolio Gallery Section with Customizable Layout Engine */}
        <section id="portfolio" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase ${accent.badge}`}
                  >
                    DYNAMIC PORTFOLIO ARCHIVE
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    {portfolioItems.length} ITEMS LOADED
                  </span>
                </div>
                <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] uppercase text-white tracking-tight">
                  คลังผลงานออกแบบ & ดีเจเซ็ต
                </h2>
                <p className="mt-1 text-sm text-neutral-400 max-w-xl">
                  เลือกดู Live Sessions 15 ตอน, วิดีโอ Recap เฟสติวัล และภาพโปสเตอร์งานแสดง พร้อมปรับเปลี่ยนเลย์เอาต์การแสดงผลได้ตามใจชอบ
                </p>
              </div>

              {/* Quick Action Callouts (Only shown in Editor Mode) */}
              {isEditorMode && (
                <div className="self-start md:self-end flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsShareLinksOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 hover:border-neutral-700 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>แชร์ลิงก์ 2 โหมด</span>
                  </button>
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 hover:border-neutral-700 transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                    <span>ระบบหลังบ้าน CMS</span>
                  </button>
                </div>
              )}
            </div>

            {/* Layout Customizer Toolbar */}
            <LayoutCustomizerBar />

            {/* Dynamic Gallery View (Grid / Masonry / Filmstrip / Schedule / Spotlight) */}
            <PortfolioGallery />
          </div>
        </section>

        {/* Work Experience (Clubs & Festivals) */}
        <WorkExperienceSection />

        {/* Personal Info & About Me */}
        <AboutSection />
      </main>

      {/* Global Modals */}
      <VideoModal />
      <ImageLightboxModal />
      <BookingInquiryModal />
      <AdminCMSModal />
      <ShareLinksModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}
