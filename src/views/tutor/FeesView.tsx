import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations, formatCurrency } from '../../translations';
import { FeeStatus } from '../../types';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Download,
  Filter,
  Receipt,
  Send,
  ShieldCheck,
  TrendingUp,
  Users
} from 'lucide-react';

export const FeesView: React.FC = () => {
  const {
    invoices,
    students,
    language,
    setRecordPaymentModal,
    setFeeReminderModalOpen,
    setReceiptModal,
    setSelectedStudentProfileId
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | FeeStatus>('all');
  const [agingFilter, setAgingFilter] = useState<'all' | '1-7' | '8-15' | '15+'>('all');

  const t = translations[language];

  // Financial aggregates
  const totalExpected = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalDue = totalExpected - totalCollected;
  const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  // Aging groups
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const aging1to7 = overdueInvoices.filter((i) => (i.daysOverdue || 0) <= 7);
  const aging8to15 = overdueInvoices.filter((i) => (i.daysOverdue || 0) > 7 && (i.daysOverdue || 0) <= 15);
  const aging15Plus = overdueInvoices.filter((i) => (i.daysOverdue || 0) > 15);

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (agingFilter === '1-7' && (inv.daysOverdue || 0) > 7) return false;
    if (agingFilter === '8-15' && ((inv.daysOverdue || 0) <= 7 || (inv.daysOverdue || 0) > 15)) return false;
    if (agingFilter === '15+' && (inv.daysOverdue || 0) <= 15) return false;
    return true;
  });

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header with Subtitle & Primary CTAs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#00272B] tracking-tight">
            {t.navFees}
          </h1>
          <p className="text-xs sm:text-sm text-[#00272B]/60 font-medium mt-0.5">
            {t.navFeesSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFeeReminderModalOpen(true)}
            className="h-11 px-4 rounded-2xl bg-[#00272B] text-[#E0FF4F] hover:bg-black font-extrabold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ তাগাদা' : 'Send Reminders'}</span>
          </button>

          <button
            onClick={() => setRecordPaymentModal({ open: true })}
            className="h-11 px-4 rounded-2xl bg-[#E0FF4F] hover:bg-[#d6f83b] text-[#00272B] font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-1.5 border-2 border-[#00272B] transition-all"
          >
            <CreditCard className="w-4 h-4 text-[#00272B]" />
            <span>{t.recordPayment}</span>
          </button>
        </div>
      </div>

      {/* Bento Summary & Aging Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Total Collected (Deep Teal Card) */}
        <div className="p-5 rounded-3xl bg-[#00272B] text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#E0FF4F] uppercase tracking-wider">
              {language === 'bn' ? 'মোট আদায়কৃত ফি' : 'Total Collected (Oct)'}
            </span>
            <span className="text-xs font-bold bg-white/10 text-[#E0FF4F] px-2 py-0.5 rounded-full">
              {collectionRate}% Collected
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tabular-nums text-white block">
              {formatCurrency(totalCollected, language)}
            </span>
            <div className="w-full bg-white/10 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#E0FF4F] h-full rounded-full transition-all duration-500"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
            <span className="text-[11px] text-white/60 mt-1.5 block">
              Expected total: {formatCurrency(totalExpected, language)}
            </span>
          </div>
        </div>

        {/* Current Outstanding Due */}
        <div className="p-5 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#00272B]/60 uppercase tracking-wider">
              {language === 'bn' ? 'বকেয়া ও অপরিশোধিত' : 'Pending Dues'}
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black tabular-nums text-rose-700 block">
              {formatCurrency(totalDue, language)}
            </span>
            <span className="text-xs text-[#00272B]/70 mt-1 font-medium block">
              {invoices.filter((i) => i.status !== 'paid').length} {language === 'bn' ? 'শিক্ষার্থীর ফি বাকি' : 'invoices unpaid'}
            </span>
          </div>
        </div>

        {/* Aging View Pills (1-7, 8-15, 15+ days) */}
        <div className="p-5 rounded-3xl bg-[#F6F8EE] border border-[#00272B]/10 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#00272B] uppercase tracking-wider block">
              {language === 'bn' ? 'বকেয়া মেয়াদ বিশ্লেষণ (Aging)' : 'Aging Analysis'}
            </span>
            <p className="text-[11px] text-[#00272B]/60 mt-0.5">
              {language === 'bn' ? 'দেরির দিন অনুযায়ী বকেয়া তালিকা' : 'Days late ledger'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              onClick={() => setAgingFilter(agingFilter === '1-7' ? 'all' : '1-7')}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                agingFilter === '1-7' ? 'bg-[#00272B] text-[#E0FF4F]' : 'bg-white text-[#00272B]'
              }`}
            >
              <span className="text-[10px] block opacity-70">1 - 7 Days</span>
              <span className="text-sm font-black">{aging1to7.length}</span>
            </button>
            <button
              onClick={() => setAgingFilter(agingFilter === '8-15' ? 'all' : '8-15')}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                agingFilter === '8-15' ? 'bg-[#00272B] text-[#E0FF4F]' : 'bg-white text-[#00272B]'
              }`}
            >
              <span className="text-[10px] block opacity-70">8 - 15 Days</span>
              <span className="text-sm font-black text-amber-600">{aging8to15.length}</span>
            </button>
            <button
              onClick={() => setAgingFilter(agingFilter === '15+' ? 'all' : '15+')}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                agingFilter === '15+' ? 'bg-[#00272B] text-[#E0FF4F]' : 'bg-white text-[#00272B]'
              }`}
            >
              <span className="text-[10px] block opacity-70">15+ Days</span>
              <span className="text-sm font-black text-rose-600">{aging15Plus.length}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-3 bg-white rounded-2xl border border-[#00272B]/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-[#F6F8EE] p-1 rounded-xl">
          {[
            { id: 'all', label: language === 'bn' ? 'সব ইনভয়েস' : 'All Invoices' },
            { id: 'paid', label: t.paid },
            { id: 'due', label: t.due },
            { id: 'overdue', label: t.overdue },
            { id: 'partial', label: t.partial }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                statusFilter === item.id
                  ? 'bg-[#00272B] text-[#E0FF4F] shadow-xs'
                  : 'text-[#00272B]/70 hover:text-[#00272B]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#00272B]/60 font-semibold px-2">
          {filteredInvoices.length} {language === 'bn' ? 'টি ইনভয়েস' : 'records found'}
        </span>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-3xl border border-[#00272B]/10 overflow-hidden shadow-xs divide-y divide-[#00272B]/10">
        {filteredInvoices.map((inv) => {
          const student = students.find((s) => s.id === inv.studentId);
          const payment = inv.payments[0];

          return (
            <div
              key={inv.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F6F8EE]/40 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00272B] text-[#E0FF4F] font-bold text-xs flex items-center justify-center shrink-0">
                  {student?.avatarInitials || 'ST'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      onClick={() => student && setSelectedStudentProfileId(student.id)}
                      className="text-sm font-extrabold text-[#00272B] hover:underline cursor-pointer"
                    >
                      {student?.name}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'overdue'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#00272B]/60 mt-0.5">
                    {student?.classLevel} · Guardian: {student?.parentPhone}
                  </p>
                </div>
              </div>

              {/* Amount, Method and Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pl-13 sm:pl-0">
                <div className="text-left sm:text-right">
                  <span className="text-sm font-black text-[#00272B] tabular-nums block">
                    {formatCurrency(inv.amount, language)}
                  </span>
                  <span className="text-[11px] text-[#00272B]/60">
                    {inv.status === 'paid'
                      ? `Paid via ${payment?.method || 'bKash'}`
                      : `Due: ${inv.dueDate}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {inv.status === 'paid' ? (
                    <button
                      onClick={() => setReceiptModal({ open: true, invoice: inv, payment })}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-[#00272B] text-xs font-bold border border-[#00272B]/15 flex items-center gap-1 shadow-2xs"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{t.viewReceipt}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setRecordPaymentModal({ open: true, studentId: inv.studentId, invoiceId: inv.id })}
                      className="px-3 py-1.5 rounded-xl bg-[#E0FF4F] hover:bg-[#d4f82a] text-[#00272B] text-xs font-bold border border-[#00272B] flex items-center gap-1 shadow-2xs"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{t.recordPayment}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
