/**
 * ModernApp - Complete implementation example showing modern UI components
 * Demonstrates the integration of all modern components in a school notice application
 */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModernButton from './ModernButton.jsx';
import ModernInput, { ModernTextarea } from './ModernInput.jsx';
import { 
  BottomTabNav, 
  MobileSidePanel, 
  MobileMenuItem, 
  FloatingActionButton,
  useMobileNavigation 
} from './MobileNavigation.jsx';

// Main App Layout
const AppContainer = styled.div`
  min-height: 100vh;
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
  
  /* Desktop layout */
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 280px 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 
      "sidebar header"
      "sidebar main";
  }
`;

// Header for desktop and mobile
const AppHeader = styled.header`
  background: var(--color-surface-primary);
  border-bottom: 1px solid var(--color-border-default);
  padding: var(--space-4);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  
  @media (min-width: 768px) {
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
  }
`;

const AppTitle = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
  margin: 0;
  
  @media (max-width: 767px) {
    font-size: var(--font-size-xl);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  
  @media (max-width: 767px) {
    .desktop-only {
      display: none;
    }
  }
  
  @media (min-width: 768px) {
    .mobile-only {
      display: none;
    }
  }
`;

// Desktop Sidebar
const Sidebar = styled.aside`
  background: var(--color-surface-primary);
  border-right: 1px solid var(--color-border-default);
  padding: var(--space-6) var(--space-4);
  overflow-y: auto;
  
  @media (max-width: 767px) {
    display: none;
  }
  
  @media (min-width: 768px) {
    grid-area: sidebar;
  }
`;

const SidebarNav = styled.nav`
  margin-bottom: var(--space-8);
`;

const NavSection = styled.div`
  margin-bottom: var(--space-6);
`;

const NavSectionTitle = styled.h3`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 var(--space-3) 0;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: none;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
  text-align: left;
  margin-bottom: var(--space-1);
  
  &:hover {
    background: var(--color-background-secondary);
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
  
  ${props => props.active && `
    background: var(--color-primary-50);
    color: var(--color-primary-700);
    font-weight: var(--font-weight-medium);
  `}
`;

const NavIcon = styled.span`
  font-size: 18px;
  margin-right: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
`;

// Main Content Area
const MainContent = styled.main`
  padding: var(--space-6) var(--space-4);
  max-width: 800px;
  
  @media (min-width: 768px) {
    grid-area: main;
    padding: var(--space-8) var(--space-6);
  }
  
  @media (max-width: 767px) {
    padding-bottom: calc(64px + var(--space-6)); /* Space for mobile navigation */
  }
`;

// Card Component for content sections
const Card = styled.div`
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration-moderate) var(--ease-out);
  
  &:hover {
    box-shadow: var(--shadow-card-hover);
  }
`;

const CardTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4) 0;
`;

const FormRow = styled.div`
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--space-3);
  }
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 0;
`;

// Status Badge Component
const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  
  ${props => {
    switch (props.status) {
      case 'draft':
        return `
          background: var(--color-warning-100);
          color: var(--color-warning-800);
        `;
      case 'published':
        return `
          background: var(--color-success-100);
          color: var(--color-success-800);
        `;
      case 'archived':
        return `
          background: var(--color-neutral-100);
          color: var(--color-neutral-600);
        `;
      default:
        return `
          background: var(--color-neutral-100);
          color: var(--color-neutral-600);
        `;
    }
  }}
`;

// Toast notification component
const Toast = styled.div`
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid var(--color-success-500);
  z-index: var(--z-toast);
  animation: slideInFromRight 0.3s ease-out;
  
  @keyframes slideInFromRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

/**
 * Modern School Notice Application
 * Demonstrates the integration of all modern UI components
 */
const ModernApp = () => {
  // Navigation state for mobile
  const { 
    activeTab, 
    setActiveTab, 
    sidePanel, 
    openPanel, 
    closePanel 
  } = useMobileNavigation();
  
  // Form state
  const [notice, setNotice] = useState({
    title: '',
    content: '',
    sender: '안양 박달초등학교',
    recipient: '',
    date: new Date().toISOString().split('T')[0],
    status: 'draft'
  });
  
  // UI state
  const [showToast, setShowToast] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Desktop navigation state
  const [activeNavItem, setActiveNavItem] = useState('edit');
  
  // Mobile tabs configuration
  const mobileTabs = [
    { id: 'edit', label: '편집', icon: '📝' },
    { id: 'preview', label: '미리보기', icon: '👁️' },
    { id: 'translate', label: '번역', icon: '🌍' },
    { id: 'settings', label: '설정', icon: '⚙️' }
  ];
  
  const handleInputChange = (field) => (event) => {
    setNotice(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };
  
  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const handleTranslate = async () => {
    setIsTranslating(true);
    // Simulate translation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTranslating(false);
  };
  
  const handleMenuClick = (menuId) => {
    setActiveTab(menuId);
    setActiveNavItem(menuId);
  };
  
  const handleMobileSettings = () => {
    openPanel('settings');
  };
  
  // Auto-hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);
  
  return (
    <AppContainer>
      {/* Toast Notification */}
      {showToast && (
        <Toast>
          ✅ 공지사항이 성공적으로 저장되었습니다!
        </Toast>
      )}
      
      {/* App Header */}
      <AppHeader>
        <AppTitle>📄 학교 공지사항 작성</AppTitle>
        <HeaderActions>
          <StatusBadge status={notice.status}>
            {notice.status === 'draft' ? '초안' : 
             notice.status === 'published' ? '발행됨' : '보관됨'}
          </StatusBadge>
          <ModernButton 
            className="desktop-only"
            variant="secondary" 
            size="sm"
            leftIcon="💾"
            onClick={handleSave}
          >
            저장
          </ModernButton>
          <ModernButton 
            className="mobile-only"
            variant="ghost"
            size="sm"
            iconOnly
            ariaLabel="메뉴 열기"
            onClick={handleMobileSettings}
          >
            ⚙️
          </ModernButton>
        </HeaderActions>
      </AppHeader>
      
      {/* Desktop Sidebar */}
      <Sidebar>
        <SidebarNav>
          <NavSection>
            <NavSectionTitle>편집</NavSectionTitle>
            <NavItem 
              active={activeNavItem === 'edit'}
              onClick={() => handleMenuClick('edit')}
            >
              <NavIcon>📝</NavIcon>
              공지사항 작성
            </NavItem>
            <NavItem 
              active={activeNavItem === 'template'}
              onClick={() => handleMenuClick('template')}
            >
              <NavIcon>📋</NavIcon>
              템플릿 관리
            </NavItem>
          </NavSection>
          
          <NavSection>
            <NavSectionTitle>도구</NavSectionTitle>
            <NavItem 
              active={activeNavItem === 'preview'}
              onClick={() => handleMenuClick('preview')}
            >
              <NavIcon>👁️</NavIcon>
              미리보기
            </NavItem>
            <NavItem 
              active={activeNavItem === 'translate'}
              onClick={() => handleMenuClick('translate')}
            >
              <NavIcon>🌍</NavIcon>
              다국어 번역
            </NavItem>
            <NavItem 
              active={activeNavItem === 'export'}
              onClick={() => handleMenuClick('export')}
            >
              <NavIcon>📤</NavIcon>
              내보내기
            </NavItem>
          </NavSection>
          
          <NavSection>
            <NavSectionTitle>설정</NavSectionTitle>
            <NavItem 
              active={activeNavItem === 'settings'}
              onClick={() => handleMenuClick('settings')}
            >
              <NavIcon>⚙️</NavIcon>
              환경설정
            </NavItem>
          </NavSection>
        </SidebarNav>
      </Sidebar>
      
      {/* Main Content */}
      <MainContent>
        {/* Notice Edit Form */}
        {(activeTab === 'edit' || activeNavItem === 'edit') && (
          <>
            <Card>
              <CardTitle>📝 공지사항 기본 정보</CardTitle>
              
              <FormRow>
                <FormGroup>
                  <ModernInput
                    label="공지사항 제목"
                    value={notice.title}
                    onChange={handleInputChange('title')}
                    placeholder="공지사항 제목을 입력해주세요"
                    leftIcon="📄"
                    required
                    maxLength={100}
                    showCharacterCount
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <ModernInput
                    label="발신자"
                    value={notice.sender}
                    onChange={handleInputChange('sender')}
                    leftIcon="🏫"
                    variant="success"
                    helpText="인증된 학교 계정입니다"
                  />
                </FormGroup>
                <FormGroup>
                  <ModernInput
                    label="수신자"
                    value={notice.recipient}
                    onChange={handleInputChange('recipient')}
                    placeholder="예: 전체 학부모, 6학년 학부모"
                    leftIcon="👥"
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <ModernInput
                    label="작성일"
                    type="date"
                    value={notice.date}
                    onChange={handleInputChange('date')}
                    leftIcon="📅"
                  />
                </FormGroup>
              </FormRow>
            </Card>
            
            <Card>
              <CardTitle>📄 공지사항 내용</CardTitle>
              <ModernTextarea
                value={notice.content}
                onChange={handleInputChange('content')}
                placeholder="공지사항의 내용을 입력해주세요. 학부모님들께 전달할 중요한 내용을 명확하고 정중하게 작성해주세요."
                rows={12}
              />
            </Card>
            
            <Card>
              <CardTitle>🔧 작업 도구</CardTitle>
              <FormRow>
                <ModernButton
                  variant="primary"
                  leftIcon="💾"
                  onClick={handleSave}
                  fullWidth
                >
                  저장하기
                </ModernButton>
                <ModernButton
                  variant="accent"
                  leftIcon="👁️"
                  onClick={() => setActiveTab('preview')}
                  fullWidth
                >
                  미리보기
                </ModernButton>
                <ModernButton
                  variant="secondary"
                  leftIcon="🌍"
                  onClick={handleTranslate}
                  loading={isTranslating}
                  fullWidth
                >
                  다국어 번역
                </ModernButton>
              </FormRow>
            </Card>
          </>
        )}
        
        {/* Preview Section */}
        {(activeTab === 'preview' || activeNavItem === 'preview') && (
          <Card>
            <CardTitle>👁️ 미리보기</CardTitle>
            <div style={{ 
              background: 'var(--color-background-secondary)', 
              padding: 'var(--space-6)', 
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-default)'
            }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>
                {notice.title || '공지사항 제목을 입력해주세요'}
              </h3>
              <div style={{ 
                whiteSpace: 'pre-wrap',
                lineHeight: 'var(--line-height-relaxed)',
                marginBottom: 'var(--space-4)'
              }}>
                {notice.content || '공지사항 내용을 입력해주세요.'}
              </div>
              <div style={{ 
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                borderTop: '1px solid var(--color-border-default)',
                paddingTop: 'var(--space-3)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>발신: {notice.sender}</span>
                <span>작성일: {notice.date}</span>
              </div>
            </div>
          </Card>
        )}
        
        {/* Translation Section */}
        {(activeTab === 'translate' || activeNavItem === 'translate') && (
          <Card>
            <CardTitle>🌍 다국어 번역</CardTitle>
            <p style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-4)'
            }}>
              다문화 가정을 위한 다국어 번역 서비스입니다.
            </p>
            <FormRow>
              <ModernButton variant="accent" leftIcon="🇰🇷">한국어 (원본)</ModernButton>
              <ModernButton variant="secondary" leftIcon="🇺🇸">영어</ModernButton>
              <ModernButton variant="secondary" leftIcon="🇨🇳">중국어</ModernButton>
              <ModernButton variant="secondary" leftIcon="🇻🇳">베트남어</ModernButton>
            </FormRow>
          </Card>
        )}
        
        {/* Settings Section */}
        {(activeTab === 'settings' || activeNavItem === 'settings') && (
          <Card>
            <CardTitle>⚙️ 환경설정</CardTitle>
            <FormRow>
              <FormGroup>
                <ModernInput
                  label="학교명"
                  defaultValue="안양 박달초등학교"
                  leftIcon="🏫"
                />
              </FormGroup>
              <FormGroup>
                <ModernInput
                  label="담당자"
                  defaultValue="김문정"
                  leftIcon="👤"
                />
              </FormGroup>
            </FormRow>
          </Card>
        )}
      </MainContent>
      
      {/* Mobile Bottom Navigation */}
      <BottomTabNav 
        tabs={mobileTabs}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          if (tabId === 'settings') {
            handleMobileSettings();
          } else {
            setActiveTab(tabId);
          }
        }}
      />
      
      {/* Mobile Floating Action Button */}
      <FloatingActionButton 
        icon="💾"
        ariaLabel="저장하기"
        onClick={handleSave}
      />
      
      {/* Mobile Settings Panel */}
      <MobileSidePanel 
        isOpen={sidePanel.isOpen && sidePanel.type === 'settings'}
        onClose={closePanel}
        title="설정"
      >
        <MobileMenuItem 
          icon="🏫"
          label="학교 정보"
          onClick={() => console.log('학교 정보')}
        />
        <MobileMenuItem 
          icon="👤"
          label="계정 설정"
          onClick={() => console.log('계정 설정')}
        />
        <MobileMenuItem 
          icon="🌐"
          label="언어 설정"
          badge="3"
          onClick={() => console.log('언어 설정')}
        />
        <MobileMenuItem 
          icon="🎨"
          label="테마 설정"
          onClick={() => console.log('테마 설정')}
        />
        <MobileMenuItem 
          icon="📊"
          label="사용 통계"
          onClick={() => console.log('사용 통계')}
        />
        <MobileMenuItem 
          icon="❓"
          label="도움말"
          onClick={() => console.log('도움말')}
        />
        <MobileMenuItem 
          icon="ℹ️"
          label="앱 정보"
          onClick={() => console.log('앱 정보')}
        />
      </MobileSidePanel>
    </AppContainer>
  );
};

export default ModernApp;