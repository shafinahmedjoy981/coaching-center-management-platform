import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import {
  Bell,
  CheckCheck,
  Eye,
  Megaphone,
  MessageCircle,
  Phone,
  Send,
  Users
} from 'lucide-react';

export const ParentsView: React.FC = () => {
  const { students, batches, broadcasts, language, sendBroadcast, showToast } = useApp();

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [broadcastType, setBroadcastType] = useState<'notice' | 'holiday' | 'exam'>('notice');

  const t = translations[language];

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    sendBroadcast({
      batchId: selectedBatchId === 'all' ? undefined : selectedBatchId,
      title: broadcastTitle,
      message: broadcastMessage,
      type: broadcastType
    });

    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  const handleQuickTemplate = (type: 'exam' | 'holiday' | 'rain') => {
    if (type === 'exam') {
      setBroadcastTitle('Upcoming Monthly Evaluation Test');
      setBroadcastMessage('Dear Parents, Our scheduled monthly evaluation test will take place this Saturday. Please ensure your child reviews lecture formulas and notes.');
      setBroadcastType('exam');
    } else if (type === 'holiday') {
      setBroadcastTitle('Upcoming Public Holiday Notice');
      setBroadcastMessage('All physical classes will remain suspended on the upcoming public holiday. Regular classes resume from next session.');
      setBroadcastType('holiday');
    } else {
      setBroadcastTitle('Weather & Rain Alert: Online Class Today');
      setBroadcastMessage('Due to heavy rainfall and waterlogging in Dhaka, today\'s physical class is shifted to Google Meet at the same time.');
      setBroadcastType('notice');
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header with Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#00272B] tracking-tight">
            {t.navParents}
          </h1>
          <p className="text-xs sm:text-sm text-[#00272B]/60 font-medium mt-0.5">
            {t.navParentsSub}
          </p>
        </div>
      </div>

      {/* Broadcast Message Composer (Solves batch messaging chaos) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#00272B]/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#00272B]/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00272B] text-[#E0FF4F] flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#00272B]">
                {language === 'bn' ? 'এক ক্লিকে সকল অভিভাবককে নোটিশ পাঠান' : 'Batch Parent Broadcast'}
              </h3>
              <p className="text-xs text-[#00272B]/60">
                {language === 'bn' ? 'পরীক্ষা, ছুটি বা আবহাওয়া সতর্কতা হোয়াটসঅ্যাপে পুশ করুন' : 'Push exam schedules or holiday notices instantly'}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickTemplate('exam')}
              className="px-2.5 py-1 text-[11px] font-bold bg-[#F6F8EE] text-[#00272B] hover:bg-[#E0FF4F] rounded-lg transition-colors"
            >
              {language === 'bn' ? 'পরীক্ষার নোটিশ' : 'Exam Notice'}
            </button>
            <button
              type="button"
              onClick={() => handleQuickTemplate('holiday')}
              className="px-2.5 py-1 text-[11px] font-bold bg-[#F6F8EE] text-[#00272B] hover:bg-[#E0FF4F] rounded-lg transition-colors"
            >
              {language === 'bn' ? 'ছুটির নোটিশ' : 'Holiday Notice'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSendBroadcast} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#00272B] mb-1">
                {language === 'bn' ? 'কাদের পাঠাবেন?' : 'Target Audience'}
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B] font-semibold"
              >
                <option value="all">
                  {language === 'bn' ? 'সকল ব্যাচের অভিভাবক' : 'All Batches (All Parents)'}
                </option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#00272B] mb-1">
                {language === 'bn' ? 'নোটিশের শিরোনাম' : 'Notice Title'}
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Monthly Physics Exam Notice"
                className="w-full h-10 px-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#00272B] mb-1">
              {language === 'bn' ? 'মেসেজ বিবরণ' : 'Message Text'}
            </label>
            <textarea
              rows={3}
              required
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Write your announcement..."
              className="w-full p-3 text-xs bg-[#F6F8EE] rounded-xl border border-[#00272B]/15 text-[#00272B]"
            />
          </div>

          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs text-[#00272B]/60">
              {students.length} {language === 'bn' ? 'জন অভিভাবক নোটিফিকেশন পাবেন' : 'recipients targeted'}
            </span>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#E0FF4F] hover:bg-[#d6f83b] text-[#00272B] font-bold text-xs flex items-center gap-1.5 border border-[#00272B] shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ব্রডকাস্ট পাঠান' : 'Send Broadcast'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History & Delivery Status */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-[#00272B]">
          {language === 'bn' ? 'সাম্প্রতিক পাঠানো নোটিশ ও ডেলিভারি স্ট্যাটাস' : 'Broadcast Delivery Ledger'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {broadcasts.map((bc) => (
            <div
              key={bc.id}
              className="p-4 sm:p-5 rounded-3xl bg-white border border-[#00272B]/10 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00272B] bg-[#F6F8EE] px-2 py-0.5 rounded">
                  {bc.type}
                </span>
                <span className="text-xs text-[#00272B]/60">{bc.sentAt}</span>
              </div>

              <h4 className="text-sm font-bold text-[#00272B]">{bc.title}</h4>
              <p className="text-xs text-[#00272B]/80 leading-relaxed">{bc.message}</p>

              {/* Delivery Stats Bar */}
              <div className="p-3 bg-[#F6F8EE] rounded-2xl flex items-center justify-between text-xs font-semibold text-[#00272B]">
                <div className="flex items-center gap-1.5">
                  <CheckCheck className="w-4 h-4 text-emerald-700" />
                  <span>
                    {bc.deliveredCount} / {bc.targetCount} Delivered
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#00272B]/70">
                  <Eye className="w-4 h-4 text-[#00272B]/60" />
                  <span>{bc.readCount} Read</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parent Directory Table / Cards */}
      <div className="pt-2 space-y-3">
        <h3 className="text-base font-extrabold text-[#00272B]">
          {language === 'bn' ? 'অভিভাবক ডিরেক্টরি' : 'Parent Directory'}
        </h3>

        <div className="bg-white rounded-3xl border border-[#00272B]/10 overflow-hidden shadow-xs divide-y divide-[#00272B]/10">
          {students.map((st) => (
            <div
              key={st.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F6F8EE]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00272B] text-[#E0FF4F] font-bold text-xs flex items-center justify-center shrink-0">
                  {st.avatarInitials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#00272B]">{st.parentName}</h4>
                  <p className="text-xs text-[#00272B]/60">
                    Child: {st.name} ({st.classLevel}) · {st.parentPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-13 sm:pl-0">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  WhatsApp Opted-in
                </span>
                <button
                  onClick={() => {
                    const clean = st.parentPhone.replace(/[^0-9]/g, '');
                    const full = clean.startsWith('880') ? clean : `880${clean.startsWith('0') ? clean.slice(1) : clean}`;
                    window.open(`https://wa.me/${full}`, '_blank');
                  }}
                  className="p-2 rounded-xl bg-white hover:bg-[#25D366] hover:text-white text-[#00272B]/70 border border-[#00272B]/15 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
