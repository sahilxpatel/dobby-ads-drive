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
    if (bytes === 0) return '0 KB';
    const mb = 1024 * 1024;
    if (bytes < mb) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return (bytes / mb).toFixed(2) + ' MB';
    }
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
      {size === null ? (
        <div style={{ width: '50px', height: '16px', background: '#e0e0e0', borderRadius: '4px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
      ) : (
        <span style={{ fontSize: '13px', color: '#888' }}>{formatSize(size)}</span>
      )}
    </div>
  );
};

const FolderGrid = ({ folders, onEnterFolder }) => {
  if (!folders || folders.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px' }}>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>
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
