import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { 
  ChevronRight, 
  Instagram, 
  Linkedin,
  Monitor, 
  Layers, 
  Cpu, 
  PenTool, 
  ArrowUpRight,
  Menu,
  X,
  Calendar,
  Plus,
  Minus,
  Send,
  Loader2,
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// --- Shared Components (could be moved to /src/components later) ---

import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import api from '../services/api';

const MegaMenu = ({ items, isOpen, onMouseLeave }: { items: any[], isOpen: boolean, onMouseLeave: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        onMouseLeave={onMouseLeave}
        className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-[40px] p-10 grid grid-cols-4 gap-10 z-50 overflow-hidden"
      >
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <BlueprintLine className="text-[#FF5F1F]" />
        </div>

        {items.map((col, idx) => (
          <div key={idx} className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF5F1F] border-b border-zinc-100 dark:border-zinc-800 pb-3">
              {col.name}
            </h5>
            <div className="flex flex-col gap-4">
              {col.children?.map((child: any, cIdx: number) => (
                <Link 
                  key={cIdx} 
                  to={child.path}
                  className="group flex flex-col gap-1"
                >
                  <span className="text-sm font-bold group-hover:text-[#FF5F1F] transition-colors">{child.name}</span>
                  {child.description && <span className="text-[10px] text-zinc-500 line-clamp-1">{child.description}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="col-span-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-8 flex flex-col justify-between border border-zinc-100 dark:border-zinc-800">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-[#FF5F1F]/10 rounded-xl flex items-center justify-center">
               <ArrowUpRight className="w-5 h-5 text-[#FF5F1F]" />
            </div>
            <h4 className="font-black italic uppercase tracking-tighter text-xl leading-none">Explora más</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Descubre cómo nuestra ingeniería visual puede elevar tu próximo proyecto.</p>
          </div>
          <Link to="/blog" className="text-[10px] font-black uppercase tracking-widest text-[#FF5F1F] hover:underline">Ver todo el catálogo</Link>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const NavItem = ({ item, isScrolled, scrollTo }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.path.startsWith('#') ? (
        <button 
          onClick={() => scrollTo(item.path.substring(1))} 
          className={`font-medium transition-all relative group hover:text-[#FF5F1F] cursor-pointer ${isScrolled ? 'text-xs' : 'text-sm'}`}
        >
          {item.name}
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#FF5F1F] transition-all group-hover:w-full" />
        </button>
      ) : (
        <Link 
          to={item.path}
          className={`font-medium transition-all relative group hover:text-[#FF5F1F] ${isScrolled ? 'text-xs' : 'text-sm'}`}
        >
          {item.name}
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#FF5F1F] transition-all group-hover:w-full" />
        </Link>
      )}

      {item.megaMenu ? (
        <MegaMenu 
          items={item.children || []} 
          isOpen={isHovered} 
          onMouseLeave={() => setIsHovered(false)} 
        />
      ) : item.children?.length > 0 && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute top-full pt-4 min-w-[200px]"
            >
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden py-3">
                {item.children.map((child: any, idx: number) => (
                  <Link 
                    key={idx}
                    to={child.path}
                    className="block px-6 py-2.5 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-[#FF5F1F] transition-all"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const GridBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"
    ></motion.div>
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#FF5F1F10,transparent)]"
    ></motion.div>
  </div>
);

const BlueprintLine = ({ className }: { className?: string }) => (
  <svg className={`overflow-visible ${className}`} width="100%" height="100%">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.8"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
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

const Button = ({ children, variant = 'primary', className = "", ...props }: any) => {
  const variants: any = {
    primary: "bg-[#FF5F1F] text-white hover:bg-[#E54E10] shadow-lg shadow-[#FF5F1F]/20",
    outline: "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800",
    ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// --- Animations ---

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    } as any,
  },
};

// --- Main Page Sections ---

const BlueprintComputer = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8, x: 20 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
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

const ServicesAccordion = () => {
  const [active, setActive] = useState<number | null>(0);

  const services = [
    {
      title: "Branding",
      description: "Partimos donde otros no llegan: entendiendo por qué existe tu negocio. Desde ahí construimos identidades visuales que tienen coherencia real, no solo estética. Auditoría, posicionamiento, sistema de marca completo.",
      points: ["Auditoría de Ecosistema y Estrategia", "Sistemas de Identidad Visual Escalable", "Documentación Técnica de Marca", "Narrativa y Posicionamiento de Voz"],
      icon: PenTool
    },
    {
      title: "DISEÑO UX/UI",
      description: "Diseñamos interfaces que tienen lógica, no solo forma. Flujos que eliminan fricción sin que el usuario se dé cuenta, sistemas que escalan cuando el producto crece y prototipos que se testean antes de construirse.",
      points: ["Arquitectura de Información y Wireframing", "Sistemas de Diseño Atómico", "Prototipado de Alta Fidelidad", "Diseño de Interfaces Líquidas (Móvil/Web)"],
      icon: Layers
    },
    {
      title: "Desarrollo Digital",
      description: "Construimos lo que diseñamos. Desde sitios con arquitectura sólida hasta plataformas digitales que marketing puede operar sin depender de TI. Priorizamos velocidad real y código limpio sobre soluciones que se ven bien solo en la demo.",
      points: ["Evolución de Ecosistemas Legacy y DXP", "Arquitecturas No-Code, Low-Code y Vibe Code", "Optimización Crítica de Core Web Vitals", "Gobernanza y Autonomía Operativa"],
      icon: Monitor
    },
    {
      title: "Marketing Digital",
      description: "Estrategia digital sin humo. Armamos campañas que convierten porque están bien pensadas desde el principio, no porque tiremos presupuesto hasta que algo funcione.",
      points: ["Growth Marketing y Atribución", "Estrategia en Redes Sociales", "Optimización de Embudos de Conversión", "Analítica Avanzada y Dashboards de Rendimiento"],
      icon: Cpu
    }
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto py-16 relative" id="servicios">
      <div className="absolute -left-32 top-1/4 rotate-90 hidden xl:block">
        <BlueprintMeasurement label="Scale_Vertical_x2" className="w-64 text-zinc-400" />
      </div>
      <div className="absolute -right-12 top-0 hidden xl:block">
        <BlueprintCrosshair className="text-zinc-400" />
      </div>
      
      <div className="text-center mb-10 px-4">
        <span className="text-xs font-mono tracking-widest text-[#FF5F1F] uppercase mb-2 block">Nuestros Servicios</span>
        <h2 className="text-3xl md:text-5xl font-bold mb-4 italic tracking-tight">Lo que hacemos bien</h2>
        <p className="text-zinc-500 max-w-2xl mx-auto text-sm">Cuatro áreas donde trabajamos en serio, con equipos especializados y resultados que se pueden medir.</p>
        <p className="text-zinc-600 dark:text-zinc-500 max-w-xl mx-auto text-xs font-mono mt-2 tracking-wide">
          Agencia de branding · Diseño UX/UI · Marketing digital · Publicidad digital — Santiago, Chile
        </p>
      </div>

      <div className="space-y-4">
        {services.map((service, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-500 ${active === idx ? 'bg-zinc-50 dark:bg-zinc-900 shadow-xl' : 'bg-transparent'}`}
          >
            <button 
              className="w-full p-4 md:p-6 flex items-center justify-between text-left focus:outline-none"
              onClick={() => setActive(active === idx ? null : idx)}
            >
              <div className="flex items-center gap-6">
                <div className={`p-3 rounded-xl transition-colors ${active === idx ? 'bg-[#FF5F1F] text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                  <service.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg md:text-xl font-bold">{service.title}</h3>
              </div>
              {active === idx ? <Minus className="text-[#FF5F1F] w-5 h-5" /> : <Plus className="text-zinc-400 w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {active === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                >
                  <div className="px-6 pb-6 md:px-16 md:pb-8 space-y-4">
                    <p className="text-zinc-500 text-base leading-relaxed">{service.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.points.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-[#FF5F1F] rounded-full" />
                          <span className="text-sm font-medium">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ExperienceCTA = () => (
  <section className="mt-16 md:mt-24 mb-16 md:mb-24" id="experiencia">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
      <div className="space-y-6 px-0 md:px-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#FF5F1F] uppercase mb-2 block">NUESTRO BACKGROUND</span>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">Años de experiencia, una nueva visión.</h2>
        </div>
        <div className="space-y-4 text-zinc-500 text-sm md:text-base">
          <p>PlanoZero nació de un equipo con años trabajando en branding y posicionamiento para marcas reales. No empezamos de cero con cada proyecto: llegamos con contexto.</p>
          <p>Agenda una llamada de 30 minutos. Sin presentaciones corporativas: te mostramos trabajo relevante para tu sector y hablamos directo de lo que necesitas.</p>
        </div>
        <Button 
          className="w-full md:w-auto px-6 py-4 h-auto text-base"
          onClick={() => window.location.href = 'mailto:raul@planozero.cl'}
        >
          <Calendar className="w-5 h-5" />
          Agendar Sesión
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, rotate: 2 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        viewport={{ once: true }}
        className="relative px-4"
      >
        <div className="absolute inset-0 bg-[#FF5F1F] blur-[120px] opacity-10 rounded-full" />
        <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-[#FF5F1F]/10 rounded-full flex items-center justify-center text-[#FF5F1F]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Discovery Call</h3>
              <p className="text-xs text-zinc-500 font-mono">Google Meet / Zoom - 30 Min</p>
            </div>
          </div>
          
          <div className="space-y-4">
             {['Presentación de portafolio', 'Auditoría de marca y objetivos'].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                  <span className="text-sm font-medium">{item}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                </div>
             ))}
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-20">
             <BlueprintLine className="text-zinc-400" />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Philosophy = () => (
  <section className="py-12 md:py-20 relative">
    <div className="absolute inset-0 bg-[#FF5F1F]/[0.02] -skew-y-2 pointer-events-none" />
    <div className="absolute top-0 left-10 opacity-20 hidden lg:block">
      <svg width="200" height="200" viewBox="0 0 200 200" className="text-zinc-400 stroke-1 fill-none">
        <circle cx="100" cy="100" r="80" strokeDasharray="5 5" />
        <rect x="60" y="60" width="80" height="80" strokeDasharray="2 2" />
        <line x1="0" y1="100" x2="200" y2="100" />
        <line x1="100" y1="0" x2="100" y2="200" />
      </svg>
    </div>
    
    <div className="relative z-10 text-center mb-12 md:mb-16 px-4">
      <span className="text-xs font-mono tracking-widest text-[#FF5F1F] uppercase mb-3 block">NUESTRA FILOSOFÍA</span>
      <h2 className="text-3xl md:text-5xl font-bold max-w-4xl mx-auto">Diseñamos desde lo esencial para construir lo extraordinario.</h2>
      <div className="max-w-3xl mx-auto mt-6 md:mt-8 space-y-4 text-zinc-500 text-sm md:text-base leading-relaxed">
        <p>PlanoZero no es un estudio más. Somos un equipo con un punto de vista claro: cuando hay demasiado ruido, la marca que gana es la que tiene algo real que decir.</p>
        <p>Por eso cada proyecto empieza con preguntas incómodas. Y las decisiones visuales tienen que responder a algo concreto, no solo verse bien.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-0 md:px-4">
      <motion.div 
        whileHover={{ y: -10 }}
        className="p-10 rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-6"
      >
        <div className="text-6xl font-black text-[#FF5F1F]/20 font-mono">01.</div>
        <h3 className="text-3xl font-bold">Plano: El Blueprint.</h3>
        <p className="text-zinc-500 text-lg">Un proyecto bien hecho empieza con un plano. Antes de diseñar una línea, entendemos la estructura: objetivos, mercado, competencia, audiencia. Eso es lo que hace que el resultado tenga sentido.</p>
      </motion.div>

      <motion.div 
        whileHover={{ y: -10 }}
        className="p-10 rounded-[32px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-6"
      >
        <div className="text-6xl font-black text-[#FF5F1F]/20 font-mono">02.</div>
        <h3 className="text-3xl font-bold">Zero: La Esencia.</h3>
        <p className="text-zinc-500 text-lg">Partimos de cero con cada marca porque copiar lo que funciona para otros no es estrategia. El lienzo en blanco no es falta de referencias: es disciplina para no contaminar el proceso.</p>
      </motion.div>
    </div>
  </section>
);

const ProcessTimeline = () => {
  const steps = [
    { num: '01', title: 'Descubrimiento', desc: 'Antes de diseñar una sola pantalla, hacemos las preguntas difíciles. ¿Qué problema resuelves realmente? ¿Por qué te elegiría alguien? Eso define todo lo que viene después.' },
    { num: '02', title: 'Identidad', desc: 'Traducimos lo que encontramos en un lenguaje visual que funciona en cualquier soporte. Sin atajos ni plantillas: sistemas que comunican algo específico sobre ti.' },
    { num: '03', title: 'Aplicación', desc: 'Llevamos el sistema a donde vive: web, app, campañas, puntos de venta. Diseñamos para que cada pieza refuerce a las demás.' },
    { num: '04', title: 'Lanzamiento', desc: 'Salimos al aire con todo revisado. Y nos quedamos: el trabajo post-lanzamiento suele ser donde se gana o se pierde lo que se construyó.' }
  ];

  return (
    <section className="py-16 md:py-24 relative" id="proceso">
      <div className="absolute top-20 right-0 opacity-10 pointer-events-none hidden lg:block">
        <BlueprintLine className="w-96 h-96 text-zinc-400" />
      </div>

      <div className="text-center mb-10 md:mb-16 px-4">
        <span className="text-xs font-mono tracking-widest text-[#FF5F1F] uppercase mb-4 block">NUESTRO PROCESO</span>
        <h2 className="text-3xl md:text-5xl font-bold">Movimiento Hacia Adelante</h2>
      </div>

      <div className="relative px-0 md:px-4">
        <div className="absolute top-[4.5rem] left-0 w-full h-[1px] bg-zinc-200 dark:bg-zinc-800 hidden md:flex items-center justify-between px-32 italic text-[8px] font-mono text-zinc-300">
           <span>X_AXIS_01</span>
           <span>FLOW_CONV_99</span>
           <span>FIN_STAGE</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 text-center md:text-left"
            >
              <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-950 border-2 border-[#FF5F1F] flex items-center justify-center font-mono font-bold text-[#FF5F1F] mb-8 shadow-xl mx-auto md:mx-0">
                 {step.num}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-zinc-500 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactForm = () => {
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
  
  // Math Captcha state
  const [captcha, setCaptcha] = useState({ a: 0, b: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [botField, setBotField] = useState(''); // Honeypot

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setCaptcha({
      a: Math.floor(Math.random() * 10) + 1,
      b: Math.floor(Math.random() * 10) + 1
    });
    setCaptchaInput('');
  };

  const sanitize = (text: string) => {
    return text
      .replace(/<[^>]*>?/gm, '') // Remove HTML tags
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check
    if (botField) {
      console.warn("Bot detected via honeypot");
      return; 
    }

    // Captcha check
    if (parseInt(captchaInput) !== captcha.a + captcha.b) {
      alert("La suma es incorrecta. Por favor intenta de nuevo.");
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      // Sanitize inputs
      const cleanData = {
        name: sanitize(formData.name),
        company: sanitize(formData.company),
        position: sanitize(formData.position),
        email: sanitize(formData.email),
        phone: sanitize(formData.phone),
        idea: sanitize(formData.idea)
      };

      await api.contacts.create({
        ...cleanData,
        status: 'pending'
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Hubo un error al enviar el mensaje. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-6 text-center space-y-3"
      >
        <div className="w-12 h-12 bg-[#FF5F1F]/10 rounded-full flex items-center justify-center text-[#FF5F1F]">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-bold">¡Mensaje Recibido!</h4>
          <p className="text-sm text-zinc-400">Nuestro equipo revisará tu idea y te responderemos pronto.</p>
        </div>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="text-xs py-2">
          Enviar otro mensaje
        </Button>
      </motion.div>
    );
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
           <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Nombre</label>
           <input 
            required
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5F1F] transition-all" 
           />
        </div>
        <div className="space-y-1">
           <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Empresa</label>
           <input 
            type="text" 
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            className="w-full text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5F1F] transition-all" 
           />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
           <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Cargo</label>
           <input 
            type="text" 
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
            className="w-full text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5F1F] transition-all" 
           />
        </div>
        <div className="space-y-1">
           <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Email</label>
           <input 
            required
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5F1F] transition-all" 
           />
        </div>
      </div>
      <div className="space-y-1">
         <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Número (Opcional)</label>
         <input 
          type="tel" 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5F1F] transition-all" 
         />
      </div>
      <div className="space-y-1">
         <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Cuéntanos sobre tu idea...</label>
         <textarea 
          required
          value={formData.idea}
          onChange={(e) => setFormData({...formData, idea: e.target.value})}
          className="w-full h-20 text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5F1F] transition-all resize-none" 
         />
      </div>

      {/* Honeypot field (hidden from users) */}
      <div className="hidden" aria-hidden="true">
        <input 
          type="text" 
          value={botField} 
          onChange={(e) => setBotField(e.target.value)} 
          tabIndex={-1} 
          autoComplete="off" 
        />
      </div>

      {/* Math Captcha */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-row items-center justify-between gap-3">
        <div className="space-y-0.5">
          <label className="text-[9px] font-mono text-[#FF5F1F] uppercase tracking-widest font-bold">Anti-Spam</label>
          <p className="text-xs text-zinc-400">¿Cuánto es {captcha.a} + {captcha.b}?</p>
        </div>
        <input 
          required
          type="number"
          placeholder="Resultado"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          className="bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 w-24 focus:outline-none focus:border-[#FF5F1F] text-center text-sm font-bold"
        />
      </div>

      <Button className="w-full py-3 text-sm" type="submit" disabled={loading}>
        {loading ? (
          <>
            ENVIANDO...
            <Loader2 className="w-5 h-5 animate-spin" />
          </>
        ) : (
          <>
            ENVIAR MENSAJE
            <Send className="w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  );
};

// --- Home Component ---

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await api.menus.getAll();
        if (data && data.length > 0) {
          // Map menus to expected format — menus have items array, extract nav items
          const navItems = data.flatMap((menu: any) =>
            Array.isArray(menu.items) && menu.items.length > 0
              ? menu.items
              : [{ name: menu.name, path: menu.path || '#', order: menu.order || 99 }]
          );
          setMenus(navItems.length > 0 ? navItems : data);
        } else {
          // Default fallback
          setMenus([
            { name: 'Servicios', path: '#servicios' },
            { name: 'Experiencia', path: '#experiencia' },
            { name: 'Proceso', path: '#proceso' },
            { name: 'Blog', path: '/blog' }
          ]);
        }
      } catch (e) {
        console.error(e);
        setMenus([
          { name: 'Servicios', path: '#servicios' },
          { name: 'Experiencia', path: '#experiencia' },
          { name: 'Proceso', path: '#proceso' },
          { name: 'Blog', path: '/blog' }
        ]);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-[#FF5F1F] selection:text-white transition-colors duration-500 overflow-x-hidden">
      <Helmet>
        <html lang="es-CL" />
        <title>PLANOZERO | Agencia de Branding y Diseño Web</title>
        <meta name="description" content="Agencia de branding y diseño web de alta gama con una estética técnica de blueprint. Creamos experiencias digitales precisas para marcas ambiciosas en Chile y el mundo." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content="PLANOZERO | Agencia de Branding y Diseño Web" />
        <meta property="og:description" content="Agencia de branding y diseño web de alta gama con una estética técnica de blueprint. Creamos experiencias digitales precisas." />
        <meta property="og:image" content={`${window.location.origin}/og-main.png`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={window.location.href} />
        <meta name="twitter:title" content="PLANOZERO | Agencia de Branding y Diseño Web" />
        <meta name="twitter:description" content="Agencia de branding y diseño web de alta gama con una estética técnica de blueprint." />
        <meta name="twitter:image" content={`${window.location.origin}/og-main.png`} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "PLANOZERO",
            "url": window.location.origin,
            "logo": `${window.location.origin}/logo.svg`,
            "sameAs": [
              "https://instagram.com/planozero.cl",
              "https://linkedin.com/company/planozero"
            ],
            "description": "Agencia de branding y diseño web de alta gama con una estética técnica de blueprint.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Santiago",
              "addressCountry": "CL"
            }
          })}
        </script>
      </Helmet>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 dark:bg-zinc-950/90 backdrop-blur-xl py-3 border-b border-zinc-200 dark:border-zinc-800 shadow-lg shadow-[#FF5F1F]/5' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-500">
          <Logo className={`transition-transform duration-500 ${isScrolled ? 'scale-90 origin-left' : 'scale-100'}`} />
          
          <div className={`hidden md:flex items-center transition-all duration-500 ${isScrolled ? 'gap-8' : 'gap-10'}`}>
            {menus.map((item) => (
              <NavItem 
                key={item.id || item.name} 
                item={item} 
                isScrolled={isScrolled} 
                scrollTo={scrollTo} 
              />
            ))}
            <Button 
              onClick={() => scrollTo('contacto')}
              className={`transition-all duration-500 ${isScrolled ? 'px-5 py-2 text-xs' : 'px-6 py-3 text-sm'}`}
            >
              LET'S BUILD
            </Button>
          </div>

          <button className={`md:hidden p-2 transition-transform duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`} onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-zinc-950 p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <Logo />
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-8 h-8 text-white" />
              </button>
            </div>
            <div className="flex flex-col gap-8 text-4xl font-bold">
              {menus.map((item, i) => {
                const isAnchor = item.path.startsWith('#');
                return isAnchor ? (
                  <motion.button 
                    key={item.id || item.name} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (0.1 * i) }}
                    onClick={() => scrollTo(item.path.substring(1))}
                    className="text-left text-white hover:text-[#FF5F1F] transition-colors"
                  >
                    {item.name}
                  </motion.button>
                ) : (
                  <motion.div
                    key={item.id || item.name} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (0.1 * i) }}
                  >
                    <Link 
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white hover:text-[#FF5F1F] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-auto">
               <Button 
                className="w-full justify-center py-6 text-xl"
                onClick={() => scrollTo('contacto')}
               >
                LET'S BUILD
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" className="w-full relative overflow-hidden pt-32 md:pt-40 pb-20">
        <GridBackground />

        {/* Hero Section */}
        <section className="relative z-10 mb-12 md:mb-24 px-6 lg:px-12">
          <div className="absolute top-10 right-1/4 hidden xl:block">
            <BlueprintMeasurement label="Module_Padding_40px" className="w-40 text-zinc-300 -rotate-12" />
          </div>
          <div className="absolute left-0 bottom-0 hidden xl:block">
            <BlueprintCrosshair className="text-zinc-200" />
          </div>
          
          <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-4xl"
            >
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-mono mb-6 md:mb-8 border border-zinc-200 dark:border-zinc-700"
              >
                <div className="w-1.5 h-1.5 bg-[#FF5F1F] rounded-full" />
                BRAND STRATEGY / EVOLVE
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.95] md:leading-[0.85] mb-8 uppercase"
              >
                La arquitectura<br />
                de tu marca,<br />
                <span className="text-[#FF5F1F]">desde lo esencial.</span>
              </motion.h1>
              <motion.div variants={itemVariants} className="max-w-xl space-y-8 md:space-y-10">
                <p className="text-lg md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium leading-tight">
                  Somos un estudio de branding y diseño con obsesión por la precisión. Trabajamos con marcas que quieren comunicar algo real y duradero, no solo verse bien por un tiempo.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="w-full md:w-auto px-10 py-5 h-auto text-lg group"
                    onClick={() => scrollTo('contacto')}
                  >
                    LET'S BUILD
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
            
            <BlueprintComputer />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          <ServicesAccordion />
          <ExperienceCTA />
          <Philosophy />
          <ProcessTimeline />

          {/* Final CTA Bar / Clients */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8 opacity-50 grayscale hover:grayscale-0 transition-opacity duration-1000"
          >
             <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#FF5F1F]">CON QUÉ TRABAJAMOS:</p>
             <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                <img src="https://cdn.simpleicons.org/wordpress/808080" alt="WordPress" loading="lazy" decoding="async" className="h-7 md:h-9 object-contain" referrerPolicy="no-referrer" />
                <img src="https://cdn.simpleicons.org/webflow/808080" alt="Webflow" loading="lazy" decoding="async" className="h-5 md:h-7 object-contain" referrerPolicy="no-referrer" />
                <img src="https://cdn.simpleicons.org/blueprint/808080" alt="PlanoZero" loading="lazy" decoding="async" className="h-7 md:h-9 object-contain" referrerPolicy="no-referrer" />
                <img src="https://cdn.simpleicons.org/googleads/808080" alt="Google Ads" loading="lazy" decoding="async" className="h-7 md:h-9 object-contain" referrerPolicy="no-referrer" />
                <img src="https://cdn.simpleicons.org/meta/808080" alt="Meta Business" loading="lazy" decoding="async" className="h-7 md:h-9 object-contain" referrerPolicy="no-referrer" />
             </div>
          </motion.div>
        </div>
      </main>

      {/* Contact Section */}
      <section id="contacto" className="py-8 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5F1F]/5 blur-[80px] rounded-full -mr-32 -mt-32" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6 items-start">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#FF5F1F] uppercase mb-2 block italic">Let's build together</span>
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-[0.9] italic">
                  ¿Tienes un <br />
                  <span className="text-[#FF5F1F]">proyecto?</span>
                </h2>
                <p className="mt-2 text-sm text-zinc-500 max-w-xs leading-relaxed font-medium">
                  Cuéntanos qué tienes en mente. Sin formularios eternos, sin reuniones previas a la reunión.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shadow-sm group-hover:border-[#FF5F1F] transition-all shrink-0">
                    <Mail className="w-4 h-4 text-[#FF5F1F]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold">hola@planozero.cl</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shadow-sm group-hover:border-[#FF5F1F] transition-all shrink-0">
                    <Phone className="w-4 h-4 text-[#FF5F1F]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">WhatsApp</p>
                    <p className="text-sm font-bold">+569 5530 8095</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 md:p-6 rounded-2xl shadow-lg relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-5">
                <BlueprintLine className="text-zinc-400" />
              </div>
              <h3 className="text-sm font-black italic tracking-tight mb-3 uppercase">Inicia tu proyecto</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
