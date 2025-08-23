/**
 * HeaderDemo - 개선된 헤더 컴포넌트 데모 페이지
 * 기존 헤더와 개선된 헤더를 비교해서 보여줍니다
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import ImprovedNoticeHeader from './ImprovedNoticeHeader.jsx';
import NoticeWithCopy from './NoticeWithCopy.jsx';

const DemoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6);
  background: var(--color-background-primary);
  min-height: 100vh;
`;

const DemoTitle = styled.h1`
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
  text-align: center;
  margin-bottom: var(--space-8);
`;

const ComparisonSection = styled.div`
  margin-bottom: var(--space-12);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const HeaderExample = styled.div`
  background: var(--color-surface-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  margin-bottom: var(--space-6);
`;

const ExampleLabel = styled.div`
  background: var(--color-background-secondary);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border-default);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
`;

const ImprovementsList = styled.div`
  background: var(--color-success-50);
  border: 1px solid var(--color-success-200);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
`;

const ImprovementTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-success-700);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const ImprovementItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ImprovementIcon = styled.div`
  width: 24px;
  height: 24px;
  background: var(--color-success-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  margin-top: 2px;
  flex-shrink: 0;
`;

const ImprovementText = styled.div`
  flex: 1;
`;

const ImprovementLabel = styled.div`
  font-weight: var(--font-weight-semibold);
  color: var(--color-success-700);
  margin-bottom: var(--space-1);
`;

const ImprovementDescription = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-success-600);
  line-height: var(--line-height-relaxed);
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
`;

const FeatureCard = styled.div`
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
`;

const FeatureIcon = styled.div`
  font-size: 32px;
  margin-bottom: var(--space-3);
`;

const FeatureTitle = styled.h4`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
`;

const FeatureDescription = styled.p`
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
`;

const HeaderDemo = () => {
  const [copyCount, setCopyCount] = useState(0);

  const handleHeaderCopy = () => {
    setCopyCount(prev => prev + 1);
  };

  return (
    <DemoContainer>
      <DemoTitle>📄 개선된 가정통신문 헤더</DemoTitle>
      
      {/* 주요 개선사항 */}
      <ImprovementsList>
        <ImprovementTitle>
          <span>✨</span>
          주요 개선사항
        </ImprovementTitle>
        
        <ImprovementItem>
          <ImprovementIcon>1</ImprovementIcon>
          <ImprovementText>
            <ImprovementLabel>완벽한 한 줄 정렬</ImprovementLabel>
            <ImprovementDescription>
              발행인, 담당자, 주소, 전화번호가 그리드 시스템으로 깔끔하게 한 줄 정렬됩니다.
            </ImprovementDescription>
          </ImprovementText>
        </ImprovementItem>
        
        <ImprovementItem>
          <ImprovementIcon>2</ImprovementIcon>
          <ImprovementText>
            <ImprovementLabel>반응형 디자인</ImprovementLabel>
            <ImprovementDescription>
              데스크톱에서는 4열, 태블릿에서는 2열, 모바일에서는 1열로 자동 조정됩니다.
            </ImprovementDescription>
          </ImprovementText>
        </ImprovementItem>
        
        <ImprovementItem>
          <ImprovementIcon>3</ImprovementIcon>
          <ImprovementText>
            <ImprovementLabel>시각적 향상</ImprovementLabel>
            <ImprovementDescription>
              글래스모픽 효과, 아이콘, 구분선으로 각 필드를 명확하게 구분합니다.
            </ImprovementDescription>
          </ImprovementText>
        </ImprovementItem>
        
        <ImprovementItem>
          <ImprovementIcon>4</ImprovementIcon>
          <ImprovementText>
            <ImprovementLabel>복사 기능 통합</ImprovementLabel>
            <ImprovementDescription>
              헤더 전체 정보를 원클릭으로 복사할 수 있는 버튼이 포함되어 있습니다.
            </ImprovementDescription>
          </ImprovementText>
        </ImprovementItem>
      </ImprovementsList>

      {/* 비교 예시 */}
      <ComparisonSection>
        <SectionTitle>
          <span>🆚</span>
          기존 vs 개선된 헤더 비교
        </SectionTitle>
        
        <HeaderExample>
          <ExampleLabel>❌ 기존 헤더 (정렬 문제)</ExampleLabel>
          <NoticeWithCopy
            title="1학기 학사 운영 방안 안내"
            subtitle="2024학년도"
            sender="교장 김나나"
            recipient="교사 김문정"
            date="경기도 안양시"
            sections={[]}
            contactInfo="(031)000-0000"
          />
        </HeaderExample>

        <HeaderExample>
          <ExampleLabel>✅ 개선된 헤더 (완벽한 정렬)</ExampleLabel>
          <ImprovedNoticeHeader
            schoolYear="2024학년도"
            schoolName="안양 박달초등학교"
            title="1학기 학사 운영 방안 안내"
            publisher="교장 김나나"
            manager="교사 김문정"
            address="경기도 안양시 동안구"
            phone="(031)123-4567"
            onCopy={handleHeaderCopy}
          />
        </HeaderExample>
      </ComparisonSection>

      {/* 기능 상세 설명 */}
      <ComparisonSection>
        <SectionTitle>
          <span>🎯</span>
          개선된 헤더의 주요 기능
        </SectionTitle>
        
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>📐</FeatureIcon>
            <FeatureTitle>그리드 기반 정렬</FeatureTitle>
            <FeatureDescription>
              CSS Grid를 사용하여 모든 정보 필드가 완벽하게 정렬됩니다. 
              각 필드는 동일한 높이와 간격을 유지합니다.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>반응형 레이아웃</FeatureTitle>
            <FeatureDescription>
              화면 크기에 따라 자동으로 열 개수가 조정됩니다. 
              모바일에서도 깔끔하게 표시됩니다.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🎨</FeatureIcon>
            <FeatureTitle>글래스모픽 디자인</FeatureTitle>
            <FeatureDescription>
              backdrop-filter와 투명도를 활용한 현대적인 글래스 효과로 
              세련된 디자인을 구현했습니다.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📋</FeatureIcon>
            <FeatureTitle>원클릭 복사</FeatureTitle>
            <FeatureDescription>
              헤더의 모든 정보를 구조화된 형태로 한 번에 복사할 수 있어 
              다른 문서에서 재사용하기 편리합니다.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureTitle>시각적 구분</FeatureTitle>
            <FeatureDescription>
              각 필드마다 적절한 아이콘과 구분선을 사용하여 
              정보를 쉽게 구분할 수 있습니다.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>성능 최적화</FeatureTitle>
            <FeatureDescription>
              CSS-in-JS와 효율적인 렌더링으로 빠른 로딩 속도와 
              부드러운 애니메이션을 제공합니다.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </ComparisonSection>

      {/* 사용 통계 */}
      {copyCount > 0 && (
        <ComparisonSection>
          <SectionTitle>
            <span>📊</span>
            복사 활동 현황
          </SectionTitle>
          <div style={{ 
            background: 'var(--color-primary-50)', 
            padding: 'var(--space-4)', 
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-primary-200)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: 'var(--font-size-2xl)', 
              fontWeight: 'var(--font-weight-bold)', 
              color: 'var(--color-primary-600)',
              marginBottom: 'var(--space-2)'
            }}>
              {copyCount}
            </div>
            <div style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--color-primary-700)' 
            }}>
              헤더 복사 횟수
            </div>
          </div>
        </ComparisonSection>
      )}
    </DemoContainer>
  );
};

export default HeaderDemo;