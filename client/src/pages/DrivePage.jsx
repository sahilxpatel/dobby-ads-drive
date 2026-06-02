import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Breadcrumb from '../components/Breadcrumb';
import FolderGrid from '../components/FolderGrid';
import ImageGrid from '../components/ImageGrid';
import CreateFolderModal from '../components/CreateFolderModal';
import UploadImageModal from '../components/UploadImageModal';

const DrivePage = () => {
  const { user, logout } = useAuth();
  
  // State for Navigation
  const [currentFolder, setCurrentFolder] = useState(null);
  const [historyStack, setHistoryStack] = useState([]);
  
  // State for Data
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Modals
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const folderId = currentFolder ? currentFolder._id : null;
      
      const foldersPromise = folderId 
        ? api.get(`/folders/${folderId}/children`)
        : api.get('/folders');
      
      const imagesPromise = api.get(`/images/${folderId || 'root'}`);

      const [foldersRes, imagesRes] = await Promise.all([foldersPromise, imagesPromise]);

      setFolders(foldersRes.data);
      setImages(imagesRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  }, [currentFolder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEnterFolder = (folder) => {
    setHistoryStack(prev => currentFolder ? [...prev, currentFolder] : [...prev]);
    setCurrentFolder(folder);
  };

  const handleNavigateBreadcrumb = (folder, index) => {
    if (folder === null) {
      setCurrentFolder(null);
      setHistoryStack([]);
    } else {
      setCurrentFolder(folder);
      setHistoryStack(prev => prev.slice(0, index));
    }
  };

  const handleBack = () => {
    if (historyStack.length === 0) {
      setCurrentFolder(null);
    } else {
      const newStack = [...historyStack];
      const prevFolder = newStack.pop();
      setHistoryStack(newStack);
      setCurrentFolder(prevFolder);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h2 style={{ margin: 0, color: '#1677ff' }}>Drive <span style={{ color: '#333', fontSize: '18px' }}>/ {user?.username}</span></h2>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </header>

      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <Breadcrumb 
            historyStack={historyStack} 
            currentFolder={currentFolder} 
            onNavigate={handleNavigateBreadcrumb} 
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setIsFolderModalOpen(true)} style={actionButtonStyle('#fff', '#1677ff', '1px solid #1677ff')}>+ New Folder</button>
            <button onClick={() => setIsUploadModalOpen(true)} style={actionButtonStyle('#1677ff', '#fff', 'none')}>+ Upload Image</button>
          </div>
        </div>

        {currentFolder && (
          <button onClick={handleBack} style={{ marginBottom: '24px', padding: '8px 16px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: '4px', cursor: 'pointer' }}>
            &larr; Back
          </button>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading contents...</div>
        ) : (
          <>
            <FolderGrid folders={folders} onEnterFolder={handleEnterFolder} />
            {folders.length > 0 && images.length > 0 && <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e8e8e8' }} />}
            <ImageGrid images={images} onDelete={fetchData} />
          </>
        )}
      </main>

      <CreateFolderModal 
        isOpen={isFolderModalOpen} 
        onClose={() => setIsFolderModalOpen(false)} 
        currentFolderId={currentFolder?._id || null}
        onSuccess={fetchData}
      />

      <UploadImageModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        currentFolderId={currentFolder?._id || null}
        onSuccess={fetchData}
      />
    </div>
  );
};

const actionButtonStyle = (bg, color, border) => ({
  padding: '10px 20px',
  background: bg,
  color: color,
  border: border,
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
});

export default DrivePage;
