import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatRole } from '../../translations';
import {
  Bell,
  Calendar,
  CheckCircle2,
  Database,
  Lock,
  Phone,
  Save,
  ShieldCheck,
  UserCheck,
  Users,
  X
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { settingsModalOpen, setSettingsModalOpen, settings, updateSettings, language, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'coaching' | 'automation' | 'holidays' | 'security'>('coaching');

  // Local form state
  const [coachingName, setCoachingName] = useState(settings.coachingName);
  const [leadTeacher, setLeadTeacher] = useState(settings.leadTeacher);
  const [phone, setPhone] = useState(settings.phone);
  const [bKashNumber, setBKashNumber] = useState(settings.bKashNumber);
  const [nagadNumber, setNagadNumber] = useState(settings.nagadNumber);
  const [address, setAddress] = useState(settings.address);
  const [autoReport, setAutoReport] = useState(settings.autoSendWeeklyReport);
  const [userRole, setUserRole] = useState(settings.userRole);
  const [useBanglaDigits, setUseBanglaDigits] = useState(settings.useBanglaDigits ?? true);

  const t = translations[language];

  if (!settingsModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      coachingName,
      leadTeacher,
      phone,
      bKashNumber,
      nagadNumber,
      address,
      autoSendWeeklyReport: autoReport,
      userRole,
      useBanglaDigits
    });
    setSettingsModalOpen(false);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(localStorage.getItem('tutorloop_students') || '[]');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tutorloop_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(language === 'bn' ? 'ডেটা ব্যাকআপ ডাউনলোড সম্পন্ন' : 'Data backup exported successfully');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#00272B]/10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#00272B] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0FF4F] text-[#00272B] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'কোচিং সেটিংস ও সিকিউরিটি' : 'Settings & Security'}
              </h3>
              <p className="text-xs text-[#E0FF4F]">
                {language === 'bn' ? 'অটোমেশন, পেমেন্ট নাম্বার ও ডাটা প্রাইভেসি' : 'Automation rules, payment accounts & privacy'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 bg-[#F6F8EE] border-b border-[#00272B]/10 flex gap-4 text-xs font-bold text-[#00272B]/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('coaching')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'coaching'
                ? 'border-[#00272B] text-[#00272B]'
                : 'border-transparent hover:text-[#00272B]'
            }`}
          >
            {language === 'bn' ? 'কোচিং ও পেমেন্ট' : 'Coaching Profile'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('automation')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'automation'
                ? 'border-[#00272B] text-[#00272B]'
                : 'border-transparent hover:text-[#00272B]'
            }`}
          >
            {language === 'bn' ? 'অটোমেশন রুলস' : 'Automation Rules'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('holidays')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'holidays'
                ? 'border-[#00272B] text-[#00272B]'
                : 'border-transparent hover:text-[#00272B]'
            }`}
          >
            {language === 'bn' ? 'ছুটির তালিকা' : 'Holidays'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-[#00272B] text-[#00272B]'
                : 'border-transparent hover:text-[#00272B]'
            }`}
          >
            {language === 'bn' ? 'সিকিউরিটি ও রোল' : 'Security & RBAC'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'coaching' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#00272B] mb-1">
                    {language === 'bn' ? 'কোচিং সেন্টারের নাম' : 'Coaching Name'}
                  </label>
                  <input
                    type="text"
                    value={coachingName}
                    onChange={(e) => setCoachingName(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#00272B] mb-1">
                    {language === 'bn' ? 'প্রধান শিক্ষক / পরিচালক' : 'Lead Teacher'}
                  </label>
                  <input
                    type="text"
                    value={leadTeacher}
                    onChange={(e) => setLeadTeacher(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#00272B] mb-1">
                    {language === 'bn' ? 'বিকাশ নম্বর (Personal / Merchant)' : 'bKash Number'}
                  </label>
                  <input
                    type="text"
                    value={bKashNumber}
                    onChange={(e) => setBKashNumber(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-mono bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#00272B] mb-1">
                    {language === 'bn' ? 'নগদ নম্বর' : 'Nagad Number'}
                  </label>
                  <input
                    type="text"
                    value={nagadNumber}
                    onChange={(e) => setNagadNumber(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-mono bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00272B] mb-1">
                  {language === 'bn' ? 'কোচিং ঠিকানা' : 'Address / Branch'}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
                />
              </div>

              {/* Bangla Digits Option */}
              <div className="p-3.5 bg-[#F6F8EE] rounded-2xl border border-[#00272B]/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#00272B]">
                    {language === 'bn' ? 'বাংলা সংখ্যা পদ্ধতি (১, ২, ৩)' : 'Bangla Numerals (১, ২, ৩)'}
                  </p>
                  <p className="text-[11px] text-[#00272B]/60 mt-0.5">
                    {language === 'bn'
                      ? 'সচল থাকলে তারিখ ও শিক্ষার্থী সংখ্যায় বাংলা ডিজিট প্রদর্শিত হবে'
                      : 'Display dates, counts and currency with Bengali numerals when in Bangla'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUseBanglaDigits(!useBanglaDigits)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0 ${
                    useBanglaDigits ? 'bg-[#00272B]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#E0FF4F] shadow-sm transform transition-transform ${
                      useBanglaDigits ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F6F8EE] rounded-2xl border border-[#00272B]/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#00272B]">
                    {language === 'bn' ? 'সাপ্তাহিক অটো-রিপোর্ট' : 'Weekly Automated Reports'}
                  </p>
                  <p className="text-[11px] text-[#00272B]/60 mt-0.5">
                    {language === 'bn'
                      ? 'প্রতি শুক্রবার সন্ধ্যা ৬টায় অভিভাবকদের কাছে অটো-পুশ পাঠানো হবে'
                      : 'Auto-compiled attendance, homework & test score report every Friday 6 PM'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoReport(!autoReport)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                    autoReport ? 'bg-[#00272B]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-[#E0FF4F] transition-transform ${
                      autoReport ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-[#F6F8EE] rounded-2xl border border-[#00272B]/10 space-y-2">
                <p className="text-xs font-bold text-[#00272B]">
                  {language === 'bn' ? 'ফি রিমাইন্ডার পাঠানোর নিয়ম' : 'Fee Reminder Automation Cadence'}
                </p>
                <ul className="text-xs text-[#00272B]/80 space-y-1.5 list-disc pl-4">
                  <li>{language === 'bn' ? 'মেয়াদ শেষ হওয়ার ৩ দিন আগে নরমাল রিমাইন্ডার' : '3 days before due date (Gentle heads-up)'}</li>
                  <li>{language === 'bn' ? 'নির্ধারিত দিনে পেমেন্ট নিশ্চিতকরণ মেসেজ' : 'On due date (Payment reminder)'}</li>
                  <li>{language === 'bn' ? '৩ দিন পর মেয়াদোত্তীর্ণ ফলো-আপ' : '3 days after due date (Follow-up)'}</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'holidays' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#00272B]">
                  {language === 'bn' ? 'আসন্ন ছুটির দিনসমূহ' : 'Upcoming Holiday Calendar'}
                </span>
                <span className="text-[11px] text-[#00272B]/60">
                  {settings.holidays.length} {language === 'bn' ? 'টি ছুটি' : 'holidays scheduled'}
                </span>
              </div>
              <div className="space-y-2">
                {settings.holidays.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#F6F8EE] rounded-2xl border border-[#00272B]/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h5 className="font-bold text-[#00272B]">{h.name}</h5>
                      <p className="text-[11px] text-[#00272B]/60">{h.date}</p>
                    </div>
                    <span className="font-semibold text-[#00272B] bg-white px-2.5 py-1 rounded-lg border border-[#00272B]/10">
                      {h.days} {language === 'bn' ? 'দিন ছুটি' : 'days off'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              {/* Role Scope */}
              <div>
                <label className="block text-xs font-semibold text-[#00272B] mb-1">
                  {language === 'bn' ? 'বর্তমান ব্যবহারকারী রোল (RBAC Scope)' : 'User Role & Permissions (RBAC)'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Owner', 'Teacher', 'Assistant'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setUserRole(r)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                        userRole === r
                          ? 'bg-[#00272B] text-[#E0FF4F] border-[#00272B]'
                          : 'bg-[#F6F8EE] text-[#00272B]/70 border-[#00272B]/10'
                      }`}
                    >
                      {formatRole(r, language)}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#00272B]/60 mt-1">
                  {userRole === 'Assistant'
                    ? (language === 'bn' ? 'সহকারী শিক্ষক আর্থিক হিসাব দেখতে বা তথ্য মুছতে পারবেন না।' : 'Assistant cannot view financial totals or delete records.')
                    : (language === 'bn' ? 'মালিকের সকল প্রশাসনিক ও এক্সপোর্ট সুবিধা রয়েছে।' : 'Owner has full administrative and export permissions.')}
                </p>
              </div>

              {/* Plain Language Security Guarantees */}
              <div className="p-4 bg-[#00272B] text-white rounded-2xl space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-[#E0FF4F] font-bold">
                  <Lock className="w-4 h-4" />
                  <span>{language === 'bn' ? 'ডাটা ও প্রাইভেসি প্রোটোকল' : 'Security & Privacy Architecture'}</span>
                </div>
                <ul className="text-white/80 space-y-1.5 list-disc pl-4 text-[11px] leading-relaxed">
                  <li>
                    <strong>{language === 'bn' ? 'অভিভাবক ডাটা আইসোলেশন:' : 'Parent Data Isolation:'}</strong>{' '}
                    {language === 'bn'
                      ? 'প্রত্যেক অভিভাবক কেবল নিজের সন্তানের ডাটা দেখতে পান (Object-Level Authorization)।'
                      : 'Each parent strictly accesses only their own child via authenticated phone OTP.'}
                  </li>
                  <li>
                    <strong>{language === 'bn' ? 'বাংলাদেশি ফোন ভ্যালিডেশন:' : 'BD Phone Sanitization:'}</strong>{' '}
                    {language === 'bn'
                      ? '০১ দিয়ে শুরু ১১ ডিজিটের সঠিক ফরম্যাট নিশ্চিতকরণ ও XSS ফিল্টারিং।'
                      : 'Strict regex 01XXXXXXXXX sanitization prevents XSS and malformed input.'}
                  </li>
                  <li>
                    <strong>{language === 'bn' ? 'পেমেন্ট ভেরিফিকেশন:' : 'Manual Payment Proof:'}</strong>{' '}
                    {language === 'bn'
                      ? 'অ্যাপের মাধ্যমে সরাসরি টাকা কাটা হয় না; বিকাশ/নগদ TrxID শিক্ষকের হাতে ভেরিফাই হয়।'
                      : 'No banking secrets inside app; tutors manually verify TrxID to eliminate disputes.'}
                  </li>
                </ul>
              </div>

              {/* Data Export */}
              <div className="pt-1 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#00272B]">
                    {language === 'bn' ? 'ডাটা ব্যাকআপ ও এক্সপোর্ট' : 'Offline Backup Export'}
                  </h5>
                  <p className="text-[10px] text-[#00272B]/60">
                    {language === 'bn' ? 'শিক্ষার্থীদের সব রেকর্ড JSON ফাইল হিসেবে ডাউনলোড করুন' : 'Export local database to JSON'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-3 py-1.5 text-xs font-semibold text-[#00272B] bg-[#F6F8EE] hover:bg-gray-200 rounded-xl border border-[#00272B]/15 flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ডাউনলোড' : 'Export JSON'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="pt-3 border-t border-[#00272B]/10 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSettingsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#00272B]/70 bg-gray-100 hover:bg-gray-200"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-[#00272B] bg-[#E0FF4F] hover:bg-[#d6f83b] shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
