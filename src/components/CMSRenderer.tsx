import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap,
  Bell,
  Users,
  Mail,
  ImageIcon,
  ArrowLeft,
  Quote,
  ChevronRight,
  Send,
  Calendar as CalendarIcon,
  Code,
  Rocket,
  ArrowUpRight,
  Plus,
  Minus,
  PenTool,
  Layers,
  Monitor,
  Cpu,
  Calendar,
  CheckCircle2,
  Loader2,
  Phone,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import api from '../services/api';


export interface CMSNode {
  id: string;
  type: string;
  props: Record<string, any>;
  zones?: CMSZone[];
  hidden?: boolean;
}

export interface CMSZone {
  id: string;
  children: CMSNode[];
}

export interface CMSPageData {
  title: string;
  slug: string;
  root: CMSZone;
  published: boolean;
}

// --- Helpers from Home.tsx ---

const BlueprintLine = ({ className }: { className?: string }) => (
  <svg className={`overflow-visible ${className}`} width="100%" height="100%">
    <defs>
      <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.8"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
  </svg>
);

const BlueprintMeasurement = ({ className, label }: { className?: string; label: string }) => (
  <div className={`flex flex-col items-center gap-1 ${className}`}>
    <div className="flex items-center w-full gap-0">
      <div className="w-[1px] h-3 bg-current opacity-30" />
      <div className="flex-1 h-[1px] bg-current opacity-30" />
      <div className="w-[1px] h-3 bg-current opacity-30" />
    </div>
    <span className="text-[8px] font-mono opacity-40 uppercase tracking-tighter">{label}</span>
  </div>
);

const BlueprintCrosshair = ({ className }: { className?: string }) => (
  <div className={`relative w-8 h-8 ${className}`}>
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[0.5px] bg-current opacity-30" />
    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[0.5px] bg-current opacity-30" />
    <div className="absolute inset-0 border border-current rounded-full opacity-20 scale-75" />
  </div>
);

const BlueprintComputer = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8, x: 20 }}
    whileInView={{ opacity: 1, scale: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    className="relative hidden lg:block w-[500px] h-[400px] flex-shrink-0"
  >
    <div className="absolute inset-0 bg-[#FF5F1F]/5 blur-[100px] rounded-full" />
    <svg viewBox="0 0 400 300" fill="none" className="w-full h-full text-[#FF5F1F]/40 stroke-[0.5]">
      <motion.rect 
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        x="50" y="40" width="300" height="200" rx="10" 
        stroke="currentColor" 
      />
      <rect x="60" y="50" width="280" height="160" rx="4" stroke="currentColor" strokeDasharray="4 4" />
      <path d="M170 240 L230 240 L210 270 L190 270 Z" stroke="currentColor" />
      <path d="M150 270 L250 270" stroke="currentColor" />
      <motion.circle 
        animate={{ r: [1, 3, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        cx="100" cy="80" r="2" fill="currentColor" 
      />
      <line x1="120" y1="80" x2="300" y2="80" stroke="currentColor" strokeOpacity="0.2" />
      <line x1="100" y1="100" x2="300" y2="100" stroke="currentColor" strokeOpacity="0.2" />
      <rect x="100" y="120" width="60" height="40" stroke="currentColor" fill="currentColor" fillOpacity="0.05" />
      <rect x="180" y="120" width="120" height="60" stroke="currentColor" fill="currentColor" fillOpacity="0.05" />
      <motion.line 
        animate={{ y1: [55, 205, 55], y2: [55, 205, 55] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        x1="65" y1="55" x2="335" y2="55" stroke="#FF5F1F" strokeWidth="0.5" strokeOpacity="0.5" 
      />
      <text x="65" y="225" fill="currentColor" fontSize="6" fontFamily="monospace" className="uppercase tracking-widest">Sys_Status: Active</text>
      <text x="280" y="225" fill="currentColor" fontSize="6" fontFamily="monospace" className="uppercase opacity-50">v2.01</text>
    </svg>
  </motion.div>
);

export const WIDGET_COMPONENTS: Record<string, React.FC<any>> = {
  HeroSplit: ({ title, content, image }) => (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-24 px-6 items-center">
      <div className="space-y-8">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">{title}</h1>
        <p className="text-xl text-zinc-500 leading-relaxed font-medium">{content}</p>
        <button className="px-10 py-5 bg-[#FF5F1F] rounded-2xl text-xs font-black uppercase tracking-widest text-shadow shadow-xl shadow-[#FF5F1F]/20">Explorar ahora</button>
      </div>
      {image && (
        <div className="rounded-[48px] overflow-hidden border border-zinc-800 shadow-2xl aspect-square">
          <img src={image || undefined} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Hero split" referrerPolicy="no-referrer" />
        </div>
      )}
    </section>
  ),
  VideoWidget: ({ url, title }) => (
    <div className="my-12 space-y-6">
      {title && <h3 className="text-3xl font-black italic uppercase tracking-tighter text-center">{title}</h3>}
      <div className="aspect-video w-full rounded-[40px] md:rounded-[64px] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-zinc-900">
        <iframe 
          src={(url && url.includes('embed')) ? url : `https://www.youtube.com/embed/${url?.split('v=')[1] || url?.split('/').pop()}`}
          className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
          allowFullScreen
          title={title || "Video"}
        />
      </div>
    </div>
  ),
  Breadcrumbs: ({ dark }) => (
    <nav className="flex items-center gap-2 mb-8 text-[10px] font-mono uppercase tracking-[0.2em] font-black">
      <span className={dark ? 'text-zinc-400' : 'text-zinc-500 hover:text-[#FF5F1F] cursor-pointer'}>Inicio</span>
      <span className="text-zinc-600">/</span>
      <span className="text-[#FF5F1F]">Páginas de Arquitectura</span>
    </nav>
  ),
  BentoGrid: () => (
    <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[600px] my-16">
      <div className="col-span-2 row-span-2 bg-zinc-900 rounded-3xl p-10 border border-zinc-800">
        <h4 className="text-4xl font-black uppercase italic mb-4">Funcionalidad Core</h4>
        <p className="text-zinc-500">Expresividad visual maximalista integrada en un diseño bento.</p>
      </div>
      <div className="col-span-2 bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800"></div>
      <div className="bg-[#FF5F1F] rounded-3xl flex items-center justify-center"><Zap className="w-12 h-12 text-white" /></div>
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800"></div>
    </div>
  ),
  Banner: ({ text, type }) => (
    <div className={`py-4 px-8 rounded-2xl flex items-center gap-4 my-8 font-mono uppercase text-[10px] font-bold tracking-widest ${type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-[#FF5F1F]/10 text-[#FF5F1F] border border-[#FF5F1F]/20'}`}>
      <Bell className="w-4 h-4" /> {text || 'Banner informativo del sistema'}
    </div>
  ),
  Logos: ({ urls }) => (
    <div className="py-20 flex flex-wrap justify-center gap-16 grayscale opacity-30 hover:opacity-100 transition-opacity">
      {(urls || '').split(',').map((u: string, i: number) => {
         const src = u.trim();
         if (!src) return null;
         return (
           <img key={i} src={src} className="h-12 object-contain" alt="Partner Logo" referrerPolicy="no-referrer" />
         );
      })}
    </div>
  ),
  Team: ({ name, role }) => (
    <div className="text-center group">
      <div className="w-full aspect-square bg-zinc-900 rounded-[40px] border border-zinc-800 mb-6 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-zinc-800">
           <Users className="w-20 h-20" />
        </div>
      </div>
      <h4 className="text-xl font-black uppercase italic tracking-tight group-hover:text-[#FF5F1F] transition-colors">{name}</h4>
      <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">{role}</p>
    </div>
  ),
  Newsletter: ({ title, placeholder }) => (
    <div className="bg-zinc-900 rounded-[48px] p-16 border border-zinc-800 text-center space-y-8 my-16">
       <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-[#FF5F1F]" />
       </div>
       <h3 className="text-4xl font-black uppercase italic tracking-tighter">{title || 'Únete a la Vanguardia'}</h3>
       <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
          <input className="bg-zinc-950 border border-zinc-800 px-8 py-5 rounded-2xl flex-grow focus:outline-none focus:border-[#FF5F1F] font-mono text-xs uppercase" placeholder={placeholder || 'TU CORREO ELECTRÓNICO'} />
          <button className="bg-[#FF5F1F] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest">SUSCRIBIRSE</button>
       </div>
    </div>
  ),
  NewsList: ({ limit, category }: { limit?: number; category?: string }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          let data = await api.posts.getPublished() as any[];
          data = data.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : (a.createdAt?.seconds || 0) * 1000;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : (b.createdAt?.seconds || 0) * 1000;
            return dateB - dateA;
          });
          if (category) data = data.filter((p: any) => p.category === category);
          setPosts(data.slice(0, limit || 3));
        } catch (e) {
          console.error('NewsList error:', e);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }, [limit, category]);

    if (loading) return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-[#FF5F1F] animate-spin" />
      </div>
    );

    return (
      <div className="my-16 space-y-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length === 0 ? (
            <p className="text-zinc-500 font-mono text-sm uppercase col-span-3 text-center py-12">Sin publicaciones aún.</p>
          ) : posts.map((post: any, i: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-[#FF5F1F]/5 transition-all duration-500"
            >
              <Link to={`/blog/${post.slug || post.id}`} className="block">
                <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#FF5F1F] uppercase border border-zinc-200 dark:border-zinc-700">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 uppercase">
                    <Clock className="w-3 h-3" /> 5 MIN
                  </div>
                  <h3 className="text-xl font-bold leading-tight group-hover:text-[#FF5F1F] transition-colors">{post.title}</h3>
                  <p className="text-zinc-500 text-sm line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#FF5F1F] uppercase mt-2">
                    Leer más <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    );
  },

  BlogSection: ({ title }) => (

    <div className="my-24 space-y-12">
       <div className="flex justify-between items-end">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{title || 'Últimas Historias'}</h2>
          <div className="text-[10px] font-black uppercase text-zinc-500 hover:text-white cursor-pointer select-none">Ver Archivo Completo →</div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
             <div key={i} className="space-y-6 group">
                <div className="aspect-[4/5] bg-zinc-900 rounded-[40px] border border-zinc-800 overflow-hidden relative" >
                   <div className="absolute top-6 left-6 px-4 py-2 bg-black backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest z-10 border border-white/5">DISEÑO</div>
                   <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-700">
                      <ImageIcon className="w-12 h-12" />
                   </div>
                </div>
                <div className="space-y-3 px-2">
                   <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">14 de Mayo, 2026 — LECTURA 5 MIN</p>
                   <h4 className="text-xl font-black uppercase italic tracking-tight leading-tight group-hover:text-[#FF5F1F] transition-colors">La Decadencia Estética de lo Minimalista en la Era de la IA</h4>
                </div>
             </div>
          ))}
       </div>
    </div>
  ),
  CTASection: ({ title, buttonText }) => (
    <div className="bg-[#FF5F1F] p-12 md:p-24 rounded-[64px] my-24 overflow-hidden relative group">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-black text-black/5 select-none pointer-events-none uppercase italic italic-fitter">ACTION</div>
       <div className="relative z-10 text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white">{title || '¿Listo para el cambio?'}</h2>
          <button className="bg-white text-black px-16 py-8 rounded-[32px] font-black uppercase text-sm tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
             {buttonText || 'EMPEZAR AHORA'}
          </button>
       </div>
    </div>
  ),
  Footer: ({ copy }) => (
    <footer className="py-24 border-t border-zinc-900 mt-24 bg-zinc-950 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-3xl font-black italic tracking-tighter uppercase">PLANOZERO</div>
        <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <a href="#" className="hover:text-[#FF5F1F]">Agencia</a>
          <a href="#" className="hover:text-[#FF5F1F]">Trabajos</a>
          <a href="#" className="hover:text-[#FF5F1F]">Estudio</a>
        </div>
        <div className="text-[10px] font-mono text-zinc-700 uppercase">{copy || '© 2026 PlanoZero. Todos los derechos reservados.'}</div>
      </div>
    </footer>
  ),
  NotFound: ({ message }) => (
    <div className="flex flex-col items-center justify-center p-24 text-center">
      <h1 className="text-[150px] font-black italic leading-none text-[#FF5F1F]/10 tracking-tighter">404</h1>
      <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 italic">{message || 'Página Extraviada'}</h2>
    </div>
  ),
  Hero: ({ title, subtitle, ctaText }) => (
    <section className="py-32 px-6 text-center bg-zinc-900 rounded-[56px] my-16 border border-zinc-800 shadow-2xl">
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="text-7xl font-black mb-8 uppercase tracking-tighter italic leading-none"
      >
        {title || 'Título del Hero'}
      </motion.h1>
      <p className="text-xl text-zinc-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">{subtitle}</p>
      {ctaText && (
        <button className="bg-[#FF5F1F] text-white px-12 py-6 rounded-2xl font-black uppercase text-sm shadow-2xl shadow-[#FF5F1F]/40 hover:scale-105 transition-transform">
          {ctaText}
        </button>
      )}
    </section>
  ),
  Card: ({ title, content, image, link }) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] overflow-hidden group hover:border-[#FF5F1F] transition-all duration-500 hover:-translate-y-2">
      {image && <img src={image || undefined} alt={title} className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />}
      <div className="p-10">
        <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">{title}</h3>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed line-clamp-3">{content}</p>
        {link && (
          <a href={link} className="inline-flex items-center gap-2 text-[#FF5F1F] text-xs font-black uppercase tracking-widest group/link">
            DESCUBRIR MÁS <ArrowLeft className="w-4 h-4 rotate-180 group-hover/link:translate-x-1 transition-transform" />
          </a>
        )}
      </div>
    </div>
  ),
  ImageWidget: ({ url, alt, caption }) => (
    <figure className="my-12 space-y-4 group">
      <div className="rounded-[40px] overflow-hidden border border-zinc-800 shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <img 
          src={url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'} 
          alt={alt || 'CMS Image'} 
          className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" 
          referrerPolicy="no-referrer"
        />
      </div>
      {caption && (
        <figcaption className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest text-center italic">
          — {caption}
        </figcaption>
      )}
    </figure>
  ),
  Pricing: ({ title, price, features }) => (
    <div className="bg-zinc-950 border border-zinc-900 p-12 rounded-[48px] text-center hover:border-[#FF5F1F]/30 transition-all">
      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF5F1F] mb-6">{title}</h4>
      <div className="flex items-center justify-center gap-1 mb-10">
        <span className="text-2xl text-zinc-700">$</span>
        <span className="text-6xl font-black tracking-tighter italic">{price}</span>
      </div>
      <ul className="space-y-4 mb-12 text-zinc-500 text-sm font-mono uppercase">
        {features?.split('\n').filter(Boolean).map((f: string, i: number) => (
          <li key={i} className="flex items-center justify-center gap-2 italic">
            <div className="w-1 h-1 bg-[#FF5F1F] rounded-full" /> {f.trim()}
          </li>
        ))}
      </ul>
      <button className="w-full py-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#FF5F1F] hover:text-white transition-all">
        EMPEZAR AHORA
      </button>
    </div>
  ),
  Testimonial: ({ quote, author }) => (
    <div className="bg-zinc-900/50 p-12 rounded-[48px] border border-zinc-800 relative overflow-hidden">
      <Quote className="absolute top-8 right-8 w-16 h-16 text-[#FF5F1F]/5 -rotate-12" />
      <p className="text-2xl font-medium text-zinc-300 italic mb-10 leading-snug">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-1 text-[#FF5F1F] rounded-full" />
        <span className="text-xs font-black uppercase tracking-widest italic">{author}</span>
      </div>
    </div>
  ),
  FAQ: ({ question, answer }) => (
    <div className="mb-6 group">
      <details className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden cursor-pointer group-open:border-[#FF5F1F]/30 transition-all">
        <summary className="p-8 list-none flex items-center justify-between font-bold uppercase text-sm tracking-tight text-zinc-300 group-open:text-[#FF5F1F]">
          {question}
          <div className="w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center transition-transform group-open:rotate-180">
            <ChevronRight className="w-4 h-4" />
          </div>
        </summary>
        <div className="p-8 pt-0 text-zinc-500 text-sm leading-relaxed font-mono uppercase">
          {answer}
        </div>
      </details>
    </div>
  ),
  Stats: ({ value, label }) => (
    <div className="p-10 bg-zinc-950 border border-zinc-900 rounded-[40px] text-center">
      <div className="text-5xl font-black text-[#FF5F1F] mb-2 tracking-tighter italic">{value}</div>
      <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.2em]">{label}</div>
    </div>
  ),
  LandingPage: ({ theme }) => (
    <div className={`min-h-screen flex flex-col items-center justify-center p-12 text-center ${theme === 'light' ? 'bg-zinc-100 text-zinc-900' : 'bg-black text-white'}`}>
       <div className="w-24 h-24 bg-[#FF5F1F] rounded-[32px] flex items-center justify-center mb-10 shadow-2xl shadow-[#FF5F1F]/50">
          <Rocket className="w-12 h-12 text-white" />
       </div>
       <h1 className="text-8xl font-black uppercase italic tracking-tighter mb-6 leading-none">Lanzamiento Próximo</h1>
       <p className="text-zinc-500 max-w-xl mb-12">Estamos construyendo la próxima evolución del diseño maximalista. Suscríbete para el acceso anticipado.</p>
       <div className="w-full max-w-md flex gap-4">
          <input className="bg-zinc-900 border border-zinc-800 px-8 py-5 rounded-2xl flex-grow focus:outline-none focus:border-[#FF5F1F]" placeholder="TU EMAIL" />
          <button className="bg-[#FF5F1F] px-8 rounded-2xl font-black">OK</button>
       </div>
    </div>
  ),
  Video: ({ url }) => (
    <div className="aspect-video w-full rounded-[48px] overflow-hidden border border-zinc-800 shadow-2xl my-12 bg-zinc-900">
      <iframe 
        src={`https://www.youtube.com/embed/${url}`}
        className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
        allowFullScreen
      />
    </div>
  ),
  Content: ({ body }) => (
    <div className="prose prose-invert max-w-none py-16 px-8 bg-zinc-900/20 rounded-[48px] border border-zinc-900/50">
      <p className="text-zinc-400 leading-loose text-lg font-medium whitespace-pre-wrap selection:bg-[#FF5F1F]/40">{body}</p>
    </div>
  ),
  Carousel: ({ urls }) => {
    const images = (urls || '').split(',').map((u: string) => u.trim()).filter(Boolean);
    return (
      <div className="flex gap-8 overflow-x-auto py-12 snap-x no-scrollbar -mx-6 px-6">
        {images.map((url: string, i: number) => (
          <div key={i} className="min-w-[400px] h-[550px] rounded-[56px] overflow-hidden snap-center shadow-2xl border border-zinc-800">
            <img src={url || undefined} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Carousel item" referrerPolicy="no-referrer" />
          </div>
        ))}
      </div>
    );
  },
  Calendar: ({ title }) => (
    <div className="bg-zinc-900 p-12 rounded-[56px] border border-zinc-800 text-center shadow-2xl">
      <CalendarIcon className="w-12 h-12 text-[#FF5F1F] mx-auto mb-6" />
      <h3 className="text-2xl font-black uppercase mb-10 italic tracking-tighter">{title || 'Próximos Eventos'}</h3>
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 31 }).map((_, i) => (
          <div key={i} className={`aspect-square flex items-center justify-center text-[10px] font-mono rounded-2xl transition-all cursor-pointer ${i === 14 ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-white'}`}>
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  ),
  Form: ({ formId, submitText }) => (
    <form className="space-y-6 bg-zinc-950 p-12 rounded-[56px] border border-zinc-900 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5F1F]/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
      <h3 className="text-3xl font-black uppercase tracking-tighter mb-10 italic">Inscribirse / {formId}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="text" placeholder="NOMBRE COMPLETO" className="bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#FF5F1F] text-xs font-mono uppercase tracking-widest placeholder:text-zinc-700" />
        <input type="email" placeholder="CORREO ELECTRÓNICO" className="bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#FF5F1F] text-xs font-mono uppercase tracking-widest placeholder:text-zinc-700" />
      </div>
      <textarea placeholder="DETALLES ADICIONALES" className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-5 focus:outline-none focus:border-[#FF5F1F] h-40 text-xs font-mono uppercase tracking-widest placeholder:text-zinc-700" />
      <button className="group relative w-full bg-[#FF5F1F] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#FF5F1F]/20 overflow-hidden">
        <span className="relative z-10">{submitText || 'ENVIAR SOLICITUD'}</span>
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </button>
    </form>
  ),
  Code: ({ html, css, js }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!containerRef.current) return;
      
      const shadowContainer = containerRef.current;
      
      if (css) {
        const style = shadowContainer.querySelector('style') || document.createElement('style');
        style.textContent = css;
        if (!style.parentElement) shadowContainer.appendChild(style);
      }

      if (js) {
        const scriptId = `script-${Math.random().toString(36).substr(2, 9)}`;
        const script = document.createElement('script');
        script.id = scriptId;
        script.textContent = `(function(){ try { ${js} } catch(e){ console.error("CMS Code Error:", e); } })();`;
        document.body.appendChild(script);
        return () => {
          const oldScript = document.getElementById(scriptId);
          if (oldScript) oldScript.remove();
        };
      }
    }, [css, js, html]);

    return (
      <div className="cms-code-injector my-12 overflow-hidden rounded-[48px] bg-zinc-900 border border-zinc-800 shadow-2xl" ref={containerRef}>
        <div dangerouslySetInnerHTML={{ __html: html || '' }} />
      </div>
    );
  },
  Grid: ({ columns, gap, children, editing }) => (
    <div className={`grid ${columns || 'grid-cols-1'} ${gap || 'gap-16'} ${editing ? 'min-h-[200px]' : 'my-16 px-6'} relative`}>
      {children}
    </div>
  ),

  // --- New PlanoZero Advanced Widgets ---

  MainHero: ({ title, part1, part2, subtitle, ctaText }) => (
    <section className="relative z-10 mb-12 md:mb-24 px-6 lg:px-12 py-32 md:py-40">
      <div className="absolute top-10 right-1/4 hidden xl:block text-zinc-300">
        <BlueprintMeasurement label="Scale_Vertical_x2" className="w-40 -rotate-12" />
      </div>
      <div className="absolute left-0 bottom-0 hidden xl:block text-zinc-200">
        <BlueprintCrosshair />
      </div>
      
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-4xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-mono mb-6 md:mb-8 border border-zinc-200 dark:border-zinc-700 uppercase tracking-widest font-black">
            <div className="w-1.5 h-1.5 bg-[#FF5F1F] rounded-full" />
            BRAND STRATEGY / EVOLVE
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.95] md:leading-[0.85] mb-8 uppercase">
            {part1 || 'La arquitectura de tu marca,'} <br />
            <span className="text-[#FF5F1F]">{part2 || 'desde lo esencial.'}</span>
          </h1>
          <div className="max-w-xl space-y-8 md:space-y-10">
            <p className="text-lg md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium leading-tight">
              {subtitle || 'Estudio de branding y diseño estratégico enfocado en la precisión técnica y la narrativa visual. Descubrimos la esencia de tu negocio para materializarla en arquitecturas digitales que redefinen el estándar de tu industria.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#FF5F1F] text-white px-10 py-5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[#E54E10] shadow-lg shadow-[#FF5F1F]/20 text-lg group"
              >
                {ctaText || "LET'S BUILD"}
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
        
        <BlueprintComputer />
      </div>
    </section>
  ),

  ServicesAccordion: ({ title, subtitle, ...props }) => {
    const [active, setActive] = useState<number | null>(0);
    
    const iconMap: Record<string, any> = {
      PenTool, Layers, Monitor, Cpu, Rocket, Zap, Users, Mail, Calendar, Code, Phone, CheckCircle2
    };

    const services = [
      {
        title: props.s1Title || "Branding",
        description: props.s1Desc || "Decodificamos la esencia de tu negocio para transformarla en una narrativa visual poderosa. Desde la auditoría de ecosistema y el posicionamiento estratégico, hasta sistemas de identidad sensorial y manuales de marca técnicos que aseguran una presencia coherente y dominante.",
        points: (props.s1Points || "Auditoría de Ecosistema y Estrategia;Sistemas de Identidad Visual Escalable;Documentación Técnica de Marca;Narrativa y Posicionamiento de Voz").split(';').map((p: string) => p.trim()),
        icon: iconMap[props.s1Icon] || PenTool
      },
      {
        title: props.s2Title || "DISEÑO UX/UI",
        description: props.s2Desc || "Diseño de experiencias centrada en la interacción humana. Construímos sistemas de diseño atómicos y flujos lógicos que eliminan la fricción, optimizan la conversión y garantizan una usabilidad intuitiva en productos digitales complejos.",
        points: (props.s2Points || "Arquitectura de Información;Sistemas de Diseño Atómico;Prototipado de Alta Fidelidad;Diseño de Interfaces Líquidas").split(';').map((p: string) => p.trim()),
        icon: iconMap[props.s2Icon] || Layers
      },
      {
        title: props.s3Title || "Desarrollo Digital",
        description: props.s3Desc || "Orquestamos infraestructuras digitales end-to-end que fusionan escalabilidad técnica con agilidad operativa. Desde la modernización de sistemas legacy hasta arquitecturas DXP, equilibrramos frontends de alto rendimiento con backends robustos.",
        points: (props.s3Points || "Evolución de Ecosistemas;Arquitecturas No-Code/Low-Code;Optimización Core Web Vitals;Gobernanza Operativa").split(';').map((p: string) => p.trim()),
        icon: iconMap[props.s3Icon] || Monitor
      },
      {
        title: props.s4Title || "Marketing Digital",
        description: props.s4Desc || "Estrategias de crecimiento basadas en datos y análisis predictivo. Optimizamos cada etapa del funnel de marketing para capturar, convertir y retener audiencias mediante el uso inteligente de plataformas digitales.",
        points: (props.s4Points || "Growth Marketing;Estrategia Algorítmica;Optimización de Embudos;Analítica Avanzada").split(';').map((p: string) => p.trim()),
        icon: iconMap[props.s4Icon] || Cpu
      }
    ];

    return (
      <section className="space-y-4 max-w-5xl mx-auto py-24 relative" id="servicios">
        <div className="absolute -left-32 top-1/4 rotate-90 hidden xl:block">
          <BlueprintMeasurement label="Scale_Vertical_x4" className="w-64 text-zinc-400" />
        </div>
        <div className="absolute -right-12 top-0 hidden xl:block">
          <BlueprintCrosshair className="text-zinc-400" />
        </div>
        
        <div className="text-center mb-16 px-4">
          <span className="text-xs font-mono tracking-widest text-[#FF5F1F] uppercase mb-4 block font-black">{subtitle || 'Nuestros Servicios'}</span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 italic tracking-tighter uppercase leading-none">{title || 'Soluciones integrales de diseño'}</h2>
          <p className="text-zinc-500 max-w-3xl mx-auto text-xl font-medium leading-relaxed">Soluciones integrales pensadas para elevar tu marca, desde la estrategia inicial hasta la ejecución visual en todos los puntos de contacto.</p>
        </div>

        <div className="space-y-6">
          {services.map((service, idx) => (
            <div 
              key={idx}
              className={`border border-zinc-200 dark:border-zinc-800 rounded-[40px] overflow-hidden transition-all duration-700 ${active === idx ? 'bg-zinc-50 dark:bg-zinc-900 shadow-2xl' : 'bg-transparent'}`}
            >
              <button 
                className="w-full p-5 md:p-7 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setActive(active === idx ? null : idx)}
              >
                <div className="flex items-center gap-10">
                  <div className={`p-4 rounded-[16px] transition-all duration-500 ${active === idx ? 'bg-[#FF5F1F] text-white rotate-6 scale-110' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none">{service.title}</h3>
                </div>
                <div className={`w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-all duration-500 ${active === idx ? 'bg-[#FF5F1F] border-[#FF5F1F] text-white rotate-180' : ''}`}>
                  {active === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>
              
              <AnimatePresence>
                {active === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-8 pb-10 md:px-20 md:pb-12 space-y-8">
                      <p className="text-zinc-500 text-lg leading-relaxed font-medium">{service.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                        {service.points.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-4 group">
                            <div className="w-2 h-2 bg-[#FF5F1F] rounded-full scale-100 group-hover:scale-150 transition-transform duration-300" />
                            <span className="text-base font-black uppercase tracking-tighter leading-none">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    );
  },

  ExperienceBanner: ({ title, subtitle, points, ctaText }) => (
    <section className="py-32 px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950/50 border-y border-zinc-100 dark:border-zinc-900" id="experiencia">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-center max-w-7xl mx-auto">
        <div className="space-y-12">
          <div>
            <span className="text-xs font-mono tracking-[0.4em] text-[#FF5F1F] uppercase mb-4 block font-black">{subtitle || 'NUESTRO BACKGROUND'}</span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none">{title || 'Años de experiencia, una nueva visión.'}</h2>
          </div>
          <div className="space-y-8 text-zinc-500 text-xl md:text-2xl font-medium leading-relaxed">
            <p>PlanoZero nace como un estudio enfocado en la excelencia visual, pero nuestro equipo cuenta con un historial comprobado en la creación y posicionamiento de marcas exitosas.</p>
            <p className="text-lg opacity-80">Agenda una sesión estratégica de 30 minutos. Hablaremos de la visión de tu marca y te mostraremos nuestro portafolio adaptado a tu industria.</p>
          </div>
          <button className="bg-[#FF5F1F] text-white px-12 py-6 rounded-full font-black flex items-center justify-center gap-6 shadow-[0_20px_50px_rgba(255,95,31,0.3)] hover:scale-105 active:scale-95 transition-all text-xl uppercase tracking-widest italic leading-none group">
            <Calendar className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            {ctaText || 'Agendar Sesión'}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-[#FF5F1F] blur-[180px] opacity-10 rounded-full" />
          <motion.div 
            whileHover={{ y: -15, rotate: -1.5, scale: 1.02 }}
            className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[56px] p-12 md:p-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] overflow-hidden group"
          >
            <div className="flex items-center gap-8 mb-16">
              <div className="w-20 h-20 bg-[#FF5F1F]/10 rounded-[28px] flex items-center justify-center text-[#FF5F1F]">
                <Calendar className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Discovery Call</h3>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] mt-2">Google Meet / Zoom - 30 Min</p>
              </div>
            </div>
            
            <div className="space-y-8">
               {(points || 'Presentación de portafolio,Auditoría de marca y objetivos').split(',').map((item: string, i: number) => (
                  <div key={i} className="flex items-center justify-between p-8 bg-zinc-50 dark:bg-zinc-800/80 rounded-[32px] border border-zinc-100 dark:border-zinc-700/50 hover:border-[#FF5F1F]/50 group/item transition-all duration-500">
                    <span className="text-xl font-black uppercase tracking-tighter leading-none">{item.trim()}</span>
                    <ArrowUpRight className="w-6 h-6 text-zinc-400 group-hover/item:text-[#FF5F1F] group-hover/item:translate-x-1 group-hover/item:-translate-y-1 transition-all" />
                  </div>
               ))}
            </div>

            <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none opacity-20">
               <BlueprintLine className="text-zinc-300" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  ),

  PhilosophyGrid: ({ title, subtitle, part1Title, part1Desc, part2Title, part2Desc }) => (
    <section className="py-24 md:py-32 relative overflow-hidden px-6">
      <div className="absolute inset-0 bg-[#FF5F1F]/[0.02] -skew-y-3 pointer-events-none" />
      
      <div className="relative z-10 text-center mb-16 md:mb-24">
        <span className="text-xs font-mono tracking-[0.4em] text-[#FF5F1F] uppercase mb-5 block font-black">{subtitle || 'NUESTRA FILOSOFÍA'}</span>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter max-w-5xl mx-auto leading-none">{title || 'Diseñamos desde lo esencial para construir lo extraordinario.'}</h2>
        <div className="max-w-3xl mx-auto mt-10 space-y-6 text-zinc-500 text-xl font-medium leading-relaxed">
          <p>PlanoZero no es solo un estudio de diseño; somos arquitectos de identidad. Creemos firmemente que, en un ecosistema saturado de ruido visual, la claridad es el activo más valioso de una marca.</p>
          <p>Nuestro equipo garantiza que cada decisión visual tenga un propósito comercial real y medible.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
        <motion.div 
          whileHover={{ y: -10 }}
          className="p-12 md:p-16 rounded-[48px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-10 hover:shadow-2xl transition-all duration-700"
        >
          <div className="text-7xl font-black text-[#FF5F1F]/20 font-mono italic tracking-tighter">01.</div>
          <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{part1Title || 'Plano: El Blueprint.'}</h3>
          <p className="text-zinc-500 text-xl leading-relaxed font-medium">{part1Desc || 'La base estructurada, la arquitectura visual y el diseño meticuloso. Representa el plano maestro sobre el cual planificamos y proyectamos el futuro de tu marca.'}</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -10 }}
          className="p-12 md:p-16 rounded-[48px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-10 hover:shadow-2xl transition-all duration-700"
        >
          <div className="text-7xl font-black text-[#FF5F1F]/20 font-mono italic tracking-tighter">02.</div>
          <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{part2Title || 'Zero: La Esencia.'}</h3>
          <p className="text-zinc-500 text-xl leading-relaxed font-medium">{part2Desc || 'El lienzo en blanco. Evoca nuestra mentalidad de trabajo: cero fricciones, cero ruido visual, volviendo siempre a lo que es verdaderamente esencial para conectar.'}</p>
        </motion.div>
      </div>
    </section>
  ),

  TimelineSection: ({ title, subtitle, stepsCsv }) => {
    const steps = (stepsCsv || '01:Descubrimiento:Iniciamos con una auditoría profunda. Analizamos datos y objetivos para trazar un roadmap estratégico que alinee tu visión con las demandas del mercado.,02:Identidad:Diseñamos lenguajes visuales escalables. Construimos sistemas modulares que transmiten autoridad y coherencia en cada punto de contacto.,03:Aplicación:Transformamos conceptos en arquitecturas digitales. Desarrollamos interfaces fluidas y estrategias UX/UI diseñadas para convertir y retener.,04:Lanzamiento:Llevamos tu proyecto al mercado con precisión. Incluimos optimización post-lanzamiento para que tu marca domine y evolucione continuamente.')
      .split(',')
      .map((s: string) => {
        const [num, title, desc] = s.split(':');
        return { num, title, desc };
      });

    return (
      <section className="py-24 md:py-40 px-6 relative overflow-hidden" id="proceso">
        <div className="absolute top-[30%] right-[-10%] opacity-5 pointer-events-none hidden lg:block scale-150">
          <BlueprintLine className="w-[800px] h-[800px] text-[#FF5F1F]" />
        </div>
        
        <div className="text-center mb-16 md:mb-24">
          <span className="text-xs font-mono tracking-[0.5em] text-[#FF5F1F] uppercase mb-5 block font-black">{subtitle || 'NUESTRO PROCESO'}</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none">{title || 'Movimiento Hacia Adelante'}</h2>
        </div>

        <div className="max-w-7xl mx-auto relative">
           <div className="absolute top-[4.5rem] left-0 w-full h-[1px] bg-zinc-200 dark:bg-zinc-800 hidden md:flex items-center justify-between px-32 italic text-[8px] font-mono text-zinc-400 font-bold tracking-[0.2em]">
              <span>X_AXIS_01</span>
              <span>FLOW_CONV_99</span>
              <span>FIN_STAGE</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12 lg:gap-20">
             {steps.map((step, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.2, duration: 0.8 }}
                 className="relative z-10 text-center md:text-left group"
               >
                 <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-950 border-2 border-[#FF5F1F] flex items-center justify-center font-mono font-bold text-[#FF5F1F] mb-10 shadow-2xl mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-500">
                    {step.num}
                 </div>
                 <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-6 leading-none">{step.title}</h3>
                 <p className="text-zinc-500 text-lg leading-relaxed font-medium opacity-80">{step.desc}</p>
               </motion.div>
             ))}
           </div>
        </div>
      </section>
    );
  },

  PartnersCloud: ({ title, urls }) => (
    <div className="py-24 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-12 max-w-7xl mx-auto px-6 mb-24">
       <p className="font-mono text-xs uppercase tracking-[0.3em] font-black text-[#FF5F1F]">{title || 'CON QUÉ TRABAJAMOS:'}</p>
       <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
          {(urls || 'WordPress, Webflow, Sitefinity, Google Ads, Meta Business, Shopify Partner, AI Studio Google').split(',').map((u: string, i: number) => {
             const lower = u.trim().toLowerCase();
             let slug = lower.replace(/\s+/g, '');
             
             // Precise mapping for specific slugs
             if (lower.includes('sitefinity') || lower.includes('progress')) slug = 'progress';
             if (lower.includes('meta')) slug = 'meta';
             if (lower.includes('google ads')) slug = 'googleads';
             if (lower.includes('shopify')) slug = 'shopify';
             if (lower.includes('ai studio') || lower.includes('gemini')) slug = 'googlegemini';
             if (lower.includes('wordpress')) slug = 'wordpress';
             if (lower.includes('webflow')) slug = 'webflow';
             
             return (
               <div key={i} className="flex flex-col items-center gap-3">
                 <img src={slug ? `https://cdn.simpleicons.org/${slug}/808080` : undefined} alt={u} className="h-10 md:h-12 object-contain" referrerPolicy="no-referrer" />
                 <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-500">{u.trim()}</span>
               </div>
             );
          })}
       </div>
    </div>
  ),

  ContactPanel: ({ title, part1, part2, email, phone }) => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      company: '',
      position: '',
      email: '',
      phone: '',
      idea: ''
    });
    
    const [captcha, setCaptcha] = useState({ a: 0, b: 0 });
    const [captchaInput, setCaptchaInput] = useState('');

    useEffect(() => {
      setCaptcha({
        a: Math.floor(Math.random() * 10) + 1,
        b: Math.floor(Math.random() * 10) + 1
      });
    }, []);

    const resetCaptcha = () => {
      setCaptcha({
        a: Math.floor(Math.random() * 10) + 1,
        b: Math.floor(Math.random() * 10) + 1
      });
      setCaptchaInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (parseInt(captchaInput) !== captcha.a + captcha.b) {
        alert("La suma es incorrecta. Por favor intenta de nuevo.");
        resetCaptcha();
        return;
      }
      setLoading(true);
      try {
        await api.contacts.create({
          ...formData,
          status: 'pending'
        });
        setSubmitted(true);
      } catch (error) {
        console.error("Error submitting contact form:", error);
        alert("Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    if (submitted) {
      return (
        <section className="py-12 px-6 bg-zinc-950 flex items-center justify-center text-center">
          <div className="space-y-4 max-w-md">
            <div className="w-14 h-14 bg-[#FF5F1F]/10 rounded-full flex items-center justify-center mx-auto text-[#FF5F1F]">
               <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none">¡Mensaje Recibido!</h2>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed">Nuestro equipo revisará tu idea y te contactaremos a la brevedad.</p>
            </div>
            <button 
              onClick={() => { setSubmitted(false); resetCaptcha(); setFormData({name:'', company:'', position:'', email:'', phone:'', idea:''}); }}
              className="text-[#FF5F1F] font-bold uppercase tracking-[0.3em] text-xs hover:tracking-[0.4em] transition-all"
            >
              ENVIAR OTRA IDEA →
            </button>
          </div>
        </section>
      );
    }

    return (
      <section className="py-10 md:py-16 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 px-6 overflow-hidden" id="contacto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-8 items-start">
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-[0.9] italic relative z-10">
                {part1 || 'Inicia tu'} <br />
                <span className="text-[#FF5F1F]">{part2 || 'proyecto'}</span>
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm group-hover:bg-[#FF5F1F] group-hover:border-[#FF5F1F] transition-all duration-500 shrink-0">
                  <Mail className="w-5 h-5 text-[#FF5F1F] group-hover:text-white transition-all" />
                </div>
                <div>
                  <p className="text-[9px] font-black font-mono text-zinc-500 uppercase tracking-[0.3em] leading-none">Email</p>
                  <p className="text-sm font-black tracking-tighter">{email || 'hola@planozero.cl'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm group-hover:bg-[#FF5F1F] group-hover:border-[#FF5F1F] transition-all duration-500 shrink-0">
                  <Phone className="w-5 h-5 text-[#FF5F1F] group-hover:text-white transition-all" />
                </div>
                <div>
                  <p className="text-[9px] font-black font-mono text-zinc-500 uppercase tracking-[0.3em] leading-none">WhatsApp</p>
                  <p className="text-sm font-black tracking-tighter">{phone || '+569 5530 8095'}</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-900 font-black italic uppercase tracking-widest text-[#FF5F1F]/40 flex items-center gap-4 text-xs">
               <span>Santiago, Chile</span>
               <div className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-800 rounded-full" />
               <span>Operación Global</span>
            </div>
          </div>

          <div className="relative">
            <form onSubmit={handleSubmit} className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 md:p-8 rounded-2xl shadow-lg space-y-4">
              <h3 className="text-base font-black italic uppercase tracking-tighter leading-none mb-2">{title || 'Brief del Proyecto'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                   <label className="text-[9px] font-black font-mono text-zinc-400 uppercase tracking-[0.3em] ml-2 leading-none">Nombre</label>
                   <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Tu nombre" 
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:border-[#FF5F1F] transition-all font-medium placeholder:text-zinc-400" 
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black font-mono text-zinc-400 uppercase tracking-[0.3em] ml-2 leading-none">Empresa</label>
                   <input 
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    placeholder="Empresa" 
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:border-[#FF5F1F] transition-all font-medium placeholder:text-zinc-400" 
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                   <label className="text-[9px] font-black font-mono text-zinc-400 uppercase tracking-[0.3em] ml-2 leading-none">Cargo</label>
                   <input 
                    value={formData.position}
                    onChange={e => setFormData({...formData, position: e.target.value})}
                    placeholder="Tu cargo" 
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:border-[#FF5F1F] transition-all font-medium placeholder:text-zinc-400" 
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black font-mono text-zinc-400 uppercase tracking-[0.3em] ml-2 leading-none">Email</label>
                   <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="tu@email.com" 
                    className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:border-[#FF5F1F] transition-all font-medium placeholder:text-zinc-400" 
                   />
                </div>
              </div>

              <div className="space-y-1">
                 <label className="text-[9px] font-black font-mono text-zinc-400 uppercase tracking-[0.3em] ml-2 leading-none">Número (Opcional)</label>
                 <input 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+56 9 ..." 
                  className="w-full text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:border-[#FF5F1F] transition-all font-medium placeholder:text-zinc-400" 
                 />
              </div>

              <div className="space-y-1">
                 <label className="text-[9px] font-black font-mono text-zinc-400 uppercase tracking-[0.3em] ml-2 leading-none">Cuéntanos sobre tu idea...</label>
                 <textarea 
                  required
                  value={formData.idea}
                  onChange={e => setFormData({...formData, idea: e.target.value})}
                  placeholder="Describe la visión de tu proyecto" 
                  className="w-full h-24 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-[#FF5F1F] resize-none transition-all font-medium placeholder:text-zinc-400 leading-snug" 
                 />
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/80 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700/50 flex flex-row items-center justify-between gap-4">
                 <div className="space-y-0.5">
                    <span className="text-[9px] font-black font-mono text-[#FF5F1F] uppercase tracking-[0.3em] leading-none">Anti-Spam</span>
                    <p className="text-sm font-black italic tracking-tighter leading-none">¿Cuánto es {captcha.a} + {captcha.b}?</p>
                 </div>
                 <input 
                  required
                  type="number"
                  value={captchaInput}
                  onChange={e => setCaptchaInput(e.target.value)}
                  placeholder="?"
                  className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 w-20 text-center font-black text-base focus:border-[#FF5F1F] transition-all"
                 />
              </div>

              <button 
                disabled={loading}
                className="group relative w-full py-3 bg-[#FF5F1F] text-white font-black rounded-xl shadow-lg uppercase tracking-[0.15em] italic text-sm hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
                  {!loading && <Send className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
};

export const CMSZoneRenderer = ({ zone, editing }: { zone: CMSZone, editing?: boolean }) => {
  if (!zone || !zone.children) return null;
  return (
    <>
      {zone.children.map(node => (
        <CMSRenderNode key={node.id} node={node} editing={editing} />
      ))}
    </>
  );
};

export const CMSRenderNode = ({ node, editing }: { node: CMSNode, editing?: boolean }) => {
  if (node.hidden && !editing) return null;
  const Component = WIDGET_COMPONENTS[node.type];
  if (!Component) return <div className="p-4 bg-red-500/10 text-red-500 rounded-xl text-xs">Componente "{node.type}" no encontrado</div>;

  const customClasses = Array.isArray(node.props?.customCss) 
    ? node.props.customCss.join(' ') 
    : (node.props?.customCss || '');
  
  const content = node.type === 'Grid' ? (
    <Component {...node.props} editing={editing}>
      {!editing && node.zones?.map(z => (
        <div key={z.id} className="w-full">
          <CMSZoneRenderer zone={z} />
        </div>
      ))}
    </Component>
  ) : (
    <Component {...node.props} editing={editing} />
  );

  return (
    <div id={node.id} className={customClasses}>
      {content}
    </div>
  );
};
