import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Plus, PenTool, Layers, Monitor, Cpu, ArrowUpRight } from 'lucide-react';
import api from '../services/api';
import Logo from './Logo';

interface MenuItem {
  name: string;
  path: string;
  order?: number;
  megaMenu?: boolean;
  children?: { name: string; path: string }[];
}

// ── Servicios para el mega menu ──────────────────────────────────────────────
const SERVICES_MEGA = [
  {
    title: 'Branding',
    description: 'Tu marca merece más que un logo. Identidad visual, posicionamiento y sistema completo.',
    path: '/agencia-branding',
    icon: PenTool,
    tag: 'Estrategia'
  },
  {
    title: 'Diseño UX/UI',
    description: 'Interfaces que se entienden solas. Flujos sin fricción, sistemas que escalan.',
    path: '/diseno-ux-ui',
    icon: Layers,
    tag: 'Experiencia'
  },
  {
    title: 'Diseño Web',
    description: 'Tu sitio web hecho para convertir. Rápido, bien construido, fácil de operar.',
    path: '/diseno-web',
    icon: Monitor,
    tag: 'Tecnología'
  },
  {
    title: 'Marketing y Publicidad',
    description: 'Marketing que trae clientes reales. Pauta digital, SEO y estrategia sin humo.',
    path: '/agencia-marketing-digital',
    icon: Cpu,
    tag: 'Performance'
  },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mega menu on route change
  useEffect(() => {
    setServicesOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const allPages = await api.pages.getAll();
        const dynamicPages: MenuItem[] = allPages
          .filter((p: any) => p.published && p.showInNavigation)
          .map((data: any) => ({
            name: data.title.split('|')[0].trim(),
            path: data.slug === 'inicio' ? '/' : `/${data.slug}`,
            order: data.order || 99
          }));

        const allMenus = await api.menus.getAll();
        const customMenus: MenuItem[] = allMenus
          .map((data: any) => ({
            name: data.name || data.title,
            path: data.path || data.slug || '#',
            order: data.order || 0,
            megaMenu: data.megaMenu,
            published: data.published,
            children: Array.isArray(data.items) ? data.items.filter((item: any) => item.published !== false) :
                      (data.children || []).filter((child: any) => child.published !== false)
          }))
          .filter((menu: any) => menu.published !== false);

        const anchorItems: MenuItem[] = [
          { name: 'Experiencia', path: '#experiencia', order: 20 },
          { name: 'Proceso',     path: '#proceso',     order: 30 },
        ];
        const blogItem: MenuItem = { name: 'Blog', path: '/blog', order: 50 };

        const combined = [
          ...anchorItems,
          ...dynamicPages.map(p => ({ ...p, order: p.order ?? 40 })),
          ...customMenus,
          blogItem,
        ].sort((a, b) => (a.order || 0) - (b.order || 0));

        setMenus(combined);
      } catch (e) {
        console.error("Error fetching menus:", e);
        setMenus([
          { name: 'Experiencia', path: '#experiencia' },
          { name: 'Proceso',     path: '#proceso' },
          { name: 'Blog',        path: '/blog' },
        ]);
      }
    };
    fetchMenus();
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setActiveMenu(null);
    setServicesOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const NavItem = ({ item, index }: { item: MenuItem, index: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    return (
      <div
        className="relative group"
        onMouseEnter={() => setActiveMenu(index)}
        onMouseLeave={() => setActiveMenu(null)}
      >
        {item.path.startsWith('#') ? (
          <button
            onClick={() => scrollTo(item.path.substring(1))}
            className={`font-bold hover:text-[#FF5F1F] transition-all flex items-center gap-1 ${isScrolled ? 'text-xs' : 'text-sm'}`}
          >
            {item.name}
            {hasChildren && <ChevronDown className="w-3 h-3" />}
          </button>
        ) : (
          <Link
            to={item.path}
            className={`font-bold hover:text-[#FF5F1F] transition-all flex items-center gap-1 ${isScrolled ? 'text-xs' : 'text-sm'}`}
          >
            {item.name}
            {hasChildren && <ChevronDown className="w-3 h-3" />}
          </Link>
        )}

        <AnimatePresence>
          {activeMenu === index && hasChildren && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 z-[60] ${item.megaMenu ? 'w-[600px]' : 'w-56'}`}
            >
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-4">
                <div className={`grid ${item.megaMenu ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-1'}`}>
                  {item.children?.map((child, cIdx) => (
                    <div key={cIdx}>
                      {child.path.startsWith('#') ? (
                        <button
                          onClick={() => scrollTo(child.path.substring(1))}
                          className="w-full text-left p-3 rounded-xl hover:bg-[#FF5F1F]/5 hover:text-[#FF5F1F] transition-all text-[11px] font-black uppercase tracking-widest"
                        >
                          {child.name}
                        </button>
                      ) : (
                        <Link
                          to={child.path}
                          className="block p-3 rounded-xl hover:bg-[#FF5F1F]/5 hover:text-[#FF5F1F] transition-all text-[11px] font-black uppercase tracking-widest"
                        >
                          {child.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 dark:bg-zinc-950/90 backdrop-blur-xl py-3 border-b border-zinc-200 dark:border-zinc-800'
            : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Logo className={`transition-transform duration-500 ${isScrolled ? 'scale-90 origin-left' : 'scale-100'}`} />

          {/* Desktop Nav */}
          <nav className={`hidden md:flex items-center transition-all duration-500 ${isScrolled ? 'gap-8' : 'gap-10'}`}>

            {/* ── SERVICIOS MEGA MENU ─────────────────────────────── */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesOpen(v => !v)}
                onMouseEnter={() => setServicesOpen(true)}
                className={`font-bold hover:text-[#FF5F1F] transition-all flex items-center gap-1.5 ${isScrolled ? 'text-xs' : 'text-sm'} ${servicesOpen ? 'text-[#FF5F1F]' : ''}`}
              >
                Servicios
                <motion.span animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    onMouseLeave={() => setServicesOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-5 z-[60] w-[680px]"
                  >
                    {/* Blueprint corner decorations */}
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[28px] shadow-2xl shadow-zinc-900/20 overflow-hidden">
                      {/* Header del mega menu */}
                      <div className="px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-[#FF5F1F] uppercase tracking-widest">Lo que hacemos</span>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Agencia de branding y diseño en Santiago, Chile</p>
                        </div>
                        <button
                          onClick={() => { scrollTo('servicios'); setServicesOpen(false); }}
                          className="text-[10px] font-mono text-zinc-400 hover:text-[#FF5F1F] transition-colors flex items-center gap-1 uppercase tracking-widest"
                        >
                          Ver todos <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Grid de servicios */}
                      <div className="grid grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-800">
                        {SERVICES_MEGA.map((svc, i) => (
                          <Link
                            key={i}
                            to={svc.path}
                            onClick={() => setServicesOpen(false)}
                            className="group relative bg-white dark:bg-zinc-950 p-5 hover:bg-[#FF5F1F]/[0.03] dark:hover:bg-[#FF5F1F]/[0.05] transition-all duration-300"
                          >
                            {/* Icono + tag */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-[#FF5F1F]/10 transition-colors">
                                <svc.icon className="w-4 h-4 text-zinc-500 group-hover:text-[#FF5F1F] transition-colors" />
                              </div>
                              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 group-hover:text-[#FF5F1F]/60 transition-colors">
                                {svc.tag}
                              </span>
                            </div>

                            {/* Texto */}
                            <h3 className="text-sm font-black uppercase tracking-tight mb-1.5 group-hover:text-[#FF5F1F] transition-colors">
                              {svc.title}
                            </h3>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                              {svc.description}
                            </p>

                            {/* Arrow indicator */}
                            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-[#FF5F1F] transition-all duration-300 absolute bottom-5 right-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        ))}
                      </div>

                      {/* Footer del mega menu */}
                      <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                          PLANOZERO · Santiago, Chile
                        </span>
                        <button
                          onClick={() => { scrollTo('contacto'); setServicesOpen(false); }}
                          className="text-[10px] font-mono bg-[#FF5F1F] text-white px-3 py-1.5 rounded-full uppercase tracking-widest hover:bg-[#E54E10] transition-colors"
                        >
                          Contactar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* ── FIN MEGA MENU ───────────────────────────────────── */}

            {menus.map((item, idx) => (
              <NavItem key={idx} item={item} index={idx} />
            ))}

            <button
              onClick={() => scrollTo('contacto')}
              className={`bg-[#FF5F1F] text-white rounded-full font-bold transition-all hover:bg-[#E54E10] shadow-lg shadow-[#FF5F1F]/20 ${
                isScrolled ? 'px-5 py-2 text-xs' : 'px-6 py-3 text-sm'
              }`}
            >
              LET'S BUILD
            </button>
          </nav>

          <button className={`md:hidden transition-transform duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`} onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 p-6 md:hidden overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <Logo />
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto pb-24">

              {/* Servicios mobile — expandible */}
              <MobileServicesAccordion onNavigate={() => setMobileMenuOpen(false)} />

              {menus.map((item, idx) => {
                const hasChildren = item.children && item.children.length > 0;
                return (
                  <div key={idx} className="space-y-4">
                    {item.path.startsWith('#') ? (
                      <button
                        onClick={() => scrollTo(item.path.substring(1))}
                        className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-2"
                      >
                        {item.name}
                        {hasChildren && <Plus className="w-6 h-6 text-[#FF5F1F]" />}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-2"
                      >
                        {item.name}
                        {hasChildren && <Plus className="w-6 h-6 text-[#FF5F1F]" />}
                      </Link>
                    )}

                    {hasChildren && (
                      <div className="pl-6 flex flex-col gap-4 border-l border-zinc-100 dark:border-zinc-800">
                        {item.children?.map((child, cIdx) => (
                          <div key={cIdx}>
                            {child.path.startsWith('#') ? (
                              <button
                                onClick={() => scrollTo(child.path.substring(1))}
                                className="text-xl font-bold uppercase tracking-tighter text-zinc-400 hover:text-[#FF5F1F]"
                              >
                                {child.name}
                              </button>
                            ) : (
                              <Link
                                to={child.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xl font-bold uppercase tracking-tighter text-zinc-400 hover:text-[#FF5F1F]"
                              >
                                {child.name}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => scrollTo('contacto')}
                className="w-full bg-[#FF5F1F] text-white py-10 rounded-3xl text-2xl font-black uppercase italic tracking-tighter mt-4"
              >
                LET'S BUILD
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Servicios expandible en mobile ───────────────────────────────────────────
const MobileServicesAccordion = ({ onNavigate }: { onNavigate: () => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <button
        onClick={() => setOpen(v => !v)}
        className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-2 w-full text-left"
      >
        Servicios
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="w-6 h-6 text-[#FF5F1F]" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-6 flex flex-col gap-5 border-l-2 border-[#FF5F1F]/30 pb-2">
              {SERVICES_MEGA.map((svc, i) => (
                <Link
                  key={i}
                  to={svc.path}
                  onClick={onNavigate}
                  className="group flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#FF5F1F]/10 transition-colors">
                    <svc.icon className="w-4 h-4 text-zinc-500 group-hover:text-[#FF5F1F] transition-colors" />
                  </div>
                  <div>
                    <div className="text-xl font-bold uppercase tracking-tighter text-zinc-400 group-hover:text-[#FF5F1F] transition-colors">
                      {svc.title}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono mt-0.5">{svc.tag}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
