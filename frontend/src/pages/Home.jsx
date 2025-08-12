import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [upcs, setUpcs] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    fetch('/api/upcs')
      .then(res => {
        if (!res.ok) throw new Error('Backend not reachable');
        setBackendStatus('connected');
        return res.json();
      })
      .then(setUpcs)
      .catch(() => setBackendStatus('disconnected'));
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '2em auto', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 28, color: '#1976d2' }}>📁</span> UPC File Explorer
      </h1>
      <div style={{ marginBottom: '1em', fontSize: 15, color: '#555' }}>
        Backend connection: {backendStatus === 'checking' ? 'Checking...' : backendStatus === 'connected' ? '✅ Connected' : '❌ Not Connected'}
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5em',
        background: '#f5f7fa',
        padding: '1.5em',
        borderRadius: 12,
        minHeight: 120,
        boxShadow: '0 2px 8px #0001'
      }}>
        {upcs.length === 0 && backendStatus === 'connected' && (
          <div style={{ color: '#888', fontStyle: 'italic' }}>No UPC folders found.</div>
        )}
        {upcs.map(upc => (
          <Link
            key={upc}
            to={`/upc/${upc}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 110,
              padding: '1em 0.5em',
              background: '#fff',
              borderRadius: 8,
              textDecoration: 'none',
              color: '#222',
              boxShadow: '0 1px 4px #0001',
              transition: 'box-shadow 0.2s, background 0.2s',
              fontWeight: 500,
              fontSize: 16,
              cursor: 'pointer',
              border: '1px solid #e0e0e0',
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px #1976d233'}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px #0001'}
          >
            <span style={{ fontSize: 38, color: '#1976d2', marginBottom: 8 }}>📁</span>
            <span style={{ wordBreak: 'break-all', textAlign: 'center' }}>{upc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
