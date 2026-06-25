import React, { useState } from 'react';

const ImageUpload = ({ images, onChange, maxImages = 5 }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;
    const filesToProcess = fileArray.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImages = [...images, e.target.result];
          onChange(newImages);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="image-upload">
      <label className="form-label">Изображения (максимум {maxImages})</label>
      
      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((image, index) => (
            <div key={index} className="image-preview-item">
              <img src={image} alt={`Превью ${index + 1}`} className="image-preview" />
              <button
                type="button"
                className="image-remove-btn"
                onClick={() => removeImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div
          className={`image-drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleInputChange}
            className="image-input"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="image-upload-label">
            <div className="upload-icon">📁</div>
            <div className="upload-text">
              <p>Перетащите изображения сюда или нажмите для выбора</p>
              <p className="upload-hint">
                PNG, JPG, GIF до 10МБ ({maxImages - images.length} слотов доступно)
              </p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;