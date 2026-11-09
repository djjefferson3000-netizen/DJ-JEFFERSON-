import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getYouTubeEmbedUrl } from '../utils/portfolioLogic';
import { X, ExternalLink, Calendar, MapPin } from 'lucide-react';

export const VideoModal: React.FC = () => {
  const { videoModal, closeVideoModal } = usePortfolio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeVideoModal();
    };
    if (videoModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoModal, closeVideoModal]);

  if (!videoModal) return null;

  const embedSrc = videoModal.embedUrl || getYouTubeEmbedUrl(videoModal.url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={closeVideoModal}
    >
      <div
        className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800/80 bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-md">
                {videoModal.title}
              </h3>
              {(videoModal.venue || videoModal.date) && (
                <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                  {videoModal.venue && <span>{videoModal.venue}</span>}
                  {videoModal.venue && videoModal.date && <span>•</span>}
                  {videoModal.date && <span>{videoModal.date}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {videoModal.url && (
              <a
                href={videoModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="เปิดในแท็บใหม่"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={closeVideoModal}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Embed Player */}
        <div className="relative aspect-video w-full bg-black">
          {embedSrc ? (
            <iframe
              src={embedSrc}
              title={videoModal.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm">
              ไม่พบวิดีโอสตรีมที่ถูกต้อง
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
