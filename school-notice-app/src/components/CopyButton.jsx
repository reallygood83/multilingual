/**
 * CopyButton - 원클릭 텍스트 복사 컴포넌트
 * 가정통신문 본문 복사를 위한 사용자 친화적 버튼
 */
import React, { useState, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';

// 성공 애니메이션
const successPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const checkmarkDraw = keyframes`
  0% {
    stroke-dashoffset: 16;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
`;

const CopyButtonContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
`;

const StyledCopyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-surface-primary);
  border: 2px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-moderate) var(--ease-out);
  min-height: 36px;
  
  &:hover:not(:disabled) {
    background: var(--color-background-secondary);
    border-color: var(--color-border-interactive);
    color: var(--color-text-primary);
    box-shadow: var(--shadow-sm);
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  /* 성공 상태 */
  ${props => props.copied && css`
    background: var(--color-success-50);
    border-color: var(--color-success-300);
    color: var(--color-success-700);
    animation: ${successPulse} 0.3s ease-out;
  `}
  
  /* 오류 상태 */
  ${props => props.error && css`
    background: var(--color-error-50);
    border-color: var(--color-error-300);
    color: var(--color-error-700);
  `}
  
  /* 모바일 최적화 */
  @media (max-width: 768px) {
    padding: var(--space-3);
    min-width: 44px;
    justify-content: center;
    
    .copy-text {
      display: none;
    }
  }
`;

const CopyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 14px;
  transition: all var(--duration-fast) var(--ease-out);
  
  /* 성공 체크마크 SVG */
  svg {
    width: 16px;
    height: 16px;
    
    path {
      stroke-dasharray: 16;
      stroke-dashoffset: 16;
      animation: ${props => props.copied ? checkmarkDraw : 'none'} 0.3s ease-out forwards;
    }
  }
`;

const CopyFeedback = styled.div`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface-overlay);
  color: var(--color-text-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-lg);
  white-space: nowrap;
  z-index: var(--z-tooltip);
  opacity: 0;
  pointer-events: none;
  transition: all var(--duration-moderate) var(--ease-out);
  
  ${props => (props.show && !props.isMobile) && css`
    opacity: 1;
    transform: translateX(-50%) translateY(-4px);
  `}
  
  /* 말풍선 꼬리 */
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: var(--color-surface-overlay);
  }
`;

const FullCopySection = styled.div`
  position: relative;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin: var(--space-4) 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: var(--space-3);
  gap: var(--space-2);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
  flex: 1;
`;

const SectionContent = styled.div`
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
  white-space: pre-wrap;
  margin-bottom: var(--space-3);
`;

/**
 * 개별 텍스트 복사 버튼 컴포넌트
 */
export const CopyButton = ({ 
  text, 
  size = 'sm',
  variant = 'default',
  showLabel = true,
  successMessage = '복사 완료!',
  errorMessage = '복사 실패',
  onSuccess,
  onError,
  className,
  // 새로운 옵션: 리치 클립보드 지원
  html,            // string: HTML로 복사할 내용
  targetRef,       // React ref: 해당 요소의 outerHTML을 복사
  getHTML,         // () => string : 호출 시점에 HTML 생성
  getPlainText,    // () => string : 호출 시점에 텍스트 생성(plain)
}) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const timeoutRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  const handleCopy = async () => {
    try {
      // 동적으로 콘텐츠 구성
      const resolvedPlain = typeof getPlainText === 'function' ? getPlainText() : (typeof text === 'string' ? text : String(text ?? ''));
      let resolvedHTML = typeof getHTML === 'function' ? getHTML() : html;
      if (!resolvedHTML && targetRef?.current) {
        // 요소의 외부 HTML을 복사 (버튼 등 제어 요소 제외를 원하면 호출부에서 별도 템플릿을 전달하세요)
        resolvedHTML = targetRef.current.outerHTML;
      }

      // 리치 클립보드 지원: HTML과 Plain Text 동시 복사
      if (resolvedHTML && navigator.clipboard && window.ClipboardItem) {
        const data = {
          'text/plain': new Blob([resolvedPlain || resolvedHTML.replace(/<[^>]*>/g, '')], { type: 'text/plain' }),
          'text/html': new Blob([resolvedHTML], { type: 'text/html' })
        };
        await navigator.clipboard.write([new ClipboardItem(data)]);
      } else if (navigator.clipboard && window.isSecureContext) {
        // 일반 텍스트만 복사
        await navigator.clipboard.writeText(resolvedPlain || '');
      } else {
        // 폴백: execCommand 방식 (HTML도 지원 가능)
        const temp = document.createElement('div');
        temp.style.position = 'fixed';
        temp.style.left = '-999999px';
        temp.style.top = '-999999px';
        if (resolvedHTML) {
          temp.setAttribute('contenteditable', 'true');
          temp.innerHTML = resolvedHTML;
        } else {
          temp.textContent = resolvedPlain || '';
        }
        document.body.appendChild(temp);
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(temp);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
        document.body.removeChild(temp);
      }

      // 성공 상태 업데이트
      setCopied(true);
      setError(false);
      setShowFeedback(true);
      onSuccess?.();

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        setShowFeedback(false);
      }, 2000);

    } catch (err) {
      console.error('복사 실패:', err);
      setError(true);
      setCopied(false);
      setShowFeedback(true);
      onError?.(err);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setError(false);
        setShowFeedback(false);
      }, 2000);
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <CopyButtonContainer className={className}>
      <StyledCopyButton
        onClick={handleCopy}
        copied={copied}
        error={error}
        size={size}
        title={copied ? successMessage : '텍스트 복사하기'}
        aria-label={copied ? successMessage : '텍스트 복사하기'}
      >
        <CopyIcon copied={copied}>
          {copied ? (
            <svg viewBox="0 0 16 16" fill="none">
              <path 
                d="M13 4L6 11L3 8" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          ) : error ? (
            '⚠️'
          ) : (
            '📋'
          )}
        </CopyIcon>
        {showLabel && (
          <span className="copy-text">
            {copied ? '복사됨!' : error ? '실패' : '복사'}
          </span>
        )}
      </StyledCopyButton>
      
      <CopyFeedback 
        show={showFeedback} 
        isMobile={isMobile}
      >
        {copied ? successMessage : error ? errorMessage : ''}
      </CopyFeedback>
    </CopyButtonContainer>
  );
};

/**
 * 섹션 전체 복사 컴포넌트
 */
export const CopyableSection = ({ 
  title, 
  content, 
  children,
  showCopyButton = true,
  copyButtonProps = {},
  className 
}) => {
  // 텍스트 내용 추출 (HTML 태그 제거)
  const getTextContent = (content) => {
    if (typeof content === 'string') {
      return content.replace(/<[^>]*>/g, '').trim();
    }
    if (React.isValidElement(content)) {
      return content.props?.children || '';
    }
    return String(content || '').trim();
  };

  const textContent = getTextContent(content || children);
  const htmlContent = typeof (content || children) === 'string' ? (content || children) : undefined;

  return (
    <FullCopySection className={className}>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        {showCopyButton && (textContent || htmlContent) && (
          <CopyButton
            text={textContent}
            html={htmlContent}
            successMessage="섹션 내용이 복사되었습니다!"
            size="sm"
            {...copyButtonProps}
          />
        )}
      </SectionHeader>
      
      <SectionContent>
        {content || children}
      </SectionContent>
    </FullCopySection>
  );
};

/**
 * 전체 문서 복사 버튼
 */
export const CopyAllButton = ({ 
  sections = [],
  title = "가정통신문",
  additionalInfo = "",
  size = 'md',
  variant = 'primary',
  className 
}) => {
  // 전체 문서 텍스트 생성
  const generateFullText = () => {
    let fullText = `${title}\n\n`;
    
    sections.forEach((section, index) => {
      if (section.title) {
        fullText += `${index + 1}. ${section.title}\n`;
      }
      if (section.content) {
        const textContent = typeof section.content === 'string' 
          ? section.content.replace(/<[^>]*>/g, '').trim()
          : String(section.content).trim();
        fullText += `${textContent}\n\n`;
      }
    });
    
    if (additionalInfo) {
      fullText += `${additionalInfo}\n`;
    }
    
    return fullText.trim();
  };

  const StyledFullCopyButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-5);
    background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
    color: var(--color-text-on-primary);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    font-family: var(--font-family-primary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--duration-moderate) var(--ease-out);
    min-height: 44px;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    &:focus-visible {
      outline: 2px solid var(--color-border-focus);
      outline-offset: 2px;
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
    
    /* 모바일 최적화 */
    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
    }
  `;

  return (
    <CopyButton
      text={generateFullText()}
      successMessage="전체 가정통신문이 복사되었습니다!"
      size={size}
      showLabel={true}
      className={className}
      customButton={({ onClick, copied, error }) => (
        <StyledFullCopyButton onClick={onClick}>
          <span style={{ fontSize: '18px' }}>
            {copied ? '✅' : error ? '⚠️' : '📄'}
          </span>
          {copied ? '복사 완료!' : '전체 내용 복사'}
        </StyledFullCopyButton>
      )}
    />
  );
};

export default CopyButton;