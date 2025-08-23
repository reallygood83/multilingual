/**
 * CopyDemo - 복사 기능 데모 및 통합 예제
 * 가정통신문 복사 기능의 모든 사용 사례를 보여주는 데모 페이지
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { CopyButton, CopyableSection, CopyAllButton } from './CopyButton.jsx';
import NoticeWithCopy from './NoticeWithCopy.jsx';

const DemoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6);
  background: var(--color-background-primary);
  min-height: 100vh;
`;

const DemoHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-8);
`;

const DemoTitle = styled.h1`
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
  margin-bottom: var(--space-4);
`;

const DemoSubtitle = styled.p`
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto var(--space-6) auto;
  line-height: var(--line-height-relaxed);
`;

const DemoSection = styled.section`
  background: var(--color-surface-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-8);
  box-shadow: var(--shadow-card);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const SectionDescription = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  line-height: var(--line-height-relaxed);
`;

const ExampleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
`;

const ExampleCard = styled.div`
  padding: var(--space-4);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  background: var(--color-background-secondary);
`;

const ExampleTitle = styled.h3`
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
`;

const ExampleContent = styled.div`
  margin-bottom: var(--space-3);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

const ButtonShowcase = styled.div`
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-bottom: var(--space-4);
`;

const CodeBlock = styled.pre`
  background: var(--color-neutral-900);
  color: var(--color-neutral-100);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  overflow-x: auto;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  margin: var(--space-4) 0;
  position: relative;
`;

const CopyStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-6);
  padding: var(--space-4);
  background: var(--color-primary-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-primary-200);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
`;

const CopyDemo = () => {
  const [copyStats, setCopyStats] = useState({
    totalCopies: 0,
    successCount: 0,
    recentCopies: []
  });

  const handleCopySuccess = (type) => {
    setCopyStats(prev => ({
      totalCopies: prev.totalCopies + 1,
      successCount: prev.successCount + 1,
      recentCopies: [
        { type, timestamp: new Date() },
        ...prev.recentCopies.slice(0, 4)
      ]
    }));
  };

  const basicExamples = [
    {
      title: "기본 텍스트 복사",
      content: "안녕하세요. 학부모님! 내일은 체육대회가 있습니다.",
      description: "간단한 텍스트를 복사하는 기본 기능"
    },
    {
      title: "긴 공지사항",
      content: `학부모 상담 안내

상담 기간: 2024년 11월 18일 ~ 22일
상담 시간: 오후 2시 ~ 5시
신청 방법: 담임교사 연락

자녀의 학습 상황에 대해 상담합니다.
문의사항이 있으시면 언제든 연락 주세요.`,
      description: "여러 줄의 긴 공지사항을 한 번에 복사"
    },
    {
      title: "연락처 정보",
      content: "안양 박달초등학교\n주소: 경기도 안양시 동안구\n전화: 031-123-4567\n팩스: 031-123-4568",
      description: "학교 연락처와 주소 정보"
    },
    {
      title: "일정 정보",
      content: "• 11월 20일: 체육대회\n• 11월 25일: 학예회\n• 12월 1일: 학부모 상담\n• 12월 15일: 겨울방학식",
      description: "학교 주요 일정을 목록 형태로"
    }
  ];

  const advancedSections = [
    {
      title: "🎯 학습 목표",
      content: `이번 달 학습 목표:
1. 독서 습관 기르기 - 주 3권 이상 읽기
2. 수학 연산 능력 향상 - 구구단 완전 숙달
3. 협력 학습 참여 - 모둠 활동 적극 참여
4. 창의적 표현 - 다양한 방법으로 생각 표현하기

학부모님의 많은 관심과 격려 부탁드립니다.`
    },
    {
      title: "📅 이번 주 활동",
      content: `월요일: 아침독서, 국어(시 읽기), 수학(분수), 과학(식물관찰)
화요일: 체육(축구), 음악(동요부르기), 미술(풍경화그리기)
수요일: 사회(우리동네), 국어(일기쓰기), 수학(문제해결)
목요일: 영어(인사말), 과학실험, 창체(동아리)
금요일: 독서토론, 수학평가, 주말과제 안내`
    },
    {
      title: "📋 준비물 안내",
      content: `다음 주 준비물:
• 월요일: 색연필, 스케치북, 자
• 화요일: 체육복, 실내화
• 수요일: 사회 교과서, 색종이
• 목요일: 영어 CD, 헤드폰
• 금요일: 도서관 책 2권

※ 이름을 꼭 써서 보내주세요.
※ 분실 방지를 위해 가방에 넣어주세요.`
    }
  ];

  return (
    <DemoContainer>
      <DemoHeader>
        <DemoTitle>📋 가정통신문 복사 기능</DemoTitle>
        <DemoSubtitle>
          원클릭으로 가정통신문의 모든 내용을 복사할 수 있습니다. 
          개별 섹션부터 전체 문서까지, 필요한 부분만 골라서 복사하세요!
        </DemoSubtitle>
      </DemoHeader>

      {/* 기본 복사 버튼 예제 */}
      <DemoSection>
        <SectionTitle>
          <span>🔸</span>
          기본 복사 버튼
        </SectionTitle>
        <SectionDescription>
          다양한 크기와 스타일의 복사 버튼을 사용할 수 있습니다.
        </SectionDescription>
        
        <ButtonShowcase>
          <CopyButton 
            text="작은 버튼 예제" 
            size="sm" 
            onSuccess={() => handleCopySuccess('small')}
          />
          <CopyButton 
            text="중간 버튼 예제" 
            size="md" 
            onSuccess={() => handleCopySuccess('medium')}
          />
          <CopyButton 
            text="큰 버튼 예제" 
            size="lg" 
            onSuccess={() => handleCopySuccess('large')}
          />
          <CopyButton 
            text="아이콘만" 
            size="md" 
            showLabel={false}
            onSuccess={() => handleCopySuccess('icon-only')}
          />
        </ButtonShowcase>

        <ExampleGrid>
          {basicExamples.map((example, index) => (
            <ExampleCard key={index}>
              <ExampleTitle>{example.title}</ExampleTitle>
              <ExampleContent>{example.description}</ExampleContent>
              <CopyButton
                text={example.content}
                size="sm"
                onSuccess={() => handleCopySuccess('basic-example')}
              />
            </ExampleCard>
          ))}
        </ExampleGrid>
      </DemoSection>

      {/* 섹션별 복사 기능 */}
      <DemoSection>
        <SectionTitle>
          <span>📑</span>
          섹션별 복사 기능
        </SectionTitle>
        <SectionDescription>
          가정통신문의 각 섹션을 개별적으로 복사할 수 있습니다. 
          각 섹션 오른쪽 상단의 복사 버튼을 클릭해보세요.
        </SectionDescription>

        {advancedSections.map((section, index) => (
          <CopyableSection
            key={index}
            title={section.title}
            content={section.content}
            copyButtonProps={{
              onSuccess: () => handleCopySuccess('section')
            }}
          />
        ))}
      </DemoSection>

      {/* 완전한 가정통신문 예제 */}
      <DemoSection>
        <SectionTitle>
          <span>📄</span>
          완전한 가정통신문 예제
        </SectionTitle>
        <SectionDescription>
          실제 가정통신문과 같은 형태로 모든 복사 기능이 통합된 예제입니다.
        </SectionDescription>

        <NoticeWithCopy
          title="체육대회 안내"
          subtitle="2024년 가을 운동회"
          sender="안양 박달초등학교"
          recipient="전체 학부모님"
          date="2024년 11월 15일"
          sections={[
            {
              title: "행사 개요",
              content: `• 일시: 2024년 11월 20일(수) 오전 9시 ~ 오후 3시
• 장소: 학교 운동장 (우천 시 체육관)
• 대상: 전교생 및 학부모
• 주제: "함께하는 즐거운 운동회"`
            },
            {
              title: "세부 일정",
              content: `09:00 - 09:30  입장식 및 개회식
09:30 - 10:30  학년별 단체 경기
10:30 - 10:45  휴식 시간
10:45 - 12:00  개인 경기 및 계주
12:00 - 13:00  점심시간
13:00 - 14:30  학부모 참여 프로그램
14:30 - 15:00  시상식 및 폐회식`
            },
            {
              title: "준비사항",
              content: `• 체육복 착용 (동복 기준)
• 개인 돗자리 및 간단한 간식
• 물통 필수 지참
• 응급처치를 위한 간단한 상비약
• 우천 시 실내화 별도 준비

※ 귀중품은 가져오지 않도록 해주세요.`
            }
          ]}
          contactInfo="문의: 안양 박달초등학교 교무실 (031-123-4567) | 담임교사: 김문정"
        />
      </DemoSection>

      {/* 사용법 가이드 */}
      <DemoSection>
        <SectionTitle>
          <span>💡</span>
          사용법 가이드
        </SectionTitle>
        <SectionDescription>
          복사 기능을 효과적으로 활용하는 방법을 안내합니다.
        </SectionDescription>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-4)', background: 'var(--color-success-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-success-200)' }}>
            <h3 style={{ color: 'var(--color-success-700)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span>✅</span>
              개별 내용 복사
            </h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success-700)', lineHeight: 'var(--line-height-relaxed)' }}>
              각 섹션의 복사 버튼을 클릭하면 해당 내용만 복사됩니다. 
              필요한 부분만 골라서 다른 문서에 붙여넣기할 수 있습니다.
            </p>
          </div>

          <div style={{ padding: 'var(--space-4)', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-primary-200)' }}>
            <h3 style={{ color: 'var(--color-primary-700)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span>📄</span>
              전체 문서 복사
            </h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-700)', lineHeight: 'var(--line-height-relaxed)' }}>
              "전체 복사" 버튼을 클릭하면 가정통신문 전체가 구조적으로 정리되어 복사됩니다. 
              메모장이나 워드에 바로 붙여넣기할 수 있습니다.
            </p>
          </div>

          <div style={{ padding: 'var(--space-4)', background: 'var(--color-warning-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-warning-200)' }}>
            <h3 style={{ color: 'var(--color-warning-700)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span>🚀</span>
              빠른 복사
            </h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-warning-700)', lineHeight: 'var(--line-height-relaxed)' }}>
              자주 사용하는 정보(제목, 발신정보, 연락처)는 빠른 복사 버튼으로 
              더욱 편리하게 복사할 수 있습니다.
            </p>
          </div>
        </div>

        <CodeBlock>
{`// 복사 버튼 사용 예제
import { CopyButton } from './CopyButton';

<CopyButton
  text="복사할 내용"
  size="md"
  successMessage="복사 완료!"
  onSuccess={() => console.log('복사됨')}
/>`}
        </CodeBlock>
      </DemoSection>

      {/* 복사 통계 */}
      {copyStats.totalCopies > 0 && (
        <DemoSection>
          <SectionTitle>
            <span>📊</span>
            복사 활동 현황
          </SectionTitle>
          <CopyStats>
            <StatItem>
              <StatNumber>{copyStats.totalCopies}</StatNumber>
              <StatLabel>총 복사 횟수</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{copyStats.successCount}</StatNumber>
              <StatLabel>성공한 복사</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{Math.round((copyStats.successCount / copyStats.totalCopies) * 100)}%</StatNumber>
              <StatLabel>성공률</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{copyStats.recentCopies.length}</StatNumber>
              <StatLabel>최근 활동</StatLabel>
            </StatItem>
          </CopyStats>
        </DemoSection>
      )}
    </DemoContainer>
  );
};

export default CopyDemo;