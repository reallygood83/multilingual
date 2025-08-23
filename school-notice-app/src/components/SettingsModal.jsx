import { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: var(--surface-primary);
  border-radius: var(--radius-lg, 12px);
  box-shadow: var(--elevation-3, 0 8px 32px rgba(0, 0, 0, 0.15));
  border: 1px solid var(--neutral-200);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '⚙️';
    font-size: 24px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  
  &:hover {
    background: var(--neutral-100);
    color: var(--text-primary);
  }
`;

const ModalBody = styled.div`
  padding: 0 24px 24px 24px;
`;

const SettingGroup = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-size: 14px;
`;

const SettingInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid var(--neutral-200);
  border-radius: var(--radius-md, 8px);
  font-size: 14px;
  background: var(--surface-secondary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const SettingDescription = styled.p`
  font-size: 13px;
  color: var(--text-secondary);
  margin: 6px 0 0 0;
  line-height: 1.4;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  border-radius: var(--radius-md, 8px);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SettingsModal = memo(({ isOpen, onClose, settings, onSave }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSettings = {
      geminiApiKey: formData.get('geminiApiKey') || '',
      schoolName: formData.get('schoolName') || '',
      schoolYear: formData.get('schoolYear') || '',
      schoolAddress: formData.get('schoolAddress') || '',
      schoolPhone: formData.get('schoolPhone') || '',
      publisher: formData.get('publisher') || '',
      manager: formData.get('manager') || '',
      managerEmail: formData.get('managerEmail') || ''
    };
    onSave(newSettings);
    onClose();
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>시스템 설정</ModalTitle>
          <CloseButton onClick={onClose} type="button">
            ×
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <SettingGroup>
              <SettingLabel htmlFor="geminiApiKey">
                Google Gemini API 키
              </SettingLabel>
              <SettingInput
                type="password"
                id="geminiApiKey"
                name="geminiApiKey"
                defaultValue={settings.geminiApiKey}
                placeholder="AIzaSy..."
                autoComplete="off"
              />
              <SettingDescription>
                💡 AI 기능을 사용하려면 Gemini API 키를 입력해주세요.
                <br />
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary-500)', textDecoration: 'none' }}
                >
                  Google AI Studio에서 API 키 발급받기 →
                </a>
              </SettingDescription>
            </SettingGroup>

            <SettingGroup>
              <SettingLabel htmlFor="schoolName">
                학교명
              </SettingLabel>
              <SettingInput
                type="text"
                id="schoolName"
                name="schoolName"
                defaultValue={settings.schoolName}
                placeholder="예: 평촌초등학교"
              />
            </SettingGroup>

            <SettingGroup>
              <SettingLabel htmlFor="schoolYear">
                학년도
              </SettingLabel>
              <SettingInput
                type="text"
                id="schoolYear"
                name="schoolYear"
                defaultValue={settings.schoolYear}
                placeholder="예: 2024학년도"
              />
            </SettingGroup>

            <SettingGroup>
              <SettingLabel htmlFor="schoolAddress">
                학교 주소
              </SettingLabel>
              <SettingInput
                type="text"
                id="schoolAddress"
                name="schoolAddress"
                defaultValue={settings.schoolAddress}
                placeholder="예: 경기도 안양시 동안구 ..."
              />
            </SettingGroup>

            <SettingGroup>
              <SettingLabel htmlFor="schoolPhone">
                학교 전화번호
              </SettingLabel>
              <SettingInput
                type="tel"
                id="schoolPhone"
                name="schoolPhone"
                defaultValue={settings.schoolPhone}
                placeholder="예: 031-123-4567"
              />
            </SettingGroup>

            <SettingGroup>
              <SettingLabel htmlFor="publisher">
                발행인 (교장)
              </SettingLabel>
              <SettingInput
                type="text"
                id="publisher"
                name="publisher"
                defaultValue={settings.publisher}
                placeholder="예: 교장 김나나"
              />
            </SettingGroup>

            <SettingGroup>
              <SettingLabel htmlFor="manager">
                담당자 (교사)
              </SettingLabel>
              <SettingInput
                type="text"
                id="manager"
                name="manager"
                defaultValue={settings.manager}
                placeholder="예: 교사 김문정"
              />
            </SettingGroup>

            <SettingGroup>
              <SettingLabel htmlFor="managerEmail">
                담당자 이메일
              </SettingLabel>
              <SettingInput
                type="email"
                id="managerEmail"
                name="managerEmail"
                defaultValue={settings.managerEmail}
                placeholder="예: teacher@school.edu"
              />
            </SettingGroup>

            <SaveButton type="submit">
              설정 저장
            </SaveButton>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
});

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    geminiApiKey: PropTypes.string,
    schoolName: PropTypes.string,
    schoolYear: PropTypes.string,
    schoolAddress: PropTypes.string,
    schoolPhone: PropTypes.string,
    publisher: PropTypes.string,
    manager: PropTypes.string,
    managerEmail: PropTypes.string
  }).isRequired,
  onSave: PropTypes.func.isRequired
};

SettingsModal.displayName = 'SettingsModal';

export default SettingsModal;