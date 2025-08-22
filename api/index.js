const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple translation function using free translation service
async function translateText(text, targetLanguage) {
  try {
    if (!text || text.trim() === '') return '';
    
    // Basic translation mappings for common Korean school terms
    const translations = {
      'en': {
        '학년도': 'Academic Year',
        '초등학교': 'Elementary School', 
        '가정통신문': 'School Notice',
        '안내': 'Notice',
        '선발': 'Recruitment',
        '계획': 'Plan',
        '공고': 'Announcement',
        '교장': 'Principal',
        '교사': 'Teacher',
        '발행인': 'Publisher',
        '담당자': 'Contact Person',
        '주소': 'Address'
      },
      'zh-CN': {
        '학년도': '学年度',
        '초등학교': '小学',
        '가정통신문': '家庭通知书',
        '안내': '通知',
        '선발': '选拔',
        '계획': '计划',
        '공고': '公告',
        '교장': '校长',
        '교사': '教师',
        '발행인': '发行人',
        '담당자': '负责人',
        '주소': '地址'
      },
      'vi': {
        '학년도': 'Năm học',
        '초등학교': 'Trường tiểu học',
        '가정통신문': 'Thông báo trường học',
        '안내': 'Thông báo',
        '선발': 'Tuyển chọn',
        '계획': 'Kế hoạch',
        '공고': 'Thông báo',
        '교장': 'Hiệu trưởng',
        '교사': 'Giáo viên',
        '발행인': 'Người phát hành',
        '담당자': 'Người phụ trách',
        '주소': 'Địa chỉ'
      },
      'ru': {
        '학년도': 'Учебный год',
        '초등학교': 'Начальная школа',
        '가정통신문': 'Школьное уведомление',
        '안내': 'Уведомление',
        '선발': 'Отбор',
        '계획': 'План',
        '공고': 'Объявление',
        '교장': 'Директор',
        '교사': 'Учитель',
        '발행인': 'Издатель',
        '담당자': 'Ответственное лицо',
        '주소': 'Адрес'
      }
    };
    
    let translatedText = text;
    const targetTranslations = translations[targetLanguage];
    
    if (targetTranslations) {
      Object.entries(targetTranslations).forEach(([korean, translated]) => {
        const regex = new RegExp(korean, 'g');
        translatedText = translatedText.replace(regex, translated);
      });
    }
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'School Notice Translation API is running',
    timestamp: new Date().toISOString()
  });
});

// Translation endpoint
app.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'ko' } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }
    
    const translatedText = await translateText(text, targetLanguage);
    
    res.json({
      originalText: text,
      translatedText: translatedText,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Batch translation endpoint
app.post('/translate-batch', async (req, res) => {
  try {
    const { texts, targetLanguage, sourceLanguage = 'ko' } = req.body;
    
    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      return res.status(400).json({ error: 'Texts array and target language are required' });
    }
    
    const translatedTexts = await Promise.all(
      texts.map(text => translateText(text, targetLanguage))
    );
    
    res.json({
      originalTexts: texts,
      translatedTexts: translatedTexts,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage
    });
  } catch (error) {
    console.error('Batch translation error:', error);
    res.status(500).json({ error: 'Batch translation failed' });
  }
});

module.exports = app;