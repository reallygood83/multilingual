import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

// Styled Components
const MainContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const MainTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(45deg, #ffffff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 20px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 40px 0;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ProgramGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 60px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ProgramCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    animation: ${pulse} 2s infinite;
    
    &::before {
      left: 100%;
    }
  }
  
  @media (max-width: 768px) {
    padding: 30px 20px;
    
    &:hover {
      transform: translateY(-5px) scale(1.01);
    }
  }
`;

const ProgramIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  
  @media (max-width: 768px) {
    font-size: 3rem;
    height: 60px;
  }
`;

const ProgramTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 15px 0;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const ProgramDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 25px 0;
`;

const ProgramButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
`;

const SystemRequirements = styled.section`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  margin: 40px 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const RequirementsTitle = styled.h2`
  font-size: 2rem;
  color: #1f2937;
  margin: 0 0 30px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const RequirementsContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const RequirementBox = styled.div`
  background: #f8fafc;
  padding: 25px;
  border-radius: 15px;
  
  h3 {
    color: #1f2937;
    margin: 0 0 15px 0;
    font-size: 1.2rem;
  }
  
  p {
    color: #6b7280;
    line-height: 1.6;
    margin: 0 0 15px 0;
  }
  
  ul {
    color: #6b7280;
    padding-left: 20px;
    margin: 0;
    
    li {
      margin-bottom: 5px;
    }
  }
`;

const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: 15px;
  
  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  
  p {
    margin: 0 0 10px 0;
    color: rgba(255, 255, 255, 1);
  }
  
  a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const GlocalEduMainPage = ({ onProgramSelect }) => {
  const programs = [
    {
      id: 'notice_generator',
      icon: '📝',
      title: 'AI 다국어 가정통신문',
      description: 'AI를 활용하여 다양한 언어로 가정통신문을 생성하고 번역합니다. 다문화 가정과의 소통을 원활하게 합니다.',
      color: '#3b82f6'
    },
    {
      id: 'culture_calendar',
      icon: '📅',
      title: '세계 문화 캘린더',
      description: '전 세계 문화 행사와 기념일을 확인하고 교육 자료로 활용할 수 있는 문화 캘린더입니다.',
      color: '#8b5cf6'
    },
    {
      id: 'world_culture_calendar',
      icon: '🌍',
      title: '다문화 캘린더',
      description: '다양한 국가의 문화와 전통을 학습하고 교실에서 활용할 수 있는 종합적인 문화 교육 도구입니다.',
      color: '#10b981'
    }
  ];

  return (
    <MainContainer>
      <ContentWrapper>
        <Header>
          <MainTitle>Glocal Edu</MainTitle>
          <Subtitle>다문화 교육을 위한 종합 플랫폼</Subtitle>
        </Header>

        <ProgramGrid>
          {programs.map((program, index) => (
            <ProgramCard
              key={program.id}
              onClick={() => onProgramSelect(program.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProgramIcon>{program.icon}</ProgramIcon>
              <ProgramTitle>{program.title}</ProgramTitle>
              <ProgramDescription>{program.description}</ProgramDescription>
              <ProgramButton>시작하기</ProgramButton>
            </ProgramCard>
          ))}
        </ProgramGrid>

        <SystemRequirements>
          <RequirementsTitle>
            ⚙️ 시스템 요구사항
          </RequirementsTitle>
          <RequirementsContent>
            <RequirementBox>
              <h3>🖥️ 로컬 실행 (개발자용)</h3>
              <p>컴퓨터에서 직접 실행하려면 Node.js가 필요합니다:</p>
              <ul>
                <li>Node.js 16.0 이상</li>
                <li>npm 또는 yarn 패키지 매니저</li>
                <li>모던 브라우저 (Chrome, Firefox, Safari, Edge)</li>
              </ul>
              <DownloadButton 
                href="https://nodejs.org" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                📥 Node.js 다운로드
              </DownloadButton>
            </RequirementBox>
            
            <RequirementBox>
              <h3>🌐 웹 브라우저 실행 (권장)</h3>
              <p>설치 없이 바로 사용 가능합니다:</p>
              <ul>
                <li>Vercel을 통한 웹 배포</li>
                <li>모든 기기에서 접근 가능</li>
                <li>자동 업데이트</li>
                <li>별도 설치 불필요</li>
              </ul>
              <DownloadButton 
                href="#" 
                onClick={(e) => e.preventDefault()}
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                🚀 현재 웹 버전 사용 중
              </DownloadButton>
            </RequirementBox>
          </RequirementsContent>
        </SystemRequirements>

        <Footer>
          <p>© 2025 김문정(안양 박달초) | 
            <a 
              href="https://www.youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              유튜브 배움의 달인
            </a> | 
            <a 
              href="https://open.kakao.com/o/gubGYQ7g" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              오픈 채팅방
            </a>
          </p>
        </Footer>
      </ContentWrapper>
    </MainContainer>
  );
};

export default GlocalEduMainPage;