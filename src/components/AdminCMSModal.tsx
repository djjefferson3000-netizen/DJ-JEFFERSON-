import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses, validatePortfolioItem } from '../utils/portfolioLogic';
import { PortfolioItem, CategoryType, LayoutMode, AccentColor, CardTheme } from '../types/portfolio';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Star,
  Save,
  RotateCcw,
  Download,
  Upload,
  Layers,
  User,
  Music,
  Sliders,
  Check,
  Eye,
  Sparkles,
} from 'lucide-react';

export const AdminCMSModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    portfolioItems,
    addItem,
    updateItem,
    deleteItem,
    toggleFeatured,
    profile,
    updateProfile,
    clubs,
    addClub,
    deleteClub,
    festivals,
    addFestival,
    deleteFestival,
    layoutSettings,
    updateLayoutSettings,
    setAccentColor,
    resetToDefaults,
    exportDataJson,
    importDataJson,
    itemToEdit,
    setItemToEdit,
    isEditorMode,
  } = usePortfolio();

  const accent = getAccentClasses(layoutSettings.accentColor);

  const [activeTab, setActiveTab] = useState<'items' | 'profile' | 'clubs' | 'layout' | 'backup'>('items');

  // Add/Edit item form state
  const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [newGenreInput, setNewGenreInput] = useState('');
  const [saveToast, setSaveToast] = useState('');

  // Auto-sync when itemToEdit is passed from external card edit trigger
  React.useEffect(() => {
    if (isAdminOpen && itemToEdit) {
      setActiveTab('items');
      setEditingItem(itemToEdit);
      setTagInput(itemToEdit.tags ? itemToEdit.tags.join(', ') : '');
      setFormErrors({});
      setItemToEdit(null);
    }
  }, [isAdminOpen, itemToEdit, setItemToEdit]);

  // New club / festival forms
  const [newClub, setNewClub] = useState({ name: '', location: '', highlight: true });
  const [newFestival, setNewFestival] = useState({ year: '2026', title: '', role: 'Headline DJ', location: '' });

  // Backup json input
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isAdminOpen || !isEditorMode) return null;

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleStartAdd = () => {
    setEditingItem({
      title: '',
      category: 'live-session',
      date: new Date().toISOString().split('T')[0],
      venue: '',
      city: 'Khon Kaen',
      imageUrl: 'https://cdn.myportfolio.com/b76f0844-9acf-432f-b53b-d42b3b42a0d6/c13545a0-8129-48cc-b43c-e58b739adcb4_rw_1920.png',
      videoUrl: '',
      description: '',
      tags: ['Live', 'Club Mix'],
      featured: false,
    });
    setTagInput('Live, Club Mix');
    setFormErrors({});
  };

  const handleStartEdit = (item: PortfolioItem) => {
    setEditingItem({ ...item });
    setTagInput(item.tags.join(', '));
    setFormErrors({});
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const parsedTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const itemToValidate = {
      ...editingItem,
      tags: parsedTags,
    };

    const validation = validatePortfolioItem(itemToValidate);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    if (editingItem.id) {
      updateItem(editingItem.id, itemToValidate);
      showToast('บันทึกการแก้ไขผลงานเรียบร้อยแล้ว!');
    } else {
      addItem(itemToValidate as Omit<PortfolioItem, 'id'>);
      showToast('เพิ่มผลงานใหม่เข้าสู่คลังเรียบร้อยแล้ว!');
    }

    setEditingItem(null);
  };

  const handleAddGenre = () => {
    if (!newGenreInput.trim()) return;
    if (!profile.genres.includes(newGenreInput.trim().toUpperCase())) {
      updateProfile({ genres: [...profile.genres, newGenreInput.trim().toUpperCase()] });
      setNewGenreInput('');
      showToast('เพิ่มแนวเพลงแล้ว');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    updateProfile({ genres: profile.genres.filter((g) => g !== genre) });
    showToast('ลบแนวเพลงแล้ว');
  };

  const handleAddClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClub.name.trim()) return;
    addClub(newClub);
    setNewClub({ name: '', location: '', highlight: true });
    showToast('เพิ่มรายชื่อคลับเรียบร้อยแล้ว');
  };

  const handleAddFestivalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFestival.title.trim()) return;
    addFestival(newFestival);
    setNewFestival({ year: '2026', title: '', role: 'Headline DJ', location: '' });
    showToast('เพิ่มรายชื่อเฟสติวัลเรียบร้อยแล้ว');
  };

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dj_jefferson_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ดาวน์โหลดไฟล์สำรองข้อมูล JSON สำเร็จ');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importDataJson(importJsonText);
    if (ok) {
      setImportStatus('success');
      showToast('นำเข้าข้อมูลสำเร็จแล้ว!');
      setTimeout(() => setImportStatus('idle'), 3000);
    } else {
      setImportStatus('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={() => setIsAdminOpen(false)}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${accent.bg} text-neutral-950 font-bold`}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Syne',sans-serif] text-white flex items-center gap-2">
                <span>ระบบจัดการหลังบ้าน (CMS Studio)</span>
                <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                  {profile.stageName}
                </span>
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                แก้ไขข้อมูลผลงาน, เปลี่ยนเลย์เอาต์, ปรับแต่งภาพและวิดีโอได้อย่างอิสระ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveToast && (
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-in fade-in">
                {saveToast}
              </span>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close admin CMS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-neutral-800/80 bg-neutral-900/40 px-6 gap-2 scrollbar-thin">
          <button
            onClick={() => setActiveTab('items')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'items'
                ? `border-amber-400 text-white font-bold`
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>คลังผลงาน ({portfolioItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'profile'
                ? `border-amber-400 text-white font-bold`
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>โปรไฟล์ & ชีวประวัติ</span>
          </button>

          <button
            onClick={() => setActiveTab('clubs')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'clubs'
                ? `border-amber-400 text-white font-bold`
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>คลับ & เฟสติวัล ({clubs.length + festivals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'layout'
                ? `border-amber-400 text-white font-bold`
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>ปรับแต่งเลย์เอาต์ & สไตล์</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === 'backup'
                ? `border-amber-400 text-white font-bold`
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>สำรอง & รีเซ็ตข้อมูล</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PORTFOLIO ITEMS */}
          {activeTab === 'items' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">จัดการผลงานในคลัง (Portfolio Archive)</h3>
                  <p className="text-xs text-neutral-400">
                    เพิ่ม แก้ไข ลบ หรือตั้งให้เป็นผลงานเด่น (Featured) พร้อมลิงก์วิดีโอและภาพโปสเตอร์
                  </p>
                </div>
                <button
                  onClick={handleStartAdd}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg} hover:brightness-110 shadow-lg`}
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มผลงานใหม่ (Add Item)</span>
                </button>
              </div>

              {/* Items List Table */}
              <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/40">
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-900/70 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-16 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0 border border-neutral-700/60">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{item.title}</span>
                          {item.featured && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              FEATURED
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span className="uppercase text-amber-400 font-semibold">
                            {item.category}
                          </span>
                          <span>•</span>
                          <span>{item.venue} ({item.city})</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                        {item.videoUrl && (
                          <div className="text-[11px] font-mono text-neutral-500 truncate max-w-sm mt-0.5">
                            Video: {item.videoUrl}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => toggleFeatured(item.id)}
                        className={`p-2 rounded-lg border transition-colors ${
                          item.featured
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'border-neutral-800 text-neutral-500 hover:text-white'
                        }`}
                        title={item.featured ? 'ยกเลิก Featured' : 'ตั้งเป็น Featured'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                        title="แก้ไข"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบผลงาน "${item.title}" ใช่หรือไม่?`)) {
                            deleteItem(item.id);
                            showToast('ลบผลงานเรียบร้อยแล้ว');
                          }
                        }}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & BIO */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">แก้ไขข้อมูลศิลปิน (Artist Profile)</h3>
                <p className="text-xs text-neutral-400">
                  ข้อมูลส่วนตัวที่จะแสดงในส่วนหัวเว็บและส่วนชีวประวัติ
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Stage Name (ชื่อในวงการ)
                  </label>
                  <input
                    type="text"
                    value={profile.stageName}
                    onChange={(e) => updateProfile({ stageName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    ชื่อจริง (Full Name)
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => updateProfile({ fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    ชื่อเล่น (Nickname)
                  </label>
                  <input
                    type="text"
                    value={profile.nickname}
                    onChange={(e) => updateProfile({ nickname: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    วันเกิด (DOB)
                  </label>
                  <input
                    type="text"
                    value={profile.dob}
                    onChange={(e) => updateProfile({ dob: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    พื้นที่ประจำ (Location)
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Tagline หัวเว็บ
                  </label>
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) => updateProfile({ tagline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  คำอธิบายชีวประวัติ (Bio Text)
                </label>
                <textarea
                  rows={3}
                  value={profile.bioText}
                  onChange={(e) => updateProfile({ bioText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Genres Editor */}
              <div className="pt-4 border-t border-neutral-800">
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                  แนวเพลงหลัก (Genres)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.genres.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-700 text-neutral-200"
                    >
                      <span>{g}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGenre(g)}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    value={newGenreInput}
                    onChange={(e) => setNewGenreInput(e.target.value)}
                    placeholder="เพิ่มแนวเพลงใหม่..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGenre}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg}`}
                  >
                    เพิ่ม
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  ลิงก์โซเชียลมีเดีย (Social Links)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500">Facebook URL</span>
                    <input
                      type="text"
                      value={profile.socials.facebook || ''}
                      onChange={(e) =>
                        updateProfile({
                          socials: { ...profile.socials, facebook: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500">Instagram URL</span>
                    <input
                      type="text"
                      value={profile.socials.instagram || ''}
                      onChange={(e) =>
                        updateProfile({
                          socials: { ...profile.socials, instagram: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500">TikTok URL</span>
                    <input
                      type="text"
                      value={profile.socials.tiktok || ''}
                      onChange={(e) =>
                        updateProfile({
                          socials: { ...profile.socials, tiktok: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500">Email สำหรับติดต่องาน</span>
                    <input
                      type="email"
                      value={profile.socials.email || ''}
                      onChange={(e) =>
                        updateProfile({
                          socials: { ...profile.socials, email: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLUBS & FESTIVALS */}
          {activeTab === 'clubs' && (
            <div className="space-y-8">
              {/* Club List */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">รายชื่อ Club Experience</h3>
                <form onSubmit={handleAddClubSubmit} className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    required
                    value={newClub.name}
                    onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                    placeholder="ชื่อคลับ เช่น JESS, SLAY"
                    className="flex-1 min-w-[150px] px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    value={newClub.location}
                    onChange={(e) => setNewClub({ ...newClub, location: e.target.value })}
                    placeholder="สถานที่ เช่น Mahasarakham, Roi Et"
                    className="flex-1 min-w-[150px] px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-neutral-300 font-mono px-2">
                    <input
                      type="checkbox"
                      checked={newClub.highlight}
                      onChange={(e) => setNewClub({ ...newClub, highlight: e.target.checked })}
                      className="rounded"
                    />
                    <span>Highlight</span>
                  </label>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg}`}
                  >
                    เพิ่มคลับ
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {clubs.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-white">{c.name}</div>
                        <div className="text-[10px] font-mono text-neutral-400">{c.location}</div>
                      </div>
                      <button
                        onClick={() => deleteClub(c.id)}
                        className="text-neutral-500 hover:text-red-400 p-1"
                        title="ลบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Festival Experience List */}
              <div className="space-y-4 pt-6 border-t border-neutral-800">
                <h3 className="text-base font-bold text-white">รายชื่อ Festival & Special Events</h3>
                <form onSubmit={handleAddFestivalSubmit} className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    required
                    value={newFestival.year}
                    onChange={(e) => setNewFestival({ ...newFestival, year: e.target.value })}
                    placeholder="ปี เช่น 2026"
                    className="w-20 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white font-mono"
                  />
                  <input
                    type="text"
                    required
                    value={newFestival.title}
                    onChange={(e) => setNewFestival({ ...newFestival, title: e.target.value })}
                    placeholder="ชื่องานเฟสติวัล เช่น TOXIC BARS SONGKRAN"
                    className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newFestival.location}
                    onChange={(e) => setNewFestival({ ...newFestival, location: e.target.value })}
                    placeholder="สถานที่ เช่น Khon Kaen"
                    className="w-32 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg}`}
                  >
                    เพิ่มอีเวนต์
                  </button>
                </form>

                <div className="space-y-2">
                  {festivals.map((f) => (
                    <div
                      key={f.id}
                      className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-amber-400 font-bold">{f.year}</span>
                        <div>
                          <div className="font-bold text-xs text-white">{f.title}</div>
                          <div className="text-[10px] font-mono text-neutral-400">
                            {f.role} {f.location ? `· ${f.location}` : ''}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteFestival(f.id)}
                        className="text-neutral-500 hover:text-red-400 p-1"
                        title="ลบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYOUT & VISUALS */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">ตั้งค่าเริ่มต้นของเลย์เอาต์ (Default Layout & Theme)</h3>
                <p className="text-xs text-neutral-400">
                  ปรับแต่งเลย์เอาต์เริ่มต้นและสไตล์การแสดงผลของเว็บไซต์
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    เลย์เอาต์เริ่มต้น (Default Mode)
                  </label>
                  <select
                    value={layoutSettings.layoutMode}
                    onChange={(e) =>
                      updateLayoutSettings({ layoutMode: e.target.value as LayoutMode })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="grid">Editorial Grid (ตารางนิตยสาร)</option>
                    <option value="masonry">Masonry Collage (คอลลาจภาพโปสเตอร์)</option>
                    <option value="filmstrip">Filmstrip Flow (สไลด์แนวนอน)</option>
                    <option value="schedule">Tour Table (ตารางทัวร์)</option>
                    <option value="spotlight">Spotlight (โฟกัสผลงานเด่น)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    จำนวนคอลัมน์ใน Grid Mode
                  </label>
                  <select
                    value={layoutSettings.gridColumns}
                    onChange={(e) =>
                      updateLayoutSettings({
                        gridColumns: Number(e.target.value) as 2 | 3 | 4,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value={2}>2 คอลัมน์ (ขนาดใหญ่)</option>
                    <option value={3}>3 คอลัมน์ (มาตรฐานสมดุล)</option>
                    <option value={4}>4 คอลัมน์ (กะทัดรัด จุเยอะ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    ธีมการ์ด (Card Style)
                  </label>
                  <select
                    value={layoutSettings.cardTheme}
                    onChange={(e) =>
                      updateLayoutSettings({ cardTheme: e.target.value as CardTheme })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="glass">Glassmorphism (กระจกโปร่งแสง)</option>
                    <option value="monochrome">Monochrome Dark (โทนดำลึก)</option>
                    <option value="neon">Neon Glow (เรืองแสงคลับ)</option>
                    <option value="editorial">Editorial Clean (มินิมอลโมเดิร์น)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    โทนสีเน้น (Accent Glow)
                  </label>
                  <select
                    value={layoutSettings.accentColor}
                    onChange={(e) => setAccentColor(e.target.value as AccentColor)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="amber">Amber / Gold (สีทอง)</option>
                    <option value="cyan">Cyan (สีฟ้าอิเล็กทริก)</option>
                    <option value="emerald">Emerald (สีเขียวเอเมอรัลด์)</option>
                    <option value="purple">Purple (สีม่วงคลับ)</option>
                    <option value="rose">Rose (สีชมพูนีออน)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">จัดการข้อมูล สำรอง & รีเซ็ต (Backup & Restore)</h3>
                <p className="text-xs text-neutral-400">
                  ดาวน์โหลดข้อมูลทั้งหมดเก็บไว้ หรือรีเซ็ตกลับเป็นข้อมูลต้นฉบับจากเว็บ Adobe Portfolio
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>ดาวน์โหลดไฟล์สำรอง (Export JSON)</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      สำรองข้อมูลผลงาน 15+ ตอน, ข้อมูลคลับ, เฟสติวัล และโปรไฟล์ทั้งหมด
                    </p>
                  </div>
                  <button
                    onClick={handleExport}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                  >
                    ดาวน์โหลด JSON
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-red-400" />
                      <span>รีเซ็ตเป็นข้อมูลเดิม (Reset to Default)</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      คืนค่าผลงานและเนื้อหาทั้งหมดกลับไปเป็นข้อมูลต้นฉบับจาก https://a66011213217.myportfolio.com/
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          'ต้องการรีเซ็ตข้อมูลทั้งหมดกลับไปเป็นต้นฉบับของ DJ Jefferson ใช่หรือไม่?'
                        )
                      ) {
                        resetToDefaults();
                        showToast('รีเซ็ตข้อมูลเป็นค่าเริ่มต้นเรียบร้อยแล้ว');
                      }
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                  >
                    คืนค่าต้นฉบับ (Reset)
                  </button>
                </div>
              </div>

              {/* Import Section */}
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>นำเข้าข้อมูลผ่าน JSON (Import JSON)</span>
                </h4>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="วางโค้ด JSON ที่ได้จากการ Export..."
                  className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 focus:outline-none focus:border-cyan-400"
                />
                <div className="flex items-center justify-between">
                  {importStatus === 'success' && (
                    <span className="text-xs text-emerald-400 font-mono">
                      ✓ นำเข้าข้อมูลสำเร็จเรียบร้อยแล้ว
                    </span>
                  )}
                  {importStatus === 'error' && (
                    <span className="text-xs text-red-400 font-mono">
                      ✕ รูปแบบ JSON ไม่ถูกต้อง กรุณาตรวจสอบ
                    </span>
                  )}
                  <button
                    onClick={handleImport}
                    className={`px-5 py-2 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg} ml-auto`}
                  >
                    นำเข้าข้อมูล (Import)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sub-form: Add / Edit Item */}
        {editingItem && (
          <div className="absolute inset-0 z-20 bg-neutral-950/95 backdrop-blur-md p-6 overflow-y-auto flex flex-col justify-between animate-in zoom-in-95 duration-150">
            <div className="space-y-4 max-w-3xl mx-auto w-full">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-lg font-bold text-white">
                  {editingItem.id ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่เข้าคลัง'}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      ชื่อผลงาน (Title) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="เช่น DJ Jefferson LIVE session ep.16"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                    {formErrors.title && (
                      <span className="text-[11px] text-red-400">{formErrors.title}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      หมวดหมู่ (Category) *
                    </label>
                    <select
                      value={editingItem.category || 'live-session'}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          category: e.target.value as PortfolioItem['category'],
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="live-session">Live Session (ดีเจไลฟ์เซ็ต)</option>
                      <option value="recap">Recap Video (วิดีโอสรุปงาน)</option>
                      <option value="poster-design">Artwork & Posters (งานออกแบบโปสเตอร์)</option>
                      <option value="club-set">Club Show & Tour (งานคลับ/ทัวร์)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      วันที่ (Date) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingItem.date || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                      placeholder="2026-08-20 หรือ 14 August 2026"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      สถานที่ (Venue)
                    </label>
                    <input
                      type="text"
                      value={editingItem.venue || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, venue: e.target.value })}
                      placeholder="เช่น JESS, SLAY, ROO"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      จังหวัด / เมือง (City)
                    </label>
                    <input
                      type="text"
                      value={editingItem.city || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                      placeholder="เช่น Mahasarakham, Khon Kaen, Roi Et"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      ลิงก์วิดีโอ (YouTube URL หรือ Embed Player)
                    </label>
                    <input
                      type="text"
                      value={editingItem.videoUrl || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, videoUrl: e.target.value })
                      }
                      placeholder="https://youtu.be/... หรือ https://www.youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    ลิงก์ภาพโปสเตอร์ / ภาพหน้าปก (Image URL) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.imageUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                    placeholder="https://cdn.myportfolio.com/... หรือ URL รูปภาพ"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                  {formErrors.imageUrl && (
                    <span className="text-[11px] text-red-400">{formErrors.imageUrl}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    คำอธิบายผลงาน (Description)
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.description || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    placeholder="เล่าถึงบรรยากาศ สไตล์เพลง หรือแนวเพลงในเซ็ตนี้..."
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    แท็ก (คั่นด้วยเครื่องหมายจุลภาค ,)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Live, Trap, Hiphop, Club"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <label className="flex items-center gap-2 text-xs font-mono text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.featured || false}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, featured: e.target.checked })
                      }
                      className="rounded"
                    />
                    <span>ตั้งเป็นผลงานแนะนำ (Featured Showcase)</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className={`inline-flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-bold text-neutral-950 ${accent.bg} hover:brightness-110 shadow-lg`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>บันทึกผลงาน</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
