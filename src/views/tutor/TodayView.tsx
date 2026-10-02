import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency, formatDateBn, toBnNum } from '../../translations';
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  MessageSquare,
  Send,
  TrendingUp,
  UserCheck,
  UserX,
  Users
} from 'lucide-react';

export const TodayView: React.FC = () => {
  const {
    language,
    students,
    batches,
    invoices,
    sessions,
    makeUpRequests,
    settings,
    setAttendanceModal,
    setFeeReminderModalOpen,
    setRecordPaymentModal,
    setReportModal,
    setMakeUpModal,
    setSelectedStudentProfileId
  } = useApp();

  const t = translations[language];

  // Bento calculations
  const totalDueMonth = invoices
    .filter((i) => i.status === 'due' || i.status === 'overdue' || i.status === 'partial')
    .reduce((acc, i) => acc + (i.amount - i.paidAmount), 0);

  const totalCollectedMonth = invoices.reduce((acc, i) => acc + i.paidAmount, 0);

  const pendingRemindersCount = invoices.filter(
    (i) => i.status === 'due' || i.status === 'overdue' || i.status === 'partial'
  ).length;

  const pendingMakeUpsCount = makeUpRequests.filter((m) => m.status === 'pending').length;

  const todaySessions = sessions.filter((s) => s.date === '2026-09-30');
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header section with plain-language subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#00272B] tracking-tight">
            {t.navToday}
          </h1>
          <p className="text-xs sm:text-sm text-[#00272B]/60 font-medium mt-0.5">
            {t.navTodaySub}
          </p>
        </div>

        {/* Big Lime CTA: Send fee reminders */}
        <button
          onClick={() => setFeeReminderModalOpen(true)}
          className="h-11 sm:h-12 px-4 sm:px-5 rounded-2xl bg-[#E0FF4F] hover:bg-[#d6f83b] text-[#00272B] font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-2 border-[#00272B] active:scale-95 transition-all shrink-0"
        >
          <Send className="w-4 h-4 text-[#00272B]" />
          <span>
            {t.sendFeeReminders} ({toBnNum(pendingRemindersCount, language, settings.useBanglaDigits)})
          </span>
        </button>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Fees Due (Signature Dark Teal) */}
        <div className="col-span-1 p-4 sm:p-5 rounded-3xl bg-[#00272B] text-white shadow-md flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-[#E0FF4F] uppercase tracking-wider">
              {t.feesDueMonth}
            </span>
            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-[#E0FF4F]">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-white block">
              {formatCurrency(totalDueMonth, language, settings.useBanglaDigits)}
            </span>
            <span className="text-[11px] text-white/60 mt-1 block">
              {toBnNum(pendingRemindersCount, language, settings.useBanglaDigits)} {language === 'bn' ? 'শিক্ষার্থীর বকেয়া' : 'students pending'}
            </span>
          </div>
        </div>

        {/* Card 2: Collected (Light Card) */}
        <div className="col-span-1 p-4 sm:p-5 rounded-3xl bg-white text-[#00272B] border border-[#00272B]/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-[#00272B]/60 uppercase tracking-wider">
              {t.collectedThisMonth}
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#F6F8EE] flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-emerald-800 block">
              {formatCurrency(totalCollectedMonth, language, settings.useBanglaDigits)}
            </span>
            <span className="text-[11px] text-[#00272B]/60 mt-1 block">
              {toBnNum(invoices.filter((i) => i.status === 'paid').length, language, settings.useBanglaDigits)} {language === 'bn' ? 'পরিশোধিত রশিদ' : 'paid invoices'}
            </span>
          </div>
        </div>

        {/* Card 3: Attendance Rate */}
        <div className="col-span-1 p-4 sm:p-5 rounded-3xl bg-white text-[#00272B] border border-[#00272B]/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-[#00272B]/60 uppercase tracking-wider">
              {t.attendanceRate}
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#F6F8EE] flex items-center justify-center text-[#00272B]">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-[#00272B] block">
              {toBnNum('92.4', language, settings.useBanglaDigits)}%
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
              ✓ +{toBnNum('4.2', language, settings.useBanglaDigits)}% {language === 'bn' ? 'গত সপ্তাহের চেয়ে' : 'vs last week'}
            </span>
          </div>
        </div>

        {/* Card 4: Pending Make-ups */}
        <div className="col-span-1 p-4 sm:p-5 rounded-3xl bg-[#00272B] text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-[#E0FF4F] uppercase tracking-wider">
              {t.pendingMakeups}
            </span>
            <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-[#E0FF4F]">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-[#E0FF4F] block">
              {toBnNum(pendingMakeUpsCount, language, settings.useBanglaDigits)}
            </span>
            <span className="text-[11px] text-white/60 mt-1 block">
              {language === 'bn' ? 'স্লট নিশ্চিতের অপেক্ষায়' : 'slots awaiting confirmation'}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Today's Classes Timeline vs Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Today's Classes as Timeline */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00272B]" />
              <h2 className="text-sm sm:text-base font-extrabold text-[#00272B]">
                {t.todayClasses}
              </h2>
            </div>
            <span className="text-xs text-[#00272B]/60 font-semibold">
              {formatDateBn('Wednesday', 30, 'September', language, settings.useBanglaDigits)}
            </span>
          </div>

          <div className="space-y-3">
            {todaySessions.map((session) => {
              const batch = batches.find((b) => b.id === session.batchId);
              const batchStudents = students.filter((s) => s.batchId === session.batchId);
              const presentCount = Object.values(session.attendance).filter((st) => st === 'present').length;

              return (
                <div
                  key={session.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs hover:border-[#00272B]/20 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#00272B] bg-[#F6F8EE] px-2.5 py-1 rounded-lg border border-[#00272B]/10">
                          {session.time}
                        </span>
                        <span className="text-xs text-[#00272B]/60">
                          {batch?.roomOrLink}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-[#00272B] mt-1.5">
                        {batch?.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {session.isCompleted ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t.attendanceCompleted} ({presentCount}/{batchStudents.length})</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAttendanceModal({ open: true, batchId: batch?.id, sessionId: session.id })}
                          className="h-10 px-4 rounded-xl bg-[#E0FF4F] hover:bg-[#d4f82a] text-[#00272B] font-bold text-xs flex items-center gap-1.5 border border-[#00272B] shadow-2xs"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>{t.startMarkAttendance}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Topic Covered Line */}
                  <div className="p-3 bg-[#F6F8EE] rounded-2xl text-xs text-[#00272B]/80 flex items-start gap-2">
                    <span className="font-bold text-[#00272B] shrink-0">
                      {language === 'bn' ? 'পাঠক্রম:' : 'Topic:'}
                    </span>
                    <span>{session.topicCovered}</span>
                  </div>

                  {/* Enrolled Students Quick Chips */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center -space-x-1.5 overflow-hidden">
                      {batchStudents.slice(0, 5).map((st) => (
                        <div
                          key={st.id}
                          className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-[#00272B] text-[#E0FF4F] text-[10px] font-bold flex items-center justify-center"
                          title={st.name}
                        >
                          {st.avatarInitials}
                        </div>
                      ))}
                      {batchStudents.length > 5 && (
                        <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-gray-200 text-[#00272B] text-[10px] font-bold flex items-center justify-center">
                          +{batchStudents.length - 5}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-[#00272B]/60 font-medium">
                      {batchStudents.length} {language === 'bn' ? 'জন শিক্ষার্থী অন্তর্ভুক্ত' : 'students enrolled'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Needs Attention List */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm sm:text-base font-extrabold text-[#00272B]">
              {t.needsAttention}
            </h2>
          </div>

          <div className="space-y-3">
            {/* Overdue fees alert */}
            {overdueInvoices.slice(0, 2).map((inv) => {
              const student = students.find((s) => s.id === inv.studentId);
              return (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-2xl bg-white border border-rose-200 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      {inv.daysOverdue || 8} {t.overdueNotice}
                    </span>
                    <span className="text-xs font-bold text-rose-700">
                      {formatCurrency(inv.amount - inv.paidAmount, language)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#00272B]">{student?.name}</p>
                      <p className="text-[11px] text-[#00272B]/60">{student?.parentPhone}</p>
                    </div>
                    <button
                      onClick={() => setFeeReminderModalOpen(true)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-[#E0FF4F] text-[#00272B] rounded-lg border border-[#00272B]"
                    >
                      {language === 'bn' ? 'তাগাদা দিন' : 'Remind'}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Absent student alert */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#00272B]/10 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  {language === 'bn' ? 'অনুপস্থিতি সতর্কতা' : 'Absence Notice'}
                </span>
                <span className="text-[10px] text-[#00272B]/60">
                  {language === 'bn' ? `${toBnNum(30, language, settings.useBanglaDigits)} সেপ্টেম্বর` : 'Sept 30'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#00272B]">Farhan Kabir</p>
                  <p className="text-[11px] text-[#00272B]/60">
                    {language === 'bn' ? 'আইসিটি ক্লাসে অনুপস্থিত ছিল' : 'Missed ICT Chapter 3'}
                  </p>
                </div>
                <button
                  onClick={() => setMakeUpModal({ open: true, studentId: 's8' })}
                  className="px-2.5 py-1 text-[11px] font-bold bg-[#00272B] text-[#E0FF4F] rounded-lg hover:bg-black transition-colors"
                >
                  {language === 'bn' ? 'মেক-আপ স্লট' : 'Make-Up Slot'}
                </button>
              </div>
            </div>

            {/* Weekly report ready to send */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#00272B]/10 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {language === 'bn' ? 'সাপ্তাহিক রিপোর্ট তৈরি' : 'Report Ready'}
                </span>
                <span className="text-[10px] text-[#00272B]/60">Friday auto</span>
              </div>
              <p className="text-xs text-[#00272B]/80 font-medium">
                {language === 'bn'
                  ? 'তানজিলা আক্তারের সাপ্তাহিক রিপোর্ট তৈরি হয়েছে।'
                  : 'Weekly report compiled for Tanjila Akter.'}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setReportModal({ open: true, studentId: 's5' })}
                  className="px-2.5 py-1 text-[11px] font-bold bg-[#E0FF4F] text-[#00272B] rounded-lg border border-[#00272B]"
                >
                  {language === 'bn' ? 'রিভিউ ও প্রিভিউ' : 'Review & Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
