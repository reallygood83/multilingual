import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { DEFAULT_SCHOOL_CONFIG, getSchoolSuggestions } from '../../data/schoolConfig';

const SchoolInfoContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || '1fr'};
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  font-size: 13px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #0969da;
    box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.1);
  }
  
  &:disabled {
    background: #f6f8fa;
    color: #656d76;
  }
`;

const AutoCompleteContainer = styled.div`
  position: relative;
`;

const SuggestionsList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  margin-top: 2px;
  display: ${props => props.$show ? 'block' : 'none'};
`;

const SuggestionItem = styled.button`
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  color: #333;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f6f8fa;
  }
  
  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  
  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const ResetButton = styled.button`
  background: none;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  color: #656d76;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f6f8fa;
    border-color: #0969da;
    color: #0969da;
  }
`;

const SchoolInfoForm = ({ formData, onChange, disabled = false }) => {
  const [schoolSuggestions, setSchoolSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 학교명 자동완성 검색
  useEffect(() => {
    if (formData.schoolName && formData.schoolName.length >= 2) {
      const suggestions = getSchoolSuggestions(formData.schoolName);
      setSchoolSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [formData.schoolName]);

  const handleSchoolSuggestionSelect = (suggestion) => {
    onChange('schoolName', suggestion.fullName);
    setShowSuggestions(false);
  };

  const handleResetSchoolInfo = () => {
    const resetData = { ...DEFAULT_SCHOOL_CONFIG };
    Object.keys(resetData).forEach(key => {
      onChange(key, resetData[key]);
    });
  };

  return (
    <SchoolInfoContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <SectionTitle>
          🏫 학교 정보 (자동완성)
        </SectionTitle>
        <ResetButton onClick={handleResetSchoolInfo} type="button" disabled={disabled}>
          기본값 복원
        </ResetButton>
      </div>
      
      <FormRow $columns="1fr 1fr">
        <FormGroup>
          <Label>학교명 *</Label>
          <AutoCompleteContainer>
            <Input
              type="text"
              value={formData.schoolName || ''}
              onChange={(e) => onChange('schoolName', e.target.value)}
              placeholder="예: 서울둔촌초등학교"
              disabled={disabled}
            />
            <SuggestionsList $show={showSuggestions && !disabled}>
              {schoolSuggestions.map((suggestion, index) => (
                <SuggestionItem
                  key={index}
                  onClick={() => handleSchoolSuggestionSelect(suggestion)}
                  type="button"
                >
                  <strong>{suggestion.fullName}</strong>
                  <div style={{ fontSize: '11px', color: '#656d76', marginTop: '2px' }}>
                    {suggestion.type} · {suggestion.region}
                  </div>
                </SuggestionItem>
              ))}
            </SuggestionsList>
          </AutoCompleteContainer>
        </FormGroup>
        
        <FormGroup>
          <Label>학교 전화번호</Label>
          <Input
            type="text"
            value={formData.schoolPhone || ''}
            onChange={(e) => onChange('schoolPhone', e.target.value)}
            placeholder="02-000-0000"
            disabled={disabled}
          />
        </FormGroup>
      </FormRow>
      
      <FormRow>
        <FormGroup>
          <Label>학교 주소</Label>
          <Input
            type="text"
            value={formData.schoolAddress || ''}
            onChange={(e) => onChange('schoolAddress', e.target.value)}
            placeholder="서울시 강동구 둔촌동 123번지"
            disabled={disabled}
          />
        </FormGroup>
      </FormRow>
      
      <FormRow $columns="1fr 1fr">
        <FormGroup>
          <Label>교장 선생님 성함</Label>
          <Input
            type="text"
            value={formData.principalName || ''}
            onChange={(e) => onChange('principalName', e.target.value)}
            placeholder="홍길동"
            disabled={disabled}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>교감 선생님 성함</Label>
          <Input
            type="text"
            value={formData.vicePrincipalName || ''}
            onChange={(e) => onChange('vicePrincipalName', e.target.value)}
            placeholder="김철수"
            disabled={disabled}
          />
        </FormGroup>
      </FormRow>
      
      <FormRow>
        <FormGroup>
          <Label>학교 교육목표 (선택사항)</Label>
          <Input
            type="text"
            value={formData.schoolMotto || ''}
            onChange={(e) => onChange('schoolMotto', e.target.value)}
            placeholder="꿈과 희망이 자라는 행복한 학교"
            disabled={disabled}
          />
        </FormGroup>
      </FormRow>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#656d76', 
        marginTop: '12px',
        padding: '8px 12px',
        background: '#dbeafe',
        borderRadius: '4px',
        border: '1px solid #bfdbfe'
      }}>
        💡 <strong>자동완성 기능:</strong> 학교명을 입력하면 지역별 학교 정보가 자동으로 설정됩니다.
        한 번 설정하면 이후 통신문 작성 시에도 계속 사용됩니다.
      </div>
    </SchoolInfoContainer>
  );
};

SchoolInfoForm.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default SchoolInfoForm;