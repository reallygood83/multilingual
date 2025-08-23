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
    #fef7ed 0%,  /* Warm orange-50 */
    #fffbeb 25%, /* Warm amber-50 */
    #f0f9ff 75%, /* Trust blue-50 */
    #f8fafc 100% /* Neutral slate-50 */
  );
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Pretendard', sans-serif;
  position: relative;
  
  /* Add subtle texture for warmth */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.03) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
`;

const AppHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: var(--edu-z-50);
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 2px solid #f59e0b;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
  /* Add warm glow effect */
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      #f59e0b 0%, 
      #eab308 25%, 
      #3b82f6 75%, 
      #10b981 100%);
    opacity: 0.8;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
    height: 70px;
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
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f59e0b 0%, #eab308 100%);
  border-radius: 16px;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3), 0 3px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(245, 158, 11, 0.4), 0 4px 15px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 1.25rem;
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
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.25;
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BrandSubtitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  line-height: 1.25;
  letter-spacing: 0.025em;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
  
  ${props => props.$layout === 'sidebar' && `
    @media (min-width: 1024px) {
      grid-template-columns: 320px 1fr;
      gap: 2.5rem;
    }
  `}
  
  ${props => props.$layout === 'two-column' && `
    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  `}
  
  ${props => props.$layout === 'three-column' && `
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    @media (min-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
  `}
`;

const ControlPanel = styled(ModernCard)`
  position: sticky;
  top: calc(80px + 2rem);
  
  /* Enhanced styling for better visual consistency */
  border: 1px solid rgba(245, 158, 11, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  
  @media (max-width: 768px) {
    position: relative;
    top: 0;
    margin-bottom: 1.5rem;
  }
`;

const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: var(--edu-z-40);
  
  width: 64px;
  height: 64px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #eab308 50%, #3b82f6 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4), 0 3px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid rgba(255, 255, 255, 0.3);
  
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  
  /* Add pulsing animation for attention */
  animation: pulse 3s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 12px 35px rgba(245, 158, 11, 0.5), 0 4px 15px rgba(0, 0, 0, 0.15);
    animation: none; /* Stop pulse on hover */
  }
  
  &:active {
    transform: translateY(-2px) scale(1.05);
  }
  
  &:focus {
    outline: 3px solid rgba(245, 158, 11, 0.4);
    outline-offset: 4px;
  }
  
  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 56px;
    height: 56px;
    font-size: 1.25rem;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 0.75rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.25;
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  margin: 0 0 2.5rem 0;
  font-size: 1.125rem;
  color: #64748b;
  line-height: 1.75;
  max-width: 640px;
  font-weight: 400;
  letter-spacing: 0.025em;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const ProgressSection = styled.div`
  margin-bottom: var(--edu-space-6);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(203, 213, 225, 0.5);
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #f59e0b 0%, #eab308 25%, #3b82f6 75%, #10b981 100%);
    width: ${props => props.$progress || 0}%;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: inherit;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
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
 * Sidebar Component for layout - Enhanced with consistent styling
 */
ModernLayout.Sidebar = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(245, 158, 11, 0.15);
  backdrop-filter: blur(8px);
  
  @media (max-width: 1023px) {
    order: 2;
    background: transparent;
    border: none;
    backdrop-filter: none;
  }
`;

/**
 * Main Content Component for layout - Enhanced with consistent styling
 */
ModernLayout.Content = styled.div`
  min-width: 0; /* Prevent flex overflow */
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(245, 158, 11, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03);
  
  @media (max-width: 1023px) {
    order: 1;
    background: transparent;
    border: none;
    backdrop-filter: none;
    box-shadow: none;
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