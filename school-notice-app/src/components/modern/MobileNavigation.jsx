/**
 * MobileNavigation - Mobile-first navigation components
 * Designed for educational applications with touch-friendly interface
 */
import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

// Animations
const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const slideDown = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const slideOutRight = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

// Bottom Tab Navigation
const TabBarContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--color-surface-primary);
  border-top: 1px solid var(--color-border-default);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-navbar);
  
  /* iOS safe area support */
  padding-bottom: env(safe-area-inset-bottom);
  
  /* Hide on desktop */
  @media (min-width: 768px) {
    display: none;
  }
`;

const TabList = styled.div`
  display: flex;
  height: 64px;
  align-items: center;
  justify-content: space-around;
  padding: 0 var(--space-2);
`;

const TabButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  min-width: 44px;
  min-height: 44px;
  background: none;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-moderate) var(--ease-out);
  font-family: var(--font-family-primary);
  color: var(--color-text-secondary);
  
  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  /* Active state */
  ${props => props.active && css`
    color: var(--color-primary-600);
    background: var(--color-primary-50);
  `}
`;

const TabIcon = styled.div`
  font-size: 20px;
  margin-bottom: var(--space-1);
  transition: transform var(--duration-moderate) var(--ease-out);
  
  ${props => props.active && css`
    transform: scale(1.1);
  `}
`;

const TabLabel = styled.span`
  font-size: var(--font-size-xs);
  font-weight: ${props => props.active ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)'};
  line-height: 1;
`;

// Side Panel for Settings and Navigation
const PanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background-overlay);
  z-index: var(--z-overlay);
  animation: ${fadeIn} var(--duration-moderate) var(--ease-out);
  
  /* Hide on desktop */
  @media (min-width: 768px) {
    display: none;
  }
`;

const SidePanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: min(320px, 80vw);
  height: 100vh;
  background: var(--color-surface-primary);
  box-shadow: var(--shadow-2xl);
  z-index: var(--z-modal);
  
  animation: ${props => props.isClosing ? slideOutRight : slideInRight} 
    var(--duration-moderate) var(--ease-out);
  
  /* iOS safe area support */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border-default);
  background: var(--color-background-secondary);
`;

const PanelTitle = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: var(--radius-base);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  
  &:hover {
    background: var(--color-background-tertiary);
    color: var(--color-text-primary);
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
`;

const PanelContent = styled.div`
  padding: var(--space-4);
  overflow-y: auto;
  height: calc(100vh - 80px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
`;

// Menu Item Component
const MenuItem = styled.button`
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
  margin-bottom: var(--space-2);
  
  &:hover {
    background: var(--color-background-secondary);
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const MenuIcon = styled.span`
  font-size: 18px;
  margin-right: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
`;

const MenuText = styled.span`
  flex: 1;
`;

const MenuBadge = styled.span`
  background: var(--color-primary-500);
  color: var(--color-text-on-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  margin-left: var(--space-2);
`;

// Floating Action Button
const FAB = styled.button`
  position: fixed;
  bottom: calc(64px + var(--space-4) + env(safe-area-inset-bottom));
  right: var(--space-4);
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: var(--color-text-on-primary);
  border: none;
  border-radius: 50%;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  z-index: var(--z-docked);
  transition: all var(--duration-moderate) var(--ease-out);
  font-size: 24px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-md);
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
  
  /* Hide on desktop */
  @media (min-width: 768px) {
    display: none;
  }
`;

/**
 * Bottom Tab Navigation Component
 */
export const BottomTabNav = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  className 
}) => {
  return (
    <TabBarContainer className={className}>
      <TabList role="tablist">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
            aria-label={tab.label}
          >
            <TabIcon active={activeTab === tab.id}>
              {tab.icon}
            </TabIcon>
            <TabLabel active={activeTab === tab.id}>
              {tab.label}
            </TabLabel>
            {tab.badge && (
              <span 
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  background: 'var(--color-error-500)',
                  borderRadius: '50%'
                }}
              />
            )}
          </TabButton>
        ))}
      </TabList>
    </TabBarContainer>
  );
};

/**
 * Side Panel Component with slide-out animation
 */
export const MobileSidePanel = ({ 
  isOpen, 
  onClose, 
  title,
  children,
  className 
}) => {
  const [isClosing, setIsClosing] = useState(false);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  };
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  if (!isOpen && !isClosing) return null;
  
  return (
    <PanelOverlay onClick={handleOverlayClick}>
      <SidePanel isClosing={isClosing} className={className}>
        <PanelHeader>
          <PanelTitle>{title}</PanelTitle>
          <CloseButton onClick={handleClose} aria-label="패널 닫기">
            ✕
          </CloseButton>
        </PanelHeader>
        <PanelContent>
          {children}
        </PanelContent>
      </SidePanel>
    </PanelOverlay>
  );
};

/**
 * Menu Item Component for side panels
 */
export const MobileMenuItem = ({ 
  icon, 
  label, 
  badge, 
  onClick,
  className 
}) => {
  return (
    <MenuItem onClick={onClick} className={className}>
      {icon && <MenuIcon>{icon}</MenuIcon>}
      <MenuText>{label}</MenuText>
      {badge && <MenuBadge>{badge}</MenuBadge>}
    </MenuItem>
  );
};

/**
 * Floating Action Button
 */
export const FloatingActionButton = ({ 
  icon = '+', 
  onClick,
  ariaLabel,
  className 
}) => {
  return (
    <FAB 
      onClick={onClick} 
      aria-label={ariaLabel}
      className={className}
    >
      {icon}
    </FAB>
  );
};

/**
 * Complete Mobile Navigation Setup Hook
 */
export const useMobileNavigation = () => {
  const [activeTab, setActiveTab] = useState('edit');
  const [sidePanel, setSidePanel] = useState({ isOpen: false, type: null });
  
  const openPanel = (type) => {
    setSidePanel({ isOpen: true, type });
  };
  
  const closePanel = () => {
    setSidePanel({ isOpen: false, type: null });
  };
  
  return {
    activeTab,
    setActiveTab,
    sidePanel,
    openPanel,
    closePanel
  };
};

// Example usage component
export const MobileNavigationExample = () => {
  const { 
    activeTab, 
    setActiveTab, 
    sidePanel, 
    openPanel, 
    closePanel 
  } = useMobileNavigation();
  
  const tabs = [
    { id: 'edit', label: '편집', icon: '📝' },
    { id: 'preview', label: '미리보기', icon: '👁️' },
    { id: 'translate', label: '번역', icon: '🌍', badge: true },
    { id: 'settings', label: '설정', icon: '⚙️' }
  ];
  
  const handleSettingsClick = () => {
    openPanel('settings');
  };
  
  return (
    <>
      {/* Main content would go here */}
      <div style={{ 
        paddingBottom: '80px', // Space for tab bar
        minHeight: '100vh',
        padding: '16px'
      }}>
        <h1>모바일 네비게이션 예시</h1>
        <p>현재 탭: {activeTab}</p>
      </div>
      
      {/* Bottom Tab Navigation */}
      <BottomTabNav 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          if (tabId === 'settings') {
            handleSettingsClick();
          } else {
            setActiveTab(tabId);
          }
        }}
      />
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        icon="➕"
        ariaLabel="새 공지사항 작성"
        onClick={() => console.log('새 공지사항 작성')}
      />
      
      {/* Settings Side Panel */}
      <MobileSidePanel 
        isOpen={sidePanel.isOpen && sidePanel.type === 'settings'}
        onClose={closePanel}
        title="설정"
      >
        <MobileMenuItem 
          icon="🔧"
          label="일반 설정"
          onClick={() => console.log('일반 설정')}
        />
        <MobileMenuItem 
          icon="🎨"
          label="테마 설정"
          onClick={() => console.log('테마 설정')}
        />
        <MobileMenuItem 
          icon="🌐"
          label="언어 설정"
          badge="3"
          onClick={() => console.log('언어 설정')}
        />
        <MobileMenuItem 
          icon="📊"
          label="통계"
          onClick={() => console.log('통계')}
        />
        <MobileMenuItem 
          icon="ℹ️"
          label="앱 정보"
          onClick={() => console.log('앱 정보')}
        />
      </MobileSidePanel>
    </>
  );
};

export default {
  BottomTabNav,
  MobileSidePanel, 
  MobileMenuItem,
  FloatingActionButton,
  useMobileNavigation
};