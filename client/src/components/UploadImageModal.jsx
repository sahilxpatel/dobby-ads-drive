import React, { useState } from 'react';
import api from '../api/api';

const UploadImageModal = ({ isOpen, onClose, currentFolderId, onSuccess }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', name);
    formData.append('folderId', currentFolderId || 'root');

    try {
      await api.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      setName('');
      setFile(null);
      setProgress(0);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={{ marginTop: 0 }}>Upload Image</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Name (optional)</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Vacation Photo"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Image File</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setFile(e.target.files[0])} 
              required
              style={{ width: '100%' }}
            />
          </div>
          
          {loading && (
            <div style={{ marginBottom: '20px', background: '#f0f0f0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, background: '#1677ff', height: '100%', transition: 'width 0.2s' }} />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} disabled={loading} style={btnStyle('#fff', '#333', '1px solid #ccc')}>Cancel</button>
            <button type="submit" disabled={loading || !file} style={btnStyle('#1677ff', '#fff', 'none')}>
              {loading ? `Uploading (${progress}%)` : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};
const modalContentStyle = {
  background: 'white', padding: '32px', borderRadius: '12px', minWidth: '350px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
};
const btnStyle = (bg, color, border) => ({
  padding: '8px 16px', background: bg, color, border, borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
});

export default UploadImageModal;
