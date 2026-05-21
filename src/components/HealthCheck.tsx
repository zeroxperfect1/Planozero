import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, Database, Shield, Globe } from 'lucide-react';
import { auth } from '../lib/firebase';
import { api } from '../services/api';

interface HealthStatus {
  api: 'ok' | 'error' | 'checking';
  auth: 'ok' | 'error' | 'checking';
  storage: 'ok' | 'error' | 'checking';
}

const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState<HealthStatus>({
    api: 'checking',
    auth: 'checking',
    storage: 'checking',
  });
  const [lastCheck, setLastCheck] = useState<string>('');

  const runChecks = async () => {
    setStatus({ api: 'checking', auth: 'checking', storage: 'checking' });

    // 1. API/MySQL ping
    try {
      await api.health.check();
      setStatus(s => ({ ...s, api: 'ok' }));
    } catch (e: any) {
      setStatus(s => ({ ...s, api: 'error' }));
    }

    // 2. Firebase Auth
    try {
      const user = auth.currentUser;
      if (user) {
        await user.getIdToken(true); // Refresh token
        setStatus(s => ({ ...s, auth: 'ok' }));
      } else {
        setStatus(s => ({ ...s, auth: 'ok' })); // Auth inicializado aunque no logueado
      }
    } catch {
      setStatus(s => ({ ...s, auth: 'error' }));
    }

    // 3. Firebase Storage (check via URL reachability)
    try {
      const storageUrl = 'https://firebasestorage.googleapis.com';
      await fetch(storageUrl, { method: 'HEAD', mode: 'no-cors' });
      setStatus(s => ({ ...s, storage: 'ok' }));
    } catch {
      setStatus(s => ({ ...s, storage: 'error' }));
    }

    setLastCheck(new Date().toLocaleTimeString('es-CL'));
  };

  useEffect(() => {
    runChecks();
    const interval = setInterval(runChecks, 60000); // check cada 60s
    return () => clearInterval(interval);
  }, []);

  const StatusIcon = ({ state }: { state: 'ok' | 'error' | 'checking' }) => {
    if (state === 'checking') return <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />;
    if (state === 'ok') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const checks = [
    { key: 'api' as const, label: 'API / MySQL DB', icon: Database },
    { key: 'auth' as const, label: 'Firebase Auth', icon: Shield },
    { key: 'storage' as const, label: 'Firebase Storage', icon: Globe },
  ];

  const allOk = Object.values(status).every(s => s === 'ok');

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-2xl border ${allOk ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-900 border-zinc-800'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Estado del Sistema</span>
          <button
            onClick={runChecks}
            className="text-[10px] font-mono uppercase text-[#FF5F1F] hover:underline"
          >
            Verificar
          </button>
        </div>
        <div className="space-y-2">
          {checks.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
              <StatusIcon state={status[key]} />
            </div>
          ))}
        </div>
        {lastCheck && (
          <p className="text-[9px] font-mono text-zinc-600 uppercase mt-3">
            Última verificación: {lastCheck}
          </p>
        )}
      </div>
    </div>
  );
};

export default HealthCheck;
