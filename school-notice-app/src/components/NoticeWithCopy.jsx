/**
 * NoticeWithCopy - 복사 기능이 통합된 가정통신문 컴포넌트
 * 기존 공지사항 컴포넌트에 원클릭 복사 기능을 추가
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { CopyButton, CopyableSection, CopyAllButton } from './CopyButton.jsx';

const NoticeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: var(--color-surface-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  overflow: hidden;
`;

const NoticeHeader = styled.div`
  background: linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100));
  border-bottom: 1px solid var(--color-border-default);
  padding: var(--space-6);
  text-align: center;
  position: relative;
`;

const NoticeTitle = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
  margin: 0 0 var(--space-4) 0;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-2xl);
  }
`;

const NoticeSubtitle = styled.p`
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
`;

const HeaderCopyButton = styled.div`
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  
  @media (max-width: 768px) {
    position: static;
    margin-top: var(--space-4);
    display: flex;
    justify-content: center;
  }
`;

const NoticeContent = styled.div`
  padding: var(--space-6);
`;

const NoticeInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  padding: var(--space-4);
  background: var(--color-background-secondary);
  border-radius: var(--radius-lg);
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const InfoLabel = styled.span`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
`;

const InfoValue = styled.span`
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
`;

const QuickCopyActions = styled.div`
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
  padding: var(--space-4);
  background: var(--color-accent-50);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-accent-500);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionTitle = styled.h3`
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent-700);
  margin: 0 0 var(--space-2) 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
`;

const CopyFooter = styled.div`
  background: var(--color-background-secondary);
  border-top: 1px solid var(--color-border-default);
  padding: var(--space-6);
  text-align: center;
`;

const ContactInfo = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
`;

/**
 * 가정통신문 메인 컴포넌트 (복사 기능 통합)
 */
const NoticeWithCopy = ({
  title = "가정통신문",
  subtitle,
  sender = "안양 박달초등학교",
  recipient = "학부모님",
  date = new Date().toLocaleDateString('ko-KR'),
  sections = [],
  contactInfo = "문의: 안양 박달초등학교 031-123-4567",
  className
}) => {
  const [copiedSections, setCopiedSections] = useState(new Set());

  // 빠른 복사 템플릿들
  const getQuickCopyTemplates = () => [
    {
      label: "제목만",
      content: title,
      icon: "📝"
    },
    {
      label: "발신정보",
      content: `발신: ${sender}\n수신: ${recipient}\n날짜: ${date}`,
      icon: "ℹ️"
    },
    {
      label: "연락처",
      content: contactInfo,
      icon: "📞"
    }
  ];

  // 전체 가정통신문 텍스트 생성
  const generateCompleteNotice = () => {
    let fullText = `${title}\n`;
    if (subtitle) {
      fullText += `${subtitle}\n`;
    }
    fullText += `\n발신: ${sender}\n수신: ${recipient}\n날짜: ${date}\n\n`;
    
    sections.forEach((section, index) => {
      if (section.title) {
        fullText += `■ ${section.title}\n`;
      }
      if (section.content) {
        const textContent = typeof section.content === 'string' 
          ? section.content.replace(/<[^>]*>/g, '').trim()
          : String(section.content).trim();
        fullText += `${textContent}\n\n`;
      }
    });
    
    fullText += `${contactInfo}`;
    return fullText;
  };

  const handleSectionCopy = (sectionIndex) => {
    setCopiedSections(prev => new Set([...prev, sectionIndex]));
    setTimeout(() => {
      setCopiedSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(sectionIndex);
        return newSet;
      });
    }, 2000);
  };

  return (
    <NoticeContainer className={className}>
      {/* 헤더 */}
      <NoticeHeader>
        <HeaderCopyButton>
          <CopyButton
            text={title}
            size="sm"
            successMessage="제목이 복사되었습니다!"
            showLabel={false}
          />
        </HeaderCopyButton>
        <NoticeTitle>{title}</NoticeTitle>
        {subtitle && <NoticeSubtitle>{subtitle}</NoticeSubtitle>}
      </NoticeHeader>

      <NoticeContent>
        {/* 기본 정보 */}
        <NoticeInfo>
          <InfoItem>
            <InfoLabel>발신</InfoLabel>
            <InfoValue>
              {sender}
              <CopyButton
                text={sender}
                size="sm"
                showLabel={false}
                successMessage="발신자가 복사되었습니다!"
                style={{ marginLeft: '8px' }}
              />
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>수신</InfoLabel>
            <InfoValue>
              {recipient}
              <CopyButton
                text={recipient}
                size="sm"
                showLabel={false}
                successMessage="수신자가 복사되었습니다!"
                style={{ marginLeft: '8px' }}
              />
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>작성일</InfoLabel>
            <InfoValue>
              {date}
              <CopyButton
                text={date}
                size="sm"
                showLabel={false}
                successMessage="작성일이 복사되었습니다!"
                style={{ marginLeft: '8px' }}
              />
            </InfoValue>
          </InfoItem>
        </NoticeInfo>

        {/* 빠른 복사 액션 */}
        <QuickCopyActions>
          <div style={{ flex: 1 }}>
            <ActionTitle>
              <span>🚀</span>
              빠른 복사
            </ActionTitle>
            <ActionButtons>
              {getQuickCopyTemplates().map((template, index) => (
                <CopyButton
                  key={index}
                  text={template.content}
                  size="sm"
                  successMessage={`${template.label}이(가) 복사되었습니다!`}
                  showLabel={true}
                >
                  <span>{template.icon}</span> {template.label}
                </CopyButton>
              ))}
            </ActionButtons>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CopyButton
              text={generateCompleteNotice()}
              size="md"
              variant="primary"
              successMessage="전체 가정통신문이 복사되었습니다!"
              showLabel={true}
              style={{ 
                background: 'var(--color-primary-500)',
                color: 'white',
                border: 'none',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              📄 전체 복사
            </CopyButton>
          </div>
        </QuickCopyActions>

        {/* 가정통신문 섹션들 */}
        {sections.map((section, index) => (
          <CopyableSection
            key={index}
            title={section.title}
            content={section.content}
            showCopyButton={true}
            copyButtonProps={{
              successMessage: `"${section.title}" 섹션이 복사되었습니다!`,
              onSuccess: () => handleSectionCopy(index)
            }}
          />
        ))}
      </NoticeContent>

      {/* 푸터 */}
      <CopyFooter>
        <ContactInfo>
          {contactInfo}
          <CopyButton
            text={contactInfo}
            size="sm"
            showLabel={false}
            successMessage="연락처가 복사되었습니다!"
            style={{ marginLeft: '8px' }}
          />
        </ContactInfo>
      </CopyFooter>
    </NoticeContainer>
  );
};

// 사용 예제 컴포넌트
export const NoticeExample = () => {
  const exampleSections = [
    {
      title: "학부모 상담 주간 안내",
      content: `안녕하세요. 학부모님!

2024년 2학기 학부모 상담 주간을 다음과 같이 안내드립니다.

• 상담 기간: 2024년 11월 18일(월) ~ 11월 22일(금)
• 상담 시간: 오후 2시 ~ 오후 5시
• 상담 방법: 대면 상담 또는 화상 상담
• 신청 방법: 담임교사에게 직접 연락 또는 학교 홈페이지 신청

자녀의 학교생활과 학습 상황에 대해 소통하는 소중한 시간이 되기를 바랍니다.`
    },
    {
      title: "준비물 및 유의사항", 
      content: `상담 시 준비해주실 사항:

1. 학생 생활기록부 (가정에서 확인)
2. 궁금한 사항 미리 정리
3. 자녀와의 대화 내용 공유

※ 상담 시간은 약 20분 정도 소요됩니다.
※ 급한 상담이 필요한 경우 언제든지 연락 주세요.`
    }
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc' }}>
      <NoticeWithCopy
        title="학부모 상담 주간 안내"
        subtitle="2024년 2학기"
        sender="안양 박달초등학교"
        recipient="전체 학부모님"
        date="2024년 11월 15일"
        sections={exampleSections}
        contactInfo="문의: 안양 박달초등학교 (031-123-4567) | 담임교사: 김문정 (031-123-4567)"
      />
    </div>
  );
};

export default NoticeWithCopy;