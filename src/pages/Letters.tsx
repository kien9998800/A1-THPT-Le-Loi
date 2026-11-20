import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Send, Heart, Mail, PenLine, ArrowUpDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { collection, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  classId?: string;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function Letters() {
  const { classId } = useParams<{ classId: string }>();
  const currentClass = classId || '10A1';
  const isOcean = currentClass === '11A1';

  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp || new Date().toISOString(),
        })) as Message[];

        const filteredMsgs = msgs.filter((m) => !m.classId || m.classId === currentClass);
        setMessages(filteredMsgs);
        setIsLoading(false);
      },
      (err) => {
        console.error('Failed to load messages:', err);
        setLoadError('Không thể tải hòm thư lúc này. Vui lòng thử lại sau.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentClass]);

  const sortedMessages = useMemo(() => {
    if (sortOrder === 'newest') return messages;
    return [...messages].reverse();
  }, [messages, sortOrder]);

  const handleResetSuccess = () => {
    setSuccess(false);
    setSender('');
    setContent('');
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !content.trim() || isSending) return;

    setIsSending(true);
    setSubmitError(null);
    try {
      await addDoc(collection(db, 'messages'), {
        sender: sender.trim(),
        content: content.trim(),
        classId: currentClass,
        timestamp: new Date().toISOString(),
      });

      setIsSending(false);
      setSuccess(true);
    } catch (err) {
      console.error('Failed to send letter:', err);
      setSubmitError('Gửi thư chưa thành công. Vui lòng thử lại nhé!');
      setIsSending(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`flex-1 min-h-[calc(100vh-4rem)] relative overflow-hidden ${
          isOcean
            ? 'bg-gradient-to-br from-sky-50 via-[#f4fbff] to-cyan-50/70'
            : 'bg-gradient-to-br from-rose-50 via-[#fdf8f2] to-pink-50/70'
        }`}
      >
        {/* Subtle dot texture */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: isOcean
              ? 'radial-gradient(circle at center, rgba(14, 165, 233, 0.22) 1px, transparent 1px)'
              : 'radial-gradient(circle at center, rgba(225, 135, 155, 0.25) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Page Header */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10 sm:mb-14"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border mb-4 ${
                isOcean ? 'border-sky-100 text-sky-500' : 'border-pink-100 text-pink-500'
              }`}
            >
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-800 tracking-tight text-balance">
              {isOcean ? 'Thư Thả Đại Dương' : 'Gửi Lời Nhắn Thanh Xuân'}
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto mt-2.5 leading-relaxed">
              Viết lại những kỷ niệm khó quên và lời chúc tốt đẹp nhất dành tặng tập thể{' '}
              <span className={`font-bold ${isOcean ? 'text-sky-600' : 'text-pink-600'}`}>
                {currentClass}
              </span>
              .
            </p>
          </motion.header>

          {/* Main 2-Column Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Letter Composer */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 lg:sticky lg:top-24"
            >
              <div
                className={`rounded-2xl p-6 sm:p-8 relative overflow-hidden border ${
                  isOcean
                    ? 'bg-[#fcfeff] shadow-[0_20px_50px_-15px_rgba(14,116,144,0.18)] border-sky-100/90'
                    : 'bg-[#fffdf9] shadow-[0_20px_50px_-15px_rgba(190,115,130,0.18)] border-pink-100/90'
                }`}
              >
                {/* Top decorative ribbon */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isOcean
                      ? 'bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-300'
                      : 'bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200'
                  }`}
                />

                {/* Header + Postage Stamp */}
                <div className="flex items-start justify-between gap-4 mb-6 pt-1">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2.5">
                      <PenLine
                        className={`w-5 h-5 shrink-0 ${isOcean ? 'text-sky-500' : 'text-pink-500'}`}
                      />
                      Viết thư tay
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      Những dòng chữ sẽ được lưu lại mãi
                    </p>
                  </div>

                  {/* Clean Postage Stamp */}
                  <div
                    aria-hidden="true"
                    className={`shrink-0 border-2 border-dashed rounded-lg px-2.5 py-1.5 text-center rotate-3 select-none ${
                      isOcean
                        ? 'border-sky-300/80 bg-sky-50/60'
                        : 'border-rose-300/80 bg-rose-50/50'
                    }`}
                  >
                    <span
                      className={`block font-display text-sm font-bold leading-none ${
                        isOcean ? 'text-sky-600' : 'text-rose-500'
                      }`}
                    >
                      {currentClass}
                    </span>
                    <span
                      className={`block text-[10px] font-semibold mt-1 tracking-wider ${
                        isOcean ? 'text-cyan-500' : 'text-rose-400'
                      }`}
                    >
                      {isOcean ? '2026 · 2027' : '2025 · 2026'}
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="letter-sent"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="py-12 px-4 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 20, delay: 0.08 }}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                          isOcean ? 'bg-sky-100 text-sky-500' : 'bg-rose-100 text-pink-500'
                        }`}
                      >
                        <CheckCircle2 className="w-9 h-9" />
                      </motion.div>
                      <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">
                        Thư đã được gửi đi!
                      </h3>
                      <p className="text-slate-500 text-sm sm:text-base max-w-xs mx-auto leading-relaxed mb-7">
                        Cảm ơn bạn đã gửi gắm những dòng tâm tư thật đẹp đến tập thể {currentClass}.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetSuccess}
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
                          isOcean
                            ? 'bg-sky-50 hover:bg-sky-100 text-sky-600'
                            : 'bg-pink-50 hover:bg-pink-100 text-pink-600'
                        }`}
                      >
                        <PenLine className="w-4 h-4" />
                        Viết thêm lời nhắn khác
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="letter-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">
                          Người nhận
                        </label>
                        <div
                          className={`w-full border rounded-xl px-4 py-2.5 text-slate-700 font-serif italic flex items-center justify-between ${
                            isOcean
                              ? 'bg-sky-50/70 border-sky-100'
                              : 'bg-rose-50/60 border-pink-100'
                          }`}
                        >
                          <span>Tập thể lớp {currentClass}</span>
                          <Heart
                            className={`w-4 h-4 shrink-0 ${
                              isOcean ? 'text-sky-400 fill-sky-400' : 'text-pink-400 fill-pink-400'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="letter-sender"
                          className="block text-xs font-bold text-slate-500 mb-1.5"
                        >
                          Người gửi
                        </label>
                        <input
                          id="letter-sender"
                          type="text"
                          value={sender}
                          onChange={(e) => setSender(e.target.value)}
                          placeholder="Tên hoặc biệt danh của bạn..."
                          maxLength={60}
                          required
                          disabled={isSending}
                          className={`w-full bg-white border rounded-xl px-4 py-2.5 text-slate-800 font-medium outline-none transition-all placeholder:text-slate-300 disabled:opacity-60 ${
                            isOcean
                              ? 'border-sky-100 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                              : 'border-pink-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-100'
                          }`}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="letter-content"
                            className="block text-xs font-bold text-slate-500"
                          >
                            Lời nhắn
                          </label>
                          <span className="text-[11px] text-slate-400 tabular-nums">
                            {content.length}/1000
                          </span>
                        </div>
                        <textarea
                          id="letter-content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Viết vài dòng kỷ niệm, tâm sự hoặc lời chúc nhé..."
                          maxLength={1000}
                          required
                          disabled={isSending}
                          rows={5}
                          className={`w-full focus:bg-white border rounded-xl px-4 py-3 text-slate-800 font-serif text-base leading-relaxed outline-none resize-y min-h-[140px] transition-all placeholder:text-slate-300 disabled:opacity-60 ${
                            isOcean
                              ? 'bg-[#f5fbff] border-sky-100 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                              : 'bg-[#fffaf5] border-pink-100 focus:border-pink-400 focus:ring-2 focus:ring-pink-100'
                          }`}
                        />
                      </div>

                      {submitError && (
                        <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <motion.button
                        type="submit"
                        whileHover={!isSending ? { scale: 1.01 } : undefined}
                        whileTap={!isSending ? { scale: 0.98 } : undefined}
                        disabled={isSending || !sender.trim() || !content.trim()}
                        className={`w-full flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                          isOcean
                            ? 'bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 shadow-sky-200/70'
                            : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-200/70'
                        }`}
                      >
                        {isSending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            <span>Đang gửi thư...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Gửi lời nhắn ngay</span>
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* Right Column: Mailbox / Saved Letters */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              {/* Unboxed Editorial Section Header */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b ${
                  isOcean ? 'border-sky-200/70' : 'border-pink-200/60'
                }`}
              >
                <div>
                  <h2 className="text-2xl font-display font-bold text-slate-800">
                    Hòm thư lưu niệm
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 tabular-nums">
                    {isLoading
                      ? 'Đang mở hòm thư...'
                      : `${messages.length} lá thư · Tập thể ${currentClass}`}
                  </p>
                </div>

                {messages.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border text-xs sm:text-sm font-bold text-slate-600 transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0 ${
                      isOcean
                        ? 'hover:bg-sky-50 border-sky-100 hover:text-sky-600'
                        : 'hover:bg-pink-50 border-pink-100 hover:text-pink-600'
                    }`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    {sortOrder === 'newest' ? 'Mới nhất' : 'Cũ nhất'}
                  </button>
                )}
              </div>

              {/* Loading / Error / Empty / List */}
              {isLoading ? (
                <div className="space-y-4">
                  {[0, 1, 2].map((skeleton) => (
                    <div
                      key={skeleton}
                      className={`rounded-2xl p-6 border shadow-sm animate-pulse ${
                        isOcean ? 'bg-[#fcfeff] border-sky-100/70' : 'bg-[#fffdf9] border-pink-100/70'
                      }`}
                    >
                      <div className={`h-3 w-32 rounded mb-4 ${isOcean ? 'bg-sky-100' : 'bg-pink-100'}`} />
                      <div className="space-y-2.5">
                        <div className="h-4 bg-slate-100 rounded w-full" />
                        <div className="h-4 bg-slate-100 rounded w-5/6" />
                      </div>
                      <div className={`h-3 w-28 rounded mt-5 ${isOcean ? 'bg-sky-50' : 'bg-pink-50'}`} />
                    </div>
                  ))}
                </div>
              ) : loadError ? (
                <div className="bg-[#fffdf9] rounded-2xl p-8 border border-rose-200 text-center shadow-sm">
                  <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-3" />
                  <p className="text-slate-700 font-medium">{loadError}</p>
                </div>
              ) : sortedMessages.length === 0 ? (
                <div
                  className={`rounded-2xl p-10 border border-dashed text-center shadow-sm ${
                    isOcean ? 'bg-[#fcfeff] border-sky-200' : 'bg-[#fffdf9] border-pink-200'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                      isOcean ? 'bg-sky-50 text-sky-500' : 'bg-rose-50 text-pink-400'
                    }`}
                  >
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-700 mb-1.5">
                    Chưa có lá thư nào
                  </h3>
                  <p className="text-slate-500 text-sm sm:text-base font-serif">
                    Hãy là người đầu tiên viết đôi dòng kỷ niệm cho tập thể {currentClass} nhé!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {sortedMessages.map((msg, i) => {
                      const dateLabel = formatDate(msg.timestamp);
                      return (
                        <motion.article
                          key={msg.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.35,
                            delay: Math.min(i * 0.04, 0.3),
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={`group rounded-2xl p-6 sm:p-7 border transition-colors ${
                            isOcean
                              ? 'bg-[#fcfeff] shadow-[0_10px_30px_-14px_rgba(14,116,144,0.16)] border-sky-100/80 hover:border-sky-200'
                              : 'bg-[#fffdf9] shadow-[0_10px_30px_-14px_rgba(150,100,110,0.16)] border-pink-100/80 hover:border-pink-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-3.5 text-xs text-slate-400">
                            <span>
                              Gửi {msg.classId || currentClass}
                              {dateLabel ? ` · ${dateLabel}` : ''}
                            </span>
                            <Heart
                              className={`w-4 h-4 transition-colors shrink-0 ${
                                isOcean
                                  ? 'text-sky-200 fill-sky-200 group-hover:text-sky-500 group-hover:fill-sky-500'
                                  : 'text-rose-200 fill-rose-200 group-hover:text-pink-400 group-hover:fill-pink-400'
                              }`}
                            />
                          </div>

                          <p className="font-serif text-slate-700 text-base sm:text-[1.0625rem] leading-[1.75] whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>

                          <div
                            className={`border-t pt-3.5 mt-5 flex items-center justify-between ${
                              isOcean ? 'border-sky-100/70' : 'border-pink-100/70'
                            }`}
                          >
                            <span
                              className={`font-serif italic font-semibold text-sm sm:text-base ${
                                isOcean ? 'text-sky-700' : 'text-pink-700'
                              }`}
                            >
                              — {msg.sender}
                            </span>
                          </div>
                        </motion.article>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.section>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

