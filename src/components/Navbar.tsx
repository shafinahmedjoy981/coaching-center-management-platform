import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import {
  Menu,
  Search,
  Settings,
  UserCheck,
  Users,
  X
} from 'lucide-react';
import { OwnerCard } from './OwnerCard';
import { GlobalSearch } from './GlobalSearch';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    setSettingsModalOpen,
    setOnboardingOpen
  } = useApp();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const t = translations[language];

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[#00272B] text-white border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-3 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile menu trigger */}
            {role === 'tutor' && (
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Open coaching menu"
                title="Coaching Menu"
              >
                <Menu className="w-4 h-4 text-[#E0FF4F]" />
              </button>
            )}

            <div className="w-8 h-8 rounded-xl bg-[#E0FF4F] flex items-center justify-center font-black text-[#00272B] text-lg shadow-sm shrink-0">
              TL
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`text-lg sm:text-xl font-extrabold tracking-tight text-white leading-none whitespace-nowrap ${
                  language === 'bn' ? "font-['Hind_Siliguri',sans-serif]" : "font-['Plus_Jakarta_Sans',sans-serif]"
                }`}
              >
                {t.brandName}
              </span>
              <span className="text-[10px] text-[#E0FF4F] font-medium hidden sm:inline tracking-tight mt-0.5 whitespace-nowrap">
                {t.taglineHeader}
              </span>
            </div>
          </div>

          {/* Zone 2: Global Search */}
          <div className="flex-1 flex justify-center max-w-xs md:max-w-md mx-1">
            <GlobalSearch />
          </div>

          {/* Zone 3: Role Switcher & Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* View as Switcher: Tutor vs Parent */}
            <div className="bg-white/10 p-0.5 rounded-full flex items-center border border-white/15">
              <button
                onClick={() => setRole('tutor')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  role === 'tutor'
                    ? 'bg-[#E0FF4F] text-[#00272B] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
                title="Demo Tutor Dashboard"
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">{t.tutor}</span>
              </button>
              <button
                onClick={() => setRole('parent')}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  role === 'parent'
                    ? 'bg-[#E0FF4F] text-[#00272B] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
                title="Demo Parent Portal"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">{t.parent}</span>
              </button>
            </div>

            {/* Language Toggle: EN / বাংলা */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              aria-label="Toggle language"
              className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-colors flex items-center justify-center min-w-[38px]"
            >
              {language === 'bn' ? 'EN' : 'বাংলা'}
            </button>

            {/* Onboarding Tour Trigger */}
            <button
              onClick={() => setOnboardingOpen(true)}
              aria-label="First-run tour"
              title="Setup & Quick Tour"
              className="hidden sm:flex h-8 sm:h-9 px-3 rounded-full bg-white/10 hover:bg-white/20 text-[#E0FF4F] text-xs font-semibold items-center border border-white/15"
            >
              <span className="text-[11px]">{language === 'bn' ? 'ট্যুর' : 'Tour'}</span>
            </button>

            {/* Settings Trigger */}
            {role === 'tutor' && (
              <button
                onClick={() => setSettingsModalOpen(true)}
                aria-label="Settings"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white flex items-center justify-center border border-white/15 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer (Tutor Side) */}
      {mobileDrawerOpen && role === 'tutor' && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs flex">
          <div className="w-72 max-w-[85vw] bg-[#00272B] text-white p-5 flex flex-col justify-between h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-5">
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E0FF4F] text-[#00272B] flex items-center justify-center font-black text-sm">
                    TL
                  </div>
                  <span
                    className={`font-black text-base ${
                      language === 'bn' ? "font-['Hind_Siliguri',sans-serif]" : ""
                    }`}
                  >
                    {t.brandName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Owner Card in Mobile Menu Drawer (Same component as desktop sidebar) */}
              <OwnerCard />

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setOnboardingOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#E0FF4F] transition-colors"
                >
                  <span>{language === 'bn' ? 'দ্রুত সেটআপ ও ট্যুর' : 'Quick Setup & Tour'}</span>
                  <span className="text-[10px] bg-[#E0FF4F]/20 text-[#E0FF4F] px-1.5 py-0.5 rounded">
                    3 steps
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setSettingsModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-white/60" />
                  <span>{t.settings}</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-white/60">
              <p>{t.taglineHeader}</p>
            </div>
          </div>

          <div
            className="flex-1"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
};
