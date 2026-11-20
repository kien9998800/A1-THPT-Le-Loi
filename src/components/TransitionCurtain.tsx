import { motion, AnimatePresence } from 'motion/react';

export type TransitionTheme = '10A1' | '11A1';
export type TransitionPhase = 'covering' | 'revealing';

interface TransitionCurtainProps {
  theme: TransitionTheme | null;
  phase: TransitionPhase;
}

// Deterministic sakura petals so positions/rotations stay consistent across renders
const SAKURA_PETALS = Array.from({ length: 34 }, (_, i) => {
  const leftPercent = ((i * 29 + 7) % 96) + 2;
  const size = 18 + (i % 4) * 7;
  const delay = (i % 10) * 0.065;
  const duration = 1.25 + (i % 5) * 0.18;
  const sway = (i % 2 === 0 ? 1 : -1) * (24 + (i % 4) * 14);
  const rotateEnd = (i % 2 === 0 ? 1 : -1) * (160 + (i % 5) * 45);
  const tint =
    i % 3 === 0 ? '#fbcfe8' : i % 3 === 1 ? '#f9a8d4' : '#fda4af';

  return { id: i, leftPercent, size, delay, duration, sway, rotateEnd, tint };
});

// Deterministic ocean bubbles rising through the waves
const OCEAN_BUBBLES = Array.from({ length: 24 }, (_, i) => {
  const leftPercent = ((i * 31 + 11) % 92) + 4;
  const size = 12 + (i % 5) * 8;
  const delay = 0.08 + (i % 8) * 0.08;
  const duration = 1.15 + (i % 4) * 0.22;
  const drift = (i % 2 === 0 ? 1 : -1) * (16 + (i % 3) * 12);

  return { id: i, leftPercent, size, delay, duration, drift };
});

function SakuraPetalSvg({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 3C11.5 8 7 14 7 20C7 24.5 10.8 28 15 28C15.5 28 16 26.8 16 25.5C16 26.8 16.5 28 17 28C21.2 28 25 24.5 25 20C25 14 20.5 8 16 3Z"
        fill={color}
      />
      <path
        d="M16 7C14 11 12.5 15 12.5 19.5"
        stroke="#fff1f2"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export default function TransitionCurtain({ theme, phase }: TransitionCurtainProps) {
  const isRevealing = phase === 'revealing';

  return (
    <AnimatePresence>
      {theme === '10A1' && (
        <motion.div
          key="sakura-curtain"
          initial={{ opacity: 1 }}
          animate={{ opacity: isRevealing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] overflow-hidden pointer-events-none"
        >
          {/* Sakura backdrop sweeping down from top to fill the screen, then fading out */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: isRevealing ? '10%' : '0%' }}
            transition={{
              duration: isRevealing ? 0.65 : 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 bg-gradient-to-b from-pink-200 via-rose-100 to-rose-50"
          >
            {/* Soft blossom glow accents */}
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  'radial-gradient(circle at 25% 30%, rgba(244,114,182,0.28), transparent 45%), radial-gradient(circle at 75% 65%, rgba(251,113,133,0.25), transparent 50%)',
              }}
            />
          </motion.div>

          {/* Falling Cherry Blossom Petals */}
          {SAKURA_PETALS.map((petal) => (
            <motion.div
              key={petal.id}
              initial={{ y: '-12vh', x: 0, rotate: 0, opacity: 0 }}
              animate={{
                y: '115vh',
                x: [0, petal.sway, -petal.sway * 0.5, petal.sway * 0.6],
                rotate: petal.rotateEnd,
                opacity: [0, 1, 1, 0.85, 0],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                ease: 'easeInOut',
              }}
              style={{ left: `${petal.leftPercent}%` }}
              className="absolute top-0 will-change-transform"
            >
              <SakuraPetalSvg size={petal.size} color={petal.tint} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {theme === '11A1' && (
        <motion.div
          key="ocean-curtain"
          initial={{ opacity: 1 }}
          animate={{ opacity: isRevealing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] overflow-hidden pointer-events-none"
        >
          {/* Back wave layer */}
          <motion.div
            initial={{ y: '105%' }}
            animate={{ y: isRevealing ? '105%' : '-8%' }}
            transition={{
              duration: isRevealing ? 0.65 : 0.92,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-x-0 -top-24 bottom-0 will-change-transform"
          >
            <svg
              viewBox="0 0 1200 140"
              preserveAspectRatio="none"
              className="w-full h-24 sm:h-32 block"
            >
              <path
                d="M0,70 C180,10 360,125 600,65 C840,5 1020,115 1200,55 L1200,140 L0,140 Z"
                fill="#7dd3fc"
              />
            </svg>
            <div className="w-full h-full bg-gradient-to-b from-sky-300 via-sky-400 to-cyan-500" />
          </motion.div>

          {/* Main deep ocean wave layer */}
          <motion.div
            initial={{ y: '115%' }}
            animate={{ y: isRevealing ? '115%' : '-4%' }}
            transition={{
              duration: isRevealing ? 0.58 : 0.98,
              delay: isRevealing ? 0 : 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-x-0 -top-24 bottom-0 will-change-transform"
          >
            <svg
              viewBox="0 0 1200 140"
              preserveAspectRatio="none"
              className="w-full h-24 sm:h-32 block"
            >
              <path
                d="M0,55 C240,120 420,10 660,70 C900,130 1050,25 1200,65 L1200,140 L0,140 Z"
                fill="#0ea5e9"
              />
              <path
                d="M0,55 C240,120 420,10 660,70 C900,130 1050,25 1200,65"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="6"
                opacity="0.8"
              />
            </svg>
            <div className="w-full h-full bg-gradient-to-b from-sky-500 via-cyan-600 to-teal-600" />
          </motion.div>

          {/* Rising Ocean Bubbles */}
          {OCEAN_BUBBLES.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{ y: '108vh', x: 0, scale: 0.6, opacity: 0 }}
              animate={{
                y: '-18vh',
                x: [0, bubble.drift, -bubble.drift * 0.6, bubble.drift * 0.4],
                scale: [0.6, 1, 1.08, 0.95],
                opacity: [0, 0.9, 0.85, 0],
              }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                ease: 'easeOut',
              }}
              style={{
                left: `${bubble.leftPercent}%`,
                width: bubble.size,
                height: bubble.size,
              }}
              className="absolute top-0 rounded-full border-2 border-white/80 bg-white/30 shadow-inner will-change-transform"
            >
              <div className="w-1/3 h-1/3 rounded-full bg-white/80 mt-1 ml-1" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
