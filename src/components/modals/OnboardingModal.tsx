import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, toBnNum } from '../../translations';
import { Check, ChevronRight, Upload, Users, X } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const {
    onboardingOpen,
    setOnboardingOpen,
    language,
    setLanguage,
    settings,
    updateSettings,
    batches,
    students,
    addStudent,
    showToast
  } = useApp();

  const [step, setStep] = useState(1);
  const [coachingName, setCoachingName] = useState(settings.coachingName);
  const [batchName, setBatchName] = useState('HSC Physics 2026');
  const [batchDays, setBatchDays] = useState('Sat / Mon / Wed');
  const [batchTime, setBatchTime] = useState('06:00 PM - 07:30 PM');
  const [batchFee, setBatchFee] = useState(2800);

  const t = translations[language];

  if (!onboardingOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      updateSettings({ coachingName });
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      setOnboardingOpen(false);
      showToast(
        language === 'bn'
          ? `${t.brandName} সেটআপ সম্পন্ন! আপনি এখন পুরোপুরি প্রস্তুত।`
          : `Setup complete! Welcome to ${t.brandName}.`
      );
    }
  };

  const handleImportSample = () => {
    addStudent({
      name: 'Tanvir Hasan',
      nameBn: 'তানভীর হাসান',
      classLevel: 'HSC 1st Year',
      schoolName: 'Dhaka College',
      batchId: batches[0]?.id || 'batch-1',
      parentName: 'Hasanuzzaman',
      parentPhone: '01712998877',
      monthlyFee: 2800,
      discountType: 'none',
      discountAmount: 0,
      joinDate: '2026-09-30',
      status: 'active'
    });
    showToast(language === 'bn' ? 'নমুনা শিক্ষার্থী যুক্ত হয়েছে!' : 'Sample student imported!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#00272B]/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Tagline Banner */}
        <div className="bg-[#00272B] text-white p-5 text-center relative">
          <button
            onClick={() => setOnboardingOpen(false)}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#E0FF4F]/20 text-[#E0FF4F] text-xs font-bold mb-2">
            <span>
              {language === 'bn'
                ? `${toBnNum(3, language, settings.useBanglaDigits)} ধাপে সহজ সেটআপ`
                : '3-Step Rapid Setup'}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white">
            {language === 'bn' ? 'ফি চাওয়া বন্ধ। অটো রিপোর্ট।' : 'Fee Chasing Bondho.'}
          </h2>
          <p className="text-xs text-[#E0FF4F] mt-1 max-w-sm mx-auto">
            {language === 'bn'
              ? 'অভিভাবক পাবেন প্রতি সপ্তাহে অটো রিপোর্ট।'
              : 'Parents get a weekly report automatically.'}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-[#E0FF4F] h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Contents */}
        <div className="p-6 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-bold text-[#00272B]/60 uppercase tracking-wider">
                  {language === 'bn'
                    ? `ধাপ ${toBnNum(1, language, settings.useBanglaDigits)} / ${toBnNum(3, language, settings.useBanglaDigits)}`
                    : 'Step 1 of 3'}
                </span>
                <h3 className="text-base font-bold text-[#00272B] mt-0.5">
                  {language === 'bn' ? 'কোচিংয়ের নাম ও ভাষা নির্ধারণ' : 'Coaching Name & Language'}
                </h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00272B] mb-1">
                  {language === 'bn' ? 'কোচিং বা শিক্ষকের নাম' : 'Coaching / Tutor Name'}
                </label>
                <input
                  type="text"
                  value={coachingName}
                  onChange={(e) => setCoachingName(e.target.value)}
                  className="w-full h-11 px-3 text-sm bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00272B] mb-1.5">
                  {language === 'bn' ? 'ভাষা নির্বাচন' : 'App Language'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('bn')}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                      language === 'bn'
                        ? 'bg-[#00272B] text-[#E0FF4F] border-[#00272B]'
                        : 'bg-[#F6F8EE] text-[#00272B]'
                    }`}
                  >
                    বাংলা (Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                      language === 'en'
                        ? 'bg-[#00272B] text-[#E0FF4F] border-[#00272B]'
                        : 'bg-[#F6F8EE] text-[#00272B]'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-bold text-[#00272B]/60 uppercase tracking-wider">
                  {language === 'bn'
                    ? `ধাপ ${toBnNum(2, language, settings.useBanglaDigits)} / ${toBnNum(3, language, settings.useBanglaDigits)}`
                    : 'Step 2 of 3'}
                </span>
                <h3 className="text-base font-bold text-[#00272B] mt-0.5">
                  {language === 'bn' ? 'আপনার প্রথম ব্যাচ যোগ করুন' : 'Add Your First Batch'}
                </h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00272B] mb-1">
                  {language === 'bn' ? 'ব্যাচের নাম ও বিষয়' : 'Batch Name & Subject'}
                </label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#00272B] mb-1">
                    {language === 'bn' ? 'সাপ্তাহিক দিন' : 'Schedule Days'}
                  </label>
                  <input
                    type="text"
                    value={batchDays}
                    onChange={(e) => setBatchDays(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#00272B] mb-1">
                    {language === 'bn' ? 'সময়সূচি' : 'Time Slot'}
                  </label>
                  <input
                    type="text"
                    value={batchTime}
                    onChange={(e) => setBatchTime(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00272B] mb-1">
                  {language === 'bn' ? 'মাসিক ফি (৳)' : 'Monthly Fee (৳)'}
                </label>
                <input
                  type="number"
                  value={batchFee}
                  onChange={(e) => setBatchFee(Number(e.target.value))}
                  className="w-full h-10 px-3 text-sm font-bold tabular-nums bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-bold text-[#00272B]/60 uppercase tracking-wider">
                  {language === 'bn'
                    ? `ধাপ ${toBnNum(3, language, settings.useBanglaDigits)} / ${toBnNum(3, language, settings.useBanglaDigits)}`
                    : 'Step 3 of 3'}
                </span>
                <h3 className="text-base font-bold text-[#00272B] mt-0.5">
                  {language === 'bn' ? 'শিক্ষার্থী তালিকা ও ইমপোর্ট' : 'Students & Quick Import'}
                </h3>
              </div>

              <div className="p-4 bg-[#F6F8EE] rounded-2xl border border-[#00272B]/10 text-center space-y-3">
                <Users className="w-8 h-8 text-[#00272B] mx-auto opacity-70" />
                <p className="text-xs text-[#00272B]/80 font-medium">
                  {language === 'bn'
                    ? `ইতিমধ্যে ${toBnNum(students.length, language, settings.useBanglaDigits)} জন শিক্ষার্থী ডেমোতে যুক্ত আছে। আপনি এক্সেল বা CSV থেকে এক ক্লিকে ইমপোর্ট করতে পারবেন।`
                    : `${students.length} realistic students loaded. You can import your full roster anytime via CSV.`}
                </p>
                <button
                  type="button"
                  onClick={handleImportSample}
                  className="px-4 py-2 text-xs font-bold bg-white text-[#00272B] hover:bg-[#E0FF4F] rounded-xl border border-[#00272B]/15 shadow-2xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'নমুনা ইমপোর্ট টেস্ট' : 'Import Sample Roster'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setOnboardingOpen(false)}
              className="text-xs font-semibold text-[#00272B]/60 hover:text-[#00272B] px-2 py-1"
            >
              {language === 'bn' ? 'আপাতত স্কিপ করুন' : 'Skip for now'}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="h-11 px-5 rounded-xl text-xs font-bold text-[#00272B] bg-[#E0FF4F] hover:bg-[#d6f83b] shadow-md flex items-center gap-1.5 ml-auto"
            >
              <span>{step === 3 ? (language === 'bn' ? 'শুরু করুন' : 'Finish & Launch') : (language === 'bn' ? 'পরবর্তী' : 'Next')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
