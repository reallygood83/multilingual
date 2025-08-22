import React, { memo } from 'react';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 44px;
  user-select: none;
  position: relative;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--elevation-2);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--elevation-1);
  }
  
  &:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    min-height: 48px;
    padding: var(--space-md) var(--space-lg);
  }
`;

const PrimaryButton = styled(BaseButton)`
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  color: var(--text-on-primary);
  box-shadow: var(--elevation-1);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: var(--surface-primary);
  color: var(--text-primary);
  border: 1px solid var(--neutral-300);
  box-shadow: var(--elevation-1);
  
  &:hover:not(:disabled) {
    background: var(--surface-tertiary);
    border-color: var(--neutral-400);
  }
`;

const OutlineButton = styled(BaseButton)`
  background: transparent;
  color: var(--primary-600);
  border: 1px solid var(--primary-300);
  
  &:hover:not(:disabled) {
    background: var(--primary-50);
    border-color: var(--primary-500);
    color: var(--primary-700);
  }
`;

const SuccessButton = styled(BaseButton)`
  background: linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%);
  color: var(--text-on-secondary);
  box-shadow: var(--elevation-1);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--success-600) 0%, var(--success-700) 100%);
  }
`;

const WarningButton = styled(BaseButton)`
  background: linear-gradient(135deg, var(--warning-500) 0%, var(--warning-600) 100%);
  color: var(--text-primary);
  box-shadow: var(--elevation-1);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--warning-600) 0%, var(--warning-700) 100%);
  }
`;

const DangerButton = styled(BaseButton)`
  background: linear-gradient(135deg, var(--error-500) 0%, var(--error-600) 100%);
  color: var(--text-on-secondary);
  box-shadow: var(--elevation-1);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--error-600) 0%, var(--error-700) 100%);
  }
`;

const GhostButton = styled(BaseButton)`
  background: transparent;
  color: var(--text-secondary);
  border: none;
  
  &:hover:not(:disabled) {
    background: var(--neutral-100);
    color: var(--text-primary);
  }
`;

const getButtonComponent = (variant) => {
  switch (variant) {
    case 'primary': return PrimaryButton;
    case 'secondary': return SecondaryButton;
    case 'outline': return OutlineButton;
    case 'success': return SuccessButton;
    case 'warning': return WarningButton;
    case 'danger': return DangerButton;
    case 'ghost': return GhostButton;
    default: return PrimaryButton;
  }
};

const OptimizedButton = memo(({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false, 
  variant = 'primary',
  loadingText = '로딩 중...',
  title,
  style,
  type = 'button',
  size = 'medium',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props 
}) => {
  const ButtonComponent = getButtonComponent(variant);
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: 'var(--space-xs) var(--space-md)',
          fontSize: 'var(--font-size-sm)',
          minHeight: '32px'
        };
      case 'large':
        return {
          padding: 'var(--space-md) var(--space-xl)',
          fontSize: 'var(--font-size-lg)',
          minHeight: '52px'
        };
      default:
        return {};
    }
  };
  
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const buttonStyle = {
    ...getSizeStyles(),
    ...(fullWidth && { width: '100%' }),
    ...style
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingSpinner size={size === 'small' ? '14px' : '16px'} color="currentColor" />
          {loadingText}
        </>
      );
    }

    const iconElement = icon && (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
    );

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children}
          {iconElement}
        </>
      );
    }

    return (
      <>
        {iconElement}
        {children}
      </>
    );
  };

  return (
    <ButtonComponent
      onClick={handleClick}
      disabled={disabled || loading}
      title={title}
      style={buttonStyle}
      type={type}
      {...props}
    >
      {renderContent()}
    </ButtonComponent>
  );
});

OptimizedButton.displayName = 'OptimizedButton';

// PropTypes would go here in a full implementation
// OptimizedButton.propTypes = {
//   children: PropTypes.node,
//   onClick: PropTypes.func,
//   disabled: PropTypes.bool,
//   loading: PropTypes.bool,
//   variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'success', 'warning', 'danger', 'ghost']),
//   loadingText: PropTypes.string,
//   title: PropTypes.string,
//   style: PropTypes.object,
//   type: PropTypes.string,
//   size: PropTypes.oneOf(['small', 'medium', 'large']),
//   icon: PropTypes.node,
//   iconPosition: PropTypes.oneOf(['left', 'right']),
//   fullWidth: PropTypes.bool
// };

export default OptimizedButton;