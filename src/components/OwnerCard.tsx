import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRole, toBnNum } from '../translations';

interface OwnerCardProps {
  className?: string;
}

export const OwnerCard: React.FC<OwnerCardProps> = ({ className = '' }) => {
  const { settings, students, language } = useApp();

  return (
    <div
      className={`p-3.5 bg-white/5 rounded-2xl border border-white/10 min-h-[92px] h-auto flex flex-col justify-between transition-all ${className}`}
    >
      {/* Top Row: Role label on left, small student-count chip on right */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <span className="text-[11px] font-bold text-[#E0FF4F] tracking-wide uppercase">
          {formatRole(settings.userRole, language)}
        </span>
        <span className="text-[10px] text-white/70 bg-white/10 px-2 py-0.5 rounded-full font-medium shrink-0">
          {toBnNum(students.length, language, settings.useBanglaDigits)} {language === 'bn' ? 'শিক্ষার্থী' : 'students'}
        </span>
      </div>

      {/* Full-width Coaching Name on its own row: wraps to max 2 lines without truncation unless >2 lines */}
      <div className="mt-1.5 w-full">
        <h2
          title={settings.coachingName}
          className="text-sm font-bold text-white leading-snug line-clamp-2 break-words"
        >
          {settings.coachingName}
        </h2>
      </div>

      {/* Teacher Name line: wraps with smaller muted text style (14px, no truncation) */}
      <div className="mt-1 w-full">
        <p className="text-[14px] text-white/60 leading-snug break-words">
          {settings.leadTeacher}
        </p>
      </div>
    </div>
  );
};
