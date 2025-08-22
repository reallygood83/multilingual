import React, { memo } from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  padding: 12px 16px;
  border-radius: 6px;
  margin: 10px 0;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &.success {
    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
    color: #155724;
    border-left: 4px solid #28a745;
    box-shadow: 0 2px 4px rgba(40, 167, 69, 0.1);
  }
  
  &.error {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    color: #721c24;
    border-left: 4px solid #dc3545;
    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.1);
  }
  
  &.info {
    background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
    color: #0c5460;
    border-left: 4px solid #17a2b8;
    box-shadow: 0 2px 4px rgba(23, 162, 184, 0.1);
  }
  
  &.warning {
    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
    color: #856404;
    border-left: 4px solid #ffc107;
    box-shadow: 0 2px 4px rgba(255, 193, 7, 0.1);
  }
`;

const IconWrapper = styled.span`
  font-size: 16px;
  flex-shrink: 0;
`;

const MessageText = styled.span`
  flex: 1;
  line-height: 1.4;
`;

const getIcon = (type) => {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'info': return 'ℹ️';
    case 'warning': return '⚠️';
    default: return 'ℹ️';
  }
};

const StatusMessage = memo(({ text, type = 'info', className = '' }) => {
  if (!text) return null;

  return (
    <MessageContainer className={`${type} ${className}`.trim()}>
      <IconWrapper>{getIcon(type)}</IconWrapper>
      <MessageText>{text}</MessageText>
    </MessageContainer>
  );
});

StatusMessage.displayName = 'StatusMessage';

export default StatusMessage;