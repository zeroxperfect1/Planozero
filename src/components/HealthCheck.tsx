import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, limit, getDocsFromServer, doc } from 'firebase/firestore';
import { Shield, CheckCircle2, XCircle, Loader2, Database, Cloud } from 'lucide-react';

interface HealthStatus {
  firebase: { status: 'loading' | 'ok' | 'error'; message?: string };
  api: { status: 'loading' | 'ok' | 'error'; message?: string };
  auth: { status: 'loading' | 'ok' | 'error'; user?: string };
}

export const HealthCheck = () => {
  const [status, setStatus] = useState<HealthStatus>({
    firebase: { status: 'loading' },
    api: { status: 'loading' },
    auth: { status: 'loading' }
  });

  const checkHealth = async () => {
    // 1. Check Firebase Connection (Client-side)
    try {
      // Use getDocsFromServer to force a network check
      const q = query(collection(db, 'pages'), limit(1));
      await getDocsFromServer(q);
      setStatus(prev => ({ ...prev, firebase: { status: 'ok' } }));
    } catch (err) {
      console.error("Health Check: Firebase Failed", err);
      setStatus(prev => ({ 
        ...prev, 
        firebase: { 
          status: 'error', 
          message: err instanceof Error ? err.message : 'Error de conexión Firestore' 
        } 
      }));
    }

    // 2. Check Backend API
    try {
      const resp = await fetch('/api/health');
      if (resp.ok) {
        setStatus(prev => ({ ...prev, api: { status: 'ok' } }));
      } else {
        throw new Error(`Endpoint returned ${resp.status}`);
      }
    } catch (err) {
      console.error("Health Check: API Failed", err);
      setStatus(prev => ({ 
        ...prev, 
        api: { 
          status: 'error', 
          message: err instanceof Error ? err.message : 'Backend inaccesible' 
        } 
      }));
    }

    // 3. Check Auth State
    const user = auth.currentUser;
    setStatus(prev => ({ 
      ...prev, 
      auth: { 
        status: user ? 'ok' : 'error', 
        user: user?.email || 'Sin sesión' 
      } 
    }));
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const StatusIcon = ({ state }: { state: 'loading' | 'ok' | 'error' }) => {
    if (state === 'loading') return <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />;
    if (state === 'ok') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-5 h-5 text-[#FF5F1F]" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Diagnóstico del Ecosistema</h3>
      </div>
      
      <div className="space-y-4">
        {/* Firebase Status */}
        <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800/50">
          <div className="flex items-center gap-3">
             <Cloud className="w-4 h-4 text-zinc-500" />
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Servicios Firebase</span>
          </div>
          <div className="flex items-center gap-3">
             {status.firebase.message && (
               <span className="text-[8px] text-red-500/70 font-mono truncate max-w-[100px]">{status.firebase.message}</span>
             )}
             <StatusIcon state={status.firebase.status} />
          </div>
        </div>

        {/* API Status */}
        <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800/50">
          <div className="flex items-center gap-3">
             <Database className="w-4 h-4 text-zinc-500" />
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Core Engine API</span>
          </div>
          <div className="flex items-center gap-3">
             {status.api.message && (
               <span className="text-[8px] text-red-500/70 font-mono truncate max-w-[100px]">{status.api.message}</span>
             )}
             <StatusIcon state={status.api.status} />
          </div>
        </div>

        {/* Auth Status */}
        <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800/50">
          <div className="flex items-center gap-3">
             <Shield className="w-4 h-4 text-zinc-500" />
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Identidad & RBAC</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[8px] text-zinc-500 font-mono italic">{status.auth.user}</span>
             <StatusIcon state={status.auth.status} />
          </div>
        </div>
      </div>

      <button 
        onClick={checkHealth}
        className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
      >
        Re-validar Conexiones
      </button>
    </div>
  );
};
