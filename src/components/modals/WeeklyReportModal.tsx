import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { WeeklyReport } from '../../types';
import { CheckCircle2, Copy, FileText, Send, Share2, X } from 'lucide-react';

export const WeeklyReportModal: React.FC = () => {
  const {
    reportModal,
    setReportModal,
    students,
    weeklyReports,
    language,
    settings,
    toggleAutoReport,
    showToast
  } = useApp();

  const [studentId, setStudentId] = useState<string>('');
  const [remark, setRemark] = useState<string>('');
  const [examScore, setExamScore] = useState<string>('18 / 20');
  const [topics, setTopics] = useState<string>('Trigonometry 9.2 Heights & Distances, Physics Ch 5 Work & Energy');
  const [nextPlan, setNextPlan] = useState<string>('Coordinate Geometry (Chapter 11) + Surprise Evaluation');
  const [copied, setCopied] = useState(false);

  const t = translations[language];

  useEffect(() => {
    if (reportModal.open) {
      const sId = reportModal.studentId || (students[0] ? students[0].id : '');
      setStudentId(sId);

      const existingReport = weeklyReports.find((r) => r.studentId === sId);
      if (existingReport) {
        setRemark(existingReport.teacherRemark);
        setExamScore(existingReport.examScore || '18 / 20');
        setTopics(existingReport.topics.join(', '));
        setNextPlan(existingReport.nextWeekPlan);
      } else {
        setRemark('Regular in class. Needs to practice 10 more problems at home.');
      }
    }
  }, [reportModal, students, weeklyReports]);

  if (!reportModal.open) return null;

  const currentStudent = students.find((s) => s.id === studentId);

  const reportWhatsAppText = `*📊 Weekly Progress Report - ${settings.coachingName}*
*Student:* ${currentStudent?.name} (${currentStudent?.classLevel})
*Period:* ${language === 'bn' ? '২৪ - ৩০ সেপ্টেম্বর, ২০২৬' : 'Sept 24 - Sept 30, 2026'}

*✅ Attendance:* 3 / 3 classes attended (100%)
*📖 Topics Covered:*
• ${topics.split(',').map((t) => t.trim()).join('\n• ')}

*📝 Homework:* 100% Completed on time
*🎯 Quiz Score:* ${examScore}
*💬 Teacher's Remark:* "${remark}"
*📅 Next Week Plan:* ${nextPlan}
*💳 Fee Status:* Up to date (October Paid)

${language === 'bn' ? `_${t.brandName}-এর মাধ্যমে স্বয়ংক্রিয় রিপোর্ট। কোনো জিজ্ঞাসা থাকলে রিপ্লাই দিন।_` : `_Automated report via ${t.brandName}. Reply to this message if you have any questions._`}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportWhatsAppText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast(language === 'bn' ? 'রিপোর্ট কপি হয়েছে' : 'Report copied to clipboard');
  };

  const handleSendWhatsApp = () => {
    if (!currentStudent?.parentPhone) return;
    const clean = currentStudent.parentPhone.replace(/[^0-9]/g, '');
    const fullPhone = clean.startsWith('880') ? clean : `880${clean.startsWith('0') ? clean.slice(1) : clean}`;
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(reportWhatsAppText)}`;
    window.open(url, '_blank');
    showToast(
      language === 'bn'
        ? `${currentStudent.name}-এর অভিভাবককে হোয়াটসঅ্যাপে পাঠানো হচ্ছে...`
        : `Sending weekly report to ${currentStudent.name}'s parent...`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#00272B]/10 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#00272B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0FF4F] text-[#00272B] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'অটো সাপ্তাহিক প্রগ্রেস রিপোর্ট' : 'Weekly Progress Report'}
              </h3>
              <p className="text-xs text-[#E0FF4F]">
                {language === 'bn' ? 'অভিভাবকদের প্রশ্নের ইতি - অটো হোয়াটসঅ্যাপ রিপোর্ট' : 'Solves repetitive "how is my child doing?" questions'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setReportModal({ open: false })}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auto-send Toggle Banner */}
        <div className="px-5 py-3 bg-[#F6F8EE] border-b border-[#00272B]/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#00272B]">
              {language === 'bn' ? 'অটো-সেন্ড শিডিউল (প্রতি শুক্রবার সন্ধ্যা ৬টা)' : 'Auto-send Schedule (Every Friday 6 PM)'}
            </p>
            <p className="text-[10px] text-[#00272B]/60">
              {language === 'bn' ? 'রিপোর্ট স্বয়ংক্রিয়ভাবে অভিভাবকদের হোয়াটসঅ্যাপে যাবে' : 'Direct weekly push notification to all parents'}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleAutoReport}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              settings.autoSendWeeklyReport ? 'bg-[#00272B]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-[#E0FF4F] transition-transform ${
                settings.autoSendWeeklyReport ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Select Student */}
          <div>
            <label className="block text-xs font-semibold text-[#00272B] mb-1">
              {language === 'bn' ? 'শিক্ষার্থী নির্বাচন করুন' : 'Student'}
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-semibold focus:outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.classLevel}) - {s.parentName}
                </option>
              ))}
            </select>
          </div>

          {/* Report Card Preview (Clean Bento Look) */}
          <div className="p-4 rounded-2xl bg-[#00272B] text-white space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#E0FF4F] font-bold">
                  {settings.coachingName}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {currentStudent?.name} · {currentStudent?.classLevel}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#E0FF4F] bg-white/10 px-2 py-0.5 rounded-full">
                  100% Attendance
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-white/60 block">
                  {language === 'bn' ? 'উপস্থিতি হার:' : 'Attendance:'}
                </span>
                <span className="font-bold text-[#E0FF4F] text-sm">3 / 3 Classes (100%)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-white/60 block">
                  {language === 'bn' ? 'কুইজ স্কোর:' : 'Weekly Quiz:'}
                </span>
                <span className="font-bold text-[#E0FF4F] text-sm">{examScore}</span>
              </div>
            </div>

            {/* Teacher Remark editable */}
            <div>
              <label className="block text-[11px] text-[#E0FF4F] font-semibold mb-1">
                {language === 'bn' ? 'শিক্ষকের ব্যক্তিগত মন্তব্য:' : "Teacher's Personal Remark:"}
              </label>
              <textarea
                rows={2}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full p-2.5 text-xs bg-white/10 text-white rounded-xl border border-white/20 focus:outline-none focus:border-[#E0FF4F]"
              />
            </div>

            {/* Next week plan */}
            <div>
              <label className="block text-[11px] text-white/70 font-semibold mb-1">
                {language === 'bn' ? 'পরবর্তী সপ্তাহের পরিকল্পনা:' : 'Next Week Learning Plan:'}
              </label>
              <input
                type="text"
                value={nextPlan}
                onChange={(e) => setNextPlan(e.target.value)}
                className="w-full h-8 px-2.5 text-xs bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#00272B]/10 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 text-xs font-semibold text-[#00272B] bg-[#F6F8EE] hover:bg-gray-200 rounded-xl border border-[#00272B]/10 flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReportModal({ open: false })}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-[#00272B]/70 bg-gray-100 hover:bg-gray-200"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#00272B] bg-[#E0FF4F] hover:bg-[#d6f83b] shadow-md flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে পাঠান' : 'Send to Parent'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
