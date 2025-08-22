import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Translation service
export const translateText = async (text, targetLanguage, sourceLanguage = 'ko') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/translate`, {
      text,
      targetLanguage,
      sourceLanguage
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('번역 중 오류가 발생했습니다.');
  }
};

// Batch translation service
export const translateBatch = async (texts, targetLanguage, sourceLanguage = 'ko') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/translate-batch`, {
      texts,
      targetLanguage,
      sourceLanguage
    });
    return response.data.translatedTexts;
  } catch (error) {
    console.error('Batch translation error:', error);
    throw new Error('일괄 번역 중 오류가 발생했습니다.');
  }
};

// Extract text content from HTML
export const extractTextFromHTML = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

// Replace text in HTML while preserving structure
export const replaceTextInHTML = (html, originalTexts, translatedTexts) => {
  let result = html;
  
  originalTexts.forEach((originalText, index) => {
    if (originalText.trim() && translatedTexts[index]) {
      // Simple text replacement - in production, you might want more sophisticated HTML parsing
      result = result.replace(originalText, translatedTexts[index]);
    }
  });
  
  return result;
};

// Translate entire notice data
export const translateNoticeData = async (noticeData, targetLanguage) => {
  try {
    // Extract all text fields that need translation
    const textsToTranslate = [
      noticeData.title || '',
      noticeData.school || '',
      noticeData.publisher || '',
      noticeData.manager || '',
      noticeData.address || '',
      noticeData.introText || '',
      extractTextFromHTML(noticeData.content || ''),
      noticeData.attachmentDescription || '',
      ...(noticeData.attachments || []),
      noticeData.notice || '',
      noticeData.additionalInfo || '',
      noticeData.signature || ''
    ];

    // Filter out empty strings
    const nonEmptyTexts = textsToTranslate.filter(text => text.trim() !== '');
    const nonEmptyIndexes = [];
    textsToTranslate.forEach((text, index) => {
      if (text.trim() !== '') {
        nonEmptyIndexes.push(index);
      }
    });

    // Translate all texts
    const translatedTexts = await translateBatch(nonEmptyTexts, targetLanguage);

    // Map back translated texts
    const fullTranslatedTexts = new Array(textsToTranslate.length).fill('');
    nonEmptyIndexes.forEach((originalIndex, translatedIndex) => {
      fullTranslatedTexts[originalIndex] = translatedTexts[translatedIndex] || textsToTranslate[originalIndex];
    });

    // Create translated notice data
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
      attachments: (noticeData.attachments || []).map((_, index) => 
        fullTranslatedTexts[8 + index] || noticeData.attachments[index]
      ),
      notice: fullTranslatedTexts[8 + (noticeData.attachments || []).length] || noticeData.notice,
      additionalInfo: fullTranslatedTexts[9 + (noticeData.attachments || []).length] || noticeData.additionalInfo,
      signature: fullTranslatedTexts[10 + (noticeData.attachments || []).length] || noticeData.signature
    };

    return translatedNoticeData;
  } catch (error) {
    console.error('Notice translation error:', error);
    throw error;
  }
};

// Health check
export const checkAPIHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    return null;
  }
};

export default {
  translateText,
  translateBatch,
  translateNoticeData,
  extractTextFromHTML,
  replaceTextInHTML,
  checkAPIHealth
};