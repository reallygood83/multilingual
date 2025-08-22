/**
 * Image optimization utilities for the school notice application
 * Provides client-side image compression and optimization
 */

/**
 * Compresses an image file to reduce size while maintaining quality
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - The compressed image file
 */
export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.8,
      format = 'image/jpeg'
    } = options;

    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid image file'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: format,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          format,
          quality
        );

      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Creates a data URL from an image file with optimization
 * @param {File} file - The image file
 * @param {Object} options - Optimization options
 * @returns {Promise<string>} - The data URL
 */
export const createOptimizedDataURL = async (file, options = {}) => {
  try {
    const compressedFile = await compressImage(file, options);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to create data URL'));
      };
      
      reader.readAsDataURL(compressedFile);
    });
    
  } catch (error) {
    throw new Error(`Image optimization failed: ${error.message}`);
  }
};

/**
 * Validates image file format and size
 * @param {File} file - The image file to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validateImage = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    minWidth: _minWidth = 50,
    maxWidth: _maxWidth = 4000,
    minHeight: _minHeight = 50,
    maxHeight: _maxHeight = 4000
  } = options;

  const result = {
    isValid: true,
    errors: []
  };

  // Check if file exists
  if (!file) {
    result.isValid = false;
    result.errors.push('No file provided');
    return result;
  }

  // Check file size
  if (file.size > maxSize) {
    result.isValid = false;
    result.errors.push(`File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds maximum (${Math.round(maxSize / 1024 / 1024)}MB)`);
  }

  // Check file format
  if (!allowedFormats.includes(file.type)) {
    result.isValid = false;
    result.errors.push(`File format ${file.type} is not supported. Allowed formats: ${allowedFormats.join(', ')}`);
  }

  return result;
};

/**
 * Gets image dimensions without loading the full image
 * @param {File} file - The image file
 * @returns {Promise<Object>} - Object with width and height
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid image file'));
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Creates multiple image sizes for responsive images
 * @param {File} file - The original image file
 * @param {Array} sizes - Array of size configurations
 * @returns {Promise<Object>} - Object with different sized images
 */
export const createResponsiveImages = async (file, sizes = []) => {
  const defaultSizes = [
    { name: 'thumbnail', maxWidth: 150, maxHeight: 150, quality: 0.8 },
    { name: 'small', maxWidth: 400, maxHeight: 400, quality: 0.8 },
    { name: 'medium', maxWidth: 800, maxHeight: 600, quality: 0.8 },
    { name: 'large', maxWidth: 1200, maxHeight: 900, quality: 0.85 }
  ];

  const sizesToUse = sizes.length > 0 ? sizes : defaultSizes;
  const results = {};

  try {
    for (const sizeConfig of sizesToUse) {
      const compressedFile = await compressImage(file, sizeConfig);
      const dataURL = await createOptimizedDataURL(compressedFile);
      
      results[sizeConfig.name] = {
        file: compressedFile,
        dataURL,
        size: compressedFile.size,
        dimensions: await getImageDimensions(compressedFile)
      };
    }

    return results;

  } catch (error) {
    throw new Error(`Failed to create responsive images: ${error.message}`);
  }
};

/**
 * Lazy loading intersection observer for images
 * @param {Array} imageElements - Array of image elements to observe
 * @param {Object} options - IntersectionObserver options
 * @returns {IntersectionObserver} - The observer instance
 */
export const createLazyImageObserver = (imageElements, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const observerOptions = { ...defaultOptions, ...options };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load the actual image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
        }
        
        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, observerOptions);

  // Start observing all provided images
  imageElements.forEach((img) => {
    observer.observe(img);
  });

  return observer;
};

/**
 * Preloads critical images for better performance
 * @param {Array} imageUrls - Array of image URLs to preload
 * @returns {Promise<Array>} - Promise that resolves when all images are loaded
 */
export const preloadImages = (imageUrls) => {
  const promises = imageUrls.map((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
      
      img.src = url;
    });
  });

  return Promise.all(promises);
};

/**
 * Converts image to WebP format if supported
 * @param {File} file - The image file to convert
 * @param {number} quality - WebP quality (0-1)
 * @returns {Promise<File|null>} - WebP file or null if not supported
 */
export const convertToWebP = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // Check WebP support
    const canvas = document.createElement('canvas');
    const canvasSupportsWebP = canvas.toDataURL('image/webp').indexOf('image/webp') === 5;

    if (!canvasSupportsWebP) {
      resolve(null);
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                type: 'image/webp',
                lastModified: Date.now()
              });
              resolve(webpFile);
            } else {
              resolve(null);
            }
          },
          'image/webp',
          quality
        );

      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for WebP conversion'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Gets optimal image format based on browser support
 * @returns {string} - Optimal image format
 */
export const getOptimalImageFormat = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  // Check WebP support
  if (canvas.toDataURL('image/webp').indexOf('image/webp') === 5) {
    return 'image/webp';
  }

  // Check AVIF support (modern browsers)
  if (canvas.toDataURL('image/avif').indexOf('image/avif') === 5) {
    return 'image/avif';
  }

  // Fallback to JPEG
  return 'image/jpeg';
};

export default {
  compressImage,
  createOptimizedDataURL,
  validateImage,
  getImageDimensions,
  createResponsiveImages,
  createLazyImageObserver,
  preloadImages,
  convertToWebP,
  getOptimalImageFormat
};