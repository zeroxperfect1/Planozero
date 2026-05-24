import React from 'react';
import { motion } from 'motion/react';

interface BlueprintLoaderProps {
  /** Full-screen dark overlay loader (default). Set false for inline/small use. */
  fullScreen?: boolean;
  label?: string;
}

const BlueprintLoader = ({ fullScreen = true, label = 'INICIANDO ECOSISTEMA...' }: BlueprintLoaderProps) => {
  const inner = (
    <div className="flex flex-col items-center gap-8 select-none">

      {/* ── Crosshair target ─────────────────────────────────────────── */}
      <div className="relative w-28 h-28">

        {/* Blueprint grid inside circle */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 112 112">
          <defs>
            <pattern id="bp-inner-grid" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M 14 0 L 0 0 0 14" fill="none" stroke="#FF5F1F" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="112" height="112" fill="url(#bp-inner-grid)" />
        </svg>

        {/* Outer ring — slow rotation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(255,95,31,0.15)',
            borderTopColor: '#FF5F1F',
            borderRightColor: 'rgba(255,95,31,0.4)',
          }}
        />

        {/* Inner ring — counter-rotation, dashed */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[14px] rounded-full"
          style={{
            border: '1px dashed rgba(255,255,255,0.08)',
            borderTopColor: 'rgba(255,95,31,0.35)',
          }}
        />

        {/* Crosshair lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#FF5F1F]/20 to-transparent" />
          <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#FF5F1F]/20 to-transparent" />
        </div>

        {/* Corner brackets */}
        {[
          'top-0 left-0 border-t border-l',
          'top-0 right-0 border-t border-r',
          'bottom-0 left-0 border-b border-l',
          'bottom-0 right-0 border-b border-r',
        ].map((cls, i) => (
          <div key={i} className={`absolute w-3 h-3 border-[#FF5F1F] ${cls}`} />
        ))}

        {/* Pulsing center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F]"
          />
        </div>

        {/* Rotating tick marks (4 dots on the ring) */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 112 112"
        >
          {[0, 90, 180, 270].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 56 + 52 * Math.cos(rad);
            const cy = 56 + 52 * Math.sin(rad);
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={i === 0 ? 2.5 : 1.5}
                fill={i === 0 ? '#FF5F1F' : 'rgba(255,95,31,0.4)'}
              />
            );
          })}
        </motion.svg>
      </div>

      {/* ── Scanner bar ──────────────────────────────────────────────── */}
      <div className="w-52 space-y-2">
        <div className="flex justify-between items-center text-[7px] font-mono uppercase tracking-[0.25em]">
          <span className="text-[#FF5F1F]/60">SYS_LOAD</span>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-[#FF5F1F]/40"
          >
            ●
          </motion.span>
          <span className="text-zinc-700">v2.1</span>
        </div>

        {/* Scanning line */}
        <div className="relative h-px bg-white/5 overflow-hidden">
          <motion.div
            animate={{ x: ['-100%', '120%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF5F1F] to-transparent w-1/2"
          />
        </div>

        {/* Segment blocks */}
        <div className="flex gap-0.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.1, 0.6, 0.1] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
              className="flex-1 h-0.5 bg-[#FF5F1F]"
            />
          ))}
        </div>
      </div>

      {/* ── Label ────────────────────────────────────────────────────── */}
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.35em]"
      >
        {label}
      </motion.p>
    </div>
  );

  if (!fullScreen) return inner;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
      {/* Full-bleed blueprint grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="bp-grid-full" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FF5F1F" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bp-grid-full)" />
      </svg>

      {/* Subtle warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_at_50%_60%,rgba(255,95,31,0.04),transparent)] pointer-events-none" />

      {/* Corner annotations */}
      <span className="absolute top-6 left-8 font-mono text-[7px] text-white/10 uppercase tracking-widest hidden md:block">
        PLANOZERO / EST. 2020
      </span>
      <span className="absolute top-6 right-8 font-mono text-[7px] text-white/10 uppercase tracking-widest hidden md:block">
        SCL · CHILE
      </span>
      <span className="absolute bottom-6 left-8 font-mono text-[7px] text-white/10 uppercase tracking-widest hidden md:block">
        X:000.0 / Y:000.0
      </span>
      <span className="absolute bottom-6 right-8 font-mono text-[7px] text-white/10 uppercase tracking-widest hidden md:block">
        SYS_STATUS: BOOT
      </span>

      {inner}
    </div>
  );
};

export default BlueprintLoader;
