import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { translations } from './translations';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { QuickAddFloatingButton } from './components/QuickAddFloatingButton';
import { Toast } from './components/Toast';

// Modals
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { AddStudentModal } from './components/modals/AddStudentModal';
import { AttendanceModal } from './components/modals/AttendanceModal';
import { FeeReminderModal } from './components/modals/FeeReminderModal';
import { WeeklyReportModal } from './components/modals/WeeklyReportModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { MakeUpModal } from './components/modals/MakeUpModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { StudentProfileDrawer } from './components/modals/StudentProfileDrawer';
import { OnboardingModal } from './components/modals/OnboardingModal';

// Tutor Views
import { TodayView } from './views/tutor/TodayView';
import { StudentsView } from './views/tutor/StudentsView';
import { ClassesView } from './views/tutor/ClassesView';
import { FeesView } from './views/tutor/FeesView';
import { ProgressView } from './views/tutor/ProgressView';
import { ParentsView } from './views/tutor/ParentsView';
import { SearchResultsView } from './views/tutor/SearchResultsView';

// Parent View
import { ParentPortalView } from './views/parent/ParentPortalView';

const MainLayout: React.FC = () => {
  const { role, activeTutorTab, language, searchViewQuery } = useApp();
  const t = translations[language];

  useEffect(() => {
    document.title = language === 'bn'
      ? `${t.brandName} - টিউশন ও কোচিং ম্যানেজমেন্ট`
      : `${t.brandName} - Tuition & Coaching Management`;
  }, [language, t.brandName]);

  const renderTutorContent = () => {
    if (searchViewQuery) {
      return <SearchResultsView />;
    }
    switch (activeTutorTab) {
      case 'today':
        return <TodayView />;
      case 'students':
        return <StudentsView />;
      case 'classes':
        return <ClassesView />;
      case 'fees':
        return <FeesView />;
      case 'progress':
        return <ProgressView />;
      case 'parents':
        return <ParentsView />;
      default:
        return <TodayView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8EE] flex flex-col text-[#00272B]">
      {/* Top Bar Contract (Navbar) */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Desktop) */}
        <Sidebar />

        {/* Scrollable Content Viewport */}
        <main className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
          {role === 'tutor' ? renderTutorContent() : <ParentPortalView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Floating "+ Quick Add" Speed Dial */}
      <QuickAddFloatingButton />

      {/* Global Modals & Drawers */}
      <RecordPaymentModal />
      <AddStudentModal />
      <AttendanceModal />
      <FeeReminderModal />
      <WeeklyReportModal />
      <ReceiptModal />
      <MakeUpModal />
      <SettingsModal />
      <StudentProfileDrawer />
      <OnboardingModal />

      {/* Undoable Toast Notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
