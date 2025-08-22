import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook for monitoring component performance and rendering metrics
 */
export const usePerformanceMonitor = (componentName) => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  const mountTimeRef = useRef(0);

  useEffect(() => {
    mountTimeRef.current = performance.now();
    console.log(`🚀 ${componentName} mounted`);

    return () => {
      const totalTime = performance.now() - mountTimeRef.current;
      console.log(`🔥 ${componentName} unmounted after ${totalTime.toFixed(2)}ms (${renderCountRef.current} renders)`);
    };
  }, [componentName]);

  useEffect(() => {
    renderCountRef.current += 1;
    const now = performance.now();
    
    if (lastRenderTimeRef.current > 0) {
      const timeSinceLastRender = now - lastRenderTimeRef.current;
      console.log(`🔄 ${componentName} rendered (${renderCountRef.current}) - ${timeSinceLastRender.toFixed(2)}ms since last render`);
    }
    
    lastRenderTimeRef.current = now;
  });

  const measureOperation = useCallback((operationName, operation) => {
    return async (...args) => {
      const start = performance.now();
      try {
        const result = await operation(...args);
        const duration = performance.now() - start;
        console.log(`⚡ ${componentName} - ${operationName}: ${duration.toFixed(2)}ms`);
        
        // Warn about slow operations
        if (duration > 1000) {
          console.warn(`🐌 Slow operation in ${componentName}: ${operationName} took ${duration.toFixed(2)}ms`);
        }
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        console.error(`💥 ${componentName} - ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
        throw error;
      }
    };
  }, [componentName]);

  return {
    renderCount: renderCountRef.current,
    measureOperation
  };
};

/**
 * Hook for debouncing values to prevent excessive re-renders
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for throttling function calls
 */
export const useThrottle = (callback, delay = 300) => {
  const lastCall = useRef(0);
  
  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      return callback(...args);
    }
  }, [callback, delay]);
};

/**
 * Hook for measuring component mount and unmount times
 */
export const useLifecycleLogger = (componentName) => {
  const mountTime = useRef(0);

  useEffect(() => {
    mountTime.current = performance.now();
    console.log(`📦 ${componentName} mounting...`);

    return () => {
      const lifetime = performance.now() - mountTime.current;
      console.log(`📦 ${componentName} unmounting after ${lifetime.toFixed(2)}ms`);
    };
  }, [componentName]);
};

export default usePerformanceMonitor;