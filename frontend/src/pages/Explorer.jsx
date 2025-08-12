import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Explorer() {
  const { upcId } = useParams();
  const [path, setPath] = useState('');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/upcs/${upcId}/list?path=${encodeURIComponent(path)}`)
      .then(res => res.json())
      .then(setItems);
  }, [upcId, path]);

  const handleClick = (item) => {
    if (item.type === 'folder') {
      setPath(path ? `${path}/${item.name}` : item.name);
    }
  };

  const handleBack = () => {
    if (!path) return navigate('/');
    const parts = path.split('/');
    parts.pop();
    setPath(parts.join('/'));
  };

  const handleSelect = (item) => {
    setSelected(sel => sel.includes(item.name) ? sel.filter(n => n !== item.name) : [...sel, item.name]);
  };

  const handleDownload = () => {
    const params = new URLSearchParams();
    selected.forEach(f => params.append('files', f));
    window.location = `/api/upcs/${upcId}/download?path=${encodeURIComponent(path)}&${params.toString()}`;
  };

  const crumbs = [upcId, ...path.split('/').filter(Boolean)];

  return (
    <div style={{ maxWidth: 900, margin: '2em auto', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button onClick={handleBack} style={{ padding: '0.5em 1em', borderRadius: 6, border: '1px solid #e0e0e0', background: '#f5f7fa', cursor: 'pointer', fontWeight: 500 }}>⬅ Back</button>
        <div style={{ fontSize: 18, color: '#1976d2', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>📁</span>
          <span>/{crumbs.join('/')}</span>
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5em',
        background: '#f5f7fa',
        padding: '1.5em',
        borderRadius: 12,
        minHeight: 120,
        boxShadow: '0 2px 8px #0001',
        marginBottom: 18
      }}>
        {items.length === 0 && (
          <div style={{ color: '#888', fontStyle: 'italic' }}>No files or folders found.</div>
        )}
        {items.map(item => (
          <div
            key={item.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 110,
              padding: '1em 0.5em',
              background: selected.includes(item.name) ? '#e3f2fd' : '#fff',
              borderRadius: 8,
              textDecoration: 'none',
              color: '#222',
              boxShadow: '0 1px 4px #0001',
              transition: 'box-shadow 0.2s, background 0.2s',
              fontWeight: 500,
              fontSize: 16,
              cursor: item.type === 'folder' ? 'pointer' : 'default',
              border: '1px solid #e0e0e0',
              position: 'relative',
            }}
            onClick={() => handleClick(item)}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px #1976d233'}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px #0001'}
          >
            <span style={{ fontSize: 38, color: item.type === 'folder' ? '#1976d2' : '#757575', marginBottom: 8 }}>
              {item.type === 'folder' ? '📁' : '📄'}
            </span>
            <span style={{ wordBreak: 'break-all', textAlign: 'center', marginBottom: 8 }}>{item.name}</span>
            <input
              type="checkbox"
              checked={selected.includes(item.name)}
              onChange={e => { e.stopPropagation(); handleSelect(item); }}
              style={{ position: 'absolute', top: 8, right: 8 }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleDownload}
        disabled={selected.length === 0}
        style={{
          padding: '0.7em 1.5em',
          borderRadius: 6,
          border: 'none',
          background: selected.length === 0 ? '#bdbdbd' : '#1976d2',
          color: '#fff',
          fontWeight: 600,
          fontSize: 16,
          cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 8px #0001',
        }}
      >
        Download Selected
      </button>
    </div>
  );
}
