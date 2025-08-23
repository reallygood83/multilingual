/**
 * Gemini AI API service for OCR and template analysis
 * Provides integration with Google's Gemini AI for document processing
 */

import { AppError, NetworkError, ValidationError } from '../types/errorTypes';

// Gemini API configuration
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-1.5-flash';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

/**
 * Validates Gemini API key format
 * @param {string} apiKey - The API key to validate
 * @returns {boolean} - True if valid format
 */
export const validateApiKey = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  // Gemini API keys typically start with "AIza" and are 39 characters long
  const apiKeyPattern = /^AIza[A-Za-z0-9_-]{35}$/;
  return apiKeyPattern.test(apiKey);
};

/**
 * Tests connection to Gemini API
 * @param {string} apiKey - The API key to test
 * @returns {Promise<Object>} - Connection test result
 */
export const testGeminiConnection = async (apiKey) => {
  if (!validateApiKey(apiKey)) {
    throw new ValidationError('Invalid API key format');
  }

  try {
    const response = await fetch(`${GEMINI_API_BASE_URL}/models?key=${apiKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new NetworkError('API key is invalid or access is denied');
      }
      if (response.status === 429) {
        throw new NetworkError('API quota exceeded');
      }
      throw new NetworkError(`API connection failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      status: 'connected',
      models: data.models || [],
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    if (error instanceof NetworkError) {
      throw error;
    }
    
    console.error('Gemini API connection test failed:', error);
    throw new NetworkError(`Connection test failed: ${error.message}`);
  }
};

/**
 * Converts file to base64 for Gemini API
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 encoded file data
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remove data:mime;base64, prefix
      resolve(base64);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes PDF document using Gemini OCR
 * @param {File} pdfFile - The PDF file to analyze
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<Object>} - Extracted text and structure information
 */
export const analyzePDFTemplate = async (pdfFile, apiKey) => {
  if (!pdfFile) {
    throw new ValidationError('No PDF file provided');
  }

  if (!validateApiKey(apiKey)) {
    throw new ValidationError('Invalid API key');
  }

  if (pdfFile.size > MAX_FILE_SIZE) {
    throw new ValidationError(`File size exceeds limit (${MAX_FILE_SIZE / 1024 / 1024}MB)`);
  }

  if (!SUPPORTED_MIME_TYPES.includes(pdfFile.type)) {
    throw new ValidationError('Unsupported file type. Only PDF, JPEG, and PNG are supported');
  }

  try {
    console.log('Converting PDF to base64...');
    const base64Data = await fileToBase64(pdfFile);

    const prompt = `
다음은 한국 학교의 가정통신문 템플릿 PDF입니다. 이 문서를 분석하여 다음 정보를 JSON 형식으로 추출해주세요:

{
  "documentType": "가정통신문 또는 공문서 유형",
  "structure": {
    "hasHeader": true/false,
    "hasFooter": true/false,
    "hasLogo": true/false,
    "layoutType": "single-column/multi-column/mixed"
  },
  "extractedFields": {
    "school": "학교명",
    "year": "학년도",
    "title": "문서 제목",
    "publisher": "발행인",
    "manager": "담당자",
    "address": "주소",
    "phone": "전화번호",
    "date": "작성일"
  },
  "content": "전체 텍스트 내용",
  "formatting": {
    "fontSizes": ["제목", "본문", "기타 크기들"],
    "colors": ["사용된 색상들"],
    "alignment": ["좌측정렬", "중앙정렬", "우측정렬"]
  },
  "recommendations": [
    "이 템플릿을 재현하기 위한 권장사항들"
  ]
}

정확하고 완전한 JSON 형식으로만 응답해주세요.`;

    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: pdfFile.type,
              data: base64Data
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      }
    };

    console.log('Sending request to Gemini API...');
    const response = await fetch(`${GEMINI_API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new NetworkError('API access denied. Check your API key');
      }
      if (response.status === 429) {
        throw new NetworkError('API quota exceeded. Please try again later');
      }
      throw new NetworkError(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new AppError('No response from Gemini API');
    }

    const candidate = data.candidates[0];
    if (candidate.finishReason === 'SAFETY') {
      throw new AppError('Content was blocked by safety filters');
    }

    const responseText = candidate.content.parts[0].text;
    
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : responseText;
      
      const analysisResult = JSON.parse(jsonText);
      
      return {
        success: true,
        analysis: analysisResult,
        timestamp: new Date().toISOString(),
        fileName: pdfFile.name,
        fileSize: pdfFile.size
      };

    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseText, parseError);
      throw new AppError('Failed to parse analysis result');
    }

  } catch (error) {
    if (error instanceof ValidationError || error instanceof NetworkError || error instanceof AppError) {
      throw error;
    }
    
    console.error('PDF analysis failed:', error);
    throw new AppError(`PDF analysis failed: ${error.message}`);
  }
};

/**
 * Generates notice content based on template analysis
 * @param {Object} templateAnalysis - Result from analyzePDFTemplate
 * @param {Object} contentData - User content data
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<Object>} - Generated notice content
 */
export const generateNoticeFromTemplate = async (templateAnalysis, contentData, apiKey) => {
  if (!templateAnalysis || !contentData) {
    throw new ValidationError('Template analysis and content data are required');
  }

  if (!validateApiKey(apiKey)) {
    throw new ValidationError('Invalid API key');
  }

  try {
    const prompt = `
다음은 학교 가정통신문 템플릿 분석 결과입니다:
${JSON.stringify(templateAnalysis, null, 2)}

이 템플릿 형식에 맞춰서 다음 내용으로 새로운 가정통신문을 생성해주세요:
${JSON.stringify(contentData, null, 2)}

요구사항:
1. 원본 템플릿의 구조와 형식을 정확히 따를 것
2. 모든 필수 필드를 포함할 것
3. 한국어로 자연스럽게 작성할 것
4. HTML 형식으로 출력하되 스타일은 인라인으로 포함할 것

JSON 형식으로 응답해주세요:
{
  "html": "완성된 HTML 내용",
  "fields": {
    "school": "적용된 학교명",
    "title": "적용된 제목",
    // 기타 필드들
  },
  "styling": {
    "css": "필요한 CSS 스타일",
    "layout": "적용된 레이아웃 정보"
  }
}`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    const response = await fetch(`${GEMINI_API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new NetworkError(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : responseText;
      const result = JSON.parse(jsonText);
      
      return {
        success: true,
        generated: result,
        timestamp: new Date().toISOString()
      };

    } catch (parseError) {
      console.error('Failed to parse generation result:', responseText, parseError);
      throw new AppError('Failed to parse generated content');
    }

  } catch (error) {
    if (error instanceof ValidationError || error instanceof NetworkError || error instanceof AppError) {
      throw error;
    }
    
    console.error('Content generation failed:', error);
    throw new AppError(`Content generation failed: ${error.message}`);
  }
};

/**
 * Translates content using Gemini API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<string>} - Translated text
 */
export const translateWithGemini = async (text, targetLanguage, apiKey) => {
  if (!text || !targetLanguage) {
    throw new ValidationError('Text and target language are required');
  }

  if (!validateApiKey(apiKey)) {
    throw new ValidationError('Invalid API key');
  }

  try {
    const languageNames = {
      'en': 'English',
      'ja': 'Japanese',
      'zh': 'Chinese (Simplified)',
      'zh-TW': 'Chinese (Traditional)',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'ru': 'Russian',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'pt': 'Portuguese',
      'vi': 'Vietnamese',
      'th': 'Thai',
      'tl': 'Filipino',
      'mn': 'Mongolian',
      'my': 'Burmese (Myanmar)',
      'km': 'Khmer (Cambodian)',
      'lo': 'Lao',
      'uz': 'Uzbek',
      'kk': 'Kazakh',
      'ky': 'Kyrgyz',
      'ne': 'Nepali',
      'bn': 'Bengali',
      'ur': 'Urdu',
      'fa': 'Persian (Farsi)',
      'tr': 'Turkish',
      'id': 'Indonesian',
      'ms': 'Malay',
      'sw': 'Swahili',
      'am': 'Amharic',
      'te': 'Telugu',
      'ta': 'Tamil',
      'ml': 'Malayalam',
      'kn': 'Kannada',
      'gu': 'Gujarati',
      'or': 'Odia',
      'pa': 'Punjabi',
      'as': 'Assamese',
      'si': 'Sinhala'
    };

    const targetLanguageName = languageNames[targetLanguage] || targetLanguage;
    
    const prompt = `Translate the following Korean text/HTML to ${targetLanguageName}.

CRITICAL REQUIREMENTS:
1. PRESERVE EXACT FORMATTING: Keep all HTML tags, attributes (class, style, href, etc.), line breaks, spacing, and structure identical to the original
2. TRANSLATE TEXT ONLY: Only translate the actual text content, never modify HTML structure or formatting elements
3. MAINTAIN FORMALITY: Use formal, respectful tone appropriate for official school communications
4. PRESERVE DATES/NUMBERS: Keep all dates, numbers, email addresses, and URLs in their original format
5. NO ADDITIONS: Do not add explanations, code blocks (\`\`\`), or any extra text
6. DIRECT OUTPUT: Return only the translated content without any wrapping or commentary

If the target language is not supported or you cannot translate to ${targetLanguageName}, simply return the original Korean text unchanged.

Original content:
${text}

Translated ${targetLanguageName} content:`;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(`${GEMINI_API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new NetworkError(`Translation failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.candidates?.length || !data.candidates[0]?.content?.parts?.length) {
      throw new AppError('No translation result from Gemini');
    }

    const candidate = data.candidates[0];
    if (candidate.finishReason === 'SAFETY') {
      throw new AppError('Translation blocked by safety filters');
    }

    let translatedText = candidate.content.parts.map(p => p.text || '').join('').trim();
    
    // Strip possible fenced code blocks like ```html ... ``` or ```
    translatedText = translatedText.replace(/^```(?:html?)?\s*/i, '').replace(/```$/,'').trim();
    
    // Remove any additional wrapping or explanations
    translatedText = translatedText.replace(/^.*?:/,'').trim(); // Remove "Translated [language] content:" prefix if present
    
    if (!translatedText) {
      console.warn(`Empty translation result for language: ${targetLanguage}, returning original text`);
      return text; // Return original text if translation fails
    }

    // Fallback: If the translation is identical to input (meaning it failed), try once more with simpler prompt
    if (translatedText === text && targetLanguage !== 'ko') {
      console.warn(`Translation appears unchanged for ${targetLanguage}, attempting fallback`);
      try {
        const fallbackPrompt = `Please translate this Korean text to ${targetLanguageName}. Maintain the same formatting and HTML structure:\n\n${text}`;
        const fallbackResponse = await fetch(`${GEMINI_API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fallbackPrompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
          })
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackResult = fallbackData.candidates?.[0]?.content?.parts?.map(p => p.text || '')?.join('')?.trim();
          if (fallbackResult && fallbackResult !== text) {
            return fallbackResult.replace(/^```(?:html?)?\s*/i, '').replace(/```$/,'').trim();
          }
        }
      } catch (fallbackError) {
        console.warn('Fallback translation also failed:', fallbackError);
      }
      
      // If all translation attempts fail, return original text
      return text;
    }
    
    return translatedText;

  } catch (error) {
    if (error instanceof ValidationError || error instanceof NetworkError) {
      throw error;
    }
    
    console.error('Gemini translation failed:', error);
    // Instead of throwing error, return original text as fallback for translation failures
    console.warn(`Translation to ${targetLanguage} failed, returning original Korean text`);
    return text;
  }
};

/**
 * Gets available Gemini models
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<Array>} - List of available models
 */
export const getAvailableModels = async (apiKey) => {
  if (!validateApiKey(apiKey)) {
    throw new ValidationError('Invalid API key');
  }

  try {
    const response = await fetch(`${GEMINI_API_BASE_URL}/models?key=${apiKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new NetworkError(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    return data.models || [];

  } catch (error) {
    if (error instanceof NetworkError) {
      throw error;
    }
    
    console.error('Failed to get models:', error);
    throw new AppError(`Failed to get models: ${error.message}`);
  }
};

export default {
  validateApiKey,
  testGeminiConnection,
  analyzePDFTemplate,
  generateNoticeFromTemplate,
  translateWithGemini,
  getAvailableModels
};