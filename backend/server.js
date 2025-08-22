const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple translation function using free translation service
async function translateText(text, targetLanguage) {
  try {
    if (!text || text.trim() === '') return '';
    
    // For production, integrate with Google Translate API or other translation service
    // For now, we'll use a mock translation that preserves Korean structure
    
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
        '주소': 'Address',
        '선발분야': 'Recruitment Field',
        '선발예정인원': 'Number of Positions',
        '계약기간': 'Contract Period',
        '수업시수': 'Teaching Hours',
        '시험일정': 'Exam Schedule',
        '합격자 발표': 'Result Announcement',
        '서류제출': 'Document Submission',
        '심사': 'Review',
        '서류접수': 'Document Reception',
        '개별통지': 'Individual Notification',
        '수업과정안': 'Curriculum Plan',
        '수업실연': 'Teaching Demonstration',
        '면접': 'Interview',
        '시험일시': 'Exam Date',
        '최종': 'Final',
        '첨부': 'Attachment',
        '파일': 'File',
        '기타사항': 'Other Information',
        '방문접수': 'In-person Application',
        '제출서류': 'Required Documents',
        '참조': 'Reference',
        '시험과목': 'Test Subjects',
        '배점': 'Points',
        '응시원서': 'Application Form',
        '자기소개서': 'Personal Statement',
        '자세한': 'Detailed',
        '사항': 'Information',
        '붙임파일': 'Attached File',
        '바랍니다': 'Please refer to',
        '채용공고': 'Job Posting',
        '부': 'Copy'
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
        '주소': '地址',
        '선발분야': '选拔领域',
        '선발예정인원': '预定选拔人数',
        '계약기간': '合同期间',
        '수업시수': '教学时数',
        '시험일정': '考试日程',
        '합격자 발표': '合格者公布',
        '서류제출': '文件提交',
        '심사': '审查',
        '서류접수': '文件接收',
        '개별통지': '个别通知',
        '수업과정안': '教学课程计划',
        '수업실연': '教学演示',
        '면접': '面试',
        '시험일시': '考试日期',
        '최종': '最终',
        '첨부': '附件',
        '파일': '文件',
        '기타사항': '其他事项',
        '방문접수': '现场申请',
        '제출서류': '提交文件',
        '참조': '参考',
        '시험과목': '考试科目',
        '배점': '分数',
        '응시원서': '申请表',
        '자기소개서': '自我介绍书',
        '자세한': '详细',
        '사항': '事项',
        '붙임파일': '附件',
        '바랍니다': '请参考',
        '채용공고': '招聘公告',
        '부': '份'
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
        '주소': 'Địa chỉ',
        '선발분야': 'Lĩnh vực tuyển chọn',
        '선발예정인원': 'Số lượng dự kiến tuyển',
        '계약기간': 'Thời hạn hợp đồng',
        '수업시수': 'Số tiết dạy',
        '시험일정': 'Lịch thi',
        '합격자 발표': 'Công bố kết quả',
        '서류제출': 'Nộp hồ sơ',
        '심사': 'Xét duyệt',
        '서류접수': 'Tiếp nhận hồ sơ',
        '개별통지': 'Thông báo cá nhân',
        '수업과정안': 'Kế hoạch giảng dạy',
        '수업실연': 'Thực hành giảng dạy',
        '면접': 'Phỏng vấn',
        '시험일시': 'Ngày thi',
        '최종': 'Cuối cùng',
        '첨부': 'Đính kèm',
        '파일': 'Tệp',
        '기타사항': 'Thông tin khác',
        '방문접수': 'Nộp trực tiếp',
        '제출서류': 'Tài liệu cần nộp',
        '참조': 'Tham khảo',
        '시험과목': 'Môn thi',
        '배점': 'Điểm số',
        '응시원서': 'Đơn đăng ký',
        '자기소개서': 'Thư giới thiệu',
        '자세한': 'Chi tiết',
        '사항': 'Thông tin',
        '붙임파일': 'Tệp đính kèm',
        '바랍니다': 'Vui lòng tham khảo',
        '채용공고': 'Thông báo tuyển dụng',
        '부': 'Bản'
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
        '주소': 'Адрес',
        '선발분야': 'Область отбора',
        '선발예정인원': 'Планируемое количество',
        '계약기간': 'Срок контракта',
        '수업시수': 'Учебные часы',
        '시험일정': 'Расписание экзаменов',
        '합격자 발표': 'Объявление результатов',
        '서류제출': 'Подача документов',
        '심사': 'Рассмотрение',
        '서류접수': 'Прием документов',
        '개별통지': 'Индивидуальное уведомление',
        '수업과정안': 'План урока',
        '수업실연': 'Демонстрация урока',
        '면접': 'Собеседование',
        '시험일시': 'Дата экзамена',
        '최종': 'Финальный',
        '첨부': 'Приложение',
        '파일': 'Файл',
        '기타사항': 'Прочая информация',
        '방문접수': 'Личная подача',
        '제출서류': 'Необходимые документы',
        '참조': 'Справка',
        '시험과목': 'Предметы экзамена',
        '배점': 'Баллы',
        '응시원서': 'Заявление',
        '자기소개서': 'Автобиография',
        '자세한': 'Подробная',
        '사항': 'Информация',
        '붙임파일': 'Прикрепленный файл',
        '바랍니다': 'Пожалуйста, обратитесь к',
        '채용공고': 'Объявление о найме',
        '부': 'Копия'
      }
    };
    
    let translatedText = text;
    const targetTranslations = translations[targetLanguage];
    
    if (targetTranslations) {
      // Apply translations for known terms
      Object.entries(targetTranslations).forEach(([korean, translated]) => {
        const regex = new RegExp(korean, 'g');
        translatedText = translatedText.replace(regex, translated);
      });
    }
    
    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

// Translation endpoint
app.post('/api/translate', async (req, res) => {
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
app.post('/api/translate-batch', async (req, res) => {
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'School Notice Translation API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;