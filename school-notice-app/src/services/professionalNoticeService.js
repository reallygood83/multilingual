import { translateWithGemini } from './geminiService';

/**
 * 전문적인 AI 통신문 마법사 서비스
 * 연구조사를 바탕으로 한 교사 전문성 반영 통신문 생성
 */

// 학교급별 맞춤형 카테고리 및 전문 프롬프트 템플릿
const PROFESSIONAL_CATEGORY_PROMPTS = {
  // 성적 통지 및 개별 피드백
  individual_feedback: {
    name: '개별 학생 성적통지표 가정통신문',
    description: '개별 학생의 성장과 발달을 담은 맞춤형 통신문',
    template: `당신은 20년 경력의 전문 교사입니다. 다음 정보를 바탕으로 개별 학생을 위한 따뜻하고 전문적인 가정통신문을 작성해주세요.

학생 정보:
- 학생명: {studentName}
- 학급: {grade}학년 {classNumber}반
- 평가 기간: {evaluationPeriod}

학생 특성 및 성장 내용:
- 학습 태도: {learningAttitude}
- 성격 및 특성: {personalityTraits}
- 학업 성취: {academicAchievement}
- 교우 관계: {peerRelationship}
- 특별 활동: {specialActivities}
- 개선이 필요한 부분: {improvementAreas}

다음 구조로 작성하되, 편지 스타일과 구조화된 정보 블록이 융합된 형식으로 작성해주세요:

1. **정중한 인사**
안녕하십니까? {grade}학년 {classNumber}반 담임 교사입니다. 계절감이나 시기적 상황을 자연스럽게 언급하며 학부모님께 감사 인사를 전해주세요.

2. **📚 학습 현황 및 성장 스토리**
- **학습 태도:** {learningAttitude}에 대한 구체적인 관찰 내용
- **성격 및 특성:** {personalityTraits}를 바탕으로 한 긍정적 서술
- **교우 관계:** {peerRelationship} 상황과 발전 모습
- **특별한 성장:** 구체적인 에피소드나 변화 사례

3. **📈 학업 성취 및 발전 방향**
- **현재 성취:** {academicAchievement}에 대한 인정과 격려
- **노력한 부분:** 구체적으로 칭찬할 만한 점들
- **발전 가능성:** 앞으로의 성장 전망 제시

4. **🏠 가정과의 협력 요청**
- 구체적이고 실행 가능한 협력 방안 제시
- {improvementAreas}를 고려한 맞춤형 조언
- 격려 위주의 긍정적 표현으로 제안

5. **따뜻한 마무리**
학생에 대한 애정과 믿음을 표현하며 가정의 건강과 행복을 기원하는 인사로 마무리해주세요.

**작성 원칙:**
- 편지 스타일의 자연스러운 문체와 구조화된 정보 블록을 조화롭게 융합
- 학생의 이름을 자연스럽게 3-4회 언급
- 구체적인 행동이나 상황을 예시로 제시
- '~습니다', '~입니다' 존대법 일관 사용
- 부정적 표현보다는 발전 가능성으로 전환하여 표현
- 교사로서의 따뜻한 마음과 전문적 관찰력이 드러나도록 작성

전체 분량: 15-20줄 내외로 작성해주세요.`
  },

  // 학기말 종합 통신문
  semester_summary: {
    name: '학기말 종합 가정통신문',
    description: '한 학기를 마무리하는 종합적인 학급 통신문',
    template: `당신은 경험 많은 교사로서 한 학기를 마무리하며 학급 전체 학부모님께 보내는 따뜻한 통신문을 작성해주세요.

학급 정보:
- 학급: {grade}학년 {classNumber}반
- 학기: {semester}
- 주요 활동: {majorActivities}
- 학급 특성: {classCharacteristics}
- 성과 및 성장: {achievements}
- 감사 인사 대상: {gratitudeTargets}

다음 구조로 작성해주세요:

1. **정중한 인사말**
안녕하십니까? 한 학기를 마무리하며 학부모님께 감사의 인사를 드립니다. 계절의 변화와 함께 아이들의 성장을 지켜보며 보람을 느끼고 있습니다.

2. **🎓 한 학기 교육활동 성과**
- **주요 교육활동:** {majorActivities}를 통한 다양한 학습 경험
- **학급 분위기:** {classCharacteristics}한 우리 학급의 특별한 모습
- **학생 성장:** {achievements}에서 보여준 아이들의 눈부신 발전
- **특별한 순간들:** 기억에 남는 감동적인 에피소드들

3. **🏖️ 방학 중 권장사항**
- 건강한 방학 생활을 위한 규칙적인 생활 습관 유지
- 독서와 체험활동을 통한 학습 연속성 확보
- 가족과 함께하는 의미 있는 시간 보내기
- 안전 수칙 준수 및 건강 관리

4. **📅 새 학기 준비사항**
- 새 학기 시작 전 마음가짐 다지기
- 필요한 학용품 및 준비물 점검
- 새로운 목표 설정과 계획 세우기

5. **따뜻한 마무리**
한 학기 동안 {gratitudeTargets}에 깊은 감사를 드립니다. 방학 중 가족 모두의 건강과 행복을 기원하며, 새 학기에도 변함없는 관심과 협력을 부탁드립니다.

**작성 원칙:**
- 감정이 풍부하면서도 품격 있는 문체
- 구체적인 에피소드로 생생함 더하기
- 교사로서의 보람과 감동이 자연스럽게 드러나도록
- 학부모와 학생 모두를 아우르는 따뜻한 시선
- 격식을 갖추면서도 친근한 어조

전체 분량: 25-30줄 내외로 작성해주세요.`
  },

  // 행사 안내 통신문
  event_announcement: {
    name: '학교 행사 안내 통신문',
    description: '학교 행사에 대한 전문적이고 상세한 안내',
    template: `학교 행사 안내 통신문을 작성해주세요.

다음 구조로 작성해주세요:

**첫 번째 섹션 (인사말):**
- 학부모님께 드리는 정중한 인사말
- 행사 안내 통신문 전달 목적 설명

**두 번째 섹션 (행사 개요):**
제목: 🎉 행사 안내
- **행사명:** {eventName}
- **목적:** {eventPurpose}
- **의미:** 이 행사가 갖는 교육적 가치와 중요성

**세 번째 섹션 (상세 정보):**
제목: 📋 행사 상세 정보
- **일시:** {eventDate} {eventTime}
- **장소:** {eventLocation}
- **대상:** {eventTarget}
- **프로그램:** {eventProgram}

**네 번째 섹션 (준비사항):**
제목: 🎒 준비물 및 주의사항
- 개인 준비물 목록
- 복장 및 복장 규정
- 안전 수칙 및 주의사항
- 참여 방법 및 절차

**다섯 번째 섹션 (문의 및 협조):**
제목: 📞 문의처 및 협조 요청
- **문의처:** {contactInfo}
- **협조 요청사항:** 학부모님께 당부드리는 사항

**여섯 번째 섹션 (마무리 인사):**
- 행사 성공을 위한 협조 요청
- 감사 인사 및 기대감 표현

각 섹션은 명확히 구분되도록 작성해주세요.`
  },

  // 가정 연계 교육 안내
  home_education_guide: {
    name: '가정 연계 교육 안내문',
    description: '가정에서의 교육 협력을 위한 전문적 가이드',
    template: `가정교육 안내 통신문을 작성해주세요.

다음 구조로 작성해주세요:

**첫 번째 섹션 (인사말):**
- 학부모님께 드리는 정중한 인사말
- 가정교육 안내 통신문 전달 목적 설명

**두 번째 섹션 (가정교육의 중요성):**
제목: 🏠 가정교육의 의미와 가치
- **교육적 의미:** {educationTopic}
- **발달 단계:** 현재 연령대의 특성과 중요성
- **가정의 역할:** 학교 교육과의 연계 효과

**세 번째 섹션 (실천 방법):**
제목: 💡 구체적인 교육 방법
- **일상 속 교육:** {homeActivities}
- **대화 방법:** 효과적인 소통 기술
- **습관 형성:** {educationGoals} 관련 조언
- **학습 지원:** 가정에서의 학습 도움 방법

**네 번째 섹션 (추천 활동):**
제목: 📚 추천 도서 및 활동
- 연령에 맞는 추천 도서 목록
- 가족이 함께할 수 있는 교육 활동
- 체험학습 및 견학 장소 추천

**다섯 번째 섹션 (학교 연계):**
제목: 🤝 학교와 가정의 협력
- **정보 공유:** 학교 생활 모습 공유 방법
- **상담 안내:** 필요시 상담 신청 방법
- **협력 방안:** 효과적인 연계 교육 방법

**여섯 번째 섹션 (마무리 인사):**
- 가정교육에 대한 격려와 응원
- 지속적인 관심과 실천을 당부하는 인사

각 섹션은 명확히 구분되도록 작성해주세요.`
  },

  // 생활 지도 안내
  life_guidance: {
    name: '생활지도 협력 안내문',
    description: '학생 생활지도를 위한 가정-학교 협력 안내',
    template: `생활지도 통신문을 작성해주세요.

다음 구조로 작성해주세요:

**첫 번째 섹션 (인사말):**
- 학부모님께 드리는 정중한 인사말
- 생활지도 통신문 전달 목적 설명

**두 번째 섹션 (생활지도의 중요성):**
제목: 🌱 생활지도의 의미와 목적
- **교육적 가치:** {guidancePurpose}
- **성장 단계:** 현재 시기의 생활지도 중요성
- **인성 발달:** 바른 인성 형성과의 연관성

**세 번째 섹션 (지도 방법):**
제목: 🎯 구체적인 지도 전략
- **생활습관:** {lifeHabits} 형성을 위한 방법
- **규칙 준수:** {rules} 관련 지도 방안
- **인간관계:** 올바른 교우관계 형성 지도
- **자기관리:** 스스로 관리하는 능력 기르기

**네 번째 섹션 (문제 상황 대처):**
제목: 🔧 어려움 극복 방법
- 일반적인 문제 상황과 대처법
- 긍정적 훈육 방법
- 아이의 감정 이해와 소통 방법

**다섯 번째 섹션 (가정 연계):**
제목: 🤝 가정과 학교의 협력
- **일관성:** 학교와 가정의 일관된 지도
- **정보 공유:** 생활 모습 공유의 중요성
- **상담 지원:** 필요시 전문 상담 안내

**여섯 번째 섹션 (마무리 인사):**
- 건설적인 생활지도를 위한 협력 요청
- 아이들의 건강한 성장을 위한 다짐

각 섹션은 명확히 구분되도록 작성해주세요.`
  },

  // 안전 교육 통신문
  safety_education: {
    name: '안전 교육 안내문',
    description: '학생 안전을 위한 전문적이고 체계적인 안내',
    template: `안전교육 통신문을 작성해주세요.

다음 구조로 작성해주세요:

**첫 번째 섹션 (인사말):**
- 학부모님께 드리는 정중한 인사말
- 안전교육 통신문 전달 목적 설명

**두 번째 섹션 (안전교육의 중요성):**
제목: 🛡️ 안전교육의 필요성
- **교육적 의미:** {safetyPurpose}
- **현실적 필요성:** 현재 안전 환경과 위험 요소
- **예방의 중요성:** 사고 예방을 통한 안전한 생활

**세 번째 섹션 (안전 수칙):**
제목: ⚠️ 주요 안전 수칙
- **교통안전:** {trafficSafety} 관련 수칙
- **생활안전:** {lifeSafety} 주의사항
- **사이버안전:** 인터넷 및 스마트폰 사용 안전
- **재난안전:** 화재, 지진 등 재난 대비 방법

**네 번째 섹션 (위험 상황 대처):**
제목: 🚨 응급상황 대응법
- 위험 상황 인지 방법
- 즉시 대처해야 할 행동 요령
- 도움 요청 방법 (신고 전화번호 등)
- 응급처치 기본 상식

**다섯 번째 섹션 (가정 안전 점검):**
제목: 🏠 가정에서의 안전 관리
- **안전 점검:** 정기적으로 확인해야 할 사항들
- **안전 용품:** 비상시 필요한 물품 준비
- **가족 안전 수칙:** 가족 모두가 지켜야 할 규칙

**여섯 번째 섹션 (마무리 인사):**
- 안전 실천의 중요성 강조
- 가족 모두의 안전을 위한 지속적인 관심 당부

각 섹션은 명확히 구분되도록 작성해주세요.`
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
 * 전문적인 프롬프트 생성 함수
 */
function generateProfessionalPrompt(category, data, schoolLevel = 'elementary') {
  console.log('🔍 generateProfessionalPrompt 호출됨:', { category, schoolLevel });
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

  let prompt = categoryInfo.template;
  
  // 기본 데이터 치환
  Object.keys(data).forEach(key => {
    const value = data[key] || '(정보 없음)';
    prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  // 학교급별 표현 가이드 추가
  const levelExpressions = SCHOOL_LEVEL_EXPRESSIONS[schoolLevel];
  if (levelExpressions) {
    prompt += `\n\n**학교급별 표현 가이드 (${schoolLevel}):**
**인사말 예시:** ${levelExpressions.greeting.join(' / ')}
**학생 언급 방식:** ${levelExpressions.student_reference.join(' / ')}
**격려 표현:** ${levelExpressions.encouragement.join(' / ')}
**마무리 인사:** ${levelExpressions.closing.join(' / ')}`;
  }

  // 전문 문체 가이드 추가
  prompt += `\n\n**전문 문체 가이드:**
**격식 있는 표현:** ${PROFESSIONAL_STYLE_GUIDE.formal_expressions.join(', ')}
**자연스러운 연결어:** ${PROFESSIONAL_STYLE_GUIDE.transition_phrases.join(', ')}
**정중한 마무리:** ${PROFESSIONAL_STYLE_GUIDE.polite_endings.join(', ')}

**최종 점검사항:**
1. 교사의 따뜻함과 전문성이 동시에 드러나는가?
2. 학부모가 읽었을 때 감동과 신뢰를 느낄 수 있는가?
3. 구체적이고 실용적인 내용이 포함되어 있는가?
4. 아이에 대한 애정과 교육적 관점이 잘 담겨있는가?
5. 문체가 일관되고 품격 있는가?`;

  return prompt;
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
    // 전문 프롬프트 생성
    const prompt = generateProfessionalPrompt(category, restData, schoolLevel);
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