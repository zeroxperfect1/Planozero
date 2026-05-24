import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'motion/react';
import { 
  Loader2, 
  Layout, 
  ArrowLeft, 
  Send, 
  Calendar as CalendarIcon, 
  Square, 
  Code, 
  Image as ImageIcon, 
  DollarSign, 
  MessageSquare, 
  HelpCircle, 
  BarChart3, 
  Video, 
  Quote, 
  ChevronRight, 
  LayoutGrid, 
  Bell, 
  Users, 
  Cloud, 
  Maximize, 
  Rocket, 
  Search, 
  Zap,
  Mail,
  FileText
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { CMSPageData, CMSZoneRenderer } from '../components/CMSRenderer';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import BlueprintLoader from '../components/BlueprintLoader';

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

const FALLBACK_HOME: any = {
  id: 'fallback-inicio',
  slug: 'inicio',
  title: 'PLANOZERO | Ingeniería Visual',
  published: true,
  root: {
    id: 'root',
    children: [
       {
        id: 'pz-hero',
        type: 'MainHero',
        props: {
          part1: 'La arquitectura',
          part2: 'de tu marca,',
          part3: 'desde lo esencial.',
          subtitle: 'Somos un estudio de branding y diseño con obsesión por la precisión. Trabajamos con marcas que quieren comunicar algo real y duradero, no solo verse bien por un tiempo.',
          ctaText: "LET'S BUILD"
        }
      },
      {
        id: 'pz-services',
        type: 'ServicesAccordion',
        props: {
          title: 'Soluciones integrales de diseño',
          subtitle: 'Nuestros Servicios',
          s1Title: 'Branding',
          s1Desc: 'Descubrimos la esencia de tu negocio para transformarla en una narrativa visual poderosa. Desde la auditoría de ecosistema y el posicionamiento estratégico, hasta identidades corporativas y manuales de marca que aseguran una presencia coherente y dominante.',
          s1Points: 'Auditoría de Ecosistema y Estrategia;Sistemas de Identidad Visual Escalable;Documentación Técnica de Marca;Narrativa y Posicionamiento de Voz',
          s1Icon: 'PenTool',
          s2Title: 'DISEÑO UX/UI',
          s2Desc: 'Diseño de experiencias centrada en la interacción humana. Construímos sistemas de diseño atómicos y flujos lógicos que eliminan la fricción, optimizan la conversión y garantizan una usabilidad intuitiva en productos digitales complejos.',
          s2Points: 'Arquitectura de Información;Sistemas de Diseño Atómico;Prototipado de Alta Fidelidad;Diseño de Interfaces Líquidas',
          s2Icon: 'Layers',
          s3Title: 'Desarrollo Digital',
          s3Desc: 'Orquestamos infraestructuras digitales end-to-end que fusionan escalabilidad técnica con agilidad operativa. Desde la modernización de sistemas legacy hasta arquitecturas DXP, equilibramos frontends de alto rendimiento con backends robustos.',
          s3Points: 'Evolución de Ecosistemas;Arquitecturas No-Code/Low-Code;Optimización Core Web Vitals;Gobernanza Operativa',
          s3Icon: 'Monitor',
          s4Title: 'Marketing Digital',
          s4Desc: 'Estrategias de crecimiento basadas en datos y análisis predictivo. Optimizamos cada etapa del funnel de marketing para capturar, convertir y retener audiencias mediante el uso inteligente de plataformas digitales.',
          s4Points: 'Growth Marketing;Estrategia Algorítmica;Optimización de Embudos;Analítica Avanzada',
          s4Icon: 'Cpu'
        }
      },
      {
        id: 'pz-experience',
        type: 'ExperienceBanner',
        props: {
          title: 'Años de experiencia, una nueva visión.',
          subtitle: 'NUESTRO BACKGROUND',
          points: 'Presentación de portafolio,Auditoría de marca y objetivos',
          ctaText: 'Agendar Sesión'
        }
      },
      {
        id: 'pz-phil',
        type: 'PhilosophyGrid',
        props: {
          title: 'Diseñamos desde lo esencial para construir lo extraordinario.',
          subtitle: 'NUESTRA FILOSOFÍA',
          part1Title: 'Plano: El Blueprint.',
          part1Desc: 'La base estructurada, la arquitectura visual y el diseño meticuloso. Representa el plano maestro sobre el cual planificamos y proyectamos el futuro de tu marca.',
          part2Title: 'Zero: La Esencia.',
          part2Desc: 'El lienzo en blanco. Evoca nuestra mentalidad de trabajo: cero fricciones, cero ruido visual, volviendo siempre a lo que es verdaderamente esencial para conectar.'
        }
      },
      {
        id: 'pz-timeline',
        type: 'TimelineSection',
        props: {
          title: 'Movimiento Hacia Adelante',
          subtitle: 'NUESTRO PROCESO',
          stepsCsv: '01:Descubrimiento:Iniciamos con una auditoría profunda. Analizamos datos y objetivos para trazar un roadmap estratégico que alinee tu visión con las demandas del mercado.,02:Identidad:Diseñamos lenguajes visuales escalables. Construimos sistemas modulares que transmiten autoridad y coherencia en cada punto de contacto.,03:Aplicación:Transformamos conceptos en arquitecturas digitales. Desarrollamos interfaces fluidas y estrategias UX/UI diseñadas para convertir y retener.,04:Lanzamiento:Llevamos tu proyecto al mercado con precisión. Incluimos optimización post-lanzamiento para que tu marca domine y evolucione continuamente.'
        }
      },
      {
        id: 'pz-partners',
        type: 'PartnersCloud',
        props: {
          title: 'CON QUÉ TRABAJAMOS:',
          urls: 'WordPress,Webflow,Progress Sitefinity,Google Ads,Meta Business,Shopify Partner,AI Studio Google'
        }
      },
      {
        id: 'pz-contact',
        type: 'ContactPanel',
        props: {
          title: 'Inicia tu proyecto',
          part1: 'Inicia tu',
          part2: 'proyecto',
          email: 'hola@planozero.cl',
          phone: '+569 5530 8095'
        }
      }
    ]
  }
};

const CMSPage = () => {
  const { slug: rawSlug } = useParams();
  const slug = rawSlug || 'inicio';
  
  const [page, setPage] = useState<any>(slug === 'inicio' ? FALLBACK_HOME : null);
  const [loading, setLoading] = useState(slug === 'inicio' ? false : true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (slug !== 'inicio') {
        setLoading(true);
      }
      setError(null);
      
      try {
        const data = await api.pages.getBySlug(slug);
        
        if (!data) {
          if (slug === 'inicio') {
            setPage(FALLBACK_HOME);
            setError(null);
          } else {
            setError('Página no encontrada');
          }
        } else {
          const pageData = data as CMSPageData;
          if (!pageData.published) {
            setError('Esta página es un borrador');
          } else {
            setPage(pageData);
          }
        }
      } catch (err) {
        console.error("CMSPage Fetch Error:", err);
        if (slug !== 'inicio') {
          setError('Error al cargar la página: ' + (err instanceof Error ? err.message : 'Error desconocido'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading && !page) {
    return <BlueprintLoader />;
  }

  if (error && !page) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-zinc-900 rounded-3xl flex items-center justify-center mb-8 border border-zinc-800">
          <Layout className="w-10 h-10 text-zinc-700" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 italic tracking-tighter leading-none text-[#FF5F1F]">{error}</h1>
        <p className="text-zinc-500 max-w-md mb-12 font-medium">No pudimos encontrar la arquitectura solicitada. Vuelve al inicio para explorar nuestra ingeniería visual.</p>
        <Link 
          to="/" 
          className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform"
        >
          VOLVER AL ORIGEN
        </Link>
      </div>
    );
  }

  if (!page) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-[#FF5F1F] selection:text-white transition-colors duration-500 overflow-x-hidden">
      <Helmet>
        <title>{page.title} | PLANOZERO</title>
        <meta name="description" content={`Página de ${page.title} en Planozero.cl - Estudio de Branding y Diseño Estratégico`} />
      </Helmet>

      <div className="relative flex-grow flex flex-col">
        <Navbar />
        
        <main id="main-content" className="w-full relative overflow-hidden flex-grow flex flex-col">
          <GridBackground />
          <div className="relative z-10 pt-20 md:pt-24 lg:pt-0 flex-grow">
            <motion.div
              key={slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <CMSZoneRenderer zone={page.root} />
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default CMSPage;
