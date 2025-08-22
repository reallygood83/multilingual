import React, { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import styled from 'styled-components';
import OptimizedButton from './OptimizedButton';
import StatusMessage from './StatusMessage';
import LoadingSpinner from './LoadingSpinner';
import { usePerformanceMonitor, useDebounce } from '../hooks/usePerformanceMonitor';
import { translateNoticeData, checkAPIHealth } from '../services/translationService';
import { generatePDFFromElement } from '../services/pdfService';
import { analyzePDFTemplate, translateWithGemini } from '../services/geminiService';
import { 
  DEFAULT_NOTICE_DATA, 
  SUPPORTED_LANGUAGES, 
  validateNoticeData, 
  validateLanguageCode,
  ERROR_MESSAGES 
} from '../types/noticeTypes';

// Lazy load components for better code splitting
const NoticeHeader = lazy(() => import('./NoticeHeader'));
const NoticeContent = lazy(() => import('./NoticeContent'));
const NoticeFooter = lazy(() => import('./NoticeFooter'));
const SettingsPanel = lazy(() => import('./SettingsPanel'));

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  will-change: scroll-position;
`;

const ControlPanel = styled.div`
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 100;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const APIStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255,255,255,0.5);
  border-radius: 8px;
  border-left: 4px solid ${props => 
    props.status === 'connected' ? '#28a745' : 
    props.status === 'checking' ? '#ffc107' : '#dc3545'
  };
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => 
    props.status === 'connected' ? '#28a745' : 
    props.status === 'checking' ? '#ffc107' : '#dc3545'
  };
  animation: ${props => props.status === 'checking' ? 'pulse 1.5s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-top: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const NoticeContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 32px;
  margin: 24px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
  }
`;

const NoticeTitle = styled.h3`
  text-align: center;
  margin: 0 0 24px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 40px;
  color: #6c757d;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  margin: 24px 0;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  
  h4 {
    margin: 0 0 12px 0;
    color: #495057;
    font-size: 18px;
  }
  
  p {
    margin: 8px 0;
    font-size: 14px;
    line-height: 1.5;
  }
`;

const ProgressIndicator = styled.div`
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin: 12px 0;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
    border-radius: 2px;
  }
`;

const OptimizedApp = () => {
  const { measureOperation } = usePerformanceMonitor('OptimizedApp');
  
  // Core state
  const [noticeData, setNoticeData] = useState(() => ({
    ...DEFAULT_NOTICE_DATA,
    content: `<h3>1. 선발분야 및 선발예정인원 : 초등 1명</h3>
<h3>2. 계약기간 : 2025.03.01.~2026.02.28.(1년)</h3>
<h3>3. 수업시수 : 20~22시간</h3>
<h3>4. 시험일정 및 합격자 발표</h3>
<p><strong>1) 1차시험 : 서류제출 및 심사</strong></p>
<p>- 서류접수 : 2024년 12월 20일(금) - 12월 24일(화) 오전 11:00까지(5일간)</p>
<p>- 합격자 발표 : 12월 24일(화) 16시 이후 개별통지</p>
<p><strong>2) 2차시험 : 수업과정안 작성, 수업실연 및 면접</strong></p>
<p>- 시험일시 : 12월 30일(월) 14:00~16:00</p>
<p>- 최종 합격자 발표 : 12월 31일(화) 개별 통지</p>`
  }));

  const [translatedNotices, setTranslatedNotices] = useState({});
  const [editing, setEditing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [lastError, setLastError] = useState(null);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('schoolNoticeSettings');
    return saved ? JSON.parse(saved) : {
      geminiApiKey: '',
      schoolName: 'OO초등학교',
      schoolYear: '2024학년도',
      schoolAddress: '',
      schoolPhone: '',
      publisher: '교장 김나나',
      manager: '교사 김문정',
      managerEmail: '',
      templateFile: null
    };
  });
  const [templateAnalysis, setTemplateAnalysis] = useState(null);

  // Refs for PDF generation
  const noticeRef = useRef(null);
  const translatedNoticeRefs = useRef({});

  // Memoized values
  const languages = useMemo(() => SUPPORTED_LANGUAGES, []);
  const completedTranslations = useMemo(() => Object.keys(translatedNotices).length, [translatedNotices]);
  const debouncedNoticeData = useDebounce(noticeData, 500);

  // Enhanced notice data validation and sanitization with performance monitoring
  const handleNoticeDataChange = useCallback((newData) => {
    return measureOperation('handleNoticeDataChange', () => {
      const validationErrors = validateNoticeData(newData);
      
      if (validationErrors.length > 0) {
        console.warn('Notice data validation errors:', validationErrors);
        showMessage('데이터 유효성 검사 오류가 발생했습니다.', 'error');
        return;
      }
      
      setNoticeData(newData);
    })();
  }, [measureOperation, showMessage]);

  // Optimized message display with auto-clear
  const showMessage = useCallback((text, type = 'info', duration = 3000) => {
    setStatusMessage({ text, type });
    
    const timer = setTimeout(() => {
      setStatusMessage(null);
    }, duration);
    
    return () => clearTimeout(timer);
  }, []);

  // Settings handlers
  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

  const handleTemplateUpload = useCallback(async (file) => {
    if (!settings.geminiApiKey) {
      showMessage('Gemini API 키를 먼저 설정해주세요.', 'error');
      return;
    }

    try {
      showMessage('템플릿을 분석하고 있습니다...', 'info');
      const analysis = await analyzePDFTemplate(file, settings.geminiApiKey);
      
      setTemplateAnalysis(analysis);
      setSettings(prev => ({ ...prev, templateFile: file }));
      
      // Update notice data with extracted information
      if (analysis.success && analysis.analysis.extractedFields) {
        const extractedFields = analysis.analysis.extractedFields;
        const updatedData = {
          ...noticeData,
          school: extractedFields.school || noticeData.school,
          year: extractedFields.year || noticeData.year,
          title: extractedFields.title || noticeData.title,
        };
        handleNoticeDataChange(updatedData);
      }
      
      showMessage('템플릿 분석이 완료되었습니다!', 'success');
    } catch (error) {
      console.error('Template analysis failed:', error);
      showMessage(`템플릿 분석 실패: ${error.message}`, 'error');
    }
  }, [settings.geminiApiKey, noticeData, handleNoticeDataChange, showMessage]);

  // API health check with retry logic
  const checkAPIStatus = useCallback(async (showRetryMessage = false) => {
    return measureOperation('checkAPIStatus', async () => {
      try {
        setApiStatus('checking');
        if (showRetryMessage) {
          showMessage('서버 연결을 다시 시도하고 있습니다...', 'info');
        }
        
        const health = await checkAPIHealth();
        
        if (health && health.status === 'OK') {
          setApiStatus('connected');
          setLastError(null);
          if (showRetryMessage) {
            showMessage('서버 연결이 성공했습니다!', 'success');
          }
        } else {
          setApiStatus('disconnected');
          setLastError('서버 상태 확인 실패');
        }
      } catch (error) {
        console.error('API status check failed:', error);
        setApiStatus('disconnected');
        setLastError(error.message || '서버 연결 실패');
      }
    })();
  }, [measureOperation, showMessage]);

  // Enhanced translation with Gemini API fallback
  const handleTranslate = useCallback((targetLanguage) => {
    return measureOperation('handleTranslate', async () => {
      if (!validateLanguageCode(targetLanguage)) {
        showMessage(ERROR_MESSAGES.UNSUPPORTED_LANGUAGE, 'error');
        return;
      }

      if (apiStatus !== 'connected' && !settings.geminiApiKey) {
        showMessage('번역 서버에 연결할 수 없습니다.', 'error');
        await checkAPIStatus(true);
        return;
      }

      const languageName = languages.find(lang => lang.code === targetLanguage)?.name || targetLanguage;
      
      setIsTranslating(true);
      try {
        showMessage(`${languageName}로 번역 중입니다...`, 'info');
        
        let translatedData;
        
        // Try Gemini API first if available, fallback to original service
        if (settings.geminiApiKey) {
          try {
            const translatedContent = await translateWithGemini(
              debouncedNoticeData.content, 
              targetLanguage, 
              settings.geminiApiKey
            );
            
            translatedData = {
              ...debouncedNoticeData,
              content: translatedContent,
              // Apply template structure if available
              ...(templateAnalysis?.analysis?.extractedFields && {
                school: settings.schoolName || debouncedNoticeData.school,
                publisher: settings.publisher || debouncedNoticeData.publisher,
                manager: settings.manager || debouncedNoticeData.manager
              })
            };
          } catch (geminiError) {
            console.warn('Gemini translation failed, falling back to original service:', geminiError);
            translatedData = await translateNoticeData(debouncedNoticeData, targetLanguage);
          }
        } else {
          translatedData = await translateNoticeData(debouncedNoticeData, targetLanguage);
        }
        
        setTranslatedNotices(prev => ({
          ...prev,
          [targetLanguage]: translatedData
        }));
        
        showMessage(`✅ ${languageName} 번역이 완료되었습니다!`, 'success');
      } catch (error) {
        console.error('Translation error:', error);
        const errorMessage = error.message || '번역 중 알 수 없는 오류가 발생했습니다.';
        showMessage(`❌ ${errorMessage}`, 'error', 5000);
      } finally {
        setIsTranslating(false);
      }
    })();
  }, [measureOperation, showMessage, apiStatus, checkAPIStatus, languages, debouncedNoticeData, settings, templateAnalysis]);

  // Batch translation with progress tracking
  const handleTranslateAll = useCallback(() => {
    return measureOperation('handleTranslateAll', async () => {
      if (apiStatus !== 'connected' && !settings.geminiApiKey) {
        showMessage('번역 서버에 연결할 수 없습니다.', 'error');
        await checkAPIStatus(true);
        return;
      }

      setIsTranslating(true);
      setTranslationProgress(0);
      const translations = {};
      let successCount = 0;
      let failCount = 0;
      
      try {
        showMessage(`모든 언어(${languages.length}개)로 번역을 시작합니다...`, 'info');
        
        for (let i = 0; i < languages.length; i++) {
          const language = languages[i];
          const progress = ((i + 1) / languages.length) * 100;
          
          try {
            setTranslationProgress(progress);
            showMessage(`진행상황: ${language.name} (${i + 1}/${languages.length})`, 'info');
            
            let translatedData;
            
            // Use Gemini API if available, fallback to original service
            if (settings.geminiApiKey) {
              try {
                const translatedContent = await translateWithGemini(
                  debouncedNoticeData.content, 
                  language.code, 
                  settings.geminiApiKey
                );
                
                translatedData = {
                  ...debouncedNoticeData,
                  content: translatedContent,
                  ...(templateAnalysis?.analysis?.extractedFields && {
                    school: settings.schoolName || debouncedNoticeData.school,
                    publisher: settings.publisher || debouncedNoticeData.publisher,
                    manager: settings.manager || debouncedNoticeData.manager
                  })
                };
              } catch (geminiError) {
                console.warn(`Gemini translation failed for ${language.name}, falling back:`, geminiError);
                translatedData = await translateNoticeData(debouncedNoticeData, language.code);
              }
            } else {
              translatedData = await translateNoticeData(debouncedNoticeData, language.code);
            }
            
            translations[language.code] = translatedData;
            successCount++;
            
          } catch (error) {
            console.error(`❌ ${language.name} translation failed:`, error);
            failCount++;
            showMessage(`${language.name} 번역 실패: ${error.message}`, 'error', 3000);
          }
        }
        
        setTranslatedNotices(translations);
        
        if (successCount === languages.length) {
          showMessage(`✅ 모든 언어 번역이 성공적으로 완료되었습니다! (${successCount}개)`, 'success');
        } else if (successCount > 0) {
          showMessage(`부분 성공: ${successCount}개 언어 번역 완료, ${failCount}개 실패`, 'warning');
        } else {
          showMessage('번역 작업이 실패했습니다. 네트워크 연결을 확인해주세요.', 'error');
        }
      } catch (error) {
        console.error('Batch translation error:', error);
        showMessage('일괄 번역 중 예상치 못한 오류가 발생했습니다.', 'error');
      } finally {
        setIsTranslating(false);
        setTranslationProgress(0);
      }
    })();
  }, [measureOperation, showMessage, apiStatus, checkAPIStatus, languages, debouncedNoticeData, settings, templateAnalysis]);

  // PDF generation with performance monitoring
  const handleGeneratePDF = useCallback((language = null) => {
    return measureOperation('handleGeneratePDF', async () => {
      setIsGeneratingPDF(true);
      try {
        if (language) {
          const element = translatedNoticeRefs.current[language];
          if (element) {
            const filename = `notice_${language}.pdf`;
            await generatePDFFromElement(element, filename);
            const languageName = languages.find(lang => lang.code === language)?.name;
            showMessage(`${languageName} PDF가 생성되었습니다.`, 'success');
          }
        } else {
          await generatePDFFromElement(noticeRef.current, 'notice_korean.pdf');
          showMessage('한국어 PDF가 생성되었습니다.', 'success');
        }
      } catch (error) {
        console.error('PDF generation error:', error);
        showMessage('PDF 생성 중 오류가 발생했습니다.', 'error');
      } finally {
        setIsGeneratingPDF(false);
      }
    })();
  }, [measureOperation, showMessage, languages]);

  // Initialize API status check on mount
  useEffect(() => {
    checkAPIStatus();
  }, [checkAPIStatus]);

  return (
    <AppContainer>
      <ControlPanel>
        <Title>
          <span>🌍 AI 다국어 가정통신문 시스템</span>
          <OptimizedButton
            variant="outline"
            onClick={() => setShowSettings(true)}
            style={{ fontSize: '14px', padding: '8px 16px' }}
          >
            ⚙️ 설정
          </OptimizedButton>
        </Title>
        
        <APIStatus status={apiStatus}>
          <StatusIndicator status={apiStatus} />
          <div>
            <strong>API 상태:</strong> {' '}
            {apiStatus === 'connected' && '연결됨'}
            {apiStatus === 'disconnected' && '연결 안됨'}
            {apiStatus === 'checking' && '확인중...'}
            {lastError && (
              <span style={{ marginLeft: '8px', fontSize: '12px', color: '#dc3545' }}>
                ({lastError})
              </span>
            )}
          </div>
          {apiStatus === 'disconnected' && (
            <OptimizedButton
              variant="primary"
              onClick={() => checkAPIStatus(true)}
              style={{ fontSize: '12px', padding: '4px 8px' }}
            >
              다시 연결
            </OptimizedButton>
          )}
        </APIStatus>
        
        {statusMessage && (
          <StatusMessage text={statusMessage.text} type={statusMessage.type} />
        )}
        
        {isTranslating && translationProgress > 0 && (
          <ProgressIndicator progress={translationProgress} />
        )}
        
        <ButtonGroup>
          <OptimizedButton
            variant="primary"
            onClick={() => setEditing(!editing)}
          >
            {editing ? '편집 완료' : '편집 모드'}
          </OptimizedButton>
          
          <OptimizedButton
            variant="secondary"
            onClick={handleTranslateAll}
            disabled={isTranslating || (apiStatus !== 'connected' && !settings.geminiApiKey)}
            loading={isTranslating}
            loadingText="번역 중..."
            title={apiStatus !== 'connected' && !settings.geminiApiKey ? 'API 연결 또는 Gemini API 키가 필요합니다' : `모든 언어로 일괄 번역 (${languages.length}개)`}
          >
            모든 언어로 번역 ({languages.length}개)
          </OptimizedButton>
          
          <OptimizedButton
            variant="success"
            onClick={() => handleGeneratePDF()}
            loading={isGeneratingPDF}
            loadingText="생성 중..."
          >
            한국어 PDF
          </OptimizedButton>
        </ButtonGroup>
        
        <div>
          <span style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
            개별 번역 ({completedTranslations}/{languages.length} 완료)
            {settings.geminiApiKey && <span style={{ color: '#28a745', marginLeft: '8px' }}>✨ Gemini AI 활성화</span>}
          </span>
          <LanguageGrid>
            {languages.map(language => (
              <OptimizedButton
                key={language.code}
                variant={translatedNotices[language.code] ? 'success' : 'primary'}
                onClick={() => handleTranslate(language.code)}
                disabled={isTranslating || (apiStatus !== 'connected' && !settings.geminiApiKey)}
                title={`${language.name}로 번역${translatedNotices[language.code] ? ' (완료)' : ''}`}
                style={{ fontSize: '13px' }}
              >
                {language.name}
                {translatedNotices[language.code] && ' ✓'}
              </OptimizedButton>
            ))}
          </LanguageGrid>
        </div>
      </ControlPanel>

      {/* Original Korean Notice */}
      <NoticeContainer ref={noticeRef}>
        <NoticeTitle>
          📄 원본 (한국어)
        </NoticeTitle>
        <Suspense fallback={<LoadingSpinner center padding="40px" text="로딩 중..." />}>
          <NoticeHeader 
            data={noticeData} 
            onChange={handleNoticeDataChange} 
            editing={editing}
          />
          <NoticeContent 
            data={noticeData} 
            onChange={handleNoticeDataChange} 
            editing={editing}
          />
          <NoticeFooter 
            data={noticeData} 
            onChange={handleNoticeDataChange} 
            editing={editing}
          />
        </Suspense>
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
              marginBottom: '24px'
            }}>
              <NoticeTitle style={{ margin: 0 }}>
                🌍 {language?.name}
              </NoticeTitle>
              <OptimizedButton
                variant="success"
                onClick={() => handleGeneratePDF(languageCode)}
                loading={isGeneratingPDF}
                loadingText="생성 중..."
              >
                PDF 생성
              </OptimizedButton>
            </div>
            <Suspense fallback={<LoadingSpinner center padding="20px" text="로딩 중..." />}>
              <NoticeHeader data={translatedData} editing={false} />
              <NoticeContent data={translatedData} editing={false} />
              <NoticeFooter data={translatedData} editing={false} />
            </Suspense>
          </NoticeContainer>
        );
      })}

      {Object.keys(translatedNotices).length === 0 && (
        <EmptyState>
          <h4>🌍 AI 다국어 번역 대기 중</h4>
          <p>AI가 번역한 가정통신문이 여기에 표시됩니다.</p>
          <p>상단의 번역 버튼을 클릭하여 다국어 버전을 생성해보세요.</p>
          {settings.geminiApiKey && (
            <p style={{ color: '#28a745', fontWeight: '500' }}>✨ Gemini AI 번역 활성화됨</p>
          )}
        </EmptyState>
      )}
      
      {/* Settings Panel */}
      <Suspense fallback={<LoadingSpinner center padding="40px" text="설정 로딩 중..." />}>
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onTemplateUpload={handleTemplateUpload}
        />
      </Suspense>
    </AppContainer>
  );
};

export default OptimizedApp;