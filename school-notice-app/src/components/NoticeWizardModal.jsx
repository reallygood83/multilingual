import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    color: #333;
  }
`;

const WizardStep = styled.div`
  margin-bottom: 24px;
`;

const StepTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 18px;
  font-weight: 500;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const CategoryCard = styled.button`
  padding: 16px;
  border: 2px solid ${props => props.$selected ? '#0969da' : '#e9ecef'};
  border-radius: 8px;
  background: ${props => props.$selected ? '#f0f8ff' : 'white'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    border-color: #0969da;
    background: #f0f8ff;
  }
  
  h4 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 16px;
    font-weight: 500;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
    line-height: 1.4;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #0969da;
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #0969da;
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: #0969da;
    color: white;
    border-color: #0969da;
    
    &:hover {
      background: #0860ca;
    }
    
    &:disabled {
      background: #8c959f;
      border-color: #8c959f;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background: white;
    color: #24292f;
    
    &:hover {
      background: #f3f4f6;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const NOTICE_CATEGORIES = [
  {
    id: 'event',
    title: '학교 행사 안내',
    description: '체육대회, 학예회, 소풍 등 학교 행사 관련 통신문'
  },
  {
    id: 'academic',
    title: '학사 일정 안내',
    description: '시험 일정, 방학 안내, 개학 준비 등 학사 관련 통신문'
  },
  {
    id: 'safety',
    title: '안전 교육 안내',
    description: '교통안전, 생활안전, 재난대비 등 안전 관련 통신문'
  },
  {
    id: 'health',
    title: '보건 관련 안내',
    description: '건강검진, 예방접종, 감염병 예방 등 보건 관련 통신문'
  },
  {
    id: 'volunteer',
    title: '학부모 참여 안내',
    description: '자원봉사, 학부모 회의, 상담 등 학부모 참여 관련 통신문'
  },
  {
    id: 'general',
    title: '일반 공지사항',
    description: '기타 학교 운영 관련 일반적인 공지사항'
  }
];

const NoticeWizardModal = ({ isOpen, onClose, onGenerate }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    targetAudience: '',
    keyDetails: '',
    additionalInfo: '',
    attachmentDescription: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedCategory || !formData.title || !formData.purpose) {
      alert('카테고리, 제목, 목적은 필수 입력 항목입니다.');
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerate({
        category: selectedCategory,
        ...formData
      });
      onClose();
    } catch (error) {
      console.error('통신문 생성 중 오류:', error);
      alert('통신문 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedCategory, formData, onGenerate, onClose]);

  const handleClose = useCallback(() => {
    if (!isGenerating) {
      setSelectedCategory('');
      setFormData({
        title: '',
        purpose: '',
        targetAudience: '',
        keyDetails: '',
        additionalInfo: '',
        attachmentDescription: ''
      });
      onClose();
    }
  }, [isGenerating, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            🪄 AI 통신문 작성 마법사
          </ModalTitle>
          <CloseButton onClick={handleClose} disabled={isGenerating}>
            ×
          </CloseButton>
        </ModalHeader>

        <WizardStep>
          <StepTitle>1. 통신문 카테고리 선택</StepTitle>
          <CategoryGrid>
            {NOTICE_CATEGORIES.map(category => (
              <CategoryCard
                key={category.id}
                $selected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
                disabled={isGenerating}
              >
                <h4>{category.title}</h4>
                <p>{category.description}</p>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </WizardStep>

        <WizardStep>
          <StepTitle>2. 기본 정보 입력</StepTitle>
          
          <FormGroup>
            <Label>통신문 제목 *</Label>
            <Input
              type="text"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder="예: 2025년 봄 소풍 안내"
              disabled={isGenerating}
            />
          </FormGroup>

          <FormGroup>
            <Label>통신문 목적 *</Label>
            <TextArea
              value={formData.purpose}
              onChange={e => handleInputChange('purpose', e.target.value)}
              placeholder="예: 봄 소풍 일정과 준비물을 안내하고 참가 의사를 확인하기 위함"
              disabled={isGenerating}
            />
          </FormGroup>

          <FormGroup>
            <Label>대상 학부모</Label>
            <Input
              type="text"
              value={formData.targetAudience}
              onChange={e => handleInputChange('targetAudience', e.target.value)}
              placeholder="예: 3학년 학부모님, 전체 학부모님"
              disabled={isGenerating}
            />
          </FormGroup>

          <FormGroup>
            <Label>주요 내용</Label>
            <TextArea
              value={formData.keyDetails}
              onChange={e => handleInputChange('keyDetails', e.target.value)}
              placeholder="예: 일시, 장소, 준비물, 비용, 일정 등 포함할 주요 내용을 입력하세요"
              disabled={isGenerating}
            />
          </FormGroup>

          <FormGroup>
            <Label>추가 정보</Label>
            <TextArea
              value={formData.additionalInfo}
              onChange={e => handleInputChange('additionalInfo', e.target.value)}
              placeholder="예: 특별 주의사항, 연락처, 기타 안내사항"
              disabled={isGenerating}
            />
          </FormGroup>
          <FormGroup>
            <Label>첨부파일 설명</Label>
            <TextArea
              value={formData.attachmentDescription}
              onChange={e => handleInputChange('attachmentDescription', e.target.value)}
              placeholder="예: 붙임- 신청서 1부, 개인정보동의서 1부 등"
              disabled={isGenerating}
            />
          </FormGroup>
        </WizardStep>

        <ButtonGroup>
          <Button 
            type="button" 
            className="secondary" 
            onClick={handleClose}
            disabled={isGenerating}
          >
            취소
          </Button>
          <Button 
            type="button" 
            className="primary" 
            onClick={handleGenerate}
            disabled={isGenerating || !selectedCategory || !formData.title || !formData.purpose}
          >
            {isGenerating && <LoadingSpinner />}
            {isGenerating ? 'AI가 작성 중...' : '통신문 생성하기'}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

NoticeWizardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired
};

export default NoticeWizardModal;