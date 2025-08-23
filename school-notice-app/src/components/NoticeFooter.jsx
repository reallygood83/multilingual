import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NoticeFooterPropsType, sanitizeTextInput } from '../types/noticeTypes';

const FooterContainer = styled.div.attrs(() => ({ 'data-clean-remove-top-border': 'true' }))`
  margin-top: 30px;
  padding: 20px;
  border-top: 1px solid #ddd;
`;



const Notice = styled.div`
  margin: 15px 0;
  padding: 10px;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  font-size: 14px;
`;

const SignatureSection = styled.div`
  text-align: center;
  margin: 30px 0;
`;

const DateSection = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const SignatureTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
`;

const EditableField = styled.input`
  background: ${props => props.$editing ? 'white' : 'transparent'};
  border: ${props => props.$editing ? '1px solid #000' : 'none'};
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  padding: ${props => props.$editing ? '2px 4px' : '0'};
  margin: ${props => props.$editing ? '0 2px' : '0'};
  width: ${props => props.$width || 'auto'};
  text-align: ${props => props.$textAlign || 'left'};
`;

const EditableTextArea = styled.textarea`
  background: ${props => props.$editing ? 'white' : 'transparent'};
  border: ${props => props.$editing ? '1px solid #000' : 'none'};
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  padding: ${props => props.$editing ? '2px 4px' : '0'};
  margin: ${props => props.$editing ? '0 2px' : '0'};
  width: 100%;
  resize: vertical;
  min-height: ${props => props.$editing ? '60px' : 'auto'};
`;

const NoticeFooter = memo(({ 
  data, 
  onChange, 
  editing = false 
}) => {
  // Input validation and sanitization
  const validateAndSanitizeInput = (value) => {
    if (typeof value !== 'string') return '';
    return sanitizeTextInput(value);
  };
  const handleFieldChange = useCallback((field, value) => {
    // Validate and sanitize input before updating
    const sanitizedValue = validateAndSanitizeInput(value);
    onChange({ ...data, [field]: sanitizedValue });
  }, [data, onChange]);



  const currentDate = useMemo(() => 
    new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '년 ').replace(/\.$/, '일')
  , []);

  return (
    <FooterContainer>





      {/* 서명 섹션 */}
      <SignatureSection>
        <DateSection>
          <EditableField
            type="text"
            value={data.date || currentDate}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            $editing={editing}
            disabled={!editing}
            $width="150px"
            $textAlign="center"
          />
        </DateSection>
        
        <SignatureTitle>
          <EditableField
            type="text"
            value={data.signature || '서명을 입력하세요'}
            onChange={(e) => handleFieldChange('signature', e.target.value)}
            $editing={editing}
            disabled={!editing}
            $width="200px"
            $textAlign="center"
            style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}
          />
        </SignatureTitle>
      </SignatureSection>
    </FooterContainer>
  );
});

// PropTypes validation
NoticeFooter.propTypes = NoticeFooterPropsType;

// Display name for debugging
NoticeFooter.displayName = 'NoticeFooter';

export default NoticeFooter;