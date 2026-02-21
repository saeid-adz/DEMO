import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // For production, use the same host but port 5001
  // For local dev, use the env variable
  const API_BASE_URL = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' 
      ? 'http://localhost:5001' 
      : `http://${window.location.hostname}:5001`);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery`);
      const data = await response.json();
      
      if (data.success) {
        setImages(data.images);
      } else {
        setError(data.error || 'Failed to load images');
      }
    } catch (err) {
      setError('Unable to connect to gallery service');
      console.error('Gallery fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const currentIndex = images.findIndex(img => img.name === selectedImage.name);
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % images.length 
      : (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[newIndex]);
  };

  if (loading) {
    return (
      <div className="gallery-container">
        <div className="gallery-header">
          <Link to="/" className="back-button">← Back to Home</Link>
          <h1 className="gallery-title">Photo Gallery</h1>
        </div>
        <div className="loading-spinner">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-container">
        <div className="gallery-header">
          <Link to="/" className="back-button">← Back to Home</Link>
          <h1 className="gallery-title">Photo Gallery</h1>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchImages} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <Link to="/" className="back-button">← Back to Home</Link>
        <h1 className="gallery-title">Photo Gallery</h1>
        <p className="image-count">{images.length} {images.length === 1 ? 'image' : 'images'}</p>
      </div>

      <div className="gallery-grid">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="gallery-item"
            onClick={() => openLightbox(image)}
          >
            <img 
              src={`${API_BASE_URL}${image.url}`} 
              alt={image.name}
              className="gallery-image"
              loading="lazy"
            />
            <div className="image-overlay">
              <span className="image-name">{image.name}</span>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="empty-state">
          <p>No images found in the gallery</p>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>✕</button>
            <button className="lightbox-nav lightbox-prev" onClick={() => navigateImage('prev')}>‹</button>
            <img 
              src={`${API_BASE_URL}${selectedImage.url}`} 
              alt={selectedImage.name}
              className="lightbox-image"
            />
            <button className="lightbox-nav lightbox-next" onClick={() => navigateImage('next')}>›</button>
            <div className="lightbox-caption">{selectedImage.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
