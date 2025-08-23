import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Educational Toast Notification System
 * Features: Educational color schemes, progress tracking, accessible announcements
 */

// Toast animations
const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const progressAnimation = keyframes`
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
`;

// Toast Container - Fixed positioning
const ToastContainer = styled.div`
  position: fixed;
  top: var(--edu-space-6);
  right: var(--edu-space-6);
  z-index: var(--edu-z-toast);
  
  display: flex;
  flex-direction: column;
  gap: var(--edu-space-3);
  max-width: 400px;
  width: 100%;
  
  pointer-events: none; /* Allow clicks through container */
  
  /* Mobile adjustments */
  @media (max-width: 768px) {
    top: var(--edu-space-4);
    right: var(--edu-space-4);
    left: var(--edu-space-4);
    max-width: none;
  }
`;

// Individual Toast
const Toast = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--edu-space-3);
  
  padding: var(--edu-space-4);
  border-radius: var(--edu-radius-xl);
  box-shadow: var(--edu-shadow-xl);
  backdrop-filter: blur(var(--edu-blur-sm));
  
  pointer-events: auto; /* Re-enable clicks on toast */
  
  /* Animation */
  animation: ${props => props.$isExiting ? slideOutRight : slideInRight} 0.3s var(--edu-ease-out);
  
  /* Type-based styling */
  ${props => {
    switch (props.$type) {
      case 'success':
        return `
          background: linear-gradient(135deg, var(--edu-success-50) 0%, var(--edu-success-100) 100%);
          border: 1px solid var(--edu-success-200);
          color: var(--edu-success-800);
        `;
      case 'error':
        return `
          background: linear-gradient(135deg, var(--edu-error-50) 0%, var(--edu-error-100) 100%);
          border: 1px solid var(--edu-error-200);
          color: var(--edu-error-800);
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, var(--edu-warning-50) 0%, var(--edu-warning-100) 100%);
          border: 1px solid var(--edu-warning-200);
          color: var(--edu-warning-800);
        `;
      case 'info':
        return `
          background: linear-gradient(135deg, var(--edu-primary-50) 0%, var(--edu-primary-100) 100%);
          border: 1px solid var(--edu-primary-200);
          color: var(--edu-primary-800);
        `;
      case 'progress':
        return `
          background: linear-gradient(135deg, var(--edu-secondary-50) 0%, var(--edu-secondary-100) 100%);
          border: 1px solid var(--edu-secondary-200);
          color: var(--edu-secondary-800);
        `;
      default:
        return `
          background: linear-gradient(135deg, var(--edu-surface-primary) 0%, var(--edu-surface-secondary) 100%);
          border: 1px solid var(--edu-neutral-200);
          color: var(--edu-text-primary);
        `;
    }
  }}
  
  /* Educational importance styling */
  ${props => props.$importance === 'high' && `
    box-shadow: var(--edu-shadow-xl), 0 0 0 2px var(--edu-warning-300);
  `}
  
  ${props => props.$importance === 'urgent' && `
    box-shadow: var(--edu-shadow-xl), 0 0 0 2px var(--edu-error-400);
    animation: ${slideInRight} 0.3s var(--edu-ease-out), pulse 1.5s infinite 0.3s;
  `}
`;

// Toast Icon
const ToastIcon = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-size: var(--edu-font-size-lg);
  font-weight: var(--edu-font-weight-bold);
  
  ${props => {
    switch (props.$type) {
      case 'success':
        return `
          background: var(--edu-success-500);
          color: var(--edu-text-on-primary);
          border-radius: 50%;
        `;
      case 'error':
        return `
          background: var(--edu-error-500);
          color: var(--edu-text-on-primary);
          border-radius: 50%;
        `;
      case 'warning':
        return `
          background: var(--edu-warning-500);
          color: var(--edu-text-primary);
          border-radius: 50%;
        `;
      case 'info':
        return `
          background: var(--edu-primary-500);
          color: var(--edu-text-on-primary);
          border-radius: 50%;
        `;
      case 'progress':
        return `
          background: var(--edu-secondary-500);
          color: var(--edu-text-on-primary);
          border-radius: 50%;
        `;
      default:
        return `
          color: var(--edu-text-secondary);
        `;
    }
  }}
`;

// Toast Content
const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ToastTitle = styled.div`
  font-size: var(--edu-font-size-sm);
  font-weight: var(--edu-font-weight-semibold);
  line-height: var(--edu-leading-tight);
  margin-bottom: var(--edu-space-1);
`;

const ToastMessage = styled.div`
  font-size: var(--edu-font-size-sm);
  line-height: var(--edu-leading-normal);
  opacity: 0.9;
`;

// Progress Bar for timed toasts
const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  border-radius: 0 0 var(--edu-radius-xl) var(--edu-radius-xl);
  
  transform-origin: left;
  animation: ${progressAnimation} ${props => props.$duration}ms linear;
`;

// Close Button
const CloseButton = styled.button`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: currentColor;
  opacity: 0.6;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  border-radius: var(--edu-radius-sm);
  cursor: pointer;
  transition: var(--edu-transition-fast);
  
  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.1);
  }
  
  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

// Action Button for interactive toasts
const ActionButton = styled.button`
  margin-top: var(--edu-space-2);
  padding: var(--edu-space-1) var(--edu-space-3);
  border: 1px solid currentColor;
  border-radius: var(--edu-radius-md);
  background: transparent;
  color: currentColor;
  
  font-size: var(--edu-font-size-xs);
  font-weight: var(--edu-font-weight-medium);
  
  cursor: pointer;
  transition: var(--edu-transition-fast);
  
  &:hover {
    background: currentColor;
    color: var(--edu-surface-primary);
  }
  
  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

// Toast icons mapping
const getToastIcon = (type) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'i',
    progress: '⟳',
    default: '●'
  };
  return icons[type] || icons.default;
};

// Toast Context
const ToastContext = createContext();

// Toast Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Single Toast Component
const ToastItem = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onClose(toast.id), 300);
  }, [toast.id, onClose]);

  // Auto-close timer
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(handleClose, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleClose]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  return (
    <Toast
      $type={toast.type}
      $importance={toast.importance}
      $isExiting={isExiting}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      <ToastIcon $type={toast.type}>
        {toast.icon || getToastIcon(toast.type)}
      </ToastIcon>
      
      <ToastContent>
        {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
        <ToastMessage>{toast.message}</ToastMessage>
        
        {toast.action && (
          <ActionButton onClick={toast.action.onClick}>
            {toast.action.label}
          </ActionButton>
        )}
      </ToastContent>
      
      {toast.closable !== false && (
        <CloseButton
          onClick={handleClose}
          aria-label="알림 닫기"
          title="알림 닫기"
        >
          ✕
        </CloseButton>
      )}
      
      {toast.duration && toast.duration > 0 && (
        <ProgressBar $duration={toast.duration} />
      )}
    </Toast>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      closable: true,
      ...toast
    };

    setToasts(currentToasts => {
      const updatedToasts = [newToast, ...currentToasts];
      // Limit the number of toasts
      return updatedToasts.slice(0, maxToasts);
    });

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id) => {
    setToasts(currentToasts => 
      currentToasts.filter(toast => toast.id !== id)
    );
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Educational toast presets
  const showSuccess = useCallback((message, options = {}) => {
    return addToast({
      type: 'success',
      title: '성공',
      message,
      ...options
    });
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast({
      type: 'error',
      title: '오류',
      message,
      duration: 8000, // Longer duration for errors
      ...options
    });
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    return addToast({
      type: 'warning',
      title: '주의',
      message,
      importance: 'high',
      ...options
    });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast({
      type: 'info',
      title: '정보',
      message,
      ...options
    });
  }, [addToast]);

  const showProgress = useCallback((message, options = {}) => {
    return addToast({
      type: 'progress',
      title: '진행 중',
      message,
      duration: 0, // No auto-close for progress
      closable: false,
      ...options
    });
  }, [addToast]);

  const updateToast = useCallback((id, updates) => {
    setToasts(currentToasts =>
      currentToasts.map(toast =>
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showProgress,
    updateToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export default ToastProvider;