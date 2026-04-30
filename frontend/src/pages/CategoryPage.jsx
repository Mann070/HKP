import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategories, getImages, uploadImages, deleteImagesBulk } from '../services/api';
import ImageGrid from '../components/ImageGrid';
import ImageModal from '../components/ImageModal';
import { ToastContext } from '../App';
import { ArrowLeft, Upload, CheckSquare, X, Send, Trash2 } from 'lucide-react';

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);

  const [category, setCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const [modalIndex, setModalIndex] = useState(-1);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [catRes, imgRes] = await Promise.all([
        getCategories(),
        getImages(id)
      ]);
      const currentCat = catRes.data.find(c => c._id === id);
      if (!currentCat) {
        addToast('Category not found', 'error');
        navigate('/');
        return;
      }
      setCategory(currentCat);
      setImages(imgRes.data);
    } catch (error) {
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 10) {
      addToast('You can only upload up to 10 images at once', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('categoryId', id);
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    setUploading(true);
    try {
      const res = await uploadImages(formData);
      setImages([...res.data, ...images]);
      addToast('Images uploaded successfully', 'success');
    } catch (error) {
      addToast('Failed to upload images', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedImages([]);
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedImages([]);
  };

  const handleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(img => img._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedImages.length} selected images?`)) return;
    
    try {
      await deleteImagesBulk({ ids: selectedImages });
      setImages(images.filter(img => !selectedImages.includes(img._id)));
      addToast(`${selectedImages.length} images deleted`, 'success');
      handleCancelSelection();
    } catch (error) {
      addToast('Failed to delete images', 'error');
    }
  };

  const handleSendWhatsApp = () => {
    if (selectedImages.length === 0) {
      addToast('Please select at least one image', 'error');
      return;
    }
    
    // Get URLs
    let selectedUrls = images
      .filter(img => selectedImages.includes(img._id))
      .map(img => img.imageUrl);
      
    // Prevent crashing the browser URL limit if local base64 images are used in testing
    selectedUrls = selectedUrls.map(url => {
      if (url.startsWith('data:') || url.startsWith('blob:')) {
        return 'https://via.placeholder.com/600x600.png?text=Test+Image+(Connect+Backend+for+Real+URL)';
      }
      // Ensure it's an absolute URL if it's a relative path from the backend
      if (url.startsWith('/')) {
        return `${window.location.origin}${url}`;
      }
      return url;
    });

    // Optional limit to 5 images as recommended for clean previews
    if (selectedUrls.length > 5) {
      addToast('Showing first 5 images for clean WhatsApp preview', 'info');
      selectedUrls = selectedUrls.slice(0, 5);
    }
      
    const message = `Hi, sharing product images:\n\n${selectedUrls.join("\n")}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, "_blank");
    
    handleCancelSelection();
  };

  if (loading) {
    return <div className="flex justify-center mt-8"><div className="loader"></div></div>;
  }

  if (!category) return null;

  return (
    <div>
      {/* Header Row */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button className="btn-icon" onClick={() => navigate('/')} style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <ArrowLeft size={20} />
          </button>
          
          {selectionMode ? (
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600, color: 'var(--primary-start)' }}>
              {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
            </h2>
          ) : (
            <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700, color: 'var(--text-dark)' }}>
              {category.name}
            </h2>
          )}
        </div>
        
        <div className="flex gap-3 flex-wrap">
          {!selectionMode ? (
            <>
              <button 
                className="btn btn-outline"
                onClick={toggleSelectionMode}
                disabled={images.length === 0}
              >
                <CheckSquare size={16} /> Select Photos
              </button>

              <button 
                className="btn btn-gradient"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={16} /> {uploading ? 'Uploading...' : 'Add Photos'}
              </button>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileUpload}
              />
            </>
          ) : (
            <>
              <button className="btn btn-outline" onClick={handleSelectAll}>
                {selectedImages.length === images.length ? 'Deselect All' : 'Select All'}
              </button>
              
              <button 
                className="btn btn-danger-outline" 
                onClick={handleDeleteSelected}
                disabled={selectedImages.length === 0}
              >
                <Trash2 size={16} /> Delete Selected
              </button>
              
              <button 
                className="btn btn-success" 
                onClick={handleSendWhatsApp}
                disabled={selectedImages.length === 0}
              >
                <Send size={16} /> Send via WhatsApp
              </button>
              
              <button className="btn btn-outline" onClick={handleCancelSelection}>
                <X size={16} /> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {images.length === 0 ? (
        <div 
          className="text-center" 
          style={{ 
            padding: '4rem', 
            backgroundColor: 'var(--card-bg)', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}
        >
          <div style={{ backgroundColor: 'var(--bg-end)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
            <Upload size={32} color="var(--primary-start)" />
          </div>
          <button 
            className="btn btn-gradient"
            style={{ 
              padding: '12px 20px', 
              fontSize: '16px',
              fontWeight: 600
            }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      ) : (
        <ImageGrid 
          images={images}
          selectionMode={selectionMode}
          selectedImages={selectedImages}
          toggleSelection={toggleSelection}
          openModal={(idx) => setModalIndex(idx)}
        />
      )}

      {/* Modal */}
      {modalIndex >= 0 && (
        <ImageModal 
          images={images}
          currentIndex={modalIndex}
          onClose={() => setModalIndex(-1)}
          onNavigate={(dir) => {
            let newIdx = modalIndex + dir;
            if (newIdx < 0) newIdx = images.length - 1;
            if (newIdx >= images.length) newIdx = 0;
            setModalIndex(newIdx);
          }}
        />
      )}
    </div>
  );
}
