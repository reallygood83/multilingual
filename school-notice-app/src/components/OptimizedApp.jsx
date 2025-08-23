import React, { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import styled from 'styled-components';
import OptimizedButton from './OptimizedButton';
import StatusMessage from './StatusMessage';
import LoadingSpinner from './LoadingSpinner';
// Remove A4 preview import
// import A4PreviewPanel from './A4PreviewPanel';
import TemplateAnalysisDisplay from './TemplateAnalysisDisplay';
import { usePerformanceMonitor, useDebounce } from '../hooks/usePerformanceMonitor';
import { translateNoticeData, checkAPIHealth } from '../services/translationService';
import { generatePDFFromElement, generateCleanA4PDF } from '../services/pdfService';
import { analyzePDFTemplate, translateWithGemini } from '../services/geminiService';
import { generateNoticeWithAI } from '../services/noticeGenerationService';
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
const NoticeWizardModal = lazy(() => import('./NoticeWizardModal'));

const AppContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  font-family: 'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  will-change: scroll-position;
`;

const MainContent = styled.main`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-top: 20px;
`;

const InputSection = styled.div`
  flex: 1;
  max-width: 800px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;


const ControlPanel = styled.div`
  position: sticky;
  top: 0;
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  border: 1px solid #e0e0e0;
`;

const Title = styled.h2`
  margin: 0 0 20px 0;
  color: #333333;
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
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
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
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const LanguageDropdown = styled.select`
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
  
  &:hover {
    border-color: #3498db;
  }
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  background: #ffffff;
  color: #24292f;
  
  &.primary {
    background: #0969da;
    color: white;
    border-color: #0969da;
    
    &:hover {
      background: #0860ca;
      border-color: #0860ca;
    }
  }
  
  &.secondary {
    background: #f6f8fa;
    color: #24292f;
    border-color: #d0d7de;
    
    &:hover {
      background: #f3f4f6;
      border-color: #d0d7de;
    }
  }
  
  &.success {
    background: #1a7f37;
    color: white;
    border-color: #1a7f37;
    
    &:hover {
      background: #1a7f37;
      border-color: #1a7f37;
    }
  }
  
  &:disabled {
    background: #f6f8fa;
    color: #8c959f;
    border-color: #d0d7de;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const TranslateButton = styled(OptimizedButton)`
  min-width: 120px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
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

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin: 8px 0;

  &::after {
    content: '';
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #007bff, #0056b3);
    width: ${props => props.$progress || 0}%;
    transition: width 0.3s ease;
  }
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

const OptimizedApp = () => {
  const { measureOperation } = usePerformanceMonitor('OptimizedApp');
  
  // Core state
  const [noticeData, setNoticeData] = useState(() => ({
    ...DEFAULT_NOTICE_DATA,
    content: ''
  }));

  const [translatedNotices, setTranslatedNotices] = useState({});
  const [editing, setEditing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [lastError, setLastError] = useState(null);
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
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [isGeneratingNotice, setIsGeneratingNotice] = useState(false);

  // Refs for PDF generation
  const noticeRef = useRef(null);
  const translatedNoticeRefs = useRef({});

  // Memoized values
  const languages = useMemo(() => SUPPORTED_LANGUAGES, []);
  const completedTranslations = useMemo(() => Object.keys(translatedNotices).length, [translatedNotices]);
  const debouncedNoticeData = useDebounce(noticeData, 500);

  // Optimized message display with auto-clear
  const showMessage = useCallback((text, type = 'info', duration = 3000) => {
    setStatusMessage({ text, type });
    
    const timer = setTimeout(() => {
      setStatusMessage(null);
    }, duration);
    
    return () => clearTimeout(timer);
  }, []);

  // Enhanced notice data validation and sanitization with performance monitoring
  const handleNoticeDataChange = useCallback((newData) => {
    return measureOperation('handleNoticeDataChange', () => {
      const validationErrors = validateNoticeData(newData);
      
      if (validationErrors.length > 0) {
        // During field editing, don't block updates; just log a warning to avoid interrupting UX
        console.warn('Notice data validation warnings (non-blocking):', validationErrors);
        // Avoid noisy toasts while typing; final actions (translate/PDF) perform strict validation elsewhere
      }
      
      setNoticeData(newData);
    })();
  }, [measureOperation, showMessage]);

  // Settings handlers
  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

  // Auto-fill school information when settings change
  useEffect(() => {
    if (settings.schoolName || settings.schoolAddress || settings.schoolPhone) {
      setNoticeData(prevData => ({
        ...prevData,
        school: settings.schoolName || prevData.school,
        year: settings.schoolYear || prevData.year,
        publisher: settings.publisher || prevData.publisher,
        manager: settings.manager || prevData.manager,
        phone: settings.schoolPhone || prevData.phone,
        address: settings.schoolAddress || prevData.address
      }));
    }
  }, [settings.schoolName, settings.schoolYear, settings.schoolAddress, settings.schoolPhone, settings.publisher, settings.manager, settings.managerEmail]);

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
      setTranslationProgress(0);
      try {
        showMessage(`${languageName}로 번역 중입니다...`, 'info');
        
        // 진행률 시뮬레이션
        const progressInterval = setInterval(() => {
          setTranslationProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + Math.random() * 15;
          });
        }, 200);
        
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
        
        clearInterval(progressInterval);
        setTranslationProgress(100);
        
        setTranslatedNotices(prev => ({
          ...prev,
          [targetLanguage]: translatedData
        }));
        
        showMessage(`✅ ${languageName} 번역이 완료되었습니다!`, 'success');
        
        // 완료 후 잠시 후 진행률 초기화
        setTimeout(() => {
          setTranslationProgress(0);
        }, 2000);
      } catch (error) {
        console.error('Translation error:', error);
        const errorMessage = error.message || '번역 중 알 수 없는 오류가 발생했습니다.';
        showMessage(`❌ ${errorMessage}`, 'error', 5000);
        setTranslationProgress(0);
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

  // AI notice generation handler
  const handleGenerateNotice = useCallback(async (formData) => {
    // Guard: require Gemini API key
    if (!settings?.geminiApiKey) {
      showMessage('설정에서 Gemini API 키를 먼저 입력해주세요.', 'error');
      setShowSettings(true);
      throw new Error('Missing Gemini API key');
    }

    setIsGeneratingNotice(true);
    try {
      showMessage('AI가 통신문을 생성하고 있습니다...', 'info');
      
      const result = await generateNoticeWithAI(formData, settings.geminiApiKey);
      const generatedHtml = result?.data?.content || '';
      if (!result?.success || !generatedHtml) {
        throw new Error(result?.error || '통신문 생성에 실패했습니다.');
      }
      
      // Update notice data with generated content
      const newNoticeData = {
        ...noticeData,
        content: generatedHtml
      };
      
      setNoticeData(newNoticeData);
      setShowWizardModal(false);
      // Auto-switch to editing mode and focus the editor so the user can immediately refine the AI result
      setEditing(true);
      setTimeout(() => {
        if (noticeRef.current) {
          noticeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const editorEl = noticeRef.current.querySelector('.ql-editor');
          if (editorEl) editorEl.focus();
        }
      }, 0);
      showMessage('AI 통신문이 성공적으로 생성되었습니다!', 'success');
    } catch (error) {
      console.error('AI notice generation error:', error);
      showMessage('통신문 생성 중 오류가 발생했습니다. API 키를 확인해주세요.', 'error');
    } finally {
      setIsGeneratingNotice(false);
    }
  }, [noticeData, settings?.geminiApiKey, showMessage, setEditing, setShowSettings]);

  // PDF generation with performance monitoring
  const handleGeneratePDF = useCallback((language = null) => {
    return measureOperation('handleGeneratePDF', async () => {
      setIsGeneratingPDF(true);
      try {
        if (language) {
          const element = translatedNoticeRefs.current[language];
          if (element) {
            const filename = `notice_${language}.pdf`;
            await generateCleanA4PDF(element, filename.replace('.pdf', '_clean.pdf'));
            const languageName = languages.find(lang => lang.code === language)?.name;
            showMessage(`${languageName} PDF가 생성되었습니다.`, 'success');
          }
        } else {
          await generateCleanA4PDF(noticeRef.current, 'notice_korean_clean.pdf');
          showMessage('깔끔한 한국어 PDF가 생성되었습니다.', 'success');
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
        
        <APIStatus>
          <StatusIndicator $status={apiStatus} />
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
            {apiStatus !== 'connected' && !settings.geminiApiKey && (
              <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                💡 번역 기능을 사용하려면 설정에서 Gemini API 키를 입력해주세요.
              </div>
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
        
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={setSettings}
          onTemplateUpload={handleTemplateUpload}
        />
        
        {isTranslating && translationProgress > 0 && (
          <ProgressIndicator $progress={translationProgress} />
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
            onClick={() => setShowWizardModal(true)}
            loading={isGeneratingNotice}
            loadingText="생성 중..."
            disabled={!settings.geminiApiKey}
          >
            🪄 AI 통신문 마법사
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
          <LanguageSelector>
            <LanguageDropdown
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={isTranslating || (apiStatus !== 'connected' && !settings.geminiApiKey)}
            title={
              isTranslating 
                ? '번역이 진행 중입니다. 잠시만 기다려주세요.' 
                : (apiStatus !== 'connected' && !settings.geminiApiKey)
                  ? 'API 연결이 필요합니다. 설정에서 Gemini API 키를 입력해주세요.'
                  : '번역할 언어를 선택해주세요'
            }
          >
              <option value="">번역할 언어를 선택하세요</option>
              {languages.map(language => (
                <option key={language.code} value={language.code}>
                  {language.name} {translatedNotices[language.code] ? '✓' : ''}
                </option>
              ))}
            </LanguageDropdown>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <TranslateButton
                variant={selectedLanguage && translatedNotices[selectedLanguage] ? 'success' : 'primary'}
                onClick={() => selectedLanguage && handleTranslate(selectedLanguage)}
                disabled={!selectedLanguage || isTranslating || (apiStatus !== 'connected' && !settings.geminiApiKey)}
                title={
                  !selectedLanguage 
                    ? '먼저 번역할 언어를 선택해주세요'
                    : isTranslating
                      ? '번역이 진행 중입니다. 잠시만 기다려주세요.'
                      : (apiStatus !== 'connected' && !settings.geminiApiKey)
                        ? 'API 연결이 필요합니다. 설정에서 Gemini API 키를 입력해주세요.'
                        : translatedNotices[selectedLanguage]
                          ? `${languages.find(l => l.code === selectedLanguage)?.name} 번역이 완료되었습니다. 다시 번역하려면 클릭하세요.`
                          : `${languages.find(l => l.code === selectedLanguage)?.name}로 번역을 시작합니다`
                }
              >
                {isTranslating ? '번역 중...' : selectedLanguage && translatedNotices[selectedLanguage] ? '번역 완료 ✓' : '번역하기'}
              </TranslateButton>
              
              {isTranslating && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6c757d' }}>
                    <span>번역 진행률</span>
                    <span>{Math.round(translationProgress)}%</span>
                  </div>
                  <ProgressIndicator $progress={translationProgress} />
                  <button
                    onClick={() => {
                      setIsTranslating(false);
                      setTranslationProgress(0);
                      setStatusMessage({ type: 'info', text: '번역이 취소되었습니다.' });
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid #dc3545',
                      color: '#dc3545',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      alignSelf: 'flex-start'
                    }}
                  >
                    번역 취소
                  </button>
                </div>
              )}
            </div>
          </LanguageSelector>
        </div>
      </ControlPanel>

      <MainContent>
        <InputSection>
          {/* Original Korean Notice */}
          <NoticeContainer ref={noticeRef}>
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
              <p>AI가 번역한 통신문이 여기에 표시됩니다.</p>
              <p>상단의 번역 버튼을 클릭하여 다국어 버전을 생성해보세요.</p>
              {settings.geminiApiKey && (
                <p style={{ color: '#28a745', fontWeight: '500' }}>✨ Gemini AI 번역 활성화됨</p>
              )}
            </EmptyState>
          )}
        </InputSection>
        
      </MainContent>


      
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

      {/* Template Analysis Display */}
      {templateAnalysis && (
        <TemplateAnalysisDisplay analysis={templateAnalysis} />
      )}

      {/* AI Notice Wizard Modal */}
      {showWizardModal && (
        <Suspense fallback={<LoadingSpinner center padding="40px" text="마법사 로딩 중..." />}>
          <NoticeWizardModal
            isOpen={showWizardModal}
            onClose={() => setShowWizardModal(false)}
            onGenerate={handleGenerateNotice}
          />
        </Suspense>
      )}
    </AppContainer>
  );
};

export default OptimizedApp;