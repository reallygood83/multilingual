import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SmartSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background: white;
  text-align: left;
  transition: border-color 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:focus {
    outline: none;
    border-color: #0969da;
    box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
  }
  
  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
    color: #6c757d;
  }
  
  &:hover:not(:disabled) {
    border-color: #0969da;
  }
`;

const PlaceholderText = styled.span`
  color: ${props => props.$hasValue ? '#333' : '#6c757d'};
`;

const DropdownArrow = styled.span`
  color: #666;
  font-size: 12px;
  transform: rotate(${props => props.$isOpen ? '180deg' : '0deg'});
  transition: transform 0.2s ease;
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const OptionList = styled.div`
  padding: 8px 0;
`;

const OptionItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #f0f8ff;
  }
  
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const OptionIcon = styled.span`
  font-size: 16px;
  opacity: 0.8;
`;

const CustomInputSection = styled.div`
  border-top: 1px solid #e9ecef;
  padding: 12px 16px;
  background: #f8f9fa;
`;

const CustomInputLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
`;

const CustomInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  font-size: 13px;
  
  &:focus {
    outline: none;
    border-color: #0969da;
    box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.1);
  }
`;

const MultiSelectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`;

const Tag = styled.span`
  background: #0969da;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TagRemove = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-left: 2px;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

const SmartSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "선택하세요", 
  disabled = false,
  allowCustomInput = true,
  multiSelect = false,
  customInputPlaceholder = "직접 입력하세요"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customInputValue, setCustomInputValue] = useState('');
  const [selectedValues, setSelectedValues] = useState(multiSelect ? (value || []) : []);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  // Update selected values when value prop changes
  useEffect(() => {
    if (multiSelect) {
      setSelectedValues(value || []);
    }
  }, [value, multiSelect]);

  const handleOptionSelect = (option) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      
      setSelectedValues(newValues);
      onChange(newValues);
    } else {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  const handleCustomInputSubmit = () => {
    if (customInputValue.trim()) {
      if (multiSelect) {
        if (!selectedValues.includes(customInputValue.trim())) {
          const newValues = [...selectedValues, customInputValue.trim()];
          setSelectedValues(newValues);
          onChange(newValues);
        }
      } else {
        onChange(customInputValue.trim());
        setIsOpen(false);
      }
      setCustomInputValue('');
    }
  };

  const handleCustomInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomInputSubmit();
    }
  };

  const removeTag = (valueToRemove) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newValues);
    onChange(newValues);
  };

  const getDisplayText = () => {
    if (multiSelect) {
      return selectedValues.length > 0 
        ? `${selectedValues.length}개 선택됨` 
        : placeholder;
    } else {
      const selectedOption = options.find(opt => opt.value === value);
      return selectedOption ? selectedOption.label : (value || placeholder);
    }
  };

  const isOptionSelected = (optionValue) => {
    return multiSelect 
      ? selectedValues.includes(optionValue)
      : value === optionValue;
  };

  return (
    <SmartSelectContainer ref={containerRef}>
      <SelectButton
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <PlaceholderText $hasValue={multiSelect ? selectedValues.length > 0 : !!value}>
          {getDisplayText()}
        </PlaceholderText>
        <DropdownArrow $isOpen={isOpen}>▼</DropdownArrow>
      </SelectButton>
      
      {multiSelect && selectedValues.length > 0 && (
        <MultiSelectTags>
          {selectedValues.map((selectedValue, index) => {
            const option = options.find(opt => opt.value === selectedValue);
            return (
              <Tag key={index}>
                {option?.icon && <span>{option.icon}</span>}
                {option?.label || selectedValue}
                <TagRemove onClick={() => removeTag(selectedValue)} type="button">
                  ×
                </TagRemove>
              </Tag>
            );
          })}
        </MultiSelectTags>
      )}
      
      <DropdownContainer $isOpen={isOpen}>
        <OptionList>
          {options.map((option, index) => (
            <OptionItem
              key={index}
              onClick={() => handleOptionSelect(option)}
              type="button"
              disabled={option.disabled}
              style={{ 
                background: isOptionSelected(option.value) ? '#f0f8ff' : 'transparent',
                fontWeight: isOptionSelected(option.value) ? '500' : '400'
              }}
            >
              {option.icon && <OptionIcon>{option.icon}</OptionIcon>}
              {option.label}
              {isOptionSelected(option.value) && <span style={{ marginLeft: 'auto', color: '#0969da' }}>✓</span>}
            </OptionItem>
          ))}
        </OptionList>
        
        {allowCustomInput && (
          <CustomInputSection>
            <CustomInputLabel>💡 직접 입력</CustomInputLabel>
            <div style={{ display: 'flex', gap: '8px' }}>
              <CustomInput
                type="text"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                placeholder={customInputPlaceholder}
                onKeyPress={handleCustomInputKeyPress}
              />
              <button
                type="button"
                onClick={handleCustomInputSubmit}
                style={{
                  padding: '8px 12px',
                  background: '#0969da',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                추가
              </button>
            </div>
          </CustomInputSection>
        )}
      </DropdownContainer>
    </SmartSelectContainer>
  );
};

SmartSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    disabled: PropTypes.bool
  })),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  allowCustomInput: PropTypes.bool,
  multiSelect: PropTypes.bool,
  customInputPlaceholder: PropTypes.string
};

export default SmartSelect;