import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronDown } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ServiceFAQ   { q: string; a: string }
export interface ServicePoint { icon?: React.ReactNode; title: string; desc: string }
export interface ServiceStep  { num: string; title: string; desc: string }

interface ServicePageProps {
  // SEO
  title: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  schemaService: string;
  faqSchema: ServiceFAQ[];

  // Hero
  tag: string;
  headline: React.ReactNode;
  subheadline: string;
  ctaLabel?: string;

  // Body
  intro: React.ReactNode;
  points: ServicePoint[];
  process: ServiceStep[];
  faqs: ServiceFAQ[];

  // Related
  relatedLinks?: { label: string; href: string }[];
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
const FAQItem = ({ q, a }: ServiceFAQ) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span className="font-bold text-base pr-8 group-hover:text-[#FF5F1F] transition-colors">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <ChevronDown className="w-5 h-5 text-zinc-400" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed pb-5">{a}</p>
      </motion.div>
    </div>
  );
};

// ── Main Layout ───────────────────────────────────────────────────────────────
export const ServicePage: React.FC<ServicePageProps> = ({
  title, metaTitle, metaDescription, canonical, schemaService, faqSchema,
  tag, headline, subheadline, ctaLabel = 'Hablemos de tu proyecto',
  intro, points, process, faqs, relatedLinks = []
}) => {

  const faqSchemaObj = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        "name": schemaService,
        "provider": { "@id": "https://www.planozero.cl/#organization" },
        "areaServed": { "@type": "Country", "name": "Chile" },
        "url": canonical,
        "description": metaDescription
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqSchema.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio",    "item": "https://www.planozero.cl/" },
          { "@type": "ListItem", "position": 2, "name": "Servicios", "item": "https://www.planozero.cl/#servicios" },
          { "@type": "ListItem", "position": 3, "name": title,       "item": canonical }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-[#FF5F1F] selection:text-white">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hreflang="es-CL" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:site_name" content="PLANOZERO" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content="https://www.planozero.cl/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content="https://www.planozero.cl/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(faqSchemaObj)}</script>
      </Helmet>

      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[72vh] flex flex-col justify-end pb-16 pt-32 px-6 overflow-hidden bg-zinc-950">
        {/* Blueprint grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'linear-gradient(#FF5F1F 1px, transparent 1px), linear-gradient(90deg, #FF5F1F 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-8" aria-label="breadcrumb">
            <Link to="/" className="hover:text-[#FF5F1F] transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-[#FF5F1F]">{title}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-[10px] font-mono text-[#FF5F1F] uppercase tracking-[0.3em] mb-6 border border-[#FF5F1F]/30 px-4 py-2 rounded-full">
              {tag}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white mb-6">
              {headline}
            </h1>
            <p className="text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed mb-10">
              {subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contacto-servicio"
                className="inline-flex items-center gap-2 bg-[#FF5F1F] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#E54E10] transition-colors shadow-xl shadow-[#FF5F1F]/20"
              >
                {ctaLabel} <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/#servicios"
                className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 px-8 py-4 rounded-full font-bold text-sm hover:border-zinc-500 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Ver servicios
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed [&>p]:mb-6">
          {intro}
        </div>
      </section>

      {/* ── Lo que incluye ───────────────────────────────────────────────────── */}
      <section className="bg-zinc-50 dark:bg-zinc-900 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="text-[10px] font-mono text-[#FF5F1F] uppercase tracking-widest mb-3 block">Lo que incluye</span>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-12">
            Qué hacemos exactamente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {points.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-4 p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-[#FF5F1F]/30 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-[#FF5F1F] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm mb-1">{p.title}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proceso ──────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <span className="text-[10px] font-mono text-[#FF5F1F] uppercase tracking-widest mb-3 block">Cómo trabajamos</span>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-12">
          El proceso, sin rodeos
        </h2>
        <div className="space-y-0">
          {process.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-6 pb-10 relative"
            >
              {/* Line connector */}
              {i < process.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />
              )}
              <div className="w-10 h-10 rounded-full bg-zinc-950 dark:bg-white border-2 border-[#FF5F1F] flex items-center justify-center flex-shrink-0 z-10">
                <span className="text-[10px] font-black text-[#FF5F1F]">{step.num}</span>
              </div>
              <div className="pt-1.5">
                <h3 className="font-black text-base mb-2 uppercase tracking-tight">{step.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA mid-page ─────────────────────────────────────────────────────── */}
      <section className="bg-zinc-950 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-4">¿Listo para empezar?</p>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
            Contanos qué<br />estás construyendo
          </h2>
          <p className="text-zinc-400 text-sm mb-8 max-w-lg mx-auto">
            Primera reunión sin costo. Sin presentaciones genéricas. Solo escuchamos lo que necesitás y te decimos con honestidad si podemos ayudarte.
          </p>
          <a
            id="contacto-servicio"
            href="mailto:hola@planozero.cl"
            className="inline-flex items-center gap-2 bg-[#FF5F1F] text-white px-10 py-5 rounded-full font-bold hover:bg-[#E54E10] transition-colors shadow-xl shadow-[#FF5F1F]/20"
          >
            hola@planozero.cl <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <span className="text-[10px] font-mono text-[#FF5F1F] uppercase tracking-widest mb-3 block">Preguntas frecuentes</span>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-10">
          Lo que siempre preguntan
        </h2>
        <div>
          {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
        </div>
      </section>

      {/* ── Links relacionados ────────────────────────────────────────────────── */}
      {relatedLinks.length > 0 && (
        <section className="border-t border-zinc-200 dark:border-zinc-800 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-6">También puede interesarte</p>
            <div className="flex flex-wrap gap-4">
              {relatedLinks.map((l, i) => (
                <Link
                  key={i}
                  to={l.href}
                  className="inline-flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 rounded-full text-sm font-bold hover:border-[#FF5F1F] hover:text-[#FF5F1F] transition-all"
                >
                  {l.label} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ServicePage;
