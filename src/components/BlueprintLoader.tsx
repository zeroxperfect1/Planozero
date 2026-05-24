import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BlueprintLoaderProps {
  /** Full-screen dark overlay loader (default). Set false for inline/small use. */
  fullScreen?: boolean;
  label?: string;
}

// Letras del logotipo para la animación secuencial
const LOGO_TEXT = 'PLANOZERO';

const BlueprintLoader = ({ fullScreen = true, label = 'INICIANDO ECOSISTEMA...' }: BlueprintLoaderProps) => {
  const [progress, setProgress] = useState(0);

  // Simula un progreso de carga para la barra
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 12;
      });
    }, 160);
    return () => clearInterval(interval);
  }, []);

  const inner = (
    <div className="flex flex-col items-center gap-10 select-none">

      {/* ── Logo icon animado ──────────────────────────────────────────── */}
      <div className="relative w-32 h-32 flex items-center justify-center">

        {/* Blueprint grid de fondo */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 128 128">
          <defs>
            <pattern id="bp-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#FF5F1F" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="128" height="128" fill="url(#bp-grid)" />
        </svg>

        {/* Anillo exterior — rotación lenta */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 128 128"
        >
          {/* Arco principal naranja */}
          <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,95,31,0.12)" strokeWidth="1" />
          <circle
            cx="64" cy="64" r="60"
            fill="none"
            stroke="#FF5F1F"
            strokeWidth="1.5"
            strokeDasharray="60 320"
            strokeLinecap="round"
          />
          {/* Marcas de graduación */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 64 + 55 * Math.cos(rad);
            const y1 = 64 + 55 * Math.sin(rad);
            const x2 = 64 + 60 * Math.cos(rad);
            const y2 = 64 + 60 * Math.sin(rad);
            return (
              <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,95,31,0.4)" strokeWidth="1" />
            );
          })}
        </motion.svg>

        {/* Anillo interior — rotación inversa */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[18px] rounded-full"
          style={{
            border: '1px dashed rgba(255,255,255,0.06)',
            borderTopColor: 'rgba(255,95,31,0.3)',
            borderRightColor: 'rgba(255,95,31,0.15)',
          }}
        />

        {/* Círculo naranja central — el ícono de la marca */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: '#FF5500' }}
        >
          {/* Glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: '0 0 28px 10px rgba(255,85,0,0.35)' }}
          />

          {/* Flecha → del logotipo */}
          <motion.svg
            viewBox="0 0 40 40"
            className="w-7 h-7 relative z-10"
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M27 20.7678C27.9763 19.7915 27.9763 18.2085 27 17.2322L11.0901 1.32233C10.1138 0.346018 8.53083 0.346018 7.55452 1.32233C6.57821 2.29864 6.57821 3.88155 7.55452 4.85786L21.6967 19L7.55452 33.1421C6.57821 34.1184 6.57821 35.7014 7.55452 36.6777C8.53083 37.654 10.1138 37.654 11.0901 36.6777L27 20.7678Z"
              fill="#FBFBFB"
            />
          </motion.svg>
        </motion.div>

        {/* Líneas de mira (crosshair) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#FF5F1F]/15 to-transparent" />
          <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#FF5F1F]/15 to-transparent" />
        </div>

        {/* Esquinas de encuadre */}
        {[
          'top-0 left-0 border-t border-l',
          'top-0 right-0 border-t border-r',
          'bottom-0 left-0 border-b border-l',
          'bottom-0 right-0 border-b border-r',
        ].map((cls, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className={`absolute w-4 h-4 border-[#FF5F1F]/60 ${cls}`}
          />
        ))}
      </div>

      {/* ── Nombre PLANOZERO — letras secuenciales ─────────────────────── */}
      <div className="flex items-center gap-0.5" aria-label="PLANOZERO">
        {LOGO_TEXT.split('').map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.05 * i,
              duration: 0.3,
              repeat: Infinity,
              repeatDelay: LOGO_TEXT.length * 0.05 + 1.5,
              repeatType: 'loop',
            }}
            className="text-[11px] font-black tracking-[0.35em] text-white/80 font-mono"
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* ── Barra de progreso ──────────────────────────────────────────── */}
      <div className="w-48 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[7px] font-mono text-[#FF5F1F]/50 uppercase tracking-widest">SYS_LOAD</span>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-[7px] font-mono text-[#FF5F1F]/40"
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.span>
        </div>

        {/* Track */}
        <div className="relative h-px bg-white/5 overflow-hidden rounded-full">
          {/* Barra de progreso */}
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FF5F1F]/60 to-[#FF5F1F] rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ ease: 'easeOut' }}
          />
          {/* Scanner shimmer */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/3"
          />
        </div>

        {/* Segmentos */}
        <div className="flex gap-0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: progress / 100 > i / 16 ? [0.6, 1, 0.6] : 0.08 }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.06 }}
              className="flex-1 h-0.5 rounded-full"
              style={{ background: progress / 100 > i / 16 ? '#FF5F1F' : 'rgba(255,255,255,0.1)' }}
            />
          ))}
        </div>
      </div>

      {/* ── Label pulsante ─────────────────────────────────────────────── */}
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-[7px] font-mono text-zinc-600 uppercase tracking-[0.4em]"
      >
        {label}
      </motion.p>
    </div>
  );

  if (!fullScreen) return inner;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">

      {/* Grid blueprint full-bleed */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="bp-grid-full" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FF5F1F" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bp-grid-full)" />
      </svg>

      {/* Glow radial central */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 500px 400px at 50% 50%, rgba(255,85,0,0.07), transparent)' }}
      />

      {/* Anotaciones de esquina */}
      <span className="absolute top-6 left-8 font-mono text-[7px] text-white/8 uppercase tracking-widest hidden md:block">
        PLANOZERO / EST. 2020
      </span>
      <span className="absolute top-6 right-8 font-mono text-[7px] text-white/8 uppercase tracking-widest hidden md:block">
        SCL · CHILE
      </span>
      <span className="absolute bottom-6 left-8 font-mono text-[7px] text-white/8 uppercase tracking-widest hidden md:block">
        X:000.0 / Y:000.0
      </span>
      <span className="absolute bottom-6 right-8 font-mono text-[7px] text-white/8 uppercase tracking-widest hidden md:block">
        SYS_STATUS: BOOT
      </span>

      {inner}
    </div>
  );
};

export default BlueprintLoader;
