import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import api from '../services/api';

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

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');

  const categories = ['TODAS', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filteredPosts = selectedCategory === 'TODAS' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

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
        <title>Journal | PLANOZERO Agency</title>
        <meta name="description" content="Perspectivas sobre estrategia, branding y artesanía digital de alta gama. Explora nuestros últimos artículos sobre la creación de marcas preparadas para el futuro." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content="Journal | PLANOZERO Agency" />
        <meta property="og:description" content="Perspectivas sobre estrategia, branding y artesanía digital de alta gama." />
        <meta property="og:image" content={`${window.location.origin}/og-blog.png`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={window.location.href} />
        <meta name="twitter:title" content="Journal | PLANOZERO Agency" />
        <meta name="twitter:description" content="Perspectivas sobre estrategia, branding y artesanía digital de alta gama." />
        <meta name="twitter:image" content={`${window.location.origin}/og-blog.png`} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "PLANOZERO Journal",
            "url": window.location.href,
            "description": "Perspectivas sobre la creación de marcas preparadas para el futuro.",
            "publisher": {
              "@type": "Organization",
              "name": "PLANOZERO",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.svg`
              }
            }
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
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#FF5F1F]"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[48px] border border-dashed border-zinc-200 dark:border-zinc-800">
             <p className="text-zinc-500 font-mono text-sm uppercase">Sin publicaciones por el momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[32px] hover:shadow-2xl hover:shadow-[#FF5F1F]/5 transition-all duration-500"
              >
                <Link to={`/blog/${post.slug || post.id}`} className="block">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-zinc-100 dark:bg-zinc-900">
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop'}
                      alt={post.title}
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
                        alt={post.author || 'Autor'}
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
          </div>
        )}

      </main>
      <div className="h-24"></div>
      <Footer />
    </div>
  );
};

export default Blog;
