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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', 
        zIndex: 50
      }}
      onClick={handleOverlayClick}
    >
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: '#fff', borderRadius: '12px', padding: '28px', width: '400px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>Upload Image</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>Name (optional)</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Vacation Photo"
              className="auth-input"
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>Image File</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setFile(e.target.files[0])} 
              required
              style={{ width: '100%', fontSize: '14px' }}
            />
          </div>
          
          {loading && (
            <div style={{ marginBottom: '20px', background: '#f3f4f6', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, background: '#2563eb', height: '100%', transition: 'width 0.2s' }} />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading} 
              style={{ padding: '10px 16px', background: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !file} 
              style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              {loading ? `Uploading (${progress}%)` : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadImageModal;
