import { Language } from '../types';

export const toBnNum = (num: number | string, lang: Language, useBanglaDigits: boolean = true): string => {
  if (lang !== 'bn' || !useBanglaDigits) return String(num);
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[Number(digit)] || digit);
};

export const formatCurrency = (amount: number, lang: Language, useBanglaDigits: boolean = true): string => {
  const formatted = amount.toLocaleString('en-IN');
  return `৳${toBnNum(formatted, lang, useBanglaDigits)}`;
};

export const formatRole = (role: 'Owner' | 'Teacher' | 'Assistant' | string, lang: Language): string => {
  if (lang === 'bn') {
    switch (role) {
      case 'Owner':
      case 'OWNER':
        return 'মালিক';
      case 'Teacher':
      case 'TEACHER':
        return 'শিক্ষক';
      case 'Assistant':
      case 'ASSISTANT':
        return 'সহকারী';
      default:
        return 'মালিক';
    }
  }
  return String(role).toUpperCase();
};

export const formatDateBn = (
  day: string,
  dayNum: number | string,
  month: string,
  lang: Language,
  useBanglaDigits: boolean = true
): string => {
  if (lang === 'bn') {
    const daysBn: Record<string, string> = {
      Saturday: 'শনিবার',
      Sunday: 'রবিবার',
      Monday: 'সোমবার',
      Tuesday: 'মঙ্গলবার',
      Wednesday: 'বুধবার',
      Thursday: 'বৃহস্পতিবার',
      Friday: 'শুক্রবার'
    };
    const monthsBn: Record<string, string> = {
      January: 'জানুয়ারি',
      February: 'ফেব্রুয়ারি',
      March: 'মার্চ',
      April: 'এপ্রিল',
      May: 'মে',
      June: 'জুন',
      July: 'জুলাই',
      August: 'আগস্ট',
      September: 'সেপ্টেম্বর',
      October: 'অক্টোবর',
      November: 'নভেম্বর',
      December: 'ডিসেম্বর',
      Sept: 'সেপ্টেম্বর',
      Oct: 'অক্টোবর'
    };
    const dayBn = daysBn[day] || day;
    const monthBn = monthsBn[month] || month;
    const numBn = toBnNum(dayNum, 'bn', useBanglaDigits);
    return `${dayBn}, ${numBn} ${monthBn}`;
  }
  return `${day}, ${month.slice(0, 3)} ${dayNum}`;
};

export const translations = {
  en: {
    brandName: 'TutorLoop',
    appTitle: 'TutorLoop',
    taglineHeader: 'Fee chasing bondho · Auto reports',
    tagline: 'Fee chasing bondho. Parents get a weekly report automatically.',
    roleOwner: 'OWNER',
    roleTeacher: 'TEACHER',
    roleAssistant: 'ASSISTANT',
    viewAs: 'View as',
    tutor: 'Tutor',
    parent: 'Parent',
    searchPlaceholder: 'Search student, batch, phone...',
    searchGroupStudents: 'Students (শিক্ষার্থী)',
    searchGroupBatches: 'Batches (ব্যাচ)',
    searchGroupParents: 'Parents (অভিভাবক)',
    seeAllResults: 'See all results',
    noResultsFor: 'No results for',
    searchEmptyHint: 'Try a name, phone number or batch.',
    recentSearches: 'Recent searches',
    clearRecent: 'Clear',
    quickSuggestions: 'Suggestions',
    suggestionOverdueFees: 'Overdue fees',
    suggestionAbsentToday: 'Absent today',
    suggestionTodayClasses: "Today's classes",
    back: 'Back',
    searchResultsTitle: 'Search Results',
    resultsFound: 'results found',
    quickAdd: 'Quick Add',
    addStudent: 'Add Student',
    markAttendance: 'Mark Attendance',
    recordPayment: 'Record Payment',
    addNote: 'Add Note',
    settings: 'Settings',
    notifications: 'Notifications',

    // Tutor tabs & subtitles
    navToday: 'Today',
    navTodaySub: 'Real-time overview of today\'s sessions, due fees & pending tasks',
    navStudents: 'Students',
    navStudentsSub: 'Manage student directory, fee plans, parent contacts & records',
    navClasses: 'Classes',
    navClassesSub: 'Weekly timetable, one-tap batch attendance & make-up slots',
    navFees: 'Fees',
    navFeesSub: 'Invoicing, mobile banking payments, aging ledger & WhatsApp reminders',
    navProgress: 'Progress',
    navProgressSub: '15-second lesson logs, exam scores & automated weekly reports',
    navParents: 'Parents',
    navParentsSub: 'Direct parent directory, batch broadcasts & notification status',

    // Parent tabs
    parentHome: 'Home',
    parentReports: 'Reports',
    parentFees: 'Fees',
    parentSchedule: 'Schedule',
    parentChildSelector: 'Student',

    // Today screen
    todayClasses: "Today's Schedule",
    startMarkAttendance: 'Mark Attendance',
    feesDueMonth: 'Fees Due This Month',
    collectedThisMonth: 'Collected',
    attendanceRate: 'Attendance This Week',
    pendingMakeups: 'Pending Make-ups',
    needsAttention: 'Needs Attention',
    sendFeeReminders: 'Send Fee Reminders',
    remindersCountPending: 'pending fee reminders ready to send',
    absentNotice: 'Absent student requiring make-up',
    overdueNotice: 'Days overdue on tuition fee',
    unsentReportNotice: 'Weekly report pending preview & send',
    allPresent: 'All Present',
    attendanceCompleted: 'Attendance Done',

    // Common
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    edit: 'Edit',
    delete: 'Delete',
    viewDetails: 'View Details',
    exportData: 'Export CSV',
    undo: 'Undo',
    done: 'Done',
    status: 'Status',
    date: 'Date',
    time: 'Time',
    batch: 'Batch',
    amount: 'Amount',
    phone: 'Phone',
    action: 'Action',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    paid: 'Paid',
    due: 'Due',
    overdue: 'Overdue',
    partial: 'Partial',
    whatsapp: 'WhatsApp',
    call: 'Call',
    viewReceipt: 'View Receipt',
    verified: 'Verified by Tutor',
    unverified: 'Pending Verification',
  },
  bn: {
    brandName: 'টিউটরলুপ',
    appTitle: 'টিউটরলুপ',
    taglineHeader: 'ফিচাওয়া বন্ধ · অটো রিপোর্ট',
    tagline: 'ফি চাওয়া বন্ধ। অভিভাবক পাবেন প্রতি সপ্তাহে অটো রিপোর্ট।',
    roleOwner: 'মালিক',
    roleTeacher: 'শিক্ষক',
    roleAssistant: 'সহকারী',
    viewAs: 'ভূমিকা',
    tutor: 'শিক্ষক',
    parent: 'অভিভাবক',
    searchPlaceholder: 'শিক্ষার্থী, ব্যাচ বা ফোন খুঁজুন...',
    searchGroupStudents: 'শিক্ষার্থী (Students)',
    searchGroupBatches: 'ব্যাচ (Batches)',
    searchGroupParents: 'অভিভাবক (Parents)',
    seeAllResults: 'সকল ফলাফল দেখুন',
    noResultsFor: 'কোনো ফলাফল পাওয়া যায়নি',
    searchEmptyHint: 'নাম, ফোন নম্বর বা ব্যাচ লিখে চেষ্টা করুন।',
    recentSearches: 'সাম্প্রতিক অনুসন্ধান',
    clearRecent: 'মুছুন',
    quickSuggestions: 'পরামর্শ',
    suggestionOverdueFees: 'বকেয়া ফি',
    suggestionAbsentToday: 'আজকের অনুপস্থিত',
    suggestionTodayClasses: 'আজকের ক্লাস',
    back: 'ফিরে যান',
    searchResultsTitle: 'অনুসন্ধানের ফলাফল',
    resultsFound: 'টি ফলাফল পাওয়া গেছে',
    quickAdd: '+ দ্রুত যোগ',
    addStudent: 'নতুন শিক্ষার্থী',
    markAttendance: 'উপস্থিতি নিন',
    recordPayment: 'পেমেন্ট যুক্ত করুন',
    addNote: 'প্রগ্রেস নোট',
    settings: 'সেটিংস',
    notifications: 'নোটিফিকেশন',

    // Tutor tabs & subtitles
    navToday: 'আজকের কাজ',
    navTodaySub: 'আজকের ক্লাস, বকেয়া ফি এবং জরুরি কাজের সরাসরি ওভারভিউ',
    navStudents: 'শিক্ষার্থী',
    navStudentsSub: 'শিক্ষার্থীদের তালিকা, ফি প্ল্যান, অভিভাবক যোগাযোগ ও প্রোফাইল',
    navClasses: 'ক্লাস শিডিউল',
    navClassesSub: 'সাপ্তাহিক রুটিন, এক ক্লিকে উপস্থিতি এবং মেক-আপ স্লট',
    navFees: 'ফি হিসাব',
    navFeesSub: 'ইনভয়েস, বিকাশ/নগদ পেমেন্ট, বকেয়া তালিকা ও রিমাইন্ডার',
    navProgress: 'অগ্রগতি',
    navProgressSub: '১৫ সেকেন্ডে লেসন নোট, পরীক্ষার ফলাফল ও অটো সাপ্তাহিক রিপোর্ট',
    navParents: 'অভিভাবক',
    navParentsSub: 'অভিভাবক ডিরেক্টরি, এক ক্লিকে নোটিশ ও ডেলিভারি স্ট্যাটাস',

    // Parent tabs
    parentHome: 'হোম',
    parentReports: 'রিপোর্ট',
    parentFees: 'ফি ও রশিদ',
    parentSchedule: 'রুটিন',
    parentChildSelector: 'সন্তান নির্বাচন',

    // Today screen
    todayClasses: 'আজকের ক্লাসের সময়সূচী',
    startMarkAttendance: 'উপস্থিতি গ্রহণ',
    feesDueMonth: 'চলতি মাসে বকেয়া ফি',
    collectedThisMonth: 'মোট আদায় হয়েছে',
    attendanceRate: 'এই সপ্তাহের উপস্থিতি',
    pendingMakeups: 'বকেয়া মেক-আপ ক্লাস',
    needsAttention: 'জরুরি নজর দিন',
    sendFeeReminders: 'ফি তাগাদা পাঠান',
    remindersCountPending: 'টি বকেয়া ফি রিমাইন্ডার পাঠানোর জন্য প্রস্তুত',
    absentNotice: 'অনুপস্থিত শিক্ষার্থী (মেক-আপ প্রয়োজন)',
    overdueNotice: 'দিন ধরে ফি বকেয়া রয়েছে',
    unsentReportNotice: 'সাপ্তাহিক রিপোর্ট তৈরি হয়েছে, পাঠানোর অপেক্ষায়',
    allPresent: 'সকলেই উপস্থিত',
    attendanceCompleted: 'উপস্থিতি সম্পন্ন',

    // Common
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত করুন',
    edit: 'সম্পাদনা',
    delete: 'মুছুন',
    viewDetails: 'বিস্তারিত দেখুন',
    exportData: 'এক্সপোর্ট CSV',
    undo: 'আগের অবস্থায় ফিরুন',
    done: 'সম্পন্ন',
    status: 'অবস্থা',
    date: 'তারিখ',
    time: 'সময়',
    batch: 'ব্যাচ',
    amount: 'পরিমাণ',
    phone: 'ফোন',
    action: 'পদক্ষেপ',
    present: 'উপস্থিত',
    absent: 'অনুপস্থিত',
    late: 'দেরি',
    paid: 'পরিশোধিত',
    due: 'বকেয়া',
    overdue: 'মেয়াদোত্তীর্ণ',
    partial: 'আংশিক পরিশোধ',
    whatsapp: 'হোয়াটসঅ্যাপ',
    call: 'কল করুন',
    viewReceipt: 'রশিদ দেখুন',
    verified: 'শিক্ষক কর্তৃক যাচাইকৃত',
    unverified: 'যাচাই অপেক্ষমান',
  }
};
