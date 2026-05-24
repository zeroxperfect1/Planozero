import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import api from '../services/api';
import BlueprintLoader from '../components/BlueprintLoader';

const BlogMeasurement = ({ label, className = "" }: { label: string; className?: string }) => (
  <div className={`flex flex-col items-center gap-1 ${className}`}>
    <div className="flex items-center w-full gap-0">
      <div className="w-[1px] h-3 bg-current opacity-30" />
      <div className="flex-1 h-[1px] bg-current opacity-30" />
      <div className="w-[1px] h-3 bg-current opacity-30" />
    </div>
    <span className="text-[8px] font-mono opacity-40 uppercase tracking-tighter">{label}</span>
  </div>
);

interface Post {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  date: any;
  author?: string;
  authorId?: string;
  author_id?: string;
  author_email?: string;
  authorImage?: string;
  category: string;
  image: string;
  created_at?: string;
  createdAt?: any;
}

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['TODAS', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filteredPosts = selectedCategory === 'TODAS'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset to page 1 when category changes
  useEffect(() => { setCurrentPage(1); }, [selectedCategory]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await api.posts.getPublished() as unknown as Post[];

        // Sort by created_at descending
        setPosts(postsData.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : (a.createdAt?.seconds || 0) * 1000;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : (b.createdAt?.seconds || 0) * 1000;
          return dateB - dateA;
        }));
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-[#FF5F1F] selection:text-white pt-20">
      <Helmet>
        <html lang="es-CL" />
        <title>Blog de Branding y Marketing Digital | PLANOZERO Journal</title>
        <meta name="description" content="Artículos sobre branding, diseño UX, marketing digital y publicidad digital. Perspectivas del equipo de PLANOZERO, agencia de branding en Santiago, Chile." />
        <link rel="canonical" href="https://www.planozero.cl/blog" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:url" content="https://www.planozero.cl/blog" />
        <meta property="og:title" content="Blog de Branding y Marketing Digital | PLANOZERO" />
        <meta property="og:description" content="Artículos sobre branding, diseño UX, marketing digital y publicidad digital. Perspectivas del equipo de PLANOZERO, agencia en Santiago, Chile." />
        <meta property="og:image" content="https://www.planozero.cl/og-blog.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="PLANOZERO" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.planozero.cl/blog" />
        <meta name="twitter:title" content="Blog de Branding y Marketing Digital | PLANOZERO" />
        <meta name="twitter:description" content="Artículos sobre branding, diseño UX, marketing digital y publicidad digital. Agencia PLANOZERO, Santiago, Chile." />
        <meta name="twitter:image" content="https://www.planozero.cl/og-blog.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Blog",
                "@id": "https://www.planozero.cl/blog#blog",
                "name": "PLANOZERO Journal",
                "url": "https://www.planozero.cl/blog",
                "description": "Artículos sobre branding, diseño UX, marketing digital y publicidad digital desde Santiago, Chile.",
                "inLanguage": "es-CL",
                "publisher": {
                  "@id": "https://www.planozero.cl/#organization"
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.planozero.cl/" },
                  { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.planozero.cl/blog" }
                ]
              }
            ]
          })}
        </script>
      </Helmet>
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex-grow">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-12 md:mb-16">
          <Logo />
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-mono text-zinc-500 hover:text-[#FF5F1F] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            VOLVER_AL_INICIO
          </Link>
        </div>
        
        <div className="mb-16">
            <div className="max-w-2xl">
              <span className="text-xs font-mono tracking-widest text-[#FF5F1F] uppercase mb-4 block underline underline-offset-8">Journal y Recursos</span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Pensamiento <br />
                <span className="text-[#FF5F1F]">Estratégico</span>
              </h1>
            </div>
            <div className="hidden lg:block">
              <BlogMeasurement label="Header_Sync_01" className="w-48 text-zinc-400" />
            </div>
          </div>

        {/* Categories Filter */}
        {!loading && posts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-mono transition-all uppercase tracking-widest ${
                  selectedCategory === cat
                    ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {cat === 'TODAS' ? 'NOTAS_RECIENTES' : cat}
              </button>
            ))}
            {/* Post count */}
            <span className="ml-auto self-center text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              {filteredPosts.length} notas · pág {currentPage}/{totalPages || 1}
            </span>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-16">
            <BlueprintLoader fullScreen={false} label="CARGANDO NOTAS..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[48px] border border-dashed border-zinc-200 dark:border-zinc-800">
             <p className="text-zinc-500 font-mono text-sm uppercase">Sin publicaciones por el momento.</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCategory}-${currentPage}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {paginatedPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[32px] hover:shadow-2xl hover:shadow-[#FF5F1F]/5 transition-all duration-500"
                >
                  <Link to={`/blog/${post.slug || post.id}`} className="block">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-zinc-100 dark:bg-zinc-900">
                      <img
                        src={post.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop'}
                        alt={post.title}
                        width={800}
                        height={500}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop'; }}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#FF5F1F] uppercase border border-zinc-200 dark:border-zinc-700">
                        {post.category}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400 mb-4 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 5 MIN DE LECTURA</span>
                      <span>/</span>
                      <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('es-CL') : (post.date?.toDate?.()?.toLocaleDateString('es-CL') || post.date)}</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 group-hover:text-[#FF5F1F] transition-colors leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">
                      {post.excerpt?.replace(/<[^>]*>?/gm, '')}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                    <div className="flex items-center gap-3">
                      {post.authorImage ? (
                        <img
                          src={post.authorImage}
                          alt={post.author || 'Autor PLANOZERO'}
                          width={32}
                          height={32}
                          loading="lazy"
                          decoding="async"
                          className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                          <span className="text-[10px] font-mono text-[#FF5F1F] font-bold">
                            {(post.author || post.author_email || 'PZ').split(/[ @]/)[0].slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-[10px] font-mono text-zinc-500 font-medium tracking-tight truncate max-w-[120px]">{post.author || (post.author_email?.split('@')[0]) || 'PlanoZero'}</span>
                    </div>
                    <Link to={`/blog/${post.slug || post.id}`} className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-[#FF5F1F] hover:border-[#FF5F1F] hover:text-white transition-all transform group-hover:rotate-45 shrink-0 ml-2">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── Paginación ─────────────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mt-16"
            >
              {/* Prev */}
              <button
                onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-[#FF5F1F] hover:text-[#FF5F1F] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                const isActive = page === currentPage;
                // Show first, last, current ±1, and ellipsis
                const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                const showEllipsisAfter  = page === currentPage + 2 && currentPage < totalPages - 2;

                if (showEllipsisBefore || showEllipsisAfter) {
                  return <span key={`ell-${page}`} className="text-zinc-300 dark:text-zinc-600 font-mono text-sm px-1">···</span>;
                }
                if (!showPage) return null;

                return (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-10 h-10 rounded-full text-[11px] font-mono font-bold transition-all ${
                      isActive
                        ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/25 scale-110'
                        : 'border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-[#FF5F1F] hover:text-[#FF5F1F]'
                    }`}
                    aria-label={`Página ${page}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-[#FF5F1F] hover:text-[#FF5F1F] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
          </>
        )}

      </main>
      <div className="h-24"></div>
      <Footer />
    </div>
  );
};

export default Blog;
