import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageModal({ images, currentIndex, onClose, onNavigate }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  if (!images || images.length === 0) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <button 
        style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          color: 'white', background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%', padding: '0.5rem', cursor: 'pointer',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'var(--transition)'
        }}
        onClick={onClose}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >
        <X size={24} />
      </button>

      <button 
        style={{
          position: 'absolute', left: '1.5rem',
          color: 'white', background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%', padding: '0.5rem', cursor: 'pointer',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'var(--transition)'
        }}
        onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >
        <ChevronLeft size={32} />
      </button>

      <img 
        src={images[currentIndex].imageUrl} 
        alt="Preview" 
        style={{
          maxHeight: '90vh',
          maxWidth: '90vw',
          objectFit: 'contain',
          userSelect: 'none',
          animation: 'modalIn 0.3s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      />

      <button 
        style={{
          position: 'absolute', right: '1.5rem',
          color: 'white', background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%', padding: '0.5rem', cursor: 'pointer',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'var(--transition)'
        }}
        onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >
        <ChevronRight size={32} />
      </button>
      
      <div style={{
        position: 'absolute', bottom: '1.5rem',
        color: 'white', background: 'rgba(0,0,0,0.5)',
        padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
        fontSize: '0.875rem'
      }}>
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
