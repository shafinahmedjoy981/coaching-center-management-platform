import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency, toBnNum } from '../../translations';
import { MessageSquare, Send, X, CheckCircle2, Copy } from 'lucide-react';

export const FeeReminderModal: React.FC = () => {
  const {
    feeReminderModalOpen,
    setFeeReminderModalOpen,
    invoices,
    students,
    settings,
    language,
    showToast
  } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState<'polite' | 'due_today' | 'overdue'>('polite');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const t = translations[language];

  if (!feeReminderModalOpen) return null;

  // Unpaid invoices
  const unpaidInvoices = invoices.filter((i) => i.status === 'due' || i.status === 'overdue' || i.status === 'partial');

  const getTemplateText = (studentName: string, amountDue: number, dueDate: string) => {
    const formattedAmountBn = toBnNum(amountDue, 'bn', settings.useBanglaDigits);
    if (language === 'bn') {
      if (selectedTemplate === 'polite') {
        return `আসসালামু আলাইকুম। ${settings.coachingName}-এর পক্ষ থেকে শ্রদ্ধা জানাই। আপনার সন্তান ${studentName}-এর অক্টোবর মাসের টিউশন ফি ${formattedAmountBn} টাকা বাকি রয়েছে। অনুগ্রহপূর্বক সুবিধাজনক সময়ে বিকাশ (${settings.bKashNumber}) অথবা নগদ (${settings.nagadNumber})-এ পরিশোধের অনুরোধ রইল। ধন্যবাদ। - ${settings.leadTeacher}`;
      } else if (selectedTemplate === 'due_today') {
        return `শ্রদ্ধেয় অভিভাবক, আজ ${studentName}-এর টিউশন ফি ${formattedAmountBn} টাকা পরিশোধের নির্ধারিত দিন। ইতিমধ্যে পরিশোধ করে থাকলে অনুগ্রহ করে ট্রানজ্যাকশন আইডি জানিয়ে নিশ্চিত করবেন। ধন্যবাদ।`;
      } else {
        return `আসসালামু আলাইকুম। ${studentName}-এর টিউশন ফি ${formattedAmountBn} টাকা মেয়াদোত্তীর্ণ হয়েছে। অ্যাকাউন্টিং মিলিয়ে নেওয়ার সুবিধার্থে দ্রুত পরিশোধের বিনীত অনুরোধ জানাচ্ছি। কোনো অসুবিধা থাকলে সরাসরি যোগাযোগ করুন।`;
      }
    } else {
      if (selectedTemplate === 'polite') {
        return `Assalamu Alaikum. Warm greetings from ${settings.coachingName}. This is a gentle reminder that ${studentName}'s tuition fee of ৳${amountDue} for October is due on ${dueDate}. You may send via bKash (${settings.bKashNumber}) or Nagad (${settings.nagadNumber}). Thank you! - ${settings.leadTeacher}`;
      } else if (selectedTemplate === 'due_today') {
        return `Dear Guardian, today is the due date for ${studentName}'s monthly tuition fee of ৳${amountDue}. If already paid, please share the TrxID. Thank you.`;
      } else {
        return `Dear Guardian, ${studentName}'s tuition fee of ৳${amountDue} is currently overdue. Kindly settle at your earliest convenience to help maintain uninterrupted classes. Thank you.`;
      }
    }
  };

  const handleSendViaWhatsApp = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const fullPhone = cleanPhone.startsWith('880') ? cleanPhone : `880${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;
    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${fullPhone}?text=${encodedText}`;
    window.open(waUrl, '_blank');
    showToast(
      language === 'bn'
        ? 'হোয়াটসঅ্যাপ মেসেজ পাঠানো হচ্ছে...'
        : 'Launching WhatsApp fee reminder...'
    );
  };

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
    showToast(language === 'bn' ? 'মেসেজ কপি করা হয়েছে' : 'Reminder copied to clipboard');
  };

  const handleSendAll = () => {
    setFeeReminderModalOpen(false);
    showToast(
      language === 'bn'
        ? `${unpaidInvoices.length} জন অভিভাবকের কাছে বকেয়া রিমাইন্ডার শিডিউল করা হয়েছে!`
        : `Fee reminders queued for ${unpaidInvoices.length} parents!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#00272B]/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#00272B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0FF4F] text-[#00272B] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'ফি বকেয়া রিমাইন্ডার ইঞ্জিন' : 'Fee Reminder Engine'}
              </h3>
              <p className="text-xs text-[#E0FF4F]">
                {language === 'bn' ? 'লজ্জা ছাড়া ভদ্র ও পেশাদার হোয়াটসঅ্যাপ তাগাদা' : 'Polite, automated WhatsApp & SMS reminders'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setFeeReminderModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tone Selector */}
        <div className="p-4 bg-[#F6F8EE] border-b border-[#00272B]/10 space-y-2">
          <label className="block text-xs font-semibold text-[#00272B]">
            {language === 'bn' ? 'মেসেজের ধরণ ও শিষ্টাচার নির্বাচন করুন:' : 'Select Reminder Tone:'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'polite', labelBn: 'বিনম্র রিমাইন্ডার (ভদ্র)', labelEn: 'Polite (Standard)' },
              { id: 'due_today', labelBn: 'আজ শেষ দিন', labelEn: 'Due Today' },
              { id: 'overdue', labelBn: 'দেরি / মেয়াদোত্তীর্ণ', labelEn: 'Overdue Follow-up' }
            ].map((tp) => (
              <button
                key={tp.id}
                type="button"
                onClick={() => setSelectedTemplate(tp.id as any)}
                className={`py-2 px-2.5 text-xs font-bold rounded-xl border transition-all text-center ${
                  selectedTemplate === tp.id
                    ? 'bg-[#00272B] text-[#E0FF4F] border-[#00272B]'
                    : 'bg-white text-[#00272B]/80 border-[#00272B]/10 hover:border-[#00272B]/30'
                }`}
              >
                {language === 'bn' ? tp.labelBn : tp.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Unpaid Students List */}
        <div className="max-h-[350px] overflow-y-auto p-4 space-y-3">
          {unpaidInvoices.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#00272B]">
                {language === 'bn' ? 'সবাই ফি পরিশোধ করেছে! কোনো বকেয়া নেই।' : 'All fees are collected! Zero pending dues.'}
              </p>
            </div>
          ) : (
            unpaidInvoices.map((inv, idx) => {
              const student = students.find((s) => s.id === inv.studentId);
              if (!student) return null;
              const dueAmount = inv.amount - inv.paidAmount;
              const messageBody = getTemplateText(student.name, dueAmount, inv.dueDate);

              return (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-2xl bg-[#F6F8EE] border border-[#00272B]/10 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#00272B] text-[#E0FF4F] text-xs font-bold flex items-center justify-center shrink-0">
                        {student.avatarInitials}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#00272B]">
                          {language === 'bn' && student.nameBn ? student.nameBn : student.name}
                        </h4>
                        <p className="text-[11px] text-[#00272B]/60">
                          {student.parentName} · {student.parentPhone}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-700 block">
                        {formatCurrency(dueAmount, language)}
                      </span>
                      <span className="text-[10px] font-medium text-rose-600">
                        {inv.status === 'overdue'
                          ? `${inv.daysOverdue || 8} days late`
                          : `Due ${inv.dueDate.slice(5)}`}
                      </span>
                    </div>
                  </div>

                  {/* Message Preview Box */}
                  <div className="p-2.5 bg-white rounded-xl border border-[#00272B]/10 text-[11px] text-[#00272B]/80 font-mono leading-relaxed line-clamp-3">
                    {messageBody}
                  </div>

                  {/* Send & Copy Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopyText(messageBody, idx)}
                      className="px-2.5 py-1.5 text-[11px] font-semibold text-[#00272B]/80 hover:text-[#00272B] bg-white rounded-lg border border-[#00272B]/10 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedIndex === idx ? 'Copied!' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendViaWhatsApp(student.parentPhone, messageBody)}
                      className="px-3 py-1.5 text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ পাঠান' : 'Send WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#00272B]/10 flex items-center justify-between">
          <span className="text-xs text-[#00272B]/70">
            {unpaidInvoices.length} {language === 'bn' ? 'টি বকেয়া রিমাইন্ডার' : 'reminders pending'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFeeReminderModalOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-[#00272B]/70 bg-gray-100 hover:bg-gray-200"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleSendAll}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#00272B] bg-[#E0FF4F] hover:bg-[#d6f83b] shadow-md flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'bn' ? 'এক ক্লিকে সবাইকে পাঠান' : 'Send All via WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
