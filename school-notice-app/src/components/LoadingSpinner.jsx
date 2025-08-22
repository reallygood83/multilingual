import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid #f3f3f3;
  border-top: 2px solid ${props => props.color || '#007bff'};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.span`
  margin-left: 8px;
  font-size: 14px;
  color: ${props => props.color || '#007bff'};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.center ? 'center' : 'flex-start'};
  padding: ${props => props.padding || '0'};
`;

const LoadingSpinner = ({ 
  size = '20px', 
  color = '#007bff', 
  text = '', 
  center = false, 
  padding = '0' 
}) => {
  return (
    <LoadingContainer center={center} padding={padding}>
      <SpinnerContainer size={size}>
        <Spinner color={color} />
      </SpinnerContainer>
      {text && <LoadingText color={color}>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export default React.memo(LoadingSpinner);