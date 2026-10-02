import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency, toBnNum } from '../../translations';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  Phone,
  Search,
  Users
} from 'lucide-react';
import { Student, Batch } from '../../types';

interface SearchResultsViewProps {
  onBack?: () => void;
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ onBack }) => {
  const {
    searchViewQuery,
    setSearchViewQuery,
    students,
    batches,
    invoices,
    settings,
    language,
    role,
    selectedChildId,
    setSelectedStudentProfileId,
    setActiveTutorTab,
    setExpandedBatchId
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'students' | 'batches' | 'parents'>('all');
  const t = translations[language];

  const query = (searchViewQuery || '').trim();
  const isAssistant = settings.userRole === 'Assistant';

  // Normalize Bangla digits to English digits
  const bnToEnDigits: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  const normalizedQuery = query.replace(/[০-৯]/g, (d) => bnToEnDigits[d] || d).toLowerCase();

  // Role filtering for parent view vs tutor view
  const visibleStudents = role === 'parent'
    ? students.filter((s) => s.id === selectedChildId || s.parentPhone === '01711223344')
    : students;

  const visibleBatches = role === 'parent'
    ? batches.filter((b) => visibleStudents.some((s) => s.batchId === b.id))
    : batches;

  // Matching logic
  const matchedStudents = visibleStudents.filter((s) => {
    if (!normalizedQuery) return true;
    const nameMatch = s.name.toLowerCase().includes(normalizedQuery);
    const nameBnMatch = s.nameBn ? s.nameBn.includes(query) : false;
    const idMatch = s.id.toLowerCase().includes(normalizedQuery);
    const classMatch = s.classLevel.toLowerCase().includes(normalizedQuery);
    const schoolMatch = s.schoolName.toLowerCase().includes(normalizedQuery);
    return nameMatch || nameBnMatch || idMatch || classMatch || schoolMatch;
  });

  const matchedBatches = visibleBatches.filter((b) => {
    if (!normalizedQuery) return true;
    const nameMatch = b.name.toLowerCase().includes(normalizedQuery);
    const subjectMatch = b.subject.toLowerCase().includes(normalizedQuery);
    const classMatch = b.classLevel.toLowerCase().includes(normalizedQuery);
    const codeMatch = b.code ? b.code.toLowerCase().includes(normalizedQuery) : false;
    const daysMatch = b.scheduleDays.some((d) => d.toLowerCase().includes(normalizedQuery));
    return nameMatch || subjectMatch || classMatch || codeMatch || daysMatch;
  });

  // Parents list derived from visible students
  const parentMap = new Map<string, { parentName: string; parentPhone: string; student: Student }>();
  visibleStudents.forEach((s) => {
    const key = `${s.parentPhone}_${s.parentName}`;
    if (!parentMap.has(key)) {
      parentMap.set(key, { parentName: s.parentName, parentPhone: s.parentPhone, student: s });
    }
  });

  const matchedParents = Array.from(parentMap.values()).filter((p) => {
    if (!normalizedQuery) return true;
    const nameMatch = p.parentName.toLowerCase().includes(normalizedQuery);
    const cleanPhone = p.parentPhone.replace(/[^0-9]/g, '');
    const phoneMatch =
      cleanPhone.includes(normalizedQuery) ||
      cleanPhone.replace(/^0/, '').includes(normalizedQuery) ||
      cleanPhone.endsWith(normalizedQuery);
    const studentNameMatch =
      p.student.name.toLowerCase().includes(normalizedQuery) ||
      (p.student.nameBn && p.student.nameBn.includes(query));
    return nameMatch || phoneMatch || studentNameMatch;
  });

  const totalResults = matchedStudents.length + matchedBatches.length + matchedParents.length;

  const handleClose = () => {
    setSearchViewQuery(null);
    if (onBack) onBack();
  };

  const handleSelectStudent = (stId: string) => {
    setSelectedStudentProfileId(stId);
  };

  const handleSelectBatch = (batchId: string) => {
    setExpandedBatchId(batchId);
    setActiveTutorTab('classes');
    setSearchViewQuery(null);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-[#00272B] font-bold text-xs border border-[#00272B]/15 shadow-2xs transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#00272B]" />
            <span>{t.back}</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#00272B] tracking-tight">
              {t.searchResultsTitle}
            </h1>
            <p className="text-xs text-[#00272B]/60 font-medium">
              "{query}" - {toBnNum(totalResults, language, settings.useBanglaDigits)} {t.resultsFound}
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#00272B] text-[#E0FF4F]'
                : 'bg-white text-[#00272B]/70 border border-[#00272B]/10 hover:text-[#00272B]'
            }`}
          >
            {language === 'bn' ? 'সকল' : 'All'} ({totalResults})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('students')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeFilter === 'students'
                ? 'bg-[#00272B] text-[#E0FF4F]'
                : 'bg-white text-[#00272B]/70 border border-[#00272B]/10 hover:text-[#00272B]'
            }`}
          >
            {t.searchGroupStudents} ({matchedStudents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('batches')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeFilter === 'batches'
                ? 'bg-[#00272B] text-[#E0FF4F]'
                : 'bg-white text-[#00272B]/70 border border-[#00272B]/10 hover:text-[#00272B]'
            }`}
          >
            {t.searchGroupBatches} ({matchedBatches.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('parents')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeFilter === 'parents'
                ? 'bg-[#00272B] text-[#E0FF4F]'
                : 'bg-white text-[#00272B]/70 border border-[#00272B]/10 hover:text-[#00272B]'
            }`}
          >
            {t.searchGroupParents} ({matchedParents.length})
          </button>
        </div>
      </div>

      {totalResults === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-[#00272B]/10 text-center space-y-3 shadow-xs">
          <Search className="w-10 h-10 text-[#00272B]/30 mx-auto" />
          <h3 className="text-base font-bold text-[#00272B]">
            {t.noResultsFor} "{query}"
          </h3>
          <p className="text-xs text-[#00272B]/60 max-w-sm mx-auto">
            {t.searchEmptyHint}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Students Group */}
          {(activeFilter === 'all' || activeFilter === 'students') && matchedStudents.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#00272B]/70 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00272B]" />
                <span>{t.searchGroupStudents}</span>
                <span className="text-xs font-normal">({matchedStudents.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {matchedStudents.map((st) => {
                  const batch = batches.find((b) => b.id === st.batchId);
                  const invoice = invoices.find((inv) => inv.studentId === st.id && inv.month.includes('October'));
                  const status = invoice?.status || 'due';

                  return (
                    <div
                      key={st.id}
                      onClick={() => handleSelectStudent(st.id)}
                      className="p-4 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs hover:border-[#00272B]/30 hover:shadow-md transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#00272B] text-[#E0FF4F] font-black text-sm flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                            {st.avatarInitials}
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-[#00272B] leading-tight">
                              {language === 'bn' && st.nameBn ? st.nameBn : st.name}
                            </h3>
                            <p className="text-[11px] text-[#00272B]/60 mt-0.5">
                              {st.classLevel} · {batch?.name}
                            </p>
                          </div>
                        </div>

                        {!isAssistant && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 ${
                              status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'overdue'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {status === 'paid' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            <span>{status.toUpperCase()}</span>
                          </span>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[#00272B]/10 flex items-center justify-between text-[11px] text-[#00272B]/70">
                        <span>{st.parentName}</span>
                        <span className="font-mono">{st.parentPhone}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Batches Group */}
          {(activeFilter === 'all' || activeFilter === 'batches') && matchedBatches.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#00272B]/70 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#00272B]" />
                <span>{t.searchGroupBatches}</span>
                <span className="text-xs font-normal">({matchedBatches.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {matchedBatches.map((b) => {
                  const count = students.filter((s) => s.batchId === b.id).length;
                  return (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBatch(b.id)}
                      className="p-4 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs hover:border-[#00272B]/30 hover:shadow-md transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-black text-[#00272B] bg-[#E0FF4F] px-2 py-0.5 rounded-lg border border-[#00272B]/20">
                          {b.code}
                        </span>
                        <span className="text-xs font-semibold text-emerald-800">
                          ৳{b.monthlyFee}/mo
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-extrabold text-[#00272B] group-hover:text-black">
                          {b.name}
                        </h3>
                        <p className="text-xs text-[#00272B]/60 mt-0.5">
                          {b.scheduleDays.join(' · ')} · {b.scheduleTime}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#00272B]/10 flex items-center justify-between text-xs text-[#00272B]/70 font-semibold">
                        <span>{count} students</span>
                        <span className="text-[#00272B] underline font-bold">
                          {language === 'bn' ? 'রুটিন দেখুন' : 'View Batch'} →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Parents Group */}
          {(activeFilter === 'all' || activeFilter === 'parents') && matchedParents.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#00272B]/70 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00272B]" />
                <span>{t.searchGroupParents}</span>
                <span className="text-xs font-normal">({matchedParents.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {matchedParents.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs hover:border-[#00272B]/20 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-[#00272B]">{p.parentName}</h3>
                        <p className="text-xs font-mono font-semibold text-[#00272B]/70 mt-0.5">
                          {p.parentPhone}
                        </p>
                        <p className="text-[11px] text-[#00272B]/60 mt-1">
                          {language === 'bn' ? 'শিক্ষার্থী:' : 'Student:'}{' '}
                          <button
                            type="button"
                            onClick={() => handleSelectStudent(p.student.id)}
                            className="font-bold text-[#00272B] underline hover:text-black"
                          >
                            {language === 'bn' && p.student.nameBn ? p.student.nameBn : p.student.name}
                          </button>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const clean = p.parentPhone.replace(/[^0-9]/g, '');
                            const fullPhone = clean.startsWith('880') ? clean : `880${clean.startsWith('0') ? clean.slice(1) : clean}`;
                            window.open(`https://wa.me/${fullPhone}`, '_blank');
                          }}
                          className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20ba59] transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            window.location.href = `tel:${p.parentPhone}`;
                          }}
                          className="w-8 h-8 rounded-xl bg-[#F6F8EE] text-[#00272B] border border-[#00272B]/15 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          title="Call"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
