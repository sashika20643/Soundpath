import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  fallbackSrc,
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  width,
  height,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Generate responsive image sources with different sizes
  const generateSrcSet = (originalSrc: string) => {
    if (!originalSrc || originalSrc.includes('musicDefaultImage')) {
      return undefined;
    }

    // For external URLs, we can't generate different sizes
    // In a real app, you'd use a service like Cloudinary or ImageKit
    return undefined;
  };

  // Convert image to WebP if possible (browser dependent)
  const getOptimizedSrc = (originalSrc: string) => {
    if (!originalSrc) return originalSrc;
    
    // For external images, check if WebP version exists
    // This is a simple approach - in production you'd use an image service
    if (originalSrc.includes('.jpg') || originalSrc.includes('.jpeg') || originalSrc.includes('.png')) {
      // Try WebP first if browser supports it
      const supportsWebP = (() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      })();

      if (supportsWebP) {
        // In production, you'd replace with WebP URL from your image service
        return originalSrc;
      }
    }

    return originalSrc;
  };

  useEffect(() => {
    setCurrentSrc(src);
    setImageError(false);
    setIsLoading(true);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setImageError(false);
    } else {
      setImageError(true);
      setIsLoading(false);
    }
    onError?.(e);
  };

  const optimizedSrc = getOptimizedSrc(currentSrc);
  const srcSet = generateSrcSet(optimizedSrc);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {isLoading && (
        <div 
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_400%] animate-gradient-shift"
          style={{
            animation: 'gradient-shift 2s ease-in-out infinite'
          }}
        />
      )}

      {/* Error placeholder */}
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-8 h-8 mx-auto mb-2 opacity-50">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
            </div>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Main image */}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        loading={priority ? 'eager' : loading}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

// Custom CSS for gradient animation (add to global styles)
const gradientShiftCSS = `
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = gradientShiftCSS;
  document.head.appendChild(style);
}