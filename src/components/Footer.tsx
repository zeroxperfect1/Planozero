import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import Logo from './Logo';

const BlueprintLine = ({ className }: { className?: string }) => (
  <svg className={`overflow-visible ${className}`} width="100%" height="100%">
    <defs>
      <pattern id="grid-footer" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.8"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-footer)" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white py-16 relative overflow-hidden border-t border-white/5">
      {/* Background Design */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BlueprintLine className="absolute inset-0 text-white/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <Logo className="scale-110 origin-left" />
            <p className="text-zinc-400 text-lg max-w-sm leading-relaxed">
              Estudio de diseño estratégico y branding enfocado en la precisión técnica y la narrativa visual.
            </p>
            <div className="flex gap-4">
              <motion.a 
                whileHover={{ scale: 1.1, backgroundColor: "#FF5F1F" }}
                href="https://instagram.com/planozero.cl" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/5 border border-white/10 rounded-full transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, backgroundColor: "#0077B5" }}
                href="https://linkedin.com/company/planozero" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/5 border border-white/10 rounded-full transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-[#FF5F1F] font-bold">Contacto</h5>
            <ul className="space-y-4">
              <li>
                <a href="mailto:hola@planozero.cl" className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#FF5F1F]/10 transition-colors">
                    <Mail className="w-4 h-4 text-[#FF5F1F]" />
                  </div>
                  <span className="text-sm font-medium">hola@planozero.cl</span>
                </a>
              </li>
              <li>
                <a href="tel:+56955308095" className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#FF5F1F]/10 transition-colors">
                    <Phone className="w-4 h-4 text-[#FF5F1F]" />
                  </div>
                  <span className="text-sm font-medium">+56 9 5530 8095</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-[#FF5F1F] font-bold">Ubicación</h5>
            <div className="space-y-2">
              <p className="text-zinc-400 text-sm leading-relaxed">
                Santiago, Chile<br />
                Trabajando de forma remota para el mundo.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest">
            © 2026 PLANOZERO. Todos los derechos reservados.
          </p>
          <div className="flex gap-8 text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
            <span className="opacity-50">Santiago_CL</span>
            <span className="opacity-50">v2.0.5</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
