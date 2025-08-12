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

  return (
    <div>
      <button onClick={handleBack}>Back</button>
      <h2>Browsing: /{upcId}{path && '/' + path}</h2>
      <ul>
        {items.map(item => (
          <li key={item.name}>
            <span style={{cursor: item.type==='folder'?'pointer':'default', fontWeight: item.type==='folder'?'bold':'normal'}} onClick={() => handleClick(item)}>
              {item.name}
            </span>
            <input type="checkbox" checked={selected.includes(item.name)} onChange={() => handleSelect(item)} />
          </li>
        ))}
      </ul>
      <button onClick={handleDownload} disabled={selected.length === 0}>Download Selected</button>
    </div>
  );
}
