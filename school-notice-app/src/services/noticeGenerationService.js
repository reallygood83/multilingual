import { translateWithGemini } from './geminiService';

/**
 * AI를 이용하여 통신문을 생성하는 서비스
 */

// 카테고리별 프롬프트 템플릿
const CATEGORY_PROMPTS = {
  event: {
    name: '학교 행사 안내',
    template: `학교 행사 안내 통신문을 작성해주세요.

행사명: {title}
목적: {purpose}
대상: {targetAudience}
주요 내용: {keyDetails}
추가 정보: {additionalInfo}
첨부 파일 또는 붙임: {attachmentDescription}

다음 형식으로 작성해주세요:
1. 인사말로 시작
2. 행사 개요 및 목적 설명
3. 일시, 장소, 대상 등 구체적 정보
4. 준비물 및 주의사항
5. 참가 의사 확인 방법
6. 문의처 안내
7. 정중한 마무리 인사

학교 공식 통신문 형식으로 정중하고 명확하게 작성해주세요.`
  },
  academic: {
    name: '학사 일정 안내',
    template: `학사 일정 안내 통신문을 작성해주세요.

제목: {title}
목적: {purpose}
대상: {targetAudience}
주요 내용: {keyDetails}
추가 정보: {additionalInfo}
첨부 파일 또는 붙임: {attachmentDescription}

다음 형식으로 작성해주세요:
1. 정중한 인사말
2. 학사 일정 안내의 목적
3. 구체적인 일정 및 시간표
4. 준비사항 및 유의사항
5. 학부모 협조 요청사항
6. 문의처 및 연락방법
7. 감사 인사로 마무리

교육적이고 공식적인 톤으로 작성해주세요.`
  },
  safety: {
    name: '안전 교육 안내',
    template: `안전 교육 관련 통신문을 작성해주세요.

제목: {title}
목적: {purpose}
대상: {targetAudience}
주요 내용: {keyDetails}
추가 정보: {additionalInfo}
첨부 파일 또는 붙임: {attachmentDescription}

다음 형식으로 작성해주세요:
1. 안전의 중요성을 강조하는 인사말
2. 안전 교육의 필요성 및 목적
3. 교육 내용 및 일정
4. 가정에서의 안전 수칙
5. 학부모 역할 및 협조사항
6. 비상시 연락처
7. 안전한 학교생활을 위한 당부 말씀

안전의 중요성을 강조하면서도 불안감을 주지 않는 균형잡힌 톤으로 작성해주세요.`
  },
  health: {
    name: '보건 관련 안내',
    template: `보건 관련 안내 통신문을 작성해주세요.

제목: {title}
목적: {purpose}
대상: {targetAudience}
주요 내용: {keyDetails}
추가 정보: {additionalInfo}
첨부 파일 또는 붙임: {attachmentDescription}

다음 형식으로 작성해주세요:
1. 건강의 중요성을 언급하는 인사말
2. 보건 관련 안내의 목적 및 배경
3. 구체적인 일정 및 절차
4. 준비사항 및 주의사항
5. 가정에서의 건강 관리 방법
6. 문의처 및 보건실 연락처
7. 건강한 학교생활을 위한 당부

의료적 정확성을 유지하면서도 이해하기 쉽게 작성해주세요.`
  },
  volunteer: {
    name: '학부모 참여 안내',
    template: `학부모 참여 관련 통신문을 작성해주세요.

제목: {title}
목적: {purpose}
대상: {targetAudience}
주요 내용: {keyDetails}
추가 정보: {additionalInfo}
첨부 파일 또는 붙임: {attachmentDescription}

다음 형식으로 작성해주세요:
1. 학부모님의 관심과 참여에 감사하는 인사말
2. 참여 활동의 목적 및 의미
3. 구체적인 활동 내용 및 일정
4. 참여 방법 및 신청 절차
5. 참여 시 유의사항
6. 문의처 및 담당자 연락처
7. 적극적인 참여를 부탁하는 마무리

학부모님의 자발적 참여를 독려하는 따뜻하고 정중한 톤으로 작성해주세요.`
  },
  general: {
    name: '일반 공지사항',
    template: `일반 공지사항 통신문을 작성해주세요.

제목: {title}
목적: {purpose}
대상: {targetAudience}
주요 내용: {keyDetails}
추가 정보: {additionalInfo}
첨부 파일 또는 붙임: {attachmentDescription}

다음 형식으로 작성해주세요:
1. 정중한 인사말
2. 공지사항의 배경 및 목적
3. 구체적인 내용 및 세부사항
4. 시행 일정 및 절차
5. 학부모 협조 요청사항
6. 문의처 및 연락방법
7. 이해와 협조에 감사하는 마무리

공식적이면서도 친근한 톤으로 명확하게 작성해주세요.`
  }
};

/**
 * 프롬프트 템플릿에 데이터를 삽입하여 완성된 프롬프트를 생성
 */
function generatePrompt(category, data) {
  const categoryInfo = CATEGORY_PROMPTS[category];
  if (!categoryInfo) {
    throw new Error(`지원하지 않는 카테고리입니다: ${category}`);
  }

  let prompt = categoryInfo.template;
  
  // 템플릿 변수 치환
  Object.keys(data).forEach(key => {
    const value = data[key] || '(정보 없음)';
    prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  return prompt;
}

/**
 * AI를 이용하여 통신문 생성
 */
export async function generateNoticeWithAI(requestData, apiKeyOverride = undefined) {
  try {
    const { category, title, purpose, targetAudience, keyDetails, additionalInfo, attachmentDescription } = requestData;
    
    // 입력 데이터 검증
    if (!category || !title || !purpose) {
      throw new Error('필수 정보가 누락되었습니다. (카테고리, 제목, 목적)');
    }

    // 프롬프트 생성
    const prompt = generatePrompt(category, {
      title,
      purpose,
      targetAudience: targetAudience || '학부모님',
      keyDetails: keyDetails || '상세 내용은 추후 안내드리겠습니다.',
      additionalInfo: additionalInfo || '문의사항이 있으시면 언제든 연락주세요.',
      attachmentDescription: attachmentDescription || '해당 없음'
    });

    // AI를 통한 통신문 생성
    const apiKey = apiKeyOverride || import.meta.env.VITE_GEMINI_API_KEY;
    const generatedContent = await translateWithGemini(prompt, 'ko', apiKey);
    
    if (!generatedContent || generatedContent.trim().length === 0) {
      throw new Error('AI가 통신문을 생성하지 못했습니다.');
    }

    // 생성된 통신문을 HTML 형식으로 변환
    const htmlContent = convertToHTML(generatedContent);

    return {
      success: true,
      data: {
        introText: title,
        content: htmlContent,
        category: CATEGORY_PROMPTS[category].name,
        generatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('통신문 생성 중 오류:', error);
    return {
      success: false,
      error: error.message || '통신문 생성 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 텍스트를 HTML 형식으로 변환
 */
function convertToHTML(text) {
  if (!text) return '';
  
  // 줄바꿈을 <br> 태그로 변환
  let html = text.replace(/\n/g, '<br>');
  
  // 번호 목록 패턴 감지 및 변환 (1. 2. 3. 형식)
  html = html.replace(/(\d+\.)\s*([^<]*?)(?=<br>|$)/g, '<p><strong>$1</strong> $2</p>');
  
  // 제목 패턴 감지 (■, ●, ◆ 등으로 시작하는 줄)
  html = html.replace(/([■●◆▶])\s*([^<]*?)(?=<br>|$)/g, '<h4>$1 $2</h4>');
  
  // 강조 표시 (**텍스트** 형식)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 기본 단락 처리
  html = html.replace(/<br><br>/g, '</p><p>');
  
  // 전체를 단락으로 감싸기
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }
  
  return html;
}

/**
 * 사용 가능한 카테고리 목록 반환
 */
export function getAvailableCategories() {
  return Object.keys(CATEGORY_PROMPTS).map(key => ({
    id: key,
    name: CATEGORY_PROMPTS[key].name
  }));
}

/**
 * 카테고리 정보 반환
 */
export function getCategoryInfo(categoryId) {
  return CATEGORY_PROMPTS[categoryId] || null;
}