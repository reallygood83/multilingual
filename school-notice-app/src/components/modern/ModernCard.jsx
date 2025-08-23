import React, { forwardRef } from 'react';
import styled from 'styled-components';

/**
 * Modern Educational Card Component
 * Features: Flexible layouts, educational color coding, responsive design
 */

const BaseCard = styled.div`
  /* Layout */
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  /* Visual */
  background: var(--edu-surface-primary);
  border: 1px solid var(--edu-neutral-200);
  transition: var(--edu-transition-all);
  
  /* Interactive states */
  ${props => props.$interactive && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--edu-shadow-lg);
      border-color: var(--edu-primary-200);
    }
    
    &:active {
      transform: translateY(-1px);
      box-shadow: var(--edu-shadow-md);
    }
  `}
  
  /* Size variants */
  ${props => {
    switch (props.$size) {
      case 'sm':
        return `
          border-radius: var(--edu-radius-lg);
          box-shadow: var(--edu-shadow-sm);
        `;
      case 'lg':
        return `
          border-radius: var(--edu-radius-2xl);
          box-shadow: var(--edu-shadow-lg);
        `;
      case 'xl':
        return `
          border-radius: var(--edu-radius-3xl);
          box-shadow: var(--edu-shadow-xl);
        `;
      default: // md
        return `
          border-radius: var(--edu-radius-xl);
          box-shadow: var(--edu-shadow-md);
        `;
    }
  }}
  
  /* Variant styles */
  ${props => {
    switch (props.$variant) {
      case 'elevated':
        return `
          background: var(--edu-surface-elevated);
          box-shadow: var(--edu-shadow-lg);
          border: none;
        `;
      case 'outlined':
        return `
          background: var(--edu-surface-primary);
          border: 2px solid var(--edu-neutral-300);
          box-shadow: none;
        `;
      case 'filled':
        return `
          background: var(--edu-surface-tertiary);
          border: none;
          box-shadow: var(--edu-shadow-inner);
        `;
      case 'gradient':
        return `
          background: linear-gradient(135deg, 
            var(--edu-surface-primary) 0%, 
            var(--edu-surface-secondary) 100%);
          border: 1px solid var(--edu-neutral-100);
          box-shadow: var(--edu-shadow-md);
        `;
      default: // standard
        return '';
    }
  }}
  
  /* Educational importance colors */
  ${props => {
    switch (props.$importance) {
      case 'low':
        return `
          border-left: 4px solid var(--edu-importance-low);
        `;
      case 'medium':
        return `
          border-left: 4px solid var(--edu-importance-medium);
        `;
      case 'high':
        return `
          border-left: 4px solid var(--edu-importance-high);
          background: linear-gradient(135deg, 
            var(--edu-surface-primary) 0%, 
            rgba(245, 158, 11, 0.02) 100%);
        `;
      case 'critical':
        return `
          border-left: 4px solid var(--edu-importance-critical);
          background: linear-gradient(135deg, 
            var(--edu-surface-primary) 0%, 
            rgba(239, 68, 68, 0.02) 100%);
        `;
      case 'urgent':
        return `
          border: 2px solid var(--edu-importance-urgent);
          background: linear-gradient(135deg, 
            var(--edu-surface-primary) 0%, 
            rgba(220, 38, 38, 0.03) 100%);
          box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.1);
        `;
      default:
        return '';
    }
  }}
  
  /* Subject color coding */
  ${props => props.$subject && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--edu-subject-${props.$subject});
    }
  `}
  
  /* Full width */
  ${props => props.$fullWidth && `
    width: 100%;
  `}
  
  /* Responsive design */
  @media (max-width: 768px) {
    ${props => props.$responsive && `
      margin: 0 -var(--edu-space-4);
      border-radius: 0;
      border-left: none;
      border-right: none;
    `}
  }
`;

const CardHeader = styled.div`
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return 'var(--edu-card-padding-sm) var(--edu-card-padding-sm) 0';
      case 'lg': return 'var(--edu-card-padding-lg) var(--edu-card-padding-lg) 0';
      default: return 'var(--edu-card-padding-md) var(--edu-card-padding-md) 0';
    }
  }};
  
  ${props => props.$divided && `
    border-bottom: 1px solid var(--edu-neutral-200);
    margin-bottom: var(--edu-space-4);
    padding-bottom: var(--edu-space-4);
  `}
`;

const CardBody = styled.div`
  flex: 1;
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return props.$hasHeader ? 'var(--edu-card-padding-sm)' : 'var(--edu-card-padding-sm)';
      case 'lg': return props.$hasHeader ? 'var(--edu-card-padding-lg)' : 'var(--edu-card-padding-lg)';
      default: return props.$hasHeader ? 'var(--edu-card-padding-md)' : 'var(--edu-card-padding-md)';
    }
  }};
  
  ${props => props.$hasHeader && `
    padding-top: 0;
  `}
`;

const CardFooter = styled.div`
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return '0 var(--edu-card-padding-sm) var(--edu-card-padding-sm)';
      case 'lg': return '0 var(--edu-card-padding-lg) var(--edu-card-padding-lg)';
      default: return '0 var(--edu-card-padding-md) var(--edu-card-padding-md)';
    }
  }};
  
  ${props => props.$divided && `
    border-top: 1px solid var(--edu-neutral-200);
    margin-top: var(--edu-space-4);
    padding-top: var(--edu-space-4);
  `}
  
  ${props => props.$actions && `
    display: flex;
    justify-content: flex-end;
    gap: var(--edu-space-2);
    align-items: center;
    flex-wrap: wrap;
    
    @media (max-width: 640px) {
      justify-content: stretch;
      
      > * {
        flex: 1;
        min-width: 0;
      }
    }
  `}
`;

const CardTitle = styled.h3`
  margin: 0 0 var(--edu-space-2) 0;
  font-size: var(--edu-font-size-lg);
  font-weight: var(--edu-font-weight-semibold);
  line-height: var(--edu-leading-tight);
  color: var(--edu-text-primary);
  
  ${props => {
    switch (props.$size) {
      case 'sm':
        return `
          font-size: var(--edu-font-size-base);
          font-weight: var(--edu-font-weight-medium);
        `;
      case 'lg':
        return `
          font-size: var(--edu-font-size-xl);
          font-weight: var(--edu-font-weight-semibold);
        `;
      default:
        return '';
    }
  }}
`;

const CardSubtitle = styled.p`
  margin: 0;
  font-size: var(--edu-font-size-sm);
  font-weight: var(--edu-font-weight-normal);
  line-height: var(--edu-leading-normal);
  color: var(--edu-text-secondary);
`;

const CardDescription = styled.p`
  margin: var(--edu-space-2) 0 0 0;
  font-size: var(--edu-font-size-sm);
  line-height: var(--edu-leading-relaxed);
  color: var(--edu-text-tertiary);
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--edu-space-1);
  padding: var(--edu-space-1) var(--edu-space-2);
  border-radius: var(--edu-radius-full);
  font-size: var(--edu-font-size-xs);
  font-weight: var(--edu-font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  ${props => {
    switch (props.$status) {
      case 'success':
        return `
          background: var(--edu-success-100);
          color: var(--edu-success-800);
        `;
      case 'warning':
        return `
          background: var(--edu-warning-100);
          color: var(--edu-warning-800);
        `;
      case 'error':
        return `
          background: var(--edu-error-100);
          color: var(--edu-error-800);
        `;
      case 'info':
        return `
          background: var(--edu-primary-100);
          color: var(--edu-primary-800);
        `;
      default:
        return `
          background: var(--edu-neutral-100);
          color: var(--edu-neutral-700);
        `;
    }
  }}
`;

/**
 * ModernCard Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Card variant (standard, elevated, outlined, filled, gradient)
 * @param {string} props.size - Card size (sm, md, lg, xl)
 * @param {string} props.importance - Educational importance (low, medium, high, critical, urgent)
 * @param {string} props.subject - Subject color coding (korean, math, science, social, english, arts, pe)
 * @param {boolean} props.interactive - Enable hover effects
 * @param {boolean} props.fullWidth - Full width card
 * @param {boolean} props.responsive - Mobile responsive adjustments
 * @param {function} props.onClick - Click handler (makes card interactive)
 * @param {Object} props.style - Additional styles
 * @param {string} props.className - Additional CSS classes
 */
export const ModernCard = forwardRef(({
  children,
  variant = 'standard',
  size = 'md',
  importance,
  subject,
  interactive = false,
  fullWidth = false,
  responsive = false,
  onClick,
  style,
  className,
  'aria-label': ariaLabel,
  role,
  tabIndex,
  ...props
}, ref) => {
  const isInteractive = interactive || !!onClick;
  
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };
  
  const handleKeyDown = (e) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <BaseCard
      ref={ref}
      $variant={variant}
      $size={size}
      $importance={importance}
      $subject={subject}
      $interactive={isInteractive}
      $fullWidth={fullWidth}
      $responsive={responsive}
      onClick={handleClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      style={style}
      className={className}
      aria-label={ariaLabel}
      role={isInteractive ? role || 'button' : role}
      tabIndex={isInteractive ? tabIndex || 0 : tabIndex}
      {...props}
    >
      {children}
    </BaseCard>
  );
});

ModernCard.displayName = 'ModernCard';

// Sub-components
ModernCard.Header = ({ children, size = 'md', divided = false, ...props }) => (
  <CardHeader $size={size} $divided={divided} {...props}>
    {children}
  </CardHeader>
);

ModernCard.Body = ({ children, size = 'md', hasHeader = false, ...props }) => (
  <CardBody $size={size} $hasHeader={hasHeader} {...props}>
    {children}
  </CardBody>
);

ModernCard.Footer = ({ children, size = 'md', divided = false, actions = false, ...props }) => (
  <CardFooter $size={size} $divided={divided} $actions={actions} {...props}>
    {children}
  </CardFooter>
);

ModernCard.Title = ({ children, size = 'md', ...props }) => (
  <CardTitle $size={size} {...props}>
    {children}
  </CardTitle>
);

ModernCard.Subtitle = ({ children, ...props }) => (
  <CardSubtitle {...props}>
    {children}
  </CardSubtitle>
);

ModernCard.Description = ({ children, ...props }) => (
  <CardDescription {...props}>
    {children}
  </CardDescription>
);

ModernCard.Badge = ({ children, status = 'default', ...props }) => (
  <StatusBadge $status={status} {...props}>
    {children}
  </StatusBadge>
);

export default ModernCard;