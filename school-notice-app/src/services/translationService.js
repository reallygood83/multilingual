import axios from 'axios';
import { 
  NetworkError, 
  TranslationError, 
  ValidationError,
  parseNetworkError,
  retryWithBackoff,
  withPerformanceMonitoring
} from '../utils/errorHandler';
import { validateNoticeData, validateLanguageCode } from '../types/noticeTypes';

// Enhanced API configuration with environment-based URL
export const isApiConfigured = Boolean(import.meta.env.VITE_API_URL);
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Enhanced translation service with comprehensive error handling and validation
export const translateText = async (text, targetLanguage, sourceLanguage = 'ko') => {
  return await withPerformanceMonitoring(async () => {
    // Input validation
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return '';
    }
    
    if (!validateLanguageCode(targetLanguage)) {
      throw new ValidationError(`지원하지 않는 언어입니다: ${targetLanguage}`, 'targetLanguage', targetLanguage);
    }
    
    if (sourceLanguage && !validateLanguageCode(sourceLanguage)) {
      throw new ValidationError(`지원하지 않는 원본 언어입니다: ${sourceLanguage}`, 'sourceLanguage', sourceLanguage);
    }

    try {
      const response = await apiClient.post('/translate', {
        text: text.trim(),
        targetLanguage,
        sourceLanguage
      });
      
      if (response.data && response.data.success) {
        return response.data.translatedText || '';
      } else {
        const errorMsg = response.data?.error || '번역 응답이 올바르지 않습니다.';
        throw new TranslationError(errorMsg, targetLanguage);
      }
    } catch (error) {
      // Parse and rethrow network errors
      const networkError = parseNetworkError(error);
      if (networkError instanceof NetworkError) {
        throw networkError;
      }
      
      // Handle other errors
      throw new TranslationError(
        error.message || '번역 중 알 수 없는 오류가 발생했습니다.',
        targetLanguage,
        { originalError: error }
      );
    }
  }, `Text Translation (${targetLanguage})`);
};

// Enhanced batch translation service with comprehensive error handling
export const translateBatch = async (texts, targetLanguage, sourceLanguage = 'ko') => {
  return await withPerformanceMonitoring(async () => {
    // Input validation
    if (!texts || !Array.isArray(texts)) {
      throw new ValidationError('텍스트 배열이 필요합니다.', 'texts', texts);
    }
    
    if (texts.length === 0) {
      return [];
    }
    
    if (!validateLanguageCode(targetLanguage)) {
      throw new ValidationError(`지원하지 않는 언어입니다: ${targetLanguage}`, 'targetLanguage', targetLanguage);
    }
    
    if (sourceLanguage && !validateLanguageCode(sourceLanguage)) {
      throw new ValidationError(`지원하지 않는 원본 언어입니다: ${sourceLanguage}`, 'sourceLanguage', sourceLanguage);
    }
    
    // Validate and filter texts
    const validTexts = texts.filter(text => 
      text && typeof text === 'string' && text.trim() !== ''
    );
    
    if (validTexts.length === 0) {
      return texts.map(() => '');
    }
    
    // Limit batch size to prevent overwhelming the server
    if (validTexts.length > 100) {
      throw new ValidationError('일괄 번역은 최대 100개의 텍스트까지 지원됩니다.', 'texts', validTexts.length);
    }

    try {
      const response = await apiClient.post('/translate-batch', {
        texts: validTexts,
        targetLanguage,
        sourceLanguage
      });
      
      if (response.data && response.data.success) {
        const translatedTexts = response.data.translatedTexts || [];
        const stats = response.data.stats;
        
        if (stats && stats.failed > 0) {
          console.warn(`⚠️ Batch translation completed with ${stats.failed} failures out of ${stats.total} texts`);
        }
        
        return translatedTexts;
      } else {
        const errorMsg = response.data?.error || '일괄 번역 응답이 올바르지 않습니다.';
        throw new TranslationError(errorMsg, targetLanguage, { batchSize: validTexts.length });
      }
    } catch (error) {
      // Parse and rethrow network errors
      const networkError = parseNetworkError(error);
      if (networkError instanceof NetworkError) {
        throw networkError;
      }
      
      // Handle other errors
      throw new TranslationError(
        error.message || '일괄 번역 중 알 수 없는 오류가 발생했습니다.',
        targetLanguage,
        { batchSize: validTexts.length, originalError: error }
      );
    }
  }, `Batch Translation (${targetLanguage}, ${texts.length} texts)`);
};

// Enhanced HTML text extraction with safety checks
export const extractTextFromHTML = (html) => {
  try {
    if (!html || typeof html !== 'string') {
      return '';
    }
    
    // Create a temporary div in memory
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Extract text content and clean up
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up the temporary element
    tempDiv.remove();
    
    return textContent.trim();
  } catch (error) {
    console.error('Error extracting text from HTML:', error);
    return html; // Return original HTML as fallback
  }
};

// Enhanced HTML text replacement with better handling
export const replaceTextInHTML = (html, originalTexts, translatedTexts) => {
  try {
    if (!html || typeof html !== 'string') {
      return html;
    }
    
    if (!Array.isArray(originalTexts) || !Array.isArray(translatedTexts)) {
      return html;
    }
    
    let result = html;
    
    originalTexts.forEach((originalText, index) => {
      if (originalText && 
          typeof originalText === 'string' && 
          originalText.trim() && 
          translatedTexts[index] &&
          typeof translatedTexts[index] === 'string') {
        
        // Escape special regex characters in the original text
        const escapedOriginal = originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Use global replacement with word boundaries where appropriate
        const regex = new RegExp(escapedOriginal, 'g');
        result = result.replace(regex, translatedTexts[index]);
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error replacing text in HTML:', error);
    return html; // Return original HTML as fallback
  }
};

// Enhanced notice data translation with comprehensive validation and error handling
export const translateNoticeData = async (noticeData, targetLanguage) => {
  return await withPerformanceMonitoring(async () => {
    // Comprehensive input validation
    if (!noticeData || typeof noticeData !== 'object') {
      throw new ValidationError('유효하지 않은 공지사항 데이터입니다.', 'noticeData', typeof noticeData);
    }
    
    // Validate notice data structure
    const validationErrors = validateNoticeData(noticeData);
    if (validationErrors.length > 0) {
      throw new ValidationError(
        `공지사항 데이터 유효성 검사 실패: ${validationErrors.join(', ')}`,
        'noticeData',
        validationErrors
      );
    }
    
    if (!validateLanguageCode(targetLanguage)) {
      throw new ValidationError(`지원하지 않는 번역 언어입니다: ${targetLanguage}`, 'targetLanguage', targetLanguage);
    }

    try {
      // Extract all text fields that need translation with safety checks
    const textsToTranslate = [
      noticeData.title || '',
      noticeData.school || '',
      noticeData.publisher || '',
      noticeData.manager || '',
      noticeData.address || '',
      noticeData.introText || '',
      extractTextFromHTML(noticeData.content || ''),
      noticeData.attachmentDescription || '',
      ...(Array.isArray(noticeData.attachments) ? noticeData.attachments : []),
      noticeData.notice || '',
      noticeData.additionalInfo || '',
      noticeData.signature || ''
    ];

    // Filter out empty strings and invalid texts
    const nonEmptyTexts = textsToTranslate.filter(text => 
      text && typeof text === 'string' && text.trim() !== ''
    );
    
    const nonEmptyIndexes = [];
    textsToTranslate.forEach((text, index) => {
      if (text && typeof text === 'string' && text.trim() !== '') {
        nonEmptyIndexes.push(index);
      }
    });
    
    if (nonEmptyTexts.length === 0) {
      // No texts to translate, return original data
      return { ...noticeData };
    }

    // Translate all texts with progress logging
    console.log(`🔄 Translating ${nonEmptyTexts.length} text segments to ${targetLanguage}...`);
    const translatedTexts = await translateBatch(nonEmptyTexts, targetLanguage);

    // Map back translated texts
    const fullTranslatedTexts = new Array(textsToTranslate.length).fill('');
    nonEmptyIndexes.forEach((originalIndex, translatedIndex) => {
      fullTranslatedTexts[originalIndex] = translatedTexts[translatedIndex] || textsToTranslate[originalIndex];
    });

    // Create translated notice data with enhanced error handling
    const attachmentsLength = Array.isArray(noticeData.attachments) ? noticeData.attachments.length : 0;
    
    const translatedNoticeData = {
      ...noticeData,
      title: fullTranslatedTexts[0] || noticeData.title,
      school: fullTranslatedTexts[1] || noticeData.school,
      publisher: fullTranslatedTexts[2] || noticeData.publisher,
      manager: fullTranslatedTexts[3] || noticeData.manager,
      address: fullTranslatedTexts[4] || noticeData.address,
      introText: fullTranslatedTexts[5] || noticeData.introText,
      content: replaceTextInHTML(
        noticeData.content || '',
        [extractTextFromHTML(noticeData.content || '')],
        [fullTranslatedTexts[6]]
      ),
      attachmentDescription: fullTranslatedTexts[7] || noticeData.attachmentDescription,
      attachments: Array.isArray(noticeData.attachments) 
        ? noticeData.attachments.map((_, index) => 
            fullTranslatedTexts[8 + index] || noticeData.attachments[index]
          )
        : [],
      notice: fullTranslatedTexts[8 + attachmentsLength] || noticeData.notice,
      additionalInfo: fullTranslatedTexts[9 + attachmentsLength] || noticeData.additionalInfo,
      signature: fullTranslatedTexts[10 + attachmentsLength] || noticeData.signature
    };
    
    console.log(`✅ Translation completed for ${targetLanguage}`);

    return translatedNoticeData;
    } catch (error) {
      console.error('Notice translation error:', error);
      
      // Enhanced error handling with proper error types
      if (error instanceof NetworkError || error instanceof ValidationError || error instanceof TranslationError) {
        throw error;
      }
      
      // Parse network errors
      const networkError = parseNetworkError(error);
      if (networkError instanceof NetworkError) {
        throw networkError;
      }
      
      // Handle other errors as translation errors
      throw new TranslationError(
        error.message || '공지사항 번역 중 오류가 발생했습니다.',
        targetLanguage,
        { noticeDataKeys: Object.keys(noticeData), originalError: error }
      );
    }
  }, `Notice Data Translation (${targetLanguage})`);
};

// Enhanced health check with retry logic and proper error handling
export const checkAPIHealth = async (retries = 3) => {
  return await withPerformanceMonitoring(async () => {
    return await retryWithBackoff(async () => {
      try {
        const response = await apiClient.get('/health');
        
        if (response.data && response.data.status === 'OK') {
          console.log('✅ API health check successful:', response.data);
          return response.data;
        } else {
          console.warn('⚠️ API health check returned unexpected response:', response.data);
          throw new NetworkError('API 상태 확인 실패: 예상치 못한 응답', response.status);
        }
      } catch (error) {
        // Parse network errors
        const networkError = parseNetworkError(error);
        throw networkError;
      }
    }, retries, 1000);
  }, 'API Health Check');
};

export default {
  translateText,
  translateBatch,
  translateNoticeData,
  extractTextFromHTML,
  replaceTextInHTML,
  checkAPIHealth,
  isApiConfigured
};