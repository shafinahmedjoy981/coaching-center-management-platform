import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import {
  CreditCard,
  FileEdit,
  Plus,
  UserCheck,
  UserPlus,
  X
} from 'lucide-react';

export const QuickAddFloatingButton: React.FC = () => {
  const {
    role,
    language,
    setAddStudentModalOpen,
    setAttendanceModal,
    setRecordPaymentModal,
    setReportModal
  } = useApp();
  const [open, setOpen] = useState(false);
  const t = translations[language];

  // Only show for tutor view
  if (role !== 'tutor') return null;

  const quickActions = [
    {
      id: 'student',
      label: t.addStudent,
      icon: UserPlus,
      action: () => {
        setOpen(false);
        setAddStudentModalOpen(true);
      }
    },
    {
      id: 'attendance',
      label: t.markAttendance,
      icon: UserCheck,
      action: () => {
        setOpen(false);
        setAttendanceModal({ open: true });
      }
    },
    {
      id: 'payment',
      label: t.recordPayment,
      icon: CreditCard,
      action: () => {
        setOpen(false);
        setRecordPaymentModal({ open: true });
      }
    },
    {
      id: 'note',
      label: t.addNote,
      icon: FileEdit,
      action: () => {
        setOpen(false);
        setReportModal({ open: true });
      }
    }
  ];

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 flex flex-col items-end">
      {/* Backdrop when menu is open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30"
          aria-hidden="true"
        />
      )}

      {/* Speed Dial Menu Items */}
      {open && (
        <div className="flex flex-col gap-2.5 mb-3 z-40 animate-in fade-in slide-in-from-bottom-3 duration-150">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#00272B] text-white shadow-xl hover:bg-[#00383E] border border-white/10 transition-all duration-150 active:scale-95 ml-auto"
              >
                <span className="text-xs font-semibold whitespace-nowrap">
                  {action.label}
                </span>
                <div className="w-7 h-7 rounded-full bg-[#E0FF4F] text-[#00272B] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Primary Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Quick Add Menu"
        aria-expanded={open}
        className="w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#E0FF4F] text-[#00272B] font-bold flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-150 border-2 border-[#00272B] z-40 focus:outline-none focus:ring-4 focus:ring-[#E0FF4F]/50"
      >
        {open ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <div className="flex items-center justify-center">
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </div>
        )}
      </button>
    </div>
  );
};
