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
 * Validates Gemini API key and provides detailed error messages
 * @param {string} apiKey - The API key to validate
 * @returns {Object} - Validation result with detailed feedback
 */
export const validateApiKeyDetailed = (apiKey) => {
  if (!apiKey || typeof apiKey !== 'string') {
    return {
      valid: false,
      message: 'API 키를 입력해주세요.',
      hint: 'Google Cloud Console에서 발급받은 Gemini API 키를 입력하세요.'
    };
  }
  
  if (!apiKey.startsWith('AIza')) {
    return {
      valid: false,
      message: 'API 키 형식이 올바르지 않습니다.',
      hint: 'API 키는 "AIza"로 시작해야 합니다. Google Cloud Console에서 발급받은 정확한 키를 사용하세요.'
    };
  }
  
  if (apiKey.length !== 39) {
    return {
      valid: false,
      message: 'API 키 길이가 올바르지 않습니다.',
      hint: `API 키는 39자여야 합니다. 현재 ${apiKey.length}자입니다.`
    };
  }
  
  const apiKeyPattern = /^AIza[A-Za-z0-9_-]{35}$/;
  if (!apiKeyPattern.test(apiKey)) {
    return {
      valid: false,
      message: 'API 키에 유효하지 않은 문자가 포함되어 있습니다.',
      hint: 'API 키는 영문자, 숫자, 하이픈(-), 언더스코어(_)만 포함할 수 있습니다.'
    };
  }
  
  return {
    valid: true,
    message: 'API 키 형식이 올바릅니다.',
    hint: '연결 테스트를 진행하여 실제 작동 여부를 확인하세요.'
  };
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
    
    const prompt = `You are a professional translator. Translate the following Korean text/HTML to ${targetLanguageName}.

🚨 ABSOLUTE FORMATTING PRESERVATION RULES:
1. EXACT STRUCTURE REPLICATION: Copy every single HTML tag, attribute, class name, ID, style, spacing, line break, and indentation EXACTLY as they appear in the original
2. TEXT-ONLY TRANSLATION: Translate ONLY the readable text content between tags. NEVER modify any HTML elements, CSS classes, attributes, or structural markup
3. COMPLETE FORMAT INTEGRITY: Preserve all visual formatting including headings, bullet points, numbered lists, tables, divs, spans, and any nested structures
4. WHITESPACE PRESERVATION: Maintain all spaces, tabs, line breaks, and empty lines exactly as they appear in the original
5. SPECIAL CHARACTERS: Keep all emojis (📋, 🎉, 🏠, etc.), symbols, punctuation marks, and special characters in their exact positions
6. ATTRIBUTE PRESERVATION: Never translate or modify class names, IDs, href links, style attributes, or any HTML attributes
7. PROFESSIONAL TONE: Use formal, respectful language appropriate for official school communications
8. NUMERICAL DATA: Keep all dates, times, numbers, phone numbers, email addresses, and URLs in their original format
9. NO EXTRA CONTENT: Do not add explanations, markdown code blocks, comments, or any additional text
10. DIRECT OUTPUT ONLY: Return ONLY the translated content with preserved formatting - no prefixes, suffixes, or commentary

✅ CORRECT TRANSLATION EXAMPLES:
Original: <h3 class="notice-section-title">📋 행사 상세 정보</h3>
Correct: <h3 class="notice-section-title">📋 Event Details</h3>

Original: <div class="info-row"><span class="info-label">날짜:</span><span class="info-value">2025년 3월 15일 (금)</span></div>
Correct: <div class="info-row"><span class="info-label">Date:</span><span class="info-value">March 15, 2025 (Friday)</span></div>

Original: <p class="greeting-paragraph">안녕하십니까? 학부모님께 감사의 인사를 드립니다.</p>
Correct: <p class="greeting-paragraph">Hello. We extend our gratitude to the parents.</p>

❌ NEVER DO THIS:
- Change HTML structure: <div> → <p>
- Modify class names: "notice-title" → "title"
- Add markdown: \`\`\`html ... \`\`\`
- Remove formatting elements
- Change spacing or indentation
- Add explanatory text

If you cannot translate to ${targetLanguageName}, return the original Korean text with ALL formatting preserved.

Original content to translate:
${text}

Translated ${targetLanguageName} content (preserve ALL formatting):`;

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

/**
 * Refines Korean text to be easier to understand for non-native speakers.
 * @param {string} text - The Korean text to refine.
 * @param {string} apiKey - Gemini API key.
 * @returns {Promise<string>} - The refined, easier-to-understand Korean text.
 */
export const refineToEasyKorean = async (text, apiKey) => {
  if (!text) throw new ValidationError('Text for refinement is required');
  if (!validateApiKey(apiKey)) throw new ValidationError('Invalid API key');

  const prompt = `
다음 한국어 텍스트를 외국인 학부모가 이해하기 쉽도록 수정해줘.

요구사항:
1. 초등학생 수준의 쉬운 어휘를 사용해줘.
2. 문장은 짧고 간결하게 만들어줘.
3. 전문 용어나 한자어는 최대한 쉬운 한국어로 풀어써줘.
4. 원본의 핵심 의미와 격식은 유지해줘.
5. 수정된 텍스트만 응답하고, 다른 설명은 추가하지 마.

원본 텍스트:
${text}

수정된 텍스트:`;

  try {
    const response = await fetch(`${GEMINI_API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
      })
    });

    if (!response.ok) throw new NetworkError(`Easy Korean refinement failed: ${response.status}`);
    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text.trim();
    if (!result) throw new AppError('No refinement result from Gemini');
    return result;
  } catch (error) {
    console.error('Easy Korean refinement failed:', error);
    return text; // Return original text on failure
  }
};

/**
 * Adds explanatory notes for cultural or jargon terms in Korean text.
 * @param {string} text - The Korean text to analyze.
 * @param {string} apiKey - Gemini API key.
 * @returns {Promise<string>} - Text with added cultural notes.
 */
export const addCulturalNotes = async (text, apiKey) => {
  if (!text) throw new ValidationError('Text for adding notes is required');
  if (!validateApiKey(apiKey)) throw new ValidationError('Invalid API key');

  const prompt = `
다음 한국어 텍스트에서 외국인 학부모가 이해하기 어려운 한국 학교의 고유한 문화나 교육 용어(예: 창의적 체험활동, 방과 후 학교, 스승의 날)를 찾아서, 바로 뒤에 괄호를 사용하여 쉬운 설명을 덧붙여줘.

요구사항:
1. 모든 고유 용어를 찾아서 설명을 추가해야 해.
2. 설명은 매우 짧고 명확해야 해.
3. 설명이 필요 없는 일반적인 단어는 그대로 둬.
4. 수정된 텍스트만 응답하고, 다른 설명은 추가하지 마.

원본 텍스트:
${text}

설명 추가된 텍스트:`;

  try {
    const response = await fetch(`${GEMINI_API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
      })
    });

    if (!response.ok) throw new NetworkError(`Adding cultural notes failed: ${response.status}`);
    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text.trim();
    if (!result) throw new AppError('No cultural notes result from Gemini');
    return result;
  } catch (error) {
    console.error('Adding cultural notes failed:', error);
    return text; // Return original text on failure
  }
};

/**
 * Extracts key information from a notice to be displayed in a summary box.
 * @param {string} text - The notice text to analyze.
 * @param {string} apiKey - Gemini API key.
 * @returns {Promise<Object>} - A structured object with key information.
 */
export const extractKeyInfo = async (text, apiKey) => {
  if (!text) throw new ValidationError('Text for info extraction is required');
  if (!validateApiKey(apiKey)) throw new ValidationError('Invalid API key');

  const prompt = `
다음 가정통신문 텍스트에서 핵심 정보를 추출해서 JSON 형식으로 응답해줘.

요구사항:
1. 날짜, 시간, 장소, 비용, 준비물, 대상, 회신 기한 정보를 정확히 추출해줘.
2. 정보가 없는 필드는 null 값으로 설정해줘.
3. JSON 형식으로만 응답하고, 다른 설명은 추가하지 마.

{
  "date": "YYYY-MM-DD 형식의 행사 날짜",
  "time": "HH:MM 형식의 행사 시간",
  "location": "행사 장소",
  "cost": "비용 (숫자와 원화 기호)",
  "items": "준비물 목록 (배열)",
  "target": "참여 대상",
  "deadline": "YYYY-MM-DD 형식의 회신 마감일"
}

원본 텍스트:
${text}

추출된 정보 (JSON):`;

  try {
    const response = await fetch(`${GEMINI_API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1024, response_mime_type: "application/json" }
      })
    });

    if (!response.ok) throw new NetworkError(`Key info extraction failed: ${response.status}`);
    const data = await response.json();
    const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text.trim();
    if (!jsonText) throw new AppError('No key info result from Gemini');
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Key info extraction failed:', error);
    return null; // Return null on failure
  }
};


/**
 * Gets classroom activity ideas for a specific holiday.
 * @param {string} holidayName - The name of the holiday.
 * @param {string} countryName - The name of the country.
 * @param {string} apiKey - Gemini API key.
 * @returns {Promise<Object>} - An object containing the holiday explanation and activity ideas.
 */
export const getHolidayActivityIdeas = async (holidayName, countryName, apiKey) => {
  if (!holidayName || !countryName) throw new ValidationError('Holiday and country name are required');
  if (!validateApiKey(apiKey)) throw new ValidationError('Invalid API key');

  const prompt = `
초등학교 교실에서 ${countryName}의 명절인 '${holidayName}'을 기념하려고 해. 아래 JSON 형식에 맞춰서 응답해줘.

요구사항:
1. "explanation": 초등학생 눈높이에 맞춰 명절의 의미를 1~2문장으로 쉽고 간단하게 설명해줘.
2. "activities": 교실에서 모든 학생들이 함께 즐길 수 있는 간단하고 창의적인 활동 아이디어 3가지를 배열 형태로 제안해줘.
3. JSON 형식으로만 응답하고, 다른 설명은 추가하지 마.

{
  "explanation": "명절에 대한 쉬운 설명",
  "activities": [
    "첫 번째 활동 아이디어",
    "두 번째 활동 아이디어",
    "세 번째 활동 아이디어"
  ]
}`;

  try {
    const response = await fetch(`${GEMINI_API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 1024, response_mime_type: "application/json" }
      })
    });

    if (!response.ok) throw new NetworkError(`Failed to get activity ideas: ${response.status}`);
    const data = await response.json();
    const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text.trim();
    if (!jsonText) throw new AppError('No activity ideas result from Gemini');
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to get activity ideas:', error);
    return null;
  }
};

export default {
  validateApiKey,
  testGeminiConnection,
  analyzePDFTemplate,
  generateNoticeFromTemplate,
  translateWithGemini,
  getAvailableModels,
  refineToEasyKorean,
  addCulturalNotes,
  extractKeyInfo,
  getHolidayActivityIdeas
};