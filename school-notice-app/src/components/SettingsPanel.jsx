import React, { useState, useCallback, memo } from 'react';
import styled from 'styled-components';
import OptimizedButton from './OptimizedButton';
import StatusMessage from './StatusMessage';
import { validateApiKey, testGeminiConnection } from '../services/geminiService';

const SettingsContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 24px;
  margin: 16px 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
`;

const SettingsTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '⚙️';
    font-size: 24px;
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsSection = styled.div`
  background: rgba(255,255,255,0.7);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.05);
`;

const SectionTitle = styled.h4`
  margin: 0 0 16px 0;
  color: #34495e;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  &[type="password"] {
    font-family: monospace;
  }
  
  &::placeholder {
    color: #95a5a6;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: white;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  &::placeholder {
    color: #95a5a6;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed #3498db;
  border-radius: 12px;
  padding: 32px 20px;
  text-align: center;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, rgba(52, 152, 219, 0.02) 100%);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2980b9;
    background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(52, 152, 219, 0.05) 100%);
  }
  
  &.dragover {
    border-color: #27ae60;
    background: linear-gradient(135deg, rgba(39, 174, 96, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const UploadText = styled.p`
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
`;

const UploadSubtext = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  
  &.connected {
    background: rgba(39, 174, 96, 0.1);
    color: #27ae60;
  }
  
  &.disconnected {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
  }
  
  &.testing {
    background: rgba(243, 156, 18, 0.1);
    color: #f39c12;
  }
`;

const SettingsPanel = memo(({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange,
  onTemplateUpload 
}) => {
  const [statusMessage, setStatusMessage] = useState(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const showMessage = useCallback((text, type = 'info', duration = 3000) => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), duration);
  }, []);

  const handleInputChange = useCallback((field, value) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  }, [settings, onSettingsChange]);

  const handleApiTest = useCallback(async () => {
    if (!settings.geminiApiKey) {
      showMessage('API 키를 입력해주세요.', 'error');
      return;
    }

    if (!validateApiKey(settings.geminiApiKey)) {
      showMessage('올바른 Gemini API 키 형식이 아닙니다.', 'error');
      return;
    }

    setIsTestingApi(true);
    try {
      await testGeminiConnection(settings.geminiApiKey);
      showMessage('✅ Gemini API 연결이 성공했습니다!', 'success');
    } catch (error) {
      showMessage(`❌ API 연결 실패: ${error.message}`, 'error');
    } finally {
      setIsTestingApi(false);
    }
  }, [settings.geminiApiKey, showMessage]);

  const handleFileUpload = useCallback((file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showMessage('PDF 파일만 업로드 가능합니다.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      showMessage('파일 크기는 10MB 이하여야 합니다.', 'error');
      return;
    }

    onTemplateUpload(file);
    showMessage('템플릿 PDF가 업로드되었습니다.', 'success');
  }, [onTemplateUpload, showMessage]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  if (!isOpen) return null;

  return (
    <SettingsContainer>
      <SettingsTitle>
        시스템 설정
        <OptimizedButton
          variant="secondary"
          onClick={onClose}
          style={{ marginLeft: 'auto', fontSize: '12px', padding: '6px 12px' }}
        >
          닫기
        </OptimizedButton>
      </SettingsTitle>

      {statusMessage && (
        <StatusMessage text={statusMessage.text} type={statusMessage.type} />
      )}

      <SettingsGrid>
        {/* Gemini API 설정 */}
        <SettingsSection>
          <SectionTitle>
            🤖 Gemini API 설정
            <StatusIndicator className={settings.geminiApiKey ? 'connected' : 'disconnected'}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: 'currentColor' 
              }} />
              {settings.geminiApiKey ? 'API 키 설정됨' : 'API 키 필요'}
            </StatusIndicator>
          </SectionTitle>
          
          <InputGroup>
            <Label>Gemini API 키</Label>
            <Input
              type="password"
              value={settings.geminiApiKey || ''}
              onChange={(e) => handleInputChange('geminiApiKey', e.target.value)}
              placeholder="AIzaSy... (Google AI Studio에서 발급)"
            />
          </InputGroup>

          <ButtonGroup>
            <OptimizedButton
              variant="primary"
              onClick={handleApiTest}
              loading={isTestingApi}
              loadingText="연결 테스트 중..."
              disabled={!settings.geminiApiKey}
            >
              API 연결 테스트
            </OptimizedButton>
          </ButtonGroup>
        </SettingsSection>

        {/* 학교 정보 설정 */}
        <SettingsSection>
          <SectionTitle>🏫 학교 정보</SectionTitle>
          
          <InputGroup>
            <Label>학교명</Label>
            <Input
              type="text"
              value={settings.schoolName || ''}
              onChange={(e) => handleInputChange('schoolName', e.target.value)}
              placeholder="예: 평촌초등학교"
            />
          </InputGroup>

          <InputGroup>
            <Label>학년도</Label>
            <Input
              type="text"
              value={settings.schoolYear || ''}
              onChange={(e) => handleInputChange('schoolYear', e.target.value)}
              placeholder="예: 2024학년도"
            />
          </InputGroup>

          <InputGroup>
            <Label>주소</Label>
            <TextArea
              value={settings.schoolAddress || ''}
              onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
              placeholder="예: 경기도 안양시 동안구 ..."
            />
          </InputGroup>

          <InputGroup>
            <Label>전화번호</Label>
            <Input
              type="tel"
              value={settings.schoolPhone || ''}
              onChange={(e) => handleInputChange('schoolPhone', e.target.value)}
              placeholder="예: 031-123-4567"
            />
          </InputGroup>
        </SettingsSection>

        {/* 담당자 정보 설정 */}
        <SettingsSection>
          <SectionTitle>👤 담당자 정보</SectionTitle>
          
          <InputGroup>
            <Label>발행인 (교장)</Label>
            <Input
              type="text"
              value={settings.publisher || ''}
              onChange={(e) => handleInputChange('publisher', e.target.value)}
              placeholder="예: 교장 김나나"
            />
          </InputGroup>

          <InputGroup>
            <Label>담당자 (교사)</Label>
            <Input
              type="text"
              value={settings.manager || ''}
              onChange={(e) => handleInputChange('manager', e.target.value)}
              placeholder="예: 교사 김문정"
            />
          </InputGroup>

          <InputGroup>
            <Label>담당자 이메일</Label>
            <Input
              type="email"
              value={settings.managerEmail || ''}
              onChange={(e) => handleInputChange('managerEmail', e.target.value)}
              placeholder="예: teacher@school.edu"
            />
          </InputGroup>
        </SettingsSection>


      </SettingsGrid>

      <ButtonGroup style={{ marginTop: '24px', justifyContent: 'center' }}>
        <OptimizedButton
          variant="success"
          onClick={() => {
            showMessage('설정이 저장되었습니다.', 'success');
            localStorage.setItem('schoolNoticeSettings', JSON.stringify(settings));
          }}
        >
          설정 저장
        </OptimizedButton>
        
        <OptimizedButton
          variant="secondary"
          onClick={() => {
            const defaultSettings = {
              schoolName: 'OO초등학교',
              schoolYear: '2024학년도',
              publisher: '교장 김나나',
              manager: '교사 김문정'
            };
            onSettingsChange(defaultSettings);
            showMessage('기본값으로 초기화되었습니다.', 'info');
          }}
        >
          기본값 복원
        </OptimizedButton>
      </ButtonGroup>
    </SettingsContainer>
  );
});

SettingsPanel.displayName = 'SettingsPanel';

export default SettingsPanel;