import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { getCulturalEventDetails, generateNoticeFromCulturalEvent } from '../services/geminiService';
import { COUNTRIES } from '../data/worldCultureCalendar';

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// 스타일드 컴포넌트들
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  animation: ${slideIn} 0.4s ease-out;
  
  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 95vh;
    border-radius: 16px;
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 30px;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 20px 24px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

const EventTitle = styled.h2`
  margin: 0 40px 8px 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 20px;
    margin-right: 50px;
  }
`;

const EventMeta = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  opacity: 0.95;
  
  @media (max-width: 768px) {
    gap: 12px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const MetaItem = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CountryFlags = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const CountryFlag = styled.span`
  font-size: 18px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  
  .flag {
    font-size: 16px;
  }
`;

const ModalContent = styled.div`
  max-height: calc(90vh - 120px);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;

const ContentSection = styled.div`
  padding: 30px;
  
  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 2px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #7f8c8d;
  
  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e9ecef;
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 12px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fff5f5;
  color: #e53e3e;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #fed7d7;
  margin: 20px;
  text-align: center;
`;

const ContentText = styled.div`
  color: #495057;
  line-height: 1.6;
  font-size: 15px;
  
  p {
    margin: 0 0 16px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  strong {
    color: #2c3e50;
    font-weight: 600;
  }
  
  ul, ol {
    margin: 16px 0;
    padding-left: 24px;
    
    li {
      margin: 8px 0;
    }
  }
`;

const ActivityList = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 20px;
`;

const ActivityCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const ActivityTitle = styled.h4`
  color: #495057;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ActivityContent = styled.p`
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
`;

const LanguageSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
`;

const LanguageTitle = styled.h4`
  color: #495057;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PhraseList = styled.div`
  display: grid;
  gap: 12px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;

const PhraseCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  
  .original {
    font-size: 16px;
    font-weight: 500;
    color: #2c3e50;
    margin-bottom: 6px;
  }
  
  .pronunciation {
    font-size: 13px;
    color: #7f8c8d;
    font-style: italic;
    margin-bottom: 4px;
  }
  
  .meaning {
    font-size: 14px;
    color: #495057;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px 30px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  
  @media (max-width: 768px) {
    padding: 20px;
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  background: ${props => props.primary ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white'};
  color: ${props => props.primary ? 'white' : '#495057'};
  border: ${props => props.primary ? 'none' : '2px solid #e9ecef'};
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    ${props => props.primary ? '' : 'border-color: #667eea;'}
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CultureEventModal = ({ event, isOpen, onClose, apiKey, onNoticeGenerated }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatingNotice, setGeneratingNotice] = useState(false);

  // 모달이 열릴 때 이벤트 상세 정보 로드
  useEffect(() => {
    if (isOpen && event && apiKey) {
      loadEventDetails();
    }
  }, [isOpen, event, apiKey]);

  const loadEventDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const details = await getCulturalEventDetails(event, apiKey);
      setEventDetails(details);
    } catch (err) {
      console.error('Failed to load event details:', err);
      setError('문화 행사 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNotice = async () => {
    if (!eventDetails) return;
    
    setGeneratingNotice(true);
    try {
      const noticeContent = await generateNoticeFromCulturalEvent(event, eventDetails, apiKey);
      onNoticeGenerated?.(noticeContent);
      onClose();
    } catch (err) {
      console.error('Failed to generate notice:', err);
      alert('가정통신문 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setGeneratingNotice(false);
    }
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 클릭 외부 영역으로 모달 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !event) {
    return null;
  }

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <CloseButton onClick={onClose}>
            ×
          </CloseButton>
          
          <EventTitle>{event.event}</EventTitle>
          
          <EventMeta>
            <MetaItem>
              📅 {event.date}
            </MetaItem>
            
            <MetaItem>
              🏷️ {event.type}
            </MetaItem>
            
            <CountryFlags>
              {event.countries.map(countryKey => (
                <CountryFlag key={countryKey}>
                  <span className="flag">{COUNTRIES[countryKey]?.flag}</span>
                  {COUNTRIES[countryKey]?.name}
                </CountryFlag>
              ))}
            </CountryFlags>
          </EventMeta>
        </ModalHeader>

        <ModalContent>
          {loading && (
            <LoadingSpinner>
              <div className="spinner"></div>
              AI가 문화적 배경과 교육 가이드를 생성하고 있습니다...
            </LoadingSpinner>
          )}

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          {eventDetails && (
            <>
              {/* 기본 설명 섹션 */}
              <ContentSection>
                <SectionTitle>📖 문화적 배경 및 의미</SectionTitle>
                <ContentText>
                  <div dangerouslySetInnerHTML={{ __html: eventDetails.culturalBackground }} />
                </ContentText>
              </ContentSection>

              {/* 교실 적용 가이드 섹션 */}
              <ContentSection>
                <SectionTitle>🎯 교실 적용 가이드</SectionTitle>
                <ActivityList>
                  {eventDetails.classroomActivities?.map((activity, index) => (
                    <ActivityCard key={index}>
                      <ActivityTitle>{activity.grade} • {activity.subject}</ActivityTitle>
                      <ActivityContent>{activity.activity}</ActivityContent>
                    </ActivityCard>
                  ))}
                </ActivityList>
              </ContentSection>

              {/* 다문화 교육 포인트 섹션 */}
              <ContentSection>
                <SectionTitle>🌍 다문화 교육 포인트</SectionTitle>
                <ContentText>
                  <div dangerouslySetInnerHTML={{ __html: eventDetails.educationalPoints }} />
                </ContentText>
              </ContentSection>

              {/* 다국어 인사말 및 표현 섹션 */}
              {eventDetails.languagePhrases && eventDetails.languagePhrases.length > 0 && (
                <ContentSection>
                  <LanguageSection>
                    <LanguageTitle>
                      💬 관련 인사말 및 표현
                    </LanguageTitle>
                    <PhraseList>
                      {eventDetails.languagePhrases.map((phrase, index) => (
                        <PhraseCard key={index}>
                          <div className="original">{phrase.original}</div>
                          {phrase.pronunciation && (
                            <div className="pronunciation">[{phrase.pronunciation}]</div>
                          )}
                          <div className="meaning">{phrase.meaning}</div>
                        </PhraseCard>
                      ))}
                    </PhraseList>
                  </LanguageSection>
                </ContentSection>
              )}
            </>
          )}
        </ModalContent>

        {/* 액션 버튼들 */}
        <ActionButtons>
          <ActionButton onClick={onClose}>
            닫기
          </ActionButton>
          <ActionButton 
            primary
            onClick={handleGenerateNotice}
            disabled={!eventDetails || generatingNotice}
          >
            {generatingNotice ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', marginRight: '8px' }}></div>
                가정통신문 생성 중...
              </>
            ) : (
              <>
                📄 가정통신문 생성
              </>
            )}
          </ActionButton>
        </ActionButtons>
      </ModalContainer>
    </ModalOverlay>
  );
};

CultureEventModal.propTypes = {
  event: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  apiKey: PropTypes.string,
  onNoticeGenerated: PropTypes.func
};

export default CultureEventModal;