import React from 'react';
import api from '../api/api';

const ImageGrid = ({ images, onDelete }) => {
  if (!images || images.length === 0) return null;

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 KB';
    const mb = 1024 * 1024;
    if (bytes < mb) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / mb).toFixed(2) + ' MB';
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
      <h3 style={{ marginBottom: '16px', color: '#374151', fontSize: '16px', fontWeight: '600' }}>Images</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
        gap: '16px' 
      }}>
        {images.map(img => (
          <div key={img._id} className="image-card">
            <div style={{ height: '120px', width: '100%', background: '#f3f4f6' }}>
              <img 
                src={img.url || `http://localhost:5000/uploads/${img.filename}`} 
                alt={img.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
              <strong style={{ wordBreak: 'break-word', marginBottom: '4px', fontSize: '14px', color: '#111827' }}>
                {img.name}
              </strong>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{formatSize(img.size)}</span>
                <button 
                  onClick={(e) => handleDelete(e, img._id)}
                  style={{ 
                    background: 'transparent', color: '#dc2626', border: 'none', 
                    padding: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' 
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
