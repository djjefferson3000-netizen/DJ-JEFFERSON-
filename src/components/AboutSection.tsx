import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/portfolioLogic';
import {
  User,
  Calendar,
  MapPin,
  Music,
  ExternalLink,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { profile, layoutSettings, setIsBookingOpen, openImageModal } = usePortfolio();
  const accent = getAccentClasses(layoutSettings.accentColor);

  return (
    <section id="about" className="py-20 relative overflow-hidden bg-neutral-950/60 border-t border-neutral-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Authentic Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              <div
                className={`relative aspect-[3/4] rounded-3xl overflow-hidden border border-neutral-700 bg-neutral-900 shadow-2xl ${accent.glow} cursor-pointer`}
                onClick={() =>
                  openImageModal({
                    title: `${profile.stageName} (${profile.fullName})`,
                    url: profile.avatarUrl,
                    caption: `Official bio portrait · ${profile.location}`,
                  })
                }
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.stageName}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold block">
                    ARTIST & PRODUCER
                  </span>
                  <h3 className="text-2xl font-black font-['Syne',sans-serif]">
                    {profile.stageName}
                  </h3>
                  <p className="text-xs text-neutral-300 font-mono mt-0.5">
                    {profile.fullName} ({profile.nickname})
                  </p>
                </div>
              </div>

              {/* Decorative Corner Badge */}
              <div
                className={`absolute -bottom-4 -right-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-700 text-white shadow-2xl flex items-center gap-3 backdrop-blur-xl`}
              >
                <div className={`p-2.5 rounded-xl ${accent.bg} text-neutral-950 font-bold`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-neutral-400 uppercase">EXPERIENCE</div>
                  <div className="text-base font-black font-['Syne',sans-serif]">SEASON 2026</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Personal Info */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase ${accent.badge}`}
              >
                PERSONAL INFORMATION
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black font-['Syne',sans-serif] uppercase text-white tracking-tight">
                ABOUT ME
              </h2>
            </div>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              {profile.bioText}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-800 text-neutral-300">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-neutral-400 uppercase">ชื่อจริง / นิคเนม</div>
                  <div className="text-sm font-bold text-white">
                    {profile.fullName} ({profile.nickname})
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-800 text-neutral-300">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-neutral-400 uppercase">วันเกิด (DOB)</div>
                  <div className="text-sm font-bold text-white font-mono">{profile.dob}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-800 text-neutral-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-neutral-400 uppercase">พื้นที่การทำงาน (Location)</div>
                  <div className="text-sm font-bold text-white">{profile.location}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-800 text-neutral-300">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-neutral-400 uppercase">สไตล์ดนตรีหลัก (Style)</div>
                  <div className="text-sm font-bold text-white">Open Format & Hiphop</div>
                </div>
              </div>
            </div>

            {/* Social Media Links & Contact */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                ช่องทางติดต่อ (CONTACT ME)
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {profile.socials.facebook && (
                  <a
                    href={profile.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 transition-all hover:scale-105"
                  >
                    <span>Facebook</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                )}
                {profile.socials.instagram && (
                  <a
                    href={profile.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 transition-all hover:scale-105"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                )}
                {profile.socials.tiktok && (
                  <a
                    href={profile.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 transition-all hover:scale-105"
                  >
                    <span>TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                )}

                <button
                  onClick={() => setIsBookingOpen(true)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg} hover:brightness-110 transition-all shadow-lg hover:scale-105`}
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                  <span>แบบฟอร์มติดต่องาน (Book Show)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
