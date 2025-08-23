import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ModernButton } from './ModernButton';

/**
 * Modern Language Selector Component
 * Features: Dropdown with search, flag icons, progress tracking
 */

const SelectorContainer = styled.div`
  position: relative;
  width: 100%;
`;

const LanguageButton = styled(ModernButton)`
  justify-content: space-between;
  width: 100%;
  text-align: left;
  
  ${props => props.$hasTranslation && `
    background: linear-gradient(135deg, var(--edu-success-500) 0%, var(--edu-success-600) 100%);
    color: var(--edu-text-on-primary);
    border-color: var(--edu-success-500);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--edu-success-600) 0%, var(--edu-success-700) 100%);
    }
  `}
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: var(--edu-z-dropdown);
  
  background: var(--edu-surface-primary);
  border: 1px solid var(--edu-neutral-300);
  border-radius: var(--edu-radius-xl);
  box-shadow: var(--edu-shadow-xl);
  
  max-height: 320px;
  overflow: hidden;
  
  transform: translateY(var(--edu-space-2));
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(var(--edu-space-2)) scale(1)' : 'translateY(0) scale(0.95)'};
  transition: all 0.2s var(--edu-ease-out);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--edu-space-3) var(--edu-space-4);
  border: none;
  border-bottom: 1px solid var(--edu-neutral-200);
  background: var(--edu-surface-secondary);
  
  font-size: var(--edu-font-size-sm);
  color: var(--edu-text-primary);
  
  &:focus {
    outline: none;
    background: var(--edu-surface-primary);
    border-bottom-color: var(--edu-primary-500);
  }
  
  &::placeholder {
    color: var(--edu-text-tertiary);
  }
`;

const LanguageList = styled.div`
  max-height: 240px;
  overflow-y: auto;
  padding: var(--edu-space-2);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--edu-neutral-100);
    border-radius: var(--edu-radius-full);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--edu-neutral-400);
    border-radius: var(--edu-radius-full);
    
    &:hover {
      background: var(--edu-neutral-500);
    }
  }
`;

const LanguageOption = styled.button`
  width: 100%;
  padding: var(--edu-space-3) var(--edu-space-4);
  border: none;
  border-radius: var(--edu-radius-lg);
  background: transparent;
  
  display: flex;
  align-items: center;
  gap: var(--edu-space-3);
  
  font-size: var(--edu-font-size-sm);
  color: var(--edu-text-primary);
  text-align: left;
  cursor: pointer;
  transition: var(--edu-transition-fast);
  
  &:hover {
    background: var(--edu-surface-tertiary);
  }
  
  &:focus {
    outline: 2px solid var(--edu-primary-500);
    outline-offset: -2px;
  }
  
  ${props => props.$selected && `
    background: var(--edu-primary-100);
    color: var(--edu-primary-700);
  `}
  
  ${props => props.$hasTranslation && `
    &::after {
      content: '✓';
      margin-left: auto;
      color: var(--edu-success-600);
      font-weight: var(--edu-font-weight-bold);
    }
  `}
`;

const FlagIcon = styled.span`
  width: 24px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--edu-neutral-200);
  border-radius: var(--edu-radius-sm);
  font-size: 14px;
  flex-shrink: 0;
`;

const LanguageInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const LanguageName = styled.span`
  font-weight: var(--edu-font-weight-medium);
  line-height: var(--edu-leading-tight);
`;

const LanguageNative = styled.span`
  font-size: var(--edu-font-size-xs);
  color: var(--edu-text-tertiary);
  line-height: var(--edu-leading-tight);
`;

const ProgressInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--edu-space-1);
  min-width: 60px;
`;

const ProgressText = styled.span`
  font-size: var(--edu-font-size-xs);
  color: var(--edu-text-tertiary);
  font-weight: var(--edu-font-weight-medium);
`;

const ProgressBar = styled.div`
  width: 40px;
  height: 3px;
  background: var(--edu-neutral-200);
  border-radius: var(--edu-radius-full);
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    background: ${props => {
      const progress = props.$progress || 0;
      if (progress === 100) return 'var(--edu-success-500)';
      if (progress >= 50) return 'var(--edu-warning-500)';
      return 'var(--edu-primary-500)';
    }};
    width: ${props => props.$progress || 0}%;
    transition: width 0.3s var(--edu-ease-out);
  }
`;

const EmptyState = styled.div`
  padding: var(--edu-space-8) var(--edu-space-4);
  text-align: center;
  color: var(--edu-text-tertiary);
  
  div {
    font-size: var(--edu-font-size-lg);
    margin-bottom: var(--edu-space-2);
  }
  
  span {
    font-size: var(--edu-font-size-sm);
  }
`;

const ChevronIcon = styled.span`
  margin-left: var(--edu-space-2);
  font-size: var(--edu-font-size-sm);
  color: var(--edu-text-tertiary);
  transition: transform 0.2s var(--edu-ease-out);
  
  ${props => props.$isOpen && `
    transform: rotate(180deg);
  `}
`;

const languages = [
  { code: 'en', name: '영어', native: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '중국어(간체)', native: '中文(简体)', flag: '🇨🇳' },
  { code: 'zh-TW', name: '중국어(번체)', native: '中文(繁體)', flag: '🇹🇼' },
  { code: 'ja', name: '일본어', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', native: '한국어', flag: '🇰🇷' },
  { code: 'vi', name: '베트남어', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: '태국어', native: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: '인도네시아어', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: '말레이어', native: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: '필리핀어', native: 'Filipino', flag: '🇵🇭' },
  { code: 'hi', name: '힌디어', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: '아랍어', native: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: '러시아어', native: 'Русский', flag: '🇷🇺' },
  { code: 'mn', name: '몽골어', native: 'Монгол', flag: '🇲🇳' },
  { code: 'uz', name: '우즈벡어', native: 'O\'zbek', flag: '🇺🇿' },
  { code: 'kk', name: '카자흐어', native: 'Қазақ', flag: '🇰🇿' },
  { code: 'ky', name: '키르기스어', native: 'Кыргыз', flag: '🇰🇬' },
  { code: 'ne', name: '네팔어', native: 'नेपाली', flag: '🇳🇵' },
  { code: 'my', name: '미얀마어', native: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'km', name: '크메르어', native: 'ខ្មែរ', flag: '🇰🇭' },
  { code: 'lo', name: '라오어', native: 'ລາວ', flag: '🇱🇦' },
  { code: 'es', name: '스페인어', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: '프랑스어', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: '독일어', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: '포르투갈어', native: 'Português', flag: '🇵🇹' },
  { code: 'tr', name: '터키어', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'fa', name: '페르시아어', native: 'فارسی', flag: '🇮🇷' },
  { code: 'ur', name: '우르두어', native: 'اردو', flag: '🇵🇰' },
  { code: 'bn', name: '벵골어', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'te', name: '텔루구어', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: '타밀어', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'sw', name: '스와힐리어', native: 'Kiswahili', flag: '🇰🇪' },
];

/**
 * LanguageSelector Component
 * Advanced language selection with search, progress tracking, and modern UI
 */
export const LanguageSelector = ({
  selectedLanguage,
  onLanguageSelect,
  translatedLanguages = [],
  translationProgress = {},
  disabled = false,
  placeholder = "언어를 선택하세요",
  showProgress = true,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.native.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);
  const hasTranslation = translatedLanguages.includes(selectedLanguage);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchQuery(''); // Reset search when opening
    }
  };

  const handleLanguageSelect = (language) => {
    onLanguageSelect(language.code);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getTranslationProgress = (langCode) => {
    return translationProgress[langCode] || 0;
  };

  const isLanguageTranslated = (langCode) => {
    return translatedLanguages.includes(langCode);
  };

  return (
    <SelectorContainer ref={containerRef} className={className} {...props}>
      {/* Main Button */}
      <LanguageButton
        variant={hasTranslation ? "success" : "secondary"}
        onClick={handleToggle}
        disabled={disabled}
        $hasTranslation={hasTranslation}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--edu-space-2)' }}>
          {selectedLang ? (
            <>
              <FlagIcon>{selectedLang.flag}</FlagIcon>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 'var(--edu-font-weight-medium)' }}>
                  {selectedLang.name}
                </span>
                {hasTranslation && (
                  <span style={{ 
                    fontSize: 'var(--edu-font-size-xs)', 
                    opacity: 0.8,
                    lineHeight: 1
                  }}>
                    번역 완료 ✓
                  </span>
                )}
              </div>
            </>
          ) : (
            <span>{placeholder}</span>
          )}
        </div>
        <ChevronIcon $isOpen={isOpen}>▼</ChevronIcon>
      </LanguageButton>

      {/* Dropdown */}
      <DropdownContainer $isOpen={isOpen}>
        {/* Search Input */}
        <SearchInput
          ref={searchRef}
          type="text"
          placeholder="언어 검색..."
          value={searchQuery}
          onChange={handleSearchChange}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Language List */}
        <LanguageList>
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map(language => (
              <LanguageOption
                key={language.code}
                $selected={selectedLanguage === language.code}
                $hasTranslation={isLanguageTranslated(language.code)}
                onClick={() => handleLanguageSelect(language)}
              >
                <FlagIcon>{language.flag}</FlagIcon>
                <LanguageInfo>
                  <LanguageName>{language.name}</LanguageName>
                  <LanguageNative>{language.native}</LanguageNative>
                </LanguageInfo>
                
                {showProgress && (
                  <ProgressInfo>
                    {isLanguageTranslated(language.code) ? (
                      <ProgressText>완료</ProgressText>
                    ) : getTranslationProgress(language.code) > 0 ? (
                      <ProgressText>{getTranslationProgress(language.code)}%</ProgressText>
                    ) : null}
                    
                    {(isLanguageTranslated(language.code) || getTranslationProgress(language.code) > 0) && (
                      <ProgressBar 
                        $progress={isLanguageTranslated(language.code) ? 100 : getTranslationProgress(language.code)} 
                      />
                    )}
                  </ProgressInfo>
                )}
              </LanguageOption>
            ))
          ) : (
            <EmptyState>
              <div>🔍</div>
              <span>검색 결과가 없습니다</span>
            </EmptyState>
          )}
        </LanguageList>
      </DropdownContainer>
    </SelectorContainer>
  );
};

export default LanguageSelector;