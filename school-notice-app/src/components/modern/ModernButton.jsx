/**
 * ModernButton - A comprehensive button component with multiple variants
 * Designed for educational applications with accessibility and mobile-first approach
 */
import React from 'react';
import styled, { css, keyframes } from 'styled-components';

// Loading spinner animation
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Button variants
const buttonVariants = {
  primary: css`
    background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
    color: var(--color-text-on-primary);
    border: 2px solid transparent;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
  `,
  
  secondary: css`
    background: var(--color-surface-primary);
    color: var(--color-text-primary);
    border: 2px solid var(--color-border-default);
    
    &:hover:not(:disabled) {
      background: var(--color-background-secondary);
      border-color: var(--color-border-interactive);
      box-shadow: var(--shadow-sm);
    }
    
    &:active:not(:disabled) {
      background: var(--color-background-tertiary);
    }
  `,
  
  accent: css`
    background: linear-gradient(135deg, var(--color-accent-500), var(--color-accent-600));
    color: var(--color-text-on-accent);
    border: 2px solid transparent;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-accent-600), var(--color-accent-700));
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
  `,
  
  success: css`
    background: linear-gradient(135deg, var(--color-success-500), var(--color-success-600));
    color: var(--color-text-on-primary);
    border: 2px solid transparent;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-success-600), var(--color-success-700));
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
  `,
  
  warning: css`
    background: linear-gradient(135deg, var(--color-warning-500), var(--color-warning-600));
    color: var(--color-text-on-primary);
    border: 2px solid transparent;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-warning-600), var(--color-warning-700));
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
  `,
  
  error: css`
    background: linear-gradient(135deg, var(--color-error-500), var(--color-error-600));
    color: var(--color-text-on-primary);
    border: 2px solid transparent;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-error-600), var(--color-error-700));
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
  `,
  
  ghost: css`
    background: transparent;
    color: var(--color-text-primary);
    border: 2px solid transparent;
    
    &:hover:not(:disabled) {
      background: var(--color-background-secondary);
      box-shadow: var(--shadow-sm);
    }
    
    &:active:not(:disabled) {
      background: var(--color-background-tertiary);
    }
  `
};

// Button sizes
const buttonSizes = {
  sm: css`
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-sm);
    min-height: 36px;
    gap: var(--space-1);
  `,
  
  md: css`
    padding: var(--space-3) var(--space-5);
    font-size: var(--font-size-base);
    min-height: 44px; /* Touch-friendly size */
    gap: var(--space-2);
  `,
  
  lg: css`
    padding: var(--space-4) var(--space-6);
    font-size: var(--font-size-lg);
    min-height: 52px;
    gap: var(--space-3);
  `
};

const StyledButton = styled.button`
  /* Base styles */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-moderate) var(--ease-out);
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  
  /* Remove default button styles */
  appearance: none;
  background: none;
  border: none;
  outline: none;
  
  /* Apply variant styles */
  ${props => buttonVariants[props.variant]}
  
  /* Apply size styles */
  ${props => buttonSizes[props.size]}
  
  /* Full width option */
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  /* Icon only styles */
  ${props => props.iconOnly && css`
    padding: var(--space-3);
    min-width: 44px;
    aspect-ratio: 1;
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  /* Loading state */
  ${props => props.loading && css`
    color: transparent;
    cursor: not-allowed;
    
    &:hover, &:active {
      transform: none;
      box-shadow: none;
    }
  `}
  
  /* Focus styles for accessibility */
  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
  
  /* Mobile optimizations */
  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover, &:active {
      transform: none;
    }
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  gap: inherit;
  
  ${props => props.loading && css`
    opacity: 0;
  `}
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  
  /* Icon sizing based on button size */
  ${props => props.size === 'sm' && css`
    font-size: 14px;
  `}
  
  ${props => props.size === 'md' && css`
    font-size: 16px;
  `}
  
  ${props => props.size === 'lg' && css`
    font-size: 18px;
  `}
`;

/**
 * ModernButton Component
 * 
 * A comprehensive button component with multiple variants, sizes, and states.
 * Designed specifically for educational applications with accessibility and 
 * mobile-first approach.
 * 
 * @param {string} variant - Button variant (primary, secondary, accent, success, warning, error, ghost)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} loading - Show loading state
 * @param {boolean} disabled - Disable the button
 * @param {boolean} fullWidth - Make button full width
 * @param {boolean} iconOnly - Button with only icon (square aspect ratio)
 * @param {ReactNode} leftIcon - Icon to show on the left
 * @param {ReactNode} rightIcon - Icon to show on the right
 * @param {string} ariaLabel - Accessibility label
 * @param {function} onClick - Click handler
 * @param {ReactNode} children - Button content
 */
const ModernButton = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  iconOnly = false,
  leftIcon = null,
  rightIcon = null,
  ariaLabel,
  onClick,
  children,
  ...props
}, ref) => {
  const handleClick = (event) => {
    if (loading || disabled) return;
    onClick?.(event);
  };

  const handleKeyDown = (event) => {
    // Allow Enter and Space to trigger button
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  };

  return (
    <StyledButton
      ref={ref}
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      iconOnly={iconOnly}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      role="button"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {loading && <LoadingSpinner />}
      
      <ButtonContent loading={loading}>
        {leftIcon && (
          <IconWrapper size={size}>
            {leftIcon}
          </IconWrapper>
        )}
        
        {!iconOnly && children}
        
        {rightIcon && (
          <IconWrapper size={size}>
            {rightIcon}
          </IconWrapper>
        )}
        
        {iconOnly && (leftIcon || rightIcon || children)}
      </ButtonContent>
    </StyledButton>
  );
});

ModernButton.displayName = 'ModernButton';

// Usage examples for documentation
export const ButtonExamples = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
    <h3>Button Variants</h3>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <ModernButton variant="primary">Primary</ModernButton>
      <ModernButton variant="secondary">Secondary</ModernButton>
      <ModernButton variant="accent">Accent</ModernButton>
      <ModernButton variant="success">Success</ModernButton>
      <ModernButton variant="warning">Warning</ModernButton>
      <ModernButton variant="error">Error</ModernButton>
      <ModernButton variant="ghost">Ghost</ModernButton>
    </div>
    
    <h3>Button Sizes</h3>
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <ModernButton size="sm">Small</ModernButton>
      <ModernButton size="md">Medium</ModernButton>
      <ModernButton size="lg">Large</ModernButton>
    </div>
    
    <h3>Button States</h3>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <ModernButton>Normal</ModernButton>
      <ModernButton loading>Loading</ModernButton>
      <ModernButton disabled>Disabled</ModernButton>
    </div>
    
    <h3>With Icons</h3>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <ModernButton leftIcon="📄">공문서 생성</ModernButton>
      <ModernButton rightIcon="→">다음 단계</ModernButton>
      <ModernButton iconOnly ariaLabel="설정">⚙️</ModernButton>
    </div>
  </div>
);

export default ModernButton;