/**
 * Enhanced Error Handling Utilities
 * Provides comprehensive error handling and logging for the application
 */

import React from 'react';
import { ERROR_MESSAGES } from '../types/noticeTypes';

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Error categories for better organization
 */
export const ERROR_CATEGORIES = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  TRANSLATION: 'translation',
  FILE_OPERATION: 'file_operation',
  API: 'api',
  USER_INPUT: 'user_input',
  SYSTEM: 'system'
};

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message, category = ERROR_CATEGORIES.SYSTEM, severity = ERROR_SEVERITY.MEDIUM, details = null) {
    super(message);
    this.name = 'AppError';
    this.category = category;
    this.severity = severity;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Network-specific error class
 */
export class NetworkError extends AppError {
  constructor(message, statusCode = null, details = null) {
    super(message, ERROR_CATEGORIES.NETWORK, ERROR_SEVERITY.HIGH, details);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

/**
 * Translation-specific error class
 */
export class TranslationError extends AppError {
  constructor(message, languageCode = null, details = null) {
    super(message, ERROR_CATEGORIES.TRANSLATION, ERROR_SEVERITY.MEDIUM, details);
    this.name = 'TranslationError';
    this.languageCode = languageCode;
  }
}

/**
 * Validation error class
 */
export class ValidationError extends AppError {
  constructor(message, field = null, value = null) {
    super(message, ERROR_CATEGORIES.VALIDATION, ERROR_SEVERITY.LOW, { field, value });
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

/**
 * Enhanced error handler that categorizes and processes different types of errors
 */
export const handleError = (error, context = 'Unknown') => {
  // Log error details
  console.group(`🚨 Error in ${context}`);
  console.error('Error:', error);
  console.error('Stack:', error.stack);
  console.error('Timestamp:', new Date().toISOString());
  console.groupEnd();

  // Return user-friendly error message and details
  let userMessage = ERROR_MESSAGES.SERVER_ERROR;
  let severity = ERROR_SEVERITY.MEDIUM;
  let category = ERROR_CATEGORIES.SYSTEM;

  if (error instanceof NetworkError) {
    userMessage = ERROR_MESSAGES.NETWORK_ERROR;
    severity = error.severity;
    category = error.category;
  } else if (error instanceof TranslationError) {
    userMessage = ERROR_MESSAGES.TRANSLATION_ERROR;
    severity = error.severity;
    category = error.category;
  } else if (error instanceof ValidationError) {
    userMessage = ERROR_MESSAGES.VALIDATION_ERROR;
    severity = error.severity;
    category = error.category;
  } else if (error instanceof AppError) {
    userMessage = error.message;
    severity = error.severity;
    category = error.category;
  } else {
    // Handle native JavaScript errors
    if (error.name === 'TypeError') {
      userMessage = '데이터 형식 오류가 발생했습니다.';
      category = ERROR_CATEGORIES.VALIDATION;
    } else if (error.name === 'ReferenceError') {
      userMessage = '시스템 참조 오류가 발생했습니다.';
      category = ERROR_CATEGORIES.SYSTEM;
      severity = ERROR_SEVERITY.HIGH;
    } else if (error.message && error.message.includes('fetch')) {
      userMessage = ERROR_MESSAGES.NETWORK_ERROR;
      category = ERROR_CATEGORIES.NETWORK;
      severity = ERROR_SEVERITY.HIGH;
    }
  }

  return {
    userMessage,
    severity,
    category,
    originalError: error,
    timestamp: new Date().toISOString(),
    context
  };
};

/**
 * Error boundary helper for React components
 */
export const createErrorBoundary = (ComponentName) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error) {
      const errorDetails = handleError(error, `${ComponentName} Component`);
      console.error('React Error Boundary caught an error:', errorDetails);
    }

    render() {
      if (this.state.hasError) {
        return React.createElement('div', {
          style: { 
            padding: '20px', 
            border: '1px solid #ff6b6b', 
            borderRadius: '4px',
            backgroundColor: '#ffe0e0',
            color: '#c92a2a',
            margin: '10px 0'
          }
        }, [
          React.createElement('h3', { key: 'title' }, '🚨 컴포넌트 오류가 발생했습니다'),
          React.createElement('p', { key: 'message' }, '문제가 지속되면 페이지를 새로고침해주세요.'),
          React.createElement('details', { key: 'details', style: { marginTop: '10px' } }, [
            React.createElement('summary', { key: 'summary' }, '오류 상세 정보'),
            React.createElement('pre', { 
              key: 'error', 
              style: { fontSize: '12px', marginTop: '5px' } 
            }, this.state.error && this.state.error.toString())
          ])
        ]);
      }

      return this.props.children;
    }
  };
};

/**
 * Async operation wrapper with error handling
 */
export const withErrorHandling = async (operation, context = 'Async Operation') => {
  try {
    return await operation();
  } catch (error) {
    const errorDetails = handleError(error, context);
    throw new AppError(
      errorDetails.userMessage,
      errorDetails.category,
      errorDetails.severity,
      errorDetails
    );
  }
};

/**
 * Input validation with error handling
 */
export const validateWithError = (value, validationFn, fieldName, errorMessage) => {
  try {
    const isValid = validationFn(value);
    if (!isValid) {
      throw new ValidationError(errorMessage || `${fieldName} validation failed`, fieldName, value);
    }
    return true;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(`Validation error in ${fieldName}`, fieldName, value);
  }
};

/**
 * Network request error parser
 */
export const parseNetworkError = (error) => {
  if (!error) {
    return new NetworkError(ERROR_MESSAGES.NETWORK_ERROR);
  }

  if (error.response) {
    // Server responded with error status
    const statusCode = error.response.status;
    const serverMessage = error.response.data?.error || error.response.statusText;
    
    let message = ERROR_MESSAGES.SERVER_ERROR;
    
    switch (statusCode) {
      case 400:
        message = '잘못된 요청입니다. 입력을 확인해주세요.';
        break;
      case 401:
        message = '인증이 필요합니다.';
        break;
      case 403:
        message = '접근 권한이 없습니다.';
        break;
      case 404:
        message = '요청한 리소스를 찾을 수 없습니다.';
        break;
      case 429:
        message = '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
        break;
      case 500:
        message = '서버 내부 오류가 발생했습니다.';
        break;
      case 502:
      case 503:
      case 504:
        message = '서버가 일시적으로 사용할 수 없습니다.';
        break;
      default:
        message = serverMessage || ERROR_MESSAGES.SERVER_ERROR;
    }
    
    return new NetworkError(message, statusCode, {
      originalMessage: serverMessage,
      statusText: error.response.statusText
    });
  } else if (error.request) {
    // Request was made but no response received
    return new NetworkError(ERROR_MESSAGES.NETWORK_ERROR, null, {
      requestDetails: 'No response received'
    });
  } else {
    // Something else happened
    return new AppError(error.message || ERROR_MESSAGES.SERVER_ERROR, ERROR_CATEGORIES.SYSTEM);
  }
};

/**
 * Retry logic with exponential backoff
 */
export const retryWithBackoff = async (operation, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`Operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Performance monitoring wrapper
 */
export const withPerformanceMonitoring = async (operation, operationName = 'Operation') => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`⚡ ${operationName} completed in ${duration.toFixed(2)}ms`);
    
    // Log slow operations
    if (duration > 3000) {
      console.warn(`🐌 Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.error(`💥 ${operationName} failed after ${duration.toFixed(2)}ms`);
    throw error;
  }
};

export default {
  AppError,
  NetworkError,
  TranslationError,
  ValidationError,
  handleError,
  createErrorBoundary,
  withErrorHandling,
  validateWithError,
  parseNetworkError,
  retryWithBackoff,
  withPerformanceMonitoring,
  ERROR_SEVERITY,
  ERROR_CATEGORIES
};