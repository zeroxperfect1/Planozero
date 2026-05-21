import React, { useEffect, useState } from 'react';
import { Terminal, RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { auth } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'error';
  message: string;
}

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No autenticado');

      const idToken = await user.getIdToken();
      const response = await fetch('/api/admin/logs', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('No se pudieron obtener los logs');
      }

      const data = await response.json();
      setLogs(data.reverse()); // Show newest first
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = async () => {
    if (!confirm('¿Estás seguro de que quieres borrar todos los logs?')) return;
    
    try {
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken();
      
      await fetch('/api/admin/logs', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      setLogs([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#FF5F1F]" />
          <h2 className="text-lg font-black uppercase tracking-tighter text-white">Logs del Servidor</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors disabled:opacity-50"
            title="Refrescar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={clearLogs}
            className="p-2 text-zinc-500 hover:text-red-600 transition-colors"
            title="Borrar logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden font-mono text-[13px]">
          <div className="max-h-[600px] overflow-y-auto p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
            {logs.length === 0 ? (
              <div className="text-zinc-600 py-8 text-center italic">
                {loading ? 'Cargando logs...' : 'No hay logs registrados todavía.'}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {logs.map((log, idx) => (
                  <motion.div
                    key={log.timestamp + idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 group"
                  >
                    <span className="text-zinc-600 shrink-0 select-none">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                    </span>
                    <span className={`shrink-0 font-bold select-none ${
                      log.level === 'error' ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      {log.level === 'error' ? 'ERR' : 'LOG'}
                    </span>
                    <span className={`break-all ${
                      log.level === 'error' ? 'text-red-400' : 'text-zinc-300'
                    }`}>
                      {log.message}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      )}
      
      <p className="text-xs text-zinc-500 italic">
        * Los logs se almacenan en memoria y se limpian al reiniciar el servidor.
      </p>
    </div>
  );
}
