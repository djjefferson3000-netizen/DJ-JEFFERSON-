import React, { useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/portfolioLogic';
import {
  Music,
  Award,
  MapPin,
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar,
  Building2,
} from 'lucide-react';

export const WorkExperienceSection: React.FC = () => {
  const { clubs, festivals, layoutSettings, openImageModal } = usePortfolio();
  const accent = getAccentClasses(layoutSettings.accentColor);

  // Group clubs by location/province for effortless readability
  const groupedClubs = useMemo(() => {
    const groups: Record<string, typeof clubs> = {};
    clubs.forEach((club) => {
      const loc = club.location || 'มหาสารคาม (Mahasarakham)';
      if (!groups[loc]) groups[loc] = [];
      groups[loc].push(club);
    });
    return groups;
  }, [clubs]);

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase ${accent.badge}`}
          >
            EXPERIENCE & STAGES
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] uppercase text-white tracking-tight">
            WORK EXPERIENCE
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            เส้นทางการแสดงในคลับชั้นนำและเวทีเฟสติวัล จัดหมวดหมู่แยกตามจังหวัดให้อ่านและติดตามได้ง่าย
          </p>
        </div>

        {/* Big Tour Banner Artwork (from reference site) */}
        <div className="rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 group shadow-2xl relative">
          <div className="relative aspect-[16/7] sm:aspect-[21/9] max-h-[420px] overflow-hidden">
            <img
              src="https://cdn.myportfolio.com/b76f0844-9acf-432f-b53b-d42b3b42a0d6/f25f9fcc-0d1f-43ca-95b9-240edaa7d375_rw_1920.png?h=6e77c836ae3e6689cead1ff8cfb871a9"
              alt="DJ Jefferson Tour Banner"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold">
                  OFFICIAL TOUR EXPERIENCE
                </span>
                <h3 className="text-xl sm:text-3xl font-black font-['Syne',sans-serif] text-white">
                  CLUB RESIDENCIES & FESTIVALS 2025–2026
                </h3>
              </div>
              <button
                onClick={() =>
                  openImageModal({
                    title: 'DJ JEFFERSON Official Tour Experience Artwork',
                    url: 'https://cdn.myportfolio.com/b76f0844-9acf-432f-b53b-d42b3b42a0d6/f25f9fcc-0d1f-43ca-95b9-240edaa7d375_rw_1920.png?h=6e77c836ae3e6689cead1ff8cfb871a9',
                    caption: 'High-res tour visual showcase banner',
                  })
                }
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-950/80 hover:bg-neutral-900 text-white border border-neutral-700/80 backdrop-blur-md transition-all"
              >
                ดูภาพแบนเนอร์เต็ม
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Clubs (Grouped by Province) & Festivals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Club Experience (Grouped by Province) */}
          <div className="lg:col-span-7 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 p-6 sm:p-8 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${accent.badge}`}>
                  <Music className="w-5 h-5 text-current" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-['Syne',sans-serif] text-white">
                    CLUB EXPERIENCE
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    คลับ & บาร์ประจำ (แยกตามจังหวัดให้อ่านง่าย)
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300">
                {clubs.length} Venues
              </span>
            </div>

            {/* Render grouped provinces */}
            <div className="space-y-6">
              {Object.entries(groupedClubs).map(([location, venues]) => (
                <div key={location} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{location}</span>
                    <span className="text-neutral-500 font-normal">({venues.length} แห่ง)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {venues.map((club) => (
                      <div
                        key={club.id}
                        className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                          club.highlight
                            ? 'bg-neutral-900/90 border-neutral-700 hover:border-amber-400/60'
                            : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2
                            className={`w-4 h-4 flex-shrink-0 ${club.highlight ? accent.text : 'text-neutral-500'}`}
                          />
                          <div>
                            <span className="font-bold text-sm text-neutral-100 group-hover:text-white transition-colors block font-sans">
                              {club.name}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-400">
                              {club.location}
                            </span>
                          </div>
                        </div>
                        {club.highlight && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Residency
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Festival Experience (Songkran & Special Events) */}
          <div className="lg:col-span-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-['Syne',sans-serif] text-white">
                      EVENT & FESTIVALS
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      เวทีเฟสติวัลและสเตจสงกรานต์ 2025–2026
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300">
                  {festivals.length} Stages
                </span>
              </div>

              <div className="space-y-3">
                {festivals.map((fest) => (
                  <div
                    key={fest.id}
                    className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {fest.year}
                      </span>
                      <span className="text-neutral-400 font-semibold">{fest.role || 'Mainstage DJ'}</span>
                    </div>
                    <div className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {fest.title}
                    </div>
                    {fest.location && (
                      <div className="text-[11px] font-mono text-neutral-400 mt-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{fest.location}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-neutral-800 text-center">
              <span className="text-xs font-mono text-neutral-400">
                พร้อมรับงานเทศกาล คลับปาร์ตี้ งานเลี้ยง และ Private Events ทั่วประเทศ
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
