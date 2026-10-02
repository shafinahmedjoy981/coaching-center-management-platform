import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { HomeworkStatus, MoodTag } from '../../types';
import {
  Award,
  CheckCircle2,
  FileCheck,
  FileText,
  Plus,
  Send,
  TrendingUp,
  Users
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const {
    students,
    progressNotes,
    weeklyReports,
    language,
    settings,
    toggleAutoReport,
    addProgressNote,
    setReportModal
  } = useApp();

  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [topic, setTopic] = useState('');
  const [homeworkStatus, setHomeworkStatus] = useState<HomeworkStatus>('Done');
  const [moodTag, setMoodTag] = useState<MoodTag>('Attentive');
  const [score, setScore] = useState<number>(18);
  const [maxScore, setMaxScore] = useState<number>(20);
  const [note, setNote] = useState('');

  const t = translations[language];

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !topic) return;

    addProgressNote({
      studentId,
      date: new Date().toISOString().split('T')[0],
      topic,
      homeworkStatus,
      moodTag,
      score,
      maxScore,
      note
    });

    setTopic('');
    setNote('');
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header with Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#00272B] tracking-tight">
            {t.navProgress}
          </h1>
          <p className="text-xs sm:text-sm text-[#00272B]/60 font-medium mt-0.5">
            {t.navProgressSub}
          </p>
        </div>

        {/* Auto-Report Schedule Badge / Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportModal({ open: true })}
            className="h-11 px-4 rounded-2xl bg-[#E0FF4F] hover:bg-[#d6f83b] text-[#00272B] font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-1.5 border-2 border-[#00272B] transition-all"
          >
            <FileText className="w-4 h-4 text-[#00272B]" />
            <span>{language === 'bn' ? 'সাপ্তাহিক রিপোর্ট তৈরি' : 'Generate Weekly Report'}</span>
          </button>
        </div>
      </div>

      {/* Auto Send Toggle Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#00272B] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-white">
            {language === 'bn' ? 'স্বয়ংক্রিয় সাপ্তাহিক রিপোর্ট সক্রিয় আছে' : 'Weekly Auto-Report Automation'}
          </h3>
          <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
            {language === 'bn'
              ? 'প্রতি শুক্রবার সন্ধ্যা ৬:০০ টায় সকল অভিভাবক তাদের সন্তানের সাপ্তাহিক প্রগ্রেস ও উপস্থিতি রিপোর্ট পাবেন।'
              : 'Pushes weekly attendance, topics covered & test scores automatically to WhatsApp.'}
          </p>
        </div>

        <button
          onClick={toggleAutoReport}
          className={`h-10 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
            settings.autoSendWeeklyReport
              ? 'bg-[#E0FF4F] text-[#00272B]'
              : 'bg-white/10 text-white'
          }`}
        >
          <span>
            {settings.autoSendWeeklyReport
              ? (language === 'bn' ? 'সক্রিয়' : 'Active (Every Friday)')
              : (language === 'bn' ? 'বন্ধ' : 'Disabled')}
          </span>
        </button>
      </div>

      {/* 2-Column: Fast 15s Lesson Note Logger & Recent Weekly Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left 3 Cols: Fast 15s Note Form */}
        <div className="lg:col-span-3 bg-white p-5 sm:p-6 rounded-3xl border border-[#00272B]/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#00272B]/10 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#00272B]">
                {language === 'bn' ? '১৫ সেকেন্ডে দ্রুত লেসন নোট লিখুন' : '15-Second Lesson Log'}
              </h3>
              <p className="text-xs text-[#00272B]/60 mt-0.5">
                {language === 'bn' ? 'পড়া, হোমওয়ার্ক ও মনোযোগ ট্যাগ এক ক্লিকে সেভ করুন' : 'Topic covered, homework status & quick remark'}
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#00272B] bg-[#F6F8EE] px-2.5 py-1 rounded-lg">
              Quick Form
            </span>
          </div>

          <form onSubmit={handleSaveNote} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#00272B] mb-1">
                  {language === 'bn' ? 'শিক্ষার্থী' : 'Student'}
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-semibold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.classLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00272B] mb-1">
                  {language === 'bn' ? 'আজকের অধ্যায় / বিষয়' : 'Topic Covered *'}
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Physics Ch 4: Work & Energy"
                  className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
                />
              </div>
            </div>

            {/* Homework status chips */}
            <div>
              <label className="block text-xs font-semibold text-[#00272B] mb-1.5">
                {language === 'bn' ? 'হোমওয়ার্কের অবস্থা' : 'Homework Completion'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Done', 'Partial', 'None'] as HomeworkStatus[]).map((st) => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setHomeworkStatus(st)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      homeworkStatus === st
                        ? 'bg-[#00272B] text-[#E0FF4F] border-[#00272B]'
                        : 'bg-[#F6F8EE] text-[#00272B]/70 border-[#00272B]/10'
                    }`}
                  >
                    {st === 'Done' ? '✓ 100% Done' : st === 'Partial' ? '◐ Partial' : '✕ Not Done'}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood / Behavior Tag */}
            <div>
              <label className="block text-xs font-semibold text-[#00272B] mb-1.5">
                {language === 'bn' ? 'মনোযোগ ও ক্লাসে আচরণ' : 'Behavior & Engagement Tag'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['Attentive', 'Excellent', 'Participative', 'Needs Focus', 'Distracted'] as MoodTag[]).map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setMoodTag(tag)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      moodTag === tag
                        ? 'bg-[#00272B] text-[#E0FF4F] border-[#00272B]'
                        : 'bg-[#F6F8EE] text-[#00272B]/70 border-[#00272B]/10'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Score & Note */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#00272B] mb-1">
                  {language === 'bn' ? 'আজকের কুইজ স্কোর' : 'Quiz Score'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full h-10 px-2.5 text-xs font-bold tabular-nums bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
                  />
                  <span className="text-xs font-semibold text-[#00272B]/60">/ {maxScore}</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#00272B] mb-1">
                  {language === 'bn' ? 'অভিভাবকের জন্য সংক্ষিপ্ত মন্তব্য' : 'Short Note for Parent'}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Solved all math problems, clear understanding"
                  className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-[#E0FF4F] hover:bg-[#d4f82a] text-[#00272B] font-bold text-xs flex items-center gap-1.5 border border-[#00272B] shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'bn' ? 'নোট সংরক্ষণ করুন' : 'Save Lesson Note'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 2 Cols: Compiled Weekly Reports History */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-extrabold text-[#00272B]">
              {language === 'bn' ? 'সাপ্তাহিক রিপোর্টসমূহ' : 'Weekly Reports'}
            </h3>
            <span className="text-xs text-[#00272B]/60">
              {weeklyReports.length} {language === 'bn' ? 'টি প্রস্তুত' : 'compiled'}
            </span>
          </div>

          <div className="space-y-3">
            {weeklyReports.map((rep) => {
              const student = students.find((s) => s.id === rep.studentId);
              return (
                <div
                  key={rep.id}
                  className="p-4 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#00272B]">{student?.name}</h4>
                      <p className="text-[11px] text-[#00272B]/60">
                        Week: {rep.weekStartDate} to {rep.weekEndDate}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Att: {rep.attendanceCount.present}/{rep.attendanceCount.total}
                    </span>
                  </div>

                  <p className="text-xs text-[#00272B]/80 italic line-clamp-2">
                    "{rep.teacherRemark}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#00272B]/5">
                    <span className="text-[11px] font-semibold text-[#00272B]/70">
                      Score: {rep.examScore}
                    </span>
                    <button
                      onClick={() => setReportModal({ open: true, reportId: rep.id, studentId: rep.studentId })}
                      className="text-xs font-bold text-[#00272B] hover:underline flex items-center gap-1"
                    >
                      <Send className="w-3 h-3 text-emerald-700" />
                      <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ ভিউ' : 'Preview & Send'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
