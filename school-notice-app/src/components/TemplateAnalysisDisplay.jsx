import React from 'react';
import styled from 'styled-components';

const AnalysisContainer = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  font-size: 14px;
`;

const AnalysisTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AnalysisItem = styled.div`
  margin: 8px 0;
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #28a745;
`;

const AnalysisLabel = styled.span`
  font-weight: 600;
  color: #495057;
  margin-right: 8px;
`;

const AnalysisValue = styled.span`
  color: #6c757d;
`;

const StyleInfo = styled.div`
  margin: 12px 0;
  padding: 12px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #007bff;
`;

const StyleLabel = styled.div`
  font-weight: 600;
  color: #495057;
  margin-bottom: 4px;
`;

const StyleValue = styled.div`
  color: #6c757d;
  font-family: monospace;
  font-size: 12px;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 12px;
  margin: 8px 0;
`;

const TemplateAnalysisDisplay = ({ analysis }) => {
  if (!analysis) {
    return null;
  }

  if (!analysis.success) {
    return (
      <AnalysisContainer>
        <AnalysisTitle>
          ❌ 템플릿 분석 실패
        </AnalysisTitle>
        <ErrorMessage>
          {analysis.error || '템플릿을 분석하는 중 오류가 발생했습니다.'}
        </ErrorMessage>
      </AnalysisContainer>
    );
  }

  const { 
    extractedFields, 
    structure, 
    formatting, 
    recommendations, 
    documentType,
    content,
    confidence 
  } = analysis.analysis || {};

  return (
    <AnalysisContainer>
      <AnalysisTitle>
        ✅ 템플릿 분석 완료 {confidence && `(신뢰도: ${Math.round(confidence * 100)}%)`}
      </AnalysisTitle>
      
      {documentType && (
        <AnalysisItem>
          <AnalysisLabel>문서 유형:</AnalysisLabel>
          <AnalysisValue>{documentType}</AnalysisValue>
        </AnalysisItem>
      )}

      {extractedFields && (
        <div>
          <StyleLabel>추출된 정보:</StyleLabel>
          {extractedFields.school && (
            <AnalysisItem>
              <AnalysisLabel>학교명:</AnalysisLabel>
              <AnalysisValue>{extractedFields.school}</AnalysisValue>
            </AnalysisItem>
          )}
          {extractedFields.year && (
            <AnalysisItem>
              <AnalysisLabel>학년도:</AnalysisLabel>
              <AnalysisValue>{extractedFields.year}</AnalysisValue>
            </AnalysisItem>
          )}
          {extractedFields.title && (
            <AnalysisItem>
              <AnalysisLabel>제목:</AnalysisLabel>
              <AnalysisValue>{extractedFields.title}</AnalysisValue>
            </AnalysisItem>
          )}
          {extractedFields.publisher && (
            <AnalysisItem>
              <AnalysisLabel>발행인:</AnalysisLabel>
              <AnalysisValue>{extractedFields.publisher}</AnalysisValue>
            </AnalysisItem>
          )}
          {extractedFields.manager && (
            <AnalysisItem>
              <AnalysisLabel>담당자:</AnalysisLabel>
              <AnalysisValue>{extractedFields.manager}</AnalysisValue>
            </AnalysisItem>
          )}
          {extractedFields.address && (
            <AnalysisItem>
              <AnalysisLabel>주소:</AnalysisLabel>
              <AnalysisValue>{extractedFields.address}</AnalysisValue>
            </AnalysisItem>
          )}
          {extractedFields.phone && (
            <AnalysisItem>
              <AnalysisLabel>전화번호:</AnalysisLabel>
              <AnalysisValue>{extractedFields.phone}</AnalysisValue>
            </AnalysisItem>
          )}
          {extractedFields.date && (
            <AnalysisItem>
              <AnalysisLabel>작성일:</AnalysisLabel>
              <AnalysisValue>{extractedFields.date}</AnalysisValue>
            </AnalysisItem>
          )}
        </div>
      )}

      {structure && (
        <StyleInfo>
          <StyleLabel>문서 구조:</StyleLabel>
          <StyleValue>레이아웃: {structure.layoutType || '단일 컬럼'}</StyleValue>
          <StyleValue>헤더: {structure.hasHeader ? '있음' : '없음'}</StyleValue>
          <StyleValue>푸터: {structure.hasFooter ? '있음' : '없음'}</StyleValue>
          <StyleValue>로고: {structure.hasLogo ? '있음' : '없음'}</StyleValue>
        </StyleInfo>
      )}

      {formatting && (
        <StyleInfo>
          <StyleLabel>서식 정보:</StyleLabel>
          {formatting.fontSizes && formatting.fontSizes.length > 0 && (
            <StyleValue>글꼴 크기: {formatting.fontSizes.join(', ')}</StyleValue>
          )}
          {formatting.colors && formatting.colors.length > 0 && (
            <StyleValue>사용 색상: {formatting.colors.join(', ')}</StyleValue>
          )}
          {formatting.alignment && formatting.alignment.length > 0 && (
            <StyleValue>정렬 방식: {formatting.alignment.join(', ')}</StyleValue>
          )}
        </StyleInfo>
      )}

      {recommendations && recommendations.length > 0 && (
        <StyleInfo>
          <StyleLabel>권장사항:</StyleLabel>
          {recommendations.map((rec, index) => (
            <StyleValue key={index}>• {rec}</StyleValue>
          ))}
        </StyleInfo>
      )}
    </AnalysisContainer>
  );
};

export default TemplateAnalysisDisplay;