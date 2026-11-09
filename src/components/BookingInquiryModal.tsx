import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/portfolioLogic';
import { X, Calendar, MapPin, CheckCircle, Send, MessageCircle } from 'lucide-react';

export const BookingInquiryModal: React.FC = () => {
  const { isBookingOpen, setIsBookingOpen, profile, layoutSettings } = usePortfolio();
  const accent = getAccentClasses(layoutSettings.accentColor);

  const [form, setForm] = useState({
    promoterName: '',
    venueName: '',
    location: '',
    eventDate: '',
    eventType: 'Club Night',
    budget: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isBookingOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsBookingOpen(false);
    setForm({
      promoterName: '',
      venueName: '',
      location: '',
      eventDate: '',
      eventType: 'Club Night',
      budget: '',
      notes: '',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setIsBookingOpen(false)}
    >
      <div
        className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div>
            <h3 className="text-xl font-bold font-['Syne',sans-serif] text-white">
              ติดต่อจองคิวแสดง / Booking Show
            </h3>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              {profile.stageName} ({profile.fullName})
            </p>
          </div>
          <button
            onClick={() => setIsBookingOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className={`w-14 h-14 mx-auto rounded-full ${accent.badge} flex items-center justify-center`}>
              <CheckCircle className="w-8 h-8 text-current" />
            </div>
            <h4 className="text-xl font-bold text-white">ส่งข้อมูลจองคิวเรียบร้อยแล้ว!</h4>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              ขอบคุณสำหรับคำขอคิวแสดง ทางทีมงานของ {profile.stageName} จะติดต่อกลับไปตามข้อมูลที่ระบุไว้โดยเร็วที่สุด
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={handleReset}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg}`}
              >
                เสร็จสิ้น (Done)
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  ชื่อผู้ติดต่อ / ค่าย / สังกัด *
                </label>
                <input
                  type="text"
                  required
                  value={form.promoterName}
                  onChange={(e) => setForm({ ...form, promoterName: e.target.value })}
                  placeholder="เช่น มารุต (Jess Club)"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  สถานที่จัดงาน / ชื่อร้าน *
                </label>
                <input
                  type="text"
                  required
                  value={form.venueName}
                  onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                  placeholder="เช่น ROO Club ขอนแก่น"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  วันที่ต้องการแสดง (Date) *
                </label>
                <input
                  type="date"
                  required
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  ประเภทงาน (Event Type)
                </label>
                <select
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Club Night">Club Night / Bar Resident</option>
                  <option value="Festival">Festival / Outdoor Stage</option>
                  <option value="Special Guest">Special Guest Headline</option>
                  <option value="Private Event">Private Event / Wedding / Party</option>
                  <option value="University Event">Byenior / University Festival</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                รายละเอียดเพิ่มเติม (เวลาแสดง, ธีมงาน, งบประมาณ)
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="ระบุเวลาขึ้นแสดง หรือแนวเพลงที่ต้องการเน้น..."
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-neutral-500">
                หรือติดต่อตรงทาง IG: @_jeffersoncarter
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg} hover:brightness-110 shadow-lg`}
                >
                  <Send className="w-3.5 h-3.5 fill-current" />
                  <span>ส่งคำขอจองคิว</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
