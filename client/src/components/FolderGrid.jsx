import React, { useEffect, useState } from 'react';
import api from '../api/api';

const FolderCard = ({ folder, onEnter }) => {
  const [size, setSize] = useState(null);

  useEffect(() => {
    // Dynamically fetch recursive size from backend
    api.get(`/folders/${folder._id}`)
      .then(res => setSize(res.data.size))
      .catch(err => console.error('Error fetching size:', err));
  }, [folder._id]);

  const formatSize = (bytes) => {
    if (bytes === null) return 'Loading...';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div 
      onClick={() => onEnter(folder)}
      style={{
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px 16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>
      <strong style={{ textAlign: 'center', wordBreak: 'break-word', marginBottom: '4px' }}>{folder.name}</strong>
      <span style={{ fontSize: '13px', color: '#888' }}>{formatSize(size)}</span>
    </div>
  );
};

const FolderGrid = ({ folders, onEnterFolder }) => {
  if (!folders || folders.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ marginBottom: '16px', color: '#333' }}>Folders</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
        gap: '20px' 
      }}>
        {folders.map(folder => (
          <FolderCard key={folder._id} folder={folder} onEnter={onEnterFolder} />
        ))}
      </div>
    </div>
  );
};

export default FolderGrid;
