import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Send, Heart, PenLine, CheckCircle2, AlertCircle } from 'lucide-react';
import { collection, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';
import SouvenirMailbox, { type LetterMessage } from '../components/SouvenirMailbox';

export default function Letters() {
  const { classId } = useParams<{ classId: string }>();
  const currentClass = classId || '10A1';
  const isOcean = currentClass === '11A1';

  const defaultRecipient = `Tập thể lớp ${currentClass}`;
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [messages, setMessages] = useState<LetterMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setRecipient(`Tập thể lớp ${currentClass}`);
  }, [currentClass]);

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
        })) as LetterMessage[];

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

  const handleResetSuccess = () => {
    setSuccess(false);
    setRecipient(`Tập thể lớp ${currentClass}`);
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
        recipient: recipient.trim() || `Tập thể lớp ${currentClass}`,
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
      {/* Wooden Study Desk Background */}
      <div
        className="flex-1 min-h-[calc(100vh-4rem)] relative overflow-hidden bg-[#cfa87b]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 25%, rgba(255, 245, 224, 0.45) 0%, rgba(168, 118, 66, 0.25) 55%, rgba(92, 56, 26, 0.42) 100%),
            repeating-linear-gradient(
              90deg,
              rgba(110, 68, 30, 0.055) 0px,
              rgba(110, 68, 30, 0.055) 2px,
              transparent 2px,
              transparent 140px
            ),
            repeating-linear-gradient(
              180deg,
              rgba(130, 82, 38, 0.045) 0px,
              rgba(130, 82, 38, 0.045) 3px,
              rgba(255, 236, 208, 0.04) 3px,
              rgba(255, 236, 208, 0.04) 9px,
              transparent 9px,
              transparent 22px
            )
          `,
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12">
          {/* Desk Page Heading */}
          <motion.header
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-9 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#3b2210] tracking-tight text-balance drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
              {isOcean ? 'Bàn Thư Thả Đại Dương' : 'Góc Bàn Viết Thư Thanh Xuân'}
            </h1>
            <p className="text-[#5d391c] text-base sm:text-lg max-w-xl mx-auto mt-2 leading-relaxed font-medium">
              Viết lại những dòng tâm sự trên trang giấy nhỏ rồi bỏ vào hòm thư của{' '}
              <span className="font-bold text-[#3b2210] underline decoration-amber-700/40 underline-offset-4">
                {currentClass}
              </span>
              .
            </p>
          </motion.header>

          {/* 2-Column Desk Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT COLUMN: Framed Letter Sheet Resting on an Envelope */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative pb-10 sm:pb-12 px-1 sm:px-3"
            >
              {/* ENVELOPE UNDERNEATH THE LETTER (Bì thư bên dưới) */}
              <div
                aria-hidden="true"
                className="absolute inset-x-2 sm:inset-x-4 top-10 bottom-0 -rotate-2 rounded-2xl bg-[#efe1ca] border-2 border-[#d5bfa0] shadow-[0_24px_45px_-12px_rgba(62,33,12,0.48)] overflow-hidden pointer-events-none"
              >
                {/* Airmail stripe along bottom edge of underlying envelope */}
                <div
                  className="absolute inset-x-0 bottom-0 h-2.5 opacity-80"
                  style={{
                    backgroundImage: isOcean
                      ? 'repeating-linear-gradient(135deg, #0ea5e9 0 12px, transparent 12px 20px, #38bdf8 20px 32px, transparent 32px 40px)'
                      : 'repeating-linear-gradient(135deg, #f43f5e 0 12px, transparent 12px 20px, #fb7185 20px 32px, transparent 32px 40px)',
                  }}
                />
                {/* Envelope diagonal pocket fold lines peeking out at bottom */}
                <svg
                  viewBox="0 0 400 120"
                  preserveAspectRatio="none"
                  className="absolute bottom-0 inset-x-0 w-full h-24 opacity-60"
                >
                  <polygon points="0,120 200,24 400,120" fill="#f7ecdb" />
                  <polyline
                    points="0,120 200,24 400,120"
                    fill="none"
                    stroke="#d2bc9b"
                    strokeWidth="2"
                  />
                </svg>

                {/* Wax seal peeking out near bottom-center of envelope */}
                <div
                  className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full ring-2 ring-[#fffaf0] shadow-md flex items-center justify-center ${
                    isOcean
                      ? 'bg-gradient-to-br from-sky-400 to-cyan-600'
                      : 'bg-gradient-to-br from-rose-400 to-pink-600'
                  }`}
                >
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
              </div>

              {/* LETTER PAPER WITH FRAME ON TOP OF THE ENVELOPE (Khung của bức thư) */}
              <div className="relative z-10 rounded-xl bg-[#fffdf7] p-3 sm:p-4 shadow-[0_18px_38px_-10px_rgba(62,33,12,0.34)] border border-[#e6d6bd]">
                {/* Outer & Inner Ornamental Letter Frame */}
                <div
                  className={`relative rounded-lg border-2 p-5 sm:p-7 ${
                    isOcean ? 'border-sky-200/85' : 'border-rose-200/85'
                  }`}
                >
                  {/* Subtle inner hairline frame */}
                  <div
                    aria-hidden="true"
                    className={`absolute inset-1.5 rounded-md border pointer-events-none ${
                      isOcean ? 'border-sky-100' : 'border-rose-100'
                    }`}
                  />

                  {/* Corner flourishes */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 pointer-events-none ${
                      isOcean ? 'border-sky-400/70' : 'border-rose-400/70'
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 pointer-events-none ${
                      isOcean ? 'border-sky-400/70' : 'border-rose-400/70'
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 pointer-events-none ${
                      isOcean ? 'border-sky-400/70' : 'border-rose-400/70'
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 pointer-events-none ${
                      isOcean ? 'border-sky-400/70' : 'border-rose-400/70'
                    }`}
                  />

                  {/* Letter Sheet Header + Stamp */}
                  <div className="relative z-10 flex items-start justify-between gap-4 mb-5 pb-4 border-b border-dashed border-[#e4d5be]">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
                        <PenLine
                          className={`w-5 h-5 shrink-0 ${
                            isOcean ? 'text-sky-600' : 'text-rose-500'
                          }`}
                        />
                        Viết thư tay
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Đặt trên bì thư · Gửi vào hòm lưu niệm
                      </p>
                    </div>

                    {/* Postage Stamp */}
                    <div
                      aria-hidden="true"
                      className={`shrink-0 border-2 border-dashed rounded-lg px-2.5 py-1.5 text-center rotate-3 select-none ${
                        isOcean
                          ? 'border-sky-300 bg-sky-50/70'
                          : 'border-rose-300 bg-rose-50/60'
                      }`}
                    >
                      <span
                        className={`block font-display text-sm font-bold leading-none ${
                          isOcean ? 'text-sky-600' : 'text-rose-600'
                        }`}
                      >
                        {currentClass}
                      </span>
                      <span
                        className={`block text-[10px] font-semibold mt-1 tracking-wider ${
                          isOcean ? 'text-cyan-600' : 'text-rose-400'
                        }`}
                      >
                        {isOcean ? '2026 · 2027' : '2025 · 2026'}
                      </span>
                    </div>
                  </div>

                  {/* Letter Form / Sent Confirmation */}
                  <div className="relative z-10">
                    <AnimatePresence mode="wait">
                      {success ? (
                        <motion.div
                          key="letter-sent"
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="py-10 px-3 text-center"
                        >
                          <motion.div
                            initial={{ scale: 0, rotate: -18 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 360, damping: 20, delay: 0.06 }}
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                              isOcean ? 'bg-sky-100 text-sky-600' : 'bg-rose-100 text-rose-500'
                            }`}
                          >
                            <CheckCircle2 className="w-9 h-9" />
                          </motion.div>
                          <h3 className="text-2xl font-display font-bold text-slate-800 mb-2">
                            Đã bỏ thư vào hòm!
                          </h3>
                          <p className="text-slate-500 text-sm sm:text-base max-w-xs mx-auto leading-relaxed mb-7">
                            Lá thư của bạn đã nằm gọn trong hòm thư lưu niệm. Nhấn vào hòm thư bên
                            cạnh để xem lại nhé!
                          </p>
                          <button
                            type="button"
                            onClick={handleResetSuccess}
                            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer whitespace-nowrap ${
                              isOcean
                                ? 'bg-sky-50 hover:bg-sky-100 text-sky-700'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                            }`}
                          >
                            <PenLine className="w-4 h-4" />
                            Viết thêm lá thư khác
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
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="letter-recipient"
                                className="block text-xs font-bold text-slate-500 mb-1.5"
                              >
                                Người nhận
                              </label>
                              <input
                                id="letter-recipient"
                                type="text"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder={`Tập thể lớp ${currentClass}`}
                                maxLength={60}
                                disabled={isSending}
                                className={`w-full bg-[#fffaf0] border rounded-lg px-3.5 py-2.5 text-slate-800 font-serif font-medium outline-none transition-all placeholder:text-slate-300 disabled:opacity-60 ${
                                  isOcean
                                    ? 'border-sky-100 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                                    : 'border-rose-100 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
                                }`}
                              />
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
                                className={`w-full bg-[#fffaf0] border rounded-lg px-3.5 py-2.5 text-slate-800 font-serif font-medium outline-none transition-all placeholder:text-slate-300 disabled:opacity-60 ${
                                  isOcean
                                    ? 'border-sky-100 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                                    : 'border-rose-100 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
                                }`}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label
                                htmlFor="letter-content"
                                className="block text-xs font-bold text-slate-500"
                              >
                                Nội dung bức thư
                              </label>
                              <span className="text-[11px] text-slate-400 tabular-nums">
                                {content.length}/1000
                              </span>
                            </div>
                            <textarea
                              id="letter-content"
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              placeholder="Viết vài dòng kỷ niệm, tâm sự hoặc lời chúc chân thành nhất nhé..."
                              maxLength={1000}
                              required
                              disabled={isSending}
                              rows={6}
                              className={`w-full border rounded-lg px-4 py-3 text-slate-800 font-serif text-base leading-[2rem] outline-none resize-y min-h-[175px] transition-all placeholder:text-slate-300 disabled:opacity-60 ${
                                isOcean
                                  ? 'border-sky-100 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
                                  : 'border-rose-100 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
                              }`}
                              style={{
                                backgroundColor: '#fffdf8',
                                backgroundImage: isOcean
                                  ? 'repeating-linear-gradient(transparent, transparent 31px, rgba(14, 165, 233, 0.12) 31px, rgba(14, 165, 233, 0.12) 32px)'
                                  : 'repeating-linear-gradient(transparent, transparent 31px, rgba(244, 63, 94, 0.12) 31px, rgba(244, 63, 94, 0.12) 32px)',
                                backgroundAttachment: 'local',
                              }}
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
                            whileTap={!isSending ? { scale: 0.985 } : undefined}
                            disabled={isSending || !sender.trim() || !content.trim()}
                            className={`w-full flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap ${
                              isOcean
                                ? 'bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 shadow-sky-900/15'
                                : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-900/15'
                            }`}
                          >
                            {isSending ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                <span>Đang bỏ vào hòm thư...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span>Gấp thư & gửi vào hòm</span>
                              </>
                            )}
                          </motion.button>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* RIGHT COLUMN: Interactive Souvenir Mailbox -> Flying Envelope -> Flip & Open */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <SouvenirMailbox
                messages={messages}
                currentClass={currentClass}
                isOcean={isOcean}
                isLoading={isLoading}
                loadError={loadError}
              />
            </motion.section>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
