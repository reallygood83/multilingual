import React, { forwardRef } from 'react';
import styled from 'styled-components';

/**
 * Modern Educational Card Component
 * Features: Flexible layouts, educational color coding, responsive design
 */

// Helper function for subject colors with warm theme
const getSubjectColor = (subject, opacity = 1) => {
  const colors = {
    korean: `rgba(245, 158, 11, ${opacity})`, // Warm amber
    math: `rgba(59, 130, 246, ${opacity})`, // Trust blue
    science: `rgba(16, 185, 129, ${opacity})`, // Growth green
    social: `rgba(139, 92, 246, ${opacity})`, // Wisdom purple
    english: `rgba(236, 72, 153, ${opacity})`, // Communication pink
    arts: `rgba(251, 146, 60, ${opacity})`, // Creative orange
    pe: `rgba(34, 197, 94, ${opacity})` // Energy green
  };
  return colors[subject] || `rgba(107, 114, 128, ${opacity})`; // Default gray
};

const BaseCard = styled.div`
  /* Layout */
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  /* Visual - Enhanced warm theme matching layout */
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(245, 158, 11, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Interactive states */
  ${props => props.$interactive && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(245, 158, 11, 0.15), 0 4px 15px rgba(0, 0, 0, 0.1);
      border-color: rgba(245, 158, 11, 0.3);
      background: rgba(255, 255, 255, 0.95);
    }
    
    &:active {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  `}
  
  /* Size variants */
  ${props => {
    switch (props.$size) {
      case 'sm':
        return `
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03);
        `;
      case 'lg':
        return `
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1), 0 4px 15px rgba(0, 0, 0, 0.05);
        `;
      case 'xl':
        return `
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 6px 20px rgba(0, 0, 0, 0.06);
        `;
      default: // md
        return `
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
        `;
    }
  }}
  
  /* Variant styles */
  ${props => {
    switch (props.$variant) {
      case 'elevated':
        return `
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 8px 30px rgba(245, 158, 11, 0.12), 0 4px 15px rgba(0, 0, 0, 0.08);
          border: none;
          backdrop-filter: blur(16px);
        `;
      case 'outlined':
        return `
          background: rgba(255, 255, 255, 0.7);
          border: 2px solid rgba(245, 158, 11, 0.3);
          box-shadow: none;
          backdrop-filter: blur(8px);
        `;
      case 'filled':
        return `
          background: linear-gradient(135deg, rgba(254, 247, 237, 0.9) 0%, rgba(255, 251, 235, 0.9) 100%);
          border: none;
          box-shadow: inset 0 2px 4px rgba(245, 158, 11, 0.08);
          backdrop-filter: blur(10px);
        `;
      case 'gradient':
        return `
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(254, 247, 237, 0.95) 50%,
            rgba(240, 249, 255, 0.95) 100%);
          border: 1px solid rgba(245, 158, 11, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(12px);
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
          border-left: 4px solid rgba(148, 163, 184, 0.6);
        `;
      case 'medium':
        return `
          border-left: 4px solid rgba(59, 130, 246, 0.6);
        `;
      case 'high':
        return `
          border-left: 4px solid #f59e0b;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.9) 0%, 
            rgba(254, 247, 237, 0.95) 100%);
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
        `;
      case 'critical':
        return `
          border-left: 4px solid #dc2626;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.9) 0%, 
            rgba(254, 242, 242, 0.95) 100%);
          box-shadow: 0 4px 20px rgba(220, 38, 38, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
        `;
      case 'urgent':
        return `
          border: 2px solid #dc2626;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(254, 242, 242, 0.95) 100%);
          box-shadow: 0 4px 20px rgba(220, 38, 38, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
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
      background: linear-gradient(90deg, 
        ${getSubjectColor(props.$subject)} 0%, 
        ${getSubjectColor(props.$subject, 0.7)} 100%);
    }
  `}
  
  /* Full width */
  ${props => props.$fullWidth && `
    width: 100%;
  `}
  
  /* Responsive design */
  @media (max-width: 768px) {
    ${props => props.$responsive && `
      margin: 0 -1rem;
      border-radius: 0;
      border-left: none;
      border-right: none;
    `}
  }
`;

const CardHeader = styled.div`
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return '1rem 1rem 0';
      case 'lg': return '2rem 2rem 0';
      default: return '1.5rem 1.5rem 0';
    }
  }};
  
  ${props => props.$divided && `
    border-bottom: 1px solid rgba(203, 213, 225, 0.5);
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  `}
`;

const CardBody = styled.div`
  flex: 1;
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return props.$hasHeader ? '1rem' : '1rem';
      case 'lg': return props.$hasHeader ? '2rem' : '2rem';
      default: return props.$hasHeader ? '1.5rem' : '1.5rem';
    }
  }};
  
  ${props => props.$hasHeader && `
    padding-top: 0;
  `}
`;

const CardFooter = styled.div`
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return '0 1rem 1rem';
      case 'lg': return '0 2rem 2rem';
      default: return '0 1.5rem 1.5rem';
    }
  }};
  
  ${props => props.$divided && `
    border-top: 1px solid rgba(203, 213, 225, 0.5);
    margin-top: 1rem;
    padding-top: 1rem;
  `}
  
  ${props => props.$actions && `
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
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
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.25;
  color: #1e293b;
  
  ${props => {
    switch (props.$size) {
      case 'sm':
        return `
          font-size: 1rem;
          font-weight: 500;
        `;
      case 'lg':
        return `
          font-size: 1.25rem;
          font-weight: 600;
        `;
      default:
        return '';
    }
  }}
`;

const CardSubtitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #64748b;
`;

const CardDescription = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  line-height: 1.75;
  color: #94a3b8;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  ${props => {
    switch (props.$status) {
      case 'success':
        return `
          background: rgba(34, 197, 94, 0.1);
          color: rgba(21, 128, 61, 1);
        `;
      case 'warning':
        return `
          background: rgba(245, 158, 11, 0.1);
          color: rgba(146, 64, 14, 1);
        `;
      case 'error':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: rgba(153, 27, 27, 1);
        `;
      case 'info':
        return `
          background: rgba(59, 130, 246, 0.1);
          color: rgba(30, 64, 175, 1);
        `;
      default:
        return `
          background: rgba(148, 163, 184, 0.1);
          color: rgba(71, 85, 105, 1);
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