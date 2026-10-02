import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { AttendanceStatus } from '../../types';
import { Check, CheckCheck, Clock, UserCheck, X } from 'lucide-react';

export const AttendanceModal: React.FC = () => {
  const {
    attendanceModal,
    setAttendanceModal,
    batches,
    students,
    sessions,
    markAttendance,
    language
  } = useApp();

  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [sessionTopic, setSessionTopic] = useState('');

  const t = translations[language];

  useEffect(() => {
    if (attendanceModal.open) {
      const bId = attendanceModal.batchId || (batches[0] ? batches[0].id : '');
      setSelectedBatchId(bId);

      // Find or init attendance
      const targetSession = sessions.find((s) => s.batchId === bId && s.date === '2026-09-30');
      const batchStudents = students.filter((s) => s.batchId === bId);
      const initialMap: Record<string, AttendanceStatus> = {};

      batchStudents.forEach((s) => {
        initialMap[s.id] = targetSession?.attendance[s.id] || 'present';
      });

      setAttendanceMap(initialMap);
      setSessionTopic(targetSession?.topicCovered || 'Today\'s Scheduled Lesson');
    }
  }, [attendanceModal, batches, students, sessions]);

  if (!attendanceModal.open) return null;

  const batchStudents = students.filter((s) => s.batchId === selectedBatchId);
  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    batchStudents.forEach((s) => {
      updated[s.id] = 'present';
    });
    setAttendanceMap(updated);
  };

  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = () => {
    const targetSession = sessions.find((s) => s.batchId === selectedBatchId && s.date === '2026-09-30');
    const sessionId = targetSession?.id || `ses-${Date.now()}`;
    markAttendance(sessionId, attendanceMap);
    setAttendanceModal({ open: false });
  };

  const presentCount = Object.values(attendanceMap).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === 'absent').length;
  const lateCount = Object.values(attendanceMap).filter((s) => s === 'late').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#00272B]/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#00272B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0FF4F] text-[#00272B] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'দ্রুত উপস্থিতি গ্রহণ' : 'Quick Batch Attendance'}
              </h3>
              <p className="text-xs text-[#E0FF4F]">
                {selectedBatch?.name || 'Class Batch'} · {batchStudents.length} {language === 'bn' ? 'শিক্ষার্থী' : 'students'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAttendanceModal({ open: false })}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Batch Picker & Quick Actions Bar */}
        <div className="p-4 bg-[#F6F8EE] border-b border-[#00272B]/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex-1 min-w-[200px]">
            <select
              value={selectedBatchId}
              onChange={(e) => {
                setSelectedBatchId(e.target.value);
                const bs = students.filter((s) => s.batchId === e.target.value);
                const updated: Record<string, AttendanceStatus> = {};
                bs.forEach((s) => (updated[s.id] = 'present'));
                setAttendanceMap(updated);
              }}
              className="w-full h-9 px-3 text-xs bg-white rounded-xl border border-[#00272B]/15 text-[#00272B] font-semibold focus:outline-none"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.scheduleTime})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="h-9 px-3 text-xs font-bold bg-[#E0FF4F] text-[#00272B] rounded-xl hover:bg-[#d4f82a] flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{t.allPresent} (Shortcut)</span>
          </button>
        </div>

        {/* Attendance Summary Chip */}
        <div className="px-5 py-2.5 bg-white border-b border-[#00272B]/10 flex items-center justify-between text-xs text-[#00272B]/70">
          <span>{language === 'bn' ? 'সারাংশ:' : 'Summary:'}</span>
          <div className="flex items-center gap-3 font-semibold">
            <span className="text-emerald-700">✓ {presentCount} {language === 'bn' ? 'উপস্থিত' : 'Present'}</span>
            <span className="text-rose-600">✕ {absentCount} {language === 'bn' ? 'অনুপস্থিত' : 'Absent'}</span>
            <span className="text-amber-600">◷ {lateCount} {language === 'bn' ? 'দেরি' : 'Late'}</span>
          </div>
        </div>

        {/* Student List */}
        <div className="max-h-[340px] overflow-y-auto p-4 space-y-2">
          {batchStudents.length === 0 ? (
            <p className="text-center py-8 text-xs text-[#00272B]/60">
              {language === 'bn' ? 'এই ব্যাচে কোনো শিক্ষার্থী নেই।' : 'No students found in this batch.'}
            </p>
          ) : (
            batchStudents.map((st) => {
              const currentStatus = attendanceMap[st.id] || 'present';
              return (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#F6F8EE] border border-[#00272B]/10 hover:border-[#00272B]/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#00272B] text-[#E0FF4F] text-xs font-bold flex items-center justify-center shrink-0">
                      {st.avatarInitials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#00272B] leading-tight">
                        {language === 'bn' && st.nameBn ? st.nameBn : st.name}
                      </p>
                      <p className="text-[11px] text-[#00272B]/60 mt-0.5">
                        {st.parentPhone}
                      </p>
                    </div>
                  </div>

                  {/* 3 Status Switchers */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#00272B]/10">
                    <button
                      type="button"
                      onClick={() => handleSetStatus(st.id, 'present')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        currentStatus === 'present'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-[#00272B]/60 hover:text-[#00272B]'
                      }`}
                    >
                      P
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetStatus(st.id, 'absent')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        currentStatus === 'absent'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-[#00272B]/60 hover:text-[#00272B]'
                      }`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetStatus(st.id, 'late')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        currentStatus === 'late'
                          ? 'bg-amber-500 text-[#00272B] shadow-xs'
                          : 'text-[#00272B]/60 hover:text-[#00272B]'
                      }`}
                    >
                      L
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#00272B]/10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAttendanceModal({ open: false })}
            className="flex-1 h-11 rounded-xl text-xs font-semibold text-[#00272B]/70 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-2 h-11 rounded-xl text-xs font-bold text-[#00272B] bg-[#E0FF4F] hover:bg-[#d4f82a] shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'bn' ? 'উপস্থিতি নিশ্চিত করুন' : 'Confirm Attendance'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
