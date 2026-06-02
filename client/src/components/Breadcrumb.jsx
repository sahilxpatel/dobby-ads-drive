import React from 'react';

const Breadcrumb = ({ historyStack, currentFolder, onNavigate }) => {
  return (
    <div className="breadcrumb" style={{ display: 'flex', gap: '8px', padding: '10px 0', alignItems: 'center', flexWrap: 'wrap' }}>
      <span style={{ cursor: 'pointer', color: '#1677ff', fontWeight: 'bold' }} onClick={() => onNavigate(null, -1)}>
        Root
      </span>
      {historyStack.map((folder, index) => (
        <React.Fragment key={folder._id}>
          <span style={{ color: '#999' }}> / </span>
          <span 
            style={{ cursor: 'pointer', color: '#1677ff', fontWeight: 'bold' }} 
            onClick={() => onNavigate(folder, index)}
          >
            {folder.name}
          </span>
        </React.Fragment>
      ))}
      {currentFolder && (
        <>
          <span style={{ color: '#999' }}> / </span>
          <span>{currentFolder.name}</span>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
