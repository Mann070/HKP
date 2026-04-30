import React from 'react';
import { Check } from 'lucide-react';

export default function ImageGrid({ 
  images, 
  selectionMode, 
  selectedImages, 
  toggleSelection, 
  openModal
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem'
    }}>
      {images.map((img, index) => {
        const isSelected = selectedImages.includes(img._id);
        
        return (
          <div 
            key={img._id} 
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              aspectRatio: '1 / 1',
              cursor: selectionMode ? 'pointer' : 'zoom-in',
              border: isSelected ? '4px solid var(--primary-start)' : '4px solid transparent',
              transition: 'var(--transition)'
            }}
            onClick={() => {
              if (selectionMode) {
                toggleSelection(img._id);
              } else {
                openModal(index);
              }
            }}
            onMouseEnter={e => {
              if (!selectionMode) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }
            }}
            onMouseLeave={e => {
              if (!selectionMode) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }
            }}
          >
            <img 
              src={img.imageUrl} 
              alt="Product" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'var(--transition)',
                transform: isSelected ? 'scale(0.95)' : 'scale(1)',
                opacity: isSelected ? '0.8' : '1'
              }}
            />
            
            {selectionMode && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: isSelected ? 'var(--primary-start)' : 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                border: isSelected ? 'none' : '2px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)',
                transition: 'var(--transition)'
              }}>
                {isSelected && <Check size={18} strokeWidth={3} />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
