// Image optimization utilities

/**
 * Check if the browser supports WebP format
 */
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    return false;
  }
};

/**
 * Generate optimized image URL based on original source
 * In production, this would integrate with image CDN services like Cloudinary
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png' | 'auto';
  } = {}
): string => {
  if (!originalUrl || originalUrl.includes('localhost') || originalUrl.includes('assets')) {
    return originalUrl;
  }

  // For production, you would replace this with your image CDN logic
  // Example for Cloudinary: 
  // return `https://res.cloudinary.com/your-cloud/image/fetch/f_auto,q_auto,w_${width}/${originalUrl}`;
  
  // For now, return original URL
  // In a real app, you'd implement image optimization service integration here
  return originalUrl;
};

/**
 * Preload critical images for better performance
 */
export const preloadImage = (src: string, priority: boolean = false): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    
    if (priority) {
      link.setAttribute('fetchpriority', 'high');
    }

    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    
    document.head.appendChild(link);
  });
};

/**
 * Generate responsive image sizes based on breakpoints
 */
export const getResponsiveSizes = (breakpoints: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
} = {}): string => {
  const {
    mobile = '100vw',
    tablet = '50vw', 
    desktop = '33vw'
  } = breakpoints;

  return `(max-width: 768px) ${mobile}, (max-width: 1200px) ${tablet}, ${desktop}`;
};

/**
 * Image compression recommendations
 */
export const IMAGE_OPTIMIZATION_TIPS = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: {
    high: 90,
    medium: 80,
    low: 70
  },
  formats: {
    photos: ['webp', 'jpg'],
    illustrations: ['webp', 'png'],
    icons: ['svg', 'webp', 'png']
  },
  sizes: {
    thumbnail: { width: 300, height: 200 },
    card: { width: 600, height: 400 },
    hero: { width: 1200, height: 800 },
    fullscreen: { width: 1920, height: 1080 }
  }
};

/**
 * Lazy loading intersection observer for images
 */
export const createImageObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px 0px',
    threshold: 0.01,
    ...options
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(callback);
  }, defaultOptions);
};

/**
 * Blur placeholder data URL generator
 */
export const generateBlurDataUrl = (width: number = 8, height: number = 8): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = width;
  canvas.height = height;
  
  // Create a subtle gradient for blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};