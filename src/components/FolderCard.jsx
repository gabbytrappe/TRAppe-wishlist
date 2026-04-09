import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Check } from 'lucide-react';

const FolderCard = ({ country, customName, listings, onClick, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(customName || country);
  
  const coverImage = listings[0]?.image;
  const count = listings.length;
  
  const handleSave = () => {
    setIsEditing(false);
    if (editedName.trim() && editedName !== (customName || country)) {
      onRename(country, editedName.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <div 
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        background: 'white',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div 
        style={{ width: '100%', height: '160px', overflow: 'hidden' }}
        onClick={() => !isEditing && onClick()}
      >
        {coverImage && (
          <img 
            src={coverImage} 
            alt="Folder cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        )}
      </div>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                autoFocus
                value={editedName}
                onChange={e => setEditedName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-heading)',
                  border: '1px solid black',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  width: '100%',
                  outline: 'none'
                }}
              />
            </div>
          ) : (
            <div>
              <h3 
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                style={{ fontSize: '1.25rem', margin: '0 0 4px 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                {customName || country}
              </h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {count} {count === 1 ? 'saved' : 'saved'}
              </p>
            </div>
          )}
        </div>
        
        {!isEditing && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              marginLeft: '12px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-surface)',
              flexShrink: 0
            }}
          >
            <Edit2 size={16} color="black" />
          </button>
        )}
        {isEditing && (
          <button 
             onMouseDown={(e) => { e.preventDefault(); handleSave(); }} 
             style={{
                background: 'black',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                marginLeft: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
             }}
          >
             <Check size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FolderCard;
