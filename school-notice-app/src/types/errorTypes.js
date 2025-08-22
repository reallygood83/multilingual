/**
 * Custom error classes for the multilingual school notice application
 * Provides structured error handling across the application
 */

/**
 * Base application error class
 * Used for general application errors
 */
export class AppError extends Error {
  constructor(message, code = 'APP_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Network-related error class
 * Used for API calls, network timeouts, connection failures, etc.
 */
export class NetworkError extends Error {
  constructor(message, statusCode = null, response = null) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    this.response = response;
    this.timestamp = new Date().toISOString();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }

  get isNetworkError() {
    return true;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      response: this.response,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Validation error class
 * Used for input validation, data format errors, etc.
 */
export class ValidationError extends Error {
  constructor(message, field = null, value = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.timestamp = new Date().toISOString();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }

  get isValidationError() {
    return true;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      field: this.field,
      value: this.value,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Translation service error class
 * Used for translation API failures, language detection errors, etc.
 */
export class TranslationError extends Error {
  constructor(message, language = null, originalText = null) {
    super(message);
    this.name = 'TranslationError';
    this.language = language;
    this.originalText = originalText;
    this.timestamp = new Date().toISOString();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TranslationError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      language: this.language,
      originalText: this.originalText,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * PDF generation error class
 * Used for PDF creation, template processing errors, etc.
 */
export class PDFError extends Error {
  constructor(message, operation = null, details = null) {
    super(message);
    this.name = 'PDFError';
    this.operation = operation;
    this.details = details;
    this.timestamp = new Date().toISOString();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PDFError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      operation: this.operation,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Gemini API specific error class
 * Used for Google Gemini AI API errors
 */
export class GeminiAPIError extends NetworkError {
  constructor(message, statusCode = null, apiResponse = null, quota = null) {
    super(message, statusCode, apiResponse);
    this.name = 'GeminiAPIError';
    this.quota = quota;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GeminiAPIError);
    }
  }

  get isGeminiError() {
    return true;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      name: this.name,
      quota: this.quota
    };
  }
}

/**
 * Error factory function for creating appropriate error types
 * @param {string} type - Error type ('app', 'network', 'validation', 'translation', 'pdf', 'gemini')
 * @param {string} message - Error message
 * @param {Object} options - Additional error options
 * @returns {Error} Appropriate error instance
 */
export const createError = (type, message, options = {}) => {
  switch (type.toLowerCase()) {
    case 'network':
      return new NetworkError(message, options.statusCode, options.response);
    
    case 'validation':
      return new ValidationError(message, options.field, options.value);
    
    case 'translation':
      return new TranslationError(message, options.language, options.originalText);
    
    case 'pdf':
      return new PDFError(message, options.operation, options.details);
    
    case 'gemini':
      return new GeminiAPIError(message, options.statusCode, options.response, options.quota);
    
    case 'app':
    default:
      return new AppError(message, options.code, options.details);
  }
};

/**
 * Error handler utility for logging and processing errors
 * @param {Error} error - Error to handle
 * @param {Object} context - Additional context information
 */
export const handleError = (error, context = {}) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error.toJSON ? error.toJSON() : {})
    }
  };

  // Log error with appropriate level based on error type
  if (error instanceof ValidationError) {
    console.warn('Validation Error:', errorInfo);
  } else if (error instanceof NetworkError) {
    console.error('Network Error:', errorInfo);
  } else if (error instanceof GeminiAPIError) {
    console.error('Gemini API Error:', errorInfo);
  } else {
    console.error('Application Error:', errorInfo);
  }

  return errorInfo;
};

/**
 * Error boundary helper for React components
 * @param {Error} error - Error from error boundary
 * @param {Object} errorInfo - Error info from React
 */
export const logComponentError = (error, errorInfo) => {
  handleError(error, {
    component: errorInfo.componentStack,
    type: 'react_error_boundary'
  });
};

export default {
  AppError,
  NetworkError,
  ValidationError,
  TranslationError,
  PDFError,
  GeminiAPIError,
  createError,
  handleError,
  logComponentError
};