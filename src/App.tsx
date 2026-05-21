import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import Dashboard from './pages/Dashboard';
import CMSPage from './pages/CMSPage';


class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#0a0a0a', color: '#ff5f1f', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1>ERROR_DE_RENDERIZADO_DETECTADO</h1>
          <p>Por favor entrega este reporte al desarrollador:</p>
          <pre style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
            {this.state.error?.message}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ background: '#ff5f1f', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}
          >
            REINTENTAR CARGA
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<CMSPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<PostDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/:slug" element={<CMSPage />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
