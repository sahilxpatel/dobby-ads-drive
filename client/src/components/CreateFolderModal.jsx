import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';

const CreateFolderModal = ({ isOpen, onClose, currentFolderId, onSuccess }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await api.post('/folders', {
        name: name.trim(),
        parentId: currentFolderId
      });
      setName('');
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create folder');
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
        <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>Create New Folder</h2>
        {error && <div style={{ background: '#ffebee', color: '#d32f2f', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Folder Name" 
            value={name} 
            onChange={e => { setName(e.target.value); setError(''); }} 
            required
            className="auth-input"
            style={{ marginBottom: '24px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ padding: '10px 16px', background: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;
