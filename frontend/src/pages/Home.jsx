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
    <div>
      <h1>UPC List</h1>
      <div style={{marginBottom: '1em'}}>
        Backend connection: {backendStatus === 'checking' ? 'Checking...' : backendStatus === 'connected' ? '✅ Connected' : '❌ Not Connected'}
      </div>
      <ul>
        {upcs.map(upc => (
          <li key={upc}>
            <Link to={`/upc/${upc}`}>{upc}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
