import React, { useState, Suspense, lazy } from 'react';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

// Lazy load the main feature components
const NoticeGenerator = lazy(() => import('./NoticeGenerator'));
const CultureCalendar = lazy(() => import('./CultureCalendar'));
const WorldCultureCalendar = lazy(() => import('./WorldCultureCalendar'));

const PlatformContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: var(--surface-secondary);
  font-family: var(--font-main);
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
`;

const Sidebar = styled.nav`
  width: 240px;
  background-color: var(--surface-primary);
  border-right: 1px solid var(--neutral-200);
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 16px;
    border-right: none;
    border-bottom: 1px solid var(--neutral-200);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Logo = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 32px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    color: var(--primary-500);
  }
  
  @media (max-width: 768px) {
    font-size: 20px;
    margin: 0 0 20px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
    margin: 0 0 16px 0;
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  @media (max-width: 768px) {
    display: ${props => props.$collapsed ? 'none' : 'block'};
    margin-top: ${props => props.$collapsed ? '0' : '16px'};
  }
`;

const NavItem = styled.li`
  margin-bottom: 8px;
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  color: ${props => props.$active ? 'var(--primary-600)' : 'var(--text-secondary)'};
  background-color: ${props => props.$active ? 'var(--primary-100)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--primary-100);
    color: var(--primary-600);
  }
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  
  @media (max-width: 768px) {
    padding: 16px;
    overflow-y: visible;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const SidebarFooter = styled.footer`
  margin-top: auto;
  padding-top: 20px;
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  border-top: 1px solid var(--neutral-200);

  a {
    color: var(--primary-500);
    text-decoration: none;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Mobile Navigation Toggle Button
const MobileNavToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  color: var(--text-primary);
  min-height: 44px;
  min-width: 44px;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:hover {
    background-color: var(--neutral-100, #f3f4f6);
  }
`;

const OptimizedApp = () => {
  const [activeView, setActiveView] = useState('notice_generator');
  const [mobileNavCollapsed, setMobileNavCollapsed] = useState(true);
  
  const [settings] = useState(() => {
    const saved = localStorage.getItem('schoolNoticeSettings');
    return saved ? JSON.parse(saved) : { geminiApiKey: '' };
  });

  const renderView = () => {
    switch (activeView) {
      case 'notice_generator':
        return <NoticeGenerator />;
      case 'culture_calendar':
        return <CultureCalendar apiKey={settings.geminiApiKey} />;
      case 'world_culture_calendar':
        return <WorldCultureCalendar />;
      default:
        return <div>선택된 메뉴가 없습니다.</div>;
    }
  };

  const getIcon = (view) => {
    const iconProps = { 
      xmlns: "http://www.w3.org/2000/svg", 
      width: "20", 
      height: "20", 
      viewBox: "0 0 24 24", 
      fill: "none", 
      stroke: "currentColor", 
      strokeWidth: "2", 
      strokeLinecap: "round", 
      strokeLinejoin: "round"
    };
    switch(view) {
      case 'notice_generator': 
        return <svg {...iconProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
      case 'culture_calendar': 
        return <svg {...iconProps}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
      case 'world_culture_calendar':
        return <svg {...iconProps}><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
      default: return null;
    }
  }

  return (
    <PlatformContainer>
      <Sidebar>
        <Logo>
          <span>다문화교실<span>플랫폼</span></span>
          <MobileNavToggle 
            onClick={() => setMobileNavCollapsed(!mobileNavCollapsed)}
            aria-label="메뉴 토글"
          >
            {mobileNavCollapsed ? '☰' : '✕'}
          </MobileNavToggle>
        </Logo>
        <NavMenu $collapsed={mobileNavCollapsed}>
          <NavItem>
            <NavLink 
              href="#"
              $active={activeView === 'notice_generator'}
              onClick={(e) => { e.preventDefault(); setActiveView('notice_generator'); }}
            >
              {getIcon('notice_generator')}
              <span>가정통신문 생성</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              href="#"
              $active={activeView === 'culture_calendar'}
              onClick={(e) => { e.preventDefault(); setActiveView('culture_calendar'); }}
            >
              {getIcon('culture_calendar')}
              <span>세계 문화 캘린더</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              href="#"
              $active={activeView === 'world_culture_calendar'}
              onClick={(e) => { e.preventDefault(); setActiveView('world_culture_calendar'); }}
            >
              {getIcon('world_culture_calendar')}
              <span>🌍 다문화 캘린더</span>
            </NavLink>
          </NavItem>
        </NavMenu>
        <SidebarFooter>
          © 2025 김문정(안양박달초) | <a href="https://www.youtube.com/@%EB%B0%B0%EC%9C%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v" target="_blank" rel="noopener noreferrer">유튜브 배윰의 달인</a>
        </SidebarFooter>
      </Sidebar>
      <ContentArea>
        <Suspense fallback={<LoadingSpinner center padding="100px" text="콘텐츠를 불러오는 중입니다..." />}>
          {renderView()}
        </Suspense>
      </ContentArea>
    </PlatformContainer>
  );
};

export default OptimizedApp;
