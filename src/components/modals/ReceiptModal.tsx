import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency } from '../../translations';
import { CheckCircle2, Download, Printer, Share2, ShieldCheck, X } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { receiptModal, setReceiptModal, students, settings, language, showToast } = useApp();
  const t = translations[language];

  if (!receiptModal.open || !receiptModal.invoice) return null;

  const invoice = receiptModal.invoice;
  const payment = receiptModal.payment || invoice.payments[0];
  const student = students.find((s) => s.id === invoice.studentId);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `Tuition Fee Receipt - ${settings.coachingName}\nStudent: ${student?.name}\nAmount: ৳${payment?.amount || invoice.paidAmount}\nMethod: ${payment?.method || 'bKash'} (TrxID: ${payment?.trxId || 'Verified'})\nStatus: Verified by Tutor`;
    navigator.clipboard.writeText(text);
    showToast(language === 'bn' ? 'রশিদ ক্লিপবোর্ডে কপি করা হয়েছে' : 'Receipt text copied to share');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#00272B]/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="bg-[#00272B] text-white p-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E0FF4F]">
            {language === 'bn' ? 'পেমেন্ট মানি রিসিট' : 'Money Receipt Preview'}
          </span>
          <button
            onClick={() => setReceiptModal({ open: false })}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Card */}
        <div className="p-6 bg-white space-y-4 text-[#00272B]">
          {/* Header */}
          <div className="text-center border-b border-[#00272B]/10 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#00272B] text-[#E0FF4F] font-black text-sm flex items-center justify-center mx-auto mb-1.5 shadow-sm">
              TL
            </div>
            <h3 className="text-base font-extrabold text-[#00272B]">
              {settings.coachingName}
            </h3>
            <p className="text-[11px] text-[#00272B]/70">{settings.address}</p>
            <p className="text-[10px] text-[#00272B]/60 mt-0.5">Phone: {settings.phone}</p>
          </div>

          {/* Receipt Info */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-dashed border-[#00272B]/15">
            <div>
              <span className="text-[10px] text-[#00272B]/60 block">Receipt No:</span>
              <span className="font-mono font-bold">REC-2026-{invoice.id.slice(-4)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#00272B]/60 block">Date & Time:</span>
              <span className="font-mono font-medium">
                {payment?.date || invoice.issueDate} {payment?.verifiedAt ? `· ${payment.verifiedAt}` : ''}
              </span>
            </div>
          </div>

          {/* Student Profile Row */}
          <div className="bg-[#F6F8EE] p-3 rounded-2xl space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#00272B]/70">Student Name:</span>
              <span className="font-bold text-[#00272B]">{student?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#00272B]/70">Class & Institution:</span>
              <span className="font-medium text-[#00272B]">{student?.classLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#00272B]/70">Guardian Phone:</span>
              <span className="font-mono text-[#00272B]">{student?.parentPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#00272B]/70">Billing Month:</span>
              <span className="font-semibold text-[#00272B]">{invoice.month}</span>
            </div>
          </div>

          {/* Paid Amount Bento Box */}
          <div className="p-4 rounded-2xl bg-[#00272B] text-white flex items-center justify-between">
            <div>
              <span className="text-[11px] text-white/60 block">Total Received Amount</span>
              <span className="text-2xl font-extrabold text-[#E0FF4F] tracking-tight tabular-nums">
                {formatCurrency(payment?.amount || invoice.paidAmount, language)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#E0FF4F] bg-white/10 px-2 py-0.5 rounded-full font-semibold">
                {payment?.method || 'bKash'}
              </span>
              {payment?.trxId && (
                <p className="text-[10px] font-mono text-white/70 mt-1">
                  Trx: {payment.trxId}
                </p>
              )}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 py-2 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? 'শিক্ষক কর্তৃক নিশ্চিতকৃত ও পরিশোধিত' : 'Verified by Tutor · Official E-Receipt'}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#F6F8EE] border-t border-[#00272B]/10 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 h-10 rounded-xl text-xs font-semibold text-[#00272B] bg-white border border-[#00272B]/15 hover:bg-gray-50 flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'শেয়ার' : 'Share'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 h-10 rounded-xl text-xs font-bold text-[#00272B] bg-[#E0FF4F] hover:bg-[#d6f83b] shadow-xs flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'প্রিন্ট / ডাউনলোড' : 'Print / Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
