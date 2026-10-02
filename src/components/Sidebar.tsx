import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import {
  CalendarDays,
  Clock,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  TrendingUp,
  Users,
  Settings,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ParentTab, TutorTab } from '../types';
import { OwnerCard } from './OwnerCard';

export const Sidebar: React.FC = () => {
  const {
    role,
    activeTutorTab,
    setActiveTutorTab,
    activeParentTab,
    setActiveParentTab,
    language,
    students,
    batches,
    settings,
    setSettingsModalOpen,
    setOnboardingOpen
  } = useApp();

  const t = translations[language];

  if (role === 'parent') {
    const parentNav: { id: ParentTab; label: string; icon: React.FC<{ className?: string }> }[] = [
      { id: 'home', label: t.parentHome, icon: Home },
      { id: 'reports', label: t.parentReports, icon: FileText },
      { id: 'fees', label: t.parentFees, icon: CreditCard },
      { id: 'schedule', label: t.parentSchedule, icon: CalendarDays }
    ];

    return (
      <aside className="hidden md:flex flex-col w-64 bg-[#00272B] text-white shrink-0 border-r border-white/10 p-4 justify-between h-[calc(100vh-57px)] sticky top-[57px]">
        <div className="space-y-6">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-semibold text-[#E0FF4F] uppercase tracking-wider block">
              {language === 'bn' ? 'অভিভাবক পোর্টাল' : 'Parent Portal'}
            </span>
            <p className="text-xs text-white/70 mt-1 font-medium leading-relaxed">
              {language === 'bn'
                ? 'আপনার সন্তানের অগ্রগতি ও ফি হিসেব সহজে দেখুন।'
                : 'Direct transparent view of your child\'s learning and fee records.'}
            </p>
          </div>

          <nav className="space-y-1">
            {parentNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeParentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveParentTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#E0FF4F] text-[#00272B] shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#00272B]' : 'text-white/60'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs text-white/60">
          <div className="flex items-center gap-1.5 text-white/90 font-medium mb-1">
            <ShieldCheck className="w-4 h-4 text-[#E0FF4F]" />
            <span>{language === 'bn' ? 'নিরাপদ অ্যাক্সেস' : 'Private Access'}</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {language === 'bn'
              ? 'শুধুমাত্র আপনার সন্তানের তথ্য সুরক্ষিতভাবে প্রদর্শিত।'
              : 'End-to-end child record isolation enforced.'}
          </p>
        </div>
      </aside>
    );
  }

  // Tutor Desktop Sidebar
  const tutorNav: { id: TutorTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'today', label: t.navToday, icon: Clock },
    { id: 'students', label: t.navStudents, icon: Users },
    { id: 'classes', label: t.navClasses, icon: CalendarDays },
    { id: 'fees', label: t.navFees, icon: CreditCard },
    { id: 'progress', label: t.navProgress, icon: TrendingUp },
    { id: 'parents', label: t.navParents, icon: MessageSquare }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#00272B] text-white shrink-0 border-r border-white/10 p-4 justify-between h-[calc(100vh-57px)] sticky top-[57px]">
      <div className="space-y-6">
        {/* Coaching Academy Banner (Owner Card) */}
        <OwnerCard />

        {/* Navigation Tabs */}
        <nav className="space-y-1.5" aria-label="Tutor Main Navigation">
          {tutorNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTutorTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTutorTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#E0FF4F] text-[#00272B] shadow-sm font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00272B]' : 'text-white/60'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer controls & Tour */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        <button
          onClick={() => setOnboardingOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#E0FF4F] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>{language === 'bn' ? 'দ্রুত সেটআপ ও ট্যুর' : 'Quick Setup & Tour'}</span>
          </div>
          <span className="text-[10px] bg-[#E0FF4F]/20 text-[#E0FF4F] px-1.5 py-0.5 rounded">
            3 steps
          </span>
        </button>

        <button
          onClick={() => setSettingsModalOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings className="w-4 h-4 text-white/60" />
          <span>{t.settings}</span>
        </button>
      </div>
    </aside>
  );
};
