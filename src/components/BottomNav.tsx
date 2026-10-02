import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import {
  CalendarDays,
  CheckSquare,
  Clock,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  TrendingUp,
  Users
} from 'lucide-react';
import { ParentTab, TutorTab } from '../types';

export const BottomNav: React.FC = () => {
  const { role, activeTutorTab, setActiveTutorTab, activeParentTab, setActiveParentTab, language } = useApp();
  const t = translations[language];

  if (role === 'parent') {
    const parentNavItems: { id: ParentTab; label: string; icon: React.FC<{ className?: string }> }[] = [
      { id: 'home', label: t.parentHome, icon: Home },
      { id: 'reports', label: t.parentReports, icon: FileText },
      { id: 'fees', label: t.parentFees, icon: CreditCard },
      { id: 'schedule', label: t.parentSchedule, icon: CalendarDays }
    ];

    return (
      <nav
        aria-label="Parent Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#00272B] text-white border-t border-white/10 px-2 py-1 shadow-lg"
      >
        <div className="grid grid-cols-4 items-center h-16">
          {parentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeParentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveParentTab(item.id)}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative ${
                  isActive ? 'text-[#E0FF4F]' : 'text-white/60 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0FF4F] absolute -top-1" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Tutor Bottom Nav (6 items)
  const tutorNavItems: { id: TutorTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'today', label: t.navToday, icon: Clock },
    { id: 'students', label: t.navStudents, icon: Users },
    { id: 'classes', label: t.navClasses, icon: CalendarDays },
    { id: 'fees', label: t.navFees, icon: CreditCard },
    { id: 'progress', label: t.navProgress, icon: TrendingUp },
    { id: 'parents', label: t.navParents, icon: MessageSquare }
  ];

  return (
    <nav
      aria-label="Tutor Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#00272B] text-white border-t border-white/10 px-1 py-1 shadow-lg"
    >
      <div className="grid grid-cols-6 items-center h-16">
        {tutorNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTutorTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTutorTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative ${
                isActive ? 'text-[#E0FF4F]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[9.5px] font-semibold tracking-tight mt-1 truncate max-w-[54px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0FF4F] absolute -top-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
