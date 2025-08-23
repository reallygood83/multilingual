import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { generatePDFFromElement } from '../services/pdfService';
import 'react-quill/dist/quill.snow.css';

const PreviewContainer = styled.div`
  position: sticky;
  top: 20px;
  height: calc(100vh - 40px);
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const PreviewHeader = styled.div`
  padding: 16px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #333;
`;

const PreviewContent = styled.div`
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const A4Paper = styled.div`
  width: 210mm;
  min-height: 297mm;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  padding: 20mm;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 12pt;
  line-height: 1.6;
  color: #333;
  transform: scale(0.7);
  transform-origin: top center;
  
  @media (max-width: 1400px) {
    transform: scale(0.6);
  }
  
  @media (max-width: 1200px) {
    transform: scale(0.5);
  }
  
  /* Ensure Quill alignment classes render in preview */
  .ql-align-center { text-align: center; }
  .ql-align-right { text-align: right; }
  .ql-align-justify { text-align: justify; }
`;

const PreviewActions = styled.div`
  padding: 12px 16px;
  background: #ffffff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  background: #ffffff;
  color: #24292f;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f6f8fa;
  }
  
  &.primary {
    background: #0969da;
    color: white;
    border-color: #0969da;
    
    &:hover {
      background: #0860ca;
    }
  }
  
  &:disabled {
    background: #f6f8fa;
    color: #8c959f;
    cursor: not-allowed;
  }
`;

const EmptyPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
  text-align: center;
  
  h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const A4PreviewPanel = ({ noticeData, isVisible = true }) => {
  const previewRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scale, setScale] = useState(0.7);

  const handleGeneratePreviewPDF = useCallback(async () => {
    if (!previewRef.current) return;
    
    setIsGenerating(true);
    try {
      await generatePDFFromElement(previewRef.current, 'preview.pdf');
    } catch (error) {
      console.error('Preview PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const adjustScale = useCallback((newScale) => {
    setScale(Math.max(0.3, Math.min(1.0, newScale)));
  }, []);

  if (!isVisible) {
    return null;
  }

  const hasContent = noticeData && (noticeData.content || noticeData.title || noticeData.school);

  return (
    <PreviewContainer>
      <PreviewHeader>
        <span>📄 A4 미리보기</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>크기:</span>
          <ActionButton onClick={() => adjustScale(scale - 0.1)}>-</ActionButton>
          <span style={{ fontSize: '12px', minWidth: '40px', textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>
          <ActionButton onClick={() => adjustScale(scale + 0.1)}>+</ActionButton>
        </div>
      </PreviewHeader>
      
      <PreviewContent>
        {hasContent ? (
          <A4Paper ref={previewRef} style={{ transform: `scale(${scale})` }}>
            {/* 상단 헤더: 학년도/학교 + 로고 */}
            {(noticeData.school || noticeData.year || noticeData.logoUrl) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '12pt', lineHeight: 1.2, textAlign: 'center' }}>
                  <div>{noticeData.year || ''}</div>
                  <div>{noticeData.school || ''}</div>
                </div>
                <div style={{ width: '80px', height: '80px', border: '1px solid #000', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} data-logo>
                  {noticeData.logoUrl ? (
                    <img src={noticeData.logoUrl} alt="School Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
                  ) : (
                    <span style={{ fontSize: '10pt', color: '#666' }}>학교 로고</span>
                  )}
                </div>
              </div>
            )}
            
            {/* 제목 */}
            {noticeData.title && (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ 
                  margin: '0', 
                  fontSize: '16pt', 
                  fontWeight: 'bold',
                  padding: '10px 0',
                  borderTop: '2px solid #333',
                  borderBottom: '2px solid #333'
                }}>
                  {noticeData.title}
                </h1>
              </div>
            )}
            
            {/* 정보 바 */}
            {(noticeData.publisher || noticeData.manager || noticeData.address || noticeData.phone) && (
              <div style={{ background: '#4472C4', color: '#fff', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '10pt', marginBottom: '20px' }}>
                {noticeData.publisher && <span>■ 발행인: {noticeData.publisher}</span>}
                {noticeData.manager && <span>■ 담당자: {noticeData.manager}</span>}
                {noticeData.address && <span>■ 주소: {noticeData.address}</span>}
                {noticeData.phone && <span>☎ {noticeData.phone}</span>}
              </div>
            )}
            
            {/* 내용 (HTML 렌더링) */}
            {noticeData.content && (
              <div
                style={{ marginBottom: '40px', lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: noticeData.content }}
              />
            )}

            {(noticeData.date || noticeData.signature) && (
              <div style={{ textAlign: 'center', marginTop: '60px' }}>
                {noticeData.date && (
                  <div style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '20px' }}>
                    {noticeData.date}
                  </div>
                )}
                {noticeData.signature && (
                  <div style={{ fontSize: '14pt', fontWeight: 'bold', letterSpacing: '4px' }}>
                    {noticeData.signature}
                  </div>
                )}
              </div>
            )}
          </A4Paper>
        ) : (
          <EmptyPreview>
            <h4>📄 미리보기 대기 중</h4>
            <p>내용을 입력하면 실시간으로 A4 형태의 미리보기가 표시됩니다.</p>
          </EmptyPreview>
        )}
      </PreviewContent>
      
      {hasContent && (
        <PreviewActions>
          <ActionButton 
            className="primary"
            onClick={handleGeneratePreviewPDF}
            disabled={isGenerating}
          >
            {isGenerating ? '생성 중...' : 'PDF 다운로드'}
          </ActionButton>
          <ActionButton onClick={() => adjustScale(0.7)}>
            기본 크기
          </ActionButton>
        </PreviewActions>
      )}
    </PreviewContainer>
  );
};

export default A4PreviewPanel;