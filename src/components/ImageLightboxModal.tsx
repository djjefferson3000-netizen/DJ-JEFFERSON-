import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Download, ExternalLink } from 'lucide-react';

export const ImageLightboxModal: React.FC = () => {
  const { imageModal, closeImageModal } = usePortfolio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeImageModal();
    };
    if (imageModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imageModal, closeImageModal]);

  if (!imageModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={closeImageModal}
    >
      <div
        className="relative max-w-5xl max-h-[92vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800/80 bg-neutral-900/60">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-lg">
              {imageModal.title}
            </h3>
            {imageModal.caption && (
              <p className="text-xs text-neutral-400 font-mono mt-0.5">{imageModal.caption}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={imageModal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="เปิดภาพขนาดเต็มในแท็บใหม่"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={closeImageModal}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="relative flex-1 overflow-auto bg-neutral-950 flex items-center justify-center p-2">
          <img
            src={imageModal.url}
            alt={imageModal.title}
            className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};
