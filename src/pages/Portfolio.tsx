import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Mail, Phone, Instagram, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// ─── Blueprint decorative SVGs ─────────────────────────────────────────────
const BlueprintGrid = () => (
  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none">
    <defs>
      <pattern id="pg-grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.4" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pg-grid)" />
  </svg>
);

// ─── Fade-in section wrapper ────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Image Lightbox ────────────────────────────────────────────────────────
const Lightbox = ({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors">
      <X className="w-8 h-8" />
    </button>
    <motion.img
      src={src} alt={alt}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl max-h-[90vh] w-full object-contain rounded-2xl"
      onClick={e => e.stopPropagation()}
    />
  </motion.div>
);

// ─── Service badge ─────────────────────────────────────────────────────────
const ServiceBadge = ({ label }: { label: string }) => (
  <span className="inline-flex items-center px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-400">
    {label}
  </span>
);

// ─── Case Study Card ───────────────────────────────────────────────────────
const CaseCard = ({ img, title, client, tags, metric, metricLabel, onClick }: {
  img: string; title: string; client: string; tags: string[];
  metric?: string; metricLabel?: string; onClick: () => void;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-[28px] border border-zinc-800 group-hover:border-[var(--color-primary)]/40 transition-all duration-500">
        <img
          src={img} alt={title}
          className="w-full h-72 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map(t => <ServiceBadge key={t} label={t} />)}
          </div>
        </div>
        {/* Expand icon */}
        <div className="absolute top-4 right-4 w-9 h-9 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--color-primary)] mb-1">{client}</p>
          <h3 className="text-xl font-black uppercase italic tracking-tighter leading-tight text-white">{title}</h3>
        </div>
        {metric && (
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-black text-white tracking-tighter">{metric}</p>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{metricLabel}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Photo Gallery ────────────────────────────────────────────────────────
const PhotoGallery = ({ photos, onOpen }: { photos: { src: string; alt: string }[]; onOpen: (i: number) => void }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
    {photos.map((p, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: i * 0.1 }}
        className={`relative overflow-hidden cursor-pointer group rounded-2xl border border-zinc-800 hover:border-[var(--color-primary)]/40 transition-all duration-500 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
        onClick={() => onOpen(i)}
        style={{ minHeight: i === 0 ? '360px' : '180px' }}
      >
        <img src={p.src} alt={p.alt} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" style={{ minHeight: 'inherit' }} />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ArrowUpRight className="w-6 h-6 text-white" />
        </div>
      </motion.div>
    ))}
  </div>
);

// ─── Main Portfolio Page ───────────────────────────────────────────────────
export default function Portfolio() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Prevent screenshot (basic UX friction, not hard protection)
  useEffect(() => {
    document.title = 'Portafolio PlanoZero — Privado';
  }, []);

  const CASES = [
    {
      img: '/portfolio/branding1.png',
      title: 'Identidad Corporativa',
      client: 'SECTOR FINANCIERO',
      tags: ['Branding', 'Identidad Visual', 'Papelería'],
      metric: '+340%', metricLabel: 'Reconocimiento'
    },
    {
      img: '/portfolio/branding2.png',
      title: 'Sistema de Packaging',
      client: 'BIENES RAÍCES',
      tags: ['Packaging', 'Brand Identity', 'Print'],
      metric: '3x', metricLabel: 'Percepción de Valor'
    },
    {
      img: '/portfolio/web1.png',
      title: 'Sitio Web Premium',
      client: 'SECTOR INMOBILIARIO',
      tags: ['Web', 'UI/UX', 'Desarrollo'],
      metric: '+180%', metricLabel: 'Conversiones'
    },
    {
      img: '/portfolio/web2.png',
      title: 'App & Web Responsive',
      client: 'GASTRONOMÍA',
      tags: ['App', 'UX Design', 'Branding'],
      metric: '2.4M', metricLabel: 'Alcance Social'
    },
    {
      img: '/portfolio/advertising1.png',
      title: 'Campaña Publicitaria OOH',
      client: 'TECNOLOGÍA',
      tags: ['Publicidad', 'Campaña', 'OOH'],
      metric: '+95%', metricLabel: 'Brand Awareness'
    },
    {
      img: '/portfolio/success1.png',
      title: 'Estrategia Digital 360°',
      client: 'RETAIL',
      tags: ['Estrategia', 'Digital', 'Performance'],
      metric: '4.7×', metricLabel: 'ROI Campaña'
    },
  ];

  const PHOTOS = [
    { src: '/portfolio/photo1.png', alt: 'Fotografía corporativa ejecutiva' },
    { src: '/portfolio/photo2.png', alt: 'Fotografía de producto premium' },
    { src: '/portfolio/branding1.png', alt: 'Fotografía de identidad de marca' },
    { src: '/portfolio/web1.png', alt: 'Fotografía de producto digital' },
    { src: '/portfolio/advertising1.png', alt: 'Fotografía publicitaria exterior' },
  ];

  const SERVICES = [
    { num: '01', title: 'Branding & Identidad', desc: 'Construimos marcas desde la arquitectura visual hasta el sistema de aplicación completo. Logos, paletas, tipografías, manuales y todos los puntos de contacto de tu marca.' },
    { num: '02', title: 'Diseño Web & Digital', desc: 'Sitios web que convierten. Desde landing pages hasta plataformas complejas. UI/UX, desarrollo frontend, integración con CMS y optimización de performance.' },
    { num: '03', title: 'Fotografía Comercial', desc: 'Producción fotográfica editorial y comercial. Retratos ejecutivos, fotografía de producto, campañas lifestyle y contenido para redes sociales.' },
    { num: '04', title: 'Publicidad & Campañas', desc: 'Estrategia y ejecución de campañas publicitarias en todos los formatos: digital, OOH, prensa y audiovisual. Del concepto creativo a la producción final.' },
  ];

  return (
    <>
      <Helmet>
        <title>Portafolio PlanoZero — Privado</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-zinc-950 text-white min-h-screen overflow-x-hidden" style={{ fontFamily: "var(--font-body, 'Inter', sans-serif)" }}>

        {/* ── Minimal Nav ─────────────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900">
          <div className="font-black text-lg uppercase italic tracking-tighter">
            PLANO<span className="text-[var(--color-primary)]">ZERO</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-600 mr-2">PORTAFOLIO PRIVADO</span>
            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
          </div>
          <a
            href="/#contacto"
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-[0.15em] hover:opacity-90 transition-opacity rounded-xl"
          >
            Trabajemos <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </nav>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-20">
          {/* Parallax BG */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
            <img src="/portfolio/hero.png" alt="PlanoZero Portfolio" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
            <div className="absolute inset-0 text-[var(--color-secondary)]/[0.04] pointer-events-none">
              <BlueprintGrid />
            </div>
          </motion.div>

          {/* Blueprint corner annotations */}
          <div className="absolute top-24 left-6 font-mono text-[7px] text-[var(--color-secondary)]/30 uppercase tracking-widest hidden md:block select-none">X:000.0 / Y:000.0</div>
          <div className="absolute top-24 right-6 font-mono text-[7px] text-[var(--color-secondary)]/30 uppercase tracking-widest hidden md:block select-none">SYS_STATUS: ONLINE</div>

          {/* Content */}
          <div className="relative z-10 px-6 md:px-16 pb-20 max-w-7xl mx-auto w-full">
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/20 text-[9px] font-mono mb-8 uppercase tracking-[0.3em] font-black text-[var(--color-secondary)]">
                <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" />
                DOCUMENT CONFIDENCIAL — PORTAFOLIO 2026
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-[120px] font-black tracking-tighter leading-[0.88] mb-8 uppercase" style={{ fontFamily: "var(--font-heading, 'Inter', sans-serif)" }}>
                Obras que<br />
                <span className="text-[var(--color-primary)]">hablan.</span>
              </h1>
              <div className="flex flex-col md:flex-row items-start md:items-end gap-8 max-w-4xl">
                <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-xl">
                  Selección de proyectos de marca, diseño digital y producción visual. Cada pieza responde a un objetivo de negocio real.
                </p>
                <div className="flex gap-8 flex-shrink-0">
                  <div>
                    <p className="text-4xl font-black text-white tracking-tighter">+80</p>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Proyectos</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-white tracking-tighter">6+</p>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Años</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-white tracking-tighter">12</p>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Industrias</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600"
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-zinc-600" />
            <span className="text-[8px] font-mono uppercase tracking-[0.3em]">Scroll</span>
          </motion.div>
        </section>

        {/* ── Services Overview ──────────────────────────────────────── */}
        <section className="py-24 px-6 md:px-16 border-t border-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 text-[var(--color-secondary)]/[0.03] pointer-events-none">
            <BlueprintGrid />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <FadeIn>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.4em] text-[var(--color-primary)] uppercase mb-3 block font-black">NUESTROS SERVICIOS</span>
                  <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                    Lo que hacemos
                  </h2>
                </div>
                <p className="text-zinc-500 max-w-sm text-base leading-relaxed">
                  Somos un equipo multidisciplinar que integra estrategia, diseño y tecnología en cada proyecto.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SERVICES.map((s, i) => (
                <FadeIn key={s.num} delay={i * 0.1}>
                  <div className="p-8 bg-zinc-900/50 border border-zinc-800 hover:border-[var(--color-primary)]/30 rounded-3xl transition-all duration-500 group">
                    <div className="flex items-start gap-6">
                      <span className="font-mono text-[11px] text-[var(--color-primary)] tracking-widest font-black pt-1">[{s.num}]</span>
                      <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none mb-3 text-white group-hover:text-[var(--color-primary)] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                          {s.title}
                        </h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cases Grid ─────────────────────────────────────────────── */}
        <section className="py-24 px-6 md:px-16 bg-zinc-900/30 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto">
            <FadeIn className="mb-16">
              <span className="text-[9px] font-mono tracking-[0.4em] text-[var(--color-primary)] uppercase mb-3 block font-black">CASOS DE ÉXITO</span>
              <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                Proyectos<br />seleccionados
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {CASES.map((c, i) => (
                <CaseCard
                  key={i}
                  {...c}
                  onClick={() => setLightbox({ src: c.img, alt: c.title })}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Branding Deep Dive ─────────────────────────────────────── */}
        <section className="py-24 px-6 md:px-16 border-t border-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 text-[var(--color-secondary)]/[0.03] pointer-events-none"><BlueprintGrid /></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeIn>
                <span className="text-[9px] font-mono tracking-[0.4em] text-[var(--color-primary)] uppercase mb-4 block font-black">BRANDING ESTRATÉGICO</span>
                <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                  Marcas que permanecen en la memoria.
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  Nuestro proceso de branding parte del análisis profundo de tu mercado, tu competencia y tu audiencia. El resultado es una identidad visual coherente, escalable y auténtica que trabaja para tu negocio 24/7.
                </p>
                <ul className="space-y-3 mb-10">
                  {['Auditoría de marca y benchmark','Estrategia de posicionamiento','Diseño de logotipo y sistema visual','Manual de identidad corporativa','Aplicaciones y piezas colaterales'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-8">
                  <div><p className="text-3xl font-black text-white">+40</p><p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Marcas creadas</p></div>
                  <div><p className="text-3xl font-black text-white">100%</p><p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Satisfacción</p></div>
                </div>
              </FadeIn>

              <div className="grid grid-cols-2 gap-4">
                {['/portfolio/branding1.png', '/portfolio/branding2.png'].map((src, i) => (
                  <FadeIn key={i} delay={i * 0.15} className={i === 0 ? 'col-span-2' : ''}>
                    <div
                      className="relative overflow-hidden rounded-2xl border border-zinc-800 hover:border-[var(--color-primary)]/40 transition-all cursor-pointer group"
                      onClick={() => setLightbox({ src, alt: `Branding caso ${i+1}` })}
                      style={{ height: i === 0 ? '280px' : '160px' }}
                    >
                      <img src={src} alt={`Branding caso ${i+1}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Web & Digital Deep Dive ────────────────────────────────── */}
        <section className="py-24 px-6 md:px-16 bg-zinc-900/30 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 grid grid-cols-1 gap-4">
                {['/portfolio/web1.png', '/portfolio/web2.png'].map((src, i) => (
                  <FadeIn key={i} delay={i * 0.15}>
                    <div
                      className="relative overflow-hidden rounded-2xl border border-zinc-800 hover:border-[var(--color-primary)]/40 transition-all cursor-pointer group"
                      onClick={() => setLightbox({ src, alt: `Web caso ${i+1}` })}
                      style={{ height: '260px' }}
                    >
                      <img src={src} alt={`Web caso ${i+1}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <FadeIn className="order-1 lg:order-2">
                <span className="text-[9px] font-mono tracking-[0.4em] text-[var(--color-primary)] uppercase mb-4 block font-black">DISEÑO WEB & DIGITAL</span>
                <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                  Presencia digital que convierte.
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  Creamos experiencias digitales que mezclan estética de alto nivel con performance real. Cada sitio es diseñado pensando en la conversión, el posicionamiento SEO y la experiencia del usuario.
                </p>
                <ul className="space-y-3 mb-10">
                  {['Diseño UI/UX & Wireframes','Desarrollo Vite/React o WordPress','CMS personalizado y autoadministrable','Integración con sistemas externos','Optimización de velocidad y SEO'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-8">
                  <div><p className="text-3xl font-black text-white">+30</p><p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Sitios lanzados</p></div>
                  <div><p className="text-3xl font-black text-white">98%</p><p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Perf. Score</p></div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Photography Gallery ────────────────────────────────────── */}
        <section className="py-24 px-6 md:px-16 border-t border-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 text-[var(--color-secondary)]/[0.03] pointer-events-none"><BlueprintGrid /></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <FadeIn className="mb-16">
              <span className="text-[9px] font-mono tracking-[0.4em] text-[var(--color-primary)] uppercase mb-3 block font-black">PRODUCCIÓN FOTOGRÁFICA</span>
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                  Imágenes que<br />
                  <span className="text-[var(--color-primary)]">venden.</span>
                </h2>
                <p className="text-zinc-500 max-w-sm text-base leading-relaxed">
                  Fotografía editorial, corporativa y de producto para empresas que entienden el valor visual de su marca.
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <PhotoGallery
                photos={PHOTOS}
                onOpen={i => setLightbox({ src: PHOTOS[i].src, alt: PHOTOS[i].alt })}
              />
            </FadeIn>

            <FadeIn delay={0.3} className="mt-10">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { n: 'Retrato Ejecutivo', d: 'Fotografía de equipo directivo y perfiles profesionales.' },
                  { n: 'Fotografía de Producto', d: 'Packshots y lifestyle para e-commerce y catálogos.' },
                  { n: 'Contenido para RRSS', d: 'Producción de contenido visual optimizado para cada plataforma.' },
                ].map(item => (
                  <div key={item.n} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                    <p className="text-sm font-black uppercase italic tracking-tighter text-white mb-2">{item.n}</p>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Results Banner ────────────────────────────────────────── */}
        <section className="py-24 px-6 md:px-16 bg-zinc-900 border-t border-b border-zinc-800 relative overflow-hidden">
          <div className="absolute inset-0 text-[var(--color-secondary)]/[0.03] pointer-events-none"><BlueprintGrid /></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <FadeIn className="mb-16 text-center">
              <span className="text-[9px] font-mono tracking-[0.4em] text-[var(--color-primary)] uppercase mb-3 block font-black">RESULTADOS</span>
              <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                Números reales
              </h2>
            </FadeIn>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {[
                { n: '+340%', l: 'Reconocimiento de marca', icon: '📈' },
                { n: '+180%', l: 'Tasa de conversión web', icon: '🌐' },
                { n: '4.7×', l: 'ROI en campañas digitales', icon: '🎯' },
                { n: '2.4M', l: 'Alcance en redes sociales', icon: '📱' },
              ].map((s, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="p-8 bg-zinc-950 border border-zinc-800 rounded-3xl text-center">
                    <p className="text-4xl mb-1">{s.icon}</p>
                    <p className="text-4xl font-black text-white tracking-tighter italic mb-2">{s.n}</p>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed">{s.l}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn>
              <div
                className="relative overflow-hidden rounded-3xl cursor-pointer group"
                onClick={() => setLightbox({ src: '/portfolio/success1.png', alt: 'Caso de éxito' })}
                style={{ height: '360px' }}
              >
                <img src="/portfolio/success1.png" alt="Caso de éxito" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center px-12">
                  <div>
                    <p className="text-[9px] font-mono text-[var(--color-primary)] uppercase tracking-[0.3em] mb-3">CASO DE ESTUDIO DESTACADO</p>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4 leading-none" style={{ fontFamily: "var(--font-heading)" }}>
                      Transformación<br />digital completa
                    </h3>
                    <p className="text-zinc-300 text-sm max-w-sm leading-relaxed">
                      Rediseño de marca + sitio web + campaña de lanzamiento para empresa retail. Resultado: 4.7× ROI en 90 días.
                    </p>
                  </div>
                </div>
                <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="py-32 px-6 md:px-16 relative overflow-hidden">
          <div className="absolute inset-0 text-[var(--color-secondary)]/[0.04] pointer-events-none"><BlueprintGrid /></div>
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)]/8 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/20 text-[9px] font-mono mb-8 uppercase tracking-[0.3em] font-black text-[var(--color-secondary)]">
                <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" />
                ¿Listo para el siguiente nivel?
              </div>
              <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.88] mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                Iniciemos tu<br />
                <span className="text-[var(--color-primary)]">proyecto.</span>
              </h2>
              <p className="text-zinc-400 text-xl leading-relaxed mb-12 max-w-xl mx-auto">
                Cuéntanos tu idea. En 24 horas te respondemos con una propuesta estratégica inicial, sin compromiso.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/#contacto"
                  className="flex items-center gap-3 px-10 py-5 bg-[var(--color-primary)] text-white font-black text-sm uppercase tracking-[0.15em] hover:opacity-90 transition-all rounded-2xl shadow-[0_0_40px_rgba(255,95,31,0.3)] group"
                >
                  Agendar reunión
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a
                  href="mailto:hola@planozero.cl"
                  className="flex items-center gap-3 px-10 py-5 bg-transparent border border-zinc-700 text-white font-bold text-sm uppercase tracking-[0.1em] hover:border-zinc-500 transition-colors rounded-2xl"
                >
                  <Mail className="w-4 h-4" />
                  hola@planozero.cl
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="py-8 px-6 md:px-16 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-black text-sm uppercase italic tracking-tighter text-zinc-600">PLANOZERO</div>
            <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-widest">DOCUMENTO CONFIDENCIAL — NO DISTRIBUIR</p>
            <p className="text-[9px] font-mono text-zinc-700">© 2026 PlanoZero Studio</p>
          </div>
        </footer>

        {/* ── Lightbox ─────────────────────────────────────────────── */}
        {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
      </div>
    </>
  );
}
