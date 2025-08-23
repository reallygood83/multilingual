/**
 * ModernInput - A comprehensive input component with floating labels
 * Designed for educational applications with accessibility and validation
 */
import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';

// Input variants for different contexts
const inputVariants = {
  default: css`
    border: 2px solid var(--color-border-default);
    
    &:hover:not(:disabled) {
      border-color: var(--color-border-interactive);
    }
    
    &:focus {
      border-color: var(--color-border-focus);
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
    }
  `,
  
  success: css`
    border: 2px solid var(--color-success-500);
    
    &:focus {
      border-color: var(--color-success-600);
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
  `,
  
  error: css`
    border: 2px solid var(--color-error-500);
    
    &:focus {
      border-color: var(--color-error-600);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `
};

// Input sizes
const inputSizes = {
  sm: css`
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-sm);
    min-height: 36px;
  `,
  
  md: css`
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-size-base);
    min-height: 44px;
  `,
  
  lg: css`
    padding: var(--space-4) var(--space-5);
    font-size: var(--font-size-lg);
    min-height: 52px;
  `
};

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: var(--space-1);
`;

const StyledInput = styled.input`
  width: 100%;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
  border-radius: var(--radius-lg);
  transition: all var(--duration-moderate) var(--ease-out);
  outline: none;
  
  /* Apply size styles */
  ${props => inputSizes[props.size]}
  
  /* Apply variant styles */
  ${props => inputVariants[props.variant]}
  
  /* Placeholder styles */
  &::placeholder {
    color: var(--color-text-tertiary);
    opacity: 1;
  }
  
  /* Floating label padding adjustment */
  ${props => props.hasFloatingLabel && css`
    padding-top: calc(${props.size === 'sm' ? 'var(--space-4)' : props.size === 'lg' ? 'var(--space-6)' : 'var(--space-5)'});
    padding-bottom: calc(${props.size === 'sm' ? 'var(--space-1)' : props.size === 'lg' ? 'var(--space-2)' : 'var(--space-1)'});
  `}
  
  /* Icon padding adjustment */
  ${props => props.hasLeftIcon && css`
    padding-left: calc(${props.size === 'sm' ? '32px' : props.size === 'lg' ? '48px' : '40px'});
  `}
  
  ${props => props.hasRightIcon && css`
    padding-right: calc(${props.size === 'sm' ? '32px' : props.size === 'lg' ? '48px' : '40px'});
  `}
  
  /* Disabled state */
  &:disabled {
    background: var(--color-background-tertiary);
    color: var(--color-text-tertiary);
    cursor: not-allowed;
    border-color: var(--color-border-secondary);
  }
  
  /* Remove autofill styles */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px var(--color-surface-primary) inset;
    -webkit-text-fill-color: var(--color-text-primary);
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const FloatingLabel = styled.label`
  position: absolute;
  left: var(--space-4);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-secondary);
  pointer-events: none;
  transition: all var(--duration-moderate) var(--ease-out);
  transform-origin: left center;
  
  /* Default position (when input is empty) */
  top: 50%;
  transform: translateY(-50%);
  
  /* Active/focused position */
  ${props => (props.isActive || props.hasValue) && css`
    top: ${props.size === 'sm' ? '8px' : props.size === 'lg' ? '12px' : '10px'};
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-primary-600);
    transform: translateY(0);
  `}
  
  /* Error state */
  ${props => props.variant === 'error' && css`
    color: var(--color-error-600);
  `}
  
  /* Success state */
  ${props => props.variant === 'success' && css`
    color: var(--color-success-600);
  `}
  
  /* Icon adjustment */
  ${props => props.hasLeftIcon && css`
    left: calc(${props.size === 'sm' ? '32px' : props.size === 'lg' ? '48px' : '40px'});
  `}
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  pointer-events: none;
  font-size: ${props => props.size === 'sm' ? '14px' : props.size === 'lg' ? '18px' : '16px'};
  
  /* Left icon positioning */
  ${props => props.position === 'left' && css`
    left: ${props.size === 'sm' ? '8px' : props.size === 'lg' ? '16px' : '12px'};
  `}
  
  /* Right icon positioning */
  ${props => props.position === 'right' && css`
    right: ${props.size === 'sm' ? '8px' : props.size === 'lg' ? '16px' : '12px'};
    pointer-events: auto;
    cursor: pointer;
  `}
`;

const HelpText = styled.div`
  margin-top: var(--space-1);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-snug);
  
  /* Default help text */
  color: var(--color-text-secondary);
  
  /* Error message */
  ${props => props.variant === 'error' && css`
    color: var(--color-error-600);
  `}
  
  /* Success message */
  ${props => props.variant === 'success' && css`
    color: var(--color-success-600);
  `}
`;

const CharacterCount = styled.div`
  position: absolute;
  right: var(--space-2);
  bottom: -24px;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  
  ${props => props.isOverLimit && css`
    color: var(--color-error-600);
    font-weight: var(--font-weight-medium);
  `}
`;

/**
 * ModernInput Component
 * 
 * A comprehensive input component with floating labels, validation states,
 * and accessibility features designed for educational applications.
 * 
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} variant - Input variant (default, success, error)
 * @param {string} size - Input size (sm, md, lg)
 * @param {string} label - Floating label text
 * @param {string} placeholder - Placeholder text
 * @param {string} helpText - Help or error message
 * @param {ReactNode} leftIcon - Icon to show on the left
 * @param {ReactNode} rightIcon - Icon to show on the right
 * @param {function} onRightIconClick - Click handler for right icon
 * @param {number} maxLength - Maximum character length
 * @param {boolean} showCharacterCount - Show character count
 * @param {boolean} required - Whether the field is required
 * @param {boolean} disabled - Whether the input is disabled
 * @param {string} value - Controlled value
 * @param {function} onChange - Change handler
 * @param {function} onFocus - Focus handler
 * @param {function} onBlur - Blur handler
 */
const ModernInput = React.forwardRef(({
  type = 'text',
  variant = 'default',
  size = 'md',
  label,
  placeholder,
  helpText,
  leftIcon,
  rightIcon,
  onRightIconClick,
  maxLength,
  showCharacterCount = false,
  required = false,
  disabled = false,
  value = '',
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));
  const inputRef = useRef(null);
  
  // Use forwarded ref or create internal ref
  const actualRef = ref || inputRef;

  const handleFocus = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    setHasValue(Boolean(event.target.value));
    onBlur?.(event);
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    
    // Update local state for floating label
    setHasValue(Boolean(newValue));
    
    // Call parent onChange
    onChange?.(event);
  };

  const handleLabelClick = () => {
    actualRef.current?.focus();
  };

  const handleRightIconClick = (event) => {
    event.stopPropagation();
    onRightIconClick?.(event);
  };

  // Character count logic
  const currentLength = value.length;
  const isOverLimit = maxLength && currentLength > maxLength;

  return (
    <InputContainer>
      <StyledInput
        ref={actualRef}
        type={type}
        variant={variant}
        size={size}
        value={value}
        placeholder={label ? undefined : placeholder}
        hasFloatingLabel={Boolean(label)}
        hasLeftIcon={Boolean(leftIcon)}
        hasRightIcon={Boolean(rightIcon)}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-invalid={variant === 'error'}
        aria-describedby={helpText ? `${props.id}-help` : undefined}
        {...props}
      />
      
      {/* Floating Label */}
      {label && (
        <FloatingLabel
          variant={variant}
          size={size}
          isActive={isFocused}
          hasValue={hasValue}
          hasLeftIcon={Boolean(leftIcon)}
          onClick={handleLabelClick}
        >
          {label}
          {required && ' *'}
        </FloatingLabel>
      )}
      
      {/* Left Icon */}
      {leftIcon && (
        <IconWrapper position="left" size={size}>
          {leftIcon}
        </IconWrapper>
      )}
      
      {/* Right Icon */}
      {rightIcon && (
        <IconWrapper 
          position="right" 
          size={size}
          onClick={onRightIconClick ? handleRightIconClick : undefined}
        >
          {rightIcon}
        </IconWrapper>
      )}
      
      {/* Character Count */}
      {showCharacterCount && maxLength && (
        <CharacterCount isOverLimit={isOverLimit}>
          {currentLength} / {maxLength}
        </CharacterCount>
      )}
      
      {/* Help Text */}
      {helpText && (
        <HelpText 
          variant={variant}
          id={`${props.id}-help`}
        >
          {helpText}
        </HelpText>
      )}
    </InputContainer>
  );
});

ModernInput.displayName = 'ModernInput';

// Textarea component using the same design system
export const ModernTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  resize: vertical;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-relaxed);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
  border: 2px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  transition: all var(--duration-moderate) var(--ease-out);
  outline: none;
  
  &:hover:not(:disabled) {
    border-color: var(--color-border-interactive);
  }
  
  &:focus {
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
  
  &::placeholder {
    color: var(--color-text-tertiary);
    opacity: 1;
  }
  
  &:disabled {
    background: var(--color-background-tertiary);
    color: var(--color-text-tertiary);
    cursor: not-allowed;
    border-color: var(--color-border-secondary);
  }
  
  /* Error state */
  ${props => props.variant === 'error' && css`
    border-color: var(--color-error-500);
    
    &:focus {
      border-color: var(--color-error-600);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
  
  /* Success state */
  ${props => props.variant === 'success' && css`
    border-color: var(--color-success-500);
    
    &:focus {
      border-color: var(--color-success-600);
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
  `}
`;

// Usage examples for documentation
export const InputExamples = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px', maxWidth: '400px' }}>
      <h3>Input Variants</h3>
      
      <ModernInput
        label="이메일 주소"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon="📧"
        helpText="학교 이메일 주소를 입력해주세요"
        required
      />
      
      <ModernInput
        label="비밀번호"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon="🔒"
        rightIcon={showPassword ? "👁️" : "🙈"}
        onRightIconClick={() => setShowPassword(!showPassword)}
        maxLength={20}
        showCharacterCount
        helpText="8자 이상의 비밀번호를 입력해주세요"
        variant={password.length > 0 && password.length < 8 ? 'error' : 'default'}
      />
      
      <ModernInput
        label="학교명"
        placeholder="학교명을 입력해주세요"
        leftIcon="🏫"
        variant="success"
        helpText="인증이 완료된 학교입니다"
      />
      
      <ModernInput
        label="오류 상태"
        variant="error"
        helpText="이 필드는 필수입니다"
        required
      />
      
      <h3>Input Sizes</h3>
      <ModernInput size="sm" placeholder="Small input" />
      <ModernInput size="md" placeholder="Medium input (default)" />
      <ModernInput size="lg" placeholder="Large input" />
      
      <h3>Textarea</h3>
      <ModernTextarea
        placeholder="공지사항 내용을 입력해주세요..."
        rows={4}
      />
    </div>
  );
};

export default ModernInput;