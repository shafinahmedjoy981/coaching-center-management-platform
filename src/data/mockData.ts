import { Batch, ClassSession, CoachingSettings, Invoice, MakeUpRequest, ParentBroadcast, ProgressNote, Student, WeeklyReport } from '../types';

export const initialCoachingSettings: CoachingSettings = {
  coachingName: 'Newton Science & Math Care',
  tagline: 'Fee chasing bondho. Parents get a weekly report automatically.',
  leadTeacher: 'Engr. Tanvir Rahman (BUET)',
  phone: '01712-345678',
  address: 'House 42, Road 9/A, Dhanmondi, Dhaka',
  bKashNumber: '01712-345678 (Personal/Send Money)',
  nagadNumber: '01987-654321 (Merchant/Payment)',
  rocketNumber: '01552-345678',
  currencySymbol: '৳',
  autoSendWeeklyReport: true,
  reportDay: 'Friday',
  reportTime: '06:00 PM',
  reminderRuleDaysBefore: 3,
  reminderRuleDaysAfter: 3,
  holidays: [
    { name: 'Durga Puja Holiday', date: '2026-10-18', days: 3 },
    { name: 'Semester Final Study Break', date: '2026-11-05', days: 5 },
    { name: 'Victory Day', date: '2026-12-16', days: 1 }
  ],
  userRole: 'Owner',
  useBanglaDigits: true
};

export const initialBatches: Batch[] = [
  {
    id: 'batch-1',
    code: 'B01',
    name: 'HSC Physics 1st Paper',
    subject: 'Physics',
    classLevel: 'HSC (Class 11-12)',
    scheduleDays: ['Sat', 'Mon', 'Wed'],
    scheduleTime: '06:00 PM - 07:30 PM',
    roomOrLink: 'Dhanmondi Room 201',
    teacherName: 'Engr. Tanvir Rahman',
    monthlyFee: 2800,
    studentIds: ['s1', 's2', 's3', 's4'],
    colorTag: '#00272B'
  },
  {
    id: 'batch-2',
    code: 'B02',
    name: 'Class 10 Higher Math & Science',
    subject: 'Higher Math',
    classLevel: 'SSC (Class 10)',
    scheduleDays: ['Sun', 'Tue', 'Thu'],
    scheduleTime: '05:00 PM - 06:30 PM',
    roomOrLink: 'Google Meet (Live Online)',
    teacherName: 'Engr. Tanvir Rahman',
    monthlyFee: 2200,
    studentIds: ['s5', 's6', 's7'],
    colorTag: '#0A4D54'
  },
  {
    id: 'batch-3',
    code: 'B03',
    name: 'Class 9 Science & ICT Care',
    subject: 'General Science & ICT',
    classLevel: 'Class 9',
    scheduleDays: ['Sat', 'Mon', 'Wed'],
    scheduleTime: '04:00 PM - 05:30 PM',
    roomOrLink: 'Dhanmondi Room 102',
    teacherName: 'Sabbir Hossain (Assistant)',
    monthlyFee: 1800,
    studentIds: ['s8', 's9'],
    colorTag: '#003A40'
  },
  {
    id: 'batch-4',
    code: 'B04',
    name: 'HSC Chemistry Target A+',
    subject: 'Chemistry',
    classLevel: 'HSC (Class 11-12)',
    scheduleDays: ['Fri', 'Sat'],
    scheduleTime: '10:00 AM - 12:00 PM',
    roomOrLink: 'Dhanmondi Room 201',
    teacherName: 'Engr. Tanvir Rahman',
    monthlyFee: 2500,
    studentIds: ['s1', 's3'],
    colorTag: '#14383B'
  }
];

export const initialStudents: Student[] = [
  {
    id: 's1',
    name: 'Rahim Uddin',
    nameBn: 'রহিম উদ্দিন',
    classLevel: 'HSC 1st Year',
    schoolName: 'Notre Dame College, Dhaka',
    batchId: 'batch-1',
    parentName: 'Mohammad Rafiqul Islam',
    parentPhone: '01819556677',
    studentPhone: '01711009988',
    parentEmail: 'rafiqul.islam@gmail.com',
    monthlyFee: 2800,
    discountType: 'none',
    discountAmount: 0,
    joinDate: '2026-06-15',
    status: 'active',
    avatarInitials: 'RU',
    notes: 'Aiming for BUET CSE. Strong in kinematics, needs extra work on vector calculus.'
  },
  {
    id: 's2',
    name: 'Nusrat Jahan',
    nameBn: 'নুসরাত জাহান',
    classLevel: 'HSC 1st Year',
    schoolName: 'Viqarunnisa Noon College',
    batchId: 'batch-1',
    parentName: 'Dr. Jahanara Begum',
    parentPhone: '01715443322',
    studentPhone: '01912334455',
    parentEmail: 'dr.jahanara@yahoo.com',
    monthlyFee: 2800,
    discountType: 'none',
    discountAmount: 0,
    joinDate: '2026-07-01',
    status: 'active',
    avatarInitials: 'NJ',
    notes: 'Consistently 90%+ in quizzes. Very regular.'
  },
  {
    id: 's3',
    name: 'Mehedi Hasan',
    nameBn: 'মেহেদী হাসান',
    classLevel: 'HSC 1st Year',
    schoolName: 'Dhaka College',
    batchId: 'batch-1',
    parentName: 'Abul Kalam',
    parentPhone: '01611778899',
    monthlyFee: 2800,
    discountType: 'scholarship',
    discountAmount: 300,
    joinDate: '2026-06-20',
    status: 'active',
    avatarInitials: 'MH',
    notes: 'Partial fee waiver granted based on SSC GPA 5.'
  },
  {
    id: 's4',
    name: 'Tanvir Ahmed',
    nameBn: 'তানভীর আহমেদ',
    classLevel: 'HSC 1st Year',
    schoolName: 'Residential Model College',
    batchId: 'batch-1',
    parentName: 'Mrs. Salma Ahmed',
    parentPhone: '01718991122',
    monthlyFee: 2800,
    discountType: 'none',
    discountAmount: 0,
    joinDate: '2026-08-01',
    status: 'active',
    avatarInitials: 'TA'
  },
  {
    id: 's5',
    name: 'Tanjila Akter',
    nameBn: 'তানজিলা আক্তার',
    classLevel: 'Class 10 (SSC)',
    schoolName: 'Ideal School and College, Motijheel',
    batchId: 'batch-2',
    parentName: 'Parveen Sultana',
    parentPhone: '01711223344',
    parentEmail: 'parveen.sultana@gmail.com',
    monthlyFee: 2200,
    discountType: 'none',
    discountAmount: 0,
    joinDate: '2026-05-10',
    status: 'active',
    avatarInitials: 'TA',
    notes: 'Mother requested weekly attendance updates over WhatsApp.'
  },
  {
    id: 's6',
    name: 'Sumaiya Islam',
    nameBn: 'সুমাইয়া ইসলাম',
    classLevel: 'Class 10 (SSC)',
    schoolName: 'Holy Cross Girls High School',
    batchId: 'batch-2',
    parentName: 'Md. Nazrul Islam',
    parentPhone: '01719665544',
    monthlyFee: 2200,
    discountType: 'none',
    discountAmount: 0,
    joinDate: '2026-06-01',
    status: 'active',
    avatarInitials: 'SI'
  },
  {
    id: 's7',
    name: 'Sabbir Hossain',
    nameBn: 'সাব্বির হোসেন',
    classLevel: 'Class 10 (SSC)',
    schoolName: 'Motijheel Govt Boys High School',
    batchId: 'batch-2',
    parentName: 'Parveen Sultana', // Tanjila's brother for multi-child demo
    parentPhone: '01711223344',
    monthlyFee: 2200,
    discountType: 'sibling',
    discountAmount: 400,
    joinDate: '2026-05-10',
    status: 'active',
    avatarInitials: 'SH',
    notes: 'Sibling discount applied (৳400 off).'
  },
  {
    id: 's8',
    name: 'Farhan Kabir',
    nameBn: 'ফারহান কবির',
    classLevel: 'Class 9',
    schoolName: "St. Joseph Higher Secondary School",
    batchId: 'batch-3',
    parentName: 'Kabir Hossain',
    parentPhone: '01814332211',
    monthlyFee: 1800,
    discountType: 'none',
    discountAmount: 0,
    joinDate: '2026-08-15',
    status: 'active',
    avatarInitials: 'FK',
    notes: 'Missed class on Sept 28 due to fever, waiting for make-up slot.'
  },
  {
    id: 's9',
    name: 'Anika Tabassum',
    nameBn: 'আনিকা তাবাসসুম',
    classLevel: 'Class 9',
    schoolName: 'Viqarunnisa Noon School (Bashundhara)',
    batchId: 'batch-3',
    parentName: 'M. A. Rouf',
    parentPhone: '01917654321',
    monthlyFee: 1800,
    discountType: 'none',
    discountAmount: 0,
    joinDate: '2026-07-20',
    status: 'active',
    avatarInitials: 'AT'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-101',
    studentId: 's1', // Rahim
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-07',
    amount: 2800,
    discount: 0,
    paidAmount: 2800,
    status: 'paid',
    payments: [
      {
        id: 'pay-01',
        date: '2026-10-02',
        amount: 2800,
        method: 'bKash',
        trxId: '9K8J7H6G5F',
        verified: true,
        verifiedAt: '2026-10-02 08:30 PM',
        notes: 'Paid via bKash Personal'
      }
    ]
  },
  {
    id: 'inv-102',
    studentId: 's2', // Nusrat
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-07',
    amount: 2800,
    discount: 0,
    paidAmount: 2800,
    status: 'paid',
    payments: [
      {
        id: 'pay-02',
        date: '2026-10-03',
        amount: 2800,
        method: 'Nagad',
        trxId: 'NGD44332211',
        verified: true,
        verifiedAt: '2026-10-03 11:15 AM'
      }
    ]
  },
  {
    id: 'inv-103',
    studentId: 's3', // Mehedi
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-07',
    amount: 2500, // 2800 - 300 discount
    discount: 300,
    paidAmount: 0,
    status: 'due',
    payments: []
  },
  {
    id: 'inv-104',
    studentId: 's4', // Tanvir Ahmed
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-07',
    amount: 2800,
    discount: 0,
    paidAmount: 0,
    status: 'overdue',
    daysOverdue: 9,
    payments: []
  },
  {
    id: 'inv-105',
    studentId: 's5', // Tanjila Akter
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-05',
    amount: 2200,
    discount: 0,
    paidAmount: 2200,
    status: 'paid',
    payments: [
      {
        id: 'pay-05',
        date: '2026-10-04',
        amount: 2200,
        method: 'bKash',
        trxId: 'BKSH88990011',
        verified: true,
        verifiedAt: '2026-10-04 04:00 PM'
      }
    ]
  },
  {
    id: 'inv-106',
    studentId: 's6', // Sumaiya Islam
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-05',
    amount: 2200,
    discount: 0,
    paidAmount: 1000,
    status: 'partial',
    payments: [
      {
        id: 'pay-06',
        date: '2026-10-05',
        amount: 1000,
        method: 'Cash',
        verified: true,
        verifiedAt: '2026-10-05 06:15 PM',
        notes: 'Remaining ৳1200 promised by 15th'
      }
    ]
  },
  {
    id: 'inv-107',
    studentId: 's7', // Sabbir Hossain
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-05',
    amount: 1800, // 2200 - 400 sibling discount
    discount: 400,
    paidAmount: 0,
    status: 'due',
    payments: []
  },
  {
    id: 'inv-108',
    studentId: 's8', // Farhan Kabir
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-05',
    amount: 1800,
    discount: 0,
    paidAmount: 0,
    status: 'overdue',
    daysOverdue: 16,
    payments: []
  },
  {
    id: 'inv-109',
    studentId: 's9', // Anika Tabassum
    month: 'October 2026',
    issueDate: '2026-10-01',
    dueDate: '2026-10-07',
    amount: 1800,
    discount: 0,
    paidAmount: 1800,
    status: 'paid',
    payments: [
      {
        id: 'pay-09',
        date: '2026-10-02',
        amount: 1800,
        method: 'bKash',
        trxId: 'BK77889922',
        verified: true,
        verifiedAt: '2026-10-02 10:00 AM'
      }
    ]
  }
];

export const initialSessions: ClassSession[] = [
  {
    id: 'ses-today-1',
    batchId: 'batch-1',
    date: '2026-09-30',
    time: '06:00 PM - 07:30 PM',
    topicCovered: 'Work, Power & Energy - Potential Well & Conservative Forces',
    isCompleted: false,
    attendance: {
      s1: 'present',
      s2: 'present',
      s3: 'present',
      s4: 'late'
    },
    teacherNotes: 'Solve textbook examples 4.1 to 4.7'
  },
  {
    id: 'ses-today-2',
    batchId: 'batch-3',
    date: '2026-09-30',
    time: '04:00 PM - 05:30 PM',
    topicCovered: 'ICT Chapter 3: Number Systems - Binary to Hexadecimal conversions',
    isCompleted: true,
    attendance: {
      s8: 'absent',
      s9: 'present'
    },
    teacherNotes: 'Farhan was absent. Needs make-up session.'
  },
  {
    id: 'ses-prev-1',
    batchId: 'batch-2',
    date: '2026-09-29',
    time: '05:00 PM - 06:30 PM',
    topicCovered: 'Trigonometry 9.2 - Angle of Elevation & Depression word problems',
    isCompleted: true,
    attendance: {
      s5: 'present',
      s6: 'present',
      s7: 'present'
    }
  }
];

export const initialProgressNotes: ProgressNote[] = [
  {
    id: 'prog-1',
    studentId: 's5', // Tanjila
    date: '2026-09-29',
    topic: 'Trigonometry 9.2 Heights and Distances',
    homeworkStatus: 'Done',
    moodTag: 'Attentive',
    score: 18,
    maxScore: 20,
    note: 'Excellent grasp on tangent ratios and multi-step angle problems.'
  },
  {
    id: 'prog-2',
    studentId: 's1', // Rahim
    date: '2026-09-28',
    topic: 'Circular Motion - Centripetal Acceleration & Banked Roads',
    homeworkStatus: 'Done',
    moodTag: 'Excellent',
    score: 25,
    maxScore: 25,
    note: 'Solved all 3 past BUET admission test problems accurately.'
  },
  {
    id: 'prog-3',
    studentId: 's8', // Farhan
    date: '2026-09-26',
    topic: 'Physics Chapter 2: Equations of Motion in 1D',
    homeworkStatus: 'Partial',
    moodTag: 'Needs Focus',
    score: 12,
    maxScore: 20,
    note: 'Needs more practice with deceleration and velocity-time graphs.'
  },
  {
    id: 'prog-4',
    studentId: 's8', // Farhan
    date: '2026-09-22',
    topic: 'ICT Chapter 3: Binary & Octal Conversion',
    homeworkStatus: 'Done',
    moodTag: 'Attentive',
    score: 17,
    maxScore: 20,
    note: 'Good understanding of base-2 to base-8 shortcuts.'
  },
  {
    id: 'prog-5',
    studentId: 's4', // Tanvir Ahmed
    date: '2026-09-28',
    topic: 'Physics: Conservative Forces & Potential Energy',
    homeworkStatus: 'Done',
    moodTag: 'Attentive',
    score: 19,
    maxScore: 20,
    note: 'Showed strong conceptual clarity on spring potential energy.'
  }
];

export const initialWeeklyReports: WeeklyReport[] = [
  {
    id: 'rep-01',
    studentId: 's5', // Tanjila Akter
    weekStartDate: '2026-09-24',
    weekEndDate: '2026-09-30',
    attendanceCount: {
      present: 3,
      total: 3
    },
    topics: [
      'Trigonometric Identities (Exercise 9.1 revision)',
      'Heights and Distances & Real-life Applications (Exercise 9.2)',
      'Physics Chapter 5: Work, Energy and Power introduction'
    ],
    homeworkSummary: 'Completed 100% of homework on time (24/24 questions checked)',
    teacherRemark: 'Tanjila is showing consistent dedication. Her calculation speed improved noticeably. Keep up this momentum for the upcoming test!',
    examScore: '18 / 20 (Weekly Surprise Quiz)',
    feeStatusSummary: 'Paid (৳2,200 for October received via bKash)',
    nextWeekPlan: 'Coordinate Geometry (Chapter 11) + Weekly Chapter Evaluation',
    sentAt: '2026-09-30 06:15 PM'
  },
  {
    id: 'rep-02',
    studentId: 's7', // Sabbir Hossain
    weekStartDate: '2026-09-24',
    weekEndDate: '2026-09-30',
    attendanceCount: {
      present: 2,
      total: 3
    },
    topics: [
      'Algebraic Expressions (Exercise 3.2)',
      'Science Chapter 6: Structure of the Atom'
    ],
    homeworkSummary: 'Completed partial homework (skipped word problems)',
    teacherRemark: 'Sabbir needs to focus more during algebra problem-solving. We will review atomic structure together next Tuesday.',
    examScore: '14 / 20',
    feeStatusSummary: 'Due: ৳1,800 (Due date Oct 5)',
    nextWeekPlan: 'Factorization methods & Science chapter test'
  },
  {
    id: 'rep-03',
    studentId: 's8', // Farhan Kabir
    weekStartDate: '2026-09-24',
    weekEndDate: '2026-09-30',
    attendanceCount: {
      present: 2,
      total: 3
    },
    topics: [
      'ICT Chapter 3: Binary & Octal systems',
      'Motion Equations and Velocity-Time graphs'
    ],
    homeworkSummary: 'Submitted 1 assignment late',
    teacherRemark: 'Missed Wednesday class due to illness. A make-up slot has been arranged.',
    examScore: '12 / 20',
    feeStatusSummary: 'Overdue: ৳1,800 (16 days late)',
    nextWeekPlan: 'Hexadecimal numbers & Make-up class'
  }
];

export const initialMakeUpRequests: MakeUpRequest[] = [
  {
    id: 'mu-01',
    studentId: 's8', // Farhan Kabir
    batchId: 'batch-3',
    missedDate: '2026-09-28',
    reason: 'Fever and doctor visit',
    suggestedSlots: [
      'Thursday, Oct 2 · 04:00 PM (Dhanmondi Room 102)',
      'Friday, Oct 3 · 11:30 AM (Online 1-on-1)',
      'Sunday, Oct 5 · 03:30 PM (Dhanmondi Room 102)'
    ],
    confirmedSlot: 'Thursday, Oct 2 · 04:00 PM (Dhanmondi Room 102)',
    status: 'parent_confirmed',
    notes: 'Parent confirmed via WhatsApp'
  },
  {
    id: 'mu-02',
    studentId: 's4', // Tanvir Ahmed
    batchId: 'batch-1',
    missedDate: '2026-09-23',
    reason: 'College sports event',
    suggestedSlots: [
      'Friday, Oct 3 · 04:30 PM (Dhanmondi Room 201)',
      'Sunday, Oct 5 · 07:30 PM (Google Meet)'
    ],
    status: 'pending',
    notes: 'Sent to Mrs. Salma Ahmed on WhatsApp'
  }
];

export const initialBroadcasts: ParentBroadcast[] = [
  {
    id: 'bc-1',
    title: 'Upcoming Weekly Physics & Math Evaluation Test',
    message: 'Dear Parents, Our scheduled monthly evaluation test will take place this Saturday (Oct 3). Syllabus: Physics Ch 4 & Math Ch 9. Please ensure your child reviews formula notes.',
    type: 'exam',
    sentAt: '2026-09-29 08:00 PM',
    targetCount: 9,
    deliveredCount: 9,
    readCount: 8
  },
  {
    id: 'bc-2',
    title: 'Durga Puja & Autumn Break Schedule',
    message: 'All physical coaching classes will remain closed from Oct 18 to Oct 20 for Durga Puja. Special online doubt clearing session on Oct 19 evening at 8:00 PM.',
    type: 'holiday',
    sentAt: '2026-09-25 09:30 AM',
    targetCount: 9,
    deliveredCount: 9,
    readCount: 9
  }
];
