import React, { useState, memo, useCallback, useEffect } from 'react';
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
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0;
  flex: 1;
  margin: 0 20px;
`;

const LogoContainer = styled.div.attrs(() => ({ 'data-logo': 'true' }))`
  width: 80px;
  height: 80px;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  overflow: hidden;
`;

const LogoImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
`;

const InfoBar = styled.div`
  background-color: #4472C4;
  color: white;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: flex-start;
  font-size: 12px;
`;

const InfoItem = styled.span`
  margin-right: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
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

const NoticeHeader = memo(({ 
  data, 
  onChange, 
  editing = false,
  onLogoUpload = null 
}) => {
  // Input validation and sanitization
  const validateAndSanitizeInput = (value) => {
    if (typeof value !== 'string') return '';
    return sanitizeTextInput(value);
  };
  const [logoPreview, setLogoPreview] = useState(data.logoUrl || '');

  // Keep local preview in sync with external state (e.g., when toggling edit mode or reloading data)
  useEffect(() => {
    setLogoPreview(data.logoUrl || '');
  }, [data.logoUrl]);

  const handleFieldChange = useCallback((field, value) => {
    // For logoUrl, avoid generic text sanitization to prevent corrupting data URLs
    let finalValue;
    if (field === 'logoUrl') {
      finalValue = typeof value === 'string' ? value.trim() : '';
      // Allow data:image/* base64 or http(s) URLs
      if (finalValue && !/^(data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+|https?:\/\/[^\s]+)$/i.test(finalValue)) {
        console.warn('Invalid logo URL format');
        return;
      }
    } else {
      // Validate and sanitize input before updating for non-logo fields
      finalValue = validateAndSanitizeInput(value);
      // Additional validation for specific fields
      if (field === 'phone' && finalValue && !/^[\d().\s-]+$/.test(finalValue)) {
        console.warn('Invalid phone number format');
        return;
      }
    }
    
    onChange({ ...data, [field]: finalValue });
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
            value={data.year || '0000학년도'}
            onChange={(e) => handleFieldChange('year', e.target.value)}
            $editing={editing}
            disabled={!editing}
            $width="80px"
          />
          <br />
          <EditableField
            type="text"
            value={data.school || '학교명을 입력하세요'}
            onChange={(e) => handleFieldChange('school', e.target.value)}
            $editing={editing}
            disabled={!editing}
            $width="100px"
          />
        </YearInfo>

        <Title>
          <EditableField
            type="text"
            value={data.title || '통신문 제목을 입력'}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            $editing={editing}
            disabled={!editing}
            $width="300px"
            style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}
          />
        </Title>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <LogoContainer>
            {logoPreview ? (
              <LogoImage src={logoPreview} alt="School Logo" />
            ) : (
              <div style={{ fontSize: '10px', color: '#666', textAlign: 'center' }}>학교 로고</div>
            )}
          </LogoContainer>
          {editing && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                id="logo-upload"
                style={{ display: 'none' }}
              />
              <label
                htmlFor="logo-upload"
                style={{
                  display: 'inline-block',
                  padding: '6px 10px',
                  backgroundColor: '#4472C4',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  border: 'none'
                }}
              >
                📁 로고 업로드
              </label>
            </>
          )}
        </div>
      </TopSection>

      <InfoBar>
        <InfoItem>
          ■ 발행인: 
          <EditableField
            type="text"
            value={data.publisher || '발행인을 입력하세요'}
            onChange={(e) => handleFieldChange('publisher', e.target.value)}
            $editing={editing}
            disabled={!editing}
            $width="100px"
          />
        </InfoItem>
        <InfoItem>
          ■ 담당자: 
          <EditableField
            type="text"
            value={data.manager || '담당자를 입력하세요'}
            onChange={(e) => handleFieldChange('manager', e.target.value)}
            $editing={editing}
            disabled={!editing}
            $width="100px"
          />
        </InfoItem>
        <InfoItem>
          ■ 주소: 
          <EditableField
            type="text"
            value={data.address || '주소를 입력하세요'}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            $editing={editing}
            disabled={!editing}
            $width="160px"
          />
        </InfoItem>
        <InfoItem>
          ☎ 
          <EditableField
            type="text"
            value={data.phone || '전화번호를 입력하세요'}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            $editing={editing}
            disabled={!editing}
            $width="120px"
          />
        </InfoItem>
      </InfoBar>

      {/* 통신문 소개글 섹션 */}
      <div style={{ marginTop: '12px' }}>
        <EditableTextArea
          value={data.introText || ''}
          onChange={(e) => handleFieldChange('introText', e.target.value)}
          $editing={editing}
          disabled={!editing}
          placeholder={editing ? '통신문 소개글을 입력하세요 (예: 안녕하세요. 학부모님께 전해드립니다.)' : ''}
          style={{ 
            fontSize: '14px', 
            minHeight: editing ? '60px' : (data.introText ? 'auto' : '0'),
            display: editing || data.introText ? 'block' : 'none'
          }}
        />
      </div>
    </HeaderContainer>
  );
});

// PropTypes validation
NoticeHeader.propTypes = NoticeHeaderPropsType;

// Display name for debugging
NoticeHeader.displayName = 'NoticeHeader';

export default NoticeHeader;