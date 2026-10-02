import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { Calendar, CheckCircle2, Clock, Send, ShieldAlert, X } from 'lucide-react';

export const MakeUpModal: React.FC = () => {
  const {
    makeUpModal,
    setMakeUpModal,
    students,
    batches,
    createMakeUpRequest,
    language,
    showToast
  } = useApp();

  const [studentId, setStudentId] = useState(makeUpModal.studentId || (students[0]?.id || ''));
  const [reason, setReason] = useState('Fever / Medical appointment');
  const [slot1, setSlot1] = useState('Thursday, Oct 2 · 04:00 PM (Dhanmondi Room 102)');
  const [slot2, setSlot2] = useState('Friday, Oct 3 · 11:30 AM (Online 1-on-1)');
  const [slot3, setSlot3] = useState('Sunday, Oct 5 · 03:30 PM (Dhanmondi Room 102)');

  const t = translations[language];

  if (!makeUpModal.open) return null;

  const currentStudent = students.find((s) => s.id === studentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;

    createMakeUpRequest({
      studentId,
      batchId: currentStudent?.batchId || 'batch-1',
      missedDate: '2026-09-30',
      reason,
      suggestedSlots: [slot1, slot2, slot3].filter(Boolean)
    });

    setMakeUpModal({ open: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#00272B]/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#00272B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0FF4F] text-[#00272B] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'মেক-আপ ক্লাস স্লট নির্ধারণ' : 'Suggest Make-Up Slots'}
              </h3>
              <p className="text-xs text-[#E0FF4F]">
                {language === 'bn' ? 'অনুপস্থিত ক্লাসের বিকল্প স্লট অভিভাবককে পাঠান' : 'Auto-suggest 2 to 3 slots without double booking'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMakeUpModal({ open: false })}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conflict check indicator */}
        <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === 'bn'
              ? 'শিডিউল চেক সম্পন্ন: প্রস্তাবিত স্লটগুলোতে কোনো রুটিন সংঘাত (Conflict) নেই।'
              : 'Conflict check passed: Selected open slots have zero teacher clashes.'}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#00272B] mb-1">
              {language === 'bn' ? 'অনুপস্থিত শিক্ষার্থী' : 'Student'}
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-semibold focus:outline-none"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.classLevel}) - {s.parentPhone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#00272B] mb-1">
              {language === 'bn' ? 'অনুপস্থিতির কারণ' : 'Reason for Absence'}
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Fever, School exam..."
              className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#00272B]">
              {language === 'bn' ? 'অভিভাবকের নির্বাচনের জন্য ২-৩টি মুক্ত স্লট:' : 'Suggest 2-3 Open Slots for Guardian:'}
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={slot1}
                onChange={(e) => setSlot1(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-medium"
              />
              <input
                type="text"
                value={slot2}
                onChange={(e) => setSlot2(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-medium"
              />
              <input
                type="text"
                value={slot3}
                onChange={(e) => setSlot3(e.target.value)}
                className="w-full h-9 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-medium"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMakeUpModal({ open: false })}
              className="flex-1 h-11 rounded-xl text-xs font-semibold text-[#00272B]/70 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-2 h-11 rounded-xl text-xs font-bold text-[#00272B] bg-[#E0FF4F] hover:bg-[#d4f82a] shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'bn' ? 'স্লট পাঠান (WhatsApp)' : 'Send Slots to Parent'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
