/**
 * Type definitions for the School Notice Translation System
 * Provides comprehensive type safety for notice data structures
 */

import PropTypes from 'prop-types';

/**
 * Notice Data Structure Type Definition
 * Represents the complete structure of a school notice
 */
export const NoticeDataType = PropTypes.shape({
  // Header information
  year: PropTypes.string.isRequired,
  school: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  logoUrl: PropTypes.string,
  
  // Publisher and contact information
  publisher: PropTypes.string.isRequired,
  manager: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  
  // Content information
  introText: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  
  // Attachment information
  attachmentDescription: PropTypes.string,
  attachments: PropTypes.arrayOf(PropTypes.string),
  
  // Footer information
  notice: PropTypes.string,
  additionalInfo: PropTypes.string,
  date: PropTypes.string.isRequired,
  signature: PropTypes.string.isRequired
});

/**
 * Language Configuration Type
 * Represents supported translation languages
 */
export const LanguageType = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});

/**
 * Translation Status Type
 * Represents the status of translation operations
 */
export const TranslationStatusType = PropTypes.oneOf([
  'idle',
  'translating',
  'completed',
  'error'
]);

/**
 * API Status Type
 * Represents the connection status to the translation API
 */
export const ApiStatusType = PropTypes.oneOf([
  'checking',
  'connected',
  'disconnected',
  'error'
]);

/**
 * Status Message Type
 * Represents status messages shown to users
 */
export const StatusMessageType = PropTypes.shape({
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning']).isRequired
});

/**
 * Translation Service Response Type
 * Represents the response from translation API
 */
export const TranslationResponseType = PropTypes.shape({
  success: PropTypes.bool.isRequired,
  translatedText: PropTypes.string,
  translatedTexts: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.string,
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    successful: PropTypes.number.isRequired,
    failed: PropTypes.number.isRequired
  })
});

/**
 * API Health Check Response Type
 */
export const HealthCheckResponseType = PropTypes.shape({
  status: PropTypes.oneOf(['OK', 'ERROR']).isRequired,
  timestamp: PropTypes.string,
  version: PropTypes.string,
  uptime: PropTypes.number
});

/**
 * File Upload Event Type
 * For logo upload handling
 */
export const FileUploadEventType = PropTypes.shape({
  target: PropTypes.shape({
    files: PropTypes.arrayOf(PropTypes.instanceOf(File))
  }).isRequired
});

/**
 * Component Props Types
 */

// NoticeHeader Component Props
export const NoticeHeaderPropsType = {
  data: NoticeDataType.isRequired,
  onChange: PropTypes.func.isRequired,
  editing: PropTypes.bool,
  onLogoUpload: PropTypes.func
};

// NoticeContent Component Props
export const NoticeContentPropsType = {
  data: NoticeDataType.isRequired,
  onChange: PropTypes.func.isRequired,
  editing: PropTypes.bool
};

// NoticeFooter Component Props
export const NoticeFooterPropsType = {
  data: NoticeDataType.isRequired,
  onChange: PropTypes.func.isRequired,
  editing: PropTypes.bool
};

/**
 * Default values for notice data
 */
export const DEFAULT_NOTICE_DATA = {
  year: '2024학년도',
  school: 'OO초등학교',
  title: '1학기 학사 운영 방안 안내',
  publisher: '교장 김나나',
  manager: '교사 김문정',
  address: '경기도 안양시',
  phone: '031)000-0000',
  logoUrl: '',
  introText: '',
  content: '',
  attachmentDescription: '2025학년도 평촌초 영어회화전문강사 지원자000',
  attachments: [
    '기타사항: 방문접수는 하지 않음',
    '제출서류 (※ 첨부파일 참조)'
  ],
  notice: '※ 시험과목 및 배점, 응시원서, 자기소개서 등 자세한 사항은 붙임파일을 참조하시기 바랍니다.',
  additionalInfo: '',
  date: new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '년 ').replace(/\.$/, '일'),
  signature: 'O O 초 등 학 교 장'
};

/**
 * Supported languages configuration
 * Top 10 languages for multicultural students in Korea
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: '영어 (English)' },
  { code: 'zh-CN', name: '중국어 (中文)' },
  { code: 'vi', name: '베트남어 (Tiếng Việt)' },
  { code: 'tl', name: '필리핀어 (Filipino)' },
  { code: 'th', name: '태국어 (ไทย)' },
  { code: 'mn', name: '몽골어 (Монгол)' },
  { code: 'uz', name: '우즈베크어 (Oʻzbek)' },
  { code: 'ru', name: '러시아어 (Русский)' },
  { code: 'ja', name: '일본어 (日本語)' },
  { code: 'km', name: '캄보디아어 (ខ្មែរ)' },
  { code: 'ne', name: '네팔어 (नेपाली)' }
];

/**
 * All supported languages including source language (Korean)
 */
export const ALL_SUPPORTED_LANGUAGES = [
  { code: 'ko', name: '한국어 (Korean)' },
  ...SUPPORTED_LANGUAGES
];

/**
 * Input validation functions
 */
export const validateNoticeData = (data) => {
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Notice data must be an object');
    return errors;
  }
  
  // Required fields validation
  const requiredFields = ['year', 'school', 'title', 'publisher', 'manager', 'address', 'phone', 'introText', 'content', 'date', 'signature'];
  
  requiredFields.forEach(field => {
    if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
      errors.push(`${field} is required and must be a non-empty string`);
    }
  });
  
  // Phone number format validation (basic)
  if (data.phone && !/^[\d().\s-]+$/.test(data.phone)) {
    errors.push('Phone number contains invalid characters');
  }
  
  // Attachments validation
  if (data.attachments && !Array.isArray(data.attachments)) {
    errors.push('Attachments must be an array');
  }
  
  // Logo URL validation (if provided)
  if (data.logoUrl && typeof data.logoUrl !== 'string') {
    errors.push('Logo URL must be a string');
  }
  
  return errors;
};

/**
 * Language code validation
 */
export const validateLanguageCode = (languageCode) => {
  const supportedCodes = ALL_SUPPORTED_LANGUAGES.map(lang => lang.code);
  return supportedCodes.includes(languageCode);
};

/**
 * Input sanitization functions
 */
export const sanitizeTextInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous HTML tags while preserving basic formatting
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * Safe HTML content validation
 */
export const validateHTMLContent = (html) => {
  if (typeof html !== 'string') return false;
  
  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /<iframe/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<embed/i,
    /<object/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(html));
};

/**
 * Error message types for better UX
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  TRANSLATION_ERROR: '번역 중 오류가 발생했습니다.',
  VALIDATION_ERROR: '입력된 데이터가 올바르지 않습니다.',
  UNSUPPORTED_LANGUAGE: '지원하지 않는 언어입니다.',
  FILE_UPLOAD_ERROR: '파일 업로드 중 오류가 발생했습니다.',
  PDF_GENERATION_ERROR: 'PDF 생성 중 오류가 발생했습니다.',
  API_CONNECTION_ERROR: 'API 서버에 연결할 수 없습니다.'
};

export default {
  NoticeDataType,
  LanguageType,
  TranslationStatusType,
  ApiStatusType,
  StatusMessageType,
  TranslationResponseType,
  HealthCheckResponseType,
  NoticeHeaderPropsType,
  NoticeContentPropsType,
  NoticeFooterPropsType,
  DEFAULT_NOTICE_DATA,
  SUPPORTED_LANGUAGES,
  ALL_SUPPORTED_LANGUAGES,
  validateNoticeData,
  validateLanguageCode,
  sanitizeTextInput,
  validateHTMLContent,
  ERROR_MESSAGES
};