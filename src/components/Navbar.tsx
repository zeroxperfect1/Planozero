import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Plus } from 'lucide-react';
import api from '../services/api';
import Logo from './Logo';

interface MenuItem {
  name: string;
  path: string;
  order?: number;
  megaMenu?: boolean;
  children?: { name: string; path: string }[];
}

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        // Fetch pages that should be in navigation
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
        
        const combined = [...dynamicPages, ...customMenus].sort((a, b) => (a.order || 0) - (b.order || 0));

        if (combined.length > 0) {
          setMenus(combined);
        } else {
          setMenus([
            { name: 'Servicios', path: '#servicios' },
            { name: 'Experiencia', path: '#experiencia' },
            { name: 'Proceso', path: '#proceso' }
          ]);
        }
      } catch (e) {
        console.error("Error fetching menus:", e);
        setMenus([
          { name: 'Servicios', path: '#servicios' },
          { name: 'Experiencia', path: '#experiencia' },
          { name: 'Proceso', path: '#proceso' }
        ]);
      }
    };
    fetchMenus();
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setActiveMenu(null);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            {hasChildren && <ChevronRight className="w-3 h-3 rotate-90" />}
          </button>
        ) : (
          <Link 
            to={item.path}
            className={`font-bold hover:text-[#FF5F1F] transition-all flex items-center gap-1 ${isScrolled ? 'text-xs' : 'text-sm'}`}
          >
            {item.name}
            {hasChildren && <ChevronRight className="w-3 h-3 rotate-90" />}
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

export default Navbar;
