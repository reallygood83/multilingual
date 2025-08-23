/**
 * ImprovedNoticeHeader - 개선된 가정통신문 헤더 컴포넌트
 * 발행인, 담당자, 주소, 전화번호를 한 줄로 깔끔하게 정렬
 */
import React from 'react';
import styled from 'styled-components';
import { CopyButton } from './CopyButton.jsx';

const HeaderContainer = styled.div`
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  padding: var(--space-6);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  position: relative;
`;

const SchoolInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--space-2);
  }
`;

const SchoolName = styled.div`
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  opacity: 0.9;
`;

const SchoolLogo = styled.div`
  width: 80px;
  height: 60px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  opacity: 0.8;
  
  @media (max-width: 640px) {
    width: 60px;
    height: 45px;
    font-size: var(--font-size-xs);
  }
`;

const NoticeTitle = styled.h1`
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  text-align: center;
  margin: var(--space-6) 0 var(--space-8) 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-3xl);
  }
  
  @media (max-width: 480px) {
    font-size: var(--font-size-2xl);
  }
`;

// 개선된 정보 필드 컨테이너 - 한 줄로 깔끔하게 정렬
const InfoFieldsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-3);
  background: rgba(255, 255, 255, 0.1);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 200px; /* 발행인, 담당자, 주소, 전화번호 */
  }
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr 1fr; /* 2열로 정렬 */
    gap: var(--space-2);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* 1열로 정렬 */
  }
`;

const InfoField = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 36px;
  position: relative;
  
  /* 필드 구분선 (데스크톱에서만) */
  &:not(:last-child) {
    @media (min-width: 768px) {
      &::after {
        content: '';
        position: absolute;
        right: calc(-1 * var(--space-3) / 2);
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 20px;
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
`;

const FieldIcon = styled.div`
  font-size: 16px;
  opacity: 0.9;
  min-width: 20px;
  text-align: center;
`;

const FieldLabel = styled.span`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  opacity: 0.8;
  min-width: fit-content;
`;

const FieldValue = styled.div`
  background: rgba(255, 255, 255, 0.15);
  color: white;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  flex: 1;
  min-height: 32px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  /* 전화번호 필드 특별 스타일 */
  ${props => props.isPhone && `
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    font-weight: var(--font-weight-semibold);
  `}
`;

const CopyButtonContainer = styled.div`
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  
  @media (max-width: 640px) {
    position: static;
    margin-top: var(--space-4);
    text-align: center;
  }
`;

// 복사용 스타일이 적용된 복사 버튼
const StyledHeaderCopyButton = styled(CopyButton)`
  button {
    background: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.3) !important;
      border-color: rgba(255, 255, 255, 0.5) !important;
      transform: translateY(-1px);
    }
    
    &[data-copied="true"] {
      background: rgba(34, 197, 94, 0.3) !important;
      border-color: rgba(34, 197, 94, 0.5) !important;
    }
  }
`;

/**
 * 개선된 가정통신문 헤더 컴포넌트
 */
const ImprovedNoticeHeader = ({
  schoolYear = "2024학년도",
  schoolName = "OO초등학교", 
  title = "1학기 학사 운영 방안 안내",
  publisher = "교장 김나나",
  manager = "교사 김문정",
  address = "경기도 안양시",
  phone = "(031)000-0000",
  onCopy,
  className
}) => {
  // 전체 헤더 정보를 복사용 텍스트로 생성
  const generateHeaderText = () => {
    return `${schoolYear} ${schoolName}
${title}

발행인: ${publisher}
담당자: ${manager}
주소: ${address}
전화: ${phone}`;
  };

  return (
    <HeaderContainer className={className}>
      {/* 상단 학교 정보 */}
      <SchoolInfo>
        <div>
          <SchoolName>{schoolYear}</SchoolName>
          <SchoolName>{schoolName}</SchoolName>
        </div>
        <SchoolLogo>
          학교 로고
        </SchoolLogo>
      </SchoolInfo>

      {/* 공지사항 제목 */}
      <NoticeTitle>{title}</NoticeTitle>

      {/* 개선된 정보 필드들 - 한 줄로 깔끔하게 정렬 */}
      <InfoFieldsContainer>
        <InfoField>
          <FieldIcon>📋</FieldIcon>
          <FieldLabel>발행인:</FieldLabel>
          <FieldValue>{publisher}</FieldValue>
        </InfoField>

        <InfoField>
          <FieldIcon>👤</FieldIcon>
          <FieldLabel>담당자:</FieldLabel>
          <FieldValue>{manager}</FieldValue>
        </InfoField>

        <InfoField>
          <FieldIcon>📍</FieldIcon>
          <FieldLabel>주소:</FieldLabel>
          <FieldValue>{address}</FieldValue>
        </InfoField>

        <InfoField>
          <FieldIcon>☎️</FieldIcon>
          <FieldLabel>전화:</FieldLabel>
          <FieldValue isPhone={true}>{phone}</FieldValue>
        </InfoField>
      </InfoFieldsContainer>

      {/* 헤더 전체 복사 버튼 */}
      <CopyButtonContainer>
        <StyledHeaderCopyButton
          text={generateHeaderText()}
          successMessage="헤더 정보가 복사되었습니다!"
          size="sm"
          showLabel={false}
          onSuccess={onCopy}
        />
      </CopyButtonContainer>
    </HeaderContainer>
  );
};

// 사용 예제 컴포넌트
export const HeaderExample = () => {
  const handleCopy = () => {
    console.log('헤더 정보가 복사되었습니다');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', background: '#f8fafc' }}>
      <ImprovedNoticeHeader
        schoolYear="2024학년도"
        schoolName="안양 박달초등학교"
        title="1학기 학사 운영 방안 안내"
        publisher="교장 김나나"
        manager="교사 김문정"
        address="경기도 안양시 동안구"
        phone="(031)123-4567"
        onCopy={handleCopy}
      />
      
      {/* 나머지 공지사항 내용 예시 */}
      <div style={{ 
        background: 'white', 
        padding: '24px', 
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h3>공지사항 내용</h3>
        <p>이곳에 실제 공지사항 내용이 들어갑니다...</p>
      </div>
    </div>
  );
};

export default ImprovedNoticeHeader;