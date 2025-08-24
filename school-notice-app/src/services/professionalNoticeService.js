import { translateWithGemini } from './geminiService';

// Gemini API를 직접 호출하여 한국어 가정통신문 생성
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const DEFAULT_MODEL = 'gemini-1.5-flash';

async function generateKoreanContentWithGemini(prompt, apiKey) {
  try {
    const response = await fetch(`${GEMINI_API_BASE_URL}/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API 오류: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Gemini API에서 유효한 응답을 받지 못했습니다.');
    }

    const generatedContent = data.candidates[0].content.parts.map(p => p.text || '').join('').trim();
    
    if (!generatedContent) {
      throw new Error('생성된 내용이 비어있습니다.');
    }

    return generatedContent;
  } catch (error) {
    console.error('Gemini API 호출 실패:', error);
    throw error;
  }
}

/**
 * 『AI 기반 학교-가정 소통: 대한민국 가정통신문 생성을 위한 프레임워크』 연구 완벽 준수
 * 프롬프트 노출 문제 100% 해결, 자연스러운 한국식 가정통신문 생성
 */

/**
 * 날짜를 한국어 형식으로 변환하는 함수
 * @param {Date|string} date - 변환할 날짜
 * @returns {string} 한국어 형식 날짜 문자열 (예: "2025년 10월 1일(수)")
 */
function formatKoreanDate(date) {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[dateObj.getDay()];
  
  return `${year}년 ${month}월 ${day}일(${dayName})`;
}

/**
 * 배열 값을 문자열로 변환하는 함수
 * @param {Array} array - 변환할 배열
 * @returns {string} 쉼표로 구분된 문자열
 */
function formatArrayValue(array) {
  if (!Array.isArray(array)) return '';
  return array.filter(item => item && item.trim()).join(', ');
}

// ===== 연구 문서 기반 핵심 시스템 =====

/**
 * 계절별 첫인사 라이브러리 (연구 문서 제2.4장)
 */
const SEASONAL_GREETINGS = {
  spring: [
    "만물이 소생하는 봄, 학부모님 가정에 새로운 희망이 피어나기를 기원합니다.",
    "따뜻한 봄바람과 함께 학부모님 댁내 건강과 행복이 가득하기를 바랍니다.",
    "봄꽃이 만개하는 계절, 학부모님과 자녀들에게 새로운 시작의 기쁨이 함께하시길 바랍니다."
  ],
  summer: [
    "무더운 여름철이지만 학부모님 가정에 시원한 바람이 불어가기를 기원합니다.",
    "여름의 뜨거운 햇살 아래서도 학부모님 댁내 평안하시기를 바랍니다.",
    "길고 더운 여름, 학부모님과 가족 모두 건강하게 지내시길 진심으로 기원합니다."
  ],
  autumn: [
    "어느덧 가을이 우리 속으로 들어왔습니다. 학부모님 가정에 풍요로운 결실이 가득하기를 바랍니다.",
    "단풍이 곱게 물든 가을, 학부모님 댁내 두루 평안하시기를 기원합니다.",
    "선선한 가을바람과 함께 학부모님께 기쁨과 감사가 넘치는 시간이 되시길 바랍니다."
  ],
  winter: [
    "차가운 겨울 날씨에도 학부모님 가정에는 따뜻함이 가득하시기를 기원합니다.",
    "한 해의 마지막을 보내며, 학부모님 댁내 건강과 행복이 계속되기를 바랍니다.",
    "추위가 매서운 겨울이지만, 학부모님과 가족 모두 따뜻하고 평안하시길 바랍니다."
  ]
};

/**
 * 학생 칭찬 어휘집 (연구 문서 제3.3장 '칭찬의 어휘집')
 */
const PRAISE_VOCABULARY = {
  diligence: [
    "묵묵하게 자기 할 일을 하고 성실합니다",
    "매사에 최선을 다하는 성실한 모습을 보여줍니다",
    "꾸준히 노력하는 성실한 태도가 돋보입니다"
  ],
  leadership: [
    "지도력이 있고 매사에 적극적이어서 학급일에 협조적입니다",
    "친구들을 이끌어가는 훌륭한 리더십을 발휘합니다",
    "솔선수범하며 급우들에게 좋은 모범이 됩니다"
  ],
  cooperation: [
    "친구들과 잘 어울리며 협력하는 모습이 아름답습니다",
    "단체 활동에서 남을 배려하는 따뜻한 마음을 보입니다",
    "모둠 활동 시 적극적으로 참여하며 협동심을 발휘합니다"
  ],
  creativity: [
    "창의적인 아이디어로 활동을 풍성하게 만듭니다",
    "독창적인 사고로 새로운 관점을 제시합니다",
    "상상력이 풍부하여 재미있는 발상을 자주 합니다"
  ],
  kindness: [
    "다른 사람을 배려하는 따뜻한 마음씨를 가지고 있습니다",
    "어려워하는 친구를 도와주는 착한 마음을 보여줍니다",
    "언제나 부드럽고 친절한 태도로 대합니다"
  ]
};

/**
 * 어조 스펙트럼 (연구 문서 표2 완전 반영)
 */
const TONE_SPECTRUM = {
  warm_caring: {
    name: '따뜻하고 보살피는 어조',
    usage: '학기 말 소감, 일반 학교생활 안내, 초등학교',
    features: ['계절 인사', '사랑스러운', '기특한', '함께 성장하는']
  },
  formal_informative: {
    name: '공식적이고 정보적인 어조',
    usage: '행사 안내, 정책 변경, 일정 고지',
    features: ['다음과 같이 안내합니다', '참고하시기 바랍니다', '에 의거하여']
  },
  urgent_directive: {
    name: '긴급하고 지시적인 어조',
    usage: '안전 수칙, 감염병 예방, 재난 경보',
    features: ['반드시 해야 합니다', '을 금지합니다', '각별히 유의해주십시오']
  },
  reflective_philosophical: {
    name: '성찰적이고 철학적인 어조',
    usage: '학년 말 성적표, 졸업식',
    features: ['삶의 의미', '성장의 과정', '인생의 스승', '마음의 근육']
  },
  empathetic_encouraging: {
    name: '공감적이고 격려하는 어조',
    usage: '성적 부진, 학교 부적응 상담',
    features: ['결과가 마음에 들지 않을 수도', '낙담하지 않게 격려해주세요']
  }
};

/**
 * 연구 문서 제3장 기반: 가정통신문 목적별 분류
 * 4가지 핵심 역할: 공지자, 조정자, 평가자, 보호자
 */
const NOTICE_PURPOSE_TYPES = {
  announcer: {
    name: '공지자 (The Announcer)',
    description: '행사, 정책, 일정 정보 전달',
    structure: 'direct_clear',
    tone: 'formal_informative',
    content_features: ['사실 기반', '목록/표 활용', '핵심 정보 강조']
  },
  coordinator: {
    name: '조정자 (The Coordinator)',
    description: '참여, 설문, 동의 요청',
    structure: 'request_focused',
    tone: 'formal_informative',
    content_features: ['회신 기한 명시', '협조 요청', '절취선/링크 포함']
  },
  assessor: {
    name: '평가자 (The Assessor)',
    description: '성적 통지 및 학생 평가',
    structure: 'evaluation_focused',
    tone: 'empathetic_encouraging',
    content_features: ['성장 과정 중심', '긍정적 표현', '격려 메시지']
  },
  guardian: {
    name: '보호자 (The Guardian)',
    description: '안전, 건강, 인성 교육',
    structure: 'safety_focused',
    tone: 'urgent_directive',
    content_features: ['수칙 강조', '경고 표시', '행동 지침']
  }
};


/**
 * 안전 및 건강 교육 모듈 (연구 문서 제3장 보호자 유형)
 * 반복적으로 사용되는 주제별 최신 정보 제공
 */
const SAFETY_HEALTH_MODULES = {
  traffic_safety: {
    title: "교통안전 수칙",
    content: [
      "등하교시 횡단보도에서는 좌우를 살피고 건너기",
      "자전거 이용시 안전모 착용 필수",
      "스마트폰을 보며 걷지 않기",
      "교통신호 준수하기"
    ]
  },
  
  cyber_safety: {
    title: "사이버 안전 수칙",
    content: [
      "개인정보 보호하기",
      "악성 링크 클릭하지 않기",
      "사이버 폭력 신고하기",
      "건전한 인터넷 사용하기"
    ]
  },
  
  health_management: {
    title: "건강 관리 수칙",
    content: [
      "규칙적인 생활습관 유지하기",
      "충분한 수면 취하기",
      "균형 잡힌 식사하기",
      "꾸준한 운동하기"
    ]
  },
  
  disaster_preparation: {
    title: "재난 대비 수칙",
    content: [
      "화재시 대피 요령 숙지하기",
      "지진 발생시 책상 아래 숨기",
      "비상용품 위치 파악하기",
      "가족 비상연락망 확인하기"
    ]
  }
};

/**
 * 계절별 인사말 자동 생성 함수
 * 연구 문서: "시간적 현장감을 부여하는 계절 인사의 중요성"
 */
function generateSeasonalGreeting() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 0-based to 1-based
  
  let seasonKey = 'spring';
  if ([6, 7, 8].includes(currentMonth)) seasonKey = 'summer';
  else if ([9, 10, 11].includes(currentMonth)) seasonKey = 'autumn';
  else if ([12, 1, 2].includes(currentMonth)) seasonKey = 'winter';
  
  const seasonalGreetings = SEASONAL_GREETINGS[seasonKey];
  const randomIndex = Math.floor(Math.random() * seasonalGreetings.length);
  
  return seasonalGreetings[randomIndex];
}

/**
 * 학생 칭찬 표현 생성 함수
 * 연구 문서: "칭찬의 어휘집 - 문화적으로 적절하고 의미 있는 평가"
 */
function generatePraiseExpressions(traits = []) {
  const expressions = [];
  
  // 기본 성격 특성에 대한 칭찬 표현 생성
  const defaultTraits = traits.length > 0 ? traits : ['diligence', 'cooperation'];
  
  defaultTraits.forEach(trait => {
    if (PRAISE_VOCABULARY[trait]) {
      const traitExpressions = PRAISE_VOCABULARY[trait];
      const randomIndex = Math.floor(Math.random() * traitExpressions.length);
      expressions.push(traitExpressions[randomIndex]);
    }
  });
  
  return expressions.join(', ');
}

/**
 * 안전 교육 모듈 선택 함수
 * 연구 문서: "시의성 있는 최신 안전 정보 모듈"
 */
function getRelevantSafetyModule(safetyType = 'traffic_safety') {
  const module = SAFETY_HEALTH_MODULES[safetyType];
  if (!module) return SAFETY_HEALTH_MODULES.traffic_safety;
  
  return {
    title: module.title,
    bulletPoints: module.content.join('\n')
  };
}

// ===== 새로운 AI 프롬프트 생성 시스템 =====

/**
 * 연구 문서 기반 완전한 AI 프롬프트 생성기
 * 플레이스홀더 노출 문제 완전 해결
 */
class NoticePromptGenerator {
  constructor() {
    this.currentDate = new Date();
    this.seasonalGreeting = generateSeasonalGreeting();
  }

  /**
   * 행사 안내 통신문 생성을 위한 AI 프롬프트
   */
  generateEventPrompt(data) {
    const {
      eventName = '학교 행사',
      eventDate = '추후 안내',
      eventTime = '추후 안내',
      eventLocation = '학교 내',
      eventTarget = '전교생',
      eventPurpose = '학생들의 건전한 성장',
      eventProgram = '다양한 프로그램',
      contactInfo = '학교 교무실',
      schoolLevel = 'elementary'
    } = data;

    return `당신은 경험 많고 따뜻한 담임교사입니다. 학부모님들께 학교 행사를 안내하는 자연스럽고 정중한 가정통신문을 작성해주세요.

중요: 마크다운 문법(**굵은글씨**, 이모지 리스트 등)을 절대 사용하지 마세요. 교사가 바로 복사해서 사용할 수 있는 순수한 텍스트만 생성해주세요.

다음과 같은 자연스러운 흐름으로 완성된 통신문을 작성해주세요:

먼저 계절 인사로 시작해주세요:
${this.seasonalGreeting}

그 다음 "${eventName}"에 대해 소개하며, 이 행사가 ${eventPurpose}를 통해 우리 아이들이 더욱 의미있는 학교생활을 경험할 수 있는 소중한 기회라고 설명해주세요.

행사의 구체적인 정보를 자연스럽게 안내해주세요:
행사명은 ${eventName}이며, ${eventDate} ${eventTime}에 ${eventLocation}에서 ${eventTarget}를 대상으로 진행됩니다.

${eventProgram}을 통해 학생들이 즐겁고 보람찬 시간을 보낼 수 있도록 세심하게 준비하였다고 안내하고, 각 프로그램이 아이들의 창의성과 협동심을 기를 수 있도록 구성되었다고 설명해주세요.

학부모님의 관심과 격려가 아이들에게 큰 힘이 되며, 행사 참여나 기타 문의사항이 있으시면 언제든 ${contactInfo}로 연락해달라고 당부해주세요.

마지막으로 항상 학교 교육활동에 적극적으로 협조해주시는 학부모님께 깊은 감사를 드리며, 앞으로도 우리 아이들의 건강한 성장을 위해 함께해달라고 부탁하는 감사 인사로 마무리해주세요.

끝에는 "${formatKoreanDate(this.currentDate)} ○○학교장"으로 마무리해주세요.

모든 내용이 하나의 자연스러운 편지처럼 연결되어야 하며, 따뜻하고 정중한 느낌이 들도록 작성해주세요. 절대 마크다운 문법이나 특수 기호를 사용하지 마세요.`;
  }

  /**
   * 성적표 동봉 편지를 위한 AI 프롬프트
   */
  generateGradePrompt(data) {
    const {
      studentName = '학생',
      academicProgress = '꾸준한 노력을 보이고 있습니다',
      studentStrengths = '성실하고 책임감이 강습니다',
      improvementAreas = '자신감을 가지고 적극적으로 참여하면 좋겠습니다',
      encouragementMessage = '앞으로의 성장이 더욱 기대됩니다'
    } = data;

    const praiseExpressions = generatePraiseExpressions(['diligence', 'cooperation']);

    return `당신은 학생 한 명 한 명을 세심하게 관찰하고 사랑하는 담임교사입니다. 성적표와 함께 학부모님께 보내는 따뜻하고 격려가 담긴 편지를 작성해주세요.

중요: 마크다운 문법(**굵은글씨**, 숫자 리스트 등)을 절대 사용하지 마세요. 교사가 바로 복사해서 사용할 수 있는 순수한 텍스트만 생성해주세요.

다음과 같은 자연스러운 흐름으로 개인적인 편지를 작성해주세요:

먼저 계절 인사로 시작해주세요:
${this.seasonalGreeting}

그 다음 "${studentName} 학생의 성적표를 전해드리면서, 한 학기 동안 함께하며 지켜본 ${studentName}의 소중한 성장 이야기를 나누고 싶어 이렇게 편지를 쓰게 되었습니다"라고 자연스럽게 이어주세요.

${studentName}는 ${praiseExpressions}하며, 특히 ${studentStrengths}한 모습이 선생님의 마음을 따뜻하게 해주었다고 표현해주세요. ${academicProgress}한 점에서 ${studentName}만의 특별함을 발견할 수 있었다고 설명해주세요.

성적표는 숫자로 나타나지만, 진정한 배움은 점수로 측정할 수 없는 마음의 성장에 있다고 생각한다며, ${studentName}가 보여준 노력과 성실함, 그리고 친구들을 배려하는 따뜻한 마음이야말로 가장 소중한 성과라고 말해주세요.

앞으로 ${improvementAreas}하면 ${studentName}의 숨어있는 재능과 가능성이 더욱 빛날 것이라 확신한다고 하며, 이는 단점이 아니라 ${studentName}가 더욱 성장할 수 있는 여지이자 기회라고 격려해주세요.

${encouragementMessage}라고 하며, 학부모님의 사랑과 격려, 그리고 선생님의 관심이 함께한다면 ${studentName}는 분명히 자신만의 특별한 꿈을 이루어낼 것이라고 미래에 대한 희망을 표현해주세요.

마지막으로 항상 ${studentName}의 교육에 깊은 관심을 가져주시고 학교 활동에 적극 협조해주시는 학부모님께 진심으로 감사드린다는 인사로 마무리해주세요.

끝에는 "${formatKoreanDate(this.currentDate)} 담임교사 올림"으로 마무리해주세요.

모든 내용이 하나의 따뜻한 개인 편지처럼 자연스럽게 연결되어야 하며, 성적보다는 학생의 인격과 성장에 초점을 맞춘 격려의 메시지가 되도록 해주세요. 절대 마크다운 문법이나 특수 기호를 사용하지 마세요.`;
  }

  /**
   * 안전 교육 통신문을 위한 AI 프롬프트
   */
  generateSafetyPrompt(data) {
    const {
      safetyTopic = 'traffic_safety',
      urgencyLevel = 'moderate',
      specificInstructions = '안전 수칙을 잘 지켜주시기 바랍니다',
      backgroundInfo = '최근 안전사고 예방의 중요성이 대두되고 있습니다'
    } = data;

    const safetyModule = getRelevantSafetyModule(safetyTopic);
    const tone = urgencyLevel === 'high' ? '긴급하고 단호한' : '정중하지만 확실한';

    return `당신은 학생들의 안전을 최우선으로 생각하는 담임교사입니다. 학부모님들께 중요한 안전 교육 내용을 전달하는 ${tone} 어조의 가정통신문을 작성해주세요.

중요: 마크다운 문법(**굵은글씨**, 숫자 리스트, • 기호 등)을 절대 사용하지 마세요. 교사가 바로 복사해서 사용할 수 있는 순수한 텍스트만 생성해주세요.

다음과 같은 자연스러운 흐름으로 안전의 중요성을 강조하면서도 실행 가능한 지침을 제공해주세요:

먼저 계절 인사로 시작해주세요:
${this.seasonalGreeting}

그 다음 "${backgroundInfo}. 우리 아이들의 소중한 생명과 안전을 지키기 위해서는 학교와 가정이 함께 노력해야 합니다"라고 안전 교육의 중요성을 설명해주세요.

${safetyModule.title}에 대해 언급하며, 다음 사항들을 자녀와 함께 확인하고 실천해달라고 안내해주세요:

${safetyModule.bulletPoints.replace(/• /g, '')}

각 항목들을 자연스러운 문장으로 풀어서 설명해주세요.

${specificInstructions}라고 하며, 특히 평상시 자녀와 안전에 대해 대화하시며, 위험 상황에 대한 대처 방법을 미리 알려주시면 큰 도움이 된다고 당부해주세요.

아이들의 안전은 아무리 강조해도 지나치지 않으며, 학부모님의 세심한 관심과 지속적인 안전 교육이 우리 아이들을 지키는 가장 확실한 방법이라고 협조를 요청해주세요.

마지막으로 항상 자녀 안전에 깊은 관심을 가져주시는 학부모님께 감사드리며, 궁금한 사항이 있으시면 언제든 연락해달라는 인사로 마무리해주세요.

끝에는 "${formatKoreanDate(this.currentDate)} ○○학교장"으로 마무리해주세요.

모든 내용이 하나의 자연스러운 안내문처럼 연결되어야 하며, 실용적이고 설득력 있는 내용이 되도록 해주세요. 절대 마크다운 문법이나 특수 기호를 사용하지 마세요.`;
  }

  /**
   * 설문조사/동의서 요청을 위한 AI 프롬프트  
   */
  generateSurveyPrompt(data) {
    const {
      surveyTitle = '학교 교육 관련 설문조사',
      surveyPurpose = '교육 활동 개선',
      deadline = '추후 안내',
      surveyMethod = '온라인 설문',
      respondents = '전체 학부모',
      estimatedTime = '약 10분'
    } = data;

    return `당신은 학교 교육 개선을 위해 학부모님의 의견을 소중히 여기는 담임교사입니다. 설문조사 참여를 요청하는 정중하고 협조적인 가정통신문을 작성해주세요.

중요: 마크다운 문법(**굵은글씨**, 이모지 리스트, - 기호 등)을 절대 사용하지 마세요. 교사가 바로 복사해서 사용할 수 있는 순수한 텍스트만 생성해주세요.

다음과 같은 자연스러운 흐름으로 설문조사의 목적과 중요성을 설명하며 참여를 독려해주세요:

먼저 계절 인사로 시작해주세요:
${this.seasonalGreeting}

그 다음 더 나은 교육환경을 만들기 위해 "${surveyTitle}"를 실시하고자 한다며, 이번 설문조사는 ${surveyPurpose}을 통해 우리 아이들에게 더욱 향상된 교육 서비스를 제공하기 위함이라고 목적을 설명해주세요.

설문조사의 개요를 자연스럽게 안내해주세요:
설문 제목은 ${surveyTitle}이며, ${surveyPurpose}을 목적으로 ${respondents}를 대상으로 실시됩니다. 참여에 소요되는 시간은 ${estimatedTime}이며, ${deadline}까지 ${surveyMethod}로 참여하실 수 있습니다.

설문조사는 ${surveyMethod}로 진행되며, 익명으로 처리된다고 안내해주세요. 학부모님의 소중한 의견은 학교 교육 정책 수립과 프로그램 개선에 귀중한 자료로 활용될 것이라고 설명해주세요.

설문조사 과정에서 수집되는 모든 정보는 개인정보보호법에 따라 안전하게 관리되며, 연구 목적 이외에는 사용되지 않는다고 개인정보 보호에 대해 안내해주세요.

마지막으로 바쁘신 중에도 우리 아이들의 교육을 위해 시간을 내어주시는 학부모님께 깊은 감사를 드린다며, 여러분의 참여가 더 나은 교육환경을 만드는 밑거름이 된다고 협조를 요청해주세요.

문의사항이 있으시면 언제든 학교로 연락해달라고 안내한 후, "${formatKoreanDate(this.currentDate)} ○○학교장"으로 마무리해주세요.

모든 내용이 하나의 자연스러운 협조 요청문처럼 연결되어야 하며, 설문조사의 가치와 중요성이 자연스럽게 강조되도록 해주세요. 절대 마크다운 문법이나 특수 기호를 사용하지 마세요.`;
  }

  /**
   * 개별 학생 피드백을 위한 AI 프롬프트
   */
  generateFeedbackPrompt(data) {
    const {
      studentName = '학생',
      observationPeriod = '이번 학기',
      specificBehaviors = '성실하고 적극적인 학습 태도',
      achievements = '꾸준한 실력 향상',  
      socialInteraction = '친구들과 협력적인 관계',
      recommendedSupport = '자신감을 가지고 도전하기',
      futureGoals = '더욱 발전된 모습'
    } = data;

    return `당신은 ${studentName} 학생을 세심하게 관찰하고 깊이 이해하는 담임교사입니다. ${observationPeriod} 동안 지켜본 ${studentName}의 성장과 발전에 대해 학부모님께 상세하고 따뜻한 개별 피드백을 전달해주세요.

중요: 마크다운 문법(**굵은글씨**, - 리스트, 숫자 목록 등)을 절대 사용하지 마세요. 교사가 바로 복사해서 사용할 수 있는 순수한 텍스트만 생성해주세요.

다음과 같은 자연스러운 흐름으로 ${studentName}에게 특화된 개인적이고 구체적인 편지를 작성해주세요:

먼저 계절 인사로 시작해주세요:
${this.seasonalGreeting}

그 다음 "${observationPeriod} 동안 ${studentName}와 함께 보낸 소중한 시간들을 되돌아보며, 이 아이만의 특별한 성장 이야기를 학부모님과 나누고 싶어 이렇게 편지를 쓰게 되었습니다"라고 개인적인 인사를 해주세요.

${studentName}가 보여준 ${specificBehaviors}는 정말 인상적이었다고 하며, 특히 기억에 남는 것들을 자연스럽게 나열해주세요: 수업 시간에 보여준 집중력과 적극적인 참여 자세, 어려운 문제를 만나도 포기하지 않고 끝까지 해결하려는 의지, 친구들을 도와주는 따뜻한 마음과 배려심, 새로운 것을 배울 때 보이는 반짝이는 눈빛 등을 편지 형식으로 자연스럽게 풀어주세요.

${achievements}을 통해 ${studentName}의 발전을 확실히 느낄 수 있었다고 하며, 또한 ${socialInteraction}을 보며 이 아이가 단순히 학업적으로만 성장하는 것이 아니라 한 명의 훌륭한 사람으로 자라나고 있음을 실감한다고 성장과 발전에 대해 설명해주세요.

${studentName}가 ${recommendedSupport}하면 숨어있는 재능들이 더욱 빛날 것이라며, 이는 부족함이 아니라 이 아이가 더 큰 가능성을 가지고 있다는 증거라고 격려해주세요.

가정에서의 격려 방법을 자연스럽게 제안해주세요: ${studentName}의 작은 시도와 노력에 대해 구체적으로 인정해주시고, 결과보다는 과정과 노력을 칭찬해주시며, 실수를 했을 때도 다시 시작할 수 있다는 용기를 주시고, ${studentName}만의 속도와 방식을 존중해달라고 부탁해주세요.

앞으로 ${studentName}가 보여줄 ${futureGoals}가 정말 기대된다며, 이 아이 안에는 무한한 가능성이 잠들어 있으며 적절한 시기에 아름답게 꽃피울 것이라 확신한다고 미래에 대한 기대를 표현해주세요.

마지막으로 항상 ${studentName}의 성장을 함께 지켜봐 주시는 학부모님께 깊은 감사를 드린다는 인사로 마무리한 후, "${formatKoreanDate(this.currentDate)} 담임교사 올림"으로 끝내주세요.

모든 내용이 하나의 따뜻하고 개인적인 편지처럼 자연스럽게 연결되어야 하며, 이 아이만의 독특한 특성과 성장 모습이 생생하게 드러나도록 해주세요. 절대 마크다운 문법이나 특수 기호를 사용하지 마세요.`;
  }
}

/**
 * 메인 AI 가정통신문 생성 함수 - 완전 재설계
 * 연구 문서 기반 구조적 진정성과 자연스러운 완성도 보장
 */
export async function generateProfessionalNotice(requestData, apiKeyOverride = undefined) {
  console.log('🚀 새로운 AI 가정통신문 생성기 실행');
  console.log('📥 요청 데이터:', JSON.stringify(requestData, null, 2));
  
  try {
    const { 
      category, 
      schoolLevel = 'elementary',
      ...restData 
    } = requestData;
    
    console.log('📂 카테고리:', category);
    console.log('🎓 학교급:', schoolLevel);
    
    // 날짜 및 배열 데이터 전처리
    const processedData = { ...restData };
    Object.keys(processedData).forEach(key => {
      const value = processedData[key];
      if (value instanceof Date || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/))) {
        processedData[key] = formatKoreanDate(value);
      } else if (Array.isArray(value)) {
        processedData[key] = formatArrayValue(value);
      }
    });
    
    console.log('📝 처리된 데이터:', processedData);
    
    // AI 프롬프트 생성기 초기화
    const promptGenerator = new NoticePromptGenerator();
    
    // 카테고리별 프롬프트 생성
    let aiPrompt;
    
    switch (category) {
      case 'event_announcement':
        aiPrompt = promptGenerator.generateEventPrompt(processedData);
        break;
      case 'individual_feedback':
        aiPrompt = promptGenerator.generateFeedbackPrompt(processedData);
        break;
      case 'grade_report':
        aiPrompt = promptGenerator.generateGradePrompt(processedData);
        break;
      case 'safety_education':
        aiPrompt = promptGenerator.generateSafetyPrompt(processedData);
        break;
      case 'survey_request':
        aiPrompt = promptGenerator.generateSurveyPrompt(processedData);
        break;
      default:
        // 기본값: 행사 안내 형식 사용
        aiPrompt = promptGenerator.generateEventPrompt(processedData);
        console.log('⚠️ 알 수 없는 카테고리, 기본 행사 안내 템플릿 사용');
    }
    
    console.log('✅ AI 프롬프트 생성 완료');
    console.log('📝 프롬프트 미리보기:', aiPrompt.substring(0, 200) + '...');
    
    // Gemini API 호출
    console.log('🤖 Gemini API 호출 시작');
    const result = await generateKoreanContentWithGemini(aiPrompt, apiKeyOverride);
    
    console.log('✅ AI 통신문 생성 완료');
    return {
      success: true,
      content: result,
      metadata: {
        category,
        schoolLevel,
        generatedAt: new Date().toISOString(),
        promptType: 'research_based_complete'
      }
    };
    
  } catch (error) {
    console.error('❌ AI 통신문 생성 실패:', error);
    return {
      success: false,
      error: error.message || '통신문 생성 중 오류가 발생했습니다.',
      content: null
    };
  }
}

/**
 * 카테고리 목록 조회 함수 - 연구 문서 기반 분류
 */
export function getAvailableCategories() {
  return {
    'event_announcement': {
      name: '행사 안내 (공지자)',
      description: '학교 행사, 정책 변경, 일정 공지',
      requiredFields: ['eventName', 'eventDate', 'eventLocation'],
      tone: '공식적이고 정보적인 어조'
    },
    'individual_feedback': {
      name: '개별 학생 피드백 (평가자)',
      description: '학생 개인별 상세 관찰 및 성장 피드백',
      requiredFields: ['studentName', 'observationPeriod', 'specificBehaviors'],
      tone: '따뜻하고 개인적인 어조'
    },
    'grade_report': {
      name: '성적표 동봉 편지 (평가자)',
      description: '성적표와 함께 발송하는 격려 메시지',
      requiredFields: ['studentName', 'academicProgress'],
      tone: '공감적이고 격려하는 어조'
    },
    'safety_education': {
      name: '안전 교육 (보호자)',
      description: '안전, 건강, 재난 대비 수칙 안내',
      requiredFields: ['safetyTopic', 'urgencyLevel'],
      tone: '긴급하고 지시적인 어조'
    },
    'survey_request': {
      name: '설문조사 요청 (조정자)',
      description: '학부모 의견 수렴, 동의서, 참여 요청',
      requiredFields: ['surveyTitle', 'surveyPurpose', 'deadline'],
      tone: '정중하고 협조 요청하는 어조'
    }
  };
}

/**
 * 사용 가능한 학교급 목록
 */
export function getSchoolLevels() {
  return {
    'elementary': '초등학교',
    'middle': '중학교', 
    'high': '고등학교'
  };
}

/**
 * 안전 교육 주제 목록
 */
export function getSafetyTopics() {
  return Object.keys(SAFETY_HEALTH_MODULES).reduce((acc, key) => {
    acc[key] = SAFETY_HEALTH_MODULES[key].title;
    return acc;
  }, {});
}

console.log('✅ 새로운 AI 가정통신문 서비스 로드 완료 - 연구 문서 기반 완전 재설계');