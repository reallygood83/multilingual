import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  margin-top: 30px;
  padding: 20px;
  border-top: 1px solid #ddd;
`;

const AttachmentInfo = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-left: 4px solid #4472C4;
`;

const AttachmentTitle = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const AttachmentList = styled.ul`
  margin: 10px 0;
  padding-left: 20px;
`;

const AttachmentItem = styled.li`
  margin: 5px 0;
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
  background: ${props => props.editing ? 'white' : 'transparent'};
  border: ${props => props.editing ? '1px solid #ccc' : 'none'};
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  padding: ${props => props.editing ? '2px 4px' : '0'};
  margin: ${props => props.editing ? '0 2px' : '0'};
  width: ${props => props.width || 'auto'};
  text-align: ${props => props.textAlign || 'left'};
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

const NoticeFooter = ({ 
  data, 
  onChange, 
  editing = false 
}) => {
  const handleFieldChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleAttachmentChange = (index, value) => {
    const newAttachments = [...(data.attachments || [])];
    newAttachments[index] = value;
    handleFieldChange('attachments', newAttachments);
  };

  const addAttachment = () => {
    const newAttachments = [...(data.attachments || []), ''];
    handleFieldChange('attachments', newAttachments);
  };

  const removeAttachment = (index) => {
    const newAttachments = (data.attachments || []).filter((_, i) => i !== index);
    handleFieldChange('attachments', newAttachments);
  };

  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '년 ').replace(/\.$/, '일');

  return (
    <FooterContainer>
      {/* 첨부파일 섹션 */}
      <AttachmentInfo>
        <AttachmentTitle>
          첨부 파일명: (
          <EditableField
            type="text"
            value={data.attachmentDescription || '2025학년도 평촌초 영어회화전문강사 지원자000'}
            onChange={(e) => handleFieldChange('attachmentDescription', e.target.value)}
            editing={editing}
            disabled={!editing}
            width="300px"
          />
          )
        </AttachmentTitle>
        
        {editing ? (
          <div>
            <AttachmentList>
              {(data.attachments || []).map((attachment, index) => (
                <AttachmentItem key={index}>
                  <EditableField
                    type="text"
                    value={attachment}
                    onChange={(e) => handleAttachmentChange(index, e.target.value)}
                    editing={editing}
                    disabled={!editing}
                    width="250px"
                    placeholder="첨부파일명을 입력하세요"
                  />
                  {editing && (
                    <button onClick={() => removeAttachment(index)} style={{ marginLeft: '10px' }}>
                      삭제
                    </button>
                  )}
                </AttachmentItem>
              ))}
            </AttachmentList>
            <button onClick={addAttachment} style={{ marginTop: '10px' }}>
              첨부파일 추가
            </button>
          </div>
        ) : (
          <AttachmentList>
            {(data.attachments || ['기타사항: 방문접수는 하지 않음', '제출서류 (※ 첨부파일 참조)']).map((attachment, index) => (
              <AttachmentItem key={index}>- {attachment}</AttachmentItem>
            ))}
          </AttachmentList>
        )}
      </AttachmentInfo>

      {/* 주의사항 */}
      <Notice>
        <EditableTextArea
          value={data.notice || '※ 시험과목 및 배점, 응시원서, 자기소개서 등 자세한 사항은 붙임파일을 참조하시기 바랍니다.'}
          onChange={(e) => handleFieldChange('notice', e.target.value)}
          editing={editing}
          disabled={!editing}
          placeholder="주의사항을 입력하세요"
        />
      </Notice>

      {/* 추가 안내사항 */}
      <div style={{ margin: '20px 0', fontSize: '14px' }}>
        <EditableTextArea
          value={data.additionalInfo || '붙임 영어회화전문강사 채용공고 및 응시원서 1부. 끝.'}
          onChange={(e) => handleFieldChange('additionalInfo', e.target.value)}
          editing={editing}
          disabled={!editing}
          placeholder="추가 안내사항을 입력하세요"
        />
      </div>

      {/* 서명 섹션 */}
      <SignatureSection>
        <DateSection>
          <EditableField
            type="text"
            value={data.date || currentDate}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            editing={editing}
            disabled={!editing}
            width="150px"
            textAlign="center"
          />
        </DateSection>
        
        <SignatureTitle>
          <EditableField
            type="text"
            value={data.signature || 'O O 초 등 학 교 장'}
            onChange={(e) => handleFieldChange('signature', e.target.value)}
            editing={editing}
            disabled={!editing}
            width="200px"
            textAlign="center"
            style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}
          />
        </SignatureTitle>
      </SignatureSection>
    </FooterContainer>
  );
};

export default NoticeFooter;