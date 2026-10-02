import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency } from '../../translations';
import { FeeStatus } from '../../types';
import {
  CreditCard,
  Filter,
  MessageCircle,
  Phone,
  Search,
  UserPlus,
  Users
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const {
    students,
    batches,
    invoices,
    language,
    searchQuery,
    setAddStudentModalOpen,
    setSelectedStudentProfileId,
    setRecordPaymentModal
  } = useApp();

  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [feeStatusFilter, setFeeStatusFilter] = useState<'all' | FeeStatus>('all');

  const t = translations[language];

  // Filtering
  const filteredStudents = students.filter((s) => {
    // Search query filter
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nameBn && s.nameBn.includes(searchQuery)) ||
      s.parentPhone.includes(searchQuery) ||
      s.schoolName.toLowerCase().includes(searchQuery.toLowerCase());

    // Batch filter
    const matchesBatch = batchFilter === 'all' || s.batchId === batchFilter;

    // Fee status filter
    const studentInvoice = invoices.find((inv) => inv.studentId === s.id && inv.month === 'October 2026');
    const studentStatus = studentInvoice?.status || 'due';
    const matchesFee = feeStatusFilter === 'all' || studentStatus === feeStatusFilter;

    return matchesSearch && matchesBatch && matchesFee;
  });

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header with Subtitle & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#00272B] tracking-tight">
            {t.navStudents}
          </h1>
          <p className="text-xs sm:text-sm text-[#00272B]/60 font-medium mt-0.5">
            {t.navStudentsSub}
          </p>
        </div>

        <button
          onClick={() => setAddStudentModalOpen(true)}
          className="h-11 px-4 sm:px-5 rounded-2xl bg-[#E0FF4F] hover:bg-[#d6f83b] text-[#00272B] font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 border-2 border-[#00272B] active:scale-95 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4 text-[#00272B]" />
          <span>{t.addStudent}</span>
        </button>
      </div>

      {/* Filter Bar (Segmented Controls) */}
      <div className="p-3 bg-white rounded-2xl border border-[#00272B]/10 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        {/* Batch Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#00272B]/60" />
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="h-9 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-semibold focus:outline-none"
          >
            <option value="all">{language === 'bn' ? 'সকল ব্যাচ (All Batches)' : 'All Batches'}</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fee Status Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#F6F8EE] p-1 rounded-xl">
          {[
            { id: 'all', label: language === 'bn' ? 'সব' : 'All' },
            { id: 'paid', label: t.paid },
            { id: 'due', label: t.due },
            { id: 'overdue', label: t.overdue }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFeeStatusFilter(item.id as any)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                feeStatusFilter === item.id
                  ? 'bg-[#00272B] text-[#E0FF4F] shadow-xs'
                  : 'text-[#00272B]/70 hover:text-[#00272B]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Student Cards Grid */}
      {filteredStudents.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-[#00272B]/10 text-center space-y-3">
          <Users className="w-10 h-10 text-[#00272B]/40 mx-auto" />
          <p className="text-sm font-bold text-[#00272B]">
            {language === 'bn' ? 'কোনো শিক্ষার্থী পাওয়া যায়নি' : 'No students found'}
          </p>
          <p className="text-xs text-[#00272B]/60">
            {language === 'bn' ? 'ফিল্টার বা সার্চ কিওয়ার্ড পরিবর্তন করে দেখুন।' : 'Try changing your search or filter options.'}
          </p>
          <button
            onClick={() => setAddStudentModalOpen(true)}
            className="px-4 py-2 bg-[#E0FF4F] text-[#00272B] rounded-xl font-bold text-xs inline-flex items-center gap-1.5 border border-[#00272B]"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.addStudent}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredStudents.map((st) => {
            const batch = batches.find((b) => b.id === st.batchId);
            const invoice = invoices.find((inv) => inv.studentId === st.id && inv.month === 'October 2026');
            const status = invoice?.status || 'due';

            return (
              <div
                key={st.id}
                onClick={() => setSelectedStudentProfileId(st.id)}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs hover:border-[#00272B]/25 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                {/* Top Row: Avatar & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#00272B] text-[#E0FF4F] font-black text-sm flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      {st.avatarInitials}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-[#00272B] group-hover:text-black leading-tight">
                        {language === 'bn' && st.nameBn ? st.nameBn : st.name}
                      </h3>
                      <p className="text-xs text-[#00272B]/60 mt-0.5 truncate max-w-[170px]">
                        {st.classLevel} · {st.schoolName}
                      </p>
                    </div>
                  </div>

                  {/* Status chip */}
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                      status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : status === 'overdue'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {/* Batch & Fee Info */}
                <div className="p-3 bg-[#F6F8EE] rounded-2xl space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#00272B]/70">{language === 'bn' ? 'ব্যাচ:' : 'Batch:'}</span>
                    <span className="font-semibold text-[#00272B] truncate max-w-[170px]">
                      {batch?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00272B]/70">{language === 'bn' ? 'মাসিক ফি:' : 'Monthly Fee:'}</span>
                    <span className="font-bold text-[#00272B] tabular-nums">
                      {formatCurrency(st.monthlyFee, language)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00272B]/70">{language === 'bn' ? 'অভিভাবক:' : 'Guardian:'}</span>
                    <span className="font-medium text-[#00272B] truncate max-w-[170px]">
                      {st.parentName}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Affordances */}
                <div className="flex items-center justify-between pt-1 border-t border-[#00272B]/5">
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        const clean = st.parentPhone.replace(/[^0-9]/g, '');
                        const fullPhone = clean.startsWith('880') ? clean : `880${clean.startsWith('0') ? clean.slice(1) : clean}`;
                        window.open(`https://wa.me/${fullPhone}`, '_blank');
                      }}
                      title="WhatsApp Guardian"
                      className="p-2 rounded-xl bg-white hover:bg-[#25D366] hover:text-white text-[#00272B]/70 border border-[#00272B]/10 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => window.location.href = `tel:${st.parentPhone}`}
                      title="Call Guardian"
                      className="p-2 rounded-xl bg-white hover:bg-gray-100 text-[#00272B]/70 border border-[#00272B]/10 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecordPaymentModal({ open: true, studentId: st.id });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#E0FF4F] hover:bg-[#d4f82a] text-[#00272B] font-bold text-xs flex items-center gap-1 border border-[#00272B]/20 shadow-2xs"
                  >
                    <CreditCard className="w-3 h-3" />
                    <span>{language === 'bn' ? 'পেমেন্ট' : 'Record Pay'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
