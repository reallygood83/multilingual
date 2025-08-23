import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ModernButton } from './ModernButton';
import { ModernCard } from './ModernCard';

/**
 * Modern Educational Layout System
 * Features: Responsive design, mobile-first navigation, educational branding
 */

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--edu-surface-secondary) 0%, 
    var(--edu-neutral-50) 50%,
    var(--edu-surface-secondary) 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Pretendard', sans-serif;
`;

const AppHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: var(--edu-z-50);
  background: var(--edu-surface-primary);
  border-bottom: 1px solid var(--edu-neutral-200);
  box-shadow: var(--edu-shadow-sm);
  backdrop-filter: blur(var(--edu-blur-md));
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--edu-space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  
  @media (max-width: 768px) {
    padding: 0 var(--edu-space-4);
    height: 64px;
  }
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--edu-space-3);
`;

const BrandIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--edu-primary-500) 0%, var(--edu-primary-600) 100%);
  border-radius: var(--edu-radius-xl);
  color: var(--edu-text-on-primary);
  font-size: var(--edu-font-size-xl);
  font-weight: var(--edu-font-weight-bold);
  box-shadow: var(--edu-shadow-md);
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: var(--edu-font-size-lg);
  }
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const BrandTitle = styled.h1`
  margin: 0;
  font-size: var(--edu-font-size-xl);
  font-weight: var(--edu-font-weight-bold);
  color: var(--edu-text-primary);
  line-height: var(--edu-leading-tight);
`;

const BrandSubtitle = styled.p`
  margin: 0;
  font-size: var(--edu-font-size-sm);
  font-weight: var(--edu-font-weight-normal);
  color: var(--edu-text-secondary);
  line-height: var(--edu-leading-tight);
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--edu-space-2);
  
  @media (max-width: 768px) {
    gap: var(--edu-space-1);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: var(--edu-space-2);
  padding: var(--edu-space-2) var(--edu-space-3);
  background: ${props => {
    switch (props.$status) {
      case 'connected': return 'var(--edu-success-100)';
      case 'warning': return 'var(--edu-warning-100)';
      case 'error': return 'var(--edu-error-100)';
      default: return 'var(--edu-neutral-100)';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'connected': return 'var(--edu-success-800)';
      case 'warning': return 'var(--edu-warning-800)';
      case 'error': return 'var(--edu-error-800)';
      default: return 'var(--edu-neutral-800)';
    }
  }};
  border-radius: var(--edu-radius-full);
  font-size: var(--edu-font-size-sm);
  font-weight: var(--edu-font-weight-medium);
  
  @media (max-width: 640px) {
    span {
      display: none;
    }
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: ${props => props.$animated ? 'pulse 2s infinite' : 'none'};
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--edu-neutral-300);
  border-radius: var(--edu-radius-lg);
  background: var(--edu-surface-primary);
  color: var(--edu-text-primary);
  cursor: pointer;
  transition: var(--edu-transition-fast);
  
  &:hover {
    background: var(--edu-surface-tertiary);
    border-color: var(--edu-neutral-400);
  }
  
  &:focus {
    outline: 2px solid var(--edu-primary-500);
    outline-offset: 2px;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MainContainer = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--edu-space-6) var(--edu-space-4);
  
  @media (max-width: 768px) {
    padding: var(--edu-space-4);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--edu-space-6);
  
  ${props => props.$layout === 'sidebar' && `
    @media (min-width: 1024px) {
      grid-template-columns: 300px 1fr;
    }
  `}
  
  ${props => props.$layout === 'two-column' && `
    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  `}
  
  ${props => props.$layout === 'three-column' && `
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }
  `}
`;

const ControlPanel = styled(ModernCard)`
  position: sticky;
  top: calc(72px + var(--edu-space-4));
  
  @media (max-width: 768px) {
    position: relative;
    top: 0;
    margin-bottom: var(--edu-space-4);
  }
`;

const FloatingActionButton = styled.button`
  position: fixed;
  bottom: var(--edu-space-6);
  right: var(--edu-space-6);
  z-index: var(--edu-z-40);
  
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--edu-secondary-500) 0%, var(--edu-secondary-600) 100%);
  color: var(--edu-text-on-primary);
  box-shadow: var(--edu-shadow-lg);
  cursor: pointer;
  transition: var(--edu-transition-all);
  
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--edu-font-size-xl);
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: var(--edu-shadow-xl);
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
  
  &:focus {
    outline: 3px solid rgba(245, 158, 11, 0.3);
    outline-offset: 2px;
  }
  
  @media (max-width: 768px) {
    bottom: var(--edu-space-4);
    right: var(--edu-space-4);
    width: 52px;
    height: 52px;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 var(--edu-space-2) 0;
  font-size: var(--edu-font-size-4xl);
  font-weight: var(--edu-font-weight-bold);
  color: var(--edu-text-primary);
  line-height: var(--edu-leading-tight);
  
  @media (max-width: 768px) {
    font-size: var(--edu-font-size-3xl);
  }
`;

const PageSubtitle = styled.p`
  margin: 0 0 var(--edu-space-6) 0;
  font-size: var(--edu-font-size-lg);
  color: var(--edu-text-secondary);
  line-height: var(--edu-leading-relaxed);
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: var(--edu-font-size-base);
    margin-bottom: var(--edu-space-4);
  }
`;

const ProgressSection = styled.div`
  margin-bottom: var(--edu-space-6);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: var(--edu-neutral-200);
  border-radius: var(--edu-radius-full);
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    background: linear-gradient(90deg, var(--edu-primary-500), var(--edu-secondary-500));
    width: ${props => props.$progress || 0}%;
    transition: width 0.3s var(--edu-ease-out);
    border-radius: inherit;
  }
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--edu-space-2);
  font-size: var(--edu-font-size-sm);
  color: var(--edu-text-secondary);
`;

/**
 * ModernLayout Component
 * Main layout wrapper with educational styling and responsive design
 */
export const ModernLayout = ({
  children,
  title,
  subtitle,
  layout = 'single',
  showProgress = false,
  progress = 0,
  progressText,
  apiStatus = 'disconnected',
  onSettingsClick,
  onFabClick,
  fabIcon = '⚙️',
  fabLabel = '설정',
  className,
  ...props
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getStatusProps = (status) => {
    switch (status) {
      case 'connected':
        return { $status: 'connected', text: '연결됨' };
      case 'checking':
        return { $status: 'warning', text: '확인중...', $animated: true };
      case 'error':
        return { $status: 'error', text: '오류' };
      default:
        return { $status: 'default', text: '연결 안됨' };
    }
  };

  const statusProps = getStatusProps(apiStatus);

  return (
    <LayoutContainer className={className} {...props}>
      {/* App Header */}
      <AppHeader>
        <HeaderContent>
          {/* Brand Section */}
          <BrandSection>
            <BrandIcon>
              🏫
            </BrandIcon>
            <BrandText>
              <BrandTitle>통신문 번역 시스템</BrandTitle>
              <BrandSubtitle>AI 다국어 가정통신문</BrandSubtitle>
            </BrandText>
          </BrandSection>

          {/* Header Actions */}
          <HeaderActions>
            {/* API Status */}
            <StatusIndicator {...statusProps}>
              <StatusDot $animated={statusProps.$animated} />
              <span>{statusProps.text}</span>
            </StatusIndicator>

            {/* Settings Button */}
            <ModernButton
              variant="outline"
              size="sm"
              onClick={onSettingsClick}
              leftIcon={<span>⚙️</span>}
            >
              <span className="hidden sm:inline">설정</span>
            </ModernButton>

            {/* Mobile Menu Button */}
            <MobileMenuButton
              onClick={handleMobileMenuToggle}
              aria-label="메뉴 열기"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </MobileMenuButton>
          </HeaderActions>
        </HeaderContent>
      </AppHeader>

      {/* Main Content */}
      <MainContainer>
        {/* Page Header */}
        {(title || subtitle) && (
          <div style={{ marginBottom: 'var(--edu-space-6)' }}>
            {title && <PageTitle>{title}</PageTitle>}
            {subtitle && <PageSubtitle>{subtitle}</PageSubtitle>}
          </div>
        )}

        {/* Progress Section */}
        {showProgress && (
          <ProgressSection>
            <ProgressBar $progress={progress} />
            {progressText && (
              <ProgressText>
                <span>{progressText}</span>
                <span>{Math.round(progress)}%</span>
              </ProgressText>
            )}
          </ProgressSection>
        )}

        {/* Content Grid */}
        <ContentGrid $layout={layout}>
          {children}
        </ContentGrid>
      </MainContainer>

      {/* Floating Action Button */}
      {onFabClick && (
        <FloatingActionButton
          onClick={onFabClick}
          title={fabLabel}
          aria-label={fabLabel}
        >
          {fabIcon}
        </FloatingActionButton>
      )}
    </LayoutContainer>
  );
};

/**
 * Sidebar Component for layout
 */
ModernLayout.Sidebar = styled.div`
  @media (max-width: 1023px) {
    order: 2;
  }
`;

/**
 * Main Content Component for layout
 */
ModernLayout.Content = styled.div`
  min-width: 0; /* Prevent flex overflow */
  
  @media (max-width: 1023px) {
    order: 1;
  }
`;

/**
 * Control Panel Component
 */
ModernLayout.ControlPanel = ({ children, ...props }) => (
  <ControlPanel variant="elevated" size="lg" {...props}>
    <ModernCard.Body>
      {children}
    </ModernCard.Body>
  </ControlPanel>
);

export default ModernLayout;