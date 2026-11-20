import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  MailOpen,
  Inbox,
  AlertCircle,
  List,
} from 'lucide-react';

export interface LetterMessage {
  id: string;
  sender: string;
  recipient?: string;
  content: string;
  timestamp: string;
  classId?: string;
}

interface SouvenirMailboxProps {
  messages: LetterMessage[];
  currentClass: string;
  isOcean: boolean;
  isLoading: boolean;
  loadError: string | null;
}

type MailboxStage = 'closed' | 'envelope' | 'flipping' | 'opening' | 'reading';

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function SouvenirMailbox({
  messages,
  currentClass,
  isOcean,
  isLoading,
  loadError,
}: SouvenirMailboxProps) {
  const [stage, setStage] = useState<MailboxStage>('closed');
  const [activeIndex, setActiveIndex] = useState(0);
  const [emptyShakeKey, setEmptyShakeKey] = useState(0);
  const [showAllDrawer, setShowAllDrawer] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Keep activeIndex valid when messages change
  useEffect(() => {
    if (messages.length === 0) {
      clearTimers();
      setStage('closed');
      setActiveIndex(0);
    } else if (activeIndex >= messages.length) {
      setActiveIndex(0);
    }
  }, [messages.length, activeIndex]);

  const currentMessage = messages[activeIndex] ?? null;
  const displayRecipient =
    currentMessage?.recipient?.trim() || `Tập thể lớp ${currentMessage?.classId || currentClass}`;
  const displayDate = currentMessage ? formatDate(currentMessage.timestamp) : '';

  const handleMailboxClick = () => {
    if (isLoading || loadError) return;
    if (messages.length === 0) {
      setEmptyShakeKey((k) => k + 1);
      return;
    }
    clearTimers();
    setShowAllDrawer(false);
    setStage('envelope');
  };

  const handleEnvelopeClick = () => {
    if (stage !== 'envelope') return;
    clearTimers();
    setStage('flipping');

    const openTimer = window.setTimeout(() => {
      setStage('opening');
    }, 540);

    const readTimer = window.setTimeout(() => {
      setStage('reading');
    }, 1150);

    timersRef.current.push(openTimer, readTimer);
  };

  const handleCloseToMailbox = () => {
    clearTimers();
    setStage('closed');
  };

  const handleFoldBackToEnvelope = () => {
    clearTimers();
    setStage('envelope');
  };

  const handleSwitchLetter = (nextIndex: number) => {
    if (messages.length === 0) return;
    clearTimers();
    const wrapped = (nextIndex + messages.length) % messages.length;
    setActiveIndex(wrapped);
    setShowAllDrawer(false);
    setStage('envelope');
  };

  const isBackSide = stage === 'flipping' || stage === 'opening';
  const isFlapOpen = stage === 'opening';

  return (
    <div className="relative flex flex-col items-center">
      {/* Header strip on the desk */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl sm:text-[1.7rem] font-display font-bold text-[#3f2614] drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
            Hòm thư lưu niệm
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#6b4423] mt-0.5 tabular-nums">
            {isLoading
              ? 'Đang kiểm tra hòm thư...'
              : `${messages.length} lá thư · Tập thể ${currentClass}`}
          </p>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAllDrawer((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#fffaf0]/90 hover:bg-white text-[#4f3119] border border-[#b88b5a]/45 text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <List className="w-4 h-4" />
            {showAllDrawer ? 'Ẩn danh sách' : 'Chọn nhanh thư'}
          </button>
        )}
      </div>

      {/* Quick Picker Drawer if toggled */}
      <AnimatePresence>
        {showAllDrawer && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="w-full overflow-hidden"
          >
            <div className="bg-[#fffaf2]/95 border border-[#c59b6d]/50 rounded-2xl p-3.5 shadow-md max-h-56 overflow-y-auto space-y-1.5">
              {messages.map((m, idx) => {
                const isActive = idx === activeIndex && stage !== 'closed';
                const mRecipient = m.recipient?.trim() || `Tập thể lớp ${m.classId || currentClass}`;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSwitchLetter(idx)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isActive
                        ? isOcean
                          ? 'bg-sky-50 border border-sky-200 text-sky-900'
                          : 'bg-rose-50 border border-rose-200 text-rose-900'
                        : 'hover:bg-[#f6ead7]/70 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate">
                        Từ: {m.sender} <span className="font-normal text-slate-400">→</span>{' '}
                        <span className="font-medium">{mRecipient}</span>
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{m.content}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 tabular-nums shrink-0">
                      {formatDate(m.timestamp)}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interactive Desk Stage */}
      <div className="w-full min-h-[430px] sm:min-h-[470px] flex flex-col items-center justify-center relative">
        {isLoading ? (
          <div className="w-full max-w-md bg-[#fffaf2]/85 border border-[#c59b6d]/40 rounded-2xl p-8 text-center shadow-lg animate-pulse">
            <div className="w-20 h-20 rounded-2xl bg-[#ebd8be] mx-auto mb-4" />
            <div className="h-4 w-44 bg-[#ebd8be] rounded mx-auto mb-2" />
            <div className="h-3 w-32 bg-[#f3e6d4] rounded mx-auto" />
          </div>
        ) : loadError ? (
          <div className="w-full max-w-md bg-[#fffaf2] border border-rose-200 rounded-2xl p-8 text-center shadow-lg">
            <AlertCircle className="w-9 h-9 text-rose-500 mx-auto mb-3" />
            <p className="text-slate-700 font-medium">{loadError}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* STAGE 1: ILLUSTRATED MAILBOX STANDING ON DESK */}
            {stage === 'closed' && (
              <motion.div
                key={`mailbox-${emptyShakeKey}`}
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={
                  emptyShakeKey > 0
                    ? { opacity: 1, scale: 1, x: [0, -7, 7, -5, 5, 0], y: 0 }
                    : { opacity: 1, scale: 1, y: 0 }
                }
                exit={{ opacity: 0, scale: 0.92, y: -12, transition: { duration: 0.22 } }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center w-full"
              >
                <motion.button
                  type="button"
                  onClick={handleMailboxClick}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Mở hòm thư lưu niệm"
                  className="group relative cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70 rounded-3xl p-4"
                >
                  {/* Soft shadow cast on the wooden desk */}
                  <div
                    aria-hidden="true"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 w-56 h-8 rounded-full bg-[#3a200d]/35 blur-md pointer-events-none"
                  />

                  {/* Detailed Illustrated Mailbox SVG */}
                  <svg
                    viewBox="0 0 320 300"
                    className="w-64 h-60 sm:w-72 sm:h-68 drop-shadow-[0_16px_26px_rgba(64,34,12,0.32)] overflow-visible"
                  >
                    {/* Wooden pedestal / desk stand */}
                    <rect x="140" y="218" width="40" height="54" rx="4" fill="#6b3e1e" />
                    <rect x="146" y="218" width="12" height="54" fill="#824e28" opacity="0.7" />
                    <rect x="108" y="264" width="104" height="16" rx="6" fill="#593115" />
                    <rect x="114" y="266" width="92" height="5" rx="2.5" fill="#7c4924" opacity="0.65" />

                    {/* Side envelope flag (raised if letters exist) */}
                    <g
                      transform={
                        messages.length > 0
                          ? 'translate(222, 118) rotate(0)'
                          : 'translate(222, 146) rotate(78)'
                      }
                      className="transition-transform duration-300"
                    >
                      <rect x="0" y="-42" width="6" height="48" rx="3" fill="#e2e8f0" />
                      <path
                        d="M 6 -42 L 36 -33 L 6 -20 Z"
                        fill={isOcean ? '#f59e0b' : '#f43f5e'}
                      />
                      <circle cx="3" cy="6" r="6" fill="#94a3b8" />
                    </g>

                    {/* Back / Side body of arched mailbox */}
                    <path
                      d="M 105 72 L 210 72 C 242 72 256 96 256 128 L 256 218 L 105 218 Z"
                      fill={isOcean ? '#0284c7' : '#be123c'}
                    />
                    {/* Roof highlight */}
                    <path
                      d="M 108 79 L 208 79 C 232 79 245 94 248 112 L 108 112 Z"
                      fill={isOcean ? '#38bdf8' : '#fb7185'}
                      opacity="0.35"
                    />

                    {/* Cream letters peeking inside if available */}
                    {messages.length > 0 && (
                      <g className="group-hover:-translate-y-1.5 transition-transform duration-300">
                        <rect
                          x="84"
                          y="128"
                          width="54"
                          height="34"
                          rx="4"
                          transform="rotate(-11 84 128)"
                          fill="#fffdf5"
                          stroke="#e2d5c1"
                          strokeWidth="1.5"
                        />
                        <rect
                          x="96"
                          y="134"
                          width="54"
                          height="34"
                          rx="4"
                          transform="rotate(-3 96 134)"
                          fill="#fffaf0"
                          stroke="#e2d5c1"
                          strokeWidth="1.5"
                        />
                      </g>
                    )}

                    {/* Front Arched Face of Mailbox */}
                    <path
                      d="M 66 128 C 66 94 86 72 112 72 C 138 72 158 94 158 128 L 158 218 L 66 218 Z"
                      fill={isOcean ? '#0ea5e9' : '#e11d48'}
                      stroke={isOcean ? '#bae6fd' : '#fecdd3'}
                      strokeWidth="2.5"
                    />

                    {/* Letter Slot Opening */}
                    <rect x="78" y="108" width="68" height="14" rx="7" fill="#1e293b" />
                    <rect x="82" y="110" width="60" height="4" rx="2" fill="#475569" opacity="0.6" />

                    {/* Brass / Cream Class Nameplate */}
                    <rect
                      x="80"
                      y="142"
                      width="64"
                      height="30"
                      rx="6"
                      fill="#fffbeb"
                      stroke="#fcd34d"
                      strokeWidth="2"
                    />
                    <text
                      x="112"
                      y="162"
                      textAnchor="middle"
                      fill="#78350f"
                      fontSize="14"
                      fontWeight="800"
                      fontFamily="Baloo 2, sans-serif"
                    >
                      {currentClass}
                    </text>

                    {/* Side decorative stripe & brass rivet */}
                    <path
                      d="M 170 144 L 240 144"
                      stroke={isOcean ? '#bae6fd' : '#fecdd3'}
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.65"
                    />
                    <path
                      d="M 170 156 L 226 156"
                      stroke={isOcean ? '#bae6fd' : '#fecdd3'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.45"
                    />
                    <circle cx="112" cy="194" r="6" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" />
                  </svg>

                  {/* Interactive callout below mailbox */}
                  <div className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fffaf0] border border-[#b98b5b]/45 shadow-md text-[#4a2b13] font-bold text-sm group-hover:bg-white transition-colors">
                    {messages.length > 0 ? (
                      <>
                        <MailOpen className={`w-4 h-4 ${isOcean ? 'text-sky-600' : 'text-rose-500'}`} />
                        <span>Nhấn vào hòm thư để lấy thư ra</span>
                      </>
                    ) : (
                      <>
                        <Inbox className="w-4 h-4 text-amber-700" />
                        <span>Hòm thư đang trống</span>
                      </>
                    )}
                  </div>
                </motion.button>

                {messages.length === 0 && (
                  <p className="text-sm text-[#5f3b1e] font-serif mt-2 max-w-xs">
                    Hãy viết lời nhắn đầu tiên ở khung bức thư bên cạnh để bỏ vào hòm nhé!
                  </p>
                )}
              </motion.div>
            )}

            {/* STAGE 2 & 3: ENVELOPE FLIES OUT -> FLIPS -> OPENS FLAP */}
            {(stage === 'envelope' || stage === 'flipping' || stage === 'opening') &&
              currentMessage && (
                <motion.div
                  key={`env-${currentMessage.id}`}
                  initial={{ opacity: 0, scale: 0.28, y: 70, x: -40, rotate: -16 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 20, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 210, damping: 20 }}
                  className="w-full flex flex-col items-center"
                >
                  {/* 3D Flippable Envelope Container */}
                  <motion.div
                    onClick={handleEnvelopeClick}
                    whileHover={stage === 'envelope' ? { y: -6, scale: 1.015 } : undefined}
                    whileTap={stage === 'envelope' ? { scale: 0.985 } : undefined}
                    animate={{ rotateY: isBackSide ? 180 : 0 }}
                    transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      transformStyle: 'preserve-3d',
                      transformPerspective: 1200,
                    }}
                    className={`relative w-[19.5rem] h-[13.5rem] sm:w-[26rem] sm:h-[17.5rem] select-none ${
                      stage === 'envelope' ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {/* FRONT SIDE OF FLYING ENVELOPE (Sender & Recipient) */}
                    <div
                      style={{ backfaceVisibility: 'hidden' }}
                      className={`absolute inset-0 rounded-2xl bg-[#fffcf4] border-2 shadow-[0_24px_50px_-12px_rgba(62,33,12,0.45)] p-5 sm:p-7 flex flex-col justify-between overflow-hidden ${
                        isOcean ? 'border-sky-200' : 'border-rose-200'
                      }`}
                    >
                      {/* Airmail Striped Edge Trim */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-2 opacity-85"
                        style={{
                          backgroundImage: isOcean
                            ? 'repeating-linear-gradient(135deg, #0ea5e9 0 12px, transparent 12px 20px, #38bdf8 20px 32px, transparent 32px 40px)'
                            : 'repeating-linear-gradient(135deg, #f43f5e 0 12px, transparent 12px 20px, #fb7185 20px 32px, transparent 32px 40px)',
                        }}
                      />

                      {/* Top row: Class postmark & Stamp */}
                      <div className="flex items-start justify-between gap-3 pt-1">
                        <div className="text-left">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Bưu phẩm thanh xuân
                          </span>
                          {displayDate && (
                            <span className="text-xs font-medium text-slate-500 tabular-nums">
                              {displayDate}
                            </span>
                          )}
                        </div>

                        {/* Postage Stamp */}
                        <div
                          className={`border-2 border-dashed rounded-lg px-2.5 py-1.5 text-center rotate-3 shrink-0 ${
                            isOcean
                              ? 'border-sky-300 bg-sky-50 text-sky-700'
                              : 'border-rose-300 bg-rose-50 text-rose-700'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 mx-auto mb-0.5 ${
                              isOcean ? 'fill-sky-500 text-sky-500' : 'fill-rose-500 text-rose-500'
                            }`}
                          />
                          <span className="block font-display text-xs font-bold leading-none">
                            {currentClass}
                          </span>
                        </div>
                      </div>

                      {/* Center Address Block: Người nhận & Người gửi */}
                      <div className="my-auto space-y-2.5 text-left pl-1 sm:pl-2">
                        <div className="border-b border-dashed border-slate-200 pb-2">
                          <span className="text-[11px] font-bold text-slate-400 block">
                            Người nhận
                          </span>
                          <p className="font-serif text-base sm:text-lg font-bold text-slate-800 truncate">
                            {displayRecipient}
                          </p>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-400 block">
                            Người gửi
                          </span>
                          <p
                            className={`font-serif italic text-base sm:text-lg font-bold truncate ${
                              isOcean ? 'text-sky-700' : 'text-rose-700'
                            }`}
                          >
                            {currentMessage.sender}
                          </p>
                        </div>
                      </div>

                      {/* Bottom prompt */}
                      <div className="flex items-center justify-end">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                            isOcean ? 'text-sky-600' : 'text-rose-600'
                          }`}
                        >
                          <MailOpen className="w-3.5 h-3.5" />
                          Nhấn vào bì thư để mở
                        </span>
                      </div>
                    </div>

                    {/* BACK SIDE OF ENVELOPE (Shown after 180deg Y-flip, then opens!) */}
                    <div
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                      className="absolute inset-0 rounded-2xl"
                    >
                      {/* Back Inner Base */}
                      <div className="absolute inset-0 bg-[#efe3cf] rounded-2xl border border-[#dcc9ad] shadow-[0_24px_50px_-12px_rgba(62,33,12,0.45)] z-0" />

                      {/* Inner Letter Sliding Up */}
                      <motion.div
                        initial={{ y: 14, scale: 0.94, opacity: 0.3 }}
                        animate={
                          isFlapOpen
                            ? { y: -115, scale: 1.02, opacity: 1 }
                            : { y: 14, scale: 0.94, opacity: 0.3 }
                        }
                        transition={{ delay: isFlapOpen ? 0.14 : 0, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute inset-x-4 top-3 bottom-4 bg-[#fffdf7] rounded-xl border shadow-lg p-5 flex flex-col items-start justify-start z-10 pointer-events-none overflow-hidden ${
                          isOcean ? 'border-sky-100' : 'border-rose-100'
                        }`}
                      >
                        <div
                          className={`w-full h-1 rounded-full mb-3 ${
                            isOcean ? 'bg-sky-300' : 'bg-rose-300'
                          }`}
                        />
                        <p className="text-xs font-semibold text-slate-400 mb-1">
                          Gửi {displayRecipient}
                        </p>
                        <p className="font-serif text-sm text-slate-700 line-clamp-4 leading-relaxed">
                          {currentMessage.content}
                        </p>
                      </motion.div>

                      {/* Envelope Front-of-Back Pocket Triangles */}
                      <div className="absolute inset-0 z-20 rounded-2xl overflow-hidden pointer-events-none">
                        <svg viewBox="0 0 400 280" preserveAspectRatio="none" className="w-full h-full block">
                          <polygon points="0,0 200,152 0,280" fill="#f7efe2" />
                          <polygon points="400,0 200,152 400,280" fill="#f3e8d6" />
                          <polygon points="0,280 200,130 400,280" fill="#fdfaf3" />
                          <polyline
                            points="0,280 200,130 400,280"
                            fill="none"
                            stroke="#e4d4bc"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>

                      {/* Animated Top Triangular Flap */}
                      <motion.div
                        initial={{ rotateX: 0, zIndex: 30 }}
                        animate={{
                          rotateX: isFlapOpen ? -175 : 0,
                          zIndex: isFlapOpen ? 5 : 30,
                        }}
                        transition={{
                          rotateX: { duration: 0.44, ease: [0.22, 1, 0.36, 1] },
                          zIndex: { delay: isFlapOpen ? 0.14 : 0, duration: 0 },
                        }}
                        style={{
                          transformPerspective: 1000,
                          transformOrigin: 'top center',
                        }}
                        className="absolute top-0 left-0 right-0 h-[56%] pointer-events-none"
                      >
                        <svg
                          viewBox="0 0 400 160"
                          preserveAspectRatio="none"
                          className="w-full h-full block drop-shadow-[0_6px_10px_rgba(92,55,24,0.16)]"
                        >
                          <path
                            d="M 16,0 L 384,0 Q 400,0 400,16 L 400,18 L 200,156 L 0,18 L 0,16 Q 0,0 16,0 Z"
                            fill="#fbf6ec"
                            stroke="#e4d4bc"
                            strokeWidth="2"
                          />
                        </svg>
                      </motion.div>

                      {/* Wax Heart Seal on Flap */}
                      <motion.div
                        animate={
                          isFlapOpen ? { scale: [1, 1.25, 0], opacity: 0 } : { scale: 1, opacity: 1 }
                        }
                        transition={{ duration: 0.24 }}
                        className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
                      >
                        <div
                          className={`w-12 h-12 rounded-full ring-4 ring-[#fffdf7] shadow-lg flex items-center justify-center ${
                            isOcean
                              ? 'bg-gradient-to-br from-sky-400 to-cyan-600'
                              : 'bg-gradient-to-br from-rose-400 to-pink-600'
                          }`}
                        >
                          <Heart className="w-5 h-5 text-white fill-white" />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Envelope Navigation Bar */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                    {messages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleSwitchLetter(activeIndex - 1)}
                        disabled={stage !== 'envelope'}
                        aria-label="Thư trước"
                        className="p-2.5 rounded-xl bg-[#fffaf0] hover:bg-white text-[#4f3119] border border-[#b88b5b]/45 shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}

                    <span className="px-3 py-1.5 text-xs sm:text-sm font-bold text-[#4f3119] tabular-nums">
                      Thư {activeIndex + 1} / {messages.length}
                    </span>

                    {messages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleSwitchLetter(activeIndex + 1)}
                        disabled={stage !== 'envelope'}
                        aria-label="Thư tiếp theo"
                        className="p-2.5 rounded-xl bg-[#fffaf0] hover:bg-white text-[#4f3119] border border-[#b88b5b]/45 shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleCloseToMailbox}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5c361a]/90 hover:bg-[#4b2b13] text-amber-50 text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Cất vào hòm
                    </button>
                  </div>
                </motion.div>
              )}

            {/* STAGE 4: OPENED LETTER FOR FULL READING */}
            {stage === 'reading' && currentMessage && (
              <motion.div
                key={`read-${currentMessage.id}`}
                initial={{ opacity: 0, y: 24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg"
              >
                {/* Resting open envelope flap behind bottom of opened letter */}
                <div className="relative pt-2 pb-4 px-2 sm:px-3">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-28 rounded-2xl bg-[#efe3cf] border border-[#d6c2a5] shadow-[0_18px_38px_-12px_rgba(62,33,12,0.45)]"
                  />

                  {/* Unfolded Framed Letter Paper */}
                  <article
                    className={`relative z-10 rounded-xl bg-[#fffdf7] p-6 sm:p-8 border shadow-[0_16px_40px_-14px_rgba(64,34,12,0.28)] ${
                      isOcean ? 'border-sky-200/90' : 'border-rose-200/90'
                    }`}
                  >
                    {/* Inner Ornamental Letter Frame */}
                    <div
                      className={`border rounded-lg p-5 sm:p-6 ${
                        isOcean ? 'border-sky-200/70' : 'border-rose-200/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 pb-3.5 mb-4 border-b border-dashed border-slate-200">
                        <div>
                          <span className="text-xs font-semibold text-slate-400 block">
                            Người nhận
                          </span>
                          <h3 className="font-serif text-lg font-bold text-slate-800">
                            {displayRecipient}
                          </h3>
                        </div>
                        <div className="text-right shrink-0">
                          {displayDate && (
                            <span className="text-xs text-slate-400 tabular-nums block">
                              {displayDate}
                            </span>
                          )}
                          <Heart
                            className={`w-4 h-4 ml-auto mt-1 ${
                              isOcean ? 'text-sky-400 fill-sky-400' : 'text-rose-400 fill-rose-400'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="max-h-64 overflow-y-auto pr-1">
                        <p className="font-serif text-slate-700 text-base sm:text-[1.0625rem] leading-[1.8] whitespace-pre-wrap break-words">
                          {currentMessage.content}
                        </p>
                      </div>

                      <div className="pt-4 mt-5 border-t border-dashed border-slate-200 flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-400">
                          Kỷ niệm {currentMessage.classId || currentClass}
                        </span>
                        <span
                          className={`font-serif italic font-bold text-base ${
                            isOcean ? 'text-sky-700' : 'text-rose-700'
                          }`}
                        >
                          — {currentMessage.sender}
                        </span>
                      </div>
                    </div>
                  </article>
                </div>

                {/* Controls below opened letter */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                  {messages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleSwitchLetter(activeIndex - 1)}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#fffaf0] hover:bg-white text-[#4f3119] border border-[#b88b5b]/45 text-xs sm:text-sm font-bold shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Thư trước
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleFoldBackToEnvelope}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fffaf0] hover:bg-white text-[#4f3119] border border-[#b88b5b]/45 text-xs sm:text-sm font-bold shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Gấp lại bì thư
                  </button>

                  {messages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleSwitchLetter(activeIndex + 1)}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#fffaf0] hover:bg-white text-[#4f3119] border border-[#b88b5b]/45 text-xs sm:text-sm font-bold shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Thư sau
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCloseToMailbox}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5c361a]/90 hover:bg-[#4b2b13] text-amber-50 text-xs sm:text-sm font-bold shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Đóng hòm thư
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
