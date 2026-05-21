import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import CharacterCount from '@tiptap/extension-character-count';
import MediaLibrary from './MediaLibrary';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon, 
  Heading1, 
  Heading2, 
  Quote, 
  Undo, 
  Redo,
  Image as ImageIcon,
  Compass,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({ 
  onClick, 
  isActive = false, 
  children, 
  disabled = false 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-lg transition-all ${
      isActive 
        ? 'bg-[#FF5F1F] text-white shadow-lg shadow-[#FF5F1F]/20' 
        : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
    } disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ value, onChange, placeholder }) => {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = React.useState(false);
  const [showOutline, setShowOutline] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        underline: {},
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-[#FF5F1F] underline cursor-pointer',
          },
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-2xl border border-zinc-800 shadow-lg my-8 mx-auto block max-w-full transition-all hover:shadow-xl hover:shadow-[#FF5F1F]/5',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Comienza a escribir...',
      }),
      CharacterCount,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg prose-invert max-w-none focus:outline-none min-h-[400px] p-8 bg-zinc-950 border border-zinc-900 rounded-3xl font-sans leading-relaxed text-zinc-300',
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const headings = React.useMemo(() => {
    if (!editor) return [];
    
    const items: { text: string; level: number; id: string; index: number }[] = [];
    let headingCount = 0;

    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        items.push({
          text: node.textContent,
          level: node.attrs.level,
          id: `heading-${headingCount}`,
          index: headingCount
        });
        headingCount++;
      }
    });
    
    return items;
  }, [editor?.state.doc]);

  const scrollToHeading = (index: number) => {
    if (!editor) return;
    
    const editorElement = document.querySelector('.tiptap');
    if (!editorElement) return;

    const headingElements = editorElement.querySelectorAll('h1, h2');
    const target = headingElements[index];

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief highlight effect
      target.classList.add('highlight-flash');
      setTimeout(() => target.classList.remove('highlight-flash'), 2000);
    }
  };

  if (!editor) return null;

  return (
    <div className="space-y-4 relative">
      {/* Blueprint Style Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-2 rounded-2xl sticky top-0 z-20 shadow-xl">
        <div className="flex items-center gap-1 pr-2 border-r border-zinc-800 mr-2">
          <ToolbarButton 
            onClick={() => setShowOutline(!showOutline)} 
            isActive={showOutline}
          >
            <Compass className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-zinc-800 mr-2">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            isActive={editor.isActive('bold')}
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            isActive={editor.isActive('italic')}
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()} 
            isActive={editor.isActive('underline')}
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-zinc-800 mr-2">
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            isActive={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            isActive={editor.isActive('bulletList')}
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            isActive={editor.isActive('orderedList')}
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-zinc-800 mr-2">
          <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('left').run()} 
            isActive={editor.isActive({ textAlign: 'left' })}
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('center').run()} 
            isActive={editor.isActive({ textAlign: 'center' })}
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('right').run()} 
            isActive={editor.isActive({ textAlign: 'right' })}
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 pr-2 border-r border-zinc-800 mr-2">
          <ToolbarButton 
            onClick={setLink} 
            isActive={editor.isActive('link')}
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => setIsMediaLibraryOpen(true)} 
            isActive={false}
          >
            <ImageIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBlockquote().run()} 
            isActive={editor.isActive('blockquote')}
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <ToolbarButton 
            onClick={() => editor.chain().focus().undo().run()} 
            disabled={!editor.can().undo()}
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton 
            onClick={() => editor.chain().focus().redo().run()} 
            disabled={!editor.can().redo()}
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      <MediaLibrary 
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelect={(url) => {
          editor.chain().focus().setImage({ src: url }).run();
          setIsMediaLibraryOpen(false);
        }}
      />

      {/* Inline-Looking Editor Area */}
      <div className="flex gap-4 relative items-start">
        <AnimatePresence>
          {showOutline && headings.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 240 }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              className="sticky top-20 shrink-0 hidden xl:block"
            >
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-[#FF5F1F] uppercase tracking-[0.2em] mb-4 italic flex items-center gap-2">
                    <Compass className="w-3 h-3" />
                    Mapa de Estructura
                  </h4>
                  <div className="space-y-1">
                    {headings.map((heading, i) => (
                      <button
                        key={i}
                        onClick={() => scrollToHeading(heading.index)}
                        className={`w-full text-left group flex items-center gap-2 py-2 px-3 rounded-xl transition-all hover:bg-white/5 ${
                          heading.level === 1 ? 'pl-3' : 'pl-6'
                        }`}
                      >
                        <div className={`shrink-0 w-1 h-1 rounded-full bg-[#FF5F1F] scale-0 group-hover:scale-100 transition-transform`} />
                        <span className={`text-[11px] font-bold truncate transition-colors ${
                          heading.level === 1 ? 'text-zinc-300' : 'text-zinc-500'
                        } group-hover:text-white`}>
                          {heading.text || 'Sin título'}
                        </span>
                        <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <div className="flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                    <span>SECCIONES</span>
                    <span>{headings.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative group flex-1">
          <EditorContent editor={editor} />
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-zinc-800 pointer-events-none group-focus-within:border-[#FF5F1F]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-zinc-800 pointer-events-none group-focus-within:border-[#FF5F1F]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-zinc-800 pointer-events-none group-focus-within:border-[#FF5F1F]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-zinc-800 pointer-events-none group-focus-within:border-[#FF5F1F]" />
        </div>
      </div>

      {/* Editor footer info */}
      <div className="flex justify-between items-center px-6 py-3 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
            <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-widest leading-none">Status: Live Engine V1.0</span>
          </div>
          <div className="h-3 w-px bg-zinc-800" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Auto-Sync Active</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-white italic">{editor.storage.characterCount?.words?.() || 0}</span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Palabras</span>
          </div>
          <div className="h-3 w-px bg-zinc-800" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-[#FF5F1F] italic">{editor.storage.characterCount?.characters?.() || 0}</span>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Caracteres</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #52525b;
          pointer-events: none;
          height: 0;
        }
        .tiptap h1 { font-size: 2.25rem; line-height: 1.1; margin-top: 1.5rem; margin-bottom: 1rem; color: white; font-weight: 900; font-style: italic; text-transform: uppercase; letter-spacing: -0.05em; }
        .tiptap h2 { font-size: 1.5rem; line-height: 1.2; margin-top: 1.5rem; margin-bottom: 0.75rem; color: white; font-weight: 800; font-style: italic; text-transform: uppercase; letter-spacing: -0.02em; }
        .tiptap blockquote { border-left: 4px solid #FF5F1F; padding-left: 1rem; font-style: italic; color: #a1a1aa; margin: 1.5rem 0; }
        .tiptap ul { list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0; }
        .tiptap ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1rem 0; }
        .tiptap a { color: #FF5F1F; text-decoration: underline; }
        
        @keyframes highlight-flash {
          0% { background-color: rgba(255, 95, 31, 0.2); border-radius: 8px; }
          100% { background-color: transparent; }
        }
        .highlight-flash {
          animation: highlight-flash 2s ease-out;
        }
      `}} />
    </div>
  );
};

export default WysiwygEditor;
