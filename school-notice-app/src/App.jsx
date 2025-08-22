import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import NoticeHeader from './components/NoticeHeader';
import NoticeContent from './components/NoticeContent';
import NoticeFooter from './components/NoticeFooter';
import { translateNoticeData, checkAPIHealth } from './services/translationService';
import { generatePDFFromElement, generateMultilingualPDFs } from './services/pdfService';
import './App.css';

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  font-family: 'Malgun Gothic', sans-serif;
`;

const ControlPanel = styled.div`
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 100;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #007bff;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #6c757d;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #545b62;
  }
`;

const SuccessButton = styled(Button)`
  background-color: #28a745;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #1e7e34;
  }
`;

const StatusMessage = styled.div`
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 14px;
  
  &.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  &.info {
    background-color: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
`;

const NoticeContainer = styled.div`
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
`;

function App() {
  const [noticeData, setNoticeData] = useState({
    year: '2024학년도',
    school: 'OO초등학교',
    title: '1학기 학사 운영 방안 안내',
    publisher: '교장 김나나',
    manager: '교사 김문정',
    address: '경기도 안양시',
    phone: '031)000-0000',
    logoUrl: '',
    introText: '2025학년도 평촌초등학교 영어회화전문강사 선발계획 공고입니다.',
    content: `<h3>1. 선발분야 및 선발예정인원 : 초등 1명</h3>
<h3>2. 계약기간 : 2025.03.01.~2026.02.28.(1년)</h3>
<h3>3. 수업시수 : 20~22시간</h3>
<h3>4. 시험일정 및 합격자 발표</h3>
<p><strong>1) 1차시험 : 서류제출 및 심사</strong></p>
<p>- 서류접수 : 2024년 12월 20일(금) - 12월 24일(화) 오전 11:00까지(5일간)</p>
<p>- 합격자 발표 : 12월 24일(화) 16시 이후 개별통지</p>
<p><strong>2) 2차시험 : 수업과정안 작성, 수업실연 및 면접</strong></p>
<p>- 시험일시 : 12월 30일(월) 14:00~16:00</p>
<p>- 최종 합격자 발표 : 12월 31일(화) 개별 통지</p>`,
    attachmentDescription: '2025학년도 평촌초 영어회화전문강사 지원자000',
    attachments: [
      '기타사항: 방문접수는 하지 않음',
      '제출서류 (※ 첨부파일 참조)'
    ],
    notice: '※ 시험과목 및 배점, 응시원서, 자기소개서 등 자세한 사항은 붙임파일을 참조하시기 바랍니다.',
    additionalInfo: '붙임 영어회화전문강사 채용공고 및 응시원서 1부. 끝.',
    date: new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '년 ').replace(/\.$/, '일'),
    signature: 'O O 초 등 학 교 장'
  });
  
  const [translatedNotices, setTranslatedNotices] = useState({});
  const [editing, setEditing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  
  const noticeRef = useRef(null);
  const translatedNoticeRefs = useRef({});
  
  const languages = [
    { code: 'en', name: '영어 (English)' },
    { code: 'zh-CN', name: '중국어 (中文)' },
    { code: 'vi', name: '베트남어 (Tiếng Việt)' },
    { code: 'ru', name: '러시아어 (Русский)' }
  ];

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const health = await checkAPIHealth();
      setApiStatus(health ? 'connected' : 'disconnected');
    } catch (error) {
      setApiStatus('disconnected');
    }
  };

  const showMessage = (text, type = 'info', duration = 3000) => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), duration);
  };

  const handleTranslate = async (targetLanguage) => {
    if (apiStatus !== 'connected') {
      showMessage('번역 서버에 연결할 수 없습니다. 서버를 시작해주세요.', 'error');
      return;
    }

    setIsTranslating(true);
    try {
      showMessage('번역 중입니다...', 'info');
      const translatedData = await translateNoticeData(noticeData, targetLanguage);
      setTranslatedNotices(prev => ({
        ...prev,
        [targetLanguage]: translatedData
      }));
      showMessage(`${languages.find(lang => lang.code === targetLanguage)?.name} 번역이 완료되었습니다.`, 'success');
    } catch (error) {
      console.error('Translation error:', error);
      showMessage('번역 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateAll = async () => {
    if (apiStatus !== 'connected') {
      showMessage('번역 서버에 연결할 수 없습니다. 서버를 시작해주세요.', 'error');
      return;
    }

    setIsTranslating(true);
    try {
      showMessage('모든 언어로 번역 중입니다...', 'info');
      const translations = {};
      
      for (const language of languages) {
        const translatedData = await translateNoticeData(noticeData, language.code);
        translations[language.code] = translatedData;
      }
      
      setTranslatedNotices(translations);
      showMessage('모든 언어 번역이 완료되었습니다.', 'success');
    } catch (error) {
      console.error('Translation error:', error);
      showMessage('번역 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGeneratePDF = async (language = null) => {
    setIsGeneratingPDF(true);
    try {
      if (language) {
        // Generate PDF for specific language
        const element = translatedNoticeRefs.current[language];
        if (element) {
          const filename = `notice_${language}.pdf`;
          await generatePDFFromElement(element, filename);
          showMessage(`${languages.find(lang => lang.code === language)?.name} PDF가 생성되었습니다.`, 'success');
        }
      } else {
        // Generate PDF for Korean version
        await generatePDFFromElement(noticeRef.current, 'notice_korean.pdf');
        showMessage('한국어 PDF가 생성되었습니다.', 'success');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      showMessage('PDF 생성 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleGenerateAllPDFs = async () => {
    setIsGeneratingPDF(true);
    try {
      showMessage('모든 PDF를 생성 중입니다...', 'info');
      
      // Generate Korean PDF
      await generatePDFFromElement(noticeRef.current, 'notice_korean.pdf');
      
      // Generate translated PDFs
      for (const language of languages) {
        if (translatedNotices[language.code] && translatedNoticeRefs.current[language.code]) {
          const filename = `notice_${language.code}.pdf`;
          await generatePDFFromElement(translatedNoticeRefs.current[language.code], filename);
        }
      }
      
      showMessage('모든 PDF가 생성되었습니다.', 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      showMessage('PDF 생성 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <AppContainer>
      <ControlPanel>
        <h2>🏫 가정통신문 다국어 번역 시스템</h2>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>API 상태:</strong> 
          <span style={{ 
            color: apiStatus === 'connected' ? 'green' : 'red',
            marginLeft: '5px'
          }}>
            {apiStatus === 'connected' ? '✅ 연결됨' : '❌ 연결 안됨'}
          </span>
          {apiStatus !== 'connected' && (
            <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
              (백엔드 서버를 시작해주세요: npm run dev)
            </span>
          )}
        </div>
        
        {statusMessage && (
          <StatusMessage className={statusMessage.type}>
            {statusMessage.text}
          </StatusMessage>
        )}
        
        <ButtonGroup>
          <PrimaryButton 
            onClick={() => setEditing(!editing)}
          >
            {editing ? '편집 완료' : '편집 모드'}
          </PrimaryButton>
          
          <SecondaryButton 
            onClick={handleTranslateAll}
            disabled={isTranslating || apiStatus !== 'connected'}
          >
            {isTranslating ? '번역 중...' : '모든 언어로 번역'}
          </SecondaryButton>
          
          <SuccessButton 
            onClick={() => handleGeneratePDF()}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'PDF 생성 중...' : '한국어 PDF'}
          </SuccessButton>
          
          <SuccessButton 
            onClick={handleGenerateAllPDFs}
            disabled={isGeneratingPDF || Object.keys(translatedNotices).length === 0}
          >
            모든 PDF 생성
          </SuccessButton>
        </ButtonGroup>
        
        <div style={{ marginTop: '10px' }}>
          <span style={{ marginRight: '10px' }}>개별 번역:</span>
          {languages.map(language => (
            <Button
              key={language.code}
              onClick={() => handleTranslate(language.code)}
              disabled={isTranslating || apiStatus !== 'connected'}
              style={{ 
                marginRight: '5px', 
                marginBottom: '5px',
                backgroundColor: translatedNotices[language.code] ? '#28a745' : '#007bff',
                color: 'white'
              }}
            >
              {language.name}
            </Button>
          ))}
        </div>
      </ControlPanel>

      {/* Original Korean Notice */}
      <NoticeContainer ref={noticeRef}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          📄 원본 (한국어)
        </h3>
        <NoticeHeader 
          data={noticeData} 
          onChange={setNoticeData} 
          editing={editing}
        />
        <NoticeContent 
          data={noticeData} 
          onChange={setNoticeData} 
          editing={editing}
        />
        <NoticeFooter 
          data={noticeData} 
          onChange={setNoticeData} 
          editing={editing}
        />
      </NoticeContainer>

      {/* Translated Notices */}
      {Object.entries(translatedNotices).map(([languageCode, translatedData]) => {
        const language = languages.find(lang => lang.code === languageCode);
        return (
          <NoticeContainer 
            key={languageCode}
            ref={el => translatedNoticeRefs.current[languageCode] = el}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, color: '#333' }}>
                🌍 {language?.name}
              </h3>
              <Button
                onClick={() => handleGeneratePDF(languageCode)}
                disabled={isGeneratingPDF}
                style={{ backgroundColor: '#28a745', color: 'white' }}
              >
                PDF 생성
              </Button>
            </div>
            <NoticeHeader data={translatedData} editing={false} />
            <NoticeContent data={translatedData} editing={false} />
            <NoticeFooter data={translatedData} editing={false} />
          </NoticeContainer>
        );
      })}

      {Object.keys(translatedNotices).length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <p>번역된 가정통신문이 여기에 표시됩니다.</p>
          <p>상단의 번역 버튼을 클릭하여 다국어 버전을 생성해보세요.</p>
        </div>
      )}
    </AppContainer>
  );
}

export default App;
