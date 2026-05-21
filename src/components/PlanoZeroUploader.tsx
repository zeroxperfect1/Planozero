import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Cpu, 
  Database, 
  Cloud, 
  Zap,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadStage {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  icon: any;
  technicalDetails?: string[];
}

const STAGES: UploadStage[] = [
  {
    id: 1,
    title: 'Capa de Cliente y API (Frontend)',
    description: 'Conversión a Stream/FormData y subida por fragmentos.',
    status: 'pending',
    icon: Search,
    technicalDetails: [
      'POST /api/odata/images',
      'Chunked Upload: 1024kb/chunk',
      'Browser Stream initiated'
    ]
  },
  {
    id: 2,
    title: 'Autenticación y Seguridad',
    description: 'Verificación de permisos, extensiones y límites de tamaño.',
    status: 'pending',
    icon: ShieldCheck,
    technicalDetails: [
      'Auth: Bearer JWT validated',
      'MIME: image/jpeg explicitly allowed',
      'Permissions: Create/Delete granted'
    ]
  },
  {
    id: 3,
    title: 'Procesamiento y Miniaturas',
    description: 'Generación de perfiles (Thumbnails) mediante Librerías .NET.',
    status: 'pending',
    icon: Cpu,
    technicalDetails: [
      'Thumbnail Profile: Large (1200px)',
      'Thumbnail Profile: Medium (800px)',
      'Thumbnail Profile: Small (300px)'
    ]
  },
  {
    id: 4,
    title: 'Proveedores de Almacenamiento (Blob)',
    description: 'Persistencia del archivo físico en el storage configurado.',
    status: 'pending',
    icon: HardDrive,
    technicalDetails: [
      'Provider: AzureBlobProvider',
      'Location: container/media/default-source',
      'Integrity: SHA-256 match confirmed'
    ]
  },
  {
    id: 5,
    title: 'Metadatos (SQL Server)',
    description: 'Registro relacional de información (pz_media_content).',
    status: 'pending',
    icon: Database,
    technicalDetails: [
      'Table: pz_media_content updated',
      'Friendly URL generated',
      'Alt Text localized (ES-es)'
    ]
  },
  {
    id: 6,
    title: 'Entrega y Caché (Delivery)',
    description: 'Configuración de Output Cache y distribución vía CDN.',
    status: 'pending',
    icon: Globe,
    technicalDetails: [
      'Varnish Cache: Primed',
      'CDN Purge triggered',
      'Edge Location: US-WEST distributed'
    ]
  }
];

interface PlanoZeroUploaderProps {
  file: File;
  onComplete: (url: string) => void;
  onCancel: () => void;
}

export const PlanoZeroUploader: React.FC<PlanoZeroUploaderProps> = ({ file, onComplete, onCancel }) => {
  const [stages, setStages] = useState<UploadStage[]>(STAGES);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    startSimulation();
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const startSimulation = async () => {
    for (let i = 0; i < STAGES.length; i++) {
      setCurrentStageIndex(i);
      
      // Update status to processing
      setStages(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'processing' } : s
      ));

      // Simulate time for each stage
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update status to completed
      setStages(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'completed' } : s
      ));
    }

    // Final wait before completion
    setTimeout(() => {
      onComplete(previewUrl);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl bg-zinc-950 border border-[#FF5F1F]/20 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(255,95,31,0.15)]"
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* Simulation Visualization */}
          <div className="flex-grow p-8 lg:p-12 space-y-8 flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                  PlanoZero <span className="text-[#FF5F1F]">Libraries Manager</span>
                </h2>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
                  Arquitectura de Almacenamiento Estructurado
                </p>
              </div>
              <button 
                onClick={onCancel}
                className="p-3 hover:bg-zinc-900 rounded-full text-zinc-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid gap-4">
              {stages.map((stage, idx) => (
                <motion.div 
                  key={stage.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative p-5 rounded-3xl border transition-all duration-500 ${
                    stage.status === 'completed' 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : stage.status === 'processing'
                        ? 'bg-[#FF5F1F]/10 border-[#FF5F1F] shadow-[0_0_30px_rgba(255,95,31,0.1)]'
                        : 'bg-zinc-900/40 border-zinc-900'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl transition-colors ${
                      stage.status === 'completed' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : stage.status === 'processing'
                          ? 'bg-[#FF5F1F] text-white animate-pulse'
                          : 'bg-zinc-800 text-zinc-600'
                    }`}>
                      <stage.icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-black uppercase tracking-tight italic ${
                          stage.status === 'completed' ? 'text-zinc-200' : 'text-zinc-400'
                        }`}>
                          {idx + 1}. {stage.title}
                        </h4>
                        {stage.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {stage.status === 'processing' && <Loader2 className="w-4 h-4 text-[#FF5F1F] animate-spin" />}
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{stage.description}</p>
                      
                      {stage.status === 'processing' && stage.technicalDetails && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-3 overflow-hidden"
                        >
                          <div className="bg-black/40 rounded-xl p-3 font-mono text-[9px] text-[#FF5F1F]/80 space-y-1">
                            {stage.technicalDetails.map((detail, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-2">
                                <span className="opacity-40">[]</span> {detail}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Asset Preview Panel */}
          <div className="w-full lg:w-96 bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-zinc-800 p-8 flex flex-col items-center justify-center text-center">
            <div className="relative w-full aspect-square rounded-[40px] overflow-hidden border border-zinc-800 shadow-2xl mb-8 group">
              <img 
                src={previewUrl} 
                className={`w-full h-full object-cover transition-all duration-[3000ms] ${
                  currentStageIndex < 2 ? 'blur-2xl scale-110 grayscale' : 'blur-0 scale-100'
                } ${currentStageIndex >= 3 ? 'grayscale-0' : 'grayscale'}`}
                alt="Upload Preview" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                 <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">Nombre del Archivo</p>
                 <h4 className="text-sm font-black italic uppercase text-white truncate">{file.name}</h4>
                 <div className="flex items-center gap-3 mt-3 text-[9px] font-mono text-[#FF5F1F] uppercase tracking-tighter bg-black/40 p-2 rounded-lg">
                    <span>{ (file.size / 1024).toFixed(1) } KB</span>
                    <span className="opacity-20">|</span>
                    <span>{ file.type.split('/')[1].toUpperCase() }</span>
                 </div>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#FF5F1F]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentStageIndex + 1) / STAGES.length) * 100}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
                {Math.round(((currentStageIndex + 1) / STAGES.length) * 100)}% Completado
              </p>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-3 w-full">
               <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
                  <Network className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
                  <span className="text-[8px] font-mono text-zinc-500 block">ENLACE API</span>
                  <span className="text-[9px] font-black text-white">ACTIVE</span>
               </div>
               <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
                  <Database className="w-5 h-5 text-zinc-600 mx-auto mb-2" />
                  <span className="text-[8px] font-mono text-zinc-500 block">DATA SYNC</span>
                  <span className="text-[9px] font-black text-white">PENDING</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
