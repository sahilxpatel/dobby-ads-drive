import React, { useState } from 'react';
import api from '../api/api';

const CreateFolderModal = ({ isOpen, onClose, currentFolderId, onSuccess }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

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
      alert('Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={{ marginTop: 0 }}>Create Folder</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Folder Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required
            autoFocus
            style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} style={btnStyle('#fff', '#333', '1px solid #ccc')}>Cancel</button>
            <button type="submit" disabled={loading} style={btnStyle('#1677ff', '#fff', 'none')}>
              {loading ? 'Creating...' : 'Create'}
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

export default CreateFolderModal;
