import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { Heart, ArrowLeft, TrainFront, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TransitionTheme } from './TransitionCurtain';

const CLASSES = [
  {
    id: '10A1',
    year: '2025 – 2026',
    comingSoon: false,
  },
  {
    id: '11A1',
    year: '2026 – 2027',
    comingSoon: false,
  },
  {
    id: '12A1',
    year: 'Sắp tới',
    comingSoon: true,
  },
] as const;

interface IntroCardProps {
  onStartTransition?: (targetClass: TransitionTheme) => void;
}

export default function IntroCard({ onStartTransition }: IntroCardProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'ready' | 'opening'>('select');
  const [isEnvelopeHovered, setIsEnvelopeHovered] = useState(false);
  const [show12A1Notice, setShow12A1Notice] = useState(false);
  const [shake12A1Key, setShake12A1Key] = useState(0);
  const navigate = useNavigate();
  const timersRef = useRef<number[]>([]);
  const noticeTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearTimers();
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const handleClassSelect = (className: string, comingSoon: boolean) => {
    if (comingSoon) {
      setShow12A1Notice(true);
      setShake12A1Key((k) => k + 1);
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(noticeTimerRef.current);
      }
      noticeTimerRef.current = window.setTimeout(() => {
        setShow12A1Notice(false);
      }, 4500);
      return;
    }

    if (step !== 'select' || selectedClass !== null) return;
    setShow12A1Notice(false);
    setSelectedClass(className);
    const timer = window.setTimeout(() => {
      setStep('ready');
    }, 550);
    timersRef.current.push(timer);
  };

  const handleBackToSelect = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (step !== 'ready') return;
    clearTimers();
    setSelectedClass(null);
    setIsEnvelopeHovered(false);
    setStep('select');
  };

  const handleOpen = () => {
    if (step !== 'ready') return;
    setStep('opening');
    const target: TransitionTheme = selectedClass === '11A1' ? '11A1' : '10A1';

    const timer = window.setTimeout(() => {
      if (onStartTransition) {
        onStartTransition(target);
      } else {
        navigate(`/${target}`);
      }
    }, 520);
    timersRef.current.push(timer);
  };

  const isOpening = step === 'opening';
  const isOcean = selectedClass === '11A1';

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed inset-0 bg-[#e6dccb] flex items-center justify-center z-50 overflow-hidden font-body selection:bg-pink-300 selection:text-pink-900 p-4">
        {/* Warm wooden desk texture */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #8B5A2B 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(255,250,242,0.45) 0%, rgba(168,136,96,0.22) 100%)',
          }}
        />

        {/* 12A1 "Bọn mình đang trên đường nhé!!" Notification */}
        <AnimatePresence>
          {show12A1Notice && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: -24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
              className="fixed top-5 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-2rem)] max-w-md"
            >
              <div className="bg-[#fffdf9] border border-amber-200 shadow-[0_18px_45px_-12px_rgba(120,85,55,0.28)] rounded-2xl px-4 py-3.5 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <TrainFront className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-slate-800 text-base leading-tight">
                    Bọn mình đang trên đường nhé!!
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Chuyến tàu lớp 12A1 (2027 – 2028) sẽ sớm cập bến.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShow12A1Notice(false)}
                  aria-label="Đóng thông báo"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 'select' ? (
            <motion.div
              key="chalkboard-select"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.97,
                transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-20 p-2 sm:p-3.5 md:p-4 bg-gradient-to-b from-[#9c663b] via-[#7f4f2a] to-[#633a1b] flex flex-col"
            >
              {/* Full-Screen Green Chalkboard Surface */}
              <div className="relative flex-1 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#214234] via-[#1b382c] to-[#152d23] px-3 pt-5 pb-3 sm:px-8 sm:pt-7 sm:pb-4 overflow-hidden border border-black/30 shadow-[inset_0_0_60px_rgba(0,0,0,0.38)] flex flex-col justify-between">
                {/* Powdery Chalk Dust Texture */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-45"
                  style={{
                    background:
                      'radial-gradient(circle at 20% 28%, rgba(255,255,255,0.11), transparent 38%), radial-gradient(circle at 78% 72%, rgba(255,255,255,0.09), transparent 42%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05), transparent 62%)',
                  }}
                />

                {/* Board Header in White Chalk */}
                <div className="relative z-10 text-center shrink-0 pt-1 sm:pt-2">
                  <h2
                    className="text-3xl sm:text-5xl md:text-[3.25rem] text-white/95 tracking-wide leading-tight"
                    style={{
                      fontFamily: 'var(--font-chalk)',
                      textShadow: '0 0 14px rgba(255,255,255,0.22)',
                    }}
                  >
                    Hành trang thanh xuân
                  </h2>
                  <p
                    className="text-sm sm:text-lg md:text-xl text-emerald-100/80 mt-1"
                    style={{ fontFamily: 'var(--font-chalk)' }}
                  >
                    Chuyến tàu tuổi trẻ, bạn muốn về năm nào?
                  </p>
                  <svg
                    viewBox="0 0 260 14"
                    className="w-44 sm:w-64 h-3 mx-auto mt-1.5 opacity-75"
                    fill="none"
                  >
                    <path
                      d="M 8 7 Q 130 2 252 8"
                      stroke="#ffffff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeDasharray="210 8"
                    />
                  </svg>
                </div>

                {/* Centered Proportional Canvas Filling Remaining Screen */}
                <div className="relative z-10 flex-1 flex items-center justify-center w-full min-h-0 py-2">
                  <div className="relative w-full aspect-[5/3] max-w-[min(94vw,calc((100vh-11.5rem)*5/3))]">
                    {/* Chalk SVG Canvas (locked 1000x600 coordinate system) */}
                    <svg
                      viewBox="0 0 1000 600"
                      preserveAspectRatio="xMidYMid meet"
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                      {/* Winding S-curve chalk trail: 10A1 (180,250) -> 11A1 (500,445) -> 12A1 (820,250) */}
                      <motion.path
                        d="M 55 295 Q 110 252 180 250 C 295 248, 340 445, 500 445 C 660 445, 705 252, 820 250 Q 890 248, 945 202"
                        fill="none"
                        stroke="rgba(255,255,255,0.68)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                      />

                      {/* Arrowhead at end of trail */}
                      <motion.path
                        d="M 929 198 L 948 200 L 941 218"
                        fill="none"
                        stroke="rgba(255,255,255,0.78)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.3 }}
                      />

                      {/* START DOODLE (above 10A1): Chalk Cherry Blossom & Twig */}
                      <g transform="translate(115, 68)">
                        <motion.g
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 0.94, scale: 1 }}
                          transition={{ delay: 0.25, duration: 0.45 }}
                        >
                          <path
                            d="M 8 82 Q 44 65 102 52"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M 76 58 Q 95 40 112 50 Q 94 66 76 58 Z"
                            stroke="rgba(167,243,208,0.85)"
                            strokeWidth="2.4"
                            fill="rgba(167,243,208,0.08)"
                          />
                          <g transform="translate(46, 38) scale(1.45)">
                            <path
                              d="M0,-12 C4,-12 6,-5 0,-2 C6,-5 12,-2 10,3 C8,7 2,4 0,0 C4,4 7,11 2,13 C-3,14 -3,6 0,0 C-3,6 -9,8 -11,3 C-13,-2 -5,-5 0,-2 C-5,-5 -4,-12 0,-12 Z"
                              stroke="#fbcfe8"
                              strokeWidth="2"
                              strokeLinejoin="round"
                              fill="rgba(251,207,232,0.14)"
                            />
                            <circle cx="0" cy="0" r="2.3" fill="#fde68a" />
                          </g>
                          <g transform="translate(88, 28) scale(0.9)">
                            <path
                              d="M0,-10 C3,-10 5,-4 0,-1 C5,-4 10,-1 8,3 C6,6 2,3 0,0 C3,3 6,9 1,11 C-3,11 -2,5 0,0 C-2,5 -7,6 -9,2 C-10,-2 -4,-4 0,-1 C-4,-4 -3,-10 0,-10 Z"
                              stroke="#fbcfe8"
                              strokeWidth="2"
                              fill="rgba(251,207,232,0.1)"
                            />
                          </g>
                        </motion.g>
                      </g>

                      {/* MIDDLE DOODLE (above 11A1): Chalk Ocean Waves & Paper Boat */}
                      <g transform="translate(422, 232)">
                        <motion.g
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 0.94, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.45 }}
                        >
                          <path
                            d="M 42 52 L 104 52 L 90 68 L 56 68 Z"
                            stroke="#ffffff"
                            strokeWidth="3"
                            strokeLinejoin="round"
                            fill="rgba(255,255,255,0.1)"
                          />
                          <path
                            d="M 52 52 L 73 18 L 94 52"
                            stroke="#ffffff"
                            strokeWidth="3"
                            strokeLinejoin="round"
                            fill="none"
                          />
                          <path
                            d="M 6 78 Q 26 64 46 78 T 86 78 T 126 78 T 150 78"
                            stroke="#bae6fd"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <path
                            d="M 24 94 Q 44 82 64 94 T 104 94 T 136 94"
                            stroke="rgba(186,230,253,0.7)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                          />
                        </motion.g>
                      </g>

                      {/* END DOODLE (above 12A1): Chalk Graduation Cap & Stars */}
                      <g transform="translate(752, 64)">
                        <motion.g
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 0.94, scale: 1 }}
                          transition={{ delay: 0.55, duration: 0.45 }}
                        >
                          <polygon
                            points="58,14 106,36 58,58 10,36"
                            stroke="#fef08a"
                            strokeWidth="3.2"
                            strokeLinejoin="round"
                            fill="rgba(254,240,138,0.12)"
                          />
                          <path
                            d="M 30 47 L 30 68 Q 58 80 86 68 L 86 47"
                            stroke="#ffffff"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                          <path
                            d="M 96 41 L 96 72"
                            stroke="#fef08a"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                          />
                          <circle cx="96" cy="76" r="3.5" fill="#fef08a" />
                          <path
                            d="M 118 18 L 122 26 L 130 28 L 123 33 L 125 41 L 118 36 L 111 41 L 113 33 L 106 28 L 114 26 Z"
                            stroke="#fde68a"
                            strokeWidth="2.2"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </motion.g>
                      </g>

                      {/* Subtle corner chalk doodles */}
                      <path
                        d="M 62 490 L 66 500 L 76 502 L 68 509 L 70 519 L 62 513 L 54 519 L 56 509 L 48 502 L 58 500 Z"
                        stroke="rgba(255,255,255,0.38)"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="915"
                        cy="486"
                        r="5"
                        stroke="rgba(255,255,255,0.35)"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle
                        cx="326"
                        cy="82"
                        r="3.5"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1.8"
                        fill="none"
                      />
                    </svg>

                    {/* Interactive Chalk Class Nodes locked to exact curve positions */}
                    {CLASSES.map((item, index) => {
                      const isSelected = selectedClass === item.id;
                      const isDimmed = selectedClass !== null && !isSelected;
                      const is12A1 = item.id === '12A1';
                      const nodePos =
                        item.id === '10A1'
                          ? 'left-[18%] top-[41.7%]'
                          : item.id === '11A1'
                            ? 'left-[50%] top-[74.2%]'
                            : 'left-[82%] top-[41.7%]';

                      return (
                        <motion.button
                          key={is12A1 ? `${item.id}-${shake12A1Key}` : item.id}
                          type="button"
                          initial={
                            is12A1 && shake12A1Key > 0
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, scale: 0.85 }
                          }
                          animate={
                            is12A1 && shake12A1Key > 0
                              ? { opacity: 1, x: [0, -7, 7, -5, 5, 0], scale: 1 }
                              : {
                                  opacity: isDimmed ? 0.4 : 1,
                                  scale: isSelected ? 1.1 : 1,
                                }
                          }
                          transition={
                            is12A1 && shake12A1Key > 0
                              ? { duration: 0.36, ease: 'easeInOut' }
                              : {
                                  opacity: {
                                    duration: 0.3,
                                    delay: selectedClass ? 0 : 0.2 + index * 0.14,
                                  },
                                  scale: { type: 'spring', stiffness: 320, damping: 20 },
                                }
                          }
                          whileHover={selectedClass === null ? { scale: 1.09 } : undefined}
                          whileTap={selectedClass === null ? { scale: 0.95 } : undefined}
                          onClick={() => handleClassSelect(item.id, item.comingSoon)}
                          disabled={selectedClass !== null}
                          className={`group absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2 sm:px-7 sm:py-3 rounded-full bg-[#1a372b]/95 text-center cursor-pointer disabled:cursor-default focus:outline-none ${nodePos}`}
                        >
                          {/* Chalk oval ring drawn on hover / selection */}
                          <svg
                            viewBox="0 0 140 80"
                            className="absolute -inset-1.5 w-[calc(100%+0.75rem)] h-[calc(100%+0.75rem)] pointer-events-none overflow-visible"
                          >
                            <motion.ellipse
                              cx="70"
                              cy="40"
                              rx="63"
                              ry="33"
                              fill="none"
                              stroke={
                                isSelected
                                  ? item.id === '11A1'
                                    ? '#7dd3fc'
                                    : '#fbcfe8'
                                  : 'rgba(255,255,255,0.55)'
                              }
                              strokeWidth={isSelected ? '3.5' : '2.2'}
                              strokeLinecap="round"
                              strokeDasharray="7 5"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{
                                pathLength: isSelected ? 1 : 0,
                                opacity: isSelected ? 1 : 0,
                              }}
                              transition={{ duration: 0.35, ease: 'easeOut' }}
                            />
                            <ellipse
                              cx="70"
                              cy="40"
                              rx="63"
                              ry="33"
                              fill="none"
                              stroke="rgba(255,255,255,0.5)"
                              strokeWidth="2.2"
                              strokeDasharray="7 5"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                          </svg>

                          <span
                            className="relative block text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-none select-none"
                            style={{
                              fontFamily: 'var(--font-chalk)',
                              textShadow: '0 0 12px rgba(255,255,255,0.35)',
                            }}
                          >
                            {item.id}
                          </span>
                          <span
                            className={`relative block text-[11px] sm:text-sm md:text-base mt-1 whitespace-nowrap ${
                              is12A1 ? 'text-amber-200/90' : 'text-emerald-100/80'
                            }`}
                            style={{ fontFamily: 'var(--font-chalk)' }}
                          >
                            {item.year}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Wooden Chalk Tray along full-screen frame */}
              <div className="relative h-4 sm:h-5 mx-4 sm:mx-8 -mt-1 rounded-b-lg bg-[#593316] shadow-md flex items-center justify-between px-6 sm:px-10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 sm:w-10 h-2 rounded-full bg-white/90 shadow-xs rotate-1" />
                  <div className="w-6 sm:w-7 h-2 rounded-full bg-pink-200/90 shadow-xs -rotate-2" />
                  <div className="w-5 h-2 rounded-full bg-sky-200/90 shadow-xs rotate-1 hidden sm:block" />
                </div>
                <div className="w-12 sm:w-16 h-3 rounded-sm bg-amber-950 border-t-2 border-amber-200/70 shadow-sm" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="envelope-stage"
              initial={{ opacity: 0, y: 36, scale: 0.92, rotate: -2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="relative flex flex-col items-center z-20"
            >
              {/* Interactive Envelope */}
              <motion.div
                onClick={handleOpen}
                onHoverStart={() => !isOpening && setIsEnvelopeHovered(true)}
                onHoverEnd={() => setIsEnvelopeHovered(false)}
                animate={{
                  y: isOpening ? 24 : isEnvelopeHovered ? -6 : 0,
                  scale: isOpening ? 0.97 : 1,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className={`relative w-[20rem] h-[15.5rem] sm:w-[25rem] sm:h-[18.5rem] select-none ${
                  isOpening ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                {/* Envelope Back Base */}
                <div className="absolute inset-0 bg-[#efe4d2] rounded-2xl shadow-[0_24px_55px_-12px_rgba(92,64,38,0.3)] border border-[#dfd0b8] z-0" />

                {/* Inner Letter Sheet */}
                <motion.div
                  initial={{ y: 18, scale: 0.93, opacity: 0 }}
                  animate={
                    isOpening
                      ? { y: -115, scale: 1.03, opacity: 1 }
                      : {
                          y: isEnvelopeHovered ? 6 : 18,
                          scale: 0.93,
                          opacity: isEnvelopeHovered ? 0.95 : 0,
                        }
                  }
                  transition={
                    isOpening
                      ? { delay: 0.2, duration: 0.55, ease: [0.16, 1, 0.3, 1] }
                      : { duration: 0.25, ease: 'easeOut' }
                  }
                  className={`absolute inset-x-4 top-3 bottom-4 bg-[#fffdf9] rounded-xl border shadow-lg p-5 flex flex-col items-center justify-start text-center z-10 pointer-events-none overflow-hidden ${
                    isOcean ? 'border-sky-100' : 'border-pink-100'
                  }`}
                >
                  <div
                    className={`w-full h-1.5 rounded-full mb-4 ${
                      isOcean
                        ? 'bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300'
                        : 'bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200'
                    }`}
                  />
                  <Heart
                    className={`w-7 h-7 mb-2 ${
                      isOcean ? 'text-sky-500 fill-sky-500' : 'text-pink-500 fill-pink-500'
                    }`}
                  />
                  <p className="font-serif text-lg sm:text-xl font-bold text-slate-800">
                    Thanh Xuân {selectedClass}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {isOcean ? 'Căng buồm ra khơi cùng ký ức...' : 'Chào mừng bạn trở về miền ký ức...'}
                  </p>
                  <div className="w-full space-y-2.5 mt-4 px-4 opacity-40">
                    <div className={`h-px w-full ${isOcean ? 'bg-sky-300' : 'bg-pink-300'}`} />
                    <div className={`h-px w-5/6 mx-auto ${isOcean ? 'bg-sky-300' : 'bg-pink-300'}`} />
                    <div className={`h-px w-4/6 mx-auto ${isOcean ? 'bg-sky-300' : 'bg-pink-300'}`} />
                  </div>
                </motion.div>

                {/* Envelope Front Pocket */}
                <div className="absolute inset-0 z-20 rounded-2xl overflow-hidden pointer-events-none">
                  <svg
                    viewBox="0 0 400 296"
                    preserveAspectRatio="none"
                    className="w-full h-full block"
                  >
                    <polygon points="0,0 200,158 0,296" fill="#f7efe2" />
                    <polygon points="400,0 200,158 400,296" fill="#f3e9d8" />
                    <polygon points="0,296 200,136 400,296" fill="#fdfaf4" />
                    <polyline
                      points="0,296 200,136 400,296"
                      fill="none"
                      stroke="#e6d7c1"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Envelope Front Text */}
                  <div className="absolute bottom-4 sm:bottom-5 inset-x-4 text-center">
                    <h2 className="font-display text-2xl sm:text-[1.85rem] font-bold text-slate-800 leading-tight">
                      Thư Gửi Thanh Xuân
                    </h2>
                    <p
                      className={`text-xs sm:text-sm font-semibold mt-0.5 ${
                        isOcean ? 'text-sky-600' : 'text-pink-600'
                      }`}
                    >
                      Đến: Tập thể {selectedClass}
                    </p>
                  </div>
                </div>

                {/* Top Animated Envelope Flap */}
                <motion.div
                  initial={{ rotateX: 0, zIndex: 30 }}
                  animate={{
                    rotateX: isOpening ? -175 : isEnvelopeHovered ? -22 : 0,
                    zIndex: isOpening ? 5 : 30,
                  }}
                  transition={{
                    rotateX: { duration: isOpening ? 0.45 : 0.25, ease: [0.22, 1, 0.36, 1] },
                    zIndex: { delay: isOpening ? 0.16 : 0, duration: 0 },
                  }}
                  style={{
                    transformPerspective: 1000,
                    transformOrigin: 'top center',
                  }}
                  className="absolute top-0 left-0 right-0 h-[56%] pointer-events-none"
                >
                  <svg
                    viewBox="0 0 400 166"
                    preserveAspectRatio="none"
                    className="w-full h-full block drop-shadow-[0_6px_10px_rgba(120,85,55,0.14)]"
                  >
                    <path
                      d="M 16,0 L 384,0 Q 400,0 400,16 L 400,18 L 200,162 L 0,18 L 0,16 Q 0,0 16,0 Z"
                      fill="#fbf6ec"
                      stroke="#e6d7c1"
                      strokeWidth="2"
                    />
                    <path
                      d="M 24,14 L 200,144 L 376,14"
                      fill="none"
                      stroke={isOcean ? '#7dd3fc' : '#f9a8d4'}
                      strokeWidth="1.5"
                      strokeDasharray="6 6"
                      opacity="0.7"
                    />
                  </svg>
                </motion.div>

                {/* Heart Wax Seal */}
                <motion.div
                  initial={{ scale: 1, opacity: 1, y: 0 }}
                  animate={
                    isOpening
                      ? { scale: [1, 1.25, 0], opacity: [1, 1, 0], y: -8 }
                      : {
                          scale: isEnvelopeHovered ? 1.1 : [1, 1.06, 1],
                          opacity: 1,
                          y: isEnvelopeHovered ? -5 : 0,
                        }
                  }
                  transition={
                    isOpening
                      ? { duration: 0.24, ease: 'easeOut' }
                      : isEnvelopeHovered
                        ? { duration: 0.2 }
                        : { repeat: Infinity, duration: 2.4, ease: 'easeInOut' }
                  }
                  className="absolute top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
                >
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg ring-4 ring-[#fffdf9] flex items-center justify-center ${
                      isOcean
                        ? 'bg-gradient-to-br from-sky-400 to-cyan-600 shadow-sky-500/30'
                        : 'bg-gradient-to-br from-rose-400 to-pink-600 shadow-pink-500/30'
                    }`}
                  >
                    <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Back Action Only */}
              <motion.div
                animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? 10 : 0 }}
                transition={{ duration: 0.22 }}
                className="mt-6 flex flex-col items-center"
              >
                <button
                  type="button"
                  onClick={handleBackToSelect}
                  disabled={isOpening}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-900/70 hover:text-amber-950 px-3 py-1.5 rounded-full hover:bg-amber-900/5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Chọn lại lớp khác
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

