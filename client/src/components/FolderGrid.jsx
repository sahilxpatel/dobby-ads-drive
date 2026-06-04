import React, { useEffect, useState } from 'react';
import api from '../api/api';

const FolderCard = ({ folder, onEnter }) => {
  const [size, setSize] = useState(null);

  useEffect(() => {
    api.get(`/folders/${folder._id}`)
      .then(res => setSize(res.data.size))
      .catch(err => console.error('Error fetching size:', err));
  }, [folder._id]);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 KB';
    const mb = 1024 * 1024;
    if (bytes < mb) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / mb).toFixed(2) + ' MB';
  };

  return (
    <div className="folder-card" onClick={() => onEnter(folder)}>
      <div style={{ fontSize: '48px', marginBottom: '8px' }}>📁</div>
      <strong style={{ textAlign: 'center', wordBreak: 'break-word', marginBottom: '4px', fontSize: '14px', color: '#111827' }}>
        {folder.name}
      </strong>
      {size === null ? (
        <div style={{ width: '40px', height: '14px', background: '#e5e7eb', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
      ) : (
        <span style={{ fontSize: '12px', color: '#6b7280' }}>{formatSize(size)}</span>
      )}
    </div>
  );
};

const FolderGrid = ({ folders, onEnterFolder }) => {
  if (!folders || folders.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ marginBottom: '16px', color: '#374151', fontSize: '16px', fontWeight: '600' }}>Folders</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
        gap: '16px' 
      }}>
        {folders.map(folder => (
          <FolderCard key={folder._id} folder={folder} onEnter={onEnterFolder} />
        ))}
      </div>
    </div>
  );
};

export default FolderGrid;
