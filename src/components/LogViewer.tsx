import React, { useEffect, useState, useCallback } from 'react';
import { Terminal, RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'error';
  message: string;
}

/**
 * Agrega una entrada al log via API.
 * Exportada para que server.ts y otros módulos puedan usarla.
 */
export const addLog = async (message: string, level: 'info' | 'error' = 'info') => {
  try {
    await api.logs.add(message, level);
  } catch (e) {
    // Fallo silencioso — no crashear si el log falla
    console.warn('LogViewer: no se pudo guardar log', e);
  }
};

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.logs.getAll();
      const entries: LogEntry[] = data.map((d: any) => ({
        timestamp: d.created_at || d.timestamp || new Date().toISOString(),
        level: d.level || 'info',
        message: d.message || '',
      }));
      setLogs(entries);
    } catch (err: any) {
      setError('No se pudieron obtener los logs: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLogs = async () => {
    if (!confirm('¿Estás seguro de que quieres borrar todos los logs?')) return;
    try {
      setLoading(true);
      await api.logs.clear();
      setLogs([]);
    } catch (err) {
      console.error('Error al borrar logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#FF5F1F]" />
          <h2 className="text-lg font-black uppercase tracking-tighter text-white">Logs del Sistema</h2>
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
        * Los logs se almacenan en la base de datos MySQL.
      </p>
    </div>
  );
}
