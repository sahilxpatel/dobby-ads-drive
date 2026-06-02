import React from 'react';
import api from '../api/api';

const ImageGrid = ({ images, onDelete }) => {
  if (!images || images.length === 0) return <p style={{ color: '#888' }}>No images found in this folder.</p>;

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this image?')) {
      try {
        await api.delete(`/images/${id}`);
        onDelete();
      } catch (err) {
        console.error(err);
        alert('Failed to delete image');
      }
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: '16px', color: '#333' }}>Images</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: '20px' 
      }}>
        {images.map(img => (
          <div key={img._id} style={{
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ height: '180px', background: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img 
                src={`http://localhost:5000/uploads/${img.filename}`} 
                alt={img.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <strong style={{ wordBreak: 'break-word', marginBottom: '8px' }}>{img.name}</strong>
              <span style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>{formatSize(img.size)}</span>
              <button 
                onClick={(e) => handleDelete(e, img._id)}
                style={{ 
                  marginTop: 'auto', 
                  background: '#ff4d4f', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px', 
                  cursor: 'pointer', 
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
