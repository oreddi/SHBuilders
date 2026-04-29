import React, { useState, useEffect } from 'react';

const LoadingOverlay = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for all content to load
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 800); // Small delay for smooth transition
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (!loading) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#1A1A1A',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.8s ease'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '1px solid rgba(255,255,255,0.2)',
        borderTop: '1px solid #fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }} />
      <div style={{
        fontFamily: 'var(--serif)',
        color: '#fff',
        letterSpacing: '4px',
        fontSize: '12px',
        textTransform: 'uppercase'
      }}>
        SHBuilders
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
