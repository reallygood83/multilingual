import React, { memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { NoticeContentPropsType, sanitizeTextInput, validateHTMLContent } from '../types/noticeTypes';

const ContentContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #000;
  min-height: 400px;
  background: #ffffff;
`;



const EditableContent = styled.div`
  .ql-editor {
    min-height: 300px;
    font-size: 14px;
    line-height: 1.6;
    background: #ffffff;
  }
  
  .ql-toolbar {
    border: 1px solid #000;
    background: #ffffff;
    padding: 8px;
  }
  
  .ql-container {
    border: 1px solid #000;
    border-top: none;
    background: #ffffff;
  }
  
  /* 줄간격 스타일 */
  .ql-editor .ql-line-height-1 { line-height: 1.0; }
  .ql-editor .ql-line-height-1-2 { line-height: 1.2; }
  .ql-editor .ql-line-height-1-5 { line-height: 1.5; }
  .ql-editor .ql-line-height-2 { line-height: 2.0; }
  .ql-editor .ql-line-height-2-5 { line-height: 2.5; }
  
  /* 글꼴 크기 확장 */
  .ql-editor .ql-size-small { font-size: 0.75em; }
  .ql-editor .ql-size-large { font-size: 1.5em; }
  .ql-editor .ql-size-huge { font-size: 2.5em; }
  
  /* 툴바 아이콘 개선 */
  .ql-toolbar .ql-formats {
    margin-right: 15px;
  }
  
  .ql-toolbar button {
    padding: 5px;
    margin: 1px;
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
    border: 1px solid #000;
    padding: 8px;
    text-align: left;
    background: #ffffff;
  }
  
  th {
    background-color: #ffffff;
    font-weight: bold;
    border: 1px solid #000;
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
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        [{ 'line-height': ['1', '1.2', '1.5', '2', '2.5'] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        [{ 'direction': 'rtl' }],
        ['clean']
      ]
    }
  }), []);

  const formats = useMemo(() => [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'align',
    'color', 'background', 'script',
    'code-block', 'direction', 'line-height'
  ], []);

  const handleContentChange = useCallback((content, delta, source, editor) => {
    // We only want to update state from user changes, not programmatic ones.
    if (source === 'user') {
      const sanitizedContent = content === '<p><br></p>' ? '' : content;
      onChange({ ...data, content: sanitizedContent });
    }
  }, [data, onChange]);

  // ReactQuill 에디터 설정 개선
  const quillProps = useMemo(() => ({
    theme: "snow",
    value: data.content || '',
    onChange: handleContentChange,
    modules: modules,
    formats: formats,
    placeholder: "통신문 내용을 입력하세요. 예: 학교 행사 안내, 공지사항, 가정통신문 등",
    preserveWhitespace: true,
    bounds: 'self',
    scrollingContainer: null,
    readOnly: false
  }), [data.content, handleContentChange, modules, formats]);



  return (
    <ContentContainer>

      {editing ? (
        <EditableContent>
          <ReactQuill
            {...quillProps}
          />
        </EditableContent>
      ) : (
        <ReadOnlyContent
          dangerouslySetInnerHTML={{ 
            __html: data.content || '' 
          }}
        />
      )}
    </ContentContainer>
  );
});

// PropTypes validation
NoticeContent.propTypes = NoticeContentPropsType;

// Display name for debugging
NoticeContent.displayName = 'NoticeContent';

export default NoticeContent;