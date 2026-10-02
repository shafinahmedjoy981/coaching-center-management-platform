import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { Student } from '../../types';
import { UserPlus, X, Upload } from 'lucide-react';

export const AddStudentModal: React.FC = () => {
  const {
    addStudentModalOpen,
    setAddStudentModalOpen,
    batches,
    addStudent,
    language,
    showToast
  } = useApp();

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [classLevel, setClassLevel] = useState('HSC 1st Year');
  const [schoolName, setSchoolName] = useState('Dhaka Residential Model College');
  const [batchId, setBatchId] = useState(batches[0]?.id || 'batch-1');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('01');
  const [monthlyFee, setMonthlyFee] = useState<number>(batches[0]?.monthlyFee || 2800);
  const [discountType, setDiscountType] = useState<'none' | 'sibling' | 'scholarship' | 'custom'>('none');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [phoneError, setPhoneError] = useState('');

  const t = translations[language];

  if (!addStudentModalOpen) return null;

  const handleBatchChange = (bId: string) => {
    setBatchId(bId);
    const selected = batches.find((b) => b.id === bId);
    if (selected) {
      setMonthlyFee(selected.monthlyFee);
      setClassLevel(selected.classLevel);
    }
  };

  const validatePhone = (val: string) => {
    // Bangladesh mobile numbers start with 01 and have 11 digits
    const cleaned = val.replace(/[^0-9]/g, '');
    if (!cleaned.startsWith('01') || cleaned.length !== 11) {
      setPhoneError(
        language === 'bn'
          ? 'বাংলাদেশি ফোন নম্বর অবশ্যই ০১ দিয়ে শুরু এবং ১১ ডিজিট হতে হবে'
          : 'BD phone must start with 01 and have 11 digits'
      );
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleQuickPreFill = () => {
    setName('Saifur Rahman');
    setNameBn('সাইফুর রহমান');
    setClassLevel('HSC 2nd Year');
    setSchoolName('Notre Dame College');
    setParentName('Alhaj Mustafizur Rahman');
    setParentPhone('01712398471');
    setMonthlyFee(2800);
    setDiscountType('none');
    setDiscountAmount(0);
    setPhoneError('');
  };

  const handleSampleImport = () => {
    // Demo CSV import
    addStudent({
      name: 'Nabila Karim',
      nameBn: 'নাবিলা করিম',
      classLevel: 'Class 10',
      schoolName: 'Viqarunnisa Noon School',
      batchId: batches[1]?.id || 'batch-2',
      parentName: 'Rehana Karim',
      parentPhone: '01819283746',
      monthlyFee: 2200,
      discountType: 'none',
      discountAmount: 0,
      joinDate: '2026-09-30',
      status: 'active'
    });
    setAddStudentModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone(parentPhone)) return;

    addStudent({
      name,
      nameBn: nameBn || name,
      classLevel,
      schoolName,
      batchId,
      parentName: parentName || 'Guardian',
      parentPhone,
      monthlyFee,
      discountType,
      discountAmount,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    });

    setAddStudentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#00272B]/10 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#00272B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0FF4F] text-[#00272B] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? '৩০ সেকেন্ডে শিক্ষার্থী যুক্ত করুন' : 'Add Student (< 30s)'}
              </h3>
              <p className="text-xs text-[#E0FF4F]">
                {language === 'bn' ? 'নাম, ফোন এবং মাসিক ফি দিলেই হবে' : 'Fast onboarding for tutors'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAddStudentModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo Fast Fill Pill */}
        <div className="px-5 pt-3 flex items-center justify-between text-xs bg-[#F6F8EE] border-b border-[#00272B]/10 py-2.5">
          <span className="text-[#00272B]/70 font-medium">
            {language === 'bn' ? 'দ্রুত ডেমো ডেটা ভরতে চান?' : 'Want to autofill demo data?'}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleQuickPreFill}
              className="px-2.5 py-1 text-[11px] font-bold bg-white text-[#00272B] rounded-lg border border-[#00272B]/15 hover:bg-[#E0FF4F] transition-colors"
            >
              {language === 'bn' ? 'অটো-ফিল' : 'Auto-fill'}
            </button>
            <button
              type="button"
              onClick={handleSampleImport}
              className="px-2.5 py-1 text-[11px] font-bold bg-[#00272B] text-[#E0FF4F] rounded-lg hover:bg-black transition-colors flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              <span>{language === 'bn' ? 'CSV ইমপোর্ট' : 'Import CSV'}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-semibold text-[#00272B] mb-1">
                {language === 'bn' ? 'শিক্ষার্থীর নাম (English)' : 'Student Name (English) *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Saifur Rahman"
                className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] focus:outline-none focus:border-[#00272B]"
              />
            </div>

            {/* Bangla Name */}
            <div>
              <label className="block text-xs font-semibold text-[#00272B] mb-1">
                {language === 'bn' ? 'শিক্ষার্থীর নাম (বাংলা)' : 'Student Name (Bangla)'}
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="যেমন: সাইফুর রহমান"
                className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] focus:outline-none focus:border-[#00272B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Batch */}
            <div>
              <label className="block text-xs font-semibold text-[#00272B] mb-1">
                {language === 'bn' ? 'ব্যাচ নির্ধারণ করুন' : 'Assign Batch *'}
              </label>
              <select
                value={batchId}
                onChange={(e) => handleBatchChange(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-medium focus:outline-none focus:border-[#00272B]"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.scheduleTime})
                  </option>
                ))}
              </select>
            </div>

            {/* Class / Grade */}
            <div>
              <label className="block text-xs font-semibold text-[#00272B] mb-1">
                {language === 'bn' ? 'শ্রেণি / গ্রেড' : 'Class / Grade *'}
              </label>
              <input
                type="text"
                required
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                placeholder="e.g. HSC 1st Year, Class 10"
                className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] focus:outline-none focus:border-[#00272B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Parent Name */}
            <div>
              <label className="block text-xs font-semibold text-[#00272B] mb-1">
                {language === 'bn' ? 'অভিভাবকের নাম' : 'Parent Name *'}
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Father or Mother name"
                className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] focus:outline-none focus:border-[#00272B]"
              />
            </div>

            {/* Parent Phone (WhatsApp) */}
            <div>
              <label className="block text-xs font-semibold text-[#00272B] mb-1">
                {language === 'bn' ? 'অভিভাবক ফোন (WhatsApp) *' : 'Parent Phone (WhatsApp) *'}
              </label>
              <input
                type="tel"
                required
                value={parentPhone}
                onChange={(e) => {
                  setParentPhone(e.target.value);
                  if (phoneError) validatePhone(e.target.value);
                }}
                onBlur={() => validatePhone(parentPhone)}
                placeholder="01712345678"
                className="w-full h-10 px-3 text-xs font-mono bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] focus:outline-none focus:border-[#00272B]"
              />
              {phoneError && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{phoneError}</p>
              )}
            </div>
          </div>

          {/* School Name */}
          <div>
            <label className="block text-xs font-semibold text-[#00272B] mb-1">
              {language === 'bn' ? 'বিদ্যালয় / কলেজের নাম' : 'School or College'}
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Notre Dame College, Ideal School"
              className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] focus:outline-none focus:border-[#00272B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Monthly Fee */}
            <div>
              <label className="block text-xs font-semibold text-[#00272B] mb-1">
                {language === 'bn' ? 'মাসিক ফি (৳)' : 'Monthly Fee (৳) *'}
              </label>
              <input
                type="number"
                min="0"
                required
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(Number(e.target.value))}
                className="w-full h-10 px-3 text-sm font-bold tabular-nums bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] focus:outline-none focus:border-[#00272B]"
              />
            </div>

            {/* Discount / Sibling Waiver */}
            <div>
              <label className="block text-xs font-semibold text-[#00272B] mb-1">
                {language === 'bn' ? 'ছাড় (স্পেশাল / ভাইবোন)' : 'Discount Type'}
              </label>
              <select
                value={discountType}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setDiscountType(val);
                  if (val === 'sibling') setDiscountAmount(400);
                  else if (val === 'none') setDiscountAmount(0);
                  else setDiscountAmount(300);
                }}
                className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-medium focus:outline-none focus:border-[#00272B]"
              >
                <option value="none">{language === 'bn' ? 'কোনো ছাড় নেই' : 'No Discount'}</option>
                <option value="sibling">{language === 'bn' ? 'সহোদর / ভাইবোন ছাড় (৳৪০০)' : 'Sibling Discount (৳400)'}</option>
                <option value="scholarship">{language === 'bn' ? 'মেধা বৃত্তি (৳৩০০)' : 'Scholarship Waiver (৳300)'}</option>
              </select>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-[11px] text-[#00272B]/60 leading-relaxed italic bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-900/10">
            {language === 'bn'
              ? '🔒 শিশু ও অভিভাবকের তথ্য সম্পূর্ণ এনক্রিপ্টেড এবং কেবল এই কোচিংয়ের সাথে ব্যক্তিগত।'
              : '🔒 Privacy Notice: Student data is strictly isolated and accessible only to verified tutors.'}
          </p>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAddStudentModalOpen(false)}
              className="flex-1 h-11 rounded-xl text-xs font-semibold text-[#00272B]/70 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-2 h-11 rounded-xl text-xs font-bold text-[#00272B] bg-[#E0FF4F] hover:bg-[#d6f83b] shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'bn' ? 'শিক্ষার্থী যুক্ত করুন' : 'Save Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
