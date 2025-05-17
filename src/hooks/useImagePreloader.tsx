
import { useState, useEffect } from 'react';

interface UseImagePreloaderProps {
  imageUrls: string[];
}

export const useImagePreloader = ({ imageUrls }: UseImagePreloaderProps) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (!imageUrls.length) {
      setImagesLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;
    
    const preloadImages = () => {
      imageUrls.forEach(url => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          loadedCount++;
          console.error(`Failed to load image: ${url}`);
          if (loadedCount === totalImages) {
            // Continuar mesmo se alguma imagem falhar
            setImagesLoaded(true);
          }
        };
        img.src = url;
      });
    };
    
    preloadImages();
  }, [imageUrls]);

  return { imagesLoaded };
};

export default useImagePreloader;
