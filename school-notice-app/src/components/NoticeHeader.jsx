import React, { useState, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { NoticeHeaderPropsType, sanitizeTextInput, validateHTMLContent } from '../types/noticeTypes';

const HeaderContainer = styled.div`
  border: 2px solid #000;
  padding: 10px;
  background-color: #f5f5f5;
  margin-bottom: 20px;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const YearInfo = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 1.2;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
  flex: 1;
  margin: 0 20px;
`;

const LogoContainer = styled.div`
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

const LogoImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const InfoBar = styled.div`
  background-color: #4472C4;
  color: white;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;

const InfoItem = styled.span`
  margin-right: 20px;
`;

const EditableField = styled.input`
  background: ${props => props.editing ? 'white' : 'transparent'};
  border: ${props => props.editing ? '1px solid #ccc' : 'none'};
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  padding: ${props => props.editing ? '2px 4px' : '0'};
  margin: ${props => props.editing ? '0 2px' : '0'};
  width: ${props => props.width || 'auto'};
`;

const EditableTextArea = styled.textarea`
  background: ${props => props.editing ? 'white' : 'transparent'};
  border: ${props => props.editing ? '1px solid #ccc' : 'none'};
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  padding: ${props => props.editing ? '2px 4px' : '0'};
  margin: ${props => props.editing ? '0 2px' : '0'};
  width: 100%;
  resize: vertical;
  min-height: ${props => props.editing ? '60px' : 'auto'};
`;

const NoticeHeader = memo(({ 
  data, 
  onChange, 
  editing = false,
  onLogoUpload 
}) => {
  // Input validation and sanitization
  const validateAndSanitizeInput = (value) => {
    if (typeof value !== 'string') return '';
    return sanitizeTextInput(value);
  };
  const [logoPreview, setLogoPreview] = useState(data.logoUrl || '');

  const handleFieldChange = useCallback((field, value) => {
    // Validate and sanitize input before updating
    const sanitizedValue = validateAndSanitizeInput(value);
    
    // Additional validation for specific fields
    if (field === 'phone' && sanitizedValue && !/^[\d().\s-]+$/.test(sanitizedValue)) {
      console.warn('Invalid phone number format');
      return;
    }
    
    if (field === 'logoUrl' && sanitizedValue && !validateHTMLContent(sanitizedValue)) {
      console.warn('Invalid logo URL format');
      return;
    }
    
    onChange({ ...data, [field]: sanitizedValue });
  }, [data, onChange]);

  const handleLogoChange = useCallback((event) => {
    const file = event.target.files && event.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Selected file is not an image');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('File size too large (max 5MB)');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onerror = () => {
      console.error('Error reading file');
    };
    
    reader.onload = (e) => {
      const logoUrl = e.target && e.target.result;
      if (logoUrl && typeof logoUrl === 'string') {
        setLogoPreview(logoUrl);
        handleFieldChange('logoUrl', logoUrl);
        if (onLogoUpload && typeof onLogoUpload === 'function') {
          onLogoUpload(file, logoUrl);
        }
      }
    };
    
    reader.readAsDataURL(file);
  }, [handleFieldChange, onLogoUpload]);

  return (
    <HeaderContainer>
      <TopSection>
        <YearInfo>
          <EditableField
            type="text"
            value={data.year || '2024학년도'}
            onChange={(e) => handleFieldChange('year', e.target.value)}
            editing={editing}
            disabled={!editing}
            width="80px"
          />
          <br />
          <EditableField
            type="text"
            value={data.school || 'OO초등학교'}
            onChange={(e) => handleFieldChange('school', e.target.value)}
            editing={editing}
            disabled={!editing}
            width="100px"
          />
        </YearInfo>

        <Title>
          <EditableField
            type="text"
            value={data.title || '가정통신문 제목'}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            editing={editing}
            disabled={!editing}
            width="300px"
            style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}
          />
        </Title>

        <LogoContainer>
          {editing ? (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ display: 'none' }}
                id="logo-upload"
              />
              <label htmlFor="logo-upload" style={{ cursor: 'pointer', fontSize: '10px', textAlign: 'center' }}>
                {logoPreview ? (
                  <LogoImage src={logoPreview} alt="School Logo" />
                ) : (
                  '로고 업로드'
                )}
              </label>
            </div>
          ) : (
            logoPreview ? (
              <LogoImage src={logoPreview} alt="School Logo" />
            ) : (
              <div style={{ fontSize: '10px', textAlign: 'center' }}>학교 로고</div>
            )
          )}
        </LogoContainer>
      </TopSection>

      <InfoBar>
        <InfoItem>
          ■ 발행인: 
          <EditableField
            type="text"
            value={data.publisher || '교장 김나나'}
            onChange={(e) => handleFieldChange('publisher', e.target.value)}
            editing={editing}
            disabled={!editing}
            width="80px"
          />
        </InfoItem>
        <InfoItem>
          ■ 담당자: 
          <EditableField
            type="text"
            value={data.manager || '교사 김문정'}
            onChange={(e) => handleFieldChange('manager', e.target.value)}
            editing={editing}
            disabled={!editing}
            width="80px"
          />
        </InfoItem>
        <InfoItem>
          ■ 주소: 
          <EditableField
            type="text"
            value={data.address || '경기도 안양시'}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            editing={editing}
            disabled={!editing}
            width="120px"
          />
        </InfoItem>
        <InfoItem>
          ☎ 
          <EditableField
            type="text"
            value={data.phone || '031)000-0000'}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            editing={editing}
            disabled={!editing}
            width="100px"
          />
        </InfoItem>
      </InfoBar>
    </HeaderContainer>
  );
});

// PropTypes validation
NoticeHeader.propTypes = NoticeHeaderPropsType;

// Default props
NoticeHeader.defaultProps = {
  editing: false,
  onLogoUpload: null
};

// Display name for debugging
NoticeHeader.displayName = 'NoticeHeader';

export default NoticeHeader;