const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Enhanced middleware configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://multilingual-three.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced translation function with better error handling and validation
async function translateText(text, targetLanguage) {
  try {
    // Input validation
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return '';
    }
    
    if (!targetLanguage || typeof targetLanguage !== 'string') {
      throw new Error('Valid target language is required');
    }
    
    // Enhanced translation mappings for common Korean school terms
    const translations = {
      'en': {
        '학년도': 'Academic Year',
        '초등학교': 'Elementary School',
        '중학교': 'Middle School',
        '고등학교': 'High School', 
        '가정통신문': 'School Notice',
        '안내': 'Notice',
        '선발': 'Recruitment',
        '계획': 'Plan',
        '공고': 'Announcement',
        '교장': 'Principal',
        '교사': 'Teacher',
        '학급': 'Class',
        '학생': 'Student',
        '학부모': 'Parent',
        '발행인': 'Publisher',
        '담당자': 'Contact Person',
        '주소': 'Address',
        '전화': 'Phone',
        '이메일': 'Email',
        '웹사이트': 'Website',
        '첨부파일': 'Attachment',
        '접수': 'Application',
        '마감': 'Deadline',
        '시험': 'Examination',
        '면접': 'Interview',
        '합격': 'Pass',
        '불합격': 'Fail',
        '발표': 'Announcement',
        '제출': 'Submission',
        '서류': 'Documents',
        '지원서': 'Application Form'
      },
      'zh-CN': {
        '학년도': '学年度',
        '초등학교': '小学',
        '중학교': '中学',
        '고등학교': '高中',
        '가정통신문': '家庭通知书',
        '안내': '通知',
        '선발': '选拔',
        '계획': '计划',
        '공고': '公告',
        '교장': '校长',
        '교사': '教师',
        '학급': '班级',
        '학생': '学生',
        '학부모': '家长',
        '발행인': '发行人',
        '담당자': '负责人',
        '주소': '地址',
        '전화': '电话',
        '이메일': '邮箱',
        '웹사이트': '网站',
        '첨부파일': '附件',
        '접수': '申请',
        '마감': '截止日期',
        '시험': '考试',
        '면접': '面试',
        '합격': '录取',
        '불합격': '落选',
        '발표': '公布',
        '제출': '提交',
        '서류': '文件',
        '지원서': '申请表'
      },
      'vi': {
        '학년도': 'Năm học',
        '초등학교': 'Trường tiểu học',
        '중학교': 'Trường trung học cơ sở',
        '고등학교': 'Trường trung học phổ thông',
        '가정통신문': 'Thông báo trường học',
        '안내': 'Thông báo',
        '선발': 'Tuyển chọn',
        '계획': 'Kế hoạch',
        '공고': 'Thông báo',
        '교장': 'Hiệu trưởng',
        '교사': 'Giáo viên',
        '학급': 'Lớp học',
        '학생': 'Học sinh',
        '학부모': 'Phụ huynh',
        '발행인': 'Người phát hành',
        '담당자': 'Người phụ trách',
        '주소': 'Địa chỉ',
        '전화': 'Điện thoại',
        '이메일': 'Email',
        '웹사이트': 'Website',
        '첨부파일': 'Tệp đính kèm',
        '접수': 'Tiếp nhận',
        '마감': 'Hạn chót',
        '시험': 'Kỳ thi',
        '면접': 'Phỏng vấn',
        '합격': 'Đậu',
        '불합격': 'Trượt',
        '발표': 'Công bố',
        '제출': 'Nộp',
        '서류': 'Tài liệu',
        '지원서': 'Đơn ứng tuyển'
      },
      'ru': {
        '학년도': 'Учебный год',
        '초등학교': 'Начальная школа',
        '중학교': 'Средняя школа',
        '고등학교': 'Старшая школа',
        '가정통신문': 'Школьное уведомление',
        '안내': 'Уведомление',
        '선발': 'Отбор',
        '계획': 'План',
        '공고': 'Объявление',
        '교장': 'Директор',
        '교사': 'Учитель',
        '학급': 'Класс',
        '학생': 'Ученик',
        '학부모': 'Родитель',
        '발행인': 'Издатель',
        '담당자': 'Ответственное лицо',
        '주소': 'Адрес',
        '전화': 'Телефон',
        '이메일': 'Электронная почта',
        '웹사이트': 'Веб-сайт',
        '첨부파일': 'Приложение',
        '접수': 'Прием заявок',
        '마감': 'Крайний срок',
        '시험': 'Экзамен',
        '면접': 'Собеседование',
        '합격': 'Принят',
        '불합격': 'Отклонен',
        '발표': 'Объявление',
        '제출': 'Подача',
        '서류': 'Документы',
        '지원서': 'Заявление'
      }
    };
    
    let translatedText = text;
    const targetTranslations = translations[targetLanguage];
    
    if (targetTranslations) {
      // Sort by length (longest first) to prevent partial replacements
      const sortedEntries = Object.entries(targetTranslations)
        .sort(([a], [b]) => b.length - a.length);
        
      sortedEntries.forEach(([korean, translated]) => {
        // Use word boundary regex for more accurate replacement
        const regex = new RegExp(`\\b${korean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
        translatedText = translatedText.replace(regex, translated);
      });
    }
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return text || '';
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'School Notice Translation API is running',
    timestamp: new Date().toISOString(),
    version: '1.1.0',
    supportedLanguages: ['ko', 'en', 'zh-CN', 'vi', 'ru']
  });
});

// Enhanced translation endpoint with improved validation
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'ko' } = req.body;
    
    // Enhanced input validation
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        error: 'Valid text string is required',
        code: 'INVALID_TEXT'
      });
    }
    
    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return res.status(400).json({ 
        error: 'Valid target language is required',
        code: 'INVALID_TARGET_LANGUAGE',
        supportedLanguages: ['ko', 'en', 'zh-CN', 'vi', 'ru']
      });
    }
    
    const supportedLanguages = ['ko', 'en', 'zh-CN', 'vi', 'ru'];
    if (!supportedLanguages.includes(targetLanguage)) {
      return res.status(400).json({ 
        error: `Unsupported target language: ${targetLanguage}`,
        code: 'UNSUPPORTED_LANGUAGE',
        supportedLanguages
      });
    }
    
    const translatedText = await translateText(text, targetLanguage);
    
    res.json({
      success: true,
      originalText: text,
      translatedText: translatedText,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Translation failed',
      message: error.message,
      code: 'TRANSLATION_ERROR'
    });
  }
});

// Enhanced batch translation endpoint
app.post('/api/translate-batch', async (req, res) => {
  try {
    const { texts, targetLanguage, sourceLanguage = 'ko' } = req.body;
    
    // Enhanced validation
    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ 
        error: 'Valid texts array is required',
        code: 'INVALID_TEXTS_ARRAY'
      });
    }
    
    if (texts.length === 0) {
      return res.status(400).json({ 
        error: 'Texts array cannot be empty',
        code: 'EMPTY_TEXTS_ARRAY'
      });
    }
    
    if (texts.length > 100) {
      return res.status(400).json({ 
        error: 'Maximum 100 texts allowed per batch',
        code: 'BATCH_SIZE_EXCEEDED'
      });
    }
    
    if (!targetLanguage || typeof targetLanguage !== 'string') {
      return res.status(400).json({ 
        error: 'Valid target language is required',
        code: 'INVALID_TARGET_LANGUAGE'
      });
    }
    
    const supportedLanguages = ['ko', 'en', 'zh-CN', 'vi', 'ru'];
    if (!supportedLanguages.includes(targetLanguage)) {
      return res.status(400).json({ 
        error: `Unsupported target language: ${targetLanguage}`,
        code: 'UNSUPPORTED_LANGUAGE',
        supportedLanguages
      });
    }
    
    // Process translations with error handling for individual items
    const translationResults = await Promise.allSettled(
      texts.map(async (text, index) => {
        try {
          const result = await translateText(text, targetLanguage);
          return { success: true, text: result, originalIndex: index };
        } catch (error) {
          console.error(`Translation failed for text at index ${index}:`, error);
          return { success: false, text: text, originalIndex: index, error: error.message };
        }
      })
    );
    
    const translatedTexts = translationResults.map(result => 
      result.status === 'fulfilled' ? result.value.text : result.reason
    );
    
    const failedTranslations = translationResults
      .map((result, index) => ({ result, index }))
      .filter(({ result }) => result.status === 'rejected' || !result.value.success)
      .map(({ index }) => index);
    
    res.json({
      success: true,
      originalTexts: texts,
      translatedTexts: translatedTexts,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      timestamp: new Date().toISOString(),
      stats: {
        total: texts.length,
        successful: texts.length - failedTranslations.length,
        failed: failedTranslations.length,
        failedIndexes: failedTranslations
      }
    });
  } catch (error) {
    console.error('Batch translation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Batch translation failed',
      message: error.message,
      code: 'BATCH_TRANSLATION_ERROR'
    });
  }
});

// Default export for Vercel serverless functions
module.exports = app;
module.exports.default = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Translation API server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}