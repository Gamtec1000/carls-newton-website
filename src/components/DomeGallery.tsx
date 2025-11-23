import { useState } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
}

interface DomeGalleryProps {
  images: GalleryImage[];
}

const DomeGallery: React.FC<DomeGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setRotation((prev) => prev + diff * 0.3);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const styles = {
    container: {
      width: '100%',
      height: '600px',
      position: 'relative' as const,
      cursor: isDragging ? 'grabbing' : 'grab',
      overflow: 'hidden',
      perspective: '1200px',
      userSelect: 'none' as const,
    },
    domeContainer: {
      width: '100%',
      height: '100%',
      position: 'relative' as const,
      transformStyle: 'preserve-3d' as const,
      transform: `rotateY(${rotation}deg)`,
      transition: isDragging ? 'none' : 'transform 0.5s ease-out',
    },
    imageWrapper: (index: number) => {
      const angle = (360 / images.length) * index;
      const radius = 450;
      return {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        width: '280px',
        height: '280px',
        transform: `
          translateX(-50%)
          translateY(-50%)
          rotateY(${angle}deg)
          translateZ(${radius}px)
        `,
        transformStyle: 'preserve-3d' as const,
        transition: 'all 0.3s ease',
      };
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      borderRadius: '20px',
      filter: 'grayscale(100%)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    } as React.CSSProperties,
    imageHover: {
      filter: 'grayscale(0%)',
      transform: 'scale(1.05)',
      border: '2px solid rgba(6, 182, 212, 0.5)',
      boxShadow: '0 20px 60px rgba(6, 182, 212, 0.3)',
    } as React.CSSProperties,
    modal: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(10px)',
      cursor: 'pointer',
    },
    modalImage: {
      maxWidth: '90vw',
      maxHeight: '90vh',
      borderRadius: '20px',
      boxShadow: '0 20px 80px rgba(0, 0, 0, 0.8)',
      cursor: 'default',
    } as React.CSSProperties,
    closeButton: {
      position: 'absolute' as const,
      top: '30px',
      right: '30px',
      fontSize: '40px',
      color: 'white',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      zIndex: 10000,
      padding: '10px 20px',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <>
      <div
        style={styles.container}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div style={styles.domeContainer}>
          {images.map((image, index) => (
            <div
              key={index}
              style={styles.imageWrapper(index)}
              onClick={(e) => handleImageClick(index, e)}
            >
              <img
                src={image.src}
                alt={image.alt}
                style={styles.image}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'grayscale(0%)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.border = '2px solid rgba(6, 182, 212, 0.5)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(6, 182, 212, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'grayscale(100%)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.5)';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedImage !== null && (
        <div style={styles.modal} onClick={closeModal}>
          <button
            style={styles.closeButton}
            onClick={closeModal}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ×
          </button>
          <img
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            style={styles.modalImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default DomeGallery;
