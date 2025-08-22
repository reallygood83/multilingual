import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { NoticeContentPropsType, sanitizeTextInput, validateHTMLContent } from '../types/noticeTypes';

const ContentContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  min-height: 400px;
`;

const ContentTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const EditableContent = styled.div`
  .ql-editor {
    min-height: 300px;
    font-size: 14px;
    line-height: 1.6;
  }
  
  .ql-toolbar {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
  
  .ql-container {
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
`;

const ReadOnlyContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  
  h1, h2, h3 {
    margin: 15px 0 10px 0;
  }
  
  p {
    margin: 10px 0;
  }
  
  ul, ol {
    margin: 10px 0;
    padding-left: 30px;
  }
  
  li {
    margin: 5px 0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
`;

const NoticeContent = memo(({ 
  data, 
  onChange, 
  editing = false 
}) => {
  // Input validation and sanitization
  const validateAndSanitizeInput = (value) => {
    if (typeof value !== 'string') return '';
    return sanitizeTextInput(value);
  };
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = useMemo(() => [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'align'
  ], []);

  const handleContentChange = useCallback((content) => {
    // Validate HTML content for security
    if (content && !validateHTMLContent(content)) {
      console.warn('HTML content contains potentially dangerous elements');
      return;
    }
    
    onChange({ ...data, content: content || '' });
  }, [data, onChange]);

  const handleIntroChange = useCallback((introText) => {
    // Sanitize intro text input
    const sanitizedIntro = validateAndSanitizeInput(introText);
    onChange({ ...data, introText: sanitizedIntro });
  }, [data, onChange]);

  return (
    <ContentContainer>
      <ContentTitle>
        {editing ? (
          <input
            type="text"
            value={data.introText || '2025학년도 평촌초등학교 영어회화전문강사 선발계획 공고입니다.'}
            onChange={(e) => handleIntroChange(e.target && e.target.value)}
            style={{
              width: '100%',
              border: '1px solid #ccc',
              padding: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          />
        ) : (
          data.introText || '2025학년도 평촌초등학교 영어회화전문강사 선발계획 공고입니다.'
        )}
      </ContentTitle>

      {editing ? (
        <EditableContent>
          <ReactQuill
            theme="snow"
            value={data.content || ''}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            placeholder="가정통신문 내용을 작성해주세요..."
          />
        </EditableContent>
      ) : (
        <ReadOnlyContent
          dangerouslySetInnerHTML={{ 
            __html: data.content || '<p>내용이 없습니다.</p>' 
          }}
        />
      )}
    </ContentContainer>
  );
});

// PropTypes validation
NoticeContent.propTypes = NoticeContentPropsType;

// Default props
NoticeContent.defaultProps = {
  editing: false
};

// Display name for debugging
NoticeContent.displayName = 'NoticeContent';

export default NoticeContent;