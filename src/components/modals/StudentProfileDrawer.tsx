import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency, toBnNum } from '../../translations';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  GraduationCap,
  MessageCircle,
  Phone,
  PlusCircle,
  Send,
  Trash2,
  UserCheck,
  X
} from 'lucide-react';

export const StudentProfileDrawer: React.FC = () => {
  const {
    selectedStudentProfileId,
    setSelectedStudentProfileId,
    students,
    batches,
    invoices,
    sessions,
    progressNotes,
    makeUpRequests,
    settings,
    language,
    setActiveTutorTab,
    setRecordPaymentModal,
    setAttendanceModal,
    setFeeReminderModalOpen,
    deleteStudent,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'fees' | 'attendance' | 'progress'>('overview');
  const t = translations[language];

  if (!selectedStudentProfileId) return null;

  const student = students.find((s) => s.id === selectedStudentProfileId);
  if (!student) return null;

  const batch = batches.find((b) => b.id === student.batchId);
  const studentInvoices = invoices.filter((i) => i.studentId === student.id);
  const studentNotes = progressNotes.filter((p) => p.studentId === student.id);
  const studentMakeUps = makeUpRequests.filter((m) => m.studentId === student.id);

  // Latest invoice for current month
  const currentInvoice = studentInvoices.find((i) => i.month.includes('October') || i.month.includes('2026')) || studentInvoices[0];
  const feeStatus = currentInvoice?.status || 'due';
  const dueAmount = currentInvoice ? currentInvoice.amount - currentInvoice.paidAmount : 0;

  // Attendance history calculation (past 30 days)
  const batchSessions = sessions.filter((s) => s.batchId === student.batchId);
  const totalTrackedSessions = batchSessions.length > 0 ? batchSessions.length : 8;
  const presentSessions = batchSessions.filter((s) => s.attendance[student.id] === 'present').length;
  const attendedCount = batchSessions.length > 0 ? presentSessions : 7;
  const attendanceRate = Math.round((attendedCount / totalTrackedSessions) * 100);

  // Circular ring math
  const ringRadius = 28;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (attendanceRate / 100) * ringCircumference;

  // Security rule: Assistant role hides fee amounts and fee-status chips
  const isAssistant = settings.userRole === 'Assistant';

  const handleCall = () => {
    window.location.href = `tel:${student.parentPhone}`;
  };

  const handleWhatsApp = () => {
    const clean = student.parentPhone.replace(/[^0-9]/g, '');
    const fullPhone = clean.startsWith('880') ? clean : `880${clean.startsWith('0') ? clean.slice(1) : clean}`;
    window.open(
      `https://wa.me/${fullPhone}?text=${encodeURIComponent(
        `আসসালামু আলাইকুম, ${student.parentName}। ${student.name}-এর টিউশন সংক্রান্ত আপডেট।`
      )}`,
      '_blank'
    );
  };

  const handleBack = () => {
    setSelectedStudentProfileId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-profile-title"
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#00272B]/10 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Top Header with prominent Back Button */}
        <div className="bg-[#00272B] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors shrink-0"
              aria-label="Back to previous screen"
            >
              <ArrowLeft className="w-4 h-4 text-[#E0FF4F]" />
              <span>{t.back}</span>
            </button>

            <div className="h-4 w-px bg-white/20 hidden sm:block" />

            <div>
              <span className="text-[10px] text-[#E0FF4F] font-bold uppercase tracking-wider block">
                {language === 'bn' ? 'শিক্ষার্থী প্রোফাইল' : 'Student Profile'}
              </span>
              <h2 id="student-profile-title" className="text-base sm:text-lg font-black text-white leading-tight">
                {language === 'bn' && student.nameBn ? student.nameBn : student.name}
                {student.nameBn && language !== 'bn' && (
                  <span className="text-xs text-white/60 font-normal ml-2">({student.nameBn})</span>
                )}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Student Overview Banner */}
        <div className="p-4 sm:p-5 bg-[#F6F8EE] border-b border-[#00272B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#00272B] text-[#E0FF4F] font-black text-xl flex items-center justify-center shadow-sm shrink-0">
              {student.avatarInitials}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-extrabold text-[#00272B]">
                  {student.name}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#00272B]/60 bg-white px-2 py-0.5 rounded-md border border-[#00272B]/10">
                  ID: {student.id.toUpperCase()}
                </span>
                {batch?.code && (
                  <span className="text-[11px] font-mono font-black text-[#00272B] bg-[#E0FF4F] px-2 py-0.5 rounded-md border border-[#00272B]/20">
                    {batch.code}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#00272B]/70 mt-0.5 font-medium">
                {student.classLevel} · {student.schoolName}
              </p>
              <p className="text-xs text-[#00272B]/80 font-semibold mt-0.5">
                {language === 'bn' ? 'ব্যাচ:' : 'Batch:'} {batch?.name} ({batch?.scheduleDays.join(', ')})
              </p>
            </div>
          </div>

          {/* Fee status chip (Hidden for Assistant) */}
          {!isAssistant && (
            <div className="flex flex-col sm:items-end justify-center shrink-0">
              <span className="text-[10px] text-[#00272B]/60 font-semibold mb-1">
                {language === 'bn' ? 'চলতি মাসের ফি স্ট্যাটাস' : 'Current Fee Status'}
              </span>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border ${
                  feeStatus === 'paid'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : feeStatus === 'overdue'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {feeStatus === 'paid' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : feeStatus === 'overdue' ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>
                  {feeStatus === 'paid'
                    ? language === 'bn' ? 'পরিশোধিত (Paid)' : 'Paid'
                    : feeStatus === 'overdue'
                    ? `${language === 'bn' ? 'মেয়াদোত্তীর্ণ' : 'Overdue'} (৳${dueAmount})`
                    : `${language === 'bn' ? 'বকেয়া' : 'Due'} (৳${dueAmount})`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Guardian Contact Row */}
        <div className="px-4 sm:px-5 py-3 bg-white border-b border-[#00272B]/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#00272B]/60">{language === 'bn' ? 'অভিভাবক:' : 'Guardian:'}</span>
            <span className="font-bold text-[#00272B]">{student.parentName}</span>
            <span className="text-[#00272B]/40">·</span>
            <span className="font-mono text-[#00272B]/80 font-semibold">{student.parentPhone}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="h-8 px-3 text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleCall}
              className="h-8 px-3 text-xs font-bold bg-[#F6F8EE] text-[#00272B] hover:bg-gray-200 rounded-xl border border-[#00272B]/15 flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#00272B]/70" />
              <span>{language === 'bn' ? 'কল করুন' : 'Call'}</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Action Buttons Bar */}
        <div className="px-4 sm:px-5 py-3 bg-[#F6F8EE] border-b border-[#00272B]/10 grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setAttendanceModal({ open: true, batchId: student.batchId })}
            className="h-9 px-2 text-xs font-bold bg-white hover:bg-[#E0FF4F] text-[#00272B] rounded-xl border border-[#00272B]/15 shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#00272B]" />
            <span className="truncate">{language === 'bn' ? 'উপস্থিতি নিন' : 'Mark Attendance'}</span>
          </button>

          {!isAssistant && (
            <button
              type="button"
              onClick={() => setRecordPaymentModal({ open: true, studentId: student.id })}
              className="h-9 px-2 text-xs font-bold bg-[#E0FF4F] hover:bg-[#d6f83b] text-[#00272B] rounded-xl border border-[#00272B]/20 shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#00272B]" />
              <span className="truncate">{language === 'bn' ? 'পেমেন্ট নিন' : 'Record Payment'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setSelectedStudentProfileId(null);
              setActiveTutorTab('progress');
              showToast(
                language === 'bn'
                  ? `${student.name}-এর জন্য লেসন নোট ফর্ম খোলা হয়েছে`
                  : `Lesson note opened for ${student.name}`
              );
            }}
            className="h-9 px-2 text-xs font-bold bg-white hover:bg-[#E0FF4F] text-[#00272B] rounded-xl border border-[#00272B]/15 shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#00272B]" />
            <span className="truncate">{language === 'bn' ? 'নোট লিখুন' : 'Add Note'}</span>
          </button>

          {!isAssistant && (
            <button
              type="button"
              onClick={() => setFeeReminderModalOpen(true)}
              className="h-9 px-2 text-xs font-bold bg-white hover:bg-rose-50 text-rose-700 rounded-xl border border-rose-200 shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-rose-600" />
              <span className="truncate">{language === 'bn' ? 'তাগাদা পাঠান' : 'Fee Reminder'}</span>
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-5 pt-3 border-b border-[#00272B]/10 flex gap-4 text-xs font-bold text-[#00272B]/60 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'overview' ? 'border-[#00272B] text-[#00272B]' : 'border-transparent hover:text-[#00272B]'
            }`}
          >
            {language === 'bn' ? 'ওভারভিউ' : 'Overview'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`pb-2.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'attendance' ? 'border-[#00272B] text-[#00272B]' : 'border-transparent hover:text-[#00272B]'
            }`}
          >
            {language === 'bn' ? 'উপস্থিতি ও মেক-আপ' : 'Attendance & Make-up'}
          </button>
          {!isAssistant && (
            <button
              type="button"
              onClick={() => setActiveTab('fees')}
              className={`pb-2.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'fees' ? 'border-[#00272B] text-[#00272B]' : 'border-transparent hover:text-[#00272B]'
              }`}
            >
              {language === 'bn' ? 'ফি ও পেমেন্ট হিস্ট্রি' : 'Fee & Payment History'} ({studentInvoices.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('progress')}
            className={`pb-2.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'progress' ? 'border-[#00272B] text-[#00272B]' : 'border-transparent hover:text-[#00272B]'
            }`}
          >
            {language === 'bn' ? 'প্রগ্রেস ও নোটস' : 'Progress & Notes'} ({studentNotes.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Financial Plan & Attendance Summary Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Attendance 30-Day Ring Card */}
                <div className="p-4 bg-[#F6F8EE] rounded-2xl border border-[#00272B]/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#00272B]/70 font-semibold block">
                      {language === 'bn' ? 'গত ৩০ দিনের উপস্থিতি' : 'Attendance (Last 30 Days)'}
                    </span>
                    <p className="text-xl font-extrabold text-[#00272B] mt-0.5">
                      {toBnNum(attendedCount, language, settings.useBanglaDigits)} / {toBnNum(totalTrackedSessions, language, settings.useBanglaDigits)}{' '}
                      <span className="text-xs font-normal text-[#00272B]/60">
                        {language === 'bn' ? 'ক্লাস সম্পন্ন' : 'classes'}
                      </span>
                    </p>
                    <p className="text-[11px] text-emerald-700 font-bold mt-1">
                      {toBnNum(attendanceRate, language, settings.useBanglaDigits)}% {language === 'bn' ? 'উপস্থিতির হার' : 'attendance rate'}
                    </p>
                  </div>

                  {/* Visual SVG Progress Ring */}
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r={ringRadius}
                        stroke="#00272B"
                        strokeOpacity="0.1"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r={ringRadius}
                        stroke="#00272B"
                        strokeWidth="5"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className="absolute text-xs font-extrabold text-[#00272B]">
                      {toBnNum(attendanceRate, language, settings.useBanglaDigits)}%
                    </span>
                  </div>
                </div>

                {/* Monthly Fee Plan Card */}
                {!isAssistant ? (
                  <div className="p-4 bg-[#F6F8EE] rounded-2xl border border-[#00272B]/10 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-[#00272B]/70 font-semibold block">
                        {language === 'bn' ? 'মাসিক ফি প্ল্যান' : 'Monthly Fee Plan'}
                      </span>
                      <p className="text-xl font-extrabold text-[#00272B] mt-0.5">
                        {formatCurrency(student.monthlyFee, language, settings.useBanglaDigits)}/mo
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#00272B]/10 text-xs flex items-center justify-between text-[#00272B]/80">
                      <span>{language === 'bn' ? 'ডিসকাউন্ট:' : 'Discount:'}</span>
                      <span className="font-bold">
                        {student.discountAmount > 0
                          ? `৳${student.discountAmount} (${student.discountType})`
                          : language === 'bn' ? 'কোনো ডিসকাউন্ট নেই' : 'Standard'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#F6F8EE] rounded-2xl border border-[#00272B]/10 flex items-center">
                    <p className="text-xs text-[#00272B]/60 italic">
                      {language === 'bn' ? 'সহকারী শিক্ষক হিসেবে আর্থিক তথ্য লুকানো রয়েছে।' : 'Financial data hidden for Assistant role.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Make-Up Class Status Section */}
              <div className="p-4 bg-white rounded-2xl border border-[#00272B]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-[#00272B]" />
                    <h3 className="text-sm font-bold text-[#00272B]">
                      {language === 'bn' ? 'মেক-আপ ক্লাসের বর্তমান অবস্থা' : 'Make-Up Class Status'}
                    </h3>
                  </div>
                  {studentMakeUps.length > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        studentMakeUps[0].status === 'parent_confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {studentMakeUps[0].status === 'parent_confirmed'
                        ? language === 'bn' ? 'অভিভাবক কর্তৃক অনুমোদিত' : 'Confirmed by Parent'
                        : language === 'bn' ? 'অনুমোদনের অপেক্ষায়' : 'Pending Confirmation'}
                    </span>
                  )}
                </div>

                {studentMakeUps.length === 0 ? (
                  <p className="text-xs text-[#00272B]/60 italic">
                    {language === 'bn'
                      ? 'কোনো বকেয়া মেক-আপ ক্লাস নেই। সকল রুটিন সম্পন্ন।'
                      : 'No missed classes or pending make-up requests.'}
                  </p>
                ) : (
                  studentMakeUps.map((mu) => (
                    <div key={mu.id} className="p-3 bg-[#F6F8EE] rounded-xl text-xs space-y-1.5 border border-[#00272B]/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-[#00272B]">
                            {language === 'bn' ? 'অনুপস্থিতির তারিখ:' : 'Missed Class:'} {mu.missedDate}
                          </p>
                          <p className="text-[11px] text-[#00272B]/70">{mu.reason}</p>
                        </div>
                      </div>
                      {mu.confirmedSlot && (
                        <div className="mt-2 p-2 bg-white rounded-lg border border-[#00272B]/15 flex items-center justify-between">
                          <span className="text-[11px] text-[#00272B]/80 font-medium">
                            <strong>{language === 'bn' ? 'নির্ধারিত স্লট:' : 'Locked Slot:'}</strong> {mu.confirmedSlot}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            ✓ {language === 'bn' ? 'নিশ্চিত' : 'Confirmed'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Recent Progress Note Preview */}
              <div className="p-4 bg-white rounded-2xl border border-[#00272B]/15 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#00272B]">
                    {language === 'bn' ? 'সাম্প্রতিক প্রগ্রেস নোট' : 'Recent Progress Note'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('progress')}
                    className="text-xs text-[#00272B] underline font-semibold"
                  >
                    {language === 'bn' ? 'সকল নোট দেখুন' : 'View all notes'}
                  </button>
                </div>

                {studentNotes.length === 0 ? (
                  <p className="text-xs text-[#00272B]/60 italic">
                    {language === 'bn' ? 'এখনো কোনো লেসন নোট যোগ করা হয়নি।' : 'No progress notes logged yet.'}
                  </p>
                ) : (
                  <div className="p-3 bg-[#F6F8EE] rounded-xl text-xs space-y-1 border border-[#00272B]/10">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#00272B]">{studentNotes[0].topic}</span>
                      <span className="text-[10px] font-mono text-[#00272B]/60">{studentNotes[0].date}</span>
                    </div>
                    <p className="text-[11px] text-[#00272B]/80">{studentNotes[0].note}</p>
                    {studentNotes[0].score !== undefined && (
                      <p className="text-[10px] font-bold text-emerald-800 pt-1">
                        {language === 'bn' ? 'স্কোর:' : 'Quiz Score:'} {studentNotes[0].score} / {studentNotes[0].maxScore}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Danger Zone: Remove */}
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-[11px] text-[#00272B]/50">
                  {language === 'bn' ? 'যুক্ত হওয়ার তারিখ:' : 'Joined:'} {student.joinDate}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(language === 'bn' ? 'আপনি কি এই শিক্ষার্থীকে মুছে ফেলতে চান?' : 'Are you sure you want to remove this student?')) {
                      deleteStudent(student.id);
                      setSelectedStudentProfileId(null);
                    }
                  }}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'শিক্ষার্থী অপসারণ' : 'Delete Student'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#F6F8EE] rounded-2xl border border-[#00272B]/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#00272B]">
                    {language === 'bn' ? 'উপস্থিতি হিসেব (গত ৩০ দিন)' : 'Attendance Statistics'}
                  </h4>
                  <p className="text-xs text-[#00272B]/70 mt-0.5">
                    {attendedCount} / {totalTrackedSessions} {language === 'bn' ? 'ক্লাসে উপস্থিত ছিলেন' : 'classes attended'} ({attendanceRate}%)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAttendanceModal({ open: true, batchId: student.batchId })}
                  className="px-3 py-1.5 bg-[#00272B] text-[#E0FF4F] rounded-xl font-bold text-xs"
                >
                  {language === 'bn' ? 'উপস্থিতি নিন' : 'Mark Attendance'}
                </button>
              </div>

              {/* Make-Up Class Section */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#00272B] text-sm">
                  {language === 'bn' ? 'মেক-আপ ক্লাসের রেকর্ড' : 'Make-Up Class Center'}
                </h4>
                {studentMakeUps.length === 0 ? (
                  <p className="text-xs text-[#00272B]/60 p-3 bg-white rounded-xl border border-[#00272B]/10">
                    {language === 'bn' ? 'কোনো মেক-আপ ক্লাসের রিকোয়েস্ট নেই।' : 'No make-up requests found.'}
                  </p>
                ) : (
                  studentMakeUps.map((mu) => (
                    <div key={mu.id} className="p-3.5 bg-white rounded-2xl border border-[#00272B]/15 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#00272B]">
                          {language === 'bn' ? 'অনুপস্থিতির তারিখ:' : 'Missed:'} {mu.missedDate}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            mu.status === 'parent_confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {mu.status === 'parent_confirmed' ? 'Confirmed by Parent' : 'Pending Confirmation'}
                        </span>
                      </div>
                      <p className="text-[#00272B]/70">{mu.reason}</p>
                      {mu.confirmedSlot && (
                        <p className="font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                          {language === 'bn' ? 'অনুমোদিত স্লট:' : 'Confirmed Slot:'} {mu.confirmedSlot}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'fees' && !isAssistant && (
            <div className="space-y-3">
              {studentInvoices.length === 0 ? (
                <p className="text-center py-6 text-xs text-[#00272B]/60">
                  {language === 'bn' ? 'কোনো ইনভয়েস পাওয়া যায়নি।' : 'No invoices recorded yet.'}
                </p>
              ) : (
                studentInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-2xl bg-[#F6F8EE] border border-[#00272B]/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-[#00272B]">{inv.month}</h5>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              inv.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'overdue'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inv.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#00272B]/60 mt-0.5">
                          Due: {inv.dueDate} · Total: {formatCurrency(inv.amount, language, settings.useBanglaDigits)}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#00272B] block">
                          {inv.paidAmount > 0
                            ? `Paid: ৳${toBnNum(inv.paidAmount, language, settings.useBanglaDigits)}`
                            : 'Unpaid'}
                        </span>
                        {inv.amount - inv.paidAmount > 0 && (
                          <span className="text-[11px] font-bold text-rose-600">
                            Due: ৳{toBnNum(inv.amount - inv.paidAmount, language, settings.useBanglaDigits)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Payments record */}
                    {inv.payments && inv.payments.length > 0 && (
                      <div className="pt-2 border-t border-[#00272B]/10 space-y-1">
                        <span className="text-[10px] font-bold text-[#00272B]/60 uppercase tracking-wider block">
                          {language === 'bn' ? 'পরিশোধ বিবরণ:' : 'Payment Records:'}
                        </span>
                        {inv.payments.map((p) => (
                          <div
                            key={p.id}
                            className="p-2 bg-white rounded-xl border border-[#00272B]/10 flex items-center justify-between text-[11px]"
                          >
                            <div>
                              <span className="font-semibold text-[#00272B]">৳{p.amount}</span>
                              <span className="text-[#00272B]/60 ml-2">via {p.method}</span>
                              {p.trxId && <span className="font-mono text-[10px] text-gray-500 ml-1.5">(Trx: {p.trxId})</span>}
                            </div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              ✓ {p.verified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-3">
              {studentNotes.length === 0 ? (
                <p className="text-center py-6 text-xs text-[#00272B]/60">
                  {language === 'bn' ? 'কোনো প্রগ্রেস নোট যোগ করা হয়নি।' : 'No progress notes logged yet.'}
                </p>
              ) : (
                studentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#00272B]/10 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[#00272B]">{note.topic}</h5>
                      <span className="text-[10px] font-mono text-[#00272B]/60">{note.date}</span>
                    </div>

                    <p className="text-xs text-[#00272B]/80">{note.note}</p>

                    <div className="flex items-center gap-2 pt-1 border-t border-[#00272B]/5 text-[11px]">
                      <span className="px-2 py-0.5 bg-[#F6F8EE] rounded-md font-semibold text-[#00272B]">
                        HW: {note.homeworkStatus}
                      </span>
                      <span className="px-2 py-0.5 bg-[#F6F8EE] rounded-md font-semibold text-[#00272B]">
                        Mood: {note.moodTag}
                      </span>
                      {note.score !== undefined && (
                        <span className="ml-auto font-bold text-emerald-800">
                          Score: {note.score} / {note.maxScore}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
