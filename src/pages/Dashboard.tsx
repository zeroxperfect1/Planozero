import React, { useState, useEffect, useMemo } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFileUpload, deleteImageFromFirebase } from '../services/storageService';
import api from '../services/api';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
// ─── Material UI ────────────────────────────────────────────────────────────
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiButton from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import MuiTextField from '@mui/material/TextField';
import MuiChip from '@mui/material/Chip';
import MuiFab from '@mui/material/Fab';
import MuiSwitch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiAlert from '@mui/material/Alert';
import MuiAvatar from '@mui/material/Avatar';
import MuiBadge from '@mui/material/Badge';
import MuiLinearProgress from '@mui/material/LinearProgress';
import MuiSlider from '@mui/material/Slider';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { 
  Plus, 
  Trash2, 
  Edit2, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Terminal,
  Activity,
  Eye, 
  EyeOff,
  Save,
  X,
  MessageSquare,
  Mail,
  Check,
  Archive,
  Copy,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
  Loader2,
  Send,
  Download,
  Search,
  Layers,
  Layout,
  Database,
  Type,
  Code,
  Square,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  DollarSign,
  HelpCircle,
  BarChart3,
  Video,
  Zap,
  List,
  Columns,
  LayoutGrid,
  Bell,
  Quote,
  Users,
  Cloud,
  Maximize,
  Rocket,
  Palette,
  Globe,
  Grid as GridIcon,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Newspaper,
  RotateCcw,
  ShoppingBag,
  PenTool,
  Sparkles,
  BookOpen,
  Target,
  TrendingUp,
  AlertTriangle,
  Type as TypeIcon,
  Sliders,
  Wand2,
  RefreshCcw,
  CornerDownRight,
  Minus,
  Monitor
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import Logo from '../components/Logo';
import WysiwygEditor from '../components/WysiwygEditor';
import MediaLibrary from '../components/MediaLibrary';
import { CMSZoneRenderer, CMSRenderNode } from '../components/CMSRenderer';
import { LogViewer } from '../components/LogViewer';
import HealthCheck from '../components/HealthCheck';


// ─── Design System default tokens ────────────────────────────────────────────
const DEFAULT_DESIGN_TOKENS: Record<string, string> = {
  '--color-primary':        '#FF5F1F',
  '--color-primary-hover':  '#E54E10',
  '--color-secondary':      '#22D3EE',
  '--color-bg':             '#09090B',
  '--color-surface':        '#18181B',
  '--color-surface-raised': '#27272A',
  '--color-border':         '#27272A',
  '--color-text':           '#FFFFFF',
  '--color-text-muted':     '#71717A',
  '--radius-sm':            '4px',
  '--radius-md':            '8px',
  '--radius-lg':            '16px',
  '--radius-xl':            '32px',
  '--font-heading':         "'Inter', system-ui, sans-serif",
  '--font-body':            "'Inter', system-ui, sans-serif",
  '--font-mono':            "'JetBrains Mono', monospace",
  '--glow-intensity':       '0.30',
};

// ─── Material Design 3 presets ────────────────────────────────────────────────
const MD3_PRESETS: Record<string, { label: string; emoji: string; tokens: Record<string, string> }> = {
  'md3-light': {
    label: 'MD3 Light',
    emoji: '☀️',
    tokens: {
      '--color-primary':        '#6750A4',
      '--color-primary-hover':  '#4F378B',
      '--color-secondary':      '#625B71',
      '--color-bg':             '#FFFBFE',
      '--color-surface':        '#FFFBFE',
      '--color-surface-raised': '#ECE6F0',
      '--color-border':         '#CAC4D0',
      '--color-text':           '#1C1B1F',
      '--color-text-muted':     '#49454F',
      '--radius-sm':            '4px',
      '--radius-md':            '12px',
      '--radius-lg':            '16px',
      '--radius-xl':            '28px',
      '--font-heading':         "'Roboto', system-ui, sans-serif",
      '--font-body':            "'Roboto', system-ui, sans-serif",
      '--font-mono':            "'Roboto Mono', monospace",
      '--glow-intensity':       '0.10',
    }
  },
  'md3-dark': {
    label: 'MD3 Dark',
    emoji: '🌙',
    tokens: {
      '--color-primary':        '#D0BCFF',
      '--color-primary-hover':  '#B69DF8',
      '--color-secondary':      '#CCC2DC',
      '--color-bg':             '#1C1B1F',
      '--color-surface':        '#1C1B1F',
      '--color-surface-raised': '#2B2930',
      '--color-border':         '#49454F',
      '--color-text':           '#E6E1E5',
      '--color-text-muted':     '#CAC4D0',
      '--radius-sm':            '4px',
      '--radius-md':            '12px',
      '--radius-lg':            '16px',
      '--radius-xl':            '28px',
      '--font-heading':         "'Roboto', system-ui, sans-serif",
      '--font-body':            "'Roboto', system-ui, sans-serif",
      '--font-mono':            "'Roboto Mono', monospace",
      '--glow-intensity':       '0.15',
    }
  },
  'md3-teal': {
    label: 'MD3 Teal',
    emoji: '🌊',
    tokens: {
      '--color-primary':        '#006874',
      '--color-primary-hover':  '#00494E',
      '--color-secondary':      '#4A6267',
      '--color-bg':             '#FAFDFD',
      '--color-surface':        '#FAFDFD',
      '--color-surface-raised': '#DBE4E6',
      '--color-border':         '#BFC8CA',
      '--color-text':           '#161D1E',
      '--color-text-muted':     '#3F484A',
      '--radius-sm':            '4px',
      '--radius-md':            '12px',
      '--radius-lg':            '16px',
      '--radius-xl':            '28px',
      '--font-heading':         "'Roboto', system-ui, sans-serif",
      '--font-body':            "'Roboto', system-ui, sans-serif",
      '--font-mono':            "'Roboto Mono', monospace",
      '--glow-intensity':       '0.12',
    }
  },
  'md3-orange': {
    label: 'MD3 Orange',
    emoji: '🔥',
    tokens: {
      '--color-primary':        '#9D4300',
      '--color-primary-hover':  '#7A3400',
      '--color-secondary':      '#77574B',
      '--color-bg':             '#FFFBFF',
      '--color-surface':        '#FFFBFF',
      '--color-surface-raised': '#FFDBC9',
      '--color-border':         '#D6BFB8',
      '--color-text':           '#21130C',
      '--color-text-muted':     '#53413A',
      '--radius-sm':            '4px',
      '--radius-md':            '12px',
      '--radius-lg':            '16px',
      '--radius-xl':            '28px',
      '--font-heading':         "'Roboto', system-ui, sans-serif",
      '--font-body':            "'Roboto', system-ui, sans-serif",
      '--font-mono':            "'Roboto Mono', monospace",
      '--glow-intensity':       '0.12',
    }
  },
  'md3-green': {
    label: 'MD3 Green',
    emoji: '🌿',
    tokens: {
      '--color-primary':        '#1A6B35',
      '--color-primary-hover':  '#0E4E25',
      '--color-secondary':      '#516351',
      '--color-bg':             '#FBFDF7',
      '--color-surface':        '#FBFDF7',
      '--color-surface-raised': '#DAE5D7',
      '--color-border':         '#BFC9BC',
      '--color-text':           '#181D18',
      '--color-text-muted':     '#3D4B3C',
      '--radius-sm':            '4px',
      '--radius-md':            '12px',
      '--radius-lg':            '16px',
      '--radius-xl':            '28px',
      '--font-heading':         "'Roboto', system-ui, sans-serif",
      '--font-body':            "'Roboto', system-ui, sans-serif",
      '--font-mono':            "'Roboto Mono', monospace",
      '--glow-intensity':       '0.10',
    }
  },
};

function applyDesignTokens(tokens: Record<string, string>) {
  let style = document.getElementById('pz-design-tokens') as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = 'pz-design-tokens';
    document.head.appendChild(style);
  }
  const intensity = parseFloat(tokens['--glow-intensity'] ?? '0.30');
  const primary = tokens['--color-primary'] ?? '#FF5F1F';
  const sec = tokens['--color-secondary'] ?? '#22D3EE';
  // Convert hex to rgb for glow
  const hr = (hex: string) => { const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16); return `${r},${g},${b}`; };
  const glowPrimary = `0 0 40px rgba(${hr(primary)},${intensity})`;
  const glowSec     = `0 0 40px rgba(${hr(sec)},${(intensity*0.7).toFixed(2)})`;
  const cssText = `:root{${Object.entries(tokens)
    .filter(([k]) => k !== '--glow-intensity')
    .map(([k,v]) => `${k}:${v}`).join(';')};--glow-primary:${glowPrimary};--glow-secondary:${glowSec};}`;
  style.textContent = cssText;
}


interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  authorId: string;
  authorImage?: string;
  image: string;
  keywords?: string;
  published: boolean;
  createdAt: any;
}

interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  isAdmin?: boolean;
}

interface ContactRequest {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  idea: string;
  status: 'pending' | 'responded' | 'archived';
  createdAt: any;
}

interface ContentField {
  id: string;
  name: string;
  type: 'text' | 'longtext' | 'image' | 'date' | 'number' | 'boolean';
  label: string;
  required: boolean;
}

interface ContentType {
  id: string;
  name: string;
  description: string;
  fields: ContentField[];
  createdAt: any;
}

interface CMSNode {
  id: string;
  type: string;
  props: Record<string, any>;
  zones?: CMSZone[];
  hidden?: boolean;
}

interface CMSZone {
  id: string;
  children: CMSNode[];
}

interface PageLayout {
  id: string;
  slug: string;
  title: string;
  root: CMSZone;
  published: boolean;
  showInNavigation: boolean;
  order?: number;
  createdAt: any;
}

const WIDGET_CATEGORIES = {
  LAYOUT: 'Diseño y Estructura (Layouts)',
  STATIC: 'Widgets de Contenido Estático',
  DYNAMIC: 'Widgets de Contenido Dinámico',
  INTERACTION: 'Formularios y Feedback',
  SECTIONS: 'Secciones Pre-diseñadas',
  PAGE_EXAMPLES: 'Plantillas de Página',
  ELEMENTS: 'Elementos de Contenido',
  MATERIAL: '⬛ Material Design 3',
};

const WIDGET_REGISTRY: Record<string, { label: string, icon: any, schema: any[], category: string }> = {
  // LAYOUTS
  Grid: {
    category: WIDGET_CATEGORIES.LAYOUT,
    label: 'Layout de Columnas',
    icon: GridIcon,
    schema: [
      { id: '1', name: 'columns', label: 'Columnas (md:grid-cols-X)', type: 'text', required: true },
    ]
  },

  // DYNAMIC WIDGETS
  NewsList: {
    category: WIDGET_CATEGORIES.DYNAMIC,
    label: 'Lista de Noticias',
    icon: Newspaper,
    schema: [
      { id: '1', name: 'limit', label: 'Cantidad', type: 'number', required: true },
      { id: '2', name: 'category', label: 'Filtro Categoría', type: 'text', required: false }
    ]
  },

  // HERO SECTIONS
  Hero: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Hero Principal',
    icon: Layout,
    schema: [
      { id: '1', name: 'title', label: 'Título Grande', type: 'text', required: true },
      { id: '2', name: 'subtitle', label: 'Subtítulo', type: 'longtext', required: false },
      { id: '3', name: 'ctaText', label: 'Botón CTA', type: 'text', required: false },
      { id: '4', name: 'image', label: 'Imagen Fondo', type: 'image', required: false },
    ]
  },
  HeroSplit: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Hero Dividido',
    icon: Columns,
    schema: [
      { id: '1', name: 'title', label: 'Título', type: 'text', required: true },
      { id: '2', name: 'content', label: 'Contenido', type: 'longtext', required: true },
      { id: '3', name: 'image', label: 'URL Imagen', type: 'text', required: true }
    ]
  },

  // ELEMENTS
  Card: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Card Informativa',
    icon: Square,
    schema: [
      { id: '1', name: 'title', label: 'Título', type: 'text', required: true },
      { id: '2', name: 'content', label: 'Contenido', type: 'longtext', required: true },
      { id: '3', name: 'image', label: 'URL Imagen', type: 'text', required: false },
      { id: '4', name: 'link', label: 'Link (URL)', type: 'text', required: false },
      { id: '5', name: 'customCss', label: 'CSS Personalizado (array o string)', type: 'text', required: false },
    ]
  },
  Carousel: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Carrusel de Imágenes',
    icon: ImageIcon,
    schema: [
      { id: '1', name: 'urls', label: 'URLs separadas por coma', type: 'longtext', required: true }
    ]
  },
  ImageWidget: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Imagen Individual',
    icon: ImageIcon,
    schema: [
      { id: '1', name: 'url', label: 'URL de la Imagen', type: 'image', required: true },
      { id: '2', name: 'alt', label: 'Texto Alternativo', type: 'text', required: false },
      { id: '3', name: 'caption', label: 'Pie de foto', type: 'text', required: false },
    ]
  },
  BentoGrid: {
     category: WIDGET_CATEGORIES.STATIC,
     label: 'Bento Grid',
     icon: LayoutGrid,
     schema: [
       { id: '1', name: 'title', label: 'Título Bento', type: 'text', required: false }
     ]
  },
  Calendar: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Calendario',
    icon: CalendarIcon,
    schema: [
      { id: '1', name: 'title', label: 'Título Calendario', type: 'text', required: false }
    ]
  },
  Code: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Injector Code',
    icon: Code,
    schema: [
      { id: '2', name: 'css', label: 'CSS (Style)', type: 'longtext', required: false },
      { id: '3', name: 'js', label: 'Javascript (Script)', type: 'longtext', required: false },
      { id: '1', name: 'html', label: 'HTML Raw', type: 'longtext', required: false },
    ]
  },

  // FEEDBACK
  Form: {
    category: WIDGET_CATEGORIES.INTERACTION,
    label: 'Formulario Hub',
    icon: Send,
    schema: [
      { id: '1', name: 'formId', label: 'ID Único', type: 'text', required: true },
      { id: '2', name: 'submitText', label: 'Texto Botón', type: 'text', required: true }
    ]
  },
  Testimonial: {
    category: WIDGET_CATEGORIES.INTERACTION,
    label: 'Testimonio',
    icon: Quote,
    schema: [
      { id: '1', name: 'quote', label: 'Cita', type: 'longtext', required: true },
      { id: '2', name: 'author', label: 'Autor', type: 'text', required: true }
    ]
  },
  FAQ: {
    category: WIDGET_CATEGORIES.INTERACTION,
    label: 'Acordeón FAQ',
    icon: HelpCircle,
    schema: [
      { id: '1', name: 'question', label: 'Pregunta', type: 'text', required: true },
      { id: '2', name: 'answer', label: 'Respuesta', type: 'longtext', required: true }
    ]
  },
  Banner: {
    category: WIDGET_CATEGORIES.INTERACTION,
    label: 'Banner Alert',
    icon: Bell,
    schema: [
      { id: '1', name: 'text', label: 'Mensaje', type: 'text', required: true },
      { id: '2', name: 'type', label: 'Tipo (info, success, warn)', type: 'text', required: false }
    ]
  },

  // SECTIONS
  Pricing: {
    category: WIDGET_CATEGORIES.DYNAMIC,
    label: 'Tabla Precios',
    icon: DollarSign,
    schema: [
      { id: '1', name: 'title', label: 'Plan', type: 'text', required: true },
      { id: '2', name: 'price', label: 'Costo', type: 'text', required: true },
      { id: '3', name: 'features', label: 'Features (Lineas)', type: 'longtext', required: true }
    ]
  },
  Stats: {
    category: WIDGET_CATEGORIES.DYNAMIC,
    label: 'Estadísticas',
    icon: BarChart3,
    schema: [
      { id: '1', name: 'value', label: 'Valor', type: 'text', required: true },
      { id: '2', name: 'label', label: 'Tag', type: 'text', required: true }
    ]
  },
  Team: {
    category: WIDGET_CATEGORIES.DYNAMIC,
    label: 'Equipo',
    icon: Users,
    schema: [
      { id: '1', name: 'name', label: 'Nombre', type: 'text', required: true },
      { id: '2', name: 'role', label: 'Rol', type: 'text', required: true }
    ]
  },
  Newsletter: {
    category: WIDGET_CATEGORIES.DYNAMIC,
    label: 'Newsletter',
    icon: Mail,
    schema: [
      { id: '1', name: 'title', label: 'Título', type: 'text', required: true },
      { id: '2', name: 'placeholder', label: 'Placeholder Email', type: 'text', required: false }
    ]
  },
  BlogSection: {
    category: WIDGET_CATEGORIES.SECTIONS,
    label: 'Feed Blog',
    icon: FileText,
    schema: [
      { id: '1', name: 'title', label: 'Título Sección', type: 'text', required: true }
    ]
  },
  CTASection: {
    category: WIDGET_CATEGORIES.SECTIONS,
    label: 'Llamada Acción',
    icon: Zap,
    schema: [
      { id: '1', name: 'title', label: 'Título CTA', type: 'text', required: true },
      { id: '2', name: 'buttonText', label: 'Texto Botón', type: 'text', required: true }
    ]
  },
  Logos: {
    category: WIDGET_CATEGORIES.SECTIONS,
    label: 'Nube de Logos',
    icon: Cloud,
    schema: [
      { id: '1', name: 'urls', label: 'Logo URLs (csv)', type: 'longtext', required: true }
    ]
  },
  Footer: {
    category: WIDGET_CATEGORIES.SECTIONS,
    label: 'Footer Corporativo',
    icon: Maximize,
    schema: [
      { id: '1', name: 'copy', label: 'Copyright Text', type: 'text', required: true }
    ]
  },

  // PAGE EXAMPLES
  LandingPage: {
    category: WIDGET_CATEGORIES.PAGE_EXAMPLES,
    label: 'Landing Template',
    icon: Rocket,
    schema: [
      { id: '1', name: 'theme', label: 'Dark/Light', type: 'text', required: false }
    ]
  },
  NotFound: {
    category: WIDGET_CATEGORIES.PAGE_EXAMPLES,
    label: '404 Personalizado',
    icon: Search,
    schema: [
      { id: '1', name: 'message', label: 'Mensaje de error', type: 'text', required: true }
    ]
  },

  Content: {
    category: WIDGET_CATEGORIES.ELEMENTS,
    label: 'Cuerpo de Texto',
    icon: FileText,
    schema: [
      { id: '1', name: 'body', label: 'Contenido Markdown', type: 'longtext', required: true }
    ]
  },

  // PLANOZERO ADVANCED
  MainHero: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Hero Arquitectura (PZData)',
    icon: Layout,
    schema: [
      { id: '1', name: 'part1', label: 'Título Línea 1', type: 'text', required: false },
      { id: '2', name: 'part2', label: 'Título Línea 2 (Highlight)', type: 'text', required: false },
      { id: '3', name: 'subtitle', label: 'Descripción', type: 'longtext', required: false },
      { id: '4', name: 'ctaText', label: 'Texto Botón', type: 'text', required: false }
    ]
  },
  VideoWidget: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Inyector de Video',
    icon: Video,
    schema: [
      { id: '1', name: 'url', label: 'Embed URL (YouTube/Vimeo)', type: 'text', required: true },
      { id: '2', name: 'title', label: 'Título Video', type: 'text', required: false }
    ]
  },
  ServicesAccordion: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Servicios Accordion',
    icon: Layers,
    schema: [
      { id: '1', name: 'title', label: 'Título Principal', type: 'text', required: false },
      { id: '2', name: 'subtitle', label: 'Subtítulo (Tag)', type: 'text', required: false },
      { id: 's1t', name: 's1Title', label: 'S1: Título', type: 'text', required: false },
      { id: 's1d', name: 's1Desc', label: 'S1: Descripción', type: 'longtext', required: false },
      { id: 's1p', name: 's1Points', label: 'S1: Puntos (;)', type: 'text', required: false },
      { id: 's1i', name: 's1Icon', label: 'S1: Icono', type: 'text', required: false },
      { id: 's2t', name: 's2Title', label: 'S2: Título', type: 'text', required: false },
      { id: 's2d', name: 's2Desc', label: 'S2: Descripción', type: 'longtext', required: false },
      { id: 's2p', name: 's2Points', label: 'S2: Puntos (;)', type: 'text', required: false },
      { id: 's2i', name: 's2Icon', label: 'S2: Icono', type: 'text', required: false },
      { id: 's3t', name: 's3Title', label: 'S3: Título', type: 'text', required: false },
      { id: 's3d', name: 's3Desc', label: 'S3: Descripción', type: 'longtext', required: false },
      { id: 's3p', name: 's3Points', label: 'S3: Puntos (;)', type: 'text', required: false },
      { id: 's3i', name: 's3Icon', label: 'S3: Icono', type: 'text', required: false },
      { id: 's4t', name: 's4Title', label: 'S4: Título', type: 'text', required: false },
      { id: 's4d', name: 's4Desc', label: 'S4: Descripción', type: 'longtext', required: false },
      { id: 's4p', name: 's4Points', label: 'S4: Puntos (;)', type: 'text', required: false },
      { id: 's4i', name: 's4Icon', label: 'S4: Icono', type: 'text', required: false }
    ]
  },
  ExperienceBanner: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Banner Experiencia',
    icon: CalendarIcon,
    schema: [
      { id: '1', name: 'title', label: 'Título', type: 'text', required: false },
      { id: '2', name: 'subtitle', label: 'Subtítulo', type: 'text', required: false },
      { id: '3', name: 'points', label: 'Puntos (CSV)', type: 'longtext', required: false },
      { id: '4', name: 'ctaText', label: 'Texto Botón', type: 'text', required: false }
    ]
  },
  PhilosophyGrid: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Grilla Filosofía',
    icon: Search,
    schema: [
      { id: '1', name: 'title', label: 'Título Sección', type: 'text', required: false },
      { id: '2', name: 'subtitle', label: 'Tagline', type: 'text', required: false },
      { id: '3', name: 'part1Title', label: 'Parte 1 Título', type: 'text', required: false },
      { id: '4', name: 'part1Desc', label: 'Parte 1 Desc', type: 'longtext', required: false },
      { id: '5', name: 'part2Title', label: 'Parte 2 Título', type: 'text', required: false },
      { id: '6', name: 'part2Desc', label: 'Parte 2 Desc', type: 'longtext', required: false }
    ]
  },
  TimelineSection: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Línea de Tiempo',
    icon: CheckCircle2,
    schema: [
      { id: '1', name: 'title', label: 'Título', type: 'text', required: false },
      { id: '2', name: 'subtitle', label: 'Subtítulo', type: 'text', required: false },
      { id: '3', name: 'stepsCsv', label: 'Pasos (num:titulo:desc,...)', type: 'longtext', required: false }
    ]
  },
  ContactPanel: {
    category: WIDGET_CATEGORIES.INTERACTION,
    label: 'Panel Contacto PZ',
    icon: Mail,
    schema: [
      { id: '1', name: 'title', label: 'Título Formulario', type: 'text', required: false },
      { id: '2', name: 'part1', label: 'Cuerpo Título 1', type: 'text', required: false },
      { id: '3', name: 'part2', label: 'Cuerpo Título 2 Highlight', type: 'text', required: false },
      { id: '4', name: 'email', label: 'Email Contacto', type: 'text', required: false },
      { id: '5', name: 'phone', label: 'Teléfono Contacto', type: 'text', required: false }
    ]
  },
  PartnersCloud: {
    category: WIDGET_CATEGORIES.STATIC,
    label: 'Nube de Partners',
    icon: Globe,
    schema: [
      { id: '1', name: 'title', label: 'Título Sección', type: 'text', required: false },
      { id: '2', name: 'urls', label: 'URLs Logos (CSV)', type: 'longtext', required: false }
    ]
  },

  // ─── MATERIAL DESIGN 3 WIDGETS ─────────────────────────────────────────────
  MuiButton: {
    category: WIDGET_CATEGORIES.MATERIAL,
    label: 'MD Botón',
    icon: Zap,
    schema: [
      { id: '1', name: 'label',   label: 'Texto del botón',         type: 'text', required: true  },
      { id: '2', name: 'variant', label: 'Variante (contained/outlined/text)', type: 'text', required: false },
      { id: '3', name: 'color',   label: 'Color (primary/secondary/error)', type: 'text', required: false },
      { id: '4', name: 'href',    label: 'Link (URL)',              type: 'text', required: false },
      { id: '5', name: 'size',    label: 'Tamaño (small/medium/large)', type: 'text', required: false },
    ]
  },
  MuiCard: {
    category: WIDGET_CATEGORIES.MATERIAL,
    label: 'MD Card',
    icon: Square,
    schema: [
      { id: '1', name: 'title',    label: 'Título',              type: 'text',      required: true  },
      { id: '2', name: 'subtitle', label: 'Subtítulo (meta)',    type: 'text',      required: false },
      { id: '3', name: 'body',     label: 'Descripción',         type: 'longtext',  required: false },
      { id: '4', name: 'image',    label: 'URL Imagen cabecera', type: 'image',     required: false },
      { id: '5', name: 'ctaText',  label: 'Texto Botón Acción',  type: 'text',      required: false },
      { id: '6', name: 'ctaHref',  label: 'Link Botón Acción',   type: 'text',      required: false },
      { id: '7', name: 'elevation',label: 'Elevación (0-24)',     type: 'number',    required: false },
    ]
  },
  MuiChip: {
    category: WIDGET_CATEGORIES.MATERIAL,
    label: 'MD Chip/Etiqueta',
    icon: Bell,
    schema: [
      { id: '1', name: 'label',   label: 'Texto',                   type: 'text', required: true  },
      { id: '2', name: 'color',   label: 'Color (primary/secondary/default)', type: 'text', required: false },
      { id: '3', name: 'variant', label: 'Variante (filled/outlined)', type: 'text', required: false },
    ]
  },
  MuiAlert: {
    category: WIDGET_CATEGORIES.MATERIAL,
    label: 'MD Alerta',
    icon: Bell,
    schema: [
      { id: '1', name: 'message',  label: 'Mensaje',                   type: 'longtext', required: true  },
      { id: '2', name: 'severity', label: 'Tipo (success/info/warning/error)', type: 'text', required: false },
      { id: '3', name: 'variant',  label: 'Variante (filled/outlined/standard)', type: 'text', required: false },
      { id: '4', name: 'title',    label: 'Título Alerta',             type: 'text',     required: false },
    ]
  },
  MuiTextField: {
    category: WIDGET_CATEGORIES.MATERIAL,
    label: 'MD Campo de Texto',
    icon: Send,
    schema: [
      { id: '1', name: 'label',       label: 'Etiqueta',   type: 'text', required: true  },
      { id: '2', name: 'placeholder', label: 'Placeholder', type: 'text', required: false },
      { id: '3', name: 'helperText',  label: 'Texto ayuda', type: 'text', required: false },
      { id: '4', name: 'variant',     label: 'Variante (outlined/filled/standard)', type: 'text', required: false },
      { id: '5', name: 'type',        label: 'Tipo (text/email/password/number)', type: 'text', required: false },
    ]
  },
  MuiDivider: {
    category: WIDGET_CATEGORIES.MATERIAL,
    label: 'MD Divisor',
    icon: Minus,
    schema: [
      { id: '1', name: 'text',        label: 'Texto en divisor (opc.)', type: 'text', required: false },
      { id: '2', name: 'orientation', label: 'Orientación (horizontal/vertical)', type: 'text', required: false },
    ]
  },
  MuiStatsCard: {
    category: WIDGET_CATEGORIES.MATERIAL,
    label: 'MD Tarjeta de Métrica',
    icon: Monitor,
    schema: [
      { id: '1', name: 'value',  label: 'Valor / Número',      type: 'text', required: true  },
      { id: '2', name: 'label',  label: 'Etiqueta (KPI)',       type: 'text', required: true  },
      { id: '3', name: 'trend',  label: 'Tendencia (+12% / -3%)', type: 'text', required: false },
      { id: '4', name: 'icon',   label: 'Emoji o ícono',        type: 'text', required: false },
      { id: '5', name: 'color',  label: 'Acento (primary/secondary/success)', type: 'text', required: false },
    ]
  },
  MuiStepper: {
    category: WIDGET_CATEGORIES.MATERIAL,
    label: 'MD Pasos / Stepper',
    icon: CheckCircle2,
    schema: [
      { id: '1', name: 'title',   label: 'Título del proceso', type: 'text', required: false },
      { id: '2', name: 'steps',   label: 'Pasos (título:desc separados por |)', type: 'longtext', required: true },
      { id: '3', name: 'active',  label: 'Paso activo (0-based)', type: 'number', required: false },
    ]
  },
  MuiTimeline: {
    category: WIDGET_CATEGORIES.MATERIAL,
    label: 'MD Timeline / Línea de tiempo',
    icon: CalendarIcon,
    schema: [
      { id: '1', name: 'title', label: 'Título de la línea', type: 'text', required: false },
      { id: '2', name: 'items', label: 'Items (fecha:titulo:desc separados por |)', type: 'longtext', required: true },
    ]
  },
};

const GRID_TEMPLATES = [
  { id: '1col', label: '1 Columna', columns: 'grid-cols-1', zones: 1, icon: Layout },
  { id: '2cols', label: '2 Columnas', columns: 'grid-cols-2', zones: 2, icon: GridIcon },
  { id: '3cols', label: '3 Columnas', columns: 'grid-cols-3', zones: 3, icon: LayoutGrid },
  { id: '4cols', label: '4 Columnas', columns: 'grid-cols-4', zones: 4, icon: LayoutGrid },
  { id: 'sidebar-left', label: 'Sidebar Izq', columns: 'grid-cols-4 [&>div:nth-child(2)]:col-span-3', zones: 2, icon: Columns },
  { id: 'sidebar-right', label: 'Sidebar Der', columns: 'grid-cols-4 [&>div:nth-child(1)]:col-span-3', zones: 2, icon: Columns },
  { id: 'center', label: 'Enfoque Central', columns: 'grid-cols-4 [&>div:nth-child(2)]:col-span-2', zones: 3, icon: LayoutGrid },
];

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-');      // Replace multiple - with single -
};

export const DEFAULT_INICIO_DATA: PageLayout = { 
  id: 'default-inicio', 
  title: 'PLANOZERO | Ingeniería Visual', 
  slug: 'inicio', 
  published: true,
  showInNavigation: true,
  order: 0,
  createdAt: null,
  root: { 
    id: 'root', 
    children: [
       {
        id: 'pz-hero',
        type: 'MainHero',
        props: {
          part1: 'La arquitectura de tu marca,',
          part2: 'desde lo esencial.',
          subtitle: 'Estudio de branding y diseño estratégico enfocado en la precisión técnica y la narrativa visual. Decodificamos la esencia de tu negocio para materializarla en arquitecturas digitales que redefinen el estándar de tu industria.',
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
          s1Desc: 'Decodificamos la esencia de tu negocio para transformarla en una narrativa visual poderosa. Desde la auditoría de ecosistema y el posicionamiento estratégico, hasta sistemas de identidad sensorial y manuales de marca técnicos que aseguran una presencia coherente y dominante.',
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
          phone: '+569 55308095'
        }
      }
    ] 
  } 
};

const countNodes = (zone: CMSZone): number => {
  if (!zone || !zone.children) return 0;
  let count = zone.children.length;
  for (const node of zone.children) {
    if (node.zones) {
      for (const z of node.zones) {
        count += countNodes(z);
      }
    }
  }
  return count;
};

// Helper to generate the full HTML document for previewing
const generateHtmlPreview = (content: string) => {
  const baseStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
    body { 
      font-family: 'Inter', sans-serif;
      color: #d1d5db; 
      background: transparent;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4, h5 { color: #ffffff; font-weight: 900; text-transform: uppercase; font-style: italic; letter-spacing: -0.05em; margin-top: 2rem; }
    h1 { font-size: 2.5rem; line-height: 1.1; }
    h2 { font-size: 1.75rem; line-height: 1.2; }
    p { margin-bottom: 1.2rem; }
    a { color: #FF5F1F; text-decoration: underline; }
    blockquote { border-left: 4px solid #FF5F1F; background: rgba(255, 95, 31, 0.05); padding: 1.5rem; margin: 1.5rem 0; border-radius: 0 1.5rem 1.5rem 0; font-style: italic; color: #a1a1aa; }
    ul, ol { margin-bottom: 1.2rem; padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
    img { max-width: 100%; border-radius: 1.5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.4); margin: 2rem 0; }
  `;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>${content}</body>
    </html>
  `;
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'Estrategia',
    image: '',
    keywords: '',
    published: false
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const postsPerPage = 10;

  const filteredPostsByStatus = useMemo(() => {
    if (filterStatus === 'all') return posts;
    return posts.filter(post => 
      filterStatus === 'published' ? post.published : !post.published
    );
  }, [posts, filterStatus]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPostsByStatus.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPostsByStatus, currentPage]);

  const totalPages = Math.ceil(filteredPostsByStatus.length / postsPerPage);

  const [view, setView] = useState<'overview' | 'posts' | 'messages' | 'config' | 'content-types' | 'pages' | 'menus' | 'ui-library' | 'logs' | 'mercado-publico' | 'design-system'>('overview');
  useEffect(() => {
    setCurrentPage(1);
  }, [view]);

  const [filterCompany, setFilterCompany] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactRequest | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryContext, setLibraryContext] = useState<'featured' | null>(null);
  const [mercadoPublicoData, setMercadoPublicoData] = useState<any[]>([]);
  const [loadingMercadoPublico, setLoadingMercadoPublico] = useState(false);
  const [mpFilter, setMpFilter] = useState('');
  const [mpCategory, setMpCategory] = useState<'TODAS' | 'DISEÑO' | 'WEB' | 'AUDIOVISUAL' | 'FOTOGRAFÍA' | 'PUBLICIDAD'>('TODAS');
  const [mpType, setMpType] = useState<'licitaciones' | 'compras-agiles'>('licitaciones');
  const [mpCurrentPage, setMpCurrentPage] = useState(1);
  const mpItemsPerPage = 10;

  // ─ Licitación detail + AI analysis state
  const [selectedMpItem, setSelectedMpItem] = useState<any | null>(null);
  const [licitacionDetail, setLicitacionDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ technical: string; opportunity: string } | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiTab, setAiTab] = useState<'technical' | 'opportunity'>('technical');

  // ─ Design System state
  const [dsTokens, setDsTokens] = useState<Record<string, string>>(DEFAULT_DESIGN_TOKENS);
  const [dsTab, setDsTab] = useState<'colors' | 'typography' | 'spacing' | 'effects' | 'material'>('colors');
  const [dsSaving, setDsSaving] = useState(false);
  const [dsLoaded, setDsLoaded] = useState(false);
  const [activeMdPreset, setActiveMdPreset] = useState<string | null>(null);

  const MP_CATEGORIES_KEYWORDS = {
    'DISEÑO': ['diseño', 'arquitectura', 'gráfico', 'industrial', 'urbanismo', 'paisaje', 'interiores', 'render'],
    'WEB': ['web', 'desarrollo', 'software', 'plataforma', 'digital', 'ecommerce', 'app', 'it ', 'soporte'],
    'AUDIOVISUAL': ['video', 'audiovisual', 'cine', 'multimedia', 'producción', 'edición', 'sonido', 'spot'],
    'FOTOGRAFÍA': ['fotografía', 'fotos', 'registro', 'cámara', 'imágen', 'captura'],
    'PUBLICIDAD': ['publicidad', 'marketing', 'campaña', 'comunicación', 'difusión', 'medios', 'rrss', 'branding']
  };
  
  // Dynamic Content State
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [pages, setPages] = useState<PageLayout[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [isTypeFormOpen, setIsTypeFormOpen] = useState(false);
  const [isPageEditorOpen, setIsPageEditorOpen] = useState(false);
  const [editingType, setEditingType] = useState<ContentType | null>(null);
  const [editingPage, setEditingPage] = useState<PageLayout | null>(null);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingPages, setLoadingPages] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    photoURL: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        setProfileData({
          displayName: u.displayName || '',
          photoURL: u.photoURL || ''
        });
        fetchPosts();
        fetchContacts();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (view === 'mercado-publico') {
      fetchMercadoPublico();
    }
    if (view === 'design-system' && !dsLoaded) {
      loadDesignTokens();
    }
  }, [view, mpType]);

  const fetchMercadoPublico = async () => {
    setLoadingMercadoPublico(true);
    setMercadoPublicoData([]);
    setMpCurrentPage(1);
    try {
      const ticket = '7E6FB3BF-05A0-41B6-B677-A6959AB7CA8D';
      const endpoint = mpType === 'licitaciones' ? 'licitaciones' : 'comprasagiles';
      const response = await fetch(`https://api.mercadopublico.cl/servicios/v1/publico/${endpoint}.json?estado=activas&ticket=${ticket}`);
      const data = await response.json();
      if (data && data.Listado) {
        setMercadoPublicoData(data.Listado);
      }
    } catch (error) {
      console.error("Error fetching Mercado Público data:", error);
    } finally {
      setLoadingMercadoPublico(false);
    }
  };

  // ─ Design System persistence
  const loadDesignTokens = async () => {
    try {
      const snap = await getDoc(doc(db, 'settings', 'design_system'));
      if (snap.exists()) {
        const saved = snap.data().tokens as Record<string, string>;
        setDsTokens(saved);
        applyDesignTokens(saved);
      }
    } catch (e) {
      console.error('Error loading design tokens:', e);
    } finally {
      setDsLoaded(true);
    }
  };

  const saveDesignTokens = async () => {
    setDsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'design_system'), {
        tokens: dsTokens,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error('Error saving design tokens:', e);
      alert('Error al guardar: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setDsSaving(false);
    }
  };

  const handleTokenChange = (key: string, value: string) => {
    const next = { ...dsTokens, [key]: value };
    setDsTokens(next);
    applyDesignTokens(next);
  };

  // ─ Fetch full detail + documents for a licitación
  const fetchLicitacionDetail = async (item: any) => {
    setSelectedMpItem(item);
    setLicitacionDetail(null);
    setAiAnalysis(null);
    setAiTab('technical');
    setLoadingDetail(true);
    try {
      const ticket = '7E6FB3BF-05A0-41B6-B677-A6959AB7CA8D';
      const res = await fetch(
        `https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?codigo=${item.CodigoExterno}&ticket=${ticket}`
      );
      const data = await res.json();
      const detail = data?.Listado?.[0];
      if (detail) {
        setLicitacionDetail(detail);
        analyzeWithGemini(detail);
      }
    } catch (e) {
      console.error('Error fetching licitación detail:', e);
    } finally {
      setLoadingDetail(false);
    }
  };

  // ─ Gemini AI analysis
  const analyzeWithGemini = async (detail: any) => {
    setLoadingAI(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setAiAnalysis({
          technical: '⚠️ Agrega VITE_GEMINI_API_KEY en .env.local para activar el análisis IA.',
          opportunity: '⚠️ Agrega VITE_GEMINI_API_KEY en .env.local para activar el análisis IA.'
        });
        return;
      }

      const items = (detail.Items?.Listado || [])
        .map((i: any) => `- ${i.NombreEspecificacion || i.Descripcion || ''} (Cant: ${i.Cantidad || 'N/A'})`)
        .join('\n');

      const docs = (detail.Adjunto || []).map((d: any) => d.Nombre).join(', ');

      const prompt = `Eres un experto en licitaciones públicas chilenas. Analiza y responde SOLO con JSON válido:

{
  "technical": "Resumen técnico: qué se contrata, monto, organismo, plazo cierre, requisitos técnicos clave, entregables y condiciones especiales.",
  "opportunity": "Análisis para PlanoZero (branding, diseño digital, UX/UI, web, marketing): postular SÍ/NO/DEPENDE, fortalezas de PlanoZero, riesgos o requisitos que no cumple, recomendación final y puntuación de oportunidad 1-10 con justificación."
}

Datos:
- Nombre: ${detail.Nombre}
- Código: ${detail.CodigoExterno}
- Descripción: ${detail.Descripcion || 'No disponible'}
- Monto Estimado: $${detail.MontoEstimado?.toLocaleString('es-CL') || 'No especificado'} CLP
- Fecha Cierre: ${detail.FechaCierre ? new Date(detail.FechaCierre).toLocaleDateString('es-CL') : 'N/A'}
- Organismo: ${detail.Unidad?.NombreOrganismo || 'N/A'} (${detail.Unidad?.RegionUnidad || 'N/A'})
- Items:\n${items || 'No especificados'}
- Documentos: ${docs || 'Ninguno'}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.3 }
          })
        }
      );

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) setAiAnalysis(JSON.parse(text));
    } catch (e) {
      console.error('AI error:', e);
      setAiAnalysis({
        technical: 'Error al generar análisis. Verifica tu API key de Gemini.',
        opportunity: 'Error al generar análisis. Verifica tu API key de Gemini.'
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const data = await api.contacts.getAll();
      setContacts(data.map(c => ({ ...c, createdAt: c.created_at })) as any);
    } catch (error) {
      console.error('Error in fetchContacts:', error);
    } finally {
      setLoadingContacts(false);
    }
  };

  const filteredContacts = (contacts || []).filter(c => {
    try {
      const companyVal = (c?.company || 'Independiente').toLowerCase();
      const nameVal = (c?.name || '').toLowerCase();
      const filterVal = (filterCompany || '').toLowerCase();
      return companyVal.includes(filterVal) || nameVal.includes(filterVal);
    } catch (e) {
      return false;
    }
  });

  const exportContactsToCSV = () => {
    if (contacts.length === 0) return;
    
    const headers = ["Fecha", "Nombre", "Empresa", "Cargo", "Email", "Telefono", "Idea", "Estado"];
    const rows = contacts.map(c => [
      c.createdAt?.toDate?.().toLocaleDateString() || '',
      c.name,
      c.company || '---',
      c.position || '---',
      c.email,
      c.phone || '---',
      c.idea.replace(/\n/g, " "),
      c.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `contactos_planozero_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchContentTypes = async () => {
    setLoadingTypes(true);
    try {
      const data = await api.contentTypes.getAll();
      setContentTypes(data as any);
    } catch (error) {
      console.error('Error fetching content types:', error);
    } finally {
      setLoadingTypes(false);
    }
  };

  const fetchPages = async () => {
    setLoadingPages(true);
    try {
      const rawPages = (await api.pages.getAll()) as unknown as PageLayout[];
      const otherPages = rawPages.filter(p => p.slug !== 'inicio');
      const allInicioVersions = rawPages.filter(p => p.slug === 'inicio');
      let pagesData: PageLayout[] = [];
      if (allInicioVersions.length > 0) {
        const metaInicio = allInicioVersions.find(p => p.published) || allInicioVersions[0];
        pagesData.push(metaInicio);
      } else {
        pagesData.push(DEFAULT_INICIO_DATA);
      }
      pagesData = [...pagesData, ...otherPages];
      setPages(pagesData);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoadingPages(false);
    }
  };

  const fetchMenus = async () => {
    try {
      const data = await api.menus.getAll();
      setMenus(data as any);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  useEffect(() => {
    if (view === 'content-types') {
      fetchContentTypes();
    }
    if (view === 'pages') {
      fetchPages();
    }
    if (view === 'menus') {
      fetchMenus();
    }
  }, [view]);

  const handleSaveMenu = async (menuData: any) => {
    try {
      if (menuData.id) {
        const { id, ...data } = menuData;
        await api.menus.update(id, data);
      } else {
        await api.menus.create({ ...menuData, order: menus.length });
      }
      fetchMenus();
    } catch (error) {
      console.error('Error saving menu:', error);
    }
  };

  const deleteMenu = async (id: string) => {
    try {
      await api.menus.delete(id);
      fetchMenus();
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  const handleSaveType = async (typeData: Omit<ContentType, 'id' | 'createdAt'>) => {
    try {
      if (editingType) {
        await api.contentTypes.update(editingType.id, typeData);
      } else {
        await api.contentTypes.create(typeData as any);
      }
      setIsTypeFormOpen(false);
      setEditingType(null);
      fetchContentTypes();
    } catch (error) {
      console.error('Error saving content type:', error);
    }
  };

  const handleSavePage = async (pageData: Omit<PageLayout, 'id' | 'createdAt'>) => {
    try {
      const isUpdate = editingPage && editingPage.id !== 'new-page' && editingPage.id !== 'default-inicio';
      if (isUpdate && editingPage) {
        await api.pages.update(editingPage.id, pageData as any);
      } else {
        await api.pages.create(pageData as any);
      }
      setIsPageEditorOpen(false);
      setEditingPage(null);
      fetchPages();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error al guardar la página: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsSavingProfile(true);
    try {
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });
      setUser({ ...auth.currentUser }); // Force refresh local user state
      alert("Perfil actualizado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el perfil.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        alert("La imagen debe ser menor a 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, photoURL: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.posts.getAll();
      const sorted = [...data].sort((a, b) =>
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
      setPosts(sorted.map(p => ({
        ...p,
        authorId: p.author_id,
        createdAt: p.created_at ? { seconds: Math.floor(new Date(p.created_at).getTime() / 1000), toDate: () => new Date(p.created_at) } : null
      })) as any);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error in fetchPosts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      if (result.user) fetchPosts();
    } catch (error: any) {
      console.error(error);
      alert("Error de autenticación: " + (error.message || "Error desconocido"));
    }
  };

  const handleLogout = () => auth.signOut();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingPost(true);
    try {
      const postPayload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        image: formData.image,
        keywords: formData.keywords,
        published: formData.published,
      };
      if (editingPost) {
        await api.posts.update(editingPost.id, postPayload);
      } else {
        await api.posts.create(postPayload);
      }
      setFormData({ title: '', slug: '', content: '', excerpt: '', category: 'Estrategia', image: '', keywords: '', published: false });
      setIsFormOpen(false);
      setEditingPost(null);
      await fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error al guardar: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSavingPost(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.posts.delete(id);
      setPosts(prev => prev.filter(p => p.id !== id));
      setDeletingId(null);
    } catch (error) {
      console.error('Error al eliminar post:', error);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!id || id === 'new-page') {
      setIsPageEditorOpen(false);
      return;
    }

    const pageToDelete = pages.find(p => p.id === id);
    if (pageToDelete?.slug === 'inicio') {
      alert('No puedes eliminar la página de inicio.');
      return;
    }

    try {
      if (confirm(`¿Estás seguro de que deseas eliminar la página "${pageToDelete?.title || 'esta página'}"? Esta acción no se puede deshacer.`)) {
        setIsSaving(true);
        await api.pages.delete(id);
        setPages(prev => prev.filter(p => p.id !== id));
        setIsPageEditorOpen(false);
        setEditingPage(null);
        fetchPages();
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Error al eliminar la página: ' + (error instanceof Error ? error.message : String(error)));
      fetchPages();
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug || '',
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      image: post.image,
      keywords: post.keywords || '',
      published: post.published
    });
    setIsFormOpen(true);
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Panel de Control</h2>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2 font-bold">Node-System Central Operativo</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => {
              setFormData({title: '', slug: '', content: '', excerpt: '', category: 'Estrategia', image: '', keywords: '', published: false});
              setView('posts');
              setIsFormOpen(true);
            }}
            className="bg-[#FF5F1F] text-white px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#FF5F1F]/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo Post
          </button>
          <div className="hidden lg:block text-right">
             <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Estado de Conexión</p>
             <p className="text-xs font-black text-green-500 flex items-center justify-end gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
               SECURE_NODE_ONLINE
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { label: 'Artículos', value: posts.length, icon: FileText, desc: 'Contenido Editorial' },
          { label: 'Leads', value: contacts.length, icon: MessageSquare, desc: 'Conversiones Activas' },
          { label: 'Páginas', value: pages.length, icon: Layout, desc: 'Arquitectura CMS' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-950/50 border border-zinc-900 p-8 rounded-[32px] group hover:border-[#FF5F1F]/30 transition-all relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className={`w-14 h-14 bg-[#FF5F1F]/5 rounded-2xl flex items-center justify-center text-[#FF5F1F] group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <span className="text-4xl font-black italic text-white tracking-tighter">{stat.value}</span>
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{stat.label}</h3>
            <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.1em]">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-[48px] overflow-hidden relative group min-h-[400px] flex flex-col shadow-2xl"
        >
          <div className="absolute inset-0 z-0 grayscale opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-1000">
             <img src="https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=1200" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          </div>
          
           <div className="relative z-10 p-6 md:p-12 mt-auto space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-[#FF5F1F] rounded-full" />
                <span className="text-[10px] font-mono text-[#FF5F1F] uppercase tracking-[0.5em] font-black">Core_Experience</span>
             </div>
             <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-white">Página de Inicio</h3>
             <p className="text-zinc-400 text-lg leading-relaxed max-w-md font-medium">
                La puerta principal a tu ecosistema. Orquesta componentes de alta fidelidad y narrativa visual en tiempo real.
             </p>
             <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={() => {
                    const inicioPage = pages.find(p => p.slug === 'inicio');
                    if (inicioPage) {
                      setEditingPage(inicioPage);
                      setIsPageEditorOpen(true);
                    } else {
                      setView('pages');
                    }
                  }}
                  className="bg-[#FF5F1F] text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#FF5F1F]/20 flex items-center gap-3"
                >
                  EDITAR DISEÑO <Edit2 className="w-4 h-4" />
                </button>
             </div>
          </div>
        </motion.div>

        <div className="lg:col-span-1 space-y-8">
           <HealthCheck />
           
           <div className="bg-zinc-950/80 border border-zinc-900 rounded-[40px] p-10 space-y-8 shadow-xl">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Prospectos Recientes</h3>
              <button onClick={() => setView('messages')} className="text-[10px] font-mono text-[#FF5F1F] hover:underline uppercase tracking-widest font-black">Ver Todos →</button>
           </div>
           <div className="space-y-3">
              {contacts.slice(0, 3).map((contact, idx) => (
                <div 
                  key={contact.id} 
                  className="flex items-center gap-4 p-5 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 hover:border-[#FF5F1F]/30 transition-all cursor-pointer group/msg"
                >
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-black truncate text-white">{contact.name}</p>
                    <p className="text-[10px] text-zinc-600 font-mono uppercase truncate">{contact.company || 'PARTICULAR'}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  </div>
);

  const renderPosts = () => (
    <motion.div
      key="posts-view"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-1 uppercase italic tracking-tighter text-white">Gestión de Contenidos</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Publica noticias y material educativo en el blog.</p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 shadow-inner">
            {['all', 'published', 'draft'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterStatus === status 
                    ? 'bg-zinc-800 text-white shadow-lg' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {status === 'all' ? 'Todos' : status === 'published' ? 'Publicados' : 'Borradores'}
              </button>
            ))}
          </div>

          <button 
            onClick={() => {
              setEditingPost(null);
              setFormData({title: '', slug: '', content: '', excerpt: '', category: 'Estrategia', image: '', keywords: '', published: false});
              setIsFormOpen(true);
            }}
            className="bg-[#FF5F1F] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#E54E10] transition-colors shadow-lg shadow-[#FF5F1F]/20"
          >
            <Plus className="w-5 h-5" /> NUEVO POST
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
           <Loader2 className="h-8 w-8 animate-spin text-[#FF5F1F]" />
        </div>
      ) : (
        <div className="space-y-2">
          {paginatedPosts.map(post => (
            <div key={post.id} className="bg-zinc-900 border border-zinc-800 p-2 rounded-2xl flex items-center justify-between group hover:border-[#FF5F1F]/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-20 h-14 bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shrink-0">
                  {post.image ? <img src={post.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center text-zinc-800"><ImageIcon className="w-6 h-6" /></div>}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white mb-1">{post.title}</h3>
                  <div className="flex items-center gap-3 text-[8px] font-mono uppercase tracking-[0.2em] font-black">
                     <span className="text-[#FF5F1F]">{post.category}</span>
                     <span className="text-zinc-800">/</span>
                     <span className={post.published ? 'text-green-500' : 'text-zinc-600'}>{post.published ? 'PÚBLICO' : 'BORRADOR'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pr-2">
                 <button onClick={() => startEdit(post)} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all">
                  <Edit2 className="w-4 h-4" />
                 </button>
                 <button onClick={() => setDeletingId(post.id)} className="p-3 bg-red-900/10 text-red-500/50 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ))}
          {/* Pagination omitted for brevity but should be here if needed */}
        </div>
      )}
    </motion.div>
  );

  const renderMessages = () => (
    <motion.div
      key="messages-view"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="h-full flex flex-col"
    >
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-1 uppercase tracking-tighter text-white">Mensajes Recibidos</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Revisa las propuestas de nuevos clientes.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text"
              placeholder="Filtrar por empresa o nombre..."
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="pl-11 pr-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs focus:outline-none focus:border-[#FF5F1F] w-full sm:w-64 transition-all"
            />
          </div>
          <button 
            onClick={exportContactsToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-3 gap-8 flex-grow overflow-hidden min-h-0">
        {/* List */}
        <div className="lg:col-span-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {loadingContacts ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF5F1F]" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
              <Mail className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No hay mensajes que coincidan</p>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => setSelectedMessage(contact)}
                className={`w-full text-left p-3 rounded-2xl border transition-all ${selectedMessage?.id === contact.id ? 'bg-[#FF5F1F] border-[#FF5F1F] shadow-lg shadow-[#FF5F1F]/20' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
              >
                <div className="flex justify-end items-start mb-1">
                  <span className={`text-[7px] font-mono uppercase ${selectedMessage?.id === contact.id ? 'text-white/60' : 'text-zinc-500'}`}>
                    {contact.createdAt?.toDate ? contact.createdAt.toDate().toLocaleDateString() : 'Reciente'}
                  </span>
                </div>
                <h4 className={`font-bold truncate text-sm ${selectedMessage?.id === contact.id ? 'text-white' : 'text-zinc-100'}`}>{contact.name}</h4>
                <p className={`text-[9px] font-mono truncate ${selectedMessage?.id === contact.id ? 'text-white/70' : 'text-zinc-500'}`}>{contact.company || 'Independiente'}</p>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 overflow-y-auto custom-scrollbar h-full">
          {selectedMessage ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-2 md:p-4 space-y-3 min-h-full">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-black">{selectedMessage.name}</h2>
                  <div className="flex items-center gap-2 text-zinc-500 text-[9px] font-mono uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Mail className="w-2 h-2" /> {selectedMessage.email}</span>
                    {selectedMessage.phone && <span>/ {selectedMessage.phone}</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                   <span className="text-xs text-zinc-500 font-mono flex items-center gap-1"><Clock className="w-3 h-3" /> Recibido: {selectedMessage.createdAt?.toDate?.().toLocaleString() || 'Hoy'}</span>
                   {selectedMessage.company && (
                     <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full">
                       <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{selectedMessage.company} — {selectedMessage.position}</p>
                     </div>
                   )}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-[9px] font-mono text-[#FF5F1F] uppercase tracking-[0.2em] font-bold">Propuesta / Idea</h5>
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl leading-relaxed text-zinc-300 text-sm">
                   {selectedMessage.idea}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/30 border border-zinc-800 border-dashed rounded-[48px] h-full flex flex-col items-center justify-center p-12 text-center text-zinc-600">
               <Mail className="w-16 h-16 mb-4 opacity-20" />
               <h3 className="text-xl font-bold mb-2">Selecciona un mensaje</h3>
               <p className="max-w-xs text-sm">Haz clic en un mensaje de la lista para ver los detalles.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderPages = () => (
    <motion.div
      key="pages-view"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-1 uppercase tracking-tighter italic text-white">Arquitectura CMS</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Gestión de páginas dinámicas y estructuras visuales.</p>
        </div>
        <button 
          onClick={() => {
            setEditingPage(null);
            setIsPageEditorOpen(true);
          }}
          className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-[#FF5F1F] hover:text-white transition-all shadow-xl uppercase tracking-widest text-xs"
        >
          <Plus className="w-5 h-5" /> Nueva Página
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map(page => (
          <div key={page.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[32px] group hover:border-[#FF5F1F]/30 transition-all relative overflow-hidden">
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-zinc-800 rounded-xl text-zinc-400 group-hover:text-[#FF5F1F] group-hover:bg-[#FF5F1F]/10 transition-all">
                    <Layout className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">v2.0</span>
                </div>
                <h3 className="font-black italic uppercase text-lg text-white mb-1 leading-tight">{page.title.split('|')[0].trim()}</h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">/{page.slug}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    setEditingPage(page);
                    setIsPageEditorOpen(true);
                  }}
                  className="bg-zinc-800 hover:bg-[#FF5F1F] hover:text-white px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all min-w-[80px]"
                >
                  Editor
                </button>
                 <button 
                  onClick={async () => {
                    const newTitle = prompt('Nuevo título para la página:', page.title);
                    if (newTitle && newTitle !== page.title) {
                      setIsSaving(true);
                      try {
                        await api.pages.patch(page.id, { title: newTitle });
                        fetchPages();
                      } catch (e) {
                        alert('Error al renombrar: ' + e);
                      } finally {
                        setIsSaving(false);
                      }
                    }
                  }}
                  disabled={isSaving}
                  className="bg-zinc-800 hover:bg-zinc-700 px-3 py-3 rounded-xl transition-all disabled:opacity-50"
                  title="Renombrar"
                >
                  <PenTool className="w-4 h-4" />
                </button>
                <button 
                  onClick={async () => {
                    setIsSaving(true);
                    try {
                      await api.pages.patch(page.id, { published: !page.published });
                      fetchPages();
                    } catch (e) {
                      alert('Error al cambiar estado: ' + e);
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                  className={`px-3 py-3 rounded-xl transition-all disabled:opacity-50 ${page.published ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'}`}
                  title={page.published ? 'Pasar a Borrador' : 'Publicar'}
                >
                   {page.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleDeletePage(page.id)}
                  disabled={isSaving}
                  className="p-3 bg-zinc-800 hover:bg-red-500 hover:text-white rounded-xl transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className={`absolute top-4 right-4 z-20 px-2 py-1 rounded-full text-[7px] font-black uppercase ${page.published ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
              {page.published ? 'Pública' : 'Borrador'}
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5F1F] opacity-0 group-hover:opacity-5 blur-[60px] rounded-full transition-opacity" />
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderMenus = () => (
    <motion.div
      key="menus-view"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-1 uppercase tracking-tighter italic text-white">Navegación & Menús</h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Configuración estructural del menú principal y jerarquías.</p>
      </header>

      <div className="max-w-4xl space-y-12">
        {/* Arquitectura de Páginas Section */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] space-y-6 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32" />
           <div className="flex items-center gap-5 mb-4 relative z-10">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Arquitectura de Páginas</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mt-1">Control de visibilidad automática en el menú principal.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 gap-3 relative z-10">
              {pages.map(page => (
                <div key={page.id} className="flex items-center justify-between p-5 bg-zinc-950/50 rounded-3xl border border-zinc-800/50 hover:border-[#FF5F1F]/20 transition-all group/page">
                   <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${page.published ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]'}`} />
                      <div>
                        <p className="text-sm font-black uppercase italic tracking-tighter text-zinc-200 group-hover/page:text-white transition-colors">{page.title.split('|')[0].trim() || 'Sin Título'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">URL: /{page.slug}</span>
                           <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                           <span className={`text-[8px] font-black uppercase tracking-widest ${page.published ? 'text-green-500/60' : 'text-orange-500/60'}`}>{page.published ? 'Pública' : 'Borrador'}</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">ORDEN NAV</span>
                        <input 
                          type="number"
                          value={page.order || 0}
                          disabled={isSaving}
                          onChange={async (e) => {
                            const val = parseInt(e.target.value);
                            setIsSaving(true);
                            try {
                               await api.pages.patch(page.id, { order: val });
                               fetchPages();
                            } catch (error) {
                               console.error(error);
                            } finally {
                               setIsSaving(false);
                            }
                          }}
                          className="w-14 bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-1.5 text-[10px] text-center font-bold focus:border-[#FF5F1F] outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                      <button 
                        onClick={async () => {
                          setIsSaving(true);
                          try {
                             await api.pages.patch(page.id, { showInNavigation: !page.showInNavigation });
                             fetchPages();
                          } catch (error) {
                             console.error(error);
                          } finally {
                             setIsSaving(false);
                          }
                        }}
                        disabled={isSaving}
                        className={`w-28 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${page.showInNavigation ? 'bg-[#FF5F1F] text-white shadow-xl shadow-[#FF5F1F]/20' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
                      >
                        {page.showInNavigation ? 'En Menú' : 'Ocultar'}
                      </button>
                      
                      {page.slug !== 'inicio' && (
                        <button 
                          onClick={() => handleDeletePage(page.id)}
                          disabled={isSaving}
                          className="p-3 bg-red-900/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/10 disabled:opacity-50"
                          title="Eliminar Página"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="flex items-center justify-between pt-8">
           <div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Menús Personalizados</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mt-1">Estructuras personalizadas, mega-menús y enlaces externos.</p>
           </div>
           {menus.length === 0 && (
             <button 
                onClick={() => handleSaveMenu({ name: 'Menú Principal', children: [], published: true, order: 1 })}
                className="px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF5F1F] hover:text-white transition-all shadow-xl"
             >
               + Crear Menú Pro
             </button>
           )}
        </div>

        {menus.map(menu => (
          <div key={menu.id} className="bg-zinc-950/50 border border-zinc-900 p-8 rounded-[40px] space-y-8 shadow-2xl">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF5F1F]/10 rounded-2xl flex items-center justify-center text-[#FF5F1F]">
                    <List className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">{menu.name}</h3>
               </div>
               <button 
                onClick={() => {
                  const newItem = { name: 'Página Nueva', path: '/', id: Math.random().toString(36).substr(2, 9), children: [] };
                  const newChildren = [...(menu.children || []), newItem];
                  handleSaveMenu({...menu, children: newChildren});
                }}
                className="bg-[#FF5F1F] text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#FF5F1F]/20"
               >
                 + Añadir Item
               </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {(menu.children || []).map((item: any, idx: number) => (
                <MenuItemEditor 
                  key={item.id || idx} 
                  item={item} 
                  pages={pages}
                  onSave={(newData) => {
                    const newChildren = [...(menu.children || [])];
                    newChildren[idx] = newData;
                    handleSaveMenu({...menu, children: newChildren});
                  }}
                  onDelete={() => {
                    const newChildren = (menu.children || []).filter((_: any, i: number) => i !== idx);
                    handleSaveMenu({...menu, children: newChildren});
                  }}
                  onMove={(dir) => {
                    const newChildren = [...(menu.children || [])];
                    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
                    if (targetIdx >= 0 && targetIdx < newChildren.length) {
                      [newChildren[idx], newChildren[targetIdx]] = [newChildren[targetIdx], newChildren[idx]];
                      handleSaveMenu({...menu, children: newChildren});
                    }
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderLogs = () => (
    <motion.div
      key="logs-view"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-1 uppercase tracking-tighter italic text-white">Consola de Errores</h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Monitorización de eventos del sistema y excepciones de red.</p>
      </header>
      <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 font-mono text-xs overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-800">
           <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
           <span className="text-zinc-500 uppercase tracking-widest font-black">Sys_Live_Monitor</span>
        </div>
        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-4 text-zinc-400">
          <p className="text-zinc-600">[0.000s] SYSTEM BOOT COMPLETE</p>
          <p className="text-zinc-600">[{new Date().toLocaleTimeString()}] FIRESTORE_CONNECTION: ESTABLISHED</p>
          <p className="text-green-500">[{new Date().toLocaleTimeString()}] AUTH_PROVIDER: GOOGLE_CLOUD_IDENTITY_READY</p>
          <p className="text-[#FF5F1F]">[{new Date().toLocaleTimeString()}] DASHBOARD_LOAD: SUCCESS (SECURE_NODE)</p>
          <div className="py-4 text-zinc-700 text-[10px] uppercase tracking-widest">No se detectaron errores críticos en la última sesión.</div>
        </div>
      </div>
    </motion.div>
  );

  const renderProfile = () => (
    <motion.div
      key="profile-view"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-1 uppercase tracking-tighter italic text-white">Configuración del Perfil</h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Gestión de identidad administrativa y credenciales.</p>
      </header>

      <div className="max-w-xl bg-zinc-900 border border-zinc-800 p-10 rounded-[40px] shadow-2xl">
         <div className="flex flex-col items-center mb-10 text-center">
            <div className="relative group mb-6">
              <img src={profileData.photoURL || undefined} className="w-24 h-24 rounded-[32px] border-2 border-zinc-800 p-1 transition-all group-hover:border-[#FF5F1F]" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-[#FF5F1F] opacity-0 group-hover:opacity-10 blur-xl transition-opacity" />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{profileData.displayName || user?.displayName}</h3>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Nivel de Acceso: Root_Admin</p>
         </div>

         <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Nombre Público</label>
               <input 
                type="text" 
                value={profileData.displayName}
                onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF5F1F] transition-all"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">URL Avatar (Hosting Externo)</label>
               <input 
                type="url" 
                value={profileData.photoURL}
                onChange={(e) => setProfileData({...profileData, photoURL: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF5F1F] transition-all"
               />
            </div>
            <button 
              type="submit"
              disabled={isSavingProfile}
              className="w-full bg-[#FF5F1F] text-white font-black py-5 rounded-[24px] uppercase text-xs tracking-widest hover:bg-[#E54E10] transition-colors shadow-xl shadow-[#FF5F1F]/20 disabled:opacity-50"
            >
               {isSavingProfile ? 'PROCESANDO...' : 'ACTUALIZAR IDENTIDAD'}
            </button>
         </form>
      </div>
    </motion.div>
  );

  const renderMercadoPublico = () => {
    const filteredMpData = mercadoPublicoData.filter(item => {
      const textMatch = item.Nombre.toLowerCase().includes(mpFilter.toLowerCase()) || 
                       item.CodigoExterno.toLowerCase().includes(mpFilter.toLowerCase());
      
      if (mpCategory === 'TODAS') return textMatch;
      
      const keywords = MP_CATEGORIES_KEYWORDS[mpCategory] || [];
      const semanticMatch = keywords.some(k => item.Nombre.toLowerCase().includes(k.toLowerCase()));
      
      return textMatch && semanticMatch;
    });

    const paginatedMercadoPublico = filteredMpData.slice(
      (mpCurrentPage - 1) * mpItemsPerPage, 
      mpCurrentPage * mpItemsPerPage
    );

    return (<>
    <motion.div
      key="mercado-view"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-1 uppercase tracking-tighter italic text-white">Mercado Público</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Licitaciones y Compras Ágiles en tiempo real.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1 shadow-inner">
             <button 
              onClick={() => setMpType('licitaciones')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mpType === 'licitaciones' ? 'bg-[#FF5F1F] text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               Licitaciones
             </button>
             <button 
              onClick={() => setMpType('compras-agiles')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mpType === 'compras-agiles' ? 'bg-[#FF5F1F] text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               Compras Ágiles
             </button>
           </div>
        </div>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-2 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5F1F] opacity-5 blur-[100px] pointer-events-none" />
        
        {/* Tabs / Areas */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-800/50">
           {['TODAS', 'DISEÑO', 'WEB', 'AUDIOVISUAL', 'FOTOGRAFÍA', 'PUBLICIDAD'].map((cat) => (
             <button 
              key={cat}
              onClick={() => setMpCategory(cat as any)}
              className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${mpCategory === cat ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-700'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Search */}
        <div className="relative group">
           <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FF5F1F] transition-colors" />
           <input 
            type="text"
            placeholder="Filtrar por palabra clave o código..."
            value={mpFilter}
            onChange={(e) => setMpFilter(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-[28px] pl-16 pr-8 py-5 focus:outline-none focus:border-[#FF5F1F] transition-all text-sm font-medium shadow-inner"
           />
        </div>

        {loadingMercadoPublico ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="w-12 h-12 border-4 border-zinc-800 border-t-[#FF5F1F] rounded-full animate-spin" />
             <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] animate-pulse">Sincronizando con Hacienda...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedMercadoPublico.map((item, idx) => (
                <motion.div 
                  key={item.CodigoExterno || idx} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 10) * 0.05 }}
                  className="bg-zinc-950 border border-zinc-900 p-6 rounded-[32px] group hover:border-[#FF5F1F]/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                       <span className="text-[9px] font-mono text-[#FF5F1F] bg-[#FF5F1F]/5 px-3 py-1 rounded-lg border border-[#FF5F1F]/10 tracking-widest">{item.CodigoExterno}</span>
                       <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 rounded-lg text-zinc-500">
                          <Clock className="w-3 h-3" />
                          <span className="text-[8px] font-mono uppercase truncate max-w-[80px]">
                            {item.FechaCierre ? new Date(item.FechaCierre).toLocaleDateString() : 'Pendiente'}
                          </span>
                       </div>
                    </div>
                    <h4 className="font-bold text-white text-sm leading-tight line-clamp-3 group-hover:text-[#FF5F1F] transition-colors">{item.Nombre}</h4>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-zinc-900 flex items-center justify-between">
                     <div className="space-y-1">
                        <p className="text-[8px] text-zinc-600 uppercase font-mono tracking-widest">Monto Estimado</p>
                        <p className="text-sm font-black text-white italic">$ {item.MontoEstimado ? item.MontoEstimado.toLocaleString() : 'N/A'}</p>
                     </div>
                     <div className="flex gap-2">
                        <button
                          onClick={() => fetchLicitacionDetail(item)}
                          title="Analizar con IA"
                          className="px-4 h-10 flex items-center gap-2 bg-[#FF5F1F]/10 border border-[#FF5F1F]/30 rounded-xl hover:bg-[#FF5F1F] text-[#FF5F1F] hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Analizar
                        </button>
                        <a 
                          href={mpType === 'licitaciones' 
                            ? `https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsSupplier.aspx?idLicitacion=${item.CodigoExterno}`
                            : `https://www.mercadopublico.cl/CompraAgil/Buscador/Detalle/${item.CodigoExterno}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-xl hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all"
                        >
                           <ExternalLink className="w-4 h-4" />
                        </a>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {mercadoPublicoData.length > mpItemsPerPage && (
              <div className="flex justify-center items-center gap-6 pt-8">
                 <button 
                  disabled={mpCurrentPage === 1}
                  onClick={() => setMpCurrentPage(p => p - 1)}
                  className="px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FF5F1F] hover:text-white transition-all shadow-xl"
                 >
                   Anterior
                 </button>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em]">Nodo</span>
                    <span className="text-xl font-black text-white italic">{mpCurrentPage}</span>
                    <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em]">/ {Math.ceil(filteredMpData.length / mpItemsPerPage)}</span>
                 </div>
                 <button 
                  disabled={mpCurrentPage >= Math.ceil(filteredMpData.length / mpItemsPerPage)}
                  onClick={() => setMpCurrentPage(p => p + 1)}
                  className="px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FF5F1F] hover:text-white transition-all shadow-xl"
                 >
                   Siguiente
                 </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>

    {/* ─────────────────────────────────────────────
         DETAIL PANEL (slide-in desde la derecha)
    ───────────────────────────────────────────── */}
    <AnimatePresence>
      {selectedMpItem && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => { setSelectedMpItem(null); setLicitacionDetail(null); setAiAnalysis(null); }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col shadow-2xl"
          >
            {/* Panel header */}
            <div className="flex items-start gap-4 p-5 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex-shrink-0">
              <button
                onClick={() => { setSelectedMpItem(null); setLicitacionDetail(null); setAiAnalysis(null); }}
                className="w-9 h-9 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-all flex-shrink-0 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <span className="font-mono text-[9px] text-[#FF5F1F] uppercase tracking-widest">{selectedMpItem.CodigoExterno}</span>
                <h2 className="font-black text-white text-base leading-tight mt-0.5 line-clamp-2">{selectedMpItem.Nombre}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest">
                    Cierre: {selectedMpItem.FechaCierre ? new Date(selectedMpItem.FechaCierre).toLocaleDateString('es-CL') : 'Pendiente'}
                  </span>
                  <span className="text-[8px] text-zinc-500 font-mono">|</span>
                  <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest">
                    ${selectedMpItem.MontoEstimado ? selectedMpItem.MontoEstimado.toLocaleString('es-CL') : 'N/A'} CLP
                  </span>
                </div>
              </div>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* Documents section */}
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Documentos adjuntos
                </h3>

                {loadingDetail ? (
                  <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-2xl">
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF5F1F]" />
                    <span className="text-xs text-zinc-500 font-mono">Cargando documentos...</span>
                  </div>
                ) : licitacionDetail ? (
                  (licitacionDetail.Adjunto || []).length > 0 ? (
                    <div className="space-y-2">
                      {(licitacionDetail.Adjunto || []).map((doc: any, i: number) => (
                        <a
                          key={i}
                          href={doc.URL || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-[#FF5F1F]/50 hover:bg-zinc-800 transition-all group"
                        >
                          <div className="w-8 h-8 bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-[#FF5F1F]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">{doc.Nombre}</p>
                            {doc.Descripcion && (
                              <p className="text-[9px] text-zinc-500 truncate">{doc.Descripcion}</p>
                            )}
                          </div>
                          <Download className="w-4 h-4 text-zinc-600 group-hover:text-[#FF5F1F] flex-shrink-0 transition-colors" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <AlertTriangle className="w-4 h-4 text-yellow-500/70 flex-shrink-0" />
                      <span className="text-xs text-zinc-500">Esta licitación no tiene documentos adjuntos en la API.</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-yellow-500/70 flex-shrink-0" />
                    <span className="text-xs text-zinc-500">No se pudo cargar el detalle.</span>
                  </div>
                )}
              </div>

              {/* Items section */}
              {licitacionDetail?.Items?.Listado?.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3">Items solicitados</h3>
                  <div className="space-y-1.5">
                    {licitacionDetail.Items.Listado.slice(0, 8).map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <span className="font-mono text-[8px] text-cyan-400/50 tracking-widest mt-0.5 flex-shrink-0">[{String(i + 1).padStart(2, '0')}]</span>
                        <p className="text-xs text-zinc-300 leading-relaxed">{item.NombreEspecificacion || item.Descripcion || 'Sin descripción'}</p>
                        {item.Cantidad && (
                          <span className="text-[8px] font-mono text-zinc-600 flex-shrink-0">x{item.Cantidad}</span>
                        )}
                      </div>
                    ))}
                    {licitacionDetail.Items.Listado.length > 8 && (
                      <p className="text-[9px] text-zinc-600 font-mono text-center py-1">... y {licitacionDetail.Items.Listado.length - 8} items más</p>
                    )}
                  </div>
                </div>
              )}

              {/* AI Analysis section */}
              <div>
                <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF5F1F]" /> Análisis IA — Gemini
                </h3>

                {/* AI Tabs */}
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-4">
                  <button
                    onClick={() => setAiTab('technical')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      aiTab === 'technical' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Resumen Técnico
                  </button>
                  <button
                    onClick={() => setAiTab('opportunity')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      aiTab === 'opportunity' ? 'bg-[#FF5F1F] text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" /> Oportunidad
                  </button>
                </div>

                {loadingAI ? (
                  <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 border-2 border-zinc-800 border-t-[#FF5F1F] rounded-full animate-spin" />
                      <Sparkles className="w-4 h-4 text-[#FF5F1F] absolute inset-0 m-auto" />
                    </div>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.3em] animate-pulse">Gemini analizando licitación...</p>
                  </div>
                ) : aiAnalysis ? (
                  <motion.div
                    key={aiTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl"
                  >
                    {aiTab === 'technical' ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Resumen Técnico</span>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{aiAnalysis.technical}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-[#FF5F1F]" />
                          <span className="text-[10px] font-black text-[#FF5F1F] uppercase tracking-widest">Oportunidad para PlanoZero</span>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{aiAnalysis.opportunity}</p>
                      </div>
                    )}
                  </motion.div>
                ) : !licitacionDetail ? null : (
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                    <p className="text-xs text-zinc-500">Esperando carga del detalle para iniciar análisis...</p>
                  </div>
                )}
              </div>

              {/* External link */}
              <a
                href={`https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsSupplier.aspx?idLicitacion=${selectedMpItem.CodigoExterno}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-[#FF5F1F]/50 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Ver en Mercado Público
              </a>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>);
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  DESIGN SYSTEM EDITOR
  // ─────────────────────────────────────────────────────────────────────────
  const renderDesignSystem = () => {
    const COLOR_TOKENS = [
      { key: '--color-primary',        label: 'Color Primario',      desc: 'Botones CTA, acentos activos, highlights' },
      { key: '--color-primary-hover',  label: 'Primario Hover',      desc: 'Estado hover del color primario' },
      { key: '--color-secondary',      label: 'Color Secundario',    desc: 'Acentos blueprint (cyan/accent)' },
      { key: '--color-bg',             label: 'Fondo Principal',     desc: 'Background base del sitio' },
      { key: '--color-surface',        label: 'Superficie Card',     desc: 'Fondo de cards y paneles' },
      { key: '--color-surface-raised', label: 'Superficie Elevada',  desc: 'Bordes, inputs y hover states' },
      { key: '--color-border',         label: 'Borde',               desc: 'Separadores y bordes de cards' },
      { key: '--color-text',           label: 'Texto Principal',     desc: 'Títulos y cuerpo de texto' },
      { key: '--color-text-muted',     label: 'Texto Secundario',    desc: 'Descripciones y metadatos' },
    ];

    const FONT_OPTIONS = [
      { label: 'Inter',           value: "'Inter', system-ui, sans-serif" },
      { label: 'Outfit',          value: "'Outfit', system-ui, sans-serif" },
      { label: 'Space Grotesk',   value: "'Space Grotesk', system-ui, sans-serif" },
      { label: 'DM Sans',         value: "'DM Sans', system-ui, sans-serif" },
      { label: 'Syne',            value: "'Syne', system-ui, sans-serif" },
      { label: 'Playfair Display', value: "'Playfair Display', Georgia, serif" },
    ];

    const MONO_OPTIONS = [
      { label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
      { label: 'IBM Plex Mono',  value: "'IBM Plex Mono', monospace" },
      { label: 'Courier New',    value: "'Courier New', monospace" },
    ];

    const RADIUS_PRESETS = [
      { label: 'Sharp',      values: { '--radius-sm': '0px',    '--radius-md': '0px',    '--radius-lg': '0px',    '--radius-xl': '0px' } },
      { label: 'Suave',      values: { '--radius-sm': '4px',    '--radius-md': '8px',    '--radius-lg': '12px',   '--radius-xl': '20px' } },
      { label: 'Medio',      values: { '--radius-sm': '6px',    '--radius-md': '12px',   '--radius-lg': '20px',   '--radius-xl': '32px' } },
      { label: 'Redondeado', values: { '--radius-sm': '10px',   '--radius-md': '18px',   '--radius-lg': '28px',   '--radius-xl': '44px' } },
      { label: 'Pill',       values: { '--radius-sm': '9999px', '--radius-md': '9999px', '--radius-lg': '9999px', '--radius-xl': '9999px' } },
    ];

    const TAB_ITEMS = [
      { id: 'colors',     label: 'Colores',    icon: <Palette className="w-4 h-4" /> },
      { id: 'typography', label: 'Tipografía', icon: <TypeIcon className="w-4 h-4" /> },
      { id: 'spacing',    label: 'Bordes',     icon: <Sliders className="w-4 h-4" /> },
      { id: 'effects',    label: 'Efectos',    icon: <Wand2 className="w-4 h-4" /> },
      { id: 'material',   label: 'Material',   icon: <span className="text-sm">M</span> },
    ] as const;

    const glowIntensity = Math.round(parseFloat(dsTokens['--glow-intensity'] ?? '0.30') * 100);

    // ── MUI Theme synced from dsTokens ───────────────────────────────────────
    const isMdDark = dsTokens['--color-bg'] !== '#FFFBFE' && dsTokens['--color-bg'] !== '#FAFDFD' && dsTokens['--color-bg'] !== '#FFFBFF' && dsTokens['--color-bg'] !== '#FBFDF7' && dsTokens['--color-bg'] !== '#FFFBFF';
    const muiTheme = createTheme({
      palette: {
        mode: isMdDark ? 'dark' : 'light',
        primary:   { main: dsTokens['--color-primary']        ?? '#6750A4' },
        secondary: { main: dsTokens['--color-secondary']      ?? '#625B71' },
        background: {
          default: dsTokens['--color-bg']      ?? '#FFFBFE',
          paper:   dsTokens['--color-surface'] ?? '#FFFBFE',
        },
        text: {
          primary:   dsTokens['--color-text']       ?? '#1C1B1F',
          secondary: dsTokens['--color-text-muted'] ?? '#49454F',
        },
        divider: dsTokens['--color-border'] ?? '#CAC4D0',
      },
      typography: {
        fontFamily: dsTokens['--font-body'] ?? "'Roboto', system-ui, sans-serif",
        h6: { fontFamily: dsTokens['--font-heading'] ?? "'Roboto', system-ui, sans-serif" },
        h5: { fontFamily: dsTokens['--font-heading'] ?? "'Roboto', system-ui, sans-serif" },
      },
      shape: { borderRadius: parseInt(dsTokens['--radius-md'] ?? '12') },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
          },
        },
        MuiCard: {
          styleOverrides: { root: { borderRadius: parseInt(dsTokens['--radius-lg'] ?? '16') } },
        },
      },
    });

    // ── Live Preview Component ───────────────────────────────────────────────
    const LivePreview = () => (
      <div style={{
        background: dsTokens['--color-bg'] ?? '#09090B',
        borderRadius: dsTokens['--radius-lg'] ?? '16px',
        padding: '28px',
        fontFamily: dsTokens['--font-body'] ?? 'Inter, sans-serif',
        border: `1px solid ${dsTokens['--color-border'] ?? '#27272A'}`,
      }}>
        {/* Label */}
        <p style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: dsTokens['--color-text-muted'], fontFamily: dsTokens['--font-mono'], marginBottom: '20px', fontWeight: 700 }}>
          LIVE PREVIEW — PLANOZERO COMPONENTS
        </p>

        {/* Typography */}
        <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${dsTokens['--color-border'] ?? '#27272A'}` }}>
          <h1 style={{ fontFamily: dsTokens['--font-heading'], color: dsTokens['--color-text'], fontSize: '28px', fontWeight: 900, lineHeight: 1, marginBottom: '6px', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.03em' }}>
            Arquitectura de Marca
          </h1>
          <p style={{ color: dsTokens['--color-text-muted'], fontSize: '13px', lineHeight: 1.6, marginBottom: '6px' }}>
            Decodificamos la esencia de tu negocio para transformarla en narrativa visual.
          </p>
          <p style={{ fontFamily: dsTokens['--font-mono'], color: dsTokens['--color-secondary'], fontSize: '10px', letterSpacing: '0.1em' }}>
            const brand = 'planozero'; // v2.0
          </p>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button style={{
            background: dsTokens['--color-primary'],
            color: '#fff',
            padding: '10px 20px',
            borderRadius: dsTokens['--radius-md'] ?? '8px',
            border: 'none',
            fontFamily: dsTokens['--font-heading'],
            fontWeight: 800,
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: `0 0 30px rgba(0,0,0,0.3)`,
          }}>LET'S BUILD →</button>
          <button style={{
            background: 'transparent',
            color: dsTokens['--color-text'],
            padding: '10px 20px',
            borderRadius: dsTokens['--radius-md'] ?? '8px',
            border: `1px solid ${dsTokens['--color-border']}`,
            fontFamily: dsTokens['--font-mono'],
            fontWeight: 700,
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}>VER SERVICIOS</button>
        </div>

        {/* Card */}
        <div style={{
          background: dsTokens['--color-surface'],
          border: `1px solid ${dsTokens['--color-border']}`,
          borderRadius: dsTokens['--radius-lg'] ?? '16px',
          padding: '18px',
          marginBottom: '14px',
        }}>
          <div style={{ color: dsTokens['--color-primary'], fontSize: '9px', fontFamily: dsTokens['--font-mono'], letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>01 — BRANDING</div>
          <h3 style={{ color: dsTokens['--color-text'], fontFamily: dsTokens['--font-heading'], fontSize: '16px', fontWeight: 900, marginBottom: '6px', textTransform: 'uppercase', fontStyle: 'italic' }}>Identidad Visual</h3>
          <p style={{ color: dsTokens['--color-text-muted'], fontSize: '12px', lineHeight: 1.6 }}>Estrategia visual enfocada en diferenciación y recordación de marca.</p>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Cuéntanos tu idea de negocio..."
          readOnly
          style={{
            width: '100%',
            background: dsTokens['--color-surface-raised'],
            border: `1px solid ${dsTokens['--color-border']}`,
            borderRadius: dsTokens['--radius-md'] ?? '8px',
            padding: '10px 14px',
            color: dsTokens['--color-text-muted'],
            fontFamily: dsTokens['--font-body'],
            fontSize: '12px',
            boxSizing: 'border-box' as const,
          }}
        />
      </div>
    );

    // ── Color picker helper ─────────────────────────────────────────────────
    const ColorRow = ({ tokenKey, label, desc }: { tokenKey: string; label: string; desc: string }) => (
      <div className="flex items-center gap-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group">
        <div className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-xl border-2 border-zinc-700 shadow-inner cursor-pointer overflow-hidden"
            style={{ background: dsTokens[tokenKey] ?? '#888' }}
          />
          <input
            type="color"
            value={dsTokens[tokenKey] ?? '#888888'}
            onChange={(e) => handleTokenChange(tokenKey, e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-10 h-10"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{label}</p>
          <p className="text-[9px] text-zinc-500 truncate">{desc}</p>
        </div>
        <code className="text-[9px] font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded-lg flex-shrink-0 group-hover:text-zinc-300 transition-colors">
          {dsTokens[tokenKey] ?? ''}
        </code>
      </div>
    );

    return (
      <motion.div key="ds-view" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black mb-1 uppercase tracking-tighter italic text-white flex items-center gap-3">
              <Palette className="w-8 h-8 text-[var(--color-primary)]" />
              Sistema de Diseño
            </h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">PlanoZero Design Tokens — Edita y aplica en tiempo real.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setDsTokens(DEFAULT_DESIGN_TOKENS); applyDesignTokens(DEFAULT_DESIGN_TOKENS); }}
              className="flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Resetear
            </button>
            <button
              onClick={saveDesignTokens}
              disabled={dsSaving}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-lg"
            >
              {dsSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {dsSaving ? 'Guardando...' : 'Guardar y Aplicar'}
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

          {/* ── Left: Editor Panel ── */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] overflow-hidden shadow-2xl">

            {/* Tab bar */}
            <div className="flex border-b border-zinc-800 bg-zinc-950/50">
              {TAB_ITEMS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDsTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-[9px] font-black uppercase tracking-widest transition-all border-b-2 ${
                    dsTab === tab.id
                      ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6">
              <AnimatePresence mode="wait">

                {/* ─── Colors ─── */}
                {dsTab === 'colors' && (
                  <motion.div key="colors" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                    <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-600 mb-4 flex items-center gap-2">
                      <CornerDownRight className="w-3 h-3" /> Haz click en el color para abrir el selector
                    </p>
                    {COLOR_TOKENS.map(({ key, label, desc }) => (
                      <ColorRow key={key} tokenKey={key} label={label} desc={desc} />
                    ))}
                  </motion.div>
                )}

                {/* ─── Typography ─── */}
                {dsTab === 'typography' && (
                  <motion.div key="typography" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                    {/* Heading font */}
                    <div>
                      <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500 block mb-3">Fuente de Títulos</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {FONT_OPTIONS.map(f => (
                          <button
                            key={f.value}
                            onClick={() => handleTokenChange('--font-heading', f.value)}
                            style={{ fontFamily: f.value }}
                            className={`p-3 rounded-xl border text-sm font-bold transition-all text-left ${
                              dsTokens['--font-heading'] === f.value
                                ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/50 text-[var(--color-primary)]'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                            }`}
                          >
                            {f.label}
                            <span className="block text-[9px] font-mono opacity-50 mt-0.5 normal-case" style={{ fontFamily: 'monospace' }}>Aa Bb Cc</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body font */}
                    <div>
                      <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500 block mb-3">Fuente de Cuerpo</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {FONT_OPTIONS.map(f => (
                          <button
                            key={f.value}
                            onClick={() => handleTokenChange('--font-body', f.value)}
                            style={{ fontFamily: f.value }}
                            className={`p-3 rounded-xl border text-sm transition-all text-left ${
                              dsTokens['--font-body'] === f.value
                                ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/50 text-[var(--color-primary)]'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                            }`}
                          >
                            {f.label}
                            <span className="block text-[9px] font-mono opacity-50 mt-0.5 normal-case" style={{ fontFamily: 'monospace' }}>Aa Bb Cc</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mono font */}
                    <div>
                      <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500 block mb-3">Fuente Monoespaciada</label>
                      <div className="grid grid-cols-3 gap-2">
                        {MONO_OPTIONS.map(f => (
                          <button
                            key={f.value}
                            onClick={() => handleTokenChange('--font-mono', f.value)}
                            style={{ fontFamily: f.value }}
                            className={`p-3 rounded-xl border text-xs transition-all text-left ${
                              dsTokens['--font-mono'] === f.value
                                ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/50 text-[var(--color-primary)]'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'
                            }`}
                          >
                            {f.label}
                            <span className="block text-[9px] opacity-50 mt-0.5">01 const</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font preview */}
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                      <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Preview tipográfico</p>
                      <p style={{ fontFamily: dsTokens['--font-heading'], fontWeight: 900, fontSize: '22px', color: 'var(--color-text)', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 1 }}>
                        PlanoZero Studio
                      </p>
                      <p style={{ fontFamily: dsTokens['--font-body'], fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                        Diseñamos marcas con propósito y precisión estratégica.
                      </p>
                      <p style={{ fontFamily: dsTokens['--font-mono'], fontSize: '10px', color: 'var(--color-secondary)', letterSpacing: '0.1em' }}>
                        {'const brand = { name: "planozero", v: 2 };'}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ─── Spacing / Radius ─── */}
                {dsTab === 'spacing' && (
                  <motion.div key="spacing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">

                    <div>
                      <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500 block mb-4">Presets de Radio de Esquinas</label>
                      <div className="grid grid-cols-5 gap-2 mb-6">
                        {RADIUS_PRESETS.map(preset => (
                          <button
                            key={preset.label}
                            onClick={() => {
                              const next = { ...dsTokens, ...preset.values };
                              setDsTokens(next);
                              applyDesignTokens(next);
                            }}
                            className="flex flex-col items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-[var(--color-primary)]/50 hover:bg-zinc-800 transition-all group"
                          >
                            <div
                              className="w-10 h-10 border-2 border-zinc-600 group-hover:border-[var(--color-primary)] transition-colors bg-zinc-950"
                              style={{ borderRadius: preset.values['--radius-md'] }}
                            />
                            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">{preset.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Manual radius inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        {(['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl'] as const).map(key => (
                          <div key={key} className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                            <div className="w-8 h-8 border-2 border-zinc-700 bg-zinc-950 flex-shrink-0" style={{ borderRadius: dsTokens[key] }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{key.replace('--radius-', 'Radius ')}</p>
                              <input
                                type="text"
                                value={dsTokens[key] ?? ''}
                                onChange={e => handleTokenChange(key, e.target.value)}
                                className="bg-transparent text-xs font-bold text-white w-full focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ─── Effects ─── */}
                {dsTab === 'effects' && (
                  <motion.div key="effects" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                      <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-600 mb-4">Intensidad de Glow / Halos</p>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={glowIntensity}
                          onChange={e => handleTokenChange('--glow-intensity', (parseInt(e.target.value) / 100).toFixed(2))}
                          className="flex-1 accent-[var(--color-primary)]"
                        />
                        <div
                          className="w-10 h-10 rounded-full flex-shrink-0"
                          style={{
                            background: dsTokens['--color-primary'],
                            boxShadow: `0 0 ${glowIntensity * 0.8}px rgba(255,95,31,${glowIntensity / 100})`
                          }}
                        />
                        <span className="text-sm font-black text-white w-12 text-right">{glowIntensity}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                        <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-600">Preview de Efectos</p>
                        <div className="flex gap-4 items-center justify-center py-6">
                          <div
                            className="w-16 h-16 rounded-2xl"
                            style={{
                              background: dsTokens['--color-primary'],
                              boxShadow: `0 0 ${glowIntensity}px rgba(255,95,31,${glowIntensity/100})`,
                            }}
                          />
                          <div
                            className="w-16 h-16 rounded-2xl border-2"
                            style={{
                              borderColor: dsTokens['--color-secondary'],
                              boxShadow: `0 0 ${glowIntensity*0.7}px rgba(34,211,238,${glowIntensity/100*0.7})`,
                            }}
                          />
                          <div
                            className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700"
                            style={{ backdropFilter: 'blur(12px)' }}
                          />
                        </div>
                        <p className="text-[9px] text-zinc-600 font-mono text-center">Primario · Secundario · Glassmorphism</p>
                      </div>
                    </div>

                    {/* Token export */}
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                      <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-600 mb-3">Exportar CSS Tokens</p>
                      <pre className="text-[8px] font-mono text-zinc-500 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                        {`:root {\n${Object.entries(dsTokens).map(([k,v]) => `  ${k}: ${v};`).join('\n')}\n}`}
                      </pre>
                      <button
                        onClick={() => navigator.clipboard.writeText(`:root {\n${Object.entries(dsTokens).map(([k,v]) => `  ${k}: ${v};`).join('\n')}\n}`)}
                        className="mt-3 flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-zinc-500 hover:text-[var(--color-primary)] transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Copiar al portapapeles
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ─── Material Design ─── */}
                {dsTab === 'material' && (
                  <motion.div key="material" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#6750A4]/10 to-[#625B71]/5 border border-[#6750A4]/20 rounded-2xl">
                      <div className="w-10 h-10 bg-[#6750A4] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#6750A4]/30">M</div>
                      <div>
                        <p className="text-sm font-black text-white">Material Design 3</p>
                        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Google Material You — Componentes y tokens MD3</p>
                      </div>
                    </div>

                    {/* Preset selector */}
                    <div>
                      <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500 block mb-3">Presets de Color MD3</label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {Object.entries(MD3_PRESETS).map(([key, preset]) => (
                          <button
                            key={key}
                            onClick={() => {
                              const next = { ...dsTokens, ...preset.tokens };
                              setDsTokens(next);
                              applyDesignTokens(next);
                              setActiveMdPreset(key);
                            }}
                            className={`flex flex-col items-start gap-1 p-3 rounded-xl border transition-all text-left ${
                              activeMdPreset === key
                                ? 'border-[#6750A4] bg-[#6750A4]/10'
                                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="text-base">{preset.emoji}</span>
                              <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full border border-zinc-700" style={{ background: preset.tokens['--color-primary'] }} />
                                <div className="w-3 h-3 rounded-full border border-zinc-700" style={{ background: preset.tokens['--color-bg'] }} />
                              </div>
                            </div>
                            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-300">{preset.label}</span>
                          </button>
                        ))}
                        <button
                          onClick={() => { setDsTokens(DEFAULT_DESIGN_TOKENS); applyDesignTokens(DEFAULT_DESIGN_TOKENS); setActiveMdPreset(null); }}
                          className={`flex flex-col items-start gap-1 p-3 rounded-xl border transition-all text-left ${
                            activeMdPreset === null
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                              : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-base">⚡</span>
                            <div className="flex gap-1">
                              <div className="w-3 h-3 rounded-full border border-zinc-700" style={{ background: '#FF5F1F' }} />
                              <div className="w-3 h-3 rounded-full border border-zinc-700" style={{ background: '#09090B' }} />
                            </div>
                          </div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-300">PlanoZero</span>
                        </button>
                      </div>
                      <p className="text-[9px] font-mono text-zinc-600 px-1">Los colores del preset se aplican al editor — puedes seguir editándolos manualmente.</p>
                    </div>

                    {/* MUI Component Gallery */}
                    <div>
                      <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500 block mb-3">Componentes Material UI en vivo</label>
                      <MuiThemeProvider theme={muiTheme}>
                        <Box sx={{
                          p: 3,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.default',
                          '& *': { fontFamily: 'inherit' }
                        }}>
                          <Typography variant="caption" sx={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: 'text.secondary', fontWeight: 700, display: 'block', mb: 2 }}>
                            Material You Components — Render en Tiempo Real
                          </Typography>

                          {/* Typography */}
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Arquitectura de Marca</Typography>
                            <Typography variant="body2" color="text.secondary">Soluciones de diseño estratégico para empresas con visión.</Typography>
                            <Typography variant="caption" sx={{ fontFamily: "'Roboto Mono', monospace", color: 'primary.main', display: 'block', mt: 0.5 }}>
                              const design = 'material3';
                            </Typography>
                          </Box>

                          <Divider sx={{ mb: 3 }} />

                          {/* Buttons */}
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Botones</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                              <MuiButton variant="contained" color="primary" disableElevation>Contained</MuiButton>
                              <MuiButton variant="outlined" color="primary">Outlined</MuiButton>
                              <MuiButton variant="text" color="primary">Text</MuiButton>
                              <MuiFab color="primary" size="small" aria-label="add"><AddIcon /></MuiFab>
                              <IconButton color="primary"><FavoriteIcon /></IconButton>
                            </Box>
                          </Box>

                          {/* Chips */}
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Chips</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              <MuiChip label="Branding" color="primary" />
                              <MuiChip label="Web Design" color="secondary" variant="outlined" />
                              <MuiChip label="Fotografía" variant="outlined" />
                              <MuiChip label="Publicidad" color="primary" variant="outlined" />
                            </Box>
                          </Box>

                          {/* Card */}
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Card</Typography>
                            <MuiCard elevation={2} sx={{ maxWidth: '100%' }}>
                              <CardHeader
                                avatar={<MuiAvatar sx={{ bgcolor: 'primary.main' }}>P</MuiAvatar>}
                                action={<IconButton><MoreVertIcon /></IconButton>}
                                title="PlanoZero Studio"
                                subheader="Diseño Estratégico"
                              />
                              <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                  Transformamos negocios a través del diseño visual con propósito y precisión estratégica.
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <IconButton aria-label="add to favorites"><FavoriteIcon /></IconButton>
                                <IconButton aria-label="share"><ShareIcon /></IconButton>
                                <MuiButton size="small" color="primary">Ver más</MuiButton>
                              </CardActions>
                            </MuiCard>
                          </Box>

                          {/* TextField + Switch */}
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Inputs y Controles</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <MuiTextField label="Tu idea de negocio" variant="outlined" size="small" fullWidth placeholder="Cuéntanos..." />
                              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                <FormControlLabel control={<MuiSwitch defaultChecked color="primary" />} label="Modo activo" />
                                <FormControlLabel control={<MuiSwitch color="secondary" />} label="Notificaciones" />
                              </Box>
                            </Box>
                          </Box>

                          {/* Alert + Progress */}
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Feedback</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                              <MuiAlert severity="success" variant="filled">Proyecto guardado exitosamente.</MuiAlert>
                              <MuiAlert severity="info" variant="outlined">Nueva licitación disponible en Mercado Público.</MuiAlert>
                              <Box>
                                <Typography variant="caption" color="text.secondary" gutterBottom>Progreso del proyecto — 72%</Typography>
                                <MuiLinearProgress variant="determinate" value={72} color="primary" sx={{ height: 8, borderRadius: 4, mt: 0.5 }} />
                              </Box>
                              <MuiSlider defaultValue={65} aria-label="Intensidad" color="primary" />
                            </Box>
                          </Box>

                        </Box>
                      </MuiThemeProvider>
                    </div>

                    {/* Token comparison */}
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                      <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-600 mb-3">Tokens activos vs MD3 estándar</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Primary', current: dsTokens['--color-primary'], md3: '#6750A4' },
                          { label: 'Secondary', current: dsTokens['--color-secondary'], md3: '#625B71' },
                          { label: 'Background', current: dsTokens['--color-bg'], md3: '#FFFBFE' },
                          { label: 'Surface', current: dsTokens['--color-surface'], md3: '#FFFBFE' },
                        ].map(row => (
                          <div key={row.label} className="flex items-center gap-2 p-2 bg-zinc-900 rounded-lg">
                            <div className="flex gap-1">
                              <div className="w-4 h-4 rounded border border-zinc-700" style={{ background: row.current }} title="Actual" />
                              <div className="w-4 h-4 rounded border border-zinc-700" style={{ background: row.md3 }} title="MD3 estándar" />
                            </div>
                            <span className="text-[9px] font-mono text-zinc-400">{row.label}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[8px] font-mono text-zinc-700 mt-2">Izquierda: tu tema actual · Derecha: MD3 estándar</p>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: Live Preview ── */}
          <div className="space-y-4">
            <div className="sticky top-6">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500">Preview en Tiempo Real</p>
              </div>
              <LivePreview />

              {/* Token info bar */}
              <div className="mt-3 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
                <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-zinc-600 mb-2">Tokens activos</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(dsTokens).filter(([k]) => k.startsWith('--color')).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1.5 bg-zinc-800 px-2 py-1 rounded-lg">
                      <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: v }} />
                      <span className="text-[7px] font-mono text-zinc-400">{k.replace('--color-', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    );
  };

  const renderContent = () => {

    switch (view) {
      case 'overview': return renderOverview();
      case 'posts': return renderPosts();
      case 'messages': return renderMessages();
      case 'pages': return renderPages();
      case 'menus': return renderMenus();
      case 'logs': return renderLogs();
      case 'config': return renderProfile();
      case 'mercado-publico': return renderMercadoPublico();
      case 'design-system': return renderDesignSystem();
      default: return renderOverview();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Engineering Blueprint Background */}
        <div className="absolute inset-0 z-0 opacity-10 filter grayscale mix-blend-screen pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=1920" 
            className="w-full h-full object-cover" 
            alt="Technical Blueprint Design"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/60 to-zinc-950" />
        </div>

        <div className="w-full max-w-sm bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800 p-8 rounded-[48px] text-center space-y-6 relative z-10 shadow-2xl overflow-hidden group">
          {/* Subtle Decorative Accents */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF5F1F] to-transparent opacity-20" />
          
          <div className="flex justify-center relative">
             <div className="w-20 h-20 bg-[#FF5F1F] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#FF5F1F]/20 group-hover:scale-110 transition-transform duration-500">
                <LayoutDashboard className="w-10 h-10 text-white" />
             </div>
             <div className="absolute -inset-4 bg-[#FF5F1F]/10 blur-3xl rounded-full -z-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">PLANOZERO_CONTROL</h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Sistema de Gestión de Activos</p>
          </div>

          <div className="h-px bg-zinc-800 w-12 mx-auto" />

          <button 
            onClick={handleLogin}
            className="w-full bg-white text-zinc-950 font-black uppercase text-[10px] tracking-widest py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-[#FF5F1F] hover:text-white transition-all shadow-xl group/btn"
          >
            <div className="w-5 h-5 bg-zinc-100 rounded flex items-center justify-center p-1 group-hover/btn:bg-white/20">
              <img src="https://www.google.com/favicon.ico" className="w-full h-full" alt="Google" referrerPolicy="no-referrer" />
            </div>
            Ingresar con Google
          </button>

          <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-[0.3em]">Acceso Restringido • Terminal P0-V1</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-[100]">
        <Logo className="scale-75 origin-left" />
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-[#FF5F1F] rounded-full animate-pulse" />
           <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Node Sync</span>
           <button
             onClick={() => setIsMobileMenuOpen(true)}
             className="p-2 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
           </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-zinc-950 border-r border-zinc-800 flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-white font-bold text-sm">Menú</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400 hover:text-white p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {[
                { id: 'overview', label: 'Inicio', icon: LayoutDashboard },
                { id: 'posts', label: 'Publicaciones', icon: FileText },
                { id: 'messages', label: 'Mensajes', icon: MessageSquare },
                { id: 'pages', label: 'Páginas', icon: Layout },
                { id: 'menus', label: 'Menús', icon: List },
                { id: 'config', label: 'Mi Perfil', icon: Settings },
                { id: 'logs', label: 'Logs de Errores', icon: Terminal },
                { id: 'mercado-publico', label: 'Mercado Público', icon: ShoppingBag },
              ].map((item: any) => (
                <button
                  key={item.id}
                  onClick={() => { setView(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                    view === item.id
                      ? 'bg-[#FF5F1F] text-white'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 hidden lg:flex flex-col overflow-hidden bg-zinc-950/50 backdrop-blur-xl">
        <div className="relative p-8 mb-4">
           {/* Abstract Decorative Background */}
           <div className="absolute inset-0 z-0 opacity-10 overflow-hidden grayscale pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=400" 
                className="w-full h-full object-cover" 
                alt="Blueprint Decor"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />
           </div>
           
           <div className="relative z-10">
              <Logo />
              <div className="mt-4 flex items-center gap-2">
                 <div className="w-1 h-3 bg-[#FF5F1F] rounded-full animate-pulse" />
                 <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-[0.4em]">Node-System Active</span>
              </div>
           </div>
        </div>
        
        <nav className="flex-grow px-4 space-y-1">
          <button 
            onClick={() => setView('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'overview' ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Inicio
          </button>
          
          <button 
            onClick={() => setView('posts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'posts' ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
          >
            <FileText className="w-5 h-5" /> Publicaciones
          </button>
          <button 
            onClick={() => setView('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'messages' ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
          >
            <MessageSquare className="w-5 h-5" /> Mensajes
            {contacts.filter(c => c.status === 'pending').length > 0 && (
              <span className="ml-auto bg-white text-[#FF5F1F] text-[10px] px-2 py-0.5 rounded-full">
                {contacts.filter(c => c.status === 'pending').length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => {
              setLibraryContext(null);
              setIsLibraryOpen(true);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-zinc-500 hover:text-white hover:bg-zinc-900`}
          >
            <ImageIcon className="w-5 h-5" /> Multimedia
          </button>
          
          <div className="pt-8 pb-4">
             <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest pl-4">Arquitectura CMS</span>
          </div>

          <button 
            onClick={() => setView('pages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'pages' ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
          >
            <Layout className="w-5 h-5" /> Páginas
          </button>

          <button 
            onClick={() => setView('menus')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'menus' ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
          >
            <List className="w-5 h-5" /> Menús
          </button>

          <button 
            onClick={() => setView('config')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'config' ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
          >
            <Settings className="w-5 h-5" /> Mi Perfil
          </button>

          <button 
            onClick={() => setView('logs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'logs' ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
          >
            <Terminal className="w-5 h-5" /> Logs de Errores
          </button>

          <div className="pt-8 pb-4">
             <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest pl-4">Integraciones</span>
          </div>

          <button 
            onClick={() => setView('mercado-publico')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'mercado-publico' ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
          >
            <ShoppingBag className="w-5 h-5" /> Mercado Público
          </button>

          <button 
            onClick={() => setView('design-system')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'design-system' ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
          >
            <Palette className="w-5 h-5" /> Sistema de Diseño
          </button>

        </nav>

        <div className="pt-6 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <img src={user.photoURL || undefined} className="w-10 h-10 rounded-full border border-zinc-700" alt={user.displayName || ''} referrerPolicy="no-referrer" />
            <div className="overflow-hidden">
               <p className="text-sm font-bold truncate">{user.displayName}</p>
               <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
          <a
            href="/portafolio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-3 mb-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-[#FF5F1F]/50 hover:bg-zinc-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#FF5F1F]/10 rounded-lg flex items-center justify-center text-[#FF5F1F] group-hover:bg-[#FF5F1F] group-hover:text-white transition-all">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-black text-white leading-tight">Portafolio</p>
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Privado</p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#FF5F1F] transition-colors" />
          </a>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-[#FF5F1F] transition-colors">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-[100]">
        <nav className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 flex justify-around p-2 rounded-[24px] shadow-2xl">
          <button 
            onClick={() => setView('overview')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${view === 'overview' ? 'text-[#FF5F1F]' : 'text-zinc-500'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-tighter">Inicio</span>
          </button>
          <button 
            onClick={() => setView('posts')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${view === 'posts' ? 'text-[#FF5F1F]' : 'text-zinc-500'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-tighter">Posts</span>
          </button>
          <button 
            onClick={() => setView('pages')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${view === 'pages' ? 'text-[#FF5F1F]' : 'text-zinc-500'}`}
          >
            <Layout className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-tighter">Páginas</span>
          </button>
          <button 
            onClick={() => setView('messages')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative ${view === 'messages' ? 'text-[#FF5F1F]' : 'text-zinc-500'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-tighter">Inbox</span>
            {contacts.filter(c => c.status === 'pending').length > 0 && (
              <span className="absolute top-1 right-1 bg-[#FF5F1F] text-white text-[7px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-black border border-zinc-950">
                {contacts.filter(c => c.status === 'pending').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setView('mercado-publico')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${view === 'mercado-publico' ? 'text-[#FF5F1F]' : 'text-zinc-500'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[8px] font-black uppercase tracking-tighter">Mercado</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-12 overflow-y-auto pb-32 lg:pb-12 h-screen custom-scrollbar relative">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {isLibraryOpen && (
          <MediaLibrary 
            isOpen={isLibraryOpen}
            onClose={() => setIsLibraryOpen(false)}
            onSelect={(url) => {
              if (libraryContext === 'featured') {
                setFormData(prev => ({ ...prev, image: url }));
              }
              setIsLibraryOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Page Editor Modal */}
      <AnimatePresence>
        {isPageEditorOpen && (
          <PageDesigner 
            onClose={() => setIsPageEditorOpen(false)}
            onSave={handleSavePage}
            onDelete={handleDeletePage}
            initialData={editingPage}
          />
        )}
      </AnimatePresence>

      {/* Content Type Modal */}
      <AnimatePresence>
        {isTypeFormOpen && (
          <ContentTypeForm 
            onClose={() => setIsTypeFormOpen(false)}
            onSave={handleSaveType}
            initialData={editingType}
          />
        )}
      </AnimatePresence>

      {/* Editor Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl p-6 rounded-3xl md:rounded-[48px] shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">{editingPost ? 'Editar Post' : 'Crear Post'}</h2>
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF5F1F]/20 transition-all"
                  >
                    <Maximize className="w-4 h-4" /> Vista Previa
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Título</label>
                    <input 
                      required
                      type="text" 
                      value={formData.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        const newSlug = slugify(newTitle);
                        setFormData({
                          ...formData, 
                          title: newTitle,
                          slug: formData.slug === slugify(formData.title) ? newSlug : formData.slug
                        });
                      }}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF5F1F] transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Slug (URL)</label>
                    <input 
                      required
                      type="text" 
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: slugify(e.target.value)})}
                      placeholder="mi-post-increible"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF5F1F] transition-all font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Categoría</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF5F1F] transition-all appearance-none"
                    >
                      <option>Estrategia</option>
                      <option>Diseño</option>
                      <option>Marketing</option>
                      <option>Tecnología</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Imagen Destacada</label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative group overflow-hidden bg-zinc-800 border border-zinc-700 rounded-2xl">
                        <input 
                          type="url" 
                          value={formData.image}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                          placeholder="https://..."
                          className="w-full bg-transparent px-6 py-4 focus:outline-none text-sm pr-12 transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <LinkIcon className="w-3.5 h-3.5 text-zinc-600" />
                        </div>
                      </div>
                      <label className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 w-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all hover:border-[#FF5F1F]/50 group">
                        <Cloud className="w-5 h-5 text-zinc-500 group-hover:text-[#FF5F1F] transition-colors" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const files = e.currentTarget.files;
                            const file = files ? files[0] : null;
                            if (!file) return;
                            try {
                              const path = `uploads/posts/${Date.now()}-${file.name}`;
                              const url = await handleFileUpload(file, path);
                              setFormData({ ...formData, image: url });
                            } catch (err) {
                              console.error("Upload error:", err);
                              alert("Error al subir imagen");
                            }
                          }}
                        />
                      </label>
                      <button 
                        type="button"
                        onClick={() => {
                          setLibraryContext('featured');
                          setIsLibraryOpen(true);
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all hover:border-[#FF5F1F]/50 group"
                      >
                        <ImageIcon className="w-5 h-5 text-zinc-500 group-hover:text-[#FF5F1F] transition-colors" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 group-hover:text-white">Librería</span>
                      </button>
                    </div>
                  </div>
                  {formData.image && (
                    <div className="h-14 w-24 bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 shrink-0 group relative">
                      <img src={formData.image || undefined} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                      <button 
                         type="button"
                         onClick={() => setFormData({...formData, image: ''})}
                         className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                         <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Palabras Clave (SEO - separadas por coma)</label>
                  <input 
                    type="text" 
                    value={formData.keywords}
                    onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                    placeholder="estrategia, diseño, branding, startup..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF5F1F] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Resumen (Excerpt)</label>
                  <textarea 
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF5F1F] transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Contenido del Post</label>
                  <WysiwygEditor 
                    value={formData.content}
                    onChange={(val) => setFormData({...formData, content: val})}
                    placeholder="Escribe el contenido de tu post aquí..."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, published: !formData.published})}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${formData.published ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
                  >
                    {formData.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {formData.published ? 'Publicado' : 'Borrador'}
                  </button>
                  
                  <button 
                    type="submit"
                    disabled={isSavingPost}
                    className="flex-grow bg-[#FF5F1F] text-white font-bold py-4 rounded-[24px] flex items-center justify-center gap-2 hover:bg-[#E54E10] transition-colors shadow-2xl shadow-[#FF5F1F]/20 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingPost ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Save className="w-6 h-6" />
                    )}
                    {isSavingPost ? 'PROCESANDO...' : (editingPost ? 'ACTUALIZAR' : 'PUBLICAR')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Post Preview Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black overflow-y-auto no-scrollbar flex flex-col"
          >
            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-zinc-900 p-6 flex justify-between items-center shadow-2xl">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#FF5F1F] rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-[#FF5F1F]/20 text-white text-xl">P0</div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Previsualización de Post</h4>
                    <p className="text-[8px] font-mono text-zinc-500 uppercase mt-1">Entorno de Desarrollo PlanoZero</p>
                  </div>
               </div>
               <button 
                onClick={() => setIsPreviewModalOpen(false)}
                className="bg-white text-black px-10 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform"
               >
                 Volver al Editor
               </button>
            </div>

            <article className="flex-grow max-w-4xl mx-auto w-full py-16 px-6">
               <header className="space-y-8 mb-12">
                  <div className="inline-block px-4 py-1.5 bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {formData.category}
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black uppercase italic tracking-tighter leading-none text-white">
                    {formData.title || 'Título de tu Post'}
                  </h1>
                  <p className="text-2xl text-zinc-500 font-medium leading-relaxed max-w-2xl italic">
                    {formData.excerpt || 'Este espacio contendrá el resumen de tu post cuando lo escribas...'}
                  </p>
                  <div className="flex items-center gap-5 pt-8 border-t border-zinc-900">
                     <div className="w-14 h-14 bg-zinc-900 rounded-full border border-zinc-800 bg-cover bg-center" style={{ backgroundImage: profileData.photoURL ? `url(${profileData.photoURL})` : 'none' }} />
                     <div>
                        <p className="text-xs font-bold uppercase text-white">{profileData.displayName || (user?.displayName || 'Admin')}</p>
                        <p className="text-[10px] font-mono text-zinc-600 uppercase">Editor • PlanoZero Studio</p>
                     </div>
                  </div>
               </header>

               {formData.image && (
                 <div className="w-full aspect-[21/9] bg-zinc-900 rounded-[56px] overflow-hidden border border-zinc-800 mb-24 shadow-2xl">
                    <img src={formData.image || undefined} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                 </div>
               )}
               
               {/* Styled HTML Content Canvas */}
               <div className="w-full min-h-[600px] rounded-[40px] overflow-hidden bg-zinc-950/50 border border-zinc-900 p-2 shadow-inner">
                  <iframe 
                    srcDoc={generateHtmlPreview(formData.content || '')}
                    title="Full Preview Content"
                    className="w-full h-full min-h-[580px] border-none"
                    sandbox="allow-popups allow-scripts"
                  />
               </div>
            </article>

            <footer className="py-16 bg-zinc-950 border-t border-zinc-900 text-center">
               <p className="text-[10px] font-mono text-zinc-800 uppercase tracking-[0.5em]">FIN DE LA PREVISUALIZACIÓN</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;

const MenuItemEditor = ({ item, onSave, onDelete, onMove, pages = [] }: { item: any, onSave: (data: any) => void, onDelete: () => void, onMove?: (dir: 'up' | 'down') => void, pages?: any[] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(item);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-zinc-800 rounded-xl text-[#FF5F1F]">
             <List className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{item.name}</h4>
            <p className="text-[10px] text-zinc-500 font-mono italic">{item.path}</p>
          </div>
          {item.megaMenu && (
            <span className="px-2 py-0.5 bg-[#FF5F1F]/10 text-[#FF5F1F] text-[8px] font-black rounded-lg uppercase tracking-widest">Mega Menu</span>
          )}
          {item.children?.length > 0 && (
            <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[8px] font-black rounded-lg uppercase tracking-widest">{item.children.length} Sub-items</span>
          )}
        </div>
        <div className="flex gap-2">
          {onMove && (
            <>
              <button 
                onClick={() => onMove('up')}
                className="p-2 bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
                title="Subir"
              >
                <ChevronRight className="w-4 h-4 -rotate-90" />
              </button>
              <button 
                onClick={() => onMove('down')}
                className="p-2 bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
                title="Bajar"
              >
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </>
          )}
          <button 
            onClick={() => onSave({ ...item, published: !item.published })}
            className={`p-2 rounded-lg transition-colors ${item.published === false ? 'bg-orange-500/20 text-orange-500' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
            title={item.published === false ? 'Draft' : 'Live'}
          >
            {item.published === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className="p-2 bg-zinc-800 rounded-lg hover:text-[#FF5F1F] transition-colors"><Edit2 className="w-4 h-4" /></button>
          <button onClick={onDelete} className="p-2 bg-red-900/10 text-red-500/50 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-zinc-800 bg-zinc-950/30 p-6 space-y-6"
          >
            {pages.length > 0 && (
              <div className="space-y-2">
                 <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Sugerencias de Páginas</label>
                 <div className="flex flex-wrap gap-2">
                    {pages.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => setEditData({...editData, name: p.title.split('|')[0].trim(), path: p.slug === 'inicio' ? '/' : `/${p.slug}`})}
                        className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                      >
                        {p.slug}
                      </button>
                    ))}
                 </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Nombre Display</label>
                <input 
                  type="text" 
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">URL / Ruta / Ancla</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditData({...editData, path: '#servicios'})}
                      className="text-[8px] bg-zinc-800 hover:bg-[#FF5F1F] px-2 py-0.5 rounded text-zinc-400 hover:text-white transition-colors"
                    >
                      #SERVICIOS
                    </button>
                    <button 
                      onClick={() => setEditData({...editData, path: '#contacto'})}
                      className="text-[8px] bg-zinc-800 hover:bg-[#FF5F1F] px-2 py-0.5 rounded text-zinc-400 hover:text-white transition-colors"
                    >
                      #CONTACTO
                    </button>
                  </div>
                </div>
                <input 
                  type="text" 
                  value={editData.path}
                  onChange={(e) => setEditData({...editData, path: e.target.value})}
                  placeholder="Ej. /pagina o #seccion"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FF5F1F]"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button 
                onClick={() => setEditData({...editData, megaMenu: !editData.megaMenu})}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${editData.megaMenu ? 'bg-[#FF5F1F] text-white shadow-lg' : 'bg-zinc-800 text-zinc-500'}`}
               >
                 Usar Mega Menú
               </button>
               <p className="text-[10px] text-zinc-500 italic">Los Mega Menús despliegan paneles anchos en desktop.</p>
            </div>

            {/* Sub-items Management */}
            <div className="space-y-4 pt-4 border-t border-zinc-800/50">
               <div className="flex justify-between items-center">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Sub-paginas / Enlaces</h5>
                  <button 
                    onClick={() => {
                      const newChild = { name: 'Nueva Subpágina', path: '/', id: Math.random().toString(36).substr(2, 9) };
                      setEditData({...editData, children: [...(editData.children || []), newChild]});
                    }}
                    className="text-[10px] font-bold text-[#FF5F1F] hover:underline"
                  >
                    + AÑADIR SUB-ITEM
                  </button>
               </div>
               
                <div className="space-y-4">
                   {(editData.children || []).map((child: any, cIdx: number) => (
                     <div key={child.id || cIdx} className="space-y-2 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                        <div className="flex gap-2 items-center">
                          <input 
                            type="text"
                            value={child.name}
                            onChange={(e) => {
                              const newChildren = [...editData.children];
                              newChildren[cIdx].name = e.target.value;
                              setEditData({...editData, children: newChildren});
                            }}
                            placeholder="Nombre Disply"
                            className="bg-transparent border-none text-[10px] font-bold focus:outline-none w-1/2"
                          />
                          <input 
                            type="text"
                            value={child.path}
                            onChange={(e) => {
                              const newChildren = [...editData.children];
                              newChildren[cIdx].path = e.target.value;
                              setEditData({...editData, children: newChildren});
                            }}
                            placeholder="URL (#seccion o /pagina)"
                            className="bg-transparent border-none text-[10px] font-mono text-zinc-500 focus:outline-none w-1/2"
                          />
                          <button 
                            onClick={() => {
                              const newChildren = editData.children.filter((_: any, i: number) => i !== cIdx);
                              setEditData({...editData, children: newChildren});
                            }}
                            className="p-1 text-red-500/50 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex gap-2 items-center">
                           <span className="text-[7px] text-zinc-600 font-black uppercase tracking-widest mr-2">Anclas Rápidas:</span>
                           {['#servicios', '#proceso', '#contacto'].map(anchor => (
                             <button 
                                key={anchor}
                                onClick={() => {
                                  const newChildren = [...editData.children];
                                  newChildren[cIdx].path = anchor;
                                  setEditData({...editData, children: newChildren});
                                }}
                                className="text-[7px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 hover:text-[#FF5F1F]"
                             >
                               {anchor}
                             </button>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
            </div>

            <div className="flex gap-3 pt-6">
               <button 
                onClick={() => {
                  onSave(editData);
                  setIsEditing(false);
                }}
                className="bg-[#FF5F1F] text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#FF5F1F]/20"
               >
                 GUARDAR CAMBIOS
               </button>
               <button 
                onClick={() => setIsEditing(false)}
                className="bg-zinc-800 text-zinc-400 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest"
               >
                 CANCELAR
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PageDesigner = ({ onClose, onSave, onDelete, initialData }: { onClose: () => void, onSave: (data: any) => void, onDelete?: (id: string) => void, initialData: any }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [panelTab, setPanelTab] = useState<'content' | 'style' | 'personalization'>('content');
  const [isStructureMode, setIsStructureMode] = useState(false);
  const [draggingType, setDraggingType] = useState<string | null>(null);
  const [isSavingInternal, setIsSavingInternal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Multi-page System
  const [pagesState, setPagesState] = useState<any[]>(initialData ? [initialData] : [{ 
    id: 'new-page', 
    name: 'NUEVA PÁGINA', 
    title: 'Nueva Página Personalizada', 
    slug: 'nueva-pagina', 
    published: false,
    showInNavigation: false,
    order: 99,
    root: { id: 'root', children: [] } 
  }]);
  const [activePageId, setActivePageId] = useState(initialData?.id || 'new-page');

  useEffect(() => {
    if (initialData) {
      setPagesState([initialData]);
      setActivePageId(initialData.id);
    }
  }, [initialData]);

  const currentPage = pagesState.find(p => p.id === activePageId) || pagesState[0];
  const pageData = currentPage;

  const setPageData = (update: any | ((prev: any) => any)) => {
    setPagesState(prev => prev.map(p => {
      if (p.id === activePageId) {
        const newData = typeof update === 'function' ? update(p) : update;
        return { ...p, ...newData };
      }
      return p;
    }));
  };

  // Tree Operations
  const findAndModify = (zone: CMSZone, nodeId: string, action: (node: CMSNode, parent: CMSZone, index: number) => void): boolean => {
    const index = zone.children.findIndex(n => n.id === nodeId);
    if (index !== -1) {
      action(zone.children[index], zone, index);
      return true;
    }
    for (const node of zone.children) {
      if (node.zones) {
        for (const childZone of node.zones) {
          if (findAndModify(childZone, nodeId, action)) return true;
        }
      }
    }
    return false;
  };

  const addNodeToZone = (zoneId: string, nodeType: string, initialProps: any = {}, zonesCount?: number) => {
    const newNode: CMSNode = {
      id: Math.random().toString(36).substr(2, 9),
      type: nodeType,
      props: {}
    };

    // Initialize props from schema
    WIDGET_REGISTRY[nodeType].schema.forEach(f => newNode.props[f.name] = '');
    
    // Merge initial props
    newNode.props = { ...newNode.props, ...initialProps };

    // Apply default Card styling if it's a Card widget
    if (nodeType === 'Card') {
      newNode.props.customCss = ['border-t-2', 'border-[#FF5F1F]'];
    }

    // If Grid, add default zones
    if (nodeType === 'Grid') {
      const defaultCols = zonesCount || 1;
      newNode.zones = Array.from({ length: defaultCols }).map(() => ({
        id: Math.random().toString(36).substr(2, 9),
        parentId: newNode.id, // Store parent ID for operations
        children: []
      }));
      if (!newNode.props.columns) newNode.props.columns = zonesCount ? `md:grid-cols-${zonesCount}` : 'md:grid-cols-1';
    }

    setPageData((prevPage: any) => {
      const newRoot = JSON.parse(JSON.stringify(prevPage.root));
      const targetZone = findZoneById(newRoot, zoneId);
      if (targetZone) {
        targetZone.children.push(newNode);
        return { ...prevPage, root: newRoot };
      }
      return prevPage;
    });
  };

  const findZoneById = (zone: CMSZone, id: string): CMSZone | null => {
    if (zone.id === id) return zone;
    for (const node of zone.children) {
      if (node.zones) {
        for (const childZone of node.zones) {
          const found = findZoneById(childZone, id);
          if (found) return found;
        }
      }
    }
    return null;
  };

  const removeNode = (id: string) => {
    setPageData((prevPage: any) => {
      const newRoot = JSON.parse(JSON.stringify(prevPage.root));
      const action = (_node: CMSNode, parent: CMSZone, index: number) => {
        const nodeToDelete = parent.children[index];
        // Clean up images in storage when node is deleted
        if (nodeToDelete.props) {
          Object.keys(nodeToDelete.props).forEach(key => {
            const field = WIDGET_REGISTRY[nodeToDelete.type]?.schema.find(f => f.name === key);
            if (field?.type === 'image') {
              deleteImageFromFirebase(nodeToDelete.props[key]);
            }
          });
        }
        parent.children.splice(index, 1);
      };
      findAndModify(newRoot, id, action);
      return { ...prevPage, root: newRoot };
    });
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const updateNodeProps = (id: string, props: any) => {
    console.log(`[State] Actualizando props para nodo ${id}:`, props);
    
    setPageData((prevPage: any) => {
      const newRoot = JSON.parse(JSON.stringify(prevPage.root));
      const action = (node: CMSNode) => {
        // Image cleanup logic
        Object.keys(props).forEach(key => {
          if (node.props[key] && node.props[key] !== props[key]) {
            const field = WIDGET_REGISTRY[node.type]?.schema.find(f => f.name === key);
            if (field?.type === 'image') {
              deleteImageFromFirebase(node.props[key]);
            }
          }
        });
        node.props = { ...node.props, ...props };
      };
      
      const found = findAndModify(newRoot, id, action);
      if (!found) {
        console.warn(`[State] Nodo ${id} no encontrado en el árbol.`);
        return prevPage;
      }
      
      console.log(`[State] Nodo ${id} actualizado exitosamente.`);
      return { ...prevPage, root: newRoot };
    });
  };

  const toggleNodeHidden = (id: string) => {
    setPageData((prevPage: any) => {
      const newRoot = JSON.parse(JSON.stringify(prevPage.root));
      const action = (node: CMSNode) => {
        node.hidden = !node.hidden;
      };
      findAndModify(newRoot, id, action);
      return { ...prevPage, root: newRoot };
    });
  };

  const duplicateNode = (id: string) => {
    setPageData((prevPage: any) => {
      const newRoot = JSON.parse(JSON.stringify(prevPage.root));
      const action = (node: CMSNode, parent: CMSZone, index: number) => {
        const newNode = JSON.parse(JSON.stringify(node));
        
        const updateIds = (n: CMSNode) => {
          n.id = `node-${Math.random().toString(36).substr(2, 9)}`;
          n.zones?.forEach(z => {
            z.id = `zone-${Math.random().toString(36).substr(2, 9)}`;
            z.children.forEach(updateIds);
          });
        };
        updateIds(newNode);
        
        parent.children.splice(index + 1, 0, newNode);
      };
      findAndModify(newRoot, id, action);
      return { ...prevPage, root: newRoot };
    });
  };

  const moveNode = (id: string, direction: 'up' | 'down') => {
    setPageData((prevPage: any) => {
      const newRoot = JSON.parse(JSON.stringify(prevPage.root));
      const action = (_node: CMSNode, parent: CMSZone, index: number) => {
        if (direction === 'up' && index > 0) {
          [parent.children[index-1], parent.children[index]] = [parent.children[index], parent.children[index-1]];
        } else if (direction === 'down' && index < parent.children.length - 1) {
          [parent.children[index+1], parent.children[index]] = [parent.children[index], parent.children[index+1]];
        }
      };
      findAndModify(newRoot, id, action);
      return { ...prevPage, root: newRoot };
    });
  };

  // Find selected node in tree for editor
  const findNode = (zone: CMSZone, id: string): CMSNode | null => {
    for (const node of zone.children) {
      if (node.id === id) return node;
      if (node.zones) {
        for (const z of node.zones) {
          const found = findNode(z, id);
          if (found) return found;
        }
      }
    }
    return null;
  };
  const selectedNode = selectedNodeId ? findNode(pageData.root, selectedNodeId) : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-zinc-950 flex items-stretch overflow-hidden"
    >
      {/* Sidebar Toolset */}
      {!isPreview && (
        <aside className="w-80 border-r border-zinc-800 bg-zinc-900 flex flex-col shrink-0">
          <div className="p-8 border-b border-zinc-800">
             <div className="flex items-center gap-2 mb-8">
               <div className="w-2 h-2 bg-[#FF5F1F] rounded-full" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Nodo de Página (PZNode)</h4>
             </div>
             <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Título de la Página (SEO)</label>
                  <input 
                    type="text" 
                    value={pageData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const updates: any = { title: newTitle };
                      // Only auto-slug if this is a new page OR if the slug matches the old title's slug (sync)
                      if (pageData.id === 'new-page' && pageData.slug !== 'inicio') {
                        updates.slug = slugify(newTitle);
                      }
                      setPageData({ ...pageData, ...updates });
                    }}
                    placeholder="Ej: PlanoZero | Branding"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FF5F1F] transition-all text-white font-bold"
                  />
                </div>
                
                {pageData.slug === 'inicio' && (
                  <button 
                   onClick={() => {
                     if (confirm("¿Deseas cargar la plantilla original de PlanoZero? Esto reemplazará tu diseño actual.")) {
                       setPageData({
                         ...DEFAULT_INICIO_DATA,
                         id: pageData.id,
                         slug: 'inicio'
                       });
                     }
                   }}
                   className="w-full py-4 bg-[#FF5F1F]/10 border border-[#FF5F1F]/20 text-[#FF5F1F] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#FF5F1F]/20 transition-all hover:scale-[1.02]"
                  >
                    <Zap className="w-3.5 h-3.5" /> CARGAR PLANTILLA ORIGINAL
                  </button>
                )}
                <div>
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Slug / URL</label>
                  <input 
                    type="text" 
                    value={pageData.slug}
                    disabled={pageData.slug === 'inicio'}
                    onChange={(e) => setPageData({ ...pageData, slug: slugify(e.target.value) })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-xs focus:outline-none disabled:opacity-50"
                  />
                  {pageData.slug === 'inicio' && <p className="text-[7px] text-zinc-600 mt-1 uppercase font-bold tracking-widest">El slug de la página de inicio es fijo</p>}
                </div>
                <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                   <div className="flex items-center gap-2">
                     <Globe className="w-4 h-4 text-zinc-500" />
                     <span className="text-xs text-zinc-400 font-bold">Mostrar en Navegación</span>
                   </div>
                   <button 
                    onClick={() => setPageData({...pageData, showInNavigation: !pageData.showInNavigation})}
                    className={`w-12 h-6 rounded-full transition-all relative ${pageData.showInNavigation ? 'bg-[#FF5F1F]' : 'bg-zinc-700'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pageData.showInNavigation ? 'left-7' : 'left-1'}`} />
                   </button>
                </div>

                <div className="flex items-center justify-between">
                   <span className="text-xs text-zinc-400 font-bold">Estado de Publicación</span>
                   <button 
                    onClick={() => setPageData({...pageData, published: !pageData.published})}
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${pageData.published ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}
                   >
                     {pageData.published ? 'PÚBLICA' : 'BORRADOR'}
                   </button>
                </div>

                <div className="pt-4 border-t border-zinc-800 space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF5F1F]">Navegación</h4>
                   <button 
                    onClick={async () => {
                      try {
                        await api.menus.create({
                          name: pageData.title,
                          items: [{ id: Date.now().toString(), label: pageData.title, href: `/${pageData.slug}` }],
                        } as any);
                        alert('Página añadida al menú con éxito.');
                      } catch (e) {
                        console.error(e);
                        alert('Error al añadir al menú.');
                      }
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase transition-all hover:bg-zinc-800 hover:border-[#FF5F1F]/30"
                   >
                     <List className="w-3.5 h-3.5" /> AÑADIR A MENÚ
                   </button>
                </div>

                {onDelete && (
                  <div className="pt-4 border-t border-zinc-800">
                     <button 
                       onClick={() => onDelete(pageData.id)}
                       className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                     >
                       <Trash2 className="w-3.5 h-3.5" /> ELIMINAR PÁGINA
                     </button>
                  </div>
                )}
             </div>
          </div>

          <div className="p-8 flex-grow overflow-y-auto custom-scrollbar no-scrollbar text-white">
             <div className="flex items-center gap-2 mb-6">
               <div className="w-2 h-2 bg-[#FF5F1F] rounded-full" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Capa de Datos (PZData)</h4>
             </div>
             <div className="space-y-10 pb-8">
                {Object.entries(WIDGET_CATEGORIES).map(([catKey, catLabel]) => {
                  const widgetsInCategory = Object.entries(WIDGET_REGISTRY).filter(([_, w]) => {
                    const isLayout = w.category === WIDGET_CATEGORIES.LAYOUT;
                    return isStructureMode ? isLayout : !isLayout;
                  });
                  if (widgetsInCategory.length === 0) return null;
                  
                  return (
                    <div key={catKey} className="space-y-4">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-zinc-800 pb-2">{catLabel}</h3>
                       <div className="space-y-2">
                          {widgetsInCategory.map(([key, config]) => {
                            const Icon = config.icon;
                            return (
                              <div 
                                key={key}
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('widgetType', key);
                                  setDraggingType(key);
                                }}
                                onDragEnd={() => setDraggingType(null)}
                                className="flex items-center gap-4 p-3 bg-zinc-800/40 border border-zinc-800/50 rounded-xl hover:border-[#FF5F1F] hover:bg-zinc-800 transition-all group cursor-grab active:cursor-grabbing shadow-sm"
                              >
                                <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500 group-hover:text-[#FF5F1F] transition-colors">
                                   <Icon className="w-4 h-4" />
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-tight">{config.label}</p>
                              </div>
                            );
                          })}
                       </div>
                    </div>
                  );
                })}
                <p className="text-[8px] font-mono text-zinc-700 text-center uppercase tracking-widest bg-zinc-950/30 py-4 rounded-xl border border-dashed border-zinc-900">Arrastra componentes al canvas</p>
             </div>
          </div>

          <div className="p-8 border-t border-zinc-800 space-y-3">
             <button 
              onClick={async () => {
                setIsSavingInternal(true);
                try {
                  console.log("[Persistence] Iniciando guardado de página:", pageData.title);
                  await onSave(pageData);
                  console.log("[Persistence] Guardado completado.");
                } catch (err) {
                  console.error("[Persistence] Error al guardar:", err);
                  alert("Error crítico al guardar cambios: " + err);
                } finally {
                  setIsSavingInternal(false);
                }
              }}
              disabled={isSavingInternal || isUploading}
              className="w-full bg-[#FF5F1F] disabled:bg-zinc-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2"
             >
                {(isSavingInternal || isUploading) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isUploading ? 'SUBIENDO ACTIVOS...' : (isSavingInternal ? 'GUARDANDO...' : 'GUARDAR CAMBIOS')}
             </button>
             <button 
              onClick={onClose}
              disabled={isSavingInternal || isUploading}
              className="w-full bg-zinc-800 py-4 rounded-2xl font-bold uppercase text-xs"
             >
                CANCELAR
             </button>
          </div>
        </aside>
      )}

      {/* Editor Canvas */}
      <main className={`flex-grow bg-zinc-950 overflow-y-auto custom-scrollbar flex flex-col no-scrollbar transition-all ${isPreview ? 'p-0' : 'p-4 md:p-8 lg:p-12'}`}>
         {isPreview ? (
           <div className="bg-zinc-950 text-white min-h-screen">
             <div className="max-w-7xl mx-auto px-6 pt-12 pb-32">
               <CMSZoneRenderer zone={pageData.root} />
             </div>
             <button 
               onClick={() => setIsPreview(false)}
               className="fixed bottom-10 right-10 z-[300] bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs border border-zinc-800 shadow-2xl flex items-center gap-3 hover:bg-zinc-800 transition-all"
             >
               <Edit2 className="w-4 h-4" /> VOLVER AL EDITOR
             </button>
           </div>
         ) : (
           <div className="max-w-5xl mx-auto w-full space-y-8 pb-32">
              <header className="flex justify-between items-center mb-12 p-8 bg-zinc-900/50 rounded-[32px] border border-white/5 backdrop-blur-xl">
                 <div>
                   <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#FF5F1F]">Vortex Live Editor</h4>
                   <p className="text-lg font-black italic tracking-tighter uppercase whitespace-nowrap">Página: {pageData.name}</p>
                   <div className={`mt-1 flex items-center gap-1.5 ${pageData.published ? 'text-green-500' : 'text-amber-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${pageData.published ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500'}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none">{pageData.published ? 'Publicado' : 'Borrador'}</span>
                    </div>
                 </div>

                 <div className="flex-grow flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/5 overflow-x-auto max-w-md no-scrollbar">
                       {pagesState.map(p => (
                         <button 
                           key={p.id}
                           onClick={() => setActivePageId(p.id)}
                           className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest transition-all whitespace-nowrap ${activePageId === p.id ? 'bg-[#FF5F1F] text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                         >
                           {p.name}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                       <button 
                         onClick={() => setIsStructureMode(false)}
                         className={`px-5 py-2 rounded-xl text-[9px] font-black tracking-[0.2em] transition-all flex items-center gap-2 ${!isStructureMode ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                       >
                         DISEÑO
                       </button>
                       <button 
                         onClick={() => setIsStructureMode(true)}
                         className={`px-5 py-2 rounded-xl text-[9px] font-black tracking-[0.2em] transition-all flex items-center gap-2 ${isStructureMode ? 'bg-[#FF5F1F] text-white shadow-lg' : 'text-zinc-500'}`}
                       >
                         ESTRUCTURA
                       </button>
                    </div>

                    <button 
                      onClick={() => setIsPreview(true)}
                      className="bg-zinc-800 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all border border-white/5"
                    >
                      PREVISUALIZAR
                    </button>

                    <button 
                      onClick={() => setPageData({ published: true })}
                      className="bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF5F1F] hover:text-white transition-all shadow-xl shadow-black/20"
                    >
                      PUBLICAR (LIVE)
                    </button>
                 </div>
              </header>

              <ZoneDesigner 
                zone={pageData.root}
                onAddNode={addNodeToZone}
                onRemoveNode={removeNode}
                onDuplicateNode={duplicateNode}
                onToggleVisibility={toggleNodeHidden}
                onMoveNode={moveNode}
                onSelectNode={(id) => { setSelectedNodeId(id); setIsSidebarOpen(true); }}
                selectedNodeId={selectedNodeId}
                isStructureMode={isStructureMode}
                draggingType={draggingType}
                pageData={pageData}
                setPageData={setPageData}
                findAndModify={findAndModify}
              />
           </div>
         )}
      </main>

      {/* Right Sidebar: Grid Templates (Only in Structure Mode) */}
      {!isPreview && isStructureMode && (
        <aside className="w-[320px] bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-2xl">
          <div className="p-8 border-b border-zinc-800 bg-zinc-950/50">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#FF5F1F] animate-pulse" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Grid System</h3>
             </div>
             <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">Arrastra una estructura de columnas prediseñada para organizar tu contenido.</p>
          </div>

          <div className="p-6 flex-grow overflow-y-auto no-scrollbar">
             <div className="space-y-3">
                {GRID_TEMPLATES.map(template => {
                  const Icon = template.icon;
                  const isSidebar = template.id.includes('sidebar');
                  const isCenter = template.id === 'center';
                  
                  return (
                    <div 
                      key={template.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('widgetType', 'Grid');
                        e.dataTransfer.setData('initialProps', JSON.stringify({ columns: template.columns }));
                        e.dataTransfer.setData('zonesCount', template.zones.toString());
                        setDraggingType('Grid');
                      }}
                      onDragEnd={() => setDraggingType(null)}
                      className="group bg-zinc-800/10 border border-zinc-800/50 rounded-2xl p-4 hover:border-[#FF5F1F] hover:bg-zinc-800/40 transition-all cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500 group-hover:text-[#FF5F1F] transition-colors">
                               <Icon className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-tight text-zinc-400 group-hover:text-white transition-colors">{template.label}</p>
                         </div>
                         <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                         </div>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-6">
                         {template.id === '1col' && <div className="col-span-4 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" />}
                         {template.id === '2cols' && <><div className="col-span-2 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /><div className="col-span-2 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /></>}
                         {template.id === '3cols' && <><div className="col-span-1 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /><div className="col-span-2 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /><div className="col-span-1 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /></>}
                         {template.id === '4cols' && <><div className="col-span-1 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /><div className="col-span-1 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /><div className="col-span-1 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /><div className="col-span-1 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /></>}
                         {template.id === 'sidebar-left' && <><div className="col-span-1 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /><div className="col-span-3 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /></>}
                         {template.id === 'sidebar-right' && <><div className="col-span-3 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /><div className="col-span-1 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /></>}
                         {template.id === 'center' && <><div className="col-span-1 bg-zinc-800/50 rounded-md border border-zinc-700/30" /><div className="col-span-2 bg-[#FF5F1F]/20 rounded-md border border-[#FF5F1F]/30" /><div className="col-span-1 bg-zinc-800/50 rounded-md border border-zinc-700/30" /></>}
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="p-8 bg-zinc-950/30 border-t border-zinc-800">
             <p className="text-[8px] font-mono text-zinc-600 text-center uppercase tracking-[0.2em]">Templates Estructurales</p>
          </div>
        </aside>
      )}

      {/* Node Properties Panel */}
      <AnimatePresence>
        {isSidebarOpen && selectedNode && (
          <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsSidebarOpen(false)}
               className="fixed inset-0 z-[260] bg-zinc-950/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed top-0 right-0 bottom-0 w-[450px] z-[270] bg-zinc-900 border-l border-zinc-800 shadow-2xl p-10 flex flex-col"
             >
                <div className="flex justify-between items-center mb-6">
                   <div>
                     <h3 className="text-xl font-black uppercase tracking-tighter">Widget Designer</h3>
                     <p className="text-[8px] font-mono text-zinc-500">INSTANCE: {selectedNode.id}</p>
                   </div>
                   <div className="flex gap-2">
                       <button 
                        onClick={() => duplicateNode(selectedNode.id)}
                        className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all text-zinc-400 hover:text-white"
                        title="Duplicar Widget"
                       >
                         <Copy className="w-5 h-5" />
                       </button>
                       <button 
                        onClick={() => {
                          if (confirm('¿Estás seguro de eliminar este widget?')) {
                            removeNode(selectedNode.id);
                            setIsSidebarOpen(false);
                          }
                        }}
                        className="p-3 bg-red-900/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                        title="Eliminar Widget"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                       <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-500 hover:text-white ml-2"><X className="w-8 h-8" /></button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-4">
                   <button 
                     onClick={() => setPanelTab('content')}
                     className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${panelTab === 'content' ? 'bg-[#FF5F1F] text-white' : 'text-zinc-500 hover:text-white'}`}
                   >
                     Contenido
                   </button>
                   <button 
                     onClick={() => setPanelTab('style')}
                     className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${panelTab === 'style' ? 'bg-[#FF5F1F] text-white' : 'text-zinc-500 hover:text-white'}`}
                   >
                     Estilo / CSS
                   </button>
                   <button 
                     onClick={() => setPanelTab('personalization')}
                     className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${panelTab === 'personalization' ? 'bg-[#FF5F1F] text-white' : 'text-zinc-500 hover:text-white'}`}
                   >
                     Personalización
                   </button>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar">
                  {panelTab === 'content' ? (
                    <div className="space-y-8">
                       <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                          <div className="flex items-center justify-between mb-2">
                             <p className="text-[8px] font-mono text-[#FF5F1F] uppercase font-bold tracking-[0.2em]">Configuración</p>
                             <button 
                              onClick={() => toggleNodeHidden(selectedNode.id)}
                              className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${!selectedNode.hidden ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}
                             >
                               {!selectedNode.hidden ? 'ACTIVO' : 'INACTIVO'}
                             </button>
                          </div>
                          <h4 className="text-lg font-bold">{WIDGET_REGISTRY[selectedNode.type]?.label}</h4>
                       </div>
                       <div className="space-y-6">
                          {WIDGET_REGISTRY[selectedNode.type]?.schema?.map(field => (
                            <div key={field.id} className="space-y-2">
                              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex justify-between">
                                  {field.label}
                                  {field.required && <span className="text-[#FF5F1F] text-[7px] tracking-widest font-black opacity-50">OBLIGATORIO</span>}
                              </label>
                              {field.type === 'longtext' ? (
                                <textarea 
                                  value={selectedNode.props[field.name] || ''}
                                  onChange={(e) => updateNodeProps(selectedNode.id, { [field.name]: e.target.value })}
                                  className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-xs focus:outline-none focus:border-[#FF5F1F] transition-all resize-none shadow-inner"
                                />
                              ) : field.type === 'image' ? (
                                <div className="space-y-4">
                                  {selectedNode.props[field.name] && (
                                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 group">
                                      <img src={selectedNode.props[field.name] || undefined} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      <button 
                                        type="button"
                                        onClick={() => updateNodeProps(selectedNode.id, { [field.name]: '' })}
                                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <input 
                                      type="text"
                                      value={selectedNode.props[field.name] || ''}
                                      onChange={(e) => updateNodeProps(selectedNode.id, { [field.name]: e.target.value })}
                                      placeholder="URL de la imagen o subir..."
                                      className="flex-grow bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-[10px] font-mono focus:outline-none focus:border-[#FF5F1F] transition-all shadow-inner"
                                    />
                                    <label className="shrink-0 flex items-center justify-center p-4 bg-zinc-800 border border-zinc-700 rounded-2xl cursor-pointer hover:border-[#FF5F1F] hover:text-[#FF5F1F] transition-all">
                                      <Cloud className="w-5 h-5" />
                                      <input 
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        disabled={isUploading}
                                        onChange={async (e) => {
                                          const files = e.currentTarget.files;
                                          const file = files ? files[0] : null;
                                          if (!file) return;
                                          setIsUploading(true);
                                          console.log(`[Upload] Iniciando subida para nodo: ${selectedNode.id}, campo: ${field.name}`);
                                          try {
                                            const path = `uploads/pages/${Date.now()}-${file.name}`;
                                            const url = await handleFileUpload(file, path);
                                            console.log(`[Upload] Éxito. URL: ${url}`);
                                            
                                            // Ensure we are using the most current props
                                            updateNodeProps(selectedNode.id, { [field.name]: url });
                                          } catch (err) {
                                            console.error("[Upload] Error:", err);
                                            alert("Error al subir imagen");
                                          } finally {
                                            setIsUploading(false);
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              ) : (
                                <input 
                                  type={field.type === 'number' ? 'number' : 'text'}
                                  value={selectedNode.props[field.name] || ''}
                                  onChange={(e) => updateNodeProps(selectedNode.id, { [field.name]: e.target.value })}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-xs focus:outline-none focus:border-[#FF5F1F] transition-all shadow-inner"
                                />
                              )}
                            </div>
                          ))}
                       </div>
                    </div>
                  ) : panelTab === 'personalization' ? (
                    <div className="space-y-8">
                       <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                          <p className="text-[8px] font-mono text-[#FF5F1F] uppercase font-bold tracking-[0.2em] mb-2">Segmentación</p>
                          <h4 className="text-lg font-bold text-[#FF5F1F]">Audiencia Objetivo</h4>
                       </div>
                       
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1 block">Mostrar a:</label>
                             <select 
                               value={selectedNode.props.targetingSegment || 'all'}
                               onChange={(e) => updateNodeProps(selectedNode.id, { ...selectedNode.props, targetingSegment: e.target.value })}
                               className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-xs focus:outline-none focus:border-[#FF5F1F] transition-all appearance-none shadow-inner text-white"
                             >
                                <option value="all">Todos los Usuarios</option>
                                <option value="logged-in">Solo Usuarios Registrados</option>
                                <option value="anonymous">Solo Visitantes Anónimos</option>
                                <option value="admin">Solo Administradores</option>
                             </select>
                          </div>

                          <div className="p-6 bg-black/40 border border-zinc-800 rounded-2xl space-y-4">
                             <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-[#FF5F1F]" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Regla de Visibilidad</span>
                             </div>
                             <p className="text-[10px] text-zinc-500 uppercase leading-relaxed font-bold">
                                {selectedNode.props.targetingSegment === 'all' || !selectedNode.props.targetingSegment 
                                  ? 'Este contenido es global y será visible para todas las audiencias por igual.' 
                                  : `Este widget solo será visible para el segmento "${selectedNode.props.targetingSegment.toUpperCase()}".`}
                             </p>
                          </div>
                       </div>
                    </div>
                  ) : (
                   <div className="space-y-8">
                      <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800">
                         <p className="text-[8px] font-mono text-[#FF5F1F] uppercase font-bold tracking-[0.2em] mb-2">CSS Avanzado</p>
                         <h4 className="text-lg font-bold">Personalización de Clases</h4>
                      </div>

                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block pl-1">Tailwind / Custom Classes</label>
                            <textarea 
                              value={selectedNode.props.customCss || ''}
                              onChange={(e) => updateNodeProps(selectedNode.id, { ...selectedNode.props, customCss: e.target.value })}
                              placeholder="Ej: mt-20 opacity-50 grayscale rotate-3 shadow-2xl"
                              className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 text-xs font-mono focus:outline-none focus:border-[#FF5F1F] transition-all resize-none shadow-inner"
                            />
                            <p className="text-[9px] text-zinc-600 italic">Cualquier clase de Tailwind añadida aquí se aplicará al contenedor del widget en tiempo real.</p>
                         </div>
                         
                         <div className="bg-[#FF5F1F]/5 border border-[#FF5F1F]/20 p-6 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                               <Palette className="w-4 h-4 text-[#FF5F1F]" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Tips de Diseño</span>
                            </div>
                            <ul className="text-[9px] text-zinc-500 space-y-2 list-disc pl-4 uppercase font-bold tracking-tight">
                               <li>Usa 'mt-X' para márgenes superiores</li>
                               <li>'p-X' para padding adicional</li>
                               <li>'skew-x-X' para efectos de distorsión</li>
                               <li>'hidden md:block' para control responsivo</li>
                            </ul>
                         </div>
                      </div>
                   </div>
                  )}
                </div>

                <div className="pt-8 mt-auto border-t border-zinc-800">
                   <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full bg-[#FF5F1F] text-white py-5 rounded-3xl font-black uppercase text-xs shadow-xl shadow-[#FF5F1F]/20"
                   >
                     ACEPTAR CAMBIOS
                   </button>
                </div>
             </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const getPreviewProps = (type: string) => {
  const config = WIDGET_REGISTRY[type];
  if (!config) return {};
  const props: any = {};
  config.schema.forEach(field => {
    if (field.type === 'text' || field.type === 'longtext') {
      props[field.name] = config.label;
    } else if (field.type === 'image') {
      props[field.name] = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
    } else if (field.type === 'number') {
      props[field.name] = field.name === 'limit' ? 3 : 99;
    }
  });
  
  // Specific fallbacks for better visual preview
  if (type === 'Video') props.url = 'dQw4w9WgXcQ';
  if (type === 'Logos' || type === 'Carousel') props.urls = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200, https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200';
  if (type === 'Pricing') {
    props.price = '99';
    props.features = 'Feature 1\nFeature 2\nFeature 3';
  }
  
  return props;
};

const ZoneDesigner = ({ zone, parentId, onAddNode, onRemoveNode, onDuplicateNode, onToggleVisibility, onMoveNode, onSelectNode, selectedNodeId, isGridColumn, isStructureMode, draggingType, pageData, setPageData, findAndModify }: any) => {
  const [dragDepth, setDragDepth] = useState(0);
  const isOver = dragDepth > 0;
  
  const isValidDrop = useMemo(() => {
    if (!draggingType) return true;
    const config = WIDGET_REGISTRY[draggingType];
    if (!config) return true;
    const isLayoutWidget = config.category === WIDGET_CATEGORIES.LAYOUT;
    
    if (isLayoutWidget) {
      // Permitir anidamiento de Grids (permitir layouts en cualquier zona)
      return true;
    }
    
    // Permitir widgets en cualquier zona
    return true;
  }, [draggingType]); // Removed isGridColumn from deps as it's always true now

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragDepth(0);
    const type = e.dataTransfer.getData('widgetType');
    const propsJson = e.dataTransfer.getData('initialProps');
    const zonesCount = e.dataTransfer.getData('zonesCount');
    const initialProps = propsJson ? JSON.parse(propsJson) : {};
    
    if (type) {
      console.log('Dropping into zone:', zone.id, 'type:', type);
      onAddNode(zone.id, type, initialProps, zonesCount ? parseInt(zonesCount) : undefined);
    }
  };

  return (
    <div 
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragDepth(prev => prev + 1);
      }}
      onDragOver={(e) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        // Force state if it somehow got lost
        if (dragDepth === 0) setDragDepth(1);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragDepth(prev => Math.max(0, prev - 1));
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragDepth(0);
        
        if (!isValidDrop) return;

        handleDrop(e);
      }}
      className={`min-h-[300px] w-full flex-grow transition-all duration-300 rounded-[32px] relative flex flex-col group/zone ${
        isOver 
          ? (isValidDrop 
              ? 'bg-emerald-500/10 border-4 border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.2)] z-40' 
              : 'bg-red-500/10 border-4 border-red-500 cursor-not-allowed opacity-60 z-40') 
          : isGridColumn 
            ? 'bg-zinc-900/40 border-2 border-dashed border-white/10 hover:border-[#FF5F1F] hover:bg-[#FF5F1F]/5' 
            : 'bg-transparent'
      }`}
    >
       {/* Live Drag Preview - Overlay to avoid layout shifts */}
       {isOver && draggingType && isValidDrop && (
         <div className="absolute inset-0 pointer-events-none z-40 bg-emerald-500/5 rounded-[28px] overflow-hidden flex items-center justify-center p-8">
            <div className="w-full opacity-40 scale-[0.95] grayscale border-2 border-dashed border-emerald-500/30 rounded-2xl bg-zinc-900/80 p-4">
              <CMSRenderNode 
                node={{ 
                  id: 'preview', 
                  type: draggingType, 
                  props: getPreviewProps(draggingType), 
                  zones: draggingType === 'Grid' ? [{ id: 'z1', children: [] }] : undefined 
                }} 
                editing={true} 
              />
            </div>
         </div>
       )}

       {/* Column Delete Button (Only in Structure Mode) */}
       {isStructureMode && isGridColumn && parentId && (
         <button 
           onClick={(e) => {
             e.stopPropagation();
             const newRoot = JSON.parse(JSON.stringify(pageData.root));
             const action = (node: CMSNode) => {
               node.zones = node.zones?.filter(z => z.id !== zone.id);
             };
             findAndModify(newRoot, parentId, action);
             setPageData({ ...pageData, root: newRoot });
           }}
           className="absolute -top-4 -right-4 z-50 p-3 bg-red-600 text-white rounded-full hover:bg-red-500 shadow-xl transition-all hover:scale-110"
           title="Eliminar Columna"
         >
           <Trash2 className="w-3.5 h-3.5" />
         </button>
       )}

       {/* Placeholder when empty and not dragging */}
               {(zone?.children || []).length === 0 && !isOver && (
         <div className="flex-grow flex items-center justify-center p-12 group cursor-pointer">
           <div className="text-center opacity-20 group-hover:opacity-40 transition-opacity">
             <Plus className="w-8 h-8 mx-auto mb-3" />
             <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-[140px] mx-auto">
               {!isGridColumn 
                  ? 'Arrastra un Layout aquí' 
                  : (isStructureMode ? 'Nidifica Layout' : 'Suelte un Widget aquí')}
             </p>
           </div>
         </div>
       )}

       <div className="space-y-8 pb-12">
                     {zone?.children?.length > 0 && (
                       <div className="flex justify-center opacity-0 group-hover/zone:opacity-100 transition-opacity pt-4 -mb-4">
                         <button 
                           onClick={() => onAddNode(zone.id, 'RichText')}
                           className="px-4 py-1.5 bg-[#FF5F1F]/10 hover:bg-[#FF5F1F] text-[#FF5F1F] hover:text-white rounded-full text-[8px] font-black uppercase tracking-widest border border-[#FF5F1F]/20 transition-all shadow-lg"
                         >
                           + Añadir Widget Inicio
                         </button>
                       </div>
                     )}
                     {(zone?.children || []).map((node: CMSNode) => (
            <div key={node.id} className="relative group/node">
               <div 
                onClick={(e) => { e.stopPropagation(); onSelectNode(node.id); }}
                className={`relative transition-all cursor-pointer overflow-hidden rounded-[40px] border border-white/5 ${
                  node.type === 'Grid' ? 'bg-[#FF5F1F]/5 shadow-inner border-[#FF5F1F]/20' : 'bg-zinc-900/40'
                } ${selectedNodeId === node.id ? 'ring-4 ring-[#FF5F1F] shadow-2xl shadow-[#FF5F1F]/20' : 'hover:ring-2 hover:ring-white/10 dark:bg-zinc-900/60'} ${node.hidden ? 'opacity-40 grayscale-[0.5] border-dashed border-zinc-700' : ''}`}
               >
                  {node.hidden && (
                    <div className="absolute top-8 right-32 z-20 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-[8px] font-black uppercase tracking-widest text-zinc-400 pointer-events-none">
                      INACTIVO (BORRADOR)
                    </div>
                  )}
                  {node.type === 'Grid' ? (
                     <div className={`grid gap-4 md:gap-8 w-full ${node.props.columns || 'grid-cols-1'} p-4 md:p-8 text-center ${isStructureMode ? 'bg-[#FF5F1F]/5 outline outline-2 outline-[#FF5F1F]/40' : ''}`}>
                       {node.zones?.map((z: any, idx: number) => (
                         <div key={z.id} className={`flex flex-col h-full relative bg-zinc-950/40 rounded-[32px] border border-white/5 min-h-[400px] ${idx < (node.zones?.length || 0) - 1 ? 'border-r border-zinc-900/20' : ''}`}>
                            <div className="absolute top-6 left-8 z-30 px-3 py-1 bg-[#FF5F1F] rounded-lg text-[8px] font-black uppercase tracking-widest text-white shadow-lg pointer-events-none">
                               Columna {idx + 1}
                            </div>
                            <ZoneDesigner 
                               zone={z}
                               parentId={node.id}
                               onAddNode={onAddNode}
                               onRemoveNode={onRemoveNode}
                               onDuplicateNode={onDuplicateNode}
                               onToggleVisibility={onToggleVisibility}
                               onMoveNode={onMoveNode}
                               onSelectNode={onSelectNode}
                               selectedNodeId={selectedNodeId}
                               isGridColumn={true}
                               isStructureMode={isStructureMode}
                               draggingType={draggingType}
                               pageData={pageData}
                               setPageData={setPageData}
                               findAndModify={findAndModify}
                            />
                         </div>
                       ))}
                     </div>
                  ) : (
                     <div className="pointer-events-none select-none p-8">
                        <CMSRenderNode node={node} editing={true} />
                     </div>
                  )}

                  {/* Edit Overlay */}
                  <div className={`absolute inset-0 z-10 transition-all pointer-events-none ${selectedNodeId === node.id ? 'bg-[#FF5F1F]/5' : 'bg-transparent group-hover/node:bg-white/5'}`} />

                  {/* Identity Badge */}
                  <div className="absolute top-8 left-8 z-20 flex items-center gap-2 opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
                       <div className="text-[#FF5F1F]">
                          {WIDGET_REGISTRY[node.type] && React.createElement(WIDGET_REGISTRY[node.type].icon, { className: 'w-3 h-3' })}
                       </div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-white">{WIDGET_REGISTRY[node.type]?.label}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="absolute top-8 right-8 flex gap-1 opacity-0 group-hover/node:opacity-100 transition-opacity z-30">
                     <button 
                      onClick={(e) => { e.stopPropagation(); onDuplicateNode(node.id); }} 
                      className="p-3 bg-black/80 backdrop-blur-md rounded-xl text-zinc-400 hover:text-[#FF5F1F] border border-white/5 shadow-xl transition-all hover:scale-110 active:scale-95"
                      title="Duplicar elemento"
                     >
                       <Copy className="w-4 h-4" />
                     </button>
                     <button 
                      onClick={(e) => { e.stopPropagation(); onToggleVisibility(node.id); }} 
                      className={`p-3 backdrop-blur-md rounded-xl border border-white/5 shadow-xl transition-all hover:scale-110 active:scale-95 ${node.hidden ? 'bg-[#FF5F1F] text-white' : 'bg-black/80 text-zinc-400 hover:text-white'}`}
                      title={node.hidden ? 'Mostrar' : 'Ocultar (Inactivo)'}
                     >
                       {node.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                     </button>
                     <button 
                      onClick={(e) => { e.stopPropagation(); onMoveNode(node.id, 'up'); }} 
                      className="p-3 bg-black/80 backdrop-blur-md rounded-xl text-zinc-400 hover:text-white border border-white/5 shadow-xl transition-all hover:scale-110 active:scale-95"
                      title="Mover arriba"
                     >
                       <ChevronRight className="w-4 h-4 -rotate-90" />
                     </button>
                     <button 
                      onClick={(e) => { e.stopPropagation(); onMoveNode(node.id, 'down'); }} 
                      className="p-3 bg-black/80 backdrop-blur-md rounded-xl text-zinc-400 hover:text-white border border-white/5 shadow-xl transition-all hover:scale-110 active:scale-95"
                      title="Mover abajo"
                     >
                       <ChevronRight className="w-4 h-4 rotate-90" />
                     </button>
                     <button 
                      onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation(); 
                        onRemoveNode(node.id); 
                      }} 
                      className="p-4 bg-red-600 rounded-2xl text-white shadow-2xl hover:bg-red-500 transition-all hover:scale-110 active:scale-95 pointer-events-auto"
                      title="Eliminar elemento"
                     >
                       <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            </div>
          ))}
       </div>

       {/* Persistent Add Button at bottom for large zones (only if not a grid column or if grid column is empty) */}
       {!isGridColumn && zone.children.length > 0 && (
         <div className="mt-8 px-8 opacity-20 hover:opacity-100 transition-opacity">
           <button 
             onClick={() => onAddNode(zone.id, 'Card')} // Default to Card or some common type
             className="w-full py-12 text-center border-2 border-dashed border-zinc-800/40 rounded-[32px] hover:border-[#FF5F1F]/50 hover:bg-[#FF5F1F]/5 transition-all text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#FF5F1F]"
           >
             + Añadir Widget al Final
           </button>
         </div>
       )}
    </div>
  );
};

const ContentTypeForm = ({ onClose, onSave, initialData }: { onClose: () => void, onSave: (data: any) => void, initialData: any }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    fields: initialData?.fields || []
  });

  const addField = () => {
    const newField: ContentField = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      label: '',
      type: 'text',
      required: false
    };
    setFormData({ ...formData, fields: [...formData.fields, newField] });
  };

  const removeField = (id: string) => {
    setFormData({ ...formData, fields: formData.fields.filter((f: any) => f.id !== id) });
  };

  const updateField = (id: string, updates: any) => {
    setFormData({
      ...formData,
      fields: formData.fields.map((f: any) => f.id === id ? { ...f, ...updates } : f)
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl p-8 rounded-[48px] shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-zinc-500 hover:text-white"
        >
          <X className="w-8 h-8" />
        </button>

        <h2 className="text-3xl font-black mb-8 uppercase">Configuración de Tipo Dinámico</h2>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Nombre del Tipo</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ej. Inmuebles, Eventos..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF5F1F] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Descripción</label>
              <input 
                type="text" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF5F1F] transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Campos del Esquema</h4>
                <button 
                  onClick={addField}
                  className="text-[10px] font-mono text-[#FF5F1F] uppercase font-bold hover:underline"
                >
                  + AÑADIR CAMPO
                </button>
             </div>

             <div className="space-y-4">
                {(formData.fields || []).map((field: any) => (
                  <div key={field.id} className="bg-zinc-800/50 border border-zinc-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                     <div className="space-y-1">
                        <label className="text-[8px] font-mono text-zinc-600 uppercase">Nombre ID</label>
                        <input 
                          type="text"
                          value={field.name}
                          onChange={(e) => updateField(field.id, { name: slugify(e.target.value) })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[8px] font-mono text-zinc-600 uppercase">Etiqueta (UI)</label>
                        <input 
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[8px] font-mono text-zinc-600 uppercase">Tipo</label>
                        <select 
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs focus:outline-none"
                        >
                          <option value="text">Texto</option>
                          <option value="longtext">Texto Largo</option>
                          <option value="number">Número</option>
                          <option value="image">Imagen</option>
                          <option value="date">Fecha</option>
                          <option value="boolean">Boolean</option>
                        </select>
                     </div>
                     <div className="flex items-center gap-2">
                        <button 
                          onClick={() => removeField(field.id)}
                          className="p-2 text-red-500/50 hover:text-red-500"
                        >
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                ))}

                {formData.fields.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl text-zinc-600 text-xs">
                    No has definido campos aún.
                  </div>
                )}
             </div>
          </div>

          <div className="pt-8 space-x-4">
             <button 
              onClick={() => onSave(formData)}
              className="bg-[#FF5F1F] text-white px-10 py-5 rounded-2xl font-black uppercase text-sm"
             >
                GUARDAR ESQUEMA
             </button>
             <button 
              onClick={onClose}
              className="px-10 py-5 rounded-2xl bg-zinc-800 font-bold uppercase text-sm"
             >
                CANCELAR
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
