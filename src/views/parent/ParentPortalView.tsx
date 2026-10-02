import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency } from '../../translations';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  FileText,
  Home,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  Receipt,
  Send,
  ShieldCheck,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export const ParentPortalView: React.FC = () => {
  const {
    activeParentTab,
    setActiveParentTab,
    selectedChildId,
    setSelectedChildId,
    students,
    batches,
    invoices,
    weeklyReports,
    makeUpRequests,
    settings,
    language,
    submitParentPayment,
    confirmMakeUpSlot,
    setReceiptModal,
    showToast
  } = useApp();

  const t = translations[language];

  const [paymentAmount, setPaymentAmount] = useState<number>(2200);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Available children for parent demo (Tanjila Akter 's5' and Sabbir Hossain 's7' are siblings of Parveen Sultana)
  const parentChildren = students.filter(
    (s) => s.id === 's5' || s.id === 's7' || s.parentPhone === '01711223344'
  );

  const currentChild = students.find((s) => s.id === selectedChildId) || parentChildren[0] || students[0];
  const childBatch = batches.find((b) => b.id === currentChild.batchId);
  const childInvoices = invoices.filter((i) => i.studentId === currentChild.id);
  const currentInvoice = childInvoices.find((i) => i.status !== 'paid') || childInvoices[0];
  const childReports = weeklyReports.filter((r) => r.studentId === currentChild.id);
  const childMakeUps = makeUpRequests.filter((m) => m.studentId === currentChild.id);

  const dueAmount = currentInvoice ? currentInvoice.amount - currentInvoice.paidAmount : 0;

  const handleCopyPaymentNumber = (number: string) => {
    navigator.clipboard.writeText(number.split(' ')[0]);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
    showToast(language === 'bn' ? 'নম্বর কপি করা হয়েছে' : 'Account number copied');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId || !currentChild) return;
    submitParentPayment(currentChild.id, paymentAmount, paymentMethod, trxId);
    setTrxId('');
  };

  const handleWhatsAppTeacher = () => {
    const clean = settings.phone.replace(/[^0-9]/g, '');
    const full = clean.startsWith('880') ? clean : `880${clean.startsWith('0') ? clean.slice(1) : clean}`;
    window.open(
      `https://wa.me/${full}?text=${encodeURIComponent(`আসসালামু আলাইকুম স্যার, ${currentChild.name}-এর ব্যাপারে জানতে চাচ্ছি।`)}`,
      '_blank'
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24 md:pb-10 pt-1">
      {/* Top Banner: Parent Greeting & Child Switcher */}
      <div className="bg-[#00272B] text-white p-5 rounded-3xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#E0FF4F] uppercase tracking-wider block">
              {language === 'bn' ? 'স্বাগতম, পারভীন সুলতানা' : 'Welcome, Parveen Sultana'}
            </span>
            <h2 className="text-lg font-black text-white mt-0.5">
              {settings.coachingName}
            </h2>
          </div>
          <button
            onClick={handleWhatsAppTeacher}
            className="px-3 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'শিক্ষককে মেসেজ' : 'Message Teacher'}</span>
          </button>
        </div>

        {/* Multi-Child Selector */}
        <div>
          <label className="block text-[11px] text-white/70 font-semibold mb-1.5">
            {language === 'bn' ? 'সন্তান নির্বাচন করুন:' : 'Select Student (Child):'}
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {parentChildren.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  selectedChildId === child.id
                    ? 'bg-[#E0FF4F] text-[#00272B] shadow-sm'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#00272B] text-[#E0FF4F] text-[10px] flex items-center justify-center font-bold">
                  {child.avatarInitials}
                </div>
                <span>{language === 'bn' && child.nameBn ? child.nameBn : child.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({child.classLevel.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: HOME */}
      {activeParentTab === 'home' && (
        <div className="space-y-4">
          {/* Bento Highlight Card */}
          <div className="grid grid-cols-2 gap-3">
            {/* Attendance % */}
            <div className="p-4 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-[#00272B]/60 uppercase tracking-wider">
                {language === 'bn' ? 'সাপ্তাহিক উপস্থিতি' : 'Attendance This Week'}
              </span>
              <div className="mt-2">
                <span className="text-3xl font-black text-emerald-800 tabular-nums">
                  100%
                </span>
                <span className="text-xs text-emerald-700 block font-semibold mt-1">
                  ✓ ৩ ক্লাসের ৩টিতেই উপস্থিত
                </span>
              </div>
            </div>

            {/* Fee Status */}
            <div className="p-4 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-[#00272B]/60 uppercase tracking-wider">
                {language === 'bn' ? 'অক্টোবর মাসের ফি' : 'October Tuition Fee'}
              </span>
              <div className="mt-2">
                <span
                  className={`text-2xl font-black tabular-nums ${
                    dueAmount > 0 ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {dueAmount > 0 ? formatCurrency(dueAmount, language) : 'পরিশোধিত'}
                </span>
                <span className="text-xs text-[#00272B]/60 block font-medium mt-1">
                  {dueAmount > 0
                    ? (language === 'bn' ? 'বকেয়া রয়েছে' : 'Pending payment')
                    : (language === 'bn' ? 'ধন্যবাদ! কোনো বকেয়া নেই' : 'All clear')}
                </span>
              </div>
            </div>
          </div>

          {/* Next Class Timeline Card */}
          <div className="p-5 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00272B]" />
                <h3 className="text-sm font-extrabold text-[#00272B]">
                  {language === 'bn' ? 'পরবর্তী ক্লাস' : 'Next Scheduled Class'}
                </h3>
              </div>
              <span className="text-xs font-bold text-[#00272B] bg-[#F6F8EE] px-2.5 py-1 rounded-lg">
                Thursday, 05:00 PM
              </span>
            </div>

            <div className="p-3.5 bg-[#F6F8EE] rounded-2xl space-y-2">
              <h4 className="text-sm font-bold text-[#00272B]">{childBatch?.name}</h4>
              <div className="text-xs text-[#00272B]/70 space-y-1">
                <p>Teacher: {childBatch?.teacherName}</p>
                <p>Location/Link: {childBatch?.roomOrLink}</p>
              </div>
            </div>
          </div>

          {/* Latest Weekly Report Card Preview */}
          {childReports[0] && (
            <div className="p-5 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#00272B]" />
                  <h3 className="text-sm font-extrabold text-[#00272B]">
                    {language === 'bn' ? 'সর্বশেষ সাপ্তাহিক রিপোর্ট' : 'Latest Weekly Report'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveParentTab('reports')}
                  className="text-xs font-bold text-[#00272B] hover:underline"
                >
                  {language === 'bn' ? 'সব রিপোর্ট দেখুন →' : 'View all →'}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#00272B] text-white space-y-2.5">
                <p className="text-xs text-white/80 italic leading-relaxed">
                  "{childReports[0].teacherRemark}"
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-[#E0FF4F] font-bold">
                    Quiz Score: {childReports[0].examScore}
                  </span>
                  <span className="text-white/60">
                    Week ending {childReports[0].weekEndDate}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REPORTS */}
      {activeParentTab === 'reports' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-[#00272B]">
              {language === 'bn' ? 'সাপ্তাহিক প্রগ্রেস রিপোর্ট কার্ড' : 'Weekly Progress Reports'}
            </h2>
            <p className="text-xs text-[#00272B]/60">
              {language === 'bn'
                ? 'প্রতি সপ্তাহে শিক্ষক কর্তৃক মূল্যায়িত অগ্রগতি, হোমওয়ার্ক ও পরীক্ষার খতিয়ান'
                : 'Direct teacher assessments and weekly topics mastery'}
            </p>
          </div>

          {childReports.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl text-center text-xs text-[#00272B]/60 border border-[#00272B]/10">
              {language === 'bn' ? 'এখনো কোনো সাপ্তাহিক রিপোর্ট যোগ করা হয়নি।' : 'No weekly reports recorded yet.'}
            </div>
          ) : (
            childReports.map((report) => (
              <div
                key={report.id}
                className="p-5 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#00272B]/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#00272B]/60 block">
                      {settings.coachingName}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#00272B]">
                      Week: {report.weekStartDate} to {report.weekEndDate}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    {report.attendanceCount.present} / {report.attendanceCount.total} Classes Attended
                  </span>
                </div>

                {/* Topics Covered */}
                <div>
                  <h4 className="text-xs font-bold text-[#00272B] mb-1.5">
                    {language === 'bn' ? 'এই সপ্তাহে যা শেখানো হয়েছে:' : 'Topics Covered:'}
                  </h4>
                  <ul className="text-xs text-[#00272B]/80 space-y-1 list-disc pl-4">
                    {report.topics.map((tp, i) => (
                      <li key={i}>{tp}</li>
                    ))}
                  </ul>
                </div>

                {/* Homework & Quiz */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-[#F6F8EE] rounded-2xl">
                    <span className="text-[10px] text-[#00272B]/60 block font-semibold">
                      {language === 'bn' ? 'হোমওয়ার্ক:' : 'Homework:'}
                    </span>
                    <span className="font-bold text-[#00272B]">{report.homeworkSummary}</span>
                  </div>
                  <div className="p-3 bg-[#F6F8EE] rounded-2xl">
                    <span className="text-[10px] text-[#00272B]/60 block font-semibold">
                      {language === 'bn' ? 'কুইজ স্কোর:' : 'Evaluation Quiz:'}
                    </span>
                    <span className="font-bold text-emerald-800">{report.examScore || 'N/A'}</span>
                  </div>
                </div>

                {/* Teacher Remark Bento Box */}
                <div className="p-4 rounded-2xl bg-[#00272B] text-white space-y-1.5">
                  <span className="text-[11px] font-bold text-[#E0FF4F]">
                    {language === 'bn' ? 'শিক্ষকের পরামর্শ ও মন্তব্য:' : "Teacher's Evaluation:"}
                  </span>
                  <p className="text-xs text-white/90 leading-relaxed italic">
                    "{report.teacherRemark}"
                  </p>
                </div>

                {/* Next week plan */}
                <div className="text-xs text-[#00272B]/80">
                  <span className="font-bold text-[#00272B]">
                    {language === 'bn' ? 'পরবর্তী সপ্তাহের পরিকল্পনা: ' : 'Next Week Plan: '}
                  </span>
                  {report.nextWeekPlan}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: FEES */}
      {activeParentTab === 'fees' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-[#00272B]">
              {language === 'bn' ? 'টিউশন ফি ও পেমেন্ট হিসেব' : 'Tuition Fees & Payments'}
            </h2>
            <p className="text-xs text-[#00272B]/60">
              {language === 'bn'
                ? 'বিকাশ বা নগদে ফি পরিশোধ করে সহজেই ট্রানজ্যাকশন আইডি সাবমিট করুন'
                : 'Direct payment instructions and verified digital receipts'}
            </p>
          </div>

          {/* Current Due Box */}
          <div className="p-5 rounded-3xl bg-[#00272B] text-white shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#E0FF4F] uppercase tracking-wider block">
                {language === 'bn' ? 'বর্তমান বকেয়া ফি (অক্টোবর)' : 'Current Due (October)'}
              </span>
              <span className="text-3xl font-black text-white tabular-nums mt-1 block">
                {formatCurrency(dueAmount, language)}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                dueAmount === 0 ? 'bg-emerald-500 text-white' : 'bg-[#E0FF4F] text-[#00272B]'
              }`}
            >
              {dueAmount === 0 ? 'All Paid' : 'Payment Due'}
            </span>
          </div>

          {/* Payment Instructions & Number Copy */}
          <div className="p-5 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#00272B]">
              {language === 'bn' ? 'পেমেন্ট নির্দেশিকা (মোবাইল ব্যাংকিং)' : 'Mobile Banking Instructions'}
            </h3>

            <div className="space-y-2.5">
              {/* bKash Box */}
              <div className="p-3 bg-[#F6F8EE] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#E2136E] block">bKash (Send Money)</span>
                  <span className="text-xs font-mono font-bold text-[#00272B]">{settings.bKashNumber}</span>
                </div>
                <button
                  onClick={() => handleCopyPaymentNumber(settings.bKashNumber)}
                  className="px-3 py-1.5 text-xs font-bold bg-white text-[#00272B] rounded-xl border border-[#00272B]/10 hover:bg-[#E0FF4F] flex items-center gap-1 shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Nagad Box */}
              <div className="p-3 bg-[#F6F8EE] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F7941D] block">Nagad (Payment/Merchant)</span>
                  <span className="text-xs font-mono font-bold text-[#00272B]">{settings.nagadNumber}</span>
                </div>
                <button
                  onClick={() => handleCopyPaymentNumber(settings.nagadNumber)}
                  className="px-3 py-1.5 text-xs font-bold bg-white text-[#00272B] rounded-xl border border-[#00272B]/10 hover:bg-[#E0FF4F] flex items-center gap-1 shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Submit TrxID Form */}
            <form onSubmit={handlePaymentSubmit} className="pt-3 border-t border-[#00272B]/10 space-y-3">
              <h4 className="text-xs font-bold text-[#00272B]">
                {language === 'bn' ? 'পেমেন্ট শেষে ট্রানজ্যাকশন আইডি (TrxID) জমা দিন:' : 'Submit TrxID after Payment:'}
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bKash')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    paymentMethod === 'bKash'
                      ? 'bg-[#00272B] text-[#E0FF4F] border-[#00272B]'
                      : 'bg-[#F6F8EE] text-[#00272B]'
                  }`}
                >
                  bKash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Nagad')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    paymentMethod === 'Nagad'
                      ? 'bg-[#00272B] text-[#E0FF4F] border-[#00272B]'
                      : 'bg-[#F6F8EE] text-[#00272B]'
                  }`}
                >
                  Nagad
                </button>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                  placeholder="e.g. 9K8J7H6G5F"
                  className="w-full h-11 px-3.5 text-xs uppercase tracking-wider font-mono bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#E0FF4F] hover:bg-[#d6f83b] text-[#00272B] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#00272B] shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'bn' ? 'পেমেন্ট নিশ্চিতকরণ জমা দিন' : 'Submit for Verification'}</span>
              </button>
            </form>
          </div>

          {/* Past Invoices & Receipts */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-[#00272B]">
              {language === 'bn' ? 'পূর্ববর্তী পেমেন্ট ও মানি রিসিট' : 'Payment History & Receipts'}
            </h3>

            {childInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#00272B]">{inv.month}</h4>
                  <p className="text-[11px] text-[#00272B]/60 mt-0.5">
                    Amount: {formatCurrency(inv.amount, language)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {inv.status}
                  </span>
                  {inv.paidAmount > 0 && (
                    <button
                      onClick={() => setReceiptModal({ open: true, invoice: inv })}
                      className="px-2.5 py-1 text-xs font-bold bg-[#F6F8EE] text-[#00272B] hover:bg-[#E0FF4F] rounded-lg border border-[#00272B]/10 flex items-center gap-1"
                    >
                      <Receipt className="w-3 h-3" />
                      <span>{t.viewReceipt}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCHEDULE */}
      {activeParentTab === 'schedule' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-[#00272B]">
              {language === 'bn' ? 'ক্লাস রুটিন ও মেক-আপ স্লট' : 'Timetable & Make-Up Slots'}
            </h2>
            <p className="text-xs text-[#00272B]/60">
              {language === 'bn'
                ? 'সাপ্তাহিক ক্লাসের সময়সূচি ও কোনো ক্লাস মিস হলে বিকল্প স্লট অনুমোদন'
                : 'Upcoming class schedule and make-up slot confirmations'}
            </p>
          </div>

          {/* Regular Routine Card */}
          <div className="p-5 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-[#00272B]">
              {language === 'bn' ? 'নিয়মিত ক্লাসের সময়' : 'Regular Weekly Schedule'}
            </h3>

            <div className="p-4 bg-[#F6F8EE] rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#00272B]/70">{language === 'bn' ? 'কোর্স:' : 'Course:'}</span>
                <span className="font-bold text-[#00272B]">{childBatch?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00272B]/70">{language === 'bn' ? 'বার:' : 'Days:'}</span>
                <span className="font-semibold text-[#00272B]">{childBatch?.scheduleDays.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00272B]/70">{language === 'bn' ? 'সময়:' : 'Time:'}</span>
                <span className="font-bold text-[#00272B]">{childBatch?.scheduleTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00272B]/70">{language === 'bn' ? 'স্থান / লিঙ্ক:' : 'Location:'}</span>
                <span className="font-medium text-[#00272B]">{childBatch?.roomOrLink}</span>
              </div>
            </div>
          </div>

          {/* Make-Up Slot Confirmation (Core Problem 3) */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-[#00272B]">
              {language === 'bn' ? 'মেক-আপ ক্লাসের অফার' : 'Make-Up Class Slot Offers'}
            </h3>

            {childMakeUps.length === 0 ? (
              <div className="p-6 bg-white rounded-3xl text-center text-xs text-[#00272B]/60 border border-[#00272B]/10">
                {language === 'bn' ? 'কোনো ক্লাস মিস হয়নি। কোনো মেক-আপ পেন্ডিং নেই।' : 'No missed classes. Attendance is up to date!'}
              </div>
            ) : (
              childMakeUps.map((mu) => (
                <div
                  key={mu.id}
                  className="p-5 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#00272B]">
                        Missed Class: {mu.missedDate}
                      </h4>
                      <p className="text-xs text-[#00272B]/60">{mu.reason}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {mu.status === 'parent_confirmed' ? 'Confirmed' : 'Action Required'}
                    </span>
                  </div>

                  <p className="text-xs text-[#00272B]/80 font-medium">
                    {language === 'bn'
                      ? 'শিক্ষক আপনার সন্তানের জন্য নিম্নোক্ত স্লটগুলো প্রস্তাব করেছেন। আপনার পছন্দের একটিতে ক্লিক করুন:'
                      : 'Teacher proposed the following slots. Tap one to confirm:'}
                  </p>

                  <div className="space-y-2">
                    {mu.suggestedSlots.map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => confirmMakeUpSlot(mu.id, slot)}
                        className={`w-full p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                          mu.confirmedSlot === slot
                            ? 'bg-[#00272B] text-[#E0FF4F] border-[#00272B]'
                            : 'bg-[#F6F8EE] text-[#00272B] border-[#00272B]/10 hover:border-[#00272B]/30'
                        }`}
                      >
                        <span>{slot}</span>
                        {mu.confirmedSlot === slot ? (
                          <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                            ✓ Confirmed
                          </span>
                        ) : (
                          <span className="text-[11px] underline">
                            {language === 'bn' ? 'নির্বাচন করুন' : 'Select'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
