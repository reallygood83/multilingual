import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { generateProfessionalNotice, getProfessionalCategories } from '../services/professionalNoticeService';
import { useToast } from './modern/ToastSystem';

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

// Professional notice categories from professionalNoticeService
const PROFESSIONAL_CATEGORIES = [
  {
    id: 'individual_feedback',
    title: '📚 개별 학생 성적통지표',
    description: '개별 학생의 성장과 발달을 담은 맞춤형 통신문',
    icon: '📊',
    fields: ['studentName', 'grade', 'classNumber', 'evaluationPeriod', 'learningAttitude', 'personalityTraits', 'academicAchievement', 'peerRelationship', 'specialActivities', 'improvementAreas']
  },
  {
    id: 'semester_summary',
    title: '🎓 학기말 종합 통신문',
    description: '한 학기를 마무리하는 종합적인 학급 통신문',
    icon: '📋',
    fields: ['grade', 'classNumber', 'semester', 'majorActivities', 'classCharacteristics', 'achievements', 'gratitudeTargets']
  },
  {
    id: 'event_announcement',
    title: '🎪 학교 행사 안내문',
    description: '학교 행사에 대한 전문적이고 상세한 안내',
    icon: '📅',
    fields: ['eventName', 'eventDate', 'eventLocation', 'targetParticipants', 'eventPurpose', 'requiredItems', 'eventSchedule', 'precautions', 'participationMethod']
  },
  {
    id: 'home_education_guide',
    title: '🏠 가정 연계 교육 안내문',
    description: '가정에서의 교육 협력을 위한 전문적 가이드',
    icon: '👨‍👩‍👧‍👦',
    fields: ['educationTopic', 'educationGoals', 'targetAge', 'duration', 'homeActivities', 'precautions', 'expectedOutcomes']
  },
  {
    id: 'life_guidance',
    title: '🌱 생활지도 협력 안내문',
    description: '학생 생활지도를 위한 가정-학교 협력 안내',
    icon: '🤝',
    fields: ['guidanceTopic', 'currentSituation', 'guidanceGoals', 'specificMethods', 'homeCooperation', 'expectedResults']
  },
  {
    id: 'safety_education',
    title: '🛡️ 안전 교육 안내문',
    description: '학생 안전을 위한 전문적이고 체계적인 안내',
    icon: '🚸',
    fields: ['safetyTopic', 'educationBackground', 'educationContent', 'practicalMethods', 'riskFactors', 'preventionRules', 'emergencyResponse']
  }
];

// Field labels for Korean UI
const FIELD_LABELS = {
  studentName: '학생명',
  grade: '학년',
  classNumber: '반',
  evaluationPeriod: '평가 기간',
  learningAttitude: '학습 태도',
  personalityTraits: '성격 및 특성',
  academicAchievement: '학업 성취',
  peerRelationship: '교우 관계',
  specialActivities: '특별 활동',
  improvementAreas: '개선이 필요한 부분',
  semester: '학기',
  majorActivities: '주요 활동',
  classCharacteristics: '학급 특성',
  achievements: '성과 및 성장',
  gratitudeTargets: '감사 인사 대상',
  eventName: '행사명',
  eventDate: '일시',
  eventLocation: '장소',
  targetParticipants: '대상',
  eventPurpose: '목적 및 의미',
  requiredItems: '준비물',
  eventSchedule: '일정표',
  precautions: '주의사항',
  participationMethod: '참여 방법',
  educationTopic: '주제명',
  educationGoals: '교육 목표',
  targetAge: '대상 연령',
  duration: '기간',
  homeActivities: '가정에서 할 수 있는 활동',
  expectedOutcomes: '기대 효과',
  guidanceTopic: '지도 주제',
  currentSituation: '현재 상황',
  guidanceGoals: '목표',
  specificMethods: '구체적 방법',
  homeCooperation: '가정 협력 사항',
  expectedResults: '기대 효과',
  safetyTopic: '교육 주제',
  educationBackground: '교육 배경',
  educationContent: '교육 내용',
  practicalMethods: '실천 방법',
  riskFactors: '위험 요소',
  preventionRules: '예방 수칙',
  emergencyResponse: '비상시 대처법'
};

// Field placeholders for better user experience
const FIELD_PLACEHOLDERS = {
  studentName: '홍길동',
  grade: '3',
  classNumber: '2',
  evaluationPeriod: '2025년 1학기',
  learningAttitude: '수업에 적극적으로 참여하며 질문을 자주 합니다.',
  personalityTraits: '밝고 활발한 성격으로 친구들과 잘 어울립니다.',
  academicAchievement: '국어와 수학에서 우수한 성취를 보이고 있습니다.',
  peerRelationship: '친구들과 사이좋게 지내며 협력을 잘 합니다.',
  specialActivities: '학급 회장 활동, 환경 보호 동아리 참여',
  improvementAreas: '발표할 때 목소리를 좀 더 크게 하면 좋겠습니다.',
  semester: '2025년 1학기',
  majorActivities: '체육대회, 학예회, 현장체험학습, 독서활동',
  classCharacteristics: '서로 도우며 함께 성장하는 따뜻한 학급 분위기',
  achievements: '학급 전체의 학습 분위기 개선, 친구 간 배려 문화 정착',
  gratitudeTargets: '학부모님들의 적극적인 참여와 협조',
  eventName: '2025년 봄 가족 체육대회',
  eventDate: '2025년 5월 15일(토) 오전 9시 ~ 오후 2시',
  eventLocation: '학교 운동장 (우천 시: 체육관)',
  targetParticipants: '전교생 및 학부모님',
  eventPurpose: '가족과 함께하는 즐거운 시간을 통해 유대감 증진',
  requiredItems: '편한 복장, 돗자리, 물병',
  eventSchedule: '9:00 개회식, 9:30-11:30 경기, 12:00-13:00 점심, 13:00-14:00 마무리',
  precautions: '안전사고 주의, 코로나19 방역수칙 준수',
  participationMethod: '학급별 신청서 제출 (마감: 5월 10일)',
  educationTopic: '독서 습관 기르기',
  educationGoals: '매일 30분 이상 독서하는 습관 형성',
  targetAge: '초등학교 3학년',
  duration: '4주간',
  homeActivities: '가족이 함께 책 읽기, 독서 일기 쓰기, 도서관 방문',
  expectedOutcomes: '집중력 향상, 어휘력 증진, 상상력 발달',
  guidanceTopic: '스마트폰 사용 습관 개선',
  currentSituation: '학생들의 과도한 스마트폰 사용으로 인한 학습 집중력 저하',
  guidanceGoals: '건전한 스마트폰 사용 습관 형성',
  specificMethods: '사용 시간 제한, 학습 시간 중 보관, 가족 규칙 만들기',
  homeCooperation: '가정에서도 일관된 규칙 적용, 대안 활동 제공',
  expectedResults: '학습 집중력 향상, 가족 소통 시간 증가',
  safetyTopic: '교통안전 교육',
  educationBackground: '등하교 시 교통사고 예방의 필요성',
  educationContent: '횡단보도 안전하게 건너기, 자전거 안전 수칙',
  practicalMethods: '등하교 안전 지도, 교통안전 체험 활동',
  riskFactors: '무단횡단, 신호 무시, 안전장비 미착용',
  preventionRules: '좌우 확인 후 횡단, 안전모 착용, 보호자 동반',
  emergencyResponse: '119신고, 응급처치 요령, 학교 연락체계'
};

const NoticeWizardModal = ({ isOpen, onClose, onGenerate, apiKey }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [schoolLevel, setSchoolLevel] = useState('elementary');
  const [formData, setFormData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();
  
  // Get current category details
  const currentCategory = PROFESSIONAL_CATEGORIES.find(cat => cat.id === selectedCategory);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedCategory) {
      toast.showWarning('카테고리를 선택해주세요.');
      return;
    }

    // Check if required fields are filled
    const requiredFields = currentCategory?.fields?.slice(0, 3) || []; // First 3 fields are usually required
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(field => FIELD_LABELS[field]).join(', ');
      toast.showWarning(`필수 입력 항목을 채워주세요: ${missingLabels}`);
      return;
    }

    // Validate API key before attempting generation
    if (!apiKey || apiKey.trim() === '') {
      toast.showError(
        'Gemini API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.',
        { duration: 5000 }
      );
      return;
    }

    // Import validateApiKey here to avoid circular dependencies
    const { validateApiKey } = await import('../services/geminiService');
    if (!validateApiKey(apiKey)) {
      toast.showError(
        '유효하지 않은 Gemini API 키입니다. 설정에서 올바른 API 키를 입력해주세요.',
        { duration: 5000 }
      );
      return;
    }

    setIsGenerating(true);
    toast.showProgress('AI가 전문적인 통신문을 작성하고 있습니다...', { id: 'generating' });
    
    try {
      const result = await generateProfessionalNotice({
        category: selectedCategory,
        schoolLevel,
        ...formData
      }, apiKey);

      if (result.success) {
        toast.removeToast('generating');
        toast.showSuccess('전문적인 통신문이 성공적으로 생성되었습니다!');
        
        // Call the onGenerate prop with the professional result
        await onGenerate(result.data);
        onClose();
      } else {
        throw new Error(result.error || '통신문 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Professional notice generation failed:', error);
      toast.removeToast('generating');
      
      let errorMessage = '통신문 생성 중 오류가 발생했습니다.';
      if (error.message?.includes('Invalid API key') || error.message?.includes('API key')) {
        errorMessage = 'API 키가 유효하지 않습니다. 설정에서 올바른 Gemini API 키를 확인해주세요.';
      } else if (error.message?.includes('quota') || error.message?.includes('429')) {
        errorMessage = 'API 사용 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.message?.includes('network') || error.message?.includes('connection')) {
        errorMessage = '네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
      } else {
        errorMessage = `통신문 생성 실패: ${error.message}`;
      }
      
      toast.showError(errorMessage, { duration: 5000 });
    } finally {
      setIsGenerating(false);
    }
  }, [selectedCategory, schoolLevel, formData, currentCategory, apiKey, onGenerate, onClose, toast]);

  const handleClose = useCallback(() => {
    if (!isGenerating) {
      setSelectedCategory('');
      setSchoolLevel('elementary');
      setFormData({});
      onClose();
    }
  }, [isGenerating, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            🪄 AI 전문 통신문 마법사
          </ModalTitle>
          <CloseButton onClick={handleClose} disabled={isGenerating}>
            ×
          </CloseButton>
        </ModalHeader>

        {(!apiKey || apiKey.trim() === '') && (
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            fontSize: '14px',
            color: '#856404'
          }}>
            ⚠️ <strong>Gemini API 키가 설정되지 않았습니다.</strong><br/>
            설정 패널에서 Gemini API 키를 입력해야 AI 통신문 생성 기능을 사용할 수 있습니다.
          </div>
        )}

        <WizardStep>
          <StepTitle>1. 통신문 카테고리 선택</StepTitle>
          <CategoryGrid>
            {PROFESSIONAL_CATEGORIES.map(category => (
              <CategoryCard
                key={category.id}
                $selected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
                disabled={isGenerating}
              >
                <h4>{category.icon} {category.title}</h4>
                <p>{category.description}</p>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </WizardStep>
        
        {selectedCategory && (
          <WizardStep>
            <StepTitle>2. 학교급 선택</StepTitle>
            <CategoryGrid style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <CategoryCard
                $selected={schoolLevel === 'elementary'}
                onClick={() => setSchoolLevel('elementary')}
                disabled={isGenerating}
              >
                <h4>🎒 초등학교</h4>
                <p>초등학생 눈높이에 맞는 따뜻하고 친근한 문체</p>
              </CategoryCard>
              <CategoryCard
                $selected={schoolLevel === 'middle'}
                onClick={() => setSchoolLevel('middle')}
                disabled={isGenerating}
              >
                <h4>📚 중학교</h4>
                <p>사춘기 특성을 이해하는 공감적 소통 문체</p>
              </CategoryCard>
              <CategoryCard
                $selected={schoolLevel === 'high'}
                onClick={() => setSchoolLevel('high')}
                disabled={isGenerating}
              >
                <h4>🎓 고등학교</h4>
                <p>진로와 미래를 고려한 진지하고 격려하는 문체</p>
              </CategoryCard>
            </CategoryGrid>
          </WizardStep>
        )}

        {currentCategory && (
          <WizardStep>
            <StepTitle>3. 세부 정보 입력</StepTitle>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
              💡 {currentCategory.description} - 필수 항목(*)을 포함하여 상세히 입력하시면 더 전문적인 통신문이 생성됩니다.
            </p>
            
            {currentCategory.fields.map((field, index) => {
              const isRequired = index < 3; // First 3 fields are required
              const isTextArea = ['learningAttitude', 'personalityTraits', 'academicAchievement', 'peerRelationship', 'specialActivities', 'improvementAreas', 'majorActivities', 'classCharacteristics', 'achievements', 'gratitudeTargets', 'eventPurpose', 'eventSchedule', 'precautions', 'homeActivities', 'expectedOutcomes', 'currentSituation', 'specificMethods', 'homeCooperation', 'expectedResults', 'educationContent', 'practicalMethods', 'riskFactors', 'preventionRules', 'emergencyResponse'].includes(field);
              
              return (
                <FormGroup key={field}>
                  <Label>
                    {FIELD_LABELS[field] || field} {isRequired && '*'}
                  </Label>
                  {isTextArea ? (
                    <TextArea
                      value={formData[field] || ''}
                      onChange={e => handleInputChange(field, e.target.value)}
                      placeholder={FIELD_PLACEHOLDERS[field] || `${FIELD_LABELS[field]}을(를) 입력하세요`}
                      disabled={isGenerating}
                      rows={3}
                    />
                  ) : (
                    <Input
                      type="text"
                      value={formData[field] || ''}
                      onChange={e => handleInputChange(field, e.target.value)}
                      placeholder={FIELD_PLACEHOLDERS[field] || `${FIELD_LABELS[field]}을(를) 입력하세요`}
                      disabled={isGenerating}
                    />
                  )}
                </FormGroup>
              );
            })}
          </WizardStep>
        )}

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
            disabled={isGenerating || !selectedCategory || !currentCategory}
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
  onGenerate: PropTypes.func.isRequired,
  apiKey: PropTypes.string
};

export default NoticeWizardModal;