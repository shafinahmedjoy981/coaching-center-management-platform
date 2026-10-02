import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  List,
  MapPin,
  Plus,
  Send,
  UserCheck,
  UserX,
  Users
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const {
    batches,
    students,
    sessions,
    makeUpRequests,
    language,
    setAttendanceModal,
    setMakeUpModal,
    confirmMakeUpSlot,
    expandedBatchId,
    setExpandedBatchId,
    setSelectedStudentProfileId
  } = useApp();

  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');
  const t = translations[language];

  const weekDays = [
    { name: 'Saturday', bn: 'শনিবার', date: 'Sept 26' },
    { name: 'Sunday', bn: 'রবিবার', date: 'Sept 27' },
    { name: 'Monday', bn: 'সোমবার', date: 'Sept 28' },
    { name: 'Tuesday', bn: 'মঙ্গলবার', date: 'Sept 29' },
    { name: 'Wednesday', bn: 'বুধবার', date: 'Sept 30' },
    { name: 'Thursday', bn: 'বৃহস্পতিবার', date: 'Oct 01' },
    { name: 'Friday', bn: 'শুক্রবার', date: 'Oct 02' }
  ];

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header with Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#00272B] tracking-tight">
            {t.navClasses}
          </h1>
          <p className="text-xs sm:text-sm text-[#00272B]/60 font-medium mt-0.5">
            {t.navClassesSub}
          </p>
        </div>

        {/* View Mode Toggle & Attendance Trigger */}
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-2xl border border-[#00272B]/10 flex items-center">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'week' ? 'bg-[#00272B] text-[#E0FF4F]' : 'text-[#00272B]/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সাপ্তাহিক রুটিন' : 'Week View'}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'list' ? 'bg-[#00272B] text-[#E0FF4F]' : 'text-[#00272B]/60'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'তালিকা' : 'List View'}</span>
            </button>
          </div>

          <button
            onClick={() => setAttendanceModal({ open: true })}
            className="h-10 px-3.5 rounded-2xl bg-[#E0FF4F] hover:bg-[#d4f82a] text-[#00272B] font-extrabold text-xs flex items-center gap-1.5 border border-[#00272B] shadow-2xs"
          >
            <UserCheck className="w-4 h-4" />
            <span>{t.markAttendance}</span>
          </button>
        </div>
      </div>

      {/* Week Grid or List */}
      {viewMode === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {batches.map((batch) => {
            const batchStudents = students.filter((s) => s.batchId === batch.id);
            const isExpanded = expandedBatchId === batch.id;

            return (
              <div
                key={batch.id}
                id={`batch-card-${batch.id}`}
                className={`p-4 sm:p-5 rounded-3xl bg-white border transition-all flex flex-col justify-between space-y-4 ${
                  isExpanded
                    ? 'border-[#00272B] ring-2 ring-[#00272B] shadow-lg md:col-span-2'
                    : 'border-[#00272B]/10 shadow-xs hover:border-[#00272B]/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black font-mono tracking-wider text-[#00272B] bg-[#E0FF4F] px-2 py-0.5 rounded-lg border border-[#00272B]/20">
                        {batch.code}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#00272B]/60 bg-[#F6F8EE] px-2 py-0.5 rounded-lg border border-[#00272B]/10">
                        {batch.classLevel}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-800">
                      ৳{batch.monthlyFee}/mo
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#00272B] mt-2 leading-snug">
                    {batch.name}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-[#00272B]/80">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#00272B]/60 shrink-0" />
                      <span className="font-semibold">{batch.scheduleDays.join(' · ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-[#00272B]/60 shrink-0" />
                      <span>{batch.scheduleTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00272B]/60 shrink-0" />
                      <span className="truncate">{batch.roomOrLink}</span>
                    </div>
                  </div>

                  {/* Expanded Student List */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-[#00272B]/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#00272B]">
                          {language === 'bn' ? 'যুক্ত শিক্ষার্থী তালিকা:' : 'Enrolled Students:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedBatchId(null)}
                          className="text-[11px] font-semibold text-[#00272B]/60 hover:text-[#00272B] underline"
                        >
                          {language === 'bn' ? 'সংকুচিত করুন' : 'Collapse'}
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {batchStudents.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => setSelectedStudentProfileId(st.id)}
                            className="p-2 rounded-xl bg-[#F6F8EE] hover:bg-[#E0FF4F]/20 border border-[#00272B]/10 flex items-center justify-between text-xs cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-[#00272B] text-[#E0FF4F] font-black text-[10px] flex items-center justify-center shrink-0">
                                {st.avatarInitials}
                              </span>
                              <div className="truncate">
                                <p className="font-bold text-[#00272B] truncate">
                                  {language === 'bn' && st.nameBn ? st.nameBn : st.name}
                                </p>
                                <p className="text-[10px] text-[#00272B]/60">{st.parentPhone}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-[#00272B] underline shrink-0 ml-2">
                              {language === 'bn' ? 'প্রোফাইল' : 'Profile'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#00272B]/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setExpandedBatchId(isExpanded ? null : batch.id)}
                    className="flex items-center gap-1 text-xs text-[#00272B]/70 font-semibold hover:text-[#00272B] transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{batchStudents.length} students {isExpanded ? '▲' : '▼'}</span>
                  </button>

                  <button
                    onClick={() => setAttendanceModal({ open: true, batchId: batch.id })}
                    className="px-3 py-1.5 rounded-xl bg-[#00272B] text-[#E0FF4F] hover:bg-black font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>{language === 'bn' ? 'উপস্থিতি' : 'Attendance'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#00272B]/10 divide-y divide-[#00272B]/10 overflow-hidden shadow-xs">
          {batches.map((b) => {
            const batchStudents = students.filter((s) => s.batchId === b.id);
            const isExpanded = expandedBatchId === b.id;
            return (
              <div
                key={b.id}
                id={`batch-card-${b.id}`}
                className={`p-4 sm:p-5 transition-colors ${
                  isExpanded ? 'bg-[#F6F8EE]' : 'hover:bg-[#F6F8EE]/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black font-mono tracking-wider text-[#00272B] bg-[#E0FF4F] px-2 py-0.5 rounded-lg border border-[#00272B]/20">
                        {b.code}
                      </span>
                      <h4 className="text-base font-bold text-[#00272B]">{b.name}</h4>
                    </div>
                    <p className="text-xs text-[#00272B]/60 mt-0.5">
                      {b.scheduleDays.join(', ')} · {b.scheduleTime} · {b.roomOrLink}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExpandedBatchId(isExpanded ? null : b.id)}
                      className="text-xs font-semibold text-[#00272B]/70 hover:text-[#00272B] underline"
                    >
                      {batchStudents.length} {language === 'bn' ? 'শিক্ষার্থী' : 'enrolled'} {isExpanded ? '▲' : '▼'}
                    </button>
                    <button
                      onClick={() => setAttendanceModal({ open: true, batchId: b.id })}
                      className="px-3 py-1.5 bg-[#E0FF4F] text-[#00272B] font-bold text-xs rounded-xl border border-[#00272B]"
                    >
                      {language === 'bn' ? 'উপস্থিতি নিন' : 'Take Attendance'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-[#00272B]/10 space-y-2">
                    <p className="text-xs font-bold text-[#00272B]">
                      {language === 'bn' ? 'যুক্ত শিক্ষার্থী তালিকা:' : 'Enrolled Students:'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {batchStudents.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => setSelectedStudentProfileId(st.id)}
                          className="p-2.5 rounded-xl bg-white border border-[#00272B]/10 flex items-center justify-between text-xs cursor-pointer hover:border-[#00272B]/30"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-6 h-6 rounded-lg bg-[#00272B] text-[#E0FF4F] font-black text-[10px] flex items-center justify-center shrink-0">
                              {st.avatarInitials}
                            </span>
                            <span className="font-bold text-[#00272B] truncate">
                              {language === 'bn' && st.nameBn ? st.nameBn : st.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#00272B]/60 ml-2">{st.parentPhone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Make-Up Classes Section (Solves Core Problem 3) */}
      <div className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#00272B]" />
            <div>
              <h2 className="text-base font-extrabold text-[#00272B]">
                {language === 'bn' ? 'মেক-আপ ক্লাস সমাধান কেন্দ্র' : 'Make-Up Class Center'}
              </h2>
              <p className="text-xs text-[#00272B]/60">
                {language === 'bn'
                  ? 'অনুপস্থিত শিক্ষার্থীদের জন্য মুক্ত স্লট প্রস্তাব ও অভিভাবক অনুমোদন'
                  : 'Manage missed classes with zero double booking conflicts'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setMakeUpModal({ open: true })}
            className="px-3 py-1.5 rounded-xl bg-[#00272B] text-[#E0FF4F] font-bold text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নতুন স্লট সাজেস্ট' : 'Suggest Slot'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {makeUpRequests.map((mu) => {
            const student = students.find((s) => s.id === mu.studentId);
            const batch = batches.find((b) => b.id === mu.batchId);

            return (
              <div
                key={mu.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs flex flex-col h-full"
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-3 min-h-[28px]">
                  <h4 className="text-sm font-bold text-[#00272B] truncate">
                    {student?.name} ({batch?.subject})
                  </h4>

                  <span
                    className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      mu.status === 'parent_confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {mu.status === 'parent_confirmed' ? 'Slot Confirmed' : 'Awaiting Reply'}
                  </span>
                </div>

                {/* Missed-reason line */}
                <div className="mt-1">
                  <p className="text-xs text-[#00272B]/60 truncate">
                    Missed: {mu.missedDate} · {mu.reason}
                  </p>
                </div>

                {/* Slots details box (flex-1 to fill free space) */}
                <div className="mt-3 p-3 bg-[#F6F8EE] rounded-2xl flex-1 flex flex-col space-y-1.5 text-xs">
                  <span className="font-semibold text-[#00272B]/70 block">
                    {language === 'bn' ? 'প্রস্তাবিত খোলা স্লটসমূহ:' : 'Suggested Available Slots:'}
                  </span>
                  <div className="space-y-1 flex-1">
                    {mu.suggestedSlots.map((slot, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between min-h-[40px] py-1 border-b border-[#00272B]/5 last:border-b-0"
                      >
                        <span className="text-[#00272B] font-medium pr-2 text-xs leading-tight">
                          {slot}
                        </span>
                        <div className="shrink-0 flex items-center justify-end">
                          {mu.confirmedSlot === slot ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                              ✓ Confirmed
                            </span>
                          ) : (
                            mu.status === 'pending' && (
                              <button
                                type="button"
                                onClick={() => confirmMakeUpSlot(mu.id, slot)}
                                className="text-[10px] font-bold text-[#00272B] bg-white px-2.5 py-1 rounded-md border border-[#00272B]/15 hover:bg-[#E0FF4F] transition-colors"
                              >
                                {language === 'bn' ? 'লক করুন' : 'Confirm'}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer row (pushed down by mt-auto, fixed min-height 48px, top divider) */}
                <div className="mt-auto pt-3 border-t border-[#00272B]/10 min-h-[48px] flex items-center justify-between gap-3">
                  <span
                    className="text-[11px] text-[#00272B]/60 italic truncate min-w-0 flex-1"
                    title={mu.notes || 'Sent via WhatsApp to guardian'}
                  >
                    {mu.notes || 'Sent via WhatsApp to guardian'}
                  </span>
                  <button
                    onClick={() => {
                      const clean = student?.parentPhone.replace(/[^0-9]/g, '') || '';
                      const full = clean.startsWith('880') ? clean : `880${clean.startsWith('0') ? clean.slice(1) : clean}`;
                      window.open(`https://wa.me/${full}?text=${encodeURIComponent(`Make-up slot details for ${student?.name}`)}`, '_blank');
                    }}
                    className="shrink-0 whitespace-nowrap text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1.5 py-1 px-1.5"
                  >
                    <Send className="w-3 h-3 shrink-0" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
