import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/portfolioLogic';
import { ArrowDown, Play, Sparkles, Disc, Radio, Eye } from 'lucide-react';

export const HeroIntro: React.FC = () => {
  const { profile, layoutSettings, openImageModal, openVideoModal, portfolioItems, isEditorMode } = usePortfolio();
  const accent = getAccentClasses(layoutSettings.accentColor);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  const featuredLive = portfolioItems.find((p) => p.featured && p.videoUrl) || portfolioItems[0];

  return (
    <section
      id="hero"
      className={`relative min-h-screen pb-16 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        isEditorMode ? 'pt-36 sm:pt-44' : 'pt-28 sm:pt-32'
      }`}
    >
      {/* Background ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-neutral-800/40 blur-3xl pointer-events-none rounded-full" />

      {/* Main Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center relative z-10 pt-4 sm:pt-8">
        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 backdrop-blur-md mb-6">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accent.bg} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${accent.bg}`} />
          </span>
          <span className="text-[11px] font-mono font-medium tracking-widest uppercase text-neutral-300">
            TOUR 2026 · LIVE SESSIONS & RECAPPED STAGES
          </span>
        </div>

        {/* Giant Monogram / Stage Name */}
        <h1 className="text-[2.2rem] sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight font-['Syne',sans-serif] uppercase text-white drop-shadow-2xl select-none leading-none max-w-full">
          {profile.stageName}
        </h1>

        {/* Tagline */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg font-mono tracking-widest uppercase text-neutral-400 max-w-2xl mx-auto">
          {profile.tagline || 'WELCOME TO MY PORTFOLIO'}
        </p>

        {/* Bio quote summary */}
        <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto line-clamp-2">
          {profile.bioText}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-neutral-950 font-bold text-sm tracking-wider uppercase hover:bg-neutral-200 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
          >
            <span>สำรวจคลังผลงาน</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          {featuredLive && (
            <button
              onClick={() =>
                openVideoModal({
                  title: featuredLive.title,
                  url: featuredLive.videoUrl,
                  embedUrl: featuredLive.embedUrl,
                  venue: featuredLive.venue,
                  date: featuredLive.date,
                })
              }
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>ชม Live Session ล่าสุด</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 Vertical Portrait Sequence (Authentic to DJ Jefferson's Portfolio) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 sm:mt-16 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {profile.heroImages.map((imgUrl, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setActivePhotoIdx(idx)}
              onMouseLeave={() => setActivePhotoIdx(null)}
              onClick={() =>
                openImageModal({
                  title: `${profile.stageName} — Editorial Look ${idx + 1}`,
                  url: imgUrl,
                  caption: `Official promotional portraits · 2026 Collection (Pose ${idx + 1}/5)`,
                })
              }
              className={`group relative aspect-[3/5] rounded-2xl overflow-hidden bg-neutral-900 border transition-all duration-500 cursor-pointer shadow-lg ${
                activePhotoIdx === idx
                  ? `scale-[1.03] -translate-y-2 border-neutral-400 z-20 ${accent.glow}`
                  : 'border-neutral-800/80 hover:border-neutral-600'
              }`}
            >
              <img
                src={imgUrl}
                alt={`${profile.stageName} portrait ${idx + 1}`}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 filter contrast-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />

              {/* Hover Badge */}
              <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Eye className="w-3.5 h-3.5 text-white" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-neutral-300">
                <span className="font-bold">0{idx + 1}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase text-[10px] tracking-wider">
                  View Full
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Genre Ticker Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 relative z-10">
        <div className="py-4 border-y border-neutral-800/80 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono tracking-widest text-neutral-400">
          <span className="text-neutral-500 font-bold uppercase mr-1">GENRES:</span>
          {profile.genres.map((genre, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800/80 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
            >
              <span>{genre}</span>
              {idx < profile.genres.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-neutral-600" />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
