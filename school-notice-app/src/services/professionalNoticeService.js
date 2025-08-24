import { translateWithGemini } from './geminiService';

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

/**
 * 전문적인 AI 통신문 마법사 서비스 - 고도화 버전
 * 『AI 기반 학교-가정 소통: 대한민국 가정통신문 생성을 위한 프레임워크』 연구 반영
 * 구조적 진정성, 문화적 관례, 법적 안전성을 보장하는 통신문 생성
 */

// ===== 연구 기반 구조적 프레임워크 =====

/**
 * 가정통신문 표준 구조 (연구 문서 제1장 기반)
 * 머리말 → 수신자 → 첫인사 → 제목 → 본문 → 맺음말 → 꼬리말
 */
const NOTICE_STRUCTURE_TEMPLATE = {
  header: {
    school_name: "학교명 자동 삽입",
    document_number: "제 {year}-{number}호",
    contact_info: "연락처 정보"
  },
  salutation: "학부모님께",
  opening_greeting: {
    seasonal: true, // 계절별 인사말 자동 생성
    family_wishes: true, // 가정 안녕 기원
    community_sharing: true // 시간적 배경 공유
  },
  title: "{통신문 제목}",
  body: {
    background_explanation: true,
    specific_information: true,
    structured_format: true // 표, 목록 등 활용
  },
  closing: {
    gratitude: true,
    cooperation_request: true,
    future_wishes: true
  },
  footer: {
    date: "{발송일자}",
    sender: "학교장 (직인생략)"
  }
};

/**
 * 계절별 첫인사 라이브러리 (연구 문서 기반)
 * 시간적 현장감과 공동체 의식 강화를 위한 동적 인사말
 */
const SEASONAL_GREETINGS = {
  spring: {
    months: [3, 4, 5],
    greetings: [
      "만물이 소생하는 봄입니다. 학부모님 가정에 건강과 행운이 함께하시기를 기원합니다.",
      "따뜻한 봄바람이 불어오는 계절입니다. �댁내 두루 평안하시기를 기원합니다.",
      "새싹이 돋아나는 희망찬 봄을 맞아 학부모님께 따뜻한 인사를 드립니다."
    ]
  },
  summer: {
    months: [6, 7, 8],
    greetings: [
      "무더운 여름철이지만 학부모님 가정에 시원한 바람이 불어가기를 기원합니다.",
      "태양이 뜨겁게 내리쬐는 여름입니다. 가족 모두 건강하게 지내시기를 바랍니다.",
      "푸른 여름을 맞아 학부모님께 시원한 인사를 전해드립니다."
    ]
  },
  autumn: {
    months: [9, 10, 11],
    greetings: [
      "어느덧 가을이 우리 속으로 들어왔습니다. 학부모님 가정에 풍성한 결실이 있기를 기원합니다.",
      "단풍이 물들어가는 아름다운 가을입니다. 댁내 평안하시기를 기원합니다.",
      "천고마비의 계절을 맞아 학부모님께 감사의 인사를 드립니다."
    ]
  },
  winter: {
    months: [12, 1, 2],
    greetings: [
      "차가운 겨울바람이 불어오지만 학부모님 마음만은 항상 따뜻하시기를 기원합니다.",
      "하얀 눈이 내리는 겨울입니다. 가족 모두 감기 조심하시고 건강하시기를 바랍니다.",
      "추운 겨울철이지만 학부모님 가정에 따뜻한 온정이 가득하시기를 기원합니다."
    ]
  }
};

/**
 * 학생 칭찬 어휘집 (연구 문서 제3장 기반)
 * 한국 교육 문화의 이상적 학생상을 구현하는 체계적 표현 모음
 */
const PRAISE_VOCABULARY = {
  // 성실성 관련
  diligence: [
    "묵묵하게 자기 할 일을 하고 성실합니다",
    "주어진 과제를 책임감 있게 완수합니다",
    "꾸준히 노력하는 모습이 인상적입니다",
    "성실한 태도로 학습에 임합니다"
  ],
  
  // 협동심 관련
  cooperation: [
    "친구들과 협력하며 함께 문제를 해결합니다",
    "학급 활동에 적극적으로 참여합니다",
    "다른 사람을 배려하며 함께 나눕니다",
    "팀워크를 발휘하여 공동 목표를 달성합니다"
  ],
  
  // 리더십 관련
  leadership: [
    "지도력이 있고 매사에 적극적이어서 학습일에 협조적입니다",
    "친구들을 이끌며 모범이 되는 행동을 보입니다",
    "어려운 상황에서도 당당하게 대처합니다",
    "솔선수범하여 다른 학생들에게 좋은 영향을 줍니다"
  ],
  
  // 창의성 관련
  creativity: [
    "독창적인 아이디어를 제시하며 창의력을 발휘합니다",
    "새로운 관점에서 문제를 바라보고 해결합니다",
    "상상력이 풍부하고 표현력이 뛰어납니다",
    "다양한 방법으로 자신의 생각을 표현합니다"
  ],
  
  // 예의 바름 관련
  politeness: [
    "항상 예의 바르고 공손한 태도를 보입니다",
    "어른을 공경하고 친구를 존중합니다",
    "바른 인사와 고운 말을 사용합니다",
    "타인에 대한 배려심이 깊습니다"
  ]
};

/**
 * 안전 및 건강 모듈 (연구 문서 기반)
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
 * 법적 안전성 보장을 위한 개인정보 보호 템플릿
 * 연구 문서 제4장 기반 - 완전한 규정 준수
 */
const PRIVACY_PROTECTION_TEMPLATES = {
  warning_placeholder: "[주의: 개인정보 입력 금지 - 개인정보보호법 준수]",
  consent_form_guide: {
    required_elements: [
      "수집·이용 목적",
      "수집 항목",
      "보유 및 이용 기간",
      "동의 거부권 및 불이익 내용"
    ],
    formatting_rules: {
      important_content_size: "20% 이상 크게",
      emphasis: "굵게 또는 밑줄 표시",
      separate_consent: "항목별 개별 동의 필수"
    }
  }
};

// 학교급별 맞춤형 카테고리 및 전문 프롬프트 템플릿
const PROFESSIONAL_CATEGORY_PROMPTS = {
  // 성적 통지 및 개별 피드백
  individual_feedback: {
    name: '개별 학생 피드백',
    description: '개별 학생에 대한 상세한 피드백과 조언',
    template: `당신은 아이를 깊이 이해하고 사랑하는 담임교사로서, 한 아이의 성장 과정을 세심하게 관찰한 내용을 학부모님께 따뜻하고 구체적으로 전달하는 개별 피드백을 작성해주세요.

학생 관찰 정보:
- 학습 태도: {studentBehavior}
- 학업 발전: {academicProgress}
- 개선 영역: {improvementAreas}

다음과 같이 개인적이고 따뜻한 편지 형식으로 작성해주세요:

1. **마음을 담은 인사**
안녕하십니까? 요즘 ○○이의 밝은 웃음소리가 교실을 더욱 따뜻하게 만들어주고 있습니다. 한 학기 동안 ○○이와 함께하며 지켜본 소중한 성장의 순간들을 학부모님과 나누고 싶어 이렇게 편지를 씁니다.

2. **🌟 ○○이만의 특별한 모습들**
**{studentBehavior}**를 통해 보여준 ○○이의 아름다운 모습들:
- **수업 시간의 ○○이** 어떤 순간에 눈이 반짝이는지, 어떤 활동을 좋아하는지
- **친구들과의 ○○이** 교우관계에서 보여주는 따뜻한 마음과 배려
- **혼자만의 시간** 조용히 집중하거나 깊이 생각하는 모습
- **특별했던 순간들** 기억에 남는 감동적이거나 인상 깊었던 에피소드

3. **📈 눈부신 성장의 발자취**
**{academicProgress}**에서 확인할 수 있는 ○○이의 발전:
- **학습 면에서** 처음과 비교해 달라진 점들과 노력의 결실
- **마음의 성장** 책임감, 배려심, 자신감 등의 변화
- **새로운 도전** 어려워하던 것을 극복하려는 의지와 시도들
- **숨은 재능 발견** ○○이만의 특별한 강점이나 가능성

4. **💝 함께 키워나가고 싶은 보물들**
**{improvementAreas}**를 중심으로 한 성장 방향:
- **○○이의 속도로** 무리하지 않고 자연스럽게 발전시킬 수 있는 부분들
- **작은 성공 경험 쌓기** 자신감을 키울 수 있는 구체적인 방법들
- **흥미와 연결하기** ○○이가 좋아하는 것과 연결해서 접근하는 방법
- **강점 활용하기** 잘하는 것을 바탕으로 부족한 부분을 보완하는 전략

5. **🏠 가정에서 함께해주시면 좋을 것들**
- **일상 속 자연스러운 도움** 특별한 준비 없이도 할 수 있는 것들
- **○○이와의 대화** 어떤 질문이나 반응이 도움이 될지
- **격려의 포인트** ○○이에게 가장 효과적인 칭찬과 격려 방법
- **관심사 지원** ○○이의 흥미를 더 키워줄 수 있는 활동이나 경험

6. **함께 걸어갈 약속**
○○이는 정말 소중하고 특별한 아이입니다. 때로는 느리게 보일 수도 있고, 때로는 어려워할 수도 있지만, 그 모든 과정이 ○○이만의 고유한 성장 리듬이라고 생각합니다. 학부모님의 따뜻한 사랑과 학교의 전문적인 지도가 만나 ○○이가 자신만의 빛깔로 아름답게 성장할 수 있도록 함께 응원하겠습니다. 언제든 궁금한 점이나 나누고 싶은 이야기가 있으시면 편하게 연락주세요.

**작성 원칙:**
- 아이의 이름을 자주 사용하여 개인적인 느낌 강조
- 구체적인 에피소드나 관찰 내용 포함
- 부모의 마음에 공감하는 따뜻한 어조
- 아이의 개별성과 고유함 인정
- 성장 과정의 자연스러움 강조
- 학교와 가정의 협력 의지 표현

전체 분량: 25-30줄 내외로 작성해주세요.

**중요**: 위의 정보들을 그대로 사용하되, 중괄호 형태의 변수명({eventName} 등)을 출력하지 말고 실제 내용을 자연스럽게 문장에 포함시켜 작성하세요.`
  },

  // 학기말 종합 통신문
  semester_summary: {
    name: '학기말 종합 가정통신문',
    description: '한 학기를 마무리하는 종합적인 학급 통신문',
    template: `당신은 한 학기 동안 아이들과 함께 소중한 시간을 보낸 담임교사로서, 학부모님께 이번 학기의 아름다운 여정과 아이들의 성장 이야기를 따뜻하게 전하는 학기 요약 통신문을 작성해주세요.

학급 정보:
- 학급: {grade}학년 {classNumber}반
- 학기: {semester}
- 주요 활동: {majorActivities}
- 학급 특성: {classCharacteristics}
- 성과 및 성장: {achievements}
- 감사 인사 대상: {gratitudeTargets}

다음과 같이 한 학기를 돌아보는 편지 형식으로 작성해주세요:

1. **마음 깊은 인사와 감회**
안녕하십니까? 어느덧 {semester}이 마무리되어 갑니다. 처음 만났을 때의 설렘과 긴장이 엊그제 같은데, 벌써 이렇게 많은 시간이 흘렀다니 새삼 놀랍습니다. 이번 학기 동안 아이들과 함께 만들어온 소중한 이야기들을 학부모님과 나누고 싶어 이렇게 편지를 씁니다.

2. **🌈 함께 걸어온 특별한 여정**
**{majorActivities}**를 중심으로 한 이번 학기의 하이라이트들:
- **새로운 도전들** 처음 시도해본 활동들과 아이들의 반응
- **함께 만든 추억들** 학급 전체가 하나 되어 경험한 특별한 순간들
- **작은 기적들** 예상치 못했던 아이들의 놀라운 모습들
- **성장의 발자취** 학기 초와 비교해 눈에 띄게 달라진 점들

3. **📚 배움과 성장의 결실**
**{achievements}**에서 확인할 수 있는 우리 아이들의 발전:
- **학습 면에서의 성장** 각 교과에서 보여준 노력과 발전 모습
- **사고력의 확장** 질문하고 탐구하는 능력의 향상
- **표현력의 발달** 자신의 생각을 말하고 쓰는 능력의 성장
- **협력 학습의 성과** 친구들과 함께 배우며 얻은 소중한 경험들

4. **💝 마음이 자라는 아이들**
**{classCharacteristics}**한 우리 학급의 특별한 모습들:
- **배려하는 마음** 친구를 도와주고 함께 나누는 모습들
- **책임감의 성장** 맡은 일을 끝까지 해내려는 의지
- **자신감의 향상** 주저하던 아이들이 당당해진 모습
- **공동체 의식** 우리 학급을 사랑하고 아끼는 마음

5. **✨ 가슴 따뜻했던 순간들**
- **감동의 순간들** 교사로서 가슴이 뭉클했던 에피소드들
- **웃음이 넘쳤던 시간들** 아이들과 함께 즐겁게 웃었던 기억들
- **서로 도운 이야기들** 친구를 위해 손을 내민 아름다운 순간들
- **극복의 스토리들** 어려움을 이겨내며 성장한 용기 있는 모습들

6. **🤝 함께 만들어갈 미래**
한 학기 동안 {gratitudeTargets}의 따뜻한 관심과 협조가 있었기에 아이들이 이렇게 아름답게 성장할 수 있었습니다. 때로는 걱정도 있었고, 때로는 기쁨도 함께 나누었지만, 그 모든 순간들이 아이들을 더욱 단단하고 따뜻한 사람으로 만들어주었다고 생각합니다. 앞으로도 우리 아이들이 자신만의 꿈을 키워가며 행복하게 성장할 수 있도록 함께 응원하고 지켜봐주시기 바랍니다.

**작성 원칙:**
- 한 학기를 돌아보는 회고적이고 감성적인 어조
- 구체적인 에피소드와 관찰 내용 포함
- 아이들의 성장에 대한 교사의 자부심과 애정 표현
- 학부모와의 협력에 대한 감사와 앞으로의 다짐
- 개별 아이들보다는 학급 전체의 성장에 초점
- 긍정적이고 희망적인 미래 전망 제시

전체 분량: 30-35줄 내외로 작성해주세요.

**중요**: 위의 정보들을 그대로 사용하되, 중괄호 형태의 변수명({eventName} 등)을 출력하지 말고 실제 내용을 자연스럽게 문장에 포함시켜 작성하세요.`
  },

  // 행사 안내 통신문
  event_announcement: {
    name: '학교 행사 안내 통신문',
    description: '학교 행사에 대한 전문적이고 상세한 안내',
    template: `당신은 경험 많은 교사로서 학교 행사를 안내하는 따뜻하고 자연스러운 통신문을 작성해주세요.

행사 정보:
- 행사명: {eventName}
- 일시: {eventDate} {eventTime}
- 장소: {eventLocation}
- 대상: {eventTarget}
- 목적: {eventPurpose}
- 프로그램: {eventProgram}
- 문의처: {contactInfo}

다음과 같이 자연스러운 편지 형식으로 작성해주세요:

1. **행사 안내 인사말**
안녕하십니까? {eventName} 개최를 맞이하여 자녀들이 즐겁고 행복한 추억을 만들 수 있도록 정성껏 행사를 준비하였습니다.

2. **행사 목적 및 의미**
이번 {eventName}은 {eventPurpose}를 통해 자녀들이 학교 생활을 더욱 즐겁게 경험하고, 친구들과의 협력을 배우며 성장하는 소중한 시간이 될 것입니다. 또한 학부모님들께서도 자녀들과 함께하는 특별한 기회가 되기를 바랍니다.

3. **행사 개요**
- **행사명**: {eventName}
- **일시**: {eventDate} {eventTime}  
- **장소**: {eventLocation}
- **참가 대상**: {eventTarget}

4. **행사 프로그램**
{eventProgram}을 통해 다채롭고 즐거운 시간을 보내실 수 있도록 준비하였습니다.

5. **참여 방법 및 주의사항**
- **준비물**: 편한 복장, 개인 물병, 기타 행사에 필요한 물품들을 준비해주세요
- **주차 안내**: 차량을 이용하시는 학부모님께서는 학교 홈페이지를 참고하시거나 담임 선생님께 문의해주세요  
- **안전 수칙**: 행사 안전을 위해 안전사고 예방에 특별히 주의를 기울여주시기 바랍니다

6. **문의사항 및 마무리 인사**
기타 궁금한 사항이 있으시면 {contactInfo}로 연락해주시면 자세히 안내해드리겠습니다. 자녀들과 학부모님들의 많은 관심과 참여를 부탁드리며, 모든 분들이 즐겁고 뜻깊은 시간을 보내실 수 있기를 바랍니다.

**작성 원칙:**
- 자연스럽고 따뜻한 편지 형식으로 작성
- 구체적이고 실용적인 정보를 간결하게 제공
- 아이들에 대한 사랑과 관심이 느껴지도록 작성
- 학부모의 입장에서 필요한 정보를 명확하게 안내
- 격식을 갖추면서도 친근한 어조 유지

전체 분량: 15-20줄 내외로 작성해주세요.

**중요**: 위의 정보들을 그대로 사용하되, 중괄호 형태의 변수명({eventName} 등)을 출력하지 말고 실제 내용을 자연스럽게 문장에 포함시켜 작성하세요.

**학교급별 표현 가이드 (elementary):**
- **인사말 예시:** 안녕하십니까? 항상 따뜻한 관심으로 아이들을 지켜봐 주시는 학부모님들께 깊은 감사를 드립니다. / 사랑하는 우리 아이들과 함께하는 즐거운 학교생활 속에서 학부모님께 안부 말씀을 드립니다. / 아이들의 맑은 웃음소리가 가득한 교실에서 학부모님께 따뜻한 인사를 전해드립니다.
- **학생 언급 방식:** ○○이는 늘 밝은 표정으로 / 우리 ○○이가 보여주는 / ○○이의 순수한 마음이 / ○○이만의 특별한 모습을
- **격려 표현:** 아이들의 무한한 가능성을 믿으며 / 한 걸음 한 걸음 성장하는 모습이 / 작은 변화 하나하나가 소중한 / 꾸준한 노력이 만들어내는 기적을
- **마무리 인사:** 가정의 건강과 행복을 진심으로 기원합니다. / 항상 웃음이 가득한 행복한 가정 되시기를 바랍니다. / 가족 모두의 건강과 평안을 기도합니다.

**전문 문체 가이드:**
- **격식 있는 표현:** 말씀드리고자 합니다, 안내해 드리겠습니다, 당부를 드리고 싶습니다, 협조를 부탁드립니다, 감사의 말씀을 전합니다
- **전환 표현:** 또한, 더불어, 아울러, 특히, 무엇보다, 한편, 이와 함께
- **정중한 마무리:** ~하시기 바랍니다, ~해 주시면 감사하겠습니다, ~부탁드립니다, ~기원합니다, ~응원합니다`
  },

  // 가정 연계 교육 안내
  home_education_guide: {
    name: '가정 연계 교육 안내문',
    description: '가정에서의 교육 협력을 위한 전문적 가이드',
    template: `당신은 아이들의 성장을 깊이 이해하는 경험 많은 교사로서, 학부모님께 실용적이고 따뜻한 가정교육 조언을 담은 통신문을 작성해주세요.

교육 주제 정보:
- 교육 주제: {educationTopic}
- 가정 활동: {homeActivities}
- 교육 목표: {educationGoals}

다음과 같이 편지 형식으로 자연스럽게 작성해주세요:

1. **마음을 여는 인사**
안녕하십니까? 날씨가 좋은 요즘, 아이들의 밝은 웃음소리가 더욱 소중하게 느껴집니다. 오늘은 {educationTopic}에 대해 가정에서 함께 실천해볼 수 있는 방법들을 나누고자 합니다.

2. **🎯 우리가 함께 키우고 싶은 것**
**{educationTopic}**는 아이들의 건강한 성장에 꼭 필요한 소중한 가치입니다.
- **왜 중요할까요?** 이 시기 아이들에게 특히 필요한 이유
- **어떤 변화를 기대할 수 있을까요?** 꾸준히 실천했을 때 나타나는 긍정적 변화들
- **우리 아이만의 특별함** 각자의 개성과 속도를 인정하며 성장시키는 방법

3. **🏠 집에서 자연스럽게 실천하기**
**{homeActivities}**를 바탕으로 한 구체적인 실천 아이디어들:
- **일상 속 작은 습관들** 특별한 준비 없이도 매일 할 수 있는 것들
- **함께하는 시간 만들기** 바쁜 일상 속에서도 아이와 소통하는 방법
- **놀이로 배우기** 아이가 즐거워하면서 자연스럽게 배울 수 있는 활동들
- **칭찬과 격려의 기술** 아이의 자신감을 키워주는 효과적인 반응법

4. **💡 현명한 부모가 되는 팁**
{educationGoals}를 달성하기 위한 실용적인 조언들:
- **이런 점은 주의해주세요** 흔히 놓치기 쉬운 부분들과 대안
- **아이의 신호 읽기** 스트레스나 어려움을 표현하는 아이의 방식 이해하기
- **적절한 기대치 설정** 아이의 발달 단계에 맞는 현실적인 목표
- **부모도 완벽하지 않아도 괜찮아요** 실수했을 때 회복하는 방법

5. **🤝 학교와 가정이 함께**
- **소통의 다리** 학교에서의 모습과 집에서의 모습 공유하기
- **일관성 있는 지도** 학교와 가정에서 같은 방향으로 아이 이끌기
- **언제든 연락주세요** 궁금한 점이나 어려운 상황이 있을 때 상담 방법

6. **함께 걸어가는 마음**
아이를 키우는 일은 때로 어렵고 막막할 수 있지만, 학부모님의 사랑과 관심이 있다면 분명 아름다운 결실을 맺을 것입니다. 작은 변화라도 꾸준히 실천하시는 학부모님들께 깊은 감사를 드리며, 우리 아이들이 건강하고 행복하게 자라날 수 있도록 함께 노력해나가겠습니다.

**작성 원칙:**
- 실현 가능한 구체적인 방법 제시
- 부모의 부담을 덜어주는 현실적인 조언
- 아이의 개별성과 발달 단계 고려
- 완벽하지 않아도 괜찮다는 격려의 메시지
- 학교와 가정의 협력 강조

전체 분량: 25-30줄 내외로 작성해주세요.

**중요**: 위의 정보들을 그대로 사용하되, 중괄호 형태의 변수명({eventName} 등)을 출력하지 말고 실제 내용을 자연스럽게 문장에 포함시켜 작성하세요.`
  },

  // 생활 지도 안내
  life_guidance: {
    name: '생활지도 협력 안내문',
    description: '학생 생활지도를 위한 가정-학교 협력 안내',
    template: `당신은 아이들의 마음을 잘 이해하는 따뜻한 교사로서, 학부모님께 생활지도에 대한 현실적이고 도움이 되는 조언을 담은 통신문을 작성해주세요.

생활지도 주제 정보:
- 지도 목표: {guidancePurpose}
- 생활습관: {lifeHabits}
- 규칙 준수: {rules}

다음과 같이 편지 형식으로 자연스럽게 작성해주세요:

1. **따뜻한 마음으로 시작하는 인사**
안녕하십니까? 아이들과 함께하는 하루하루가 소중한 배움의 시간이 되고 있습니다. 오늘은 {guidancePurpose}에 대해 학교와 가정이 함께 고민하고 실천할 수 있는 방법들을 나누고자 합니다.

2. **🌱 아이들의 성장, 함께 지켜봐주세요**
**{guidancePurpose}**는 아이들이 건강하고 행복한 어른으로 자라나는 데 꼭 필요한 과정입니다.
- **이 시기가 특별한 이유** 지금 이 나이에 왜 이런 지도가 중요한지
- **작은 변화의 힘** 꾸준한 관심과 지도로 나타나는 긍정적 변화들
- **우리 아이의 속도** 각자 다른 성장 속도를 인정하고 기다려주는 마음

3. **📚 함께 실천해볼 구체적인 방법들**
**{lifeHabits}**와 **{rules}**를 중심으로 한 실천 가능한 아이디어들:
- **일상 속 자연스러운 지도** 특별한 시간을 내지 않아도 되는 생활 속 방법들
- **아이와 함께하는 약속 만들기** 규칙이 아닌 서로의 약속으로 접근하기
- **실수도 배움의 기회로** 잘못했을 때 어떻게 대화하고 이끌어줄지
- **작은 성공 인정하기** 조금씩 나아지는 모습을 발견하고 격려하는 방법

4. **👨‍👩‍👧‍👦 부모님의 특별한 역할**
- **완벽한 부모가 아니어도 괜찮아요** 부모도 배워가는 과정임을 인정하기
- **일관성 있는 사랑** 때로는 단호하게, 때로는 따뜻하게 균형 잡기
- **아이의 마음 읽기** 겉으로 드러나는 행동 뒤에 숨은 진짜 마음 이해하기
- **모델링의 힘** 말보다 강한 부모의 행동과 태도

5. **💡 어려울 때 기억해주세요**
- **변화는 천천히** 하루아침에 바뀌지 않는다는 것을 받아들이기
- **아이만의 신호** 스트레스나 어려움을 표현하는 우리 아이만의 방식 알아차리기
- **도움 요청하기** 혼자 해결하려 하지 말고 학교나 전문가와 상의하기
- **자신감 회복** 부모로서의 자신감을 잃지 않도록 서로 격려하기

6. **🤝 학교와 가정, 함께 걸어가요**
아이를 키우는 일은 혼자서는 할 수 없는 소중한 협력의 과정입니다. 때로는 답답하고 어려울 수 있지만, 학부모님의 사랑과 관심, 그리고 학교의 전문적인 지도가 만나면 분명 아름다운 변화를 만들어낼 수 있습니다. 우리 아이들이 자신감 있고 따뜻한 마음을 가진 사람으로 자라날 수 있도록 함께 응원하고 지켜봐주시기 바랍니다.

**작성 원칙:**
- 부모의 마음에 공감하는 따뜻한 어조
- 실현 가능한 구체적인 방법 제시
- 완벽하지 않아도 괜찮다는 격려
- 아이의 개별성과 성장 속도 인정
- 학교와 가정의 협력 강조
- 부모도 배워가는 과정임을 인정

전체 분량: 25-30줄 내외로 작성해주세요.

**중요**: 위의 정보들을 그대로 사용하되, 중괄호 형태의 변수명({eventName} 등)을 출력하지 말고 실제 내용을 자연스럽게 문장에 포함시켜 작성하세요.`
  },

  // 학부모 참여 협력 요청 통신문 (조정자 역할 - 새로 추가)
  parent_participation: {
    name: '학부모 참여 협력 요청 통신문',
    description: '학부모의 특정 참여나 협조를 요청하는 통신문',
    template: `당신은 학부모님과 함께 아이들의 성장을 이끌어가는 경험 많은 교사로서, 학부모님의 적극적인 참여와 협력을 정중하고 따뜻하게 요청하는 통신문을 작성해주세요.

학부모 참여 요청 정보:
- 참여 요청 주제: {participationTopic}
- 참여 목적: {participationPurpose}
- 참여 방법: {participationMethod}
- 참여 기간: {participationPeriod}
- 준비물: {requiredItems}
- 문의처: {contactInfo}
- 기대 효과: {expectedOutcomes}

다음과 같이 협력을 요청하는 편지 형식으로 작성해주세요:

1. **마음을 담은 인사**
안녕하십니까? 늘 아이들의 교육에 깊은 관심과 사랑을 보내주시는 학부모님들께 감사의 말씀을 드립니다. 오늘은 {participationTopic}에 대해 학부모님들의 소중한 참여와 협력을 요청드리고자 합니다.

2. **🎯 함께 만들어갈 특별한 기회**
**{participationPurpose}**를 위해 이번 활동을 계획하게 되었습니다.
- **우리가 추구하는 목표** 이 활동을 통해 달성하고자 하는 교육적 가치
- **아이들에게 주는 의미** 학부모님의 참여가 아이들에게 미치는 긍정적 영향
- **공동체 형성** 학교와 가정이 하나 되는 소중한 경험

3. **📋 참여 방법 안내**
**{participationMethod}**로 함께 해주시기를 바랍니다.
- **참여 일정:** {participationPeriod}
- **참여 방법:** 구체적이고 실행 가능한 참여 방법 안내
- **역할 분담:** 학부모님들께서 맡아주실 수 있는 다양한 역할들
- **시간 조절:** 바쁘신 학부모님들도 참여 가능한 유연한 방법들

4. **🎒 준비사항 안내**
**{requiredItems}**를 준비해주시면 됩니다.
- **필수 준비물:** 꼭 필요한 것들과 준비 방법
- **선택 준비물:** 추가로 도움이 되는 것들
- **대체 방안:** 준비가 어려운 경우의 대안책
- **공동 준비:** 함께 나누어 준비할 수 있는 것들

5. **💡 참여의 가치와 보람**
**{expectedOutcomes}**라는 소중한 결실을 기대할 수 있습니다.
- **아이들의 변화:** 학부모님 참여로 나타날 아이들의 긍정적 변화
- **가족 관계 개선:** 함께하는 경험이 가져다주는 가족 간의 유대감
- **학교 공동체:** 모든 구성원이 하나 되는 따뜻한 학교 만들기
- **교육적 성과:** 가정과 학교가 함께할 때 나타나는 시너지 효과

6. **🤝 함께 참여하시는 방법**
- **신청 방법:** 간단하고 부담 없는 참여 신청 절차
- **일정 조정:** 개인 사정에 맞춘 유연한 참여 방법
- **부분 참여:** 전체 참여가 어려운 경우의 대안
- **지속적 소통:** 참여 과정에서의 원활한 의사소통 방법

7. **📞 언제든 연락주세요**
참여와 관련해 궁금한 점이나 어려운 사정이 있으시면 언제든 **{contactInfo}**로 연락주시기 바랍니다. 학부모님의 상황을 충분히 이해하고, 가능한 범위 내에서 최선을 다해 함께할 수 있는 방법을 찾아보겠습니다.

8. **함께 걸어가는 마음**
아이들의 건강한 성장을 위해서는 무엇보다 학교와 가정의 긴밀한 협력이 필요합니다. 바쁘신 일상 속에서도 아이들을 위해 시간을 내어주시는 학부모님들께 깊은 감사를 드리며, 이번 활동이 우리 모두에게 의미 있고 보람찬 경험이 되기를 기원합니다. 함께 만들어갈 아름다운 교육 공동체를 꿈꾸며, 학부모님들의 적극적인 참여를 기다리겠습니다.

**작성 원칙:**
- 요청이 아닌 초대의 느낌으로 작성
- 부담스럽지 않고 자연스러운 참여 유도
- 학부모의 상황과 어려움에 대한 이해 표현
- 참여의 교육적 가치와 의미 강조
- 유연하고 다양한 참여 방법 제시
- 감사와 존중의 마음 지속적 표현

전체 분량: 30-35줄 내외로 작성해주세요.

**중요**: 위의 정보들을 그대로 사용하되, 중괄호 형태의 변수명({eventName} 등)을 출력하지 말고 실제 내용을 자연스럽게 문장에 포함시켜 작성하세요.`
  },

  // 안전 교육 통신문
  safety_education: {
    name: '안전 교육 안내문',
    description: '학생 안전을 위한 전문적이고 체계적인 안내',
    template: `당신은 아이들의 안전을 최우선으로 생각하는 경험 많은 교사로서, 학부모님께 실용적이고 따뜻한 안전교육 안내문을 작성해주세요.

안전교육 주제 정보:
- 안전 주제: {safetyTopic}
- 교육 배경: {educationBackground}
- 교육 내용: {educationContent}
- 예방 수칙: {preventionRules}

다음과 같이 편지 형식으로 자연스럽게 작성해주세요:

1. **마음을 담은 안전 인사**
안녕하십니까? 아이들의 건강하고 안전한 학교생활을 위해 늘 관심과 협조를 보내주시는 학부모님께 감사드립니다. 오늘은 {safetyTopic}에 대한 중요한 안전교육 내용을 전해드리고자 합니다.

2. **🛡️ 안전교육의 필요성**
**{educationBackground}**을 배경으로 이번 안전교육을 실시하게 되었습니다.
- **왜 중요할까요?** 이 시기 아이들에게 특히 필요한 안전의식
- **실제 사례와 통계** 최근 발생할 수 있는 안전사고 유형
- **예방의 가치** 미리 배우고 실천하는 안전수칙의 중요성

3. **⚠️ 꼭 기억해야 할 안전 수칙**
**{educationContent}**와 **{preventionRules}**을 바탕으로 한 핵심 안전수칙들:
- **기본 안전수칙** 일상생활에서 반드시 지켜야 할 것들
- **상황별 대처법** 위험한 상황 발생 시 올바른 행동 방법
- **도움 요청하기** 언제, 어떻게 어른에게 도움을 청할지
- **친구와 함께** 서로를 보호하고 지켜주는 방법

4. **🚨 응급상황 대응 방법**
- **위험 신호 인지** 위험한 상황을 빨리 알아차리는 방법
- **즉시 행동 요령** 위급할 때 가장 먼저 해야 할 일들
- **신고 및 도움 요청** 112, 119 등 비상연락처 활용법
- **응급처치 기본** 간단한 상처나 다친 친구 도와주기

5. **🏠 가정에서 함께 실천하기**
- **안전 점검의 날** 정기적으로 가정 내 안전 확인하기
- **가족 안전 규칙** 모든 가족이 함께 지킬 안전 약속
- **비상용품 준비** 응급상황에 필요한 물품들 준비하기
- **안전 대화 나누기** 아이와 안전에 대한 일상적 대화

6. **💡 부모님이 도와주실 수 있는 것들**
- **반복 교육의 힘** 집에서도 자연스럽게 안전수칙 상기시키기
- **모범 보이기** 부모님의 안전한 행동이 최고의 교육
- **칭찬과 격려** 아이가 안전수칙을 잘 지킬 때 인정해주기
- **꾸준한 관심** 학교 안전교육에 대한 지속적인 관심과 지원

7. **함께 만드는 안전한 환경**
아이들의 안전은 학교와 가정이 함께 만들어가는 소중한 가치입니다. 하루하루 작은 실천들이 모여 우리 아이들이 안전하고 건강하게 자라날 수 있는 환경을 만들어갑니다. 학부모님의 지속적인 관심과 협조를 통해 우리 모든 아이들이 걱정 없이 꿈을 키워갈 수 있기를 바랍니다.

**작성 원칙:**
- 구체적이고 실천 가능한 안전수칙 제시
- 아이들이 이해하기 쉬운 설명 방법 안내
- 가정에서 자연스럽게 실천할 수 있는 방법 제공
- 무서워하지 않으면서도 중요성을 인식할 수 있도록
- 학교와 가정의 협력을 통한 안전교육 강조

전체 분량: 25-30줄 내외로 작성해주세요.

**중요**: 위의 정보들을 그대로 사용하되, 중괄호 형태의 변수명({eventName} 등)을 출력하지 말고 실제 내용을 자연스럽게 문장에 포함시켜 작성하세요.`
  }
};

// 학교급별 전문 문구 템플릿
const SCHOOL_LEVEL_EXPRESSIONS = {
  elementary: {
    greeting: [
      "안녕하십니까? 항상 따뜻한 관심으로 아이들을 지켜봐 주시는 학부모님들께 깊은 감사를 드립니다.",
      "사랑하는 우리 아이들과 함께하는 즐거운 학교생활 속에서 학부모님께 안부 말씀을 드립니다.",
      "아이들의 맑은 웃음소리가 가득한 교실에서 학부모님께 따뜻한 인사를 전해드립니다."
    ],
    student_reference: [
      "○○이는 늘 밝은 표정으로",
      "우리 ○○이가 보여주는",
      "○○이의 순수한 마음이",
      "○○이만의 특별한 모습을"
    ],
    encouragement: [
      "아이들의 무한한 가능성을 믿으며",
      "한 걸음 한 걸음 성장하는 모습이",
      "작은 변화 하나하나가 소중한",
      "꾸준한 노력이 만들어내는 기적을"
    ],
    closing: [
      "가정의 건강과 행복을 진심으로 기원합니다.",
      "항상 웃음이 가득한 행복한 가정 되시기를 바랍니다.",
      "가족 모두의 건강과 평안을 기도합니다."
    ]
  },
  middle: {
    greeting: [
      "안녕하십니까? 중학교 시기의 소중한 성장기를 함께 지켜보며 학부모님께 감사 인사를 드립니다.",
      "급변하는 사춘기 시기, 아이들과 함께 고민하고 성장하는 학부모님들께 깊은 존경을 표합니다.",
      "중학생이 되어 한층 성숙해져가는 아이들을 보며 학부모님께 안부를 여쭙습니다."
    ],
    student_reference: [
      "○○이가 중학생이 되면서 보여주는",
      "사춘기 시기임에도 불구하고 ○○이는",
      "○○이의 생각과 행동이",
      "점점 어른스러워지는 ○○이의"
    ],
    encouragement: [
      "이 시기의 혼란과 고민들이 모두 성장의 과정임을",
      "진정한 자아를 찾아가는 소중한 시간임을",
      "지금의 경험들이 미래의 밑거름이 될 것임을",
      "부모님의 사랑과 믿음이 가장 큰 힘이 됨을"
    ],
    closing: [
      "중학교 시기를 현명하게 극복해 나가시기를 응원합니다.",
      "아이와 함께 성장하는 지혜로운 가정이 되시기를 바랍니다.",
      "가족 간의 대화와 이해가 더욱 깊어지기를 기원합니다."
    ]
  },
  high: {
    greeting: [
      "안녕하십니까? 진로에 대한 진지한 고민과 함께 성인으로 성장해가는 시기에 학부모님께 인사드립니다.",
      "대학 진학과 미래 설계라는 중요한 시기에 아이들을 지켜봐 주시는 학부모님들께 감사드립니다.",
      "고등학교 시기의 치열한 경쟁 속에서도 인성을 잃지 않도록 지도해주시는 학부모님께 경의를 표합니다."
    ],
    student_reference: [
      "○○이가 고등학생으로서 보여주는",
      "진로에 대해 진지하게 고민하는 ○○이의",
      "성인이 되어가는 ○○이의 모습에서",
      "미래에 대한 꿈을 키워가는 ○○이는"
    ],
    encouragement: [
      "현재의 노력이 밝은 미래를 만들어갈 것임을",
      "꿈을 향한 도전 정신이 가장 소중함을",
      "실패와 좌절도 성장의 중요한 경험임을",
      "끝까지 포기하지 않는 의지가 성공의 열쇠임을"
    ],
    closing: [
      "꿈을 향한 아이들의 도전을 응원하며, 가정의 평안을 기원합니다.",
      "미래의 주역으로 성장할 아이들과 함께 하는 보람찬 나날 되시기를 바랍니다.",
      "입시의 부담 속에서도 건강하고 행복한 가정 되시기를 기도합니다."
    ]
  }
};

// 전문 문체 스타일 가이드
const PROFESSIONAL_STYLE_GUIDE = {
  formal_expressions: [
    "말씀드리고자 합니다",
    "안내해 드리겠습니다",
    "당부를 드리고 싶습니다",
    "협조를 부탁드립니다",
    "감사의 말씀을 전합니다"
  ],
  transition_phrases: [
    "또한",
    "더불어",
    "아울러",
    "특히",
    "무엇보다",
    "한편",
    "이와 함께"
  ],
  polite_endings: [
    "~하시기 바랍니다",
    "~해 주시면 감사하겠습니다",
    "~부탁드립니다",
    "~기원합니다",
    "~응원합니다"
  ]
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
  
  const seasonalGreetings = SEASONAL_GREETINGS[seasonKey].greetings;
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
    content: module.content.map(item => `• ${item}`).join('\n')
  };
}

/**
 * 연구 기반 고도화된 프롬프트 생성 함수
 * 『AI 기반 학교-가정 소통 프레임워크』 연구의 모든 지침 통합 적용
 */
function generateAdvancedProfessionalPrompt(category, data, schoolLevel = 'elementary') {
  console.log('🔍 generateAdvancedProfessionalPrompt 호출됨:', { category, schoolLevel });
  console.log('🔍 사용 가능한 카테고리 키:', Object.keys(PROFESSIONAL_CATEGORY_PROMPTS));
  
  const categoryInfo = PROFESSIONAL_CATEGORY_PROMPTS[category];
  if (!categoryInfo) {
    console.error('❌ 카테고리를 찾을 수 없음:', { 
      received: category, 
      available: Object.keys(PROFESSIONAL_CATEGORY_PROMPTS),
      type: typeof category 
    });
    throw new Error(`지원하지 않는 카테고리입니다: ${category}`);
  }
  
  console.log('✅ 카테고리 정보 찾음:', categoryInfo.name);

  // 1. 자동 계절 인사말 생성
  const seasonalGreeting = generateSeasonalGreeting();
  
  // 2. 현재 날짜 정보
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
  const documentNumber = `제 ${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}호`;

  // 3. 연구 기반 구조적 프레임워크 적용
  let enhancedPrompt = `
당신은 『AI 기반 학교-가정 소통: 대한민국 가정통신문 생성을 위한 프레임워크』 연구의 모든 지침을 완벽하게 준수하는 전문적인 가정통신문을 작성해주세요.

**반드시 다음 표준 구조를 준수하여 작성하세요:**

## 📋 가정통신문 표준 구조 (연구 문서 제1장 기반)

### 1. 머리말 (Header)
- 문서 번호: ${documentNumber}
- [학교명] (교사가 직접 입력)
- ${PRIVACY_PROTECTION_TEMPLATES.warning_placeholder}

### 2. 수신자 (Salutation) 
**학부모님께**

### 3. 첫인사 (Opening Greeting) - 자동 생성된 계절 인사
${seasonalGreeting}

### 4. 제목 (Title)
**${categoryInfo.name}**

### 5. 본문 (Body) - 카테고리별 전문 내용
${categoryInfo.template}

### 6. 맺음말 (Closing)
항상 따뜻한 관심과 협조를 보내주시는 학부모님께 깊은 감사를 드리며, 앞으로도 우리 아이들이 건강하고 행복하게 성장할 수 있도록 함께 노력해주시기를 부탁드립니다.

### 7. 꼬리말 (Footer)
${formattedDate}
[학교명]장 (직인생략)

---

**추가 지침:**`;
  
  // 4. 기본 데이터 치환
  Object.keys(data).forEach(key => {
    const value = data[key] || '(정보 없음)';
    enhancedPrompt = enhancedPrompt.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  // 5. 학교급별 표현 가이드 추가 (연구 문서 기반)
  const levelExpressions = SCHOOL_LEVEL_EXPRESSIONS[schoolLevel];
  if (levelExpressions) {
    enhancedPrompt += `
**학교급별 맞춤 표현 (${schoolLevel}):**
- **인사말 스타일:** ${levelExpressions.greeting.join(' / ')}
- **학생 언급 방식:** ${levelExpressions.student_reference.join(' / ')}  
- **격려 표현:** ${levelExpressions.encouragement.join(' / ')}
- **마무리 인사:** ${levelExpressions.closing.join(' / ')}`;
  }

  // 6. 전문 문체 스타일 가이드 (연구 문서 기반)
  enhancedPrompt += `
**전문 문체 가이드 (연구 문서 제2장 기반):**
- **격식 있는 표현:** ${PROFESSIONAL_STYLE_GUIDE.formal_expressions.join(', ')}
- **자연스러운 연결어:** ${PROFESSIONAL_STYLE_GUIDE.transition_phrases.join(', ')}
- **정중한 마무리:** ${PROFESSIONAL_STYLE_GUIDE.polite_endings.join(', ')}`;

  // 7. 안전성 및 품질 체크리스트 (연구 문서 제5장 기반)
  enhancedPrompt += `
**연구 기반 품질 체크리스트:**
1. **구조적 진정성:** 머리말→수신자→첫인사→제목→본문→맺음말→꼬리말 순서 준수
2. **문화적 관례:** 계절 인사, 감사 표현, 경어체 완벽 적용
3. **개인정보 보호:** 실제 개인정보 대신 플레이스홀더 사용
4. **교육적 전문성:** 아이에 대한 애정과 교육적 관점 반영
5. **소통의 진정성:** 학부모가 읽었을 때 감동과 신뢰를 느낄 수 있도록
6. **실용적 가치:** 구체적이고 실행 가능한 내용 포함
7. **문체 일관성:** 처음부터 끝까지 품격 있고 일관된 어조 유지
8. **Human-in-the-Loop:** 교사의 최종 검토와 수정을 위한 명확한 구조

**절대 준수사항:**
- 개인정보보호법 완전 준수 (실제 이름, 연락처 등 개인정보 절대 포함 금지)
- 중괄호 형태의 변수명({eventName} 등) 출력 금지 - 자연스러운 문장으로 작성
- 교사의 따뜻함과 전문성이 동시에 드러나도록 작성
- 학교와 가정의 교육적 파트너십 강조`;

  return enhancedPrompt;
}

/**
 * 기존 호환성을 위한 래퍼 함수
 */
function generateProfessionalPrompt(category, data, schoolLevel = 'elementary') {
  return generateAdvancedProfessionalPrompt(category, data, schoolLevel);
}

/**
 * 전문적인 통신문 생성 메인 함수
 */
export async function generateProfessionalNotice(requestData, apiKeyOverride = undefined) {
  console.log('🚀 generateProfessionalNotice 호출됨');
  console.log('📥 받은 requestData =', JSON.stringify(requestData, null, 2));
  console.log('🔍 requestData.category =', requestData.category);
  console.log('📋 사용 가능한 카테고리 키들 =', Object.keys(PROFESSIONAL_CATEGORY_PROMPTS));
  
  try {
    const { 
      category, 
      schoolLevel = 'elementary',
      ...restData 
    } = requestData;
    
    console.log('🔍 추출된 카테고리:', category);
    console.log('🎓 학교급:', schoolLevel);
    console.log('📝 기타 데이터:', restData);
    
    // 날짜 및 배열 데이터 전처리
    const processedData = { ...restData };
    Object.keys(processedData).forEach(key => {
      const value = processedData[key];
      if (value instanceof Date) {
        processedData[key] = formatKoreanDate(value);
        console.log(`📅 ${key} 날짜 변환: ${value} → ${processedData[key]}`);
      } else if (Array.isArray(value)) {
        processedData[key] = formatArrayValue(value);
        console.log(`🏷️ ${key} 배열 변환: ${JSON.stringify(value)} → ${processedData[key]}`);
      }
    });
    
    // 입력 데이터 검증
    if (!category) {
      console.error('❌ 카테고리가 누락됨');
      throw new Error('카테고리 정보가 필요합니다.');
    }
    
    // 카테고리 유효성 검사
    if (!PROFESSIONAL_CATEGORY_PROMPTS[category]) {
      console.error('❌ 유효하지 않은 카테고리:', {
        received: category,
        type: typeof category,
        available: Object.keys(PROFESSIONAL_CATEGORY_PROMPTS)
      });
      throw new Error(`지원하지 않는 카테고리입니다: ${category}. 사용 가능한 카테고리: ${Object.keys(PROFESSIONAL_CATEGORY_PROMPTS).join(', ')}`);
    }

    // API 키 검증
    const apiKey = apiKeyOverride || import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('Gemini API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.');
    }

    console.log('🎯 전문 프롬프트 생성 시작');
    // 전문 프롬프트 생성 (처리된 데이터 사용)
    const prompt = generateProfessionalPrompt(category, processedData, schoolLevel);
    console.log('✅ 프롬프트 생성 완료');

    console.log('🤖 AI 통신문 생성 시작');
    // AI를 통한 전문 통신문 생성
    const generatedContent = await translateWithGemini(prompt, 'ko', apiKey);
    
    if (!generatedContent || generatedContent.trim().length === 0) {
      console.error('❌ AI가 빈 내용을 반환함');
      throw new Error('AI가 통신문을 생성하지 못했습니다.');
    }
    console.log('✅ AI 통신문 생성 완료, 길이:', generatedContent.length);

    console.log('🎨 HTML 변환 시작');
    // 고품질 HTML 변환
    const htmlContent = convertToProfessionalHTML(generatedContent);
    console.log('✅ HTML 변환 완료');

    const result = {
      success: true,
      data: {
        introText: PROFESSIONAL_CATEGORY_PROMPTS[category].name,
        content: htmlContent,
        category: PROFESSIONAL_CATEGORY_PROMPTS[category].name,
        description: PROFESSIONAL_CATEGORY_PROMPTS[category].description,
        schoolLevel: schoolLevel,
        generatedAt: new Date().toISOString()
      }
    };
    
    console.log('🎉 전문 통신문 생성 성공!');
    console.log('📄 결과 데이터:', {
      introText: result.data.introText,
      contentLength: result.data.content.length,
      category: result.data.category
    });
    
    return result;
  } catch (error) {
    console.error('전문 통신문 생성 중 오류:', error);
    
    // 더 친화적인 에러 메시지 제공
    let userMessage = '전문 통신문 생성 중 오류가 발생했습니다.';
    
    if (error.message?.includes('API key') || error.message?.includes('Invalid API key')) {
      userMessage = 'Gemini API 키가 유효하지 않거나 설정되지 않았습니다. 설정에서 올바른 API 키를 확인해주세요.';
    } else if (error.message?.includes('quota') || error.message?.includes('429')) {
      userMessage = 'API 사용 한도를 초과했습니다. 잠시 후 다시 시도해주거나 다른 시간에 이용해주세요.';
    } else if (error.message?.includes('network') || error.message?.includes('connection') || error.message?.includes('fetch')) {
      userMessage = '네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.';
    } else if (error.message?.includes('rate limit')) {
      userMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    } else if (error.message?.includes('timeout')) {
      userMessage = '응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
    } else {
      userMessage = error.message || '전문 통신문 생성 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
    
    return {
      success: false,
      error: userMessage
    };
  }
}

/**
 * 전문적인 HTML 변환 함수
 * 편지글과 구조화된 형식을 융합한 통신문 형태로 변환
 */
function convertToProfessionalHTML(text) {
  if (!text) return '';
  
  // HTML 컨테이너로 시작
  let html = '<div class="professional-notice-content">';
  
  // 텍스트를 줄 단위로 분할하여 처리
  const lines = text.split('\n').filter(line => line.trim() !== '');
  let currentSection = [];
  let inBulletList = false;
  let isFirstSection = true;
  let isLastSection = false;
  
  // 섹션 구분을 위한 분석
  const sectionIndices = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\d+\.\s*\*\*.*?\*\*/) || line.match(/^\*\*[^*]+\*\*\s*$/)) {
      sectionIndices.push(i);
    }
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // 1. 제목 감지 (숫자. **제목** 형식 또는 **제목** 형식)
    if (line.match(/^\d+\.\s*\*\*.*?\*\*/) || line.match(/^\*\*[^*]+\*\*\s*$/)) {
      // 이전 섹션 완료
      if (currentSection.length > 0) {
        if (isFirstSection) {
          // 첫 번째 섹션은 친근한 인사말 스타일
          html += '<div class="notice-greeting-section">';
          html += processGreetingSection(currentSection);
          html += '</div>';
          isFirstSection = false;
        } else if (i === sectionIndices[sectionIndices.length - 1]) {
          // 마지막 섹션은 간단한 마무리 인사 스타일
          html += '<div class="notice-closing-section">';
          html += processClosingSection(currentSection);
          html += '</div>';
        } else {
          // 중간 섹션들은 구조화된 정보 블록 스타일
          html += '<div class="notice-info-block">';
          html += processInfoBlock(currentSection);
          html += '</div>';
        }
        currentSection = [];
      }
      
      // 제목 처리
      const titleText = line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim();
      
      // 현재 섹션이 마지막인지 확인
      isLastSection = (i === sectionIndices[sectionIndices.length - 1]);
      
      if (isFirstSection) {
        // 첫 번째 섹션 제목은 부드럽게
        html += `<div class="notice-greeting-title">${titleText}</div>`;
      } else if (isLastSection) {
        // 마지막 섹션 제목은 간단하게
        html += `<div class="notice-closing-title">${titleText}</div>`;
      } else {
        // 중간 섹션들은 명확한 제목
        html += `<h3 class="notice-section-title"><span class="title-icon">📋</span> ${titleText}</h3>`;
      }
      
      inBulletList = false;
      continue;
    }
    
    // 2. 중요 정보 라벨 감지 (**라벨:** 형식)
    if (line.match(/^\*\*[^*:]+:\*\*/)) {
      // 이전 불릿 리스트 종료
      if (inBulletList) {
        html += '</ul>';
        inBulletList = false;
      }
      
      const labelMatch = line.match(/^\*\*([^*:]+):\*\*\s*(.*)$/);
      if (labelMatch) {
        const label = labelMatch[1].trim();
        const content = labelMatch[2].trim();
        html += `<div class="notice-info-item">`;
        html += `<span class="notice-label">${label}:</span> `;
        html += `<span class="notice-value">${content}</span>`;
        html += `</div>`;
        continue;
      }
    }
    
    // 3. 불릿 포인트 감지 (-, •, ▶ 형식)
    if (line.match(/^[-•▶]\s/)) {
      if (!inBulletList) {
        html += '<ul class="notice-bullet-list">';
        inBulletList = true;
      }
      const bulletContent = line.replace(/^[-•▶]\s/, '').trim();
      html += `<li class="notice-bullet-item">${formatInlineText(bulletContent)}</li>`;
      continue;
    }
    
    // 4. 번호 목록 감지 (1. 2. 3. 형식)
    if (line.match(/^\d+\.\s/)) {
      if (inBulletList) {
        html += '</ul>';
        inBulletList = false;
      }
      
      const numberMatch = line.match(/^(\d+)\.\s(.*)$/);
      if (numberMatch) {
        const number = numberMatch[1];
        const content = numberMatch[2];
        html += `<div class="notice-numbered-item">`;
        html += `<span class="notice-number">${number}.</span> `;
        html += `<span class="notice-content">${formatInlineText(content)}</span>`;
        html += `</div>`;
      }
      continue;
    }
    
    // 5. 일반 텍스트
    if (inBulletList && !line.match(/^[-•▶]\s/)) {
      html += '</ul>';
      inBulletList = false;
    }
    
    // 일반 단락으로 처리
    html += `<p class="notice-paragraph">${formatInlineText(line)}</p>`;
  }
  
  // 미완료된 불릿 리스트 종료
  if (inBulletList) {
    html += '</ul>';
  }
  
  html += '</div>';
  
  // CSS 스타일 추가
  html += `
<style>
.professional-notice-content {
  font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.notice-section-title {
  color: #1a5490;
  font-size: 18px;
  font-weight: bold;
  margin: 25px 0 15px 0;
  padding-bottom: 5px;
  border-bottom: 2px solid #e8f4fd;
  background: linear-gradient(90deg, #f8fcff 0%, transparent 100%);
  padding: 10px 15px;
  border-left: 4px solid #1a5490;
}

.notice-info-item {
  margin: 8px 0;
  padding: 8px 12px;
  background: #f9f9f9;
  border-radius: 5px;
  border-left: 3px solid #007bff;
}

.notice-label {
  font-weight: bold;
  color: #1a5490;
  margin-right: 8px;
}

.notice-value {
  color: #333;
}

.notice-bullet-list {
  margin: 12px 0;
  padding-left: 0;
  list-style: none;
}

.notice-bullet-item {
  margin: 6px 0;
  padding-left: 20px;
  position: relative;
}

.notice-bullet-item::before {
  content: '•';
  color: #007bff;
  font-size: 16px;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}

.notice-numbered-item {
  margin: 10px 0;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 5px;
  border-left: 3px solid #28a745;
}

.notice-number {
  font-weight: bold;
  color: #28a745;
  margin-right: 8px;
}

.notice-content {
  color: #333;
}

.notice-paragraph {
  margin: 10px 0;
  text-align: justify;
  line-height: 1.8;
}

.notice-emphasis {
  color: #1a5490;
  font-weight: bold;
}

.notice-important {
  color: #dc3545;
  font-weight: bold;
}
</style>`;
  
  return html;
}

/**
 * 인라인 텍스트 서식 처리
 */
function formatInlineText(text) {
  if (!text) return '';
  
  // 강조 표시 (**텍스트**)
  text = text.replace(/\*\*([^*]+)\*\*/g, '<span class="notice-emphasis">$1</span>');
  
  // 중요 표시 (!텍스트!)
  text = text.replace(/!([^!]+)!/g, '<span class="notice-important">$1</span>');
  
  return text;
}

/**
 * 섹션 처리 (사용하지 않지만 호환성을 위해 유지)
 */
function processSection(section) {
  return section.map(line => `<p class="notice-paragraph">${formatInlineText(line)}</p>`).join('');
}

/**
 * 인사말 섹션 처리 (편지 스타일)
 */
function processGreetingSection(section) {
  if (!section || section.length === 0) return '';
  
  return section.map(line => {
    const formattedLine = formatInlineText(line);
    return `<p class="greeting-paragraph">${formattedLine}</p>`;
  }).join('');
}

/**
 * 마무리 인사 섹션 처리 (간단한 편지 스타일)
 */
function processClosingSection(section) {
  if (!section || section.length === 0) return '';
  
  return section.map(line => {
    const formattedLine = formatInlineText(line);
    return `<p class="closing-paragraph">${formattedLine}</p>`;
  }).join('');
}

/**
 * 정보 블록 섹션 처리 (구조화된 스타일)
 */
function processInfoBlock(section) {
  if (!section || section.length === 0) return '';
  
  let html = '<div class="info-content">';
  let inList = false;
  
  for (const line of section) {
    const trimmedLine = line.trim();
    
    // 불릿 포인트 감지
    if (trimmedLine.match(/^[-•*]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
      if (!inList) {
        html += '<ul class="info-list">';
        inList = true;
      }
      const content = trimmedLine.replace(/^[-•*]\s+/, '').replace(/^\d+\.\s+/, '');
      html += `<li class="info-item"><span class="bullet-icon">▶</span> ${formatInlineText(content)}</li>`;
    } else if (trimmedLine.match(/^\*\*[^*:]+:\*\*/)) {
      // 라벨:값 형식
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      const labelMatch = trimmedLine.match(/^\*\*([^*:]+):\*\*\s*(.*)$/);
      if (labelMatch) {
        const label = labelMatch[1].trim();
        const value = labelMatch[2].trim();
        html += `<div class="info-row">`;
        html += `<span class="info-label">${label}:</span>`;
        html += `<span class="info-value">${formatInlineText(value)}</span>`;
        html += `</div>`;
      }
    } else {
      // 일반 텍스트
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      if (trimmedLine) {
        html += `<p class="info-paragraph">${formatInlineText(trimmedLine)}</p>`;
      }
    }
  }
  
  if (inList) {
    html += '</ul>';
  }
  
  html += '</div>';
  return html;
}

/**
 * 전문 카테고리 목록 반환
 */
export function getProfessionalCategories() {
  return Object.keys(PROFESSIONAL_CATEGORY_PROMPTS).map(key => ({
    id: key,
    name: PROFESSIONAL_CATEGORY_PROMPTS[key].name,
    description: PROFESSIONAL_CATEGORY_PROMPTS[key].description
  }));
}

/**
 * 카테고리별 필수 입력 필드 반환
 */
export function getCategoryRequiredFields(categoryId) {
  const fieldMapping = {
    individual_feedback: ['studentName', 'grade', 'classNumber', 'evaluationPeriod', 'learningAttitude', 'personalityTraits'],
    semester_summary: ['grade', 'classNumber', 'semester', 'majorActivities', 'classCharacteristics'],
    event_announcement: ['eventName', 'eventDate', 'eventLocation', 'eventPurpose'],
    parent_participation: ['participationTopic', 'participationPurpose', 'participationMethod', 'participationPeriod', 'requiredItems', 'contactInfo'],
    home_education_guide: ['educationTopic', 'educationGoals', 'targetAge', 'homeActivities'],
    life_guidance: ['guidanceTopic', 'currentSituation', 'guidanceGoals', 'specificMethods'],
    safety_education: ['safetyTopic', 'educationBackground', 'educationContent', 'preventionRules']
  };
  
  return fieldMapping[categoryId] || [];
}

/**
 * 학교급별 맞춤 문구 반환
 */
export function getSchoolLevelExpressions(schoolLevel) {
  return SCHOOL_LEVEL_EXPRESSIONS[schoolLevel] || SCHOOL_LEVEL_EXPRESSIONS.elementary;
}