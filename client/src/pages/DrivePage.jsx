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
  
  const [currentFolder, setCurrentFolder] = useState(null);
  const [historyStack, setHistoryStack] = useState([]);
  
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', width: '100%' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: '60px', 
        padding: '0 24px', 
        background: '#fff', 
        borderBottom: '1px solid #e5e7eb' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ margin: 0, color: '#2563eb', fontSize: '20px', fontWeight: '600' }}>Drive</h2>
          <span style={{ color: '#9ca3af', fontSize: '20px' }}>/</span>
          <span style={{ color: '#6b7280', fontSize: '16px', fontWeight: '500' }}>{user?.username}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '50%', background: '#e5e7eb', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: '#374151', fontWeight: 'bold', fontSize: '14px' 
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <Breadcrumb 
            historyStack={historyStack} 
            currentFolder={currentFolder} 
            onNavigate={handleNavigateBreadcrumb} 
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setIsFolderModalOpen(true)} 
              style={{ background: '#fff', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '8px', padding: '10px 20px', fontWeight: '500', cursor: 'pointer' }}
            >
              + New Folder
            </button>
            <button 
              onClick={() => setIsUploadModalOpen(true)} 
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '500', cursor: 'pointer' }}
            >
              + Upload Image
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading contents...</div>
        ) : (
          <>
            {folders.length === 0 && images.length === 0 ? (
              <div style={{ 
                marginTop: '80px', display: 'flex', flexDirection: 'column', 
                alignItems: 'center', justifyContent: 'center' 
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📁</div>
                <h3 style={{ color: '#374151', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>This folder is empty</h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Create a new folder or upload an image to get started</p>
              </div>
            ) : (
              <>
                <FolderGrid folders={folders} onEnterFolder={handleEnterFolder} />
                <ImageGrid images={images} onDelete={fetchData} />
              </>
            )}
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

export default DrivePage;
