import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Batch,
  ClassSession,
  CoachingSettings,
  Invoice,
  Language,
  MakeUpRequest,
  ParentBroadcast,
  ParentTab,
  PaymentMethod,
  PaymentRecord,
  ProgressNote,
  Role,
  Student,
  TutorTab,
  WeeklyReport
} from '../types';
import {
  initialBatches,
  initialBroadcasts,
  initialCoachingSettings,
  initialInvoices,
  initialMakeUpRequests,
  initialProgressNotes,
  initialSessions,
  initialStudents,
  initialWeeklyReports
} from '../data/mockData';

export interface ToastState {
  id: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTutorTab: TutorTab;
  setActiveTutorTab: (tab: TutorTab) => void;
  activeParentTab: ParentTab;
  setActiveParentTab: (tab: ParentTab) => void;

  // Selected child for parent view
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;

  // Search & Global state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toast: ToastState | null;
  showToast: (message: string, actionText?: string, onAction?: () => void) => void;
  clearToast: () => void;

  // Entities
  students: Student[];
  batches: Batch[];
  invoices: Invoice[];
  sessions: ClassSession[];
  progressNotes: ProgressNote[];
  weeklyReports: WeeklyReport[];
  makeUpRequests: MakeUpRequest[];
  broadcasts: ParentBroadcast[];
  settings: CoachingSettings;
  updateSettings: (newSettings: Partial<CoachingSettings>) => void;

  // Actions
  addStudent: (student: Omit<Student, 'id' | 'avatarInitials'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  markAttendance: (sessionId: string, attendance: Record<string, 'present' | 'absent' | 'late'>) => void;
  recordPayment: (invoiceId: string, amount: number, method: PaymentMethod, trxId?: string, notes?: string) => void;
  submitParentPayment: (studentId: string, amount: number, method: PaymentMethod, trxId: string) => void;
  addProgressNote: (note: Omit<ProgressNote, 'id'>) => void;
  createMakeUpRequest: (req: Omit<MakeUpRequest, 'id' | 'status'>) => void;
  confirmMakeUpSlot: (requestId: string, slot: string) => void;
  sendBroadcast: (broadcast: Omit<ParentBroadcast, 'id' | 'sentAt' | 'deliveredCount' | 'readCount' | 'targetCount'>) => void;
  toggleAutoReport: () => void;

  // Modals state
  quickAddOpen: boolean;
  setQuickAddOpen: (open: boolean) => void;
  addStudentModalOpen: boolean;
  setAddStudentModalOpen: (open: boolean) => void;
  recordPaymentModal: { open: boolean; studentId?: string; invoiceId?: string };
  setRecordPaymentModal: (val: { open: boolean; studentId?: string; invoiceId?: string }) => void;
  attendanceModal: { open: boolean; batchId?: string; sessionId?: string };
  setAttendanceModal: (val: { open: boolean; batchId?: string; sessionId?: string }) => void;
  feeReminderModalOpen: boolean;
  setFeeReminderModalOpen: (open: boolean) => void;
  reportModal: { open: boolean; reportId?: string; studentId?: string };
  setReportModal: (val: { open: boolean; reportId?: string; studentId?: string }) => void;
  receiptModal: { open: boolean; invoice?: Invoice; payment?: PaymentRecord };
  setReceiptModal: (val: { open: boolean; invoice?: Invoice; payment?: PaymentRecord }) => void;
  makeUpModal: { open: boolean; studentId?: string };
  setMakeUpModal: (val: { open: boolean; studentId?: string }) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  selectedStudentProfileId: string | null;
  setSelectedStudentProfileId: (id: string | null) => void;
  expandedBatchId: string | null;
  setExpandedBatchId: (id: string | null) => void;
  searchViewQuery: string | null;
  setSearchViewQuery: (q: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('tutor');
  const [language, setLanguage] = useState<Language>('bn'); // Bangla by default per prompt
  const [activeTutorTab, setActiveTutorTab] = useState<TutorTab>('today');
  const [activeParentTab, setActiveParentTab] = useState<ParentTab>('home');
  const [selectedChildId, setSelectedChildId] = useState<string>('s5'); // Tanjila Akter
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);
  const [searchViewQuery, setSearchViewQuery] = useState<string | null>(null);

  // Data states
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('tutorloop_students');
    if (!saved) return initialStudents;
    try {
      const parsed: Student[] = JSON.parse(saved);
      return parsed.map((s) => {
        const init = initialStudents.find((is) => is.id === s.id);
        return {
          ...s,
          nameBn: s.nameBn || init?.nameBn || s.name
        };
      });
    } catch {
      return initialStudents;
    }
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    const saved = localStorage.getItem('tutorloop_batches');
    if (!saved) return initialBatches;
    try {
      const parsed: Batch[] = JSON.parse(saved);
      return parsed.map((b, idx) => ({
        ...b,
        code: b.code || initialBatches.find((ib) => ib.id === b.id)?.code || `B0${idx + 1}`
      }));
    } catch {
      return initialBatches;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('tutorloop_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [sessions, setSessions] = useState<ClassSession[]>(() => {
    const saved = localStorage.getItem('tutorloop_sessions');
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>(() => {
    const saved = localStorage.getItem('tutorloop_progress');
    return saved ? JSON.parse(saved) : initialProgressNotes;
  });

  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>(() => {
    const saved = localStorage.getItem('tutorloop_reports');
    return saved ? JSON.parse(saved) : initialWeeklyReports;
  });

  const [makeUpRequests, setMakeUpRequests] = useState<MakeUpRequest[]>(() => {
    const saved = localStorage.getItem('tutorloop_makeups');
    return saved ? JSON.parse(saved) : initialMakeUpRequests;
  });

  const [broadcasts, setBroadcasts] = useState<ParentBroadcast[]>(() => {
    const saved = localStorage.getItem('tutorloop_broadcasts');
    return saved ? JSON.parse(saved) : initialBroadcasts;
  });

  const [settings, setSettings] = useState<CoachingSettings>(() => {
    const saved = localStorage.getItem('tutorloop_settings');
    return saved ? JSON.parse(saved) : initialCoachingSettings;
  });

  // Modals
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [recordPaymentModal, setRecordPaymentModal] = useState<{ open: boolean; studentId?: string; invoiceId?: string }>({ open: false });
  const [attendanceModal, setAttendanceModal] = useState<{ open: boolean; batchId?: string; sessionId?: string }>({ open: false });
  const [feeReminderModalOpen, setFeeReminderModalOpen] = useState(false);
  const [reportModal, setReportModal] = useState<{ open: boolean; reportId?: string; studentId?: string }>({ open: false });
  const [receiptModal, setReceiptModal] = useState<{ open: boolean; invoice?: Invoice; payment?: PaymentRecord }>({ open: false });
  const [makeUpModal, setMakeUpModal] = useState<{ open: boolean; studentId?: string }>({ open: false });
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedStudentProfileId, setSelectedStudentProfileId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tutorloop_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('tutorloop_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('tutorloop_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('tutorloop_makeups', JSON.stringify(makeUpRequests));
  }, [makeUpRequests]);

  const showToast = (message: string, actionText?: string, onAction?: () => void) => {
    const id = Date.now().toString();
    setToast({ id, message, actionText, onAction });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  const clearToast = () => setToast(null);

  const updateSettings = (newSettings: Partial<CoachingSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('tutorloop_settings', JSON.stringify(updated));
      return updated;
    });
    showToast(language === 'bn' ? 'সেটিংস সংরক্ষিত হয়েছে' : 'Settings saved successfully');
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'avatarInitials'>) => {
    const initials = studentData.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST';

    const newStudent: Student = {
      ...studentData,
      id: `s-${Date.now()}`,
      avatarInitials: initials
    };

    const previousStudents = [...students];
    setStudents((prev) => [newStudent, ...prev]);

    // Create auto invoice for this month
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      studentId: newStudent.id,
      month: 'October 2026',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      amount: newStudent.monthlyFee - (newStudent.discountAmount || 0),
      discount: newStudent.discountAmount || 0,
      paidAmount: 0,
      status: 'due',
      payments: []
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    showToast(
      language === 'bn' ? `${newStudent.name} সফলভাবে যুক্ত হয়েছে` : `${newStudent.name} added successfully`,
      language === 'bn' ? 'আগের অবস্থায় ফিরুন' : 'Undo',
      () => {
        setStudents(previousStudents);
        setInvoices((prev) => prev.filter((inv) => inv.studentId !== newStudent.id));
      }
    );
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast(language === 'bn' ? 'তথ্য আপডেট করা হয়েছে' : 'Student updated');
  };

  const deleteStudent = (id: string) => {
    const studentToDelete = students.find((s) => s.id === id);
    if (!studentToDelete) return;
    const previous = [...students];
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast(
      language === 'bn' ? `${studentToDelete.name} মুছে ফেলা হয়েছে` : `${studentToDelete.name} removed`,
      language === 'bn' ? 'আগের অবস্থায় ফিরুন' : 'Undo',
      () => setStudents(previous)
    );
  };

  const markAttendance = (sessionId: string, attendance: Record<string, 'present' | 'absent' | 'late'>) => {
    const prevSessions = [...sessions];
    setSessions((prev) =>
      prev.map((ses) =>
        ses.id === sessionId
          ? { ...ses, attendance, isCompleted: true }
          : ses
      )
    );

    // Check if any student was marked absent, create quick make-up prompt or notify
    const absents = Object.entries(attendance).filter(([, status]) => status === 'absent');
    if (absents.length > 0) {
      const absentStudent = students.find((s) => s.id === absents[0][0]);
      showToast(
        language === 'bn'
          ? `উপস্থিতি সংরক্ষিত! ${absentStudent?.name || 'শিক্ষার্থী'} অনুপস্থিত, মেক-আপ স্লট সাজেস্ট করা যাবে`
          : `Attendance saved! ${absentStudent?.name || 'Student'} absent - make-up slot ready`,
        language === 'bn' ? 'আগের অবস্থায় ফিরুন' : 'Undo',
        () => setSessions(prevSessions)
      );
    } else {
      showToast(
        language === 'bn' ? 'উপস্থিতি সফলভাবে সংরক্ষিত হয়েছে' : 'Attendance marked successfully',
        language === 'bn' ? 'আগের অবস্থায় ফিরুন' : 'Undo',
        () => setSessions(prevSessions)
      );
    }
  };

  const recordPayment = (invoiceId: string, amount: number, method: PaymentMethod, trxId?: string, notes?: string) => {
    const previousInvoices = [...invoices];
    let studentName = '';

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const student = students.find((s) => s.id === inv.studentId);
        studentName = student?.name || 'Student';
        const newPaid = inv.paidAmount + amount;
        const newStatus = newPaid >= inv.amount ? 'paid' : newPaid > 0 ? 'partial' : inv.status;
        const newPayment: PaymentRecord = {
          id: `pay-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount,
          method,
          trxId: trxId || undefined,
          verified: true,
          verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          notes
        };
        return {
          ...inv,
          paidAmount: newPaid,
          status: newStatus,
          payments: [newPayment, ...inv.payments]
        };
      })
    );

    showToast(
      language === 'bn' ? `${studentName}-এর ৳${amount} পেমেন্ট রেকর্ড হয়েছে` : `Recorded ৳${amount} payment for ${studentName}`,
      language === 'bn' ? 'আগের অবস্থায় ফিরুন' : 'Undo',
      () => setInvoices(previousInvoices)
    );
  };

  const submitParentPayment = (studentId: string, amount: number, method: PaymentMethod, trxId: string) => {
    // Find due/overdue/partial invoice
    setInvoices((prev) => {
      const targetInv = prev.find((i) => i.studentId === studentId && i.status !== 'paid');
      if (!targetInv) return prev;

      const newPayment: PaymentRecord = {
        id: `pay-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount,
        method,
        trxId,
        verified: true, // auto-verified in prototype
        verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: 'Submitted via Parent Portal'
      };

      const newPaid = targetInv.paidAmount + amount;
      const newStatus = newPaid >= targetInv.amount ? 'paid' : 'partial';

      return prev.map((inv) =>
        inv.id === targetInv.id
          ? {
              ...inv,
              paidAmount: newPaid,
              status: newStatus,
              payments: [newPayment, ...inv.payments]
            }
          : inv
      );
    });

    showToast(
      language === 'bn'
        ? 'পেমেন্ট ট্রানজ্যাকশন জমা দেওয়া হয়েছে! শিক্ষক যাচাই করবেন।'
        : 'Payment TrxID submitted! Verified by teacher.'
    );
  };

  const addProgressNote = (noteData: Omit<ProgressNote, 'id'>) => {
    const newNote: ProgressNote = {
      ...noteData,
      id: `prog-${Date.now()}`
    };
    setProgressNotes((prev) => [newNote, ...prev]);
    showToast(language === 'bn' ? 'প্রগ্রেস নোট যোগ করা হয়েছে' : 'Progress note added');
  };

  const createMakeUpRequest = (req: Omit<MakeUpRequest, 'id' | 'status'>) => {
    const newReq: MakeUpRequest = {
      ...req,
      id: `mu-${Date.now()}`,
      status: 'pending'
    };
    setMakeUpRequests((prev) => [newReq, ...prev]);
    showToast(
      language === 'bn' ? 'মেক-আপ স্লট অভিভাবকের কাছে পাঠানো হয়েছে' : 'Make-up slots sent to parent via WhatsApp'
    );
  };

  const confirmMakeUpSlot = (requestId: string, slot: string) => {
    setMakeUpRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, confirmedSlot: slot, status: 'parent_confirmed' }
          : r
      )
    );
    showToast(
      language === 'bn'
        ? `মেক-আপ স্লট "${slot}" নিশ্চিত করা হয়েছে!`
        : `Make-up class slot confirmed: "${slot}"`
    );
  };

  const sendBroadcast = (data: Omit<ParentBroadcast, 'id' | 'sentAt' | 'deliveredCount' | 'readCount' | 'targetCount'>) => {
    const targetStudents = data.batchId
      ? students.filter((s) => s.batchId === data.batchId)
      : students;

    const newBroadcast: ParentBroadcast = {
      ...data,
      id: `bc-${Date.now()}`,
      sentAt: 'Just now',
      targetCount: targetStudents.length,
      deliveredCount: targetStudents.length,
      readCount: Math.max(1, targetStudents.length - 1)
    };

    setBroadcasts((prev) => [newBroadcast, ...prev]);
    showToast(
      language === 'bn'
        ? `${targetStudents.length} জন অভিভাবককে নোটিশ পাঠানো হয়েছে`
        : `Broadcast sent to ${targetStudents.length} parents`
    );
  };

  const toggleAutoReport = () => {
    setSettings((prev) => ({
      ...prev,
      autoSendWeeklyReport: !prev.autoSendWeeklyReport
    }));
    showToast(
      language === 'bn'
        ? !settings.autoSendWeeklyReport
          ? 'সাপ্তাহিক অটো রিপোর্ট সক্রিয় (প্রতি শুক্রবার সন্ধ্যা ৬টা)'
          : 'অটো রিপোর্ট নিষ্ক্রিয় করা হয়েছে'
        : !settings.autoSendWeeklyReport
        ? 'Weekly Auto-Report enabled (Every Friday 6 PM)'
        : 'Auto-Report disabled'
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        activeTutorTab,
        setActiveTutorTab,
        activeParentTab,
        setActiveParentTab,
        selectedChildId,
        setSelectedChildId,
        searchQuery,
        setSearchQuery,
        toast,
        showToast,
        clearToast,
        students,
        batches,
        invoices,
        sessions,
        progressNotes,
        weeklyReports,
        makeUpRequests,
        broadcasts,
        settings,
        updateSettings,
        addStudent,
        updateStudent,
        deleteStudent,
        markAttendance,
        recordPayment,
        submitParentPayment,
        addProgressNote,
        createMakeUpRequest,
        confirmMakeUpSlot,
        sendBroadcast,
        toggleAutoReport,

        // Modals
        quickAddOpen,
        setQuickAddOpen,
        addStudentModalOpen,
        setAddStudentModalOpen,
        recordPaymentModal,
        setRecordPaymentModal,
        attendanceModal,
        setAttendanceModal,
        feeReminderModalOpen,
        setFeeReminderModalOpen,
        reportModal,
        setReportModal,
        receiptModal,
        setReceiptModal,
        makeUpModal,
        setMakeUpModal,
        settingsModalOpen,
        setSettingsModalOpen,
        onboardingOpen,
        setOnboardingOpen,
        selectedStudentProfileId,
        setSelectedStudentProfileId,
        expandedBatchId,
        setExpandedBatchId,
        searchViewQuery,
        setSearchViewQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
