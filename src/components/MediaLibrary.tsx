import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Search, 
  X, 
  Loader2, 
  Plus, 
  Link as LinkIcon, 
  Trash2, 
  Check,
  FileUp,
  Globe,
  RotateCw,
  Sun,
  Contrast,
  Zap,
  Undo2,
  Sparkles
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { handleFileUpload as uploadFileToStorage, deleteImageFromFirebase } from '../services/storageService';
import api from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../lib/imageUtils';
import { PlanoZeroUploader } from './PlanoZeroUploader';

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size?: number;
  type?: string;
  created_at?: string;
  createdAt?: any;
  user_id?: string;
  userId?: string;
}

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (url: string) => void;
  title?: string;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  title = "Biblioteca de Medios" 
}) => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'url'>('gallery');
  const [imageUrl, setImageUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    sepia: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'gallery') {
      fetchAssets();
    }
  }, [isOpen, activeTab]);

  const fetchAssets = async () => {
    if (!auth.currentUser) {
      console.log("No user logged in, skipping fetchAssets");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const fetchedAssets = await api.media.getAll() as MediaAsset[];
      // Sort by created_at descending
      const sortedAssets = [...fetchedAssets].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() :
                      a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() :
                      b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setAssets(sortedAssets);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopySuccess(url);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleSelect = (url: string) => {
    setEditingUrl(url);
    setFilters({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0 });
    setRotation(0);
    setZoom(1);
  };

  const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const performUpload = async (file: File | Blob, originalName: string) => {
    if (!auth.currentUser) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Use the new Firebase Storage service
      const path = `uploads/media/${auth.currentUser.uid}/${Date.now()}-${originalName}`;
      
      // Since it's a resumable upload, we'd ideally pass a callback for progress, 
      // but let's keep it simple for now or update uploadFileToStorage to support progress.
      // For now I'll just use the uploadFileToStorage we already have.
      
      const downloadURL = await uploadFileToStorage(file as File, path);
      
      setUploadProgress(100);
      
      const assetData = {
        name: originalName,
        url: downloadURL,
        size: file.size,
        type: file.type || 'image/jpeg',
        userId: auth.currentUser!.uid,
        createdAt: new Date().toISOString(),
        isLocal: false, // Now on Firebase
        storagePath: path
      };

      // No need to addDoc to Firestore — upload.php auto-registers in MySQL

      setTimeout(() => {
        setUploading(false);
        setActiveTab('gallery');
        fetchAssets();
      }, 500);

      return downloadURL;

    } catch (error: any) {
      console.error("Upload error:", error);
      setUploading(false);
      alert(error.message || "Error al subir la imagen");
      return null;
    }
  };

  const handleApplyEdits = async () => {
    if (!editingUrl) return;
    
    // If no crop was performed but user clicked Apply, we can use default crop if available
    // Otherwise, we might want to just treat it as a copy or apply filters only
    const areaToUse = croppedAreaPixels || { x: 0, y: 0, width: 100, height: 100 }; // Fallback

    setIsProcessing(true);
    try {
      const blob = await getCroppedImg(
        editingUrl,
        areaToUse,
        rotation,
        { horizontal: false, vertical: false },
        filters
      );
      
      if (blob) {
        // Extract filename from URL or use default
        let originalName = 'image.jpg';
        try {
          const urlObj = new URL(editingUrl.startsWith('http') ? editingUrl : window.location.origin + editingUrl);
          originalName = urlObj.pathname.split('/').pop() || 'image.jpg';
        } catch (e) {
          originalName = editingUrl.split('/').pop() || 'image.jpg';
        }

        // Add a versioning-like suffix to the filename
        const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const extension = originalName.includes('.') ? originalName.substring(originalName.lastIndexOf('.')) : '.jpg';
        const timestamp = new Date().getTime().toString().slice(-4);
        const nameForUpload = `${baseName}-v${timestamp}${extension}`;

        const finalUrl = await performUpload(blob, nameForUpload);

        if (finalUrl) {
          if (onSelect) {
            onSelect(finalUrl);
          } else {
            handleCopyLink(finalUrl);
          }
          setEditingUrl(null);
        }
      }
    } catch (e) {
      console.error("Error processing image:", e);
      alert("Error al procesar la imagen. Comprueba la consola para más detalles.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseOriginal = () => {
    if (!editingUrl) return;
    if (onSelect) {
      onSelect(editingUrl);
    } else {
      handleCopyLink(editingUrl);
    }
    setEditingUrl(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    const file = files ? files[0] : null;
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Por favor sube solo imágenes.");
      return;
    }

    setPendingUploadFile(file);
  };

  const handleSimulationComplete = async (previewUrl: string) => {
    if (!pendingUploadFile) return;
    
    // We already have the file, now we perform the actual binary upload to the server
    await performUpload(pendingUploadFile, pendingUploadFile.name);
    setPendingUploadFile(null);
  };

  const handleDelete = async (e: React.MouseEvent, asset: MediaAsset) => {
    e.stopPropagation();
    if (!window.confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      // Delete from Storage first
      await deleteImageFromFirebase(asset.url);
      
      // Delete from API (MySQL)
      await api.media.delete(asset.id);
      
      setAssets(assets.filter(a => a.id !== asset.id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 lg:p-20">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-[48px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-900 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF5F1F]/10 rounded-xl">
              {editingUrl ? (
                <RotateCw className="w-5 h-5 text-[#FF5F1F]" />
              ) : (
                <ImageIcon className="w-5 h-5 text-[#FF5F1F]" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tight">
                {editingUrl ? "Editar Imagen" : title}
              </h2>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-nowrap">
                {editingUrl ? "Ajustes de recorte y filtros" : "Gestión de activos visuales"}
              </p>
            </div>
          </div>
          <button 
            onClick={editingUrl ? () => setEditingUrl(null) : onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-white"
          >
            {editingUrl ? <Undo2 className="w-5 h-5" /> : <X className="w-6 h-6" />}
          </button>
        </div>

        {/* Editor or Tabs */}
        {!editingUrl && (
          <div className="flex border-b border-zinc-900 px-6">
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-4 text-[10px] font-mono uppercase tracking-widest border-b-2 transition-all ${
                activeTab === 'gallery' ? 'border-[#FF5F1F] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Galería
            </button>
            <button 
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-4 text-[10px] font-mono uppercase tracking-widest border-b-2 transition-all ${
                activeTab === 'upload' ? 'border-[#FF5F1F] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Subir Archivo
            </button>
            <button 
              onClick={() => setActiveTab('url')}
              className={`px-6 py-4 text-[10px] font-mono uppercase tracking-widest border-b-2 transition-all ${
                activeTab === 'url' ? 'border-[#FF5F1F] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Desde URL
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-grow overflow-hidden flex flex-col md:flex-row relative">
          {editingUrl ? (
            <div className="flex-grow flex flex-col md:flex-row h-full w-full overflow-hidden">
               {/* Cropper Area */}
               <div className="flex-grow relative min-h-[300px] md:min-h-0 bg-stone-950">
                  <Cropper
                    image={editingUrl}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={undefined}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    style={{
                      containerStyle: {
                        filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%)`
                      }
                    }}
                  />
               </div>

               {/* Controls Area */}
               <div className="w-full md:w-80 bg-zinc-900 overflow-y-auto p-6 md:p-8 space-y-8 border-t md:border-t-0 md:border-l border-zinc-800">
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#FF5F1F]">Ajustes de Imagen</h3>
                    
                    {/* Zoom & Rotation */}
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase">
                             <span>Zoom</span>
                             <span>{zoom.toFixed(1)}x</span>
                          </div>
                          <input 
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5F1F]"
                          />
                       </div>

                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase">
                             <span className="flex items-center gap-1.5"><RotateCw className="w-3 h-3" /> Rotación</span>
                             <span>{rotation}°</span>
                          </div>
                          <input 
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={rotation}
                            onChange={(e) => setRotation(Number(e.target.value))}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5F1F]"
                          />
                       </div>
                    </div>

                    <div className="h-px bg-zinc-800" />

                    {/* Filters */}
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase">
                             <span className="flex items-center gap-1.5"><Sun className="w-3 h-3" /> Brillo</span>
                             <span>{filters.brightness}%</span>
                          </div>
                          <input 
                            type="range"
                            min={0}
                            max={200}
                            value={filters.brightness}
                            onChange={(e) => setFilters({...filters, brightness: Number(e.target.value)})}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5F1F]"
                          />
                       </div>

                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase">
                             <span className="flex items-center gap-1.5"><Contrast className="w-3 h-3" /> Contraste</span>
                             <span>{filters.contrast}%</span>
                          </div>
                          <input 
                            type="range"
                            min={0}
                            max={200}
                            value={filters.contrast}
                            onChange={(e) => setFilters({...filters, contrast: Number(e.target.value)})}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5F1F]"
                          />
                       </div>

                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase">
                             <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Grayscale</span>
                             <span>{filters.grayscale}%</span>
                          </div>
                          <input 
                            type="range"
                            min={0}
                            max={100}
                            value={filters.grayscale}
                            onChange={(e) => setFilters({...filters, grayscale: Number(e.target.value)})}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5F1F]"
                          />
                       </div>

                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase">
                             <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Sepia</span>
                             <span>{filters.sepia}%</span>
                          </div>
                          <input 
                            type="range"
                            min={0}
                            max={100}
                            value={filters.sepia}
                            onChange={(e) => setFilters({...filters, sepia: Number(e.target.value)})}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF5F1F]"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={handleApplyEdits}
                      disabled={isProcessing || uploading}
                      className="w-full bg-[#FF5F1F] hover:bg-[#FF4F0F] text-white font-black italic uppercase py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5F1F]/20 disabled:opacity-50"
                    >
                      {(isProcessing || uploading) ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                      {uploading ? `Subiendo ${uploadProgress}%` : (isProcessing ? 'Procesando...' : 'Aplicar y Usar')}
                    </button>

                    <button 
                      onClick={handleUseOriginal}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-mono uppercase tracking-widest py-3 rounded-2xl transition-all"
                    >
                      Usar Original
                    </button>
                  </div>
               </div>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6 custom-scrollbar min-h-[400px]">
              {activeTab === 'gallery' && (
                <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Buscar en la biblioteca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#FF5F1F] transition-all"
                />
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="w-8 h-8 text-[#FF5F1F] animate-spin" />
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Cargando activos...</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed border-zinc-900 rounded-[32px]">
                  <ImageIcon className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <p className="text-zinc-500 text-sm">No se encontraron imágenes.</p>
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className="mt-4 text-[#FF5F1F] text-[10px] font-mono uppercase tracking-widest hover:underline"
                  >
                    Sube tu primer archivo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredAssets.map(asset => (
                    <motion.div 
                      key={asset.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group relative aspect-square bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-[#FF5F1F] transition-all"
                      onClick={() => handleSelect(asset.url)}
                    >
                      <img 
                        src={asset.url || undefined} 
                        alt={asset.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <AnimatePresence>
                        {copySuccess === asset.url && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-2 left-2 z-20 bg-[#FF5F1F] text-white text-[7px] px-2 py-1 rounded-full font-black uppercase tracking-widest"
                          >
                            Copiado!
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        {onSelect ? (
                          <Check className="w-6 h-6 text-white bg-[#FF5F1F] p-1.5 rounded-full" />
                        ) : (
                          <LinkIcon className="w-6 h-6 text-white bg-[#FF5F1F] p-1.5 rounded-full" />
                        )}
                        <p className="text-[10px] font-black text-white uppercase italic">
                          {onSelect ? 'Seleccionar' : 'Copiar Link'}
                        </p>
                        <button 
                          type="button"
                          onClick={(e) => handleDelete(e, asset)}
                          className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-red-500/80 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-[8px] font-mono text-white truncate uppercase">{asset.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <div 
                className="w-full max-w-lg border-2 border-dashed border-zinc-800 rounded-[40px] p-12 text-center hover:border-[#FF5F1F] transition-all cursor-pointer group bg-zinc-950"
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                
                <div className="mb-6 relative inline-block">
                  <div className="w-20 h-20 bg-zinc-900 rounded-[28px] flex items-center justify-center group-hover:bg-[#FF5F1F]/10 transition-colors">
                    <FileUp className={`w-8 h-8 ${uploading ? 'text-[#FF5F1F] animate-bounce' : 'text-zinc-500 group-hover:text-[#FF5F1F]'}`} />
                  </div>
                  {uploading && (
                    <svg className="absolute -inset-2 w-24 h-24 rotate-[-90deg]">
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-zinc-800"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={276}
                        strokeDashoffset={276 - (276 * uploadProgress) / 100}
                        className="text-[#FF5F1F] transition-all duration-300"
                      />
                    </svg>
                  )}
                </div>

                <h3 className="text-xl font-black italic uppercase mb-2">
                  {uploading ? 'Subiendo contenido...' : 'Haz clic o arrastra aquí'}
                </h3>
                <p className="text-zinc-500 text-sm mb-6 max-w-xs mx-auto">
                  Sube tus archivos directamente al servidor de Hosting (Cloud Run). Soporta JPG, PNG, WEBP y SVG.
                </p>
                
                <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Check className="w-3 h-3" /> Máx 5MB</div>
                  <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                  <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Optimización Auto</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <div className="w-full max-w-lg space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-zinc-900 rounded-[24px] flex items-center justify-center mx-auto mb-4">
                    <LinkIcon className="w-6 h-6 text-[#FF5F1F]" />
                  </div>
                  <h3 className="text-xl font-black italic uppercase">Insertar por URL</h3>
                  <p className="text-zinc-500 text-sm">Pega la dirección directa de la imagen que deseas utilizar.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-[#FF5F1F] transition-all"
                    />
                  </div>

                  {imageUrl && (
                    <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 relative group">
                      <img 
                        src={imageUrl || undefined} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="bg-[#FF5F1F] text-white text-[10px] font-mono px-3 py-1.5 rounded-full uppercase tracking-widest">Previsualización</span>
                      </div>
                    </div>
                  )}

                  <button 
                    disabled={!imageUrl}
                    onClick={() => handleSelect(imageUrl)}
                    className="w-full bg-[#FF5F1F] hover:bg-[#FF4F0F] text-white font-black italic uppercase py-4 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Insertar en contenido
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

    {/* Footer info */}
        <div className="p-4 bg-zinc-900/30 border-t border-zinc-900 flex justify-between items-center text-[8px] font-mono text-zinc-600 uppercase tracking-widest px-8">
          <div className="flex items-center gap-4">
             <span>Almacenamiento Usado: 42.5 MB</span>
             <span>Archivos: {assets.length}</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-[#FF5F1F] rounded-full animate-pulse" />
             <span>Hosting Local Activo</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {pendingUploadFile && (
          <PlanoZeroUploader 
            file={pendingUploadFile}
            onComplete={handleSimulationComplete}
            onCancel={() => setPendingUploadFile(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaLibrary;
