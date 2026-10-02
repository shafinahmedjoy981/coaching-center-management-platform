export type Role = 'tutor' | 'parent';
export type Language = 'bn' | 'en';
export type TutorTab = 'today' | 'students' | 'classes' | 'fees' | 'progress' | 'parents';
export type ParentTab = 'home' | 'reports' | 'fees' | 'schedule';

export type FeeStatus = 'paid' | 'due' | 'overdue' | 'partial';
export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Cash' | 'Bank';
export type AttendanceStatus = 'present' | 'absent' | 'late';
export type HomeworkStatus = 'Done' | 'Partial' | 'None';
export type MoodTag = 'Attentive' | 'Participative' | 'Needs Focus' | 'Distracted' | 'Excellent';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  trxId?: string;
  verified: boolean;
  verifiedAt?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  month: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  discount: number;
  paidAmount: number;
  status: FeeStatus;
  payments: PaymentRecord[];
  daysOverdue?: number;
}

export interface ProgressNote {
  id: string;
  studentId: string;
  date: string;
  topic: string;
  homeworkStatus: HomeworkStatus;
  moodTag: MoodTag;
  score?: number;
  maxScore?: number;
  note: string;
}

export interface WeeklyReport {
  id: string;
  studentId: string;
  weekStartDate: string;
  weekEndDate: string;
  attendanceCount: {
    present: number;
    total: number;
  };
  topics: string[];
  homeworkSummary: string;
  teacherRemark: string;
  examScore?: string;
  feeStatusSummary: string;
  nextWeekPlan: string;
  sentAt?: string;
}

export interface MakeUpRequest {
  id: string;
  studentId: string;
  batchId: string;
  missedDate: string;
  reason: string;
  suggestedSlots: string[];
  confirmedSlot?: string;
  status: 'pending' | 'parent_confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  nameBn: string;
  classLevel: string;
  schoolName: string;
  batchId: string;
  parentName: string;
  parentPhone: string;
  studentPhone?: string;
  parentEmail?: string;
  monthlyFee: number;
  discountType: 'none' | 'sibling' | 'scholarship' | 'custom';
  discountAmount: number;
  joinDate: string;
  status: 'active' | 'inactive';
  avatarInitials: string;
  notes?: string;
}

export interface Batch {
  id: string;
  code: string; // e.g. 'B01', 'B02', 'B03', 'B04'
  name: string;
  subject: string;
  classLevel: string;
  scheduleDays: string[]; // e.g. ['Sat', 'Mon', 'Wed']
  scheduleTime: string; // e.g. '06:00 PM - 07:30 PM'
  roomOrLink: string;
  teacherName: string;
  monthlyFee: number;
  studentIds: string[];
  colorTag?: string;
}

export interface ClassSession {
  id: string;
  batchId: string;
  date: string; // YYYY-MM-DD
  time: string;
  topicCovered: string;
  isCompleted: boolean;
  attendance: Record<string, AttendanceStatus>; // studentId -> status
  teacherNotes?: string;
}

export interface ParentBroadcast {
  id: string;
  batchId?: string; // all or specific batch
  title: string;
  message: string;
  type: 'notice' | 'holiday' | 'exam' | 'reminder';
  sentAt: string;
  targetCount: number;
  deliveredCount: number;
  readCount: number;
}

export interface CoachingSettings {
  coachingName: string;
  tagline: string;
  leadTeacher: string;
  phone: string;
  address: string;
  bKashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  currencySymbol: string;
  autoSendWeeklyReport: boolean;
  reportDay: 'Thursday' | 'Friday' | 'Saturday';
  reportTime: string;
  reminderRuleDaysBefore: number;
  reminderRuleDaysAfter: number;
  holidays: { name: string; date: string; days: number }[];
  userRole: 'Owner' | 'Teacher' | 'Assistant';
  useBanglaDigits: boolean;
}
