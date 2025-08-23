import React, { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import styled from 'styled-components';
import OptimizedButton from './OptimizedButton';
import StatusMessage from './StatusMessage';
import LoadingSpinner from './LoadingSpinner';
import TemplateAnalysisDisplay from './TemplateAnalysisDisplay';
import { usePerformanceMonitor, useDebounce } from '../hooks/usePerformanceMonitor';
import { translateNoticeData, checkAPIHealth, isApiConfigured } from '../services/translationService';
import { generatePDFFromElement, generateCleanA4PDF } from '../services/pdfService';
import { 
  analyzePDFTemplate, 
  translateWithGemini,
  refineToEasyKorean,
  addCulturalNotes,
  extractKeyInfo
} from '../services/geminiService';
import { generateProfessionalNotice } from '../services/professionalNoticeService';
import { 
  DEFAULT_NOTICE_DATA, 
  SUPPORTED_LANGUAGES, 
  validateNoticeData, 
  validateLanguageCode,
  ERROR_MESSAGES 
} from '../types/noticeTypes';

// Lazy load components
const NoticeHeader = lazy(() => import('./NoticeHeader'));
const NoticeContent = lazy(() => import('./NoticeContent'));
const NoticeFooter = lazy(() => import('./NoticeFooter'));
const SettingsPanel = lazy(() => import('./SettingsPanel'));
const SettingsModal = lazy(() => import('./SettingsModal'));
const NoticeWizardModal = lazy(() => import('./NoticeWizardModal'));
const SummaryBox = lazy(() => import('./SummaryBox'));

const AppContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background: var(--surface-secondary);
  color: var(--text-primary);
  font-family: 'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  will-change: scroll-position;
`;

const MainContent = styled.main`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-top: 20px;
  justify-content: center;
`;

const InputSection = styled.div`
  flex: 1;
  width: 100%;
  max-width: 880px;
  background: var(--surface-primary);
  border-radius: var(--radius-md, 10px);
  box-shadow: var(--elevation-1, 0 2px 4px rgba(0,0,0,0.1));
  border: 1px solid var(--neutral-200);
  padding: 20px;
`;

const ControlPanel = styled.div`
  position: static;
  background: var(--surface-primary);
  padding: 24px;
  border-radius: var(--radius-md, 10px);
  margin-bottom: 24px;
  box-shadow: var(--elevation-1, 0 2px 8px rgba(0, 0, 0, 0.1));
  border: 1px solid var(--neutral-200);
  max-width: 880px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 700;
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
  background: var(--surface-secondary);
  border-radius: 6px;
  border: 1px solid var(--neutral-200);
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => 
    props.$status === 'connected' ? '#28a745' : 
    props.$status === 'checking' ? '#ffc107' : '#dc3545'
  };
  animation: ${props => props.$status === 'checking' ? 'pulse 1.5s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
`;

const AIOptions = styled.div`
  background-color: #f0f7ff;
  border: 1px solid #b3d7ff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    cursor: pointer;
  }

  input[type="checkbox"] {
    cursor: pointer;
  }
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const LanguageDropdown = styled.select`
  padding: 8px 12px;
  border: 2px solid var(--neutral-200);
  border-radius: 8px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
`;

const TranslateButton = styled(OptimizedButton)`
  min-width: 120px;
`;

const NoticeContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 32px;
  margin: 24px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
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
`;

const ProgressIndicator = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, #28a745, #20c997);
    width: ${props => props.$progress || 0}%;
    transition: width 0.3s ease;
    border-radius: 3px;
  }
`;

const Footer = styled.footer`
  margin-top: auto;
  padding: 20px;
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  text-align: center;
  border-top: 1px solid var(--neutral-200);

  a {
    color: var(--primary-500);
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const NoticeGenerator = () => {
  const { measureOperation } = usePerformanceMonitor('NoticeGenerator');
  
  // Core state
  const [noticeData, setNoticeData] = useState(() => ({ ...DEFAULT_NOTICE_DATA, content: '' }));
  const [translatedNotices, setTranslatedNotices] = useState({});
  const [editing, setEditing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [lastError, setLastError] = useState(null);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('schoolNoticeSettings');
    return saved ? JSON.parse(saved) : { geminiApiKey: '', schoolName: 'OO초등학교', schoolYear: '2024학년도', schoolAddress: '', schoolPhone: '', publisher: '교장 김나나', manager: '교사 김문정', managerEmail: '', templateFile: null };
  });
  const [templateAnalysis, setTemplateAnalysis] = useState(null);
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isGeneratingNotice, setIsGeneratingNotice] = useState(false);

  // Phase 1 State
  const [useEasyKorean, setUseEasyKorean] = useState(true);
  const [addExtraNotes, setAddExtraNotes] = useState(true);
  const [keyInfo, setKeyInfo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Refs
  const noticeRef = useRef(null);
  const translatedNoticeRefs = useRef({});

  // Memos
  const languages = useMemo(() => SUPPORTED_LANGUAGES, []);
  const completedTranslations = useMemo(() => Object.keys(translatedNotices).length, [translatedNotices]);
  const debouncedNoticeData = useDebounce(noticeData, 500);
  const debouncedSettings = useDebounce(settings, 500);

  useEffect(() => {
    try {
      if (debouncedSettings) {
        const { templateFile, ...settingsToSave } = debouncedSettings;
        localStorage.setItem('schoolNoticeSettings', JSON.stringify(settingsToSave));
      }
    } catch (e) {
      console.warn('설정 저장에 실패했습니다.', e);
    }
  }, [debouncedSettings]);

  const showMessage = useCallback((text, type = 'info', duration = 3000) => {
    setStatusMessage({ text, type });
    const timer = setTimeout(() => setStatusMessage(null), duration);
    return () => clearTimeout(timer);
  }, []);

  const handleNoticeDataChange = useCallback((newData) => {
    const validationErrors = validateNoticeData(newData);
    if (validationErrors.length > 0) {
      console.warn('Validation warnings:', validationErrors);
    }
    setNoticeData(newData);
  }, []);

  const handleSettingsChange = useCallback((newSettings) => setSettings(newSettings), []);

  useEffect(() => {
    if (settings.schoolName || settings.schoolAddress || settings.schoolPhone) {
      setNoticeData(prevData => ({ ...prevData, school: settings.schoolName || prevData.school, year: settings.schoolYear || prevData.year, publisher: settings.publisher || prevData.publisher, manager: settings.manager || prevData.manager, phone: settings.schoolPhone || prevData.phone, address: settings.schoolAddress || prevData.address }));
    }
  }, [settings.schoolName, settings.schoolYear, settings.schoolAddress, settings.schoolPhone, settings.publisher, settings.manager]);

  // Effect for Key Info Extraction
  useEffect(() => {
    const analyzeContent = async () => {
      if (!debouncedNoticeData.content || !settings.geminiApiKey) {
        setKeyInfo(null);
        return;
      }
      setIsAnalyzing(true);
      try {
        const info = await extractKeyInfo(debouncedNoticeData.content, settings.geminiApiKey);
        setKeyInfo(info);
      } catch (error) {
        console.error('Key info extraction failed:', error);
        setKeyInfo(null);
      } finally {
        setIsAnalyzing(false);
      }
    };
    analyzeContent();
  }, [debouncedNoticeData.content, settings.geminiApiKey]);

  const handleTemplateUpload = useCallback(async (file) => {
    if (!settings.geminiApiKey) return showMessage('Gemini API 키를 먼저 설정해주세요.', 'error');
    try {
      showMessage('템플릿을 분석하고 있습니다...', 'info');
      const analysis = await analyzePDFTemplate(file, settings.geminiApiKey);
      setTemplateAnalysis(analysis);
      setSettings(prev => ({ ...prev, templateFile: file }));
      if (analysis.success && analysis.analysis.extractedFields) {
        const { school, year, title } = analysis.analysis.extractedFields;
        handleNoticeDataChange({ ...noticeData, school: school || noticeData.school, year: year || noticeData.year, title: title || noticeData.title });
      }
      showMessage('템플릿 분석이 완료되었습니다!', 'success');
    } catch (error) {
      console.error('Template analysis failed:', error);
      showMessage(`템플릿 분석 실패: ${error.message}`, 'error');
    }
  }, [settings.geminiApiKey, noticeData, handleNoticeDataChange, showMessage]);

  const checkAPIStatus = useCallback(async (showRetryMessage = false) => {
    if (!isApiConfigured) {
      setApiStatus('disconnected');
      setLastError('백엔드 API 미구성');
      if (showRetryMessage) showMessage('백엔드 없이도 설정에서 Gemini API 키를 입력하려면 번역/생성이 가능합니다.', 'info');
      return;
    }
    setApiStatus('checking');
    setLastError(null);
    try {
      const health = await checkAPIHealth();
      if (health?.status === 'OK') {
        setApiStatus('connected');
        if (showRetryMessage) showMessage('번역 서버에 다시 연결되었습니다.', 'success');
      } else {
        setApiStatus('disconnected');
        setLastError('서버 상태 확인 실패');
      }
    } catch (error) {
      setApiStatus('disconnected');
      setLastError(error.message || '서버 연결 실패');
    }
  }, [showMessage]);

  const getRefinedContent = useCallback(async (content) => {
    let refinedContent = content;
    if (useEasyKorean) {
      showMessage('AI가 쉬운 한국어로 다듬는 중...', 'info');
      refinedContent = await refineToEasyKorean(refinedContent, settings.geminiApiKey);
    }
    if (addExtraNotes) {
      showMessage('AI가 문화/용어 해설을 추가하는 중...', 'info');
      refinedContent = await addCulturalNotes(refinedContent, settings.geminiApiKey);
    }
    return refinedContent;
  }, [useEasyKorean, addExtraNotes, settings.geminiApiKey, showMessage]);

  const handleTranslate = useCallback(async (targetLanguage) => {
    if (!validateLanguageCode(targetLanguage)) return showMessage(ERROR_MESSAGES.UNSUPPORTED_LANGUAGE, 'error');
    if (!settings.geminiApiKey) return showMessage('번역을 위해 Gemini API 키가 필요합니다.', 'error');

    const languageName = languages.find(lang => lang.code === targetLanguage)?.name || targetLanguage;
    setIsTranslating(true);
    setTranslationProgress(0);
    try {
      const refinedContent = await getRefinedContent(debouncedNoticeData.content);
      showMessage(`${languageName}로 번역 중입니다...`, 'info');
      
      const progressInterval = setInterval(() => setTranslationProgress(prev => Math.min(prev + Math.random() * 15, 90)), 200);
      
      const translatedContent = await translateWithGemini(refinedContent, targetLanguage, settings.geminiApiKey);
      
      clearInterval(progressInterval);
      setTranslationProgress(100);
      
      setTranslatedNotices(prev => ({ ...prev, [targetLanguage]: { ...debouncedNoticeData, content: translatedContent } }));
      showMessage(`✅ ${languageName} 번역이 완료되었습니다!`, 'success');
      
      setTimeout(() => setTranslationProgress(0), 2000);
    } catch (error) {
      showMessage(`❌ ${error.message || '번역 중 알 수 없는 오류 발생'}`, 'error', 5000);
      setTranslationProgress(0);
    } finally {
      setIsTranslating(false);
    }
  }, [getRefinedContent, languages, debouncedNoticeData, settings.geminiApiKey, showMessage]);

  const handleTranslateAll = useCallback(async () => {
    if (!settings.geminiApiKey) return showMessage('번역을 위해 Gemini API 키가 필요합니다.', 'error');

    setIsTranslating(true);
    setTranslationProgress(0);
    const translations = {};
    let successCount = 0, failCount = 0;
    
    try {
      const refinedContent = await getRefinedContent(debouncedNoticeData.content);
      showMessage(`모든 언어(${languages.length}개)로 번역을 시작합니다...`, 'info');
      
      for (let i = 0; i < languages.length; i++) {
        const language = languages[i];
        setTranslationProgress(((i + 1) / languages.length) * 100);
        try {
          const translatedData = { ...debouncedNoticeData, content: await translateWithGemini(refinedContent, language.code, settings.geminiApiKey) };
          translations[language.code] = translatedData;
          successCount++;
        } catch (error) {
          failCount++;
          showMessage(`${language.name} 번역 실패: ${error.message}`, 'error', 3000);
        }
      }
      setTranslatedNotices(translations);
      if (successCount === languages.length) showMessage(`✅ 모든 언어 번역 완료! (${successCount}개)`, 'success');
      else if (successCount > 0) showMessage(`부분 성공: ${successCount}개 완료, ${failCount}개 실패`, 'warning');
      else showMessage('번역 작업이 실패했습니다.', 'error');
    } catch (error) {
      showMessage('일괄 번역 중 예상치 못한 오류가 발생했습니다.', 'error');
    } finally {
      setIsTranslating(false);
      setTranslationProgress(0);
    }
  }, [getRefinedContent, languages, debouncedNoticeData, settings.geminiApiKey, showMessage]);

  const handleGenerateNotice = useCallback(async (generatedData) => {
    // NoticeWizardModal에서 이미 generateProfessionalNotice가 호출되어 결과가 전달됨
    console.log('🎯 handleGenerateNotice 받은 데이터:', generatedData);
    
    try {
      // generatedData는 이미 생성된 통신문 데이터이므로 바로 사용
      const generatedHtml = generatedData?.content || '';
      if (!generatedHtml) {
        throw new Error('생성된 통신문 내용이 없습니다.');
      }
      
      // 생성된 통신문의 introText를 제목으로 사용
      const introText = generatedData?.introText || '전문 통신문';
      
      setNoticeData({ 
        ...noticeData, 
        content: generatedHtml,
        introText: introText
      });
      setShowWizardModal(false);
      setEditing(true);
      showMessage('AI 전문 통신문이 성공적으로 생성되었습니다!', 'success');
    } catch (error) {
      console.error('통신문 적용 중 오류:', error);
      showMessage(`통신문 적용 중 오류가 발생했습니다: ${error.message}`, 'error');
    }
  }, [noticeData, showMessage]);

  const handleGeneratePDF = useCallback(async (language = null) => {
    setIsGeneratingPDF(true);
    try {
      const element = language ? translatedNoticeRefs.current[language] : noticeRef.current;
      if (element) {
        const filename = `notice_${language || 'korean'}.pdf`;
        await generateCleanA4PDF(element, filename);
        showMessage(`${language ? languages.find(l=>l.code===language)?.name : '한국어'} PDF가 생성되었습니다.`, 'success');
      }
    } catch (error) {
      showMessage('PDF 생성 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [languages]);

  useEffect(() => { checkAPIStatus(); }, [checkAPIStatus]);

  return (
    <AppContainer>
      <ControlPanel>
        <Title>
          <span>🌍 AI 다국어 가정통신문 시스템</span>
          <OptimizedButton variant="outline" onClick={() => setShowSettingsModal(true)} style={{ fontSize: '14px', padding: '8px 16px' }}>⚙️ 설정</OptimizedButton>
        </Title>
        
        <APIStatus>
          <StatusIndicator $status={apiStatus} />
          <div>
            <strong>API 상태:</strong>{' '}
            {apiStatus === 'connected' && '연결됨'}
            {apiStatus === 'disconnected' && '연결 안됨'}
            {apiStatus === 'checking' && '확인중...'}
            {lastError && <span style={{ marginLeft: '8px', fontSize: '12px', color: '#dc3545' }}>({lastError})</span>}
            {!settings.geminiApiKey && <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>💡 AI 기능을 사용하려면 설정에서 Gemini API 키를 입력해주세요.</div>}
          </div>
        </APIStatus>
        
        {statusMessage && <StatusMessage text={statusMessage.text} type={statusMessage.type} />}
        {isTranslating && translationProgress > 0 && <ProgressIndicator $progress={translationProgress} />}
        
        <ButtonGroup>
          <OptimizedButton variant="primary" onClick={() => setEditing(!editing)}>{editing ? '편집 완료' : '편집 모드'}</OptimizedButton>
          <OptimizedButton variant="secondary" onClick={() => setShowWizardModal(true)} loading={isGeneratingNotice} loadingText="생성 중..." disabled={!settings.geminiApiKey}>🪄 AI 다문화 통신문 생성 마법사</OptimizedButton>
          <OptimizedButton variant="secondary" onClick={handleTranslateAll} disabled={isTranslating || !settings.geminiApiKey} loading={isTranslating} loadingText="번역 중..." title={!settings.geminiApiKey ? 'Gemini API 키가 필요합니다' : `모든 언어로 일괄 번역 (${languages.length}개)`}>모든 언어로 번역 ({languages.length}개)</OptimizedButton>
          <OptimizedButton variant="success" onClick={() => handleGeneratePDF()} loading={isGeneratingPDF} loadingText="생성 중...">한국어 PDF</OptimizedButton>
        </ButtonGroup>

        <AIOptions>
          <label>
            <input type="checkbox" checked={useEasyKorean} onChange={(e) => setUseEasyKorean(e.target.checked)} disabled={!settings.geminiApiKey} />
            ✨ AI로 쉬운 한국어 변환 (번역 전 적용)
          </label>
          <label>
            <input type="checkbox" checked={addExtraNotes} onChange={(e) => setAddExtraNotes(e.target.checked)} disabled={!settings.geminiApiKey} />
            ✨ AI로 문화/용어 해설 추가 (번역 전 적용)
          </label>
        </AIOptions>
        
        <div>
          <span style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>개별 번역 ({completedTranslations}/{languages.length} 완료) {settings.geminiApiKey && <span style={{ color: '#28a745', marginLeft: '8px' }}>✨ Gemini AI 활성화</span>}</span>
          <LanguageSelector>
            <LanguageDropdown value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} disabled={isTranslating || !settings.geminiApiKey}>
              <option value="">번역할 언어를 선택하세요</option>
              {languages.map(language => <option key={language.code} value={language.code}>{language.name} {translatedNotices[language.code] ? '✓' : ''}</option>)}
            </LanguageDropdown>
            <TranslateButton variant={selectedLanguage && translatedNotices[selectedLanguage] ? 'success' : 'primary'} onClick={() => selectedLanguage && handleTranslate(selectedLanguage)} disabled={!selectedLanguage || isTranslating || !settings.geminiApiKey}>
              {isTranslating ? '번역 중...' : selectedLanguage && translatedNotices[selectedLanguage] ? '번역 완료 ✓' : '번역하기'}
            </TranslateButton>
          </LanguageSelector>
        </div>
      </ControlPanel>

      <MainContent>
        <InputSection>
          <Suspense fallback={<LoadingSpinner center padding="20px" text="요약 정보 로딩 중..." />}>
            <SummaryBox keyInfo={keyInfo} isLoading={isAnalyzing} />
          </Suspense>
          <NoticeContainer ref={noticeRef}>
            <Suspense fallback={<LoadingSpinner center padding="40px" text="로딩 중..." />}>
              <NoticeHeader data={noticeData} onChange={handleNoticeDataChange} editing={editing} />
              <NoticeContent data={noticeData} onChange={handleNoticeDataChange} editing={editing} />
              <NoticeFooter data={noticeData} onChange={handleNoticeDataChange} editing={editing} />
            </Suspense>
          </NoticeContainer>

          {Object.entries(translatedNotices).map(([languageCode, translatedData]) => {
            const language = languages.find(lang => lang.code === languageCode);
            return (
              <NoticeContainer key={languageCode} ref={el => translatedNoticeRefs.current[languageCode] = el}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <NoticeTitle style={{ margin: 0 }}>🌍 {language?.name}</NoticeTitle>
                  <OptimizedButton variant="success" onClick={() => handleGeneratePDF(languageCode)} loading={isGeneratingPDF} loadingText="생성 중...">PDF 생성</OptimizedButton>
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
              <p>AI가 번역한 통신문이 여기에 표시됩니다.</p>
            </EmptyState>
          )}
        </InputSection>
      </MainContent>

      {showSettingsModal && (
        <Suspense fallback={<LoadingSpinner center padding="40px" text="설정 로딩 중..." />}>
          <SettingsModal 
            isOpen={showSettingsModal} 
            onClose={() => setShowSettingsModal(false)} 
            settings={settings} 
            onSave={handleSettingsChange} 
          />
        </Suspense>
      )}

      {templateAnalysis && <TemplateAnalysisDisplay analysis={templateAnalysis} />}

      {showWizardModal && (
        <Suspense fallback={<LoadingSpinner center padding="40px" text="마법사 로딩 중..." />}>
          <NoticeWizardModal isOpen={showWizardModal} onClose={() => setShowWizardModal(false)} onGenerate={handleGenerateNotice} apiKey={settings.geminiApiKey} />
        </Suspense>
      )}

      <Footer>
        © 2025 김문정(안양박달초) | <a href="https://www.youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v" target="_blank" rel="noopener noreferrer">유튜브 배윰의 달인</a>
      </Footer>
    </AppContainer>
  );
};

export default NoticeGenerator;