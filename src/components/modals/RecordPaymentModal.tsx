import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency } from '../../translations';
import { PaymentMethod } from '../../types';
import { CheckCircle2, CreditCard, Receipt, X } from 'lucide-react';

export const RecordPaymentModal: React.FC = () => {
  const {
    recordPaymentModal,
    setRecordPaymentModal,
    students,
    invoices,
    recordPayment,
    language,
    setReceiptModal
  } = useApp();

  const [studentId, setStudentId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>('bKash');
  const [trxId, setTrxId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const t = translations[language];

  useEffect(() => {
    if (recordPaymentModal.open) {
      const defaultStudentId = recordPaymentModal.studentId || (students[0] ? students[0].id : '');
      setStudentId(defaultStudentId);

      const targetInv = invoices.find(
        (inv) => inv.studentId === defaultStudentId && (inv.status === 'due' || inv.status === 'overdue' || inv.status === 'partial')
      );
      if (targetInv) {
        setAmount(targetInv.amount - targetInv.paidAmount);
      } else {
        const student = students.find((s) => s.id === defaultStudentId);
        setAmount(student?.monthlyFee || 2000);
      }
      setTrxId('');
      setNotes('');
    }
  }, [recordPaymentModal, students, invoices]);

  const handleStudentChange = (newStudentId: string) => {
    setStudentId(newStudentId);
    const targetInv = invoices.find(
      (inv) => inv.studentId === newStudentId && inv.status !== 'paid'
    );
    if (targetInv) {
      setAmount(targetInv.amount - targetInv.paidAmount);
    } else {
      const student = students.find((s) => s.id === newStudentId);
      setAmount(student?.monthlyFee || 2000);
    }
  };

  if (!recordPaymentModal.open) return null;

  const currentInvoice = invoices.find((i) => i.studentId === studentId && i.status !== 'paid');
  const currentStudent = students.find((s) => s.id === studentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || amount <= 0) return;

    const invoiceIdToPay = currentInvoice?.id || `inv-${Date.now()}`;
    recordPayment(invoiceIdToPay, amount, method, trxId, notes);
    setRecordPaymentModal({ open: false });

    // Offer instant receipt preview
    const dummyPayment = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      method,
      trxId: trxId || undefined,
      verified: true,
      verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes
    };
    if (currentInvoice) {
      setReceiptModal({
        open: true,
        invoice: { ...currentInvoice, paidAmount: currentInvoice.paidAmount + amount },
        payment: dummyPayment
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#00272B]/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#00272B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E0FF4F] text-[#00272B] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'পেমেন্ট রেকর্ড করুন' : 'Record Fee Payment'}
              </h3>
              <p className="text-xs text-[#E0FF4F]">
                {language === 'bn' ? 'বিকাশ, নগদ বা ক্যাশ পেমেন্ট যুক্ত করুন' : 'Record manual mobile banking or cash'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setRecordPaymentModal({ open: false })}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Student selection */}
          <div>
            <label className="block text-xs font-semibold text-[#00272B] mb-1">
              {language === 'bn' ? 'শিক্ষার্থী নির্বাচন করুন' : 'Select Student'}
            </label>
            <select
              value={studentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              className="w-full h-11 px-3.5 text-sm bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-medium focus:outline-none focus:border-[#00272B]"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.classLevel}) - {s.parentPhone}
                </option>
              ))}
            </select>
          </div>

          {/* Due Info Pill */}
          {currentInvoice && (
            <div className="p-3 bg-[#F6F8EE] rounded-xl flex items-center justify-between text-xs">
              <span className="text-[#00272B]/70 font-medium">
                {language === 'bn' ? 'বর্তমান বকেয়া (অক্টোবর ২০২৬):' : 'Current Due (Oct 2026):'}
              </span>
              <span className="font-bold text-rose-700 text-sm">
                {formatCurrency(currentInvoice.amount - currentInvoice.paidAmount, language)}
              </span>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-[#00272B] mb-1">
              {language === 'bn' ? 'পরিশোধের পরিমাণ (৳)' : 'Payment Amount (৳)'}
            </label>
            <input
              type="number"
              min="1"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="w-full h-11 px-3.5 text-base font-bold tabular-nums bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] focus:outline-none focus:border-[#00272B]"
            />
          </div>

          {/* Payment Method Pills */}
          <div>
            <label className="block text-xs font-semibold text-[#00272B] mb-1.5">
              {language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['bKash', 'Nagad', 'Rocket', 'Cash', 'Bank'] as PaymentMethod[]).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    method === m
                      ? 'bg-[#00272B] text-[#E0FF4F] border-[#00272B] shadow-sm'
                      : 'bg-[#F6F8EE] text-[#00272B]/80 border-[#00272B]/10 hover:border-[#00272B]/30'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* TrxID (for mobile banking) */}
          {method !== 'Cash' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#00272B]">
                  {language === 'bn' ? 'ট্রানজ্যাকশন আইডি (TrxID)' : 'Transaction ID (TrxID)'}
                </label>
                <span className="text-[10px] text-[#00272B]/60">
                  {language === 'bn' ? 'ঐচ্ছিক' : 'Optional'}
                </span>
              </div>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                placeholder="e.g. 9K8J7H6G5F"
                className="w-full h-10 px-3 text-xs uppercase tracking-wider font-mono bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] focus:outline-none focus:border-[#00272B]"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#00272B] mb-1">
              {language === 'bn' ? 'নোট / মন্তব্য' : 'Notes (Optional)'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: অগ্রিম বা ছাড়ের বিবরণ...' : 'e.g., partial payment, sibling discount...'}
              className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] focus:outline-none focus:border-[#00272B]"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRecordPaymentModal({ open: false })}
              className="flex-1 h-12 rounded-xl text-xs font-semibold text-[#00272B]/70 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-2 h-12 rounded-xl text-xs font-bold text-[#00272B] bg-[#E0FF4F] hover:bg-[#d6f83b] shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'bn' ? 'সংরক্ষণ ও রশিদ দেখুন' : 'Save & View Receipt'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
